export const SEMANTIC_CONTEXT_VERSION = '0.16.0'

export function createSemanticContext(input = {}) {
  return {
    version: SEMANTIC_CONTEXT_VERSION,
    actor: { childId: input.childId || null, role: input.role || 'child', age: input.age || null },
    experience: input.experience || null,
    interaction: input.interaction || null,
    journey: input.journey || null,
    relevantMemory: Array.isArray(input.relevantMemory) ? input.relevantMemory : [],
    growthUnderstanding: input.growthUnderstanding || null,
    semanticConcepts: Array.isArray(input.semanticConcepts) ? input.semanticConcepts : [],
    taxonomyMappings: Array.isArray(input.taxonomyMappings) ? input.taxonomyMappings : [],
    assembledAt: new Date().toISOString(),
  }
}
