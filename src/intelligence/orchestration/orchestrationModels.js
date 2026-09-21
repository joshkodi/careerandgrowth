export const ORCHESTRATION_VERSION = '0.16.3b'
export const allowedGuidanceActions = Object.freeze(['explain','ask_question','give_hint','show_example','guided_practice','show_resource','continue_work','explore','profile'])
export const guidanceDecisionSchema = Object.freeze({
  required: ['action', 'reason'], properties: {
    action: { type: 'string', enum: allowedGuidanceActions }, reason: { type: 'string' }, confidence: { type: 'number', minimum: 0, maximum: 1 },
    strategy: { type: 'object' }, resourceRequired: { type: 'boolean' }, memoryCandidates: { type: 'array' }, growthSignalCandidates: { type: 'array' },
  },
})
export function normalizeGuidanceDecision(value = {}) { const action = allowedGuidanceActions.includes(value.action) ? value.action : 'explain'; return { version: ORCHESTRATION_VERSION, action, reason: value.reason || 'Provide useful contextual guidance.', confidence: Number.isFinite(value.confidence) ? Math.max(0, Math.min(1, value.confidence)) : null, strategy: value.strategy || {}, resourceRequired: Boolean(value.resourceRequired), memoryCandidates: Array.isArray(value.memoryCandidates) ? value.memoryCandidates : [], growthSignalCandidates: Array.isArray(value.growthSignalCandidates) ? value.growthSignalCandidates : [] } }
