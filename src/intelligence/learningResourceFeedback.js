// src/intelligence/learningResourceFeedback.js

// ============================================================
// Career & Growth — MVP v0.8 — Phase 8.6B
// Learning Resource Feedback
//
// Feedback is stored with the learning support request.
// It is NOT converted to Growth Intelligence evidence yet.
// ============================================================

export const learningResourceFeedbackTypes =
  Object.freeze({
    HELPFUL: 'helpful',
    NOT_USEFUL: 'not_useful',
  })

export function createLearningResourceFeedback({
  candidateId,
  feedbackType,
} = {}) {
  if (!candidateId || !feedbackType) return null

  return {
    candidateId,
    feedbackType,
    updatedAt: new Date().toISOString(),
  }
}


export const learningSupportOutcomeTypes =
  Object.freeze({
    RESOLVED: 'resolved',
    MORE_HELP: 'more_help',
    CONTINUE_WORK: 'continue_work',
  })

export function createLearningSupportOutcome({
  outcomeType,
} = {}) {
  if (!outcomeType) return null

  return {
    outcomeType,
    completedAt: new Date().toISOString(),
  }
}
