# UAI Viagens — constituição do projeto

Landing page da UAI Viagens (@uaiviagens_), agência de viagens do mesmo cliente do
projeto Otávio Milhas. Fonte de verdade complementar: `brief.md` (negócio, público,
pendências) e `copy.md` (todo o texto da página). Este arquivo registra as decisões
de produto/design que devem se manter estáveis entre sessões futuras.

## Objetivo do projeto

Converter tráfego do Instagram (@uaiviagens_) em conversa qualificada no WhatsApp.
Não é um site institucional completo — é uma página única de conversão.

## Posicionamento

UAI Viagens vende planejamento consultivo de viagem, não só venda de passagem.
Diferencial-chave (atendimento direto, roteiro sob medida, acompanhamento até o
embarque) ainda **não foi confirmado literalmente pelo Otávio** — ver pendência em
`brief.md`. Não publicar afirmação de diferencial mais forte que isso sem validação.

## Público

Foco atual: famílias em grupo, casais em viagens românticas, pessoas que querem
praticidade e não sabem por onde começar. A página fala em segunda pessoa, tom
direto e humano — nunca "mineirês" caricato.

## Proposta de valor

"Sua próxima viagem, sem o trabalho de organizar tudo sozinho" — a UAI assume o
trabalho de pesquisa/comparação/logística que o cliente faria sozinho.

## Tom de voz

Direto, humano, brasileiro, profissional e próximo. Frases curtas, uma ideia por
frase. Proibido: jargão de agência ("soluções personalizadas", "excelência"), drama
artificial na seção de dor, qualquer clichê da lista banida em
`estrutura-e-copy/references/formulas-de-copy.md`.

## Identidade visual

- **Variante:** Editorial (confirmada com o Rodrigo em 2026-09-22) — muito respiro,
  serifa nos títulos, paleta quase neutra + uma cor de destaque.
- **Cor de destaque:** vermelho `#c41e2a` — **hipótese extraída visualmente do print
  do perfil do Instagram, não confirmada com o logo oficial**. Trocar por hex exato
  assim que o Otávio enviar o logo em SVG/PNG alta resolução. Ver `identidade-visual.md`.
- **Base neutra:** fundo `#fbfaf7`, texto `#1a1814`, bordas `#e4dfd5` (tokens completos
  em `app/globals.css`).
- **Tipografia:** Fraunces (display/serifa, títulos) + Inter (corpo). Máximo duas
  famílias, carregadas via `next/font`.
- **Logo:** ainda não temos arquivo vetorial/alta resolução — o header usa o nome em
  texto (wordmark tipográfico), não uma imagem de logo. Substituir por `<Image>` do
  logo real assim que o asset chegar.

## Direção de arte

Sem fotografia de destino/estoque genérico — nenhuma foi fornecida pelo cliente e o
design-system do plugin proíbe banco de imagem genérico ("destrói a percepção de
valor mais rápido que qualquer erro de layout"). Por isso:
- **Hero é 100% tipográfico**, sem foto — respiro + hierarquia carregam o "premium".
- **Serviços e Como funciona** usam numeração tipográfica grande (`01`–`04` em
  Fraunces, cor de destaque), não ícones nem fotos.
- **Sobre** é a única seção com foto — usa uma foto real do Otávio
  (`public/images/otavio-1.jpg`), a única imagem real disponível hoje.
- Quando chegarem fotos reais de viagens/clientes: Serviços é o primeiro lugar onde
  entram (1 foto por pilar), depois o Hero pode ganhar uma composição com imagem
  (ver "Hero — composição B" em `biblioteca-de-secoes.md`).

## Arquitetura da página

One-page, 8 seções de conteúdo + header/footer, nessa ordem (arco "público
consciente do problema, não da solução" — ver `copy.md`):

Header → Hero → Situação → Serviços → Como funciona → Sobre → Diferenciais → FAQ →
CTA final → Footer → botão flutuante de WhatsApp.

Sem seção de "Faixa de prova" (não há números verificáveis nem 4+ logos de cliente)
e sem seção de "Depoimentos" dedicada — ambas omitidas de propósito até a sessão de
coleta de prova social com o Otávio (ver `brief.md` > Prova disponível). Não
adicionar depoimento, nome ou número inventado nessas seções quando forem criadas.

## Regras de UX

- Único CTA principal em toda a página: **"Quero planejar minha viagem"**, sempre
  para `wa.me` com mensagem pré-preenchida (`content/site.ts` > `whatsappHref`).
- Header mobile: logo + botão WhatsApp compacto sempre visível + hambúrguer com
  drawer (nav + CTA completo) — 4 âncoras exigem drawer pela regra do design system.
- Botão de WhatsApp flutuante aparece só após ~480px de scroll (evita competir com o
  CTA do Hero, que já é visível sem rolar).

## Regras de copy

Nenhum número aparece na página — o brief não confirma nenhum (nem anos de mercado,
nem contagem de clientes, nem ticket médio). Antes de adicionar qualquer número,
confirmar a origem em `brief.md`. Textos vêm sempre de `copy.md` → `content/site.ts`,
nunca hardcoded em componente.

## Regras de animação

Entrada de seção via `IntersectionObserver` (`components/ui/Reveal.tsx`):
opacity 0→1 + translateY 16px→0, 500ms, dispara uma única vez, respeitando
`prefers-reduced-motion` (ver `.reveal` em `app/globals.css`). Escalonamento de até
60ms entre itens de lista (máximo 6). Proibido: parallax, contador animado, texto
que digita sozinho, carrossel com autoplay.

## SEO

- Título: "UAI Viagens | Agência de Viagens em Belo Horizonte" — cidade confirmada
  com o Rodrigo (presencial + online).
- `TravelAgency` + `FAQPage` JSON-LD em `app/layout.tsx`.
- `metadataBase` aponta para `https://uaiviagens.com.br`, **domínio ainda não
  registrado** (brief.md > Escopo) — trocar antes do deploy de produção.
- Imagem Open Graph 1200×630 gerada dinamicamente em `app/opengraph-image.tsx`
  (Next detecta o arquivo sozinho, não precisa declarar `openGraph.images` à mão).

## Performance

`next/image` em toda imagem real (hoje só a foto do Otávio em Sobre). Sem
dependências além de Next + Tailwind + `@vercel/analytics`/`@vercel/speed-insights`.
Sem formulário/Server Action — conversão é 100% link de WhatsApp, então não há
backend de lead a manter.

## Acessibilidade

FAQ usa `<details>/<summary>` nativo (funciona sem JS). Um único `<h1>` na página
(o headline do Hero). Contraste do vermelho `#c41e2a` sobre fundo claro e do branco
sobre o vermelho já checado (~5.9:1, acima do mínimo AA de 4.5:1). Áreas de toque do
header mobile em 44×44px.

## Responsividade

Mobile-first, breakpoints Tailwind padrão. Testado com Playwright em 375/768/1440 —
ver processo de verificação abaixo.

## Componentes

```
app/            layout.tsx, page.tsx, globals.css, sitemap.ts, robots.ts,
                icon.tsx, apple-icon.tsx, opengraph-image.tsx (gerados via next/og)
components/
  sections/     Header, Hero, Situacao, Servicos, ComoFunciona, Sobre,
                Diferenciais, Faq, CtaFinal, Footer
  ui/           Button, Container, Eyebrow, Reveal (polimórfico div/li),
                WhatsappFloating, WhatsappIcon
  Analytics.tsx      monta VercelAnalytics + SpeedInsights + AnalyticsEvents
  AnalyticsEvents.tsx  listener delegado em [data-analytics] -> track()
content/site.ts  todo o texto tipado, espelhando copy.md
public/images/   fotos reais (hoje: otavio-1.jpg, otavio-2.jpg)
images/          assets brutos de referência (print do IG, fotos originais)
```

**Cuidado ao reusar `Reveal` dentro de `<ul>`/`<ol>`:** passar `as="li"` — sem isso
o componente quebra a semântica de lista (`<div>` entre `<ul>` e `<li>`), como
aconteceu em Situação e Como Funciona antes da revisão de 2026-09-22.

## Estrutura técnica

Next.js 16 (App Router, Turbopack) + Tailwind v4 (`@theme inline` em
`globals.css`) + TypeScript. Server Components por padrão; `"use client"` só em
Header (scroll + drawer), Reveal e WhatsappFloating (scroll/observer).

**Gotcha de ambiente:** o diretório do projeto também guarda estado local da ruflo
(`.swarm/`, `.claude-flow/`) com um índice binário (`hnsw.index`) que pode ficar
bloqueado pelo SO. O scanner automático de conteúdo do Tailwind v4 varre todo o
projeto por padrão e quebra o build se tentar ler esse arquivo — por isso essas
pastas estão no `.gitignore`, o que também as exclui da varredura do Tailwind.

## Critérios de qualidade

Auditoria completa rodada em 2026-09-22 (`landing-premium:revisao-e-entrega`,
`npm run build` + `next start` + Lighthouse + Playwright em 375/414/768/1280/1440):

- [x] Um único H1, uma única cor de destaque, duas famílias tipográficas
- [x] Nenhum número inventado na página; nenhum lorem ipsum/placeholder
- [x] Nenhuma foto de banco de imagem genérica
- [x] `npm run build` limpo (sem erro nem warning de tipo)
- [x] Testado em 375, 414, 768, 1280 e 1440px — zero overflow horizontal
- [x] CTA do hero visível sem rolar em 375×667
- [x] Menu mobile funcional (drawer), FAQ funcional (accordion)
- [x] Foco de teclado visível, navegação por Tab funcional
- [x] Lighthouse: Acessibilidade 100, SEO 100, Boas práticas 96 (os 4 pontos
      faltantes são 404 esperado de `/_vercel/insights` e `/_vercel/speed-insights`
      só em ambiente local — some ao rodar de fato na Vercel)
- [x] Lighthouse Performance: 74 localmente (CLS 0, FCP 1.4s, 272 KiB de página —
      dentro do orçamento de 1,2MB). O score em si ficou abaixo de 90 nesta máquina;
      o breakdown mostra ~1,3s de tempo de main-thread "não atribuível" a nenhum
      script real, o que é característico de ruído do ambiente local (Chrome
      headless + antivírus no Windows), não de peso real da página. **Re-testar no
      preview da Vercel antes de considerar isso resolvido ou não** — não tratar
      como número final.
- [x] Analytics de clique conectado (`components/AnalyticsEvents.tsx`) nos 7
      pontos de CTA de WhatsApp (`data-analytics="whatsapp_click_*"`)
- [x] Favicon, apple-touch-icon e imagem Open Graph 1200×630 gerados
      dinamicamente (`app/icon.tsx`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`)
      — monograma "U" e OG provisórios com a paleta real, **substituir pelo logo
      oficial assim que chegar**
- [ ] Logo oficial em alta resolução aplicado
- [ ] Cor de destaque confirmada com o hex real da marca
- [ ] Prova social real (depoimentos) coletada e publicada
- [ ] Domínio registrado e `metadataBase`/JSON-LD atualizados (hoje apontam para
      `uaiviagens.com.br` como placeholder)
- [ ] Deploy revisado em celular de verdade (não só simulador) — ainda não hospedado

## O que evitar

Banco de imagem genérico, glassmorphism, gradiente decorativo, emoji como elemento
de interface, "mineirês" caricato, qualquer número/depoimento/política não
confirmados no brief, segundo CTA concorrendo com "Quero planejar minha viagem".

## Checklist final (antes de considerar a página pronta pra cliente)

Ver pendências completas em `brief.md` > Riscos e pendências. As que bloqueiam
publicação em produção: logo em alta resolução, diferencial validado com o Otávio,
sessão de coleta de prova social, domínio registrado.
