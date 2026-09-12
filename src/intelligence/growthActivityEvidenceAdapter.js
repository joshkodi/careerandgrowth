// src/intelligence/growthActivityEvidenceAdapter.js

import {
  evidenceSourceTypes,
} from '../data/growthTaxonomy'

import {
  createEvidenceEvent,
} from './evidenceEngine'

import {
  getEnjoymentEvidence,
  getCompletionEvidence,
} from './legacyEvidenceAdapter'


// ============================================================
// SYNAPSTRIDE MVP v0.13 — GROWTH ACTIVITY EVIDENCE ADAPTER
// ============================================================
//
// Growth Activities are product state until the child actually does
// something meaningful. Saving, scheduling, and starting an activity
// must NOT become Growth Intelligence evidence by themselves.
//
// Only:
//   1) completed / attended outcomes, and
//   2) explicit child reflection
// are converted into canonical evidence events.
//
// Recommendation context remains provenance only; it never becomes
// evidence by itself.
// ============================================================

const terminalActivityStatuses = new Set([
  'completed',
  'attended',
])

const enjoymentMap = Object.freeze({
  not_for_me: 0,
  okay: 1,
  liked_it: 2,
  loved_it: 3,
})

const getActivityExperienceId = (activity) =>
  activity?.experienceId ||
  activity?.opportunityId ||
  activity?.id ||
  null

const getActivityDomainId = (activity) =>
  activity?.metadata?.domainId ||
  activity?.recommendationContext?.domainId ||
  activity?.recommendationContext?.matches?.domains?.[0]?.id ||
  null

const withStableId = (event, id) => ({
  ...event,
  id,
})


export function buildGrowthActivityCompletionEvidence({
  childId,
  activity,
  previousStatus = null,
  sessionId = null,
} = {}) {
  if (!childId || !activity?.id) {
    return []
  }

  if (!terminalActivityStatuses.has(activity.status)) {
    return []
  }

  // Do not create another completion event when the same terminal state
  // is written repeatedly by the UI.
  if (previousStatus === activity.status) {
    return []
  }

  const experienceId =
    getActivityExperienceId(activity)

  const event = createEvidenceEvent({
    childId,

    source: {
      type:
        evidenceSourceTypes
          .COMPLETION,

      experienceId,

      questionId:
        'growth_activity_outcome',

      responseId:
        activity.status,
    },

    evidence:
      getCompletionEvidence(),

    context: {
      domainId:
        getActivityDomainId(activity),

      sessionId,
    },

    metadata: {
      growthActivityId:
        activity.id,

      opportunityId:
        activity.opportunityId || null,

      activityType:
        activity.type || null,

      activityTitle:
        activity.title || '',

      outcome:
        activity.status,

      origin:
        activity.origin || null,
    },
  })

  return [
    withStableId(
      event,
      `growth_activity:${activity.id}:outcome:${activity.status}`
    ),
  ]
}


export function buildGrowthActivityReflectionEvidence({
  childId,
  activity,
  reflection = null,
  sessionId = null,
} = {}) {
  if (!childId || !activity?.id || !reflection) {
    return []
  }

  const enjoymentValue =
    enjoymentMap[
      reflection.enjoyment
    ]

  if (enjoymentValue === undefined) {
    return []
  }

  const experienceId =
    getActivityExperienceId(activity)

  const event = createEvidenceEvent({
    childId,

    source: {
      type:
        evidenceSourceTypes
          .REFLECTION,

      experienceId,

      questionId:
        'growth_activity_enjoyment',

      responseId:
        reflection.enjoyment,
    },

    evidence:
      getEnjoymentEvidence(
        enjoymentValue
      ),

    context: {
      domainId:
        getActivityDomainId(activity),

      sessionId,
    },

    metadata: {
      growthActivityId:
        activity.id,

      opportunityId:
        activity.opportunityId || null,

      activityType:
        activity.type || null,

      activityTitle:
        activity.title || '',

      questionText:
        'How did this activity go?',

      responseText:
        reflection.enjoyment,

      enjoymentValue,

      favoritePart:
        reflection.favoritePart || '',

      learned:
        reflection.learned || '',

      wouldDoAgain:
        reflection.wouldDoAgain ?? null,

      wantsNext:
        reflection.wantsNext || '',
    },
  })

  return [
    withStableId(
      event,
      `growth_activity:${activity.id}:reflection:enjoyment`
    ),
  ]
}


export default {
  buildGrowthActivityCompletionEvidence,
  buildGrowthActivityReflectionEvidence,
}
