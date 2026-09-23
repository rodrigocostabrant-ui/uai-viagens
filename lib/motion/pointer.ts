// Um único pointermove passivo (só é ligado no tier full). Os consumidores
// leem a posição no ticker, em vez de cada um ter seu próprio listener.

export const pointer = {
  x: 0, // px, viewport
  y: 0,
  nx: 0, // -1..1
  ny: 0,
  active: false,
};

let users = 0;

function onMove(e: PointerEvent) {
  if (e.pointerType !== "mouse") return;
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.ny = (e.clientY / window.innerHeight) * 2 - 1;
  pointer.active = true;
}

function onLeave() {
  pointer.active = false;
}

export function trackPointer() {
  if (users++ === 0) {
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
  }
  return () => {
    if (--users === 0) {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      pointer.active = false;
    }
  };
}
