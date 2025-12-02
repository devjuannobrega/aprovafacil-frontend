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
    <section id="servicos" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            O que fazemos
          </span>
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Nossos Serviços
          </h2>
          <p className="text-muted-foreground text-lg">
            Soluções completas para você recuperar sua vida financeira e conquistar seus objetivos.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1 border border-border/50"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-poppins font-semibold text-xl text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
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
