// Crasto Mentores · by crasto.ai
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// Menu Configurações: conectar a sua IA, alimentar o cérebro dos mentores e escolher vozes.
// Crédito: pedimos que quem usar ou modificar esta tela mantenha visível o "by crasto.ai" com link para https://crasto.ai (na licença comercial, é condição do contrato). Ver NOTICE.
(function () {
  "use strict";
  const M = window.MOTOR, D = window.MESA_DADOS;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byKey = Object.fromEntries(D.mentores.map((m) => [m.key, m]));
  let aba = "ia", local = null;

  // ------------------------------------------------ "by crasto.ai": sempre visível
  const URL_CRASTO = "https://crasto.ai";
  function visivel(el) {
    if (!el || !el.isConnected) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) < 0.4) return false;
    for (let p = el.parentElement; p; p = p.parentElement) { const c = getComputedStyle(p); if (c.display === "none" || c.visibility === "hidden" || Number(c.opacity) < 0.4) return false; }
    const r = el.getBoundingClientRect();
    return r.width >= 30 && r.height >= 8;
  }
  function assinatura() {
    const a = document.getElementById("byCrasto");
    const ok = a && a.getAttribute("href") === URL_CRASTO && /by crasto\.ai/i.test(a.textContent || "") && (visivel(a) || document.documentElement.classList.contains("embed"));
    if (ok) return;
    if (a) a.remove();
    const n = document.createElement("a");
    n.id = "byCrasto"; n.href = URL_CRASTO; n.target = "_blank"; n.rel = "noopener"; n.textContent = "by crasto.ai";
    n.setAttribute("style", "position:fixed!important;right:12px!important;bottom:10px!important;z-index:2147483647!important;display:block!important;visibility:visible!important;opacity:1!important;font:600 12px/1 Montserrat,system-ui,sans-serif!important;color:#fff!important;background:#010E26!important;padding:6px 10px!important;border-radius:999px!important;text-decoration:none!important");
    document.body.appendChild(n);
  }
  let agenda = 0;
  const vigiar = () => { clearTimeout(agenda); agenda = setTimeout(assinatura, 300); };
  addEventListener("load", () => {
    assinatura();
    new MutationObserver(vigiar).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class", "hidden", "href"] });
    setInterval(assinatura, 5000);
  });

  // ------------------------------------------------ faixa do topo: demonstração ou IA conectada
  function faixa() {
    const f = $(".proto-faixa"); if (!f) return;
    const c = M.cfg(), p = M.PROVEDORES[c.prov];
    f.classList.toggle("conectada", M.ativo());
    if (M.ativo()) f.innerHTML = `<b>Conectado:</b> ${esc(p.nome)}${p.tipo === "local" ? ` (${esc(c.cli || "claude")})` : ` · ${esc(c.modelo || p.modelo)}`}. Os mentores respondem com a sua IA. <button type="button" class="link-btn" data-cfg="ia">Trocar</button>`;
    else f.innerHTML = `<b>Modo demonstração.</b> As falas são de exemplo. Para respostas de verdade, <button type="button" class="link-btn" data-cfg="ia">conecte a sua IA</button> (o Gemini tem cota grátis).`;
  }

  // ------------------------------------------------ pacote local (Claude Code, Codex, Gemini CLI)
  async function pingLocal() {
    try { const r = await fetch("/local/ping", { cache: "no-store" }); local = r.ok ? await r.json() : null; } catch { local = null; }
    return local;
  }

  // ------------------------------------------------ aba: Sua IA
  function htmlIA() {
    const c = M.cfg(), sel = c.prov || "gemini", p = M.PROVEDORES[sel];
    const cards = Object.entries(M.PROVEDORES).map(([id, x]) => `<label class="cfg-prov${id === sel ? " on" : ""}"><input type="radio" name="prov" value="${id}"${id === sel ? " checked" : ""}><b>${esc(x.nome)}</b><span>${esc(x.nota)}</span></label>`).join("");
    let passos = "";
    if (p.tipo === "local") {
      const clis = local?.clis || {};
      passos = `<ol class="cfg-passos">
        <li>Baixe o repositório no seu computador (botão verde <b>Code → Download ZIP</b> no GitHub) e descompacte.</li>
        <li>Dê dois cliques em <b>iniciar-mac.command</b> (Mac) ou <b>iniciar-windows.bat</b> (Windows). Precisa do Node.js 18 ou mais novo.</li>
        <li>A tela abre sozinha em <code>http://127.0.0.1:4790</code>. Use esta mesma tela por esse endereço.</li></ol>
        <p class="cfg-status ${local ? "ok" : "falta"}">${local ? "Pacote local ligado." : "O pacote local não está ligado nesta janela. Abra a tela pelo endereço do passo 3."}</p>
        <label class="cfg-campo">Qual programa responde
          <select id="cfgCli">${["claude", "codex", "gemini"].map((k) => `<option value="${k}"${(c.cli || "claude") === k ? " selected" : ""}${local && !clis[k] ? " disabled" : ""}>${{ claude: "Claude Code", codex: "Codex", gemini: "Gemini CLI" }[k]}${local && !clis[k] ? " (não encontrado)" : ""}</option>`).join("")}</select></label>`;
    } else if (sel === "ollama") {
      passos = `<ol class="cfg-passos">
        <li>Instale o Ollama (ollama.com) e baixe um modelo, por exemplo <code>ollama pull llama3.1</code>.</li>
        <li>Libere esta tela no Ollama: no Mac, <code>launchctl setenv OLLAMA_ORIGINS "${esc(location.origin)}"</code> e reabra o Ollama. No Windows, crie a variável de ambiente <code>OLLAMA_ORIGINS</code> com <code>${esc(location.origin)}</code>.</li>
        <li>Clique em <b>Salvar e testar</b>. Nada sai do seu computador.</li></ol>`;
    } else {
      passos = `<ol class="cfg-passos">
        <li>Crie a sua chave em <a href="${esc(p.pegarChave)}" target="_blank" rel="noopener">${esc(new URL(p.pegarChave).host)}</a>.</li>
        <li>Cole a chave abaixo e clique em <b>Salvar e testar</b>.</li></ol>
        <label class="cfg-campo">Chave
          <input id="cfgChave" type="password" autocomplete="off" spellcheck="false" placeholder="cole aqui a sua chave" value="${esc(c.prov === sel ? c.chave : "")}"></label>`;
    }
    const modelo = p.tipo === "local" ? "" : `<details class="cfg-avancado"${c.prov === sel && (c.modelo || c.base) ? " open" : ""}><summary>Modelo e endereço (opcional)</summary>
      <label class="cfg-campo">Modelo <input id="cfgModelo" type="text" spellcheck="false" placeholder="${esc(p.modelo)}" value="${esc(c.prov === sel ? c.modelo : "")}"></label>
      <label class="cfg-campo">Endereço da API <input id="cfgBase" type="url" spellcheck="false" placeholder="${esc(p.base)}" value="${esc(c.prov === sel ? c.base : "")}"></label></details>`;
    return `<p class="muted">Escolha a IA que vai pensar e responder pelos mentores. Sem IA conectada, a mesa mostra falas de demonstração.</p>
      <div class="cfg-provs" role="radiogroup" aria-label="Escolha a sua IA">${cards}</div>
      <div class="cfg-caixa">${passos}${modelo}
        <div class="cfg-acoes"><button type="button" class="pill" id="cfgSalvar">Salvar e testar</button>${M.ativo() ? '<button type="button" class="ghost" id="cfgSair">Desconectar</button>' : ""}<span class="cfg-msg" id="cfgMsg" role="status"></span></div>
        <p class="cfg-priv"><b>Privacidade:</b> a chave fica só neste navegador e vai direto para a IA escolhida. Nada passa pela Crasto.ai. Para apagar, clique em Desconectar.</p>
      </div>`;
  }

  // ------------------------------------------------ aba: Cérebro dos mentores
  function htmlCerebro() {
    const refs = M.refs(), sel = $("#cfgMentor")?.value || D.mentores[0].key;
    const ops = D.mentores.map((m) => `<option value="${m.key}"${m.key === sel ? " selected" : ""}>${esc(m.name)}${(refs[m.key] || []).length ? ` (${refs[m.key].length})` : ""}</option>`).join("");
    const l = refs[sel] || [];
    const itens = l.length ? l.map((r, i) => `<li><b>${esc(r.titulo)}</b>${r.autor ? `, ${esc(r.autor)}` : ""} <span class="tag">${esc(r.tipo)}</span>${r.link ? ` · <a href="${esc(r.link)}" target="_blank" rel="noopener">abrir</a>` : ""}${r.nota ? `<br><span class="muted">${esc(r.nota)}</span>` : ""} <button type="button" class="link-btn" data-tirar="${i}">remover</button></li>`).join("") : '<li class="muted">Nenhuma referência acrescentada para este mentor.</li>';
    return `<p class="muted">Cada mentor tem um <b>cérebro aberto</b>: um arquivo de texto feito da obra pública da pessoa, que a IA lê antes de responder. Você pode melhorá-lo de dois jeitos.</p>
      <div class="cfg-caixa">
        <h4>1. Pela tela (vale neste navegador)</h4>
        <label class="cfg-campo">Mentor <select id="cfgMentor">${ops}</select></label>
        <p class="muted pequeno"><a href="cerebros/${esc(sel)}.md" target="_blank" rel="noopener">Ler o cérebro de ${esc(byKey[sel]?.name || "")}</a></p>
        <div class="cfg-grade">
          <label class="cfg-campo">Tipo <select id="refTipo">${["Livro", "Artigo", "Vídeo", "Palestra", "Documento", "Outro"].map((t) => `<option>${t}</option>`).join("")}</select></label>
          <label class="cfg-campo">Título <input id="refTitulo" type="text" maxlength="160" placeholder="ex.: Em busca de sentido"></label>
          <label class="cfg-campo">Autor <input id="refAutor" type="text" maxlength="120"></label>
          <label class="cfg-campo">Link (opcional) <input id="refLink" type="url" maxlength="400" placeholder="https://"></label>
        </div>
        <label class="cfg-campo">O que ensina (a IA lê este texto; ela não abre o link) <textarea id="refNota" rows="3" maxlength="600" placeholder="Resuma em 1 a 3 frases a ideia principal, ou cole um trecho curto."></textarea></label>
        <div class="cfg-acoes"><button type="button" class="pill" id="refAdd">Acrescentar</button><span class="cfg-msg" id="refMsg" role="status"></span></div>
        <ul class="cfg-refs">${itens}</ul>
        ${l.length ? '<div class="cfg-acoes"><button type="button" class="ghost" id="refBaixar">Baixar em Markdown</button><button type="button" class="ghost" id="refCopiar">Copiar</button></div>' : ""}
      </div>
      <div class="cfg-caixa">
        <h4>2. No arquivo (vale para todos que usarem a sua cópia)</h4>
        <p>Abra <code>cerebros/${esc(sel)}.md</code> na sua cópia do repositório e acrescente as referências na seção <b>Para alimentar este cérebro</b>: título, autor, link e o que ensinam. O botão <b>Baixar em Markdown</b> já gera esse texto.</p>
        <p class="muted pequeno">Dê preferência a obras da própria pessoa: livros, cartas, palestras e entrevistas. Fontes de terceiros entram como apoio.</p>
      </div>`;
  }

  // ------------------------------------------------ aba: Vozes
  function htmlVozes() {
    const ROBO = /^(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|kathy|ralph)\b/;
    const q = (n) => (ROBO.test(n) ? 0 : /natural|neural/.test(n) ? 3 : /premium|enhanced|aprimorad|melhorad|siri/.test(n) ? 2 : 1);
    const rot = ["robótica (não usada)", "padrão", "humana (Premium ou Aprimorada)", "humana (neural)"];
    let vs = [];
    try { vs = speechSynthesis.getVoices().filter((v) => /^pt/i.test(v.lang)).map((v) => ({ v, q: q(v.name.toLowerCase()) })).sort((a, b) => b.q - a.q); } catch {}
    const melhor = vs.length ? vs[0].q : -1;
    const lista = vs.length ? vs.map(({ v, q: n }) => `<li>${esc(v.name)} <span class="tag">${rot[n]}</span>${v.localService ? "" : ' <span class="muted">(online)</span>'}</li>`).join("") : '<li class="muted">Nenhuma voz em português encontrada neste navegador.</li>';
    const aviso = melhor >= 2 ? '<p class="cfg-status ok">Este computador já tem voz humana. Os mentores usam ela.</p>' : '<p class="cfg-status falta">Este computador só tem vozes simples. Siga o passo a passo abaixo para ter voz humana, grátis.</p>';
    return `<p class="muted">Os mentores falam com as vozes grátis do seu aparelho. A tela escolhe sempre a voz mais humana disponível, masculina ou feminina conforme o mentor, e muda um pouco o ritmo e o tom de cada um. Vozes robóticas nunca são usadas se houver outra. Ninguém é clonado.</p>
      ${aviso}
      <div class="cfg-caixa"><h4>Para ter voz humana, grátis</h4>
        <p><b>Mac:</b> Ajustes do Sistema → Acessibilidade → Conteúdo Falado → Voz do Sistema → Gerenciar Vozes → Português (Brasil). Baixe <b>Luciana (Premium)</b> e <b>Felipe (Aprimorada)</b>. Depois feche e abra o navegador (Safari ou Chrome).</p>
        <p><b>iPhone e iPad:</b> Ajustes → Acessibilidade → Conteúdo Falado → Vozes → Português (Brasil). Baixe <b>Luciana (Premium ou Aprimorada)</b> e <b>Felipe (Aprimorada)</b>. Abra a mesa no Safari.</p>
        <p><b>Windows:</b> abra a mesa no <b>Microsoft Edge</b>. Ele já traz as vozes neurais <b>Francisca, Antonio e Thalita "Online (Natural)"</b>, as mais humanas de todas. Precisam de internet e o texto falado passa pela Microsoft. No Chrome do Windows só existem Maria e Daniel, mais robóticas.</p>
        <p><b>Android:</b> Configurações → Sistema → Idiomas → Saída de texto para voz → Mecanismo do Google → Português (Brasil) → baixe a voz de alta qualidade.</p>
        <p class="muted pequeno">Depois de instalar, recarregue esta página. Ligue ou desligue a voz e mude o volume no botão de voz do topo.</p></div>
      <div class="cfg-caixa"><h4>Vozes em português neste aparelho</h4><ul class="cfg-vozes">${lista}</ul></div>
      <p class="muted pequeno">O microfone (falar em vez de digitar) usa o reconhecimento de fala do navegador: no Chrome e no Edge, o áudio passa pelo Google ou pela Microsoft.</p>`;
  }

  function pintar() {
    const b = $("#cfgBody"); if (!b) return;
    const abas = [["ia", "Sua IA"], ["cerebro", "Cérebro dos mentores"], ["vozes", "Vozes"]];
    b.innerHTML = `<h3>Configurações</h3>
      <div class="cfg-abas" role="tablist">${abas.map(([id, t]) => `<button type="button" role="tab" aria-selected="${id === aba}" class="cfg-aba${id === aba ? " on" : ""}" data-aba="${id}">${t}</button>`).join("")}</div>
      <div class="cfg-conteudo" role="tabpanel">${aba === "ia" ? htmlIA() : aba === "cerebro" ? htmlCerebro() : htmlVozes()}</div>
      <p class="cfg-rodape">Crasto Mentores · <a href="https://crasto.ai" target="_blank" rel="noopener">by crasto.ai</a></p>`;
  }

  async function abrir(qual) {
    if (qual) aba = qual;
    await pingLocal();
    pintar();
    const d = $("#cfgDialog"); if (d && !d.open) d.showModal();
  }

  function msg(id, t, ok) { const e = $(id); if (e) { e.textContent = t; e.className = `cfg-msg ${ok ? "ok" : "erro"}`; } }

  async function salvar() {
    const prov = document.querySelector('input[name="prov"]:checked')?.value; const p = M.PROVEDORES[prov]; if (!p) return;
    const c = { prov, chave: ($("#cfgChave")?.value || "").trim(), modelo: ($("#cfgModelo")?.value || "").trim(), base: ($("#cfgBase")?.value || "").trim().replace(/\/+$/, ""), cli: $("#cfgCli")?.value || "claude" };
    if (!p.semChave && !c.chave) return msg("#cfgMsg", "Cole a chave antes de salvar.", false);
    if (c.base && !/^https:\/\//i.test(c.base) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(c.base)) return msg("#cfgMsg", "O endereço precisa começar com https:// (http só para o próprio computador).", false);
    if (p.tipo === "local" && !local) return msg("#cfgMsg", "Abra a tela pelo pacote local (passo 3) para usar esta opção.", false);
    M.gravarCfg(c);
    msg("#cfgMsg", "Testando…", true);
    try { await M.testar(); msg("#cfgMsg", "Conectado. A próxima mesa usa a sua IA.", true); }
    catch (e) { msg("#cfgMsg", `Salvo, mas o teste falhou: ${e.message}`, false); }
    faixa();
  }

  function refsDe(k) { return (M.refs()[k] || []).slice(); }
  function gravarRefs(k, l) { const r = M.refs(); if (l.length) r[k] = l; else delete r[k]; M.gravarRefs(r); }
  function markdown(k) {
    return `## Para alimentar este cérebro\n\n${refsDe(k).map((r) => `- **${r.titulo}**${r.autor ? `, ${r.autor}` : ""} (${r.tipo})${r.link ? ` · ${r.link}` : ""}${r.nota ? `\n  ${r.nota}` : ""}`).join("\n")}\n`;
  }

  document.addEventListener("click", async (e) => {
    const t = e.target;
    const abre = t.closest("#cfgBtn, [data-cfg]");
    if (abre) { e.preventDefault(); return abrir(abre.dataset.cfg || ""); }
    if (!t.closest("#cfgDialog")) return;
    const ab = t.closest("[data-aba]"); if (ab) { aba = ab.dataset.aba; return pintar(); }
    if (t.closest("#cfgSalvar")) return salvar();
    if (t.closest("#cfgSair")) { const c = M.cfg(); M.gravarCfg({ prov: "", chave: "", modelo: "", base: "", cli: c.cli || "claude" }); faixa(); return pintar(); }
    if (t.closest("#refAdd")) {
      const k = $("#cfgMentor").value, titulo = $("#refTitulo").value.trim(), link = $("#refLink").value.trim();
      if (titulo.length < 2) return msg("#refMsg", "Escreva o título.", false);
      if (link && !/^https?:\/\/[^\s]+$/i.test(link)) return msg("#refMsg", "O link precisa começar com https://", false);
      const l = refsDe(k);
      if (l.length >= 30) return msg("#refMsg", "Limite de 30 referências por mentor nesta tela. Use o arquivo para mais.", false);
      l.push({ tipo: $("#refTipo").value, titulo, autor: $("#refAutor").value.trim(), link, nota: $("#refNota").value.trim() });
      gravarRefs(k, l); pintar(); return msg("#refMsg", "Acrescentada. As próximas respostas deste mentor já levam em conta.", true);
    }
    const tira = t.closest("[data-tirar]");
    if (tira) { const k = $("#cfgMentor").value, l = refsDe(k); l.splice(Number(tira.dataset.tirar), 1); gravarRefs(k, l); return pintar(); }
    if (t.closest("#refBaixar")) {
      const k = $("#cfgMentor").value, a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([markdown(k)], { type: "text/markdown" })); a.download = `referencias-${k}.md`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      return;
    }
    if (t.closest("#refCopiar")) { try { await navigator.clipboard.writeText(markdown($("#cfgMentor").value)); msg("#refMsg", "Copiado.", true); } catch { msg("#refMsg", "Não consegui copiar. Use Baixar em Markdown.", false); } }
  });
  document.addEventListener("change", (e) => {
    if (!e.target.closest("#cfgDialog")) return;
    if (e.target.name === "prov") { const c = M.cfg(); if (c.prov !== e.target.value) { pintarProv(e.target.value); } }
    if (e.target.id === "cfgMentor") pintar();
  });
  function pintarProv(id) {
    // troca só a escolha na tela; salva quando a pessoa clicar em Salvar e testar
    const c = M.cfg(); const tmp = { ...c, prov: id, chave: c.prov === id ? c.chave : "", modelo: c.prov === id ? c.modelo : "", base: c.prov === id ? c.base : "" };
    const real = M.cfg; M.cfg = () => tmp; try { pintar(); } finally { M.cfg = real; }
  }

  addEventListener("DOMContentLoaded", () => { faixa(); });
  try { speechSynthesis.addEventListener("voiceschanged", () => { if ($("#cfgDialog")?.open && aba === "vozes") pintar(); }); } catch {}
  window.CONFIG_MESA = { abrir, faixa };
})();
