import { reasonWithModel } from './model/modelGateway'
const titleOf = (ctx) => ctx?.experience?.title || ctx?.experience?.topic || ctx?.journey?.activeItem?.title || null
export const companionResponseSchema = Object.freeze({ required: ['text'], properties: { text: { type: 'string' }, checkUnderstanding: { type: 'boolean' } } })

export function buildContextualCompanionResponse({ decision, semanticContext, legacyGuidance } = {}) {
  const title = titleOf(semanticContext); const action = decision?.action || legacyGuidance?.action || 'explain'; const lead = title ? `I know you’re working on “${title}.” ` : ''
  const copy = { explain: `${lead}Tell me which part feels unclear, and I’ll explain it from there without making you start over.`, give_hint: `${lead}I’ll give you one small clue first so you can keep solving it yourself.`, show_example: `${lead}Let’s use a similar example so you can see how the idea works without doing your work for you.`, guided_practice: `${lead}Let’s try one short practice step together, then you can take the next one.`, show_resource: `${lead}I can look for a focused resource that matches what you’re working on.`, continue_work: title ? `You were working on “${title}.” I remember the context, so we can continue from there.` : 'We can continue from where you left off.' }
  return { text: copy[action] || legacyGuidance?.text || 'Tell me what you want to work through and I’ll help choose a useful next step.', contextual: Boolean(title) }
}

export async function generateContextualCompanionResponse({ decision, semanticContext, legacyGuidance, modelConfig = {} } = {}) {
  const fallback = buildContextualCompanionResponse({ decision, semanticContext, legacyGuidance })
  try {
    const result = await reasonWithModel({ task: 'companion_response', context: { decision, semanticContext }, outputSchema: companionResponseSchema, fallbackOutput: { text: fallback.text, checkUnderstanding: true } }, modelConfig)
    return { text: result.output.text, contextual: fallback.contextual, checkUnderstanding: result.output.checkUnderstanding !== false, model: result.meta }
  } catch (error) { return { ...fallback, checkUnderstanding: true, error: error?.message || String(error) } }
}
