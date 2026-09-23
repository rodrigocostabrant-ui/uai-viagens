import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function Situacao() {
  return (
    <section className="bg-(--color-bg-subtle) py-16 md:py-28">
      <Container>
        <Reveal>
          <Eyebrow>{site.situacao.eyebrow}</Eyebrow>
          <h2 className="text-[26px] md:text-4xl font-semibold leading-[1.15] max-w-[640px] text-(--color-text)">
            {site.situacao.titulo}
          </h2>
        </Reveal>

        <ul className="mt-10 md:mt-14 grid gap-5 md:grid-cols-2 md:gap-8">
          {site.situacao.itens.map((item, i) => (
            <Reveal
              key={item}
              index={i}
              as="li"
              className="text-[17px] leading-[1.55] text-(--color-text-muted) border-l-2 border-(--color-border) pl-5"
            >
              {item}
            </Reveal>
          ))}
        </ul>

        <Reveal index={4}>
          <p className="mt-10 md:mt-14 text-lg font-medium text-(--color-text)">
            {site.situacao.transicao}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
