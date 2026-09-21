import { reasonWithModel } from '../model/modelGateway'
import { guidanceDecisionSchema, normalizeGuidanceDecision } from './orchestrationModels'

export async function orchestrateGuidance({ semanticContext, fallbackDecision = null, modelConfig = {} } = {}) {
  const fallbackOutput = fallbackDecision || { action: 'explain', reason: 'Safe v0.16 foundation fallback while semantic model reasoning is unavailable.', confidence: 0 }
  try {
    const result = await reasonWithModel({ task: 'guidance_decision', context: semanticContext, outputSchema: guidanceDecisionSchema, fallbackOutput }, modelConfig)
    return { decision: normalizeGuidanceDecision(result.output), model: result.meta, usedFallback: result.meta.provider === 'mock' }
  } catch (error) {
    return { decision: normalizeGuidanceDecision(fallbackOutput), model: null, usedFallback: true, error: error?.message || String(error) }
  }
}
