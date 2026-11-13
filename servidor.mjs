// Crasto Mentores · by crasto.ai
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// Pacote local: abre a mesa em http://127.0.0.1:4790 e deixa os mentores responderem com a IA
// que já está instalada no seu computador (Claude Code, Codex ou Gemini CLI). Sem dependências: só Node 18+.
// Segurança: escuta só 127.0.0.1, aceita pedidos só desta própria tela, não usa senha nem chave,
// e o texto vai para a IA pela entrada padrão (nunca vira comando).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const PORTA = Number(process.env.PORTA || 4790);
const HOSTS = new Set([`127.0.0.1:${PORTA}`, `localhost:${PORTA}`]);
const ORIGENS = new Set([...HOSTS].map((h) => `http://${h}`));
const WIN = process.platform === "win32";
const LIMITE_CORPO = 400 * 1024;
const TEMPO_MAX = 240000;
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".md": "text/markdown; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".txt": "text/plain; charset=utf-8" };

// Programas aceitos e como cada um recebe o pedido pela entrada padrão. Sem ferramentas: a IA só lê e responde texto (não roda comando nem mexe em arquivo).
const CLIS = {
  claude: { bin: "claude", args: ["-p", "--output-format", "text", "--tools", WIN ? '""' : "", "--strict-mcp-config"] },
  codex: { bin: "codex", args: ["exec", "--skip-git-repo-check", "--sandbox", "read-only", "-"] },
  gemini: { bin: "gemini", args: ["-p", "Responda"] },
};
const existe = (bin) => spawnSync(WIN ? "where" : "which", [bin], { stdio: "ignore", shell: false }).status === 0;
const achados = Object.fromEntries(Object.entries(CLIS).map(([k, c]) => [k, existe(c.bin)]));
let ocupados = 0;

function cabecalhos(extra = {}) {
  return { "x-content-type-options": "nosniff", "referrer-policy": "no-referrer", "cache-control": "no-store", ...extra };
}
function json(res, cod, obj) { res.writeHead(cod, cabecalhos({ "content-type": "application/json; charset=utf-8" })); res.end(JSON.stringify(obj)); }

function rodarIA(cli, texto) {
  return new Promise((ok, falha) => {
    const c = CLIS[cli];
    const pasta = fs.mkdtempSync(path.join(os.tmpdir(), "crasto-mentores-"));   // pasta vazia: a IA não enxerga seus arquivos
    // No Windows os programas instalados pelo npm são .cmd e precisam do shell; os argumentos são fixos (nada vem da tela).
    const p = spawn(c.bin, c.args, { cwd: pasta, shell: WIN, windowsHide: true, env: { ...process.env, NO_COLOR: "1" } });
    let saida = "", erro = "";
    const relogio = setTimeout(() => { p.kill(); falha(new Error("A IA demorou demais para responder.")); }, TEMPO_MAX);
    p.stdout.on("data", (d) => { saida += d; if (saida.length > 2e6) p.kill(); });
    p.stderr.on("data", (d) => { erro += d; if (erro.length > 2e5) erro = erro.slice(-2e5); });
    p.on("error", (e) => { clearTimeout(relogio); falha(new Error(`Não consegui abrir o ${cli}: ${e.message}`)); });
    p.on("close", (codigo) => {
      clearTimeout(relogio);
      fs.rm(pasta, { recursive: true, force: true }, () => {});
      if (codigo === 0 && saida.trim()) ok(saida.trim());
      else falha(new Error(`O ${cli} não respondeu (código ${codigo}). ${erro.trim().split("\n").slice(-3).join(" ")}`.trim()));
    });
    p.stdin.end(texto);
  });
}

async function lerCorpo(req) {
  let tam = 0; const partes = [];
  for await (const p of req) { tam += p.length; if (tam > LIMITE_CORPO) throw Object.assign(new Error("Pedido grande demais."), { cod: 413 }); partes.push(p); }
  return JSON.parse(Buffer.concat(partes).toString("utf8") || "{}");
}

const servidor = http.createServer(async (req, res) => {
  // Só esta máquina e só por este endereço (bloqueia sites de fora e truques de DNS)
  if (!HOSTS.has(String(req.headers.host || ""))) return json(res, 403, { erro: "Endereço não permitido." });
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/local/ping" && req.method === "GET") return json(res, 200, { ok: true, clis: achados });

  if (url.pathname === "/local/ia") {
    if (req.method !== "POST") return json(res, 405, { erro: "Use POST." });
    if (!ORIGENS.has(String(req.headers.origin || ""))) return json(res, 403, { erro: "Pedido de fora desta tela." });
    if (!String(req.headers["content-type"] || "").startsWith("application/json")) return json(res, 415, { erro: "Formato inválido." });
    if (ocupados >= 3) return json(res, 429, { erro: "Muitas respostas ao mesmo tempo. Tente de novo." });
    let b;
    try { b = await lerCorpo(req); } catch (e) { return json(res, e.cod || 400, { erro: e.cod ? e.message : "Pedido inválido." }); }
    const cli = String(b.cli || "claude");
    if (!Object.hasOwn(CLIS, cli)) return json(res, 400, { erro: "Programa desconhecido." });
    if (!achados[cli]) return json(res, 400, { erro: `O ${cli} não está instalado neste computador.` });
    const sistema = String(b.sistema || "").slice(0, 60000), pedido = String(b.pedido || "").slice(0, 60000);
    if (!pedido.trim()) return json(res, 400, { erro: "Pedido vazio." });
    ocupados++;
    try { return json(res, 200, { texto: await rodarIA(cli, `${sistema}\n\n---\n\n${pedido}`) }); }
    catch (e) { return json(res, 502, { erro: e.message }); }
    finally { ocupados--; }
  }

  if (req.method !== "GET" && req.method !== "HEAD") return json(res, 405, { erro: "Método não permitido." });
  let rel;
  try { rel = decodeURIComponent(url.pathname); } catch { return json(res, 400, { erro: "Endereço inválido." }); }
  if (rel.endsWith("/")) rel += "index.html";
  const alvo = path.normalize(path.join(RAIZ, rel));
  const dentro = alvo.startsWith(RAIZ + path.sep);
  const escondido = path.relative(RAIZ, alvo).split(path.sep).some((p) => p.startsWith("."));
  if (!dentro || escondido) return json(res, 404, { erro: "Não encontrado." });
  fs.stat(alvo, (e, st) => {
    if (e || !st.isFile()) return json(res, 404, { erro: "Não encontrado." });
    res.writeHead(200, cabecalhos({ "content-type": TIPOS[path.extname(alvo).toLowerCase()] || "application/octet-stream", "content-length": st.size }));
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(alvo).pipe(res);
  });
});

servidor.on("error", (e) => {
  if (e.code === "EADDRINUSE") console.log(`\nA porta ${PORTA} já está em uso. Talvez a mesa já esteja aberta: http://127.0.0.1:${PORTA}\n`);
  else console.log(`\nNão consegui ligar a mesa: ${e.message}\n`);
  process.exit(1);
});
servidor.listen(PORTA, "127.0.0.1", () => {
  const lista = Object.entries(achados).map(([k, v]) => `${k}: ${v ? "encontrado" : "não encontrado"}`).join(" · ");
  console.log(`\nCrasto Mentores · by crasto.ai\nMesa ligada em http://127.0.0.1:${PORTA}\nIAs no computador: ${lista}\nNo menu Configurações, escolha "Claude Code, Codex ou Gemini CLI".\nPara desligar, feche esta janela.\n`);
});
