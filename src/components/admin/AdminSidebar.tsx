import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Settings,
  Menu,
  X,
  Home
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AdminSidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Building2, label: "Imóveis", path: "/admin/properties" },
    { icon: Users, label: "Leads", path: "/admin/leads" },
    { icon: Users, label: "Clientes", path: "/admin/clients" },
    { icon: Calendar, label: "Visitas", path: "/admin/visits" },
    { icon: FileText, label: "Contratos", path: "/admin/contracts" },
    { icon: TrendingUp, label: "BI & Analytics", path: "/admin/bi" },
    { icon: Settings, label: "Configurações", path: "/admin/settings" },
  ];

  // Conteúdo do sidebar (reutilizável para desktop e mobile)
  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="space-y-1 p-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
      
      {/* Separador e link para Landing Page */}
      <div className="border-t border-border my-2 pt-4">
        <Link
          to="/"
          onClick={onItemClick}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
            "hover:bg-muted text-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">Início (Landing Page)</span>
        </Link>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar (oculto em mobile) */}
      <aside className="hidden lg:block w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 pt-20">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="h-10 w-10"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          {/* Overlay de fundo */}
          <div 
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Sidebar mobile */}
          <aside 
            className="lg:hidden fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 shadow-lg"
            role="dialog"
            aria-label="Menu de Navegação do Administrador"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Menu Admin</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMobileOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                <SidebarContent onItemClick={() => setIsMobileOpen(false)} />
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default AdminSidebar;
