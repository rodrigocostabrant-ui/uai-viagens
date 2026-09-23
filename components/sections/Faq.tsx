import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function Faq() {
  return (
    <section id="faq" className="py-16 md:py-28">
      <Container>
        <Reveal>
          <Eyebrow>{site.faq.eyebrow}</Eyebrow>
          <h2 className="text-[26px] md:text-4xl font-semibold leading-[1.15] text-(--color-text)">
            {site.faq.titulo}
          </h2>
        </Reveal>

        <div className="mt-10 md:mt-14 max-w-[720px] divide-y divide-(--color-border) border-t border-b border-(--color-border)">
          {site.faq.itens.map((item, i) => (
            <Reveal key={item.pergunta} index={i}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium text-(--color-text) marker:content-none">
                  {item.pergunta}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-(--color-accent) text-xl leading-none transition-transform duration-(--dur) ease-(--ease) group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[640px] text-[15px] leading-[1.65] text-(--color-text-muted)">
                  {item.resposta}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
