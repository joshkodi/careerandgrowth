import { evidenceSourceTypes, isValidSignalId } from '../data/growthTaxonomy'
import { createEvidenceEvent } from './evidenceEngine'

const allowedOutcomes = new Set(['helped', 'still_stuck', 'wants_more'])

export function buildGuidanceOutcomeEvidence({ childId, previousMemory, interpretation, sessionId = null } = {}) {
  if (!childId || !previousMemory || !interpretation) return null
  if (!allowedOutcomes.has(interpretation.outcome)) return null
  if (Number(interpretrationConfidence(interpretation)) < 0.65) return null

  const evidence = (Array.isArray(interpretation.signals) ? interpretation.signals : [])
    .filter((item) => item && isValidSignalId(item.signalId))
    .map((item) => ({ signalId: item.signalId, weight: Math.max(-0.35, Math.min(0.35, Number(item.weight) || 0)) }))
    .filter((item) => item.weight !== 0)

  // A helpful answer is an outcome, but not automatically a growth trait.
  // If there is no defensible canonical growth signal, keep it in Memory only.
  if (!evidence.length) return null

  const event = createEvidenceEvent({
    childId,
    source: {
      type: evidenceSourceTypes.COMPANION_OUTCOME,
      experienceId: previousMemory.context?.topic || null,
      questionId: 'companion_guidance_outcome',
      responseId: interpretation.outcome,
    },
    evidence,
    context: { sessionId },
    metadata: {
      memoryId: previousMemory.id,
      guidanceAction: previousMemory.context?.action || null,
      outcome: interpretation.outcome,
      confidence: interpretation.confidence,
      summary: interpretation.summary || '',
      origin: 'v0.16_adaptive_learning_loop',
    },
  })
  if (!event) return null
  return { ...event, id: `companion_outcome:${previousMemory.id}:${interpretation.outcome}` }
}

function interpretrationConfidence(interpretation) {
  const value = Number(interpretation?.confidence)
  return Number.isFinite(value) ? value : 0
}
