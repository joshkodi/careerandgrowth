// src/intelligence/researchContextInspector.js

import {
  createChildContext,
} from './experienceResearchModels'

const asCollection = (value) => {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') return Object.values(value)
  return []
}

const summarizeGrowthCollection = (collection, limit = 8) =>
  asCollection(collection)
    .filter(Boolean)
    .map((item) => ({
      id: item.id || item.signalId || null,
      label: item.label || item.id || item.signalId || '',
      score: Number(item.score ?? item.netStrength ?? 0),
      confidence: item.confidence?.score ?? null,
    }))
    .filter((item) => item.id && item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

const summarizeIntents = (intents = []) =>
  intents.filter(Boolean).map((intent) => ({
    id: intent.id || null,
    status: intent.status || null,
    text:
      intent.text ||
      intent.title ||
      intent.label ||
      '',
  }))

const summarizeJourney = (journeyItems = []) =>
  journeyItems.filter(Boolean).map((item) => ({
    id: item.id || null,
    experienceId:
      item.experienceId ||
      item.experienceCandidateId ||
      null,
    title: item.title || '',
    status: item.status || null,
  }))

export const buildResearchContextSummary = ({
  childProfile = {},
  growthProfile = null,
  studentIntents = [],
  parentIntents = [],
  journeyItems = [],
  declaredInterests = [],
  experiencePreferences = {},
  evidenceEventCount = 0,
} = {}) => {
  const childContext = createChildContext({
    childProfile,
    growthProfile,
    studentIntents,
    parentIntents,
    journeyItems,
    declaredInterests,
    experiencePreferences,
  })

  const signals = summarizeGrowthCollection(growthProfile?.signals)
  const traits = summarizeGrowthCollection(growthProfile?.traits)
  const domains = summarizeGrowthCollection(growthProfile?.domains)
  const pathways = summarizeGrowthCollection(growthProfile?.pathways)

  const activeStudentIntents = studentIntents.filter(
    (intent) => intent?.status === 'active' && intent?.text
  )

  const activeParentIntents = parentIntents.filter(
    (intent) => intent?.status === 'active' && intent?.text
  )

  const available = []
  const missing = []

  const checks = [
    ['age', Number.isFinite(Number(childContext.age))],
    ['grade', Boolean(childContext.grade)],
    ['growth_evidence', Number(evidenceEventCount) > 0],
    ['growth_signals', signals.length > 0],
    ['growth_traits', traits.length > 0],
    ['growth_domains', domains.length > 0],
    ['growth_pathways', pathways.length > 0],
    ['student_intent', activeStudentIntents.length > 0],
    ['parent_goals', activeParentIntents.length > 0],
    ['journey_history', journeyItems.length > 0],
  ]

  checks.forEach(([name, present]) => {
    ;(present ? available : missing).push(name)
  })

  const hasPersonalization =
    signals.length > 0 ||
    traits.length > 0 ||
    domains.length > 0 ||
    activeStudentIntents.length > 0 ||
    activeParentIntents.length > 0

  return {
    child: {
      name: childContext.name,
      age: childContext.age,
      ageBracket: childContext.ageBracket,
      grade: childContext.grade,
    },

    evidence: {
      eventCount: Number(evidenceEventCount) || 0,
      profileGeneratedAt: growthProfile?.generatedAt || null,
      profileChildId: growthProfile?.childId || null,
    },

    growthIntelligence: {
      signals,
      traits,
      domains,
      pathways,
    },

    studentIntents: summarizeIntents(studentIntents),
    parentGoals: summarizeIntents(parentIntents),
    journey: summarizeJourney(journeyItems),

    declaredInterests: childContext.declaredInterests,
    experiencePreferences: childContext.experiencePreferences,

    readiness: {
      readyForEligibility: Number.isFinite(Number(childContext.age)),
      hasGrowthIntelligence: Boolean(
        signals.length ||
        traits.length ||
        domains.length ||
        pathways.length
      ),
      hasIntentContext: Boolean(
        activeStudentIntents.length ||
        activeParentIntents.length
      ),
      hasJourneyContext: journeyItems.length > 0,
      hasPersonalization,
      mode: hasPersonalization ? 'personalized' : 'cold_start',
      available,
      missing,
    },
  }
}

export const inspectResearchContext = (options = {}) => {
  const summary = buildResearchContextSummary(options)

  console.group('🧠 Career & Growth — Research Context')
  console.log('Child Context:', summary.child)
  console.log('Evidence:', summary.evidence)
  console.log('Growth Signals:', summary.growthIntelligence.signals)
  console.log('Growth Traits:', summary.growthIntelligence.traits)
  console.log('Growth Domains:', summary.growthIntelligence.domains)
  console.log('Growth Pathways:', summary.growthIntelligence.pathways)
  console.log('Student Intent:', summary.studentIntents)
  console.log('Parent Goals:', summary.parentGoals)
  console.log('Journey History:', summary.journey)
  console.log('Declared Interests:', summary.declaredInterests)
  console.log('Experience Preferences:', summary.experiencePreferences)
  console.log('🔎 Context Readiness:', summary.readiness)
  console.groupEnd()

  return summary
}

export default {
  buildResearchContextSummary,
  inspectResearchContext,
}
