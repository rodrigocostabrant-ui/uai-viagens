import { site, whatsappHref } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center pt-[68px]">
      <Container>
        <div className="max-w-[760px]">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-(--color-accent) mb-6">
            {site.hero.eyebrow}
          </p>

          <h1 className="text-[34px] md:text-[60px] font-semibold leading-[1.05] text-(--color-text) text-balance">
            {site.hero.titulo}
          </h1>

          <p className="mt-6 max-w-[560px] text-[17px] md:text-xl leading-[1.55] text-(--color-text-muted)">
            {site.hero.subtitulo}
          </p>

          <div className="mt-10 flex flex-col items-start gap-4">
            <Button
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="whatsapp_click_hero"
            >
              {site.cta.principal}
            </Button>
            <p className="text-sm text-(--color-text-muted)">{site.hero.reducaoDeAtrito}</p>
          </div>

          <p className="mt-16 text-sm tracking-wide text-(--color-text-muted) border-t border-(--color-border) pt-6">
            {site.hero.credibilidade}
          </p>
        </div>
      </Container>
    </section>
  );
}
