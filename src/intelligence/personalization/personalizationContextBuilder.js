import { createBalancedPersonalizationIntent, personalizationVersion } from './personalizationModels'

const compact = (items = [], limit = 8) => (Array.isArray(items) ? items : []).filter(Boolean).slice(0, limit)

export function buildPersonalizationContext({ childUnderstanding, growthContext, recentOutcomes = [] } = {}) {
  const inferred = compact(childUnderstanding?.modelInferred, 8)
  return {
    version: personalizationVersion,
    child: childUnderstanding?.child || growthContext?.child || {},
    stated: childUnderstanding?.factualContext?.stated || growthContext?.stated || {},
    observed: childUnderstanding?.factualContext?.observed || growthContext?.observed || {},
    derived: childUnderstanding?.factualContext?.derived || growthContext?.derived || {},
    modelHypotheses: inferred.map((item) => ({
      id: item.id || item.inferenceId || null,
      type: item.type,
      concept: item.concept,
      statement: item.statement,
      confidence: item.confidence,
      evidenceRefs: compact(item.evidenceRefs, 6),
    })),
    recentOutcomes: compact(recentOutcomes, 8),
    intent: createBalancedPersonalizationIntent(),
    policy: {
      modelDoesNotExecute: true,
      modelDoesNotCreateCandidates: true,
      modelScoresOnlySuppliedCandidates: true,
      finalRankingOwnedBySynapStride: true,
    },
  }
}
