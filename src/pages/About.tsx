import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Target, Eye, Heart, Users, Award, TrendingUp } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Transparência",
      description: "Clareza e honestidade em cada etapa do processo de crédito.",
    },
    {
      icon: Users,
      title: "Empatia",
      description: "Entendemos cada história e tratamos cada cliente de forma única.",
    },
    {
      icon: TrendingUp,
      title: "Agilidade",
      description: "Processos otimizados para aprovação rápida e eficiente.",
    },
    {
      icon: Award,
      title: "Compromisso",
      description: "Dedicação total na conquista do seu sonho da casa própria.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground">
              Sobre o Aprova Fácil
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Nascemos para romper ciclos e tornar o crédito acessível a todos
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-foreground leading-relaxed">
                O <strong>Aprova Fácil</strong> é muito mais que um correspondente bancário. Somos parte do{" "}
                <strong>Grupo PAM Realizações</strong>, uma empresa com mais de 20 anos de experiência em
                soluções habitacionais e crédito imobiliário.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa missão é simples, mas poderosa: transformar o sonho da casa própria em realidade para
                milhares de famílias brasileiras. Acreditamos que todo mundo merece ter um lar, e estamos
                aqui para facilitar, traduzir e entregar esse sonho.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Como <strong>Correspondente Caixa Autorizado</strong>, oferecemos todo o portfólio de crédito
                habitacional da Caixa Econômica Federal, mas com um diferencial: atendimento humanizado,
                consultoria personalizada e acompanhamento em cada etapa do processo.
              </p>
            </div>

            {/* Mission, Vision */}
            <div className="grid md:grid-cols-2 gap-8 mt-16">
              <Card className="border-none shadow-soft">
                <CardContent className="pt-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-hero">
                    <Target className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Nossa Missão</h3>
                  <p className="text-muted-foreground">
                    Facilitar o acesso ao crédito habitacional, traduzindo o bancário em linguagem humana e
                    entregando soluções completas do sonho à chave.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-soft">
                <CardContent className="pt-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-accent">
                    <Eye className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Nossa Visão</h3>
                  <p className="text-muted-foreground">
                    Ser referência nacional em crédito habitacional com propósito humano, reconhecidos pela
                    excelência no atendimento e compromisso com a realização de sonhos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Nossos Valores</h2>
            <p className="text-lg text-muted-foreground">
              Princípios que guiam cada atendimento e decisão
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-none shadow-soft hover:shadow-hover transition-all duration-300">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-accent-foreground">
              Mais do que crédito, entregamos conquistas
            </h2>
            <p className="text-lg text-accent-foreground/90">
              Faça parte das centenas de famílias que já realizaram o sonho da casa própria com a gente.
            </p>
            <Button asChild size="lg" variant="outline" className="bg-white text-accent border-none hover:bg-white/90">
              <Link to="/simular">Comece Agora sua Jornada</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
