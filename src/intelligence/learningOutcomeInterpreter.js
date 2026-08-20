// src/intelligence/learningOutcomeInterpreter.js

// ============================================================
// Career & Growth — MVP v0.8 — Phase 8.7B
// Learning Outcome Interpreter
//
// Conservative by design:
// - Help requests are history, never weakness evidence.
// - Resource feedback is history.
// - A resolved help cycle can create a weak positive
//   self-regulated-learning signal.
// - Academic strength/development conclusions require future
//   repeated/corroborated evidence and are NOT scored here.
// ============================================================

export const learningSignalTypes = Object.freeze({
  ADAPTIVE_HELP_SEEKING: 'adaptive_help_seeking',
  PERSISTENCE: 'persistence',
  RESOURCE_FIT: 'resource_fit',
  LEARNING_RESOLUTION: 'learning_resolution',
})

export const learningEvidenceEligibility = Object.freeze({
  HISTORY_ONLY: 'history_only',
  WEAK_SIGNAL: 'weak_signal',
  GROWTH_CANDIDATE: 'growth_candidate',
})

const now = () => new Date().toISOString()

export function buildLearningHistoryEvent({
  journeyItem,
  eventType,
  payload = {},
} = {}) {
  if (!journeyItem?.id || !eventType) return null

  return {
    id: `learning_history_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    journeyId: journeyItem.id,
    path: journeyItem.path || 'school_learning',
    subject: journeyItem.subject || null,
    topic: journeyItem.topic || journeyItem.title || null,
    eventType,
    payload,
    recordedAt: now(),
  }
}

export function interpretLearningSupportOutcome({
  journeyItem,
  outcomeType,
} = {}) {
  const request = journeyItem?.learningSupportRequest || {}
  const feedback = Object.values(request.resourceFeedback || {})
  const helpfulCount = feedback.filter((item) => item?.feedbackType === 'helpful').length
  const notUsefulCount = feedback.filter((item) => item?.feedbackType === 'not_useful').length

  const history = buildLearningHistoryEvent({
    journeyItem,
    eventType: 'learning_support_outcome',
    payload: {
      helpMode: request.helpMode || null,
      learningIntent: request.learningIntent || null,
      outcomeType,
      helpfulResourceCount: helpfulCount,
      notUsefulResourceCount: notUsefulCount,
    },
  })

  const signals = []

  if (request.learningIntent) {
    signals.push({
      type: learningSignalTypes.ADAPTIVE_HELP_SEEKING,
      eligibility: learningEvidenceEligibility.WEAK_SIGNAL,
      direction: 'positive',
      strength: 0.25,
      rationale: 'The student identified a kind of help that could support continued learning.',
    })
  }

  if (outcomeType === 'resolved') {
    signals.push({
      type: learningSignalTypes.LEARNING_RESOLUTION,
      eligibility: learningEvidenceEligibility.WEAK_SIGNAL,
      direction: 'positive',
      strength: 0.35,
      rationale: 'The student reported that the support cycle resolved the immediate learning need.',
    })

    if (helpfulCount > 0) {
      signals.push({
        type: learningSignalTypes.RESOURCE_FIT,
        eligibility: learningEvidenceEligibility.HISTORY_ONLY,
        direction: 'positive',
        strength: 0.2,
        rationale: 'At least one recommended resource was reported as helpful.',
      })
    }
  }

  if (outcomeType === 'more_help') {
    signals.push({
      type: learningSignalTypes.PERSISTENCE,
      eligibility: learningEvidenceEligibility.WEAK_SIGNAL,
      direction: 'positive',
      strength: 0.2,
      rationale: 'The student chose to continue seeking support rather than treating difficulty as task completion.',
    })
  }

  return {
    history,
    signals,
    academicInference: {
      strength: null,
      developmentArea: null,
      eligibility: learningEvidenceEligibility.HISTORY_ONLY,
      rationale:
        'A single help cycle is insufficient to infer an academic strength or development area.',
    },
    interpretedAt: now(),
  }
}

export default {
  learningSignalTypes,
  learningEvidenceEligibility,
  buildLearningHistoryEvent,
  interpretLearningSupportOutcome,
}
