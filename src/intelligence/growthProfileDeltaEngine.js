// src/intelligence/growthProfileDeltaEngine.js
// SynapStride MVP v0.13 — child-safe Growth Profile change summary.
// Derived presentation only. Never creates evidence or changes scores.

const PROFILE_GROUPS = [
  { key: 'traits', label: 'strength' },
  { key: 'domains', label: 'interest area' },
  { key: 'pathways', label: 'pathway' },
]

function scoreOf(item) {
  const value = Number(item?.score ?? item?.relevance ?? 0)
  return Number.isFinite(value) ? value : 0
}

function confidenceLabel(item) {
  return item?.confidence?.label || item?.confidence?.level || null
}

export function buildGrowthProfileDelta({ beforeProfile, afterProfile, limit = 3 } = {}) {
  if (!afterProfile) return []
  const changes = []
  PROFILE_GROUPS.forEach(({ key, label }) => {
    const before = beforeProfile?.[key] || {}
    const after = afterProfile?.[key] || {}
    Object.values(after).forEach((item) => {
      if (!item?.id) return
      const previous = before[item.id]
      const beforeScore = scoreOf(previous)
      const afterScore = scoreOf(item)
      const scoreDelta = Number((afterScore - beforeScore).toFixed(2))
      const beforeEvidence = Number(previous?.evidenceCount || 0)
      const afterEvidence = Number(item?.evidenceCount || 0)
      const evidenceDelta = afterEvidence - beforeEvidence
      const confidenceChanged = confidenceLabel(item) && confidenceLabel(item) !== confidenceLabel(previous)
      if (scoreDelta <= 0 && evidenceDelta <= 0 && !confidenceChanged) return
      changes.push({
        id: `${key}:${item.id}`,
        group: key,
        kind: label,
        label: item.label || item.id,
        emoji: item.emoji || '✨',
        scoreDelta,
        evidenceDelta,
        confidence: confidenceLabel(item),
        isNew: !previous || beforeScore <= 0,
      })
    })
  })
  return changes.sort((a,b) => {
    if (a.isNew !== b.isNew) return a.isNew ? -1 : 1
    if (b.scoreDelta !== a.scoreDelta) return b.scoreDelta - a.scoreDelta
    return b.evidenceDelta - a.evidenceDelta
  }).slice(0, Math.max(1, limit))
}

export function describeGrowthProfileDelta(changes = []) {
  if (!changes.length) return 'This reflection adds another real experience to the picture SynapStride is building over time.'
  const [first] = changes
  if (first.isNew) return `This gave SynapStride a new clue around ${first.label}. We’ll look for more evidence before treating it as a strong pattern.`
  return `This added another clue around ${first.label}. SynapStride will keep checking whether that pattern holds across different experiences.`
}

export default { buildGrowthProfileDelta, describeGrowthProfileDelta }
