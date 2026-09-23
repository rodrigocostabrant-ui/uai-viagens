import Image from "next/image";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function Sobre() {
  return (
    <section id="sobre" className="py-16 md:py-28">
      <Container>
        <div className="grid gap-10 md:grid-cols-12 md:gap-12 items-center">
          <Reveal className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-(--radius-lg) bg-(--color-bg-subtle)">
              <Image
                src={site.sobre.imagem}
                alt="Otávio, da UAI Viagens"
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal index={1} className="md:col-span-7">
            <Eyebrow>{site.sobre.eyebrow}</Eyebrow>
            <h2 className="text-[26px] md:text-4xl font-semibold leading-[1.15] text-(--color-text)">
              {site.sobre.titulo}
            </h2>
            <p className="mt-5 max-w-[560px] text-[17px] leading-[1.6] text-(--color-text-muted)">
              {site.sobre.corpo}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
