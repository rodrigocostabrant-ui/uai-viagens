import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { PontoDePartida } from "@/components/sections/PontoDePartida";
import { Servicos } from "@/components/sections/Servicos";
import { ComoFunciona } from "@/components/sections/ComoFunciona";
import { QuemCuida } from "@/components/sections/QuemCuida";
import { Duvidas } from "@/components/sections/Duvidas";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Footer } from "@/components/sections/Footer";
import { WhatsappFloating } from "@/components/ui/WhatsappFloating";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PontoDePartida />
        <Servicos />
        <ComoFunciona />
        <QuemCuida />
        <Duvidas />
        <CtaFinal />
      </main>
      <Footer />
      <WhatsappFloating />
    </>
  );
}
