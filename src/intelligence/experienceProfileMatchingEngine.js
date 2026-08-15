// src/intelligence/experienceProfileMatchingEngine.js

import {
  createChildContext,
  evaluateAudienceEligibility,
  recommendationStrategies,
  validateExperienceTemplate,
} from './experienceResearchModels'

import {
  experienceCatalogV07,
} from '../data/experienceCatalogV07'


// ============================================================
// Career & Growth — MVP v0.7 — Phase 7.2A
// Structured Experience Profile Matching Engine
//
// Purpose:
// - Match the child's existing Growth Intelligence profile
//   against normalized v0.7 experience profiles.
// - Keep audience eligibility separate from personalization.
// - Preserve the rule: intent influences recommendations;
//   intent is NOT Growth Intelligence evidence.
// - Run beside the existing v0.6 recommendation engine.
//
// This file does NOT:
// - research the live web
// - create new Growth Intelligence evidence
// - replace the current UI recommendation flow
// ============================================================


// ============================================================
// MATCHING WEIGHTS
// ============================================================
//
// These are intentionally transparent MVP heuristics.
// They are not scientific measurements.
//
// Direct evidence-derived layers receive the strongest weight.
// Pathways are supporting / derived context.
// ============================================================

export const profileMatchWeights = {
  signals: 0.34,
  traits: 0.28,
  domains: 0.24,
  pathways: 0.14,
}


// ============================================================
// HELPERS
// ============================================================

const unique =
  (values = []) =>
    [
      ...new Set(
        values.filter(Boolean)
      ),
    ]


const normalizeText =
  (value) =>
    String(value || '')
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        ' '
      )
      .trim()


const tokenize =
  (value) =>
    normalizeText(value)
      .split(/\s+/)
      .filter(
        (token) =>
          token.length >= 3
      )


const overlap =
  (left = [], right = []) => {
    const rightSet =
      new Set(right)

    return unique(left)
      .filter(
        (value) =>
          rightSet.has(value)
      )
  }


const getProfileIds =
  (items = []) => {
    const collection =
      Array.isArray(items)
        ? items
        : Object.values(
            items || {}
          )

    return unique(
      collection
        .map(
          (item) =>
            item?.id
        )
        .filter(Boolean)
    )
  }


const getIntentText =
  (intent = {}) =>
    [
      intent.title,
      intent.label,
      intent.text,
      intent.description,
      intent.intent,
      intent.goal,
      intent.value,
    ]
      .filter(Boolean)
      .join(' ')


const getIntentIds =
  (intents = []) =>
    unique(
      intents
        .map(
          (intent) =>
            intent?.id
        )
        .filter(Boolean)
    )


const getExperienceSearchText =
  (experience) =>
    [
      experience.title,
      experience.description,
      ...(
        experience.profile
          ?.topics ||
        []
      ),
      ...(
        experience.profile
          ?.interests ||
        []
      ),
      ...(
        experience.profile
          ?.skills ||
        []
      ),
      ...(
        experience.profile
          ?.learningOutcomes ||
        []
      ),
    ]
      .filter(Boolean)
      .join(' ')


// ============================================================
// GROWTH PROFILE MATCHING
// ============================================================

const scoreLayer =
  ({
    childIds = [],
    experienceIds = [],
  }) => {
    if (
      !childIds.length ||
      !experienceIds.length
    ) {
      return {
        score: 0,
        matches: [],
      }
    }

    const matches =
      overlap(
        childIds,
        experienceIds
      )

    return {
      score:
        matches.length /
        experienceIds.length,

      matches,
    }
  }


export const matchGrowthProfile =
  ({
    growthProfile,
    experience,
  }) => {
    const childSignals =
      getProfileIds(
        growthProfile
          ?.signals
      )

    const childTraits =
      getProfileIds(
        growthProfile
          ?.traits
      )

    const childDomains =
      getProfileIds(
        growthProfile
          ?.domains
      )

    const childPathways =
      getProfileIds(
        growthProfile
          ?.pathways
      )

    const alignment =
      experience
        ?.profile
        ?.growthAlignment ||
      {}

    const experienceSignals =
      unique([
        ...(
          alignment
            .leverages
            ?.signals ||
          []
        ),

        ...(
          alignment
            .develops
            ?.signals ||
          []
        ),
      ])

    const experienceTraits =
      unique([
        ...(
          alignment
            .leverages
            ?.traits ||
          []
        ),

        ...(
          alignment
            .develops
            ?.traits ||
          []
        ),
      ])

    const signalMatch =
      scoreLayer({
        childIds:
          childSignals,

        experienceIds:
          experienceSignals,
      })

    const traitMatch =
      scoreLayer({
        childIds:
          childTraits,

        experienceIds:
          experienceTraits,
      })

    const domainMatch =
      scoreLayer({
        childIds:
          childDomains,

        experienceIds:
          alignment.domains ||
          [],
      })

    const pathwayMatch =
      scoreLayer({
        childIds:
          childPathways,

        experienceIds:
          alignment.pathways ||
          [],
      })

    const weightedParts = [
      {
        key: 'signals',
        weight:
          profileMatchWeights
            .signals,
        ...signalMatch,
      },

      {
        key: 'traits',
        weight:
          profileMatchWeights
            .traits,
        ...traitMatch,
      },

      {
        key: 'domains',
        weight:
          profileMatchWeights
            .domains,
        ...domainMatch,
      },

      {
        key: 'pathways',
        weight:
          profileMatchWeights
            .pathways,
        ...pathwayMatch,
      },
    ]

    const activeParts =
      weightedParts.filter(
        (part) =>
          part.matches.length > 0 ||
          (
            part.key ===
              'signals' &&
            experienceSignals.length
          ) ||
          (
            part.key ===
              'traits' &&
            experienceTraits.length
          ) ||
          (
            part.key ===
              'domains' &&
            (
              alignment.domains ||
              []
            ).length
          ) ||
          (
            part.key ===
              'pathways' &&
            (
              alignment.pathways ||
              []
            ).length
          )
      )

    const availableWeight =
      activeParts.reduce(
        (total, part) =>
          total +
          part.weight,
        0
      )

    const weightedScore =
      activeParts.reduce(
        (total, part) =>
          total +
          part.score *
            part.weight,
        0
      )

    return {
      score:
        availableWeight > 0
          ? weightedScore /
            availableWeight
          : 0,

      matches: {
        signals:
          signalMatch.matches,

        traits:
          traitMatch.matches,

        domains:
          domainMatch.matches,

        pathways:
          pathwayMatch.matches,
      },
    }
  }


// ============================================================
// INTENT MATCHING
// ============================================================
//
// Intent remains a recommendation input only.
// This does not write evidence into Growth Intelligence.
// ============================================================

export const matchIntents =
  ({
    intents = [],
    experience,
  }) => {
    if (!intents.length) {
      return {
        score: 0,
        matchedIntentIds: [],
        matchedTerms: [],
      }
    }

    const experienceTokens =
      new Set(
        tokenize(
          getExperienceSearchText(
            experience
          )
        )
      )

    const matchedIntentIds = []
    const matchedTerms = []

    intents.forEach(
      (intent) => {
        const terms =
          tokenize(
            getIntentText(
              intent
            )
          )

        const matches =
          terms.filter(
            (term) =>
              experienceTokens.has(
                term
              )
          )

        if (matches.length) {
          if (intent?.id) {
            matchedIntentIds.push(
              intent.id
            )
          }

          matchedTerms.push(
            ...matches
          )
        }
      }
    )

    return {
      score:
        matchedIntentIds.length /
        Math.max(
          intents.length,
          1
        ),

      matchedIntentIds:
        unique(
          matchedIntentIds
        ),

      matchedTerms:
        unique(
          matchedTerms
        ),
    }
  }


// ============================================================
// INTEREST MATCHING
// ============================================================

export const matchDeclaredInterests =
  ({
    interests = [],
    experience,
  }) => {
    if (!interests.length) {
      return {
        score: 0,
        matches: [],
      }
    }

    const normalizedInterests =
      interests.map(
        normalizeText
      )

    const experienceInterests =
      [
        ...(
          experience.profile
            ?.interests ||
          []
        ),

        ...(
          experience.profile
            ?.topics ||
          []
        ),
      ].map(
        normalizeText
      )

    const matches =
      overlap(
        normalizedInterests,
        experienceInterests
      )

    return {
      score:
        matches.length /
        Math.max(
          normalizedInterests
            .length,
          1
        ),

      matches,
    }
  }


// ============================================================
// JOURNEY NOVELTY
// ============================================================

const getJourneyExperienceIds =
  (journeyItems = []) =>
    new Set(
      journeyItems
        .map(
          (item) =>
            item?.experienceId ||
            item?.experienceCandidateId ||
            item?.id
        )
        .filter(Boolean)
    )


export const scoreJourneyNovelty =
  ({
    journeyItems = [],
    experience,
  }) => {
    const journeyIds =
      getJourneyExperienceIds(
        journeyItems
      )

    if (
      journeyIds.has(
        experience.id
      )
    ) {
      return 0
    }

    return 1
  }


// ============================================================
// RECOMMENDATION STRATEGY
// ============================================================

const countMatches =
  (match = {}) =>
    (
      match.signals?.length ||
      0
    ) +
    (
      match.traits?.length ||
      0
    ) +
    (
      match.domains?.length ||
      0
    ) +
    (
      match.pathways?.length ||
      0
    )


export const inferRecommendationStrategy =
  ({
    profileMatch,
    studentIntentMatch,
    parentIntentMatch,
  }) => {
    const directMatches =
      countMatches(
        profileMatch.matches
      )

    const intentScore =
      Math.max(
        studentIntentMatch
          .score,
        parentIntentMatch
          .score
      )

    if (
      directMatches >= 3 &&
      profileMatch.score >= 0.45
    ) {
      return recommendationStrategies
        .STRENGTHEN
    }

    if (
      directMatches >= 1 &&
      intentScore > 0
    ) {
      return recommendationStrategies
        .EXPLORE
    }

    if (
      directMatches >= 1
    ) {
      return recommendationStrategies
        .STRETCH
    }

    return recommendationStrategies
      .DISCOVER
  }


// ============================================================
// EXPLANATION
// ============================================================

const buildReasons =
  ({
    profileMatch,
    interestMatch,
    studentIntentMatch,
    parentIntentMatch,
    strategy,
  }) => {
    const reasons = []

    if (
      profileMatch
        .matches
        .domains
        .length
    ) {
      reasons.push(
        'Matches a domain already appearing in the Growth Intelligence profile.'
      )
    }

    if (
      profileMatch
        .matches
        .traits
        .length
    ) {
      reasons.push(
        'Connects with demonstrated Growth traits.'
      )
    }

    if (
      profileMatch
        .matches
        .signals
        .length
    ) {
      reasons.push(
        'Builds on Growth signals already supported by evidence.'
      )
    }

    if (
      interestMatch
        .matches
        .length
    ) {
      reasons.push(
        'Matches a declared interest.'
      )
    }

    if (
      studentIntentMatch
        .matchedIntentIds
        .length
    ) {
      reasons.push(
        'Connects with something the student wants to explore.'
      )
    }

    if (
      parentIntentMatch
        .matchedIntentIds
        .length
    ) {
      reasons.push(
        'Supports a parent growth goal.'
      )
    }

    if (
      strategy ===
      recommendationStrategies
        .DISCOVER
    ) {
      reasons.push(
        'Introduces a new area beyond the current evidence profile.'
      )
    }

    return reasons
  }


// ============================================================
// SINGLE EXPERIENCE MATCH
// ============================================================

export const matchExperienceForChild =
  ({
    childContext,
    experience,
  }) => {
    const validation =
      validateExperienceTemplate(
        experience
      )

    if (!validation.valid) {
      return {
        experienceId:
          experience?.id ||
          null,

        eligible: false,

        score: 0,

        strategy:
          recommendationStrategies
            .DISCOVER,

        reasons: [],

        errors:
          validation.errors,
      }
    }

    const eligibility =
      evaluateAudienceEligibility({
        childContext,

        audienceProfile:
          experience.audience,
      })

    if (!eligibility.eligible) {
      return {
        experienceId:
          experience.id,

        eligible: false,

        score: 0,

        strategy:
          null,

        reasons:
          eligibility.reasons,

        errors: [],
      }
    }

    const profileMatch =
      matchGrowthProfile({
        growthProfile:
          childContext
            .growthProfile,

        experience,
      })

    const interestMatch =
      matchDeclaredInterests({
        interests:
          childContext
            .declaredInterests,

        experience,
      })

    const studentIntentMatch =
      matchIntents({
        intents:
          childContext
            .studentIntents,

        experience,
      })

    const parentIntentMatch =
      matchIntents({
        intents:
          childContext
            .parentIntents,

        experience,
      })

    const novelty =
      scoreJourneyNovelty({
        journeyItems:
          childContext
            .journeyItems,

        experience,
      })

    const strategy =
      inferRecommendationStrategy({
        profileMatch,
        studentIntentMatch,
        parentIntentMatch,
      })

    // --------------------------------------------------------
    // Phase 7.2A ranking heuristic
    //
    // Profile fit is primary.
    // Student intent is stronger than parent intent.
    // Interests help when explicitly available.
    // Novelty prevents completed/repeated experiences from
    // dominating the list.
    //
    // This remains deliberately simple until we can compare
    // real recommendation output against v0.6.
    // --------------------------------------------------------

    const score =
      (
        profileMatch.score *
          0.50
      ) +
      (
        studentIntentMatch
          .score *
          0.20
      ) +
      (
        parentIntentMatch
          .score *
          0.12
      ) +
      (
        interestMatch.score *
          0.10
      ) +
      (
        novelty *
          0.08
      )

    const reasons =
      buildReasons({
        profileMatch,
        interestMatch,
        studentIntentMatch,
        parentIntentMatch,
        strategy,
      })

    return {
      experienceId:
        experience.id,

      eligible: true,

      score,

      strategy,

      reasons,

      matches: {
        growth:
          profileMatch.matches,

        interests:
          interestMatch.matches,

        studentIntentIds:
          studentIntentMatch
            .matchedIntentIds,

        parentIntentIds:
          parentIntentMatch
            .matchedIntentIds,
      },

      components: {
        profile:
          profileMatch.score,

        studentIntent:
          studentIntentMatch
            .score,

        parentIntent:
          parentIntentMatch
            .score,

        interests:
          interestMatch.score,

        novelty,
      },

      errors: [],
    }
  }


// ============================================================
// RANK CATALOG
// ============================================================

export const getExperienceProfileMatches =
  ({
    childProfile = {},
    growthProfile = null,
    studentIntents = [],
    parentIntents = [],
    journeyItems = [],
    declaredInterests = [],
    experiencePreferences = {},
    catalog =
      experienceCatalogV07,
    limit = 5,
  } = {}) => {
    const childContext =
      createChildContext({
        childProfile,
        growthProfile,
        studentIntents,
        parentIntents,
        journeyItems,
        declaredInterests,
        experiencePreferences,
      })

    return catalog
      .map(
        (experience) => ({
          experience,
          match:
            matchExperienceForChild({
              childContext,
              experience,
            }),
        })
      )
      .filter(
        (result) =>
          result.match
            .eligible
      )
      .sort(
        (a, b) =>
          b.match.score -
          a.match.score
      )
      .slice(
        0,
        Math.max(
          Number(limit) || 5,
          1
        )
      )
  }


// ============================================================
// DEBUG / COMPARISON VIEW MODEL
// ============================================================
//
// This gives us an easy way to compare v0.7 results against
// v0.6 without changing the visible application yet.
// ============================================================

export const getExperienceMatchDebugSummary =
  (options = {}) =>
    getExperienceProfileMatches(
      options
    ).map(
      ({
        experience,
        match,
      }) => ({
        id:
          experience.id,

        title:
          experience.title,

        score:
          Number(
            match.score.toFixed(
              3
            )
          ),

        strategy:
          match.strategy,

        reasons:
          match.reasons,

        matches:
          match.matches,

        components:
          Object.fromEntries(
            Object.entries(
              match.components
            ).map(
              ([
                key,
                value,
              ]) => [
                key,
                Number(
                  value.toFixed(
                    3
                  )
                ),
              ]
            )
          ),
      })
    )


export default {
  profileMatchWeights,
  matchGrowthProfile,
  matchIntents,
  matchDeclaredInterests,
  scoreJourneyNovelty,
  inferRecommendationStrategy,
  matchExperienceForChild,
  getExperienceProfileMatches,
  getExperienceMatchDebugSummary,
}
