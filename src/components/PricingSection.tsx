import { Button } from "@/components/ui/button";
import { Check, MessageCircle, Zap, Clock, CreditCard } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";

const products = [
  {
    name: "LIMPA NOME",
    pricePF: 1500,
    pricePJ: 1800,
    description: "Remove apontamentos nos órgãos SERASA, SPC, SCPC, BOA VISTA e CENPROT através de ação jurídica coletiva.",
    deliverables: [
      "Exclusão de apontamentos",
      "Regularização documental",
      "Relatório oficial 'Nada Consta'",
      "Suporte ativo",
      "Garantia de 6 meses",
    ],
    deadline: "30 a 60 dias úteis",
    deadlineNote: "80% dos casos entregues antes de 40 dias",
    payment: "Entrada de R$ 750,00",
  },
  {
    name: "RATING / RAIND",
    pricePF: 2500,
    pricePJ: 3000,
    description: "Atualiza o rating bancário (classificação A a E), restaura Score e renda presumida, melhorando a análise interna dos bancos.",
    deliverables: [
      "Atualização de rating bancário",
      "Atualização de renda presumida",
      "Restauração da capacidade de pagamento",
      "Correção de inconsistências internas",
    ],
    deadline: "30 dias úteis",
    payment: "À vista ou 50% + 50%",
  },
  {
    name: "SCORE",
    pricePF: 800,
    pricePJ: 1000,
    description: "Serviço especializado para recuperação e aumento do Score de crédito junto aos birôs de proteção ao crédito.",
    deliverables: [
      "Análise do perfil de crédito",
      "Estratégias de recuperação",
      "Acompanhamento da evolução",
      "Relatório de progresso",
    ],
    deadline: "Consultar",
    payment: "Consultar condições",
  },
  {
    name: "ESCAVADOR / JUSBRASIL",
    pricePF: 1250,
    pricePJ: 1500,
    description: "Limpa apontamentos no Google/Escavador e realiza levantamento completo de ações judiciais.",
    deliverables: [
      "Retirada de apontamentos do Google/Escavador",
      "Limpeza de informações constrangedoras",
      "Mapeamento jurídico completo",
      "Relatório técnico para bancos",
    ],
    deadline: "15 a 30 dias úteis",
    payment: "Consultar condições",
  },
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
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Soluções completas</span>
          </div>
          <h2 className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-3 sm:mb-4 px-2">
            Nossos Produtos
          </h2>
          <p className="text-primary-foreground/80 text-sm sm:text-base md:text-lg px-4 sm:px-0">
            Escolha a solução ideal para regularizar sua situação financeira
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-1">
                {/* Product Name */}
                <h3 className="font-poppins font-bold text-xl sm:text-2xl text-primary mb-3">
                  {product.name}
                </h3>

                {/* Prices */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 bg-primary/5 rounded-xl p-3 text-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">
                      Pessoa Física
                    </span>
                    <span className="font-poppins font-bold text-2xl sm:text-3xl text-foreground">
                      R$ {product.pricePF.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex-1 bg-primary/5 rounded-xl p-3 text-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-1">
                      Pessoa Jurídica
                    </span>
                    <span className="font-poppins font-bold text-2xl sm:text-3xl text-foreground">
                      R$ {product.pricePJ.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm sm:text-base mb-5 leading-relaxed">
                  {product.description}
                </p>

                {/* Deliverables */}
                <div className="space-y-2 mb-5 flex-1">
                  {product.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-foreground text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Deadline & Payment */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Prazo:</span>
                    <span className="text-foreground font-medium">{product.deadline}</span>
                  </div>
                  {product.deadlineNote && (
                    <p className="text-xs text-success ml-6">{product.deadlineNote}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Pagamento:</span>
                    <span className="text-foreground font-medium">{product.payment}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-2">
                  <Button
                    variant="cta"
                    size="lg"
                    className="flex-1 text-sm"
                    onClick={scrollToPayment}
                  >
                    Contratar
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 text-sm"
                    onClick={openChat}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Tirar Dúvidas
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-10 text-center">
          <p className="text-primary-foreground/70 text-sm sm:text-base">
            Pagamento 100% seguro via Mercado Pago
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
