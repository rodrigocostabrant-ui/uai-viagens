"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * Escuta clique em qualquer elemento com `data-analytics="evento_nome"` e envia
 * como evento customizado ao Vercel Analytics. Delegado no document para cobrir
 * os CTAs de WhatsApp espalhados pelas secoes sem precisar tornar cada uma client.
 */
export function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-analytics]");
      if (!target) return;
      const event = target.dataset.analytics;
      if (event) track(event);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
