import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function Servicos() {
  return (
    <section id="servicos" className="py-16 md:py-28">
      <Container>
        <Reveal>
          <Eyebrow>{site.servicos.eyebrow}</Eyebrow>
          <h2 className="text-[26px] md:text-4xl font-semibold leading-[1.15] max-w-[640px] text-(--color-text)">
            {site.servicos.titulo}
          </h2>
        </Reveal>

        <div className="mt-10 md:mt-14 grid gap-5 sm:grid-cols-2">
          {site.servicos.itens.map((item, i) => (
            <Reveal key={item.titulo} index={i}>
              <div className="h-full border border-(--color-border) rounded-(--radius-lg) p-6 md:p-8">
                <span className="font-display text-2xl text-(--color-accent)">{item.numero}</span>
                <h3 className="mt-4 text-lg font-semibold text-(--color-text)">{item.titulo}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-(--color-text-muted)">
                  {item.descricao}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
