import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import heroImage from "@/assets/hero-home.jpg";
import {
  Home,
  Building2,
  Hammer,
  CreditCard,
  Shield,
  Users,
  Clock,
  Heart,
  CheckCircle,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";

const Index = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Atendimento Humanizado",
      description: "Cada cliente é único. Oferecemos consultoria personalizada para suas necessidades.",
    },
    {
      icon: Clock,
      title: "Sem Filas e Burocracia",
      description: "Você não precisa ir ao banco. O banco vem até você com toda a praticidade.",
    },
    {
      icon: CheckCircle,
      title: "Clareza no Processo",
      description: "Traduzimos o bancário para você. Transparência em cada etapa da aprovação.",
    },
    {
      icon: TrendingUp,
      title: "Aprovação Ágil",
      description: "Processos otimizados e acompanhamento constante para aprovação rápida.",
    },
  ];

  const services = [
    {
      icon: Home,
      title: "Financiamento Habitacional",
      description: "Compra de imóvel novo ou usado com as melhores condições do mercado.",
    },
    {
      icon: Building2,
      title: "Terreno + Construção",
      description: "Acompanhamento completo do seu projeto até a entrega das chaves.",
    },
    {
      icon: Hammer,
      title: "Minha Casa Minha Vida",
      description: "Orientação completa para você se enquadrar no programa habitacional.",
    },
    {
      icon: CreditCard,
      title: "Crédito Real Caixa",
      description: "Soluções personalizadas conforme sua renda e perfil financeiro.",
    },
    {
      icon: Shield,
      title: "Seguros e Consórcios",
      description: "Proteção e planejamento para realizar seus sonhos com segurança.",
    },
    {
      icon: Users,
      title: "Consultoria Completa",
      description: "Do primeiro contato até a conquista da sua casa própria.",
    },
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      text: "O Aprova Fácil transformou nosso sonho em realidade. Atendimento impecável e muito humano!",
      role: "Cliente Satisfeita",
    },
    {
      name: "João Santos",
      text: "Aprovaram meu crédito rapidamente e sem complicação. Recomendo de olhos fechados!",
      role: "Proprietário Feliz",
    },
    {
      name: "Ana Costa",
      text: "Finalmente consegui minha casa própria! Equipe atenciosa que me guiou em cada passo.",
      role: "Nova Proprietária",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 pb-20 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Família feliz com as chaves da casa própria"
            className="w-full h-full object-cover mix-blend-overlay opacity-30"
          />
        </div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Award className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-primary-foreground">
                Correspondente Caixa Autorizado
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
              Você sonha. A gente aprova.
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Transformamos o desejo da casa própria em conquista real. Correspondente Caixa autorizado
              com atendimento humanizado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/simular">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Simule seu Crédito
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                <Link to="/contato">Fale com um Consultor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Por que escolher o Aprova Fácil?
            </h2>
            <p className="text-lg text-muted-foreground">
              Mais de 20 anos de experiência transformando sonhos em realidade
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-hero">
                    <benefit.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg text-muted-foreground">
              Soluções completas para realizar o sonho da casa própria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-none shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1 group">
                <CardContent className="pt-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-gradient-hero transition-colors">
                    <service.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                  <Button asChild variant="link" className="p-0 h-auto text-primary">
                    <Link to="/servicos">Saiba mais →</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/servicos">Ver Todos os Serviços</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Histórias de Sucesso
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Veja o que nossos clientes dizem sobre nós
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20">
                <CardContent className="pt-6 space-y-4">
                  <p className="text-primary-foreground/90 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-primary-foreground">{testimonial.name}</p>
                    <p className="text-sm text-primary-foreground/70">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent-foreground">
              Realize seu sonho com a gente
            </h2>
            <p className="text-lg text-accent-foreground/90">
              Do sonho à chave, a gente aprova com você. Comece agora sua jornada rumo à casa própria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="outline" className="bg-white text-accent border-none hover:bg-white/90">
                <Link to="/simular">Simular Crédito Agora</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10">
                <Link to="/contato">Agendar Consultoria</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
