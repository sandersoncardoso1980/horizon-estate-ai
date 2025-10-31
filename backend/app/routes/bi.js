const express = require('express');
const router = express.Router();
const MLPricePredictor = require('../services/MLPricePredictor');
const LeadScorer = require('../services/LeadScorer');
const RealEstateData = require('../models/RealEstateData');

// Previsões de preço
router.post('/predict-price', async (req, res) => {
  try {
    const { propertyData } = req.body;
    const prediction = await MLPricePredictor.predictPrice(propertyData);
    
    res.json({
      success: true,
      prediction,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Análise de mercado
router.get('/market-analysis', async (req, res) => {
  try {
    const { zone, period } = req.query;
    
    const analysis = await RealEstateData.aggregate([
      { $match: zone ? { 'location.zone': zone } : {} },
      { 
        $group: {
          _id: null,
          avgPrice: { $avg: '$price.current' },
          totalProperties: { $sum: 1 },
          avgDemand: { $avg: '$marketMetrics.demandScore' },
          avgConversion: { $avg: '$marketMetrics.conversionRate' }
        }
      }
    ]);

    res.json({
      success: true,
      analysis: analysis[0] || {},
      trends: await getMarketTrends(period)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Score de leads em lote
router.post('/score-leads', async (req, res) => {
  try {
    const { leads } = req.body;
    const scoredLeads = leads.map(lead => ({
      ...lead,
      mlScore: LeadScorer.calculateLeadScore(lead)
    }));

    res.json({
      success: true,
      leads: scoredLeads,
      summary: generateLeadSummary(scoredLeads)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dados para dashboard
router.get('/dashboard-data', async (req, res) => {
  try {
    const [
      pricePredictions,
      regionData,
      leadScores,
      heatmapData
    ] = await Promise.all([
      getPricePredictionData(),
      getRegionAnalysisData(),
      getLeadScoreDistribution(),
      getHeatmapData()
    ]);

    res.json({
      success: true,
      data: {
        priceData: pricePredictions,
        regionData,
        leadScoreData: leadScores,
        heatmapData,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;