const safeArray = (value) => Array.isArray(value) ? value : []

const compactExperience = (experience) => {
  if (!experience || typeof experience !== 'object') return null
  return {
    id: experience.id || null,
    title: experience.title || null,
    topic: experience.topic || null,
    path: experience.path || null,
    status: experience.status || null,
  }
}

const compactIntent = (intent) => {
  if (!intent || typeof intent !== 'object') return null
  return {
    id: intent.id || null,
    type: intent.type || intent.intent || null,
    title: intent.title || intent.label || null,
    createdAt: intent.createdAt || null,
  }
}

const compactPatterns = (growthContext, limit = 6) => {
  const patterns =
    growthContext?.understanding?.profileUnderstanding?.observed?.promotedPatterns ||
    growthContext?.understanding?.patternIntelligence?.established ||
    []

  return safeArray(patterns).slice(0, limit).map((pattern) => ({
    id: pattern?.id || null,
    type: pattern?.type || pattern?.patternType || null,
    label: pattern?.label || pattern?.title || pattern?.name || null,
    confidence: pattern?.confidence ?? null,
  }))
}

const compactCompanionContext = (companionContext) => {
  if (!companionContext || typeof companionContext !== 'object') return null
  const activeItem = companionContext?.activeItem || companionContext?.immediate?.experience || null
  return activeItem ? { activeItem: compactExperience(activeItem) } : null
}

// LLM boundary for semantic analysis. The canonical Growth Intelligence Context
// intentionally remains rich and complete; only a small task-relevant projection
// crosses the model boundary.
export function buildSemanticAnalysisContext({ message, experience, growthContext, companionContext } = {}) {
  return {
    interaction: { message: String(message || '').trim() },
    experience: compactExperience(experience),
    child: {
      age: growthContext?.child?.age ?? null,
    },
    intent: {
      student: compactIntent(growthContext?.intent?.student?.latest),
      parent: compactIntent(growthContext?.intent?.parent?.latest),
    },
    establishedPatterns: compactPatterns(growthContext),
    companion: compactCompanionContext(companionContext),
  }
}

export default buildSemanticAnalysisContext
