import { reasonWithModel } from './model/modelGateway'

export const semanticResourceAssessmentSchema = {
  required: ['conceptMatch', 'developmentalFit', 'guidanceMatch', 'overallFit', 'recommendation'],
  properties: {
    conceptMatch: { type: 'number', minimum: 0, maximum: 1 },
    developmentalFit: { type: 'number', minimum: 0, maximum: 1 },
    guidanceMatch: { type: 'number', minimum: 0, maximum: 1 },
    overallFit: { type: 'number', minimum: 0, maximum: 1 },
    recommendation: { type: 'string', enum: ['recommend', 'review', 'avoid'] },
    reason: { type: 'string' },
  },
}

const clamp = (value, fallback = 0.5) => Math.max(0, Math.min(1, Number.isFinite(Number(value)) ? Number(value) : fallback))

function fallbackAssessment(evaluatedItem = {}) {
  const score = clamp(evaluatedItem?.evaluation?.score)
  return {
    conceptMatch: score,
    developmentalFit: clamp(evaluatedItem?.evaluation?.dimensions?.developmental_fit?.score, score),
    guidanceMatch: score,
    overallFit: score,
    recommendation: score >= 0.7 ? 'recommend' : score >= 0.4 ? 'review' : 'avoid',
    reason: 'Use deterministic SynapStride resource evaluation while semantic model evaluation is unavailable.',
  }
}

export async function evaluateResourceSemantically({ evaluatedItem, semanticContext = {}, resourcePlan = {}, modelConfig = {} } = {}) {
  const fallbackOutput = fallbackAssessment(evaluatedItem)
  try {
    const result = await reasonWithModel({
      task: 'resource_evaluation',
      context: { semanticContext, resourcePlan, resource: evaluatedItem?.resource, deterministicEvaluation: evaluatedItem?.evaluation },
      outputSchema: semanticResourceAssessmentSchema,
      fallbackOutput,
    }, modelConfig)
    return { assessment: result.output, model: result.meta, usedFallback: result.meta?.provider === 'mock' }
  } catch (error) {
    return { assessment: fallbackOutput, model: null, usedFallback: true, error: error?.message || String(error) }
  }
}

export async function evaluateResourcesSemantically({ evaluated = [], semanticContext = {}, resourcePlan = {}, modelConfig = {}, maxSemanticEvaluations = 8 } = {}) {
  const slice = evaluated.slice(0, maxSemanticEvaluations)
  const assessed = await Promise.all(slice.map(async (item) => {
    const semantic = await evaluateResourceSemantically({ evaluatedItem: item, semanticContext, resourcePlan, modelConfig })
    const deterministicScore = clamp(item?.evaluation?.score)
    const semanticScore = clamp(semantic?.assessment?.overallFit)
    const combinedScore = Number((deterministicScore * 0.55 + semanticScore * 0.45).toFixed(3))
    return { ...item, semanticEvaluation: semantic.assessment, semanticModel: semantic.model, combinedScore }
  }))
  return assessed.sort((a, b) => b.combinedScore - a.combinedScore)
}
