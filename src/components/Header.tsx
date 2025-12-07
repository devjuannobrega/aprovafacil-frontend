import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FiMenu, FiX, FiMessageCircle, FiUser, FiLogOut, FiLogIn } from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi2";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openChat } = useChat();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const handleCadastro = () => {
    setIsMobileMenuOpen(false);
    navigate("/cadastro");
  };

  // Pegar primeiro nome do usuário
  const firstName = user?.name?.split(" ")[0] || "";

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
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
            <HiShieldCheck className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className={`font-poppins font-bold text-xl transition-colors duration-300 ${
            isScrolled ? "text-foreground" : "text-primary-foreground"
          }`}>
            Aprova Fácil
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: "Início", id: "hero" },
            { label: "Serviços", id: "servicos" },
            { label: "Produtos", id: "plano" },
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

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 ml-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                isScrolled ? "bg-primary/10" : "bg-white/10"
              }`}>
                <FiUser className={`w-4 h-4 ${isScrolled ? "text-primary" : "text-primary-foreground"}`} />
                <span className={`text-sm font-medium ${
                  isScrolled ? "text-foreground" : "text-primary-foreground"
                }`}>
                  {firstName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className={isScrolled ? "" : "text-primary-foreground hover:text-primary-foreground hover:bg-white/10"}
              >
                <FiLogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogin}
                className={isScrolled ? "" : "text-primary-foreground hover:text-primary-foreground hover:bg-white/10"}
              >
                Entrar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleCadastro}
              >
                Cadastrar
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-3 -mr-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center active:bg-white/10 ${
            isScrolled ? "text-foreground active:bg-primary/10" : "text-primary-foreground"
          }`}
          aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-card shadow-lg md:hidden animate-slide-up border-t border-border">
            <nav className="flex flex-col p-4 gap-1">
              {/* User Info (se logado) */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-primary/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{firstName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              )}

              {[
                { label: "Início", id: "hero" },
                { label: "Serviços", id: "servicos" },
                { label: "Produtos", id: "plano" },
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

              <Button variant="outline" size="lg" className="mt-2 min-h-[48px]" onClick={handleOpenChat}>
                <FiMessageCircle className="w-5 h-5 mr-2" />
                Fale Conosco
              </Button>

              {/* Auth Buttons Mobile */}
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="lg"
                  className="mt-2 min-h-[48px] text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <FiLogOut className="w-5 h-5 mr-2" />
                  Sair da conta
                </Button>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Button variant="default" size="lg" className="min-h-[48px]" onClick={handleCadastro}>
                    Criar conta
                  </Button>
                  <Button variant="outline" size="lg" className="min-h-[48px]" onClick={handleLogin}>
                    <FiLogIn className="w-5 h-5 mr-2" />
                    Entrar
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
