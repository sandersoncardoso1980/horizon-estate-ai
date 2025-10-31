const cron = require('node-cron');
const axios = require('axios');

class DataSyncService {
  constructor() {
    this.setupCronJobs();
  }

  setupCronJobs() {
    // Atualizar dados de mercado a cada hora
    cron.schedule('0 * * * *', () => {
      this.updateMarketData();
    });

    // Retreinar modelos a cada semana
    cron.schedule('0 0 * * 0', () => {
      this.retrainModels();
    });

    // Atualizar indicadores econômicos diariamente
    cron.schedule('0 6 * * *', () => {
      this.updateEconomicIndicators();
    });
  }

  async updateMarketData() {
    try {
      console.log('🔄 Atualizando dados de mercado...');
      
      // Simular busca em APIs externas
      const newData = await this.fetchExternalMarketData();
      await this.processNewData(newData);
      
      console.log('✅ Dados de mercado atualizados');
    } catch (error) {
      console.error('❌ Erro ao atualizar dados:', error);
    }
  }

  async fetchExternalMarketData() {
    // Integração com APIs reais do mercado imobiliário
    const apis = [
      'https://api.mercado-imobiliario.com/v1/listings',
      'https://api.indices-economicos.com/v1/real-estate'
    ];

    const results = await Promise.allSettled(
      apis.map(api => axios.get(api))
    );

    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value.data);
  }

  async retrainModels() {
    console.log('🤖 Retreinando modelos de ML...');
    const trainingData = await RealEstateData.find().limit(10000);
    await MLPricePredictor.trainModel(trainingData);
    console.log('✅ Modelos retreinados');
  }
}

module.exports = new DataSyncService();