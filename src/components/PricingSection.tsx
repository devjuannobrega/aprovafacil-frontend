import { Button } from "@/components/ui/button";
import { Check, MessageCircle, Star, Zap } from "lucide-react";

const WHATSAPP_LINK = "https://wa.me/5511999999999?text=Olá! Tenho interesse no Plano Completo Limpa Nome.";

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
  const scrollToPayment = () => {
    const element = document.getElementById("pagamento");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="plano" className="py-20 md:py-28 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Abstract Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary-light/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>Oferta por tempo limitado</span>
            </div>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4">
              Plano Completo Limpa Nome
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Tudo que você precisa para limpar seu nome de uma vez por todas
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-card rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Price */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-semibold mb-4">
                  <Star className="w-4 h-4" />
                  Promoção Limitada
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-muted-foreground text-2xl line-through">R$ 1.200</span>
                </div>
                <div className="flex items-baseline justify-center gap-1 mt-2">
                  <span className="text-muted-foreground text-2xl">R$</span>
                  <span className="font-poppins font-bold text-6xl md:text-7xl text-primary">680</span>
                  <span className="text-muted-foreground text-xl">,00</span>
                </div>
                <p className="text-muted-foreground mt-2">Pagamento único • Sem mensalidades</p>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="cta" size="xl" className="flex-1" onClick={scrollToPayment}>
                  Aproveite Agora
                </Button>
                <Button variant="whatsapp" size="xl" className="flex-1" asChild>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5" />
                    Fale com Consultor
                  </a>
                </Button>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="bg-primary-muted px-8 py-4 text-center">
              <p className="text-primary font-medium">
                🔒 Pagamento 100% seguro via Mercado Pago
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
