import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  Home,
  Building2,
  Hammer,
  CreditCard,
  Shield,
  Users,
  Landmark,
  FileText,
  ArrowRight,
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Home,
      title: "Financiamento Habitacional",
      description:
        "Realize o sonho da casa própria com as melhores condições do mercado. Atendemos compra de imóvel novo ou usado, com acompanhamento completo desde a análise de crédito até a assinatura do contrato.",
      features: [
        "Taxa de juros competitiva",
        "Prazos de até 35 anos",
        "Entrada facilitada",
        "Uso de FGTS",
      ],
    },
    {
      icon: Building2,
      title: "Terreno + Construção",
      description:
        "Transforme seu terreno em lar. Oferecemos consultoria completa para financiamento de compra de terreno e construção, com acompanhamento técnico e financeiro em todas as etapas do projeto.",
      features: [
        "Análise de projeto",
        "Liberação por etapas",
        "Acompanhamento de obra",
        "Consultoria técnica",
      ],
    },
    {
      icon: Hammer,
      title: "Construção em Terreno Próprio",
      description:
        "Já tem o terreno? Financiamos a construção da sua casa dos sonhos. Avaliamos o projeto, orientamos sobre documentação e acompanhamos toda a execução da obra.",
      features: [
        "Aprovação de projeto",
        "Cronograma financeiro",
        "Vistorias técnicas",
        "Liberação programada",
      ],
    },
    {
      icon: Users,
      title: "Minha Casa Minha Vida",
      description:
        "Acesso facilitado ao programa habitacional do governo federal. Verificamos seu enquadramento, orientamos sobre documentação necessária e conduzimos todo o processo de aprovação.",
      features: [
        "Análise de elegibilidade",
        "Subsídios disponíveis",
        "Taxas reduzidas",
        "Processo simplificado",
      ],
    },
    {
      icon: CreditCard,
      title: "Crédito Real Caixa",
      description:
        "Soluções de crédito personalizadas conforme sua renda e perfil financeiro. Diversas modalidades para atender diferentes necessidades e momentos da sua vida.",
      features: [
        "Crédito personalizado",
        "Análise facilitada",
        "Múltiplas opções",
        "Taxas competitivas",
      ],
    },
    {
      icon: Shield,
      title: "Seguros e Consórcios",
      description:
        "Proteção completa para você e sua família. Oferecemos seguros residenciais, de vida e consórcios para planejamento de longo prazo da aquisição do seu imóvel.",
      features: [
        "Seguro residencial",
        "Seguro de vida",
        "Consórcio imobiliário",
        "Coberturas personalizadas",
      ],
    },
    {
      icon: Landmark,
      title: "Produtos Caixa",
      description:
        "Acesso completo ao portfólio de produtos da Caixa Econômica Federal. Abertura de contas, cartões de crédito e débito, investimentos e muito mais.",
      features: [
        "Abertura de conta",
        "Cartões",
        "Investimentos",
        "Atendimento ágil",
      ],
    },
    {
      icon: FileText,
      title: "Consultoria Completa",
      description:
        "Do primeiro contato até a entrega das chaves. Nossa equipe especializada orienta em cada etapa, traduzindo o bancário e garantindo que você tome as melhores decisões.",
      features: [
        "Análise de perfil",
        "Planejamento financeiro",
        "Documentação completa",
        "Acompanhamento total",
      ],
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
              Nossos Serviços
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Soluções completas em crédito habitacional para realizar seu sonho
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="border-none shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-hero flex-shrink-0">
                      <service.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-3">{service.title}</h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild className="w-full sm:w-auto">
                    <Link to="/simular">Simular Agora</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Você não precisa ir ao banco
              </h2>
              <p className="text-lg text-muted-foreground">
                O banco vem até você com toda a praticidade
              </p>
            </div>

            <Card className="border-none shadow-soft">
              <CardContent className="pt-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground">
                    Como <strong>Correspondente Caixa Autorizado</strong>, trazemos toda a estrutura e
                    segurança da Caixa Econômica Federal até você, sem filas, sem burocracia e com
                    atendimento personalizado.
                  </p>
                  <p className="text-muted-foreground">
                    Nossa equipe especializada está pronta para atender você presencialmente, por telefone,
                    WhatsApp ou videochamada. Escolha a forma que for mais conveniente para você!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-accent-foreground">
              Pronto para começar?
            </h2>
            <p className="text-lg text-accent-foreground/90">
              Simule seu crédito agora ou fale com um de nossos consultores especializados
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="outline" className="bg-white text-accent border-none hover:bg-white/90">
                <Link to="/simular">Simular Crédito</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10">
                <Link to="/contato">Falar com Consultor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
