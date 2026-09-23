import { site, whatsappHref } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CtaFinal() {
  return (
    <section className="bg-(--color-accent) py-16 md:py-24">
      <Container>
        <Reveal className="max-w-[640px]">
          <h2 className="text-[26px] md:text-4xl font-semibold leading-[1.15] text-(--color-accent-fg)">
            {site.ctaFinal.titulo}
          </h2>
          <p className="mt-4 text-[17px] leading-[1.55] text-(--color-accent-fg)/85">
            {site.ctaFinal.corpo}
          </p>

          <div className="mt-8 flex flex-col items-start gap-4">
            <Button
              variant="inverse"
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="whatsapp_click_final_cta"
            >
              {site.cta.principal}
            </Button>
            <p className="text-sm text-(--color-accent-fg)/85">{site.ctaFinal.reducaoDeAtrito}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
