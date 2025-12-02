import { 
  ShieldCheck, 
  Banknote, 
  Building2, 
  FileText, 
  TrendingUp, 
  Scale 
} from "lucide-react";

const services = [
  {
    icon: ShieldCheck,
    title: "Retirada de Restrições",
    description: "Removemos seu nome do Serasa, SPC e demais órgãos de proteção ao crédito de forma rápida e eficiente.",
  },
  {
    icon: Banknote,
    title: "Negociação de Débitos",
    description: "Negociamos suas dívidas com bancos e financeiras para conseguir as melhores condições de pagamento.",
  },
  {
    icon: Building2,
    title: "Regularização Bacen",
    description: "Regularizamos sua situação junto ao Banco Central, garantindo acesso completo aos serviços bancários.",
  },
  {
    icon: FileText,
    title: "Parcelamentos Especiais",
    description: "Criamos acordos personalizados com parcelas que cabem no seu bolso, sem comprometer sua renda.",
  },
  {
    icon: Scale,
    title: "Cancelamento de Protestos",
    description: "Eliminamos protestos em cartório que estejam prejudicando seu nome e sua reputação financeira.",
  },
  {
    icon: TrendingUp,
    title: "Aumento de Score",
    description: "Trabalhamos para recuperar e aumentar seu score de crédito, abrindo portas para novas oportunidades.",
  },
];

const ServicesSection = () => {
  return (
    <section id="servicos" className="py-12 sm:py-16 md:py-28 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary-light/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            O que fazemos
          </span>
          <h2 className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 sm:mb-4">
            Nossos Serviços
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4 sm:px-0">
            Soluções completas para você recuperar sua vida financeira e conquistar seus objetivos.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-card transition-all duration-300 sm:hover:-translate-y-1 border border-border/50 active:scale-[0.98] sm:active:scale-100"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="font-poppins font-semibold text-lg sm:text-xl text-foreground mb-2 sm:mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
