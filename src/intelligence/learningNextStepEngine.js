// src/intelligence/learningNextStepEngine.js

// ============================================================
// Career & Growth — MVP v0.8 — Phase 8.9C
// Longitudinal Learning Next-Step Engine
//
// Converts learning progression into bounded next-step suggestions.
// It does NOT infer grades, mastery, weakness, diagnosis, or curriculum.
// ============================================================

const recommendations = Object.freeze({
  CONTINUE_SUPPORT: {
    type: 'continue_support',
    title: 'Try another way to learn this',
    description:
      'You have said you still need help here. Try a different explanation, example, or guided practice resource.',
    actionLabel: 'Find another resource',
  },

  PRACTICE_AGAIN: {
    type: 'practice_again',
    title: 'Practice this again',
    description:
      'Support helped with this topic. A short follow-up practice can help you see what now feels easier.',
    actionLabel: 'Add follow-up practice',
  },

  REFLECT_AFTER_COMPLETION: {
    type: 'reflect_after_completion',
    title: 'Notice what changed',
    description:
      'You have completed work in this topic. Capture what felt easier, what was still hard, or what you want to try next.',
    actionLabel: 'Add another learning item',
  },

  KEEP_BUILDING: {
    type: 'keep_building',
    title: 'Keep building on this topic',
    description:
      'You have returned to this topic more than once. Another related activity can help Career & Growth understand the learning journey better.',
    actionLabel: 'Add related work',
  },

  START_WITH_SUPPORT: {
    type: 'start_with_support',
    title: 'Choose the kind of help you need',
    description:
      'This topic needs attention right now. Tell Career & Growth what kind of help would make the next step easier.',
    actionLabel: 'Get help',
  },
})


function recommendationForTopic(
  topic
) {
  if (!topic) {
    return null
  }

  let template = null
  let priority = 0

  if (
    topic.latestState ===
      'needs_more_support'
  ) {
    template =
      recommendations
        .CONTINUE_SUPPORT
    priority = 100
  } else if (
    topic.latestState ===
      'needs_attention'
  ) {
    template =
      recommendations
        .START_WITH_SUPPORT
    priority = 90
  } else if (
    topic.resolvedCount > 0 &&
    topic.completedCount <
      topic.itemCount
  ) {
    template =
      recommendations
        .PRACTICE_AGAIN
    priority = 75
  } else if (
    topic.completedCount > 0 &&
    topic.itemCount > 1
  ) {
    template =
      recommendations
        .REFLECT_AFTER_COMPLETION
    priority = 60
  } else if (
    topic.itemCount > 1
  ) {
    template =
      recommendations
        .KEEP_BUILDING
    priority = 50
  }

  if (!template) {
    return null
  }

  return {
    ...template,

    id:
      `${topic.key}:${template.type}`,

    topicKey:
      topic.key,

    subject:
      topic.subject,

    topic:
      topic.topic,

    latestItemId:
      topic.latestItemId,

    priority,

    rationale:
      topic.narrative,

    guardrail:
      'Suggested from learning history only; this is not a mastery or weakness judgment.',
  }
}


export function buildLearningNextSteps(
  learningProgression
) {
  const topics =
    learningProgression
      ?.topics ||
    []

  const nextSteps =
    topics
      .map(
        recommendationForTopic
      )
      .filter(Boolean)
      .sort(
        (a, b) =>
          b.priority -
          a.priority
      )

  return {
    version:
      '0.8.9C',

    nextSteps,

    urgentCount:
      nextSteps.filter(
        (item) =>
          item.priority >= 90
      ).length,

    generatedAt:
      new Date().toISOString(),
  }
}


export default {
  buildLearningNextSteps,
}
