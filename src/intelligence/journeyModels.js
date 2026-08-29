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


// ============================================================
// SYNAPSTRIDE MVP v0.10.1
// GROWTH OPPORTUNITY + ACTIVITY MODEL
// ============================================================
//
// Opportunity = something SynapStride can recommend or curate.
// Activity = something the child/family has chosen to pursue.
//
// This model is additive. Existing Journey items continue to use
// the v0.4 contract above so current Experience behavior remains
// backward compatible.
// ============================================================

export const growthOpportunityTypes = {
  EXPERIENCE: 'experience',
  LOCAL_EVENT: 'local_event',
  LEARNING_RESOURCE: 'learning_resource',
  ENRICHMENT: 'enrichment',
  ACTIVITY: 'activity',
}

export const growthOpportunitySources = {
  SYNAPSTRIDE: 'synapstride',
  CURATED_LOCAL: 'curated_local',
  SCHOOL: 'school',
  PARENT: 'parent',
  CHILD: 'child',
  COMMUNITY: 'community',
  OTHER: 'other',
}

export const growthActivityStatuses = {
  SAVED: 'saved',
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ATTENDED: 'attended',
  SKIPPED: 'skipped',
  CANCELLED: 'cancelled',
}

export const growthActivitySignalWeights = {
  viewed: 1,
  saved: 2,
  scheduled: 3,
  started: 4,
  completed: 5,
  attended: 5,
  positive_reflection: 7,
}

export function createGrowthOpportunity({
  id = null,
  childId = null,
  type = growthOpportunityTypes.EXPERIENCE,
  title,
  emoji = '✨',
  description = '',
  source = growthOpportunitySources.SYNAPSTRIDE,
  sourceId = null,
  sourceUrl = null,
  experienceId = null,
  relatedExperienceIds = [],
  domainIds = [],
  skillIds = [],
  interestIds = [],
  ageRange = null,
  schedule = null,
  location = null,
  provider = null,
  curation = null,
  recommendationContext = null,
  metadata = {},
} = {}) {
  if (!title?.trim()) {
    throw new Error(
      'Growth opportunity requires title.'
    )
  }

  const now = new Date().toISOString()

  return {
    id: id || createGrowthOpportunityId(),
    childId,
    type,
    title: title.trim(),
    emoji,
    description,
    source,
    sourceId,
    sourceUrl,
    experienceId,
    relatedExperienceIds:
      normalizeStringArray(
        relatedExperienceIds
      ),
    domainIds:
      normalizeStringArray(domainIds),
    skillIds:
      normalizeStringArray(skillIds),
    interestIds:
      normalizeStringArray(interestIds),
    ageRange:
      normalizeAgeRange(ageRange),
    schedule:
      normalizeGrowthSchedule(schedule),
    location:
      normalizeGrowthLocation(location),
    provider:
      provider
        ? {
            name: provider.name || null,
            type: provider.type || null,
          }
        : null,
    curation:
      curation
        ? {
            status:
              curation.status || 'curated',
            curatedAt:
              curation.curatedAt || now,
            expiresAt:
              curation.expiresAt || null,
            sourceVerifiedAt:
              curation.sourceVerifiedAt || null,
          }
        : null,
    recommendationContext:
      recommendationContext || null,
    metadata: metadata || {},
    createdAt: now,
    updatedAt: now,
  }
}

export function createGrowthActivity({
  childId,
  opportunity = null,
  opportunityId = null,
  type = null,
  title = null,
  emoji = null,
  description = null,
  status = null,
  schedule = null,
  location = null,
  experienceId = null,
  relatedExperienceIds = null,
  origin = journeyOrigins.RECOMMENDATION,
  metadata = {},
} = {}) {
  if (!childId) {
    throw new Error(
      'Growth activity requires childId.'
    )
  }

  const activityTitle =
    title || opportunity?.title

  if (!activityTitle?.trim()) {
    throw new Error(
      'Growth activity requires title.'
    )
  }

  const now = new Date().toISOString()
  const activitySchedule =
    normalizeGrowthSchedule(
      schedule || opportunity?.schedule
    )
  const initialStatus =
    status ||
    (activitySchedule?.startAt ||
    activitySchedule?.date
      ? growthActivityStatuses.SCHEDULED
      : growthActivityStatuses.SAVED)

  return {
    id: createGrowthActivityId(),
    childId,
    opportunityId:
      opportunityId ||
      opportunity?.id ||
      null,
    type:
      type ||
      opportunity?.type ||
      growthOpportunityTypes.ACTIVITY,
    title: activityTitle.trim(),
    emoji:
      emoji || opportunity?.emoji || '🌱',
    description:
      description ??
      opportunity?.description ??
      '',
    status: initialStatus,
    origin,
    experienceId:
      experienceId ||
      opportunity?.experienceId ||
      null,
    relatedExperienceIds:
      normalizeStringArray(
        relatedExperienceIds ||
        opportunity?.relatedExperienceIds ||
        []
      ),
    schedule: activitySchedule,
    location:
      normalizeGrowthLocation(
        location || opportunity?.location
      ),
    provider:
      opportunity?.provider || null,
    recommendationContext:
      opportunity?.recommendationContext ||
      null,
    progress: {
      percent: 0,
    },
    reflection: null,
    intelligence: {
      signals: [
        createActivitySignal(
          initialStatus ===
            growthActivityStatuses.SCHEDULED
            ? 'scheduled'
            : 'saved',
          now
        ),
      ],
    },
    metadata: metadata || {},
    createdAt: now,
    savedAt: now,
    scheduledAt:
      initialStatus ===
      growthActivityStatuses.SCHEDULED
        ? now
        : null,
    startedAt: null,
    completedAt: null,
    attendedAt: null,
    updatedAt: now,
  }
}

export function updateGrowthActivityStatus(
  activity,
  status
) {
  if (!activity) {
    return null
  }

  if (
    !Object.values(
      growthActivityStatuses
    ).includes(status)
  ) {
    return activity
  }

  const now = new Date().toISOString()
  const signalType =
    status === growthActivityStatuses.SCHEDULED
      ? 'scheduled'
      : status ===
          growthActivityStatuses.IN_PROGRESS
        ? 'started'
        : status ===
            growthActivityStatuses.COMPLETED
          ? 'completed'
          : status ===
              growthActivityStatuses.ATTENDED
            ? 'attended'
            : status ===
                growthActivityStatuses.SAVED
              ? 'saved'
              : null

  return {
    ...activity,
    status,
    progress: {
      ...activity.progress,
      percent:
        status ===
          growthActivityStatuses.COMPLETED ||
        status ===
          growthActivityStatuses.ATTENDED
          ? 100
          : activity.progress?.percent || 0,
    },
    intelligence: {
      ...activity.intelligence,
      signals:
        signalType
          ? [
              ...(activity.intelligence
                ?.signals || []),
              createActivitySignal(
                signalType,
                now
              ),
            ]
          : activity.intelligence
              ?.signals || [],
    },
    scheduledAt:
      status ===
        growthActivityStatuses.SCHEDULED &&
      !activity.scheduledAt
        ? now
        : activity.scheduledAt,
    startedAt:
      status ===
        growthActivityStatuses.IN_PROGRESS &&
      !activity.startedAt
        ? now
        : activity.startedAt,
    completedAt:
      status ===
        growthActivityStatuses.COMPLETED
        ? now
        : activity.completedAt,
    attendedAt:
      status ===
        growthActivityStatuses.ATTENDED
        ? now
        : activity.attendedAt,
    updatedAt: now,
  }
}

export function scheduleGrowthActivity(
  activity,
  schedule
) {
  if (!activity) {
    return null
  }

  const normalizedSchedule =
    normalizeGrowthSchedule(schedule)

  if (!normalizedSchedule) {
    return activity
  }

  const scheduledActivity = {
    ...activity,
    schedule: normalizedSchedule,
  }

  return updateGrowthActivityStatus(
    scheduledActivity,
    growthActivityStatuses.SCHEDULED
  )
}

export function reflectOnGrowthActivity(
  activity,
  reflection = {}
) {
  if (!activity) {
    return null
  }

  const now = new Date().toISOString()
  const positive =
    ['liked_it', 'loved_it'].includes(
      reflection.enjoyment
    ) || reflection.wouldDoAgain === true

  return {
    ...activity,
    reflection: {
      enjoyment:
        reflection.enjoyment ?? null,
      favoritePart:
        reflection.favoritePart
          ?.trim() || '',
      learned:
        reflection.learned?.trim() || '',
      wouldDoAgain:
        reflection.wouldDoAgain ?? null,
      wantsNext:
        reflection.wantsNext
          ?.trim() || '',
      submittedAt: now,
    },
    intelligence: {
      ...activity.intelligence,
      signals: [
        ...(activity.intelligence
          ?.signals || []),
        ...(positive
          ? [
              createActivitySignal(
                'positive_reflection',
                now
              ),
            ]
          : []),
      ],
    },
    updatedAt: now,
  }
}

export function getCalendarActivities(
  activities = []
) {
  return (Array.isArray(activities)
    ? activities
    : []
  )
    .filter(
      (activity) =>
        activity?.schedule?.startAt ||
        activity?.schedule?.date
    )
    .slice()
    .sort((a, b) =>
      getScheduleSortValue(a.schedule)
        .localeCompare(
          getScheduleSortValue(b.schedule)
        )
    )
}

export function getUpcomingGrowthActivities(
  activities = [],
  {
    from = new Date(),
    limit = 5,
  } = {}
) {
  const fromValue =
    from instanceof Date
      ? from.toISOString()
      : String(from || '')

  return getCalendarActivities(activities)
    .filter(
      (activity) =>
        getScheduleSortValue(
          activity.schedule
        ) >= fromValue.slice(0, 10)
    )
    .slice(0, Math.max(0, limit))
}

function normalizeGrowthSchedule(schedule) {
  if (!schedule) {
    return null
  }

  const startAt = schedule.startAt || null
  const endAt = schedule.endAt || null
  const date =
    schedule.date ||
    startAt?.slice?.(0, 10) ||
    null

  if (!date && !startAt) {
    return null
  }

  return {
    date,
    startAt,
    endAt,
    allDay: Boolean(schedule.allDay),
    timezone: schedule.timezone || null,
    durationMinutes:
      Number.isFinite(
        Number(schedule.durationMinutes)
      )
        ? Number(schedule.durationMinutes)
        : null,
    recurrence:
      schedule.recurrence || null,
  }
}

function normalizeGrowthLocation(location) {
  if (!location) {
    return null
  }

  return {
    name: location.name || null,
    venue: location.venue || null,
    city: location.city || null,
    state: location.state || null,
    postalCode: location.postalCode || null,
    address: location.address || null,
    distanceMiles:
      Number.isFinite(
        Number(location.distanceMiles)
      )
        ? Number(location.distanceMiles)
        : null,
    isVirtual: Boolean(location.isVirtual),
  }
}

function normalizeAgeRange(ageRange) {
  if (!ageRange) {
    return null
  }

  return {
    min:
      Number.isFinite(Number(ageRange.min))
        ? Number(ageRange.min)
        : null,
    max:
      Number.isFinite(Number(ageRange.max))
        ? Number(ageRange.max)
        : null,
  }
}

function normalizeStringArray(values) {
  if (!Array.isArray(values)) {
    return []
  }

  return [
    ...new Set(
      values.filter(Boolean)
    ),
  ]
}

function createActivitySignal(
  type,
  createdAt
) {
  return {
    type,
    weight:
      growthActivitySignalWeights[type] || 0,
    createdAt,
  }
}

function getScheduleSortValue(schedule) {
  return (
    schedule?.startAt ||
    schedule?.date ||
    '9999-12-31'
  )
}

function createGrowthOpportunityId() {
  return [
    'opportunity',
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2, 9),
  ].join('_')
}

function createGrowthActivityId() {
  return [
    'growth_activity',
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2, 9),
  ].join('_')
}
