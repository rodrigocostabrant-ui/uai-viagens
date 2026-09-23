"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { site } from "@/content/site";
import { getScrollState, getServerScrollState, subscribeScroll } from "@/lib/motion/scroll";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { WhatsappIcon } from "@/components/ui/WhatsappIcon";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { TrustChip } from "@/components/ui/TrustChip";

export function Header() {
  const { solid } = useSyncExternalStore(subscribeScroll, getScrollState, getServerScrollState);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Scrollspy: o link da seção que ocupa o meio da tela fica marcado.
  useEffect(() => {
    const sections = site.nav
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = `#${entry.target.id}`;
          if (entry.isIntersecting) setActive(id);
          else setActive((prev) => (prev === id ? null : prev));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Menu aberto: trava o scroll, Esc fecha, o foco entra e depois volta ao botão.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  // O botão flutuante some com o menu aberto.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", open);
  }, [open]);

  const bar = solid || open;

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-(--dur-ui) ease-out"
      style={{
        backgroundColor: bar ? "rgb(11 11 12 / 0.96)" : "transparent",
        borderColor: bar ? "var(--color-line-dark)" : "transparent",
      }}
    >
      <div
        data-load="down"
        className={`container-uai flex items-center justify-between gap-6 h-16 transition-[height] duration-(--dur-ui) ease-out ${
          solid ? "desk:h-[72px]" : "desk:h-24"
        }`}
      >
        <a href="#topo" aria-label={site.menu.voltarAoTopo} className="flex flex-none">
          <Logo
            className={`header-logo h-10 w-auto text-silver-300 desk:h-14 ${solid ? "desk:scale-[0.786]" : ""}`}
          />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-10 desk:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "location" : undefined}
              className="nav-link label tracking-[0.2em]"
            >
              {item.label}
            </a>
          ))}
          <WhatsAppLink event="whatsapp_click_header" className="btn-ghost">
            <WhatsappIcon className="h-4 w-4" />
            {site.cta.principal}
          </WhatsAppLink>
        </nav>

        <div className="flex items-center gap-2 desk:hidden">
          <WhatsAppLink
            event="whatsapp_click_header_icon"
            aria-label={site.cta.ariaIcone}
            className="btn-icon btn-icon-silver"
          >
            <WhatsappIcon className="h-5 w-5" />
          </WhatsAppLink>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? site.menu.fechar : site.menu.abrir}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="btn-icon btn-icon-outline"
          >
            <Icon name={open ? "x" : "menu"} size={20} />
          </button>
        </div>
      </div>

      <nav
        id="menu-mobile"
        aria-label="Menu"
        data-open={open}
        inert={!open}
        className="menu-panel fixed inset-x-0 bottom-0 top-16 flex flex-col justify-between border-t border-line-dark bg-ink px-5 pt-6 pb-8 desk:hidden"
      >
        <div className="flex flex-col">
          {site.nav.map((item, i) => (
            <a
              key={item.href}
              ref={i === 0 ? firstLinkRef : undefined}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ "--i": i } as React.CSSProperties}
              className="menu-item flex items-center justify-between border-b border-line-dark py-5 font-display text-[40px] font-medium leading-none text-paper"
            >
              {item.label}
              <Icon name="arrow" size={20} className="text-gray-600" />
            </a>
          ))}
        </div>
        <div className="menu-item flex flex-col gap-4" style={{ "--i": site.nav.length } as React.CSSProperties}>
          <TrustChip variant="menu" linha1={site.selo.menu.linha1} linha2={site.selo.menu.linha2} />
          <WhatsAppLink
            event="whatsapp_click_header_menu"
            className="flex h-14 items-center justify-center gap-3 rounded-[2px] font-semibold text-ink"
            style={{ background: "var(--silver-icon)" }}
          >
            <WhatsappIcon className="h-5 w-5" />
            {site.cta.principal}
          </WhatsAppLink>
        </div>
      </nav>
    </header>
  );
}
