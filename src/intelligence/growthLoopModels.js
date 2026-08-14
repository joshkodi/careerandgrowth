const createId = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`


// ============================================================
// GROWTH INTENT
// ============================================================

export const growthIntentActors = {
  STUDENT: 'student',
  PARENT: 'parent',
}


export const growthIntentTypes = {
  INTEREST: 'interest',
  SKILL: 'skill',
  GOAL: 'goal',
  EXPERIENCE: 'experience',
  CAREER: 'career',
  OPEN_ENDED: 'open_ended',
}


export const createGrowthIntent = ({
  childId,
  actor,
  type = growthIntentTypes.OPEN_ENDED,
  text,
  tags = [],
  priority = 'normal',
  source = 'grow',
}) => {
  if (!childId) {
    throw new Error(
      'GrowthIntent requires childId.'
    )
  }

  if (!actor) {
    throw new Error(
      'GrowthIntent requires actor.'
    )
  }

  if (!text?.trim()) {
    throw new Error(
      'GrowthIntent requires text.'
    )
  }

  return {
    id: createId('intent'),

    childId,

    actor,

    type,

    text: text.trim(),

    tags,

    priority,

    source,

    status: 'active',

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),
  }
}


// ============================================================
// JOURNEY ITEM
// ============================================================

export const journeyStatuses = {
  PLANNED: 'planned',
  STARTED: 'started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  STOPPED: 'stopped',
}


export const journeySources = {
  RECOMMENDATION:
    'recommendation',

  STUDENT:
    'student',

  PARENT:
    'parent',

  EXTERNAL:
    'external',

  EXPLORE:
    'explore',
}


export const createJourneyItem = ({
  childId,
  title,
  experienceId = null,
  source = journeySources.EXTERNAL,
  status = journeyStatuses.PLANNED,
  domains = [],
  develops = [],
  metadata = {},
}) => {
  if (!childId) {
    throw new Error(
      'JourneyItem requires childId.'
    )
  }

  if (!title?.trim()) {
    throw new Error(
      'JourneyItem requires title.'
    )
  }

  const now =
    new Date().toISOString()

  return {
    id: createId('journey'),

    childId,

    experienceId,

    title:
      title.trim(),

    source,

    status,

    domains,

    develops,

    startedAt:
      status ===
      journeyStatuses.STARTED
        ? now
        : null,

    completedAt:
      status ===
      journeyStatuses.COMPLETED
        ? now
        : null,

    studentReflection: {
      enjoyment: null,

      favoritePart: '',

      difficultPart: '',

      wouldDoAgain: null,

      wantsNext: '',
    },

    parentObservation: {
      engagement: null,

      persistence: null,

      notes: '',
    },

    metadata,

    createdAt: now,

    updatedAt: now,
  }
}


// ============================================================
// JOURNEY UPDATE
// ============================================================

export const updateJourneyStatus = (
  journeyItem,
  status
) => {
  if (!journeyItem) {
    return null
  }

  const now =
    new Date().toISOString()

  return {
    ...journeyItem,

    status,

    startedAt:
      status ===
        journeyStatuses.STARTED &&
      !journeyItem.startedAt
        ? now
        : journeyItem.startedAt,

    completedAt:
      status ===
      journeyStatuses.COMPLETED
        ? now
        : journeyItem.completedAt,

    updatedAt: now,
  }
}


export const addStudentReflection = (
  journeyItem,
  reflection = {}
) => {
  if (!journeyItem) {
    return null
  }

  return {
    ...journeyItem,

    studentReflection: {
      ...journeyItem
        .studentReflection,

      ...reflection,
    },

    updatedAt:
      new Date().toISOString(),
  }
}


export const addParentObservation = (
  journeyItem,
  observation = {}
) => {
  if (!journeyItem) {
    return null
  }

  return {
    ...journeyItem,

    parentObservation: {
      ...journeyItem
        .parentObservation,

      ...observation,
    },

    updatedAt:
      new Date().toISOString(),
  }
}


// ============================================================
// RECOMMENDATION CANDIDATE
// ============================================================

export const createRecommendationCandidate =
  ({
    experience,

    score = 0,

    reasons = [],

    matchedStudentIntents = [],

    matchedParentIntents = [],

    matchedProfileSignals = [],
  }) => {
    if (!experience) {
      return null
    }

    return {
      experienceId:
        experience.id,

      title:
        experience.title,

      emoji:
        experience.emoji,

      score,

      reasons,

      matches: {
        studentIntents:
          matchedStudentIntents,

        parentIntents:
          matchedParentIntents,

        profileSignals:
          matchedProfileSignals,
      },
    }
  }