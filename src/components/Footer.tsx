import { Shield, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_LINK = "https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os serviços Limpa Nome.";

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-primary-dark text-primary-dark-foreground">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-poppins font-bold text-xl">Limpa Nome</span>
            </a>
            <p className="text-primary-dark-foreground/70 mb-6 leading-relaxed">
              Especialistas em regularização de crédito. Ajudamos você a recuperar seu nome e conquistar seus sonhos.
            </p>
            <Button variant="whatsapp" asChild>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" />
                Fale Conosco
              </a>
            </Button>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {[
                { label: "Início", id: "hero" },
                { label: "Serviços", id: "servicos" },
                { label: "Plano Especial", id: "plano" },
                { label: "Depoimentos", id: "depoimentos" },
                { label: "Pagamento", id: "pagamento" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-primary-dark-foreground/70 hover:text-primary-light transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-6">Nossos Serviços</h4>
            <ul className="space-y-3 text-primary-dark-foreground/70">
              <li>Retirada de Restrições</li>
              <li>Negociação de Débitos</li>
              <li>Regularização Bacen</li>
              <li>Cancelamento de Protestos</li>
              <li>Aumento de Score</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-poppins font-semibold text-lg mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-primary-dark-foreground/70">
                <Phone className="w-5 h-5 text-primary-light" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3 text-primary-dark-foreground/70">
                <Mail className="w-5 h-5 text-primary-light" />
                <span>contato@limpanome.com.br</span>
              </li>
              <li className="flex items-start gap-3 text-primary-dark-foreground/70">
                <MapPin className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" />
                <span>Atendimento 100% Online em todo o Brasil</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-dark-foreground/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-dark-foreground/60 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Limpa Nome. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-primary-dark-foreground/60 hover:text-primary-light text-sm transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-primary-dark-foreground/60 hover:text-primary-light text-sm transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
