import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, MessageCircle } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openChat } = useChat();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleOpenChat = () => {
    setIsMobileMenuOpen(false);
    openChat();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-lg shadow-soft py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className={`font-poppins font-bold text-xl transition-colors duration-300 ${
            isScrolled ? "text-foreground" : "text-primary-foreground"
          }`}>
            Limpa Nome
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Início", id: "hero" },
            { label: "Serviços", id: "servicos" },
            { label: "Plano", id: "plano" },
            { label: "Depoimentos", id: "depoimentos" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`font-medium transition-colors duration-200 hover:text-primary ${
                isScrolled ? "text-foreground" : "text-primary-foreground/90 hover:text-primary-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
          <Button
            variant="default"
            size="sm"
            onClick={handleOpenChat}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Fale Conosco
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-3 -mr-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center active:bg-white/10 ${
            isScrolled ? "text-foreground active:bg-primary/10" : "text-primary-foreground"
          }`}
          aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-card shadow-lg md:hidden animate-slide-up border-t border-border">
            <nav className="flex flex-col p-4 gap-1">
              {[
                { label: "Início", id: "hero" },
                { label: "Serviços", id: "servicos" },
                { label: "Plano", id: "plano" },
                { label: "Depoimentos", id: "depoimentos" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-foreground font-medium min-h-[48px] py-3 px-4 rounded-xl hover:bg-primary-muted active:bg-primary-muted/80 transition-colors text-left flex items-center"
                >
                  {item.label}
                </button>
              ))}
              <Button variant="default" size="lg" className="mt-3 min-h-[48px]" onClick={handleOpenChat}>
                <MessageCircle className="w-5 h-5 mr-2" />
                Fale Conosco
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
