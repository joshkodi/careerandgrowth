// src/intelligence/learningResourceMatcher.js

import {
  learningResourceCatalog,
} from '../data/learningResourceCatalog'

const normalize = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tokens = (value = '') =>
  normalize(value)
    .split(' ')
    .filter((token) => token.length >= 3)

const overlapScore =
  (sourceTerms = [], targetValues = []) => {
    const source =
      [...new Set(
        sourceTerms
          .flatMap(tokens)
          .filter(Boolean)
      )]

    if (!source.length) return 0

    const target =
      normalize(
        targetValues
          .flat(Infinity)
          .filter(Boolean)
          .join(' ')
      )

    const matched =
      source.filter(
        (term) => target.includes(term)
      )

    return matched.length / source.length
  }


const phraseMatchScore =
  (
    sourceValue = '',
    targetValues = []
  ) => {
    const source =
      normalize(sourceValue)

    if (!source) return 0

    const target =
      normalize(
        targetValues
          .flat(Infinity)
          .filter(Boolean)
          .join(' ')
      )

    if (!target) return 0

    if (target.includes(source)) {
      return 1
    }

    const sourceTokens =
      tokens(source)

    if (!sourceTokens.length) {
      return 0
    }

    const matched =
      sourceTokens.filter(
        (term) =>
          target.includes(term)
      )

    return matched.length /
      sourceTokens.length
  }


const topicConflictPenalty =
  (
    learningTopic = '',
    resource = {}
  ) => {
    const topic =
      normalize(learningTopic)

    if (!topic) return 0

    const resourceText =
      normalize(
        [
          resource.title,
          resource.topics,
          resource.skills,
          resource.description,
        ]
          .flat(Infinity)
          .filter(Boolean)
          .join(' ')
      )

    const historicalDomains = [
      ['roman', ['us history', 'american history', 'civil war']],
      ['rome', ['us history', 'american history', 'civil war']],
      ['american', ['roman history', 'ancient rome']],
      ['civil war', ['roman history', 'ancient rome']],
    ]

    for (
      const [
        requestedTerm,
        conflictingTerms,
      ] of historicalDomains
    ) {
      if (
        topic.includes(requestedTerm) &&
        conflictingTerms.some(
          (term) =>
            resourceText.includes(term)
        )
      ) {
        return 0.55
      }
    }

    return 0
  }


const gradeFitScore =
  (grade, range) => {
    const numericGrade = Number(grade)

    if (
      !Number.isFinite(numericGrade) ||
      !range
    ) {
      return 0.6
    }

    if (
      Number.isFinite(Number(range.min)) &&
      numericGrade < Number(range.min)
    ) {
      return 0
    }

    if (
      Number.isFinite(Number(range.max)) &&
      numericGrade > Number(range.max)
    ) {
      return 0
    }

    return 1
  }

const helpModeFit =
  (helpMode, resource) => {
    if (!helpMode) return 0.6

    const modes =
      resource.helpModes || []

    if (modes.includes(helpMode)) {
      return 1
    }

    const fallbackGroups = {
      example: ['understand'],
      get_unstuck: ['understand', 'example'],
      review: ['practice', 'understand'],
      research: ['understand'],
      enrich: ['understand'],
    }

    return (
      fallbackGroups[helpMode] || []
    ).some((mode) =>
      modes.includes(mode)
    )
      ? 0.7
      : 0.2
  }

const qualityScore =
  (resource) => {
    if (resource.qualityTier === 1) return 1
    if (resource.qualityTier === 2) return 0.8
    return 0.6
  }

const formatFit =
  (helpMode, resourceType) => {
    const preferred = {
      understand: ['lesson', 'video', 'interactive', 'course'],
      example: ['video', 'lesson', 'tutorial'],
      practice: ['practice', 'interactive'],
      review: ['practice', 'study_guide', 'lesson'],
      research: ['reference', 'article', 'course'],
      get_unstuck: ['video', 'interactive', 'lesson'],
      enrich: ['interactive', 'course', 'reference'],
    }

    const list =
      preferred[helpMode] || []

    return list.includes(resourceType)
      ? 1
      : 0.5
  }

const buildReason =
  ({
    resource,
    learningContext,
    topicScore,
    noteScore,
    helpScore,
  }) => {
    const reasons = []

    if (topicScore >= 0.5) {
      reasons.push(
        `Strong match for ${learningContext.topic || learningContext.subject || 'this assignment'}.`
      )
    }

    if (noteScore >= 0.4) {
      reasons.push(
        'Matches details from the assignment instructions or help note.'
      )
    }

    if (helpScore >= 0.9) {
      reasons.push(
        `Fits the “${String(learningContext.helpMode || 'help').replaceAll('_', ' ')}” support style.`
      )
    }

    reasons.push(
      `Curated from ${resource.provider}.`
    )

    return reasons
  }

export const scoreLearningResource =
  (
    resource,
    learningContext
  ) => {
    if (!resource || !learningContext) {
      return null
    }

    if (
      learningContext.subjectId &&
      resource.subjectId !==
        learningContext.subjectId
    ) {
      return null
    }

    const topicTerms =
      [
        learningContext.topic,
        ...(learningContext.skills || []),
      ].filter(Boolean)

    const noteTerms =
      [
        learningContext.notes,
        learningContext.taskText,
        learningContext.studentNote,
        ...(learningContext.keywords || []),
      ].filter(Boolean)

    const tokenTopicScore =
      overlapScore(
        topicTerms,
        [
          resource.title,
          resource.description,
          resource.topics,
          resource.skills,
        ]
      )

    const exactTopicScore =
      phraseMatchScore(
        learningContext.topic,
        [
          resource.title,
          resource.topics,
          resource.skills,
        ]
      )

    const topicScore =
      Math.max(
        tokenTopicScore,
        exactTopicScore
      )

    const noteScore =
      overlapScore(
        noteTerms,
        [
          resource.title,
          resource.description,
          resource.topics,
          resource.skills,
        ]
      )

    const helpScore =
      helpModeFit(
        learningContext.helpMode,
        resource
      )

    const gradeScore =
      gradeFitScore(
        learningContext.grade,
        resource.gradeRange
      )

    const trustScore =
      qualityScore(resource)

    const resourceFormatScore =
      formatFit(
        learningContext.helpMode,
        resource.resourceType
      )

    // Topic/skill and assignment context intentionally dominate.
    //
    // Topic precision receives an additional phrase-level boost so a broad
    // resource such as "U.S. History" cannot outrank a Roman-History resource
    // merely because both contain the word "history".
    const topicPrecisionBoost =
      exactTopicScore >= 1
        ? 0.12
        : exactTopicScore >= 0.66
          ? 0.07
          : 0

    const conflictPenalty =
      topicConflictPenalty(
        learningContext.topic,
        resource
      )

    const weighted =
      topicScore * 0.35 +
      noteScore * 0.20 +
      helpScore * 0.20 +
      gradeScore * 0.10 +
      trustScore * 0.10 +
      resourceFormatScore * 0.05 +
      topicPrecisionBoost -
      conflictPenalty

    const score =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(
            weighted * 100
          )
        )
      )

    return {
      resource: {
        ...resource,
        sourceMetadata: {
          credibilityVerified:
            resource.credibilityVerified === true,
          curatedCatalog: true,
        },
      },

      evaluation: {
        status:
          score >= 60
            ? 'pass'
            : score >= 35
              ? 'review'
              : 'low_match',

        score:
          Number(
            (score / 100).toFixed(2)
          ),

        overallScore: score,

        reasons:
          buildReason({
            resource,
            learningContext,
            topicScore,
            noteScore,
            helpScore,
          }),

        dimensions: {
          topicSkillMatch:
            Number(topicScore.toFixed(2)),
          exactTopicMatch:
            Number(exactTopicScore.toFixed(2)),
          topicConflictPenalty:
            Number(conflictPenalty.toFixed(2)),
          assignmentContextMatch:
            Number(noteScore.toFixed(2)),
          helpIntentMatch:
            Number(helpScore.toFixed(2)),
          gradeFit:
            Number(gradeScore.toFixed(2)),
          qualityTrust:
            Number(trustScore.toFixed(2)),
          formatFit:
            Number(resourceFormatScore.toFixed(2)),
        },
      },
    }
  }

// ============================================================
// DIVERSITY-AWARE RECOMMENDATION SELECTION
//
// Ranking answers:
//   "Which resources fit this assignment best?"
//
// Diversity selection answers:
//   "Which different GOOD ways of helping should we show?"
//
// We deliberately do not return four near-identical resources.
// ============================================================

const getResourceApproach =
  (
    resource,
    helpMode = ''
  ) => {
    const type =
      resource?.resourceType || 'lesson'

    const text =
      normalize(
        [
          resource?.title,
          resource?.description,
          resource?.topics,
          resource?.skills,
        ]
          .flat(Infinity)
          .filter(Boolean)
          .join(' ')
      )

    if (
      type === 'interactive'
    ) {
      return {
        id: 'visual_interactive',
        label: 'See it visually',
        description:
          'Explore the idea with an interactive or visual activity.',
        emoji: '👀',
      }
    }

    if (
      type === 'practice'
    ) {
      return {
        id: 'targeted_practice',
        label: 'Practice it',
        description:
          'Try similar problems and build confidence by doing.',
        emoji: '🏋️',
      }
    }

    if (
      type === 'video'
    ) {
      return {
        id:
          helpMode === 'example' ||
          text.includes('worked') ||
          text.includes('example')
            ? 'worked_example'
            : 'watch_explanation',

        label:
          helpMode === 'example' ||
          text.includes('worked') ||
          text.includes('example')
            ? 'Watch a worked example'
            : 'Watch an explanation',

        description:
          'See the concept explained in a guided video.',
        emoji: '▶️',
      }
    }

    if (
      type === 'reference' ||
      type === 'article'
    ) {
      return {
        id: 'trusted_reference',
        label: 'Explore a trusted source',
        description:
          'Use a credible source for more context or research.',
        emoji: '🔎',
      }
    }

    if (
      type === 'course'
    ) {
      return {
        id: 'deeper_path',
        label: 'Go a little deeper',
        description:
          'Use a broader lesson path when you want more context.',
        emoji: '🧭',
      }
    }

    return {
      id: 'step_by_step',
      label:
        helpMode === 'example'
          ? 'Try another example'
          : 'Try another explanation',
      description:
        'Use a structured lesson or step-by-step explanation.',
      emoji: '✏️',
    }
  }


const addRecommendationMetadata =
  (
    candidate,
    {
      role,
      helpMode,
    }
  ) => {
    const approach =
      getResourceApproach(
        candidate.resource,
        helpMode
      )

    return {
      ...candidate,

      recommendationMeta: {
        role,
        approachId:
          approach.id,
        approachLabel:
          approach.label,
        approachDescription:
          approach.description,
        approachEmoji:
          approach.emoji,

        provider:
          candidate.resource?.provider ||
          null,

        resourceType:
          candidate.resource?.resourceType ||
          null,

        // Reserved hook for future SynapStride outcome ranking.
        // No internal outcome signal is applied in the MVP yet.
        internalOutcomeScore:
          null,
      },
    }
  }


const chooseDiverseAlternatives =
  (
    ranked = [],
    primary,
    {
      helpMode = '',
      limit = 3,
    } = {}
  ) => {
    if (
      !primary ||
      limit <= 0
    ) {
      return []
    }

    const remaining =
      ranked.filter(
        (candidate) =>
          candidate.resource?.id !==
          primary.resource?.id
      )

    const selected = []

    const usedProviders =
      new Set(
        [
          primary.resource?.provider,
        ].filter(Boolean)
      )

    const usedTypes =
      new Set(
        [
          primary.resource?.resourceType,
        ].filter(Boolean)
      )

    const usedApproaches =
      new Set([
        getResourceApproach(
          primary.resource,
          helpMode
        ).id,
      ])

    while (
      remaining.length > 0 &&
      selected.length < limit
    ) {
      const scored =
        remaining.map(
          (candidate) => {
            const provider =
              candidate.resource?.provider ||
              ''

            const type =
              candidate.resource?.resourceType ||
              ''

            const approach =
              getResourceApproach(
                candidate.resource,
                helpMode
              )

            const baseScore =
              candidate
                .evaluation
                ?.overallScore ||
              0

            let diversityBonus = 0

            if (
              provider &&
              !usedProviders.has(provider)
            ) {
              diversityBonus += 14
            }

            if (
              type &&
              !usedTypes.has(type)
            ) {
              diversityBonus += 10
            }

            if (
              !usedApproaches.has(
                approach.id
              )
            ) {
              diversityBonus += 18
            }

            return {
              candidate,
              selectionScore:
                baseScore +
                diversityBonus,
            }
          }
        )
        .sort(
          (a, b) => {
            if (
              b.selectionScore !==
              a.selectionScore
            ) {
              return (
                b.selectionScore -
                a.selectionScore
              )
            }

            return (
              (
                b.candidate
                  .evaluation
                  ?.overallScore ||
                0
              ) -
              (
                a.candidate
                  .evaluation
                  ?.overallScore ||
                0
              )
            )
          }
        )

      const chosen =
        scored[0]?.candidate

      if (!chosen) {
        break
      }

      selected.push(chosen)

      const provider =
        chosen.resource?.provider

      const type =
        chosen.resource?.resourceType

      const approach =
        getResourceApproach(
          chosen.resource,
          helpMode
        )

      if (provider) {
        usedProviders.add(provider)
      }

      if (type) {
        usedTypes.add(type)
      }

      usedApproaches.add(
        approach.id
      )

      const index =
        remaining.findIndex(
          (candidate) =>
            candidate.resource?.id ===
            chosen.resource?.id
        )

      if (index >= 0) {
        remaining.splice(
          index,
          1
        )
      }
    }

    return selected
  }


export const matchLearningResources =
  ({
    learningContext,
    catalog =
      learningResourceCatalog,
    limit = 4,
  } = {}) => {
    if (!learningContext) {
      return {
        recommended: [],
        alternatives: [],
        ranked: [],
        allRanked: [],
      }
    }

    const allRanked =
      catalog
        .map(
          (resource) =>
            scoreLearningResource(
              resource,
              learningContext
            )
        )
        .filter(Boolean)
        .filter(
          (candidate) =>
            candidate
              .evaluation
              .overallScore >= 25
        )
        .sort(
          (a, b) => {
            const scoreDiff =
              b.evaluation.overallScore -
              a.evaluation.overallScore

            if (scoreDiff !== 0) {
              return scoreDiff
            }

            return a.resource.title
              .localeCompare(
                b.resource.title
              )
          }
        )

    const primary =
      allRanked[0] || null

    if (!primary) {
      return {
        recommended: [],
        alternatives: [],
        ranked: [],
        allRanked,
      }
    }

    const alternativeLimit =
      Math.max(
        0,
        Math.min(
          3,
          limit - 1
        )
      )

    const alternatives =
      chooseDiverseAlternatives(
        allRanked,
        primary,
        {
          helpMode:
            learningContext.helpMode ||
            '',
          limit:
            alternativeLimit,
        }
      )

    const selected =
      [
        addRecommendationMetadata(
          primary,
          {
            role:
              'primary',
            helpMode:
              learningContext.helpMode ||
              '',
          }
        ),

        ...alternatives.map(
          (candidate) =>
            addRecommendationMetadata(
              candidate,
              {
                role:
                  'alternative',
                helpMode:
                  learningContext.helpMode ||
                  '',
              }
            )
        ),
      ]

    return {
      recommended:
        selected.slice(0, 1),

      alternatives:
        selected.slice(1),

      // "ranked" now means the child-facing curated set:
      // one best choice + up to three differentiated alternatives.
      ranked:
        selected,

      // Preserve the raw score order for diagnostics/future learning.
      allRanked,
    }
  }


export default {
  scoreLearningResource,
  matchLearningResources,
}
