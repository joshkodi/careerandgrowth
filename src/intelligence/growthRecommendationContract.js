// src/intelligence/growthRecommendationContract.js

// ============================================================
// SynapStride — MVP v0.11 — Growth Intelligence Foundation
// Canonical Recommendation Contract
//
// Converts domain-specific next actions into one stable contract
// that Home, School & Learning, Interests & Activities, Explore,
// and future interfaces can consume without knowing engine internals.
// ============================================================

export const growthRecommendationContractVersion = '0.11.1'

export const growthRecommendationKinds = Object.freeze({
  LEARNING_NEXT_STEP: 'learning_next_step',
  GROWTH_EXPERIENCE: 'growth_experience',
  ACTIVITY: 'activity',
  LOCAL_OPPORTUNITY: 'local_opportunity',
})

const inferDomain = (action) => {
  if (
    action?.kind ===
    growthRecommendationKinds.LEARNING_NEXT_STEP
  ) {
    return 'school_learning'
  }

  if (
    action?.kind ===
    growthRecommendationKinds.LOCAL_OPPORTUNITY
  ) {
    return 'location'
  }

  if (
    action?.kind ===
    growthRecommendationKinds.ACTIVITY
  ) {
    return 'interests_activities'
  }

  return 'experiences'
}

export function createGrowthRecommendation({
  action,
  recommendationIntent = null,
  rank = 0,
} = {}) {
  if (!action?.id) return null

  const reasons = Array.isArray(action.reasons)
    ? action.reasons.filter(Boolean)
    : []

  return {
    id: action.id,
    version: growthRecommendationContractVersion,

    domain: action.domain || inferDomain(action),
    kind: action.kind || 'unknown',
    intent:
      action.intent ||
      recommendationIntent?.type ||
      'explore',

    target: {
      experienceId: action.experienceId || null,
      journeyItemId: action.journeyItemId || null,
      resourceId: action.resourceId || null,
      opportunityId: action.opportunityId || null,
    },

    presentation: {
      title: action.title || 'Next step',
      description: action.description || null,
      emoji: action.emoji || null,
      actionLabel: action.actionLabel || null,
    },

    context: {
      subject: action.subject || null,
      topic: action.topic || null,
      path: action.path || null,
    },

    reasoning: {
      whyThisFits:
        action.rationale ||
        reasons[0] ||
        recommendationIntent?.reason ||
        'Recommended from the current Growth Intelligence context.',
      reasons,
      matches: action.matches || null,
      score: action.score ?? null,
      priority:
        action.priority ??
        recommendationIntent?.priority ??
        null,
      source:
        recommendationIntent?.source || null,
      sourceId:
        recommendationIntent?.sourceId || null,
      guardrail: action.guardrail || null,
    },

    rank,

    feedback: {
      supported: true,
      becomesEvidenceDirectly: false,
    },
  }
}

export function buildGrowthRecommendationSet({
  nextActions = [],
  recommendationIntent = null,
} = {}) {
  const items = (Array.isArray(nextActions) ? nextActions : [])
    .map((action, index) =>
      createGrowthRecommendation({
        action,
        recommendationIntent,
        rank: index + 1,
      })
    )
    .filter(Boolean)

  return {
    version: growthRecommendationContractVersion,
    intent: recommendationIntent,
    items,
    primary: items[0] || null,
    generatedAt: new Date().toISOString(),
  }
}

export default {
  growthRecommendationContractVersion,
  growthRecommendationKinds,
  createGrowthRecommendation,
  buildGrowthRecommendationSet,
}
