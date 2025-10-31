import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from "lucide-react";

const AdminBI = () => {
  const priceData = [
    { month: 'Jan', previsto: 850000, real: 820000 },
    { month: 'Fev', previsto: 870000, real: 890000 },
    { month: 'Mar', previsto: 890000, real: 880000 },
    { month: 'Abr', previsto: 920000, real: 950000 },
    { month: 'Mai', previsto: 950000, real: 940000 },
    { month: 'Jun', previsto: 980000, real: 1020000 },
  ];

  const regionData = [
    { region: 'Centro', value: 35 },
    { region: 'Zona Sul', value: 28 },
    { region: 'Zona Norte', value: 20 },
    { region: 'Zona Oeste', value: 17 },
  ];

  const searchData = [
    { property: 'AP001 - Apartamento Centro', views: 245 },
    { property: 'CS002 - Casa Alphaville', views: 198 },
    { property: 'LF003 - Loft Vila Madalena', views: 176 },
    { property: 'AP004 - Cobertura Duplex', views: 154 },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted-foreground))'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      <main className="ml-64 pt-20 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Business Intelligence</h1>
          <p className="text-muted-foreground">Insights avançados com Machine Learning</p>
        </div>

        {/* ML Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tendência de Preço</p>
                  <h3 className="text-2xl font-bold">+4.2%</h3>
                  <p className="text-sm text-secondary flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4" />
                    Alta prevista
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Previsão de Vendas</p>
                  <h3 className="text-2xl font-bold">32</h3>
                  <p className="text-sm text-secondary flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4" />
                    Próximo mês
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Taxa de Conversão</p>
                  <h3 className="text-2xl font-bold">18.5%</h3>
                  <p className="text-sm text-secondary flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4" />
                    +2.3% vs anterior
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Previsão de Preço (ML)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="previsto" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} name="Previsto (IA)" />
                  <Area type="monotone" dataKey="real" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.3} name="Real" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Demanda por Região</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Imóveis Mais Buscados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={searchData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="property" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminBI;
