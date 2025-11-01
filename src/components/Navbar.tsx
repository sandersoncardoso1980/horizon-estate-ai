// Navbar.tsx - VERSÃO FINAL CORRIGIDA (texto visível em telas grandes)
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  // Corrigido: logo só some quando o menu mobile abre (fora do admin)
  const shouldHideLogo = isOpen && !isAdmin;

  return (
    <>
      {/* NAVBAR PRINCIPAL */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* LOGO */}
            {!shouldHideLogo && (
              <Link
                to="/"
                className="flex items-center gap-2 text-primary font-bold text-xl transition-all duration-300"
              >
                <Building2 className="h-6 w-6" />
                {/* Texto some apenas em mobile */}
                <span className="hidden sm:inline">Sua Marca</span>
              </Link>
            )}

            {/* Espaço vazio quando o logo está escondido */}
            {shouldHideLogo && <div className="w-40" />}

            {/* DESKTOP NAV (fora do admin) */}
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
                  <Link to="/admin">Área Admin</Link>
                </Button>
              </div>
            )}

            {/* BOTÃO MOBILE */}
            {!isAdmin && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MENU MOBILE */}
      {isOpen && !isAdmin && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 bg-card border-l border-border shadow-2xl z-50 md:hidden">
            <div className="p-8 space-y-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-primary">Menu</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-muted">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="space-y-4 flex-1">
                <Link to="/" onClick={() => setIsOpen(false)} className="block py-3 px-4 rounded-xl text-xl font-semibold hover:bg-primary/10 transition-all">
                  Início
                </Link>
                <Link to="/properties" onClick={() => setIsOpen(false)} className="block py-3 px-4 rounded-xl text-xl font-semibold hover:bg-primary/10 transition-all">
                  Imóveis
                </Link>
                <Link to="/about" onClick={() => setIsOpen(false)} className="block py-3 px-4 rounded-xl text-xl font-semibold hover:bg-primary/10 transition-all">
                  Sobre
                </Link>
                <Link to="/contact" onClick={() => setIsOpen(false)} className="block py-3 px-4 rounded-xl text-xl font-semibold hover:bg-primary/10 transition-all">
                  Contato
                </Link>
              </nav>

              <Button asChild className="w-full text-xl h-14 mt-auto">
                <Link to="/admin" onClick={() => setIsOpen(false)}>
                  Área Admin 🚀
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
