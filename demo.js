// Crasto Mentores · by crasto.ai
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// Sem IA conectada, as falas são de demonstração, montadas a partir da pergunta e da área de cada mentor.
// Com IA conectada (menu Configurações), quem responde é o motor (motor.js).
(function () {
  "use strict";
  const D = window.MESA_DADOS, BIN = window.MESA_BIN || {};
  const byKey = Object.fromEntries(D.mentores.map((m) => [m.key, m]));
  const nativeFetch = window.fetch ? window.fetch.bind(window) : null;
  const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });
  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const low = (s) => String(s || "").charAt(0).toLowerCase() + String(s || "").slice(1);
  const hash = (k) => [...String(k)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7);
  const curto = (t, n) => (t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : t);
  const hoje = () => new Date().toISOString().slice(0, 10);
  const nomes = (ks) => { const a = ks.map((k) => byKey[k].short); return a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " e " + a[a.length - 1]; };

  const OPCOES_PADRAO = [
    { id: "A", label: "Fazer agora, com tudo" },
    { id: "B", label: "Fazer em pequeno, como teste de 60 dias" },
    { id: "C", label: "Esperar e juntar mais dados" },
  ];
  const REPLICA = {
    A: "o mercado não espera, e cada mês parado é receita que não volta.",
    B: "sem um teste curto, qualquer escolha é aposta, e aposta grande em cima de opinião é o erro mais caro.",
    C: "mudar agora troca o que funciona por uma promessa.",
  };
  const RAZOES = {
    A: (m) => [`Pela minha lente (${low(m.pillar)}), o custo de esperar é maior do que parece.`, "Cada mês parado é um mês que não volta. Quem testa pequeno demais aprende pouco.", "Faça com tudo, mas com um limite de perda escrito antes de começar."],
    B: (m) => [`Olho isso pela minha lente (${low(m.pillar)}). E por ela o que falta aqui é prova, não coragem.`, "Um teste de 60 dias é uma porta de mão dupla: se der errado, você volta sem quebrar nada.", 'Defina antes o número que diz "deu certo" e o número que diz "pare". Sem isso, o teste vira opinião.'],
    C: (m) => [`Pela minha lente (${low(m.pillar)}), ainda não há base para mudar.`, "Você está trocando o que funciona por uma promessa. Junte dados por 30 dias antes.", "Se os números confirmarem, a mudança fica mais barata e mais segura depois."],
  };
  const UMA_LINHA = [
    "Decida com dado, não com vontade: teste pequeno, data marcada e números na mesa.",
    "A pergunta certa vale mais que a resposta rápida. Faça o teste e escute o resultado.",
    (m) => `Na minha área (${low(m.pillar)}), o recado é um só: proteja o que funciona e teste o novo com limite.`,
    "Coragem não é pular no escuro. É acender a luz primeiro e depois andar rápido.",
  ];
  const AVISO = "(Fala de demonstração. Conecte a sua IA em Configurações para cada mentor responder a partir do próprio conhecimento.)";
  const notas = (sc) => Object.entries(sc).map(([k, v]) => `${k} ${v}/10`).join(" · ");

  /** Monta uma mesa inteira (eventos iguais aos que a versão real grava) para os mentores escolhidos. */
  function gerar({ id, titulo, decisao, seats, rapida = false, opcoes = OPCOES_PADRAO, tops = {} }) {
    const op = Object.fromEntries(opcoes.map((o) => [o.id, o]));
    const top = {};
    seats.forEach((k, i) => { top[k] = tops[k] || (seats.length >= 2 && i === 1 ? "A" : seats.length >= 4 && i === 2 ? "C" : "B"); });
    const deTop = (t) => seats.filter((k) => top[k] === t);
    const A = deTop("A"), B = deTop("B"), C = deTop("C");
    const solo = seats.length === 1;   // 1 lugar: conversa com um mentor só (sem divergências, debate nem votação)
    const mudou = solo ? null : A[0];   // quem muda de posição no debate
    const pesos = Object.fromEntries(seats.map((k) => { const w = 1 + (hash(k) % 3); return [k, { weight: w, reason: `Pesa ${w} de 3: a decisão mexe com ${low(byKey[k].pillar)}.` }]; }));
    const nota = (k, o, rodada) => {
      const h = hash(k + o);
      let t = top[k];
      if (rodada >= 2 && k === mudou) t = "B";
      return o === t ? 7 + (h % 3) : o === "B" ? 5 + (h % 2) : 2 + (h % 3);
    };
    const notasDe = (k, r) => Object.fromEntries(opcoes.map((o) => [o.id, nota(k, o.id, r)]));
    const media = (r) => Object.fromEntries(opcoes.map((o) => {
      const tot = seats.reduce((a, k) => a + pesos[k].weight, 0);
      const soma = seats.reduce((a, k) => a + pesos[k].weight * nota(k, o.id, r), 0);
      return [o.id, { score: Math.round((soma / tot) * 10) / 10, math: `(${seats.map((k) => `${pesos[k].weight}x${nota(k, o.id, r)}`).join(" + ")}) / ${tot}`, }];
    }));
    let t = 0;
    const ev = [];
    const fim = {};   // como cada mentor termina (vai para a tabela do veredito e do PDF)
    const push = (e, dt = 0) => { t += dt; ev.push({ ...e, t }); };
    push({ type: "phase", phase: "setup", label: "O Mediador está lendo a sua pergunta" });
    push({
      type: "setup", title: titulo, decision: decisao, mode: rapida ? "quick" : "full", seats, weights: pesos, options: opcoes,
      brief: `${decisao} O Mediador separou as opções e as premissas abaixo. ${solo ? "O mentor testa" : "A mesa testa"} a sua inclinação em vez de concordar com ela.`,
      assumptions: ["Os números exatos de caixa e de margem não foram informados; a mesa trabalha com faixas.", "O teste pode ser desfeito sem multa nem contrato longo.", "Quem decide no fim é você; a mesa aconselha."],
    }, 1600);

    // Rodada 1: aberturas
    push({ type: "phase", phase: "round1", label: "Rodada 1: posições de abertura" }, 900);
    push({ type: "round_start", round: 1 }, 50);
    seats.forEach((k) => push({ type: "seat_start", round: 1, seat: k }, 20));
    t += 6000;
    seats.forEach((k) => {
      const m = byKey[k], sc = notasDe(k, 1), tp = top[k];
      const stance = tp === "A" ? "Sim forte" : tp === "C" ? "Não, por enquanto" : "Sim, se";
      const call = `Fico com a ${tp}: ${low(op[tp].label)}. Minha pergunta para você: ${low(m.question)}`;
      const r = RAZOES[tp](m);
      fim[k] = { stance, oneLine: call, moved: "" };
      const text = `MENTOR: ${m.name} (${m.pillar})\nPOSIÇÃO: ${stance}\nNOTAS DAS OPÇÕES: ${notas(sc)}\nNOTA DO PILAR: ${sc[tp]}/10\nCONFIANÇA: ${3 + (hash(k) % 2)}/5\nRISCO DE RUÍNA: nenhum\nPORTA: mão dupla\n\nA DECISÃO: ${call}\n\nPORQUÊ:\n1. ${r[0]}\n2. ${r[1]}\n3. ${r[2]}\n\n${AVISO}`;
      push({ type: "seat_done", round: 1, seat: k, name: m.name, text, quotes: [], parsed: { stance, call, optionScores: sc, pillar: sc[tp], finalScore: null, confidence: 3, ruin: "none", door: "two-way", disagreeWith: null, disagreeLine: "", concede: "", moved: "", vote: "", amendment: "", oneLine: "", question: "", risk: "", thisWeek: "" } }, 400);
    });
    push({ type: "round_done", round: 1, scores: media(1) }, 300);

    // Divergências
    const cruxes = [];
    const votos = {};
    const emendas = [];
    if (!solo) {
    push({ type: "phase", phase: "cruxes", label: "O Mediador está achando os pontos de divergência" }, 600);
    if (A.length && B.length) cruxes.push({ question: `${op.A.label}, ou só depois de um teste?`, sides: [{ position: "Agora. Esperar custa mais caro do que errar rápido.", seats: A }, { position: "Depois do teste. Primeiro a prova, depois a aposta grande.", seats: B }] });
    if (C.length && (B.length || A.length)) cruxes.push({ question: "Esperar mais dados protege o negócio ou só adia a decisão?", sides: [{ position: "Protege: o que funciona hoje não pode ser trocado por uma promessa.", seats: C }, { position: "Adia: um teste com data dá dado melhor do que esperar parado.", seats: B.length ? B : A }] });
    if (!cruxes.length) cruxes.push({ question: "O teste precisa de data para acabar, ou pode correr até ficar claro?", sides: [{ position: "Precisa de data: sem prazo, o teste vira desculpa.", seats: seats.slice(0, Math.ceil(seats.length / 2)) }, { position: "Pode correr: a data certa aparece com os números.", seats: seats.slice(Math.ceil(seats.length / 2)) }].filter((s) => s.seats.length) });
    push({ type: "cruxes", cruxes, unanimous: false, note: B.length > seats.length / 2 ? "A maior parte da mesa prefere testar antes. A briga real é entre agir já e esperar mais dados." : "A mesa está dividida: cada lado tem um argumento forte.", pressure: {} }, 2600);

    // Rodada 2: debate
    push({ type: "phase", phase: "round2", label: "Rodada 2: o debate" }, 600);
    push({ type: "round_start", round: 2 }, 50);
    seats.forEach((k) => push({ type: "seat_start", round: 2, seat: k }, 20));
    t += 5000;
    seats.forEach((k, i) => {
      const m = byKey[k], tp = top[k];
      const outros = seats.filter((x) => x !== k);
      const alvo = (tp === "B" ? [...A, ...C] : B).filter((x) => x !== k)[i % Math.max(1, (tp === "B" ? A.length + C.length : B.length))] || outros[0];
      const cede = outros[(i + 2) % Math.max(1, outros.length)] || alvo;
      if (!alvo) return;
      const at = alvo === mudou ? "A" : top[alvo];
      const disagreeLine = `${byKey[alvo].short}. O argumento é a ${at}, ${low(op[at].label)}. Minha réplica: ${REPLICA[tp === "A" && k === mudou ? "B" : tp]}`;
      const concede = `${byKey[cede].short} tem razão num ponto: o teste precisa de data para acabar e de um dono só. Isso muda o meu plano: ponho as duas coisas no papel hoje.`;
      const moved = k === mudou ? "sim, da A para a B, porque o limite de perda que eu pedia cabe dentro de um teste com data." : "não";
      const sc = notasDe(k, 2);
      fim[k].moved = k === mudou ? moved : "";
      const text = `MENTOR: ${m.name}\n\nDISCORDO MAIS DE: ${disagreeLine}\n\nCONCEDO: ${concede}\n\nMUDEI DE POSIÇÃO: ${moved}\n\nNOTAS DAS OPÇÕES: ${notas(sc)}\n\n${AVISO}`;
      push({ type: "seat_done", round: 2, seat: k, name: m.name, text, quotes: [], parsed: { stance: k === mudou ? "Sim, se (mudou para a B)" : "", call: "", optionScores: sc, pillar: null, finalScore: null, confidence: null, ruin: "", door: "", disagreeWith: alvo, disagreeLine, concede, moved, vote: "", amendment: "", oneLine: "", question: "", risk: "", thisWeek: "" } }, 400);
    });
    push({ type: "round_done", round: 2, scores: media(2) }, 300);

    // Rodada 3: votação (a Rápida pula)
    if (rapida) push({ type: "phase", phase: "skip3", label: "Modo rápido: a rodada de votação foi pulada" }, 600);
    else {
      push({ type: "phase", phase: "draft", label: "O Mediador está pesando o debate" }, 600);
      push({ type: "draft", draft: { option: "B", label: "SIGA COM CONDIÇÕES", recommendation: `Ir de B: ${low(op.B.label)}, com dono, número de parar e data de decisão.`, conditions: [], next_steps: [], cheapest_test: "", kill_criteria: "" } }, 2000);
      push({ type: "phase", phase: "round3", label: "Rodada 3: a votação" }, 600);
      push({ type: "round_start", round: 3 }, 50);
      seats.forEach((k) => push({ type: "seat_start", round: 3, seat: k }, 20));
      t += 4000;
      seats.forEach((k, i) => {
        const m = byKey[k];
        const vote = top[k] === "C" ? "dissent" : k === mudou || i % 3 === 2 ? "amend" : "endorse";
        votos[vote] = (votos[vote] || 0) + 1;
        const amendment = vote === "amend" ? "Pôr no papel o dia 60 como data de decisão, com um dono só e o número de parar." : vote === "dissent" ? "Eu esperaria 30 dias de dados antes até do teste." : "";
        if (vote === "amend") emendas.push(k);
        const u = UMA_LINHA[hash(k) % UMA_LINHA.length];
        const oneLine = typeof u === "function" ? u(m) : u;
        const sc = notasDe(k, 3);
        const fs = Math.max(...Object.values(sc));
        Object.assign(fim[k], { stance: vote, oneLine });
        const text = `MENTOR: ${m.name}\nVOTO: ${vote === "endorse" ? "Apoia" : vote === "amend" ? "Apoia com emenda" : "Diverge"}\nNOTAS DAS OPÇÕES: ${notas(sc)}\nNOTA FINAL: ${fs}/10\n${amendment ? `EMENDA OU DIVERGÊNCIA: ${amendment}\n` : ""}\nUMA LINHA PARA VOCÊ: ${oneLine}\n\n${AVISO}`;
        push({ type: "seat_done", round: 3, seat: k, name: m.name, text, quotes: [], parsed: { stance: "", call: "", optionScores: sc, pillar: fs, finalScore: fs, confidence: null, ruin: "", door: "", disagreeWith: null, disagreeLine: "", concede: "", moved: "", vote, amendment, oneLine, question: "", risk: "", thisWeek: "" } }, 400);
      });
      push({ type: "round_done", round: 3, scores: media(3) }, 300);
    }
    }   // fim do !solo

    // Veredito
    push({ type: "phase", phase: "verdict", label: "O Mediador está escrevendo o veredito" }, 600);
    const pontos = ["Um teste de 60 dias é uma porta de mão dupla: se der errado, você volta sem quebrar nada.", "Sem número de parar escrito antes, o teste vira opinião e se arrasta.", "O custo de esperar existe: por isso o teste tem data para acabar.", "Um dono só e um número por semana: é assim que se cobra o resultado."];
    const porQue = (solo ? [seats[0], seats[0], seats[0]] : [...B, ...A].slice(0, 4)).map((k, i) => ({ point: solo ? RAZOES[top[k]](byKey[k])[i] : pontos[i], seat: byKey[k].short, framework: byKey[k].pillar }));
    const fights = cruxes.map((c) => ({ crux: c.question, story: `${c.sides.map((s) => `${nomes(s.seats.slice(0, 4))}${s.seats.length > 4 ? " e outros" : ""}: ${low(s.position)}`).join(" ")}${mudou ? ` ${byKey[mudou].short} mudou para a B no debate.` : ""} Resolvido: teste com data, e a decisão maior volta à mesa no dia 60.` }));
    const minoritario = solo ? null : C[0] || A[0];
    const rf = solo ? 1 : rapida ? 2 : 3;
    const final = media(rf);
    const rec = solo ? top[seats[0]] : "B";
    const verdict = {
      label: solo && rec === "C" ? "ESPERE" : solo && rec === "A" ? "SIGA" : "SIGA COM CONDIÇÕES",
      call: solo ? `${byKey[seats[0]].short} recomenda a ${rec}: ${low(op[rec].label)}. Defina hoje o número de sucesso, o número de parar e a data de decisão.` : `Vá de B: ${low(op.B.label)}. Defina hoje o número de sucesso, o número de parar e a data de decisão no dia 60.`,
      override_note: "", recommended: rec, why: porQue, fights,
      minority: minoritario ? { seat: byKey[minoritario].short, quote: `Minha réplica continua de pé: ${REPLICA[top[minoritario]]}`, would_have_to_be_true: "Os números dos próximos 30 dias mostrarem que o que funciona hoje corre risco com a mudança." } : null,
      amendments: emendas.slice(0, 3).map((k) => ({ seat: byKey[k].short, amendment: "Pôr no papel o dia 60 como data de decisão, com um dono só e o número de parar.", adopted: true, reason: C.length ? "A maioria aceitou; virou condição." : "Ninguém na mesa se opôs; virou condição." })),
      conditions: ["Um dono só para o teste, com o nome escrito.", "Número de sucesso e número de parar definidos antes de começar.", "Data de decisão no dia 60, mesmo que o teste atrase.", "Teto de gasto do teste combinado e respeitado."],
      next_steps: [{ when: "Hoje", action: "Escrever o número de sucesso, o número de parar e o teto de gasto." }, { when: "Esta semana", action: "Escolher o dono do teste e começar pequeno." }, { when: "Dia 30", action: "Olhar os números e corrigir a rota, se preciso." }, { when: "Dia 60", action: "Decidir: ampliar, ajustar ou encerrar." }],
      cheapest_test: "Rodar a versão pequena por 60 dias, sem mudar mais nada, e anotar toda semana o número combinado.",
      kill_criteria: "Se o número de parar aparecer antes do dia 60, encerre o teste e volte ao que funcionava.",
      revisit: "Dia 60, ou antes se o número de parar aparecer.",
      scores: final, spread: 0, confidence: 7, support: 8, votes: rapida || solo ? null : votos,
      disclaimer: "Mentores simulados por IA a partir da obra pública de cada pessoa. Não são as pessoas e não falam por elas. Não é aconselhamento profissional (jurídico, financeiro, médico ou psicológico): quem decide é você.",
    };
    const r3 = rf;
    push({ type: "verdict", verdict, seats: seats.map((k) => { const sc = notasDe(k, r3); return { key: k, weight: pesos[k].weight, stance: fim[k].stance, optionScores: sc, pillar: Math.max(...Object.values(sc)), moved: fim[k].moved, oneLine: fim[k].oneLine }; }) }, 2600);
    return { id, title: titulo, prompt: decisao, mode: rapida ? "quick" : "full", status: "done", events: ev };
  }

  // ------------------------------------------------ sessões: uma de exemplo, pronta, com 12 lugares
  const sessoes = new Map();
  const exemplo = gerar({
    id: "2026-11-08-exemplo-gerente",
    titulo: "Modelo de pergunta: Contratar um gerente ou seguir sozinho",
    decisao: "Tenho uma empresa de serviços com 8 pessoas e faço tudo sozinho na gestão. Devo contratar já um gerente em tempo integral, testar por 60 dias com um gerente de meio período ou seguir sozinho e só organizar os processos?",
    seats: ["socrates", "munger", "seneca", "kahneman", "aristoteles", "bengraham", "marcoaurelio", "epicteto", "carloscrasto", "frankl", "jung", "hellinger"],
    opcoes: [{ id: "A", label: "Contratar já um gerente em tempo integral" }, { id: "B", label: "Testar por 60 dias com um gerente de meio período" }, { id: "C", label: "Seguir sozinho e só organizar os processos" }],
    tops: { aristoteles: "A", marcoaurelio: "A", bengraham: "C", seneca: "C" },
  });
  sessoes.set(exemplo.id, exemplo);
  const exemplo3 = gerar({
    id: "2026-11-08-exemplo-preco",
    titulo: "Modelo de pergunta: Subir o preço da mentoria",
    decisao: "Cobro R$ 2.000 por mês na minha mentoria e tenho 15 clientes. Devo subir para R$ 3.500 para todos agora, subir só para clientes novos ou manter o preço?",
    seats: ["kahneman", "munger", "seneca"],
    opcoes: [{ id: "A", label: "Subir para todos agora" }, { id: "B", label: "Subir só para clientes novos" }, { id: "C", label: "Manter o preço" }],
  });
  sessoes.set(exemplo3.id, exemplo3);
  const exemplo1 = gerar({
    id: "2026-11-08-exemplo-emprestimo",
    titulo: "Modelo de pergunta: Pegar empréstimo para a segunda loja",
    decisao: "Tenho uma loja que dá lucro de R$ 25 mil por mês. Devo pegar um empréstimo de R$ 300 mil para abrir a segunda loja agora, abrir um quiosque pequeno antes ou esperar juntar o dinheiro?",
    seats: ["bengraham"],
    opcoes: [{ id: "A", label: "Pegar o empréstimo e abrir a loja agora" }, { id: "B", label: "Abrir um quiosque pequeno antes" }, { id: "C", label: "Esperar e juntar o dinheiro" }],
    tops: { bengraham: "C" },
  });
  sessoes.set(exemplo1.id, exemplo1);

  // ------------------------------------------------ a mesa convocada pela tela (Convocar a mesa)
  const mesa = { estado: "livre", rodada: 0, pergunta: "", pedido: null, timers: [], erro: "", prep: null };
  const vivos = new Map();   // mesas do motor em andamento: quem está ouvindo os eventos
  let live = null, n = 0;
  const depois = (ms, fn) => mesa.timers.push(setTimeout(fn, ms));
  const limpar = () => { mesa.timers.forEach(clearTimeout); mesa.timers = []; };
  function convocar(b) {
    if (mesa.estado === "pensando" || mesa.estado === "esperando" || live) return json({ erro: "Já existe uma mesa em andamento." }, 409);
    const decisao = String(b.decisao || "").trim();
    let seats = (Array.isArray(b.mentores) ? b.mentores : []).filter((k) => byKey[k]).slice(0, 12);
    if (!seats.length) seats = (D.mesas.find((x) => x.sala === b.sala) || D.mesas[0]).mentores.slice(0, 12);
    if (b.rapida) seats = seats.slice(0, 4);
    mesa.pedido = { decisao, seats, rapida: Boolean(b.rapida) };
    mesa.estado = "pensando"; mesa.rodada = 0; mesa.erro = ""; mesa.prep = null;
    if (window.MOTOR && window.MOTOR.ativo()) {
      const pedido = mesa.pedido;
      window.MOTOR.preparar(decisao, seats).then((prep) => {
        if (mesa.pedido !== pedido) return;
        mesa.prep = prep; mesa.estado = "esperando"; mesa.pergunta = prep.pergunta;
      }).catch((e) => { if (mesa.pedido === pedido) { mesa.estado = "falhou"; mesa.erro = `A IA não respondeu: ${e.message}`; } });
      return json({ ok: true });
    }
    depois(2500, () => { mesa.estado = "esperando"; mesa.pergunta = (mesa.pedido.seats.length === 1 ? "Antes de começar" : "Antes de a mesa começar") + ": qual é o prazo para decidir e quanto você pode investir sem apertar o caixa?"; });
    return json({ ok: true });
  }
  function responder(b) {
    if (mesa.estado !== "esperando") return json({ erro: "Nada esperando resposta." }, 409);
    if (mesa.prep && window.MOTOR) return responderMotor(b);
    mesa.estado = "pensando"; mesa.rodada = 1;
    depois(2500, () => {
      const p = mesa.pedido;
      const s = gerar({ id: `${hoje()}-mesa-${++n}`, titulo: curto(p.decisao.replace(/\s+/g, " "), 60), decisao: p.decisao, seats: p.seats, rapida: p.rapida });
      sessoes.set(s.id, s);
      live = s.id;
    });
    return json({ ok: true });
  }
  function responderMotor(b) {
    const p = mesa.pedido, prep = mesa.prep;
    const resp = String(b.resposta || "").trim().slice(0, 1500);
    const decisao = p.decisao + (resp ? `\n\nPergunta do Mediador: ${prep.pergunta}\nResposta do usuário: ${resp}` : "");
    const s = { id: `${hoje()}-mesa-${Date.now().toString(36)}`, title: prep.titulo, prompt: p.decisao, mode: p.rapida ? "quick" : "full", status: "running", events: [] };
    const ouvintes = new Set(); let cancelada = false;
    s.cancelar = () => { cancelada = true; ouvintes.forEach((f) => f({ type: "end" })); ouvintes.clear(); };
    vivos.set(s.id, { ouvintes, get cancelada() { return cancelada; } });
    const emite = (e) => { if (cancelada) return; s.events.push({ ...e, t: 0 }); ouvintes.forEach((f) => f(e)); };
    sessoes.set(s.id, s); live = s.id; mesa.estado = "pensando"; mesa.rodada = 1; mesa.pergunta = "";
    const fimDaMesa = (erro) => {
      if (cancelada) return;
      s.status = erro ? "failed" : "done";
      ouvintes.forEach((f) => f({ type: "end" })); ouvintes.clear(); vivos.delete(s.id);
      if (live === s.id) live = null;
      mesa.estado = erro ? "falhou" : "livre"; mesa.erro = erro || ""; mesa.rodada = 0; mesa.prep = null;
      if (!s.events.length) sessoes.delete(s.id);
    };
    window.MOTOR.rodarMesa(mesa, prep, decisao, p.seats, p.rapida, emite).then(() => fimDaMesa("")).catch((e) => fimDaMesa(`A mesa parou: ${e.message}`));
    return json({ ok: true });
  }
  function cancelar() {
    limpar();
    const s = live && sessoes.get(live); if (s && s.cancelar) { s.cancelar(); vivos.delete(s.id); if (!s.events.length) sessoes.delete(s.id); else s.status = "done"; }
    mesa.estado = "livre"; mesa.pergunta = ""; mesa.prep = null; mesa.pedido = null; live = null; return json({ ok: true });
  }

  // "Debater mais com": conversa com um mentor só, levando o tema da mesa que acabou de acontecer
  const conversas = new Map();
  function perguntar(b) {
    const k = String(b.mentor || ""), m = byKey[k], q = String(b.pergunta || "").trim().slice(0, 600);
    if (!m || q.length < 3) return json({ erro: "Pergunta vazia ou mentor desconhecido." }, 400);
    const lista = conversas.get(k) || [];
    if (lista.some((i) => i.estado === "pensando")) return json({ erro: "Outra pergunta está sendo respondida." }, 409);
    const tema = b.sessao && sessoes.get(b.sessao);
    const item = { id: String(Date.now()), pergunta: q, resposta: "", estado: "pensando" };
    lista.push(item); conversas.set(k, lista.slice(-12));
    const fala = tema
      ? `Voltando ao que a mesa decidiu sobre "${tema.title}": ${tema.events.some((e) => e.type === "seat_done" && e.seat === k) ? "eu mantenho o que disse no debate, e" : "eu não estava na mesa, mas"} pela minha lente (${low(m.pillar)}) a sua pergunta muda pouco a conclusão. O passo seguinte é escrever o número que diz "deu certo" e a data em que você olha de novo. ${m.question}`
      : `Pela minha lente (${low(m.pillar)}), antes de responder eu devolvo a pergunta: ${low(m.question)} Com isso claro, o resto fica mais fácil de decidir.`;
    if (window.MOTOR && window.MOTOR.ativo()) {
      window.MOTOR.conversar(k, q, tema ? tema.title : "").then((t) => { item.resposta = t; item.estado = "pronta"; })
        .catch((e) => { item.resposta = `Não consegui responder agora: ${e.message}`; item.estado = "pronta"; });
      return json({ ok: true, id: item.id });
    }
    setTimeout(() => { item.estado = "pronta"; item.resposta = fala; }, 2500);
    return json({ ok: true, id: item.id });
  }

  function resumo(s) { return { id: s.id, title: s.title, prompt: s.prompt, mode: s.mode, status: s.status, source: "saved", exemplo: false }; }
  function api(path, method, body) {
    let b = {}; try { b = body ? JSON.parse(body) : {}; } catch {}
    if (method === "POST") {
      if (path === "/api/convocar") return convocar(b);
      if (path === "/api/responder") return responder(b);
      if (path === "/api/cancelar") return cancelar();
      if (path === "/api/perguntar") return perguntar(b);
      return json({ erro: "não encontrado" }, 404);
    }
    if (path === "/api/mentores") return json({ mentores: D.mentores, salas: D.salas, mesas: D.mesas, origensPermitidas: [], cerebros: "", cerebrosOk: true, sessoes: "", vozChave: false, vozLigada: false });
    if (path === "/api/ping") return json({ ok: true, sala: "mesa", versao: "1.0" });
    if (path === "/api/mesa") return json({ estado: mesa.estado, rodada: mesa.rodada, pergunta: mesa.pergunta, erro: mesa.erro || "" });
    if (path === "/api/sessions") return json({ sessions: [...sessoes.values()].filter((s) => s.id !== live).map(resumo).sort((a, b2) => (a.id < b2.id ? 1 : -1)), running: null, live });
    if (path.startsWith("/api/sessions/")) { const s = sessoes.get(decodeURIComponent(path.split("/").pop())); if (!s) return json({ erro: "não encontrada" }, 404); const { cancelar: _c, ...semFn } = s; return json({ ...semFn, exemplo: false }); }
    if (path.startsWith("/api/conversa/")) return json({ itens: conversas.get(decodeURIComponent(path.split("/").pop())) || [] });
    if (path.startsWith("/api/voz/")) return new Response(null, { status: 204 });
    return json({ erro: "não encontrado" }, 404);
  }

  window.fetch = async function (input, init = {}) {
    const url = typeof input === "string" ? input : input.url;
    if (url.startsWith("/api/")) return api(url.split(/[?#]/)[0], String(init.method || "GET").toUpperCase(), init.body);
    for (const k of Object.keys(BIN)) if (url.endsWith(k)) return new Response(b64(BIN[k]));
    return nativeFetch(input, init);
  };

  // A mesa ao vivo chega por EventSource na versão real; aqui os eventos saem desta lista, no tempo deles.
  window.EventSource = class {
    constructor(url) {
      this.onmessage = null; this.onerror = null; this.t = [];
      const s = sessoes.get(decodeURIComponent(String(url).split("/").pop()));
      if (!s) return;
      const manda = (o) => { if (this.onmessage) this.onmessage({ data: JSON.stringify(o) }); };
      const vivo = vivos.get(s.id);
      if (vivo) {
        this.t.push(setTimeout(() => {
          s.events.forEach((e) => manda(e));
          this.ouvir = (e) => manda(e); vivo.ouvintes.add(this.ouvir); this.vivo = vivo;
        }, 50));
        return;
      }
      s.events.forEach((e) => this.t.push(setTimeout(() => manda(e), 300 + e.t)));
      const fim = s.events[s.events.length - 1].t + 800;
      this.t.push(setTimeout(() => { manda({ type: "end" }); if (live === s.id) { live = null; mesa.estado = "livre"; mesa.rodada = 0; } }, fim));
    }
    close() { this.t.forEach(clearTimeout); this.t = []; if (this.vivo && this.ouvir) this.vivo.ouvintes.delete(this.ouvir); }
  };
})();
