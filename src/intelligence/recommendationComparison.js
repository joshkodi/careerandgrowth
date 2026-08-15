// src/intelligence/recommendationComparison.js

import {
  getGrowthRecommendations,
} from './growthRecommendationEngine'

import {
  getExperienceMatchDebugSummary,
} from './experienceProfileMatchingEngine'


// ============================================================
// Career & Growth — MVP v0.7 — Phase 7.2B
// Recommendation Comparison
//
// Purpose:
// Run the existing v0.6 recommendation engine and the new
// structured v0.7 profile-matching engine against the same
// child context.
//
// This module is DEVELOPMENT-ONLY support.
// It does not alter recommendation behavior or UI.
// ============================================================


const normalizeScore =
  (value) => {
    const numeric =
      Number(value)

    if (
      !Number.isFinite(
        numeric
      )
    ) {
      return 0
    }

    return numeric
  }


export const compareRecommendationEngines =
  ({
    childProfile = {},
    growthProfile = null,
    studentIntents = [],
    parentIntents = [],
    journeyItems = [],
    declaredInterests = [],
    limit = 5,
  } = {}) => {
    const completedExperienceIds =
      journeyItems
        .map(
          (item) =>
            item?.experienceId
        )
        .filter(Boolean)

    const v06 =
      getGrowthRecommendations({
        age:
          childProfile.age,

        growthProfile,

        studentIntents,

        parentIntents,

        completedExperienceIds,

        limit,
      })

    const v07 =
      getExperienceMatchDebugSummary({
        childProfile,

        growthProfile,

        studentIntents,

        parentIntents,

        journeyItems,

        declaredInterests,

        limit,
      })

    return {
      v06:
        v06.map(
          (
            recommendation,
            index
          ) => ({
            rank:
              index + 1,

            id:
              recommendation.id,

            title:
              recommendation.title,

            score:
              normalizeScore(
                recommendation.score
              ),

            reasons:
              recommendation.reasons ||
              [],

            matches:
              recommendation.matches ||
              {},
          })
        ),

      v07:
        v07.map(
          (
            recommendation,
            index
          ) => ({
            rank:
              index + 1,

            ...recommendation,
          })
        ),
    }
  }


// ============================================================
// CONSOLE INSPECTOR
// ============================================================

export const inspectRecommendationComparison =
  (options = {}) => {
    const comparison =
      compareRecommendationEngines(
        options
      )

    console.group(
      '🧭 Career & Growth — Recommendation Comparison'
    )

    console.group(
      'v0.6 — Existing Recommendation Engine'
    )

    comparison.v06.forEach(
      (item) => {
        console.log(
          `${item.rank}. ${item.title} — ${item.score}/100`,
          item
        )
      }
    )

    console.groupEnd()

    console.group(
      'v0.7 — Structured Profile Matching'
    )

    comparison.v07.forEach(
      (item) => {
        console.log(
          `${item.rank}. ${item.title} — ${item.score}`,
          item
        )
      }
    )

    console.groupEnd()

    console.groupEnd()

    return comparison
  }


export default {
  compareRecommendationEngines,
  inspectRecommendationComparison,
}
