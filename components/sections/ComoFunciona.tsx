import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CtaButton } from "@/components/ui/Button";
import { Route } from "@/components/ui/Route";

export function ComoFunciona() {
  const { comoFunciona: c } = site;
  return (
    <section id="como-funciona" data-light="" className="section-y overflow-clip bg-paper text-ink">
      <Container>
        <div data-reveal="up" className="flex flex-col gap-7">
          <SectionLabel tone="light">{c.rotulo}</SectionLabel>
          <h2 className="m-0 font-display text-display-2 font-medium">
            {c.titulo.principal} <span className="text-gray-600">{c.titulo.destaque}</span>
          </h2>
        </div>

        <Route />

        <div
          data-reveal="up"
          className="mt-[clamp(72px,9vw,128px)] flex flex-wrap items-center justify-between gap-6 border-t border-line-light pt-8"
        >
          <p className="m-0 max-w-[22ch] font-display text-[clamp(28px,2.6vw,38px)] font-medium leading-[1.05]">
            {c.fechamento}
          </p>
          <CtaButton event="whatsapp_click_como_funciona" variant="ink" />
        </div>
      </Container>
    </section>
  );
}
