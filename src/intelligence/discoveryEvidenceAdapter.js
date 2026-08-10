// src/intelligence/discoveryEvidenceAdapter.js

import {
  legacySignalsToEvidence,
} from './legacyEvidenceAdapter'

//
// Career & Growth — MVP v0.3
// Discovery Evidence Adapter
//
// Converts the existing Discover You responses into:
//
//   legacy answer signals
//        ↓
//   canonical v0.3 signals
//        ↓
//   primary learning-domain context
//
// Discovery remains broad by design. We therefore use moderate
// evidence strength and choose one PRIMARY domain when an answer
// clearly points to one.
//

//
// -----------------------------------------------------------------------------
// DISCOVERY EVIDENCE
// -----------------------------------------------------------------------------
//
// Discovery answers are meaningful, but they are self-reported
// preferences rather than observed behavior during an adventure.
//
// For that reason we slightly reduce their weight relative to
// challenge behavior.
//

const DISCOVERY_SIGNAL_MULTIPLIER = 0.8

export function getDiscoveryEvidence(answer) {
  return legacySignalsToEvidence(
    answer?.signals || [],
    DISCOVERY_SIGNAL_MULTIPLIER
  )
}

//
// -----------------------------------------------------------------------------
// PRIMARY DOMAIN RESOLUTION
// -----------------------------------------------------------------------------
//
// The existing v0.2 answers may contain multiple legacy signals.
//
// Example:
//
// ['space', 'technology', 'building']
//
// For v0.3 we attach one primary domain context to the evidence
// event. This is intentionally conservative for the MVP.
//
// Later we can evolve the evidence contract to support multiple
// weighted domain contexts.
//

const DOMAIN_SIGNAL_PRIORITY = [
  {
    domainId: 'health_human_body',
    signals: ['health'],
  },

  {
    domainId: 'nature_environment',
    signals: ['animals', 'nature'],
  },

  {
    domainId: 'creative_arts_storytelling',
    signals: ['arts'],
  },

  {
    domainId: 'business_entrepreneurship',
    signals: ['business'],
  },

  {
    domainId: 'technology_robotics',
    signals: ['technology'],
  },

  {
    domainId: 'science_discovery',
    signals: ['science', 'space', 'discovery'],
  },

  {
    domainId: 'people_society',
    signals: [
      'people',
      'helping',
      'impact',
      'communicating',
      'collaborating',
      'leading',
      'organizing',
    ],
  },

  {
    domainId: 'engineering_making',
    signals: ['building'],
  },
]

export function getDiscoveryDomainId(answer) {
  const answerSignals =
    answer?.signals || []

  for (const mapping of DOMAIN_SIGNAL_PRIORITY) {
    const matches =
      mapping.signals.some((signal) =>
        answerSignals.includes(signal)
      )

    if (matches) {
      return mapping.domainId
    }
  }

  return null
}

//
// -----------------------------------------------------------------------------
// DEBUG
// -----------------------------------------------------------------------------

export function describeDiscoveryEvidence(answer) {
  return {
    answerId:
      answer?.id || null,

    legacySignals:
      answer?.signals || [],

    canonicalEvidence:
      getDiscoveryEvidence(answer),

    primaryDomainId:
      getDiscoveryDomainId(answer),
  }
}