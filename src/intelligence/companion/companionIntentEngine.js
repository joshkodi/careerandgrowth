import { companionIntentIds, personalizationNeeds } from './companionModels'

const clean = (v) => String(v || '').trim().toLowerCase()
export function inferCompanionIntent(message, immediateContext = {}) {
  const text = clean(message)
  let intent = companionIntentIds.GENERAL
  if (/\b(stuck|confus|don't understand|dont understand|need help|help me)\b/.test(text)) intent = companionIntentIds.HELP
  else if (/\b(explain|what is|what are|what's|whats|why is|why are|why does|how is|how are|how does|how do|tell me about|describe)\b/.test(text)) intent = companionIntentIds.EXPLAIN
  else if (/\b(get started|start this|begin)\b/.test(text)) intent = companionIntentIds.START
  else if (/\b(what should i try|something different|find me|discover|bored)\b/.test(text)) intent = companionIntentIds.DISCOVER
  else if (/\b(i loved|i liked|i enjoyed|i hated|didn't like|didnt like|finished|completed)\b/.test(text)) intent = companionIntentIds.REFLECT
  else if (/\b(plan|what next|next step)\b/.test(text)) intent = companionIntentIds.PLAN
  else if (/\b(continue|resume|open|take me)\b/.test(text)) intent = companionIntentIds.NAVIGATE

  const hasImmediate = Boolean(immediateContext?.experience?.title || immediateContext?.experience?.topic || immediateContext?.surface)
  const personalizationNeed = [companionIntentIds.DISCOVER, companionIntentIds.PLAN, companionIntentIds.REFLECT].includes(intent)
    ? personalizationNeeds.DEEP
    : hasImmediate ? personalizationNeeds.CONTEXTUAL : personalizationNeeds.LIGHT
  return { intent, personalizationNeed }
}
