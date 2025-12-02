import { Shield, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";

const Footer = () => {
  const { openChat } = useChat();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-primary-dark text-primary-dark-foreground">
      {/* Main Footer */}
      <div className="container py-10 sm:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <span className="font-poppins font-bold text-lg sm:text-xl">Limpa Nome</span>
            </a>
            <p className="text-primary-dark-foreground/70 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Especialistas em regularização de crédito. Ajudamos você a recuperar seu nome e conquistar seus sonhos.
            </p>
            <Button variant="default" className="min-h-[44px]" onClick={openChat}>
              <MessageCircle className="w-5 h-5" />
              Fale Conosco
            </Button>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-poppins font-semibold text-base sm:text-lg mb-4 sm:mb-6">Links Rápidos</h4>
            <ul className="space-y-2 sm:space-y-3">
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
                    className="text-primary-dark-foreground/70 hover:text-primary-light transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-0 flex items-center"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-poppins font-semibold text-base sm:text-lg mb-4 sm:mb-6">Nossos Serviços</h4>
            <ul className="space-y-2 sm:space-y-3 text-primary-dark-foreground/70 text-sm sm:text-base">
              <li>Retirada de Restrições</li>
              <li>Negociação de Débitos</li>
              <li>Regularização Bacen</li>
              <li>Cancelamento de Protestos</li>
              <li>Aumento de Score</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-poppins font-semibold text-base sm:text-lg mb-4 sm:mb-6">Contato</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-center gap-2.5 sm:gap-3 text-primary-dark-foreground/70 text-sm sm:text-base">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-light flex-shrink-0" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2.5 sm:gap-3 text-primary-dark-foreground/70 text-sm sm:text-base">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary-light flex-shrink-0" />
                <span className="break-all">contato@limpanome.com.br</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3 text-primary-dark-foreground/70 text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-light flex-shrink-0 mt-0.5" />
                <span>Atendimento 100% Online em todo o Brasil</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-dark-foreground/10">
        <div className="container py-4 sm:py-6 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-primary-dark-foreground/60 text-xs sm:text-sm text-center md:text-left">
            © {new Date().getFullYear()} Limpa Nome. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="text-primary-dark-foreground/60 hover:text-primary-light text-xs sm:text-sm transition-colors min-h-[44px] sm:min-h-0 flex items-center">
              Política de Privacidade
            </a>
            <a href="#" className="text-primary-dark-foreground/60 hover:text-primary-light text-xs sm:text-sm transition-colors min-h-[44px] sm:min-h-0 flex items-center">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
