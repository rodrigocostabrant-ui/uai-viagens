"use client";

// Fotos do Otávio girando em 360° em duas órbitas alternadas.
//
// Padrão, mas não rígido: as fotos se alternam entre uma órbita externa (alta,
// inclinada para um lado, girando num sentido) e uma interna (baixa, inclinada para
// o outro, girando no sentido contrário), e cada uma carrega um desvio próprio de
// ângulo, raio, altura, inclinação e tamanho, fixo por posição (não muda a cada
// recarga). Rolar o mouse sobre as fotos acelera o giro no sentido do scroll, sem
// prender a página; no toque, o arrasto lateral gira. Tudo em unidades do palco
// (cqw/cqh): o servidor já entrega as fotos espalhadas, e o JS só muda o ângulo.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { subscribe } from "@/lib/motion/ticker";
import { damp } from "@/lib/motion/tokens";
import { getTier } from "@/lib/motion/tier";

export type OrbitPhoto = { src: string; title: string; alt: string; position?: string };

/** Posições no círculo: com poucas fotos, repete-as em lados opostos. */
const MIN_SLOTS = 6;
const MAX_SLOTS = 14;
const CRUISE = 0.16; // rad/s em repouso
const WHEEL_GAIN = 0.0026; // rad/s por pixel de scroll
const MAX_SPIN = 3.2; // rad/s
const DRAG_GAIN = 0.009; // rad por pixel arrastado

const RINGS = [
  { radius: 36, y: -17, incline: 11, dir: 1 }, // externa, alta
  { radius: 22, y: 19, incline: -10, dir: -1 }, // interna, baixa, sentido contrário
];

// Pseudoaleatório determinístico (mesmo resultado no servidor e no cliente)
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Slot = {
  photo: OrbitPhoto;
  ring: (typeof RINGS)[number];
  angle: number;
  radius: number;
  y: number;
  tilt: number;
  scale: number;
  echo: boolean;
};

function buildSlots(photos: OrbitPhoto[]): Slot[] {
  const count = Math.min(MAX_SLOTS, Math.max(MIN_SLOTS, photos.length));
  const perRing = [Math.ceil(count / 2), Math.floor(count / 2)];
  return Array.from({ length: count }, (_, i) => {
    const r = i % 2;
    const ring = RINGS[r];
    const k = Math.floor(i / 2);
    const step = (Math.PI * 2) / perRing[r];
    // Órbita interna começa meio passo à frente: as fotos se alternam, não se empilham.
    const angle = k * step + (r ? step / 2 : 0) + (rnd(i, 1) - 0.5) * step * 0.45;
    // Repetidas vão para o lado oposto do círculo (nunca duas iguais lado a lado).
    const idx = (k * 2 + r) % photos.length;
    return {
      photo: photos[idx],
      ring,
      angle,
      radius: ring.radius * (0.9 + rnd(i, 2) * 0.2),
      y: ring.y + (rnd(i, 3) - 0.5) * 8,
      tilt: (rnd(i, 4) - 0.5) * 16 * (i % 2 ? -1 : 1),
      scale: 0.84 + rnd(i, 5) * 0.24,
      echo: i >= photos.length,
    };
  });
}

function transformOf(s: Slot, spin: number) {
  const a = s.angle + spin * s.ring.dir;
  const x = Math.sin(a) * s.radius;
  const z = Math.cos(a) * s.radius;
  const y = s.y + Math.cos(a) * s.ring.incline;
  return {
    transform: `translate3d(calc(${x.toFixed(3)}cqw - 50%), calc(${y.toFixed(3)}cqh - 50%), ${z.toFixed(3)}cqw) rotate(${s.tilt.toFixed(2)}deg) scale(${s.scale.toFixed(3)})`,
    depth: Math.cos(a), // 1 = frente, -1 = fundo
  };
}

export function PhotoOrbit({ photos, hint, touchHint }: { photos: OrbitPhoto[]; hint: string; touchHint: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [slots] = useState(() => buildSlots(photos));
  const [front, setFront] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !slots.length) return;
    const still = getTier() === "off";
    let spin = 0;
    let speed = still ? 0 : CRUISE;
    let unsub: (() => void) | null = null;
    let lastFront = -1;
    let drag: number | null = null;

    const paint = () => {
      let best = -2;
      let bestI = 0;
      slots.forEach((s, i) => {
        const card = cardRefs.current[i];
        if (!card) return;
        const { transform, depth } = transformOf(s, spin);
        card.style.transform = transform;
        card.style.zIndex = String(Math.round(50 + depth * 40));
        const shade = shadeRefs.current[i];
        if (shade) shade.style.opacity = String(((1 - depth) / 2) * 0.62);
        if (depth > best && !s.echo) {
          best = depth;
          bestI = i;
        }
      });
      if (bestI !== lastFront) {
        lastFront = bestI;
        setFront(bestI);
      }
    };

    const tick = (dt: number) => {
      const cruise = still ? 0 : CRUISE * Math.sign(speed || 1);
      speed = damp(speed, cruise, 1.4, dt);
      spin += speed * dt;
      paint();
    };

    const onWheel = (e: WheelEvent) => {
      // Não segura a página: só acelera o giro no sentido do scroll.
      const push = e.deltaY * WHEEL_GAIN;
      if (still) {
        spin += push * 0.12;
        paint();
      } else speed = Math.max(-MAX_SPIN, Math.min(MAX_SPIN, speed + push));
    };
    const onDown = (e: PointerEvent) => {
      drag = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (drag === null) return;
      spin += (e.clientX - drag) * DRAG_GAIN;
      drag = e.clientX;
      paint();
    };
    const onUp = () => {
      drag = null;
    };

    stage.addEventListener("wheel", onWheel, { passive: true });
    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    paint();
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !still) unsub ??= subscribe(tick);
      else {
        unsub?.();
        unsub = null;
      }
    });
    io.observe(stage);

    return () => {
      io.disconnect();
      unsub?.();
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [slots]);

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={stageRef}
        role="group"
        aria-label="Fotos do Otávio"
        className="orbit-stage relative h-[clamp(440px,118vw,580px)] cursor-grab touch-pan-y overflow-clip select-none active:cursor-grabbing tab:h-[clamp(520px,74svh,760px)]"
      >
        <div className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]">
          {slots.map((s, i) => (
            <div
              key={i}
              ref={(node) => {
                cardRefs.current[i] = node;
              }}
              className="orbit-card absolute top-0 left-0"
              style={{ transform: transformOf(s, 0).transform }}
              aria-hidden={s.echo || undefined}
            >
              <div className="orbit-face relative aspect-[4/5] overflow-clip rounded-[2px] bg-graphite shadow-[0_24px_48px_-24px_rgb(0_0_0/.9)]">
                <Image
                  src={s.photo.src}
                  alt={s.echo ? "" : s.photo.alt}
                  fill
                  sizes="(min-width: 1100px) 22vw, 40vw"
                  draggable={false}
                  className="photo-portrait object-cover"
                  style={{ objectPosition: s.photo.position ?? "50% 30%" }}
                />
                <span
                  ref={(node) => {
                    shadeRefs.current[i] = node;
                  }}
                  className="pointer-events-none absolute inset-0 bg-ink"
                  style={{ opacity: 0 }}
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-6">
        <span className="label leading-[1.4] tracking-[0.2em] text-gray-400">{slots[front]?.photo.title}</span>
        <span className="text-[13px] leading-[1.4] text-gray-500 [@media(pointer:coarse)]:hidden">{hint}</span>
        <span className="hidden text-[13px] leading-[1.4] text-gray-500 [@media(pointer:coarse)]:inline">{touchHint}</span>
      </div>
    </div>
  );
}
