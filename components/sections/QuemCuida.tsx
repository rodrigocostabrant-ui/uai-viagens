import fs from "node:fs";
import path from "node:path";
import { site } from "@/content/site";
import { PhotoMarquee, type MarqueePhoto } from "@/components/ui/PhotoMarquee";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CtaButton } from "@/components/ui/Button";

const rd = (ms: number) => ({ "--rd": `${ms}ms` }) as React.CSSProperties;

/** Fotos fixas do site + tudo o que estiver em public/images/otavio/ (lido no build). */
function fotos(): MarqueePhoto[] {
  const base = site.quemCuida.fotos.map((f) => ({ src: f.src, title: f.titulo, alt: f.alt, position: f.posicao }));
  const dir = path.join(process.cwd(), "public", "images", "otavio");
  if (!fs.existsSync(dir)) return base;
  const extra = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }))
    .map((file) => {
      const title = file.replace(/\.[^.]+$/, "").replace(/^\d+[\s._-]*/, "").trim() || "Otávio";
      return { src: `/images/otavio/${encodeURIComponent(file)}`, title, alt: `Otávio, ${title}` };
    });
  return [...base, ...extra];
}

export function QuemCuida() {
  const { quemCuida: q } = site;
  return (
    <section id="quem-cuida" className="section-y bg-ink text-paper">
      <div className="container-uai grid grid-cols-1 items-center gap-x-[clamp(48px,6vw,104px)] gap-y-16 desk:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div data-reveal="fade">
          <PhotoMarquee photos={fotos()} hint={q.faixa.dica} touchHint={q.faixa.dicaToque} />
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
