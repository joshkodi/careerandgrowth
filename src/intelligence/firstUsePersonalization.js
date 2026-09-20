// SynapStride MVP v0.14 — First-use personalization projection
// Presentation projection only. Growth Intelligence remains the source of truth.

const SOURCE_DISCOVERY = 'discovery'

function sourceType(event) {
  return event?.source?.type || event?.sourceType || ''
}

function responseText(event) {
  return event?.metadata?.responseText || event?.metadata?.answerLabel || ''
}

function cleanLabel(value = '') {
  return String(value)
    .replace(/^i (like|love|enjoy|prefer|am interested in)\s+/i, '')
    .replace(/[.!?]+$/g, '')
    .trim()
}

function uniqueByLabel(items = []) {
  const seen = new Set()
  return items.filter((item) => {
    const key = item.label.toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function getDiscoveryEvidenceEvents(evidenceEvents = []) {
  return evidenceEvents.filter((event) => sourceType(event) === SOURCE_DISCOVERY)
}

export function buildFirstUseSignals({
  evidenceEvents = [],
  topTraits = [],
  topDomains = [],
  limit = 3,
} = {}) {
  const discoveryEvents = getDiscoveryEvidenceEvents(evidenceEvents)

  const explicit = discoveryEvents
    .map((event) => {
      const label = cleanLabel(responseText(event))
      if (!label) return null
      return {
        id: event?.id || `${event?.source?.questionId || 'discover'}-${label}`,
        label,
        emoji: event?.metadata?.emoji || '✨',
        source: 'discover',
      }
    })
    .filter(Boolean)

  const inferred = [
    ...topDomains.map((item) => ({
      id: `domain-${item.id || item.label}`,
      label: item.label,
      emoji: item.emoji || '🧭',
      source: 'growth-intelligence',
    })),
    ...topTraits.map((item) => ({
      id: `trait-${item.id || item.label}`,
      label: item.label,
      emoji: item.emoji || '🌱',
      source: 'growth-intelligence',
    })),
  ].filter((item) => item.label)

  return uniqueByLabel([...explicit, ...inferred]).slice(0, limit)
}

export function explainRecommendation(recommendation, signals = []) {
  if (!recommendation) return ''

  const existing =
    recommendation.reason ||
    recommendation.explanation ||
    recommendation.why ||
    recommendation.metadata?.reason

  if (existing) return existing

  const names = signals.slice(0, 2).map((signal) => signal.label).filter(Boolean)
  if (!names.length) return 'Picked from the first things SynapStride is learning about you.'
  if (names.length === 1) return `Because you told SynapStride about ${names[0]}.`
  return `Because you told SynapStride about ${names[0]} and ${names[1]}.`
}

export function buildFirstUsePersonalization({
  discoveryComplete = false,
  evidenceEvents = [],
  topTraits = [],
  topDomains = [],
  recommendations = [],
  journeyItems = [],
  growthActivities = [],
} = {}) {
  const discoveryEvents = getDiscoveryEvidenceEvents(evidenceEvents)
  const signals = buildFirstUseSignals({ evidenceEvents, topTraits, topDomains })

  const hasActivity =
    journeyItems.some((item) => item?.status && item.status !== 'not_started') ||
    growthActivities.length > 0

  const state = hasActivity
    ? 'ACTIVE'
    : discoveryComplete || discoveryEvents.length > 0
      ? 'PERSONALIZED'
      : 'NEW'

  return {
    state,
    signals,
    discoveryEvidenceCount: discoveryEvents.length,
    recommendations: recommendations.slice(0, 3).map((recommendation) => ({
      ...recommendation,
      personalizationReason: explainRecommendation(recommendation, signals),
    })),
  }
}
