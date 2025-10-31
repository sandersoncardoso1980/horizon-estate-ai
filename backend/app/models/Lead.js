const leadSchema = new mongoose.Schema({
  leadId: String,
  contact: {
    name: String,
    email: String,
    phone: String
  },
  preferences: {
    budget: { min: Number, max: Number },
    locations: [String],
    propertyTypes: [String],
    size: { min: Number, max: Number }
  },
  behavior: {
    pagesViewed: [String],
    timeOnSite: Number,
    lastActivity: Date
  },
  mlScore: {
    overall: Number,
    budgetMatch: Number,
    locationPreference: Number,
    engagement: Number,
    conversionProbability: Number
  },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost'] 
  },
  createdAt: { type: Date, default: Date.now }
});