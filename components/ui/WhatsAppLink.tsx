import type { AnchorHTMLAttributes } from "react";
import { whatsappHref } from "@/content/site";

export type WhatsAppEvent =
  | "whatsapp_click_header"
  | "whatsapp_click_header_icon"
  | "whatsapp_click_header_menu"
  | "whatsapp_click_hero"
  | "whatsapp_click_como_funciona"
  | "whatsapp_click_quem_cuida"
  | "whatsapp_click_final_cta"
  | "whatsapp_click_footer"
  | "whatsapp_click_floating";

/** Todo link de WhatsApp passa por aqui: o evento de analytics é obrigatório. */
export function WhatsAppLink({
  event,
  ...props
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & { event: WhatsAppEvent }) {
  return <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" data-analytics={event} {...props} />;
}
