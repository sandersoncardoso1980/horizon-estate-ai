import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ComposedChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Brain, Target, Sparkles, Activity, RefreshCw, Users, 
  DollarSign, MapPin, TrendingUp, AlertTriangle, Lightbulb,
  Zap, Rocket, Shield, Eye, Home, Phone, Mail
} from "lucide-react";
import { useState, useEffect } from "react";
import { SupabaseService } from "../../backend/SupabaseService";

// Interface para a resposta da Groq
interface GroqAnalysis {
  insights: string[];
  recommendations: string[];
  risk_alerts: string[];
  market_trends: string[];
  charts: {
    type: string;
    title: string;
    description: string;
    data: any[];
  }[];
  summary: string;
}

const AdminBI = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [groqAnalysis, setGroqAnalysis] = useState<GroqAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Função para analisar dados com Groq (versão corrigida)
  const analyzeWithGroq = async (data: any) => {
    try {
      setAnalyzing(true);
      console.log('🧠 Iniciando análise com IA...');

      // Use uma variável de ambiente do Vite (import.meta.env) em vez de process.env
      const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!groqApiKey) {
        console.warn('⚠️ Chave da API Groq não encontrada. Usando análise local.');
        setGroqAnalysis(generateFallbackAnalysis(data));
        return;
      }

      const prompt = `
        Você é um corretor de imóveis sênior e experiente, com anos de estrada no mercado imobiliário. Você é eficiente, prático e sabe analisar dados rapidinho para extrair o que realmente importa, sem complicar com termos técnicos ou enrolações. Pense como um profissional que vive de fechar vendas: foque no que ajuda a vender mais, atrair clientes e evitar problemas. Sempre use uma linguagem simples, leiga, como se estivesse conversando com um amigo iniciante no ramo – evite palavras difíceis, explique tudo de forma clara e direta.
Analise estes dados de um sistema de corretagem de imóveis e forneça insights acionáveis baseados neles. Lembre-se: seja objetivo, destaque o que é positivo e o que precisa de atenção, e pense em como isso afeta o dia a dia de um corretor, como captar mais leads, vender mais rápido ou gerenciar estoque de imóveis.

        DADOS DO SISTEMA:

Total de imóveis: ${data.properties.length}
Imóveis disponíveis: ${data.statusAnalysis.available?.count || 0}
Imóveis vendidos: ${data.statusAnalysis.sold?.count || 0}
Clientes cadastrados: ${data.clients.length}
Leads/contatos: ${data.leads.length}
Vendas realizadas: ${data.sales.length}
Valor total em estoque: R$ ${data.businessMetrics.totalInventoryValue?.toLocaleString('pt-BR') || 0}
Preço médio: R$ ${data.priceStats?.mean?.toLocaleString('pt-BR') || 0}
Tempo médio de venda: ${data.businessMetrics.avgDaysOnMarket} dias
Taxa de conversão: ${data.conversionAnalysis?.conversionRate || 0}%
Tendência de vendas: ${data.salesTrend?.trend || 'estável'}

        SEGMENTAÇÃO POR PREÇO:
        ${data.priceSegmentation?.map((seg: any) => 
          `${seg.range}: ${seg.count} imóveis (${seg.percentage}%) - Média R$ ${seg.average?.toLocaleString('pt-BR')}`
        ).join('\n') || 'Nenhuma segmentação disponível'}

        ANÁLISE DE LEADS:
        ${data.leadAnalysis?.scoreRanges?.map((range: any) => 
          `Score ${range.range}: ${range.count} leads (${range.percentage}%)`
        ).join('\n') || 'Nenhuma análise de leads disponível'}

       Retorne apenas um JSON estruturado, sem texto extra fora dele. O JSON deve conter:

insights: array de 3-5 insights principais sobre o negócio – foque em pontos chave que um corretor usaria para planejar o dia, explicados de forma simples e leiga.
recommendations: array de 3-5 recomendações práticas e acionáveis – coisas que um corretor pode fazer amanhã mesmo, como "ligue para os leads com score alto e ofereça visitas virtuais".
risk_alerts: array de 2-3 alertas de risco – avise sobre possíveis problemas, como imóveis encalhados, em linguagem clara para evitar perdas.
market_trends: array de 2-3 tendências identificadas – baseie nos dados, como "mais vendas em faixas de preço baixas mostram que o mercado tá apertado para imóveis caros".
charts: array de sugestões de gráficos – cada uma com título (simples), descrição (o que o gráfico mostra e por quê é útil) e dados sugeridos (ex: "dados: segmentação por preço").
summary: resumo executivo em 2-3 frases – um overview rápido, como se fosse pra apresentar pro chefe, em linguagem cotidiana.

        Foque em linguagem prática para corretores de imóveis, evitando termos técnicos.
        As recomendações devem ser acionáveis e específicas.
        Mantenha tudo prático para corretores de imóveis: foque em vendas, clientes e lucros, sem termos complicados. Se os dados estiverem incompletos, note isso nos insights de forma honesta.
      `;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'Você é um analista especializado em mercado imobiliário. Forneça insights práticos e acionáveis para corretores. Use linguagem simples e direta.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API Groq: ${response.statusText}`);
      }

      const result = await response.json();
      const analysis = JSON.parse(result.choices[0].message.content);
      
      setGroqAnalysis(analysis);
      console.log('✅ Análise com IA concluída');

    } catch (error) {
      console.error('❌ Erro na análise com IA:', error);
      // Fallback para análise local se a Groq falhar
      setGroqAnalysis(generateFallbackAnalysis(data));
    } finally {
      setAnalyzing(false);
    }
  };

  // Análise fallback local
  const generateFallbackAnalysis = (data: any): GroqAnalysis => {
    const availableCount = data.statusAnalysis.available?.count || 0;
    const soldCount = data.statusAnalysis.sold?.count || 0;
    const conversionRate = parseFloat(data.conversionAnalysis?.conversionRate || 0);
    
    return {
      insights: [
        `Você tem ${availableCount} imóveis disponíveis para venda`,
        `${soldCount} imóveis já foram vendidos este período`,
        `Taxa de conversão de ${conversionRate}% nos seus contatos`,
        `Tempo médio de venda: ${data.businessMetrics.avgDaysOnMarket} dias`
      ],
      recommendations: [
        "Aumente a divulgação dos imóveis que estão há mais tempo disponíveis",
        "Foque nos clientes que demonstraram maior interesse",
        "Revise os preços dos imóveis com base no tempo de estoque"
      ],
      risk_alerts: [
        availableCount === 0 ? "Estoque zerado! Cadastre novos imóveis urgentemente" : "",
        conversionRate < 10 ? "Baixa conversão de contatos. Melhore seu processo de vendas" : ""
      ].filter(alert => alert !== ""),
      market_trends: [
        data.salesTrend?.trend === 'alta' ? "Mercado em aquecimento" : "Mercado estável",
        `Demanda concentrada na faixa ${data.priceSegmentation?.[0]?.range || 'econômica'}`
      ],
      charts: [
        {
          type: "bar",
          title: "Performance por Faixa de Preço",
          description: "Relação entre preço e quantidade de vendas",
          data: data.priceSegmentation || []
        },
        {
          type: "pie",
          title: "Distribuição de Status",
          description: "Como seus imóveis estão distribuídos",
          data: Object.entries(data.statusAnalysis).map(([status, info]: [string, any]) => ({
            name: status === 'available' ? 'Disponível' : status === 'sold' ? 'Vendido' : status,
            value: info.count
          }))
        }
      ],
      summary: `Seu negócio possui ${data.properties.length} imóveis com ${conversionRate}% de taxa de conversão. ${availableCount === 0 ? 'Estoque crítico!' : 'Estoque em nível adequado.'}`
    };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Buscando dados do sistema...');
      const result = await SupabaseService.getDashboardData();
      
      if (result.success && result.data) {
        setDashboardData(result.data);
        setLastUpdate(new Date(result.lastUpdated));
        
        // Iniciar análise com Groq
        await analyzeWithGroq(result.data);
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

  // Função para renderizar gráficos baseados na análise
  const renderChart = (chart: any) => {
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--primary))" name="Quantidade" />
              {chart.data[0]?.percentage && (
                <Bar dataKey="percentage" fill="hsl(var(--secondary))" name="Participação (%)" />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chart.data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={[
                    'hsl(var(--primary))',
                    'hsl(var(--secondary))',
                    'hsl(var(--accent))',
                    'hsl(var(--muted-foreground))'
                  ][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Visualização não disponível</p>
          </div>
        );
    }
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
              <h2 className="text-xl font-semibold mb-2">Coletando dados do sistema</h2>
              <p className="text-muted-foreground">Preparando análise inteligente...</p>
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
              <Button onClick={fetchDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
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
      
      <main className="lg:ml-64 pt-16 lg:pt-20 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Análise Inteligente
            </h1>
            <p className="text-muted-foreground">
              Insights gerados por IA para seu negócio
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-2">
              {analyzing ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  IA Ativa
                </>
              )}
            </Badge>
            <Button onClick={fetchDashboardData} variant="outline" size="sm" disabled={analyzing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {analyzing && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
                <div>
                  <p className="font-medium text-blue-900">Processando análise inteligente</p>
                  <p className="text-sm text-blue-700">A IA está analisando seus dados para gerar insights personalizados...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="flex flex-wrap md:grid md:grid-cols-4 gap-1 w-full">
  <TabsTrigger value="insights" className="flex-1 min-w-0 text-xs md:text-sm truncate">
    Insights
  </TabsTrigger>
  <TabsTrigger value="charts" className="flex-1 min-w-0 text-xs md:text-sm truncate">
    Gráficos
  </TabsTrigger>
  <TabsTrigger value="recommendations" className="flex-1 min-w-0 text-xs md:text-sm truncate">
    Recomendações
  </TabsTrigger>
  <TabsTrigger value="risks" className="flex-1 min-w-0 text-xs md:text-sm truncate">
    Alertas
  </TabsTrigger>
</TabsList>
          {/* Aba de Insights */}
          <TabsContent value="insights" className="space-y-6">
            {groqAnalysis && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      Resumo Executivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {groqAnalysis.summary}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-blue-600" />
                        Insights Principais
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {groqAnalysis.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-muted-foreground">{insight}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Tendências do Mercado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {groqAnalysis.market_trends.map((trend, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                            <p className="text-muted-foreground">{trend}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Aba de Gráficos */}
          <TabsContent value="charts" className="space-y-6">
            {groqAnalysis?.charts && groqAnalysis.charts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {groqAnalysis.charts.map((chart, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{chart.title}</CardTitle>
                      <CardDescription>{chart.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {renderChart(chart)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Gerando visualizações personalizadas...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Aba de Recomendações */}
          <TabsContent value="recommendations" className="space-y-6">
            {groqAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-purple-600" />
                      Ações Recomendadas
                    </CardTitle>
                    <CardDescription>
                      Passos práticos para melhorar seus resultados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {groqAnalysis.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          <Badge variant="outline" className="flex-shrink-0 mt-0.5">
                            {index + 1}
                          </Badge>
                          <p className="text-muted-foreground">{recommendation}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

               <Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Zap className="h-5 w-5 text-orange-600" />
      Oportunidades Imediatas
    </CardTitle>
    <CardDescription>
      Áreas com maior potencial de crescimento
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {dashboardData.priceSegmentation?.[0] && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">
            Foque em {dashboardData.priceSegmentation[0].range}
          </h4>
          <p className="text-sm text-green-700">
            Esta faixa representa {dashboardData.priceSegmentation[0].percentage}% do seu estoque 
            e tem maior rotatividade
          </p>
        </div>
      )}
      
      {/* Leads Promissores com Nomes Reais - RESPONSIVO */}
      {dashboardData.promisingLeads && dashboardData.promisingLeads.length > 0 ? (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clientes Mais Promissores
          </h4>
          
          <div className="space-y-3">
            {dashboardData.promisingLeads.slice(0, 5).map((lead: any, index: number) => (
              <div 
                key={lead.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-lg border border-blue-100 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-blue-900 truncate text-sm sm:text-base">
                      {lead.name || lead.full_name || 'Cliente sem nome'}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {lead.phone && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded flex items-center gap-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate max-w-[120px] sm:max-w-none">{lead.phone}</span>
                        </span>
                      )}
                      {lead.email && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded flex items-center gap-1">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate max-w-[120px] sm:max-w-none">{lead.email}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <Badge 
                    variant="outline" 
                    className={`
                      text-xs whitespace-nowrap
                      ${lead.ml_lead_score >= 90 ? 'bg-green-100 text-green-800 border-green-200' : 
                        lead.ml_lead_score >= 80 ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                        'bg-amber-100 text-amber-800 border-amber-200'}
                    `}
                  >
                    Score: {lead.ml_lead_score}
                  </Badge>
                  
                  {lead.status && (
                    <Badge 
                      variant="secondary"
                      className="text-xs whitespace-nowrap"
                    >
                      {lead.status === 'hot' ? '🔥 Quente' : 
                       lead.status === 'warm' ? '🌤 Morno' : 
                       lead.status === 'new' ? '🆕 Novo' : lead.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {dashboardData.promisingLeads.length > 5 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-600 text-center">
                + {dashboardData.promisingLeads.length - 5} outros leads promissores
              </p>
            </div>
          )}
          
          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Dica:</strong> Entre em contato com estes clientes prioritariamente. 
              Eles têm {dashboardData.promisingLeads[0]?.ml_lead_score || 85}% de probabilidade de fechar negócio.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">
            Clientes Promissores
          </h4>
          <p className="text-sm text-gray-600">
            Nenhum lead de alta qualidade identificado no momento.
            {dashboardData.leads?.length > 0 && ` Você tem ${dashboardData.leads.length} contatos para qualificar.`}
          </p>
        </div>
      )}

      {/* Oportunidade Adicional: Imóveis com Maior Potencial - RESPONSIVO */}
      {dashboardData.properties && dashboardData.properties.length > 0 && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <Home className="h-4 w-4" />
            Imóveis com Maior Potencial
          </h4>
          
          <div className="space-y-2">
            {dashboardData.properties
              .filter((property: any) => property.status === 'available')
              .sort((a: any, b: any) => (b.price || 0) - (a.price || 0))
              .slice(0, 3)
              .map((property: any, index: number) => (
                <div key={property.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-lg border border-purple-100 gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-xs font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-purple-900 text-sm sm:text-base truncate">
                        {property.title || 'Imóvel sem título'}
                      </p>
                      <p className="text-xs text-purple-600 truncate">
                        {property.address ? 
                          (typeof property.address === 'string' ? property.address : 
                           property.address.neighborhood || property.address.city || 'Endereço não informado') : 
                          'Localização não informada'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="bg-white text-purple-700 border-purple-200 text-xs sm:text-sm">
                      {property.price ? `R$ ${parseFloat(property.price).toLocaleString('pt-BR')}` : 'Preço não informado'}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="mt-3 p-3 bg-purple-100 rounded-lg">
            <p className="text-xs text-purple-800">
              <strong>Estratégia:</strong> Estes imóveis têm maior valor de mercado. 
              Foque em clientes com perfil de investidor.
            </p>
          </div>
        </div>
      )}

      {/* Oportunidade Extra: Próximas Ações Sugeridas */}
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Próximos Passos Recomendados
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-2 p-2 bg-white rounded border border-amber-100">
            <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-600 text-xs font-semibold">1</span>
            </div>
            <p className="text-xs text-amber-800">
              Contate os {Math.min(dashboardData.promisingLeads?.length || 0, 3)} primeiros leads hoje
            </p>
          </div>
          
          <div className="flex items-start gap-2 p-2 bg-white rounded border border-amber-100">
            <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-600 text-xs font-semibold">2</span>
            </div>
            <p className="text-xs text-amber-800">
              Revise preços dos imóveis disponíveis há mais de 30 dias
            </p>
          </div>
          
          <div className="flex items-start gap-2 p-2 bg-white rounded border border-amber-100">
            <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-600 text-xs font-semibold">3</span>
            </div>
            <p className="text-xs text-amber-800">
              Atualize fotos dos {dashboardData.priceSegmentation?.[0]?.range || 'econômicos'}
            </p>
          </div>
          
          <div className="flex items-start gap-2 p-2 bg-white rounded border border-amber-100">
            <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-600 text-xs font-semibold">4</span>
            </div>
            <p className="text-xs text-amber-800">
              Programe follow-up para leads com score 60-79
            </p>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
              </div>
            )}
          </TabsContent>

          {/* Aba de Alertas */}
          <TabsContent value="risks" className="space-y-6">
            {groqAnalysis && (
              <div className="space-y-6">
                {groqAnalysis.risk_alerts.length > 0 ? (
                  groqAnalysis.risk_alerts.map((alert, index) => (
                    <Card key={index} className="bg-red-50 border-red-200">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                          <div>
                            <h3 className="font-semibold text-red-900">Atenção Necessária</h3>
                            <p className="text-red-700">{alert}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-green-900">Situação Estável</h3>
                          <p className="text-green-700">Nenhum alerta crítico identificado no momento</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Indicadores de Performance</CardTitle>
                    <CardDescription>
                      Métricas importantes para monitorar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className={`p-4 rounded-lg ${
                        parseFloat(dashboardData.conversionAnalysis?.conversionRate || 0) > 20 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-amber-50 border border-amber-200'
                      }`}>
                        <p className="text-2xl font-bold">
                          {dashboardData.conversionAnalysis?.conversionRate || 0}%
                        </p>
                        <p className="text-sm">Taxa de Conversão</p>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${
                        dashboardData.businessMetrics.avgDaysOnMarket < 45 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-amber-50 border border-amber-200'
                      }`}>
                        <p className="text-2xl font-bold">
                          {dashboardData.businessMetrics.avgDaysOnMarket}
                        </p>
                        <p className="text-sm">Dias para Vender</p>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${
                        dashboardData.statusAnalysis.available?.count > 5 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-amber-50 border border-amber-200'
                      }`}>
                        <p className="text-2xl font-bold">
                          {dashboardData.statusAnalysis.available?.count || 0}
                        </p>
                        <p className="text-sm">Imóveis Disponíveis</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-2xl font-bold">
                          {dashboardData.leads.length}
                        </p>
                        <p className="text-sm">Novos Contatos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Rodapé com informações da análise */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sobre Esta Análise</CardTitle>
            <CardDescription>
              Informações técnicas do processamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-muted-foreground mb-2">Fonte de Dados</h4>
                <p>Supabase - Tempo Real</p>
                <p>Atualizado: {lastUpdate.toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-muted-foreground mb-2">Processamento</h4>
                <p>IA Groq - Análise Preditiva</p>
                <p>Modelo: Llama 3 8B</p>
              </div>
              <div>
                <h4 className="font-semibold text-muted-foreground mb-2">Cobertura</h4>
                <p>{dashboardData.properties.length} imóveis analisados</p>
                <p>{dashboardData.leads.length} contatos processados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminBI;
