// Título revelado linha a linha, sem tocar nos nós do React:
// o título real fica em opacity 0 (continua legível para leitor de tela) e um
// clone aria-hidden, dividido em linhas medidas, anima por cima. No fim o
// clone sai e o título real aparece.

import { DUR, EASE_IN_OUT, EASE_OUT, STAGGER } from "./tokens";

const ACCENT = "accent-text";

type Word = { el: HTMLSpanElement; accent: boolean };

function wrapWords(root: HTMLElement): Word[] {
  const words: Word[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) texts.push(walker.currentNode as Text);
  for (const text of texts) {
    const accent = !!text.parentElement?.closest(`.${ACCENT}`);
    const parts = text.data.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(document.createTextNode(part));
      } else {
        // inline (não inline-block): mantém a quebra do text-wrap:balance
        const span = document.createElement("span");
        span.textContent = part;
        frag.append(span);
        words.push({ el: span, accent });
      }
    }
    text.replaceWith(frag);
  }
  return words;
}

function groupLines(words: Word[]) {
  const lines: Word[][] = [];
  let top = Number.NaN;
  for (const w of words) {
    const t = Math.round(w.el.getBoundingClientRect().top);
    if (lines.length === 0 || Math.abs(t - top) > 4) {
      lines.push([]);
      top = t;
    }
    lines[lines.length - 1].push(w);
  }
  return lines;
}

function rebuild(clone: HTMLElement, lines: Word[][]) {
  clone.textContent = "";
  const inners: HTMLSpanElement[] = [];
  const accentFrags: HTMLSpanElement[] = [];
  for (const line of lines) {
    const mask = document.createElement("span");
    mask.className = "lr-line";
    const inner = document.createElement("span");
    inner.className = "lr-inner";
    let frag: HTMLSpanElement | null = null;
    line.forEach((w, i) => {
      const target = w.accent
        ? (frag ??= (() => {
            const s = document.createElement("span");
            s.className = ACCENT;
            inner.append(s);
            accentFrags.push(s);
            return s;
          })())
        : inner;
      if (!w.accent) frag = null;
      if (i > 0) target.append(" ");
      target.append(w.el);
    });
    mask.append(inner);
    clone.append(mask);
    inners.push(inner);
  }
  // Fundo contínuo entre fragmentos da frase de destaque (como o box-decoration-break: slice do original)
  const widths = accentFrags.map((f) => f.getBoundingClientRect().width);
  const total = widths.reduce((a, b) => a + b, 0);
  let x = 0;
  accentFrags.forEach((f, i) => {
    f.style.backgroundSize = `250% 100%, ${total}px 100%`;
    f.style.backgroundPosition = `150% 0, ${-x}px 0`;
    x += widths[i];
  });
  return inners;
}

export type LineRevealOptions = {
  /** Atraso a partir de agora, em ms. */
  delay: number;
  signal: { cancelled: boolean };
};

/** Brilho único: a faixa de luz atravessa a frase e sai. */
export function sheen(el: Element | null, delay = 0) {
  if (!(el instanceof HTMLElement)) return;
  el.animate(
    [{ backgroundPosition: "150% 0, 0 0" }, { backgroundPosition: "-50% 0, 0 0" }],
    { duration: 1400, delay, easing: EASE_IN_OUT },
  );
}

export async function lineReveal(real: HTMLElement, { delay, signal }: LineRevealOptions) {
  const wrap = real.parentElement;
  if (!wrap) throw new Error("lineReveal: título sem wrapper .lr-wrap");

  const clone = real.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.removeAttribute("data-line-reveal");
  clone.setAttribute("aria-hidden", "true");
  clone.classList.add("lr-clone");
  clone.style.width = `${real.getBoundingClientRect().width}px`;
  wrap.append(clone);

  const inners = rebuild(clone, groupLines(wrapWords(clone)));
  if (signal.cancelled) {
    clone.remove();
    return;
  }

  const animations = inners.map((inner, i) =>
    inner.animate([{ transform: "translateY(105%)" }, { transform: "translateY(0)" }], {
      duration: DUR.line,
      delay: Math.max(0, delay) + i * STAGGER,
      easing: EASE_OUT,
      fill: "both",
    }),
  );

  try {
    await Promise.all(animations.map((a) => a.finished));
  } catch {
    // cancelado (StrictMode/desmontagem): segue para mostrar o título real
  }
  real.classList.remove("lr-active");
  real.classList.add("lr-done");
  clone.remove();
  if (!signal.cancelled) sheen(real.querySelector(`.${ACCENT}`), 120);
}
