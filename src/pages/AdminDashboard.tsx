import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { 
  Building2, Users, TrendingUp, DollarSign, Target, BarChart3, 
  RefreshCw, Calendar, PieChart, ArrowUpRight, ArrowDownRight,
  Clock, Activity, Shield, Zap, Home, Eye, ShoppingCart, MessageCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ComposedChart, Area
} from 'recharts';
import { useEffect, useState } from "react";
import { SupabaseService } from "../../backend/SupabaseService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardData {
  properties: any[];
  clients: any[];
  leads: any[];
  sales: any[];
  priceStats: any;
  salesStats: any;
  conversionAnalysis: any;
  statusAnalysis: any;
  salesTrend: any;
  priceSegmentation: any;
  leadAnalysis: any;
  businessMetrics: any;
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: any;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  secondaryValue?: string;
}

const StatCard = ({ title, value, description, icon: Icon, trend, secondaryValue }: StatCardProps) => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold">{value}</h3>
            {trend && (
              <Badge variant={trend.isPositive ? "default" : "destructive"} className="text-xs">
                {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {trend.value}
              </Badge>
            )}
          </div>
          {secondaryValue && (
            <p className="text-xs text-muted-foreground">{secondaryValue}</p>
          )}
          <p className="text-xs text-muted-foreground max-w-[200px]">{description}</p>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Buscando dados do sistema...');
      const result = await SupabaseService.getDashboardData();
      
      if (result.success && result.data) {
        setDashboardData(result.data);
        setLastUpdate(new Date(result.lastUpdated));
      } else {
        throw new Error(result.error || 'Não foi possível conectar ao sistema');
      }
    } catch (err) {
      console.error('❌ Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro de conexão com o sistema');
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Função para formatar valores em reais de forma amigável
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)} mi`;
    }
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)} mil`;
    }
    return `R$ ${value}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AdminSidebar />
        <main className="lg:ml-64 pt-16 lg:pt-20 p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Analisando seus dados</h2>
              <p className="text-muted-foreground">Preparando seus relatórios...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AdminSidebar />
        <main className="lg:ml-64 pt-16 lg:pt-20 p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-md">
              <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-destructive">Sistema Indisponível</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <p>• Verifique sua conexão com a internet</p>
                <p>• Tente novamente em alguns instantes</p>
                <p>• Entre em contato com o suporte se o problema persistir</p>
              </div>
              <Button onClick={fetchDashboardData} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const {
    properties,
    clients,
    leads,
    sales,
    priceStats,
    salesStats,
    conversionAnalysis,
    statusAnalysis,
    salesTrend,
    priceSegmentation,
    leadAnalysis,
    businessMetrics
  } = dashboardData;

  // Dados para gráficos
  const priceSegmentationData = priceSegmentation || [];
  const leadScoreData = leadAnalysis?.scoreRanges || [];
  const statusData = Object.entries(statusAnalysis).map(([status, data]: [string, any]) => ({
    status: status === 'available' ? 'Disponível' : 
            status === 'sold' ? 'Vendido' : 
            status === 'reserved' ? 'Reservado' : status,
    count: data.count,
    value: data.totalValue
  }));

  // Insights em linguagem simples
  const getMarketInsight = () => {
    if (!salesTrend) return "Analisando tendências do mercado...";
    
    if (salesTrend.trend === 'alta' && salesTrend.strength === 'forte') {
      return "Ótimo momento! O mercado está em alta consistente.";
    } else if (salesTrend.trend === 'alta') {
      return "Mercado em crescimento. Oportunidades aparecendo.";
    } else if (salesTrend.trend === 'baixa') {
      return "Mercado desaquecido. Foque em diferenciais competitivos.";
    } else {
      return "Mercado estável. Mantenha a estratégia atual.";
    }
  };

  const getPortfolioInsight = () => {
    const availableCount = statusAnalysis['available']?.count || 0;
    const totalCount = properties.length;
    
    if (availableCount === 0) return "Estoque esgotado! Cadastre novos imóveis.";
    if (availableCount / totalCount < 0.3) return "Estoque baixo. Considere novas captações.";
    if (availableCount / totalCount > 0.7) return "Estoque alto. Foque em vendas.";
    return "Estoque equilibrado. Bom trabalho!";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      <main className="lg:ml-64 pt-16 lg:pt-20 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel de Controle</h1>
            <p className="text-muted-foreground">
              Visão geral do seu negócio em tempo real
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdate && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
              </Badge>
            )}
            <Button onClick={fetchDashboardData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Alertas e Insights Imediatos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Visão do Mercado</h3>
                  <p className="text-sm text-blue-700">
                    {getMarketInsight()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Home className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Situação do Estoque</h3>
                  <p className="text-sm text-green-700">
                    {getPortfolioInsight()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Imóveis"
            value={properties.length.toString()}
            description="Imóveis cadastrados no sistema"
            icon={Building2}
            trend={{
              value: "+2 esta semana",
              isPositive: true
            }}
          />
          
          <StatCard
            title="Clientes Ativos"
            value={clients.length.toString()}
            description="Pessoas interessadas em comprar"
            icon={Users}
            secondaryValue={`${leads.length} novos contatos`}
          />
          
          <StatCard
            title="Vendas Realizadas"
            value={sales.length.toString()}
            description="Negócios fechados com sucesso"
            icon={ShoppingCart}
            trend={{
              value: "+1 este mês",
              isPositive: true
            }}
          />
          
          <StatCard
            title="Valor em Estoque"
            value={formatCurrency(businessMetrics.totalInventoryValue)}
            description="Valor total dos imóveis disponíveis"
            icon={DollarSign}
          />
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribuição por Preço */}
          <Card>
            <CardHeader>
              <CardTitle>Imóveis por Faixa de Preço</CardTitle>
              <CardDescription>
                Como seus imóveis estão distribuídos por valor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {priceSegmentationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priceSegmentationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'count') return [value, 'Quantidade de imóveis'];
                        if (name === 'average') return [formatCurrency(Number(value)), 'Preço médio'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))" 
                      name="Quantidade de imóveis"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground">Aguardando dados dos imóveis</p>
                </div>
              )}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Dica:</strong> {priceSegmentationData[0]?.range === 'Econômico' ? 
                  'Foque em economizar custos nos imóveis de menor valor' : 
                  'Invista em melhorias nos imóveis de maior valor'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status dos Imóveis */}
          <Card>
            <CardHeader>
              <CardTitle>Situação dos Imóveis</CardTitle>
              <CardDescription>
                Quantos estão disponíveis, vendidos ou reservados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {statusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.status === 'Disponível' ? '#10B981' :
                            entry.status === 'Vendido' ? '#EF4444' :
                            entry.status === 'Reservado' ? '#F59E0B' : '#6B7280'
                          } 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'imóveis']} />
                  </RePieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground">Aguardando dados de status</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Métricas de Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tempo no Mercado
              </CardTitle>
              <CardDescription>
                Quanto tempo os imóveis ficam disponíveis até vender
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-primary mb-2">
                  {businessMetrics.avgDaysOnMarket} dias
                </div>
                <p className="text-muted-foreground">
                  Tempo médio para vender um imóvel
                </p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    {businessMetrics.avgDaysOnMarket < 30 ? 
                      "Excelente! Seus imóveis estão vendendo rápido." :
                      businessMetrics.avgDaysOnMarket < 60 ?
                      "Bom tempo de venda. Pode melhorar com ajustes de preço." :
                      "Tempo alto. Reveja preços e estratégias de divulgação."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Conversão de Clientes
              </CardTitle>
              <CardDescription>
                Quantos contatos se tornam clientes de verdade
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conversionAnalysis ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {conversionAnalysis.conversionRate}%
                    </div>
                    <p className="text-muted-foreground">
                      dos contatos fecham negócio
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="font-semibold">{conversionAnalysis.convertedLeads}</p>
                      <p className="text-muted-foreground">Clientes conquistados</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="font-semibold">{conversionAnalysis.totalLeads}</p>
                      <p className="text-muted-foreground">Total de contatos</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center">
                  <p className="text-muted-foreground">Aguardando dados de conversão</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumo Executivo */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Seu Negócio</CardTitle>
            <CardDescription>
              Visão geral da performance atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Estoque</h4>
                </div>
                <p>Disponíveis: {statusAnalysis['available']?.count || 0}</p>
                <p>Vendidos: {statusAnalysis['sold']?.count || 0}</p>
                <p>Total: {properties.length}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Pessoas</h4>
                </div>
                <p>Clientes: {clients.length}</p>
                <p>Novos contatos: {leads.length}</p>
                <p>Taxa de sucesso: {conversionAnalysis?.conversionRate || 0}%</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Valores</h4>
                </div>
                <p>Preço médio: {formatCurrency(priceStats?.mean || 0)}</p>
                <p>Maior valor: {formatCurrency(priceStats?.max || 0)}</p>
                <p>Menor valor: {formatCurrency(priceStats?.min || 0)}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Performance</h4>
                </div>
                <p>Tempo de venda: {businessMetrics.avgDaysOnMarket} dias</p>
                <p>Velocidade: {businessMetrics.salesVelocity}/dia</p>
                <p>Eficiência: {businessMetrics.marketEfficiency.toFixed(0)}%</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Próximos Passos Sugeridos:</h4>
              <div className="text-sm text-green-700 space-y-1">
                {properties.length === 0 && <p>• Cadastre seu primeiro imóvel para começar</p>}
                {statusAnalysis['available']?.count === 0 && <p>• Adicione mais imóveis ao estoque</p>}
                {conversionAnalysis?.conversionRate < 10 && <p>• Melhore seu processo de vendas</p>}
                {businessMetrics.avgDaysOnMarket > 60 && <p>• Ajuste preços ou estratégias de divulgação</p>}
                {leads.length === 0 && <p>• Capture novos clientes em potencial</p>}
                {!properties.length && !leads.length && !clients.length && (
                  <p>• Comece cadastrando clientes e imóveis no sistema</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
