import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Situacao } from "@/components/sections/Situacao";
import { Servicos } from "@/components/sections/Servicos";
import { ComoFunciona } from "@/components/sections/ComoFunciona";
import { Sobre } from "@/components/sections/Sobre";
import { Diferenciais } from "@/components/sections/Diferenciais";
import { Faq } from "@/components/sections/Faq";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Footer } from "@/components/sections/Footer";
import { WhatsappFloating } from "@/components/ui/WhatsappFloating";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Situacao />
        <Servicos />
        <ComoFunciona />
        <Sobre />
        <Diferenciais />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <WhatsappFloating />
    </>
  );
}
