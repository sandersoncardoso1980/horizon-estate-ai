import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/admin/StatCard";
import { Building2, Users, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const salesData = [
    { month: 'Jan', vendas: 12 },
    { month: 'Fev', vendas: 19 },
    { month: 'Mar', vendas: 15 },
    { month: 'Abr', vendas: 25 },
    { month: 'Mai', vendas: 22 },
    { month: 'Jun', vendas: 30 },
  ];

  const propertyData = [
    { tipo: 'Apartamento', quantidade: 45 },
    { tipo: 'Casa', quantidade: 32 },
    { tipo: 'Terreno', quantidade: 18 },
    { tipo: 'Comercial', quantidade: 12 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema imobiliário</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Imóveis"
            value="127"
            icon={Building2}
            trend="+12% este mês"
            trendUp={true}
          />
          <StatCard
            title="Leads Ativos"
            value="43"
            icon={Users}
            trend="+8% esta semana"
            trendUp={true}
          />
          <StatCard
            title="Vendas Este Mês"
            value="30"
            icon={TrendingUp}
            trend="+18% vs. mês anterior"
            trendUp={true}
          />
          <StatCard
            title="Receita Total"
            value="R$ 2.8M"
            icon={DollarSign}
            trend="+25% este trimestre"
            trendUp={true}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Vendas Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="vendas" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Imóveis por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={propertyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
