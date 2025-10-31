import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <Building2 className="h-6 w-6" />
            <span>Sua Marca</span>
          </Link>

          {/* Desktop Navigation */}
          {!isAdmin && (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="/properties" className="text-foreground hover:text-primary transition-colors">
                Imóveis
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                Sobre
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
                Contato
              </Link>
              <Button asChild>
                <Link to="/admin">Área Administrativa</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isAdmin && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isOpen && !isAdmin && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Início
              </Link>
              <Link
                to="/properties"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Imóveis
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sobre
              </Link>
              <Link
                to="/contact"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contato
              </Link>
              <Button asChild className="w-full">
                <Link to="/admin" onClick={() => setIsOpen(false)}>
                  Área Administrativa
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
