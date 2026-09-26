import { recordIntelligenceTrace } from '../observability/intelligenceTrace'
import { buildPersonalizationContext } from './personalizationContextBuilder'
import { evaluateExperiencesSemantically } from './experienceSemanticEvaluator'
import { validatePersonalizationEvaluations } from './personalizationValidator'
import { rankPersonalizedExperiences } from './personalizationRanker'

export async function personalizeExperienceCandidates({ childUnderstanding, growthContext, candidates = [], recentOutcomes = [], modelConfig, limit = 3 } = {}) {
  const startedAt = Date.now()
  const context = buildPersonalizationContext({ childUnderstanding, growthContext, recentOutcomes })
  const modelResult = await evaluateExperiencesSemantically({ personalizationContext: context, candidates, modelConfig })
  const validation = validatePersonalizationEvaluations({ evaluations: modelResult.evaluations, candidates, childUnderstanding })
  const ranked = rankPersonalizedExperiences({ candidates, evaluations: validation.accepted, limit })

  recordIntelligenceTrace({
    type: 'experience_personalization',
    childId: context?.child?.id || null,
    candidateCount: candidates.length,
    acceptedEvaluationCount: validation.accepted.length,
    rejectedEvaluationCount: validation.rejected.length,
    resultCount: ranked.length,
    model: modelResult.model,
    latencyMs: Date.now() - startedAt,
  })

  return { context, ranked, validation, model: modelResult.model }
}
