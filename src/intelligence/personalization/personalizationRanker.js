const objectiveOrder = ['match', 'deepen', 'explore', 'grow', 'surprise']

const existingScore = (candidate) => {
  const raw = candidate?.evaluation?.score ?? candidate?.score ?? candidate?.providerMatchScore ?? 0.5
  const n = Number(raw)
  if (!Number.isFinite(n)) return 0.5
  return n > 1 ? Math.min(1, n / 100) : Math.max(0, Math.min(1, n))
}

export function rankPersonalizedExperiences({ candidates = [], evaluations = [], limit = 3 } = {}) {
  const byId = new Map(evaluations.map((item) => [item.candidateId, item]))
  const scored = candidates.filter(Boolean).map((candidate, index) => {
    const id = candidate.opportunityId || candidate.id
    const semantic = byId.get(id)
    const relevance = semantic?.relevance ?? 0.5
    const confidence = semantic?.confidence ?? 0.4
    const base = existingScore(candidate)
    const score = (relevance * 0.55) + (base * 0.3) + (confidence * 0.15) - (index * 0.002)
    return { candidate, semantic, score }
  }).sort((a, b) => b.score - a.score)

  const selected = []
  const usedObjectives = new Set()
  for (const item of scored) {
    if (selected.length >= limit) break
    const objective = item.semantic?.objective || 'explore'
    if (!usedObjectives.has(objective) || selected.length >= Math.min(2, limit)) {
      selected.push(item)
      usedObjectives.add(objective)
    }
  }
  for (const item of scored) {
    if (selected.length >= limit) break
    if (!selected.includes(item)) selected.push(item)
  }

  return selected.map(({ candidate, semantic, score }, index) => ({
    ...candidate,
    personalization: {
      version: '0.17.2',
      rank: index + 1,
      score: Number(score.toFixed(3)),
      objective: semantic?.objective || objectiveOrder[Math.min(index, objectiveOrder.length - 1)],
      rationale: semantic?.rationale || candidate?.evaluation?.reasons?.[0] || 'Worth trying based on your current growth journey.',
      confidence: semantic?.confidence ?? 0.4,
      understandingRefs: semantic?.understandingRefs || [],
      modelAssisted: Boolean(semantic),
      executionAuthority: 'synapstride',
    },
  }))
}
