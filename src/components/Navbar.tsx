import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Sobre Nós", href: "/sobre" },
    { name: "Serviços", href: "/servicos" },
    { name: "Simule seu Crédito", href: "/simular" },
    { name: "Contato", href: "/contato" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-hero p-2 rounded-lg transition-transform group-hover:scale-105">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">Aprova Fácil</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Grupo PAM Realizações</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="ml-4">
              <Link to="/simular">Simule Agora</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link to="/simular" onClick={() => setIsOpen(false)}>
                  Simule Agora
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
