import { childUnderstandingInferenceTypes } from './childUnderstandingModels'

const safeArray = (value) => Array.isArray(value) ? value : []
const clean = (value) => String(value || '').trim()

export function validateChildUnderstandingInterpretation(output = {}, context = {}) {
  const evidenceIds = new Set(safeArray(context?.evidenceIndex).map((item) => String(item?.id || '')).filter(Boolean))
  const rejected = []

  const accepted = safeArray(output?.inferences).flatMap((item, index) => {
    const reasons = []
    const type = clean(item?.type)
    const concept = clean(item?.concept)
    const statement = clean(item?.statement)
    const evidenceRefs = [...new Set(safeArray(item?.evidenceRefs).map(String).filter(Boolean))]
    const validEvidenceRefs = evidenceRefs.filter((id) => evidenceIds.has(id))
    const confidence = Number(item?.confidence)

    if (!childUnderstandingInferenceTypes.includes(type)) reasons.push('unsupported_inference_type')
    if (!concept) reasons.push('missing_concept')
    if (!statement) reasons.push('missing_statement')
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) reasons.push('invalid_confidence')
    if (!validEvidenceRefs.length) reasons.push('missing_valid_evidence_reference')
    if (item?.status !== 'hypothesis') reasons.push('model_output_must_remain_hypothesis')

    if (reasons.length) {
      rejected.push({ index, concept: concept || null, reasons })
      return []
    }

    return [{
      type,
      concept,
      statement,
      confidence,
      evidenceRefs: validEvidenceRefs,
      reasoningBasis: safeArray(item?.reasoningBasis).map(clean).filter(Boolean).slice(0, 6),
      status: 'hypothesis',
      provenance: 'model_inferred',
    }]
  })

  return {
    valid: rejected.length === 0,
    summary: clean(output?.summary),
    accepted,
    rejected,
  }
}
