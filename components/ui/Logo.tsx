// Logo redesenhada em vetor a partir do print do Instagram (v2, símbolo #logo).
// Substituir pelo arquivo original em alta assim que o cliente enviar.
// Como no original: "A" e avião em vermelho (--logo-accent), o resto em currentColor.

export function LogoMark() {
  return (
    <>
      <rect x="12" y="20" width="11" height="48" />
      <rect x="45" y="20" width="11" height="48" />
      <path d="M14 72 Q34 86 54 72" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
      <g fill="var(--logo-accent, var(--color-red))">
        <polygon points="94,12 106.3,40 74.8,56" />
        <polygon points="71.7,63 109.3,47 122,76 66,76" />
      </g>
      <rect x="132" y="30" width="10" height="46" />
      <path
        fill="var(--logo-accent, var(--color-red))"
        transform="translate(134 0) scale(.95)"
        d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
      />
    </>
  );
}

export function Logo({
  className,
  title,
}: {
  className?: string;
  /** Com título vira imagem acessível; sem título é decorativa. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g fill="currentColor">
        <LogoMark />
        {/* next/font renomeia a família: usar a variável, não o nome literal "Barlow" */}
        <text
          x="78"
          y="112"
          textAnchor="middle"
          fontWeight="300"
          fontSize="31"
          letterSpacing="2"
          style={{ fontFamily: "var(--font-barlow), sans-serif" }}
        >
          viagens
        </text>
      </g>
    </svg>
  );
}
