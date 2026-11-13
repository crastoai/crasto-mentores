// Crasto Mentores · by crasto.ai
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// Motor da mesa: chama a IA que você conectar (menu Configurações) e monta o debate em 3 rodadas.
// A chave da IA fica só neste navegador (localStorage). Nada é enviado à Crasto.ai.
(function () {
  "use strict";
  const D = window.MESA_DADOS;
  const byKey = Object.fromEntries(D.mentores.map((m) => [m.key, m]));
  const CFG = "crastomentores.ia.v1", REFS = "crastomentores.refs.v1";

  const PROVEDORES = {
    gemini: { nome: "Google Gemini", nota: "tem cota grátis", tipo: "openai", base: "https://generativelanguage.googleapis.com/v1beta/openai", modelo: "gemini-2.5-flash", pegarChave: "https://aistudio.google.com/apikey" },
    openrouter: { nome: "OpenRouter", nota: "vários modelos, alguns grátis", tipo: "openai", base: "https://openrouter.ai/api/v1", modelo: "deepseek/deepseek-chat-v3.1", pegarChave: "https://openrouter.ai/keys" },
    deepseek: { nome: "DeepSeek", nota: "centavos por mesa", tipo: "openai", base: "https://api.deepseek.com", modelo: "deepseek-chat", pegarChave: "https://platform.deepseek.com/api_keys" },
    kimi: { nome: "Kimi (Moonshot)", nota: "centavos por mesa", tipo: "openai", base: "https://api.moonshot.ai/v1", modelo: "kimi-k2-0905-preview", pegarChave: "https://platform.moonshot.ai/console/api-keys" },
    openai: { nome: "OpenAI (ChatGPT)", nota: "chave paga", tipo: "openai", base: "https://api.openai.com/v1", modelo: "gpt-4.1-mini", pegarChave: "https://platform.openai.com/api-keys" },
    anthropic: { nome: "Claude (Anthropic)", nota: "chave paga", tipo: "anthropic", base: "https://api.anthropic.com/v1", modelo: "claude-haiku-5-5", pegarChave: "https://console.anthropic.com/settings/keys" },
    ollama: { nome: "Ollama", nota: "no seu computador, grátis", tipo: "openai", base: "http://localhost:11434/v1", modelo: "llama3.1", semChave: true },
    local: { nome: "Claude Code, Codex ou Gemini CLI", nota: "pelo pacote no seu computador", tipo: "local", modelo: "claude", semChave: true },
  };

  const ler = (k, padrao) => { try { const v = JSON.parse(localStorage.getItem(k) || "null"); return v ?? padrao; } catch { return padrao; } };
  const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
  const cfg = () => ler(CFG, { prov: "", chave: "", modelo: "", base: "", cli: "claude" });
  const ativo = () => { const c = cfg(), p = PROVEDORES[c.prov]; return Boolean(p && (p.semChave || c.chave)); };

  // ------------------------------------------------ chamada à IA (com fila, novas tentativas e prazo)
  let emUso = 0; const fila = [];
  const LIMITE = () => (cfg().prov === "local" ? 2 : 3);
  const vez = () => new Promise((ok) => { if (emUso < LIMITE()) { emUso++; ok(); } else fila.push(ok); });
  const libera = () => { const p = fila.shift(); if (p) p(); else emUso--; };
  const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

  async function chamarUmaVez(sistema, pedido, max, c, p) {
    const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 180000);
    try {
      let r, j;
      if (p.tipo === "local") {
        r = await fetch("/local/ia", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sistema, pedido, cli: c.cli || "claude" }), signal: ctrl.signal });
        j = await r.json().catch(() => ({}));
        if (!r.ok) throw Object.assign(new Error(j.erro || `O pacote local respondeu ${r.status}.`), { status: r.status });
        return String(j.texto || "");
      }
      if (p.tipo === "anthropic") {
        r = await fetch(`${c.base || p.base}/messages`, { method: "POST", signal: ctrl.signal, headers: { "content-type": "application/json", "x-api-key": c.chave, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
          body: JSON.stringify({ model: c.modelo || p.modelo, max_tokens: max, system: sistema, messages: [{ role: "user", content: pedido }] }) });
        j = await r.json().catch(() => ({}));
        if (!r.ok) throw Object.assign(new Error(j?.error?.message || `A IA respondeu ${r.status}.`), { status: r.status, espera: Number(r.headers.get("retry-after")) || 0 });
        return (j.content || []).map((x) => x.text || "").join("");
      }
      const h = { "content-type": "application/json" };
      if (c.chave) h.authorization = `Bearer ${c.chave}`;
      r = await fetch(`${c.base || p.base}/chat/completions`, { method: "POST", signal: ctrl.signal, headers: h,
        body: JSON.stringify({ model: c.modelo || p.modelo, temperature: 0.7, max_tokens: max, messages: [{ role: "system", content: sistema }, { role: "user", content: pedido }] }) });
      j = await r.json().catch(() => ({}));
      if (!r.ok) {
        const msg = (Array.isArray(j) ? j[0]?.error?.message : j?.error?.message) || `A IA respondeu ${r.status}.`;
        throw Object.assign(new Error(msg), { status: r.status, espera: Number(r.headers.get("retry-after")) || 0 });
      }
      return String(j?.choices?.[0]?.message?.content || "");
    } catch (e) {
      if (e.name === "AbortError") throw new Error("A IA demorou demais para responder.");
      if (e instanceof TypeError) throw new Error(p.tipo === "local" ? "O pacote local não está ligado. Abra pelo iniciar-mac.command ou iniciar-windows.bat." : "Não consegui falar com a IA. Confira a internet, a chave e o endereço.");
      throw e;
    } finally { clearTimeout(t); }
  }

  async function chamar(sistema, pedido, max = 900) {
    const c = cfg(), p = PROVEDORES[c.prov];
    if (!p) throw new Error("Nenhuma IA conectada. Abra Configurações → Sua IA.");
    await vez();
    try {
      for (let tentativa = 0; ; tentativa++) {
        try { return await chamarUmaVez(sistema, pedido, max, c, p); }
        catch (e) {
          const passa = e.status === 429 || e.status >= 500;
          if (!passa || tentativa >= 3) throw e;
          await dormir(Math.max(e.espera * 1000 || 0, 4000 * 2 ** tentativa));
        }
      }
    } finally { libera(); }
  }

  /** A IA às vezes cerca o JSON com texto ou ```json; pega o primeiro objeto inteiro. */
  function json(txt) {
    const s = String(txt || "").replace(/```(?:json)?/gi, "");
    const a = s.indexOf("{"), b = s.lastIndexOf("}");
    if (a < 0 || b <= a) throw new Error("A IA não devolveu o formato pedido.");
    return JSON.parse(s.slice(a, b + 1));
  }
  async function pedirJson(sistema, pedido, max) {
    let txt = await chamar(sistema, pedido, max);
    try { return json(txt); } catch {
      txt = await chamar(sistema, `${pedido}\n\nATENÇÃO: responda SOMENTE com um objeto JSON válido, sem nenhum texto antes ou depois.`, max);
      return json(txt);
    }
  }

  // ------------------------------------------------ cérebro: arquivo aberto + referências do usuário
  const cerebros = {};
  async function cerebro(k) {
    if (cerebros[k] !== undefined) return cerebros[k];
    let t = "";
    try { const r = await fetch(`cerebros/${encodeURIComponent(k)}.md`); if (r.ok) t = await r.text(); } catch {}
    return (cerebros[k] = t.slice(0, 9000));
  }
  const refs = (k) => ler(REFS, {})[k] || [];
  function refsTexto(k) {
    const l = refs(k);
    if (!l.length) return "";
    return "\n\nREFERÊNCIAS QUE O USUÁRIO ACRESCENTOU (leve em conta):\n" + l.map((r) => `- [${r.tipo}] ${r.titulo}${r.autor ? `, ${r.autor}` : ""}${r.link ? ` (${r.link})` : ""}${r.nota ? `: ${r.nota}` : ""}`).join("\n");
  }
  async function sistemaDo(k) {
    const m = byKey[k];
    return `Você é ${m.name}, mentor simulado por IA na mesa "Crasto Mentores" (by crasto.ai). Sua lente: ${m.pillar}.
Fale em português do Brasil, na primeira pessoa, com o jeito descrito no cérebro abaixo. Você não é a pessoa real e não fala por ela: não invente citações literais nem fatos sobre a vida dela.
Seja direto e concreto, com frases curtas, sem jargão. Discorde quando a sua lente discordar. Responda SOMENTE com JSON válido.

CÉREBRO DO MENTOR:
${(await cerebro(k)) || `${m.name}. Área: ${m.pillar}. Pergunta típica: ${m.question}`}${refsTexto(k)}`;
  }
  const MEDIADOR = `Você é o Mediador da mesa "Crasto Mentores" (by crasto.ai). Organiza o debate entre mentores simulados por IA e escreve o veredito.
Fale em português do Brasil, com frases curtas e concretas, sem jargão. Não é aconselhamento profissional: quem decide é o usuário. Responda SOMENTE com JSON válido.`;

  // ------------------------------------------------ utilidades da mesa
  const nota10 = (x) => Math.max(0, Math.min(10, Math.round(Number(x) || 0)));
  const notasDe = (o, ops) => Object.fromEntries(ops.map((x) => [x.id, nota10(o?.[x.id])]));
  const notasTxt = (sc) => Object.entries(sc).map(([k, v]) => `${k} ${v}/10`).join(" · ");
  const lista = (ks) => ks.map((k) => `- ${k}: ${byKey[k].name} (${byKey[k].pillar})`).join("\n");
  const curto = (t, n) => { t = String(t || "").replace(/\s+/g, " ").trim(); return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : t; };
  const VAZIO = { stance: "", call: "", optionScores: {}, pillar: null, finalScore: null, confidence: null, ruin: "", door: "", disagreeWith: null, disagreeLine: "", concede: "", moved: "", vote: "", amendment: "", oneLine: "", question: "", risk: "", thisWeek: "" };
  function media(seats, pesos, notas, ops) {
    const tot = seats.reduce((a, k) => a + pesos[k].weight, 0) || 1;
    return Object.fromEntries(ops.map((o) => {
      const soma = seats.reduce((a, k) => a + pesos[k].weight * (notas[k]?.[o.id] ?? 0), 0);
      return [o.id, { score: Math.round((soma / tot) * 10) / 10, math: `(${seats.map((k) => `${pesos[k].weight}x${notas[k]?.[o.id] ?? 0}`).join(" + ")}) / ${tot}` }];
    }));
  }
  const melhor = (sc) => Object.entries(sc).sort((a, b) => b[1].score - a[1].score)[0]?.[0] || "A";

  // ------------------------------------------------ 1º passo: o Mediador lê a pergunta
  async function preparar(decisao, seats) {
    const j = await pedirJson(MEDIADOR, `DECISÃO DO USUÁRIO:\n${decisao}\n\nMENTORES À MESA:\n${lista(seats)}

Devolva JSON com:
{"titulo": "até 60 caracteres", "resumo": "2 frases", "opcoes": [{"id":"A","label":"..."},{"id":"B","label":"..."},{"id":"C","label":"..."}],
 "premissas": ["3 premissas curtas"], "pergunta": "UMA pergunta de esclarecimento ao usuário (prazo, dinheiro, o que está em jogo)",
 "pesos": {"<key>": {"peso": 1|2|3, "motivo": "1 frase"}}}
As opções vêm da própria pergunta; se ela não tiver opções, crie 3 caminhos reais e diferentes. Use as keys exatas dos mentores.`, 1200);
    const ops = (Array.isArray(j.opcoes) ? j.opcoes : []).slice(0, 4).map((o, i) => ({ id: "ABCD"[i], label: curto(o.label || o.texto || `Opção ${"ABCD"[i]}`, 90) }));
    while (ops.length < 2) ops.push({ id: "ABCD"[ops.length], label: ops.length ? "Esperar e juntar mais dados" : "Seguir em frente" });
    const pesos = Object.fromEntries(seats.map((k) => { const p = j.pesos?.[k] || {}; const w = [1, 2, 3].includes(Number(p.peso)) ? Number(p.peso) : 2; return [k, { weight: w, reason: curto(p.motivo || `A decisão mexe com ${byKey[k].pillar.toLowerCase()}.`, 140) }]; }));
    return { titulo: curto(j.titulo || decisao, 60), resumo: String(j.resumo || ""), ops, premissas: (j.premissas || []).slice(0, 4).map(String), pergunta: String(j.pergunta || "Qual é o prazo para decidir e quanto você pode investir sem apertar o caixa?"), pesos };
  }

  // ------------------------------------------------ a mesa inteira
  async function rodarMesa(s, prep, decisao, seats, rapida, emite) {
    const ops = prep.ops, opTxt = ops.map((o) => `${o.id}) ${o.label}`).join("\n"), solo = seats.length === 1;
    const fim = {}, notas = {};
    emite({ type: "phase", phase: "setup", label: "O Mediador está lendo a sua pergunta" });
    emite({ type: "setup", title: prep.titulo, decision: decisao, mode: rapida ? "quick" : "full", seats, weights: prep.pesos, options: ops,
      brief: `${prep.resumo} ${solo ? "O mentor testa" : "A mesa testa"} a sua inclinação em vez de concordar com ela.`.trim(), assumptions: prep.premissas });

    // Rodada 1
    emite({ type: "phase", phase: "round1", label: "Rodada 1: posições de abertura" });
    emite({ type: "round_start", round: 1 });
    seats.forEach((k) => emite({ type: "seat_start", round: 1, seat: k }));
    const r1 = {};
    await Promise.all(seats.map(async (k) => {
      const m = byKey[k];
      let j;
      try {
        j = await pedirJson(await sistemaDo(k), `DECISÃO:\n${decisao}\n\nOPÇÕES:\n${opTxt}\n\nDê a sua posição de abertura. JSON:
{"posicao": "Sim forte" | "Sim, se" | "Não, por enquanto", "escolha": "A|B|C", "chamada": "1-2 frases: o que você recomenda", "porque": ["3 razões curtas pela sua lente"],
 "notas": {"A":0-10,"B":0-10,"C":0-10}, "confianca": 1-5, "risco_de_ruina": "nenhum|baixo|alto", "porta": "mão dupla|mão única", "pergunta": "a pergunta que você faria ao usuário"}`, 900);
      } catch (e) { j = { posicao: "Sem resposta", chamada: `Não consegui responder agora (${e.message}).`, porque: [], notas: {} }; }
      const sc = notasDe(j.notas, ops); notas[k] = sc; r1[k] = j;
      const esc = ops.some((o) => o.id === j.escolha) ? j.escolha : melhor(Object.fromEntries(Object.entries(sc).map(([a, b]) => [a, { score: b }])));
      const call = `${String(j.chamada || "").trim()}${j.pergunta ? ` Minha pergunta para você: ${String(j.pergunta).trim()}` : ""}`;
      fim[k] = { stance: String(j.posicao || ""), oneLine: curto(j.chamada, 160), moved: "", escolha: esc };
      const porque = (j.porque || []).slice(0, 3).map((x, i) => `${i + 1}. ${x}`).join("\n");
      const text = `MENTOR: ${m.name} (${m.pillar})\nPOSIÇÃO: ${j.posicao || "-"}\nNOTAS DAS OPÇÕES: ${notasTxt(sc)}\nNOTA DO PILAR: ${sc[esc] ?? "-"}/10\nCONFIANÇA: ${j.confianca || "-"}/5\nRISCO DE RUÍNA: ${j.risco_de_ruina || "-"}\nPORTA: ${j.porta || "-"}\n\nA DECISÃO: ${call}\n\nPORQUÊ:\n${porque}`;
      emite({ type: "seat_done", round: 1, seat: k, name: m.name, text, quotes: [], parsed: { ...VAZIO, stance: String(j.posicao || ""), call, optionScores: sc, pillar: sc[esc] ?? null, confidence: Number(j.confianca) || null, ruin: j.risco_de_ruina === "alto" ? "high" : j.risco_de_ruina === "baixo" ? "low" : "none", door: String(j.porta || "").includes("única") ? "one-way" : "two-way", question: String(j.pergunta || "") } });
    }));
    emite({ type: "round_done", round: 1, scores: media(seats, prep.pesos, notas, ops) });
    s.rodada = 1;

    const resumo1 = seats.map((k) => `- ${k} (${byKey[k].short}): ${fim[k].stance}, prefere ${fim[k].escolha}. ${curto(r1[k].chamada, 200)}`).join("\n");
    let cruxes = [], emendas = [], votos = {};
    if (!solo) {
      emite({ type: "phase", phase: "cruxes", label: "O Mediador está achando os pontos de divergência" });
      try {
        const j = await pedirJson(MEDIADOR, `DECISÃO:\n${decisao}\nOPÇÕES:\n${opTxt}\n\nABERTURAS:\n${resumo1}\n\nAche 1 ou 2 pontos reais de divergência. JSON:
{"divergencias": [{"pergunta": "...", "lados": [{"posicao": "1 frase", "mentores": ["keys"]}, {"posicao": "1 frase", "mentores": ["keys"]}]}], "unanime": false, "nota": "1 frase sobre como a mesa está"}`, 900);
        cruxes = (j.divergencias || []).slice(0, 2).map((c) => ({ question: String(c.pergunta || ""), sides: (c.lados || []).map((l) => ({ position: String(l.posicao || ""), seats: (l.mentores || []).filter((k) => seats.includes(k)) })).filter((l) => l.seats.length) })).filter((c) => c.question && c.sides.length);
        emite({ type: "cruxes", cruxes, unanimous: Boolean(j.unanime), note: String(j.nota || ""), pressure: {} });
      } catch { emite({ type: "cruxes", cruxes: [], unanimous: false, note: "O Mediador não conseguiu resumir as divergências agora.", pressure: {} }); }

      // Rodada 2
      emite({ type: "phase", phase: "round2", label: "Rodada 2: o debate" });
      emite({ type: "round_start", round: 2 });
      seats.forEach((k) => emite({ type: "seat_start", round: 2, seat: k }));
      const crTxt = cruxes.map((c) => `- ${c.question}`).join("\n") || "- (sem divergência clara)";
      await Promise.all(seats.map(async (k) => {
        const m = byKey[k]; let j;
        try {
          j = await pedirJson(await sistemaDo(k), `DECISÃO:\n${decisao}\nOPÇÕES:\n${opTxt}\n\nO QUE A MESA DISSE NA ABERTURA:\n${resumo1}\n\nPONTOS DE DIVERGÊNCIA:\n${crTxt}\n\nAgora debata. JSON:
{"discordo_de": "key de UM outro mentor", "discordo": "1-2 frases respondendo direto a ele", "concedo": "1 frase: onde alguém da mesa tem razão", "mudei": "não" ou "sim, de X para Y porque ...", "notas": {"A":0-10,"B":0-10,"C":0-10}}`, 700);
        } catch (e) { j = { discordo: `Não consegui responder agora (${e.message}).`, concedo: "", mudei: "não", notas: notas[k] }; }
        const alvo = seats.includes(j.discordo_de) && j.discordo_de !== k ? j.discordo_de : null;
        const sc = notasDe(j.notas || notas[k], ops); notas[k] = sc;
        const mudou = /^sim/i.test(String(j.mudei || ""));
        if (mudou) fim[k].moved = String(j.mudei);
        const disagreeLine = `${alvo ? byKey[alvo].short + ". " : ""}${j.discordo || ""}`;
        const text = `MENTOR: ${m.name}\n\nDISCORDO MAIS DE: ${disagreeLine}\n\nCONCEDO: ${j.concedo || "-"}\n\nMUDEI DE POSIÇÃO: ${j.mudei || "não"}\n\nNOTAS DAS OPÇÕES: ${notasTxt(sc)}`;
        emite({ type: "seat_done", round: 2, seat: k, name: m.name, text, quotes: [], parsed: { ...VAZIO, stance: mudou ? String(j.mudei) : "", optionScores: sc, disagreeWith: alvo, disagreeLine, concede: String(j.concedo || ""), moved: String(j.mudei || "não") } });
      }));
      emite({ type: "round_done", round: 2, scores: media(seats, prep.pesos, notas, ops) });
      s.rodada = 2;

      // Rodada 3: votação (o modo rápido pula)
      if (rapida) emite({ type: "phase", phase: "skip3", label: "Modo rápido: a rodada de votação foi pulada" });
      else {
        const lider = melhor(media(seats, prep.pesos, notas, ops)), opL = ops.find((o) => o.id === lider);
        emite({ type: "phase", phase: "draft", label: "O Mediador está pesando o debate" });
        emite({ type: "draft", draft: { option: lider, label: "RASCUNHO", recommendation: `Ir de ${lider}: ${opL.label}.`, conditions: [], next_steps: [], cheapest_test: "", kill_criteria: "" } });
        emite({ type: "phase", phase: "round3", label: "Rodada 3: a votação" });
        emite({ type: "round_start", round: 3 });
        seats.forEach((k) => emite({ type: "seat_start", round: 3, seat: k }));
        await Promise.all(seats.map(async (k) => {
          const m = byKey[k]; let j;
          try {
            j = await pedirJson(await sistemaDo(k), `DECISÃO:\n${decisao}\nOPÇÕES:\n${opTxt}\n\nO rascunho do Mediador é ir de ${lider}: ${opL.label}.\nVote. JSON:
{"voto": "endorse" (apoia) | "amend" (apoia com emenda) | "dissent" (diverge), "emenda": "1 frase, se houver", "uma_linha": "1 frase para o usuário levar", "notas": {"A":0-10,"B":0-10,"C":0-10}}`, 500);
          } catch (e) { j = { voto: "endorse", uma_linha: `Sem voto agora (${e.message}).`, notas: notas[k] }; }
          const vote = ["endorse", "amend", "dissent"].includes(j.voto) ? j.voto : "endorse";
          votos[vote] = (votos[vote] || 0) + 1;
          if (vote === "amend" && j.emenda) emendas.push({ k, t: String(j.emenda) });
          const sc = notasDe(j.notas || notas[k], ops); notas[k] = sc;
          const fs = Math.max(...Object.values(sc));
          Object.assign(fim[k], { stance: vote, oneLine: String(j.uma_linha || "") });
          const text = `MENTOR: ${m.name}\nVOTO: ${vote === "endorse" ? "Apoia" : vote === "amend" ? "Apoia com emenda" : "Diverge"}\nNOTAS DAS OPÇÕES: ${notasTxt(sc)}\nNOTA FINAL: ${fs}/10\n${j.emenda ? `EMENDA OU DIVERGÊNCIA: ${j.emenda}\n` : ""}\nUMA LINHA PARA VOCÊ: ${j.uma_linha || "-"}`;
          emite({ type: "seat_done", round: 3, seat: k, name: m.name, text, quotes: [], parsed: { ...VAZIO, optionScores: sc, pillar: fs, finalScore: fs, vote, amendment: String(j.emenda || ""), oneLine: String(j.uma_linha || "") } });
        }));
        emite({ type: "round_done", round: 3, scores: media(seats, prep.pesos, notas, ops) });
        s.rodada = 3;
      }
    }

    // Veredito
    emite({ type: "phase", phase: "verdict", label: "O Mediador está escrevendo o veredito" });
    const final = media(seats, prep.pesos, notas, ops), rec = melhor(final);
    const posFinal = seats.map((k) => `- ${k} (${byKey[k].short}): ${fim[k].stance}. ${curto(fim[k].oneLine, 160)}${fim[k].moved ? ` Mudou: ${fim[k].moved}` : ""}`).join("\n");
    let v = {};
    try {
      v = await pedirJson(MEDIADOR, `DECISÃO:\n${decisao}\nOPÇÕES:\n${opTxt}\nNOTA FINAL PONDERADA: ${Object.entries(final).map(([a, b]) => `${a}=${b.score}`).join(", ")} (a maior é ${rec})\n\nPOSIÇÕES FINAIS:\n${posFinal}\n\nEscreva o veredito. JSON:
{"rotulo": "SIGA" | "SIGA COM CONDIÇÕES" | "ESPERE" | "NÃO SIGA", "recomendada": "A|B|C", "chamada": "2 frases: o que fazer",
 "porque": [{"ponto": "1 frase", "mentor": "key"}], "minoria": {"mentor": "key", "frase": "o argumento de quem discordou", "teria_que_ser_verdade": "o que teria de acontecer para ele ter razão"} ou null,
 "condicoes": ["2-4 condições"], "proximos_passos": [{"quando": "Hoje|Esta semana|Dia 30", "acao": "..."}], "teste_mais_barato": "1 frase", "criterio_de_parar": "1 frase", "revisar": "quando rever", "confianca": 1-10, "apoio": 1-10}`, 1400);
    } catch (e) { v = { rotulo: "SIGA COM CONDIÇÕES", chamada: `A mesa ficou com a ${rec}. (O Mediador não conseguiu escrever o veredito completo: ${e.message})` }; }
    const recomendada = ops.some((o) => o.id === v.recomendada) ? v.recomendada : rec;
    const sh = (k) => byKey[k]?.short || k;
    const verdict = {
      label: String(v.rotulo || "SIGA COM CONDIÇÕES"), call: String(v.chamada || ""), override_note: recomendada !== rec ? `O Mediador recomendou a ${recomendada}, embora a nota ponderada maior seja da ${rec}.` : "",
      recommended: recomendada,
      why: (v.porque || []).slice(0, 4).map((p) => ({ point: String(p.ponto || ""), seat: sh(p.mentor), framework: byKey[p.mentor]?.pillar || "" })),
      fights: cruxes.map((c) => ({ crux: c.question, story: c.sides.map((x) => `${x.seats.map(sh).join(", ")}: ${x.position}`).join(" ") })),
      minority: v.minoria && v.minoria.mentor ? { seat: sh(v.minoria.mentor), quote: String(v.minoria.frase || ""), would_have_to_be_true: String(v.minoria.teria_que_ser_verdade || "") } : null,
      amendments: emendas.slice(0, 3).map((e) => ({ seat: sh(e.k), amendment: e.t, adopted: true, reason: "Entrou como condição do veredito." })),
      conditions: (v.condicoes || []).map(String).slice(0, 5),
      next_steps: (v.proximos_passos || []).slice(0, 5).map((p) => ({ when: String(p.quando || ""), action: String(p.acao || "") })),
      cheapest_test: String(v.teste_mais_barato || ""), kill_criteria: String(v.criterio_de_parar || ""), revisit: String(v.revisar || ""),
      scores: final, spread: 0, confidence: Number(v.confianca) || null, support: Number(v.apoio) || null, votes: rapida || solo ? null : votos,
      disclaimer: "Mentores simulados por IA a partir da obra pública de cada pessoa. Não são as pessoas e não falam por elas. Não é aconselhamento profissional. by crasto.ai",
    };
    emite({ type: "verdict", verdict, seats: seats.map((k) => ({ key: k, weight: prep.pesos[k].weight, stance: fim[k].stance, optionScores: notas[k], pillar: Math.max(...Object.values(notas[k] || { x: 0 })), moved: fim[k].moved, oneLine: fim[k].oneLine })) });
  }

  // ------------------------------------------------ conversa com um mentor só ("Debater mais com")
  async function conversar(k, pergunta, tema) {
    const sis = (await sistemaDo(k)).replace("Responda SOMENTE com JSON válido.", "Responda em texto corrido, de 3 a 6 frases, sem listas.");
    return (await chamar(sis, `${tema ? `CONTEXTO: a mesa acabou de debater "${tema}".\n\n` : ""}PERGUNTA DO USUÁRIO:\n${pergunta}`, 600)).trim();
  }

  async function testar() {
    const t = await chamar("Responda só com a palavra OK.", "Teste de conexão. Responda OK.", 20);
    return t.trim().slice(0, 40) || "OK";
  }

  window.MOTOR = { PROVEDORES, CFG, REFS, cfg, ativo, gravarCfg: (c) => gravar(CFG, c), refs: () => ler(REFS, {}), gravarRefs: (r) => gravar(REFS, r), preparar, rodarMesa, conversar, testar, cerebro };
})();
