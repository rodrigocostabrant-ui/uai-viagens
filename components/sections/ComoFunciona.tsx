import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CtaButton } from "@/components/ui/Button";
import { Route } from "@/components/ui/Route";
import { Timeline } from "@/components/ui/Timeline";

// Com motion (html.m-on): linha do tempo presa na tela, guiada pelo scroll.
// Sem JS, com reduced motion ou se o GSAP falhar: a rota estática da v2.
export function ComoFunciona() {
  const { comoFunciona: c } = site;
  return (
    <section id="como-funciona" data-light="" className="overflow-clip bg-paper text-ink">
      <div className="cf-pinned">
        <Timeline />
      </div>

      <div className="cf-static section-y pb-0">
        <Container>
          <div data-reveal="up" className="flex flex-col gap-7">
            <SectionLabel tone="light">{c.rotulo}</SectionLabel>
            <h2 className="m-0 font-display text-display-2 font-medium">
              {c.titulo.principal} <span className="text-gray-600">{c.titulo.destaque}</span>
            </h2>
          </div>
          <Route />
        </Container>
      </div>

      <Container className="pb-[clamp(96px,12vw,176px)]">
        <div
          data-reveal="up"
          className="cf-close flex flex-wrap items-center justify-between gap-6 border-t border-line-light pt-8"
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
