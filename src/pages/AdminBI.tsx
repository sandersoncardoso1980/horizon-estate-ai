import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Brain, Target, Sparkles, Activity, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

// Interface para os dados do backend
interface DashboardData {
  priceData: Array<{
    month: string;
    previsto: number;
    real: number | null;
    confianca: number;
  }>;
  regionData: Array<{
    region: string;
    value: number;
    growth: number;
  }>;
  searchData: Array<{
    property: string;
    views: number;
    conversao: number;
  }>;
  leadScoreData: Array<{
    score: string;
    quantidade: number;
    conversao: number;
  }>;
  heatmapData: Array<{
    zona: string;
    periodo: string;
    demanda: number;
  }>;
  performanceData: Array<{
    categoria: string;
    valor: number;
    meta: number;
  }>;
  conversionFunnel: Array<{
    stage: string;
    total: number;
    leads: number;
  }>;
}

const AdminBI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [dataSource, setDataSource] = useState<'backend' | 'mock'>('mock');

  // Dados mock como fallback
  const mockData: DashboardData = {
    priceData: [
      { month: 'Jan', previsto: 850000, real: 820000, confianca: 95 },
      { month: 'Fev', previsto: 870000, real: 890000, confianca: 94 },
      { month: 'Mar', previsto: 890000, real: 880000, confianca: 96 },
      { month: 'Abr', previsto: 920000, real: 950000, confianca: 93 },
      { month: 'Mai', previsto: 950000, real: 940000, confianca: 97 },
      { month: 'Jun', previsto: 980000, real: 1020000, confianca: 95 },
      { month: 'Jul', previsto: 1010000, real: null, confianca: 92 },
      { month: 'Ago', previsto: 1040000, real: null, confianca: 89 },
    ],
    regionData: [
      { region: 'Centro', value: 35, growth: 12 },
      { region: 'Zona Sul', value: 28, growth: 8 },
      { region: 'Zona Norte', value: 20, growth: -3 },
      { region: 'Zona Oeste', value: 17, growth: 5 },
    ],
    searchData: [
      { property: 'AP001 - Apartamento Centro', views: 245, conversao: 18 },
      { property: 'CS002 - Casa Alphaville', views: 198, conversao: 22 },
      { property: 'LF003 - Loft Vila Madalena', views: 176, conversao: 15 },
      { property: 'AP004 - Cobertura Duplex', views: 154, conversao: 25 },
      { property: 'TE005 - Terreno Comercial', views: 132, conversao: 8 },
    ],
    leadScoreData: [
      { score: '0-20', quantidade: 15, conversao: 2 },
      { score: '21-40', quantidade: 23, conversao: 5 },
      { score: '41-60', quantidade: 35, conversao: 12 },
      { score: '61-80', quantidade: 28, conversao: 18 },
      { score: '81-100', quantidade: 18, conversao: 28 },
    ],
    heatmapData: [
      { zona: 'Centro', periodo: 'Manhã', demanda: 85 },
      { zona: 'Centro', periodo: 'Tarde', demanda: 95 },
      { zona: 'Centro', periodo: 'Noite', demanda: 70 },
      { zona: 'Zona Sul', periodo: 'Manhã', demanda: 75 },
      { zona: 'Zona Sul', periodo: 'Tarde', demanda: 88 },
      { zona: 'Zona Sul', periodo: 'Noite', demanda: 92 },
      { zona: 'Zona Norte', periodo: 'Manhã', demanda: 60 },
      { zona: 'Zona Norte', periodo: 'Tarde', demanda: 65 },
      { zona: 'Zona Norte', periodo: 'Noite', demanda: 55 },
      { zona: 'Zona Oeste', periodo: 'Manhã', demanda: 70 },
      { zona: 'Zona Oeste', periodo: 'Tarde', demanda: 78 },
      { zona: 'Zona Oeste', periodo: 'Noite', demanda: 72 },
    ],
    performanceData: [
      { categoria: 'Preço', valor: 92, meta: 85 },
      { categoria: 'Localização', valor: 88, meta: 80 },
      { categoria: 'Tamanho', valor: 85, meta: 75 },
      { categoria: 'Condição', valor: 90, meta: 85 },
      { categoria: 'Amenidades', valor: 78, meta: 70 },
    ],
    conversionFunnel: [
      { stage: 'Visualizações', total: 2450, leads: 0 },
      { stage: 'Interesse', total: 892, leads: 0 },
      { stage: 'Visitas', total: 423, leads: 0 },
      { stage: 'Propostas', total: 156, leads: 0 },
      { stage: 'Fechamentos', total: 48, leads: 0 },
    ]
  };

  // Buscar dados do backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Buscando dados do backend...');
      
      const response = await fetch('http://localhost:5000/api/bi/dashboard-data');
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log('✅ Dados recebidos do backend:', result.data);
        setDashboardData(result.data);
        setDataSource('backend');
        setLastUpdate(new Date(result.lastUpdated));
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar dados do backend:', error);
      console.log('🔄 Usando dados mock...');
      setDashboardData(mockData);
      setDataSource('mock');
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Usar dados do backend ou mock como fallback
  const data = dashboardData || mockData;

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted-foreground))'];
  
  const getHeatColor = (value: number) => {
    if (value >= 85) return '#10B981';
    if (value >= 70) return '#3B82F6';
    if (value >= 55) return '#F59E0B';
    return '#EF4444';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AdminSidebar />
        <main className="lg:ml-64 pt-16 lg:pt-20 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Carregando Business Intelligence</h2>
              <p className="text-muted-foreground">Conectando ao backend de dados...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      
      <main className="lg:ml-64 pt-16 lg:pt-20 p-4 sm:p-6 lg:p-8">
        {/* Header responsivo */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                Business Intelligence
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">Insights avançados com Machine Learning</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Badge 
                variant={dataSource === 'backend' ? "default" : "outline"} 
                className="gap-2 px-3 py-2 text-xs sm:text-sm w-full sm:w-auto justify-center"
              >
                {dataSource === 'backend' ? (
                  <>
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                    Dados em Tempo Real
                  </>
                ) : (
                  <>
                    <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                    Dados de Demonstração
                  </>
                )}
              </Badge>
              <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto justify-center"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </button>
            </div>
          </div>
          
          {/* Status do Data Source */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <span className={`font-medium text-xs sm:text-sm ${dataSource === 'backend' ? 'text-green-600' : 'text-amber-600'}`}>
                  {dataSource === 'backend' ? '✅ Conectado ao Backend' : '🔄 Usando Dados de Demonstração'}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Última atualização: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              {dataSource === 'mock' && (
                <button 
                  onClick={fetchDashboardData}
                  className="text-primary hover:underline text-xs sm:text-sm"
                >
                  Tentar reconectar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ML Insights Cards - Responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="shadow-card bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Tendência de Preço
                  </p>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">+4.2%</h3>
                  <p className="text-xs sm:text-sm text-secondary flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    Alta prevista (92% confiança)
                  </p>
                </div>
                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg ml-2 flex-shrink-0">
                  <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Previsão de Vendas
                  </p>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">32</h3>
                  <p className="text-xs sm:text-sm text-secondary flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    Próximo mês (+18%)
                  </p>
                </div>
                <div className="bg-secondary/10 p-2 sm:p-3 rounded-lg ml-2 flex-shrink-0">
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Taxa de Conversão
                  </p>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">18.5%</h3>
                  <p className="text-xs sm:text-sm text-secondary flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    +2.3% vs anterior
                  </p>
                </div>
                <div className="bg-accent/10 p-2 sm:p-3 rounded-lg ml-2 flex-shrink-0">
                  <Target className="h-4 w-4 sm:h-6 sm:w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Score Médio Leads
                  </p>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">74.3</h3>
                  <p className="text-xs sm:text-sm text-secondary flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    Qualidade alta
                  </p>
                </div>
                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg ml-2 flex-shrink-0">
                  <Brain className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Different Analyses - Responsivo */}
        <Tabs defaultValue="predictions" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="predictions" className="text-xs sm:text-sm py-2 sm:py-3">
              Previsões
            </TabsTrigger>
            <TabsTrigger value="heatmaps" className="text-xs sm:text-sm py-2 sm:py-3">
              Mapas de Calor
            </TabsTrigger>
            <TabsTrigger value="leads" className="text-xs sm:text-sm py-2 sm:py-3">
              Score de Leads
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs sm:text-sm py-2 sm:py-3">
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Previsão de Preço (Machine Learning)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data.priceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="previsto" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.2} 
                          name="Previsto (IA)" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="real" 
                          stroke="hsl(var(--secondary))" 
                          strokeWidth={3}
                          name="Real" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="confianca" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Confiança (%)" 
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Funil de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.conversionFunnel}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stage" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="total" fill="hsl(var(--primary))" name="Total" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {data.conversionFunnel.map((item, idx) => {
                      const conversion = idx > 0 ? ((item.total / data.conversionFunnel[idx - 1].total) * 100).toFixed(1) : 100;
                      return (
                        <div key={item.stage} className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground truncate">{item.stage}</span>
                          <span className="font-semibold">{conversion}%</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Imóveis Mais Buscados vs Taxa de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data.searchData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" fontSize={12} />
                        <YAxis 
                          dataKey="property" 
                          type="category" 
                          width={120}
                          fontSize={10}
                          tick={{ fontSize: 10 }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" fill="hsl(var(--primary))" name="Visualizações" />
                        <Line 
                          dataKey="conversao" 
                          stroke="hsl(var(--secondary))" 
                          strokeWidth={3}
                          name="Conversão (%)" 
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Crescimento por Região</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.regionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="hsl(var(--primary))" name="Demanda Atual" />
                        <Bar dataKey="growth" fill="hsl(var(--secondary))" name="Crescimento (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Heatmaps Tab */}
          <TabsContent value="heatmaps" className="space-y-4 sm:space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Mapa de Calor - Demanda por Região e Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  {['Centro', 'Zona Sul', 'Zona Norte', 'Zona Oeste'].map((zona) => (
                    <div key={zona}>
                      <h4 className="font-semibold mb-3 text-sm sm:text-base">{zona}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {data.heatmapData
                          .filter((item) => item.zona === zona)
                          .map((item) => (
                            <div
                              key={`${item.zona}-${item.periodo}`}
                              className="p-4 sm:p-6 rounded-lg text-center transition-all hover:scale-105"
                              style={{
                                backgroundColor: getHeatColor(item.demanda),
                                color: 'white',
                              }}
                            >
                              <p className="text-xs sm:text-sm font-medium opacity-90">{item.periodo}</p>
                              <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{item.demanda}</p>
                              <p className="text-xs opacity-75 mt-1">demanda</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: '#EF4444' }} />
                    <span>Baixa (0-54)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: '#F59E0B' }} />
                    <span>Média (55-69)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: '#3B82F6' }} />
                    <span>Alta (70-84)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: '#10B981' }} />
                    <span>Muito Alta (85+)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Distribuição de Demanda Regional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.regionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lead Score Tab */}
          <TabsContent value="leads" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Distribuição de Score de Leads (IA)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.leadScoreData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="score" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="quantidade" fill="hsl(var(--primary))" name="Quantidade de Leads" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Taxa de Conversão por Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.leadScoreData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="score" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="conversao" 
                          stroke="hsl(var(--secondary))" 
                          strokeWidth={3}
                          name="Taxa de Conversão (%)" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-3 sm:p-4 bg-secondary/10 rounded-lg">
                    <p className="text-sm font-medium">Insight ML:</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Leads com score acima de 80 têm 28% de taxa de conversão, 14x maior que scores baixos. 
                      Recomenda-se priorizar follow-up nesta faixa.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Análise Comparativa: Score vs Conversão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quantidade" name="Quantidade" fontSize={12} />
                      <YAxis dataKey="conversao" name="Conversão %" fontSize={12} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter 
                        name="Score vs Conversão" 
                        data={data.leadScoreData} 
                        fill="hsl(var(--accent))" 
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4 sm:space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Performance por Categoria (Radar ML)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data.performanceData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="categoria" fontSize={12} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar 
                        name="Desempenho Atual" 
                        dataKey="valor" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.5} 
                      />
                      <Radar 
                        name="Meta" 
                        dataKey="meta" 
                        stroke="hsl(var(--secondary))" 
                        fill="hsl(var(--secondary))" 
                        fillOpacity={0.3} 
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-secondary/10 rounded-lg">
                    <p className="text-xs sm:text-sm font-medium text-secondary">Top Performer</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">Preço (92%)</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-primary/10 rounded-lg">
                    <p className="text-xs sm:text-sm font-medium text-primary">Acima da Meta</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">4 de 5</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-accent/10 rounded-lg">
                    <p className="text-xs sm:text-sm font-medium text-accent">Melhoria Necessária</p>
                    <p className="text-lg sm:text-2xl font-bold mt-1">Amenidades</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminBI;
