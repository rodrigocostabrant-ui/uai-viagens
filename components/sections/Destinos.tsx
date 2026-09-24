import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GlobeExplorer } from "@/components/media/GlobeExplorer";

const rd = (ms: number) => ({ "--rd": `${ms}ms` }) as React.CSSProperties;

export function Destinos() {
  const { destinos: d } = site;
  return (
    <section id="destinos" className="section-y overflow-clip bg-ink text-paper">
      <Container>
        <div className="grid grid-cols-1 items-end gap-x-6 gap-y-8 desk:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div data-reveal="up" className="flex flex-col gap-7">
            <SectionLabel>{d.rotulo}</SectionLabel>
            <h2 className="m-0 font-display text-display-2 font-medium">
              {d.titulo.principal} <span className="text-gray-500">{d.titulo.destaque}</span>
            </h2>
          </div>
          <p data-reveal="up" style={rd(120)} className="m-0 max-w-[36ch] text-lead-sm font-light text-gray-200">
            {d.lead}
          </p>
        </div>
        <GlobeExplorer />
      </Container>
    </section>
  );
}
