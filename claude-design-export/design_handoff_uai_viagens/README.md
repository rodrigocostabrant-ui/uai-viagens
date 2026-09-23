# Handoff: UAI Viagens — Landing page v2

## Visão geral
Landing one-page da UAI Viagens (agência de BH, @uaiviagens_). Ela converte tráfego do Instagram em conversa no WhatsApp. Existe uma única ação: **"Quero planejar minha viagem"**, que abre `wa.me/5531989519239` com a mensagem pré-preenchida *"Olá, UAI Viagens! Vi o site e gostaria de planejar uma viagem."*.
A v2 é uma evolução da v1, sem mudar identidade nem conceito. Os ganhos estão em hierarquia, tipografia, imagem, confiança e movimento.

## Sobre os arquivos
Os arquivos `.dc.html` são **referências de design em HTML**, não código de produção. Recrie o design no ambiente do projeto (o repositório atual é Next.js 16 + Tailwind v4 + TypeScript, com o conteúdo centralizado em `content/site.ts`) usando os padrões já existentes. Para abrir os HTML localmente, sirva a pasta num servidor estático; `support.js` é só o runtime do protótipo.

## Fidelidade
**Alta fidelidade.** Cores, tipografia, espaçamentos, estados e movimento são finais. As fotos de destino são placeholders do Unsplash e serão trocadas pelas fotos reais.

---

## 1. Auditoria da v1 → decisões da v2

| # | Problema na v1 | Mudança na v2 | Por quê |
|---|---|---|---|
| 1 | Todos os títulos em Barlow Condensed 600 CAIXA-ALTA, com tamanhos parecidos. Tudo gritava igual e o resultado lembrava sinalização industrial. | Títulos em caixa normal, peso 500, tracking negativo. A caixa-alta ficou só nos rótulos de 12px. | Hierarquia e sofisticação. A condensada em caixa normal lê como editorial, não como cartaz. |
| 2 | O gradiente prata aparecia em quase todo H2 e perdia o valor. | Prata só no botão principal, nas linhas, na logo e em **uma frase por dobra** (hero e CTA final). A segunda frase dos outros títulos vai em cinza. | O prata virou um sinal: quando aparece, marca ação ou clímax. |
| 3 | O texto de apoio tinha o mesmo peso e tamanho do corpo. | Novo nível `lead` (Barlow 300, 19–23px, 30–40ch). | Cria três níveis claros: título, lead e corpo. |
| 4 | Espaçamentos avulsos (24/28/40/56…). | Escala fixa (4…176) e seções com `clamp(96, 12vw, 176)`. | Ritmo vertical consistente. |
| 5 | Grid "auto-fit" que no desktop dividia tudo 50/50. | Pares assimétricos 7/5 e 5/7 no desktop. | Composição editorial, não de template. |
| 6 | Hero com praia aérea clara: céu estourado e texto com pouco contraste. Foto de cartão-postal. | Proa de barco num lago entre montanhas (primeira pessoa, "você no caminho"). Mais escuro, com o horizonte baixo deixando espaço para o título. Trocável via tweak (Lago / Horizonte / Praia). | A imagem conta a promessa (a UAI conduz o trajeto) e protege a leitura. |
| 7 | CTA final sobre asa de avião, clichê de agência. | Horizonte do mar ao entardecer, que é aberto e pergunta "pra onde?". | Menos clichê e mais desejo. |
| 8 | Serviços: fotos 3:4 pequenas e a de cruzeiro pouco legível. | Fotos 4:5 maiores, deslocamentos de 0/128/48/176, novas fotos: Paris ao anoitecer, piscina ao entardecer, navio de perfil, estrada rumo às montanhas. | Mesmo peso para os quatro serviços, mais presença e imagens de trajeto. |
| 9 | Otávio: a segunda foto sobreposta com borda de 6px parecia remendo. | Díptico lado a lado (1.62 : 1), a segunda foto mais baixa, sem sobreposição. | Composição limpa; a foto expressiva vira contraponto e não disputa com a principal. |
| 10 | Confiança concentrada numa seção só. | **Selo "Quem responde é o Otávio"** com avatar sob os CTAs do hero e do CTA final e no menu mobile. | Rosto humano junto do CTA reduz o risco percebido. Não é depoimento e não inventa nada. |
| 11 | Depoimentos: 3 caixas iguais com barras cinza (cara de wireframe). | Uma citação grande (2/3) e dois espaços menores. O texto do placeholder já tem a escala final. | Mostra como vai ficar a prova social e evita "cards iguais". |
| 12 | FAQ abria de uma vez, com pulo de layout. | Abre com animação de altura (grid-rows), o ícone gira 45° e o título fica fixo na coluna no desktop. | A microinteração ajuda a entender o que abriu e mantém o contexto. |
| 13 | Mobile era a versão reduzida: 2×2 de miniaturas e um botão flutuante pequeno. | Faixa horizontal com snap para os serviços, CTA fixo em largura total no rodapé e menu com o selo do Otávio. | Hierarquia pensada para o polegar. |
| 14 | Flutuante sempre visível depois de rolar, inclusive ao lado do CTA final. | Some quando o CTA final entra na tela (55% do viewport). | Evita dois CTAs iguais disputando o mesmo espaço. |
| 15 | Sem entrada de seções. | Reveals discretos (fade + 20px), linha da rota que se desenha e abertura lenta das fotos de fundo. Tudo desligável e com suporte a `prefers-reduced-motion`. | Ritmo e percepção de acabamento, sem efeito gratuito. |

**Mantido de propósito:** paleta preto/prata/cinza, alternância de seções preta e clara, Barlow Condensed + Barlow (DS Industry), cantos retos, marcas "+" nos placeholders, estrutura de jornada em rota, copy e FAQ.

**Não usado, com justificativa:**
- **Parallax.** O brief original proíbe, e ele custa desempenho no mobile, que é de onde vem o tráfego (Instagram). A abertura lenta das fotos dá a mesma sensação cinematográfica.
- **3D.** Avaliamos um globo com rotas. Descartado: seria demonstração técnica, pesaria no mobile e induziria a inventar destinos e rotas que não existem. Não há objeto físico da marca que ganhe com 3D.
- **Vídeo no hero.** Faz sentido no futuro com vídeo próprio (o Instagram já tem Reels do Otávio). Vídeo de banco pioraria a percepção.

## 2. Benchmark (princípios absorvidos, nenhum layout copiado)
- **Contenção cinematográfica.** Marcas de luxo em viagem usam vídeo em tela cheia, pouca copy e movimento elegante, e parecem exclusivas sem explicar demais (sitebuilderreport.com, jul/2026). → Hero com uma frase, uma ação e uma imagem forte.
- **Fotos criam clima, não listam lugares.** As agências boutique de referência usam foto para vender sensação (sitebuilderreport.com). → Imagens de trajeto, tratadas em P&B.
- **Editorial em vez de lista de seções.** Em 2026 os sites ficam mais editoriais e humanos, sobretudo em serviços e marcas pessoais (rebekahreadcreative.com, jan/2026). → Pares 7/5, rota narrativa, o Otávio como personagem.
- **Um caminho óbvio.** A ideia não é ter mais botões, e sim um caminho evidente (drifttravel.com, jan/2026). → Um CTA, uma cópia, um destino.
- **Confiança integrada.** Sinais de confiança colados na página são ignorados; os que fazem parte do design funcionam (drifttravel.com). → Selo do Otávio junto do CTA, não um bloco de "selos".
- **Rosto humano.** Fotos com foco no rosto aumentam a confiança inicial, e fotos reais valem mais que as de banco (vwo.com, jan/2026). → Fotos reais do Otávio, avatar recortado no rosto.
- **Mobile e velocidade.** Mobile é o canal principal e a velocidade é decisão de design (hooray.agency, mai/2026; drifttravel.com). → Mobile repensado, imagens com `loading="lazy"` abaixo da dobra, animações só com transform/opacity/clip-path.

## 3. Design system
Ver `tokens.css` (variáveis prontas) e `UAI Design System.dc.html` (espécimes interativos).

### Cor
| Token | Hex | Uso | Contraste |
|---|---|---|---|
| ink | #0b0b0c | fundo escuro; texto sobre claro | 17.9:1 sobre paper |
| graphite | #1c1c1f | footer, hover do botão escuro, fundo de imagem | — |
| line-dark | #2a2a2e | divisores sobre preto | — |
| gray-700 | #4a4a4f | texto de apoio sobre claro; borda do botão ghost | 8.4:1 |
| gray-650 | #55555a | rótulos sobre claro | 7.0:1 |
| gray-600 | #6b6b70 | 2ª frase de títulos | 4.9:1 no claro · 3.9:1 no escuro (só display ≥ 44px) |
| gray-500 | #8a8a90 | linha da rota; 2ª frase no título do Otávio | 5.8:1 no escuro |
| gray-400 | #a1a1a6 | texto de apoio sobre preto | 7.9:1 |
| line-light | #d6d6d3 | divisores sobre claro | — |
| silver-300 | #d9d9dc | corpo sobre preto; logo; anel de foco escuro | 14:1 |
| paper | #f2f2f0 | fundo claro; texto sobre preto | — |
| silver | gradiente 110°: #e6e6e6 0 · #a8a8ad 40% · #d9d9dc 60% · #e6e6e6 100% | botão principal (background-size 240%) | texto #0b0b0c sobre ele ≥ 8:1 |

Regra: **nunca** prata ou #a1a1a6 como texto sobre #f2f2f0. No fundo claro, o CTA é preto.

### Tipografia
Duas famílias: **Barlow Condensed** (títulos) e **Barlow** (texto).
| Estilo | Família/peso | Tamanho / altura de linha | Tracking |
|---|---|---|---|
| display-1 (hero) | Condensed 500 | clamp(52, 7.6vw, 120) / .94, max 16ch | −0.012em |
| display-cta | Condensed 500 | clamp(64, 9.6vw, 160) / .88 | −0.015em |
| display-2 (H2) | Condensed 500 | clamp(44, 5.2vw, 80) / .95 | −0.01em |
| title | Condensed 500 | 24–34 / 1.05 | 0 |
| lead | Barlow 300 | clamp(19, 1.6vw, 23) / 1.5, 30–40ch | 0 |
| body | Barlow 400 | 16–17 / 1.6, até 60ch | 0 |
| small | Barlow 400 | 14–15 / 1.45 | 0 |
| label | Barlow 500 | 12 / 1, CAIXA-ALTA | .2–.22em |
| button | Barlow 600 | 16 (17 no CTA final, 15 no flutuante) | .01em |
Títulos com `text-wrap: balance`; parágrafos com `text-wrap: pretty`.

### Espaço, grid e forma
- Escala: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 176.
- Seção: `padding-block: clamp(96px, 12vw, 176px)`. Container: max 1432px com `padding-inline: clamp(20px, 4vw, 56px)`. Gap do grid: 24px.
- Desktop: pares `7fr/5fr` (hero de conteúdo, serviços, Otávio, CTA final) e `5fr/7fr` (FAQ). Depoimentos em `2fr/1fr`.
- Raio 0 em imagens e molduras e 2px em botões. Círculos: avatar (40px), paradas da rota (16px + anel de 6px paper + 1px #a8a8ad), ícone do FAQ (36px), destino da rota (56px).
- Sombra: só o flutuante (`0 0 0 1px rgba(11,11,12,.5), 0 16px 40px rgba(0,0,0,.4)`).

### Imagens
- Conteúdo: `filter: grayscale(1) contrast(1.12) brightness(.84)`. No hover, `brightness(1)` + `scale(1.035)` em 1.2s.
- Fundo com texto: `grayscale(1) contrast(1.12) brightness(.8)` + véu `#26303c` com `mix-blend-mode: soft-light` a 50% + gradiente de proteção `180deg, rgba(11,11,12,.6) 0 → 0 26% → .2 52% → .94 100%` (hero) ou `.3 → .1 40% → .9` (CTA final).
- Proporções: hero e CTA em tela cheia (`100svh`, mínimo 720/680px); serviços 4:5; Otávio 4:5 + 3:4.
- Avatar do Otávio: `background: url(otavio-1.jpg) 44% 16% / 280% no-repeat`, com grayscale.
- Placeholders (Unsplash): hero `1476514525535-07fb3b4ae5f1` (lago), alternativas `1473116763249-2faaef81ccda` (horizonte) e `1506929562872-bb421503ef21` (praia); Paris `1499856871958-5b9627545d1a`; hotel `1551882547-ff40c63fe5fa`; cruzeiro `1599640842225-85d111c60e6b`; estrada `1500530855697-b586d89ba3ee`; CTA final `1473116763249-2faaef81ccda`.

### Ícones
Lucide com traço 1.5: arrow-right, plane, plus, menu, x, image. Mais a marca oficial do WhatsApp (`components/ui/WhatsappIcon.tsx`). Nenhum emoji.

## 4. Componentes
| Componente | Especificação | Estados |
|---|---|---|
| **CTA principal (prata)** | inline-flex, gap 14, min-height 60 (64 no CTA final), padding 0 28, raio 2, fundo `--silver` com size 240% e posição 0; ícone WA 20px + texto + seta 18px; texto #0b0b0c 600/16. Mobile: largura 100%. | hover: posição 100% em 900ms + contorno `0 0 0 1px #f2f2f0` · active: translateY(1px) · focus-visible: anel de 2px #d9d9dc, offset 4 |
| **CTA principal (escuro)** | igual, fundo #0b0b0c, texto #f2f2f0, ícone WA #d9d9dc. Só em seção clara ("Como funciona"). | hover #1c1c1f · active 1px · focus: anel #0b0b0c |
| **CTA do header** | altura 44, padding 0 18, borda 1px #4a4a4f, 500/14, ícone 16. | hover: borda #d9d9dc + fundo rgba(242,242,240,.06) · active .12 |
| **Botão ícone (mobile)** | 44×44. WhatsApp com fundo prata; menu com borda #4a4a4f. | aria-label; o menu tem aria-expanded e aria-controls |
| **CTA flutuante** | fixo; desktop: direita e base de 28px, altura 56, padding 0 24, texto 600/15; mobile: left/right/bottom de 12px, largura total. | visível se `scrollY > 75% vh` e o topo de `#cta-final` estiver a mais de 55% do vh; some com o menu aberto; tabindex −1 quando oculto |
| **Selo "Quem responde"** | avatar 40px com anel `0 0 0 1px rgba(242,242,240,.25)` + 2 linhas 400/14 (#d9d9dc / #a1a1a6). Sempre sob um CTA. | — |
| **Rótulo de seção** | linha de 32×1px (prata no escuro, #6b6b70 no claro) + label 12px. | — |
| **Figura de serviço** | imagem 4:5, fundo #1c1c1f; legenda com margin-top 20, padding-top 18, borda superior 1px #2a2a2e; título 24–30; descrição 15/1.55 #a1a1a6. | hover na imagem (ver Imagens) |
| **Item de lista** ("A UAI assume") | borda superior 1px #0b0b0c no grupo; título 26–32; texto 16/1.6 #4a4a4f, máx 30ch. | — |
| **Rota** | linha tracejada de 2px `repeating-linear-gradient(#8a8a90 0 6px, transparent 6px 12px)`; paradas de 16px; destino em círculo de 56px com avião a 45°. Desktop: grid de 4 colunas × 3 linhas (texto acima nas etapas 1 e 3, abaixo nas 2 e 4). Abaixo de 1000px: vertical à esquerda, max 560px. | entrada: a linha se desenha em 1.8s; paradas a 150/500/850/1200/1500ms |
| **Díptico do Otávio** | grid `1.62fr 1fr`, gap 16, align end; 2ª foto com margin-bottom de 96px (40 no mobile); legenda em label. | — |
| **Diferencial** | grid `190px 1fr` (1 coluna no mobile), padding 20 0, borda inferior 1px #2a2a2e; título 24; texto 16 #a1a1a6. | — |
| **Placeholder de depoimento** | borda 1px tracejada #a1a1a6, marcas "+" 18px/300 #6b6b70 a −10/−6px dos cantos; citação 30–48 Condensed #6b6b70; atribuição com círculo tracejado de 48px. | Trocar pelo depoimento real mantendo a escala. |
| **FAQ** | `h3 > button` com largura total, padding 26 0, 500/18–21; ícone de 36px. Painel `role=region` com `grid-template-rows: 0fr→1fr` em 420ms e opacidade em 320ms. Um aberto por vez. | hover texto #4a4a4f · aberto: ícone gira 45°, fundo #0b0b0c e ícone #f2f2f0 |
| **Header** | fixo; desktop com 96px de altura (72 rolado), logo 56 (44); fundo transparente → rgba(11,11,12,.96) + borda #2a2a2e ao rolar mais de 40px. Tablet e mobile: 64px, logo 40, menu. | links: #a1a1a6 → #f2f2f0 com sublinhado de 1px #a8a8ad no hover |
| **Menu mobile** | tela cheia a partir de 64px; links 40px Condensed 500 com seta; selo do Otávio + CTA em largura total embaixo. | fecha ao clicar num link |
| **Link de texto** | sublinhado de 1px, offset 6px, cor #4a4a4f (escuro) ou #a1a1a6 (claro). | hover: o sublinhado ganha a cor do texto |

## 5. Animações e microinterações
Ease padrão `cubic-bezier(.2,.7,.2,1)`; rota em `cubic-bezier(.65,0,.35,1)`.
- **Reveal** (`[data-rv]`): opacity 0→1 e translateY 20→0 em 900ms, com delay por atributo (90–520ms). IntersectionObserver com threshold .12 e rootMargin `0 0 -8% 0`. Dispara uma vez.
- **Imagem de fundo** (`data-rv="img"`): opacity + scale 1.06→1 em 1.2s/2.6s.
- **Rota** (`wipe-x` / `wipe-y`): `clip-path: inset(0 100% 0 0)` → `inset(0)` em 1.8s.
- **Hover prata**: background-position 0→100% em 900ms.
- **FAQ**, **header** e **flutuante**: ver Componentes.
- `prefers-reduced-motion: reduce` desliga tudo, e a prop `motion=false` também. No React, prefira Framer Motion `whileInView` com `once: true` ou um hook próprio com IntersectionObserver, com os mesmos valores.

## 6. Comportamento responsivo
- **< 700 (mobile):** header de 64px; hero em 100svh e CTA em largura total; serviços em faixa horizontal com `grid-auto-flow: column`, `grid-auto-columns: 78%`, `scroll-snap-type: x mandatory`, sangrando até a borda (margin 0 −20px, padding 0 20px) e com a dica "Deslize para ver os quatro"; rota vertical; Otávio empilhado; depoimentos empilhados; CTA flutuante em largura total; footer com padding-bottom de 96px para não ficar atrás do flutuante.
- **700–1099 (tablet):** header compacto; serviços em 2 colunas com deslocamento de 0/72; rota vertical (horizontal a partir de 1000px); o resto em coluna única.
- **≥ 1100 (desktop):** navegação completa; pares 7/5; serviços em 4 colunas com deslocamento de 0/128/48/176; título do FAQ fixo (top 120px).
- Tipografia fluida com clamp, sem saltos por breakpoint.

## 7. Estado
- `menuOpen` (bool): menu mobile.
- `faqOpen` (índice ou −1): um item aberto por vez.
- `headerSolid` (scrollY > 40).
- `floatVisible` (regra acima). Calcular em rAF e só dar setState quando o valor mudar.
- Breakpoint: preferir CSS/Tailwind (`sm/md/lg`) a JS. No protótipo o JS existe só por limitação de estilos inline.

## 8. Conteúdo
Toda a copy está em `UAI Viagens v2.dc.html` e segue `content/site.ts` do repositório, com estas mudanças:
- H1 (padrão): "Sua próxima viagem, sem o trabalho de organizar tudo sozinho." Alternativas: "Você escolhe pra onde. A UAI organiza o caminho." e "Não sabe por onde começar? Começa pela conversa."
- Selo: "Quem responde é o Otávio. Uma pessoa, sem robô e sem compromisso." **Confirmar com o cliente** que é mesmo o Otávio quem responde.
- Diferenciais ainda **a validar com o cliente** (atendimento direto, roteiro do seu jeito, até o embarque).
- Nenhum número, depoimento, selo ou preço foi inventado.

## 9. Assets
- `assets/otavio-1.jpg` e `assets/otavio-2.jpg`: fotos do cliente (`images/` do repositório).
- Logo: vetor redesenhado a partir do print do perfil do Instagram (símbolo `#logo` no HTML). **Substituir pelo arquivo original em alta** assim que o cliente enviar. O texto "viagens" usa Barlow 300 no lugar da fonte original.
- Fotos de destino: Unsplash (placeholders; os IDs estão em "Imagens").

## 10. Arquivos
- `UAI Viagens v2.dc.html`: a página (markup + lógica). Abra com um servidor estático.
- `UAI Design System.dc.html`: espécimes de cor, tipo, espaço, imagem, componentes com estados, movimento e responsivo.
- `tokens.css`: variáveis CSS prontas para o `globals.css` / tema do Tailwind v4 (`@theme`).
- `support.js`: runtime do protótipo; não vai para produção.

### Sugestão de implementação (Next.js do repositório)
1. Levar `tokens.css` para `app/globals.css` dentro de `@theme` (Tailwind v4) e carregar as fontes com `next/font/google` (Barlow, Barlow_Condensed).
2. Atualizar os componentes existentes em `components/sections/*` (Hero, Situacao→PontoDePartida, Servicos, ComoFunciona, Sobre, Faq, CtaFinal, Footer, Header) e `components/ui/*` (Button com variantes `silver` e `ink`, WhatsappFloating, Reveal).
3. Criar `TrustChip` (selo) e `Route` (rota horizontal/vertical).
4. Usar `next/image` com `sizes` corretos; `priority` só no hero.
