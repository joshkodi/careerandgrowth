import { reasonWithModel } from '../model/modelGateway'
import { localMemoryRepository } from './memoryRepository'
import { memoryTypes } from './memoryModels'

export const guidanceOutcomeSchema = {
  type: 'object',
  required: ['outcome', 'confidence', 'signals'],
  properties: {
    outcome: { enum: ['helped', 'still_stuck', 'wants_more', 'neutral', 'unknown'] },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    signals: { type: 'array' },
    summary: { type: 'string' },
  },
}

const normalize = (text = '') => String(text).trim().toLowerCase()

// Conservative local fallback. It only recognizes explicit outcome language;
// it does not infer personality, ability, or a lasting preference.
function fallbackInterpretation(message = '') {
  const text = normalize(message)
  if (!text) return { outcome: 'unknown', confidence: 0, signals: [], summary: '' }
  if (/\b(that makes sense|i get it|got it|understand now|that helped|makes sense now)\b/.test(text)) {
    return { outcome: 'helped', confidence: 0.9, signals: [], summary: 'Child explicitly indicated the guidance helped.' }
  }
  if (/\b(still (don'?t|do not) (get|understand)|still confused|that didn'?t help|doesn'?t make sense)\b/.test(text)) {
    return { outcome: 'still_stuck', confidence: 0.9, signals: [{ signalId: 'persistence', weight: 0.25 }], summary: 'Child explicitly remained engaged while reporting continued difficulty.' }
  }
  if (/\b(show me another|another example|more practice|try again|one more)\b/.test(text)) {
    return { outcome: 'wants_more', confidence: 0.8, signals: [{ signalId: 'persistence', weight: 0.2 }], summary: 'Child requested another attempt or additional practice.' }
  }
  return { outcome: 'unknown', confidence: 0.2, signals: [], summary: '' }
}

export async function interpretPreviousGuidanceOutcome({ childId, message, semanticContext, modelConfig } = {}) {
  if (!childId || !message) return null
  const recent = await localMemoryRepository.findRelevant({ childId, terms: [], limit: 12 })
  const previous = [...recent].reverse().find((item) => item?.type === memoryTypes.GUIDANCE_OUTCOME && item?.evidence?.outcome === 'guidance_delivered')
  if (!previous) return null

  const fallback = fallbackInterpretation(message)
  try {
    const result = await reasonWithModel({
      task: 'interpret_guidance_outcome',
      context: {
        previousGuidance: {
          summary: previous.summary,
          action: previous.context?.action || null,
          strategy: previous.context?.strategy || {},
          topic: previous.context?.topic || null,
        },
        childResponse: String(message).slice(0, 800),
        currentContext: {
          topic: semanticContext?.experience?.topic || semanticContext?.experience?.title || null,
        },
        rules: [
          'Only classify an outcome supported by the child response.',
          'Do not infer intelligence, ability, diagnosis, or a lasting learning style.',
          'Growth signals must be conservative and use canonical signal IDs.',
        ],
      },
      outputSchema: guidanceOutcomeSchema,
      fallback,
      modelConfig,
    })
    return { previous, interpretation: result?.output || fallback, model: result?.model || null, usedFallback: Boolean(result?.usedFallback) }
  } catch {
    return { previous, interpretation: fallback, model: null, usedFallback: true }
  }
}
