import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-(--color-bg-subtle) py-16 md:py-28">
      <Container>
        <Reveal>
          <Eyebrow>{site.comoFunciona.eyebrow}</Eyebrow>
          <h2 className="text-[26px] md:text-4xl font-semibold leading-[1.15] text-(--color-text)">
            {site.comoFunciona.titulo}
          </h2>
        </Reveal>

        <ol className="mt-10 md:mt-16 grid gap-8 md:grid-cols-4 md:gap-6">
          {site.comoFunciona.etapas.map((etapa, i) => (
            <Reveal
              key={etapa.numero}
              index={i}
              as="li"
              className="relative pl-6 md:pl-0 border-l md:border-l-0 md:border-t border-(--color-border) md:pt-6"
            >
              <span className="font-display text-3xl text-(--color-accent)">{etapa.numero}</span>
              <h3 className="mt-3 text-base font-semibold text-(--color-text)">{etapa.titulo}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-(--color-text-muted)">
                {etapa.descricao}
              </p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
