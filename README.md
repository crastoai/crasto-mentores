# Crasto Mentores · by crasto.ai

O Crasto Mentores é uma tela que abre no navegador com uma mesa de mentores simulados por IA, desenhados em caricatura. Você escreve ou fala uma decisão difícil, sobre qualquer tema, inclusive os mais inusitados. Os mentores debatem a sua decisão em voz alta, cada um na sua vez, e no fim um Mediador escreve o veredito. O projeto foi criado por **Carlos Crasto**, fundador da Crasto.ai, para ajudar as pessoas a tomar decisões melhores sobre qualquer assunto.

**Abrir a mesa:** https://crastoai.github.io/crasto-mentores/

---

## Como funciona

1. Você descreve a decisão, por texto ou pelo microfone.
2. Os mentores debatem em 3 rodadas:
   - **Aberturas:** cada mentor dá a sua primeira opinião.
   - **Divergências:** os mentores respondem uns aos outros e mostram onde discordam.
   - **Votação:** cada mentor vota e explica o voto.
3. Cada mentor fala na sua vez, com a boca mexendo e com voz.
4. O **Mediador** escreve o veredito. Você pode baixar o veredito em PDF.
5. Depois, você pode **debater mais** com um mentor só.

O conhecimento de cada mentor fica num arquivo de texto aberto, em `cerebros/<key>.md`, feito a partir da obra pública da pessoa. Quem pensa e responde é a IA que você conectar.

---

## Como usar em 3 passos

1. Abra https://crastoai.github.io/crasto-mentores/ no Chrome ou no Edge.
2. Conecte a sua IA em **Configurações → Sua IA** (veja abaixo).
3. Escreva ou fale a sua decisão, escolha os mentores e comece o debate.

---

## Conectar a IA

Abra **Configurações → Sua IA** e escolha uma das opções.

### Pelo link, sem instalar nada

Você cola a sua chave de IA. A chave fica guardada só no seu navegador. Ela nunca vai para a Crasto.ai nem para o GitHub.

| Opção | O que saber |
|---|---|
| **Google Gemini** | Tem cota grátis. A chave é criada em aistudio.google.com. |
| **OpenRouter** | Dá acesso a vários modelos, alguns grátis. |
| **DeepSeek** | Custo baixo por mesa. |
| **Kimi (Moonshot)** | Custo baixo por mesa. |
| **OpenAI** | Use a sua chave da OpenAI. |
| **Claude** | Use a sua chave da Anthropic. |
| **Ollama** | Roda no seu computador, é grátis e nada sai da sua máquina. |

**Ollama pelo link.** O Ollama só aceita pedidos do site se você liberar o endereço do site. Feche o Ollama e ligue de novo com a variável `OLLAMA_ORIGINS`:

- Mac (no Terminal):
  ```
  launchctl setenv OLLAMA_ORIGINS "https://crastoai.github.io"
  ```
  Depois feche e abra o aplicativo Ollama.
- Windows: em **Configurações do sistema → Variáveis de ambiente**, crie a variável `OLLAMA_ORIGINS` com o valor `https://crastoai.github.io`. Depois feche e abra o Ollama.

### Pelo computador, com a assinatura que você já tem

Esta opção é para quem usa **Claude Code**, **Codex** ou **Gemini CLI**. A mesa usa a assinatura que você já paga, sem chave nova.

Veja como instalar na seção seguinte.

### Quanto custa uma mesa de 7 mentores (valor aproximado)

| Como você conecta | Custo por mesa |
|---|---|
| Assinatura que você já tem, cota grátis do Gemini ou Ollama | R$ 0 |
| DeepSeek ou Kimi | centavos |
| Claude ou OpenAI | de R$ 0,10 a R$ 2,50, conforme o modelo |

O valor real depende do modelo, do tamanho da decisão e de quantas vezes você pede para debater mais.

---

## Instalar no computador

Você precisa do **Node.js 18 ou mais novo** (nodejs.org) e de uma das ferramentas: Claude Code, Codex ou Gemini CLI, já instalada e com login feito.

1. Nesta página do GitHub, clique em **Code → Download ZIP**.
2. Descompacte o arquivo.
3. Dê dois cliques no arquivo de início:
   - Mac: `iniciar-mac.command`
   - Windows: `iniciar-windows.bat`
4. A tela abre em http://127.0.0.1:4790.

**Se o sistema bloquear o arquivo:**

- **Mac**, aviso de "desenvolvedor não identificado": clique com o botão direito no arquivo → **Abrir** → **Abrir** de novo.
- **Windows**, aviso do SmartScreen: clique em **Mais informações** → **Executar assim mesmo**.

Para desligar, feche a janela do Terminal (Mac) ou do Prompt de Comando (Windows).

---

## Alimentar o cérebro dos mentores

Cada mentor sabe o que está no arquivo do seu cérebro. Você pode acrescentar referências de duas formas.

### Pela tela

1. Abra **Configurações → Cérebro dos mentores**.
2. Escolha o mentor.
3. Acrescente um livro, artigo, vídeo ou documento: título, autor, link e o que ensina.

A referência fica salva no seu navegador e entra nas respostas desse mentor. O botão **Baixar em Markdown** gera o texto pronto para colar no arquivo do mentor.

### Pelo arquivo

Abra `cerebros/<key>.md` e escreva na seção **"Para alimentar este cérebro"**. Exemplo: o cérebro do Sêneca fica em `cerebros/seneca.md`.

---

## Mentores desta versão (22)

**No centro da mesa:** Carlos Crasto. Ele senta no centro por padrão. Para tirá-lo da mesa, desmarque o nome dele.

**Filósofos**
- Sócrates
- Platão
- Aristóteles
- Sêneca
- Epicteto
- Marco Aurélio
- Confúcio
- Nietzsche
- Zygmunt Bauman
- George Orwell

**Especialistas financeiros**
- Charlie Munger
- Benjamin Graham
- Philip Fisher
- John Bogle
- Daniel Kahneman

**Terapias integrativas**
- Carl Gustav Jung
- Viktor Frankl
- Bert Hellinger
- Milton Erickson
- Dave Elman
- Alexander Lowen

Pessoas vivas famosas ficam fora desta primeira versão.

---

## Vozes

Os mentores falam com **vozes humanas do seu aparelho**: grátis e sem clonar a voz de ninguém. A tela escolhe sempre a voz mais humana que existir, masculina ou feminina conforme o mentor, e nunca usa voz robótica se houver outra.

- **Mac:** Ajustes do Sistema → Acessibilidade → Conteúdo Falado → Gerenciar Vozes → Português (Brasil): baixe **Luciana (Premium)** e **Felipe (Aprimorada)**.
- **iPhone e iPad:** Ajustes → Acessibilidade → Conteúdo Falado → Vozes → Português (Brasil): baixe **Luciana** e **Felipe** (Premium ou Aprimorada) e use o Safari.
- **Windows:** use o **Microsoft Edge**, que já traz as vozes neurais **Antonio, Francisca e Thalita "Online (Natural)"**.
- **Android:** baixe a voz de alta qualidade do Google em Português (Brasil).

O passo a passo completo e o ritmo de cada mentor estão em [VOZES.md](VOZES.md).

---

## Privacidade e segurança

- **A sua chave de IA fica só no seu navegador.** Ela vai direto do seu navegador para a empresa de IA que você escolheu.
- **Nada vai para a Crasto.ai.** A Crasto.ai não recebe a sua decisão, o debate, o veredito nem a sua chave.
- **O site não tem servidor da Crasto.ai.** Ele é uma página estática hospedada no GitHub Pages.
- **O servidor local só escuta 127.0.0.1.** Na instalação pelo computador, só o seu próprio computador acessa a tela. Outras máquinas da rede não acessam.
- **Microfone:** no Chrome e no Edge, o reconhecimento da sua fala passa pelo Google ou pela Microsoft.
- **Voz dos mentores:** as vozes do sistema são geradas no seu próprio computador. As vozes com "Online" ou "Google" no nome são geradas pela Microsoft ou pelo Google.
- **Referências do cérebro:** o que você acrescenta pela tela fica no seu navegador.

---

## Aviso importante

- Os mentores são **simulados por IA**.
- Eles **não são as pessoas** e **não falam por elas**.
- As respostas **não são aconselhamento profissional**: financeiro, médico, psicológico ou jurídico.
- Para decisões que envolvem dinheiro, saúde, terapia ou lei, procure um profissional habilitado.

---

## Licença

- **Uso não comercial é livre.** O código está sob a PolyForm Noncommercial 1.0.0 e os cérebros dos mentores sob a CC BY-NC 4.0. Você pode usar, estudar, modificar e compartilhar para uso pessoal sem fim comercial, estudo, pesquisa e ensino. Instituições de ensino, entidades beneficentes, instituições de pesquisa pública, de saúde ou segurança pública, de meio ambiente e órgãos de governo também podem usar.
- **Uso comercial precisa de licença da Crasto.ai.** Exemplos: vender ou revender; colocar em produto, serviço ou assinatura pagos; usar em consultoria, mentoria, terapia ou curso pagos; usar dentro de empresa com fins lucrativos. Fale com a Crasto.ai em [crasto.ai](https://crasto.ai).
- **Partes de terceiros mantêm a própria licença.** Trechos de um projeto aberto sob a licença MIT, a biblioteca jsPDF (MIT) e a fonte Montserrat (OFL 1.1). Os trechos MIT continuam livres nos termos da MIT. Detalhes em [NOTICE](NOTICE).
- **Marca e retratos não estão licenciados.** A marca Crasto.ai, o logo, o nome "Crasto Mentores" e os retratos em caricatura têm todos os direitos reservados. Você pode dizer que o seu trabalho é "baseado no Crasto Mentores, by crasto.ai", mas não pode usar esses itens como nome do seu produto.
- **Crédito.** Toda cópia do código mantém as linhas "Required Notice" do arquivo [NOTICE](NOTICE), como a licença exige. Pedimos também que a tela mantenha visível o crédito **"by crasto.ai"** com link para https://crasto.ai.

Textos completos: [LICENSE](LICENSE) · [NOTICE](NOTICE) · [cerebros/LICENSE.md](cerebros/LICENSE.md).

---

## Dúvidas para implementar

Dúvidas ou dificuldades para implementar? Fale com a Crasto.ai no WhatsApp: [(11) 91368-5973](https://wa.me/5511913685973?text=Oi%20Julie!%20Vim%20do%20Crasto%20Mentores%20e%20tenho%20uma%20d%C3%BAvida%20para%20implementar.).

Feito por **Carlos Crasto** · [crasto.ai](https://crasto.ai)
