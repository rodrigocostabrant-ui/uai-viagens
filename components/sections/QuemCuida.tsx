import Image from "next/image";
import { site } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CtaButton } from "@/components/ui/Button";

const rd = (ms: number) => ({ "--rd": `${ms}ms` }) as React.CSSProperties;

export function QuemCuida() {
  const { quemCuida: q } = site;
  const [principal, secundaria] = q.fotos;
  return (
    <section id="quem-cuida" className="section-y bg-ink text-paper">
      <div className="container-uai grid grid-cols-1 items-center gap-x-[clamp(48px,6vw,104px)] gap-y-16 desk:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-4">
          <div className="dip grid grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)] items-end gap-4">
            <div data-reveal="clip" className="relative aspect-[4/5] overflow-clip bg-graphite">
              <div data-reveal-media="" className="absolute inset-0">
                <Image
                  src={principal.src}
                  alt={principal.alt}
                  fill
                  sizes="(min-width: 1100px) 36vw, 60vw"
                  className="photo-portrait object-cover"
                  style={{ objectPosition: principal.posicao }}
                />
              </div>
            </div>
            <div className="dip-par mb-10 tab:mb-24" style={{ "--par": "24px" } as React.CSSProperties}>
              <div data-reveal="clip" style={rd(150)} className="relative aspect-[3/4] overflow-clip bg-graphite">
                <div data-reveal-media="" className="absolute inset-0">
                  <Image
                    src={secundaria.src}
                    alt={secundaria.alt}
                    fill
                    sizes="(min-width: 1100px) 22vw, 38vw"
                    className="photo-portrait object-cover"
                    style={{ objectPosition: secundaria.posicao }}
                  />
                </div>
              </div>
            </div>
          </div>
          <span data-reveal="fade" className="label leading-[1.4] tracking-[0.2em] text-gray-400">
            {q.legenda}
          </span>
        </div>

        <div className="flex flex-col gap-8">
          <div data-reveal="up" className="flex flex-col gap-7">
            <SectionLabel>{q.rotulo}</SectionLabel>
            <h2 className="m-0 font-display text-display-about font-medium">
              {q.titulo.principal} <span className="text-gray-500">{q.titulo.destaque}</span>
            </h2>
            <p className="m-0 max-w-[40ch] text-lead-sm font-light text-gray-200">{q.corpo}</p>
          </div>

          <ul className="m-0 flex list-none flex-col border-t border-line-dark p-0">
            {q.diferenciais.map((item, i) => (
              <li
                key={item.titulo}
                data-reveal="up"
                style={rd(120 + i * 80)}
                className="relative grid grid-cols-1 gap-x-6 gap-y-1.5 py-5 tab:grid-cols-[minmax(0,190px)_minmax(0,1fr)]"
              >
                <span className="font-display text-[24px] font-medium leading-[1.1]">{item.titulo}</span>
                <span className="text-[16px] leading-[1.55] text-gray-400">{item.texto}</span>
                <span
                  data-reveal="line"
                  style={rd(200 + i * 80)}
                  className="absolute inset-x-0 bottom-0 h-px bg-line-dark"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>

          <div data-reveal="up" style={rd(200)}>
            <CtaButton event="whatsapp_click_quem_cuida" stretch />
          </div>
        </div>
      </div>
    </section>
  );
}
