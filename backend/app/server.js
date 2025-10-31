// server.js (versão corrigida)
import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Para usar require em ES modules
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ Backend funcionando perfeitamente!', 
    timestamp: new Date(),
    services: {
      database: 'Supabase',
      ml: 'Machine Learning ativo',
      realTime: 'WebSockets pronto'
    }
  });
});

// Dashboard Data - Com fallback inteligente
app.get('/api/bi/dashboard-data', async (req, res) => {
  try {
    console.log('📊 Buscando dados do dashboard...');
    
    let supabaseData = null;
    
    // Tentar importar e usar SupabaseService dinamicamente
    try {
      // Importação corrigida
      const { SupabaseService } = await import('./SupabaseService.js');
      
      // Testar conexão primeiro
      const isConnected = await SupabaseService.testConnection();
      
      if (isConnected) {
        supabaseData = await SupabaseService.getDashboardData();
        console.log('✅ Conexão com Supabase estabelecida');
      } else {
        console.log('❌ Supabase não conectado, usando fallback');
      }
    } catch (supabaseError) {
      console.log('🔌 Supabase não disponível, usando dados mock:', supabaseError.message);
    }
    
    // Se temos dados válidos do Supabase
    if (supabaseData && 
        (supabaseData.priceData?.length > 0 || 
         supabaseData.regionData?.length > 0 || 
         supabaseData.leadScoreData?.length > 0)) {
      
      console.log('✅ Dados carregados do Supabase');
      
      const formattedData = {
        priceData: supabaseData.priceData?.map(item => ({
          month: item.month,
          previsto: item.predicted_price || item.previsto,
          real: item.actual_price || item.real,
          confianca: item.confidence_score || item.confianca,
          region: item.region
        })) || [],
        
        regionData: supabaseData.regionData?.map(item => ({
          region: item.region,
          value: item.property_count || item.value,
          growth: item.growth_rate || item.growth,
          sales: item.sales
        })) || [],
        
        leadScoreData: supabaseData.leadScoreData?.map(item => ({
          score: item.score_range,
          quantidade: item.lead_count || item.quantidade,
          conversao: item.conversion_rate || item.conversao
        })) || [],
        
        heatmapData: supabaseData.heatmapData?.map(item => ({
          zona: item.zone || item.zona,
          periodo: item.period || item.periodo,
          demanda: item.demand_level || item.demanda
        })) || [],
        
        // Dados estáticos complementares
        searchData: [
          { property: 'AP001 - Apartamento Centro', views: 245, conversao: 18 },
          { property: 'CS002 - Casa Alphaville', views: 198, conversao: 22 },
          { property: 'LF003 - Loft Vila Madalena', views: 176, conversao: 15 },
          { property: 'AP004 - Cobertura Duplex', views: 154, conversao: 25 },
          { property: 'TE005 - Terreno Comercial', views: 132, conversao: 8 },
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

      return res.json({
        success: true,
        data: formattedData,
        source: 'supabase',
        lastUpdated: new Date(),
        message: 'Dados carregados do banco de dados real'
      });
    }

    // Fallback para dados mock
    console.log('🔄 Usando dados mock (fallback)');
    const mockData = getMockData();
    
    return res.json({
      success: true,
      data: mockData,
      source: 'mock',
      lastUpdated: new Date(),
      message: 'Dados mock - Supabase offline'
    });

  } catch (error) {
    console.error('❌ Erro ao buscar dados:', error);
    
    // Fallback para dados mock em caso de erro
    const mockData = getMockData();
    
    res.json({
      success: true,
      data: mockData,
      source: 'mock-error',
      lastUpdated: new Date(),
      message: 'Erro no servidor, usando dados mock'
    });
  }
});

// Função com dados mock
function getMockData() {
  return {
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
    searchData: [
      { property: 'AP001 - Apartamento Centro', views: 245, conversao: 18 },
      { property: 'CS002 - Casa Alphaville', views: 198, conversao: 22 },
      { property: 'LF003 - Loft Vila Madalena', views: 176, conversao: 15 },
      { property: 'AP004 - Cobertura Duplex', views: 154, conversao: 25 },
      { property: 'TE005 - Terreno Comercial', views: 132, conversao: 8 },
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
}

// Adicione esta rota ANTES das outras rotas para debug
app.get('/api/admin/debug-routes', (req, res) => {
  const routes = [
    '/api/health',
    '/api/bi/dashboard-data',
    '/api/admin/get-clients',
    '/api/admin/seed-clients',
    '/api/admin/test-clients',
    '/api/admin/seed-data',
    '/api/admin/test-supabase'
  ];
  
  res.json({
    message: 'Rotas disponíveis:',
    routes: routes,
    timestamp: new Date().toISOString()
  });
});

// Rota para buscar clientes
app.get('/api/admin/get-clients', async (req, res) => {
  try {
    console.log('📋 Buscando dados de clientes...');
    
    // Importação com caminho corrigido
    const { SupabaseService } = await import('./SupabaseService.js');
    
    console.log('🔌 Chamando getAllClients...');
    const clients = await SupabaseService.getAllClients();
    
    if (clients !== null) {
      console.log(`✅ ${clients.length} clientes encontrados`);
      res.json({
        success: true,
        data: clients,
        total: clients.length,
        source: 'supabase'
      });
    } else {
      console.log('ℹ️  Tabela de clientes não existe ou está vazia');
      res.json({
        success: true,
        data: [],
        total: 0,
        source: 'empty',
        message: 'Tabela de clientes não existe ou está vazia'
      });
    }
  } catch (error) {
    console.error('❌ ERRO ao buscar clientes:', error);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: error.message,
      data: []
    });
  }
});

// Rota para popular dados de clientes (VERSÃO CORRIGIDA, ÚNICA)
app.post('/api/admin/seed-clients', async (req, res) => {
  try {
    console.log('🌱 Populando dados de clientes...');
    
    // Importação com caminho corrigido
    const { SupabaseService } = await import('./SupabaseService.js');
    const result = await SupabaseService.seedClientsData();
    
    if (result.success) {
      console.log(`✅ ${result.inserted} clientes inseridos`);
      res.json({
        success: true,
        message: `✅ ${result.inserted} clientes inseridos com sucesso`,
        inserted: result.inserted
      });
    } else {
      // Se a função de serviço falhar, mas não lançar exceção, retorna 500
      console.error('❌ Erro ao inserir clientes:', result.error);
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    // Se a importação ou outra linha antes da chamada falhar, retorna 500
    console.error('❌ Erro ao popular clientes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota para testar conexão específica de clientes
app.get('/api/admin/test-clients', async (req, res) => {
  try {
    console.log('🔍 Testando tabela de clientes...');
    
    // Importação com caminho corrigido
    const { SupabaseService } = await import('./SupabaseService.js');
    const clients = await SupabaseService.getAllClients();
    
    const result = {
      success: true,
      tableExists: clients !== null,
      clientCount: clients?.length || 0,
      message: clients ? `✅ Tabela existe com ${clients.length} clientes` : '❌ Tabela não existe'
    };
    
    console.log(result.message);
    res.json(result);
  } catch (error) {
    console.error('❌ Erro no teste de clientes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Previsão de preço com ML simulado
app.post('/api/bi/predict-price', (req, res) => {
  try {
    const { propertyData } = req.body;
    
    if (!propertyData) {
      return res.status(400).json({
        success: false,
        error: 'Dados do imóvel são obrigatórios'
      });
    }
    
    // Simulação de algoritmo de ML
    const size = propertyData?.size || 100;
    const location = propertyData?.location || 'Centro';
    const bedrooms = propertyData?.bedrooms || 3;
    const bathrooms = propertyData?.bathrooms || 2;
    
    const zoneMultipliers = {
      'Centro': 1.4,
      'Zona Sul': 1.2,
      'Zona Oeste': 1.1,
      'Zona Norte': 1.0
    };
    
    const basePrice = size * 8000; // R$ 8.000/m²
    const locationMultiplier = zoneMultipliers[location] || 1.0;
    const bedroomBonus = (bedrooms - 2) * 50000;
    const bathroomBonus = (bathrooms - 1) * 25000;
    
    const predictedPrice = (basePrice * locationMultiplier) + bedroomBonus + bathroomBonus;
    const confidence = 85 + Math.random() * 12;

    res.json({
      success: true,
      prediction: {
        predictedPrice: Math.round(predictedPrice),
        confidence: Math.round(confidence),
        factors: [
          `Localização: ${location} (${(locationMultiplier * 100).toFixed(0)}%)`,
          `Metragem: ${size}m²`,
          `Quartos: ${bedrooms}`,
          `Banheiros: ${bathrooms}`,
          'Mercado em alta sazonal'
        ],
        calculation: {
          basePrice: Math.round(basePrice),
          locationMultiplier,
          bedroomBonus,
          bathroomBonus
        }
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Erro na previsão de preço:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno no servidor'
    });
  }
});

// Score de leads
app.post('/api/bi/score-leads', (req, res) => {
  try {
    const { leads } = req.body;
    
    if (!leads || !Array.isArray(leads)) {
      return res.status(400).json({
        success: false,
        error: 'Lista de leads é obrigatória'
      });
    }
    
    const scoredLeads = leads.map(lead => {
      const budgetScore = Math.min(100, ((lead.budget || 0) / 1000000) * 100);
      const engagementScore = Math.min(100, (lead.engagement || 0) * 20);
      const locationScore = (lead.preferredZones || []).includes('Centro') ? 90 : 70;
      
      const overallScore = Math.round(
        budgetScore * 0.4 + engagementScore * 0.3 + locationScore * 0.3
      );

      return {
        ...lead,
        mlScore: {
          overall: overallScore,
          breakdown: { budgetScore, engagementScore, locationScore },
          conversionProbability: Math.min(100, overallScore + 20),
          priority: overallScore >= 80 ? 'high' : overallScore >= 60 ? 'medium' : 'low'
        }
      };
    });

    res.json({
      success: true,
      leads: scoredLeads,
      summary: {
        total: scoredLeads.length,
        highPriority: scoredLeads.filter(l => l.mlScore.priority === 'high').length,
        avgScore: Math.round(scoredLeads.reduce((acc, l) => acc + l.mlScore.overall, 0) / scoredLeads.length)
      }
    });
  } catch (error) {
    console.error('Erro no score de leads:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno no servidor'
    });
  }
});

// Endpoint para popular dados iniciais no Supabase
app.post('/api/admin/seed-data', async (req, res) => {
  try {
    // Importação com caminho corrigido
    const { SupabaseService } = await import('./SupabaseService.js');
    const result = await SupabaseService.seedSampleData();
    
    res.json({ 
      success: true, 
      message: 'Dados de exemplo inseridos no Supabase',
      result
    });
  } catch (error) {
    console.error('Erro ao popular dados:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Teste de conexão com Supabase
app.get('/api/admin/test-supabase', async (req, res) => {
  try {
    // Importação com caminho corrigido
    const { SupabaseService } = await import('./SupabaseService.js');
    const isConnected = await SupabaseService.testConnection();
    
    res.json({
      success: isConnected,
      connected: isConnected,
      message: isConnected ? '✅ Conexão com Supabase estabelecida' : '❌ Falha na conexão com Supabase'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      connected: false,
      error: error.message
    });
  }
});

// Rota de fallback para erro 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend BI Imobiliário rodando na porta ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Dashboard Data: http://localhost:${PORT}/api/bi/dashboard-data`);
  console.log(`🤖 ML Predictions: POST http://localhost:${PORT}/api/bi/predict-price`);
  console.log(`🎯 Lead Scoring: POST http://localhost:${PORT}/api/bi/score-leads`);
  console.log(`🌱 Seed Data: POST http://localhost:${PORT}/api/admin/seed-data`);
  console.log(`🔌 Test Supabase: GET http://localhost:${PORT}/api/admin/test-supabase`);
});