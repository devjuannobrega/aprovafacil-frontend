import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Mail, Phone, MapPin, Clock, Instagram, Linkedin, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const whatsappMessage = encodeURIComponent(
      `Olá! Contato via site:\n\n` +
      `Nome: ${formData.name}\n` +
      `E-mail: ${formData.email}\n` +
      `Telefone: ${formData.phone}\n` +
      `Mensagem: ${formData.message}`
    );

    toast.success("Mensagem enviada! Redirecionando para o WhatsApp...");
    
    setTimeout(() => {
      window.open(`https://wa.me/5511999999999?text=${whatsappMessage}`, "_blank");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone/WhatsApp",
      content: "(11) 99999-9999",
      link: "https://wa.me/5511999999999",
    },
    {
      icon: Mail,
      title: "E-mail",
      content: "contato@aprovafacil.com.br",
      link: "mailto:contato@aprovafacil.com.br",
    },
    {
      icon: MapPin,
      title: "Endereço",
      content: "São Paulo, SP",
      link: null,
    },
    {
      icon: Clock,
      title: "Horário de Atendimento",
      content: "Seg - Sex: 9h às 18h | Sáb: 9h às 13h",
      link: null,
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
              Fale Conosco
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Estamos prontos para ajudar você a realizar o sonho da casa própria
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulário e entraremos em contato em até 24 horas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Nome Completo *</Label>
                      <Input
                        id="contact-name"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">E-mail *</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">Telefone *</Label>
                        <Input
                          id="contact-phone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Mensagem *</Label>
                      <Textarea
                        id="contact-message"
                        placeholder="Como podemos ajudar você?"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      <Send className="mr-2 h-5 w-5" />
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Informações de Contato</h2>
                <p className="text-muted-foreground mb-8">
                  Entre em contato conosco através de qualquer um dos canais abaixo. Estamos aqui para
                  ajudar você!
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-none shadow-soft">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0">
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">{info.content}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Social Media */}
              <Card className="border-none shadow-soft bg-gradient-hero">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-primary-foreground mb-4">
                    Siga-nos nas Redes Sociais
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://instagram.com/pamrealizacoes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-foreground/20 hover:bg-secondary transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-6 w-6 text-primary-foreground" />
                    </a>
                    <a
                      href="https://linkedin.com/company/grupo-pam-realizacoes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-foreground/20 hover:bg-secondary transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-6 w-6 text-primary-foreground" />
                    </a>
                  </div>
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

export default Contact;
