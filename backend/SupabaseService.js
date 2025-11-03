import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wdoxgifupqfbnwarmhoq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb3hnaWZ1cHFmYm53YXJtaG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA1OTAsImV4cCI6MjA3NzQ4NjU5MH0.s1XZDTh0x6KlWNhdtU0ux5JnT4gHf3UFqdBf84i43xM';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para testar a conexão
export const testSupabaseConnection = async () => {
  try {
    console.log('🔗 Testando conexão com Supabase...');
    const { data, error } = await supabase
      .from('properties')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Erro na conexão:', error);
      return { 
        success: false, 
        error: error.message,
        details: error 
      };
    }

    console.log('✅ Conexão com Supabase estabelecida com sucesso');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro crítico na conexão:', error);
    return { 
      success: false, 
      error: error.message,
      details: error 
    };
  }
};

export class SupabaseService {
  
  // ANÁLISE ESTATÍSTICA AVANÇADA
  static calculateAdvancedStats(data) {
    if (!data || data.length === 0) return null;

    const values = data.map(d => d.value || d.price || d.amount || 0).filter(v => v > 0);
    if (values.length === 0) return null;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);
    const variance = Math.pow(stdDev, 2);
    
    const cv = (stdDev / mean) * 100;
    
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;

    return {
      mean: Math.round(mean),
      median: Math.round(median),
      stdDev: Math.round(stdDev),
      variance: Math.round(variance),
      coefficientVariation: cv.toFixed(1),
      quartile1: Math.round(q1),
      quartile3: Math.round(q3),
      iqr: Math.round(iqr),
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
      confidenceInterval: {
        lower: Math.round(mean - 1.96 * stdDev / Math.sqrt(values.length)),
        upper: Math.round(mean + 1.96 * stdDev / Math.sqrt(values.length))
      }
    };
  }

  // BUSCAR DADOS COMPLETOS DO DASHBOARD COM TRATAMENTO ROBUSTO DE ERROS
 static async getDashboardData() {
  try {
    console.log('📊 Buscando dados REAIS do Supabase...');

    const [
      properties,
      clients,
      leads,
      sales,
      promisingLeads // ← Novo
    ] = await Promise.all([
      this.getAllProperties(),
      this.getAllClients(),
      this.getAllLeads(),
      this.getSalesData(),
      this.getPromisingLeads() // ← Novo
    ]);

      // Primeiro testamos a conexão
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.success) {
        throw new Error(`Falha na conexão: ${connectionTest.error}`);
      }

      // Buscar dados com timeout
      const dataFetchPromise = Promise.all([
        this.getAllProperties(),
        this.getAllClients(),
        this.getAllLeads(),
        this.getSalesData()
      ]);

      // Timeout de 15 segundos
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: A conexão com o banco demorou muito')), 15000)
      );

      const [fetchedProperties, fetchedClients, fetchedLeads, fetchedSales] = await Promise.race([dataFetchPromise, timeoutPromise]);

      // Verificar se temos dados válidos
      if (!fetchedProperties) {
        throw new Error('Não foi possível carregar propriedades do banco');
      }

      console.log(`✅ Dados carregados: ${properties.length} propriedades, ${clients?.length || 0} clientes, ${leads?.length || 0} leads, ${sales?.length || 0} vendas`);

      // ANÁLISE ESTATÍSTICA AVANÇADA
      const priceStats = this.calculateAdvancedStats(
        properties.map(p => ({ value: parseFloat(p.price) || 0 }))
      );

      const salesStats = this.calculateAdvancedStats(
        sales.map(s => ({ value: parseFloat(s.final_price) || 0 }))
      );

      const conversionAnalysis = this.calculateConversionProbability(leads);

      // ANÁLISE DE PROPRIEDADES POR STATUS
      const statusAnalysis = properties.reduce((acc, property) => {
        const status = property.status || 'unknown';
        if (!acc[status]) {
          acc[status] = { count: 0, totalValue: 0, avgPrice: 0 };
        }
        acc[status].count++;
        acc[status].totalValue += parseFloat(property.price) || 0;
        acc[status].avgPrice = acc[status].totalValue / acc[status].count;
        return acc;
      }, {});

      // ANÁLISE TEMPORAL DE VENDAS
      const salesTrend = this.analyzeTrend(
        sales.map((sale, index) => ({
          value: parseFloat(sale.final_price) || 0,
          time: index
        }))
      );

      // SEGMENTAÇÃO POR PREÇO
      const priceSegmentation = this.segmentByPrice(properties);

      // LEAD SCORING AVANÇADO
      const leadAnalysis = this.analyzeLeads(leads);

      return {
        success: true,
        data: {
          properties: properties || [],
          clients: clients || [],
          leads: leads || [],
          sales: sales || [],
          promisingLeads: promisingLeads || [],
          priceStats,
          salesStats,
          conversionAnalysis,
          statusAnalysis,
          salesTrend,
          priceSegmentation,
          leadAnalysis,
          businessMetrics: this.calculateBusinessMetrics(properties, sales, leads, clients)
        },
        lastUpdated: new Date().toISOString(),
        dataSource: 'supabase',
        recordCount: {
          properties: properties?.length || 0,
          clients: clients?.length || 0,
          leads: leads?.length || 0,
          sales: sales?.length || 0
        },
        connectionStatus: 'connected'
      };

    } catch (error) {
    console.error('❌ Erro crítico ao buscar dados:', error);
    return {
      success: false,
      error: error.message,
      data: this.getEmptyDashboardData(),
      lastUpdated: new Date().toISOString(),
      dataSource: 'error'
    };
  }
  }

  // BUSCAR DADOS DE TESTE DO DASHBOARD
  static async getTestDashboardData() {
    try {
      console.log('📊 Buscando dados de teste do Supabase...');
      // Retornar estrutura vazia mas válida para o frontend
      const emptyData = this.getEmptyDashboardData();
      
      return {
        success: false,
        error: error.message,
        data: emptyData,
        lastUpdated: new Date().toISOString(),
        dataSource: 'error',
        connectionStatus: 'disconnected'
      };
    }
    catch (error) {
      console.error('❌ Erro ao buscar dados de teste:', error);
      return {
        success: false,
        error: error.message,
        data: this.getEmptyDashboardData(),
        lastUpdated: new Date().toISOString(),
        dataSource: 'error',
        connectionStatus: 'disconnected'
      };
    }
  }


  // ESTRUTURA DE DADOS VAZIA PARA MANTER A INTERFACE FUNCIONAL
  static getEmptyDashboardData() {
    return {
      properties: [],
      clients: [],
      leads: [],
      sales: [],
      promisingLeads: [],
      priceStats: null,
      salesStats: null,
      conversionAnalysis: null,
      statusAnalysis: {},
      salesTrend: null,
      priceSegmentation: null,
      leadAnalysis: null,
      businessMetrics: {
        totalInventoryValue: 0,
        inventoryTurnover: 0,
        avgDaysOnMarket: 0,
        salesVelocity: 0,
        marketEfficiency: 0
      }
    };
  }

  // CALCULAR PROBABILIDADE DE CONVERSÃO
  static calculateConversionProbability(leads) {
    if (!leads || leads.length === 0) return {
      conversionRate: '0.0',
      convertedLeads: 0,
      totalLeads: 0,
      probability: '0.0',
      confidence: '0.0'
    };

    const converted = leads.filter(lead => 
      lead.status === 'converted' || lead.status === 'qualified' || lead.status === 'closed'
    ).length;

    const total = leads.length;
    const conversionRate = (converted / total) * 100;

    const priorProbability = 0.15;
    const likelihood = conversionRate / 100;
    const evidence = 0.5;

    const posteriorProbability = (priorProbability * likelihood) / evidence;

    return {
      conversionRate: conversionRate.toFixed(1),
      convertedLeads: converted,
      totalLeads: total,
      probability: Math.min(posteriorProbability * 100, 100).toFixed(1),
      confidence: Math.min(conversionRate * 1.5, 95).toFixed(1)
    };
  }

  // ANÁLISE DE TENDÊNCIA TEMPORAL
  static analyzeTrend(timeseriesData) {
    if (!timeseriesData || timeseriesData.length < 2) return null;

    const values = timeseriesData.map(d => d.value || d.price || d.amount || 0);
    const n = values.length;
    
    const x = Array.from({length: n}, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const meanY = sumY / n;
    const ssTot = values.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
    const ssRes = values.reduce((sum, y, i) => sum + Math.pow(y - (slope * i + intercept), 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    const trend = slope > 0 ? 'alta' : slope < 0 ? 'baixa' : 'estável';
    const strength = Math.abs(rSquared) > 0.7 ? 'forte' : Math.abs(rSquared) > 0.3 ? 'moderada' : 'fraca';

    return {
      trend,
      strength,
      slope: slope.toFixed(4),
      rSquared: rSquared.toFixed(3),
      projection: Math.round(slope * n + intercept),
      percentageChange: ((slope * n) / values[0] * 100).toFixed(1)
    };
  }

  // SEGMENTAÇÃO POR FAIXA DE PREÇO
  static segmentByPrice(properties) {
    if (!properties || properties.length === 0) return null;

    const prices = properties
      .map(p => parseFloat(p.price) || 0)
      .filter(p => p > 0)
      .sort((a, b) => a - b);

    if (prices.length === 0) return null;

    const segments = [
      { range: 'Econômico', min: 0, max: 500000, count: 0, total: 0 },
      { range: 'Médio', min: 500001, max: 1000000, count: 0, total: 0 },
      { range: 'Alto Padrão', min: 1000001, max: 2000000, count: 0, total: 0 },
      { range: 'Luxo', min: 2000001, max: Infinity, count: 0, total: 0 }
    ];

    prices.forEach(price => {
      const segment = segments.find(s => price >= s.min && price <= s.max);
      if (segment) {
        segment.count++;
        segment.total += price;
      }
    });

    segments.forEach(segment => {
      segment.percentage = ((segment.count / prices.length) * 100).toFixed(1);
      segment.average = segment.count > 0 ? Math.round(segment.total / segment.count) : 0;
    });

    return segments.filter(s => s.count > 0);
  }

  // ANÁLISE AVANÇADA DE LEADS
  static analyzeLeads(leads) {
    if (!leads || leads.length === 0) return {
      scoreRanges: [],
      totalScored: 0,
      conversionProbability: '0.0'
    };

    const scoredLeads = leads.filter(l => l.ml_lead_score !== undefined && l.ml_lead_score !== null);
    const totalLeads = leads.length;

    const scoreRanges = [
      { range: '0-20', min: 0, max: 20, count: 0 },
      { range: '21-40', min: 21, max: 40, count: 0 },
      { range: '41-60', min: 41, max: 60, count: 0 },
      { range: '61-80', min: 61, max: 80, count: 0 },
      { range: '81-100', min: 81, max: 100, count: 0 }
    ];

    scoredLeads.forEach(lead => {
      const score = lead.ml_lead_score;
      const range = scoreRanges.find(r => score >= r.min && score <= r.max);
      if (range) range.count++;
    });

    scoreRanges.forEach(range => {
      range.percentage = scoredLeads.length > 0 ? ((range.count / scoredLeads.length) * 100).toFixed(1) : '0.0';
    });

    return {
      scoreRanges: scoreRanges.filter(r => r.count > 0),
      totalScored: scoredLeads.length,
      conversionProbability: this.calculateExpectedConversion(scoredLeads)
    };
  }

  static calculateExpectedConversion(leads) {
    if (!leads || leads.length === 0) return '0.0';

    const highScoreLeads = leads.filter(l => l.ml_lead_score >= 70).length;
    const mediumScoreLeads = leads.filter(l => l.ml_lead_score >= 40 && l.ml_lead_score < 70).length;

    const highScoreProb = 0.35;
    const mediumScoreProb = 0.15;

    const expectedConversions = (highScoreLeads * highScoreProb) + (mediumScoreLeads * mediumScoreProb);
    return ((expectedConversions / leads.length) * 100).toFixed(1);
  }

  // CÁLCULO DE MÉTRICAS DE NEGÓCIO
  static calculateBusinessMetrics(properties, sales, leads, clients) {
    const totalInventoryValue = properties?.reduce((sum, prop) => sum + (parseFloat(prop.price) || 0), 0) || 0;
    const soldProperties = properties?.filter(p => p.status === 'sold') || [];
    const inventoryTurnover = properties.length > 0 ? 
      (soldProperties.length / properties.length) * 100 : 0;

    const avgDaysOnMarket = this.calculateAverageDaysOnMarket(properties);
    const salesVelocity = this.calculateSalesVelocity(sales);

    return {
      totalInventoryValue: Math.round(totalInventoryValue),
      inventoryTurnover: inventoryTurnover.toFixed(1),
      avgDaysOnMarket: Math.round(avgDaysOnMarket),
      salesVelocity: salesVelocity.toFixed(2),
      marketEfficiency: this.calculateMarketEfficiency(properties, sales)
    };
  }

  static calculateAverageDaysOnMarket(properties) {
    const soldProperties = properties?.filter(p => p.status === 'sold' && p.created_at && p.updated_at) || [];
    if (soldProperties.length === 0) return 0;

    const totalDays = soldProperties.reduce((sum, prop) => {
      const created = new Date(prop.created_at);
      const updated = new Date(prop.updated_at);
      const days = (updated - created) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);

    return totalDays / soldProperties.length;
  }

  static calculateSalesVelocity(sales) {
    if (!sales || sales.length === 0) return 0;
    
    const sortedSales = sales.sort((a, b) => new Date(a.sale_date) - new Date(b.sale_date));
    if (sortedSales.length < 2) return 0;

    const firstDate = new Date(sortedSales[0].sale_date);
    const lastDate = new Date(sortedSales[sortedSales.length - 1].sale_date);
    const totalDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);

    return totalDays > 0 ? sales.length / totalDays : 0;
  }

  static calculateMarketEfficiency(properties, sales) {
    const totalProperties = properties?.length || 0;
    const soldProperties = sales?.length || 0;
    
    if (totalProperties === 0) return 0;

    const salesRate = soldProperties / totalProperties;
    const inventoryValue = properties?.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) || 0;
    const salesValue = sales?.reduce((sum, s) => sum + (parseFloat(s.final_price) || 0), 0) || 0;

    return inventoryValue > 0 ? (salesValue / inventoryValue) * 100 : 0;
  }

  // MÉTODOS DE BUSCA DE DADOS COM TRATAMENTO DE ERRO MELHORADO
  static async getAllProperties() {
    try {
      console.log('🔍 Buscando propriedades...');
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar propriedades:', error);
        return null;
      }

      console.log(`✅ ${data?.length || 0} propriedades carregadas`);
      return data || [];
    } catch (error) {
      console.error('❌ Erro inesperado em getAllProperties:', error);
      return null;
    }
  }

  static async getAllClients() {
    try {
      console.log('🔍 Buscando clientes...');
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar clientes:', error);
        return null;
      }

      console.log(`✅ ${data?.length || 0} clientes carregados`);
      return data || [];
    } catch (error) {
      console.error('❌ Erro inesperado em getAllClients:', error);
      return null;
    }
  }

  static async getAllLeads() {
    try {
      console.log('🔍 Buscando leads...');
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar leads:', error);
        return null;
      }

      console.log(`✅ ${data?.length || 0} leads carregados`);
      return data || [];
    } catch (error) {
      console.error('❌ Erro inesperado em getAllLeads:', error);
      return null;
    }
  }

  static async getPromisingLeads() {
  try {
    console.log('🔍 Buscando leads promissores...');
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .gte('ml_lead_score', 80) // Leads com score 80+
      .order('ml_lead_score', { ascending: false })
      .limit(10); // Limite para não sobrecarregar

    if (error) {
      console.error('❌ Erro ao buscar leads promissores:', error);
      return [];
    }

    console.log(`✅ ${data?.length || 0} leads promissores encontrados`);
    return data || [];
  } catch (error) {
    console.error('❌ Erro inesperado em getPromisingLeads:', error);
    return [];
  }
}

  static async getSalesData() {
    try {
      console.log('🔍 Buscando dados de vendas...');
      const properties = await this.getAllProperties();
      if (!properties) return [];

      const soldProperties = properties.filter(property => property.status === 'sold');
      
      const salesData = soldProperties.map(property => ({
        id: property.id,
        property_id: property.id,
        final_price: property.price,
        sale_date: property.updated_at || property.created_at,
        commission: parseFloat(property.price) * 0.05,
        status: 'completed',
        property_title: property.title,
        ...property
      }));

      console.log(`✅ ${salesData.length} vendas processadas`);
      return salesData;
    } catch (error) {
      console.error('❌ Erro ao buscar vendas:', error);
      return [];
    }
  }
}
