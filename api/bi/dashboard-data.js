// api/bi/dashboard-data.js
import { getMockData } from '../../server-mock.js'; // vamos criar isso

export default function handler(req, res) {
  try {
    // Simula o comportamento do seu server.js
    console.log('📊 Vercel API: Buscando dados do dashboard...');

    // Força mock por enquanto (ou conecta Supabase depois)
    const mockData = getMockData();

    res.status(200).json({
      success: true,
      data: mockData,
      source: 'vercel-mock',
      lastUpdated: new Date(),
      message: 'Dados mock - rodando no Vercel Serverless'
    });
  } catch (error) {
    console.error('Erro na API Vercel:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      data: getMockData(),
      source: 'vercel-error-fallback'
    });
  }
}
