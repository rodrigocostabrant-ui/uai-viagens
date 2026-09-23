import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { site } from "@/content/site";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-serif-display",
  display: "swap",
});

const title = "UAI Viagens | Agência de Viagens em Belo Horizonte";
const description =
  "Pacotes nacionais e internacionais, hospedagens, cruzeiros e roteiros personalizados. Planeje sua próxima viagem com a UAI Viagens, direto pelo WhatsApp.";

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
    <html lang="pt-BR" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
