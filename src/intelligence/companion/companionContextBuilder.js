const take = (v, n = 5) => Array.isArray(v) ? v.slice(0, n) : []
export function buildCompanionContext({ childUnderstanding, growthContext, immediateContext = {}, conversation = [], message, intentResult } = {}) {
  const inferred = take(childUnderstanding?.modelInferred, 4).map((item) => ({ id: item.id, type: item.type, concept: item.concept, statement: item.statement, confidence: item.confidence, status: item.status }))
  const derived = childUnderstanding?.factualContext?.derived || {}
  return {
    interaction: { message: String(message || '').trim(), intent: intentResult?.intent || 'general', personalizationNeed: intentResult?.personalizationNeed || 'light' },
    immediate: { surface: immediateContext?.surface || null, experience: immediateContext?.experience || null, action: immediateContext?.action || null },
    childUnderstanding: {
      stated: childUnderstanding?.factualContext?.stated || {},
      derived: { domains: take(derived?.domains, 4), traits: take(derived?.traits, 4) },
      modelHypotheses: inferred,
      modelSummary: childUnderstanding?.modelSummary || null,
    },
    growth: { recommendations: take(growthContext?.recommendations?.growthExperiences, 3), establishedPatterns: take(growthContext?.patterns?.established, 4) },
    conversation: take(conversation, 6),
    policy: { childFacing: true, preserveChildAgency: true, modelMayProposeActions: true, modelMayExecuteActions: false, conversationIsNotAutomaticallyEvidence: true },
  }
}
