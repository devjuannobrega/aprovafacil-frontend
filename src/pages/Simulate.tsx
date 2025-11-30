import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Calculator, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Simulate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyValue: "",
    monthlyIncome: "",
    financingType: "",
    name: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.propertyValue || !formData.monthlyIncome || !formData.financingType || 
        !formData.name || !formData.phone || !formData.email) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // WhatsApp message
    const message = encodeURIComponent(
      `Olá! Gostaria de simular um financiamento:\n\n` +
      `Nome: ${formData.name}\n` +
      `Telefone: ${formData.phone}\n` +
      `E-mail: ${formData.email}\n` +
      `Valor do imóvel: R$ ${formData.propertyValue}\n` +
      `Renda mensal: R$ ${formData.monthlyIncome}\n` +
      `Tipo de financiamento: ${formData.financingType}`
    );

    toast.success("Simulação enviada! Redirecionando para o WhatsApp...");
    
    setTimeout(() => {
      window.open(`https://wa.me/5511999999999?text=${message}`, "_blank");
      navigate("/");
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/20 backdrop-blur-sm mb-4">
              <Calculator className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground">
              Simule seu Crédito
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Preencha os dados abaixo e vamos aprovar seu sonho juntos!
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-none shadow-soft">
              <CardHeader>
                <CardTitle className="text-2xl">Dados para Simulação</CardTitle>
                <CardDescription>
                  Preencha as informações abaixo para recebermos sua solicitação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="financingType">Tipo de Financiamento *</Label>
                    <Select value={formData.financingType} onValueChange={(value) => handleChange("financingType", value)}>
                      <SelectTrigger id="financingType">
                        <SelectValue placeholder="Selecione o tipo de financiamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compra">Compra de Imóvel</SelectItem>
                        <SelectItem value="terreno-construcao">Terreno + Construção</SelectItem>
                        <SelectItem value="construcao">Construção em Terreno Próprio</SelectItem>
                        <SelectItem value="mcmv">Minha Casa Minha Vida</SelectItem>
                        <SelectItem value="credito-real">Crédito Real Caixa</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyValue">Valor do Imóvel (R$) *</Label>
                      <Input
                        id="propertyValue"
                        type="number"
                        placeholder="300000"
                        value={formData.propertyValue}
                        onChange={(e) => handleChange("propertyValue", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncome">Renda Mensal (R$) *</Label>
                      <Input
                        id="monthlyIncome"
                        type="number"
                        placeholder="5000"
                        value={formData.monthlyIncome}
                        onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Enviar Simulação
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Ao enviar, você será direcionado para nosso WhatsApp para continuarmos o atendimento
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <Card className="border-none shadow-soft">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Gratuito</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-soft">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">24h</div>
                  <div className="text-sm text-muted-foreground">Resposta rápida</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-soft">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">Seguro</div>
                  <div className="text-sm text-muted-foreground">Dados protegidos</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Simulate;
