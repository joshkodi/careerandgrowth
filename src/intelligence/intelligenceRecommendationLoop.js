// src/intelligence/intelligenceRecommendationLoop.js

// ============================================================
// Career & Growth — MVP v0.8.11
// Intelligence & Recommendation Loop
//
// Thin orchestration layer across the intelligence engines that
// already exist in the product.
//
// Responsibilities:
// 1. Build the current Growth Profile from evidence.
// 2. Corroborate cross-context growth patterns.
// 3. Evaluate which patterns are safe to promote.
// 4. Build longitudinal School & Learning progression.
// 5. Produce bounded learning next steps.
// 6. Rank Grow experiences using the existing recommendation engine.
// 7. Return one explainable decision snapshot for the UI.
//
// Guardrails:
// - Recommendations never become evidence.
// - Intent never becomes evidence.
// - Learning history does not infer mastery or weakness.
// - This layer does not mutate evidence, journey items, or profile state.
// - This layer does not call an LLM or external resource provider.
// ============================================================

import {
  buildGrowthProfile,
} from './growthEngine'

import {
  buildGrowthPatternIntelligence,
} from './growthPatternCorroborationEngine'

import {
  buildPatternPromotionRegistry,
} from './growthPatternPromotionEngine'

import {
  buildLearningProgression,
} from './learningProgressionEngine'

import {
  buildLearningNextSteps,
} from './learningNextStepEngine'

import {
  getGrowthRecommendations,
} from './growthRecommendationEngine'


export const recommendationIntentTypes = Object.freeze({
  SUPPORT: 'support',
  PRACTICE: 'practice',
  DEEPEN: 'deepen',
  EXPLORE: 'explore',
})


const buildRecommendationIntent = ({
  learningNextSteps,
  promotionRegistry,
  growthRecommendations,
}) => {
  const urgentLearningStep =
    learningNextSteps
      ?.nextSteps
      ?.find(
        (item) =>
          item.priority >= 90
      ) || null

  if (urgentLearningStep) {
    return {
      type:
        recommendationIntentTypes
          .SUPPORT,

      priority: 100,

      reason:
        'A current learning item still needs support.',

      source:
        'learning_next_step',

      sourceId:
        urgentLearningStep.id,
    }
  }

  const practiceStep =
    learningNextSteps
      ?.nextSteps
      ?.find(
        (item) =>
          item.type ===
          'practice_again'
      ) || null

  if (practiceStep) {
    return {
      type:
        recommendationIntentTypes
          .PRACTICE,

      priority: 80,

      reason:
        'Recent learning support helped, so a bounded follow-up practice is appropriate.',

      source:
        'learning_next_step',

      sourceId:
        practiceStep.id,
    }
  }

  const promotedPattern =
    promotionRegistry
      ?.eligiblePatterns
      ?.[0] || null

  if (promotedPattern) {
    return {
      type:
        recommendationIntentTypes
          .DEEPEN,

      priority: 60,

      reason:
        `There is sufficiently corroborated evidence to deepen ${promotedPattern.patternLabel}.`,

      source:
        'growth_pattern',

      sourceId:
        promotedPattern.patternId,
    }
  }

  if (
    growthRecommendations
      ?.length > 0
  ) {
    return {
      type:
        recommendationIntentTypes
          .EXPLORE,

      priority: 40,

      reason:
        'No higher-priority learning support or promoted growth pattern is active, so the next step can explore a well-matched experience.',

      source:
        'growth_recommendation',

      sourceId:
        growthRecommendations[0]
          .experienceId,
    }
  }

  return {
    type:
      recommendationIntentTypes
        .EXPLORE,

    priority: 20,

    reason:
      'More experience is needed before stronger next-step guidance can be justified.',

    source:
      'fallback',

    sourceId: null,
  }
}


const buildNextActions = ({
  recommendationIntent,
  learningNextSteps,
  growthRecommendations,
  limit,
}) => {
  const actions = []

  const learningSteps =
    learningNextSteps
      ?.nextSteps || []

  const shouldLeadWithLearning =
    recommendationIntent.type ===
      recommendationIntentTypes
        .SUPPORT ||
    recommendationIntent.type ===
      recommendationIntentTypes
        .PRACTICE

  if (shouldLeadWithLearning) {
    learningSteps
      .slice(0, 2)
      .forEach(
        (step) => {
          actions.push({
            id:
              `learning:${step.id}`,

            kind:
              'learning_next_step',

            intent:
              step.type ===
              'practice_again'
                ? recommendationIntentTypes
                    .PRACTICE
                : recommendationIntentTypes
                    .SUPPORT,

            title:
              step.title,

            description:
              step.description,

            actionLabel:
              step.actionLabel,

            priority:
              step.priority,

            rationale:
              step.rationale,

            subject:
              step.subject,

            topic:
              step.topic,

            journeyItemId:
              step.latestItemId,

            guardrail:
              step.guardrail,
          })
        }
      )
  }

  growthRecommendations
    .forEach(
      (recommendation) => {
        actions.push({
          id:
            `experience:${recommendation.experienceId}`,

          kind:
            'growth_experience',

          intent:
            recommendationIntent.type ===
              recommendationIntentTypes
                .DEEPEN
              ? recommendationIntentTypes
                  .DEEPEN
              : recommendationIntentTypes
                  .EXPLORE,

          experienceId:
            recommendation.experienceId,

          title:
            recommendation.title,

          emoji:
            recommendation.emoji,

          score:
            recommendation.score,

          reasons:
            recommendation.reasons,

          matches:
            recommendation.matches,

          rationale:
            recommendation
              .reasons
              ?.join(' ') ||
            'Recommended from the current Growth Profile and stated intent.',
        })
      }
    )

  if (!shouldLeadWithLearning) {
    learningSteps
      .slice(0, 1)
      .forEach(
        (step) => {
          actions.push({
            id:
              `learning:${step.id}`,

            kind:
              'learning_next_step',

            intent:
              recommendationIntentTypes
                .PRACTICE,

            title:
              step.title,

            description:
              step.description,

            actionLabel:
              step.actionLabel,

            priority:
              step.priority,

            rationale:
              step.rationale,

            subject:
              step.subject,

            topic:
              step.topic,

            journeyItemId:
              step.latestItemId,

            guardrail:
              step.guardrail,
          })
        }
      )
  }

  return actions.slice(
    0,
    limit
  )
}


export function buildIntelligenceRecommendationLoop({
  childId = null,
  age = null,
  evidenceEvents = [],
  journeyItems = [],
  studentIntents = [],
  parentIntents = [],
  completedExperienceIds = [],
  recommendationLimit = 5,
  actionLimit = 5,
} = {}) {
  const growthProfile =
    buildGrowthProfile({
      childId,
      evidenceEvents,
    })

  const patternIntelligence =
    buildGrowthPatternIntelligence({
      journeyItems,
      evidenceEvents,
    })

  const promotionRegistry =
    buildPatternPromotionRegistry(
      patternIntelligence
    )

  const learningProgression =
    buildLearningProgression(
      journeyItems
    )

  const learningNextSteps =
    buildLearningNextSteps(
      learningProgression
    )

  const promotedPattern =
    promotionRegistry
      ?.eligiblePatterns
      ?.[0] || null

  const provisionalIntent =
    buildRecommendationIntent({
      learningNextSteps,
      promotionRegistry,
      growthRecommendations: [],
    })

  const recommendationMode =
    provisionalIntent.type ===
      recommendationIntentTypes
        .DEEPEN
      ? recommendationIntentTypes
          .DEEPEN
      : recommendationIntentTypes
          .EXPLORE

  const growthRecommendations =
    getGrowthRecommendations({
      age,
      growthProfile,
      studentIntents,
      parentIntents,
      completedExperienceIds,
      promotedPattern,
      recommendationMode,
      limit:
        recommendationLimit,
    })

  const recommendationIntent =
    buildRecommendationIntent({
      learningNextSteps,
      promotionRegistry,
      growthRecommendations,
    })

  const nextActions =
    buildNextActions({
      recommendationIntent,
      learningNextSteps,
      growthRecommendations,
      limit:
        actionLimit,
    })

  return {
    version: '0.8.11',

    mode:
      'intelligence_recommendation_loop',

    childId,

    intelligence: {
      growthProfile,
      patternIntelligence,
      promotionRegistry,
      learningProgression,
    },

    recommendations: {
      intent:
        recommendationIntent,

      learningNextSteps:
        learningNextSteps
          .nextSteps,

      growthExperiences:
        growthRecommendations,

      experienceStrategy: {
        mode:
          recommendationIntent.type ===
            recommendationIntentTypes
              .DEEPEN
            ? recommendationIntentTypes
                .DEEPEN
            : recommendationIntentTypes
                .EXPLORE,

        promotedPatternId:
          promotedPattern
            ?.patternId || null,

        promotedPatternLabel:
          promotedPattern
            ?.patternLabel || null,

        schoolOnlyCanTriggerDeepen:
          false,
      },

      nextActions,
    },

    guardrails: {
      recommendationIsEvidence:
        false,

      intentIsEvidence:
        false,

      academicMasteryInference:
        false,

      academicWeaknessInference:
        false,

      mutatesEvidence:
        false,
    },

    summary: {
      evidenceEventCount:
        evidenceEvents.length,

      journeyItemCount:
        journeyItems.length,

      growthPatternCount:
        patternIntelligence
          ?.patterns
          ?.length || 0,

      promotedPatternCount:
        promotionRegistry
          ?.eligiblePatterns
          ?.length || 0,

      learningTopicCount:
        learningProgression
          ?.topicCount || 0,

      learningNextStepCount:
        learningNextSteps
          ?.nextSteps
          ?.length || 0,

      growthRecommendationCount:
        growthRecommendations
          .length,

      nextActionCount:
        nextActions.length,
    },

    generatedAt:
      new Date().toISOString(),
  }
}


export default {
  recommendationIntentTypes,
  buildIntelligenceRecommendationLoop,
}
