// api/bi/dashboard-data.js

// Dados mock diretamente no arquivo (fallback se o import não funcionar)
const mockData = {
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

export default function handler(req, res) {
  try {
    // Simula o comportamento do seu server.js
    console.log('📊 Vercel API: Buscando dados do dashboard...');

    // Usa dados mock (pode conectar ao Supabase depois)
    const data = mockData;

    res.status(200).json({
      success: true,
      data: data,
      source: 'vercel-api',
      lastUpdated: new Date(),
      message: 'Dados do dashboard - Vercel Serverless'
    });
  } catch (error) {
    console.error('Erro na API Vercel:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      data: mockData,
      source: 'vercel-error-fallback'
    });
  }
}
