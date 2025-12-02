import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import PaymentSection from "@/components/PaymentSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Limpa Nome – Regularização de Crédito | Limpe Seu Nome Hoje</title>
        <meta
          name="description"
          content="Serviços de retirada de restrições do Serasa e SPC, negociação de dívidas, cancelamento de protestos e aumento de score. Recupere seu crédito de forma rápida e segura."
        />
        <meta name="keywords" content="limpa nome, limpar nome, serasa, spc, score, crédito, dívidas, protestos, regularização" />
        <meta property="og:title" content="Limpa Nome – Regularização de Crédito" />
        <meta property="og:description" content="Serviços de retirada de restrições, negociação de dívidas e aumento de score. Recupere seu crédito hoje!" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://limpanome.com.br" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <ServicesSection />
          <PricingSection />
          <PaymentSection />
          <TestimonialsSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
