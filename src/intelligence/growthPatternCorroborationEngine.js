// src/intelligence/growthPatternCorroborationEngine.js

// ============================================================
// Career & Growth — MVP v0.8 — Phase 8.8B
// Cross-Source Evidence Corroboration
//
// Uses independent raw evidence sources plus conservative School
// & Learning signals. Existing derived Growth Profile traits are
// no longer used as corroboration input.
//
// OBSERVATIONAL ONLY: profile promotion remains disabled.
// ============================================================

import {
  growthPatternRegistry,
  growthPatternStatuses,
} from './growthPatternRegistry'

import {
  normalizeGrowthEvidenceEvents,
} from './growthEvidenceNormalizer'


const createLearningObservation =
  ({
    patternId,
    item,
    signal,
    index,
  }) => ({
    patternId,

    sourceType:
      'school_learning_behavior',

    contextType:
      'school_learning',

    sourceId:
      `${item.id}:${signal.type}:${index}`,

    direction:
      signal.direction ||
      'positive',

    strength:
      Number(
        signal.strength
      ) || 0.2,

    rationale:
      signal.rationale ||
      '',

    signalId:
      signal.type,

    eventId:
      null,

    observedAt:
      item.updatedAt ||
      null,
  })


function getLearningObservations(
  journeyItems = []
) {
  const observations = []

  journeyItems.forEach(
    (item) => {
      const signals =
        item
          ?.learningIntelligence
          ?.signals ||
        []

      signals.forEach(
        (
          signal,
          index
        ) => {
          growthPatternRegistry
            .filter(
              (pattern) =>
                pattern
                  .learningSignals
                  .includes(
                    signal.type
                  )
            )
            .forEach(
              (pattern) => {
                observations.push(
                  createLearningObservation({
                    patternId:
                      pattern.id,
                    item,
                    signal,
                    index,
                  })
                )
              }
            )
        }
      )
    }
  )

  return observations
}


function determineStatus({
  positiveCount,
  negativeCount,
  sourceDiversity,
  contextDiversity,
}) {
  if (
    positiveCount > 0 &&
    negativeCount > 0
  ) {
    return growthPatternStatuses
      .MIXED
  }

  if (
    sourceDiversity >= 3 &&
    contextDiversity >= 3 &&
    positiveCount >= 5
  ) {
    return growthPatternStatuses
      .ESTABLISHED
  }

  if (
    sourceDiversity >= 2 &&
    contextDiversity >= 2 &&
    positiveCount >= 3
  ) {
    return growthPatternStatuses
      .CORROBORATED
  }

  if (
    positiveCount >= 2
  ) {
    return growthPatternStatuses
      .EMERGING
  }

  return growthPatternStatuses
    .OBSERVATION
}


export function buildGrowthPatternIntelligence({
  journeyItems = [],
  evidenceEvents = [],
} = {}) {
  const rawEvidenceObservations =
    normalizeGrowthEvidenceEvents(
      evidenceEvents
    )

  const learningObservations =
    getLearningObservations(
      journeyItems
    )

  const observations = [
    ...rawEvidenceObservations,
    ...learningObservations,
  ]

  const patterns =
    growthPatternRegistry
      .map(
        (definition) => {
          const evidence =
            observations.filter(
              (observation) =>
                observation
                  .patternId ===
                definition.id
            )

          if (!evidence.length) {
            return null
          }

          const positiveCount =
            evidence.filter(
              (item) =>
                item.direction !==
                'negative'
            ).length

          const negativeCount =
            evidence.filter(
              (item) =>
                item.direction ===
                'negative'
            ).length

          const sources = [
            ...new Set(
              evidence.map(
                (item) =>
                  item.sourceType
              )
            ),
          ]

          const contexts = [
            ...new Set(
              evidence.map(
                (item) =>
                  item.contextType
              )
            ),
          ]

          const status =
            determineStatus({
              positiveCount,
              negativeCount,
              sourceDiversity:
                sources.length,
              contextDiversity:
                contexts.length,
            })

          const confidence =
            Math.min(
              0.95,
              0.12 +
                evidence.length *
                  0.06 +
                sources.length *
                  0.13 +
                contexts.length *
                  0.09
            )

          return {
            id:
              definition.id,

            label:
              definition.label,

            emoji:
              definition.emoji,

            status,

            confidence:
              Number(
                confidence.toFixed(
                  2
                )
              ),

            evidenceCount:
              evidence.length,

            positiveCount,
            negativeCount,

            sourceDiversity:
              sources.length,

            contextDiversity:
              contexts.length,

            sources,
            contexts,
            evidence,

            profilePromotionEligible:
              false,

            promotionNote:
              'Phase 8.8B validates raw cross-source corroboration. Promotion remains disabled.',
          }
        }
      )
      .filter(Boolean)
      .sort(
        (a, b) =>
          b.confidence -
          a.confidence
      )

  return {
    version:
      '0.8.8B',

    status:
      'cross_source_observational',

    patterns,

    observationCount:
      observations.length,

    rawEvidenceObservationCount:
      rawEvidenceObservations
        .length,

    learningObservationCount:
      learningObservations
        .length,

    generatedAt:
      new Date().toISOString(),
  }
}


export default {
  buildGrowthPatternIntelligence,
}
