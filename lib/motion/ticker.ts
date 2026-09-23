// Um único requestAnimationFrame para a página inteira. Para sozinho quando
// ninguém está inscrito ou quando a aba fica oculta.

type Tick = (dtSeconds: number, timeSeconds: number) => void;

const subscribers = new Set<Tick>();
let rafId = 0;
let last = 0;

function frame(now: number) {
  const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
  last = now;
  for (const fn of subscribers) fn(dt, now / 1000);
  rafId = subscribers.size && !document.hidden ? requestAnimationFrame(frame) : 0;
  if (!rafId) last = 0;
}

function start() {
  if (!rafId && subscribers.size && !document.hidden) rafId = requestAnimationFrame(frame);
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = 0;
      last = 0;
    } else start();
  });
}

export function subscribe(fn: Tick) {
  subscribers.add(fn);
  start();
  return () => {
    subscribers.delete(fn);
  };
}
