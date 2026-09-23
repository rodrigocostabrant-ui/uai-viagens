// Marca UAI (sem o texto "viagens") como SVG em data URI, para os ícones e a
// imagem Open Graph gerados com next/og (o Satori não renderiza <text> de forma confiável).

const MARK = `<rect x="12" y="20" width="11" height="48"/><rect x="45" y="20" width="11" height="48"/><path d="M14 72 Q34 86 54 72" fill="none" stroke="COLOR" stroke-width="3.6" stroke-linecap="round"/><polygon fill="ACCENT" points="94,12 106.3,40 74.8,56"/><polygon fill="ACCENT" points="71.7,63 109.3,47 122,76 66,76"/><rect x="132" y="30" width="10" height="46"/><path fill="ACCENT" transform="translate(134 0) scale(.95)" d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>`;

export function brandMarkDataUri(color = PAPER, accent = RED) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 6 148 84"><g fill="${color}">${MARK.replaceAll("COLOR", color).replaceAll("ACCENT", accent)}</g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INK = "#0b0b0c";
export const PAPER = "#fafafa";
export const RED = "#e0262e";
