export const personalizationVersion = '0.17.2'

export const personalizationModes = ['match', 'deepen', 'explore', 'grow', 'surprise']

export const experiencePersonalizationSchema = {
  type: 'object',
  required: ['evaluations'],
  properties: {
    evaluations: { type: 'array' },
  },
}

export function createBalancedPersonalizationIntent() {
  return {
    mode: 'balanced',
    objectives: [...personalizationModes],
    preserveChildAgency: true,
    avoidFilterBubble: true,
  }
}
