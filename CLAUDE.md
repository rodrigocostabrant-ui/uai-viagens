# UAI Viagens — constituição do projeto

Landing page da UAI Viagens (@uaiviagens_), agência de viagens do mesmo cliente do
projeto Otávio Milhas. Fonte de verdade complementar: `brief.md` (negócio, público,
pendências), `copy.md` (texto da página) e o **handoff do design v2 aprovado** em
`claude-design-export/design_handoff_uai_viagens/` (`README.md` = spec, `tokens.css`,
`UAI Viagens v2.dc.html` = protótipo). Este arquivo registra as decisões de
produto/design/motion que devem se manter estáveis entre sessões.

## Objetivo do projeto

Converter tráfego do Instagram (@uaiviagens_) em conversa qualificada no WhatsApp.
Não é um site institucional completo — é uma página única de conversão.

## Posicionamento

UAI Viagens vende planejamento consultivo de viagem, não só venda de passagem.
Os diferenciais (atendimento direto, roteiro do seu jeito, até o embarque) e o selo
"Quem responde é o Otávio" **ainda não foram confirmados literalmente pelo Otávio** —
ver `brief.md`. Não publicar afirmação mais forte que isso sem validação.

## Público e tom

Famílias em grupo, casais, pessoas que querem praticidade e não sabem por onde
começar. Segunda pessoa, direto, humano, brasileiro — nunca "mineirês" caricato.
Proibido jargão de agência e drama artificial.

## Identidade visual (v2 aprovada, 2026-09-22)

- **Paleta só preto, prata e cinza** (tokens em `app/globals.css` > `@theme`):
  ink `#0b0b0c`, graphite `#1c1c1f`, cinzas `#4a4a4f`…`#a1a1a6`, paper `#f2f2f0`,
  prata em gradiente (`--silver`). Sem vermelho.
- **Prata é sinal, não enfeite:** só no CTA principal, nas linhas, na logo e em **uma
  frase por dobra** (hero e CTA final). A 2ª frase dos outros títulos vai em cinza.
  Nunca prata ou `#a1a1a6` como texto sobre paper.
- Seções alternam preto e claro. Cantos retos (botões 2px).
- **Tipografia:** Barlow Condensed 400/500 (títulos, caixa normal, peso 500) + Barlow
  300/400/500/600 (texto), via `next/font` (`--font-barlow-condensed`, `--font-barlow`).
- **Logo:** vetor redesenhado do print do Instagram (`components/ui/Logo.tsx`, marca
  para ícones/OG em `app/brand.ts`). **Trocar pelo arquivo original em alta** quando chegar.

## Direção de arte

- Fotos de destino são **placeholders do Unsplash** baixados em `public/images/destinos/`
  (trocar pelas fotos reais mantendo o nome do arquivo). Tratamento P&B da v2:
  `grayscale(1) contrast(1.12) brightness(.84)` (conteúdo) e véu `#26303c` soft-light nas
  fotos de fundo.
- Fotos reais do Otávio: `public/images/otavio-1.jpg`, `otavio-2.jpg`, e o recorte do
  selo `otavio-avatar.jpg` (160px, para não baixar a foto inteira acima da dobra).
- **Ao trocar a foto do hero ou do CTA final**, gerar um novo mapa de profundidade
  (`public/images/hero/*-depth.png`, PNG sem perda, 512px de largura): canal **R** =
  profundidade (Depth Anything V2 small via `@huggingface/transformers`, rodado numa pasta
  temporária, **nunca como dependência do projeto**, depois `sharp` com blur 3), canal
  **G** = máscara de água desenhada à mão. Sem mapa, o WebGL só faz drift e névoa.

## Arquitetura da página

Header → Hero → Ponto de partida → Serviços → Como funciona (rota) → Quem cuida
(Otávio + diferenciais) → Depoimentos + Dúvidas (`#duvidas`) → CTA final → Footer →
CTA flutuante.

- Depoimentos: espaço reservado da v2, controlado por
  `content/site.ts > depoimentos.mostrarEspacoReservado`. **Desligar antes de publicar**
  ou trocar por depoimentos reais autorizados. Nunca inventar nome, texto, número ou selo.
- Nenhum número aparece na página (o brief não confirma nenhum).

## Regras de UX

- CTA único **"Quero planejar minha viagem"** → `wa.me` com mensagem pré-preenchida.
  Todo link de WhatsApp passa por `components/ui/WhatsAppLink.tsx` (prop `event`
  obrigatória → `data-analytics`, 9 pontos hoje).
- Header: 96→72px no desktop ao rolar 40px; abaixo de 1100px, logo + WhatsApp + menu em
  tela cheia (`inert` quando fechado, Esc fecha, foco volta ao botão).
- Flutuante: aparece após 75% do hero, some quando o CTA final passa 55% da tela e com o
  menu aberto; `inert` quando oculto.
- FAQ: `<details name="faq">` nativo (funciona sem JS, um aberto por vez).
- Breakpoints da v2: mobile < 700 (`tab:`), rota horizontal ≥ 1000 (`route:`), desktop ≥ 1100 (`desk:`).

## Motion (decisão do cliente em 2026-09-22, substitui o "sem parallax/3D" do design system)

Camada premium por cima da v2, sem mudar layout. Regras:

- **Tokens** (`app/globals.css` + espelho em `lib/motion/tokens.ts`): `--ease-out
  cubic-bezier(.2,.7,.2,1)`, `--ease-in-out cubic-bezier(.65,0,.35,1)`, 160/320/900/1000/
  1200/2600/1800ms, stagger 90ms, reveal 20px. Nada de curva ou duração literal fora deles.
- **Tiers** em `html[data-motion]`, definidos por script inline no `<head>`
  (`lib/motion/tier.ts`) antes do 1º paint:
  - `off` — reduced-motion: nada se desloca.
  - `css` — touch, tela < 1024px, conexão lenta ou aparelho fraco, ou WebGL falhou:
    coreografia CSS + drift CSS lento nas fotos (a foto do hero **nunca** fica parada).
  - `full` — mouse + tela ≥ 1024px: + Three.js no hero e no CTA final.
  - Sem JS não há `data-motion` → tudo visível. Se o cliente não marcar
    `__uaiMotionReady` em 4s, o script desliga a coreografia.
- **Comportamento por atributos** (`data-reveal`, `data-line-reveal`, `data-load`,
  `data-route`, `data-magnetic`, `data-follow`): seções continuam Server Components; um
  único `components/motion/MotionBootstrap.tsx` liga tudo. Um IntersectionObserver, um
  rAF (`lib/motion/ticker.ts`), um listener de scroll e um de ponteiro para a página toda.
- **Scroll-driven em CSS** (`animation-timeline`), sempre com `overflow: clip` nas seções
  (`hidden` congela as timelines) e longhands de timeline/range **depois** do shorthand
  `animation` (o Lightning CSS descarta o contrário). No touch, só a rota usa scroll-driven.
- **Hero:** foto opaca desde o 1º paint (LCP), abertura por véu ink + escala; título
  linha a linha (clone `aria-hidden`, `lib/motion/split-lines.ts`) no desktop e por
  máscara só-CSS no celular (o h1 é o LCP no mobile — não esconder com opacity 0 lá).
- **Three.js** (`lib/three/DepthScene.ts`, `components/media/DepthPhoto.tsx`): parallax
  por mapa de profundidade no fragment shader, água, névoa, grão e ~90 partículas.
  Carregado por `import()` só no tier `full`, depois do load; canvas criado dentro do
  effect (StrictMode), crossfade só depois da abertura CSS, pausa fora da tela, guarda
  de desempenho e queda para `css` se falhar. O chunk (~130 KB) nunca vai para o celular.
- **Nunca esconder com `clip-path` um elemento observado** (reveal ou `<img loading="lazy">`):
  o Chrome o trata como invisível, o reveal nunca dispara e a foto nunca carrega. As fotos
  usam uma "cortina" (`::after` com `scaleY`); a rota no fallback é disparada pelo contêiner.
- **Guarda de desempenho do WebGL** mede o tempo de CPU do draw **e** o intervalo real entre
  quadros (pega GPU lenta). Por isso, testar o caminho WebGL com GPU real
  (`chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] })`);
  no Chromium headless padrão (sem GPU) ele cai corretamente para `css` em ~6s.
- Proibido: contador animado, texto digitando, carrossel com autoplay, cursor
  customizado, blur/glassmorphism, bounce, smooth-scroll que sequestra o scroll (Lenis),
  3D que invente destinos (globo, rotas reais).

## SEO

- Título "UAI Viagens | Agência de Viagens em Belo Horizonte". `TravelAgency` + `FAQPage`
  JSON-LD em `app/layout.tsx` (FAQ lido de `content/site.ts`).
- `metadataBase` aponta para `https://uaiviagens.com.br`, **domínio ainda não registrado**.
- Ícones e OG gerados por `app/icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`.

## Performance

`next/image` em toda imagem (Next 16: `priority` descontinuado — hero usa
`loading="eager"`; `sizes` em retrato `160vw` por causa do `object-fit: cover`).
Dependências: Next + Tailwind + `@vercel/analytics`/`speed-insights` + **`three`**
(lazy, só desktop). Sem formulário/Server Action.

## Componentes

```
app/            layout.tsx (fontes, script de tier), page.tsx, globals.css, brand.ts,
                icon.tsx, apple-icon.tsx, opengraph-image.tsx, sitemap.ts, robots.ts
components/
  sections/     Header (client), Hero, PontoDePartida, Servicos, ComoFunciona,
                QuemCuida, Duvidas, CtaFinal, Footer
  ui/           Button (CtaButton), WhatsAppLink, WhatsappFloating (client),
                WhatsappIcon, Logo, Icon, Route, SectionLabel, TrustChip, Container
  media/        DepthPhoto (client) — foto de fundo + canvas Three.js
  motion/       MotionBootstrap (client)
  Analytics.tsx, AnalyticsEvents.tsx (clique delegado em [data-analytics])
lib/motion/     tokens, tier, ticker, scroll, pointer, reveal, split-lines
lib/three/      DepthScene, shaders
content/site.ts  toda a copy (v2)
public/images/   destinos/ (placeholders), hero/ (mapas de profundidade), otavio-*
claude-design-export/  handoff do Claude Design (referência; fora do Tailwind e do ESLint)
```

## Gotchas de ambiente

- `.swarm/` e `.claude-flow/` (estado local da ruflo) ficam no `.gitignore`: o scanner do
  Tailwind v4 quebra o build se tentar ler o `hnsw.index` bloqueado.
- `claude-design-export/` é excluído do Tailwind por `@source not` em `globals.css` e do
  ESLint em `eslint.config.mjs`.
- Next 16: ler `node_modules/next/dist/docs/` antes de usar API que mudou (ver `AGENTS.md`).

## Critérios de qualidade (auditoria de 2026-09-23, `next start` + Playwright + Lighthouse)

- [x] Fidelidade à v2 em 375/768/1440 (alturas de página a ±8px do protótipo)
- [x] Um H1, nenhum número/depoimento inventado, sem overflow horizontal
- [x] `npm run lint` e `npm run build` limpos; StrictMode sem avisos e no máx. 2 canvas
- [x] Hero vivo no desktop (drift + ponteiro + profundidade), drift CSS no celular
- [x] Reduced motion: nada escondido nem animado; sem JS: tudo visível e FAQ funciona;
      sem WebGL: cai para `css` sem erro; Three.js não é baixado no celular
- [x] 9 CTAs de WhatsApp com `data-analytics`; menu com Esc/foco; flutuante `inert`
- [x] Lighthouse desktop: Perf 97–99, A11y 100, SEO 100, BP 96 (os 4 pontos são o 404 de
      `/_vercel/*` local). Mobile: Perf ~86, A11y 100, SEO 100; LCP observado 0,9s, simulado
      ~4s (a simulação de 4G lento conta os bytes da foto do hero) — **re-testar no preview
      da Vercel**
- [x] CTA do hero em 375×667 fica na mesma posição do protótipo aprovado (base em 678px,
      por causa do hero de 720px mínimo da v2)
- [ ] Logo oficial em alta aplicado
- [ ] Fotos reais no lugar dos placeholders do Unsplash (+ novos mapas de profundidade)
- [ ] Diferenciais e selo "Quem responde é o Otávio" confirmados com o cliente
- [ ] Depoimentos reais coletados (ou espaço reservado desligado) antes de publicar
- [ ] Domínio registrado e `metadataBase`/JSON-LD/sitemap/robots atualizados
- [ ] Teste num celular de verdade (não só emulação)
