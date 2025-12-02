import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, CheckCircle, TrendingUp, Shield, CreditCard } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";

const HeroSection = () => {
  const { openChat } = useChat();

  const scrollToPayment = () => {
    const element = document.getElementById("pagamento");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Abstract Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Wave Pattern */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="hsl(var(--background))"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-20 pb-28 sm:pt-24 sm:pb-32 md:pt-32 md:pb-40">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left px-2 sm:px-0">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-fade-in">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>+10.000 clientes satisfeitos</span>
            </div>

            <h1 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-4 sm:mb-6 animate-slide-up">
              Limpe Seu Nome e{" "}
              <span className="text-primary-light">Recupere Seu Crédito</span>{" "}
              Hoje Mesmo!
            </h1>

            <p className="text-primary-foreground/80 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Serviço rápido, seguro e 100% online. Resolva suas pendências e reconquiste seu poder de compra.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button variant="hero" size="xl" onClick={scrollToPayment} className="min-h-[52px] text-base">
                Aproveite Agora
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="hero-outline" size="xl" className="min-h-[52px] text-base" onClick={openChat}>
                <MessageCircle className="w-5 h-5" />
                Fale com Consultor
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start mt-8 sm:mt-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {[
                { icon: Shield, label: "100% Seguro" },
                { icon: TrendingUp, label: "Score Recuperado" },
                { icon: CreditCard, label: "Crédito Liberado" },
              ].map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-primary-foreground/70">
                  <badge.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-[500px]">
              {/* Main Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-44 glass-card rounded-2xl p-6 animate-float">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">Nome Limpo!</p>
                    <p className="text-muted-foreground text-sm">Score: 750 pontos</p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[75%] bg-gradient-to-r from-primary to-success rounded-full" />
                </div>
              </div>

              {/* Secondary Card */}
              <div className="absolute top-10 right-0 w-56 glass-card rounded-xl p-4 animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-foreground font-medium">+180 pontos</span>
                </div>
                <p className="text-muted-foreground text-xs mt-1">Aumento de score</p>
              </div>

              {/* Third Card */}
              <div className="absolute bottom-10 left-0 w-64 glass-card rounded-xl p-4 animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">Crédito Aprovado</p>
                    <p className="text-muted-foreground text-xs">Limite: R$ 5.000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
