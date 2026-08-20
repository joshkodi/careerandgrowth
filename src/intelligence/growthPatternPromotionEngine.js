// src/intelligence/growthPatternPromotionEngine.js

// ============================================================
// Career & Growth — MVP v0.8 — Phase 8.8C
// Controlled Pattern Promotion
//
// Purpose:
// Decide whether an observational pattern is eligible to become
// a profile-level promoted pattern.
//
// IMPORTANT:
// - This does NOT modify existing Growth Profile scores.
// - Promotion decisions are derived, traceable, and reversible.
// - Mixed evidence is never auto-promoted.
// - School-only repetition cannot independently promote a pattern.
// ============================================================


export const promotionDecisionStatuses =
  Object.freeze({
    NOT_ELIGIBLE:
      'not_eligible',

    ELIGIBLE:
      'eligible',

    PROMOTED:
      'promoted',

    HELD_FOR_REVIEW:
      'held_for_review',
  })


const getIndependentSourceCount =
  (pattern) =>
    (
      pattern?.sources ||
      []
    )
      .filter(
        (source) =>
          source !==
          'system_completion'
      )
      .length


const hasSchoolOnlyEvidence =
  (pattern) => {
    const sources =
      pattern?.sources ||
      []

    return (
      sources.length > 0 &&
      sources.every(
        (source) =>
          source ===
          'school_learning_behavior'
      )
    )
  }


export function evaluatePatternPromotion(
  pattern
) {
  if (!pattern) {
    return null
  }

  const independentSourceCount =
    getIndependentSourceCount(
      pattern
    )

  const reasons = []
  const blockers = []

  if (
    pattern.status ===
    'mixed'
  ) {
    blockers.push(
      'Pattern has contradictory evidence and requires review.'
    )
  }

  if (
    pattern.status !==
      'corroborated' &&
    pattern.status !==
      'established'
  ) {
    blockers.push(
      'Pattern has not reached corroborated or established status.'
    )
  }

  if (
    pattern.sourceDiversity < 2
  ) {
    blockers.push(
      'Pattern needs evidence from at least two source types.'
    )
  }

  if (
    pattern.contextDiversity < 2
  ) {
    blockers.push(
      'Pattern needs evidence from at least two contexts.'
    )
  }

  if (
    independentSourceCount < 2
  ) {
    blockers.push(
      'Pattern needs at least two independent non-system evidence sources.'
    )
  }

  if (
    hasSchoolOnlyEvidence(
      pattern
    )
  ) {
    blockers.push(
      'School-only repetition cannot promote a holistic growth pattern.'
    )
  }

  if (
    pattern.confidence < 0.55
  ) {
    blockers.push(
      'Pattern confidence is below the minimum promotion threshold.'
    )
  }

  if (
    pattern.negativeCount > 0
  ) {
    blockers.push(
      'Negative/contradictory evidence is present.'
    )
  }

  if (
    pattern.status ===
    'corroborated'
  ) {
    reasons.push(
      'Pattern is corroborated across multiple independent contexts.'
    )
  }

  if (
    pattern.status ===
    'established'
  ) {
    reasons.push(
      'Pattern is established across diverse evidence sources and contexts.'
    )
  }

  if (
    pattern.sourceDiversity >= 2
  ) {
    reasons.push(
      `Evidence spans ${pattern.sourceDiversity} source types.`
    )
  }

  if (
    pattern.contextDiversity >= 2
  ) {
    reasons.push(
      `Evidence spans ${pattern.contextDiversity} contexts.`
    )
  }

  const eligible =
    blockers.length === 0

  return {
    patternId:
      pattern.id,

    patternLabel:
      pattern.label,

    status:
      eligible
        ? promotionDecisionStatuses
            .ELIGIBLE
        : pattern.status ===
            'mixed'
          ? promotionDecisionStatuses
              .HELD_FOR_REVIEW
          : promotionDecisionStatuses
              .NOT_ELIGIBLE,

    eligible,

    reasons,

    blockers,

    evidenceCount:
      pattern.evidenceCount,

    sourceDiversity:
      pattern.sourceDiversity,

    contextDiversity:
      pattern.contextDiversity,

    independentSourceCount,

    confidence:
      pattern.confidence,

    evaluatedAt:
      new Date().toISOString(),
  }
}


export function buildPatternPromotionRegistry(
  patternIntelligence
) {
  const patterns =
    patternIntelligence
      ?.patterns ||
    []

  const decisions =
    patterns
      .map(
        evaluatePatternPromotion
      )
      .filter(Boolean)

  return {
    version:
      '0.8.8C',

    mode:
      'controlled_promotion',

    decisions,

    eligiblePatterns:
      decisions.filter(
        (decision) =>
          decision.eligible
      ),

    heldPatterns:
      decisions.filter(
        (decision) =>
          decision.status ===
          promotionDecisionStatuses
            .HELD_FOR_REVIEW
      ),

    generatedAt:
      new Date().toISOString(),
  }
}


export default {
  promotionDecisionStatuses,
  evaluatePatternPromotion,
  buildPatternPromotionRegistry,
}
