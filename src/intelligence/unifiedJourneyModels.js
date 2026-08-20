// src/intelligence/unifiedJourneyModels.js

// ============================================================
// Career & Growth — MVP v0.8
// Unified Journey Domain Model
//
// Phase 8.1 foundation.
//
// This module introduces the shared Journey vocabulary for:
//   1. School & Learning
//   2. Growth Experiences
//   3. Activities & Interests
//
// IMPORTANT:
// - This file is intentionally additive.
// - It does not replace v0.7 journeyModels.js.
// - Existing v0.7 Journey items can be normalized into the
//   unified model without changing their stored representation.
// - Later v0.8 phases can migrate creation/storage/UI behind
//   these contracts incrementally.
// ============================================================


export const JOURNEY_MODEL_VERSION = '0.8.0'


// ============================================================
// JOURNEY PATHS
// ============================================================

export const journeyPaths = Object.freeze({
  SCHOOL_LEARNING: 'school_learning',
  EXPERIENCES: 'experiences',
  ACTIVITIES_INTERESTS: 'activities_interests',
})

export const journeyPathLabels = Object.freeze({
  [journeyPaths.SCHOOL_LEARNING]:
    'School & Learning',

  [journeyPaths.EXPERIENCES]:
    'Experiences',

  [journeyPaths.ACTIVITIES_INTERESTS]:
    'Activities & Interests',
})

export const journeyPathEmojis = Object.freeze({
  [journeyPaths.SCHOOL_LEARNING]:
    '🏫',

  [journeyPaths.EXPERIENCES]:
    '🚀',

  [journeyPaths.ACTIVITIES_INTERESTS]:
    '🌱',
})


// ============================================================
// ACTIVITY TYPES
// ============================================================
//
// Activity type describes what the child is doing.
// Path describes where the item lives in the Journey.
//
// Example:
//   path = school_learning
//   activityType = homework
//
//   path = experiences
//   activityType = growth_experience
// ============================================================

export const journeyActivityTypes =
  Object.freeze({
    // School & Learning
    HOMEWORK: 'homework',
    PROJECT: 'project',
    TEST_QUIZ: 'test_quiz',
    STUDY: 'study',
    READING: 'reading',
    TUTORING: 'tutoring',
    SUPPLEMENTAL_LEARNING:
      'supplemental_learning',

    // Career & Growth Experiences
    GROWTH_EXPERIENCE:
      'growth_experience',

    // Activities & Interests
    PRACTICE: 'practice',
    CLUB: 'club',
    SPORT: 'sport',
    MUSIC: 'music',
    HOBBY: 'hobby',
    PERSONAL_PROJECT:
      'personal_project',
    SELF_DIRECTED:
      'self_directed',

    OTHER: 'other',
  })


// ============================================================
// SOURCES
// ============================================================
//
// Source answers: "Where did this activity come from?"
// This is deliberately separate from activityType.
// ============================================================

export const journeySources =
  Object.freeze({
    CAREER_AND_GROWTH:
      'career_and_growth',
    SCHOOL: 'school',
    TEACHER: 'teacher',
    TUTOR: 'tutor',
    LEARNING_PROGRAM:
      'learning_program',
    PARENT: 'parent',
    CHILD: 'child',
    CLUB_OR_COACH:
      'club_or_coach',
    OTHER: 'other',
  })


// ============================================================
// STATUS
// ============================================================
//
// v0.7 Journey primarily uses progress + completed.
// v0.8 introduces a common status vocabulary.
//
// NEED_HELP is intentionally a status because it can become
// a trigger for Learning Support / Resource Intelligence.
// ============================================================

export const journeyStatuses =
  Object.freeze({
    PLANNED: 'planned',
    IN_PROGRESS: 'in_progress',
    NEED_HELP: 'need_help',
    COMPLETED: 'completed',
  })


// ============================================================
// LEARNING SUPPORT INTENTS
// ============================================================
//
// These complement the v0.7 growth-oriented research intents:
//   discover / explore / strengthen / stretch
//
// They are defined here as Journey-domain vocabulary first.
// Resource Intelligence will consume them in later v0.8 phases.
// ============================================================

export const learningSupportIntents =
  Object.freeze({
    UNDERSTAND: 'understand',
    PRACTICE: 'practice',
    RESEARCH: 'research',
    REVIEW: 'review',
    ENRICH: 'enrich',
  })


// ============================================================
// PATH DEFAULTS
// ============================================================

export const getDefaultJourneyPath =
  (activityType) => {
    const schoolTypes =
      new Set([
        journeyActivityTypes.HOMEWORK,
        journeyActivityTypes.PROJECT,
        journeyActivityTypes.TEST_QUIZ,
        journeyActivityTypes.STUDY,
        journeyActivityTypes.READING,
        journeyActivityTypes.TUTORING,
        journeyActivityTypes
          .SUPPLEMENTAL_LEARNING,
      ])

    const activityTypes =
      new Set([
        journeyActivityTypes.PRACTICE,
        journeyActivityTypes.CLUB,
        journeyActivityTypes.SPORT,
        journeyActivityTypes.MUSIC,
        journeyActivityTypes.HOBBY,
        journeyActivityTypes
          .PERSONAL_PROJECT,
        journeyActivityTypes
          .SELF_DIRECTED,
      ])

    if (
      activityType ===
      journeyActivityTypes
        .GROWTH_EXPERIENCE
    ) {
      return journeyPaths.EXPERIENCES
    }

    if (
      schoolTypes.has(activityType)
    ) {
      return journeyPaths
        .SCHOOL_LEARNING
    }

    if (
      activityTypes.has(activityType)
    ) {
      return journeyPaths
        .ACTIVITIES_INTERESTS
    }

    return journeyPaths.EXPERIENCES
  }


// ============================================================
// LEGACY V0.7 COMPATIBILITY
// ============================================================
//
// Existing Journey items were created as experiences and may
// not contain path/activityType/source/modelVersion.
//
// Rather than migrating localStorage immediately, normalize
// them at the boundary.
//
// This keeps v0.7 researched experiences fully compatible.
// ============================================================

export const inferJourneyPath =
  (item = {}) => {
    if (
      Object.values(
        journeyPaths
      ).includes(item.path)
    ) {
      return item.path
    }

    if (
      item.researchedExperience ||
      item.experienceId
    ) {
      return journeyPaths.EXPERIENCES
    }

    return getDefaultJourneyPath(
      item.activityType
    )
  }


export const inferJourneyActivityType =
  (item = {}) => {
    if (
      Object.values(
        journeyActivityTypes
      ).includes(
        item.activityType
      )
    ) {
      return item.activityType
    }

    if (
      item.researchedExperience ||
      item.experienceId
    ) {
      return journeyActivityTypes
        .GROWTH_EXPERIENCE
    }

    return journeyActivityTypes.OTHER
  }


export const inferJourneySource =
  (item = {}) => {
    if (
      Object.values(
        journeySources
      ).includes(item.source)
    ) {
      return item.source
    }

    if (
      item.researchedExperience ||
      item.experienceId
    ) {
      return journeySources
        .CAREER_AND_GROWTH
    }

    return journeySources.OTHER
  }


export const inferJourneyStatus =
  (item = {}) => {
    if (
      Object.values(
        journeyStatuses
      ).includes(item.status)
    ) {
      return item.status
    }

    if (
      item.status === 'completed' ||
      item.progress >= 100
    ) {
      return journeyStatuses.COMPLETED
    }

    if (
      Number(item.progress) > 0
    ) {
      return journeyStatuses
        .IN_PROGRESS
    }

    return journeyStatuses.PLANNED
  }


// ============================================================
// NORMALIZED JOURNEY ITEM
// ============================================================
//
// This is the v0.8 read model.
//
// It preserves every existing property with ...item while
// layering on the common Unified Journey fields.
// ============================================================

export const normalizeJourneyItem =
  (item = {}) => ({
    ...item,

    modelVersion:
      item.modelVersion ||
      JOURNEY_MODEL_VERSION,

    path:
      inferJourneyPath(item),

    activityType:
      inferJourneyActivityType(
        item
      ),

    source:
      inferJourneySource(item),

    status:
      inferJourneyStatus(item),

    subject:
      item.subject || null,

    topic:
      item.topic || null,

    dueDate:
      item.dueDate || null,

    estimatedTime:
      item.estimatedTime || null,

    supportIntent:
      item.supportIntent || null,

    linkedResources:
      Array.isArray(
        item.linkedResources
      )
        ? item.linkedResources
        : [],

    evidenceRefs:
      Array.isArray(
        item.evidenceRefs
      )
        ? item.evidenceRefs
        : [],
  })


export const normalizeJourneyItems =
  (items = []) =>
    Array.isArray(items)
      ? items.map(
          normalizeJourneyItem
        )
      : []


// ============================================================
// UNIFIED JOURNEY ITEM FACTORY
// ============================================================
//
// This factory is intended for NEW v0.8 non-experience items.
// Existing experience creation remains in v0.7 journeyModels
// until we intentionally integrate the contracts.
// ============================================================

const createJourneyId =
  () =>
    [
      'journey',
      Date.now(),
      Math.random()
        .toString(36)
        .slice(2, 8),
    ].join('_')


export const createUnifiedJourneyItem =
  ({
    childId,
    title,

    path,
    activityType,
    source,

    description = '',
    emoji = null,

    subject = null,
    topic = null,

    dueDate = null,
    estimatedTime = null,

    status =
      journeyStatuses.PLANNED,

    supportIntent = null,

    linkedResources = [],
    evidenceRefs = [],

    metadata = {},
  } = {}) => {
    if (!childId) {
      throw new Error(
        'createUnifiedJourneyItem requires childId.'
      )
    }

    if (!title?.trim()) {
      throw new Error(
        'createUnifiedJourneyItem requires title.'
      )
    }

    const resolvedActivityType =
      Object.values(
        journeyActivityTypes
      ).includes(activityType)
        ? activityType
        : journeyActivityTypes.OTHER

    const resolvedPath =
      Object.values(
        journeyPaths
      ).includes(path)
        ? path
        : getDefaultJourneyPath(
            resolvedActivityType
          )

    const resolvedSource =
      Object.values(
        journeySources
      ).includes(source)
        ? source
        : journeySources.CHILD

    const resolvedStatus =
      Object.values(
        journeyStatuses
      ).includes(status)
        ? status
        : journeyStatuses.PLANNED

    const now =
      new Date().toISOString()

    return {
      id:
        createJourneyId(),

      modelVersion:
        JOURNEY_MODEL_VERSION,

      childId,

      path:
        resolvedPath,

      activityType:
        resolvedActivityType,

      source:
        resolvedSource,

      title:
        title.trim(),

      description:
        description?.trim?.() ||
        '',

      emoji:
        emoji ||
        journeyPathEmojis[
          resolvedPath
        ],

      subject,
      topic,

      dueDate,
      estimatedTime,

      status:
        resolvedStatus,

      progress:
        resolvedStatus ===
        journeyStatuses.COMPLETED
          ? 100
          : 0,

      supportIntent,

      linkedResources:
        Array.isArray(
          linkedResources
        )
          ? linkedResources
          : [],

      evidenceRefs:
        Array.isArray(
          evidenceRefs
        )
          ? evidenceRefs
          : [],

      metadata:
        metadata &&
        typeof metadata ===
          'object'
          ? metadata
          : {},

      createdAt: now,
      updatedAt: now,
      completedAt:
        resolvedStatus ===
        journeyStatuses.COMPLETED
          ? now
          : null,
    }
  }


// ============================================================
// UPDATE UNIFIED JOURNEY STATUS
// ============================================================

export const updateUnifiedJourneyStatus =
  (
    journeyItem,
    status
  ) => {
    if (!journeyItem) {
      return null
    }

    if (
      !Object.values(
        journeyStatuses
      ).includes(status)
    ) {
      return journeyItem
    }

    const now =
      new Date().toISOString()

    const currentPercent =
      typeof journeyItem.progress ===
      'object'
        ? Number(
            journeyItem
              .progress
              ?.percent
          ) || 0
        : Number(
            journeyItem.progress
          ) || 0

    return {
      ...journeyItem,

      status,

      progress: {
        ...(
          typeof journeyItem.progress ===
          'object'
            ? journeyItem.progress
            : {}
        ),

        percent:
          status ===
          journeyStatuses.COMPLETED
            ? 100
            : currentPercent,
      },

      updatedAt: now,

      completedAt:
        status ===
        journeyStatuses.COMPLETED
          ? now
          : journeyItem.completedAt ||
            null,
    }
  }


// ============================================================
// ATTACH LEARNING SUPPORT REQUEST
// ============================================================
export const attachLearningSupportRequest = (journeyItem, supportRequest) => {
  if (!journeyItem || !supportRequest) return journeyItem
  return {
    ...journeyItem,
    status: journeyStatuses.NEED_HELP,
    supportIntent: supportRequest.learningIntent,
    learningSupportRequest: supportRequest,
    updatedAt: new Date().toISOString(),
  }
}


// ============================================================
// QUERY HELPERS
// ============================================================

export const getJourneyItemsByPath =
  (
    items = [],
    path
  ) =>
    normalizeJourneyItems(items)
      .filter(
        (item) =>
          item.path === path
      )


export const getJourneySummary =
  (items = []) => {
    const normalized =
      normalizeJourneyItems(items)

    const byPath =
      Object.values(
        journeyPaths
      ).reduce(
        (summary, path) => ({
          ...summary,

          [path]:
            normalized.filter(
              (item) =>
                item.path ===
                path
            ).length,
        }),
        {}
      )

    const active =
      normalized.filter(
        (item) =>
          item.status !==
          journeyStatuses.COMPLETED
      ).length

    const completed =
      normalized.filter(
        (item) =>
          item.status ===
          journeyStatuses.COMPLETED
      ).length

    const needHelp =
      normalized.filter(
        (item) =>
          item.status ===
          journeyStatuses.NEED_HELP
      ).length

    return {
      total:
        normalized.length,

      active,
      completed,
      needHelp,

      byPath,
    }
  }


// ============================================================
// VALIDATION
// ============================================================

export const validateUnifiedJourneyItem =
  (item = {}) => {
    const normalized =
      normalizeJourneyItem(item)

    const errors = []

    if (!normalized.id) {
      errors.push(
        'Journey item requires id.'
      )
    }

    if (!normalized.childId) {
      errors.push(
        'Journey item requires childId.'
      )
    }

    if (!normalized.title) {
      errors.push(
        'Journey item requires title.'
      )
    }

    if (
      !Object.values(
        journeyPaths
      ).includes(
        normalized.path
      )
    ) {
      errors.push(
        'Journey item has invalid path.'
      )
    }

    if (
      !Object.values(
        journeyActivityTypes
      ).includes(
        normalized.activityType
      )
    ) {
      errors.push(
        'Journey item has invalid activityType.'
      )
    }

    if (
      !Object.values(
        journeyStatuses
      ).includes(
        normalized.status
      )
    ) {
      errors.push(
        'Journey item has invalid status.'
      )
    }

    return {
      valid:
        errors.length === 0,

      errors,

      item:
        normalized,
    }
  }
