import { site, whatsappHref } from "@/content/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="bg-(--color-bg-subtle) border-t border-(--color-border) py-10">
      <Container className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-base font-semibold text-(--color-text)">{site.nome}</p>
          <p className="mt-1 text-sm text-(--color-text-muted)">CNPJ {site.cnpj}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-(--color-text-muted)">
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-(--color-text) transition-colors duration-(--dur)"
          >
            {site.instagramHandle}
          </a>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="whatsapp_click_footer"
            className="hover:text-(--color-text) transition-colors duration-(--dur)"
          >
            {site.whatsappDisplay}
          </a>
        </div>
      </Container>
    </footer>
  );
}
