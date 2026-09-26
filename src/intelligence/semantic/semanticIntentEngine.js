import { reasonWithModel } from '../model/modelGateway'
import { buildSemanticAnalysisContext } from './semanticAnalysisContextBuilder'

export const semanticAnalysisSchema = Object.freeze({
  required: ['intent', 'confidence', 'concepts', 'taxonomyCandidates'],
  properties: {
    intent: { type: 'string' }, confidence: { type: 'number', minimum: 0, maximum: 1 },
    concepts: { type: 'array', items: { type: 'string' } },
    taxonomyCandidates: { type: 'array', items: { type: 'object', required: ['taxonomyId', 'confidence'], properties: { taxonomyId: { type: 'string' }, confidence: { type: 'number', minimum: 0, maximum: 1 } } } },
  },
})

export function inferLocalSemanticIntent({ message, experience = null } = {}) {
  const text = String(message || '').trim().toLowerCase(); const hasContext = Boolean(experience?.title || experience?.topic)
  let intent = hasContext ? 'contextual_question' : 'general_question'
  if (/\b(stuck|confus|don.?t get|don.?t understand|help)\b/.test(text)) intent = 'learning_help'
  else if (/\b(example|show me)\b/.test(text)) intent = 'example_request'
  else if (/\b(hint|clue)\b/.test(text)) intent = 'hint_request'
  else if (/\b(practice|quiz|try one)\b/.test(text)) intent = 'practice_request'
  else if (/\b(resource|video|website|source)\b/.test(text)) intent = 'resource_request'
  else if (/\b(continue|resume|keep going)\b/.test(text)) intent = 'continue_request'
  return { intent, confidence: 0.55, concepts: [experience?.topic, experience?.title].filter(Boolean), taxonomyCandidates: [], source: 'local_semantic_fallback' }
}

export async function inferSemanticIntent({ message, experience = null, growthContext = null, companionContext = null, modelConfig = {} } = {}) {
  const fallback = inferLocalSemanticIntent({ message, experience })
  try {
    const context = buildSemanticAnalysisContext({ message, experience, growthContext, companionContext })
    const result = await reasonWithModel({ task: 'semantic_analysis', context, outputSchema: semanticAnalysisSchema, fallbackOutput: fallback }, modelConfig)
    return { ...result.output, source: result.meta.mocked ? 'model_mock' : 'model_semantic', model: result.meta }
  } catch (error) { return { ...fallback, error: error?.message || String(error) } }
}
