"use client";

import { useEffect, useState } from "react";
import { site, whatsappHref } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsappIcon } from "@/components/ui/WhatsappIcon";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // trava o scroll do body com o drawer mobile aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[68px] transition-colors duration-(--dur) ease-(--ease) ${
        scrolled || open
          ? "bg-(--color-bg)/95 backdrop-blur border-b border-(--color-border)"
          : "bg-transparent"
      }`}
    >
      <Container className="flex h-full items-center justify-between">
        <a href="#" className="shrink-0 whitespace-nowrap font-display text-base md:text-lg font-semibold text-(--color-text)">
          {site.nome}
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-(--color-text-muted) hover:text-(--color-text) transition-colors duration-(--dur)"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="whatsapp_click_header"
            className="!h-10 !px-4 text-sm"
          >
            {site.cta.principal}
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="whatsapp_click_header"
            aria-label="Conversar no WhatsApp com a UAI Viagens"
            className="flex h-11 w-11 items-center justify-center rounded-(--radius-md) bg-(--color-accent) text-(--color-accent-fg)"
          >
            <WhatsappIcon className="h-5 w-5" />
          </a>

          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-(--radius-md) border border-(--color-border) text-(--color-text)"
          >
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 right-0 h-[1.5px] bg-current transition-transform duration-(--dur) ease-(--ease) ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-current transition-opacity duration-(--dur) ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 right-0 h-[1.5px] bg-current transition-transform duration-(--dur) ease-(--ease) ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </Container>

      <div
        id="menu-mobile"
        className={`md:hidden overflow-hidden bg-(--color-bg) border-b border-(--color-border) transition-[max-height,opacity] duration-300 ease-(--ease) ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Container className="flex flex-col gap-1 py-4">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 text-base text-(--color-text) border-b border-(--color-border) last:border-b-0"
            >
              {item.label}
            </a>
          ))}
          <Button
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="whatsapp_click_header_menu"
            className="mt-4 w-full"
          >
            {site.cta.principal}
          </Button>
        </Container>
      </div>
    </header>
  );
}
