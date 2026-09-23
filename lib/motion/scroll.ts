// Um único listener de scroll (passivo), agrupado por rAF. Exposto como store
// para useSyncExternalStore: só notifica quando um valor derivado muda.

export type ScrollState = {
  solid: boolean;
  floatVisible: boolean;
  y: number;
};

const SERVER_STATE: ScrollState = { solid: false, floatVisible: false, y: 0 };

let state: ScrollState = SERVER_STATE;
const listeners = new Set<() => void>();
const frameListeners = new Set<(y: number) => void>();
let raf = 0;
let attached = false;

function compute() {
  raf = 0;
  const y = window.scrollY;
  const vh = window.innerHeight;
  const end = document.getElementById("cta-final");
  const endTop = end ? end.getBoundingClientRect().top : Infinity;
  const solid = y > 40;
  const floatVisible = y > vh * 0.75 && endTop > vh * 0.55;
  for (const fn of frameListeners) fn(y);
  if (solid !== state.solid || floatVisible !== state.floatVisible) {
    state = { solid, floatVisible, y };
    for (const fn of listeners) fn();
  }
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(compute);
}

function attach() {
  if (attached) return;
  attached = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  compute();
}

function detachIfIdle() {
  if (!attached || listeners.size || frameListeners.size) return;
  attached = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  cancelAnimationFrame(raf);
  raf = 0;
}

export function subscribeScroll(fn: () => void) {
  listeners.add(fn);
  attach();
  return () => {
    listeners.delete(fn);
    detachIfIdle();
  };
}

/** Chamado a cada frame com scroll (sem comparar estado): uso interno do motion. */
export function onScrollFrame(fn: (y: number) => void) {
  frameListeners.add(fn);
  attach();
  return () => {
    frameListeners.delete(fn);
    detachIfIdle();
  };
}

export const getScrollState = () => state;
export const getServerScrollState = () => SERVER_STATE;
