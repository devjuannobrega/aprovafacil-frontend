import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, CheckCircle, Shield, Lock, Award } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { openChat } = useChat();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const scrollToProducts = () => {
    const element = document.getElementById("plano");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCTA = () => {
    if (isAuthenticated) {
      scrollToProducts();
    } else {
      navigate("/cadastro");
    }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary-light/10 rounded-full blur-3xl" />
      </div>

      {/* Wave */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="hsl(var(--background))"
          d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
        />
      </svg>

      {/* Content */}
      <div className="container relative z-10 pt-24 pb-32 sm:pt-28 sm:pb-36 md:pt-32 md:pb-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Empresa certificada e regulamentada</span>
          </div>

          {/* Headline */}
          <h1 className="font-poppins font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-[1.1] mb-6">
            Recupere seu crédito
            <br />
            <span className="text-primary-light">com segurança</span>
          </h1>

          {/* Subheadline */}
          <p className="text-primary-foreground/80 text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Soluções jurídicas especializadas para limpar seu nome nos principais órgãos de proteção ao crédito.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              variant="hero"
              size="xl"
              onClick={handleCTA}
              className="min-h-[56px] text-base px-8"
            >
              {isAuthenticated ? "Ver Produtos" : "Começar Agora"}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="hero-outline"
              size="xl"
              className="min-h-[56px] text-base px-8"
              onClick={openChat}
            >
              <MessageCircle className="w-5 h-5" />
              Falar com Especialista
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-8 justify-center">
            {[
              { icon: Shield, label: "100% Seguro", sublabel: "Dados criptografados" },
              { icon: Lock, label: "Sigilo Total", sublabel: "Informações protegidas" },
              { icon: CheckCircle, label: "98% de Sucesso", sublabel: "Casos resolvidos" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-primary-foreground/90">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-primary-foreground/60">{item.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
