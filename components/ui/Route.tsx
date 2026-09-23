import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

// Rota de "Como funciona". Com scroll-driven (Chrome, Safari 26), a linha se
// desenha pelo scroll e cada parada surge quando a linha chega nela (--p = posição
// na linha). Sem suporte, os data-route caem na sequência aprovada por tempo.

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;
const at = (p: number, rd: number): Vars => ({ "--p": p, "--rd": `${rd}ms` });

const DASH_X = "repeating-linear-gradient(90deg, #8a8a90 0 6px, transparent 6px 12px)";
const DASH_Y = "repeating-linear-gradient(180deg, #8a8a90 0 6px, transparent 6px 12px)";
const STOP = "block h-4 w-4 rounded-full bg-ink shadow-[0_0_0_6px_#f2f2f0,0_0_0_7px_#a8a8ad]";

function Step({ i, className = "", titleSize }: { i: number; className?: string; titleSize: string }) {
  const e = site.comoFunciona.etapas[i];
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="label tracking-[0.2em] text-gray-650">{e.tag}</span>
      <span className={`mt-3 font-display font-medium leading-none ${titleSize}`}>{e.titulo}</span>
      <p className="m-0 mt-3 text-[16px] leading-[1.6] text-gray-700">{e.texto}</p>
    </div>
  );
}

export function Route() {
  const { comoFunciona: c } = site;
  // Etapas acima da linha (1 e 3) e abaixo (2 e 4), como na v2.
  const stepAt = [
    { p: 0, rd: 200 },
    { p: 0.25, rd: 500 },
    { p: 0.5, rd: 800 },
    { p: 0.75, rd: 1100 },
  ];
  return (
    <>
      {/* Horizontal (≥ 1000px) */}
      <div className="route-h mt-28 hidden route:block">
        <div className="label mb-5 flex justify-between tracking-[0.2em] text-gray-650">
          <span>{c.inicio}</span>
          <span>{c.destino}</span>
        </div>
        <div className="grid grid-cols-4 grid-rows-[auto_64px_auto]">
          {[0, 2].map((i) => (
            <div
              key={i}
              data-route="up"
              style={{ ...at(stepAt[i].p, stepAt[i].rd), gridColumn: i + 1, gridRow: 1 }}
              className="route-step flex flex-col justify-end pr-10 pb-9"
            >
              <Step i={i} titleSize="text-[34px]" />
            </div>
          ))}
          <div className="relative col-span-4 row-start-2">
            <div
              data-route="wipe-x"
              className="route-line absolute inset-x-0 top-[31px] h-0.5"
              style={{ background: DASH_X }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 grid grid-cols-4 items-center" aria-hidden="true">
              <span data-route="pop" className={`route-stop ${STOP}`} style={at(0, 150)} />
              <span data-route="pop" className={`route-stop ${STOP}`} style={at(0.25, 500)} />
              <span data-route="pop" className={`route-stop ${STOP}`} style={at(0.5, 850)} />
              <div className="flex items-center justify-between">
                <span data-route="pop" className={`route-stop ${STOP}`} style={at(0.75, 1200)} />
                <span
                  data-route="pop"
                  className="route-stop relative flex h-14 w-14 items-center justify-center rounded-full bg-ink text-silver-300"
                  style={at(0.97, 1500)}
                >
                  <span className="route-ring absolute inset-0 rounded-full border border-silver-500 opacity-0" />
                  <Icon name="plane" size={24} style={{ transform: "rotate(45deg)" }} />
                </span>
              </div>
            </div>
          </div>
          {[1, 3].map((i) => (
            <div
              key={i}
              data-route="up"
              style={{ ...at(stepAt[i].p, stepAt[i].rd), gridColumn: i + 1, gridRow: 3 }}
              className={`route-step pt-9 ${i === 3 ? "" : "pr-10"}`}
            >
              <Step i={i} titleSize="text-[34px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Vertical (< 1000px) */}
      <div className="route-v relative mt-16 max-w-[560px] pl-12 route:hidden">
        <div
          data-route="wipe-y"
          className="route-line absolute top-10 bottom-7 left-[7px] w-0.5"
          style={{ background: DASH_Y }}
          aria-hidden="true"
        />
        <span className="label mb-8 block tracking-[0.2em] text-gray-650">{c.inicio}</span>
        {c.etapas.map((e, i) => (
          <div
            key={e.tag}
            data-route="up"
            className={`route-step relative ${i === c.etapas.length - 1 ? "pb-9" : "pb-11"}`}
          >
            <span className={`absolute top-0 -left-12 ${STOP}`} aria-hidden="true" />
            <Step i={i} titleSize="text-[30px]" />
          </div>
        ))}
        <div data-route="up" className="route-end relative flex min-h-[52px] items-center">
          <span
            className="absolute -left-[66px] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-ink text-silver-300"
            aria-hidden="true"
          >
            <Icon name="plane" size={22} style={{ transform: "rotate(135deg)" }} />
          </span>
          <span className="label tracking-[0.2em] text-gray-650">{c.destino}</span>
        </div>
      </div>
    </>
  );
}
