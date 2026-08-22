import {
  growExperiences,
} from '../data/growExperiences'

import {
  createRecommendationCandidate,
} from './growthLoopModels'


// ============================================================
// RECOMMENDATION ENGINE V1
// ============================================================
//
// Inputs:
//
// Growth Profile
//     What we have learned about the child.
//
// Student Intent
//     What the child says they want.
//
// Parent Intent
//     What the parent hopes to encourage.
//
// Grow Catalog
//     Structured experiences we can recommend.
//
// IMPORTANT:
//
// Intent is NOT evidence.
//
// Parent goals and student interests influence
// recommendations but do not modify Growth Intelligence.
// ============================================================


const WEIGHTS = {
  PROFILE: 40,
  STUDENT_INTENT: 35,
  PARENT_INTENT: 25,
  PROMOTED_PATTERN: 30,
}


// ============================================================
// TEXT NORMALIZATION
// ============================================================

const normalizeText = (value = '') =>
  value
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()


const tokenize = (value = '') =>
  normalizeText(value)
    .split(' ')
    .filter(
      (token) =>
        token.length >= 3
    )


// ============================================================
// MATCHING
// ============================================================

const getExperienceTerms =
  (experience) => {
    const values = [
      experience.title,
      experience.description,
      ...(experience.domains || []),
      ...(experience.develops || []),
      ...(experience.interests || []),
      experience.type,
    ]

    return new Set(
      values.flatMap(
        (value) =>
          tokenize(value)
      )
    )
  }


const getTextMatchScore =
  (
    text,
    experience
  ) => {
    if (!text) {
      return 0
    }

    const intentTerms =
      tokenize(text)

    if (
      intentTerms.length === 0
    ) {
      return 0
    }

    const experienceTerms =
      getExperienceTerms(
        experience
      )

    const matches =
      intentTerms.filter(
        (term) =>
          experienceTerms.has(
            term
          )
      )

    if (
      matches.length === 0
    ) {
      return 0
    }

    return Math.min(
      matches.length /
        Math.min(
          intentTerms.length,
          4
        ),
      1
    )
  }


// ============================================================
// STUDENT INTENT
// ============================================================

const scoreStudentIntents =
  (
    experience,
    intents = []
  ) => {
    const activeIntents =
      intents.filter(
        (intent) =>
          intent.status ===
            'active' &&
          intent.text
      )

    if (
      activeIntents.length === 0
    ) {
      return {
        score: 0,
        matches: [],
      }
    }

    const scored =
      activeIntents
        .map(
          (intent) => ({
            intent,

            matchScore:
              getTextMatchScore(
                intent.text,
                experience
              ),
          })
        )
        .filter(
          (item) =>
            item.matchScore > 0
        )
        .sort(
          (a, b) =>
            b.matchScore -
            a.matchScore
        )

    if (
      scored.length === 0
    ) {
      return {
        score: 0,
        matches: [],
      }
    }

    // The strongest student intent
    // drives this part of the score.
    //
    // We don't want five similar
    // intents to overwhelm everything
    // else.

    return {
      score:
        scored[0].matchScore,

      matches:
        scored.map(
          (item) =>
            item.intent
        ),
    }
  }


// ============================================================
// PARENT INTENT
// ============================================================

const scoreParentIntents =
  (
    experience,
    intents = []
  ) => {
    const activeIntents =
      intents.filter(
        (intent) =>
          intent.status ===
            'active' &&
          intent.text
      )

    if (
      activeIntents.length === 0
    ) {
      return {
        score: 0,
        matches: [],
      }
    }

    const scored =
      activeIntents
        .map(
          (intent) => ({
            intent,

            matchScore:
              getTextMatchScore(
                intent.text,
                experience
              ),
          })
        )
        .filter(
          (item) =>
            item.matchScore > 0
        )
        .sort(
          (a, b) =>
            b.matchScore -
            a.matchScore
        )

    if (
      scored.length === 0
    ) {
      return {
        score: 0,
        matches: [],
      }
    }

    return {
      score:
        scored[0].matchScore,

      matches:
        scored.map(
          (item) =>
            item.intent
        ),
    }
  }


// ============================================================
// GROWTH PROFILE
// ============================================================

const getProfileItems =
  (profile) => {
    if (!profile) {
      return []
    }

    const collections = [
      profile.traits,
      profile.domains,
      profile.pathways,
    ]

    return collections
      .filter(
        Array.isArray
      )
      .flat()
      .filter(Boolean)
  }


const scoreGrowthProfile =
  (
    experience,
    profile
  ) => {
    const profileItems =
      getProfileItems(
        profile
      )

    if (
      profileItems.length === 0
    ) {
      return {
        score: 0,
        matches: [],
      }
    }

    const experienceTerms =
      getExperienceTerms(
        experience
      )

    const matches =
      profileItems
        .map(
          (item) => {
            const itemTerms =
              tokenize(
                [
                  item.id,
                  item.label,
                ]
                  .filter(Boolean)
                  .join(' ')
              )

            const matched =
              itemTerms.some(
                (term) =>
                  experienceTerms.has(
                    term
                  )
              )

            if (!matched) {
              return null
            }

            const rawScore =
              Number(
                item.score ??
                item.relevance ??
                0
              )

            return {
              id:
                item.id,

              label:
                item.label ||
                item.id,

              score:
                rawScore,
            }
          }
        )
        .filter(Boolean)
        .sort(
          (a, b) =>
            b.score -
            a.score
        )

    if (
      matches.length === 0
    ) {
      return {
        score: 0,
        matches: [],
      }
    }

    const strongest =
      matches[0]

    return {
      score:
        Math.min(
          strongest.score /
            100,
          1
        ),

      matches,
    }
  }



// ============================================================
// PROMOTED PATTERN MATCH
// ============================================================
//
// A promoted pattern may influence recommendation ranking only after
// the corroboration + promotion engines have declared it eligible.
// This does not create evidence and does not modify the Growth Profile.
// ============================================================

const scorePromotedPattern =
  (
    experience,
    promotedPattern
  ) => {
    if (!promotedPattern) {
      return {
        score: 0,
        matches: [],
      }
    }

    const patternText =
      [
        promotedPattern.patternId,
        promotedPattern.patternLabel,
        promotedPattern.label,
      ]
        .filter(Boolean)
        .join(' ')

    const matchScore =
      getTextMatchScore(
        patternText,
        experience
      )

    return {
      score: matchScore,
      matches:
        matchScore > 0
          ? [
              {
                id:
                  promotedPattern.patternId ||
                  promotedPattern.id,
                label:
                  promotedPattern.patternLabel ||
                  promotedPattern.label ||
                  promotedPattern.patternId,
              },
            ]
          : [],
    }
  }


// ============================================================
// AGE ELIGIBILITY
// ============================================================

const isAgeEligible =
  (
    experience,
    age
  ) => {
    const numericAge =
      Number(age)

    if (
      !Number.isFinite(
        numericAge
      )
    ) {
      return true
    }

    const minimum =
      experience.ageRange
        ?.min

    const maximum =
      experience.ageRange
        ?.max

    if (
      Number.isFinite(
        minimum
      ) &&
      numericAge < minimum
    ) {
      return false
    }

    if (
      Number.isFinite(
        maximum
      ) &&
      numericAge > maximum
    ) {
      return false
    }

    return true
  }


// ============================================================
// REASON GENERATION
// ============================================================

const buildReasons =
  ({
    studentMatch,
    parentMatch,
    profileMatch,
    patternMatch,
    recommendationMode,
  }) => {
    const reasons = []

    if (
      studentMatch
        .matches
        .length > 0
    ) {
      reasons.push(
        `Connects with something you said you want to explore: "${studentMatch.matches[0].text}"`
      )
    }

    if (
      parentMatch
        .matches
        .length > 0
    ) {
      reasons.push(
        `Supports a parent goal: "${parentMatch.matches[0].text}"`
      )
    }

    if (
      profileMatch
        .matches
        .length > 0
    ) {
      reasons.push(
        `Builds on an emerging Growth Profile signal: ${profileMatch.matches[0].label}`
      )
    }

    if (
      recommendationMode === 'deepen' &&
      patternMatch
        .matches
        .length > 0
    ) {
      reasons.unshift(
        `Deepens a corroborated pattern: ${patternMatch.matches[0].label}`
      )
    }

    if (
      recommendationMode === 'explore' &&
      reasons.length === 0
    ) {
      reasons.push(
        'Adds a new experience so Career & Growth can learn from another context.'
      )
    }

    if (
      reasons.length === 0
    ) {
      reasons.push(
        'Offers a new area to explore and learn from.'
      )
    }

    return reasons
  }


// ============================================================
// SCORE ONE EXPERIENCE
// ============================================================

const scoreExperience =
  ({
    experience,
    growthProfile,
    studentIntents,
    parentIntents,
    promotedPattern = null,
    recommendationMode = 'explore',
  }) => {
    const profileMatch =
      scoreGrowthProfile(
        experience,
        growthProfile
      )

    const studentMatch =
      scoreStudentIntents(
        experience,
        studentIntents
      )

    const parentMatch =
      scoreParentIntents(
        experience,
        parentIntents
      )

    const patternMatch =
      scorePromotedPattern(
        experience,
        promotedPattern
      )

    const weightedProfile =
      profileMatch.score *
      WEIGHTS.PROFILE

    const weightedStudent =
      studentMatch.score *
      WEIGHTS.STUDENT_INTENT

    const weightedParent =
      parentMatch.score *
      WEIGHTS.PARENT_INTENT

    const weightedPattern =
      recommendationMode === 'deepen'
        ? patternMatch.score *
          WEIGHTS.PROMOTED_PATTERN
        : 0

    const totalScore =
      Math.min(
        100,
        Math.round(
          weightedProfile +
          weightedStudent +
          weightedParent +
          weightedPattern
        )
      )

    const reasons =
      buildReasons({
        studentMatch,
        parentMatch,
        profileMatch,
        patternMatch,
        recommendationMode,
      })

    return createRecommendationCandidate({
      experience,

      score:
        totalScore,

      reasons,

      matchedStudentIntents:
        studentMatch.matches,

      matchedParentIntents:
        parentMatch.matches,

      matchedProfileSignals:
        profileMatch.matches,
    })
  }


// ============================================================
// MAIN RECOMMENDATION FUNCTION
// ============================================================

export const getGrowthRecommendations =
  ({
    age,
    growthProfile = null,
    studentIntents = [],
    parentIntents = [],
    completedExperienceIds = [],
    promotedPattern = null,
    recommendationMode = 'explore',
    limit = 5,
  }) => {
    const completed =
      new Set(
        completedExperienceIds
      )

    const eligibleExperiences =
      growExperiences.filter(
        (experience) =>
          isAgeEligible(
            experience,
            age
          ) &&
          !completed.has(
            experience.id
          )
      )

    const candidates =
      eligibleExperiences
        .map(
          (experience) =>
            scoreExperience({
              experience,
              growthProfile,
              studentIntents,
              parentIntents,
              promotedPattern,
              recommendationMode,
            })
        )
        .filter(Boolean)
        .sort(
          (a, b) => {
            if (
              b.score !==
              a.score
            ) {
              return (
                b.score -
                a.score
              )
            }

            // Stable deterministic
            // tie-breaker.

            return a.title
              .localeCompare(
                b.title
              )
          }
        )

    return candidates.slice(
      0,
      limit
    )
  }


// ============================================================
// DEVELOPMENT INSPECTOR
// ============================================================

export const inspectGrowthRecommendations =
  (input) => {
    const recommendations =
      getGrowthRecommendations({
        ...input,
        limit:
          growExperiences.length,
      })

    console.group(
      '🎯 Growth Recommendation Engine v1'
    )

    recommendations.forEach(
      (
        recommendation,
        index
      ) => {
        console.group(
          `${index + 1}. ${recommendation.emoji} ${recommendation.title} — ${recommendation.score}/100`
        )

        console.log(
          'Reasons:',
          recommendation.reasons
        )

        console.log(
          'Student intent matches:',
          recommendation
            .matches
            .studentIntents
        )

        console.log(
          'Parent goal matches:',
          recommendation
            .matches
            .parentIntents
        )

        console.log(
          'Growth Profile matches:',
          recommendation
            .matches
            .profileSignals
        )

        console.groupEnd()
      }
    )

    console.groupEnd()

    return recommendations
  }