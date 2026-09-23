# UAI Viagens — landing page

Landing page de conversão (WhatsApp) para a UAI Viagens (@uaiviagens_), agência de
viagens do mesmo cliente do projeto Otávio Milhas.

Comece por `CLAUDE.md` — é a constituição do projeto (posicionamento, identidade
visual, regras de UX/copy/animação, pendências bloqueantes). `brief.md` e `copy.md`
são as fontes de negócio e de texto.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

## Stack

Next.js 16 (App Router, Turbopack) + Tailwind v4 + TypeScript. Sem formulário —
conversão é 100% link de WhatsApp (`content/site.ts`).
