import { Users, CheckCircle, Clock, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "5.000+",
    label: "Clientes Atendidos",
    description: "Pessoas que recuperaram o crédito",
  },
  {
    icon: CheckCircle,
    value: "98%",
    label: "Taxa de Sucesso",
    description: "Casos resolvidos com êxito",
  },
  {
    icon: Clock,
    value: "30 dias",
    label: "Prazo Médio",
    description: "Para limpeza do nome",
  },
  {
    icon: TrendingUp,
    value: "150+",
    label: "Pontos no Score",
    description: "Aumento médio após o serviço",
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 sm:py-20 bg-card border-y border-border">
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-1">
                {stat.value}
              </div>
              <div className="font-semibold text-foreground text-sm sm:text-base mb-1">
                {stat.label}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
