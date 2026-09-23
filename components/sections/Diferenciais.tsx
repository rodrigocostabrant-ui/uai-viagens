import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function Diferenciais() {
  return (
    <section className="bg-(--color-bg-subtle) py-16 md:py-28">
      <Container>
        <Reveal>
          <Eyebrow>{site.diferenciais.eyebrow}</Eyebrow>
          <h2 className="text-[26px] md:text-4xl font-semibold leading-[1.15] max-w-[640px] text-(--color-text)">
            {site.diferenciais.titulo}
          </h2>
        </Reveal>

        <div className="mt-10 md:mt-14 grid gap-8 md:grid-cols-3">
          {site.diferenciais.itens.map((item, i) => (
            <Reveal key={item.titulo} index={i}>
              <h3 className="text-lg font-semibold text-(--color-text)">{item.titulo}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-(--color-text-muted)">
                {item.descricao}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
