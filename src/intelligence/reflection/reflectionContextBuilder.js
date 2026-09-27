const safeArray = (v) => Array.isArray(v) ? v : []
export function buildReflectionContext({ childUnderstanding, outcomes = [] } = {}) {
  const rejectedConcepts = new Set(safeArray(outcomes).filter((o) => o?.response === 'rejected').map((o) => o?.concept).filter(Boolean))
  const recentConcepts = new Set(safeArray(outcomes).slice(-20).map((o) => o?.concept).filter(Boolean))
  return {
    version: '0.17.0-stage4',
    purpose: 'Create gentle, child-correctable reflections grounded only in validated model hypotheses.',
    child: childUnderstanding?.child || {},
    hypotheses: safeArray(childUnderstanding?.modelInferred).filter((h) => !rejectedConcepts.has(h?.concept) && !recentConcepts.has(h?.concept)).slice(0, 8),
    constraints: { childKeepsAgency: true, noFixedIdentityLabels: true, evidenceRequired: true, maxCandidates: 2 },
  }
}
