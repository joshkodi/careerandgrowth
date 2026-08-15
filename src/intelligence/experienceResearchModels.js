// src/intelligence/experienceResearchModels.js

import {
  isValidDomainId,
  isValidPathwayId,
  isValidSignalId,
  isValidTraitId,
} from '../data/growthTaxonomy'


// ============================================================
// Career & Growth — MVP v0.7 — Phase 7.1
// Experience Research Domain Models
//
// This file defines the canonical contracts shared by:
//
// - Experience Research (v0.7)
// - Resource evaluation / matching
// - Future Homework Guidance (v0.8)
//
// IMPORTANT:
//
// External resources and recommendations are NOT Growth
// Intelligence evidence.
//
// Evidence is created only from actual child interaction,
// reflection, parent observation, or system-observed behavior.
// ============================================================


// ============================================================
// ENUM-LIKE CONSTANTS
// ============================================================

export const experienceOrigins = {
  INTERNAL_TEMPLATE:
    'internal_template',

  EXTERNAL_RESOURCE:
    'external_resource',
}


export const recommendationStrategies = {
  STRENGTHEN:
    'strengthen',

  STRETCH:
    'stretch',

  EXPLORE:
    'explore',

  DISCOVER:
    'discover',

  PATHWAY:
    'pathway',
}


export const resourceTypes = {
  PROJECT: 'project',
  CHALLENGE: 'challenge',
  EXPERIMENT: 'experiment',
  PRACTICE: 'practice',
  CONVERSATION: 'conversation',
  COURSE: 'course',
  TUTORIAL: 'tutorial',
  WORKSHOP: 'workshop',
  CAMP: 'camp',
  COMPETITION: 'competition',
  EVENT: 'event',
  VIDEO: 'video',
  ARTICLE: 'article',
  BOOK: 'book',
  KIT: 'kit',
  MUSEUM_ACTIVITY:
    'museum_activity',
  COMMUNITY_PROGRAM:
    'community_program',
}


export const deliveryModes = {
  AT_HOME: 'at_home',
  ONLINE: 'online',
  IN_PERSON: 'in_person',
  HYBRID: 'hybrid',
  FLEXIBLE: 'flexible',
}


export const participationModes = {
  INDEPENDENT: 'independent',
  PARENT_ASSISTED:
    'parent_assisted',
  INSTRUCTOR_LED:
    'instructor_led',
  GROUP: 'group',
  FLEXIBLE: 'flexible',
}


export const difficultyLevels = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  FLEXIBLE: 'flexible',
}


export const ageBrackets = {
  EARLY_EXPLORER: {
    id: 'early_explorer',
    label: 'Early Explorer',
    minAge: 5,
    maxAge: 7,
  },

  EXPLORER: {
    id: 'explorer',
    label: 'Explorer',
    minAge: 8,
    maxAge: 10,
  },

  EMERGING_EXPLORER: {
    id: 'emerging_explorer',
    label: 'Emerging Explorer',
    minAge: 11,
    maxAge: 13,
  },

  PATHWAY_EXPLORER: {
    id: 'pathway_explorer',
    label: 'Pathway Explorer',
    minAge: 14,
    maxAge: 16,
  },

  FUTURE_READY: {
    id: 'future_ready',
    label: 'Future Ready',
    minAge: 17,
    maxAge: 18,
  },
}


// ============================================================
// GENERIC UTILITIES
// ============================================================

const unique =
  (values = []) =>
    [
      ...new Set(
        values.filter(Boolean)
      ),
    ]


const asArray =
  (value) =>
    Array.isArray(value)
      ? value.filter(Boolean)
      : []


const nowIso =
  () =>
    new Date().toISOString()


export const getAgeBracket =
  (age) => {
    const numericAge =
      Number(age)

    if (
      !Number.isFinite(
        numericAge
      )
    ) {
      return null
    }

    return (
      Object.values(ageBrackets)
        .find(
          (bracket) =>
            numericAge >=
              bracket.minAge &&
            numericAge <=
              bracket.maxAge
        ) ||
      null
    )
  }


// ============================================================
// CHILD CONTEXT
// ============================================================
//
// This intentionally keeps demographic / intent / preference
// context outside Growth Intelligence.
//
// Age affects eligibility.
// Intent affects recommendations.
// Neither automatically changes Growth Intelligence.
// ============================================================

export const createChildContext =
  ({
    childProfile = {},
    growthProfile = null,
    studentIntents = [],
    parentIntents = [],
    journeyItems = [],
    declaredInterests = [],
    experiencePreferences = {},
  } = {}) => {
    const age =
      Number(
        childProfile.age
      )

    const bracket =
      getAgeBracket(age)

    return {
      childId:
        childProfile.childId ||
        growthProfile?.childId ||
        null,

      name:
        childProfile.name ||
        '',

      age:
        Number.isFinite(age)
          ? age
          : null,

      ageBracket:
        bracket
          ? {
              id: bracket.id,
              label:
                bracket.label,
            }
          : null,

      grade:
        childProfile.grade ||
        null,

      declaredInterests:
        unique(
          declaredInterests
        ),

      experiencePreferences: {
        ...experiencePreferences,
      },

      growthProfile,

      studentIntents:
        asArray(
          studentIntents
        ),

      parentIntents:
        asArray(
          parentIntents
        ),

      journeyItems:
        asArray(
          journeyItems
        ),
    }
  }


// ============================================================
// RESEARCH INTENT
// ============================================================

export const createResearchIntent =
  ({
    id,
    childId,
    reason = '',
    topics = [],
    targetSignals = [],
    targetTraits = [],
    targetDomains = [],
    targetPathways = [],
    experienceTypes = [],
    recommendationStrategy =
      recommendationStrategies.EXPLORE,
    studentIntentIds = [],
    parentIntentIds = [],
    audience = {},
    searchQueries = [],
    status = 'planned',
    createdAt = nowIso(),
  } = {}) => ({
    id:
      id ||
      `research_${Date.now()}`,

    childId:
      childId ||
      null,

    reason,

    topics:
      unique(topics),

    targetGrowth: {
      signals:
        unique(
          targetSignals
        ),

      traits:
        unique(
          targetTraits
        ),

      domains:
        unique(
          targetDomains
        ),

      pathways:
        unique(
          targetPathways
        ),
    },

    experienceTypes:
      unique(
        experienceTypes
      ),

    recommendationStrategy,

    intentContext: {
      studentIntentIds:
        unique(
          studentIntentIds
        ),

      parentIntentIds:
        unique(
          parentIntentIds
        ),
    },

    audience: {
      ...audience,
    },

    searchQueries:
      unique(
        searchQueries
      ),

    status,

    createdAt,
  })


// ============================================================
// EXTERNAL RESOURCE
// ============================================================
//
// Generic by design.
//
// v0.7 can turn this into an ExperienceCandidate.
// v0.8 can reuse the same resource for Homework Guidance.
// ============================================================

export const createExternalResource =
  ({
    id,
    title = '',
    description = '',
    provider = '',
    sourceUrl = null,
    sourceType = 'external_web',
    resourceType = null,
    topics = [],
    skills = [],
    learningOutcomes = [],
    audience = {},
    practical = {},
    rawMetadata = {},
    discoveredAt = nowIso(),
    lastVerifiedAt = null,
  } = {}) => ({
    id:
      id ||
      `resource_${Date.now()}`,

    title,
    description,

    provider,
    sourceUrl,
    sourceType,
    resourceType,

    topics:
      unique(topics),

    skills:
      unique(skills),

    learningOutcomes:
      unique(
        learningOutcomes
      ),

    audience:
      createExperienceAudienceProfile(
        audience
      ),

    practical: {
      estimatedTime:
        practical
          .estimatedTime ||
        null,

      cost:
        practical.cost ??
        null,

      materials:
        asArray(
          practical.materials
        ),

      location:
        practical.location ||
        null,

      ...practical,
    },

    rawMetadata: {
      ...rawMetadata,
    },

    discoveredAt,
    lastVerifiedAt,
  })


// ============================================================
// EXPERIENCE AUDIENCE PROFILE
// ============================================================

export const createExperienceAudienceProfile =
  ({
    ageRange = {},
    gradeRange = null,
    difficulty =
      difficultyLevels.FLEXIBLE,
    prerequisites = [],
    participation =
      participationModes.FLEXIBLE,
    deliveryMode =
      deliveryModes.FLEXIBLE,
    requiresAdultSupervision =
      false,
  } = {}) => {
    const minAge =
      Number(
        ageRange.min
      )

    const maxAge =
      Number(
        ageRange.max
      )

    return {
      ageRange: {
        min:
          Number.isFinite(
            minAge
          )
            ? minAge
            : null,

        max:
          Number.isFinite(
            maxAge
          )
            ? maxAge
            : null,
      },

      gradeRange,

      difficulty,

      prerequisites:
        unique(
          prerequisites
        ),

      participation,

      deliveryMode,

      requiresAdultSupervision:
        Boolean(
          requiresAdultSupervision
        ),
    }
  }


// ============================================================
// EXPERIENCE PROFILE
// ============================================================
//
// This is the bridge between an experience and the canonical
// Growth Intelligence taxonomy.
//
// "leverages" = patterns that help the child engage.
// "develops"  = patterns the experience intentionally exercises.
//
// Skills / learning outcomes remain separate from Growth
// Intelligence so concepts such as digital_literacy or
// spatial_thinking do not have to become Growth signals.
// ============================================================

export const createExperienceProfile =
  ({
    topics = [],
    interests = [],
    growthAlignment = {},
    skills = [],
    learningOutcomes = [],
    characteristics = {},
  } = {}) => ({
    topics:
      unique(topics),

    interests:
      unique(interests),

    growthAlignment: {
      domains:
        unique(
          growthAlignment
            .domains
        ),

      pathways:
        unique(
          growthAlignment
            .pathways
        ),

      leverages: {
        signals:
          unique(
            growthAlignment
              .leverages
              ?.signals
          ),

        traits:
          unique(
            growthAlignment
              .leverages
              ?.traits
          ),
      },

      develops: {
        signals:
          unique(
            growthAlignment
              .develops
              ?.signals
          ),

        traits:
          unique(
            growthAlignment
              .develops
              ?.traits
          ),
      },
    },

    skills:
      unique(skills),

    learningOutcomes:
      unique(
        learningOutcomes
      ),

    characteristics: {
      ...characteristics,
    },
  })


// ============================================================
// RESOURCE EVALUATION
// ============================================================

export const createResourceEvaluation =
  ({
    id,
    resourceId,
    researchIntentId = null,
    childId = null,
    scores = {},
    strengths = [],
    concerns = [],
    evaluationReason = '',
    confidence = null,
    evaluatedAt = nowIso(),
  } = {}) => ({
    id:
      id ||
      `evaluation_${Date.now()}`,

    resourceId:
      resourceId ||
      null,

    researchIntentId,

    childId,

    scores: {
      sourceQuality:
        scores
          .sourceQuality ?? 0,

      educationalValue:
        scores
          .educationalValue ?? 0,

      activeEngagement:
        scores
          .activeEngagement ?? 0,

      practicality:
        scores
          .practicality ?? 0,

      ageFit:
        scores.ageFit ?? 0,

      profileFit:
        scores.profileFit ?? 0,

      intentFit:
        scores.intentFit ?? 0,

      parentGoalFit:
        scores
          .parentGoalFit ?? 0,

      novelty:
        scores.novelty ?? 0,

      overall:
        scores.overall ?? 0,
    },

    strengths:
      unique(strengths),

    concerns:
      unique(concerns),

    evaluationReason,

    confidence,

    evaluatedAt,
  })


// ============================================================
// RESOURCE MATCH
// ============================================================
//
// Generic match contract shared across possible consumers.
//
// In v0.7 the consumer is Experience Generation.
// In v0.8 a Homework Guidance generator can consume the same
// resource-match object without changing the resource layer.
// ============================================================

export const createResourceMatch =
  ({
    id,
    childId,
    resourceId,
    researchIntentId = null,
    evaluationId = null,
    eligible = true,
    eligibilityReasons = [],
    profileMatches = {},
    recommendationStrategy =
      recommendationStrategies.EXPLORE,
    reasons = [],
    score = 0,
    createdAt = nowIso(),
  } = {}) => ({
    id:
      id ||
      `match_${Date.now()}`,

    childId:
      childId ||
      null,

    resourceId:
      resourceId ||
      null,

    researchIntentId,
    evaluationId,

    eligible:
      Boolean(eligible),

    eligibilityReasons:
      unique(
        eligibilityReasons
      ),

    profileMatches: {
      signals:
        unique(
          profileMatches
            .signals
        ),

      traits:
        unique(
          profileMatches
            .traits
        ),

      domains:
        unique(
          profileMatches
            .domains
        ),

      pathways:
        unique(
          profileMatches
            .pathways
        ),

      interests:
        unique(
          profileMatches
            .interests
        ),

      studentIntentIds:
        unique(
          profileMatches
            .studentIntentIds
        ),

      parentIntentIds:
        unique(
          profileMatches
            .parentIntentIds
        ),
    },

    recommendationStrategy,

    reasons:
      unique(reasons),

    score:
      Number(score) || 0,

    createdAt,
  })


// ============================================================
// EXPERIENCE CANDIDATE
// ============================================================

export const createExperienceCandidate =
  ({
    id,
    childId,
    origin =
      experienceOrigins
        .INTERNAL_TEMPLATE,
    sourceId = null,
    resourceMatchId = null,
    title = '',
    emoji = '🌱',
    hook = '',
    description = '',
    challenge = '',
    whyThisFitsYou = [],
    audience = {},
    profile = {},
    steps = [],
    practical = {},
    parentGuidance = null,
    sourceAttribution = null,
    recommendationStrategy =
      recommendationStrategies.EXPLORE,
    status = 'candidate',
    createdAt = nowIso(),
  } = {}) => ({
    id:
      id ||
      `candidate_${Date.now()}`,

    childId:
      childId ||
      null,

    origin,
    sourceId,
    resourceMatchId,

    title,
    emoji,
    hook,
    description,
    challenge,

    whyThisFitsYou:
      unique(
        whyThisFitsYou
      ),

    audience:
      createExperienceAudienceProfile(
        audience
      ),

    profile:
      createExperienceProfile(
        profile
      ),

    steps:
      asArray(steps),

    practical: {
      ...practical,
    },

    parentGuidance,

    sourceAttribution,

    recommendationStrategy,

    status,

    createdAt,
  })


// ============================================================
// ELIGIBILITY
// ============================================================

export const evaluateAudienceEligibility =
  ({
    childContext,
    audienceProfile,
  } = {}) => {
    const reasons = []

    const age =
      Number(
        childContext?.age
      )

    const minimum =
      audienceProfile
        ?.ageRange
        ?.min

    const maximum =
      audienceProfile
        ?.ageRange
        ?.max

    if (
      Number.isFinite(age) &&
      Number.isFinite(minimum) &&
      age < minimum
    ) {
      reasons.push(
        `Minimum recommended age is ${minimum}.`
      )
    }

    if (
      Number.isFinite(age) &&
      Number.isFinite(maximum) &&
      age > maximum
    ) {
      reasons.push(
        `Maximum recommended age is ${maximum}.`
      )
    }

    return {
      eligible:
        reasons.length === 0,

      reasons,
    }
  }


// ============================================================
// TAXONOMY VALIDATION
// ============================================================

export const validateExperienceProfile =
  (profile = {}) => {
    const errors = []

    const alignment =
      profile
        .growthAlignment ||
      {}

    ;(
      alignment.domains ||
      []
    ).forEach(
      (domainId) => {
        if (
          !isValidDomainId(
            domainId
          )
        ) {
          errors.push(
            `Unknown Growth domain "${domainId}".`
          )
        }
      }
    )

    ;(
      alignment.pathways ||
      []
    ).forEach(
      (pathwayId) => {
        if (
          !isValidPathwayId(
            pathwayId
          )
        ) {
          errors.push(
            `Unknown Growth pathway "${pathwayId}".`
          )
        }
      }
    )

    const signalIds = [
      ...(
        alignment.leverages
          ?.signals ||
        []
      ),

      ...(
        alignment.develops
          ?.signals ||
        []
      ),
    ]

    signalIds.forEach(
      (signalId) => {
        if (
          !isValidSignalId(
            signalId
          )
        ) {
          errors.push(
            `Unknown Growth signal "${signalId}".`
          )
        }
      }
    )

    const traitIds = [
      ...(
        alignment.leverages
          ?.traits ||
        []
      ),

      ...(
        alignment.develops
          ?.traits ||
        []
      ),
    ]

    traitIds.forEach(
      (traitId) => {
        if (
          !isValidTraitId(
            traitId
          )
        ) {
          errors.push(
            `Unknown Growth trait "${traitId}".`
          )
        }
      }
    )

    return {
      valid:
        errors.length === 0,

      errors,
    }
  }


export const validateExperienceTemplate =
  (experience = {}) => {
    const errors = []

    if (!experience.id) {
      errors.push(
        'Experience requires an id.'
      )
    }

    if (!experience.title) {
      errors.push(
        `Experience "${experience.id || 'unknown'}" requires a title.`
      )
    }

    const profileValidation =
      validateExperienceProfile(
        experience.profile
      )

    errors.push(
      ...profileValidation.errors
    )

    return {
      valid:
        errors.length === 0,

      errors,
    }
  }


export default {
  experienceOrigins,
  recommendationStrategies,
  resourceTypes,
  deliveryModes,
  participationModes,
  difficultyLevels,
  ageBrackets,
  getAgeBracket,
  createChildContext,
  createResearchIntent,
  createExternalResource,
  createExperienceAudienceProfile,
  createExperienceProfile,
  createResourceEvaluation,
  createResourceMatch,
  createExperienceCandidate,
  evaluateAudienceEligibility,
  validateExperienceProfile,
  validateExperienceTemplate,
}
