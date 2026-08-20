// src/intelligence/growthPatternRegistry.js

// ============================================================
// Career & Growth — MVP v0.8 — Phase 8.8A
// Growth Pattern Registry
//
// Small cross-context registry for observational corroboration.
// Academic competency is intentionally excluded.
// ============================================================

export const growthPatternStatuses = Object.freeze({
  OBSERVATION: 'observation',
  EMERGING: 'emerging',
  CORROBORATED: 'corroborated',
  ESTABLISHED: 'established',
  MIXED: 'mixed',
})

export const growthPatternRegistry = Object.freeze([
  {
    id: 'persistence',
    label: 'Persistence',
    emoji: '🧗',
    aliases: [
      'persistence',
      'persistent',
      'perseverance',
      'resilience',
      'sticking with it',
    ],
    learningSignals: [
      'persistence',
      'learning_resolution',
    ],
  },
  {
    id: 'curiosity',
    label: 'Curiosity',
    emoji: '🔎',
    aliases: [
      'curiosity',
      'curious',
      'exploration',
      'exploring',
    ],
    learningSignals: [],
  },
  {
    id: 'problem_solving',
    label: 'Problem Solving',
    emoji: '🧩',
    aliases: [
      'problem solving',
      'problem_solving',
      'problem solver',
      'reasoning',
    ],
    learningSignals: [
      'learning_resolution',
    ],
  },
  {
    id: 'creativity',
    label: 'Creativity',
    emoji: '🎨',
    aliases: [
      'creativity',
      'creative',
      'imagination',
    ],
    learningSignals: [],
  },
  {
    id: 'self_directed_learning',
    label: 'Self-Directed Learning',
    emoji: '🧭',
    aliases: [
      'self directed learning',
      'self-directed learning',
      'independent learning',
      'initiative',
    ],
    learningSignals: [
      'adaptive_help_seeking',
      'resource_fit',
    ],
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    emoji: '🤝',
    aliases: [
      'collaboration',
      'collaborative',
      'teamwork',
      'working with others',
    ],
    learningSignals: [],
  },
  {
    id: 'helping_others',
    label: 'Helping & Others Orientation',
    emoji: '💛',
    aliases: [
      'helping',
      'helping others',
      'empathy',
      'service',
      'others orientation',
    ],
    learningSignals: [],
  },
  {
    id: 'building_making',
    label: 'Building & Making',
    emoji: '🛠️',
    aliases: [
      'building',
      'making',
      'builder',
      'hands on',
      'hands-on',
    ],
    learningSignals: [],
  },
  {
    id: 'communication',
    label: 'Communication',
    emoji: '💬',
    aliases: [
      'communication',
      'communicating',
      'storytelling',
      'explaining',
    ],
    learningSignals: [],
  },
])

export function getGrowthPattern(patternId) {
  return (
    growthPatternRegistry.find(
      (pattern) =>
        pattern.id === patternId
    ) || null
  )
}

export default {
  growthPatternStatuses,
  growthPatternRegistry,
  getGrowthPattern,
}
