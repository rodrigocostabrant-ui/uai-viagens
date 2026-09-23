import { site } from "@/content/site";
import { DepthPhoto } from "@/components/media/DepthPhoto";
import { CtaButton } from "@/components/ui/Button";
import { TrustChip } from "@/components/ui/TrustChip";

export function CtaFinal() {
  const { ctaFinal: c } = site;
  return (
    <section
      id="cta-final"
      aria-label="Planejar minha viagem"
      className="cta-final relative flex min-h-[max(680px,92svh)] items-end overflow-clip bg-ink text-paper"
    >
      <DepthPhoto
        variant="cta"
        src={c.imagem.src}
        depthSrc={c.imagem.profundidade}
        alt={c.imagem.alt}
        horizon={0.4}
        sizes="(orientation: portrait) 160vw, 100vw"
      />
      <div className="container-uai relative grid grid-cols-1 items-end gap-x-6 gap-y-10 pt-40 pb-[clamp(72px,9vw,128px)] desk:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="lr-wrap">
          <h2 data-line-reveal="view" className="m-0 font-display text-display-cta font-medium [text-wrap:wrap]">
            {c.titulo.antes}
            <span className="silver-text">{c.titulo.destaque}</span>
          </h2>
        </div>
        <div data-reveal="up" style={{ "--rd": "150ms" } as React.CSSProperties} className="flex flex-col items-start gap-6">
          <p className="m-0 max-w-[30ch] text-lead font-light text-silver-100">{c.corpo}</p>
          <CtaButton event="whatsapp_click_final_cta" size="lg" magnetic />
          <TrustChip linha1={site.selo.ctaFinal.linha1} linha2={site.selo.ctaFinal.linha2} />
        </div>
      </div>
    </section>
  );
}
