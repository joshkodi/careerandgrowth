// src/intelligence/personalizedGuidanceEngine.js

// ============================================================
// SYNAPSTRIDE MVP v0.13 — PERSONALIZED GUIDANCE
// ============================================================
//
// Thin presentation/prioritization layer over the canonical Growth
// Intelligence recommendation snapshot plus current product state.
//
// This module does NOT:
// - create evidence
// - mutate profile state
// - rank the experience catalog independently
// - infer traits or academic mastery
//
// It answers one product question:
// "Given what SynapStride already knows and what is currently in motion,
//  what should the child see as the most useful next step?"
// ============================================================

const completedJourneyStatuses = new Set([
  'completed',
])

const inactiveActivityStatuses = new Set([
  'completed',
  'attended',
  'cancelled',
  'skipped',
])

const journeyStatusPriority = {
  need_help: 100,
  in_progress: 80,
  started: 70,
  planned: 50,
}

const activityStatusPriority = {
  in_progress: 80,
  scheduled: 65,
  saved: 45,
}

const newestFirst = (a, b) =>
  new Date(
    b?.updatedAt ||
      b?.createdAt ||
      0
  ) -
  new Date(
    a?.updatedAt ||
      a?.createdAt ||
      0
  )

const sortByStatusThenRecency =
  (priorities) =>
    (a, b) => {
      const priorityDifference =
        (priorities[b?.status] || 0) -
        (priorities[a?.status] || 0)

      return priorityDifference ||
        newestFirst(a, b)
    }


export function buildPersonalizedGuidance({
  intelligenceLoop = null,
  journeyItems = [],
  growthActivities = [],
  fallbackRecommendations = [],
} = {}) {
  const nextActions =
    intelligenceLoop
      ?.recommendations
      ?.nextActions || []

  const urgentLearningAction =
    nextActions.find(
      (action) =>
        action?.kind ===
          'learning_next_step' &&
        Number(action.priority) >= 90
    ) || null

  const urgentJourneyItem =
    urgentLearningAction
      ? journeyItems.find(
          (item) =>
            item?.id ===
            urgentLearningAction
              .journeyItemId
        ) || null
      : null

  const activeJourneyItems =
    journeyItems
      .filter(
        (item) =>
          item &&
          !completedJourneyStatuses.has(
            item.status
          )
      )
      .slice()
      .sort(
        sortByStatusThenRecency(
          journeyStatusPriority
        )
      )

  const activeGrowthActivities =
    growthActivities
      .filter(
        (activity) =>
          activity &&
          !inactiveActivityStatuses.has(
            activity.status
          )
      )
      .slice()
      .sort(
        sortByStatusThenRecency(
          activityStatusPriority
        )
      )

  const continueJourney =
    activeJourneyItems[0] || null

  const continueActivity =
    activeGrowthActivities[0] || null

  const continueAction =
    continueJourney
      ? {
          kind: 'journey',
          item: continueJourney,
          title: continueJourney.title,
          reason:
            continueJourney.status ===
            'need_help'
              ? 'This still needs some support.'
              : 'You already have this in motion.',
        }
      : continueActivity
        ? {
            kind: 'growth_activity',
            item: continueActivity,
            title: continueActivity.title,
            reason:
              continueActivity.status ===
              'scheduled'
                ? 'You already have this scheduled.'
                : continueActivity.status ===
                    'in_progress'
                  ? 'You already started this.'
                  : 'You saved this to try.',
          }
        : null

  const loopRecommendation =
    intelligenceLoop
      ?.recommendations
      ?.growthExperiences
      ?.[0] || null

  const fallbackRecommendation =
    Array.isArray(
      fallbackRecommendations
    )
      ? fallbackRecommendations[0] || null
      : null

  const recommendation =
    loopRecommendation ||
    fallbackRecommendation

  const tryNext = recommendation
    ? {
        kind: 'growth_experience',
        recommendation,
        title: recommendation.title,
        reason:
          recommendation.reasons?.[0] ||
          'Picked from your current Growth Profile and what you have told SynapStride.',
      }
    : null

  const needsAttention =
    urgentLearningAction
      ? {
          kind: 'learning_support',
          action: urgentLearningAction,
          item: urgentJourneyItem,
          title:
            urgentJourneyItem?.title ||
            urgentLearningAction.title,
          reason:
            urgentLearningAction.rationale ||
            urgentLearningAction.description ||
            'A current learning item still needs support.',
        }
      : null

  const primary =
    needsAttention ||
    continueAction ||
    tryNext ||
    {
      kind: 'explore',
      title: 'Find something new to try',
      reason:
        'Exploring something new gives SynapStride another real experience to learn from.',
    }

  return {
    version: '0.13.0',
    needsAttention,
    continueAction,
    tryNext,
    primary,

    explanation: {
      intent:
        intelligenceLoop
          ?.recommendations
          ?.intent || null,
      text:
        primary.reason || null,
    },
  }
}


export default {
  buildPersonalizedGuidance,
}
