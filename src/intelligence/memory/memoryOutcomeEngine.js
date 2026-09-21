import { localMemoryRepository } from './memoryRepository'
import { memoryTypes } from './memoryModels'

export async function captureGuidanceOutcome({ childId, semanticContext, decision, userMessage, companionText, outcome = 'guidance_delivered' } = {}) {
  if (!childId || !decision) return null
  const topic = semanticContext?.experience?.topic || semanticContext?.experience?.title || semanticContext?.semanticConcepts?.[0] || null
  return localMemoryRepository.save({ childId, type: memoryTypes.GUIDANCE_OUTCOME, summary: `${decision.action} guidance for ${topic || 'current context'}: ${outcome}`, context: { topic, action: decision.action, strategy: decision.strategy || {}, taxonomyMappings: semanticContext?.taxonomyMappings || [] }, evidence: { userMessage: String(userMessage || '').slice(0, 500), companionText: String(companionText || '').slice(0, 1000), outcome, deliveredAt: new Date().toISOString() }, confidence: decision.confidence })
}
