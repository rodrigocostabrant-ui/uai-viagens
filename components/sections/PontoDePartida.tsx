import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

const rd = (ms: number) => ({ "--rd": `${ms}ms` }) as React.CSSProperties;

export function PontoDePartida() {
  const { pontoDePartida: p } = site;
  return (
    <section data-light="" className="section-y bg-paper text-ink">
      <Container>
        <div className="grid grid-cols-1 items-end gap-x-6 gap-y-10 desk:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <h2 data-reveal="up" className="m-0 font-display text-display-2 font-medium">
            {p.titulo.principal} <span className="text-gray-600">{p.titulo.destaque}</span>
          </h2>
          <p data-reveal="up" style={rd(120)} className="m-0 max-w-[34ch] text-lead font-light text-text-on-light">
            {p.lead}
          </p>
        </div>

        <div className="mt-[clamp(64px,8vw,120px)]">
          <SectionLabel tone="light" data-reveal="up" className="mb-6">
            {p.rotulo}
          </SectionLabel>
          <div className="relative">
          <span data-reveal="line" className="absolute inset-x-0 top-0 h-px bg-ink" aria-hidden="true" />
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] p-0">
            {p.itens.map((item, i) => (
              <li key={item.titulo} data-reveal="up" style={rd(i * 90)} className="flex flex-col gap-3 pt-7 pr-8">
                <span className="font-display text-[clamp(26px,2.2vw,32px)] font-medium leading-none">{item.titulo}</span>
                <p className="m-0 max-w-[30ch] text-[16px] leading-[1.6] text-gray-700">{item.texto}</p>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
