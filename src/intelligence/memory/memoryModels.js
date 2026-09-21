export const MEMORY_VERSION = '0.16.0'
export const memoryTypes = Object.freeze({ WORKING: 'working', EPISODE: 'episode', PREFERENCE: 'preference', GUIDANCE_OUTCOME: 'guidance_outcome', GROWTH_CANDIDATE: 'growth_candidate' })

export function createMemoryRecord({ id = null, childId, type, summary, context = {}, evidence = {}, confidence = null, createdAt = null } = {}) {
  if (!childId) throw new Error('Memory requires childId.')
  if (!type) throw new Error('Memory requires type.')
  return { version: MEMORY_VERSION, id: id || `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, childId, type, summary: summary || '', context, evidence, confidence, createdAt: createdAt || new Date().toISOString() }
}
