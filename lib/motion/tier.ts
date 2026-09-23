// Tiers de motion, definidos em html[data-motion] antes do primeiro paint:
//   off  → prefers-reduced-motion: nada se desloca
//   css  → touch, conexão lenta ou aparelho fraco: coreografia CSS + drift CSS nas fotos
//   full → mouse + tela ≥ 1024px + aparelho capaz: CSS + Three.js no hero e no CTA final
// html.m-on marca que a coreografia pode esconder conteúdo antes de revelá-lo.

export type Tier = "off" | "css" | "full";

// deviceMemory/connection não existem no Safari e no Firefox: ausente conta como "permitido".
export const tierScript = `(function(){try{var d=document.documentElement,n=navigator,m=function(q){return matchMedia(q).matches},t;
if(m('(prefers-reduced-motion: reduce)'))t='off';else{var c=n.connection||{},slow=!!c.saveData||/2g|3g/.test(c.effectiveType||''),weak=(n.deviceMemory&&n.deviceMemory<4)||(n.hardwareConcurrency&&n.hardwareConcurrency<4),fine=m('(hover: hover) and (pointer: fine) and (min-width: 1024px)');t=(slow||weak||!fine)?'css':'full';}
d.setAttribute('data-motion',t);if(t!=='off')d.classList.add('m-on');
setTimeout(function(){if(!window.__uaiMotionReady){d.classList.remove('m-on');d.setAttribute('data-motion','off');}},4000);
function mark(){var w=document.querySelector('.hero-media');if(w)w.setAttribute('data-loaded','');}
document.addEventListener('load',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&t.closest&&t.closest('.hero-media'))mark();},true);
document.addEventListener('DOMContentLoaded',function(){var i=document.querySelector('.hero-media img');if(i&&i.complete)mark();setTimeout(mark,2500);});}catch(e){}})();`;

export function getTier(): Tier {
  if (typeof document === "undefined") return "off";
  const t = document.documentElement.getAttribute("data-motion");
  return t === "full" || t === "css" ? t : "off";
}

/** Rebaixa o tier (ex.: WebGL falhou). Nunca volta a esconder conteúdo. */
export function downgradeTier(to: Exclude<Tier, "full">) {
  const d = document.documentElement;
  const current = getTier();
  if (current === "off") return;
  if (to === "off") {
    d.classList.remove("m-on");
    d.setAttribute("data-motion", "off");
    return;
  }
  if (current === "full") d.setAttribute("data-motion", "css");
}
