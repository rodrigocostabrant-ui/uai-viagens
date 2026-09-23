// Um IntersectionObserver para todos os reveals da página. Marca data-revealed
// uma única vez; a animação em si é CSS (globals.css > "Reveals").
// Atenção: o alvo observado nunca pode estar escondido por clip-path (o Chrome o
// considera invisível e o reveal nunca dispara) — use um contêiner como gatilho.

type Callback = (el: Element) => void;

const callbacks = new Map<Element, Set<Callback>>();
let io: IntersectionObserver | null = null;

function getObserver() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          el.setAttribute("data-revealed", "");
          callbacks.get(el)?.forEach((fn) => fn(el));
          callbacks.delete(el);
          io?.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
  }
  return io;
}

/** Observa `el`; quando entra na tela, marca data-revealed e chama `onReveal`. */
export function observeReveal(el: Element, onReveal?: Callback) {
  if (el.hasAttribute("data-revealed")) {
    onReveal?.(el);
    return () => {};
  }
  let set = callbacks.get(el);
  if (!set) {
    set = new Set();
    callbacks.set(el, set);
    getObserver().observe(el);
  }
  if (onReveal) set.add(onReveal);
  return () => {
    const current = callbacks.get(el);
    if (!current) return;
    if (onReveal) current.delete(onReveal);
    if (current.size === 0) {
      callbacks.delete(el);
      io?.unobserve(el);
    }
  };
}
