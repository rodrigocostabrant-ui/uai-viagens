"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";
import { getScrollState, getServerScrollState, subscribeScroll } from "@/lib/motion/scroll";
import { WhatsappIcon } from "@/components/ui/WhatsappIcon";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/**
 * CTA flutuante: aparece depois de 75% do hero e some quando o CTA final
 * chega a 55% da tela (regra da v2). Oculto, fica inert (fora do Tab e do leitor).
 */
export function WhatsappFloating() {
  const { floatVisible } = useSyncExternalStore(subscribeScroll, getScrollState, getServerScrollState);
  return (
    <WhatsAppLink
      event="whatsapp_click_floating"
      aria-label={site.cta.ariaIcone}
      data-visible={floatVisible}
      inert={!floatVisible}
      className="float-cta btn-silver fixed right-3 bottom-3 left-3 z-50 flex h-14 items-center justify-center gap-3 rounded-[2px] px-6 text-[15px] font-semibold text-ink tab:right-7 tab:bottom-7 tab:left-auto"
      style={{ boxShadow: "var(--shadow-float)" }}
    >
      <WhatsappIcon className="h-5 w-5" />
      <span>{site.cta.principal}</span>
    </WhatsAppLink>
  );
}
