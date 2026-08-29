// src/intelligence/growthOpportunityEvaluationEngine.js

// ============================================================
// SynapStride — MVP v0.11 — Phase 4
// Growth Opportunity Evaluation Engine
//
// Deterministically evaluates provider candidates before they can
// become child-facing recommendations.
//
// Guardrails:
// - Candidate != recommendation.
// - Recommendation != evidence.
// - Missing metadata lowers confidence; it is not invented.
// - Age mismatch is a hard reject when age metadata is known.
// ============================================================

export const growthOpportunityEvaluationVersion = '0.11.3'

export const opportunityEvaluationStatuses = Object.freeze({
  PASS: 'pass',
  REVIEW: 'review',
  REJECT: 'reject',
})

const safeArray = (value) =>
  Array.isArray(value) ? value.filter(Boolean) : []

const normalize = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const terms = (values = []) =>
  [...new Set(
    safeArray(values)
      .flat(Infinity)
      .filter(Boolean)
      .flatMap((value) => normalize(value).split(' '))
      .filter((term) => term.length >= 3)
  )]

const clamp = (value) =>
  Math.max(0, Math.min(1, Number(value) || 0))

const ageFit = (candidate, request) => {
  const age = Number(request?.audience?.age)
  const min = Number(candidate?.ageRange?.min)
  const max = Number(candidate?.ageRange?.max)

  if (!Number.isFinite(age)) {
    return { score: 0.6, status: opportunityEvaluationStatuses.REVIEW }
  }

  if (Number.isFinite(min) && age < min) {
    return { score: 0, status: opportunityEvaluationStatuses.REJECT }
  }

  if (Number.isFinite(max) && age > max) {
    return { score: 0, status: opportunityEvaluationStatuses.REJECT }
  }

  return {
    score:
      Number.isFinite(min) || Number.isFinite(max)
        ? 1
        : 0.65,
    status: opportunityEvaluationStatuses.PASS,
  }
}

const personalizationFit = (candidate, request) => {
  const requestTerms = terms([
    request?.intent?.structuredTerms,
    request?.personalization?.profileTerms,
  ])

  if (!requestTerms.length) return 0.55

  const candidateTerms = new Set(terms([
    candidate?.title,
    candidate?.description,
    candidate?.domains,
    candidate?.develops,
    candidate?.interests,
  ]))

  const matched =
    requestTerms.filter((term) =>
      candidateTerms.has(term)
    )

  return clamp(
    matched.length
      ? 0.35 + matched.length / Math.min(requestTerms.length, 5)
      : 0.2
  )
}

const noveltyFit = (candidate, existingIds = []) => {
  const id =
    candidate?.opportunityId ||
    candidate?.source?.experienceId

  return safeArray(existingIds).includes(id)
    ? 0.15
    : 1
}

export function evaluateGrowthOpportunity(
  candidate,
  request,
  { existingOpportunityIds = [] } = {}
) {
  if (!candidate || !request) return null

  const developmental = ageFit(candidate, request)

  if (
    developmental.status ===
    opportunityEvaluationStatuses.REJECT
  ) {
    return {
      ...candidate,
      evaluation: {
        version: growthOpportunityEvaluationVersion,
        status: opportunityEvaluationStatuses.REJECT,
        score: 0,
        reasons: ['Outside the known age range for this child.'],
      },
    }
  }

  const profileFit =
    personalizationFit(candidate, request)

  const novelty =
    noveltyFit(candidate, existingOpportunityIds)

  const provenance =
    candidate?.source?.provenanceVerified === true
      ? 1
      : 0.5

  const providerMatch =
    clamp(candidate?.providerMatchScore ?? 0.5)

  const score =
    developmental.score * 0.25 +
    profileFit * 0.30 +
    novelty * 0.20 +
    provenance * 0.15 +
    providerMatch * 0.10

  const status =
    score >= 0.68
      ? opportunityEvaluationStatuses.PASS
      : score >= 0.45
        ? opportunityEvaluationStatuses.REVIEW
        : opportunityEvaluationStatuses.REJECT

  const reasons = []

  if (profileFit >= 0.6) {
    reasons.push(
      'Matches current interests, intent, or Growth Profile context.'
    )
  }

  if (novelty >= 0.9) {
    reasons.push(
      'Adds something not already represented in the current Journey.'
    )
  }

  if (provenance === 1) {
    reasons.push(
      'Comes from a known SynapStride curated source.'
    )
  }

  return {
    ...candidate,
    evaluation: {
      version: growthOpportunityEvaluationVersion,
      status,
      score: Number(score.toFixed(2)),
      dimensions: {
        developmentalFit: developmental.score,
        personalizationFit: Number(profileFit.toFixed(2)),
        novelty: Number(novelty.toFixed(2)),
        provenance,
        providerMatch,
      },
      reasons,
    },
  }
}

export function evaluateGrowthOpportunities(
  candidates = [],
  request,
  options = {}
) {
  return safeArray(candidates)
    .map((candidate) =>
      evaluateGrowthOpportunity(
        candidate,
        request,
        options
      )
    )
    .filter(Boolean)
    .sort(
      (a, b) =>
        Number(b?.evaluation?.score || 0) -
        Number(a?.evaluation?.score || 0)
    )
}

export default {
  growthOpportunityEvaluationVersion,
  opportunityEvaluationStatuses,
  evaluateGrowthOpportunity,
  evaluateGrowthOpportunities,
}
