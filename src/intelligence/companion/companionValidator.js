const allowedActions = new Set(['none', 'continue_work', 'open_school', 'open_school_help', 'explore', 'profile', 'try_recommendation', 'discover_experiences'])
export function validateCompanionOutput(output = {}) {
  const text = String(output?.text || '').trim()
  const proposal = output?.actionProposal && typeof output.actionProposal === 'object' ? output.actionProposal : { action: 'none' }
  const action = allowedActions.has(proposal.action) ? proposal.action : 'none'
  const evidenceCandidates = (Array.isArray(output?.evidenceCandidates) ? output.evidenceCandidates : []).filter((item) => item && typeof item === 'object' && item.sourceMessageId && item.basis)
  return { ...output, text: text || 'Tell me a little more about what you need and I’ll help from there.', actionProposal: { ...proposal, action }, evidenceCandidates }
}
