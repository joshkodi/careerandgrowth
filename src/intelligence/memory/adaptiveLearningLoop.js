import { appendEvidenceEvent } from '../../storage/growthStorage'
import { localMemoryRepository } from './memoryRepository'
import { memoryTypes } from './memoryModels'
import { interpretPreviousGuidanceOutcome } from './guidanceOutcomeInterpreter'
import { buildGuidanceOutcomeEvidence } from '../guidanceOutcomeEvidenceAdapter'

export async function observePreviousGuidanceOutcome({ childId, message, semanticContext, modelConfig, sessionId = null } = {}) {
  const observed = await interpretPreviousGuidanceOutcome({ childId, message, semanticContext, modelConfig })
  if (!observed?.previous || !observed?.interpretation) return { observed: false }
  const { previous, interpretation } = observed
  if (interpretation.outcome === 'unknown' || interpretation.outcome === 'neutral') return { observed: false, interpretation }

  const outcomeMemory = await localMemoryRepository.save({
    childId,
    type: memoryTypes.GUIDANCE_OUTCOME,
    summary: interpretation.summary || `${interpretation.outcome} after prior guidance`,
    context: {
      topic: previous.context?.topic || null,
      action: previous.context?.action || null,
      strategy: previous.context?.strategy || {},
      parentMemoryId: previous.id,
    },
    evidence: {
      outcome: interpretation.outcome,
      confidence: interpretation.confidence,
      signals: interpretation.signals || [],
    },
    confidence: interpretation.confidence,
  })

  const evidenceEvent = buildGuidanceOutcomeEvidence({ childId, previousMemory: previous, interpretation, sessionId })
  const evidenceSaved = evidenceEvent ? appendEvidenceEvent(evidenceEvent) : false
  return { observed: true, interpretation, outcomeMemory, evidenceEvent, evidenceSaved, model: observed.model, usedFallback: observed.usedFallback }
}
