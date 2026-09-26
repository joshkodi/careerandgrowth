export const childUnderstandingVersion = '0.17.0-stage1'

export const childUnderstandingInferenceTypes = Object.freeze([
  'emerging_interest',
  'strength',
  'preference',
  'learning_characteristic',
  'growth_opportunity',
  'exploration_hypothesis',
])

const inferenceSchema = {
  type: 'object',
  required: ['type', 'concept', 'statement', 'confidence', 'evidenceRefs', 'status'],
  properties: {
    type: { type: 'string', enum: childUnderstandingInferenceTypes },
    concept: { type: 'string' },
    statement: { type: 'string' },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    evidenceRefs: { type: 'array', items: { type: 'string' } },
    reasoningBasis: { type: 'array', items: { type: 'string' } },
    status: { type: 'string', enum: ['hypothesis'] },
  },
}

export const childUnderstandingOutputSchema = {
  type: 'object',
  required: ['summary', 'inferences'],
  properties: {
    summary: { type: 'string' },
    inferences: { type: 'array', items: inferenceSchema },
  },
}

export function emptyChildUnderstandingOutput() {
  return {
    summary: 'There is not enough supported context yet to form model-backed hypotheses.',
    inferences: [],
  }
}
