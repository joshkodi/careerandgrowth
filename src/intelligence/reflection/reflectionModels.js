export const reflectionStageVersion = '0.17.0-stage4'
export const reflectionResponses = Object.freeze(['confirmed', 'maybe', 'rejected'])
export const reflectionDimensions = Object.freeze(['interest', 'strength', 'learning_preference', 'growth', 'exploration'])

const candidateSchema = {
  type: 'object',
  required: ['id', 'dimension', 'statement', 'confidence', 'evidenceRefs', 'source'],
  properties: {
    id: { type: 'string' }, dimension: { type: 'string', enum: reflectionDimensions }, statement: { type: 'string' },
    confidence: { type: 'number', minimum: 0, maximum: 1 }, evidenceRefs: { type: 'array', items: { type: 'string' } },
    source: { type: 'string', enum: ['model_inferred'] }, concept: { type: 'string' },
  },
}
export const reflectionOutputSchema = { type: 'object', required: ['candidates'], properties: { candidates: { type: 'array', items: candidateSchema } } }
