import type { HTMLAttributes, ReactNode } from "react";

/** Rótulo de seção da v2: traço de 32px + texto em caixa-alta de 12px. */
export function SectionLabel({
  children,
  tone = "dark",
  className = "",
  ...rest
}: { children: ReactNode; tone?: "dark" | "light"; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`label flex items-center gap-3 ${tone === "dark" ? "text-gray-400" : "text-gray-650"} ${className}`}
      {...rest}
    >
      <span className="label-line" aria-hidden="true" />
      {children}
    </div>
  );
}
