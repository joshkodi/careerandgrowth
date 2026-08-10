// src/intelligence/legacyEvidenceAdapter.js

//
// Career & Growth — MVP v0.3
// Legacy Evidence Adapter
//
// PURPOSE
// -------
// MVP v0.2 adventures currently use legacy signals such as:
//
//   technology
//   building
//   investigating
//   creating
//   helping
//
// MVP v0.3 Growth Intelligence uses a more precise canonical
// signal vocabulary:
//
//   curiosity
//   hands_on
//   problem_solving
//   creative_thinking
//   persistence
//
// This adapter allows us to keep the working v0.2 adventures
// unchanged while translating their interactions into the
// v0.3 Evidence Event model.
//
// This is intentionally a TRANSITION layer.
//
// Eventually explorations.js can emit canonical evidence directly,
// at which point this adapter can be retired.
//

//
// -----------------------------------------------------------------------------
// LEGACY SIGNAL → V0.3 SIGNAL MAPPING
// -----------------------------------------------------------------------------
//
// A legacy signal may produce more than one canonical signal.
//
// We intentionally keep these weights moderate because the original
// v0.2 signal was less specific than the new evidence model.
//

const LEGACY_SIGNAL_MAP = {
  //
  // Interests / domains
  //
  // These generally contribute less to behavioral traits.
  // Domain affinity itself comes primarily from event context.
  //

  science: [
    {
      signalId: 'curiosity',
      weight: 0.5,
    },
    {
      signalId: 'analytical_thinking',
      weight: 0.3,
    },
  ],

  technology: [
    {
      signalId: 'curiosity',
      weight: 0.35,
    },
    {
      signalId: 'problem_solving',
      weight: 0.3,
    },
  ],

  health: [
    {
      signalId: 'curiosity',
      weight: 0.35,
    },
    {
      signalId: 'helping',
      weight: 0.25,
    },
  ],

  animals: [
    {
      signalId: 'curiosity',
      weight: 0.3,
    },
    {
      signalId: 'helping',
      weight: 0.25,
    },
  ],

  nature: [
    {
      signalId: 'curiosity',
      weight: 0.4,
    },
  ],

  arts: [
    {
      signalId: 'creative_thinking',
      weight: 0.5,
    },
    {
      signalId: 'creating',
      weight: 0.4,
    },
  ],

  sports: [
    {
      signalId: 'challenge_seeking',
      weight: 0.3,
    },
    {
      signalId: 'persistence',
      weight: 0.25,
    },
  ],

  business: [
    {
      signalId: 'creating',
      weight: 0.3,
    },
    {
      signalId: 'problem_solving',
      weight: 0.25,
    },
  ],

  people: [
    {
      signalId: 'communicating',
      weight: 0.35,
    },
    {
      signalId: 'collaborating',
      weight: 0.3,
    },
  ],

  space: [
    {
      signalId: 'curiosity',
      weight: 0.5,
    },
  ],

  //
  // Behavioral tendencies
  //

  investigating: [
    {
      signalId: 'curiosity',
      weight: 0.8,
    },
    {
      signalId: 'analytical_thinking',
      weight: 0.6,
    },
    {
      signalId: 'experimenting',
      weight: 0.4,
    },
  ],

  problem_solving: [
    {
      signalId: 'problem_solving',
      weight: 1.0,
    },
    {
      signalId: 'analytical_thinking',
      weight: 0.4,
    },
  ],

  building: [
    {
      signalId: 'hands_on',
      weight: 1.0,
    },
    {
      signalId: 'creating',
      weight: 0.5,
    },
    {
      signalId: 'problem_solving',
      weight: 0.4,
    },
  ],

  creating: [
    {
      signalId: 'creating',
      weight: 1.0,
    },
    {
      signalId: 'creative_thinking',
      weight: 0.8,
    },
  ],

  communicating: [
    {
      signalId: 'communicating',
      weight: 1.0,
    },
  ],

  organizing: [
    {
      signalId: 'leading',
      weight: 0.5,
    },
    {
      signalId: 'analytical_thinking',
      weight: 0.35,
    },
  ],

  leading: [
    {
      signalId: 'leading',
      weight: 1.0,
    },
    {
      signalId: 'communicating',
      weight: 0.4,
    },
  ],

  collaborating: [
    {
      signalId: 'collaborating',
      weight: 1.0,
    },
    {
      signalId: 'communicating',
      weight: 0.3,
    },
  ],

  //
  // Motivators
  //

  helping: [
    {
      signalId: 'helping',
      weight: 1.0,
    },
  ],

  discovery: [
    {
      signalId: 'curiosity',
      weight: 0.9,
    },
    {
      signalId: 'experimenting',
      weight: 0.3,
    },
  ],

  achievement: [
    {
      signalId: 'challenge_seeking',
      weight: 0.7,
    },
    {
      signalId: 'persistence',
      weight: 0.5,
    },
  ],

  impact: [
    {
      signalId: 'helping',
      weight: 0.6,
    },
    {
      signalId: 'leading',
      weight: 0.3,
    },
  ],

  adventure: [
    {
      signalId: 'challenge_seeking',
      weight: 0.5,
    },
    {
      signalId: 'curiosity',
      weight: 0.4,
    },
  ],
}

//
// -----------------------------------------------------------------------------
// DOMAIN MAP
// -----------------------------------------------------------------------------
//
// This maps today's v0.2 exploration IDs into our new Level-3 domains.
//
// Robot Builder is the only one we're wiring end-to-end initially,
// but defining the map now makes later expansion straightforward.
//

const EXPLORATION_DOMAIN_MAP = {
  robotics: 'technology_robotics',

  medicine: 'health_human_body',

  wildlife: 'nature_environment',

  creative: 'creative_arts_storytelling',

  entrepreneur: 'business_entrepreneurship',

  community: 'people_society',

  space: 'science_discovery',
}

//
// -----------------------------------------------------------------------------
// UTILITIES
// -----------------------------------------------------------------------------

function clampWeight(weight) {
  return Math.max(
    -1,
    Math.min(1, Number(weight) || 0)
  )
}

//
// If several legacy signals produce the same canonical signal,
// combine them rather than creating duplicate entries.
//
// Example:
//
// building
//   → problem_solving +0.4
//
// problem_solving
//   → problem_solving +1.0
//
// becomes:
//
// problem_solving +1.0
//
// because evidence-event weights are capped at 1.0.
//

function combineEvidence(evidence = []) {
  const totals = {}

  evidence.forEach((item) => {
    if (!item?.signalId) {
      return
    }

    totals[item.signalId] =
      (totals[item.signalId] || 0) +
      Number(item.weight || 0)
  })

  return Object.entries(totals)
    .map(([signalId, weight]) => ({
      signalId,
      weight: clampWeight(weight),
    }))
    .filter((item) => item.weight !== 0)
}

//
// -----------------------------------------------------------------------------
// LEGACY SIGNAL CONVERSION
// -----------------------------------------------------------------------------

export function legacySignalsToEvidence(
  legacySignals = [],
  multiplier = 1
) {
  if (!Array.isArray(legacySignals)) {
    return []
  }

  const evidence = []

  legacySignals.forEach((legacySignal) => {
    const mappings =
      LEGACY_SIGNAL_MAP[legacySignal]

    if (!mappings) {
      return
    }

    mappings.forEach((mapping) => {
      evidence.push({
        signalId: mapping.signalId,

        weight:
          mapping.weight *
          multiplier,
      })
    })
  })

  return combineEvidence(evidence)
}

//
// -----------------------------------------------------------------------------
// DOMAIN LOOKUP
// -----------------------------------------------------------------------------

export function getExplorationDomainId(
  explorationId
) {
  return (
    EXPLORATION_DOMAIN_MAP[
      explorationId
    ] || null
  )
}

//
// -----------------------------------------------------------------------------
// CHALLENGE EVIDENCE
// -----------------------------------------------------------------------------
//
// Challenge choices are meaningful behavioral observations,
// so they receive full-strength conversion.
//

export function getChallengeEvidence(
  answer
) {
  return legacySignalsToEvidence(
    answer?.signals || [],
    1
  )
}

//
// -----------------------------------------------------------------------------
// FAVORITE-PART / REFLECTION EVIDENCE
// -----------------------------------------------------------------------------
//
// A child saying what they enjoyed is particularly useful.
// Slightly increase the strength of the associated evidence,
// while still remaining within the -1 → +1 event limits.
//

export function getReflectionEvidence(
  answer
) {
  return legacySignalsToEvidence(
    answer?.signals || [],
    1.1
  )
}

//
// -----------------------------------------------------------------------------
// ENJOYMENT EVIDENCE
// -----------------------------------------------------------------------------
//
// Your current v0.2 enjoyment scale is:
//
// 3 → strong enjoyment
// 2 → moderate enjoyment
// 1 → neutral / mild
// 0 → did not enjoy
//
// We do NOT interpret "didn't enjoy" as strong negative evidence
// against every trait.
//
// Instead it primarily affects:
//
// enjoyment
//
// and modestly affects the domain-level context.
//

export function getEnjoymentEvidence(
  enjoymentValue
) {
  switch (enjoymentValue) {
    case 3:
      return [
        {
          signalId: 'enjoyment',
          weight: 1.0,
        },
        {
          signalId: 'challenge_seeking',
          weight: 0.35,
        },
      ]

    case 2:
      return [
        {
          signalId: 'enjoyment',
          weight: 0.65,
        },
      ]

    case 1:
      return [
        {
          signalId: 'enjoyment',
          weight: 0.2,
        },
      ]

    case 0:
      return [
        {
          signalId: 'enjoyment',
          weight: -0.5,
        },
      ]

    default:
      return []
  }
}

//
// -----------------------------------------------------------------------------
// COMPLETION EVIDENCE
// -----------------------------------------------------------------------------
//
// Finishing an adventure gives us a small amount of persistence
// evidence, but completion alone should never create a strong trait.
//

export function getCompletionEvidence() {
  return [
    {
      signalId: 'persistence',
      weight: 0.2,
    },
  ]
}

//
// -----------------------------------------------------------------------------
// DEBUG / DEVELOPMENT
// -----------------------------------------------------------------------------

export function describeLegacyMapping(
  legacySignals = []
) {
  return {
    legacySignals,

    canonicalEvidence:
      legacySignalsToEvidence(
        legacySignals
      ),
  }
}

export {
  LEGACY_SIGNAL_MAP,
  EXPLORATION_DOMAIN_MAP,
}