import { type AnchorHTMLAttributes } from "react";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "secondary" | "inverse";
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-(--radius-md) px-7 h-12 md:h-[52px] font-medium text-[15px] transition-colors duration-(--dur) ease-(--ease) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--color-accent)";

  const variants = {
    primary:
      "bg-(--color-accent) text-(--color-accent-fg) hover:bg-(--color-accent-hover)",
    secondary:
      "bg-transparent text-(--color-text) border border-(--color-border) hover:bg-(--color-bg-subtle)",
    // Para uso sobre fundo --color-accent (ex.: faixa de CTA final), onde a variante
    // primary ficaria invisivel.
    inverse: "bg-(--color-accent-fg) text-(--color-accent) hover:bg-(--color-bg-subtle)",
  };

  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}
