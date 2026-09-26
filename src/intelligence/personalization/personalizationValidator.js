const clamp = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.max(0, Math.min(1, parsed)) : fallback
}

const allowedObjectives = new Set(['match', 'deepen', 'explore', 'grow', 'surprise'])

export function validatePersonalizationEvaluations({ evaluations = [], candidates = [], childUnderstanding } = {}) {
  const candidateIds = new Set(candidates.map((item) => item?.opportunityId || item?.id).filter(Boolean))
  const inferenceIds = new Set((childUnderstanding?.modelInferred || []).flatMap((item) => [item?.id, item?.inferenceId]).filter(Boolean))
  const accepted = []
  const rejected = []

  for (const evaluation of evaluations || []) {
    if (!candidateIds.has(evaluation?.candidateId)) {
      rejected.push({ ...evaluation, rejectionReason: 'unknown_candidate' })
      continue
    }
    const refs = (evaluation?.understandingRefs || []).filter((id) => inferenceIds.has(id))
    accepted.push({
      candidateId: evaluation.candidateId,
      relevance: clamp(evaluation.relevance, 0.5),
      confidence: clamp(evaluation.confidence, 0.4),
      objective: allowedObjectives.has(evaluation.objective) ? evaluation.objective : 'explore',
      rationale: String(evaluation.rationale || '').trim() || 'Worth exploring based on the child’s current SynapStride context.',
      understandingRefs: refs,
    })
  }

  return { accepted, rejected }
}
