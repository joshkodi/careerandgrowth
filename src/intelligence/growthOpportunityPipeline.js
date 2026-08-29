// src/intelligence/growthOpportunityPipeline.js

// ============================================================
// SynapStride — MVP v0.11 — Phase 4
// Growth Opportunity Discovery + Evaluation Pipeline
// ============================================================

import {
  discoverGrowthOpportunityCandidates,
} from './growthOpportunityProviderEngine'

import {
  evaluateGrowthOpportunities,
  opportunityEvaluationStatuses,
} from './growthOpportunityEvaluationEngine'

export const growthOpportunityPipelineVersion = '0.11.3'

export function runGrowthOpportunityPipeline(
  discoveryRequest,
  {
    provider = null,
    existingOpportunityIds = [],
    recommendationLimit = 5,
  } = {}
) {
  if (!discoveryRequest) {
    return {
      version: growthOpportunityPipelineVersion,
      status: 'not_requested',
      candidates: [],
      evaluated: [],
      recommended: [],
    }
  }

  const candidates =
    discoverGrowthOpportunityCandidates(
      discoveryRequest,
      provider ? { provider } : {}
    )

  const evaluated =
    evaluateGrowthOpportunities(
      candidates,
      discoveryRequest,
      { existingOpportunityIds }
    )

  const recommended =
    evaluated
      .filter(
        (item) =>
          item?.evaluation?.status !==
          opportunityEvaluationStatuses.REJECT
      )
      .slice(0, recommendationLimit)

  return {
    version: growthOpportunityPipelineVersion,
    status:
      recommended.length > 0
        ? 'ready'
        : candidates.length > 0
          ? 'review_needed'
          : 'no_matches',
    provider:
      provider?.id ||
      'synapstride_curated_growth_catalog',
    candidateCount: candidates.length,
    evaluatedCount: evaluated.length,
    recommendedCount: recommended.length,
    candidates,
    evaluated,
    recommended,
    generatedAt: new Date().toISOString(),
  }
}

export default {
  growthOpportunityPipelineVersion,
  runGrowthOpportunityPipeline,
}
