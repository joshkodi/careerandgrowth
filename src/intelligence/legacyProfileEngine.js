// ============================================================
// Career & Growth
// MVP v0.3
//
// Legacy Profile Engine
//
// This module contains the v0.2 signal-based profile logic
// that is still used for:
// - top interests
// - top tendencies
// - top motivators
// - adventure recommendations
// - "profile grew" signal comparison
//
// The v0.3 Growth Intelligence engine remains separate.
//
// This is intentionally a refactor only.
// No scoring behavior is changed here.
// ============================================================


// ============================================================
// PERSONA
// ============================================================

export function getPersona(age) {
  const numericAge = Number(age)

  if (numericAge <= 8) {
    return {
      id: 'explorer',
      internalName: 'Explorer',
    }
  }

  if (numericAge <= 12) {
    return {
      id: 'discoverer',
      internalName: 'Discoverer',
    }
  }

  return {
    id: 'pathfinder',
    internalName: 'Pathfinder',
  }
}


// ============================================================
// SIGNAL GROUPS
// ============================================================

export const interestSignals = [
  'science',
  'technology',
  'health',
  'animals',
  'nature',
  'arts',
  'sports',
  'business',
  'people',
  'space',
]


export const tendencySignals = [
  'investigating',
  'problem_solving',
  'building',
  'creating',
  'communicating',
  'organizing',
  'leading',
  'collaborating',
]


export const motivatorSignals = [
  'helping',
  'discovery',
  'achievement',
  'impact',
  'adventure',
]


// ============================================================
// SIGNAL PRESENTATION
// ============================================================

export const signalLabels = {
  science: 'Science',
  technology: 'Technology',
  health: 'Health & Medicine',
  animals: 'Animals',
  nature: 'Nature',
  arts: 'Creativity & Arts',
  sports: 'Sports & Movement',
  business: 'Business & Ideas',
  people: 'People',
  space: 'Space',

  investigating: 'Curious Investigator',
  problem_solving: 'Problem Solver',
  building: 'Builder',
  creating: 'Creative Thinker',
  communicating: 'Communicator',
  organizing: 'Organizer',
  leading: 'Emerging Leader',
  collaborating: 'Team Player',

  helping: 'Helping Others',
  discovery: 'Discovery',
  achievement: 'Achievement',
  impact: 'Making an Impact',
  adventure: 'Adventure',
}


export const signalEmojis = {
  science: '🧪',
  technology: '💻',
  health: '🩺',
  animals: '🐾',
  nature: '🌿',
  arts: '🎨',
  sports: '⚽',
  business: '💡',
  people: '🤝',
  space: '🚀',

  investigating: '🔎',
  problem_solving: '🧩',
  building: '🛠️',
  creating: '✨',
  communicating: '💬',
  organizing: '📋',
  leading: '🧭',
  collaborating: '🤝',

  helping: '❤️',
  discovery: '🔭',
  achievement: '🏆',
  impact: '🌎',
  adventure: '🗺️',
}


// ============================================================
// EXPLORATION CATALOG
// ============================================================

export const explorationCatalog = [
  {
    id: 'space',
    title: 'Space Explorer',
    emoji: '🚀',
    description:
      'Explore how scientists and engineers solve problems beyond Earth.',
    signals: [
      'space',
      'science',
      'technology',
      'discovery',
    ],
  },
  {
    id: 'robotics',
    title: 'Robot Builder',
    emoji: '🤖',
    description:
      'Discover how creativity, engineering, and technology come together to build useful machines.',
    signals: [
      'technology',
      'building',
      'problem_solving',
      'creating',
    ],
  },
  {
    id: 'medicine',
    title: 'Human Body Detective',
    emoji: '🩺',
    description:
      'Explore how doctors and scientists investigate the human body and solve health mysteries.',
    signals: [
      'health',
      'science',
      'investigating',
      'helping',
    ],
  },
  {
    id: 'wildlife',
    title: 'Wildlife Explorer',
    emoji: '🐅',
    description:
      'Learn how people study, care for, and protect animals and their habitats.',
    signals: [
      'animals',
      'nature',
      'discovery',
      'helping',
    ],
  },
  {
    id: 'creative',
    title: 'Creative Story Lab',
    emoji: '🎬',
    description:
      'Explore storytelling, design, video, art, and ways to bring new ideas to life.',
    signals: [
      'arts',
      'creating',
      'communicating',
    ],
  },
  {
    id: 'entrepreneur',
    title: 'Idea Builder',
    emoji: '💡',
    description:
      'Explore how people turn ideas into products, projects, and businesses.',
    signals: [
      'business',
      'leading',
      'creating',
      'achievement',
    ],
  },
  {
    id: 'community',
    title: 'Community Changemaker',
    emoji: '🌎',
    description:
      'Explore ways to solve problems that help people and communities.',
    signals: [
      'people',
      'helping',
      'impact',
      'leading',
    ],
  },
]


// ============================================================
// INTERNAL SIGNAL HELPER
// ============================================================

function addSignals(
  scores,
  signals,
  weight
) {
  if (!signals) {
    return
  }

  signals.forEach((signal) => {
    scores[signal] =
      (scores[signal] || 0) +
      weight
  })
}


// ============================================================
// DISCOVERY SCORING
// ============================================================

export function calculateDiscoveryScores(
  responses
) {
  const scores = {}

  responses.forEach((response) => {
    addSignals(
      scores,
      response.signals,
      1
    )
  })

  return scores
}


// ============================================================
// EXPERIENCE SCORING
// ============================================================

function getEnjoymentWeight(
  enjoyment
) {
  if (enjoyment === 3) {
    return 2
  }

  if (enjoyment === 2) {
    return 1
  }

  if (enjoyment === 1) {
    return 0
  }

  return -1
}


export function calculateExperienceScores(
  responses
) {
  const scores = {}
  const responsesByExploration = {}

  responses.forEach((response) => {
    if (
      !responsesByExploration[
        response.explorationId
      ]
    ) {
      responsesByExploration[
        response.explorationId
      ] = []
    }

    responsesByExploration[
      response.explorationId
    ].push(response)

    if (
      response.type ===
      'challenge'
    ) {
      addSignals(
        scores,
        response.signals,
        1.5
      )
    }

    if (
      response.type ===
      'reflection'
    ) {
      addSignals(
        scores,
        response.signals,
        2
      )
    }
  })

  Object.entries(
    responsesByExploration
  ).forEach(
    ([explorationId, events]) => {
      const enjoymentEvent =
        events.find(
          (event) =>
            event.type ===
            'enjoyment'
        )

      if (!enjoymentEvent) {
        return
      }

      const exploration =
        explorationCatalog.find(
          (item) =>
            item.id ===
            explorationId
        )

      if (!exploration) {
        return
      }

      addSignals(
        scores,
        exploration.signals,
        getEnjoymentWeight(
          enjoymentEvent.enjoyment
        )
      )
    }
  )

  return scores
}


// ============================================================
// SCORE COMBINATION
// ============================================================

export function combineScores(
  ...scoreSets
) {
  const combined = {}

  scoreSets.forEach((scores) => {
    Object.entries(scores).forEach(
      ([signal, score]) => {
        combined[signal] =
          (combined[signal] || 0) +
          score
      }
    )
  })

  return combined
}


// ============================================================
// TOP SIGNALS
// ============================================================

export function getTopSignals(
  scores,
  allowedSignals,
  limit = 3
) {
  return allowedSignals
    .map((signal) => ({
      signal,
      score:
        scores[signal] || 0,
    }))
    .filter(
      (item) =>
        item.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(
      0,
      limit
    )
}


// ============================================================
// LEGACY ADVENTURE RECOMMENDATIONS
// ============================================================

export function getRecommendations(
  scores,
  completedExplorations = [],
  limit = 3
) {
  return explorationCatalog
    .map((exploration) => {
      const score =
        exploration.signals.reduce(
          (total, signal) =>
            total +
            Math.max(
              scores[signal] || 0,
              0
            ),
          0
        )

      return {
        ...exploration,

        score,

        completed:
          completedExplorations.includes(
            exploration.id
          ),
      }
    })
    .filter(
      (exploration) =>
        !exploration.completed
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(
      0,
      limit
    )
}


// ============================================================
// PROFILE GROWTH COMPARISON
// ============================================================

export function getGrowthSignals(
  discoveryScores,
  cumulativeScores,
  limit = 3
) {
  const allSignals = [
    ...interestSignals,
    ...tendencySignals,
    ...motivatorSignals,
  ]

  return allSignals
    .map((signal) => ({
      signal,

      change:
        (cumulativeScores[
          signal
        ] || 0) -
        (discoveryScores[
          signal
        ] || 0),
    }))
    .filter(
      (item) =>
        item.change > 0
    )
    .sort(
      (a, b) =>
        b.change - a.change
    )
    .slice(
      0,
      limit
    )
}