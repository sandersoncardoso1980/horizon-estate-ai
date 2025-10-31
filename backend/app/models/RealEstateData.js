const mongoose = require('mongoose');

const realEstateSchema = new mongoose.Schema({
  propertyId: String,
  type: { type: String, enum: ['apartment', 'house', 'commercial'] },
  location: {
    neighborhood: String,
    zone: String,
    coordinates: { lat: Number, lng: Number }
  },
  characteristics: {
    size: Number,
    bedrooms: Number,
    bathrooms: Number,
    parking: Number,
    amenities: [String]
  },
  price: {
    current: Number,
    predicted: Number,
    confidence: Number,
    history: [{
      date: Date,
      price: Number,
      source: String
    }]
  },
  marketMetrics: {
    demandScore: Number,
    timeOnMarket: Number,
    views: Number,
    conversionRate: Number
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RealEstateData', realEstateSchema);