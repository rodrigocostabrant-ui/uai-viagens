"use client";

import { useEffect } from "react";
import { observeReveal } from "@/lib/motion/reveal";
import { lineReveal, sheen } from "@/lib/motion/split-lines";
import { downgradeTier, getTier } from "@/lib/motion/tier";
import { subscribe } from "@/lib/motion/ticker";
import { pointer, trackPointer } from "@/lib/motion/pointer";
import { damp, LAMBDA } from "@/lib/motion/tokens";

declare global {
  interface Window {
    __uaiMotionReady?: boolean;
  }
}

/** Atraso do título do hero na coreografia de entrada (v2: 220ms). */
const HERO_TITLE_AT = 220;
/** Momento em que o fallback CSS do título começa a aparecer. */
const TITLE_FALLBACK_AT = 1400;

type Signal = { cancelled: boolean };

async function runLineReveal(el: HTMLElement, delay: number, signal: Signal) {
  try {
    await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 800))]);
    if (signal.cancelled) return;
    el.classList.add("lr-active");
    await lineReveal(el, { delay, signal });
  } catch {
    el.classList.remove("lr-active");
    el.classList.add("lr-done");
  }
}

function heroTitle(signal: Signal): (() => void) | undefined {
  const el = document.querySelector<HTMLElement>('[data-line-reveal="load"]');
  if (!el) return;
  // No tier css o título já entrou só com CSS (sem esperar JS, por causa do LCP); aqui só o brilho.
  if (getTier() === "css") {
    const t = window.setTimeout(() => sheen(el.querySelector(".silver-text")), Math.max(0, 1300 - performance.now()));
    return () => clearTimeout(t);
  }
  if (getTier() !== "full") return;
  // Só assume se o fallback CSS ainda não começou; senão deixa o fallback terminar.
  const elapsed = performance.now();
  const fallback = el.getAnimations()[0];
  const fallbackTime = typeof fallback?.currentTime === "number" ? fallback.currentTime : elapsed;
  if (fallbackTime > TITLE_FALLBACK_AT - 250) {
    // Fallback CSS em curso: ao terminar, trava o título visível (evita replay se o tier cair para css).
    const t = window.setTimeout(() => el.classList.add("lr-done"), Math.max(0, TITLE_FALLBACK_AT + 950 - elapsed));
    return () => clearTimeout(t);
  }
  void runLineReveal(el, HERO_TITLE_AT - elapsed, signal);
  return undefined;
}

function viewTitles(signal: Signal) {
  const offs: Array<() => void> = [];
  document.querySelectorAll<HTMLElement>('[data-line-reveal="view"]').forEach((el) => {
    offs.push(
      observeReveal(el, () => {
        if (getTier() === "off") return;
        void runLineReveal(el, 0, signal);
      }),
    );
  });
  return () => offs.forEach((off) => off());
}

function reveals() {
  const offs: Array<() => void> = [];
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    offs.push(
      observeReveal(el, (node) => {
        if (node instanceof HTMLElement && node.dataset.sheen !== undefined) {
          sheen(node.querySelector(".silver-text"), 600);
        }
      }),
    );
  });
  // Fallback da rota (sem scroll-driven): a linha começa escondida por clip-path,
  // então o gatilho é o contêiner da rota, não o próprio elemento.
  document.querySelectorAll("[data-route]").forEach((el) => {
    const trigger = el.closest(".route-h, .route-v") ?? el;
    offs.push(observeReveal(trigger, () => el.setAttribute("data-revealed", "")));
  });
  return () => offs.forEach((off) => off());
}

/** Botão magnético: no máximo 6px (conteúdo +3px), ativo num raio de 40px além da borda. */
function magnetic() {
  const offs: Array<() => void> = [];
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((wrap) => {
    const target = wrap.querySelector<HTMLElement>("[data-magnetic-target]");
    const content = target?.querySelector<HTMLElement>(".btn-content");
    if (!target) return;
    let x = 0;
    let y = 0;
    let unsub: (() => void) | null = null;
    const tick = (dt: number) => {
      const r = wrap.getBoundingClientRect();
      const dx = pointer.x - (r.left + r.width / 2);
      const dy = pointer.y - (r.top + r.height / 2);
      const near = pointer.active && Math.abs(dx) < r.width / 2 + 40 && Math.abs(dy) < r.height / 2 + 40;
      const tx = near ? Math.max(-6, Math.min(6, dx * 0.12)) : 0;
      const ty = near ? Math.max(-6, Math.min(6, dy * 0.2)) : 0;
      x = damp(x, tx, LAMBDA.magnetic, dt);
      y = damp(y, ty, LAMBDA.magnetic, dt);
      if (Math.abs(x) < 0.01 && Math.abs(y) < 0.01 && !near) {
        x = y = 0;
      }
      target.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      if (content) content.style.translate = `${(x * 0.5).toFixed(2)}px ${(y * 0.5).toFixed(2)}px`;
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) unsub ??= subscribe(tick);
      else {
        unsub?.();
        unsub = null;
      }
    });
    io.observe(wrap);
    offs.push(() => {
      io.disconnect();
      unsub?.();
      target.style.translate = "";
      if (content) content.style.translate = "";
    });
  });
  return () => offs.forEach((off) => off());
}

/** Foto de serviço que acompanha o cursor (±1.2%) enquanto o mouse está sobre ela. */
function follow() {
  const offs: Array<() => void> = [];
  document.querySelectorAll<HTMLElement>("[data-follow]").forEach((frame) => {
    const img = frame.querySelector<HTMLElement>("img");
    if (!img) return;
    let x = 0;
    let y = 0;
    let hovering = false;
    let unsub: (() => void) | null = null;
    const tick = (dt: number) => {
      let tx = 0;
      let ty = 0;
      if (hovering) {
        const r = frame.getBoundingClientRect();
        tx = ((pointer.x - r.left) / r.width - 0.5) * 2 * 1.2;
        ty = ((pointer.y - r.top) / r.height - 0.5) * 2 * 1.2;
      }
      x = damp(x, tx, LAMBDA.follow, dt);
      y = damp(y, ty, LAMBDA.follow, dt);
      img.style.translate = `${x.toFixed(3)}% ${y.toFixed(3)}%`;
      if (!hovering && Math.abs(x) < 0.005 && Math.abs(y) < 0.005) {
        img.style.translate = "";
        unsub?.();
        unsub = null;
      }
    };
    const enter = () => {
      hovering = true;
      unsub ??= subscribe(tick);
    };
    const leave = () => {
      hovering = false;
    };
    frame.addEventListener("pointerenter", enter);
    frame.addEventListener("pointerleave", leave);
    offs.push(() => {
      frame.removeEventListener("pointerenter", enter);
      frame.removeEventListener("pointerleave", leave);
      unsub?.();
      img.style.translate = "";
    });
  });
  return () => offs.forEach((off) => off());
}

export function MotionBootstrap() {
  useEffect(() => {
    window.__uaiMotionReady = true;
    const signal: Signal = { cancelled: false };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduce = () => {
      if (reduce.matches) downgradeTier("off");
    };
    reduce.addEventListener("change", onReduce);

    const offHero = heroTitle(signal);
    const offViewTitles = viewTitles(signal);
    const offReveals = reveals();

    let offPointer = () => {};
    let offMagnetic = () => {};
    let offFollow = () => {};
    if (getTier() === "full") {
      offPointer = trackPointer();
      offMagnetic = magnetic();
      offFollow = follow();
    }

    return () => {
      signal.cancelled = true;
      offHero?.();
      reduce.removeEventListener("change", onReduce);
      offViewTitles();
      offReveals();
      offMagnetic();
      offFollow();
      offPointer();
    };
  }, []);

  return null;
}
