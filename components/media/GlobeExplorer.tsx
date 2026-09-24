"use client";

// Globo interativo + painel do continente (galeria de alguns países) + índice.
// O índice é o caminho acessível (teclado, leitor de tela, celular pequeno) e o
// fallback quando não há WebGL: tudo funciona sem o globo. O three.js e o
// globo.json só são baixados quando a seção se aproxima da tela.

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { continentes, type Continente, type Pais } from "@/content/destinos";
import { Icon } from "@/components/ui/Icon";
import { WhatsappIcon } from "@/components/ui/WhatsappIcon";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { subscribe } from "@/lib/motion/ticker";
import { getTier } from "@/lib/motion/tier";
import type { GlobeScene } from "@/lib/three/GlobeScene";

type Status = "idle" | "loading" | "live" | "failed";

/** Quantos países do continente aparecem com foto; os outros, só pelo nome. */
const COM_FOTO = 5;

function Tile({ p, big }: { p: Pais; big: boolean }) {
  return (
    <figure className={`relative m-0 overflow-clip bg-graphite ${big ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}>
      <Image
        src={p.foto}
        alt={`${p.lugar}, ${p.nome}`}
        fill
        sizes={big ? "(min-width: 1100px) 38vw, 92vw" : "(min-width: 1100px) 19vw, 46vw"}
        className="photo-content object-cover"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_11_12/0)_35%,rgb(11_11_12/.9)_100%)]"
        aria-hidden="true"
      />
      <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3">
        <span className={`font-display leading-none font-medium text-paper ${big ? "text-[28px]" : "text-[20px]"}`}>{p.nome}</span>
        <span className="text-[12px] leading-[1.35] text-gray-200">{p.lugar}</span>
        <a
          href={p.credito.fonte}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 truncate text-[9px] leading-none text-white/60 hover:text-white"
        >
          Foto: {p.credito.autor}, {p.credito.licenca}, Wikimedia Commons
        </a>
      </figcaption>
    </figure>
  );
}

export function GlobeExplorer() {
  const { destinos: copy } = site;
  const boxRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<GlobeScene | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [selected, setSelected] = useState<Continente | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const select = useCallback((id: string, fromGlobe = false) => {
    setSelected(continentes.find((x) => x.id === id) ?? null);
    sceneRef.current?.setSelected(id);
    if (!fromGlobe) sceneRef.current?.focus(id);
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let cancelled = false;
    let scene: GlobeScene | null = null;
    let canvas: HTMLCanvasElement | null = null;
    const offs: Array<() => void> = [];

    const start = async () => {
      setStatus("loading");
      try {
        const [{ GlobeScene }, data] = await Promise.all([
          import("@/lib/three/GlobeScene"),
          fetch("/data/globo.json").then((r) => {
            if (!r.ok) throw new Error("globo.json");
            return r.json();
          }),
        ]);
        if (cancelled) return;
        // Canvas criado aqui (e não por ref do React): o StrictMode remonta o efeito
        // e um canvas reaproveitado devolveria um contexto WebGL já perdido.
        canvas = document.createElement("canvas");
        canvas.className = "globe-canvas absolute inset-0 h-full w-full touch-pan-y";
        canvas.setAttribute("aria-hidden", "true");
        box.append(canvas);
        scene = new GlobeScene({
          canvas,
          data,
          regions: continentes.map(({ id, lat, lon }) => ({ id, lat, lon })),
          markers: continentes.flatMap((c) => c.paises.map(({ lat, lon }) => ({ lat, lon, region: c.id }))),
          reduced: getTier() === "off",
          mobile: window.innerWidth < 700,
          onHover: (id) => setHovered(id),
          onSelect: (id) => select(id, true),
        });
        sceneRef.current = scene;
        canvas.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          setStatus("failed");
        });

        const ro = new ResizeObserver(() => scene?.resize(box.clientWidth, box.clientHeight));
        ro.observe(box);
        scene.resize(box.clientWidth, box.clientHeight);
        offs.push(() => ro.disconnect());

        // Só anima enquanto o globo está na tela.
        let unsub: (() => void) | null = null;
        const io = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) unsub ??= subscribe((dt) => scene?.update(dt));
          else {
            unsub?.();
            unsub = null;
          }
        });
        io.observe(box);
        offs.push(() => {
          io.disconnect();
          unsub?.();
        });
        scene.update(0);
        setStatus("live");
      } catch {
        if (!cancelled) setStatus("failed");
      }
    };

    // Baixa perto de entrar na tela
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        void start();
      },
      { rootMargin: "600px 0px" },
    );
    near.observe(box);

    return () => {
      cancelled = true;
      near.disconnect();
      offs.forEach((off) => off());
      scene?.destroy();
      sceneRef.current = null;
      canvas?.remove();
    };
  }, [select]);

  const hoverName = hovered ? continentes.find((c) => c.id === hovered)?.nome : null;

  return (
    <div className="mt-[clamp(48px,6vw,88px)] flex flex-col gap-[clamp(48px,6vw,80px)]">
      <div className="grid grid-cols-1 items-center gap-10 desk:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] desk:gap-[clamp(48px,6vw,104px)]">
        {/* Globo */}
        <div className="flex flex-col items-center gap-5">
          <div
            ref={boxRef}
            data-status={status}
            className="globe-box relative aspect-square w-full max-w-[680px] cursor-grab select-none active:cursor-grabbing"
          >
            {status !== "live" ? (
              <div
                className={`absolute inset-[6%] rounded-full border border-line-dark ${status === "failed" ? "" : "globe-wait"}`}
                aria-hidden="true"
              />
            ) : null}
            {/* Nome do país sob o mouse */}
            <span
              className={`pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 font-display text-[22px] leading-none font-medium text-paper transition-opacity duration-[var(--dur-fast)] ${hoverName ? "opacity-100" : "opacity-0"}`}
              aria-hidden="true"
            >
              {hoverName ?? ""}
            </span>
          </div>
          <p className="m-0 text-[13px] leading-[1.4] text-gray-500">
            {status === "failed" ? copy.vazio : copy.dica}
          </p>
        </div>

        {/* Painel do país */}
        <div className="min-h-[420px]" aria-live="polite">
          {selected ? (
            <article key={selected.id} className="globe-panel flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <span className="label flex items-center gap-3 text-gray-400">
                  <span className="label-line" aria-hidden="true" />
                  {copy.rotuloGaleria}
                </span>
                <h3 className="m-0 font-display text-[clamp(40px,4vw,60px)] leading-[0.95] font-medium">{selected.nome}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {selected.paises.slice(0, COM_FOTO).map((p, i) => (
                  <Tile key={p.iso} p={p} big={i === 0} />
                ))}
              </div>
              <div className="flex flex-col gap-2 text-[15px] leading-[1.5]">
                {selected.paises.length > COM_FOTO ? (
                  <p className="m-0 text-gray-200">
                    {copy.tambem}: {selected.paises.slice(COM_FOTO).map((p) => p.nome).join(", ")}.
                  </p>
                ) : null}
                <p className="m-0 text-gray-400">{copy.outros}</p>
              </div>
              <WhatsAppLink
                event="whatsapp_click_destinos"
                mensagem={copy.mensagem(selected.viagem)}
                className="btn btn-primary w-full tab:w-auto tab:self-start"
              >
                <span className="btn-content">
                  <WhatsappIcon className="btn-wa h-5 w-5" />
                  {selected.cta}
                  <Icon name="arrow" size={18} className="btn-arrow" />
                </span>
              </WhatsAppLink>
            </article>
          ) : (
            <div className="flex h-full min-h-[420px] flex-col justify-center gap-4 border-y border-line-dark py-10">
              <Icon name="plane" size={28} className="text-red" style={{ transform: "rotate(45deg)" }} />
              <p className="m-0 max-w-[18ch] font-display text-[clamp(32px,3vw,44px)] leading-[1.05] font-medium">
                {copy.vazio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Índice por continente: o mesmo clique, sem precisar do globo */}
      <nav aria-label="Continentes do globo" className="grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line-dark pt-8 tab:grid-cols-3 desk:grid-cols-6">
        {continentes.map((c) => {
          const on = selected?.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => select(c.id)}
              className="globe-pick group flex cursor-pointer flex-col items-start gap-2 text-left"
            >
              <span
                className={`border-b pb-0.5 font-display text-[24px] leading-[1.05] font-medium transition-colors duration-[var(--dur-fast)] ${
                  on ? "border-red text-paper" : "border-transparent text-gray-200"
                }`}
              >
                {c.nome}
              </span>
              <span className="text-[13px] leading-[1.45] text-gray-500">{c.paises.map((p) => p.nome).join(", ")}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
