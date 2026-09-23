import { site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

const colLabel = "text-[11px] font-medium uppercase leading-none tracking-[0.22em] text-gray-500";
const linkText = "text-link text-[17px] font-medium leading-[1.3] text-paper";

export function Footer() {
  const { footer: f } = site;
  return (
    <footer className="bg-graphite pt-[72px] pb-24 text-gray-400 tab:pb-8">
      <div className="container-uai flex flex-col gap-14">
        <div data-reveal="fade" className="flex flex-wrap items-start justify-between gap-12">
          <Logo title={site.nome} className="h-[76px] w-auto text-silver-300" />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,auto))] gap-x-[72px] gap-y-8">
            <div className="flex flex-col gap-3">
              <span className={colLabel}>{f.whatsapp}</span>
              <WhatsAppLink event="whatsapp_click_footer" className={linkText}>
                {site.whatsappDisplay}
              </WhatsAppLink>
            </div>
            <div className="flex flex-col gap-3">
              <span className={colLabel}>{f.instagram}</span>
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className={linkText}>
                {site.instagramHandle}
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className={colLabel}>{f.atendimento}</span>
              <span className="text-[17px] leading-[1.45] text-paper">
                {f.atendimentoLinhas[0]}
                <br />
                {f.atendimentoLinhas[1]}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-footer-line pt-6 text-[13px] leading-[1.5]">
          <span>
            {site.nome} · {f.cnpjPrefixo} {site.cnpj}
          </span>
          <span>
            © {f.ano} {site.nome}
          </span>
        </div>
      </div>
    </footer>
  );
}
