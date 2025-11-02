import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wdoxgifupqfbnwarmhoq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb3hnaWZ1cHFmYm53YXJtaG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTA1OTAsImV4cCI6MjA3NzQ4NjU5MH0.s1XZDTh0x6KlWNhdtU0ux5JnT4gHf3UFqdBf84i43xM';

export const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseService {
  
  // Buscar dados completos do dashboard COM FALLBACK
  static async getDashboardData() {
    try {
      console.log('🔄 Buscando dados do Supabase...');
      
      const [
        pricePredictions,
        regionData, 
        leadAnalysis,
        heatmapData,
        leadStats,
        clientStats
      ] = await Promise.all([
        this.getPricePredictions(),
        this.getRegionData(),
        this.getLeadAnalysis(),
        this.getHeatmapData(),
        this.getLeadStats(),
        this.getClientStats()
      ]);

      return {
        priceData: pricePredictions || this.getFallbackPriceData(),
        regionData: regionData || this.getFallbackRegionData(),
        leadScoreData: leadAnalysis || this.getFallbackLeadData(),
        heatmapData: heatmapData || this.getFallbackHeatmapData(),
        leadStats: leadStats || this.getFallbackLeadStats(),
        clientStats: clientStats || this.getFallbackClientStats()
      };
    } catch (error) {
      console.error('❌ Erro ao buscar dados do dashboard:', error);
      return this.getFallbackDashboardData();
    }
  }
// Buscar todas as propriedades - MÉTODO NOVO
static async getAllProperties() {
  try {
    console.log('🔍 Buscando propriedades no Supabase...');
    
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar propriedades:', error);
      return null;
    }

    console.log(`✅ ${data?.length || 0} propriedades carregadas`);
    return data;
  } catch (error) {
    console.error('❌ Erro inesperado em getAllProperties:', error);
    return null;
  }
}



// Buscar dados de vendas
// Método CORRETO para buscar vendas baseado em properties_rows
static async getSalesData() {
  try {
    console.log('🔍 Buscando dados REAIS de vendas de properties_rows...');
    
    const properties = await this.getAllProperties();
    
    if (!properties || properties.length === 0) {
      console.log('⚠️ Nenhuma propriedade encontrada');
      return [];
    }

    // Filtra apenas propriedades vendidas
    const soldProperties = properties.filter(property => property.status === 'sold');
    
    // Converte para o formato de sales
    const salesData = soldProperties.map(property => ({
      id: property.id,
      property_id: property.id,
      final_price: property.price,
      sale_date: property.updated_at || property.created_at,
      commission: parseFloat(property.price) * 0.05, // 5% de comissão estimada
      status: 'completed',
      property_title: property.title,
      // Mantém compatibilidade com estrutura esperada
      ...property
    }));

    console.log(`✅ ${salesData.length} vendas REAIS carregadas de properties_rows`);
    return salesData;

  } catch (error) {
    console.error('❌ Erro ao buscar vendas reais:', error);
    return [];
  }
}

// Buscar dados de mercado
static async getMarketData() {
  try {
    console.log('🔍 Buscando dados de mercado no Supabase...');
    
    const { data, error } = await supabase
      .from('market_data')
      .select('*')
      .order('period', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar dados de mercado:', error);
      return null;
    }

    console.log(`✅ ${data?.length || 0} registros de mercado carregados`);
    return data;
  } catch (error) {
    console.error('❌ Erro inesperado em getMarketData:', error);
    return null;
  }
}


// Buscar dados formatados para gráfico de vendas
// Buscar dados formatados para gráfico de vendas vs previsões
// Buscar dados formatados para gráfico de vendas vs previsões (últimos 3 meses)
static async getSalesChartData() {
  try {
    console.log('📊 Formatando dados para gráfico de vendas (últimos 3 meses)...');
    
    const sales = await this.getSalesData();
    
    if (!sales || sales.length === 0) {
      console.log('⚠️ Nenhuma venda encontrada, retornando dados demo');
      return this.getSalesDemoData();
    }

    // Ordenar vendas por data (mais recentes primeiro)
    const sortedSales = sales.sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));
    
    // Pegar apenas os últimos 3 meses
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const recentSales = sortedSales.filter(sale => new Date(sale.sale_date) >= threeMonthsAgo);
    
    if (recentSales.length === 0) {
      console.log('⚠️ Nenhuma venda nos últimos 3 meses, usando dados demo');
      return this.getSalesDemoData();
    }

    // Agrupa vendas por mês
    const monthlyData = recentSales.reduce((acc, sale) => {
      const date = new Date(sale.sale_date);
      const monthKey = date.toLocaleDateString('pt-BR', { 
        month: 'short', 
        year: 'numeric' 
      }).replace(/de /g, '');
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          vendas: 0,
          previsao: 0,
          count: 0
        };
      }
      
      acc[monthKey].vendas += parseFloat(sale.final_price) || 0;
      acc[monthKey].count += 1;
      
      // Previsão baseada no preço final + 10%
      acc[monthKey].previsao = acc[monthKey].vendas * 1.1;
      
      return acc;
    }, {});

    // Converte para array e ordena por data (mais antigo primeiro)
    const chartData = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        vendas: Math.round(data.vendas),
        previsao: Math.round(data.previsao)
      }))
      .sort((a, b) => {
        // Ordena os meses cronologicamente (mais antigo primeiro)
        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const aMonth = a.month.split(' ')[0].toLowerCase();
        const bMonth = b.month.split(' ')[0].toLowerCase();
        const aYear = parseInt(a.month.split(' ')[1]) || 2024;
        const bYear = parseInt(b.month.split(' ')[1]) || 2024;
        
        // Primeiro compara o ano, depois o mês
        if (aYear !== bYear) return aYear - bYear;
        return months.indexOf(aMonth) - months.indexOf(bMonth);
      });

    console.log(`✅ Dados do gráfico formatados: ${chartData.length} meses (últimos 3 meses)`);
    return chartData;

  } catch (error) {
    console.error('❌ Erro ao formatar dados do gráfico:', error);
    return this.getSalesDemoData();
  }
}

// Dados de demonstração para gráfico de vendas (últimos 3 meses)
static getSalesDemoData() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  
  // Gerar dados dos últimos 3 meses
  const demoData = [];
  
  for (let i = 2; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Valores aleatórios realistas para demonstração
    const baseValue = 1500000 + (Math.random() * 500000);
    const vendas = Math.round(baseValue);
    const previsao = Math.round(baseValue * (1 + (Math.random() * 0.1 - 0.05))); // ±5% da venda real
    
    demoData.push({
      month: `${monthName} ${year}`,
      vendas: vendas,
      previsao: previsao
    });
  }
  
  return demoData;
}

// Dados de demonstração para gráfico de vendas
static getSalesDemoData() {
  return [
    { month: 'jan 2024', vendas: 1200000, previsao: 1250000 },
    { month: 'fev 2024', vendas: 1500000, previsao: 1450000 },
    { month: 'mar 2024', vendas: 1800000, previsao: 1750000 },
    { month: 'abr 2024', vendas: 2100000, previsao: 2050000 },
    { month: 'mai 2024', vendas: 1900000, previsao: 1950000 },
    { month: 'jun 2024', vendas: 2200000, previsao: 2150000 },
    { month: 'jul 2024', vendas: 2400000, previsao: 2350000 },
    { month: 'ago 2024', vendas: 2300000, previsao: 2250000 },
  ];
}

// Dados de demonstração para gráfico de vendas
static getSalesDemoData() {
  return [
    { month: 'jan 2024', vendas: 1200000, previsao: 1250000 },
    { month: 'fev 2024', vendas: 1500000, previsao: 1450000 },
    { month: 'mar 2024', vendas: 1800000, previsao: 1750000 },
    { month: 'abr 2024', vendas: 2100000, previsao: 2050000 },
    { month: 'mai 2024', vendas: 1900000, previsao: 1950000 },
    { month: 'jun 2024', vendas: 2200000, previsao: 2150000 },
    { month: 'jul 2024', vendas: 2400000, previsao: 2350000 },
    { month: 'ago 2024', vendas: 2300000, previsao: 2250000 },
  ];
}

// Buscar estatísticas de vendas
static async getSalesStats() {
  try {
    console.log('📈 Buscando estatísticas de vendas...');
    
    const sales = await this.getSalesData();
    
    if (!sales || sales.length === 0) {
      return {
        totalSales: 0,
        totalRevenue: 0,
        averagePrice: 0,
        totalCommission: 0,
        salesCount: 0
      };
    }

    const totalRevenue = sales.reduce((sum, sale) => sum + (parseFloat(sale.final_price) || 0), 0);
    const totalCommission = sales.reduce((sum, sale) => sum + (parseFloat(sale.commission) || 0), 0);
    const averagePrice = totalRevenue / sales.length;

    return {
      totalSales: sales.length,
      totalRevenue: Math.round(totalRevenue),
      averagePrice: Math.round(averagePrice),
      totalCommission: Math.round(totalCommission),
      salesCount: sales.length
    };

  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas de vendas:', error);
    return {
      totalSales: 0,
      totalRevenue: 0,
      averagePrice: 0,
      totalCommission: 0,
      salesCount: 0
    };
  }
}



// Buscar dados de propriedades por região (agrupado)
static async getPropertiesByRegion() {
  try {
    console.log('🔍 Buscando propriedades agrupadas por região...');
    
    const { data, error } = await supabase
      .from('properties')
      .select('address, price, status')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar propriedades por região:', error);
      return null;
    }

    // Agrupar por região (assumindo que address contém neighborhood)
    const regionData = data?.reduce((acc, property) => {
      const address = property.address || {};
      const region = address.neighborhood || 'Desconhecida';
      
      if (!acc[region]) {
        acc[region] = {
          region: region,
          property_count: 0,
          average_price: 0,
          total_price: 0,
          sales: 0
        };
      }
      
      acc[region].property_count++;
      acc[region].total_price += property.price || 0;
      acc[region].average_price = acc[region].total_price / acc[region].property_count;
      
      if (property.status === 'sold') {
        acc[region].sales++;
      }
      
      return acc;
    }, {});

    const result = Object.values(regionData || {});
    console.log(`✅ ${result.length} regiões processadas`);
    return result;

  } catch (error) {
    console.error('❌ Erro inesperado em getPropertiesByRegion:', error);
    return null;
  }
}
  // Buscar todos os clientes - MÉTODO ÚNICO
  static async getAllClients() {
    try {
      console.log('🔍 Buscando clientes no Supabase...');
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar clientes:', error);
        
        if (error.code === '42P01') {
          console.log('📋 Tabela "clients" não existe no Supabase');
          return null;
        }
        
        return null;
      }

      console.log(`✅ ${data?.length || 0} clientes carregados do Supabase`);
      return data;
    } catch (error) {
      console.error('❌ Erro inesperado em getAllClients:', error);
      return null;
    }
  }

  // Popular dados de clientes - MÉTODO ÚNICO
  static async seedClientsData() {
    try {
      console.log('🌱 Iniciando população de dados de clientes...');

      const clientsData = [
        { 
          name: 'João Silva', 
          email: 'joao.silva@email.com', 
          phone: '(11) 99999-9999', 
          cpf: '123.456.789-00',
          status: 'active',
          is_owner: true,
          last_contact: '2024-01-12 10:30:00'
        },
        { 
          name: 'Maria Santos', 
          email: 'maria.santos@email.com', 
          phone: '(11) 98888-8888', 
          cpf: '234.567.890-11',
          status: 'active',
          is_owner: true,
          last_contact: '2024-01-10 14:20:00'
        },
        { 
          name: 'Pedro Costa', 
          email: 'pedro.costa@email.com', 
          phone: '(11) 97777-7777', 
          cpf: '345.678.901-22',
          status: 'active',
          is_owner: false,
          last_contact: '2024-01-08 09:15:00'
        },
        { 
          name: 'Ana Lima', 
          email: 'ana.lima@email.com', 
          phone: '(11) 96666-6666', 
          cpf: '456.789.012-33',
          status: 'inactive',
          is_owner: false,
          last_contact: '2023-12-20 16:45:00'
        },
        { 
          name: 'Carlos Oliveira', 
          email: 'carlos.oliveira@email.com', 
          phone: '(11) 95555-5555', 
          cpf: '567.890.123-44',
          status: 'active',
          is_owner: true,
          last_contact: '2024-01-15 11:00:00'
        },
        { 
          name: 'Fernanda Rocha', 
          email: 'fernanda.rocha@email.com', 
          phone: '(11) 94444-4444', 
          cpf: '678.901.234-55',
          status: 'active',
          is_owner: false,
          last_contact: '2024-01-14 13:30:00'
        }
      ];

      const { error } = await supabase
        .from('clients')
        .insert(clientsData);

      if (error) {
        console.error('❌ Erro ao inserir clientes:', error);
        
        if (error.code === '42P01') {
          return { 
            success: false, 
            error: 'Tabela clients não existe. Execute o SQL de criação primeiro.' 
          };
        }
        
        return { success: false, error: error.message };
      }

      console.log(`✅ ${clientsData.length} clientes inseridos com sucesso`);
      return { success: true, inserted: clientsData.length };

    } catch (error) {
      console.error('❌ Erro inesperado no seedClientsData:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar todos os leads
  static async getAllLeads() {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('ml_lead_score', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar leads:', error);
        return null;
      }

      console.log(`✅ ${data?.length || 0} leads carregados`);
      return data;
    } catch (error) {
      console.error('❌ Erro inesperado em getAllLeads:', error);
      return null;
    }
  }

  // Buscar estatísticas de leads - MÉTODO ÚNICO E CORRIGIDO
  static async getLeadStats() {
    try {
      console.log('🔍 Buscando estatísticas de leads...');
      
      // Tenta buscar da view primeiro
      let { data, error } = await supabase
        .from('bi_lead_analysis')
        .select('ml_lead_score, status, lead_count')
        .limit(100);

      // Se view não existir, busca da tabela leads
      if (error && error.code === '42P01') {
        console.log('📋 View bi_lead_analysis não existe, buscando da tabela leads...');
        
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('ml_lead_score, status')
          .limit(100);

        if (leadsError) {
          console.log('📋 Tabela leads também não existe, usando fallback...');
          return this.getFallbackLeadStats();
        }

        data = leadsData;
      } else if (error) {
        console.log('❌ Outro erro na view, usando fallback...');
        return this.getFallbackLeadStats();
      }

      if (!data || data.length === 0) {
        console.log('📊 Nenhum dado de leads encontrado, usando fallback...');
        return this.getFallbackLeadStats();
      }

      // Calcular estatísticas
      const hotLeads = data.filter(lead => lead.ml_lead_score >= 80).length;
      const warmLeads = data.filter(lead => lead.ml_lead_score >= 60 && lead.ml_lead_score < 80).length;
      const coldLeads = data.filter(lead => lead.ml_lead_score < 60).length;
      const totalLeads = data.length;

      console.log(`✅ Estatísticas de leads calculadas: ${totalLeads} leads totais`);
      
      return {
        hotLeads,
        warmLeads,
        coldLeads,
        totalLeads,
        conversionRate: totalLeads > 0 ? ((hotLeads / totalLeads) * 100).toFixed(1) : '0.0'
      };

    } catch (error) {
      console.error('❌ Erro inesperado em getLeadStats:', error);
      return this.getFallbackLeadStats();
    }
  }

  // Buscar análise de leads
  static async getLeadAnalysis() {
    try {
      console.log('🔍 Buscando análise de leads...');
      
      let { data, error } = await supabase
        .from('bi_lead_analysis')
        .select('*')
        .order('score_range', { ascending: true });

      if (error) {
        console.log('📋 View bi_lead_analysis não disponível, usando dados estáticos...');
        return this.getFallbackLeadData();
      }

      console.log(`✅ ${data?.length || 0} análises de leads carregadas`);
      return data;

    } catch (error) {
      console.error('❌ Erro ao buscar análise de leads:', error);
      return this.getFallbackLeadData();
    }
  }

  // Buscar estatísticas de clientes
  static async getClientStats() {
    try {
      console.log('🔍 Buscando estatísticas de clientes...');
      
      const { data, error } = await supabase
        .from('clients')
        .select('status, created_at, is_owner')
        .limit(100);

      if (error) {
        console.log('📋 Tabela clients não disponível, usando dados estáticos...');
        return this.getFallbackClientStats();
      }

      if (!data || data.length === 0) {
        return this.getFallbackClientStats();
      }

      // Calcular estatísticas
      const totalClients = data.length;
      const activeClients = data.filter(client => client.status === 'active').length;
      
      const newThisMonth = data.filter(client => {
        if (!client.created_at) return false;
        const created = new Date(client.created_at);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length;

      const owners = data.filter(client => client.is_owner).length;

      console.log(`✅ Estatísticas de clientes calculadas: ${totalClients} clientes`);

      return {
        totalClients,
        activeClients,
        newThisMonth,
        owners,
        engagementRate: totalClients > 0 ? ((activeClients / totalClients) * 100).toFixed(1) : '0.0'
      };

    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas de clientes:', error);
      return this.getFallbackClientStats();
    }
  }

  // Buscar previsões de preço
  static async getPricePredictions() {
    try {
      console.log('🔍 Buscando previsões de preço...');
      
      let { data, error } = await supabase
        .from('bi_price_predictions')
        .select('*')
        .order('month', { ascending: true });

      // Tenta buscar da tabela se a view não existir
      if (error && error.code === '42P01') {
        console.log('📋 View bi_price_predictions não existe, buscando da tabela price_predictions...');
        
        const { data: tableData, error: tableError } = await supabase
          .from('price_predictions')
          .select('*')
          .order('month', { ascending: true });

        if (tableError) {
          console.log('📋 Tabela price_predictions também não existe, usando fallback...');
          return this.getFallbackPriceData();
        }
        data = tableData;
      } else if (error) {
        console.log('❌ Outro erro na view, usando fallback...');
        return this.getFallbackPriceData();
      }

      if (!data || data.length === 0) {
        console.log('📊 Nenhuma previsão de preço encontrada, usando fallback...');
        return this.getFallbackPriceData();
      }

      console.log(`✅ ${data.length} previsões de preço carregadas`);
      return data;

    } catch (error) {
      console.error('❌ Erro ao buscar previsões de preço:', error);
      return this.getFallbackPriceData();
    }
  }

  // Buscar dados regionais
  static async getRegionData() {
    try {
      console.log('🔍 Buscando dados regionais...');
      
      let { data, error } = await supabase
        .from('bi_region_data')
        .select('*');

      if (error) {
        console.log('📋 View bi_region_data não disponível, usando dados estáticos...');
        return this.getFallbackRegionData();
      }

      console.log(`✅ ${data?.length || 0} regiões carregadas`);
      return data;

    } catch (error) {
      console.error('❌ Erro ao buscar dados regionais:', error);
      return this.getFallbackRegionData();
    }
  }

  // Buscar dados de heatmap
  static async getHeatmapData() {
    try {
      console.log('🔍 Buscando dados de heatmap...');
      
      let { data, error } = await supabase
        .from('bi_demand_heatmap')
        .select('*');

      if (error) {
        console.log('📋 View bi_demand_heatmap não disponível, usando dados estáticos...');
        return this.getFallbackHeatmapData();
      }

      console.log(`✅ ${data?.length || 0} dados de heatmap carregados`);
      return data;

    } catch (error) {
      console.error('❌ Erro ao buscar heatmap:', error);
      return this.getFallbackHeatmapData();
    }
  }

  // ========== MÉTODOS DE FALLBACK ==========

  static getFallbackDashboardData() {
    console.log('🔄 Usando dados de fallback para dashboard...');
    return {
      priceData: this.getFallbackPriceData(),
      regionData: this.getFallbackRegionData(),
      leadScoreData: this.getFallbackLeadData(),
      heatmapData: this.getFallbackHeatmapData(),
      leadStats: this.getFallbackLeadStats(),
      clientStats: this.getFallbackClientStats()
    };
  }

  static getFallbackPriceData() {
    return [
      { month: 'Jan', predicted_price: 850000, actual_price: 820000, confidence_score: 95, region: 'Centro' },
      { month: 'Fev', predicted_price: 870000, actual_price: 890000, confidence_score: 94, region: 'Centro' },
      { month: 'Mar', predicted_price: 890000, actual_price: 880000, confidence_score: 96, region: 'Centro' },
      { month: 'Abr', predicted_price: 920000, actual_price: 950000, confidence_score: 93, region: 'Centro' },
      { month: 'Mai', predicted_price: 950000, actual_price: 940000, confidence_score: 97, region: 'Centro' },
      { month: 'Jun', predicted_price: 980000, actual_price: 1020000, confidence_score: 95, region: 'Centro' },
    ];
  }

  static getFallbackRegionData() {
    return [
      { region: 'Centro', property_count: 45, average_price: 850000, sales: 12 },
      { region: 'Zona Sul', property_count: 32, average_price: 1200000, sales: 8 },
      { region: 'Zona Oeste', property_count: 28, average_price: 950000, sales: 6 },
      { region: 'Zona Leste', property_count: 18, average_price: 680000, sales: 4 },
      { region: 'Norte', property_count: 12, average_price: 550000, sales: 2 },
    ];
  }

  static getFallbackLeadData() {
    return [
      { score_range: '80-100', lead_count: 23, conversion_rate: 35 },
      { score_range: '60-79', lead_count: 35, conversion_rate: 18 },
      { score_range: '40-59', lead_count: 22, conversion_rate: 8 },
      { score_range: '0-39', lead_count: 9, conversion_rate: 2 },
    ];
  }

  static getFallbackHeatmapData() {
    return [
      { region: 'Centro', demand_score: 95, price_trend: 'up', inventory_level: 'low' },
      { region: 'Zona Sul', demand_score: 87, price_trend: 'up', inventory_level: 'medium' },
      { region: 'Zona Oeste', demand_score: 78, price_trend: 'stable', inventory_level: 'medium' },
      { region: 'Zona Leste', demand_score: 65, price_trend: 'stable', inventory_level: 'high' },
      { region: 'Norte', demand_score: 45, price_trend: 'down', inventory_level: 'high' },
    ];
  }

  static getFallbackLeadStats() {
    return {
      hotLeads: 23,
      warmLeads: 35,
      coldLeads: 31,
      totalLeads: 89,
      conversionRate: '25.8'
    };
  }

  static getFallbackClientStats() {
    return {
      totalClients: 156,
      activeClients: 124,
      newThisMonth: 23,
      owners: 89,
      engagementRate: '79.5'
    };
  }

  // Teste de conexão
  static async testConnection() {
    try {
      console.log('🔌 Testando conexão com Supabase...');
      
      const { data, error } = await supabase
        .from('clients')
        .select('count')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          console.log('✅ Conexão com Supabase OK (tabela clients não existe)');
          return { 
            success: true, 
            connected: true,
            message: 'Conexão estabelecida - tabela clients precisa ser criada' 
          };
        }
        
        console.error('❌ Erro na conexão com Supabase:', error);
        return { 
          success: false, 
          connected: false,
          error: error.message 
        };
      }

      console.log('✅ Conexão com Supabase estabelecida com sucesso');
      return { 
        success: true, 
        connected: true,
        message: 'Conexão estabelecida com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro inesperado no testConnection:', error);
      return { 
        success: false, 
        connected: false,
        error: error.message 
      };
    }
  }

  // Manter métodos existentes para compatibilidade
  static async getLeadScores() {
    return this.getLeadAnalysis();
  }
}
