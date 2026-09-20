// src/intelligence/firstUseExperience.js
// SynapStride MVP v0.14 — First-Use Intelligence & Personalization
//
// This module does not create a second intelligence system.
// It derives the child's first-use experience state from the same
// evidence, journey, activity, and recommendation data already owned
// by the Growth Intelligence architecture.

export const firstUseStates = Object.freeze({
  NEW: 'new',
  DISCOVERING: 'discovering',
  PERSONALIZED: 'personalized',
  ACTIVE: 'active',
})

const asArray = (value) =>
  Array.isArray(value) ? value : []

const isDiscoveryEvidence = (event) => {
  const sourceType = String(
    event?.source?.type || ''
  ).toLowerCase()

  const experienceId = String(
    event?.source?.experienceId || ''
  ).toLowerCase()

  return (
    sourceType.includes('discover') ||
    experienceId === 'discover_you'
  )
}

const isMeaningfulActivity = (item) => {
  if (!item) return false

  const status = String(
    item.status || ''
  ).toLowerCase()

  return ![
    'draft',
    'suggested',
    'recommended',
    'cancelled',
    'canceled',
    'skipped',
  ].includes(status)
}

const uniqueDiscoverSignals = (events = [], limit = 4) => {
  const seen = new Set()
  const signals = []

  for (const event of events) {
    const label =
      event?.metadata?.responseText ||
      event?.metadata?.answerLabel ||
      null

    if (!label) continue

    const normalized = String(label)
      .trim()
      .toLowerCase()

    if (!normalized || seen.has(normalized)) {
      continue
    }

    seen.add(normalized)
    signals.push({
      id:
        event?.source?.questionId ||
        event?.source?.responseId ||
        normalized,
      label: String(label).trim(),
    })

    if (signals.length >= limit) break
  }

  return signals
}

export function buildFirstUseExperience({
  childProfile = null,
  discoveryComplete = false,
  discoveryInProgress = false,
  evidenceEvents = [],
  journeyItems = [],
  growthActivities = [],
  recommendations = [],
} = {}) {
  const childExists = Boolean(
    childProfile?.name?.trim()
  )

  const discoveryEvidence =
    asArray(evidenceEvents).filter(
      isDiscoveryEvidence
    )

  const discoverSignals =
    uniqueDiscoverSignals(
      discoveryEvidence
    )

  const meaningfulJourney =
    asArray(journeyItems).filter(
      isMeaningfulActivity
    )

  const meaningfulActivities =
    asArray(growthActivities).filter(
      isMeaningfulActivity
    )

  const hasActivityHistory =
    meaningfulJourney.length > 0 ||
    meaningfulActivities.length > 0

  const hasDiscoverEvidence =
    discoveryEvidence.length > 0

  let state = firstUseStates.NEW

  if (
    discoveryInProgress &&
    !discoveryComplete
  ) {
    state = firstUseStates.DISCOVERING
  } else if (hasActivityHistory) {
    state = firstUseStates.ACTIVE
  } else if (
    discoveryComplete ||
    hasDiscoverEvidence
  ) {
    state = firstUseStates.PERSONALIZED
  }

  const recommendationItems =
    state === firstUseStates.NEW ||
    state === firstUseStates.DISCOVERING
      ? []
      : asArray(recommendations)

  return {
    state,
    childExists,
    isFirstUse:
      state !== firstUseStates.ACTIVE,
    hasDiscoverEvidence,
    discoveryEvidenceCount:
      discoveryEvidence.length,
    discoverSignals,
    hasActivityHistory,
    activityCount:
      meaningfulJourney.length +
      meaningfulActivities.length,
    recommendations:
      recommendationItems,
    primaryRecommendation:
      recommendationItems[0] || null,
    secondaryRecommendation:
      recommendationItems[1] || null,
  }
}
