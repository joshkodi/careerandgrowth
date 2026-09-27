import { reflectionDimensions } from './reflectionModels'
const safeArray = (v) => Array.isArray(v) ? v : []
const clean = (v) => String(v || '').trim()
export function validateReflectionCandidates(output = {}, context = {}) {
  const allowedEvidence = new Set(safeArray(context?.hypotheses).flatMap((h) => safeArray(h?.evidenceRefs).map(String)))
  const allowedConcepts = new Set(safeArray(context?.hypotheses).map((h) => clean(h?.concept)).filter(Boolean))
  const rejected = []
  const accepted = safeArray(output?.candidates).slice(0, 4).flatMap((item, index) => {
    const reasons=[]; const statement=clean(item?.statement); const childFacingStatement=clean(item?.childFacingStatement); const concept=clean(item?.concept); const dimension=clean(item?.dimension)
    const confidence=Number(item?.confidence); const evidenceRefs=[...new Set(safeArray(item?.evidenceRefs).map(String))].filter((id)=>allowedEvidence.has(id))
    if (!statement || statement.length > 220) reasons.push('invalid_statement')
    if (!reflectionDimensions.includes(dimension)) reasons.push('invalid_dimension')
    if (!allowedConcepts.has(concept)) reasons.push('unsupported_concept')
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) reasons.push('invalid_confidence')
    if (!evidenceRefs.length) reasons.push('missing_supported_evidence')
    if (reasons.length) { rejected.push({ index, concept: concept || null, reasons }); return [] }
    return [{ id: clean(item?.id) || `reflection-${index}`, dimension, concept, statement, childFacingStatement: childFacingStatement || null, confidence, evidenceRefs, source: 'model_inferred', status: 'candidate' }]
  })
  return { accepted: accepted.slice(0, 2), rejected }
}
