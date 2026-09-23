import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { WhatsappIcon } from "@/components/ui/WhatsappIcon";
import { WhatsAppLink, type WhatsAppEvent } from "@/components/ui/WhatsAppLink";

/**
 * CTA principal ("Quero planejar minha viagem").
 * silver: fundo escuro · ink: seção clara · lg: CTA final.
 * magnetic: só hero e CTA final (o wrapper sem transform é o que se mede).
 */
export function CtaButton({
  event,
  variant = "silver",
  size = "md",
  magnetic = false,
  stretch = false,
  className = "",
}: {
  event: WhatsAppEvent;
  variant?: "silver" | "ink";
  size?: "md" | "lg";
  magnetic?: boolean;
  /** Ocupa a largura toda da coluna também no desktop (como em "Quem cuida" na v2). */
  stretch?: boolean;
  className?: string;
}) {
  const lg = size === "lg";
  const link = (
    <WhatsAppLink
      event={event}
      data-magnetic-target={magnetic ? "" : undefined}
      className={`btn ${variant === "silver" ? "btn-silver" : "btn-ink"} ${lg ? "btn-lg" : ""} w-full ${stretch ? "" : "tab:w-auto"} ${magnetic ? "" : className}`}
    >
      <span className="btn-content">
        <WhatsappIcon className={`${lg ? "h-[22px] w-[22px]" : "h-5 w-5"} btn-wa`} />
        {site.cta.principal}
        <Icon name="arrow" size={lg ? 20 : 18} className="btn-arrow" />
      </span>
    </WhatsAppLink>
  );
  if (!magnetic) return link;
  return (
    <span data-magnetic="" className={`flex w-full tab:inline-flex tab:w-auto ${className}`}>
      {link}
    </span>
  );
}
