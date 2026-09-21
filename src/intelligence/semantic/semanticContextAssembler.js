import { createSemanticContext } from './semanticContextModels'

export function assembleSemanticContext({
  childId = null, role = 'child', age = null, experience = null, interaction = null,
  companionContext = null, growthContext = null, relevantMemory = [], semanticConcepts = [], taxonomyMappings = [],
} = {}) {
  return createSemanticContext({
    childId, role, age, experience, interaction,
    journey: companionContext,
    relevantMemory,
    growthUnderstanding: growthContext?.understanding || growthContext || null,
    semanticConcepts,
    taxonomyMappings,
  })
}
