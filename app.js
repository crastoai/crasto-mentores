// Crasto Mentores · by crasto.ai · Copyright (c) 2026 Carlos Crasto
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 AND MIT
// Contém trechos de projeto aberto sob MIT (aviso completo em NOTICE, item 3). Esses trechos seguem sob MIT; as mudanças e os acréscimos do titular seguem a PolyForm Noncommercial 1.0.0 (LICENSE).
const downloadVerdictPdf = (...a) => window.downloadVerdictPdf(...a);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/** Número vindo de arquivo: só dígitos na tela, nunca HTML. */
const num = (x) => (Number.isFinite(Number(x)) && x !== null && x !== "" ? String(Math.round(Number(x) * 10) / 10).replace(".", ",") : "-");
const fold = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "");

const ORIGENS = ["https://clientes.crasto.ai"];
const MESA_UMA_FILEIRA = 7;
const MAX_CADEIRAS = 12;
const LUGARES_PADRAO = 7;
const lim = () => Math.max(1, Math.min(MAX_CADEIRAS, Number(state.lugares) || LUGARES_PADRAO));
const EXEMPLO = 'Devo subir o preço da minha mentoria de R$ 2.000 para R$ 3.500? Opções: subir para todos agora, subir só para clientes novos, ou manter. Faturo R$ 30 mil por mês com 15 clientes, fecho 50% das conversas e tenho R$ 40 mil em caixa. Quero chegar a R$ 45 mil por mês até março. Estou inclinado a subir para todos porque me sinto mal pago.';

// Como usar, mostrado no painel lateral enquanto a mesa está vazia e em "Como funciona".
const SKILL = "/crastomentoring";
const comandoExemplo = () => `${SKILL} ${EXEMPLO}`;
const GUIDE = () => `
  <div class="guide">
    <div class="guide-sec">
      <h4>Como usar o Crasto Mentores</h4>
      <ol>
        <li><span>Escolha um grupo (Filósofos, Especialistas financeiros ou Terapias integrativas) e a mesa já senta. Em Monte a sua, você escolhe até ${MAX_CADEIRAS} mentores de qualquer grupo. Para mudar alguém de lugar, arraste o mentor com o mouse: de uma cadeira para outra, ou da lista para a mesa.</span></li>
        <li><span>Escolha quantos lugares (de 1 a ${MAX_CADEIRAS}). Escreva ou fale a sua decisão (botão Falar) e clique em Convocar a mesa.</span></li>
        <li><span>Responda às perguntas do Mediador (a IA que conduz a mesa). Depois assista aos mentores debatendo aqui.</span></li>
        <li><span>Quando o veredito sair, baixe o PDF ou escolha um mentor em "Debater mais com" para aprofundar o tema.</span></li>
      </ol>
    </div>
    <div class="guide-sec">
      <h4>De onde vem a inteligência dos mentores</h4>
      <ul>
        <li><span><b>O conhecimento é aberto.</b> Cada mentor tem um arquivo de texto montado a partir da obra pública da pessoa (livros, cartas, palestras), com a lista de fontes. Você pode ler e editar.</span></li>
        <li><span><b>Quem pensa e responde é a IA que você conectar</b> no seu computador. Nada vem da pessoa real e nenhum modelo fechado vem junto.</span></li>
        <li><span><b>Carlos Crasto</b>, criador do Crasto Mentores, senta no centro de toda mesa. Para tirá-lo, desmarque o nome dele na lista ao lado.</span></li>
      </ul>
    </div>
    <div class="guide-sec">
      <h4>O que pôr na sua pergunta</h4>
      <ul>
        <li><span><b>A decisão</b> em uma linha.</span></li>
        <li><span><b>Suas opções.</b> Duas ou três. "Continuar como estou" conta.</span></li>
        <li><span><b>Seus números.</b> Faturamento, caixa e tamanho da equipe.</span></li>
        <li><span><b>Seus limites.</b> Prazo, horas e orçamento.</span></li>
        <li><span><b>Como é o sucesso</b> e até quando.</span></li>
        <li><span><b>Para que lado você pende</b> e por quê. A mesa testa a sua inclinação em vez de concordar com ela.</span></li>
      </ul>
      <p class="note" style="margin-top:8px">Faltou algo? O Mediador pergunta antes de a mesa começar.</p>
    </div>
    <div class="guide-sec">
      <h4>Exemplo</h4>
      <div class="example">
        <p>${esc(EXEMPLO)}</p>
        <p class="note">Modelo de como fazer a sua pergunta. Os números são de exemplo, criados para ajudar você a usar o Crasto Mentores; troque pelos seus.</p>
        <button class="ghost" type="button" data-copy-example>Copiar este exemplo</button>
      </div>
    </div>
    <div class="guide-sec">
      <h4>Bom saber</h4>
      <ul>
        <li><span><b>Mesa completa:</b> 3 rodadas (abertura, debate e votação). Para decisões grandes e difíceis de desfazer.</span></li>
        <li><span><b>Rápida:</b> acrescente <code>--rapida</code> para 4 mentores e 2 rodadas. Usa bem menos da sua assinatura de IA e sai mais cedo.</span></li>
        <li><span><b>Lugares:</b> de 1 a ${MAX_CADEIRAS}. Com 1, você conversa com um mentor só; com 2 ou mais, eles debatem entre si e votam.</span></li>
        <li><span><b>Toda mesa fica salva.</b> Abra "Sessões anteriores" para rever ou baixar o PDF.</span></li>
      </ul>
    </div>
  </div>`;

const SHAPES = ["base", "open", "mid", "blink"];
const portrait = (key, shape = "base") => `portraits/${key}-${shape}.webp`;
const ROUND_NAME = ["", "Abertura", "Debate", "Votação"];
const VOTE_TXT = { endorse: "apoia", amend: "apoia com emenda", dissent: "diverge" };
const STAMP_TXT = { endorse: "APOIA", amend: "EMENDA", dissent: "DIVERGE" };   // no carimbo do assento o texto curto cabe
const PHASE_LABEL = {
  setup: "O Mediador está lendo a sua pergunta", round1: "Rodada 1: posições de abertura", cruxes: "O Mediador está achando os pontos de divergência",
  round2: "Rodada 2: o debate", draft: "O Mediador está pesando o debate", round3: "Rodada 3: a votação",
  skip3: "Modo rápido: a rodada de votação foi pulada", verdict: "O Mediador está escrevendo o veredito",
};

const state = {
  all: [], byKey: {}, salas: [], mesas: [], seats: [], session: null, options: [], weights: {}, active: [], round: 0,
  cards: { 1: {}, 2: {}, 3: {} }, replaying: false, verdict: null, links: [], geo: {}, setup: null, wait: null,
  mesa: [], salaAtiva: "filosofos", nucleo: "", grupo: "", busca: "", rapida: false,
  lugares: LUGARES_PADRAO, solo: false, manual: false, linha: "filosofos", personal: [], filtroLinha: "", modo: "mesa", conversa: null, convIdx: {}, vagas: 0, editar: false,
};

const temGrupo = (...nomes) => (m) => (m.grupos || []).some((g) => nomes.includes(g));
const LINHAS = [
  { id: "filosofos", nome: "Filósofos", sala: "filosofos", mesas: ["grupo-filosofos"], tem: temGrupo("Filósofos") },
  { id: "financas", nome: "Especialistas financeiros", sala: "financas", mesas: ["grupo-financas"], tem: temGrupo("Especialistas financeiros") },
  { id: "terapias", nome: "Terapias integrativas", sala: "terapias", mesas: ["grupo-terapias"], tem: temGrupo("Terapias integrativas") },
  { id: "personalizada", nome: "Monte a sua", sala: "", mesas: [], tem: () => true },
];
const LINHA = Object.fromEntries(LINHAS.map((l) => [l.id, l]));
const SALA_LINHA = { filosofos: "filosofos", financas: "financas", terapias: "terapias" };
const MAX_MINHAS = 5;
/** o mentor é da linha: pelo grupo/núcleo dele ou por sentar numa das mesas sugeridas dela */
const CENTRO_PADRAO = "carloscrasto";
const comCentro = (keys) => (state.byKey[CENTRO_PADRAO] && prontoP(CENTRO_PADRAO) ? [CENTRO_PADRAO, ...keys.filter((k) => k !== CENTRO_PADRAO)] : keys);
const linhaTem = (l, m) => m.key === CENTRO_PADRAO || l.tem(m) || l.mesas.some((id) => state.mesas.find((x) => x.id === id)?.mentores.includes(m.key));
const prontoP = (k) => state.byKey[k] && state.byKey[k].cerebroPronto !== false;
const ehPers = () => state.linha === "personalizada";
const folhaModo = () => matchMedia(document.documentElement.classList.contains("embed") ? "(max-width: 1099px)" : "(max-width: 1220px)").matches;
const pintaFolha = () => { document.documentElement.classList.toggle("folha", folhaModo()); if (!folhaModo()) fecharPainel(false); };

// ------------------------------------------------------------- tema
const ICON_SOL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const ICON_LUA = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
function setTema(t, guardar = true) {
  document.documentElement.dataset.tema = t;
  $("#themeBtn").innerHTML = t === "escuro" ? ICON_SOL : ICON_LUA;
  if (guardar) { try { localStorage.setItem("mentoria.tema", t); } catch {} }
}
addEventListener("message", (e) => {
  if (!ORIGENS.includes(e.origin)) return;
  const d = e.data;
  if (d && d.tipo === "mentoria-tema" && (d.tema === "claro" || d.tema === "escuro")) setTema(d.tema, false);
  if (d && d.tipo === "mentoria-sala" && typeof d.sala === "string") irParaSala(d.sala);
});

// ------------------------------------------------------------- rosto: retrato ou rosto provisório
function inkFor(hex) { // navy ou branco, o que tiver mais contraste com a cor do mentor
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || ""); if (!m) return "#010E26";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.3 ? "#010E26" : "#ffffff";
}
function faceSvg(s) {
  // rosto provisório: busto em silhueta, no mesmo tom dos retratos (cor do mentor misturada ao navy), iniciais no peito, boca só quando fala
  const c = s.color || "#6E9CE8", t = s.initials || "?";
  const fs = t.length > 1 ? 27 : 32, id = `fb-${s.key}`, ci = "rgba(255,255,255,.92)";
  return `<svg class="fb" viewBox="0 0 200 200" aria-hidden="true">
    <defs><radialGradient id="${id}" cx="40%" cy="30%" r="80%"><stop offset="0" style="stop-color:color-mix(in srgb, ${c} 58%, #1D3360)"/><stop offset="1" style="stop-color:color-mix(in srgb, ${c} 36%, #0C1B3A)"/></radialGradient></defs>
    <path d="M6 200C8 150 50 134 100 134s92 16 94 66z" style="fill:color-mix(in srgb, ${c} 30%, #0C1B3A)"/>
    <path d="M100 138 80 200M100 138l20 62" style="stroke:rgba(255,255,255,.12);stroke-width:2;fill:none"/>
    <rect x="88" y="112" width="24" height="30" rx="10" style="fill:color-mix(in srgb, ${c} 40%, #0C1B3A)"/>
    <ellipse cx="100" cy="80" rx="42" ry="48" fill="url(#${id})" style="stroke:rgba(255,255,255,.14);stroke-width:1.5"/>
    <g class="eyes" style="fill:${ci};opacity:.8"><ellipse cx="86" cy="62" rx="3.6" ry="4.4"/><ellipse cx="114" cy="62" rx="3.6" ry="4.4"/></g>
    <text x="100" y="94" text-anchor="middle" font-size="${fs}" font-weight="700" style="fill:${ci};font-family:Montserrat,'Montserrat Local',Arial,sans-serif;letter-spacing:-1px">${esc(t)}</text>
    <g class="mouth" style="fill:${ci};stroke:${ci}">
      <path class="m-base" d="M90 110H110" fill="none" stroke-width="2.6" stroke-linecap="round" style="opacity:.7"/>
      <ellipse class="m-mid" cx="100" cy="110" rx="7" ry="3.4" stroke="none"/>
      <ellipse class="m-open" cx="100" cy="111" rx="9" ry="7" stroke="none"/>
    </g></svg>`;
}
const bustHtml = (s) => (s.rosto ? SHAPES.map((sh) => `<img class="${sh}" src="${portrait(s.key, sh)}" alt="" draggable="false">`).join("") : faceSvg(s));
const av = (k, cls = "av") => {
  const s = state.byKey[k];
  if (!s) return `<span class="${cls} ini" aria-hidden="true">?</span>`;
  return s.rosto ? `<img class="${cls}" src="${portrait(k)}" alt="" title="${esc(s.short)}">` : `<span class="${cls} ini" style="--c:${esc(s.color)};--ci:${inkFor(s.color)}" title="${esc(s.short)}" aria-hidden="true">${esc(s.initials)}</span>`;
};

// ------------------------------------------------------------- boot
async function boot() {
  setTema(document.documentElement.dataset.tema, false);
  const r = await fetch("/api/mentores").then((x) => x.json());
  state.all = r.mentores; state.byKey = Object.fromEntries(r.mentores.map((s) => [s.key, s]));
  for (const o of r.origensPermitidas || []) if (!ORIGENS.includes(o)) ORIGENS.push(o);
  state.salas = r.salas; state.mesas = r.mesas; state.cerebrosOk = r.cerebrosOk;
  voz.init(r);
  restoreMesa();
  const q = new URLSearchParams(location.search);
  const linhaUrl = q.get("linha"), salaUrl = q.get("sala");
  if (LINHA[linhaUrl]) trocarLinha(linhaUrl);
  else if (salaUrl && state.salas.some((x) => x.id === salaUrl) && SALA_LINHA[salaUrl] && SALA_LINHA[salaUrl] !== state.linha) trocarSala(salaUrl);
  if (q.get("modo") === "conversa") { state.modo = "conversa"; if (state.byKey[q.get("mentor")]) state.conversa = q.get("mentor"); }
  pintaFolha();
  bindUI();
  pintarLinhas();
  new ResizeObserver(() => { layoutStage(); drawLinks(); }).observe($("#stage"));
  addEventListener("resize", pintaFolha);
  startBlinking();
  reset();
  typeIn($("#waiting h2"));
  const ss = await fetch("/api/sessions").then((x) => x.json());
  if (ss.live) attach(ss.live);
  setInterval(watchForLive, 2500);
  setInterval(tickWait, 1000);
}

// um conselho iniciado no Claude Code aparece aqui sozinho
const seenLive = new Set();
async function watchForLive() {
  pollMesa();
  const ss = await fetch("/api/sessions").then((x) => x.json()).catch(() => null);
  const id = ss?.live;
  if (!id || seenLive.has(id) || id === state.session || state.modo === "conversa") return;
  seenLive.add(id);
  attach(id);
}

// chegada: o título digita um caractere por vez
function typeIn(el) {
  if (!el) return;
  const text = el.textContent;
  el.classList.add("typein");
  let i = 0;
  el.innerHTML = text.split(" ").map((word) => `<span class="wd">${[...word].map((c) => `<span class="ch" style="animation-delay:${i++ * 22}ms">${esc(c)}</span>`).join("")}</span>`).join(" ");
  el.setAttribute("aria-label", text);
}

// ------------------------------------------------------------- a mesa: cadeiras e plaquinhas
function arrange(list, salaId) {
  const sala = state.salas.find((x) => x.id === salaId);
  const chefes = sala?.chefes?.length ? sala.chefes : [sala?.chefe];
  const centro = list.find((s) => s.key === CENTRO_PADRAO);
  if (centro && list.length >= 2) {
    const ch = chefes.map((k) => list.find((s) => s.key === k)).filter((s) => s && s !== centro);
    const resto = list.filter((s) => s !== centro && !ch.includes(s));
    const c = Math.floor(list.length / 2), esq = Math.max(0, c - ch.length);
    return [...resto.slice(0, esq), ...ch, centro, ...resto.slice(esq)];
  }
  const meio = chefes.map((k) => list.find((s) => s.key === k)).filter(Boolean);
  if (!meio.length || list.length < 3) return list;
  const rest = list.filter((s) => !meio.includes(s));
  rest.splice(Math.floor((list.length - meio.length + 1) / 2), 0, ...meio);
  return rest;
}
function nomeCurto(nome) {
  let p = String(nome).trim().split(/\s+/).filter((w) => !/^(de|da|do|dos|das|e)$/i.test(w) && !/^[A-ZÀ-Ý]\.$/.test(w));
  let s = p.join(" ");
  if (s.length > 13 && p.length > 2) { s = `${p[0]} ${p[p.length - 1]}`; p = [p[0], p[p.length - 1]]; }
  if (s.length > 13 && p.length === 2) s = `${[...p[0]][0]}. ${p[1]}`;
  return s;
}
function nomeMiudo(nome) { const p = String(nome).trim().split(/\s+/); return p.length > 1 && !/^[A-ZÀ-Ý]\.$/.test(p[0]) ? `${[...p[0]][0]}. ${p[p.length - 1]}` : nome; }
const avisoCusto = (n) => (n > MESA_UMA_FILEIRA ? `Mesa com ${n} mentores gasta cerca de ${Math.round(((n / MESA_UMA_FILEIRA - 1) * 100) / 5) * 5}% a mais da assinatura do que uma de ${MESA_UMA_FILEIRA}. A Rápida gasta bem menos.` : "");
function renderSeats(list, { editar = false, vagas = 0 } = {}) {
  state.seats = list; state.editar = editar; state.vagas = vagas;
  $("#seats").innerHTML = list.map((s, i) => `
    <div class="seat" id="seat-${s.key}" data-seat="${s.key}" draggable="true" title="Arraste para trocar de lugar" style="--d:-${(i * 1.7) % 6}s;animation-delay:${i * 70}ms" tabindex="0" role="button" aria-label="${esc(s.name)}, ${esc(s.pillar)}. Abrir o cartão.">
      <div class="think" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="bust" data-shape="base">${bustHtml(s)}</div>
    </div>`).join("") + Array.from({ length: vagas }, (_, i) => `
    <button type="button" class="seat vaga" id="vaga-${i}" data-vaga="${i}" aria-label="Sentar um mentor" style="animation-delay:${(list.length + i) * 70}ms"><span class="vaga-c" aria-hidden="true">+</span></button>`).join("");
  $("#plates").innerHTML = list.map((s, i) => `
    <div class="nameplate" id="plate-${s.key}" data-seat="${s.key}" draggable="true" title="${esc(s.name)} · arraste para trocar de lugar" style="--c:${esc(s.color)};animation-delay:${i * 70}ms">
      <b><span class="n-full">${esc(s.name)}</span><span class="n-short">${esc(s.short)}</span><span class="n-curto">${esc(nomeCurto(s.short))}</span></b>
      <small>${esc(s.pillar)}</small>
      <div class="meta"><span class="pips"></span><span class="chip" hidden></span><span class="score" hidden></span></div>
      ${editar ? `<button type="button" class="np-x" data-levantar="${s.key}" aria-label="Levantar ${esc(s.name)} da mesa">×</button>` : ""}
    </div>`).join("");
  layoutStage();
}

const slotsFor = (n) => { if (n <= 1) return [0.5]; const step = Math.min(0.2, 0.83 / (n - 1)); return Array.from({ length: n }, (_, i) => 0.5 + (i - (n - 1) / 2) * step); };

function fileirasDe(n, W, narrow) {
  if (n <= MESA_UMA_FILEIRA) return 1;
  const passo = (W * 0.83) / (n - 1);
  return Math.min(narrow ? 4 : 3, Math.max(2, Math.ceil((narrow ? 90 : 128) / passo)));
}

// A mesa é uma elipse vista de frente. As cadeiras ficam na borda do fundo: a do meio é a mais distante
// (mais alta e menor), as das pontas as mais próximas (mais baixas e maiores). Serve de 1 a 7 (MESA_UMA_FILEIRA) cadeiras numa fileira; de 8 a 12 (MAX_CADEIRAS) as cadeiras se alternam em 2 fileiras (até 3 no desktop e 4 no celular, conforme a largura do palco), a de trás mais alta e menor, com as plaquinhas também em linhas.
function layoutStage() {
  const stage = $("#stage");
  const W = stage.clientWidth;
  const narrow = matchMedia("(max-width: 820px)").matches;
  const nSlots = state.seats.length + (state.vagas || 0), R = fileirasDe(nSlots, W, narrow);
  stage.classList.toggle("densa", R > 1);   // antes de ler a altura: a mesa densa pede um palco mais alto (CSS .stage.densa)
  let H = narrow ? Math.round(W * (0.62 + 0.26 * (R - 1))) : stage.clientHeight;   // celular: cada fileira a mais pede mais altura
  if (narrow && R > 1 && document.documentElement.classList.contains("embed")) H = Math.min(H, Math.max(380, innerHeight - 160));
  const cx = W / 2, cy = H * (narrow ? 0.98 : 0.9), rx = W * 0.48, ry = H * (narrow ? 0.46 : 0.42);
  const t = $("#table");
  Object.assign(t.style, { left: `${cx - rx}px`, top: `${cy - ry}px`, width: `${rx * 2}px`, height: `${ry * 2}px` });
  const edge = (x) => cy - ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
  const edgeP = (x) => cy - ry * Math.sqrt(Math.max(0, 1 - Math.min(((x - cx) / rx) ** 2, 0.5)));
  const slots = [...state.seats.map((s) => ({ key: s.key, el: $(`#seat-${s.key}`) })), ...Array.from({ length: state.vagas || 0 }, (_, i) => ({ el: $(`#vaga-${i}`) }))];
  const xs = slotsFor(slots.length);
  state.geo = {};
  const meio = Math.floor(slots.length / 2), fator = (narrow ? [1, 1, 0.58, 0.46, 0.4] : [1, 1, 0.68, 0.58, 0.5])[R], recuo = [1, 0.88, 0.78, 0.7], placas = [];
  stage.style.setProperty("--pw", `${Math.round(Math.max(64, Math.min(170, (W * 0.83 / Math.max(1, slots.length - 1)) * R - 6)))}px`);
  slots.forEach((sl, i) => {
    const x = W * xs[i];
    const d = ((x - cx) / rx) ** 2;
    const f = R === 1 ? 0 : Math.abs(i - meio) % R;   // fileira desta cadeira
    const size0 = H * (R > 1 ? (narrow ? 0.5 + 0.04 * d : 0.37 + 0.035 * d) : narrow ? 0.5 + 0.08 * d : 0.37 + 0.07 * d) * fator * recuo[f];   // 8+ cadeiras: as das pontas crescem menos
    const size = R === 1 ? size0 : Math.min(size0, (W * 0.83 / Math.max(1, slots.length - 1)) * R * 1.45);   // e nenhuma passa de 1,45x a distância entre duas da mesma fileira (tela média: não amontoar)
    const bottom = (f === 0 ? edge(x) : edgeP(x)) + size * 0.2 - (R === 1 ? 0 : f * H * (narrow ? 0.125 : 0.15) * (narrow ? 1 : [0, 0, 1, 0.85, 0.7][R]));
    const el = sl.el; if (!el) return;
    el.classList.toggle("atras", f > 0);
    Object.assign(el.style, { left: `${x - size / 2}px`, top: `${bottom - size}px`, width: `${size}px`, height: `${size}px`, zIndex: R === 1 ? 10 + Math.round(d * 10) : (R - f) * 5 + Math.round(d * 4) });   // fileira de trás sempre atrás (e abaixo de 25, o de quem fala, e de 30, a mesa)
    if (!sl.key) return;
    const s = sl;
    const pl = $(`#plate-${s.key}`);
    pl.style.left = `${x}px`;
    pl.style.top = `${edge(x) + H * 0.01 + (narrow && i % 2 ? 19 : 0)}px`; // a plaquinha cavalga a borda da mesa, sobre o peito (no celular, alternadas em duas linhas)
    if (R > 1) placas.push({ pl, x, y0: edgeP(x) + H * 0.01 + 8 + f * (narrow ? 22 : 31), f });
    state.geo[s.key] = { x, head: bottom - size * 0.72, top: bottom - size * 0.9, size };
  });
  for (const p of placas) { const n = p.pl.querySelector(".n-curto"), sh = state.byKey[p.pl.dataset.seat]?.short; if (n && sh) { n.textContent = nomeCurto(sh); if (n.scrollWidth > n.clientWidth + 1) n.textContent = nomeMiudo(n.textContent); } }
  const postas = [];
  for (const p of placas.sort((a, b) => a.f - b.f)) {
    const w = p.pl.offsetWidth, h = p.pl.offsetHeight; let y = p.y0;
    p.x = Math.max(w / 2 + 3, Math.min(W - w / 2 - 3, p.x)); p.pl.style.left = `${p.x}px`;   // a plaquinha das pontas não sai do palco
    for (let k = 0; k < 80 && postas.some((q) => Math.abs(q.x - p.x) < (q.w + w) / 2 + 2 && Math.abs(q.y - y) < (q.h + h) / 2 + 2); k++) y += 3;
    p.pl.style.top = `${y}px`; postas.push({ x: p.x, y, w, h });
  }
  const c = $("#center");
  if (narrow) {
    stage.style.paddingTop = `${H}px`; // a cena fica no alto; as legendas correm abaixo
  } else {
    stage.style.paddingTop = "";
    // as legendas começam abaixo da plaquinha mais baixa com que poderiam bater
    const inner = state.seats.map((s) => $(`#plate-${s.key}`)).filter((p) => p && (R > 1 ? parseFloat(p.style.left) + p.offsetWidth / 2 > W * 0.2 && parseFloat(p.style.left) - p.offsetWidth / 2 < W * 0.8 : Math.abs(parseFloat(p.style.left) - W / 2) < W * 0.32));
    const base = inner.length ? Math.max(...inner.map((p) => p.offsetTop + p.offsetHeight / 2)) : edge(W / 2) + H * 0.1;
    const top = base + H * 0.035;
    Object.assign(c.style, { left: `${W * 0.2}px`, width: `${W * 0.6}px`, top: `${top}px`, height: `${H - top - H * 0.09}px` });
  }
  if (state.speaking && state.geo[state.speaking]) moveSpot(state.speaking);
}

function moveSpot(key) {
  const g = state.geo[key]; const spot = $("#spot");
  if (!g) { spot.classList.remove("on"); return; }
  spot.style.left = `${g.x}px`;
  spot.style.top = `${g.head}px`;
  spot.style.width = spot.style.height = `${g.size * 1.9}px`;
  spot.classList.add("on");
}

// ------------------------------------------------------------- escolha da mesa (painel, antes de começar)
function mesaPadrao(salaId) {
  const m = state.mesas.find((x) => x.sala === salaId);
  const keys = (m?.mentores || []).filter(prontoP).slice(0, lim());
  return { keys, grupo: m?.grupo || "" };
}
function listaDaLinha(id) {
  const l = LINHA[id] || LINHAS[0];
  if (l.id === "personalizada") return { keys: state.personal.filter(prontoP), grupo: "", sala: state.salaAtiva };
  const m = l.mesas.map((x) => state.mesas.find((y) => y.id === x)).find(Boolean);
  return { keys: comCentro((m?.mentores || []).filter(prontoP)), grupo: m?.grupo || "", sala: m?.sala || l.sala };
}
function mesaDaLinha(id) { const r = listaDaLinha(id); return { ...r, keys: r.keys.slice(0, lim()) }; }
/** Mesa de mentores: o usuário escolhe quantos lugares (1 a 12). Diminuir tira os últimos; aumentar completa com a ordem do grupo (ou com a mesa montada). */
function setLugares(n) {
  if (state.session) return;
  n = Math.max(1, Math.min(MAX_CADEIRAS, Math.round(Number(n)) || LUGARES_PADRAO));
  if (n === state.lugares) return;
  state.lugares = n;
  if (state.mesa.length > n) state.mesa = state.mesa.slice(0, n);
  else for (const k of listaDaLinha(state.linha).keys) { if (state.mesa.length >= n) break; if (!state.mesa.includes(k)) state.mesa.push(k); }
  renderPicker();
}
function pintarLugares() {
  const v = $("#lugaresVal"); if (!v) return;
  const n = lim();
  v.textContent = n;
  $("#lugaresMenos").disabled = n <= 1; $("#lugaresMais").disabled = n >= MAX_CADEIRAS;
  $("#lugaresAjuda").textContent = n === 1 ? "Com 1 lugar, você conversa com um mentor só." : `${n} mentores debatem e votam.`;
  const um = n === 1;
  $("#convocarBtn").textContent = um ? "Chamar o mentor" : "Convocar a mesa";
  $("#decisaoTxt").placeholder = um ? "Traga a sua pergunta ou decisão: o que você precisa decidir, as opções e os seus números." : "Traga a sua decisão: o que você precisa decidir, as opções, seus números e para que lado você pende.";
}
function avisarCorte(n) { if (n > lim()) toast(`Esta mesa tem ${n} mentores e você escolheu ${lim()} ${lim() === 1 ? "lugar" : "lugares"}: sentaram os ${lim() === 1 ? "primeiro" : `${lim()} primeiros`}. Aumente os lugares para ver todos.`); }
function restoreMesa() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem("mentoria.mesa") || "null"); } catch {}
  state.lugares = Number.isInteger(s?.lugares) && s.lugares >= 1 && s.lugares <= MAX_CADEIRAS ? s.lugares : Array.isArray(s?.keys) && s.keys.length ? Math.min(MAX_CADEIRAS, Math.max(1, s.keys.length)) : LUGARES_PADRAO;
  state.rapida = Boolean(s?.rapida);
  state.personal = (Array.isArray(s?.personal) ? s.personal : []).filter(prontoP).slice(0, MAX_CADEIRAS);
  const salaG = state.salas.find((x) => x.id === s?.sala)?.id;
  state.salaAtiva = salaG || state.mesas[0]?.sala || state.salas[0]?.id || "filosofos";
  const linha = LINHA[s?.linha] ? s.linha : SALA_LINHA[state.salaAtiva] || "filosofia";
  trocarLinha(linha);
  const salaDaLinha = state.salas.find((x) => x.id === (salaG || state.salaAtiva));
  const guardada = (Array.isArray(s?.keys) ? s.keys : []).filter(prontoP).filter((k) => linha === "personalizada" || (linhaTem(LINHA[linha], state.byKey[k]) && (k === CENTRO_PADRAO || !salaDaLinha || daSala(state.byKey[k], salaDaLinha)))).slice(0, lim());
  let centroJaVisto = true; try { centroJaVisto = localStorage.getItem("mentoria.centro.v1") === "1"; localStorage.setItem("mentoria.centro.v1", "1"); } catch {}
  if (guardada.length && !centroJaVisto && linha !== "personalizada") guardada.splice(0, guardada.length, ...comCentro(guardada).slice(0, lim()));
  if (guardada.length) {
    state.mesa = guardada;
    if (salaG && linha !== "personalizada") state.salaAtiva = salaG;
    const grupos = state.salas.find((x) => x.id === state.salaAtiva)?.grupos || [];
    state.grupo = grupos.some((g) => g.id === s?.grupo) ? s.grupo : "";
  }
}
function saveMesa() {
  try { localStorage.setItem("mentoria.mesa", JSON.stringify({ keys: state.mesa, sala: state.salaAtiva, grupo: state.grupo, rapida: state.rapida, linha: state.linha, personal: state.personal, lugares: state.lugares })); } catch {}
}
const salaDoPedido = () => (ehPers() ? "" : state.salaAtiva);
const comando = () => {
  const k = state.mesa;
  if (!k.length) return "";
  const sala = salaDoPedido(), grupo = grupoDaMesa();
  return `${SKILL} ${sala ? `--grupo ${sala} ` : ""}${""}--mentores ${k.join(",")}${state.rapida ? " --rapida" : ""} "sua decisão"`;
};

const daSala = (m, sala) => Boolean(m && sala) && (m.sala === sala.id || (Array.isArray(m.salas_extra) && m.salas_extra.includes(sala.id)) || (sala.grupos || []).some((g) => m.grupos?.includes(g.nome)));
const mesaBtn = (m0, attr, on) => { const m = { ...m0, mentores: m0.mentores || m0.keys || [] }; return `
  <button type="button" class="mesa-btn" ${attr} aria-pressed="${on}">
    <b>${esc(m.nome)}</b>${m.para ? `<span>${esc(m.para)}</span>` : ""}<span class="faces">${m.mentores.slice(0, 4).map((k) => av(k)).join("")}${m.mentores.length > 4 ? `<span class="more">+${m.mentores.length - 4}</span>` : ""}</span>
  </button>`; };
const mesmaMesa = (keys) => keys.length === state.mesa.length && keys.every((k) => state.mesa.includes(k));
function lerMinhas() { try { const a = JSON.parse(localStorage.getItem("mentoria.minhas") || "[]"); return Array.isArray(a) ? a.filter((x) => x && typeof x.nome === "string" && Array.isArray(x.keys)).slice(0, MAX_MINHAS) : []; } catch { return []; } }
function gravarMinhas(a) { try { localStorage.setItem("mentoria.minhas", JSON.stringify(a.slice(0, MAX_MINHAS))); } catch {} }
function renderPicker() {
  if (state.session) return;
  if (state.modo === "conversa") return renderListaConversa();
  const l = LINHA[state.linha] || LINHAS[0], pers = l.id === "personalizada";
  const sala = state.salas.find((x) => x.id === state.salaAtiva) || state.salas[0];
  const filtro = pers && LINHA[state.filtroLinha] ? LINHA[state.filtroLinha] : null;
  const busca = fold(state.busca).toLowerCase();
  const lista = state.all.filter((m) => (pers ? !filtro || linhaTem(filtro, m) : linhaTem(l, m)) && (!busca || fold(m.name + " " + m.pillar + " " + m.nucleo).toLowerCase().includes(busca)));
  const cheia = state.mesa.length >= lim();
  const mesas = l.mesas.map((id) => state.mesas.find((x) => x.id === id)).filter(Boolean);
  const semMesa = !pers && !mesas.some((m) => m.mentores.some(prontoP));
  const minhas = pers ? lerMinhas() : [];
  const todosChefes = new Set(state.salas.flatMap((x) => x.chefes || [x.chefe]));
  const chefes = new Set(pers ? [state.mesa.find((k) => todosChefes.has(k))].filter(Boolean) : (sala?.chefes || [sala?.chefe]));
  $("#panelHead").textContent = `Quem senta à mesa (${state.mesa.length} de ${lim()})`;
  $("#feed").innerHTML = `
    <div class="pick">
      <p class="room-sum">${cheia ? `Mesa completa (${lim()} de ${lim()}). Para trocar, arraste um mentor da lista para uma cadeira, tire alguém ou aumente os lugares.` : semMesa ? 'Este grupo ainda não tem mesa pronta. Escolha os mentores em "Monte a sua".' : pers ? `Monte a sua mesa com até ${lim()} mentores, de qualquer grupo.` : esc(sala?.resumo || "")}</p>
      ${pers ? `<div><h4>Minhas mesas</h4>${minhas.length ? `<div class="mesas">${minhas.map((m, i) => `<div class="minha">${mesaBtn(m, `data-minha="${i}"`, mesmaMesa(m.keys))}<button type="button" class="x-btn" data-apagar-minha="${i}" aria-label="Apagar a mesa ${esc(m.nome)}">×</button></div>`).join("")}</div>` : '<p class="room-sum">Nenhuma mesa guardada ainda. Monte a mesa e guarde com um nome.</p>'}
        <form class="guardar" id="guardarForm" autocomplete="off"><label class="sr" for="guardarNome">Nome da mesa</label><input id="guardarNome" maxlength="40" placeholder="Nome da mesa"><button class="pill small" type="submit" ${state.mesa.length ? "" : "disabled"}>Guardar esta mesa</button></form></div>`
      : `<div><h4>Mesas sugeridas</h4>${mesas.length ? `<div class="mesas">${mesas.map((m) => mesaBtn(m, `data-mesa="${m.id}"`, mesmaMesa(m.mentores))).join("")}</div>` : ""}</div>`}
      ${pers ? `<div><h4>Filtrar por grupo</h4><div class="chips">
        <button type="button" data-filtro="" aria-pressed="${!filtro}">Todos os grupos</button>
        ${LINHAS.filter((x) => x.id !== "personalizada").map((x) => `<button type="button" data-filtro="${x.id}" aria-pressed="${filtro?.id === x.id}">${esc(x.nome)}</button>`).join("")}
      </div></div>` : ""}
      <div><h4>Mentores</h4>
        <input type="search" id="pickBusca" placeholder="Buscar por nome ou tema" value="${esc(state.busca)}" aria-label="Buscar mentor">
        <ul class="mentors" style="margin-top:8px">${lista.length ? lista.map((m) => {
          const on = state.mesa.includes(m.key);
          const prep = m.cerebroPronto === false;      // conhecimento em preparo: o rosto aparece, mas não senta
          const off = (!on && cheia) || prep;
          const chefe = chefes.has(m.key);
          return `<li${prep ? "" : ` draggable="true" data-arrastar="${m.key}" title="Arraste para uma cadeira da mesa"`}><label class="mentor ${on ? "on" : ""}" ${off ? 'aria-disabled="true"' : ""}>
            <input type="checkbox" data-mentor="${m.key}" ${on ? "checked" : ""} ${off ? "disabled" : ""}>
            ${av(m.key)}
            <span class="nm"><b>${esc(m.name)}</b><small>${esc(m.pillar)}</small></span>
            <span class="tags">${chefe ? '<span class="chief">anfitrião</span>' : ""}${prep ? '<span class="soon" title="O conhecimento ainda está em preparo">em preparo</span>' : !chefe && !m.rosto ? '<span class="soon" title="O rosto ilustrado ainda não chegou">rosto em breve</span>' : ""}</span>
          </label></li>`;
        }).join("") : '<li class="empty">Nenhum mentor com esse filtro.</li>'}</ul>
      </div>
    </div>`;
  const foot = $("#pickFoot");
  foot.hidden = false;
  foot.innerHTML = `<span><b>${state.mesa.length}</b> de ${lim()} lugares</span>
    <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer" title="4 mentores e 2 rodadas. Usa bem menos da assinatura e sai mais cedo."><input type="checkbox" id="pickRapida" ${state.rapida && lim() > 1 ? "checked" : ""} ${lim() === 1 ? "disabled" : ""} style="accent-color:var(--ink)"> Rápida</label>
    <button class="ghost" type="button" id="pickLimpar" style="padding:4px 12px;min-height:30px">Limpar</button>`;
  paintLobby();
}

// atualiza a mesa e o comando sem refazer o painel (mantém a rolagem e o foco)
function paintLobby() {
  if (state.session || state.modo !== "mesa") return;
  const nM = state.mesa.length, vagas = Math.max(0, lim() - nM);
  const lista = state.mesa.map((k) => state.byKey[k]).filter(Boolean);
  renderSeats(state.manual ? lista : arrange(lista, ehPers() ? null : state.salaAtiva), { editar: true, vagas });   // depois que a pessoa arrasta, vale a ordem dela
  $("#cmdText").textContent = comando();
  $("#cmdBox").hidden = !state.mesa.length;
  let av = $("#custoAviso"); if (!av) { av = document.createElement("p"); av.id = "custoAviso"; av.className = "composer-aviso"; av.setAttribute("role", "note"); $("#composer .composer-row").before(av); } 
  av.textContent = state.rapida ? "" : avisoCusto(nM); av.hidden = !av.textContent;
  $("#convocarBtn").title = state.mesa.length ? "" : "Sem mentores escolhidos, a mesa usa a sugestão da sala";
  const l = LINHA[state.linha];
  const semMesa = !ehPers() && !l.mesas.some((id) => state.mesas.find((x) => x.id === id)?.mentores.some(prontoP));
  const um = lim() === 1 && state.mesa.length === 1;
  { const h2 = $("#waiting h2"); if (h2 && !h2.textContent.startsWith("Mesa em andamento")) h2.textContent = um ? `Traga a sua pergunta para ${state.byKey[state.mesa[0]]?.short || "o mentor"}` : "Traga uma decisão para a mesa"; }
  $("#waitText").textContent = um ? "Escreva a sua pergunta e chame o mentor. Ele responde aqui, ao vivo." : state.mesa.length ? "Escolha quem senta à mesa, escreva a decisão e convoque. A mesa debate aqui, ao vivo." : semMesa ? "Este grupo ainda não tem mesa pronta. Escolha quem senta em Monte a sua." : "A mesa está vazia. Escolha quem senta para debater a sua decisão.";
  const f = $("#pickFoot"); if (f && !f.hidden) { $("b", f).textContent = state.mesa.length; }
  pintarLinhas(); pintarLugares(); paintQuem();
  saveMesa();
}

function pintarLinhas() {
  const seg = $("#linhaSeg"), sel = $("#linhaSelect"); if (!seg) return;
  if (!seg.children.length) {
    seg.innerHTML = LINHAS.map((l) => `<button type="button" role="radio" data-linha="${l.id}" data-sala="${l.sala}">${esc(l.nome)}</button>`).join("");
    sel.innerHTML = LINHAS.map((l) => `<option value="${l.id}">${esc(l.nome)}</option>`).join("");
  }
  $$("button", seg).forEach((b) => { const on = b.dataset.linha === state.linha; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; if (b.dataset.linha === "personalizada") b.dataset.sala = state.salaAtiva; });
  sel.value = state.linha;
  const sala = state.salas.find((x) => x.id === state.salaAtiva);
  $("#linhaSala").textContent = ehPers() ? "" : sala?.nome || "";
  const ativo = $(`[data-linha="${state.linha}"]`, seg);
  if (ativo && !state.linhaRolou) { state.linhaRolou = true; seg.scrollLeft = Math.max(0, ativo.offsetLeft - 40); }
}
/** botão "Quem senta à mesa (n de MAX_CADEIRAS)": só aparece quando o painel é folha */
function paintQuem() {
  const b = $("#quemBtn"); if (!b) return;
  const conv = state.modo === "conversa";
  $("#quemTxt").textContent = state.session ? "Pontos-chave" : conv ? (state.conversa ? "Trocar de mentor" : "Escolha um mentor para conversar.") : `Quem senta à mesa (${state.mesa.length} de ${lim()})`;
}
/** abre o painel (folha, se a tela for estreita) e põe o cursor na busca */
function abrirPainel() {
  const p = $("#painel"); if (!p) return;
  if (folhaModo()) {
    state.voltarFoco = document.activeElement;
    p.classList.add("aberta"); document.documentElement.classList.add("painel-aberto");
    $("#panelScrim").hidden = false; $("#quemBtn").setAttribute("aria-expanded", "true");
  } else p.scrollIntoView({ block: "nearest" });
  setTimeout(() => ($("#pickBusca") || $("#panelClose"))?.focus({ preventScroll: !folhaModo() }), folhaModo() ? 320 : 0);
}
function fecharPainel(devolverFoco = true) {
  const p = $("#painel"); if (!p || !p.classList.contains("aberta")) return;
  p.classList.remove("aberta"); document.documentElement.classList.remove("painel-aberto");
  $("#panelScrim").hidden = true; $("#quemBtn").setAttribute("aria-expanded", "false");
  if (devolverFoco) (state.voltarFoco?.isConnected ? state.voltarFoco : $("#quemBtn"))?.focus();
}
function trocarLinha(id) {
  const l = LINHA[id] || LINHAS[0];
  const pad = mesaDaLinha(l.id);
  state.linha = l.id; state.nucleo = ""; state.busca = ""; state.filtroLinha = "";
  state.manual = false;   // grupo novo senta na ordem dele
  state.mesa = pad.keys; state.grupo = pad.grupo; if (pad.sala) state.salaAtiva = pad.sala;
}
function trocarSala(id) {
  trocarLinha(SALA_LINHA[id] || "filosofia");
  if (state.salas.some((x) => x.id === id)) state.salaAtiva = id;
}
function irParaSala(id) {
  if (state.session || !state.salas.some((x) => x.id === id)) return;
  const l = SALA_LINHA[id];
  if (l !== state.linha || !state.mesa.length) trocarSala(id);
  if (state.modo !== "mesa") { state.modo = "mesa"; return paintModo(); }
  renderPicker();
}
function escolherLinha(id, foco = false) {
  if (state.session || !LINHA[id]) return;
  if (id !== state.linha) trocarLinha(id);
  renderPicker();
  if (foco) $(`#linhaSeg [data-linha="${id}"]`)?.focus();
}
function levantar(k) {
  state.mesa = state.mesa.filter((x) => x !== k);
  if (ehPers()) state.personal = [...state.mesa];
  renderPicker();
}
function onPickClick(e) {
  const t = e.target;
  const mesa = t.closest("[data-mesa]"), nuc = t.closest("[data-nucleo]"), gru = t.closest("[data-grupo]"), fil = t.closest("[data-filtro]"), minha = t.closest("[data-minha]"), apagar = t.closest("[data-apagar-minha]"), conv = t.closest("[data-conversar]");
  if (conv) return escolherMentor(conv.dataset.conversar);
  if (mesa) {
    const m = state.mesas.find((x) => x.id === mesa.dataset.mesa);
    if (m) { state.manual = false; const ks = comCentro(m.mentores.filter(prontoP)); avisarCorte(ks.length); state.mesa = ks.slice(0, lim()); state.salaAtiva = m.sala; state.grupo = m.grupo || ""; return renderPicker(); }
  }
  if (minha) { const m = lerMinhas()[Number(minha.dataset.minha)]; if (m) { state.manual = false; avisarCorte(m.keys.filter(prontoP).length); state.mesa = m.keys.filter(prontoP).slice(0, lim()); state.personal = [...state.mesa]; return renderPicker(); } }
  if (apagar) { const a = lerMinhas(); a.splice(Number(apagar.dataset.apagarMinha), 1); gravarMinhas(a); return renderPicker(); }
  if (fil) { state.filtroLinha = fil.dataset.filtro; return renderPicker(); }
  if (gru) { state.grupo = gru.dataset.grupo; return renderPicker(); }
  if (nuc) { state.nucleo = nuc.dataset.nucleo; return renderPicker(); }
}
function onPickChange(e) {
  const t = e.target;
  if (t.id === "convFiltro") { state.filtroLinha = t.value; return renderPicker(); }
  if (t.dataset.mentor) {
    const k = t.dataset.mentor;
    if (t.checked) { if (state.mesa.length >= lim()) { t.checked = false; return toast(`Mesa cheia (${lim()} de ${lim()}): tire um mentor ou aumente os lugares.`); } state.mesa.push(k); }
    else state.mesa = state.mesa.filter((x) => x !== k);
    if (ehPers()) state.personal = [...state.mesa];
    return renderPicker();
  }
}
function guardarMesa(e) {
  e.preventDefault();
  if (!state.mesa.length) return;
  const nome = ($("#guardarNome")?.value || "").replace(/\s+/g, " ").trim().slice(0, 40) || `Mesa de ${state.byKey[state.mesa[0]]?.short || "mentores"}`;
  const a = lerMinhas().filter((x) => fold(x.nome).toLowerCase() !== fold(nome).toLowerCase());
  if (a.length >= MAX_MINHAS) return toast("Você já guardou 5 mesas. Apague uma para guardar outra.");
  a.unshift({ nome, keys: [...state.mesa] }); gravarMinhas(a);
  toast(`Mesa guardada: ${nome}.`);
  renderPicker();
}

// ------------------------------------------------------------- ditado: falar em vez de digitar (reconhecimento de voz do próprio navegador)
const ditadosAtivos = new Set();
function pararDitado() { for (const r of ditadosAtivos) { try { r.stop(); } catch {} } }
function ligarDitado() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  $$("[data-ditar]").forEach((b) => {
    if (!SR) { b.disabled = true; b.title = "Este navegador não transcreve voz. Use o Chrome, o Edge ou o Safari."; return; }
    let rec = null;
    b.addEventListener("click", () => {
      if (rec) { rec.stop(); return; }
      const ta = $(`#${b.dataset.ditar}`); if (!ta) return;
      rec = new SR(); ditadosAtivos.add(rec); rec.lang = "pt-BR"; rec.interimResults = true; rec.continuous = true;
      const base = ta.value ? ta.value.replace(/\s*$/, " ") : "";
      rec.onresult = (e) => { let t = ""; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; ta.value = (base + t).slice(0, Number(ta.maxLength) || 2000); ta.dispatchEvent(new Event("input", { bubbles: true })); };
      rec.onend = () => { ditadosAtivos.delete(rec); rec = null; b.setAttribute("aria-pressed", "false"); $(".mic-txt", b).textContent = "Falar"; };
      rec.onerror = (e) => { if (e.error === "not-allowed") toast("Libere o microfone no navegador para falar."); };
      b.setAttribute("aria-pressed", "true"); $(".mic-txt", b).textContent = "Parar";
      try { rec.start(); } catch { rec = null; }
    });
  });
}

// ------------------------------------------------------------- interface
// Cadeira para cadeira: os dois trocam de lugar (antes e durante a mesa; durante, só muda onde cada um aparece).
// Da lista ao lado para uma cadeira: o da lista senta e o que estava sai (só antes de convocar). Para uma cadeira vazia "+": senta.
const arraste = { de: null, origem: null };
function alvoDeArraste(e) { return e.target.closest?.("#seats .seat, #plates .nameplate"); }
function chaveDoAlvo(el) { return el?.dataset.seat || null; }
function trocarCadeiras(a, b) {
  if (!a || !b || a === b) return;
  const ia = state.seats.findIndex((s) => s.key === a), ib = state.seats.findIndex((s) => s.key === b);
  if (ia < 0 || ib < 0) return;
  [state.seats[ia], state.seats[ib]] = [state.seats[ib], state.seats[ia]];
  if (!state.session) { state.mesa = state.seats.map((s) => s.key); state.manual = true; if (ehPers()) state.personal = [...state.mesa]; return paintLobby(); }
  layoutStage(); drawLinks();
}
function sentarNaCadeira(novo, alvo) {   // da lista para a mesa (só antes de convocar)
  if (state.session || !novo) return;
  if (state.mesa.includes(novo)) { if (alvo) trocarCadeiras(novo, alvo); return; }
  const m = state.byKey[novo]; if (!m || !prontoP(novo)) return toast(`${m?.name || "Este mentor"} ainda está com o conhecimento em preparo.`);
  const ordem = state.seats.map((s) => s.key);
  if (alvo) { const i = ordem.indexOf(alvo); if (i < 0) return; ordem[i] = novo; toast(`${m.short || m.name} sentou no lugar de ${state.byKey[alvo]?.short || alvo}.`); }
  else { if (ordem.length >= lim()) return toast(`Mesa cheia (${lim()} de ${lim()}): solte o mentor em cima de outro para trocar.`); ordem.push(novo); }
  state.mesa = ordem; state.manual = true;
  if (ehPers()) state.personal = [...state.mesa];
  renderPicker();
}
function ligarArraste() {
  const stage = $("#stage");
  // quem pode ser arrastado: cadeira, plaquinha e mentor da lista
  document.addEventListener("dragstart", (e) => {
    const cad = e.target.closest?.("#seats .seat[data-seat], #plates .nameplate[data-seat]");
    const item = e.target.closest?.("[data-arrastar]");
    if (!cad && !item) return;
    arraste.de = cad ? cad.dataset.seat : item.dataset.arrastar;
    arraste.origem = cad ? "mesa" : "lista";
    if (arraste.origem === "lista" && state.session) { e.preventDefault(); arraste.de = null; return; }
    try { e.dataTransfer.setData("text/plain", arraste.de); e.dataTransfer.effectAllowed = "move"; } catch {}
    stage.classList.add("arrastando");
  });
  document.addEventListener("dragend", () => { arraste.de = null; arraste.origem = null; stage.classList.remove("arrastando"); $$(".seat.alvo, .nameplate.alvo").forEach((x) => x.classList.remove("alvo")); });
  stage.addEventListener("dragover", (e) => {
    if (!arraste.de) return;
    const el = alvoDeArraste(e);
    if (!el || chaveDoAlvo(el) === arraste.de) return;
    if (el.classList.contains("vaga") && (arraste.origem !== "lista" || state.session)) return;
    e.preventDefault(); e.dataTransfer.dropEffect = "move";
    $$(".seat.alvo, .nameplate.alvo").forEach((x) => x !== el && x.classList.remove("alvo"));
    el.classList.add("alvo");
  });
  stage.addEventListener("dragleave", (e) => { const el = alvoDeArraste(e); if (el && !el.contains(e.relatedTarget)) el.classList.remove("alvo"); });
  stage.addEventListener("drop", (e) => {
    if (!arraste.de) return;
    const el = alvoDeArraste(e); if (!el) return;
    e.preventDefault();
    const alvo = chaveDoAlvo(el);
    if (arraste.origem === "mesa") trocarCadeiras(arraste.de, alvo);
    else sentarNaCadeira(arraste.de, el.classList.contains("vaga") ? null : alvo);
  });
}

function bindUI() {
  const openFrom = (e) => { const b = e.target.closest("[data-seat]"); if (b) openCard(b.dataset.seat, undefined, { ler: true }); };
  $("#seats").addEventListener("click", (e) => { if (e.target.closest("[data-vaga]")) return abrirPainel(); openFrom(e); });
  $("#plates").addEventListener("click", (e) => { const x = e.target.closest("[data-levantar]"); if (x) { e.stopPropagation(); return levantar(x.dataset.levantar); } openFrom(e); });
  const realce = (e, on) => { const k = e.target.closest?.("[data-seat]")?.dataset.seat; if (!k || !$("#stage").classList.contains("densa")) return; $(`#seat-${k}`)?.classList.toggle("realce", on); $(`#plate-${k}`)?.classList.toggle("realce", on); };
  for (const id of ["#seats", "#plates"]) { const el = $(id); el.addEventListener("pointerover", (e) => realce(e, true)); el.addEventListener("pointerout", (e) => realce(e, false)); el.addEventListener("focusin", (e) => realce(e, true)); el.addEventListener("focusout", (e) => realce(e, false)); }
  $("#seats").addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && !e.target.closest("[data-vaga]")) { e.preventDefault(); openFrom(e); } });
  $("#modoSel").addEventListener("click", (e) => { const b = e.target.closest("[data-modo]"); if (b) setModo(b.dataset.modo); });
  $("#linhaSeg").addEventListener("click", (e) => { const b = e.target.closest("[data-linha]"); if (b) escolherLinha(b.dataset.linha); });
  $("#linhaSelect").addEventListener("change", (e) => escolherLinha(e.target.value));
  $("#lugaresMenos").addEventListener("click", () => setLugares(lim() - 1));
  // Mesa de mentores: "Debater mais com" (veredito) abre a conversa com aquele mentor, levando o tema da mesa
  $("#verdictBody").addEventListener("click", (e) => { const b = e.target.closest("[data-debater]"); if (!b) return; state.temaSessao = state.session || state.temaSessao; $("#verdictSheet").hidden = true; setModo("conversa", { mentor: b.dataset.debater }); });
  $("#convVoltar")?.addEventListener("click", () => setModo("mesa"));
  ligarDitado(); ligarArraste();
  $("#lugaresMais").addEventListener("click", () => setLugares(lim() + 1));
  const setas = (box, attr, ir) => box.addEventListener("keydown", (e) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return;
    const bs = $$(`[${attr}]`, box), i = bs.findIndex((b) => b.getAttribute("aria-checked") === "true");
    e.preventDefault(); ir(bs[(i + d + bs.length) % bs.length]);
  });
  setas($("#linhaSeg"), "data-linha", (b) => escolherLinha(b.dataset.linha, true));
  setas($("#modoSel"), "data-modo", (b) => { setModo(b.dataset.modo); $(`#modoSel [data-modo="${b.dataset.modo}"]`)?.focus(); });
  $("#quemBtn").addEventListener("click", abrirPainel);
  $("#panelClose").addEventListener("click", () => fecharPainel());
  $("#panelScrim").addEventListener("click", () => fecharPainel());
  $("#painel").addEventListener("keydown", (e) => {   // foco preso na folha aberta
    if (e.key !== "Tab" || !$("#painel").classList.contains("aberta")) return;
    const fs = $$('button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]', $("#painel")).filter((x) => x.offsetParent !== null);
    if (!fs.length) return;
    if (e.shiftKey && document.activeElement === fs[0]) { e.preventDefault(); fs[fs.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === fs[fs.length - 1]) { e.preventDefault(); fs[0].focus(); }
  });
  $("#feed").addEventListener("submit", (e) => { if (e.target.id === "guardarForm") guardarMesa(e); });
  $("#verdictBtn").addEventListener("click", abrirVeredito);
  $("#stepVerdict").addEventListener("click", () => { if (state.verdict) $("#verdictSheet").hidden = false; });
  $("#stepVerdict").addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && state.verdict) { e.preventDefault(); $("#verdictSheet").hidden = false; } });
  const mais = (abrir) => { $("#maisMenu").hidden = !abrir; $("#maisBtn").setAttribute("aria-expanded", String(abrir)); };
  $("#maisBtn").addEventListener("click", (e) => { e.stopPropagation(); mais($("#maisMenu").hidden); if (!$("#maisMenu").hidden) $("#maisMenu button")?.focus(); });
  $("#maisMenu").addEventListener("click", (e) => {
    const b = e.target.closest("[data-mais]"); if (!b) return; mais(false);
    if (b.dataset.mais === "guide") openGuide(); else if (b.dataset.mais === "history") openHistory(); else setTema(document.documentElement.dataset.tema === "escuro" ? "claro" : "escuro");
  });
  document.addEventListener("click", (e) => { if (!e.target.closest("#maisCtl")) mais(false); });
  bindConversa();
  $("#feed").addEventListener("click", (e) => {
    const c = e.target.closest(".feed-card");
    if (c) return openCard(c.dataset.seat, Number(c.dataset.round));
    if (!state.session) onPickClick(e);
  });
  $("#pickFoot").addEventListener("change", (e) => { if (e.target.id === "pickRapida" && e.target.checked && state.mesa.length > 4) toast("A mesa rápida usa 4 mentores. O Mediador escolhe quais ficam."); });
  $("#feed").addEventListener("change", (e) => { if (!state.session) onPickChange(e); });
  $("#feed").addEventListener("input", (e) => { if (e.target.id === "pickBusca") { state.busca = e.target.value; const pos = e.target.selectionStart; renderPicker(); const i = $("#pickBusca"); i?.focus(); i?.setSelectionRange(pos, pos); } });
  $("#pickFoot").addEventListener("click", (e) => { if (e.target.id === "pickLimpar") { state.mesa = []; state.manual = false; renderPicker(); } });
  $("#pickFoot").addEventListener("change", (e) => { if (e.target.id === "pickRapida") { state.rapida = e.target.checked; paintLobby(); } });
  $("#cmdCopy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("#cmdText").textContent); toast("Comando copiado. Cole no Claude Code e escreva a sua decisão no lugar do texto entre aspas."); }
    catch { toast("A cópia não funcionou aqui. Selecione o texto e copie."); }
  });
  $("#guideBtn").addEventListener("click", openGuide);
  $("#vozBtn").addEventListener("click", () => voz.alternar());
  $("#vozVol").addEventListener("input", (e) => voz.volume(Number(e.target.value) / 100));
  $("#idleHist").addEventListener("click", openHistory);
  $("#cardDialog").addEventListener("close", () => { voz.stop(); const f = $("#cardBody .card-head img.av"); if (f) f.src = portrait(f.dataset.seat || "", "base"); });
  bindMesa();
  document.addEventListener("click", () => voz.liberado(), true);
  $("#themeBtn").addEventListener("click", () => setTema(document.documentElement.dataset.tema === "escuro" ? "claro" : "escuro"));
  document.addEventListener("click", async (e) => {
    if (e.target.closest("[data-copy-example]")) {
      try { await navigator.clipboard.writeText(EXEMPLO); toast("Copiado. Cole na caixa da decisão e troque pelos seus números."); }
      catch { toast("A cópia não funcionou aqui. Selecione o texto e copie."); }
    }
    if (e.target.closest("[data-pdf]")) savePdf(e.target.closest("[data-pdf]"));
  });
  $("#historyBtn").addEventListener("click", openHistory);
  $("#newBtn").addEventListener("click", reset);
  $("#verdictSheet").addEventListener("click", (e) => {
    if (e.target.id === "verdictSheet" || e.target.closest("[data-close]")) { $("#verdictSheet").hidden = true; pararVeredito(); }
    const ov = e.target.closest("[data-ouvir-veredito]"); if (ov) ouvirVeredito(ov);
    const rv = e.target.closest("[data-rever]"); if (rv) { $("#verdictSheet").hidden = true; replay(rv.dataset.rever); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("#maisMenu").hidden) { $("#maisMenu").hidden = true; $("#maisBtn").setAttribute("aria-expanded", "false"); return $("#maisBtn").focus(); }
    if (!$("#verdictSheet").hidden) { $("#verdictSheet").hidden = true; pararVeredito(); return; }
    if ($("#painel").classList.contains("aberta")) fecharPainel();
  });
  // Clicar no fundo escurecido em volta do cartão, do guia ou do histórico fecha (Esc já fechava).
  // Apertar e soltar precisam cair fora da caixa: arrastar uma seleção de texto para fora não fecha.
  $$("dialog.card-dialog").forEach((d) => {
    const fora = (e) => {
      const r = d.getBoundingClientRect();
      return e.target === d && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom);
    };
    let apertouFora = false;
    d.addEventListener("pointerdown", (e) => { apertouFora = fora(e); });
    d.addEventListener("click", (e) => { if (apertouFora && fora(e)) d.close(); apertouFora = false; });
  });
  $$(".speed button").forEach((b) => b.addEventListener("click", () => {
    player.speed = Number(b.dataset.speed);
    voz.taxa();
    $$(".speed button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  }));
  $("#skipBtn").addEventListener("click", () => player.skip());
}

// ------------------------------------------------------------- o tocador
// Todo evento passa por uma fila ordenada. Os mentores falam um de cada vez, num ritmo legível,
// mesmo que o Claude Code escreva todos os cartões da rodada ao mesmo tempo. "Pular adiante"
// esvazia a fila na hora; o que chegar depois volta a ser animado.
const player = {
  q: [], busy: false, epoch: 0, speed: 1, fast: false, timers: new Set(),
  push(ev) { this.q.push(ev); this.info(); this.pump(); },
  async pump() {
    if (this.busy) return;
    this.busy = true;
    const my = this.epoch;
    while (this.q.length && my === this.epoch) {
      const ev = this.q.shift();
      this.info();
      hideWait();
      try { await handle(ev); } catch (e) { console.error(e); }
    }
    if (my === this.epoch) { this.busy = false; this.fast = false; this.info(); }
  },
  sleep(ms) {
    if (this.fast || ms <= 0) return Promise.resolve();
    return new Promise((res) => { const t = setTimeout(() => { this.timers.delete(o); res(); }, ms / this.speed); const o = { t, res }; this.timers.add(o); });
  },
  flushTimers() { for (const o of this.timers) { clearTimeout(o.t); o.res(); } this.timers.clear(); },
  skip() { this.fast = true; voz.stop(); this.flushTimers(); },
  reset() { this.epoch++; voz.stop(); this.q.length = 0; this.fast = true; this.flushTimers(); this.busy = false; this.fast = false; this.info(); },
  info() {
    const waiting = this.q.filter((e) => e.type === "seat_done").length;
    $("#queueInfo").textContent = waiting ? `${waiting} ${waiting === 1 ? "fala" : "falas"} na fila` : "";
  },
};

// ------------------------------------------------------------- sessão
function reset() {
  state.es?.close();
  player.reset();
  Object.assign(state, { session: null, options: [], weights: {}, active: [], round: 0, cards: { 1: {}, 2: {}, 3: {} }, replaying: false, verdict: null, links: [], speaking: null, setup: null, wait: null });
  hideWait();
  $("#stage").classList.remove("live");
  $("#topic").hidden = true; medirTopo();
  $("#waiting").hidden = false;
  $("#mesaDock").hidden = false;
  $("#caption").hidden = true;
  $("#cruxes").hidden = true;
  $("#plate").hidden = true;
  $("#playbar").hidden = true;
  $("#newBtn").hidden = true;
  $("#verdictSheet").hidden = true;
  $("#spot").classList.remove("on");
  $$(".stepper li").forEach((li) => li.classList.remove("active", "done")); state.solo = false; $(".stepper")?.classList.remove("solo");
  $$(".vote").forEach((b) => b.remove());
  drawLinks();
  paintModo();
}

function paintModo() {
  const conv = state.modo === "conversa", ses = Boolean(state.session);
  $$("#modoSel [data-modo]").forEach((b) => { const on = b.dataset.modo === state.modo; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  $("#linhaWrap").hidden = conv || ses;
  $("#lugaresWrap").hidden = conv || ses;   // lugares só se escolhem antes de começar
  $("#stage").classList.toggle("conversa", conv && !ses);
  pintarPassoVeredito();
  if (ses) return paintQuem();
  $("#stepMini").hidden = true;
  $("#mesaDock").hidden = conv;
  $("#convDock").hidden = !conv;
  $("#caption").hidden = true;
  setSpeaker(null);
  if (conv) { $("#pickFoot").hidden = true; pintarConversa(); }
  else {
    pararAsk();
    $("#waiting").hidden = false; $("#waitText").hidden = false;
    const h2 = $("#waiting h2"); if (!h2.textContent.startsWith("Mesa em andamento")) h2.textContent = "Traga uma decisão para a mesa";
    $("#waiting .pulse").hidden = false;
  }
  renderPicker();
  if (!conv) paintMesa();
  paintQuem();
}
function setModo(modo, { mentor } = {}) {
  if (modo !== "mesa" && modo !== "conversa") return;
  const mudou = modo !== state.modo || (mentor && mentor !== state.conversa);
  if (!mudou && !state.session) return;
  voz.stop(); pararAsk();
  state.modo = modo; state.busca = ""; state.filtroLinha = "";
  if (mentor && state.byKey[mentor]) state.conversa = mentor;
  if (state.session) reset(); else paintModo();
}

function begin(id) {
  state.es?.close();
  player.reset();
  state.exemplo = false;
  Object.assign(state, { session: id, options: [], weights: {}, active: [], round: 0, cards: { 1: {}, 2: {}, 3: {} }, replaying: false, verdict: null, links: [], speaking: null, setup: null, wait: null });
  hideWait();
  $$(".stepper li").forEach((li) => li.classList.remove("active", "done")); state.solo = false; $(".stepper")?.classList.remove("solo");
  $("#verdictSheet").hidden = true;
  $("#cruxes").hidden = true;
  $("#plate").hidden = true;
  renderSeats([]); // as cadeiras aparecem quando a pauta chega
  $("#waiting").hidden = true;
  $("#mesaDock").hidden = true;
  $("#newBtn").hidden = false;
  $("#playbar").hidden = false;
  $("#pickFoot").hidden = true;
  $("#convDock").hidden = true;
  pararAsk();
  paintModo();
  $("#panelHead").textContent = "Pontos-chave";
  $("#feed").innerHTML = '<div class="empty">Uma linha por mentor enquanto a mesa fala. Clique em um mentor para ler o cartão inteiro.</div>';
  $("#stage").classList.add("live");
  chairSays("Os mentores estão tomando seus lugares", { dots: true });
}

function attach(id) {
  begin(id);
  const es = new EventSource(`/api/stream/${id}`);
  state.es = es;
  es.onmessage = (m) => {
    const ev = JSON.parse(m.data);
    if (ev.type === "end") { es.close(); return; }
    if (["delta", "usage", "seat_error"].includes(ev.type)) return;
    player.push(ev);
  };
  es.onerror = () => { };
}

// ------------------------------------------------------------- eventos
const STEP_OF = { setup: "setup", round1: "round1", cruxes: "cruxes", round2: "round2", draft: "round3", round3: "round3", skip3: "round3", verdict: "verdict" };
const ORDER = ["setup", "round1", "cruxes", "round2", "round3", "verdict"];

function setStep(step) {
  const ordem = state.solo ? ORDER.filter((s) => !["cruxes", "round2", "round3"].includes(s)) : ORDER;
  const idx = ordem.indexOf(step);
  $$(".stepper li").forEach((li) => {
    const i = ordem.indexOf(li.dataset.step);
    li.classList.toggle("done", i >= 0 && i < idx);
    li.classList.toggle("active", i === idx);
  });
  const li = $(`.stepper li[data-step="${step}"]`);
  $("#stepMini").textContent = idx >= 0 && li ? `Passo ${idx + 1} de ${ordem.length} · ${li.textContent}` : "";
  $("#stepMini").hidden = idx < 0;
}
function pintarPassoVeredito() {
  const li = $("#stepVerdict"), on = Boolean(state.verdict);
  li.classList.toggle("link", on);
  if (on) { li.setAttribute("role", "button"); li.tabIndex = 0; li.title = "Abrir o veredito"; } else { li.removeAttribute("role"); li.removeAttribute("tabindex"); li.removeAttribute("title"); }
}

async function handle(ev) {
  switch (ev.type) {
    case "phase": {
      state.wait = { phase: ev.phase, at: ev.at || Date.now() };
      setStep(STEP_OF[ev.phase] || "setup");
      const label = PHASE_LABEL[ev.phase] || ev.label || "";
      feedPhase(label);
      const thinking = ["setup", "cruxes", "draft", "verdict"].includes(ev.phase);
      if (thinking || ev.phase === "skip3") {
        chairSays(label.replace(/^O Mediador está /, "").replace(/^./, (c) => c.toUpperCase()), { dots: thinking });
        await player.sleep(1400);
      }
      break;
    }
    case "setup": state.solo = (ev.seats || []).length === 1; $(".stepper")?.classList.toggle("solo", state.solo); state.setup = ev; onSetup(ev); await player.sleep(1800); break;
    case "round_start": onRoundStart(ev.round); break;
    case "seat_start": $(`#seat-${ev.seat}`)?.classList.add("thinking"); break;
    case "seat_done": await onSeatDone(ev); break;
    case "round_done": state.wait = null; updateOptions(ev.scores); break;
    case "cruxes": await onCruxes(ev); break;
    case "draft": await onDraft(ev.draft); break;
    case "verdict": state.wait = null; onVerdict(ev); break;
    case "error": state.wait = null; toast(`A mesa parou: ${ev.error}`); chairSays(`A mesa parou: ${ev.error}`); break;
  }
}

/** altura da faixa fixa do tema: o painel lateral para logo abaixo dela */
function medirTopo() { requestAnimationFrame(() => { const t = $("#topic"); document.documentElement.style.setProperty("--topic-h", t && !t.hidden ? `${Math.ceil(t.getBoundingClientRect().height) + 12}px` : "0px"); }); }
addEventListener("resize", () => medirTopo());

function onSetup(ev) {
  state.options = ev.options;
  state.weights = ev.weights;
  state.active = ev.seats;
  renderSeats(arrange(ev.seats.map((k) => state.byKey[k]).filter(Boolean), ev.sala || state.salas.find((x) => ev.seats.includes(x.chefe))?.id));
  if (ev.seats.length > MESA_UMA_FILEIRA) requestAnimationFrame(() => { const st = $("#stage"); window.scrollTo({ top: Math.max(0, st.getBoundingClientRect().top + window.scrollY - (document.documentElement.classList.contains("embed") ? 8 : innerWidth <= 820 ? 126 : 64)) }); });
  $("#topic").hidden = false;
  $("#exBadge").hidden = !state.exemplo;
  $("#topicTitle").textContent = ev.title;
  typeIn($("#topicTitle"));
  // a dúvida que está sendo decidida fica sempre visível junto com o tema (faixa fixa no topo)
  const duvida = String(ev.decision || ev.prompt || "").split(/\n\s*\nPergunta do Mediador:/)[0].trim();
  $("#topicDuvida").textContent = duvida ? `A dúvida: ${duvida}` : ""; $("#topicDuvida").hidden = !duvida;
  medirTopo();
  $("#options").innerHTML = ev.options.map((o) => `
    <div class="opt" data-opt="${esc(o.id)}"><span class="id">${esc(o.id)}</span><span class="label">${esc(o.label)}</span><span class="val">-</span><span class="bar"><i></i></span></div>`).join("");
  for (const s of state.seats) {
    const w = ev.weights[s.key]?.weight || 1;
    $(`#plate-${s.key}`).title = `Peso ${w} de 3: ${ev.weights[s.key]?.reason || ""}`;
  }
  chairSays(ev.title, { tag: ev.mode === "quick" ? "Mesa rápida" : "Mesa completa" });
}

function updateOptions(scores) {
  const best = Object.entries(scores).sort((a, b) => (b[1].score ?? 0) - (a[1].score ?? 0))[0]?.[0];
  for (const [id, v] of Object.entries(scores)) {
    const el = $(`.opt[data-opt="${id}"]`); if (!el) continue;
    $(".val", el).textContent = v.score ?? "-";
    $(".bar i", el).style.width = `${(v.score || 0) * 10}%`;
    el.classList.toggle("lead", id === best);
    el.title = v.math;
  }
}

function onRoundStart(round) {
  state.round = round;
  state.links = [];
  drawLinks();
  $("#cruxes").hidden = true;
  chairSays(["", "Rodada 1: posições de abertura", "Rodada 2: o debate", "Rodada 3: a votação"][round], { dots: true, tag: "A palavra está aberta" });
}

// ------------------------------------------------------------- falas
const clean = (t) => String(t || "").replace(/\s*\((?:S\d+|fonte[^)]*|source[^)]*)[^)]*\)/gi, "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();

function firstSentences(t, max) {
  const parts = t.match(/[^.!?]+[.!?]+["”)]?\s*|[^.!?]+$/g) || [t];
  let out = "";
  for (const p of parts) { if (out && (out + p).length > max) break; out += p; }
  return shorten(out.trim(), max + 40);
}

/** A linha que o mentor diz em voz alta: a manchete do cartão, não o cartão inteiro. */
function lineFor(round, p, max = 170) {
  if (round === 1) return firstSentences(clean(p.call || p.stance), max);
  if (round === 2) {
    let t = clean(p.disagreeLine || p.stance);
    // "Graham. O argumento dele..." soa como falar com ele: "Graham, o argumento dele..."
    t = t.replace(/^([A-Za-zÀ-ÿ][\wÀ-ÿ.' ]{0,24})[.:,]\s+(\S+)/, (m, name, next) => { const k = seatKeyC(name); return !k ? m : `${state.byKey[k].short}, ${/^(I'|I$|Eu\b)/.test(next) ? next : next[0].toLowerCase() + next.slice(1)}`; });
    return firstSentences(t, max);
  }
  return firstSentences(clean(p.oneLine || p.amendment), max);
}

function shapesFor(word) {
  const out = [];
  for (const ch of fold(word).toLowerCase()) {
    const s = "aei".includes(ch) ? "open" : "ouwy".includes(ch) ? "mid" : "mbpf".includes(ch) ? "base" : null;
    if (s && s !== out[out.length - 1]) out.push(s);
  }
  return out.length ? out : ["mid"];
}

function setShape(key, shape) {
  // polimento de acessibilidade: com "menos movimento" a boca fica fechada em todos os ramos (ritmo do texto, reserva e áudio com energia)
  try { if (matchMedia("(prefers-reduced-motion: reduce)").matches) shape = "base"; } catch {}
  const b = $(`#seat-${key} .bust`); if (b) b.dataset.shape = shape;
  const f = $("#cardBody .card-head img.av"); if (f && f.dataset.seat === key && $("#cardDialog").open) f.src = portrait(key, shape);   // o cartão aberto também mexe a boca
}

function setSpeaker(key, target) {
  state.speaking = key;
  $$(".seat").forEach((el) => { el.classList.toggle("speaking", el.dataset.seat === key); el.classList.toggle("addressed", el.dataset.seat === target); });
  $$(".nameplate").forEach((el) => el.classList.toggle("speaking", el.dataset.seat === key));
  const el = key && $(`#seat-${key}`);
  if (el) {
    el.classList.remove("thinking");
    // inclina o corpo para quem está respondendo
    const g = state.geo[key], tg = target && state.geo[target];
    el.style.transform = tg ? `translateX(${Math.sign(tg.x - g.x) * g.size * 0.04}px) rotate(${Math.sign(tg.x - g.x) * 2.5}deg) scale(1.05)` : "scale(1.05)";
    moveSpot(key);
  } else $("#spot").classList.remove("on");
  $$(".seat").forEach((s) => { if (s.dataset.seat !== key) s.style.transform = ""; });
}

function captionFor(who) {
  $("#cruxes").hidden = true;
  $("#plate").hidden = true;
  const c = $("#caption");
  c.hidden = false;
  c.style.animation = "none"; void c.offsetWidth; c.style.animation = "";
  const s = state.byKey[who];
  $("#capAv").className = `cap-av${s ? "" : " chair"}`;
  $("#capAv").innerHTML = s ? av(who) : '<img src="brand/crasto-monogram-white.png" alt="">';
  $("#capWho").textContent = s ? s.name : "O Mediador";
}

function chairSays(text, { dots = false, tag = "" } = {}) {
  setSpeaker(null);
  captionFor(null);
  $("#capTag").textContent = tag;
  const p = $("#capText");
  p.className = "cap-text chair";
  p.innerHTML = esc(text) + (dots ? '<span class="dots"><i></i><i></i><i></i></span>' : "");
  $("#capSub").textContent = "";
}

// ------------------------------------------------------------- a voz dos mentores (voz do Mac, gerada pelo servidor da sala)
// Um mentor por vez. A tela pede o áudio da voz do Mac ao servidor (GET /api/voz/...), que guarda cada frase em cache.
const MOTIVO_VOZ = {
  "dado-de-cliente": "Esta fala tem dado sensível e não vai à voz. Ela segue por escrito.",
  "numero-sensivel": "Esta fala tem dado sensível e não vai à voz. Ela segue por escrito.",
  segredo: "Esta fala tem dado sensível e não vai à voz. Ela segue por escrito.",
  "teto-diario": "O limite diário de voz foi atingido: seguindo só com legenda.",
  desligada: "A voz não está disponível agora. A fala segue por legenda.",
  falha: "A voz não está disponível agora. A fala segue por legenda.",
};
// motivos do servidor em que a fala fica SÓ na legenda (não cai na voz do navegador)
const SO_LEGENDA = new Set(["numero-sensivel", "segredo", "dado-de-cliente", "teto-diario"]);
const ICO_VOZ = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
const ICO_MUDO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></svg>';
const ICO_PLAY = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';
const ICO_STOP = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg>';

// Vozes humanas: a melhor voz do sistema para o gênero do mentor. Ordem: neural/natural (Edge), Premium ou Aprimorada (Mac, iPhone),
// a voz padrão do sistema (Luciana, Felipe, Maria, Daniel, Google). As vozes de efeito (robóticas) só entram se não houver outra.
// Ninguém é clonado: o ritmo e o tom mudam um pouco por mentor para cada um soar diferente.
const FEMININAS = new Set([]);
const VOZ_MENTOR = {socrates: ["grandpa", 0.9, 0.85], platao: ["felipe", 0.95, 0.95], aristoteles: ["reed", 1.0, 0.95], seneca: ["felipe", 1.05, 1.0], epicteto: ["rocko", 0.95, 0.9], marcoaurelio: ["reed", 0.9, 0.9], confucio: ["grandpa", 0.85, 0.9], nietzsche: ["eddy", 1.05, 0.95], bauman: ["grandpa", 0.9, 0.9], orwell: ["reed", 1.0, 1.1], jung: ["grandpa", 0.9, 0.8], frankl: ["grandpa", 1.05, 0.95], kahneman: ["grandpa", 0.85, 1.0], hellinger: ["grandpa", 0.8, 0.9], erickson: ["grandpa", 0.75, 0.85], elman: ["rocko", 1.1, 1.0], lowen: ["reed", 0.95, 0.95], munger: ["grandpa", 0.85, 0.8], bengraham: ["felipe", 0.9, 0.95], fisher: ["grandpa", 0.95, 0.95], bogle: ["grandpa", 1.0, 0.9]};

const VOZ_ROBO = /^(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|kathy|ralph)\b/;
const VOZ_FEM = /luciana|fernanda|joana|francisca|thalita|maria|let[ií]cia|brenda|elza|giovanna|leila|manuela|yara|raquel|catarina|helena|google portugu/;
const VOZ_MASC = /felipe|ant[oô]nio|daniel|donato|f[aá]bio|humberto|j[uú]lio|nicolau|val[eé]rio|cristiano|duarte|macerio/;
const vozQualidade = (n) => (VOZ_ROBO.test(n) ? 0 : /natural|neural/.test(n) ? 3 : /premium|enhanced|aprimorad|melhorad|siri/.test(n) ? 2 : 1);
const PREF_EN = ["samantha", "daniel", "alex", "karen"];
const hashChave = (k) => [...String(k)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7);

const voz = {
  chave: false, motivo: "", nativa: false, ligada: false, vol: 0.7, cur: null, tok: 0, avisou: new Set(), sis: [],
  init(r) {
    this.chave = Boolean(r.vozChave && r.vozLigada);
    this.nativa = typeof speechSynthesis !== "undefined" && typeof SpeechSynthesisUtterance !== "undefined";
    if (this.nativa) { this.carregarVozes(); try { speechSynthesis.addEventListener("voiceschanged", () => this.carregarVozes()); } catch {} }
    let v = null, vol = null;
    try { v = localStorage.getItem("mentoria.voz"); vol = localStorage.getItem("mentoria.voz.vol"); } catch {}
    if (vol !== null && Number.isFinite(Number(vol))) this.vol = Math.min(1, Math.max(0, Number(vol)));
    this.ligada = this.pode() && v !== "0";
    $("#vozVol").value = Math.round(this.vol * 100);
    $("#vozCtl").hidden = false;
    this.pintar();
  },
  pode() { return this.chave || this.nativa; },
  carregarVozes() { try { this.sis = speechSynthesis.getVoices().map((x) => { const nome = String(x.name || "").toLowerCase(); return { x, lang: String(x.lang || "").replace("_", "-").toLowerCase(), nome, q: vozQualidade(nome), g: VOZ_FEM.test(nome) ? "f" : VOZ_MASC.test(nome) ? "m" : "" }; }); } catch { this.sis = []; } },
  /** a voz do sistema para este mentor: preferida pelo nome, senão qualquer pt-BR, senão qualquer pt. Sem nenhuma, null (a tela segue só com legenda). */
  escolherVoz(key, lang = "pt-BR") {
    if (!this.sis.length) this.carregarVozes();
    const en = lang.startsWith("en");
    const dela = this.sis.filter((x) => x.lang.startsWith(en ? "en" : "pt"));
    if (!dela.length) return null;
    const pt = dela.filter((x) => en || x.lang === "pt-br");
    const lista = (pt.length ? pt : dela).filter((x) => x.q > 0);
    const base = lista.length ? lista : (pt.length ? pt : dela);
    if (en) return (base.sort((a, b) => b.q - a.q)[0] || dela[0]).x;
    const quer = FEMININAS.has(key) ? "f" : "m";
    const nota = (x) => x.q * 10 + (x.g === quer ? 25 : x.g === "" ? 10 : 0);   // gênero certo vem antes da qualidade
    const topo = Math.max(...base.map(nota));
    const melhores = base.filter((x) => nota(x) === topo);
    return melhores[hashChave(key) % melhores.length].x;
  },
  pintar() {
    const b = $("#vozBtn"), ctl = $("#vozCtl");
    b.disabled = !this.pode();
    b.setAttribute("aria-pressed", String(this.ligada));
    b.title = !this.pode() ? "Este navegador não tem voz. Os mentores seguem com legenda" : this.ligada ? "Voz ligada. Clique para desligar" : "Voz desligada. Clique para ligar";
    $("#vozIco").innerHTML = this.ligada ? ICO_VOZ : ICO_MUDO;
    const rot = this.ligada ? "Voz ligada" : "Voz desligada";
    $("#vozTxt").textContent = rot; b.setAttribute("aria-label", rot);
    ctl.classList.toggle("off", !this.ligada);
  },
  alternar() {
    if (!this.pode()) return toast("Este navegador não tem voz. Os mentores seguem com legenda.");
    this.ligada = !this.ligada;
    try { localStorage.setItem("mentoria.voz", this.ligada ? "1" : "0"); } catch {}
    if (!this.ligada) this.stop();
    $("#vozBtn").classList.remove("bloqueada");
    this.pintar();
  },
  volume(v) { this.vol = v; try { localStorage.setItem("mentoria.voz.vol", String(v)); } catch {} if (this.cur) this.cur.audio.volume = v; },
  taxa() { if (this.cur) this.cur.audio.playbackRate = this.velo || player.speed; },
  liberado() { $("#vozBtn").classList.remove("bloqueada"); },
  vozDoServidor(key) { return this.chave && Boolean(state.byKey[key]?.voz); },
  disponivel(key) { return this.vozDoServidor(key) || this.nativa; },
  /** fala ao vivo: só quando o botão está ligado */
  usa(key) { return this.ligada && this.disponivel(key); },
  aviso(motivo) {
    if (!MOTIVO_VOZ[motivo]) motivo = "falha";   // técnicos (texto-vazio, voz-invalida, gasto-ilegivel) e desconhecidos
    if (this.avisou.has(motivo)) return;
    this.avisou.add(motivo);
    toast(this.nativa && !SO_LEGENDA.has(motivo) ? "A voz do servidor não respondeu. A fala segue com a voz do computador." : MOTIVO_VOZ[motivo]);
  },
  async buscar(key, ref) {
    this.motivo = "";
    try {
      const url = ref.veredito ? `/api/voz/${encodeURIComponent(ref.veredito)}/veredito/${ref.parte}` : ref.conversa ? `/api/voz/conversa/${encodeURIComponent(key)}/${ref.conversa}` : state.session ? `/api/voz/${encodeURIComponent(state.session)}/${ref.round}/${encodeURIComponent(key)}?modo=${ref.modo}` : null;
      if (!url) return null;
      const r = await fetch(url);
      if (r.status === 204) { this.motivo = r.headers.get("x-voz-motivo") || ""; this.aviso(this.motivo); return null; }
      if (!r.ok) return null;
      let texto = ""; try { texto = decodeURIComponent(r.headers.get("x-voz-texto") || ""); } catch {}
      let energia = null; try { const e = atob(r.headers.get("x-voz-energia") || ""), hz = Number(r.headers.get("x-voz-energia-hz")) || 0; if (e.length && hz > 0) energia = { v: Uint8Array.from(e, (c) => c.charCodeAt(0)), hz }; } catch {}   // voz-mac: energia real do som
      return { blob: await r.blob(), texto, energia, partes: Number(r.headers.get("x-voz-partes")) || 0 };
    } catch { return null; }
  },
  /** Para o que estiver tocando (e solta quem espera por ele). Pedidos em voo são descartados. */
  stop() {
    this.tok++;
    if (this.nativa) { try { speechSynthesis.cancel(); } catch {} }
    const c = this.cur; this.cur = null;
    if (!c) return;
    if (!c.nativo) { c.audio.pause(); c.audio.removeAttribute("src"); c.audio.load(); URL.revokeObjectURL(c.url); }
    c.fim();
  },
  async tocar(key, ref, texto) {
    this.stop();
    const meu = this.tok;
    if (this.vozDoServidor(key)) {
      const au = await this.tocarServidor(key, ref, meu);
      if (au || meu !== this.tok) return au;
      if (SO_LEGENDA.has(this.motivo)) return null;   // dado sensível ou teto: só a legenda
    }
    return this.nativa && texto ? this.tocarNativa(key, texto, meu) : null;
  },
  async tocarServidor(key, ref, meu) {
    const got = await this.buscar(key, ref);
    if (!got || meu !== this.tok) return null;
    const { blob, texto, energia, partes } = got;
    const url = URL.createObjectURL(blob), audio = new Audio(url);
    audio.volume = this.vol; audio.playbackRate = this.velo || player.speed;
    let fim; const ended = new Promise((res) => (fim = res));
    audio.addEventListener("ended", () => { if (this.cur?.audio === audio) { this.cur = null; URL.revokeObjectURL(url); } fim(); });
    audio.addEventListener("error", () => { if (this.cur?.audio === audio) this.cur = null; fim(); });
    const dur = await new Promise((res) => {
      if (audio.readyState >= 1) return res(audio.duration);
      audio.addEventListener("loadedmetadata", () => res(audio.duration), { once: true });
      audio.addEventListener("error", () => res(0), { once: true });
      setTimeout(() => res(0), 4000);
    });
    if (meu !== this.tok || !(dur > 0.2) || !Number.isFinite(dur)) { URL.revokeObjectURL(url); return null; }
    this.cur = { audio, url, fim, key };
    try { await audio.play(); }
    catch (e) {
      this.cur = null; URL.revokeObjectURL(url);
      if (e?.name === "NotAllowedError") this.bloqueou();
      return null;
    }
    return { audio, dur, ended, texto, energia, partes };
  },
  bloqueou() {
    $("#vozBtn").classList.add("bloqueada");
    if (!this.avisou.has("gesto")) { this.avisou.add("gesto"); toast("O navegador pediu um clique para liberar o som. Clique em qualquer ponto da sala."); }
  },
  /** voz do Mac: a boca segue o progresso da fala (marcas de palavra do sistema; sem elas, uma estimativa pelo tamanho do texto) */
  async tocarNativa(key, texto, meu) {
    const txt = String(texto).replace(/\s+/g, " ").trim().slice(0, 700);
    if (!txt) return null;
    const lang = state.exemplo ? "en-US" : "pt-BR";
    const escolhida = this.escolherVoz(key, lang);
    if (!escolhida) { if (!this.avisou.has("sem-voz")) { this.avisou.add("sem-voz"); toast("O Mac não tem voz em português instalada. Os mentores seguem com legenda."); } return null; }
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = lang; u.voice = escolhida;
    const vm = VOZ_MENTOR[key];
    u.rate = Math.min(2.5, Math.max(0.6, 1.05 * player.speed * (vm ? vm[1] : 1)));
    u.pitch = Math.min(1.05, Math.max(0.9, vm ? vm[2] : 0.93 + (hashChave(key) % 11) / 100));   // falecido: tom escolhido; demais: um timbre um pouco diferente por mentor       // um timbre um pouco diferente por mentor
    u.volume = this.vol;
    let fim; const ended = new Promise((res) => (fim = res));
    let comecou = false, t0 = 0, ci = 0, tci = 0, msChar = 64 / u.rate, falhou = false;
    const agora = () => performance.now();
    const audio = {
      volume: this.vol, playbackRate: 1, pause() {}, removeAttribute() {}, load() {},
      get currentTime() {
        if (!comecou) return 0;
        const andou = Math.min((agora() - tci) / msChar, 14);
        return Math.min(0.985, (ci + andou) / txt.length);
      },
    };
    const c = { audio, url: null, fim, key, nativo: true, u };
    const inicio = new Promise((res) => {
      u.onstart = () => { comecou = true; t0 = tci = agora(); res(true); };
      u.onboundary = (e) => { if (e.name && e.name !== "word") return; ci = e.charIndex || 0; tci = agora(); if (ci > 2) msChar = Math.min(220, Math.max(18, (tci - t0) / ci)); };
      u.onend = () => { if (this.cur === c) this.cur = null; fim(); res(comecou); };
      u.onerror = (e) => { falhou = true; if (this.cur === c) this.cur = null; if (e?.error === "not-allowed") this.bloqueou(); fim(); res(false); };
    });
    this.cur = c;
    try { speechSynthesis.resume(); speechSynthesis.speak(u); } catch { this.cur = null; return null; }
    const iniciou = await Promise.race([inicio, new Promise((res) => setTimeout(() => res(false), 2500))]);
    if (meu !== this.tok) { try { speechSynthesis.cancel(); } catch {} return null; }
    if (!iniciou || falhou) { if (this.cur === c) { this.cur = null; try { speechSynthesis.cancel(); } catch {} } return null; }
    return { audio, dur: 1, ended, texto: txt };
  },
};

const MENOS_MOVIMENTO = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; } };
// boca e legenda presas ao relógio do áudio (não ao ritmo do texto): se o áudio pausa, tudo para junto
function animarComVoz(key, words, spans, au) {
  const peso = words.map((w) => Math.max(170, w.length * 52));
  const pausa = words.map((w) => (/[.!?]["”)]?$/.test(w) ? 340 : /[,;:]$/.test(w) ? 170 : 25));
  const fim = []; let t = 0;
  words.forEach((_, i) => { t += peso[i] + pausa[i]; fim.push(t); });
  const shapes = words.map((w) => shapesFor(w.replace(/[^\p{L}]/gu, "")));
  return new Promise((res) => {
    let ultimo = -1;
    const iv = setInterval(() => {
      const f = Math.min(1, au.audio.currentTime / au.dur) * t;
      let i = fim.findIndex((x) => f < x); if (i < 0) i = words.length - 1;
      for (let k = ultimo + 1; k <= i; k++) spans[k]?.classList.add("on");
      ultimo = Math.max(ultimo, i);
      const ini = i ? fim[i - 1] : 0, p = (f - ini) / (fim[i] - ini), fala = peso[i] / (peso[i] + pausa[i]);
      if (!key) return;
      if (au.energia) { const e = au.energia.v[Math.min(au.energia.v.length - 1, Math.floor(au.audio.currentTime * au.energia.hz))] / 255; setShape(key, MENOS_MOVIMENTO() ? "base" : e > 0.55 ? "open" : e > 0.22 ? "mid" : "base"); return; }
      if (p < fala) { const n = shapes[i].length + 1, j = Math.floor((p / fala) * n); setShape(key, j < shapes[i].length ? shapes[i][j] : "base"); }
      else setShape(key, "base");
    }, 45);
    au.ended.then(() => { clearInterval(iv); if (key) setShape(key, "base"); res(); });
  });
}

async function speak(key, text, { tag = "", target = null, sub = "", round = 1 } = {}) {
  setSpeaker(key, target);
  captionFor(key);
  $("#capTag").textContent = tag;
  $("#capSub").textContent = "";
  const p = $("#capText");
  p.className = "cap-text";
  const words = text.split(" ").filter(Boolean);
  p.innerHTML = words.map((w) => `<span class="w">${esc(w)}</span> `).join("");
  const spans = $$(".w", p);
  // com voz: pede o áudio, toca e deixa a boca seguir a duração dele; sem voz (ou se falhar), o ritmo do texto de sempre
  const au = !player.fast && voz.usa(key) ? await voz.tocar(key, { round, modo: "linha" }, text) : null;
  if (au) await animarComVoz(key, words, spans, au);
  else for (let i = 0; i < words.length; i++) {
    if (player.fast) break;
    const w = words[i];
    spans[i].classList.add("on");
    const shapes = shapesFor(w.replace(/[^\p{L}]/gu, ""));
    const dur = Math.max(170, w.length * 52);
    const per = dur / (shapes.length + 1);
    for (const sh of shapes) { setShape(key, sh); await player.sleep(per); }
    setShape(key, "base");
    await player.sleep(per + (/[.!?]["”)]?$/.test(w) ? 340 : /[,;:]$/.test(w) ? 170 : 25));
  }
  spans.forEach((s) => s.classList.add("on"));
  setShape(key, "base");
  $("#capSub").innerHTML = sub;
  await player.sleep(au ? 600 : 1300);
}

const mesaUI = { m: null, resp: "", decisao: "" };
const post = async (url, obj) => {
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(obj) });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, j, status: r.status };
};
async function pollMesa() {
  const m = await fetch("/api/mesa").then((x) => x.json()).catch(() => null);
  if (m) { mesaUI.m = m; paintMesa(); }
}
function paintMesa() {
  const m = mesaUI.m; if (!m || state.modo === "conversa") return;
  const ativo = m.estado === "pensando" || m.estado === "esperando";
  const mostra = ativo && !state.session;
  const h2 = $("#waiting h2");
  if (mostra) h2.textContent = mesaUI.decisao ? `Mesa em andamento: ${mesaUI.decisao}` : "Mesa em andamento";
  else if (h2.textContent.startsWith("Mesa em andamento")) h2.textContent = "Traga uma decisão para a mesa";
  $("#idleNote").hidden = mostra;
  $("#waiting .pulse").hidden = mostra;
  $("#composer").hidden = mostra;
  $("#moreOpts").hidden = true;   // comando do Claude Code: só na sala interna, não na versão pública
  $("#mesaStatus").hidden = !mostra;
  $("#waitText").hidden = mostra;
  if (!mostra) {
    $("#convocarBtn").disabled = false;
    const msg = $("#composerMsg"); const erro = m.estado === "falhou" && !state.session && !mesaUI.visto ? m.erro : "";
    if (erro && !msg.dataset.local) { msg.textContent = erro; msg.hidden = false; }
    return;
  }
  const rod = m.rodada >= 1 && m.rodada <= 3 ? ` · rodada ${m.rodada} de 3` : "";
  const esperando = m.estado === "esperando";
  $("#msTitulo").textContent = esperando ? "O Mediador quer saber mais" : "A mesa está pensando";
  $("#msSub").textContent = esperando ? "Responda abaixo e a conversa continua de onde parou." : `O Mediador está lendo a sua decisão e chamando os mentores${rod}. Eles aparecem falando aqui assim que a primeira rodada fechar.`;
  $("#msAsk").hidden = !esperando;
  $("#msCancel2").hidden = esperando;
  if (esperando && $("#msQ").textContent !== m.pergunta) { $("#msQ").textContent = m.pergunta; $("#msResp").value = ""; $("#mesaStatus").scrollIntoView({ block: "center", behavior: "smooth" }); }
}
/** O grupo só vai ao pedido se todos da mesa pertencerem a ele (a mesa montada à mão pode misturar grupos). */
function grupoDaMesa() {
  if (ehPers()) return "";
  const g = state.salas.find((x) => x.id === state.salaAtiva)?.grupos?.find((x) => x.id === state.grupo);
  return g && state.mesa.length && state.mesa.every((k) => state.byKey[k]?.grupos?.includes(g.nome)) ? g.id : "";
}
function bindMesa() {
  const txt = $("#decisaoTxt"), msg = $("#composerMsg");
  const erro = (t) => { msg.textContent = t; msg.hidden = !t; msg.dataset.local = t ? "1" : ""; };
  txt.addEventListener("input", () => { $("#decisaoCount").textContent = `${txt.value.length} de 2000`; erro(""); });
  txt.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); $("#composer").requestSubmit(); } });
  $("#composer").addEventListener("submit", async (e) => {
    e.preventDefault();
    const t = txt.value.trim();
    if (t.length < 10) return erro("Escreva a decisão em pelo menos uma frase.");
    const b = $("#convocarBtn"); b.disabled = true; erro("");
    if (!state.mesa.length) { b.disabled = false; return erro("Escolha pelo menos um mentor para a mesa."); }
    const { ok, j } = await post("/api/convocar", { decisao: t, sala: salaDoPedido() || undefined, grupo: grupoDaMesa() || undefined, mentores: state.mesa, rapida: state.rapida && lim() > 1 });
    if (!ok) { b.disabled = false; return erro(j.erro || "Não consegui convocar a mesa agora."); }
    mesaUI.decisao = shorten(t.replace(/\s+/g, " "), 60);
    pararDitado(); txt.value = ""; $("#decisaoCount").textContent = "0 de 2.000";
    mesaUI.m = { estado: "pensando", rodada: 0 }; paintMesa(); pollMesa();
  });
  $("#msEnviar").addEventListener("click", async () => {
    const t = $("#msResp").value.trim(); if (t.length < 2) return;
    pararDitado(); $("#msEnviar").disabled = true;
    const { ok, j } = await post("/api/responder", { resposta: t });
    $("#msEnviar").disabled = false;
    if (!ok) return toast(j.erro || "Não consegui enviar a resposta.");
    mesaUI.m = { estado: "pensando", rodada: 0 }; paintMesa(); pollMesa();
  });
  $("#msResp").addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); $("#msEnviar").click(); } });
  for (const id of ["#msCancel", "#msCancel2"]) $(id).addEventListener("click", async () => { const { ok, j } = await post("/api/cancelar", {}); if (!ok) toast(j.erro || "Não consegui cancelar a mesa agora."); else mesaUI.decisao = ""; pollMesa(); });
}

const ask = { seat: null, timer: null, pendentes: new Set(), textos: {}, animTok: 0, animando: null };
function pararAsk() { clearInterval(ask.timer); ask.timer = null; ask.seat = null; ask.pendentes.clear(); }
const dataCurta = (id) => { const d = new Date(Number(id)); return Number.isFinite(d.getTime()) ? d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : ""; };
/** lista dos mentores (painel no modo Conversa): busca, filtro opcional por linha, ponto em quem já tem conversa */
function renderListaConversa() {
  const busca = fold(state.busca).toLowerCase();
  const filtro = LINHA[state.filtroLinha] && state.filtroLinha !== "personalizada" ? LINHA[state.filtroLinha] : null;
  const lista = state.all.filter((m) => (!filtro || linhaTem(filtro, m)) && (!busca || fold(m.name + " " + m.pillar + " " + m.nucleo).toLowerCase().includes(busca)));
  $("#panelHead").textContent = "Debater mais com";
  $("#pickFoot").hidden = true;
  $("#feed").innerHTML = `
    <div class="pick">
      <p class="room-sum">Escolha o mentor com quem você quer aprofundar o tema.</p>
      <div class="conv-filtros">
        <label class="sr" for="convFiltro">Linha</label>
        <select id="convFiltro"><option value="">Todos os grupos</option>${LINHAS.filter((l) => l.id !== "personalizada").map((l) => `<option value="${l.id}" ${filtro?.id === l.id ? "selected" : ""}>${esc(l.nome)}</option>`).join("")}</select>
        <input type="search" id="pickBusca" placeholder="Buscar por nome ou tema" value="${esc(state.busca)}" aria-label="Buscar mentor">
      </div>
      <ul class="mentors conv-list">${lista.length ? lista.map((m) => {
        const on = m.key === state.conversa, ult = state.convIdx[m.key], prep = m.cerebroPronto === false;
        return `<li><button type="button" class="mentor conv-m ${on ? "on" : ""}" data-conversar="${m.key}" aria-pressed="${on}">
          ${av(m.key)}<span class="nm"><b>${esc(m.name)}</b><small>${esc(m.pillar)}</small></span>
          <span class="tags">${prep ? '<span class="soon">em preparo</span>' : ""}${ult ? `<span class="cv-ult" title="Última conversa"><i aria-hidden="true"></i>${esc(dataCurta(ult))}</span>` : ""}</span>
        </button></li>`;
      }).join("") : '<li class="empty">Nenhum mentor com esse filtro.</li>'}</ul>
    </div>`;
}
/** quem já conversou: uma leitura local por mentor, uma vez por entrada no modo Conversa (sem custo) */
async function carregarIndiceConversas() {
  if (state.convIdxCarregado) return; state.convIdxCarregado = true;
  const ks = state.all.map((m) => m.key); let i = 0;
  const um = async () => { while (i < ks.length) { const k = ks[i++]; const j = await fetch(`/api/conversa/${encodeURIComponent(k)}`).then((x) => x.json()).catch(() => null); const p = (j?.itens || []).filter((x) => x.estado === "pronta").pop(); if (p) state.convIdx[k] = p.id; } };
  await Promise.all(Array.from({ length: 6 }, um));
  if (state.modo === "conversa" && !state.session) renderPicker();
}
function escolherMentor(k) {
  if (!state.byKey[k]) return;
  fecharPainel(false);
  if (k === state.conversa && ask.seat === k) return;
  voz.stop(); pararAsk();
  state.conversa = k;
  pintarConversa(); renderPicker(); paintQuem();
  $("#convTxt")?.focus({ preventScroll: true });
}
/** palco da Conversa: só o mentor escolhido, sentado sozinho, com boca e legenda */
function pintarConversa() {
  carregarIndiceConversas();
  const k = state.conversa, s = state.byKey[k];
  const h2 = $("#waiting h2");
  if (!s) {
    renderSeats([]);
    $("#waiting").hidden = false; h2.textContent = "Escolha o mentor com quem você quer debater mais."; $("#waitText").hidden = true; $("#waiting .pulse").hidden = true;
    $("#convForm").hidden = true; $("#convPrep").hidden = true; $("#convHist").innerHTML = "";
    return;
  }
  renderSeats([s]);
  $("#waiting").hidden = true;
  legendaFixa(k, s.question, "A pergunta de sempre");
  const prep = s.cerebroPronto === false;
  $("#convForm").hidden = prep; $("#convPrep").hidden = !prep;
  $("#convPrep").textContent = prep ? `${s.name} ainda está com o conhecimento em preparo.` : "";
  $("#convTxt").placeholder = `Escreva para ${s.short}`; $("#convLbl").textContent = `Escreva para ${s.short}`;
  $("#convMsg").hidden = true;
  ask.seat = k; ask.pendentes.clear();
  $("#convHist").innerHTML = "";
  carregarConversa(k, false).then((itens) => { if (itens.some((i) => i.estado === "pensando")) iniciarPoll(k); });
}
/** legenda parada (texto inteiro aceso) */
async function falarSemVoz(seat, texto) {
  const tok = ++ask.animTok;
  captionFor(seat); $("#capTag").textContent = "Conversa"; $("#capSub").textContent = "";
  const p = $("#capText"); p.className = "cap-text";
  const words = String(texto || "").split(" ").filter(Boolean);
  p.innerHTML = words.map((w) => `<span class="w">${esc(w)}</span> `).join("");
  const spans = $$(".w", p);
  const vale = () => tok === ask.animTok && ask.seat === seat && state.modo === "conversa";
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  ask.animando = seat; setSpeaker(seat);
  for (let i = 0; i < words.length && vale(); i++) {
    const w = words[i];
    spans[i].classList.add("on");
    const shapes = shapesFor(w.replace(/[^\p{L}]/gu, ""));
    const per = Math.max(170, w.length * 52) / (shapes.length + 1);
    for (const sh of shapes) { if (!vale()) break; setShape(seat, sh); await espera(per); }
    setShape(seat, "base");
    await espera(per + (/[.!?]["”)]?$/.test(w) ? 340 : /[,;:]$/.test(w) ? 170 : 25));
  }
  if (tok !== ask.animTok) return;
  spans.forEach((x) => x.classList.add("on"));
  setShape(seat, "base"); ask.animando = null;
  if (state.speaking === seat) setSpeaker(null);
}
function legendaFixa(k, texto, tag = "") {
  captionFor(k);
  $("#capTag").textContent = tag;
  const p = $("#capText"); p.className = "cap-text"; p.innerHTML = esc(texto || ""); $("#capSub").textContent = "";
}
function legendaPensando(k) {
  ask.animTok++; ask.animando = null;
  captionFor(k); $("#capTag").textContent = "Conversa";
  const p = $("#capText"); p.className = "cap-text chair"; p.innerHTML = 'Pensando…<span class="dots"><i></i><i></i><i></i></span>'; $("#capSub").textContent = "";
}
function bindConversa() {
  const f = $("#convForm"), ta = $("#convTxt"), msg = $("#convMsg");
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const k = state.conversa, q = ta.value.trim(); if (!k || q.length < 3) return;
    const b = $("#convEnviar"); b.disabled = true; msg.hidden = true;
    const { ok, j, status } = await post("/api/perguntar", { mentor: k, pergunta: q, sessao: state.temaSessao || undefined });
    b.disabled = false;
    if (!ok) { msg.textContent = status === 409 ? "Outra pergunta está sendo respondida. Espere um instante." : j.erro || "Não consegui enviar a pergunta."; msg.hidden = false; return; }
    pararDitado(); ta.value = ""; voz.stop();
    if (j.id) ask.pendentes.add(String(j.id));
    carregarConversa(k, true); iniciarPoll(k);
  });
  ta.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); f.requestSubmit(); } });
  $("#convHist").addEventListener("click", async (e) => {
    const c = e.target.closest("[data-cancelar-pergunta]"); if (c) { await post("/api/cancelar", { alvo: "pergunta" }); return carregarConversa(state.conversa, false); }
    const o = e.target.closest("[data-ouvir]"); if (o) lerFala(state.conversa, { conversa: o.dataset.ouvir }, o, falavel(ask.textos[o.dataset.ouvir]), { legenda: true });
  });
}
function iniciarPoll(seat) { clearInterval(ask.timer); ask.timer = setInterval(() => carregarConversa(seat, true), 1800); }
async function carregarConversa(seat, falarNovas) {
  const j = await fetch(`/api/conversa/${encodeURIComponent(seat)}`).then((x) => x.json()).catch(() => ({ itens: [] }));
  if (ask.seat !== seat || state.modo !== "conversa" || state.session) return j.itens;
  const hist = $("#convHist"); if (!hist) return j.itens;
  for (const i of j.itens) if (i.estado === "pronta") ask.textos[i.id] = i.resposta;
  const s = state.byKey[seat], nome = s?.short || "";
  const ult = j.itens.filter((i) => i.estado === "pronta").pop(); if (ult && state.convIdx[seat] !== ult.id) { state.convIdx[seat] = ult.id; }
  const pensando = j.itens.some((i) => i.estado === "pensando");
  const tocando = voz.cur && $("#convHist [data-ouvir][aria-pressed=true]");
  hist.innerHTML = j.itens.length ? `<h3 class="conv-tit">Conversas anteriores</h3>` + j.itens.map((i, n, a) => `<div class="cv">${n && a[n - 1].pergunta === i.pergunta ? "" : `<div class="cv-q"><p>${esc(i.pergunta)}</p></div>`}${
    i.estado === "pronta" ? `<div class="cv-a">${av(seat)}<div class="cv-b"><p>${esc(falavel(i.resposta) || i.resposta)}</p>${voz.disponivel(seat) ? `<button class="ghost small" type="button" data-ouvir="${i.id}" data-rotulo="Ouvir de novo" aria-pressed="false"></button>` : ""}</div></div>`
    : i.estado === "falhou" ? `<div class="cv-a">${av(seat)}<div class="cv-b ask-wait">${esc(nome)} não conseguiu responder agora. Tente de novo.</div></div>`
    : `<div class="cv-a">${av(seat)}<div class="cv-b ask-wait">Pensando… <button class="linklike" type="button" data-cancelar-pergunta>Cancelar</button></div></div>`}</div>`).join("") : "";
  $$("#convHist [data-ouvir]").forEach((b) => pintarOuvir(b, false));
  if (tocando) { const b = $(`#convHist [data-ouvir="${tocando.dataset.ouvir}"]`); if (b) pintarOuvir(b, true); }
  hist.scrollTop = hist.scrollHeight;
  $("#convEnviar").disabled = pensando;
  $(`#seat-${seat}`)?.classList.toggle("thinking", pensando);
  const agora = new Set(j.itens.filter((i) => i.estado === "pensando").map((i) => i.id));
  let falou = false;
  for (const i of j.itens) {
    if (i.estado === "pensando" || !ask.pendentes.has(i.id) || !falarNovas) continue;
    if (i.estado !== "pronta") continue;
    falou = true;
    const b = $(`#convHist [data-ouvir="${i.id}"]`);
    if (voz.ligada && voz.disponivel(seat) && b) lerFala(seat, { conversa: i.id }, b, falavel(i.resposta), { legenda: true });   // cada resposta nova é falada sozinha
    else falarSemVoz(seat, falavel(i.resposta));
  }
  if (pensando) legendaPensando(seat);
  else if (!falou && !voz.cur && !ask.animando && !falarNovas && ult) legendaFixa(seat, falavel(ult.resposta), "Conversa");
  else if (!falou && !voz.cur && falarNovas && ask.pendentes.size) { const ruim = j.itens.find((i) => ask.pendentes.has(i.id) && i.estado === "falhou"); if (ruim) legendaFixa(seat, `${nome} não conseguiu responder agora. Tente de novo.`, "Conversa"); }
  ask.pendentes = agora;
  if (!agora.size) { clearInterval(ask.timer); ask.timer = null; }
  if (state.modo === "conversa" && !state.session && $("#feed .conv-list")) { const li = $(`#feed [data-conversar="${seat}"] .tags`); if (li && ult && !$(".cv-ult", li)) renderPicker(); }
  return j.itens;
}

const nextBlink = {};
function startBlinking() {
  setInterval(() => {
    const now = Date.now();
    for (const s of state.seats) {
      nextBlink[s.key] ??= now + 600 + Math.random() * 3000;
      if (now < nextBlink[s.key]) continue;
      nextBlink[s.key] = now + 2400 + Math.random() * 4200;
      const b = $(`#seat-${s.key} .bust`);
      if (b && b.dataset.shape === "base") {
        b.dataset.shape = "blink";
        setTimeout(() => { if (b.dataset.shape === "blink") b.dataset.shape = "base"; }, 130);
      }
    }
  }, 300);
}

async function onSeatDone(ev) {
  const { round, seat, text, parsed, quotes } = ev;
  state.cards[round][seat] = { text, parsed, quotes };
  const top = topOption(parsed.optionScores);
  const line = lineFor(round, parsed);
  let tag = ROUND_NAME[round], sub = "", target = null;
  if (round === 1) {
    tag = `${stanceWord(parsed.stance)}${top ? ` · defende ${top.id} (${top.v}/10)` : ""}`;
  } else if (round === 2) {
    const tgt = parsed.disagreeWith ? state.byKey[parsed.disagreeWith] : null;
    if (tgt) {
      target = tgt.key;
      tag = `Rebate ${tgt.short}`;
      state.links = state.links.filter((l) => l.from !== seat);
      state.links.push({ from: seat, to: tgt.key });
      drawLinks();
    }
    sub = /^(yes|sim)/i.test(fold(parsed.moved).trim()) ? "Mudou de posição" : "";
  } else {
    tag = `Voto: ${VOTE_TXT[parsed.vote || "endorse"]}`;
  }
  feedCard(round, seat, parsed);
  await speak(seat, line || "Está tudo no meu cartão.", { tag, target, sub, round });

  const pl = $(`#plate-${seat}`);
  if (!pl) return;
  const chip = $(".chip", pl);
  chip.hidden = round === 3; // o carimbo do voto já diz
  chip.className = "chip";
  if (round === 3) {
    const v = parsed.vote || "endorse";
    chip.textContent = VOTE_TXT[v];
    chip.classList.add(v);
    $(`#seat-${seat} .vote`)?.remove();
    const stamp = document.createElement("div");
    stamp.className = `vote ${v}`;
    stamp.textContent = STAMP_TXT[v];
    $(`#seat-${seat}`).appendChild(stamp);
  } else chip.textContent = stanceWord(parsed.stance);
  if (top) { const sc = $(".score", pl); sc.hidden = false; sc.textContent = `${top.id} ${top.v}`; sc.title = `Maior nota: opção ${top.id}`; }
  setSpeaker(null);
}

function stanceWord(t = "") {
  const f = fold(t).toLowerCase();
  if (/sim forte|strong yes/.test(f)) return "Sim forte";
  if (/nao forte|strong no/.test(f)) return "Não forte";
  if (/conditional|sim,? se|sim condic|condicional/.test(f)) return "Sim, se";
  if (/\bsim\b|\byes\b/.test(f)) return "Sim";
  if (/\bnao\b|\bno\b/.test(f)) return "Não";
  return "Falou";
}

function topOption(scores = {}) {
  const e = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return e ? { id: e[0], v: e[1] } : null;
}
const shorten = (t, n) => (t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : t);

async function onCruxes(ev) {
  setSpeaker(null);
  $("#caption").hidden = true;
  const c = $("#cruxes");
  c.hidden = false;
  c.innerHTML = `<div class="head">${ev.unanimous ? "Todos concordam rápido demais. O Mediador vai pressionar." : "Sobre o que divergem"}</div>` +
    ev.cruxes.map((x, i) => `<div class="crux" style="animation-delay:${i * 0.18}s"><b>${esc(x.question)}</b><div class="sides">${x.sides.map((sd) => `<span class="side"><span class="faces">${sd.seats.filter((k) => state.byKey[k]).map((k) => av(k)).join("")}</span>${esc(shorten(sd.position, 48))}</span>`).join("")}</div></div>`).join("");
  const f = document.createElement("div");
  f.className = "feed-note";
  f.innerHTML = `<b>A divergência:</b> ${ev.cruxes.map((x) => esc(x.question)).join(" ")}`;
  feedAppend(f);
  await player.sleep(3500 + 1800 * ev.cruxes.length);
}

async function onDraft(d) {
  const lb = labelInfo(d.label).txt;
  chairSays(`Proposta: ${lb} na opção ${d.option}. ${firstSentences(clean(d.recommendation), 140)}`, { tag: "Vai à votação" });
  const f = document.createElement("div");
  f.className = "feed-note";
  f.innerHTML = `<b>Vai à votação:</b> ${esc(lb)} na opção ${esc(d.option)}.`;
  feedAppend(f);
  await player.sleep(4200);
}

// ------------------------------------------------------------- setas de réplica
function drawLinks() {
  const svg = $("#links");
  const stage = $("#stage");
  const w = stage.clientWidth, h = stage.clientHeight;
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  const links = state.links || [];
  const col = "#6E9CE8";
  svg.innerHTML = `<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${col}"/></marker></defs>` +
    links.map(({ from, to }, i) => {
      const a = state.geo[from], b = state.geo[to];
      if (!a || !b) return "";
      const y1 = a.top - 6, y2 = b.top - 6;
      const mx = (a.x + b.x) / 2, my = Math.min(y1, y2) - Math.min(90, Math.abs(a.x - b.x) * 0.22) - 10;
      return `<path class="${i < links.length - 1 ? "old" : ""}" d="M${a.x},${y1} Q${mx},${my} ${b.x},${y2}" stroke="${col}" marker-end="url(#arrow)"/>`;
    }).join("");
}

// ------------------------------------------------------------- painel de pontos-chave e cartões
function feedAppend(node) {
  const feed = $("#feed");
  $(".empty", feed)?.remove();
  feed.appendChild(node);
  feed.scrollTop = feed.scrollHeight;
}
function feedPhase(label) {
  const d = document.createElement("div");
  d.className = "feed-phase";
  d.textContent = label.replace(/^O Mediador está /, "Mediador: ");
  feedAppend(d);
}
function feedCard(round, seat, parsed) {
  const s = state.byKey[seat];
  const d = document.createElement("div");
  d.className = "feed-card";
  d.dataset.seat = seat;
  d.dataset.round = round;
  const top = topOption(parsed.optionScores);
  const tgt = parsed.disagreeWith ? state.byKey[parsed.disagreeWith]?.short : "";
  const what = round === 1 ? `${stanceWord(parsed.stance)}${top ? `, defende ${top.id}` : ""}` : round === 2 ? (tgt ? `contra ${tgt}` : "Debate") : `Voto: ${VOTE_TXT[parsed.vote || "endorse"]}`;
  d.innerHTML = `${av(seat)}<div><div class="h">${esc(s.short)}<span class="r">${esc(what)}</span></div><p>${esc(lineFor(round, parsed, 105))}</p></div>`;
  feedAppend(d);
}

const duasFrases = (t) => ((t.match(/[^.!?]+[.!?]+["”)]?\s*|[^.!?]+$/g) || [t]).slice(0, 2).join("").trim());
function textoCartao(round, p) {
  const t = clean(round === 1 ? (p.call || p.stance) : round === 2 ? (p.disagreeLine || p.stance) : (p.oneLine || p.amendment || p.call));
  return shorten(duasFrases(t), 450);
}
const falavel = (t) => firstSentences(String(t || "").split(/\n\s*\**Fontes?:/i)[0].replace(/\*\*|__|`|^#+\s*/gm, "").replace(/\s*\((?:S\d+[^)]*|fonte[^)]*)\)/gi, "").replace(/\s+/g, " ").trim(), 560);
const lerCartao = (seat, round, btn) => lerFala(seat, { round, modo: "cartao" }, btn, textoCartao(round, state.cards[round][seat].parsed));
async function lerFala(seat, ref, btn, texto, { legenda = false } = {}) {
  const ativo = voz.cur?.key === seat && btn?.getAttribute("aria-pressed") === "true";
  voz.stop(); pintarOuvir(btn, false);
  if (ativo) return;
  pintarOuvir(btn, true, "Carregando");
  const au = await voz.tocar(seat, ref, texto);
  if (!au) { pintarOuvir(btn, false); if (legenda && ask.seat === seat) await falarSemVoz(seat, texto); return; }
  if (legenda) { ask.animTok++; ask.animando = null; }   // a voz assume: a boca sem voz para
  pintarOuvir(btn, true);
  const words = au.texto.split(" ").filter(Boolean);
  let spans = [];
  if (legenda && ask.seat === seat) {
    captionFor(seat); $("#capTag").textContent = "Conversa"; $("#capSub").textContent = "";
    const p = $("#capText"); p.className = "cap-text"; p.innerHTML = words.map((w) => `<span class="w">${esc(w)}</span> `).join(""); spans = $$(".w", p);
    setSpeaker(seat);
  }
  await animarComVoz(seat, words, spans, au);
  spans.forEach((s) => s.classList.add("on"));
  if (legenda && state.speaking === seat) setSpeaker(null);
  if (voz.cur === null || voz.cur.audio === au.audio) pintarOuvir(btn, false);
}
function pintarOuvir(btn, tocando, rotulo) {
  if (!btn || !btn.isConnected) return;
  btn.setAttribute("aria-pressed", String(tocando));
  btn.innerHTML = tocando ? `${ICO_STOP}<span>${rotulo || "Parar"}</span>` : `${ICO_PLAY}<span>${btn.dataset.rotulo || "Ouvir"}</span>`;
}

function openCard(seat, round, { ler = false } = {}) {
  const s = state.byKey[seat];
  if (!s) return;
  const rounds = [3, 2, 1].filter((r) => state.cards[r][seat]);
  const r = round || rounds[0];
  const c = state.cards[r]?.[seat];
  const q = (x) => (x.verified === true ? ["", "conferida no cérebro"] : x.verified === false ? ["bad", "não encontrada no cérebro"] : ["na", "cérebro ainda não disponível para conferir"]);
  $("#cardBody").innerHTML = `
    <div class="card-head">${av(seat, "av big")}<div><div class="label">${esc(s.pillar)} · ${esc(s.nucleo)}</div><h3>${esc(s.name)}</h3><p class="muted" style="margin:0">A pergunta de sempre: ${esc(s.question)}</p><p class="muted" style="margin:4px 0 0;font-size:12px">Mentor simulado por IA a partir da obra pública de ${esc(s.name)}. Não é a pessoa.</p></div></div>
    ${rounds.length > 1 ? `<p style="margin:0 0 6px">${rounds.slice().reverse().map((x) => `<button class="ghost" data-r="${x}" style="margin-right:6px">${ROUND_NAME[x]}</button>`).join("")}</p>` : ""}
    ${c ? `<pre>${esc(c.text)}</pre>${c.quotes?.length ? `<ul class="qcheck">${c.quotes.map((x) => { const [cls, txt] = q(x); return `<li class="${cls}">"${esc(shorten(x.quote, 110))}" (${esc(x.source)}) ${txt}</li>`; }).join("")}</ul>` : ""}` : `<p class="muted">${s.cerebroPronto === false ? "O conhecimento deste mentor ainda está em preparo." : "Ainda não houve fala nesta mesa. Converse abaixo."}</p>`}`;
  $$("#cardBody [data-r]").forEach((b) => b.addEventListener("click", () => openCard(seat, Number(b.dataset.r))));
  voz.stop();
  const retrato = $("#cardBody .card-head img.av"); if (retrato) retrato.dataset.seat = seat;
  if (!voz.disponivel(seat) && voz.chave) { const n = document.createElement("p"); n.className = "vz-note"; n.style.margin = "0 0 8px"; n.textContent = "A voz ainda está em preparo. Por enquanto, a resposta vem por escrito."; $("#cardBody .card-head").after(n); }
  const conversar = document.createElement("div");
  conversar.className = "ask";
  conversar.innerHTML = s.cerebroPronto === false ? `<p class="ask-wait">${esc(s.name)} ainda está com o conhecimento em preparo.</p>` : `<button class="pill" type="button" id="cardConversar">${state.session && !state.exemplo ? "Debater mais com" : "Conversar com"} ${esc(s.short)}</button>`;
  $("#cardBody").appendChild(conversar);
  $("#cardConversar")?.addEventListener("click", () => { $("#cardDialog").close(); setModo("conversa", { mentor: seat }); });
  if (c && state.session && voz.disponivel(seat)) {
    const row = document.createElement("p");
    row.className = "vz-row";
    row.innerHTML = '<button class="ghost" type="button" id="cardVoz" aria-pressed="false"></button><span class="vz-note">Voz sintética, não é a voz real do mentor.</span>';
    $("#cardBody .card-head").after(row);
    const btn = $("#cardVoz");
    pintarOuvir(btn, false);
    btn.addEventListener("click", () => lerCartao(seat, r, btn));
    if (ler && voz.ligada) lerCartao(seat, r, btn);
  }
  const dlg = $("#cardDialog");
  if (!dlg.open) dlg.showModal();
}

// ------------------------------------------------------------- veredito
// o Mediador deve escrever nomes de exibição; aceita também a chave crua e nomes sem acento
function seatKeyC(x, seats = state.setup?.seats) {
  const t = fold(x).toLowerCase().replace(/\(.*$/, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  if (!t) return null;
  const pool = seats?.map((k) => state.byKey[k]).filter(Boolean) || state.all;
  const sh = (s) => fold(s.short).toLowerCase(), nm = (s) => fold(s.name).toLowerCase();
  for (const list of [pool, state.all]) {
    const hit = list.find((s) => t === s.key || t === sh(s) || t === nm(s)) ||
      [...list].sort((a, b) => sh(b).length - sh(a).length).find((s) => t.startsWith(sh(s))) ||
      (() => { const h = list.filter((s) => t.split(" ").includes(nm(s).split(" ").pop())); return h.length === 1 ? h[0] : null; })();
    if (hit) return hit.key;
  }
  return null;
}
const seatName = (x, seats) => state.byKey[seatKeyC(x, seats)]?.short || x;

function labelInfo(l = "") {
  const f = fold(l).toUpperCase();
  if (/NAO FACA|DON'T|DONT/.test(f)) return { txt: "NÃO FAÇA", cls: "dont" };
  if (/REFORMULE|RESHAPE/.test(f)) return { txt: "REFORMULE", cls: "reshape" };
  if (/ESPERE|WAIT/.test(f)) return { txt: "ESPERE", cls: "wait" };
  if (/SIGA COM|WITH CONDITIONS/.test(f)) return { txt: "SIGA COM CONDIÇÕES", cls: "go" };
  return { txt: /SIGA|^GO/.test(f) ? "SIGA" : (l || "").toUpperCase(), cls: "go" };
}

/** "Melhor ideia": o mentor do argumento que mais pesou (o 1º de "por quê"), ou o que o veredito nomear em best_idea. */
function melhorIdeiaHtml(v, seats) {
  const be = v.best_idea || {};
  const k = seatKeyC(be.seat || v.why?.[0]?.seat, seats);
  if (!k) return "";
  const txt = be.why || be.point || be.reason || v.why?.[0]?.point || "";
  return `<div class="v-sec"><h3>Melhor ideia da mesa</h3><div class="minority"><div class="who">${av(k)}${esc(state.byKey[k]?.name || "")}</div><q>${esc(shorten(clean(txt), 200))}</q></div><p class="v-meta">${v.best_idea ? "Apontada pelo veredito como a melhor ideia da mesa." : "O primeiro dos argumentos que decidiram o veredito."}</p></div>`;
}
/** "Quem respondeu a quem": de "discordo mais de" na rodada 2, com o mentor mais rebatido. */
function quemRespondeuHtml(cards = state.cards) {
  const reb = Object.entries(cards[2] || {}).map(([from, c]) => ({ from, to: c.parsed?.disagreeWith })).filter((x) => x.to && state.byKey[x.from] && state.byKey[x.to]);
  if (!reb.length) return "";
  const cont = {}; reb.forEach((x) => (cont[x.to] = (cont[x.to] || 0) + 1));
  const [topo, n] = Object.entries(cont).sort((a, b) => b[1] - a[1])[0];
  return `<div class="v-sec"><h3>Quem respondeu a quem</h3><ul class="v-why">${reb.map((x) => `<li>${av(x.from)}<span><b>${esc(state.byKey[x.from].short)}</b> rebateu <b>${esc(state.byKey[x.to].short)}</b></span></li>`).join("")}</ul><p class="v-meta">O mais rebatido: ${esc(state.byKey[topo].short)} (${n} ${n === 1 ? "vez" : "vezes"}).</p></div>`;
}

// Velocidade da leitura do veredito (1x a 2x), lembrada neste navegador.
const VELOS = [1, 1.25, 1.5, 1.75, 2];
let veloVeredito = (() => { try { const v = Number(localStorage.getItem("crastomentores.velo.v1")); return VELOS.includes(v) ? v : 1; } catch { return 1; } })();
const seletorVelo = () => `<select class="velo" data-velo-veredito aria-label="Velocidade da leitura do veredito" title="Velocidade da leitura">${VELOS.map((v) => `<option value="${v}"${v === veloVeredito ? " selected" : ""}>${String(v).replace(".", ",")}x</option>`).join("")}</select>`;
function mudarVelo(v) {
  v = Number(v); if (!VELOS.includes(v)) return;
  veloVeredito = v;
  try { localStorage.setItem("crastomentores.velo.v1", String(v)); } catch {}
  document.querySelectorAll("[data-velo-veredito]").forEach((s) => (s.value = String(v)));
  if (voz.velo) { voz.velo = v; voz.taxa(); }   // leitura em andamento: muda na hora (voz do navegador: a partir da próxima frase)
}
document.addEventListener("change", (e) => { if (e.target.matches?.("[data-velo-veredito]")) mudarVelo(e.target.value); });
const pintarOuvirVeredito = (b, on) => { if (!b) return; b.setAttribute("aria-pressed", String(on)); b.textContent = on ? "Parar a leitura" : (b.dataset.rotulo || "Ouvir o veredito"); };
function pararVeredito() { const b = $("[data-ouvir-veredito][aria-pressed=true]"); if (b) { voz.stop(); pintarOuvirVeredito(b, false); } }
async function ouvirVeredito(btn) {
  const tocando = btn.getAttribute("aria-pressed") === "true";
  voz.stop(); voz.velo = 0; document.querySelectorAll("[data-ouvir-veredito][aria-pressed=true]").forEach((b) => pintarOuvirVeredito(b, false));
  if (tocando) return;
  if (!voz.chave) {
    // sem a voz do servidor: o Mediador lê o veredito com a voz mais humana do navegador
    if (!voz.nativa) return toast("Este navegador não tem voz. O veredito segue por escrito.");
    const j = await fetch(`/api/sessions/${encodeURIComponent(btn.dataset.ouvirVeredito)}`).then((x) => x.json()).catch(() => null);
    const v = j?.events && [...j.events].reverse().find((e) => e.type === "verdict")?.verdict;
    if (!v) return toast("Este veredito ainda não está pronto.");
    // frase por frase: assim a velocidade escolhida vale já a partir da próxima frase
    const frases = [v.label, v.call, ...(v.why || []).map((w) => w.point)].filter(Boolean)
      .flatMap((t) => String(t).split(/(?<=[.!?])\s+/)).map((t) => t.trim().replace(/[.\s]+$/, "")).filter(Boolean);
    const vz = voz.escolherVoz("mediador"), meu = voz.tok;
    const falar = (i) => {
      if (voz.tok !== meu || i >= frases.length) return pintarOuvirVeredito(btn, false);
      const u = new SpeechSynthesisUtterance(frases[i] + ".");
      if (vz) { u.voice = vz; u.lang = vz.lang; } else u.lang = "pt-BR";
      u.rate = veloVeredito; u.volume = voz.vol;
      u.onend = () => falar(i + 1);
      u.onerror = () => pintarOuvirVeredito(btn, false);
      try { speechSynthesis.speak(u); } catch { pintarOuvirVeredito(btn, false); }
    };
    pintarOuvirVeredito(btn, true);
    try { speechSynthesis.cancel(); } catch {}
    falar(0);
    return;
  }
  pintarOuvirVeredito(btn, true);
  const meu = voz.tok;
  voz.velo = veloVeredito;
  try {
    for (let n = 1, total = 1; n <= total; n++) {
      const au = await voz.tocarServidor(null, { veredito: btn.dataset.ouvirVeredito, parte: n }, meu);
      if (!au) { if (n === 1 && voz.tok === meu) toast("Não foi possível ler o veredito em voz alta agora. Ele segue por escrito."); break; }
      total = au.partes || 1;
      await au.ended;
      if (voz.tok !== meu) return;
    }
  } finally { if (voz.tok === meu) { voz.velo = 0; pintarOuvirVeredito(btn, false); } }
}
function renderVeredito(ev, ctx) {
  const v = ev.verdict, seats = ctx.seats, opts = ctx.options || [];
  const solo = (ev.seats || []).length === 1;   // 1 lugar: resposta de um mentor só (sem voto vencido nem divergência)
  const lb = labelInfo(v.label);
  const mk = seatKeyC(v.minority?.seat, seats);
  const short = (t, n) => esc(shorten(clean(t || ""), n));
  const pdf = `<button class="pill" type="button" data-pdf="${esc(ctx.id || "")}">Baixar PDF</button>`;
  const rever = ctx.id ? `<button class="ghost" type="button" data-rever="${esc(ctx.id)}">Rever a mesa</button>` : "";
  $("#verdictBody").innerHTML = `
    ${ctx.aviso ? `<p class="v-aviso" role="note">${esc(ctx.aviso)}</p>` : ""}
    <div class="v-top">
      <div><div class="label">${solo ? "A resposta do mentor" : "O veredito da mesa"}${ctx.exemplo ? ' <span class="tag-ex big">Exemplo · em inglês</span>' : ""}</div>${ctx.titulo ? `<p class="v-tit">${esc(ctx.titulo)}</p>` : ""}<span class="v-label ${lb.cls}">${esc(lb.txt)}</span></div>
      <div class="actions">${pdf}${rever}${!ctx.exemplo && (ctx.id || state.session) ? `<button class="ghost" type="button" data-ouvir-veredito="${esc(ctx.id || state.session)}" aria-pressed="false"${solo ? ' data-rotulo="Ouvir a resposta"' : ""}>${solo ? "Ouvir a resposta" : "Ouvir o veredito"}</button>${seletorVelo()}` : ""}<button class="ghost" type="button" data-close>Voltar à mesa</button></div>
    </div>
    <p class="v-call">${esc(v.call)}</p>
    <div class="v-grid">
      <div class="v-sec"><h3>Notas</h3><div class="v-opts">${opts.map((o) => `
        <div class="opt ${o.id === v.recommended ? "lead" : ""}"><span class="id">${esc(o.id)}</span><span class="label">${esc(o.label)}</span><span class="val">${num(v.scores?.[o.id]?.score)}</span><span class="bar"><i style="width:${Math.min(100, Math.max(0, (Number(v.scores?.[o.id]?.score) || 0) * 10))}%"></i></span></div>`).join("")}</div>
        <p class="v-meta">Confiança ${num(v.confidence)}/10${v.votes ? ` · ${Number(v.votes.endorse) || 0} apoiam, ${Number(v.votes.amend) || 0} com emenda, ${Number(v.votes.dissent) || 0} divergem` : ""}</p>
      </div>
      <div class="v-sec"><h3>Por quê</h3><ul class="v-why">${(v.why || []).slice(0, 3).map((w) => { const k = seatKeyC(w.seat, seats); return `<li>${k ? av(k) : "<span></span>"}<span>${short(w.point, 260)}</span></li>`; }).join("")}</ul></div>
      ${solo ? "" : melhorIdeiaHtml(v, seats)}
      ${quemRespondeuHtml(ctx.cards)}
      ${solo || !v.minority ? "" : `<div class="v-sec"><h3>Voto vencido</h3><div class="minority"><div class="who">${mk ? av(mk) : ""}${esc(seatName(v.minority?.seat, seats))}</div><q>${short(v.minority?.quote, 170)}</q></div></div>`}
      <div class="v-sec"><h3>Próximos passos</h3><ul class="v-steps">${(v.next_steps || []).slice(0, 3).map((n) => `<li><b>${esc(n.when)}</b> ${short(n.action, 220)}</li>`).join("")}</ul>
        <p class="v-meta"><b>Pare se:</b> ${short(v.kill_criteria, 220)}</p></div>
    </div>
    <details class="v-more" open><summary>Detalhes completos</summary>
      <div class="v-grid">
        ${solo || !v.fights?.length ? "" : `<div class="v-sec"><h3>Onde divergiram</h3><ul>${(v.fights || []).map((f) => `<li><b>${esc(f.crux)}</b> ${esc(f.story)}</li>`).join("")}</ul></div>`}
        <div class="v-sec"><h3>Condições</h3><ol>${(v.conditions || []).map((c) => `<li>${esc(c)}</li>`).join("")}</ol></div>
        <div class="v-sec v-wide"><h3>Quadro de notas</h3>
          <div class="v-tabela"><table class="scorecard"><thead><tr><th>Mentor</th><th>Peso</th>${opts.map((o) => `<th>${esc(o.id)}</th>`).join("")}<th>A linha dele</th></tr></thead><tbody>
          ${(ev.seats || []).map((x) => { const s = state.byKey[x.key]; if (!s) return ""; return `<tr><td><span class="who">${av(x.key)}${esc(s.short)}</span></td><td class="n">${num(x.weight)}</td>${opts.map((o) => `<td class="n">${num(x.optionScores?.[o.id])}</td>`).join("")}<td class="line">${short(x.oneLine, 150)}</td></tr>`; }).join("")}
          </tbody></table></div>
          <p class="muted" style="font-size:11.5px;margin-top:8px">Ponderado pelo peso do pilar de cada mentor nesta decisão. ${opts.map((o) => `${esc(o.id)}: ${esc(v.scores?.[o.id]?.math || "")}`).join(" · ")}</p></div>
        <div class="v-sec"><h3>Teste mais barato</h3><p>${esc(v.cheapest_test)}</p><h3>Rever quando</h3><p>${esc(v.revisit)}</p></div>
        ${solo || !v.minority ? "" : `<div class="v-sec"><h3>A objeção mais forte, por inteiro</h3><p>${esc(v.minority?.quote)}</p><p class="muted">Para essa objeção estar certa, teria de ser verdade que: ${esc(v.minority?.would_have_to_be_true)}</p></div>`}
        ${v.amendments?.length ? `<div class="v-sec v-wide"><h3>Emendas</h3><ul>${v.amendments.map((a) => `<li><b>${esc(seatName(a.seat, seats))}:</b> ${esc(a.amendment)} <span class="tag">${a.adopted ? "Adotada" : "Não adotada"}: ${esc(a.reason)}</span></li>`).join("")}</ul></div>` : ""}
      </div>
    </details>
    <div class="v-sec v-wide v-debate"><h3>Debater mais com</h3><p class="muted" style="margin:0 0 8px">Escolha um mentor para aprofundar este tema. Ele já conhece o debate.</p><div class="v-debate-lista">${(ev.seats || []).filter((x) => state.byKey[x.key]).map((x) => `<button type="button" class="ghost v-debate-btn" data-debater="${esc(x.key)}">${av(x.key)}<span>${esc(state.byKey[x.key].short)}</span></button>`).join("")}</div></div>
    <div class="v-foot">${rever}<button class="ghost" type="button" data-close>Voltar à mesa</button></div>`;
  return lb;
}

function onVerdict(ev) {
  const v = ev.verdict;
  state.verdict = ev;
  setStep("verdict");
  setSpeaker(null);
  $("#caption").hidden = true;
  $("#cruxes").hidden = true;
  state.links = [];
  drawLinks();
  $("#stage").classList.remove("live");
  updateOptions(v.scores);
  const lb = renderVeredito(ev, { options: state.options, cards: state.cards, seats: state.setup?.seats, exemplo: state.exemplo });
  pintarPassoVeredito();
  const plate = $("#plate");
  plate.hidden = false;
  plate.innerHTML = `<div class="label">O veredito da mesa</div><span class="v-label ${lb.cls}">${esc(lb.txt)}</span><p>${esc(firstSentences(clean(v.call), 150))}</p><div class="row"><button type="button" id="plateOpen">Ler o veredito</button><button type="button" data-pdf>Baixar PDF</button><button type="button" class="alt" id="plateReplay">Rever esta mesa</button>${!state.exemplo && state.session ? `<button type="button" class="alt" data-ouvir-veredito="${esc(state.session)}" aria-pressed="false">Ouvir o veredito</button>${seletorVelo()}` : ""}</div>`;
  $("#plateOpen").addEventListener("click", () => ($("#verdictSheet").hidden = false));
  $("#plateReplay").addEventListener("click", () => replay(state.session));
  plate.querySelector("[data-ouvir-veredito]")?.addEventListener("click", (e) => ouvirVeredito(e.currentTarget));
  $("#playbar").hidden = true;
  const f = document.createElement("div");
  f.className = "feed-note";
  f.innerHTML = `<b>Veredito: ${esc(lb.txt)}.</b> ${esc(firstSentences(clean(v.call), 160))}`;
  feedAppend(f);
  setTimeout(() => { if (state.verdict === ev) $("#verdictSheet").hidden = false; }, 1600);
}

async function verVeredito(id, { aviso = "" } = {}) {
  const j = await fetch(`/api/sessions/${encodeURIComponent(id)}`).then((x) => x.json()).catch(() => null);
  const ev = j?.events && [...j.events].reverse().find((e) => e.type === "verdict");
  const setup = j?.events?.find((e) => e.type === "setup");
  if (!ev || !setup) return toast("Esta mesa ainda não tem veredito.");
  const cards = { 1: {}, 2: {}, 3: {} };
  for (const e of j.events) if (e.type === "seat_done" && cards[e.round]) cards[e.round][e.seat] = { parsed: e.parsed };
  renderVeredito(ev, { options: setup.options, cards, seats: setup.seats, exemplo: Boolean(j.exemplo), id, aviso, titulo: j.title || setup.title });
  if ($("#historyDialog").open) $("#historyDialog").close();
  $("#verdictSheet").hidden = false;
  $("#verdictSheet").scrollTop = 0;
  $("#verdictBody [data-close]")?.focus({ preventScroll: true });
}
async function abrirVeredito() {
  if (state.verdict && state.session) { $("#verdictSheet").hidden = false; return; }
  const debatendo = (state.session && !state.verdict && !state.replaying) || ["pensando", "esperando"].includes(mesaUI.m?.estado);
  const { sessions = [] } = await fetch("/api/sessions").then((x) => x.json()).catch(() => ({}));
  const feitas = sessions.filter((s) => s.status === "done" && s.id !== state.session);
  const alvo = feitas.find((s) => !s.exemplo) || feitas[0];
  if (!alvo) return openHistory();
  verVeredito(alvo.id, { aviso: debatendo ? "Esta é a mesa anterior. A atual ainda está debatendo." : "" });
}

// ------------------------------------------------------------- histórico e reprodução
async function openHistory() {
  const { sessions = [] } = await fetch("/api/sessions").then((x) => x.json()).catch(() => ({}));
  const st = { done: "concluída", running: "em andamento", stopped: "interrompida", error: "com erro" };
  const feitas = sessions.filter((s) => s.status === "done");
  $("#historyList").innerHTML = (feitas.length ? "" : '<li class="muted vazio">Ainda não há veredito. Convoque a primeira mesa e ele aparece aqui.</li>') + sessions.map((s) => `<li class="ses">
      <div class="ses-info"><b>${esc(s.title)}</b>${s.exemplo ? '<span class="tag-ex big">Exemplo · em inglês</span>' : ""}<small>${esc(s.id.slice(0, 10).split("-").reverse().join("/"))} · ${s.mode === "quick" ? "rápida" : "completa"} · ${esc(st[s.status] || s.status)}<span class="ses-rot" data-rotulo-de="${esc(s.id)}"></span></small></div>
      <div class="ses-acts">${s.status === "done" ? `<button class="pill small" type="button" data-ver="${esc(s.id)}">Ver veredito</button>` : ""}<button class="ghost small" type="button" data-id="${esc(s.id)}">Rever a mesa</button>${s.status === "done" ? `<button class="ghost small pdf" type="button" data-pdf="${esc(s.id)}">Baixar PDF</button>` : ""}</div>
    </li>`).join("");
  $$("#historyList button[data-id]").forEach((b) => b.addEventListener("click", () => { $("#historyDialog").close(); replay(b.dataset.id); }));
  $$("#historyList button[data-ver]").forEach((b) => b.addEventListener("click", () => verVeredito(b.dataset.ver)));
  if (!$("#historyDialog").open) $("#historyDialog").showModal();
  // rótulo do veredito de cada sessão (leitura local, sem custo)
  for (const s of feitas) fetch(`/api/sessions/${encodeURIComponent(s.id)}`).then((x) => x.json()).then((j) => {
    const v = [...(j.events || [])].reverse().find((e) => e.type === "verdict"); const el = $(`#historyList [data-rotulo-de="${CSS.escape(s.id)}"]`);
    if (v && el) { const lb = labelInfo(v.verdict?.label); el.innerHTML = ` · <span class="v-chip ${lb.cls}">${esc(lb.txt)}</span>`; }
  }).catch(() => {});
}

async function replay(id) {
  const j = await fetch(`/api/sessions/${encodeURIComponent(id)}`).then((x) => x.json());
  begin(id);
  state.replaying = true;
  state.exemplo = Boolean(j.exemplo);
  for (const ev of j.events) {
    if (["delta", "usage", "seat_error", "end"].includes(ev.type)) continue;
    player.push(ev);
  }
}

// ------------------------------------------------------------- esperando o Claude Code
// Um conselho ao vivo fica quieto por minutos enquanto os mentores escrevem em paralelo. Em vez de uma mesa parada,
const AO_MESMO_TEMPO = "Os mentores escrevem ao mesmo tempo. As falas tocam aqui assim que a rodada fecha.";
function waitCopy(phase) {
  if (state.solo && phase === "round1") return ["Resposta", "O mentor está escrevendo a resposta.", "A fala toca aqui assim que ficar pronta."];
  if (state.solo && (phase === "verdict" || phase === "skip3")) return ["Última etapa", "O Mediador está resumindo a resposta do mentor.", "Quando sair, você pode baixar o PDF."];
  return {
    setup: ["Preparando a mesa", "O Mediador está acomodando os mentores.", ""],
    round1: ["Rodada 1", "Os mentores estão escrevendo as posições de abertura.", AO_MESMO_TEMPO],
    round2: ["Rodada 2", "Os mentores estão lendo as aberturas uns dos outros e rebatendo.", AO_MESMO_TEMPO],
    round3: ["Rodada 3", "Os mentores estão votando a proposta do Mediador.", AO_MESMO_TEMPO],
    cruxes: ["Entre rodadas", "O Mediador está lendo as aberturas e achando onde eles discordam.", "A divergência aparece aqui em seguida, e então começa o debate."],
    draft: ["Entre rodadas", "O Mediador está transformando o debate numa proposta para a votação.", "Em seguida, cada mentor vota."],
    skip3: ["Última etapa", "O Mediador está pontuando a mesa e escrevendo o veredito.", "Quando sair, você pode baixar o PDF."],
    verdict: ["Última etapa", "O Mediador está pontuando a mesa e escrevendo o veredito.", "Quando sair, você pode baixar o PDF."],
  }[phase] || ["Trabalhando", "A mesa está trabalhando.", ""];
}
const clock = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };

function hideWait() {
  const w = $("#waitcard");
  if (w.hidden) return;
  w.hidden = true;
  $$(".seat.musing").forEach((e) => e.classList.remove("musing"));
  if (state.capWasShown) $("#caption").hidden = false;
  if (state.playbarWasShown) $("#playbar").hidden = false;
}

function tickWait() {
  const w = state.wait;
  const idle = !player.busy && !player.q.length;
  if (!w || !idle || state.replaying || !state.session || state.verdict) return hideWait();
  const card = $("#waitcard");
  if (card.hidden) {
    state.capWasShown = !$("#caption").hidden;
    $("#caption").hidden = true;
    $("#cruxes").hidden = true;
    state.playbarWasShown = !$("#playbar").hidden;
    $("#playbar").hidden = true;
    card.hidden = false;
    state.museAt = 0;
  }
  const [step, head, sub] = waitCopy(w.phase);
  const elapsed = Date.now() - w.at;
  $("#wcStep").textContent = step;
  $("#wcTime").textContent = clock(elapsed);
  $("#wcHead").textContent = head;
  $("#wcSub").textContent = sub;
  $("#wcNudge").hidden = elapsed < 4 * 60 * 1000;
  const round = Number((w.phase.match(/^round(\d)$/) || [])[1]) || 0;
  const bar = $("#wcBar").parentElement;
  const muse = $("#wcMuse");
  if (round) {
    const seats = state.active.length ? state.active : state.seats.map((s) => s.key);
    const done = seats.filter((k) => state.cards[round][k]).length;
    bar.classList.toggle("indeterminate", done === 0);
    $("#wcBar").style.width = done ? Math.round((done / seats.length) * 100) + "%" : "";
    // a cada poucos segundos, mostra o que um dos mentores que ainda pensa está pesando
    const pending = seats.filter((k) => !state.cards[round][k]);
    if (pending.length && Date.now() - (state.museAt || 0) > 5200) {
      state.museAt = Date.now();
      state.museIdx = ((state.museIdx ?? -1) + 1) % pending.length;
      const s = state.byKey[pending[state.museIdx]];
      muse.classList.add("fade");
      setTimeout(() => {
        muse.innerHTML = "<b>" + esc(s.short) + "</b> está pesando: " + esc(s.question.replace(/^./, (c) => c.toLowerCase())) + (done ? " · " + done + " de " + seats.length + " prontos" : "");
        muse.classList.remove("fade");
        $$(".seat").forEach((el) => el.classList.toggle("musing", el.dataset.seat === s.key));
      }, 300);
    }
  } else {
    bar.classList.add("indeterminate");
    $("#wcBar").style.width = "";
    muse.textContent = "";
    $$(".seat.musing").forEach((e) => e.classList.remove("musing"));
  }
}

function openGuide() {
  $("#guideBody").innerHTML = GUIDE();
  const d = $("#guideDialog");
  if (!d.open) d.showModal();
}

// ------------------------------------------------------------- PDF
async function savePdf(btn) {
  const id = btn.dataset.pdf;
  btn.disabled = true;
  const old = btn.textContent;
  btn.textContent = "Gerando o PDF…";
  try {
    let setup = state.setup, verdict = state.verdict;
    if (id) { // uma sessão da lista de anteriores
      const j = await fetch("/api/sessions/" + encodeURIComponent(id)).then((x) => x.json());
      setup = j.events.find((e) => e.type === "setup");
      verdict = [...j.events].reverse().find((e) => e.type === "verdict");
    }
    if (!setup || !verdict) throw new Error("Esta mesa ainda não tem veredito.");
    await downloadVerdictPdf({ setup, verdict, byKey: state.byKey, id: id || state.session });
  } catch (e) {
    console.error(e);
    toast("Não foi possível gerar o PDF. Tente de novo. Se repetir, recarregue a página.");
  } finally {
    btn.disabled = false;
    btn.textContent = old;
  }
}

// ------------------------------------------------------------- diversos
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 6000);
}

boot();

// Mesa aberta: o título fica em cima da mesa e o campo da decisão senta no meio dela (em tela larga).
// No celular o campo continua logo abaixo da mesa. Quando a mesa começa, o campo volta ao lugar e o meio mostra as falas.
(function mesaAberta() {
  const comp = $("#composer"), wait = $("#waiting"), dock = $("#mesaDock"), tit = $("#mesaTitulo"), stage = $("#stage");
  const h2 = wait && wait.querySelector("h2");
  if (!comp || !wait || !dock || !tit || !h2 || !stage) return;
  let agenda = 0;
  function posicionar() {
    agenda = 0;
    const aberta = !state.session && state.modo !== "conversa" && !wait.hidden;
    const noMeio = aberta && !comp.hidden && window.innerWidth > 720;
    if (tit.textContent !== h2.textContent) tit.textContent = h2.textContent;
    tit.hidden = !aberta;
    stage.classList.toggle("mesa-aberta", aberta);
    stage.classList.toggle("campo-no-meio", noMeio);
    if (noMeio && comp.parentElement !== wait) wait.appendChild(comp);
    else if (!noMeio && comp.parentElement !== dock) dock.prepend(comp);
  }
  const pedir = () => { if (!agenda) agenda = setTimeout(posicionar, 30); };
  new MutationObserver(pedir).observe(wait, { attributes: true, attributeFilter: ["hidden"], childList: true, characterData: true, subtree: true });
  new MutationObserver(pedir).observe(comp, { attributes: true, attributeFilter: ["hidden"] });
  new MutationObserver(pedir).observe(stage, { attributes: true, attributeFilter: ["class"] });
  addEventListener("resize", pedir);
  setInterval(pedir, 1500);   // rede de segurança: troca de sessão sem mexer no DOM observado
  posicionar();
})();
