import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Icon } from "@/components/ui/Icon";

const rd = (ms: number) => ({ "--rd": `${ms}ms` }) as React.CSSProperties;

function CornerMarks() {
  const pos = ["-top-2.5 -left-1.5", "-top-2.5 -right-1.5", "-bottom-2.5 -left-1.5", "-bottom-2.5 -right-1.5"];
  return (
    <>
      {pos.map((p) => (
        <span key={p} aria-hidden="true" className={`placeholder-mark ${p}`}>
          +
        </span>
      ))}
    </>
  );
}

/** Espaço reservado da v2 para depoimentos reais. Nunca preencher com texto inventado. */
function Depoimentos() {
  const { depoimentos: d } = site;
  return (
    <>
      <div data-reveal="up" className="mb-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <SectionLabel tone="light">{d.rotulo}</SectionLabel>
        <span className="inline-block max-w-full border border-dashed border-gray-500 px-3 py-[7px] text-[11px] font-medium uppercase leading-[1.4] tracking-[0.16em] text-gray-650">
          {d.aviso}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6 desk:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <figure
          data-reveal="up"
          className="placeholder-box m-0 flex min-h-[380px] flex-col justify-between gap-12 p-[clamp(28px,4vw,56px)]"
        >
          <CornerMarks />
          <div className="flex flex-col gap-2">
            <span aria-hidden="true" className="h-[60px] font-display text-[120px] font-medium leading-[0.7] text-quote">
              “
            </span>
            <blockquote className="m-0 max-w-[24ch] font-display text-[clamp(30px,3.2vw,48px)] leading-[1.1] text-gray-600 [text-wrap:balance]">
              {d.principal.citacao}
            </blockquote>
          </div>
          <figcaption className="flex items-center gap-3.5">
            <span aria-hidden="true" className="h-12 w-12 flex-none rounded-full border border-dashed border-gray-500" />
            <span className="text-[15px] leading-[1.4] text-gray-650">
              {d.principal.nome}
              <br />
              {d.principal.contexto}
            </span>
          </figcaption>
        </figure>
        <div className="grid grid-rows-2 gap-6">
          <div data-reveal="up" style={rd(100)} className="placeholder-box flex min-h-[178px] flex-col justify-between gap-6 p-7">
            <CornerMarks />
            <span className="font-display text-[24px] leading-[1.15] text-gray-600">{d.secundario.citacao}</span>
            <span className="text-[14px] leading-[1.4] text-gray-650">{d.secundario.atribuicao}</span>
          </div>
          <div
            data-reveal="up"
            style={rd(200)}
            className="placeholder-box flex min-h-[178px] flex-col items-start justify-center gap-3 p-7"
          >
            <CornerMarks />
            <Icon name="image" size={28} className="text-gray-600" />
            <span className="max-w-[28ch] text-[15px] leading-[1.45] text-gray-650">{d.midia}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export function Duvidas() {
  const { faq, depoimentos } = site;
  const mostrar = depoimentos.mostrarEspacoReservado;
  return (
    <section id="duvidas" data-light="" className="section-y bg-paper text-ink">
      <Container>
        {mostrar ? <Depoimentos /> : null}

        <div
          className={`grid grid-cols-1 items-start gap-x-6 gap-y-10 desk:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] ${
            mostrar ? "mt-[clamp(112px,12vw,176px)]" : ""
          }`}
        >
          <div data-reveal="up" className="flex flex-col gap-7 desk:sticky desk:top-[120px]">
            <SectionLabel tone="light">{faq.rotulo}</SectionLabel>
            <h2 className="m-0 font-display text-display-2 font-medium">{faq.titulo}</h2>
            <p className="m-0 max-w-[32ch] text-[16px] leading-[1.6] text-gray-700">{faq.intro}</p>
          </div>

          <div data-reveal="up" style={rd(100)} className="border-t border-ink">
            {faq.itens.map((item) => (
              <details key={item.pergunta} name="faq" className="faq-item border-b border-line-light">
                <summary className="flex w-full items-center justify-between gap-6 py-[26px] text-left">
                  <span className="faq-q text-[clamp(18px,1.5vw,21px)] font-medium leading-[1.35]">{item.pergunta}</span>
                  <span className="faq-icon flex h-9 w-9 flex-none items-center justify-center rounded-full" aria-hidden="true">
                    <Icon name="plus" size={16} />
                  </span>
                </summary>
                <p className="faq-a m-0 pr-16 pb-7 text-[17px] leading-[1.6] text-gray-700">{item.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
