# Plano — Landing Page UAI Viagens (@uaiviagens_)

Segundo projeto de LP para o Otávio (cliente já tem outra marca/projeto em andamento neste mesmo workspace). Este documento organiza o que já foi levantado e os próximos passos para quando for construir a página.

## Status
- [x] Perfil do Instagram identificado e analisado
- [x] Imagens de referência salvas em `images/`
- [x] Identidade visual preliminar extraída → ver `identidade-visual.md`
- [x] Briefing formal (`brief.md`, skill `landing-premium:briefing-cliente`)
- [x] Estrutura e copy da LP (`copy.md`, skill `landing-premium:estrutura-e-copy`)
- [x] Construção da LP (skill `landing-premium:construir-landing`) — Next.js 16 +
      Tailwind v4, variante Editorial, build limpo, testado em 375/768/1440px
- [x] Constituição do projeto documentada em `CLAUDE.md`
- [ ] Logo em alta resolução (pedir PNG/SVG transparente ao Otávio) — cor de destaque
      hoje é hipótese extraída do print
- [ ] Diferencial real e ticket médio confirmados com o Otávio
- [ ] Sessão de coleta de prova social (depoimentos/fotos de clientes)
- [ ] Definir domínio (precisa comprar um novo) e atualizar `metadataBase`/JSON-LD
- [x] Revisão e entrega — auditoria rodada (`landing-premium:revisao-e-entrega`,
      2026-09-22): build limpo, Lighthouse Acessibilidade 100 / SEO 100 / Boas
      práticas 96, testado em 5 breakpoints sem overflow, 1 bug real de
      acessibilidade encontrado e corrigido (lista quebrada em Situação/Como
      Funciona), analytics de clique conectado, favicon/OG gerados. Ver checklist
      completo em `CLAUDE.md` > Critérios de qualidade — Performance (74 local)
      precisa reteste no preview real da Vercel antes de bater o martelo.
- [ ] Proposta comercial, se ainda não fechada (skill `landing-premium:proposta-comercial`)
- [ ] Deploy na Vercel — bloqueado até domínio + pendências do Otávio (não faz
      sentido publicar em produção com logo/prova social/diferencial provisórios)

## Próximos passos sugeridos (em ordem)
1. **Briefing** — rodar `landing-premium:briefing-cliente` com o Otávio: confirmar objetivo da LP (captar leads? vender pacotes específicos? direcionar para WhatsApp?), público-alvo, diferenciais, regiões/destinos foco.
2. **Assets** — pedir ao cliente:
   - Logo em alta resolução (SVG/PNG fundo transparente)
   - Fotos de viagens/clientes em melhor qualidade (os posts do feed têm bom material)
   - Depoimentos de clientes reais (os Destaques "Clientes" sugerem que ele já tem isso)
3. **Estrutura & copy** — usar o tom de voz mineiro/descontraído identificado na bio como fio condutor da copy (evitar copy corporativa genérica de agência de viagem).
4. **Seções candidatas para a LP** (hipótese inicial, validar no briefing):
   - Hero com a tagline de marca ou variação dela
   - Serviços (os 4 itens da bio: pacotes nacionais/internacionais, hospedagens, cruzeiros, roteiros personalizados)
   - Destinos por faixa de orçamento (reaproveitar o conceito do post "47 países para viajar" — Caro/Médio/Barato)
   - Sobre o Otávio / a agência (usar as fotos de estúdio já salvas)
   - Depoimentos de clientes
   - CTA para WhatsApp/Linktree (o perfil já usa linktr.ee/uaiviagens_ como hub de links)
5. **Construção** — seguir design system do plugin `landing-premium`, aplicando a paleta vermelho/preto/branco como ponto de partida (a confirmar com logo em alta resolução).
6. **Revisão e entrega** — checklist de SEO, responsividade e performance antes de publicar.

## Observações
- CNPJ da empresa: 55.372.856/0001-80 (útil para rodapé/termos da LP).
- Link atual centralizador: linktr.ee/uaiviagens_
