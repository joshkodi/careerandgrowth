import { reasonWithModel } from '../model/modelGateway'
import { recordIntelligenceTrace } from '../observability/intelligenceTrace'
import { companionConversationSchema, companionStageVersion } from './companionModels'
import { inferCompanionIntent } from './companionIntentEngine'
import { buildCompanionContext } from './companionContextBuilder'
import { buildConversationEvidenceCandidates } from './companionEvidenceExtractor'
import { validateCompanionOutput } from './companionValidator'

export async function runChildAwareCompanion({ message, messageId, childUnderstanding, growthContext, immediateContext, conversation = [], fallbackText, fallbackAction = 'none', modelConfig } = {}) {
  const startedAt = Date.now()
  const intentResult = inferCompanionIntent(message, immediateContext)
  const context = buildCompanionContext({ childUnderstanding, growthContext, immediateContext, conversation, message, intentResult })
  const deterministicEvidence = buildConversationEvidenceCandidates({ message, messageId })
  const fallbackOutput = { text: fallbackText || 'Tell me what you want to work through and I’ll help choose a useful next step.', intent: intentResult.intent, personalizationNeed: intentResult.personalizationNeed, checkUnderstanding: true, actionProposal: { action: fallbackAction || 'none' }, evidenceCandidates: deterministicEvidence }
  let result
  try {
    result = await reasonWithModel({ task: 'companion_conversation', context, outputSchema: companionConversationSchema, fallbackOutput }, modelConfig)
  } catch (error) {
    result = { output: fallbackOutput, meta: { provider: 'fallback', model: null, mocked: true, error: error?.message || String(error) } }
  }
  const validated = validateCompanionOutput({ ...result.output, evidenceCandidates: [...deterministicEvidence, ...(result.output?.evidenceCandidates || [])] })
  recordIntelligenceTrace({ type: 'child_aware_companion', version: companionStageVersion, childId: childUnderstanding?.child?.id || null, intent: validated.intent, personalizationNeed: validated.personalizationNeed, proposedAction: validated.actionProposal?.action, evidenceCandidateCount: validated.evidenceCandidates.length, model: result.meta, latencyMs: Date.now() - startedAt })
  return { version: companionStageVersion, context, response: validated, model: result.meta, provenance: { llmReasons: true, synapstrideControlsExecution: true, conversationIsNotAutomaticallyEvidence: true } }
}
