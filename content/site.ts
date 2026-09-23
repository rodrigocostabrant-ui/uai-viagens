// Toda a copy da página, na redação da v2 aprovada (claude-design-export/design_handoff_uai_viagens).
// `principal` + `destaque`: o destaque é a frase prata (hero e CTA final) ou cinza (demais títulos).

export const site = {
  nome: "UAI Viagens",
  cnpj: "55.372.856/0001-80",
  instagramUrl: "https://www.instagram.com/uaiviagens_/",
  instagramHandle: "@uaiviagens_",
  whatsapp: "5531989519239",
  whatsappDisplay: "+55 31 98951-9239",

  nav: [
    { label: "Serviços", href: "#servicos" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Quem cuida", href: "#quem-cuida" },
    { label: "Dúvidas", href: "#duvidas" },
  ],

  cta: {
    principal: "Quero planejar minha viagem",
    ariaIcone: "Quero planejar minha viagem pelo WhatsApp",
    mensagemWhatsapp: "Olá, UAI Viagens! Vi o site e gostaria de planejar uma viagem.",
  },

  menu: { abrir: "Abrir menu", fechar: "Fechar menu", voltarAoTopo: "UAI Viagens, voltar ao topo" },

  selo: {
    avatar: "/images/otavio-avatar.jpg",
    hero: { linha1: "Quem responde é o Otávio.", linha2: "Uma pessoa, sem robô e sem compromisso." },
    menu: { linha1: "Quem responde é o Otávio.", linha2: "Uma pessoa, sem robô." },
    ctaFinal: { linha1: "Você fala direto com o Otávio.", linha2: "Sem robô e sem compromisso." },
  },

  hero: {
    rotulo: "Agência de viagens · Belo Horizonte",
    titulo: { antes: "Sua próxima viagem, ", destaque: "sem o trabalho", depois: " de organizar tudo sozinho." },
    lead: "A UAI pesquisa, compara, reserva e monta o roteiro com você. Do primeiro passo até o embarque.",
    faixa: ["Pacotes nacionais e internacionais", "Hospedagens", "Cruzeiros", "Roteiros personalizados"],
    atendimento: "Presencial em BH · Online em todo o Brasil",
    imagem: {
      src: "/images/destinos/hero-lago.jpg",
      profundidade: "/images/hero/hero-lago-depth.png",
      alt: "Proa de um barco de madeira avançando por um lago entre montanhas",
    },
  },

  pontoDePartida: {
    titulo: { principal: "Não sabe por onde começar?", destaque: "É daí que a gente parte." },
    lead: "Escolher destino, comparar voo e hotel, encaixar tudo no seu período e no seu orçamento. Isso toma um tempo que quase ninguém tem.",
    rotulo: "Você conta o que imagina. A UAI assume:",
    itens: [
      { titulo: "Pesquisa", texto: "Destinos, datas e opções que fazem sentido pro seu jeito de viajar." },
      { titulo: "Comparação", texto: "Voo, hospedagem e horário lado a lado. Sem vinte abas abertas." },
      { titulo: "Reservas", texto: "Tudo fechado e conferido num lugar só, antes de você sair de casa." },
      { titulo: "Roteiro", texto: "Os dias pensados, inclusive o deslocamento entre um lugar e outro." },
    ],
  },

  servicos: {
    rotulo: "O que a UAI organiza",
    titulo: { principal: "Quatro jeitos de começar.", destaque: "O mesmo cuidado." },
    lead: "A viagem completa ou só a parte que falta. Você diz o que já tem, a UAI organiza o resto.",
    dicaMobile: "Deslize para ver os quatro",
    itens: [
      {
        titulo: "Pacotes nacionais e internacionais",
        texto: "Passagem, hospedagem e logística pensadas juntas.",
        imagem: "/images/destinos/servico-paris.jpg",
        alt: "Ponte em Paris ao anoitecer, com a Torre Eiffel ao fundo",
        posicao: "50% 50%",
      },
      {
        titulo: "Hospedagens",
        texto: "Hotéis e acomodações escolhidos pro seu estilo de viagem.",
        imagem: "/images/destinos/servico-hospedagem.jpg",
        alt: "Piscina de hotel ao entardecer, entre palmeiras",
        posicao: "50% 50%",
      },
      {
        titulo: "Cruzeiros",
        texto: "Cabine, roteiro e reserva resolvidos antes de você embarcar.",
        imagem: "/images/destinos/servico-cruzeiro.jpg",
        alt: "Navio de cruzeiro atracado junto ao mar",
        posicao: "60% 50%",
      },
      {
        titulo: "Roteiros personalizados",
        texto: "Desenhados a partir do seu período, do seu orçamento e do que você quer viver.",
        imagem: "/images/destinos/servico-estrada.jpg",
        alt: "Estrada que segue em direção às montanhas",
        posicao: "50% 50%",
      },
    ],
  },

  comoFunciona: {
    rotulo: "Como funciona",
    titulo: { principal: "Do primeiro “oi”", destaque: "até o embarque." },
    inicio: "Você, hoje",
    destino: "Seu destino",
    etapas: [
      { tag: "Partida", titulo: "Você conta o que imagina", texto: "Destino, período, quem vai com você e o que não pode faltar. Pode chegar só com a vontade." },
      { tag: "Conexão", titulo: "A UAI monta as possibilidades", texto: "Você recebe opções já comparadas e pensadas pro seu perfil de viagem." },
      { tag: "Ajuste", titulo: "Você escolhe e ajusta", texto: "Muda o que quiser. Reservas e roteiro só fecham quando fizer sentido pra você." },
      { tag: "Embarque", titulo: "Você viaja com tudo organizado", texto: "E com alguém da UAI a uma mensagem de distância durante a viagem." },
    ],
    fechamento: "A primeira parada é uma conversa.",
  },

  quemCuida: {
    rotulo: "Quem cuida da sua viagem",
    titulo: { principal: "Do outro lado do WhatsApp,", destaque: "tem o Otávio." },
    corpo:
      "A UAI Viagens é conduzida pelo Otávio e pela equipe que organiza cada roteiro, uma viagem de cada vez. Em Belo Horizonte, dá pra conversar pessoalmente. No resto do Brasil, online.",
    legenda: "Otávio · UAI Viagens, Belo Horizonte",
    fotos: [
      { src: "/images/otavio-1.jpg", alt: "Otávio, à frente da UAI Viagens, em retrato de estúdio", posicao: "50% 18%" },
      { src: "/images/otavio-2.jpg", alt: "Otávio sorrindo, de braços abertos", posicao: "48% 20%" },
    ],
    // Diferenciais ainda a validar com o cliente (ver brief.md).
    diferenciais: [
      { titulo: "Atendimento direto", texto: "Uma pessoa conversa com você. Sem robô e sem formulário." },
      { titulo: "Roteiro do seu jeito", texto: "Pensado pra como você gosta de viajar, não um pacote igual pra todo mundo." },
      { titulo: "Até o embarque", texto: "O acompanhamento não termina na venda da passagem." },
    ],
  },

  depoimentos: {
    // Espaço reservado da v2, para revisão com o cliente. Desligar antes de publicar
    // ou trocar pelos depoimentos reais (nunca inventar nome, texto ou foto).
    mostrarEspacoReservado: true,
    rotulo: "Quem já viajou com a UAI",
    aviso: "Espaço reservado · depoimentos reais, com autorização",
    principal: { citacao: "Aqui entra o depoimento de um cliente real, publicado com autorização.", nome: "Nome do cliente", contexto: "Destino e mês da viagem" },
    secundario: { citacao: "Segundo depoimento, mais curto.", atribuicao: "Nome · destino" },
    midia: "Foto ou vídeo de viagem de cliente, com autorização.",
  },

  faq: {
    rotulo: "Dúvidas",
    titulo: "Antes de chamar.",
    intro: "Não achou a sua pergunta? Manda no WhatsApp. A resposta vem de uma pessoa.",
    itens: [
      {
        pergunta: "A UAI trabalha com viagens internacionais?",
        resposta: "Sim. Pacotes internacionais fazem parte do que a UAI organiza, do roteiro à documentação necessária.",
      },
      {
        pergunta: "Dá pra montar um roteiro personalizado, sem pacote pronto?",
        resposta: "Dá. Você conta o que imagina e a UAI monta as opções a partir disso.",
      },
      {
        pergunta: "Vocês organizam só hospedagem ou só cruzeiro?",
        resposta: "Sim. Hospedagem e cruzeiro podem ser organizados separados, de acordo com o que você já tem fechado.",
      },
      {
        pergunta: "Como é o atendimento?",
        resposta:
          "Direto pelo WhatsApp, com uma pessoa da UAI acompanhando o planejamento com você. Em Belo Horizonte, também presencial.",
      },
      {
        pergunta: "Preciso já saber o destino?",
        resposta: "Não. Você pode chegar só com a vontade de viajar. A conversa ajuda a definir o destino.",
      },
      {
        pergunta: "Quanto custa?",
        resposta: "Depende do destino e do que você tem em mente. O primeiro passo é conversar pelo WhatsApp, sem compromisso.",
      },
    ],
  },

  ctaFinal: {
    titulo: { antes: "Pra onde ", destaque: "você quer ir?", depois: "" },
    corpo: "Ou só o que você está imaginando. Conta pra UAI. O resto vocês organizam juntos.",
    imagem: {
      src: "/images/destinos/cta-horizonte.jpg",
      profundidade: "/images/hero/cta-horizonte-depth.png",
      alt: "Horizonte do mar ao entardecer",
    },
  },

  footer: {
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    atendimento: "Atendimento",
    atendimentoLinhas: ["Presencial em Belo Horizonte", "Online em todo o Brasil"],
    cnpjPrefixo: "CNPJ",
    ano: "2026",
  },
} as const;

export function whatsappHref(mensagem: string = site.cta.mensagemWhatsapp) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const tituloHeroTexto = `${site.hero.titulo.antes}${site.hero.titulo.destaque}${site.hero.titulo.depois}`;
