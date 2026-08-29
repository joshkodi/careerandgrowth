// src/intelligence/growthOpportunityProviderEngine.js

// ============================================================
// SynapStride — MVP v0.11 — Phase 4
// Growth Opportunity Provider Engine
//
// First executable provider behind the provider-neutral discovery
// contract. The default provider adapts the existing SynapStride
// Grow experience catalog into opportunity candidates.
//
// IMPORTANT:
// - No network calls.
// - No LLM calls.
// - Provider results are candidates, not evidence.
// - A provider result is not automatically a recommendation.
// ============================================================

import {
  growExperiences,
} from '../data/growExperiences'

import {
  growthOpportunityKinds,
  growthOpportunityProviderTypes,
} from './growthOpportunityDiscoveryEngine'

export const growthOpportunityProviderVersion = '0.11.3'

const safeArray = (value) =>
  Array.isArray(value) ? value.filter(Boolean) : []

const normalize = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tokenize = (values = []) =>
  [...new Set(
    safeArray(values)
      .flat(Infinity)
      .filter(Boolean)
      .flatMap((value) => normalize(value).split(' '))
      .filter((term) => term.length >= 3)
  )]

const catalogItems = () =>
  Array.isArray(growExperiences)
    ? growExperiences
    : Object.values(growExperiences || {})

const getExperienceId = (item) =>
  item?.id || item?.experienceId || null

const buildCandidate = (item, request, matchScore) => ({
  id: `opportunity_${getExperienceId(item)}`,
  opportunityId: getExperienceId(item),
  provider: 'SynapStride Curated Growth Catalog',
  providerType: growthOpportunityProviderTypes.CURATED_CATALOG,
  kind: growthOpportunityKinds.INTEREST_ACTIVITY,

  title: item?.title || 'Growth activity',
  description: item?.description || null,
  emoji: item?.emoji || '✨',

  ageRange: item?.ageRange || null,
  domains: safeArray(item?.domains),
  develops: safeArray(item?.develops),
  interests: safeArray(item?.interests),
  format: safeArray(item?.format),
  estimatedTime: item?.estimatedTime || item?.time || null,

  source: {
    catalog: 'growExperiences',
    experienceId: getExperienceId(item),
    provenanceVerified: true,
  },

  retrievedFor: {
    requestId: request?.id || null,
    domain: request?.domain || null,
  },

  providerMatchScore: Number(matchScore.toFixed(2)),
  raw: item,
})

const scoreCatalogItem = (item, request) => {
  const requestTerms = tokenize([
    request?.search?.terms,
    request?.intent?.structuredTerms,
    request?.personalization?.profileTerms,
  ])

  const itemTerms = new Set(tokenize([
    item?.title,
    item?.description,
    item?.domains,
    item?.develops,
    item?.interests,
    item?.type,
  ]))

  if (!requestTerms.length) return 0.25

  const matches = requestTerms.filter((term) =>
    itemTerms.has(term)
  )

  return Math.min(
    1,
    0.15 + (matches.length / Math.min(requestTerms.length, 6))
  )
}

export const curatedGrowthOpportunityProvider = Object.freeze({
  id: 'synapstride_curated_growth_catalog',
  type: growthOpportunityProviderTypes.CURATED_CATALOG,
  label: 'SynapStride Curated Growth Catalog',

  discover(request) {
    if (!request?.id) return []

    const maxResults =
      Number(request?.search?.maxResults) || 8

    return catalogItems()
      .filter((item) => getExperienceId(item))
      .map((item) => ({
        item,
        score: scoreCatalogItem(item, request),
      }))
      .filter(({ score }) => score > 0.15)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(({ item, score }) =>
        buildCandidate(item, request, score)
      )
  },
})

export function discoverGrowthOpportunityCandidates(
  request,
  { provider = curatedGrowthOpportunityProvider } = {}
) {
  if (!request || !provider?.discover) return []

  const candidates = provider.discover(request)

  return Array.isArray(candidates)
    ? candidates
    : []
}

export default {
  growthOpportunityProviderVersion,
  curatedGrowthOpportunityProvider,
  discoverGrowthOpportunityCandidates,
}
