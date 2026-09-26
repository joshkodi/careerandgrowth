export function buildConversationEvidenceCandidates({ message, messageId } = {}) {
  const text = String(message || '').trim()
  const lower = text.toLowerCase()
  const candidates = []
  const positive = text.match(/\b(?:i love|i loved|i like|i liked|i enjoy|i enjoyed)\s+(.{2,60})/i)
  const negative = text.match(/\b(?:i hate|i hated|i don't like|i dont like|i didn't like|i didnt like)\s+(.{2,60})/i)
  if (positive) candidates.push({ type: 'preference_signal', polarity: 'positive', conceptText: positive[1].replace(/[.!?].*$/, '').trim(), strength: 'weak', basis: 'explicit_first_person_preference', sourceMessageId: messageId })
  if (negative) candidates.push({ type: 'preference_signal', polarity: 'negative', conceptText: negative[1].replace(/[.!?].*$/, '').trim(), strength: 'weak', basis: 'explicit_first_person_preference', sourceMessageId: messageId })
  if (/\b(i finished|i completed)\b/.test(lower)) candidates.push({ type: 'completion_signal', strength: 'weak', basis: 'explicit_first_person_completion_statement', sourceMessageId: messageId })
  return candidates
}
