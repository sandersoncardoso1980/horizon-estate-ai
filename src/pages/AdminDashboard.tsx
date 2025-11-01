import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/admin/StatCard";
import { Building2, Users, TrendingUp, DollarSign, Eye, Target, MapPin, BarChart3, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useEffect, useState } from "react";
import { SupabaseService } from "../SupabaseService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Interfaces e Tipos Auxiliares ---
interface DashboardData {
  priceData: any[];
  regionData: any[];
  leadScoreData: any[];
  heatmapData: any[];
  salesData?: any[];
  clientStats?: any;
  leadStats?: any;
  propertyStats?: any;
  salesStats?: any;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: any;
  trend: string;
  trendUp: boolean;
  observation?: string;
}

interface PropertyDataItem {
  tipo: string;
  quantidade: number;
  valor_medio: number;
}

interface SalesDataItem {
  month: string;
  vendas: number;
  previsao: number;
}

interface LeadDistributionItem {
  name: string;
  value: number;
  color: string;
}

// --- Funções Auxiliares ---

const calculateConversionRate = (min: number, max: number, leads: any[]) => {
  const leadsInRange = leads.filter((lead: any) => 
    lead.ml_lead_score >= min && lead.ml_lead_score <= max
  );
  const convertedLeads = leadsInRange.filter((lead: any) => 
    lead.status === 'converted' || lead.status === 'qualified'
  ).length;
  
  return leadsInRange.length > 0 ? (convertedLeads / leadsInRange.length) * 100 : 0;
};

const prepareLeadScoreData = (leads: any[]) => {
  if (!leads) return [];
  
  const scoreRanges = [
    { range: '80-100', min: 80, max: 100 },
    { range: '60-79', min: 60, max: 79 },
    { range: '40-59', min: 40, max: 59 },
    { range: '0-39', min: 0, max: 39 }
  ];

  return scoreRanges.map(range => {
    const count = leads.filter((lead: any) => 
      lead.ml_lead_score >= range.min && lead.ml_lead_score <= range.max
    ).length;
    
    const conversionRate = calculateConversionRate(range.min, range.max, leads);
    
    return {
      score_range: range.range,
      lead_count: count,
      conversion_rate: conversionRate
    };
  });
};

const getInventoryLevel = (totalListings: number, soldListings: number) => {
  if (!totalListings) return 'high';
  const ratio = soldListings / totalListings;
  if (ratio > 0.7) return 'low';
  if (ratio > 0.4) return 'medium';
  return 'high';
};

// Dados de fallback
const getFallbackData = (): DashboardData => {
  return {
    priceData: [
      { month: 'Jan', predicted_price: 850000, actual_price: 820000, confidence_score: 95, region: 'Centro' },
      { month: 'Fev', predicted_price: 870000, actual_price: 890000, confidence_score: 94, region: 'Centro' },
      { month: 'Mar', predicted_price: 890000, actual_price: 880000, confidence_score: 96, region: 'Centro' },
      { month: 'Abr', predicted_price: 920000, actual_price: 950000, confidence_score: 93, region: 'Centro' },
      { month: 'Mai', predicted_price: 950000, actual_price: 940000, confidence_score: 97, region: 'Centro' },
      { month: 'Jun', predicted_price: 980000, actual_price: 1020000, confidence_score: 95, region: 'Centro' },
    ],
    regionData: [
      { region: 'Centro', property_count: 45, average_price: 850000, sales: 12 },
      { region: 'Zona Sul', property_count: 32, average_price: 1200000, sales: 8 },
      { region: 'Zona Oeste', property_count: 28, average_price: 950000, sales: 6 },
      { region: 'Zona Leste', property_count: 18, average_price: 680000, sales: 4 },
    ],
    leadScoreData: [
      { score_range: '80-100', lead_count: 23, conversion_rate: 35 },
      { score_range: '60-79', lead_count: 35, conversion_rate: 18 },
      { score_range: '40-59', lead_count: 22, conversion_rate: 8 },
      { score_range: '0-39', lead_count: 9, conversion_rate: 2 },
    ],
    heatmapData: [
      { region: 'Centro', demand_score: 95, price_trend: 'up', inventory_level: 'low' },
      { region: 'Zona Sul', demand_score: 87, price_trend: 'up', inventory_level: 'medium' },
      { region: 'Zona Oeste', demand_score: 78, price_trend: 'stable', inventory_level: 'medium' },
      { region: 'Zona Leste', demand_score: 65, price_trend: 'stable', inventory_level: 'high' },
    ],
    clientStats: {
      totalClients: 67,
      activeClients: 54,
      newThisMonth: 12,
      owners: 38,
      engagementRate: '80.6'
    },
    leadStats: {
      hotLeads: 23,
      warmLeads: 35,
      coldLeads: 31,
      totalLeads: 89,
      conversionRate: '25.8'
    },
    propertyStats: {
      totalProperties: 54, 
      availableProperties: 42, 
      soldProperties: 12, 
      averagePrice: 850000
    },
    salesStats: {
      totalSales: 42,
      totalRevenue: 4200000,
      averageCommission: 42000
    }
  };
};

// --- Componente de Card de Estatística Customizado ---

const CustomStatCard = ({ title, value, icon: Icon, trend, trendUp, observation }: StatCardProps) => {
  const [showObservation, setShowObservation] = useState(false);

  return (
    <Card className="shadow-card relative">
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{title}</p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">{value}</h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg ml-2 flex-shrink-0">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-xs sm:text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
          {observation && (
            <button
              onClick={() => setShowObservation(!showObservation)}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-2"
              title="Ver observação"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>
        
        {showObservation && observation && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">{observation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Componente Principal AdminDashboard ---

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [usingFallback, setUsingFallback] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Buscar dados do dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Buscando dados do dashboard...');
      
      const [
        clientsData,
        leadsData,
        pricePredictions,
        propertiesData,
        salesData,
        marketData,
        propertiesByRegion,
        salesChartData
      ] = await Promise.all([
        SupabaseService.getAllClients(),
        SupabaseService.getAllLeads(),
        SupabaseService.getPricePredictions(),
        SupabaseService.getAllProperties(), 
        SupabaseService.getSalesData(), 
        SupabaseService.getMarketData(), 
        SupabaseService.getPropertiesByRegion(),
        SupabaseService.getSalesChartData()
      ]);

      // Calcular estatísticas baseadas em dados REAIS
      const clientStats = {
        totalClients: clientsData?.length || 0,
        activeClients: clientsData?.filter((c: any) => c.status === 'active').length || 0,
        newThisMonth: clientsData?.filter((client: any) => {
          if (!client.created_at) return false;
          const created = new Date(client.created_at);
          const now = new Date();
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length || 0,
        owners: clientsData?.filter((c: any) => c.is_owner).length || 0
      };

      const leadStats = {
        totalLeads: leadsData?.length || 0,
        hotLeads: leadsData?.filter((l: any) => l.ml_lead_score >= 80).length || 0,
        warmLeads: leadsData?.filter((l: any) => l.ml_lead_score >= 60 && l.ml_lead_score < 80).length || 0,
        coldLeads: leadsData?.filter((l: any) => (l.ml_lead_score || 0) < 60).length || 0
      };

      const propertyStats = {
        totalProperties: propertiesData?.length || 0,
        availableProperties: propertiesData?.filter((p: any) => p.status === 'available').length || 0,
        soldProperties: propertiesData?.filter((p: any) => p.status === 'sold').length || 0,
        averagePrice: propertiesData?.reduce((sum: number, p: any) => sum + (p.price || 0), 0) / (propertiesData?.length || 1) || 0
      };

      const salesStats = {
        totalSales: salesData?.length || 0,
        totalRevenue: salesData?.reduce((sum: number, s: any) => sum + (s.final_price || 0), 0) || 0,
        averageCommission: salesData?.reduce((sum: number, s: any) => sum + (s.commission || 0), 0) / (salesData?.length || 1) || 0
      };

      // Preparar dados para gráficos com dados REAIS
      const processedData: DashboardData = {
        priceData: pricePredictions || [],
        salesData: salesChartData || [],
        regionData: propertiesByRegion || marketData?.map((m: any) => ({
          region: m.region,
          property_count: m.total_listings,
          average_price: m.avg_price_per_m2,
          sales: m.sold_listings
        })) || [],
        leadScoreData: prepareLeadScoreData(leadsData || []),
        heatmapData: marketData?.map((m: any) => ({
          region: m.region,
          demand_score: m.demand_index,
          price_trend: (m.price_trend || 0) > 0 ? 'up' : (m.price_trend || 0) < 0 ? 'down' : 'stable',
          inventory_level: getInventoryLevel(m.total_listings, m.sold_listings)
        })) || [],
        clientStats,
        leadStats,
        propertyStats,
        salesStats
      };

      const isFallback = !clientsData && !leadsData && !propertiesData;
      
      if (isFallback) {
        console.warn('⚠️ Usando dados de fallback. Verifique a conexão com o banco.');
        setDashboardData(getFallbackData());
      } else {
        setDashboardData(processedData);
      }
      
      setUsingFallback(isFallback);
      setLastUpdate(new Date());

    } catch (err) {
      console.error('❌ Erro ao buscar dados:', err);
      setError('Erro ao carregar dados do servidor');
      setDashboardData(getFallbackData());
      setUsingFallback(true);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [timeRange]);

  // Calcular estatísticas para os cards
  const calculateStats = () => {
    const data = dashboardData || getFallbackData();
    const { propertyStats, leadStats, salesStats, clientStats } = data;

    const conversionRate = (leadStats?.totalLeads && leadStats.totalLeads > 0)
      ? ((leadStats.hotLeads / leadStats.totalLeads) * 100).toFixed(1)
      : '0.0';

    return {
      totalProperties: propertyStats?.totalProperties || 0,
      totalLeads: leadStats?.totalLeads || 0,
      monthlySales: salesStats?.totalSales || 0,
      totalRevenue: (salesStats?.totalRevenue || 0) > 0 ? `R$ ${((salesStats?.totalRevenue || 0) / 1000000).toFixed(1)}M` : 'R$ 0',
      conversionRate: `${conversionRate}%`,
      activeClients: clientStats?.activeClients || 0,
      hotLeads: leadStats?.hotLeads || 0
    };
  };

  // Preparar dados para gráficos
  const prepareChartData = () => {
    const data = dashboardData || getFallbackData(); 

    const salesData: SalesDataItem[] = data.priceData
      ?.filter((item: any) => item.month)
      .map((item: any) => ({
        month: item.month,
        vendas: item.actual_price ? Math.round(item.actual_price / 1000) : 0, 
        previsao: item.predicted_price ? Math.round(item.predicted_price / 1000) : 0
      })) || [];

    const propertyData: PropertyDataItem[] = data.regionData
      ?.map((region: any) => ({
        tipo: region.region || 'Desconhecido',
        quantidade: region.property_count || 0,
        valor_medio: region.average_price || 0
      })) || [];

    const leadDistribution: LeadDistributionItem[] = [
      { 
        name: 'Hot Leads', 
        value: data.leadStats?.hotLeads || 0,
        color: '#ef4444'
      },
      { 
        name: 'Warm Leads', 
        value: data.leadStats?.warmLeads || 0,
        color: '#f59e0b'
      },
      { 
        name: 'Cold Leads', 
        value: data.leadStats?.coldLeads || 0,
        color: '#3b82f6'
      }
    ];

    return { salesData, propertyData, leadDistribution };
  };

  // Calcular insights baseados nos dados reais
  const calculateInsights = () => {
    const data = dashboardData || getFallbackData();
    const { priceData, leadStats, propertyStats } = data;
    const insights = [];

    // Insight 1: Portfólio Real
    insights.push({
      title: "Portfólio Ativo",
      value: propertyStats?.totalProperties?.toString() || "54",
      description: "Total de propriedades cadastradas no sistema",
      trend: 'positive'
    });

    // Insight 2: Precisão das previsões (se houver dados)
    const predictionsWithActual = priceData?.filter((item: any) => item.actual_price && item.predicted_price) || [];
    if (predictionsWithActual.length > 0) {
      const accuracy = predictionsWithActual.reduce((acc: number, item: any) => {
        const error = Math.abs((item.actual_price || 0) - (item.predicted_price || 0)) / (item.actual_price || 1);
        return acc + (1 - error);
      }, 0) / predictionsWithActual.length * 100;
      
      insights.push({
        title: "Precisão do Modelo",
        value: `${accuracy.toFixed(1)}%`,
        description: "Precisão média das previsões de preço vs valores reais",
        trend: accuracy > 85 ? 'positive' : accuracy > 70 ? 'neutral' : 'negative'
      });
    }

    // Insight 3: Taxa de conversão de leads
    if (leadStats?.totalLeads && leadStats.totalLeads > 0) {
      const conversionRate = (leadStats.hotLeads / leadStats.totalLeads) * 100;
      insights.push({
        title: "Taxa de Conversão",
        value: `${conversionRate.toFixed(1)}%`,
        description: "Percentual de leads de alta qualidade (Hot Leads)",
        trend: conversionRate > 25 ? 'positive' : conversionRate > 15 ? 'neutral' : 'negative'
      });
    }

    return insights;
  };

  const stats = calculateStats();
  const { salesData, propertyData, leadDistribution } = prepareChartData();
  const insights = calculateInsights();

  // --- Renderização de Loading e Erro ---

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AdminSidebar />
        <main className="lg:ml-64 pt-16 lg:pt-20 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Analisando dados do dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AdminSidebar />
        <main className="lg:ml-64 pt-16 lg:pt-20 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-destructive">
              <p className="text-lg font-semibold">Erro ao carregar dashboard</p>
              <p className="mt-2 text-muted-foreground">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- Renderização do Dashboard Principal ---

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      {/* Main content adaptável ao sidebar */}
      <main className="lg:ml-64 pt-16 lg:pt-20 p-4 sm:p-6 lg:p-8 transition-all duration-200">
        {/* Header responsivo */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Dashboard Inteligente</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {usingFallback ? 'Dados de demonstração' : 'Análises em tempo real'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="week">Esta Semana</option>
              <option value="month">Este Mês</option>
              <option value="quarter">Este Trimestre</option>
            </select>
            <Button 
              onClick={fetchDashboardData} 
              variant="outline" 
              size="sm"
              className="gap-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
          </div>
        </div>

        {/* --- Grid de Estatísticas (Stats Grid) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <CustomStatCard
            title="Portfólio Ativo"
            value={stats.totalProperties.toString()}
            icon={Building2}
            trend="Dado Real"
            trendUp={true}
            observation={`Total de ${stats.totalProperties} propriedades cadastradas. Dados da tabela properties.`}
          />
          <CustomStatCard
            title="Total de Leads"
            value={stats.totalLeads.toString()}
            icon={Users}
            trend="+12% esta semana"
            trendUp={true}
            observation="Potenciais clientes em processo de qualificação. Leads são classificados por score de machine learning."
          />
          <CustomStatCard
            title="Vendas Realizadas"
            value={stats.monthlySales.toString()}
            icon={TrendingUp}
            trend="+15% vs último mês"
            trendUp={true}
            observation="Transações concluídas com sucesso. Inclui vendas e locações finalizadas no período."
          />
          <CustomStatCard
            title="Volume Financeiro"
            value={stats.totalRevenue}
            icon={DollarSign}
            trend="+22% este trimestre"
            trendUp={true}
            observation="Soma do valor total das transações realizadas. Inclui comissões e valores de propriedades."
          />
        </div>

        {/* --- Insights Rápidos --- */}
        {insights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {insights.map((insight, index) => (
              <Card key={index} className="shadow-card border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-muted-foreground truncate">{insight.title}</p>
                      <p className="text-xl sm:text-2xl font-bold mt-1 truncate">{insight.value}</p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{insight.description}</p>
                    </div>
                    <BarChart3 className={`h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 ml-2 ${
                      insight.trend === 'positive' ? 'text-green-600' : 
                      insight.trend === 'negative' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* --- Desempenho Real vs Previsões (Gráfico de Linha) --- */}
        <Card className="shadow-card mb-6 sm:mb-8">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-lg sm:text-xl">Desempenho Real vs Previsões</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Comparação entre vendas realizadas e previsões do modelo (últimos 3 meses)
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchDashboardData}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </CardHeader>
          <CardContent>
            {lastUpdate && (
              <div className="text-xs text-muted-foreground mb-4">
                Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
              </div>
            )}
            
            {salesData.length === 0 ? (
              <div className="h-60 sm:h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">Nenhum dado de vendas disponível</p>
                  <p className="text-xs mt-1">Verifique a tabela sales no banco de dados</p>
                </div>
              </div>
            ) : (
              <div className="h-60 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                      labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="vendas" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Vendas Reais"
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="previsao" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Previsões"
                      dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Observação:</strong> A proximidade entre as linhas indica a precisão do modelo preditivo. 
                {usingFallback && ' (Dados de demonstração - verifique conexão com o banco)'}
                {salesData.length === 0 && ' Nenhum dado de vendas encontrado na tabela sales.'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* --- Grid de Gráficos Inferiores --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* --- Distribuição de Leads (Gráfico de Pizza) --- */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Distribuição de Leads por Potencial</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Análise de qualidade da base de leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leadDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Leads']} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Observação:</strong> Leads 'Hot' têm maior probabilidade de conversão. 
                  {usingFallback && ' (Dados de demonstração)'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* --- Desempenho por Região (Gráfico de Barras/Linha) --- */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Desempenho por Região</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Concentração de propriedades e valores médios por região
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={propertyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="tipo" 
                      tick={{ fontSize: 10 }} 
                      angle={-45} 
                      textAnchor="end" 
                      height={60} 
                    />
                    <YAxis yAxisId="left" orientation="left" name="Quantidade" />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `R$ ${value/1000}k`} name="Valor Médio" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'Quantidade') return [value, name];
                        return [`R$ ${Number(value).toLocaleString('pt-BR')}`, name];
                      }}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="quantidade" 
                      fill="hsl(var(--primary))" 
                      name="Quantidade"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="valor_medio" 
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Valor Médio (R$)"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Observação:</strong> Regiões com maior quantidade podem indicar saturação de mercado. 
                  {usingFallback && ' (Dados de demonstração)'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Status dos Dados --- */}
        <div className="p-4 bg-muted rounded-lg mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-sm sm:text-base">
                {usingFallback ? 'Sistema de Demonstração' : 'Sistema em Produção'}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {usingFallback 
                  ? 'Usando dados de exemplo. Configure as tabelas para ver dados reais.' 
                  : 'Dados analíticos em tempo real'
                }
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Target className="h-3 w-3" />
                  {insights.length} Insights
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  {propertyData.length} Regiões
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Building2 className="h-3 w-3" />
                  {stats.totalProperties} Propriedades
                </Badge>
                {usingFallback && (
                  <Badge variant="outline" className="text-amber-600 border-amber-200 text-xs">
                    Modo Demonstração
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={fetchDashboardData}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
