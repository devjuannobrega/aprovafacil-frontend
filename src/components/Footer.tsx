import { Link } from "react-router-dom";
import { Home, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-secondary p-2 rounded-lg">
                <Home className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Aprova Fácil</h3>
                <p className="text-sm text-primary-foreground/80">Grupo PAM Realizações</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/90">
              Do sonho à chave, a gente aprova com você.
            </p>
            <p className="text-xs text-primary-foreground/70">
              Correspondente Caixa Autorizado
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-primary-foreground/90 hover:text-secondary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-sm text-primary-foreground/90 hover:text-secondary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-sm text-primary-foreground/90 hover:text-secondary transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/simular" className="text-sm text-primary-foreground/90 hover:text-secondary transition-colors">
                  Simule seu Crédito
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-sm text-primary-foreground/90 hover:text-secondary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-primary-foreground/90">WhatsApp</p>
                  <a href="https://wa.me/5511999999999" className="text-sm hover:text-secondary transition-colors">
                    (11) 99999-9999
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-primary-foreground/90">E-mail</p>
                  <a href="mailto:contato@aprovafacil.com.br" className="text-sm hover:text-secondary transition-colors">
                    contato@aprovafacil.com.br
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-primary-foreground/90">Endereço</p>
                  <p className="text-sm">São Paulo, SP</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Redes Sociais</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/pamrealizacoes"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 p-3 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/grupo-pam-realizacoes"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 p-3 rounded-lg hover:bg-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-6">
              <p className="text-xs text-primary-foreground/70 mb-2">Horário de Atendimento:</p>
              <p className="text-sm text-primary-foreground/90">Seg - Sex: 9h às 18h</p>
              <p className="text-sm text-primary-foreground/90">Sáb: 9h às 13h</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="text-center space-y-2">
            <p className="text-sm text-primary-foreground/90">
              Aprova Fácil — Correspondente Caixa Autorizado
            </p>
            <p className="text-sm text-primary-foreground/80">
              Do sonho à chave, a gente aprova com você.
            </p>
            <p className="text-xs text-primary-foreground/60">
              © {currentYear} Grupo PAM Realizações — Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
