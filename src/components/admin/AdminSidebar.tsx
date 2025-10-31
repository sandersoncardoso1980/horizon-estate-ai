import { LayoutDashboard, Building2, Users, Calendar, FileText, TrendingUp, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const location = useLocation();

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

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 pt-20">
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
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
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
