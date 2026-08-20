// src/intelligence/growthEvidenceNormalizer.js

// ============================================================
// Career & Growth — MVP v0.8 — Phase 8.8B
// Cross-Source Evidence Normalization
//
// Converts raw evidence events into a common pattern-observation
// contract while preserving source independence.
//
// No score mutation. No recommendation becomes evidence.
// ============================================================

import {
  evidenceSourceTypes,
} from '../data/growthTaxonomy'

import {
  growthPatternRegistry,
} from './growthPatternRegistry'


const signalToPatterns = Object.freeze({
  persistence: [
    'persistence',
  ],

  curiosity: [
    'curiosity',
  ],

  problem_solving: [
    'problem_solving',
  ],

  analytical_thinking: [
    'problem_solving',
  ],

  creative_thinking: [
    'creativity',
  ],

  creating: [
    'creativity',
    'building_making',
  ],

  hands_on: [
    'building_making',
  ],

  experimenting: [
    'curiosity',
    'problem_solving',
  ],

  collaborating: [
    'collaboration',
  ],

  helping: [
    'helping_others',
  ],

  communicating: [
    'communication',
  ],
})


function getSourceIdentity(
  event
) {
  const type =
    event?.source?.type

  if (
    type ===
    evidenceSourceTypes
      .DISCOVERY
  ) {
    return {
      sourceType:
        'student_self_report',

      contextType:
        'discover_you',
    }
  }

  if (
    type ===
    evidenceSourceTypes
      .PARENT_OBSERVATION
  ) {
    const isPerspective =
      event
        ?.source
        ?.experienceId ===
      'parent_perspective'

    return {
      sourceType:
        'parent_observation',

      contextType:
        isPerspective
          ? 'parent_perspective'
          : 'experience_parent_observation',
    }
  }

  if (
    type ===
      evidenceSourceTypes
        .ADVENTURE_QUESTION ||
    type ===
      evidenceSourceTypes
        .ADVENTURE_CHOICE
  ) {
    return {
      sourceType:
        'experience_behavior',

      contextType:
        event
          ?.source
          ?.experienceId ||
        'experience',
    }
  }

  if (
    type ===
    evidenceSourceTypes
      .REFLECTION
  ) {
    return {
      sourceType:
        'experience_reflection',

      contextType:
        event
          ?.source
          ?.experienceId ||
        'experience',
    }
  }

  if (
    type ===
    evidenceSourceTypes
      .COMPLETION
  ) {
    return {
      sourceType:
        'system_completion',

      contextType:
        event
          ?.source
          ?.experienceId ||
        'experience',
    }
  }

  return {
    sourceType:
      'other_evidence',

    contextType:
      event
        ?.source
        ?.experienceId ||
      'other',
  }
}


function isKnownPattern(
  patternId
) {
  return growthPatternRegistry.some(
    (pattern) =>
      pattern.id === patternId
  )
}


export function normalizeGrowthEvidenceEvents(
  evidenceEvents = []
) {
  if (!Array.isArray(evidenceEvents)) {
    return []
  }

  const observations = []

  evidenceEvents.forEach(
    (event) => {
      const identity =
        getSourceIdentity(
          event
        )

      ;(
        event?.evidence ||
        []
      ).forEach(
        (
          signal,
          signalIndex
        ) => {
          const patternIds =
            signalToPatterns[
              signal.signalId
            ] ||
            []

          patternIds
            .filter(
              isKnownPattern
            )
            .forEach(
              (patternId) => {
                const weight =
                  Number(
                    signal.weight
                  ) || 0

                if (!weight) {
                  return
                }

                observations.push({
                  patternId,

                  sourceType:
                    identity
                      .sourceType,

                  contextType:
                    identity
                      .contextType,

                  sourceId:
                    `${event.id}:${signal.signalId}:${signalIndex}`,

                  direction:
                    weight < 0
                      ? 'negative'
                      : 'positive',

                  strength:
                    Math.min(
                      1,
                      Math.abs(
                        weight
                      )
                    ),

                  rationale:
                    event
                      ?.metadata
                      ?.responseText ||
                    event
                      ?.metadata
                      ?.questionText ||
                    signal.signalId,

                  signalId:
                    signal.signalId,

                  eventId:
                    event.id,

                  observedAt:
                    event.createdAt ||
                    null,
                })
              }
            )
        }
      )
    }
  )

  return observations
}


export default {
  normalizeGrowthEvidenceEvents,
}
