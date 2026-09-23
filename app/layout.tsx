import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { site } from "@/content/site";
import { Analytics } from "@/components/Analytics";
import { MotionBootstrap } from "@/components/motion/MotionBootstrap";
import { tierScript } from "@/lib/motion/tier";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const title = "UAI Viagens | Agência de Viagens em Belo Horizonte";
const description =
  "Pacotes nacionais e internacionais, hospedagens, cruzeiros e roteiros personalizados. Planeje sua próxima viagem com a UAI Viagens, direto pelo WhatsApp.";

export const viewport: Viewport = { themeColor: "#0b0b0c" };

export const metadata: Metadata = {
  // Dominio ainda nao registrado (ver brief.md > Escopo). Trocar assim que existir.
  metadataBase: new URL("https://uaiviagens.com.br"),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title,
    description,
    siteName: site.nome,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: site.nome,
  image: "https://uaiviagens.com.br/opengraph-image",
  url: "https://uaiviagens.com.br",
  telephone: `+${site.whatsapp}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Belo Horizonte",
    addressRegion: "MG",
    addressCountry: "BR",
  },
  sameAs: [site.instagramUrl],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: site.faq.itens.map((item) => ({
    "@type": "Question",
    name: item.pergunta,
    acceptedAnswer: { "@type": "Answer", text: item.resposta },
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${barlow.variable} ${barlowCondensed.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Tier de motion antes do 1º paint. next/script beforeInteractive roda tarde no App Router. */}
        <script dangerouslySetInnerHTML={{ __html: tierScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>
        {children}
        <MotionBootstrap />
        <Analytics />
      </body>
    </html>
  );
}
