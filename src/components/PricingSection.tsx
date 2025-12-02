import { Button } from "@/components/ui/button";
import { Check, MessageCircle, Star, Zap } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";

const features = [
  "Suporte completo até a finalização",
  "Atendimento personalizado",
  "Acompanhamento diário do processo",
  "Envio de relatórios semanais",
  "Negociação com todos os credores",
  "Regularização completa do CPF",
  "Consultoria financeira gratuita",
  "Garantia de satisfação",
];

const PricingSection = () => {
  const { openChat } = useChat();

  const scrollToPayment = () => {
    const element = document.getElementById("pagamento");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="plano" className="py-12 sm:py-16 md:py-28 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Abstract Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 sm:w-80 h-64 sm:h-80 bg-primary-light/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/30 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Oferta por tempo limitado</span>
            </div>
            <h2 className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-3 sm:mb-4 px-2">
              Plano Completo Limpa Nome
            </h2>
            <p className="text-primary-foreground/80 text-sm sm:text-base md:text-lg px-4 sm:px-0">
              Tudo que você precisa para limpar seu nome de uma vez por todas
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-card rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden mx-2 sm:mx-0">
            <div className="p-5 sm:p-8 md:p-12">
              {/* Price */}
              <div className="text-center mb-8 sm:mb-10">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 rounded-full bg-destructive/10 text-destructive text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Promoção Limitada
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-muted-foreground text-lg sm:text-2xl line-through">R$ 1.200</span>
                </div>
                <div className="flex items-baseline justify-center gap-1 mt-2">
                  <span className="text-muted-foreground text-xl sm:text-2xl">R$</span>
                  <span className="font-poppins font-bold text-5xl sm:text-6xl md:text-7xl text-primary">680</span>
                  <span className="text-muted-foreground text-lg sm:text-xl">,00</span>
                </div>
                <p className="text-muted-foreground text-sm sm:text-base mt-2">Pagamento único • Sem mensalidades</p>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                    </div>
                    <span className="text-foreground text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button variant="cta" size="xl" className="flex-1 min-h-[52px] text-base" onClick={scrollToPayment}>
                  Aproveite Agora
                </Button>
                <Button variant="outline" size="xl" className="flex-1 min-h-[52px] text-base" onClick={openChat}>
                  <MessageCircle className="w-5 h-5" />
                  Fale com Consultor
                </Button>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="bg-primary-muted px-4 sm:px-8 py-3 sm:py-4 text-center">
              <p className="text-primary font-medium text-sm sm:text-base">
                Pagamento 100% seguro via Mercado Pago
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
