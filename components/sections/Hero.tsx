import { site } from "@/content/site";
import { DepthPhoto } from "@/components/media/DepthPhoto";
import { CtaButton } from "@/components/ui/Button";
import { TrustChip } from "@/components/ui/TrustChip";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  const { hero } = site;
  return (
    <section
      id="topo"
      aria-label="Início"
      className="hero relative flex min-h-[max(720px,100svh)] flex-col justify-end overflow-clip bg-ink text-paper"
    >
      <DepthPhoto
        variant="hero"
        src={hero.imagem.src}
        depthSrc={hero.imagem.profundidade}
        alt={hero.imagem.alt}
        horizon={0.525}
        sizes="(orientation: portrait) 160vw, 100vw"
      />

      <div className="hero-content container-uai relative pt-40">
        <div data-load="" style={d(100)} className="label mb-8 flex items-center gap-3 text-gray-200">
          <span data-load="line" style={d(100)} className="label-line" aria-hidden="true" />
          {hero.rotulo}
        </div>

        <div className="lr-wrap">
          <h1 data-line-reveal="load" className="m-0 max-w-[16ch] font-display text-display-1 font-medium">
            {hero.titulo.antes}
            <span className="accent-text">{hero.titulo.destaque}</span>
            {hero.titulo.depois}
          </h1>
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
          <p data-load="" style={d(380)} className="m-0 max-w-[30ch] text-lead font-light text-gray-100">
            {hero.lead}
          </p>
          <div className="flex w-full flex-col items-start gap-[18px] tab:w-auto">
            <div data-load="" style={d(380)} className="w-full tab:w-auto">
              <CtaButton event="whatsapp_click_hero" magnetic />
            </div>
            <div data-load="" style={d(460)}>
              <TrustChip linha1={site.selo.hero.linha1} linha2={site.selo.hero.linha2} />
            </div>
          </div>
        </div>

        <div className="relative mt-[clamp(56px,7vw,96px)] flex flex-wrap justify-between gap-x-8 gap-y-3 pt-[22px] pb-7">
          <span
            data-load="line"
            style={d(520)}
            className="absolute inset-x-0 top-0 h-px bg-[rgb(242_242_240/0.16)]"
            aria-hidden="true"
          />
          <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-2 p-0 text-[12px] font-medium uppercase leading-[1.4] tracking-[0.18em] text-gray-200">
            {hero.faixa.map((item, i) => (
              <li key={item} data-load="fade" style={d(560 + i * 60)}>
                {item}
              </li>
            ))}
          </ul>
          <span data-load="fade" style={d(800)} className="text-[13px] leading-[1.4] tracking-[0.04em] text-gray-400">
            {hero.atendimento}
          </span>
        </div>
      </div>
    </section>
  );
}
