import { reasonWithModel } from './model/modelGateway'
import { resourceTypes } from './resourceDiscoveryEngine'

export const resourcePlanSchema = {
  required: ['resourceNeeded', 'searchQueries', 'preferredResourceTypes', 'evaluationPriorities'],
  properties: {
    resourceNeeded: { type: 'boolean' },
    searchQueries: { type: 'array', items: { type: 'string' } },
    preferredResourceTypes: { type: 'array', items: { type: 'string' } },
    evaluationPriorities: { type: 'array', items: { type: 'string' } },
    rationale: { type: 'string' },
  },
}

const unique = (values = []) => [...new Set(values.filter(Boolean))]

function fallbackPlan({ semanticContext = {}, discoveryRequest = {} } = {}) {
  const intent = semanticContext?.interaction?.semanticIntent?.intent
  const explicitResourceRequest = intent === 'resource_request'
  const existingQueries = discoveryRequest?.searchQueries || []
  const contextTerms = unique([
    semanticContext?.experience?.subject,
    semanticContext?.experience?.topic,
    semanticContext?.experience?.title,
  ])
  const query = contextTerms.join(' ').trim()
  return {
    resourceNeeded: explicitResourceRequest || Boolean(discoveryRequest),
    searchQueries: unique([...existingQueries, query]).slice(0, 6),
    preferredResourceTypes: unique(discoveryRequest?.discoveryCriteria?.preferredResourceTypes || [resourceTypes.INTERACTIVE, resourceTypes.VIDEO, resourceTypes.PRACTICE]),
    evaluationPriorities: ['concept_match', 'developmental_fit', 'guidance_match', 'source_credibility', 'safety'],
    rationale: 'Use the active learning context and trusted discovery request without inventing resource URLs.',
  }
}

export async function planSemanticResources({ semanticContext = {}, discoveryRequest = {}, modelConfig = {} } = {}) {
  const fallbackOutput = fallbackPlan({ semanticContext, discoveryRequest })
  try {
    const result = await reasonWithModel({
      task: 'resource_plan',
      context: { semanticContext, discoveryRequest },
      outputSchema: resourcePlanSchema,
      fallbackOutput,
    }, modelConfig)
    return { plan: result.output, model: result.meta, usedFallback: result.meta?.provider === 'mock' }
  } catch (error) {
    return { plan: fallbackOutput, model: null, usedFallback: true, error: error?.message || String(error) }
  }
}

export function applySemanticResourcePlan(discoveryRequest, plan) {
  if (!discoveryRequest || !plan) return discoveryRequest
  return {
    ...discoveryRequest,
    searchQueries: unique([...(plan.searchQueries || []), ...(discoveryRequest.searchQueries || [])]).slice(0, 8),
    discoveryCriteria: {
      ...(discoveryRequest.discoveryCriteria || {}),
      preferredResourceTypes: unique([...(plan.preferredResourceTypes || []), ...(discoveryRequest?.discoveryCriteria?.preferredResourceTypes || [])]),
    },
    semanticPlan: {
      resourceNeeded: plan.resourceNeeded !== false,
      evaluationPriorities: plan.evaluationPriorities || [],
      rationale: plan.rationale || '',
    },
  }
}
