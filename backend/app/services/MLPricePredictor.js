const tf = require('@tensorflow/tfjs-node');
const mongoose = require('mongoose');

class MLPricePredictor {
  constructor() {
    this.model = null;
    this.isTrained = false;
    this.featureColumns = [
      'size', 'bedrooms', 'bathrooms', 'parking', 
      'location_score', 'amenities_count',
      'economic_indicator', 'market_trend'
    ];
  }

  async loadOrCreateModel() {
    try {
      this.model = await tf.loadLayersModel('file://./data/models/price-prediction/model.json');
      this.isTrained = true;
      console.log('✅ Modelo de preços carregado');
    } catch (error) {
      await this.createNewModel();
    }
  }

  async createNewModel() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [this.featureColumns.length], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    console.log('🆕 Novo modelo de preços criado');
  }

  async trainModel(trainingData) {
    const features = trainingData.map(item => this.extractFeatures(item));
    const labels = trainingData.map(item => item.price.current);

    const featureTensor = tf.tensor2d(features);
    const labelTensor = tf.tensor1d(labels);

    await this.model.fit(featureTensor, labelTensor, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 20 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}`);
          }
        }
      }
    });

    this.isTrained = true;
    await this.model.save('file://./data/models/price-prediction/');
    
    featureTensor.dispose();
    labelTensor.dispose();
  }

  async extractFeatures(propertyData) {
    return [
      propertyData.characteristics.size / 100, // Normalize
      propertyData.characteristics.bedrooms / 10,
      propertyData.characteristics.bathrooms / 10,
      propertyData.characteristics.parking / 5,
      this.calculateLocationScore(propertyData.location),
      propertyData.characteristics.amenities.length / 20,
      await this.getEconomicIndicator(),
      await this.getMarketTrend()
    ];
  }

  calculateLocationScore(location) {
    // Lógica complexa baseada em localização
    const zoneScores = {
      'Centro': 0.95,
      'Zona Sul': 0.85,
      'Zona Oeste': 0.75,
      'Zona Norte': 0.65
    };
    return zoneScores[location.zone] || 0.5;
  }

  async predictPrice(propertyFeatures) {
    if (!this.isTrained) {
      throw new Error('Modelo não está treinado');
    }

    const features = this.extractFeatures(propertyFeatures);
    const inputTensor = tf.tensor2d([features]);
    const prediction = this.model.predict(inputTensor);
    const predictedPrice = prediction.dataSync()[0];
    
    inputTensor.dispose();
    prediction.dispose();

    // Calcular confiança baseada na similaridade com dados de treino
    const confidence = await this.calculateConfidence(features);

    return {
      predictedPrice: Math.round(predictedPrice),
      confidence: Math.round(confidence * 100),
      factors: this.analyzeFactors(features)
    };
  }

  async calculateConfidence(features) {
    // Lógica para calcular confiança baseada na distribuição dos dados de treino
    return 0.85 + (Math.random() * 0.1); // Exemplo simplificado
  }

  analyzeFactors(features) {
    const factors = [];
    if (features[0] > 0.8) factors.push('Metragem acima da média');
    if (features[4] > 0.9) factors.push('Localização premium');
    if (features[5] > 0.7) factors.push('Muitas amenidades');
    return factors;
  }
}

module.exports = new MLPricePredictor();