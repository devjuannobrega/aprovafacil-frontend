import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Silva",
    location: "São Paulo, SP",
    rating: 5,
    text: "Estava com o nome sujo há 3 anos e em menos de 30 dias consegui limpar tudo! Agora já consegui até um cartão de crédito novo. Recomendo demais!",
    avatar: "MS",
  },
  {
    name: "João Santos",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Excelente atendimento! A equipe foi muito atenciosa e me manteve informado durante todo o processo. Meu score subiu mais de 200 pontos.",
    avatar: "JS",
  },
  {
    name: "Ana Oliveira",
    location: "Belo Horizonte, MG",
    rating: 5,
    text: "Tinha dívidas em vários lugares e achava que nunca conseguiria resolver. O Limpa Nome negociou tudo e hoje estou livre! Obrigada!",
    avatar: "AO",
  },
  {
    name: "Carlos Ferreira",
    location: "Curitiba, PR",
    rating: 5,
    text: "Profissionais de confiança! Cumpriram tudo que prometeram e no prazo combinado. Agora consigo financiar meu carro novo.",
    avatar: "CF",
  },
  {
    name: "Lucia Mendes",
    location: "Salvador, BA",
    rating: 5,
    text: "O melhor investimento que já fiz! Em pouco tempo consegui regularizar minha situação e voltar a ter crédito no mercado.",
    avatar: "LM",
  },
  {
    name: "Roberto Lima",
    location: "Fortaleza, CE",
    rating: 5,
    text: "Atendimento humanizado e resultado garantido. A equipe realmente se preocupa com o cliente. Super recomendo!",
    avatar: "RL",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Depoimentos
          </span>
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-muted-foreground text-lg">
            Milhares de pessoas já recuperaram seu crédito conosco. Veja o que elas têm a dizer.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-border/50 group"
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Quote className="w-5 h-5 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { value: "10.000+", label: "Clientes Atendidos" },
            { value: "98%", label: "Taxa de Sucesso" },
            { value: "4.9", label: "Avaliação Média" },
            { value: "30 dias", label: "Prazo Médio" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-poppins font-bold text-3xl md:text-4xl text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
