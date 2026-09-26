import { reasonWithModel } from '../model/modelGateway'
import { experiencePersonalizationSchema } from './personalizationModels'

const normalizeCandidate = (candidate = {}) => ({
  id: candidate.opportunityId || candidate.id,
  title: candidate.title || candidate.name || 'Untitled experience',
  description: candidate.description || '',
  interests: candidate.interests || candidate.interestIds || [],
  domains: candidate.domains || candidate.domainIds || [],
  develops: candidate.develops || candidate.skillIds || [],
  ageRange: candidate.ageRange || null,
  provider: candidate.provider?.name || candidate.provider || null,
})

export async function evaluateExperiencesSemantically({ personalizationContext, candidates = [], modelConfig } = {}) {
  const normalizedCandidates = candidates.filter(Boolean).map(normalizeCandidate).filter((item) => item.id)
  if (!normalizedCandidates.length) return { evaluations: [], model: null }

  const fallbackOutput = {
    evaluations: normalizedCandidates.map((candidate, index) => ({
      candidateId: candidate.id,
      relevance: Math.max(0.35, 0.64 - (index * 0.03)),
      confidence: 0.45,
      objective: index === 0 ? 'match' : index === 1 ? 'explore' : 'surprise',
      rationale: 'A viable SynapStride candidate that can be tested through real child engagement.',
      understandingRefs: [],
    })),
  }

  const result = await reasonWithModel({
    task: 'experience_personalization',
    context: { personalization: personalizationContext, candidates: normalizedCandidates },
    outputSchema: experiencePersonalizationSchema,
    fallbackOutput,
  }, modelConfig)

  return { evaluations: result.output?.evaluations || [], model: result.meta }
}
