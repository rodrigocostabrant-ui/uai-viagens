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
    { label: "Sobre", href: "#sobre" },
    { label: "FAQ", href: "#faq" },
  ],

  cta: {
    principal: "Quero planejar minha viagem",
    mensagemWhatsapp:
      "Olá, UAI Viagens! Vi o site e gostaria de planejar uma viagem.",
  },

  hero: {
    eyebrow: "Agência de viagens · Belo Horizonte",
    titulo: "Sua próxima viagem, sem o trabalho de organizar tudo sozinho",
    subtitulo:
      "Pacotes nacionais e internacionais, hospedagens, cruzeiros e roteiros sob medida — organizados com você, do primeiro passo até o embarque.",
    credibilidade: "Nacional · Internacional · Hospedagens · Cruzeiros · Roteiros sob medida",
    reducaoDeAtrito: "Atendemos Belo Horizonte e todo o Brasil, presencial ou online.",
  },

  situacao: {
    eyebrow: "O problema",
    titulo: "Organizar uma viagem sozinha consome mais tempo do que parece",
    itens: [
      "Pesquisar destino, comparar preço e não ter certeza se escolheu certo.",
      "Abrir vinte abas pra comparar hotel, voo e horário — e ainda ficar em dúvida.",
      "Montar o roteiro e só descobrir depois que faltou pensar no deslocamento entre um lugar e outro.",
      "Reservar tudo separado e torcer pra dar certo no dia.",
    ],
    transicao: "É exatamente essa parte que a UAI assume por você.",
  },

  servicos: {
    eyebrow: "O que a UAI resolve",
    titulo: "Uma viagem. Diferentes formas de começar.",
    itens: [
      {
        numero: "01",
        titulo: "Pacotes de viagem",
        descricao:
          "Nacionais e internacionais, com passagem, hospedagem e logística já pensados.",
      },
      {
        numero: "02",
        titulo: "Hospedagens",
        descricao: "Hotéis e acomodações escolhidos para o seu estilo de viagem.",
      },
      {
        numero: "03",
        titulo: "Cruzeiros",
        descricao: "Cruzeiros com toda a reserva organizada antes de você embarcar.",
      },
      {
        numero: "04",
        titulo: "Roteiros personalizados",
        descricao:
          "Uma viagem desenhada a partir do seu período, do seu orçamento e do que você quer viver.",
      },
    ],
  },

  comoFunciona: {
    eyebrow: "O processo",
    titulo: "Como funciona",
    etapas: [
      {
        numero: "01",
        titulo: "Você conta o que imagina",
        descricao: "Destino, período, quem vai com você e o que não pode faltar na viagem.",
      },
      {
        numero: "02",
        titulo: "A UAI monta as possibilidades",
        descricao: "Você recebe opções já pensadas para o seu perfil de viagem.",
      },
      {
        numero: "03",
        titulo: "Você escolhe e ajusta",
        descricao: "Reservas e roteiro fechados do jeito que fizer sentido pra você.",
      },
      {
        numero: "04",
        titulo: "Você viaja",
        descricao: "Com tudo organizado e suporte durante a viagem.",
      },
    ],
  },

  sobre: {
    eyebrow: "Quem cuida da sua viagem",
    titulo: "Por trás de cada viagem, tem alguém cuidando dos detalhes",
    corpo:
      "A UAI Viagens é conduzida pelo Otávio e pela equipe que organiza cada roteiro, uma viagem de cada vez.",
    imagem: "/images/otavio-1.jpg",
  },

  diferenciais: {
    eyebrow: "Por que a UAI",
    titulo: "Por que planejar sua viagem com a UAI",
    itens: [
      {
        titulo: "Atendimento direto",
        descricao:
          "Não é formulário automático — alguém realmente conversa com você sobre a viagem.",
      },
      {
        titulo: "Roteiro pensado pra você",
        descricao: "Não um pacote fechado igual pra todo mundo.",
      },
      {
        titulo: "Acompanhamento até o embarque",
        descricao: "Não só a venda da passagem.",
      },
    ],
  },

  faq: {
    eyebrow: "Dúvidas",
    titulo: "Perguntas frequentes",
    itens: [
      {
        pergunta: "A UAI trabalha com viagens internacionais?",
        resposta:
          "Sim. Pacotes internacionais fazem parte do que a UAI organiza, do roteiro à documentação necessária.",
      },
      {
        pergunta: "Posso montar um roteiro personalizado, sem seguir um pacote pronto?",
        resposta: "Sim. Você conta o que imagina e a UAI monta as opções a partir disso.",
      },
      {
        pergunta: "Vocês organizam só hospedagem ou só cruzeiro, sem pacote completo?",
        resposta:
          "Sim — hospedagem e cruzeiro podem ser organizados separadamente, de acordo com o que você já tem fechado.",
      },
      {
        pergunta: "Como funciona o atendimento?",
        resposta: "Direto pelo WhatsApp, com alguém da UAI acompanhando o planejamento com você.",
      },
      {
        pergunta: "Preciso já saber o destino para falar com a UAI?",
        resposta:
          "Não. Você pode chegar só com a vontade de viajar — a conversa ajuda a definir o destino.",
      },
      {
        pergunta: "Quanto custa planejar minha viagem com a UAI?",
        resposta:
          "Depende do destino e do que você já tem em mente. O primeiro passo é conversar pelo WhatsApp, sem compromisso.",
      },
    ],
  },

  ctaFinal: {
    titulo: "E se a sua próxima viagem começasse agora?",
    corpo:
      "Conte pra UAI pra onde você quer ir — ou só o que você está imaginando. O resto, vocês organizam juntos.",
    reducaoDeAtrito: "Você fala direto com a equipe da UAI, sem robô e sem compromisso.",
  },
} as const;

export function whatsappHref(mensagem: string = site.cta.mensagemWhatsapp) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
