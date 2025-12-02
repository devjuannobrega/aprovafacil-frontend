import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CreditCard, MessageCircle, Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_LINK = "https://wa.me/5511999999999?text=Olá! Gostaria de finalizar meu pagamento do Plano Limpa Nome.";
const MERCADO_PAGO_LINK = "https://www.mercadopago.com.br/checkout/v1/redirect";

const PaymentSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cpf: "",
    email: "",
    observation: "",
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      setFormData({ ...formData, [name]: formatPhone(value) });
    } else if (name === "cpf") {
      setFormData({ ...formData, [name]: formatCPF(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.phone || !formData.cpf || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    // CPF validation (basic)
    const cpfNumbers = formData.cpf.replace(/\D/g, "");
    if (cpfNumbers.length !== 11) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido com 11 dígitos.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Redirecionando...",
      description: "Você será redirecionado para o Mercado Pago.",
    });

    // Simulate redirect to Mercado Pago
    setTimeout(() => {
      window.open(MERCADO_PAGO_LINK, "_blank");
    }, 1000);
  };

  return (
    <section id="pagamento" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Finalize sua compra
            </span>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Formulário de Pagamento
            </h2>
            <p className="text-muted-foreground text-lg">
              Preencha seus dados para continuar com o pagamento seguro
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3 bg-card rounded-2xl shadow-card p-6 md:p-8 border border-border/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Nome Completo *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 h-12"
                    maxLength={100}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-foreground font-medium">
                      Telefone *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-2 h-12"
                      maxLength={15}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf" className="text-foreground font-medium">
                      CPF *
                    </Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={handleChange}
                      className="mt-2 h-12"
                      maxLength={14}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground font-medium">
                    E-mail *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 h-12"
                    maxLength={255}
                  />
                </div>

                <div>
                  <Label htmlFor="observation" className="text-foreground font-medium">
                    Observação (opcional)
                  </Label>
                  <Textarea
                    id="observation"
                    name="observation"
                    placeholder="Alguma informação adicional que queira compartilhar..."
                    value={formData.observation}
                    onChange={handleChange}
                    className="mt-2 min-h-[100px]"
                    maxLength={500}
                  />
                </div>

                <Button type="submit" variant="cta" size="xl" className="w-full">
                  <CreditCard className="w-5 h-5" />
                  Realizar Pagamento com Mercado Pago
                </Button>

                <Button variant="whatsapp" size="lg" className="w-full" asChild>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5" />
                    Fale com um Consultor
                  </a>
                </Button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Card */}
              <div className="bg-card rounded-2xl shadow-card p-6 border border-border/50">
                <h3 className="font-poppins font-semibold text-xl text-foreground mb-4">
                  Resumo do Pedido
                </h3>
                <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plano Completo</span>
                    <span className="text-foreground font-medium">R$ 680,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="text-success font-medium">-R$ 520,00</span>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <span className="text-foreground font-semibold">Total</span>
                  <span className="text-primary font-bold text-2xl">R$ 680,00</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-primary-muted rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">Compra Segura</span>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>Dados criptografados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>Pagamento via Mercado Pago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>Garantia de satisfação</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
