import { assembleSemanticContext } from './semantic/semanticContextAssembler'
import { resolveTaxonomyCandidates, validateSemanticTaxonomyCandidates } from './taxonomy/taxonomyResolver'
import { localMemoryRepository } from './memory/memoryRepository'
import { orchestrateGuidance } from './orchestration/guidanceOrchestrator'
import { recordIntelligenceTrace } from './observability/intelligenceTrace'
import { inferSemanticIntent } from './semantic/semanticIntentEngine'
import { captureGuidanceOutcome } from './memory/memoryOutcomeEngine'

export async function buildIntelligenceRuntimeContext(input = {}) {
  const semanticIntent = await inferSemanticIntent({ message: input?.interaction?.message, experience: input?.experience, growthContext: input?.growthContext, companionContext: input?.companionContext, modelConfig: input?.modelConfig })
  const concepts = [...new Set([...(Array.isArray(input.semanticConcepts) ? input.semanticConcepts : []), ...(semanticIntent.concepts || [])].filter(Boolean))]
  const semanticMappings = validateSemanticTaxonomyCandidates(semanticIntent.taxonomyCandidates || [])
  const taxonomyMappings = semanticMappings.length ? semanticMappings : resolveTaxonomyCandidates(concepts)
  const memoryTerms = [...concepts, ...taxonomyMappings.map((x) => x.label)].filter(Boolean)
  const relevantMemory = input.childId ? await localMemoryRepository.findRelevant({ childId: input.childId, terms: memoryTerms, limit: 8 }) : []
  return assembleSemanticContext({ ...input, semanticConcepts: concepts, interaction: { ...(input.interaction || {}), semanticIntent }, relevantMemory, taxonomyMappings })
}

export async function runGuidanceOrchestration(input = {}) {
  const startedAt = Date.now(); const semanticContext = input.semanticContext || await buildIntelligenceRuntimeContext(input)
  let adaptiveOutcome = { observed: false }
  if (input.childId && input?.interaction?.message) {
    try {
      // Lazy-load Stage 5 so adaptive learning can never prevent the core app/runtime from loading.
      const { observePreviousGuidanceOutcome } = await import('./memory/adaptiveLearningLoop')
      adaptiveOutcome = await observePreviousGuidanceOutcome({
        childId: input.childId,
        message: input.interaction.message,
        semanticContext,
        modelConfig: input.modelConfig,
        sessionId: input.sessionId || null,
      })
    } catch (error) {
      console.warn('[v0.16 Stage 5] Adaptive outcome observation skipped:', error)
      adaptiveOutcome = { observed: false, error: 'adaptive_outcome_unavailable' }
    }
  }
  const result = await orchestrateGuidance({ semanticContext, fallbackDecision: input.fallbackDecision, modelConfig: input.modelConfig })
  recordIntelligenceTrace({ type: 'guidance_orchestration', childId: semanticContext?.actor?.childId || null, contextVersion: semanticContext?.version, semanticIntent: semanticContext?.interaction?.semanticIntent, taxonomyMappings: semanticContext?.taxonomyMappings, memoryCount: semanticContext?.relevantMemory?.length || 0, decision: result.decision, model: result.model, usedFallback: result.usedFallback, latencyMs: Date.now() - startedAt })
  return { semanticContext, adaptiveOutcome, ...result }
}

export async function recordGuidanceOutcome(input = {}) { return captureGuidanceOutcome(input) }
