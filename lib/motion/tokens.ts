// Espelho em JS dos tokens de app/globals.css. Mudou lá, muda aqui.

export const EASE_OUT = "cubic-bezier(0.2, 0.7, 0.2, 1)";
export const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

export const DUR = {
  fast: 160,
  ui: 320,
  reveal: 900,
  line: 1000,
  image: 2600,
  crossfade: 600,
} as const;

export const STAGGER = 90;

/** Suavização exponencial independente de frame rate: v += (alvo − v)·(1 − e^(−λ·dt)). */
export function damp(current: number, target: number, lambda: number, dtSeconds: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dtSeconds));
}

export const LAMBDA = {
  heroDepth: 3,
  magnetic: 8,
  follow: 5,
} as const;
