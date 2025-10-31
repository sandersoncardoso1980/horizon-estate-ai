class LeadScorer {
  calculateLeadScore(leadData) {
    const scores = {
      budget: this.calculateBudgetScore(leadData.preferences.budget),
      location: this.calculateLocationScore(leadData.preferences.locations),
      engagement: this.calculateEngagementScore(leadData.behavior),
      profile: this.calculateProfileScore(leadData.contact)
    };

    const overallScore = (
      scores.budget * 0.4 +
      scores.location * 0.3 +
      scores.engagement * 0.2 +
      scores.profile * 0.1
    );

    return {
      overall: Math.round(overallScore),
      breakdown: scores,
      conversionProbability: this.predictConversionProbability(overallScore),
      priority: this.getPriorityLevel(overallScore)
    };
  }

  calculateBudgetScore(budget) {
    const avgPrice = 900000; // Média de mercado
    const budgetMid = (budget.min + budget.max) / 2;
    const deviation = Math.abs(budgetMid - avgPrice) / avgPrice;
    return Math.max(0, 100 - (deviation * 100));
  }

  calculateLocationScore(locations) {
    const premiumZones = ['Centro', 'Zona Sul', 'Alphaville'];
    const score = locations.filter(loc => premiumZones.includes(loc)).length / locations.length;
    return score * 100;
  }

  calculateEngagementScore(behavior) {
    let score = 0;
    score += Math.min(behavior.pagesViewed.length * 5, 30);
    score += Math.min(behavior.timeOnSite / 300, 40); // 5 minutos = 40 pontos
    score += Date.now() - new Date(behavior.lastActivity) < 86400000 ? 30 : 10; // Atividade recente
    return Math.min(score, 100);
  }

  predictConversionProbability(score) {
    // Curva logística para prever probabilidade
    return Math.round(100 / (1 + Math.exp(-0.1 * (score - 50))));
  }

  getPriorityLevel(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }
}

module.exports = new LeadScorer();