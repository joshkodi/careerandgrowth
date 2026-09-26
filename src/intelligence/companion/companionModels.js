export const companionStageVersion = '0.17.3'

export const companionIntentIds = Object.freeze({
  HELP: 'help', EXPLAIN: 'explain', START: 'start', EXPLORE: 'explore', REFLECT: 'reflect', PLAN: 'plan', DISCOVER: 'discover', ENCOURAGE: 'encourage', NAVIGATE: 'navigate', GENERAL: 'general',
})

export const personalizationNeeds = Object.freeze({ NONE: 'none', LIGHT: 'light', CONTEXTUAL: 'contextual', DEEP: 'deep' })

export const companionConversationSchema = Object.freeze({
  required: ['text', 'intent', 'personalizationNeed', 'actionProposal', 'evidenceCandidates'],
  properties: {
    text: { type: 'string' }, intent: { type: 'string' }, personalizationNeed: { type: 'string' }, checkUnderstanding: { type: 'boolean' },
    actionProposal: { type: 'object' }, evidenceCandidates: { type: 'array' },
  },
})
