// src/intelligence/learningResourcePipeline.js

// ============================================================
// Career & Growth — MVP v0.8 — Phase 8.6A
// Learning Resource Candidate + Evaluation Pipeline
// ============================================================

import {
  discoverResourceCandidates,
} from './resourceProviderEngine'

import {
  evaluateDiscoveredResources,
  evaluationStatuses,
} from './resourceEvaluationEngine'


export const runLearningResourcePipeline =
  (
    discoveryRequest,
    options = {}
  ) => {
    if (!discoveryRequest) {
      return null
    }

    const candidates =
      discoverResourceCandidates(
        discoveryRequest,
        options
      )

    const evaluated =
      evaluateDiscoveredResources(
        candidates,
        discoveryRequest
      )

    const recommended =
      evaluated.filter(
        ({ evaluation }) =>
          evaluation.status !==
          evaluationStatuses.REJECT
      )

    return {
      discoveryRequestId:
        discoveryRequest.id,

      provider:
        options?.provider?.id ||
        'career_growth_development_provider',

      candidateCount:
        candidates.length,

      evaluatedCount:
        evaluated.length,

      candidates,

      evaluated,

      recommended,

      status:
        evaluated.length
          ? 'evaluated'
          : 'no_candidates',

      generatedAt:
        new Date().toISOString(),
    }
  }


export default {
  runLearningResourcePipeline,
}
