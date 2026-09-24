"use client";

// Fotos do Otávio passando numa faixa contínua, da esquerda para a direita.
//
// A faixa anda em velocidade constante e nunca para sozinha: com o mouse em cima ela
// desacelera, e a foto sob o cursor se inclina na direção dele. A roda do mouse empurra
// a faixa no sentido do scroll, sem prender a página; arrastar (mouse ou toque) puxa a
// faixa e, ao soltar, o impulso se dissolve de volta no ritmo de cruzeiro. Cada foto tem
// um desvio próprio de altura e inclinação, fixo por posição (igual no servidor e no
// cliente). O servidor entrega a faixa já montada; o JS só muda o deslocamento.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { subscribe } from "@/lib/motion/ticker";
import { damp } from "@/lib/motion/tokens";
import { getTier } from "@/lib/motion/tier";

export type MarqueePhoto = { src: string; title: string; alt: string; position?: string };

/** Fotos por volta da faixa: com poucas, repete-as até cobrir a largura do palco. */
const MIN_CARDS = 6;
const CRUISE = 0.07; // larguras do palco por segundo, em repouso
const HOVER_FACTOR = 0.35; // fração do cruzeiro com o mouse em cima (nunca para)
const WHEEL_GAIN = 1.1; // px/s por pixel de scroll
const MAX_SPEED = 1.6; // larguras do palco por segundo
const TILT = 9; // graus máximos da foto sob o cursor

// Pseudoaleatório determinístico (mesmo resultado no servidor e no cliente)
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Card = { photo: MarqueePhoto; index: number; y: number; tilt: number; echo: boolean };

function buildLap(photos: MarqueePhoto[]) {
  const count = Math.ceil(Math.max(MIN_CARDS, photos.length) / photos.length) * photos.length;
  return Array.from({ length: count }, (_, i) => ({
    photo: photos[i % photos.length],
    index: i % photos.length,
    y: (rnd(i, 3) - 0.5) * 12 * (i % 2 ? -1 : 1),
    tilt: (rnd(i, 4) - 0.5) * 5 * (i % 2 ? 1 : -1),
  }));
}

export function PhotoMarquee({ photos, hint, touchHint }: { photos: MarqueePhoto[]; hint: string; touchHint: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const faceRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Duas voltas idênticas: quando a 1ª sai pela direita, a 2ª ocupa o lugar dela.
  const [cards] = useState<Card[]>(() => {
    const lap = buildLap(photos);
    return [...lap, ...lap].map((c, i) => ({ ...c, echo: i >= photos.length }));
  });
  const [front, setFront] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track || !cards.length) return;
    const still = getTier() === "off";
    const lapLen = cards.length / 2;

    let stageW = stage.clientWidth;
    let lapW = 0;
    let centers: number[] = [];
    let offset = 0;
    let speed = still ? 0 : CRUISE * stageW;
    let hovering = false;
    let drag: { x: number; t: number; v: number } | null = null;
    let unsub: (() => void) | null = null;
    let lastFront = -1;
    // Inclinação de cada foto (atual e alvo), em -1..1 nos dois eixos
    const tilt = cards.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));
    let hovered = -1;

    const measure = () => {
      stageW = stage.clientWidth;
      const a = cardRefs.current[0];
      const b = cardRefs.current[lapLen];
      lapW = a && b ? b.offsetLeft - a.offsetLeft : 0;
      centers = cardRefs.current.map((c) => (c ? c.offsetLeft + c.offsetWidth / 2 : 0));
    };

    const paint = () => {
      if (!lapW) return;
      offset = ((offset % lapW) + lapW) % lapW;
      track.style.transform = `translate3d(${(offset - lapW).toFixed(2)}px, 0, 0)`;

      // Legenda: a foto mais perto do centro do palco
      const center = stageW / 2 + lapW - offset;
      let best = Infinity;
      let bestI = 0;
      centers.forEach((x, i) => {
        const d = Math.abs(x - center);
        if (d < best) {
          best = d;
          bestI = cards[i].index;
        }
      });
      if (bestI !== lastFront) {
        lastFront = bestI;
        setFront(bestI);
      }
    };

    const tiltPaint = (dt: number) => {
      tilt.forEach((t, i) => {
        if (i !== hovered) {
          t.tx = 0;
          t.ty = 0;
        }
        if (!t.x && !t.y && !t.tx && !t.ty) return;
        t.x = damp(t.x, t.tx, 10, dt);
        t.y = damp(t.y, t.ty, 10, dt);
        if (Math.abs(t.x) < 0.001 && Math.abs(t.y) < 0.001 && !t.tx && !t.ty) t.x = t.y = 0;
        const face = faceRefs.current[i];
        if (face) face.style.transform = `rotateX(${(-t.y * TILT).toFixed(2)}deg) rotateY(${(t.x * TILT).toFixed(2)}deg)`;
      });
    };

    const tick = (dt: number) => {
      if (drag) {
        // Enquanto arrasta, a faixa segue o ponteiro; o impulso é medido no pointermove.
        drag.v = damp(drag.v, 0, 6, dt);
      } else {
        const cruise = still ? 0 : CRUISE * stageW * (hovering ? HOVER_FACTOR : 1);
        speed = damp(speed, cruise, hovering ? 3 : 1.2, dt);
        offset += speed * dt;
      }
      paint();
      tiltPaint(dt);
    };

    const cardIndexAt = (target: EventTarget | null) => {
      const el = (target as HTMLElement | null)?.closest<HTMLElement>("[data-card]");
      return el ? Number(el.dataset.card) : -1;
    };

    const onWheel = (e: WheelEvent) => {
      // Não segura a página: só empurra a faixa no sentido do scroll.
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (still) {
        offset += delta * 0.4;
        paint();
        return;
      }
      const max = MAX_SPEED * stageW;
      speed = Math.max(-max, Math.min(max, speed + delta * WHEEL_GAIN));
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, t: e.timeStamp, v: 0 };
      stage.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (drag) {
        const dx = e.clientX - drag.x;
        const dts = Math.max((e.timeStamp - drag.t) / 1000, 1 / 240);
        drag.v = damp(drag.v, dx / dts, 20, dts);
        drag.x = e.clientX;
        drag.t = e.timeStamp;
        offset += dx;
        paint();
      }
      if (e.pointerType !== "mouse" || still) return;
      const i = drag ? -1 : cardIndexAt(e.target);
      hovered = i;
      const face = i >= 0 ? faceRefs.current[i] : null;
      if (face) {
        const r = face.getBoundingClientRect();
        tilt[i].tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        tilt[i].ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      }
    };
    const onUp = () => {
      if (!drag) return;
      const max = MAX_SPEED * stageW;
      // O impulso do arremesso vira velocidade e volta devagar ao cruzeiro.
      speed = still ? 0 : Math.max(-max, Math.min(max, drag.v));
      drag = null;
      if (still) paint();
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onLeave = () => {
      hovering = false;
      hovered = -1;
    };

    stage.addEventListener("wheel", onWheel, { passive: true });
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(() => {
      measure();
      paint();
    });
    ro.observe(stage);
    measure();
    paint();

    const io = new IntersectionObserver(([entry]) => {
      // Em reduced motion o ticker só roda para a inclinação e o arrasto.
      if (entry.isIntersecting) unsub ??= subscribe(tick);
      else {
        unsub?.();
        unsub = null;
      }
    });
    io.observe(stage);

    return () => {
      io.disconnect();
      ro.disconnect();
      unsub?.();
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [cards]);

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={stageRef}
        role="group"
        aria-label="Fotos do Otávio"
        className="marquee-stage relative flex h-[clamp(440px,118vw,580px)] cursor-grab touch-pan-y items-center overflow-clip select-none active:cursor-grabbing tab:h-[clamp(520px,74svh,760px)]"
      >
        <div ref={trackRef} className="marquee-track flex shrink-0 items-center">
          {cards.map((c, i) => (
            <div
              key={i}
              ref={(node) => {
                cardRefs.current[i] = node;
              }}
              data-card={i}
              className="marquee-card shrink-0"
              style={{ translate: `0 ${c.y.toFixed(2)}cqh`, rotate: `${c.tilt.toFixed(2)}deg` }}
              aria-hidden={c.echo || undefined}
            >
              <div
                ref={(node) => {
                  faceRefs.current[i] = node;
                }}
                className="marquee-face relative aspect-[4/5] overflow-clip rounded-[2px] bg-graphite shadow-[0_24px_48px_-24px_rgb(0_0_0/.9)]"
              >
                <Image
                  src={c.photo.src}
                  alt={c.echo ? "" : c.photo.alt}
                  fill
                  sizes="(min-width: 1100px) 26vw, 58vw"
                  draggable={false}
                  className="photo-portrait object-cover"
                  style={{ objectPosition: c.photo.position ?? "50% 30%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-6">
        <span className="label leading-[1.4] tracking-[0.2em] text-gray-400">{photos[front]?.title}</span>
        <span className="text-[13px] leading-[1.4] text-gray-500 [@media(pointer:coarse)]:hidden">{hint}</span>
        <span className="hidden text-[13px] leading-[1.4] text-gray-500 [@media(pointer:coarse)]:inline">{touchHint}</span>
      </div>
    </div>
  );
}
