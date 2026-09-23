"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { downgradeTier, getTier } from "@/lib/motion/tier";
import { subscribe } from "@/lib/motion/ticker";
import { pointer } from "@/lib/motion/pointer";
import { DUR } from "@/lib/motion/tokens";

type Variant = "hero" | "cta";

const CONFIG = {
  hero: {
    objectPosition: [0.5, 0.6] as [number, number],
    contrast: 1.12,
    brightness: 0.8,
    particles: 90,
    gradient:
      "linear-gradient(180deg, rgb(11 11 12 / .6) 0%, rgb(11 11 12 / 0) 26%, rgb(11 11 12 / .2) 52%, rgb(11 11 12 / .94) 100%)",
  },
  cta: {
    objectPosition: [0.5, 0.5] as [number, number],
    contrast: 1.15,
    brightness: 0.66,
    particles: 0,
    gradient:
      "linear-gradient(180deg, rgb(11 11 12 / .3) 0%, rgb(11 11 12 / .1) 40%, rgb(11 11 12 / .9) 100%)",
  },
} as const;

/** Tempo máximo para o WebGL ficar pronto depois da abertura; passou disso, fica o drift CSS. */
const INIT_DEADLINE_MS = 6000;
/** Largura máxima da textura: cobre 1440px × DPR 1.5 e reduz o upload/mipmaps no primeiro quadro. */
const MAX_TEXTURE_WIDTH = 2048;

function waitFor(check: () => boolean, target: Element, attributeFilter: string[]) {
  if (check()) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const mo = new MutationObserver(() => {
      if (check()) {
        mo.disconnect();
        resolve();
      }
    });
    mo.observe(target, { attributes: true, attributeFilter });
  });
}

function whenIdle() {
  return new Promise<void>((resolve) => {
    const go = () =>
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => resolve(), { timeout: 1500 })
        : setTimeout(resolve, 200);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  });
}

function imageReady(img: HTMLImageElement) {
  if (img.complete && img.naturalWidth > 0) return img.decode().catch(() => undefined);
  return new Promise<void>((resolve, reject) => {
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => reject(new Error("imagem não carregou")), { once: true });
  });
}

function loadDepth(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // sem mapa: só drift e névoa
    img.src = src;
  });
}

/**
 * Foto de fundo (hero e CTA final). A <img> do next/image é o LCP e o fallback;
 * no tier "full" um canvas Three.js entra por cima, em crossfade, depois que a
 * abertura CSS termina — no repouso o quadro do canvas é idêntico ao da <img>.
 */
export function DepthPhoto({
  src,
  depthSrc,
  alt,
  variant,
  horizon,
  sizes,
}: {
  src: string;
  depthSrc?: string;
  alt: string;
  variant: Variant;
  /** Linha do horizonte, 0..1 a partir do topo da foto. */
  horizon: number;
  sizes: string;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const openRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const cfg = CONFIG[variant];
  const hero = variant === "hero";

  useEffect(() => {
    if (getTier() !== "full") return;
    const media = mediaRef.current;
    const open = openRef.current;
    const gradient = gradientRef.current;
    const img = open?.querySelector("img");
    if (!media || !open || !gradient || !img) return;

    let cancelled = false;
    let canvas: HTMLCanvasElement | null = null;
    let scene: import("@/lib/three/DepthScene").DepthScene | null = null;
    const cleanups: Array<() => void> = [];

    const teardown = () => {
      cleanups.splice(0).forEach((fn) => fn());
      scene?.destroy();
      scene = null;
      canvas?.remove();
      canvas = null;
      media.removeAttribute("data-webgl");
    };
    const fail = () => {
      if (cancelled) return;
      teardown();
      downgradeTier("css");
    };

    (async () => {
      await whenIdle();
      await imageReady(img);
      // Espera a abertura CSS: load no hero, reveal no CTA.
      if (hero) await waitFor(() => media.hasAttribute("data-loaded"), media, ["data-loaded"]);
      else await waitFor(() => open.hasAttribute("data-revealed"), open, ["data-revealed"]);
      await Promise.all(open.getAnimations().map((a) => a.finished)).catch(() => undefined);
      if (cancelled || getTier() !== "full") return;

      const deadline = setTimeout(fail, INIT_DEADLINE_MS);
      cleanups.push(() => clearTimeout(deadline));

      const [{ DepthScene }, depth, bitmap] = await Promise.all([
        import("@/lib/three/DepthScene"),
        depthSrc ? loadDepth(depthSrc) : Promise.resolve(null),
        createImageBitmap(img, {
          imageOrientation: "flipY",
          resizeWidth: Math.min(img.naturalWidth, MAX_TEXTURE_WIDTH),
          resizeHeight: Math.round((Math.min(img.naturalWidth, MAX_TEXTURE_WIDTH) / img.naturalWidth) * img.naturalHeight),
          resizeQuality: "high",
        }),
      ]);
      if (cancelled) {
        bitmap.close();
        return;
      }

      // Canvas criado aqui (não pelo React): no StrictMode cada montagem ganha um
      // canvas novo, e forceContextLoss() no destroy é seguro.
      canvas = document.createElement("canvas");
      canvas.className = "depth-canvas";
      canvas.setAttribute("aria-hidden", "true");
      media.insertBefore(canvas, gradient);
      const onLost = (e: Event) => {
        e.preventDefault();
        fail();
      };
      canvas.addEventListener("webglcontextlost", onLost);

      scene = new DepthScene(canvas, {
        image: bitmap,
        imageWidth: img.naturalWidth,
        imageHeight: img.naturalHeight,
        depth,
        objectPosition: cfg.objectPosition,
        contrast: cfg.contrast,
        brightness: cfg.brightness,
        horizon,
        particles: cfg.particles,
      });
      const s = scene;

      const resize = () => s.resize(media.clientWidth, media.clientHeight);
      resize();
      let resizeRaf = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(resize);
      });
      ro.observe(media);
      cleanups.push(() => {
        ro.disconnect();
        cancelAnimationFrame(resizeRaf);
      });

      await s.warmUp();
      clearTimeout(deadline);
      if (cancelled) return;

      // Guarda de desempenho. Mede o tempo de CPU do draw e também o intervalo real
      // entre quadros (pega GPU lenta, que o tempo de CPU não mostra). Janela por tempo:
      // 0,5s de aquecimento (compilação/upload) e depois até 2s ou 60 quadros.
      // Mediana ruim → versão leve; continuou ruim → desliga o WebGL (tier css).
      // Tempo real (performance.now), não o dt do ticker, que é limitado a 0,1s por quadro.
      let started = 0;
      let windowStart = 0;
      let lastFrame = 0;
      let checked = 0;
      const cpu: number[] = [];
      const gaps: number[] = [];
      const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
      const tick = (dt: number) => {
        const rect = media.getBoundingClientRect();
        const scroll = hero ? Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height))) : 0;
        const inside = pointer.active;
        const ms = s.update(dt, inside ? pointer.nx : null, inside ? pointer.ny : null, scroll);
        if (checked >= 2) return;
        const now = performance.now();
        const gap = lastFrame ? now - lastFrame : 0;
        lastFrame = now;
        started ||= now;
        if (now - started < 500) return;
        // Pausa longa (seção saiu da tela, aba oculta): recomeça a janela sem contar o buraco.
        if (gap > 2500) {
          cpu.length = 0;
          gaps.length = 0;
          windowStart = 0;
          return;
        }
        windowStart ||= now;
        cpu.push(ms);
        if (gap) gaps.push(gap);
        if (cpu.length < 60 && now - windowStart < 2000) return;
        const slow = cpu.length >= 2 && (median(cpu) > 8 || median(gaps) > 22);
        cpu.length = 0;
        gaps.length = 0;
        windowStart = 0;
        checked++;
        if (!slow) {
          checked = 2; // passou: não mede mais
          return;
        }
        if (s.isLow) fail();
        else s.degrade();
      };

      let unsub: (() => void) | null = null;
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) unsub ??= subscribe(tick);
        else {
          unsub?.();
          unsub = null;
        }
      });
      io.observe(media);
      cleanups.push(() => {
        io.disconnect();
        unsub?.();
        canvas?.removeEventListener("webglcontextlost", onLost);
      });

      // Crossfade: canvas por cima da <img> + véu; depois o véu do DOM sai (já coberto).
      requestAnimationFrame(() => {
        if (!canvas || cancelled) return;
        canvas.classList.add("is-live");
        // O movimento só começa depois do crossfade: durante a troca os dois quadros ficam idênticos.
        const t = setTimeout(() => {
          media.setAttribute("data-webgl", "");
          s.start();
        }, DUR.crossfade + 50);
        cleanups.push(() => clearTimeout(t));
      });
    })().catch(fail);

    // Se o tier cair (reduced-motion ligado, falha em outra foto), desliga aqui também.
    const tierObserver = new MutationObserver(() => {
      if (getTier() !== "full") teardown();
    });
    tierObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });

    return () => {
      cancelled = true;
      tierObserver.disconnect();
      teardown();
    };
  }, [cfg, depthSrc, hero, horizon]);

  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      {...(hero ? { loading: "eager" as const } : { loading: "lazy" as const })}
      className="photo-drift object-cover"
      style={{
        objectPosition: `${cfg.objectPosition[0] * 100}% ${cfg.objectPosition[1] * 100}%`,
        filter: `grayscale(1) contrast(${cfg.contrast}) brightness(${cfg.brightness})`,
      }}
    />
  );

  return (
    <div className={hero ? "hero-dolly absolute inset-0" : "absolute inset-0"}>
      <div
        ref={mediaRef}
        className={`${hero ? "hero-media " : ""}absolute inset-0 overflow-clip`}
        suppressHydrationWarning
      >
        <div
          ref={openRef}
          className={`${hero ? "photo-open " : ""}absolute inset-0`}
          data-reveal={hero ? undefined : "img"}
          suppressHydrationWarning
        >
          {image}
        </div>
        <div className="photo-veil absolute inset-0" aria-hidden="true" />
        <div ref={gradientRef} className="absolute inset-0" style={{ background: cfg.gradient }} aria-hidden="true" />
        {hero ? <div className="hero-open-veil absolute inset-0" aria-hidden="true" /> : null}
        {!hero ? (
          <>
            <div className="cta-shutter inset-x-0 top-0 h-[10%]" style={{ "--shutter": "shutter-top" } as React.CSSProperties} aria-hidden="true" />
            <div className="cta-shutter inset-x-0 bottom-0 h-[10%]" style={{ "--shutter": "shutter-bottom" } as React.CSSProperties} aria-hidden="true" />
            <div className="cta-shutter inset-y-0 left-0 w-[6%]" style={{ "--shutter": "shutter-left" } as React.CSSProperties} aria-hidden="true" />
            <div className="cta-shutter inset-y-0 right-0 w-[6%]" style={{ "--shutter": "shutter-right" } as React.CSSProperties} aria-hidden="true" />
          </>
        ) : null}
      </div>
    </div>
  );
}
