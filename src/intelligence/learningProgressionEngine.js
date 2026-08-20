// src/intelligence/learningProgressionEngine.js

// ============================================================
// Career & Growth — MVP v0.8 — Phase 8.9B
// Longitudinal Learning Progression Engine
//
// Groups School & Learning Journey items by subject/topic and
// describes change over time without claiming academic mastery.
//
// This is descriptive intelligence:
// - repeated topics can be connected
// - support cycles can be counted
// - resolved / still-needs-help outcomes can be summarized
// - academic mastery/weakness is NOT inferred
// ============================================================

import {
  journeyPaths,
  journeyStatuses,
  normalizeJourneyItems,
} from './unifiedJourneyModels'


const normalizeKey =
  (value = '') =>
    String(value)
      .toLowerCase()
      .trim()
      .replace(
        /\s+/g,
        ' '
      )


const getOutcomeType =
  (item) =>
    item
      ?.learningSupportRequest
      ?.outcome
      ?.outcomeType ||
    null


const getLearningState =
  (item) => {
    const outcome =
      getOutcomeType(item)

    if (
      item.status ===
      journeyStatuses.COMPLETED
    ) {
      return 'completed'
    }

    if (
      outcome === 'resolved'
    ) {
      return 'support_resolved'
    }

    if (
      outcome === 'more_help'
    ) {
      return 'needs_more_support'
    }

    if (
      item.status ===
      journeyStatuses.NEED_HELP
    ) {
      return 'needs_attention'
    }

    if (
      item.status ===
      journeyStatuses.IN_PROGRESS
    ) {
      return 'working'
    }

    return 'planned'
  }


const getProgressNarrative =
  ({
    itemCount,
    resolvedCount,
    moreHelpCount,
    completedCount,
  }) => {
    if (
      itemCount >= 2 &&
      resolvedCount >= 1 &&
      completedCount >= 1
    ) {
      return 'You have returned to this area and moved through supported learning into completed work.'
    }

    if (
      itemCount >= 2 &&
      resolvedCount >= 1
    ) {
      return 'You have worked on this area more than once, and support has helped with at least one learning need.'
    }

    if (
      moreHelpCount >= 1
    ) {
      return 'This area has needed more support. Keep it visible so the next learning step can build on what you have already tried.'
    }

    if (
      completedCount >= 1
    ) {
      return 'You have completed work in this area. More learning over time will show whether a broader pattern is developing.'
    }

    return 'This is a newer learning area. Career & Growth will connect future work here as more history develops.'
  }


export function buildLearningProgression(
  journeyItems = []
) {
  const schoolItems =
    normalizeJourneyItems(
      journeyItems
    )
      .filter(
        (item) =>
          item.path ===
          journeyPaths
            .SCHOOL_LEARNING
      )

  const groups =
    new Map()

  schoolItems.forEach(
    (item) => {
      const subject =
        item.subject?.trim() ||
        'General Learning'

      const topic =
        item.topic?.trim() ||
        item.title?.trim() ||
        'Learning'

      const key =
        `${normalizeKey(subject)}::${normalizeKey(topic)}`

      if (!groups.has(key)) {
        groups.set(
          key,
          {
            key,
            subject,
            topic,
            items: [],
          }
        )
      }

      groups
        .get(key)
        .items
        .push(item)
    }
  )

  const topics =
    [...groups.values()]
      .map(
        (group) => {
          const items =
            [...group.items]
              .sort(
                (a, b) =>
                  new Date(
                    a.createdAt ||
                    0
                  ) -
                  new Date(
                    b.createdAt ||
                    0
                  )
              )

          const resolvedCount =
            items.filter(
              (item) =>
                getOutcomeType(
                  item
                ) ===
                'resolved'
            ).length

          const moreHelpCount =
            items.filter(
              (item) =>
                getOutcomeType(
                  item
                ) ===
                'more_help'
            ).length

          const completedCount =
            items.filter(
              (item) =>
                item.status ===
                journeyStatuses
                  .COMPLETED
            ).length

          const supportCycles =
            items.filter(
              (item) =>
                item
                  .learningSupportRequest
            ).length

          const latest =
            [...items]
              .sort(
                (a, b) =>
                  new Date(
                    b.updatedAt ||
                    b.createdAt ||
                    0
                  ) -
                  new Date(
                    a.updatedAt ||
                    a.createdAt ||
                    0
                  )
              )[0]

          return {
            key:
              group.key,

            subject:
              group.subject,

            topic:
              group.topic,

            itemCount:
              items.length,

            supportCycles,

            resolvedCount,
            moreHelpCount,
            completedCount,

            latestState:
              getLearningState(
                latest
              ),

            latestItemId:
              latest?.id ||
              null,

            latestUpdatedAt:
              latest?.updatedAt ||
              latest?.createdAt ||
              null,

            narrative:
              getProgressNarrative({
                itemCount:
                  items.length,
                resolvedCount,
                moreHelpCount,
                completedCount,
              }),

            history:
              items.map(
                (item) => ({
                  journeyId:
                    item.id,

                  title:
                    item.title,

                  state:
                    getLearningState(
                      item
                    ),

                  outcomeType:
                    getOutcomeType(
                      item
                    ),

                  createdAt:
                    item.createdAt ||
                    null,

                  updatedAt:
                    item.updatedAt ||
                    null,
                })
              ),

            academicInference: {
              mastery: null,
              weakness: null,
              note:
                '8.9B describes learning progression but does not infer academic mastery or weakness.',
            },
          }
        }
      )
      .sort(
        (a, b) =>
          new Date(
            b.latestUpdatedAt ||
            0
          ) -
          new Date(
            a.latestUpdatedAt ||
            0
          )
      )

  return {
    version:
      '0.8.9B',

    topicCount:
      topics.length,

    repeatedTopicCount:
      topics.filter(
        (topic) =>
          topic.itemCount > 1
      ).length,

    topics,

    generatedAt:
      new Date().toISOString(),
  }
}


export default {
  buildLearningProgression,
}
