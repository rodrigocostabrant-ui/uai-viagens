import Image from "next/image";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Icon } from "@/components/ui/Icon";

const rd = (ms: number) => ({ "--rd": `${ms}ms` }) as React.CSSProperties;

// Deslocamentos aprovados (desktop 0/128/48/176, tablet 0/72) e a amplitude do parallax de cada coluna.
const OFFSETS = ["", "tab:pt-[72px] desk:pt-[128px]", "desk:pt-[48px]", "tab:pt-[72px] desk:pt-[176px]"];
const PARALLAX = ["24px", "40px", "28px", "48px"];

export function Servicos() {
  const { servicos: s } = site;
  return (
    <section id="servicos" className="section-y overflow-clip bg-ink text-paper">
      <Container>
        <div className="grid grid-cols-1 items-end gap-x-6 gap-y-8 desk:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div data-reveal="up" className="flex flex-col gap-7">
            <SectionLabel>{s.rotulo}</SectionLabel>
            <h2 className="m-0 font-display text-display-2 font-medium">
              {s.titulo.principal} <span className="text-gray-600">{s.titulo.destaque}</span>
            </h2>
          </div>
          <p data-reveal="up" style={rd(120)} className="m-0 max-w-[34ch] text-lead-sm font-light text-gray-400">
            {s.lead}
          </p>
        </div>

        <div
          data-reveal="strip"
          className="svc-strip svc-grid -mx-5 mt-[clamp(56px,7vw,104px)] grid snap-x snap-mandatory auto-cols-[78%] grid-flow-col items-start gap-[clamp(16px,1.8vw,28px)] overflow-x-auto scroll-px-5 px-5 [scrollbar-width:none] tab:mx-0 tab:auto-cols-auto tab:grid-flow-row tab:grid-cols-2 tab:overflow-visible tab:px-0 desk:grid-cols-4"
        >
          {s.itens.map((item, i) => (
            <figure key={item.titulo} className={`svc-figure m-0 snap-start ${OFFSETS[i]}`}>
              <div className="svc-par flex flex-col" style={{ "--par": PARALLAX[i] } as React.CSSProperties}>
                <div
                  data-reveal="clip"
                  data-follow=""
                  style={rd(i * 100)}
                  className="relative aspect-[4/5] overflow-clip bg-graphite"
                >
                  <div data-reveal-media="" className="absolute inset-0">
                    <Image
                      src={item.imagem}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1100px) 25vw, (min-width: 700px) 50vw, 78vw"
                      className="svc-img photo-content object-cover"
                      style={{ objectPosition: item.posicao }}
                    />
                  </div>
                </div>
                <figcaption className="svc-caption mt-5 flex flex-col gap-2.5 border-t border-line-dark pt-[18px]">
                  <span className="font-display text-[clamp(24px,2vw,30px)] font-medium leading-[1.05]">{item.titulo}</span>
                  <span className="text-[15px] leading-[1.55] text-gray-400">{item.texto}</span>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        <div data-reveal="fade" className="label mt-6 flex items-center gap-2.5 tracking-[0.2em] text-gray-400 tab:hidden">
          {s.dicaMobile}
          <Icon name="arrow" size={16} className="nudge" />
        </div>
      </Container>
    </section>
  );
}
