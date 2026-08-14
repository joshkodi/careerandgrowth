// ============================================================
// Career & Growth
// MVP v0.4
//
// Journey Models
//
// Grow = what the system/student/parent thinks is worth trying.
// Journey = what the child actually does and learns from.
// ============================================================


export const journeyStatuses = {
  STARTED: 'started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
}


export const journeyOrigins = {
  RECOMMENDATION:
    'recommendation',

  STUDENT:
    'student',

  PARENT:
    'parent',

  OTHER:
    'other',
}


// ============================================================
// CREATE JOURNEY ITEM
// ============================================================

export function createJourneyItem({
  childId,
  experienceId,
  title,
  emoji = '🌱',
  description = '',
  origin =
    journeyOrigins.RECOMMENDATION,
  recommendation = null,
}) {
  if (!childId) {
    throw new Error(
      'Journey item requires childId.'
    )
  }

  if (!experienceId) {
    throw new Error(
      'Journey item requires experienceId.'
    )
  }

  const now =
    new Date().toISOString()

  return {
    id:
      createJourneyId(),

    childId,

    experienceId,

    title:
      title ||
      'Growth Experience',

    emoji,

    description,

    status:
      journeyStatuses.STARTED,

    origin,

    recommendationContext:
      recommendation
        ? {
            score:
              recommendation.score ??
              null,

            reasons:
              recommendation.reasons ||
              [],

            matches:
              recommendation.matches ||
              null,
          }
        : null,

    progress: {
      percent: 0,
    },

    reflection: null,

    createdAt: now,

    startedAt: now,

    updatedAt: now,

    completedAt: null,
  }
}


// ============================================================
// UPDATE JOURNEY STATUS
// ============================================================

export function updateJourneyStatus(
  journeyItem,
  status
) {
  if (!journeyItem) {
    return null
  }

  const now =
    new Date().toISOString()

  return {
    ...journeyItem,

    status,

    updatedAt: now,

    completedAt:
      status ===
      journeyStatuses.COMPLETED
        ? now
        : journeyItem.completedAt,
  }
}


// ============================================================
// UPDATE JOURNEY PROGRESS
// ============================================================

export function updateJourneyProgress(
  journeyItem,
  percent
) {
  if (!journeyItem) {
    return null
  }

  const safePercent =
    Math.max(
      0,
      Math.min(
        99,
        Number(percent) || 0
      )
    )

  return {
    ...journeyItem,

    status:
      safePercent > 0
        ? journeyStatuses
            .IN_PROGRESS
        : journeyStatuses
            .STARTED,

    progress: {
      ...journeyItem.progress,

      percent:
        safePercent,
    },

    updatedAt:
      new Date().toISOString(),
  }
}


// ============================================================
// COMPLETE WITH REFLECTION
// ============================================================

export function completeJourneyWithReflection(
  journeyItem,
  reflection = {}
) {
  if (!journeyItem) {
    return null
  }

  const now =
    new Date().toISOString()

  return {
    ...journeyItem,

    status:
      journeyStatuses.COMPLETED,

    progress: {
      ...journeyItem.progress,
      percent: 100,
    },

    reflection: {
      enjoyment:
        reflection.enjoyment ??
        null,

      favoritePart:
        reflection.favoritePart
          ?.trim() ||
        '',

      difficultPart:
        reflection.difficultPart
          ?.trim() ||
        '',

      wouldDoAgain:
        reflection.wouldDoAgain ??
        null,

      wantsNext:
        reflection.wantsNext
          ?.trim() ||
        '',

      submittedAt:
        now,
    },

    updatedAt:
      now,

    completedAt:
      now,
  }
}


// ============================================================
// JOURNEY ID
// ============================================================

function createJourneyId() {
  return [
    'journey',
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2, 9),
  ].join('_')
}
