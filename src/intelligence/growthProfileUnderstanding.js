// src/intelligence/growthProfileUnderstanding.js

// ============================================================
// SynapStride — MVP v0.11 — Unified Profile Understanding
//
// Purpose:
// Build one read-only, rebuildable interpretation of the child
// for Profile/My Profile experiences without duplicating source
// area data.
//
// IMPORTANT:
// - Raw evidence remains the source of truth.
// - Discover answers are represented as child-stated context.
// - Observed / derived / recommended concepts remain distinct.
// - This module does not persist state, score evidence, or create
//   recommendations.
// ============================================================

export const growthProfileUnderstandingVersion = '0.11.1'

const safeArray = (value) =>
  Array.isArray(value) ? value : []

const safeObject = (value) =>
  value && typeof value === 'object'
    ? value
    : {}

const newestTimestamp = (value) =>
  new Date(
    value?.createdAt ||
    value?.updatedAt ||
    value?.timestamp ||
    0
  ).getTime()

const latestDiscoveryResponses = (evidenceEvents = []) => {
  const latestByQuestion = new Map()

  safeArray(evidenceEvents)
    .filter(
      (event) =>
        event?.source?.type === 'discovery' ||
        event?.source?.type === 'DISCOVERY'
    )
    .forEach((event) => {
      const questionId =
        event?.source?.questionId ||
        event?.metadata?.questionId ||
        null

      const key =
        questionId ||
        event?.source?.responseId ||
        event?.id ||
        `discovery-${latestByQuestion.size}`

      const existing = latestByQuestion.get(key)

      if (
        !existing ||
        newestTimestamp(event) >= newestTimestamp(existing)
      ) {
        latestByQuestion.set(key, event)
      }
    })

  return [...latestByQuestion.values()]
    .sort(
      (a, b) =>
        newestTimestamp(b) -
        newestTimestamp(a)
    )
    .map((event) => ({
      id:
        event?.source?.responseId ||
        event?.id ||
        null,
      questionId:
        event?.source?.questionId ||
        null,
      question:
        event?.metadata?.questionText ||
        null,
      label:
        event?.metadata?.responseText ||
        event?.metadata?.answerLabel ||
        null,
      source: 'discovery',
      evidenceEventId: event?.id || null,
      createdAt:
        event?.createdAt ||
        event?.timestamp ||
        null,
    }))
    .filter((item) => item.label)
}

const rankedProfileItems = (group) =>
  Object.values(safeObject(group))
    .filter(Boolean)
    .slice()
    .sort(
      (a, b) =>
        Number(
          b?.score ??
          b?.confidence?.score ??
          0
        ) -
        Number(
          a?.score ??
          a?.confidence?.score ??
          0
        )
    )
    .map((item) => ({
      id: item?.id || null,
      label: item?.label || item?.id || null,
      emoji: item?.emoji || null,
      score:
        item?.score ??
        item?.confidence?.score ??
        null,
      confidence:
        item?.confidence || null,
      evidenceCount:
        item?.evidenceCount ??
        item?.evidence?.length ??
        null,
      experienceCount:
        item?.experienceCount ??
        null,
      sourceTypeCount:
        item?.sourceTypeCount ??
        null,
    }))

const promotedPatterns = (promotionRegistry) => {
  const registry = safeObject(promotionRegistry)

  const values =
    safeArray(registry.eligiblePatterns).length
      ? safeArray(registry.eligiblePatterns)
      : safeArray(registry.promotedPatterns)

  return values
    .filter(Boolean)
    .map((item) => ({
      id: item?.id || item?.patternId || null,
      label:
        item?.label ||
        item?.name ||
        item?.patternId ||
        null,
      confidence:
        item?.confidence ||
        item?.corroboration?.confidence ||
        null,
      source: 'growth_intelligence',
    }))
    .filter((item) => item.label)
}

const countEvidenceSources = (evidenceEvents = []) => {
  const counts = {}

  safeArray(evidenceEvents)
    .forEach((event) => {
      const source =
        event?.source?.type ||
        'unknown'

      counts[source] =
        (counts[source] || 0) + 1
    })

  return counts
}

const evidenceCountForSource = (
  evidenceCounts = {},
  sourceNames = []
) =>
  safeArray(sourceNames).reduce(
    (total, sourceName) =>
      total +
      Number(
        evidenceCounts?.[sourceName] ||
        0
      ),
    0
  )

export function buildGrowthProfileUnderstanding({
  child = null,
  evidenceEvents = [],
  journeyItems = [],
  studentIntents = [],
  parentIntents = [],
  growthProfile = null,
  promotionRegistry = null,
  recommendationSet = null,
} = {}) {
  const profile = safeObject(growthProfile)
  const statedDiscover =
    latestDiscoveryResponses(evidenceEvents)

  const evidenceCounts =
    countEvidenceSources(evidenceEvents)

  const parentEvidenceCount =
    evidenceCountForSource(
      evidenceCounts,
      [
        'parent_observation',
        'PARENT_OBSERVATION',
      ]
    )

  const discoveryEvidenceCount =
    evidenceCountForSource(
      evidenceCounts,
      [
        'discovery',
        'DISCOVERY',
      ]
    )

  const traits =
    rankedProfileItems(profile.traits)

  const domains =
    rankedProfileItems(profile.domains)

  const pathways =
    rankedProfileItems(profile.pathways)

  return {
    version: growthProfileUnderstandingVersion,

    child: child || null,

    // Child-facing concepts can use this distinction while the UI
    // remains free to synthesize them into one holistic story.
    stated: {
      discover: statedDiscover,
      studentIntent: safeArray(studentIntents),
    },

    observed: {
      promotedPatterns:
        promotedPatterns(promotionRegistry),
      journeyItemCount:
        safeArray(journeyItems).length,
      parentPerspectiveCount:
        parentEvidenceCount,
    },

    derived: {
      traits,
      domains,
      pathways,
    },

    recommended: {
      items:
        safeArray(recommendationSet?.items),
      intent:
        recommendationSet?.intent || null,
    },

    sources: {
      evidenceCounts,
      discoveryContributionCount:
        statedDiscover.length ||
        discoveryEvidenceCount,
      journeyContributionCount:
        safeArray(journeyItems).length,
      parentContributionCount:
        parentEvidenceCount,
    },

    guardrails: {
      rawEvidenceIsSourceOfTruth: true,
      discoverResponseIsChildStated: true,
      parentPerspectiveIsSeparateProvenance: true,
      derivedUnderstandingIsRebuildable: true,
      recommendationIsEvidence: false,
      sourceAreaDataIsNotDuplicated: true,
    },

    builtAt: new Date().toISOString(),
  }
}

export default {
  growthProfileUnderstandingVersion,
  buildGrowthProfileUnderstanding,
}
