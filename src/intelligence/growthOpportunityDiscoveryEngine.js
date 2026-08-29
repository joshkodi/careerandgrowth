// src/intelligence/growthOpportunityDiscoveryEngine.js

// ============================================================
// SynapStride — MVP v0.11 — Phase 3
// Growth Opportunity Discovery Contract
//
// Purpose:
// Translate a domain intelligence discovery need into a stable,
// provider-neutral request for resources, activities, experiences,
// and (later) local opportunities.
//
// IMPORTANT:
// - This module does not browse the web.
// - This module does not call an LLM.
// - This module does not create evidence.
// - Location is optional and never inferred here.
// - Providers can be swapped without changing domain intelligence.
// ============================================================

export const growthOpportunityDiscoveryVersion = '0.11.2'

export const growthOpportunityKinds = Object.freeze({
  LEARNING_RESOURCE: 'learning_resource',
  INTEREST_ACTIVITY: 'interest_activity',
  GROWTH_EXPERIENCE: 'growth_experience',
  LOCAL_OPPORTUNITY: 'local_opportunity',
})

export const growthOpportunityProviderTypes = Object.freeze({
  CURATED_CATALOG: 'curated_catalog',
  EXTERNAL_API: 'external_api',
  SEARCH_SERVICE: 'search_service',
  LOCATION_SERVICE: 'location_service',
  LLM_ASSISTED_RESEARCH: 'llm_assisted_research',
})

const safeArray = (value) =>
  Array.isArray(value) ? value.filter(Boolean) : []

const unique = (values = []) =>
  [...new Set(safeArray(values))]

const anchorTerms = (profileAnchors = {}) =>
  unique([
    ...safeArray(profileAnchors.traits).map((item) => item?.label),
    ...safeArray(profileAnchors.domains).map((item) => item?.label),
    ...safeArray(profileAnchors.pathways).map((item) => item?.label),
  ])

const normalizeLocation = (location = null) => {
  if (!location || typeof location !== 'object') return null

  const hasUsefulLocation = Boolean(
    location.city ||
    location.region ||
    location.postalCode ||
    location.latitude != null ||
    location.longitude != null
  )

  if (!hasUsefulLocation) return null

  return {
    city: location.city || null,
    region: location.region || null,
    country: location.country || null,
    postalCode: location.postalCode || null,
    latitude: location.latitude ?? null,
    longitude: location.longitude ?? null,
    radiusMiles: location.radiusMiles ?? null,
  }
}

const inferOpportunityKinds = (discoveryNeed = {}) => {
  switch (discoveryNeed.type) {
    case growthOpportunityKinds.LEARNING_RESOURCE:
      return [growthOpportunityKinds.LEARNING_RESOURCE]

    case growthOpportunityKinds.GROWTH_EXPERIENCE:
      return [
        growthOpportunityKinds.GROWTH_EXPERIENCE,
        growthOpportunityKinds.INTEREST_ACTIVITY,
      ]

    case growthOpportunityKinds.INTEREST_ACTIVITY:
    default:
      return [
        growthOpportunityKinds.INTEREST_ACTIVITY,
        growthOpportunityKinds.GROWTH_EXPERIENCE,
      ]
  }
}

export function buildGrowthOpportunityDiscoveryRequest({
  domain,
  discoveryNeed = null,
  child = null,
  location = null,
  maxResults = 8,
} = {}) {
  if (!domain || !discoveryNeed) return null

  const normalizedLocation = normalizeLocation(location)
  const profileTerms = anchorTerms(discoveryNeed.profileAnchors)
  const explicitTerms = unique([
    discoveryNeed.sourceIntentText,
    discoveryNeed.subject,
    discoveryNeed.topic,
    discoveryNeed.intent,
  ])

  const kinds = inferOpportunityKinds(discoveryNeed)

  // Local discovery is deliberately opt-in. Merely having a city in
  // profile data must not silently convert every request into a local one.
  if (normalizedLocation && discoveryNeed.includeLocal === true) {
    kinds.push(growthOpportunityKinds.LOCAL_OPPORTUNITY)
  }

  return {
    id: `growth_discovery_${domain}_${Date.now()}`,
    version: growthOpportunityDiscoveryVersion,
    domain,
    needType: discoveryNeed.type || null,

    audience: {
      childId: child?.id || null,
      age: child?.age ?? null,
      grade: child?.grade ?? null,
    },

    intent: {
      sourceIntentId: discoveryNeed.sourceIntentId || null,
      sourceText: discoveryNeed.sourceIntentText || null,
      structuredTerms: explicitTerms,
    },

    personalization: {
      profileTerms,
      profileAnchors: discoveryNeed.profileAnchors || null,
    },

    search: {
      kinds: unique(kinds),
      terms: unique([...explicitTerms, ...profileTerms]),
      maxResults,
    },

    location: normalizedLocation,

    providerPolicy: {
      allowedProviderTypes: normalizedLocation && discoveryNeed.includeLocal === true
        ? [
            growthOpportunityProviderTypes.CURATED_CATALOG,
            growthOpportunityProviderTypes.EXTERNAL_API,
            growthOpportunityProviderTypes.SEARCH_SERVICE,
            growthOpportunityProviderTypes.LOCATION_SERVICE,
            growthOpportunityProviderTypes.LLM_ASSISTED_RESEARCH,
          ]
        : [
            growthOpportunityProviderTypes.CURATED_CATALOG,
            growthOpportunityProviderTypes.EXTERNAL_API,
            growthOpportunityProviderTypes.SEARCH_SERVICE,
            growthOpportunityProviderTypes.LLM_ASSISTED_RESEARCH,
          ],
      requiresChildSafeResults: true,
      requiresProvenance: true,
    },

    guardrails: {
      recommendationIsEvidence: false,
      intentIsEvidence: false,
      locationWasInferred: false,
      providerMayMutateProfile: false,
    },

    createdAt: new Date().toISOString(),
  }
}

export function executeGrowthOpportunityDiscovery(
  request,
  { provider = null } = {}
) {
  if (!request) return []

  // Provider execution is intentionally injected. The browser intelligence
  // layer remains independent from web/search/location implementations.
  if (!provider?.discover) return []

  const results = provider.discover(request)
  return Array.isArray(results) ? results : []
}

export default {
  growthOpportunityDiscoveryVersion,
  growthOpportunityKinds,
  growthOpportunityProviderTypes,
  buildGrowthOpportunityDiscoveryRequest,
  executeGrowthOpportunityDiscovery,
}
