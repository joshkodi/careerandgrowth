import { normalizeGuidanceDecision } from './orchestrationModels'

// v0.17: Guidance decisions are owned by SynapStride, not by a separate LLM call.
// semantic_analysis supplies model-backed interpretation; this layer applies
// product-controlled orchestration and preserves the existing decision contract.
export async function orchestrateGuidance({
  semanticContext,
  fallbackDecision = null,
} = {}) {
  const baseDecision =
    fallbackDecision || {
      action: 'explain',
      reason: 'Provide useful contextual guidance using SynapStride-controlled orchestration.',
      confidence: 0,
    }

  const decision = normalizeGuidanceDecision({
    ...baseDecision,
    strategy: {
      ...(baseDecision?.strategy || {}),
      orchestration: 'deterministic',
      semanticIntent:
        semanticContext?.intent ||
        semanticContext?.semanticAnalysis?.intent ||
        null,
    },
  })

  return {
    decision,
    model: null,
    usedFallback: false,
  }
}
