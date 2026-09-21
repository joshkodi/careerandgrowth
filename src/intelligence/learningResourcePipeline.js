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

import {
  planSemanticResources,
  applySemanticResourcePlan,
} from './semanticResourcePlanner'

import {
  evaluateResourcesSemantically,
} from './semanticResourceEvaluator'


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


// v0.16 Stage 4 — semantic planning/evaluation wrapper.
// The original synchronous pipeline remains intact as a safe fallback.
export const runIntelligentLearningResourcePipeline =
  async (
    discoveryRequest,
    {
      semanticContext = {},
      modelConfig = {},
      maxSemanticEvaluations = 8,
      ...options
    } = {}
  ) => {
    if (!discoveryRequest) return null

    const planning = await planSemanticResources({
      semanticContext,
      discoveryRequest,
      modelConfig,
    })

    if (planning?.plan?.resourceNeeded === false) {
      return {
        discoveryRequestId: discoveryRequest.id,
        status: 'resource_not_needed',
        semanticPlan: planning.plan,
        candidates: [],
        evaluated: [],
        recommended: [],
        generatedAt: new Date().toISOString(),
      }
    }

    const plannedRequest = applySemanticResourcePlan(
      discoveryRequest,
      planning.plan
    )

    const deterministic = runLearningResourcePipeline(
      plannedRequest,
      options
    )

    const semanticEvaluated = await evaluateResourcesSemantically({
      evaluated: deterministic?.evaluated || [],
      semanticContext,
      resourcePlan: planning.plan,
      modelConfig,
      maxSemanticEvaluations,
    })

    const recommended = semanticEvaluated.filter(
      (item) =>
        item?.evaluation?.status !== evaluationStatuses.REJECT &&
        item?.semanticEvaluation?.recommendation !== 'avoid'
    )

    return {
      ...deterministic,
      discoveryRequest: plannedRequest,
      semanticPlan: planning.plan,
      planningModel: planning.model,
      semanticEvaluated,
      recommended,
      status: semanticEvaluated.length
        ? 'semantically_evaluated'
        : deterministic?.status || 'no_candidates',
    }
  }


export default {
  runLearningResourcePipeline,
  runIntelligentLearningResourcePipeline,
}
