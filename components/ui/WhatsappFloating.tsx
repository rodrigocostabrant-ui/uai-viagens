"use client";

import { useEffect, useState } from "react";
import { whatsappHref } from "@/content/site";
import { WhatsappIcon } from "@/components/ui/WhatsappIcon";

export function WhatsappFloating() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics="whatsapp_click_floating"
      aria-label="Conversar no WhatsApp com a UAI Viagens"
      className={`fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-accent) text-(--color-accent-fg) shadow-(--shadow-md) transition-all duration-(--dur) ease-(--ease) hover:bg-(--color-accent-hover) md:bottom-8 md:right-8 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <WhatsappIcon className="h-7 w-7" />
    </a>
  );
}
