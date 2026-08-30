// src/intelligence/growthIntelligenceContext.js

// ============================================================
// SynapStride — MVP v0.11 — Growth Intelligence Foundation
// Canonical Growth Intelligence Context
//
// Purpose:
// Provide one stable, read-only contract describing what the
// intelligence layer currently knows and what inputs produced it.
//
// This is NOT a second profile and it is NOT persisted state.
// Raw evidence remains the source of truth. The context is rebuilt
// from evidence, Journey, intent, and derived intelligence outputs.
// ============================================================

import {
  buildGrowthProfileUnderstanding,
} from './growthProfileUnderstanding'

export const growthIntelligenceContextVersion = '0.11.0'

export const growthIntelligenceDomains = Object.freeze({
  SCHOOL_LEARNING: 'school_learning',
  INTERESTS_ACTIVITIES: 'interests_activities',
  EXPERIENCES: 'experiences',
  LOCATION: 'location',
})

const safeArray = (value) =>
  Array.isArray(value) ? value : []

const unique = (values = []) =>
  [...new Set(values.filter(Boolean))]

const countJourneyPaths = (journeyItems = []) =>
  safeArray(journeyItems).reduce(
    (counts, item) => {
      const path = item?.path || 'other'
      counts[path] = (counts[path] || 0) + 1
      return counts
    },
    {}
  )

const summarizeIntent = (intents = []) => {
  const values = safeArray(intents)

  return {
    count: values.length,
    latest: values
      .filter(Boolean)
      .slice()
      .sort(
        (a, b) =>
          new Date(b?.createdAt || 0) -
          new Date(a?.createdAt || 0)
      )[0] || null,
  }
}

export function buildGrowthIntelligenceContext({
  childId = null,
  age = null,
  evidenceEvents = [],
  journeyItems = [],
  studentIntents = [],
  parentIntents = [],
  completedExperienceIds = [],
  growthProfile = null,
  patternIntelligence = null,
  promotionRegistry = null,
  learningProgression = null,
} = {}) {
  const safeEvidence = safeArray(evidenceEvents)
  const safeJourney = safeArray(journeyItems)

  const profileUnderstanding =
    buildGrowthProfileUnderstanding({
      child: {
        id: childId,
        age: age ?? null,
      },
      evidenceEvents: safeEvidence,
      journeyItems: safeJourney,
      studentIntents,
      parentIntents,
      growthProfile,
      promotionRegistry,
    })

  const sourceTypes = unique(
    safeEvidence.map(
      (event) => event?.source?.type
    )
  )

  return {
    version: growthIntelligenceContextVersion,

    child: {
      id: childId,
      age: age ?? null,
    },

    evidence: {
      eventCount: safeEvidence.length,
      sourceTypes,
      events: safeEvidence,
    },

    intent: {
      student: summarizeIntent(studentIntents),
      parent: summarizeIntent(parentIntents),
    },

    journey: {
      itemCount: safeJourney.length,
      pathCounts: countJourneyPaths(safeJourney),
      completedExperienceIds:
        unique(completedExperienceIds),
      items: safeJourney,
    },

    understanding: {
      // Derived read models. None of these replace raw evidence.
      growthProfile,
      patternIntelligence,
      promotionRegistry,
      learningProgression,
      profileUnderstanding,
    },

    capabilities: {
      schoolLearning: true,
      interestsActivities: true,
      experiences: true,
      location: false,
      externalResourceDiscovery: true,
      llmReasoning: false,
    },

    provenance: {
      rawEvidenceIsSourceOfTruth: true,
      intentIsEvidence: false,
      recommendationIsEvidence: false,
      contextIsPersisted: false,
    },

    builtAt: new Date().toISOString(),
  }
}

export default {
  growthIntelligenceContextVersion,
  growthIntelligenceDomains,
  buildGrowthIntelligenceContext,
}
