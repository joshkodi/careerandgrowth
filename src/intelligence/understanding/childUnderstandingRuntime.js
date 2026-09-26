import { recordIntelligenceTrace } from '../observability/intelligenceTrace'
import { buildChildUnderstandingContext } from './childUnderstandingContextBuilder'
import { childUnderstandingVersion } from './childUnderstandingModels'
import { reasonAboutChild } from './childUnderstandingReasoner'

export async function buildModelBackedChildUnderstanding({ growthContext, modelConfig } = {}) {
  const startedAt = Date.now()
  const context = buildChildUnderstandingContext(growthContext)
  const result = await reasonAboutChild({ context, modelConfig })

  const understanding = {
    version: childUnderstandingVersion,
    child: context.child,
    factualContext: {
      stated: context.stated,
      observed: context.observed,
      derived: context.derived,
    },
    modelInferred: result.validation.accepted,
    modelSummary: result.validation.summary,
    rejectedModelInferences: result.validation.rejected,
    provenance: {
      rawEvidenceIsSourceOfTruth: true,
      modelInterpretationIsAuthoritative: false,
      modelInferencesAreHypotheses: true,
      executionAuthority: 'synapstride',
    },
    model: result.model,
    builtAt: new Date().toISOString(),
  }

  recordIntelligenceTrace({
    type: 'model_backed_child_understanding',
    childId: context?.child?.id || null,
    acceptedInferenceCount: understanding.modelInferred.length,
    rejectedInferenceCount: understanding.rejectedModelInferences.length,
    model: result.model,
    latencyMs: Date.now() - startedAt,
  })

  return understanding
}
