"use client";

// Linha do tempo de "Como funciona" (base: timeline da Hyperiux Vault, adaptada).
// A seção fica presa na tela (CSS sticky) enquanto o scroll vertical empurra a
// trilha para o lado; a linha vermelha se desenha e cada etapa sobe, linha a linha,
// quando a ponta da linha chega nela. Tudo numa timeline GSAP amarrada ao scroll.
// Sem JS ou com reduced motion, a seção mostra a rota estática (Route.tsx).

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { SplitText as SplitTextType } from "gsap/SplitText";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getTier } from "@/lib/motion/tier";

/** GSAP só é baixado quando a linha do tempo monta (fora do bundle inicial). */
async function loadGsap() {
  const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/SplitText"),
  ]);
  gsap.registerPlugin(ScrollTrigger, SplitText);
  return { gsap, ScrollTrigger, SplitText };
}

/** Quanto de scroll vertical cada pixel de trilha consome (1 = 1:1). */
const PACE = 1.25;
/** Onde a ponta da linha fica na tela no começo, em fração da largura. */
const TIP_START = { mobile: 0.5, desktop: 0.36 };

export function Timeline() {
  const { comoFunciona: c } = site;
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const rail = railRef.current;
    if (!root || !track || !rail || getTier() === "off") return;

    let ctx: { revert: () => void } | null = null;
    let splits: SplitTextType[] = [];
    let cancelled = false;
    let lastWidth = 0;
    let lib: Awaited<ReturnType<typeof loadGsap>> | null = null;

    const build = () => {
      if (!lib) return;
      const { gsap, SplitText } = lib;
      ctx?.revert();
      splits.forEach((s) => s.revert());
      splits = [];
      lastWidth = window.innerWidth;

      ctx = gsap.context(() => {
        const vw = window.innerWidth;
        const travel = Math.max(0, track.scrollWidth - vw);
        root.style.height = `calc(100svh + ${Math.round(travel * PACE)}px)`;

        // Coordenadas na trilha (antes de qualquer transform)
        const railLeft = rail.offsetLeft;
        const line = lineRef.current!;
        const lineStart = railLeft + line.offsetLeft;
        const lineEnd = lineStart + line.offsetWidth;
        // A ponta começa em A0 da tela e termina exatamente no fim da linha: tip(t) é linear.
        const a0 = vw * (vw < 700 ? TIP_START.mobile : TIP_START.desktop);
        const tipSpan = lineEnd - a0;
        const tAt = (x: number) => gsap.utils.clamp(0, 0.98, (x - a0) / tipSpan);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.5 },
        });
        tl.fromTo(track, { x: 0 }, { x: -travel, duration: 1 }, 0);
        // Fundo em parallax: anda uma fração da trilha (o wrapper tem 110% da largura).
        tl.fromTo(bgRef.current, { xPercent: 0 }, { xPercent: -8, duration: 1 }, 0);

        const s0 = gsap.utils.clamp(0, 1, (a0 - lineStart) / (lineEnd - lineStart));
        const t0 = tAt(lineStart);
        tl.fromTo(line, { scaleX: s0 }, { scaleX: 1, duration: 1 - t0 }, t0);

        itemRefs.current.forEach((item) => {
          if (!item) return;
          const t = tAt(railLeft + item.offsetLeft);
          const stem = item.querySelector(".tl-stem");
          const dot = item.querySelector(".tl-dot");
          const texts = item.querySelectorAll<HTMLElement>(".tl-text");
          const lines: Element[] = [];
          texts.forEach((el) => {
            const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "tl-ln", aria: "none" });
            splits.push(split);
            lines.push(...split.lines);
          });
          tl.fromTo(stem, { scaleY: 0 }, { scaleY: 1, duration: 0.05 }, t)
            .fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.03 }, t + 0.03)
            .fromTo(lines, { yPercent: 105 }, { yPercent: 0, duration: 0.07, stagger: 0.012, ease: "power2.out" }, t + 0.02);
        });

        tl.fromTo(endRef.current, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.04, ease: "power2.out" }, 0.955);
      }, root);
      root.classList.add("tl-ready");
    };

    // GSAP + fontes antes de medir as linhas do SplitText
    Promise.all([loadGsap(), Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))])])
      .then(([loaded]) => {
        lib = loaded;
        if (!cancelled) build();
      })
      .catch(() => root.classList.add("tl-failed"));

    let timer = 0;
    const onResize = () => {
      // A barra de endereço do celular muda só a altura: não refaz por isso.
      if (window.innerWidth === lastWidth) return;
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        try {
          build();
          lib?.ScrollTrigger.refresh();
        } catch {
          root.classList.add("tl-failed");
        }
      }, 200);
    };
    window.addEventListener("resize", onResize);

    // Se o tier cair para "off" (reduced motion ligado), a rota estática assume.
    const mo = new MutationObserver(() => {
      if (getTier() === "off") {
        ctx?.revert();
        splits.forEach((s) => s.revert());
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      mo.disconnect();
      ctx?.revert();
      splits.forEach((s) => s.revert());
      root.style.height = "";
      root.classList.remove("tl-ready");
    };
  }, []);

  return (
    <div ref={rootRef} className="tl-root relative">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-clip pt-16 pb-24 tab:pb-0 desk:pt-[72px]">
        {/* Foto de fundo da seção inteira (16:9), com véu claro para a leitura */}
        <div className="absolute inset-0" aria-hidden="true">
          <div ref={bgRef} className="absolute inset-y-0 left-0 w-[110%]">
            <Image src={c.imagem.src} alt="" fill sizes="110vw" className="photo-content object-cover" />
          </div>
          <div className="tl-veil absolute inset-0" />
        </div>
        <p className="absolute right-3 bottom-3 z-10 m-0 text-[10px] leading-none text-text-on-light/70">
          <a href={c.imagem.credito.fonte} target="_blank" rel="noopener noreferrer">
            Foto: {c.imagem.credito.autor}, {c.imagem.credito.licenca}
          </a>
        </p>

        <div ref={trackRef} className="tl-track relative z-10 flex h-[var(--tl-h)] w-max flex-none items-stretch px-[var(--tl-pad)]">
          <div ref={railRef} className="tl-rail relative h-full flex-none">
            <div className="absolute top-0 left-0 flex h-1/2 w-[var(--tl-title)] flex-col gap-6 pr-8">
              <SectionLabel tone="light">{c.rotulo}</SectionLabel>
              <h2 className="tl-title m-0 font-display font-medium">
                {c.titulo.principal} <span className="text-gray-700">{c.titulo.destaque}</span>
              </h2>
            </div>

            {/* Linha principal: ponto de partida → linha vermelha → destino */}
            <div className="absolute inset-x-0 top-1/2" aria-hidden="true">
              <span className="absolute top-0 left-0 block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
              <span
                ref={lineRef}
                className="tl-line absolute top-0 right-7 left-0 block h-0.5 origin-left -translate-y-1/2 bg-red"
              />
              <span className="label absolute top-7 left-0 tracking-[0.2em] text-text-on-light">{c.inicio}</span>
            </div>
            <div ref={endRef} className="tl-end absolute top-1/2 right-0 flex -translate-y-7 flex-col items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-red" aria-hidden="true">
                <Icon name="plane" size={24} style={{ transform: "rotate(45deg)" }} />
              </span>
              <span className="label tracking-[0.2em] whitespace-nowrap text-text-on-light">{c.destino}</span>
            </div>

            <ol className="m-0 list-none p-0">
              {c.etapas.map((e, i) => {
                const top = i % 2 === 0;
                return (
                  <li key={e.tag}>
                    <div
                      ref={(node) => {
                        itemRefs.current[i] = node;
                      }}
                      className={`absolute flex h-1/2 w-[var(--tl-itemw)] flex-col ${top ? "top-0 justify-start" : "top-1/2 justify-end"}`}
                      style={{ left: `calc(var(--tl-title) + ${i} * var(--tl-step))` }}
                    >
                      <span
                        className={`tl-stem absolute left-0 w-px bg-gray-400 ${top ? "top-2 bottom-0 origin-bottom" : "top-0 bottom-2 origin-top"}`}
                        aria-hidden="true"
                      />
                      <span
                        className={`tl-dot absolute left-0 block h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-ink ${top ? "top-0" : "bottom-0"}`}
                        aria-hidden="true"
                      />
                      <div className={`flex flex-col gap-3 pl-7 ${top ? "-mt-1" : "-mb-1"}`}>
                        <span className="tl-text label tracking-[0.2em] text-text-on-light">{e.tag}</span>
                        <h3 className="tl-text m-0 font-display text-[clamp(28px,2.4vw,36px)] leading-[1.05] font-medium">
                          {e.titulo}
                        </h3>
                        <p className="tl-text m-0 max-w-[36ch] text-[16px] leading-[1.6] text-text-on-light">{e.texto}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
