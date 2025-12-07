import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiLinkedin, FiClock, FiFileText, FiLock } from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi2";

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-slate-900 text-white">
      {/* Trust Bar */}
      <div className="border-b border-white/10">
        <div className="container py-6 px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <FiLock className="w-4 h-4 text-primary-light" />
              <span>Site 100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <FiFileText className="w-4 h-4 text-primary-light" />
              <span>Contrato Digital</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4 text-primary-light" />
              <span>Atendimento 24h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12 sm:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <HiShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-poppins font-bold text-xl block">Aprova Fácil</span>
                <span className="text-xs text-white/50">Grupo PAM</span>
              </div>
            </div>
            <p className="text-white/60 mb-6 leading-relaxed text-sm">
              Especialistas em regularização de crédito com anos de experiência no mercado.
              Ajudamos você a recuperar seu nome e conquistar seus objetivos financeiros.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-primary/20 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-poppins font-semibold text-base mb-6 text-white">Navegação</h4>
            <ul className="space-y-3">
              {[
                { label: "Início", id: "hero" },
                { label: "Nossos Serviços", id: "servicos" },
                { label: "Produtos", id: "plano" },
                { label: "Depoimentos", id: "depoimentos" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-white/60 hover:text-primary-light transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-poppins font-semibold text-base mb-6 text-white">Serviços</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li>Limpa Nome</li>
              <li>Rating / RAIND</li>
              <li>Score</li>
              <li>Escavador / JusBrasil</li>
              <li>Consultoria de Crédito</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-poppins font-semibold text-base mb-6 text-white">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <FiPhone className="w-4 h-4 text-primary-light flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block">(11) 99999-9999</span>
                  <span className="text-xs text-white/40">Seg a Sex, 9h às 18h</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <FiMail className="w-4 h-4 text-primary-light flex-shrink-0" />
                <span>contato@aprovafacil.com.br</span>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <FiMapPin className="w-4 h-4 text-primary-light flex-shrink-0 mt-0.5" />
                <span>Atendimento 100% Online<br />em todo o Brasil</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-slate-950">
        <div className="container py-6 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-white/50 text-xs">
                © {new Date().getFullYear()} Aprova Fácil - Grupo PAM. Todos os direitos reservados.
              </p>
              <p className="text-white/30 text-xs mt-1">
                CNPJ: 00.000.000/0001-00
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/50 hover:text-primary-light text-xs transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-white/50 hover:text-primary-light text-xs transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
