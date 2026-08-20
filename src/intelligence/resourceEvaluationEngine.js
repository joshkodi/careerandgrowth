// src/intelligence/resourceEvaluationEngine.js

// ============================================================
// Career & Growth — MVP v0.7 — Phase 7.4B
// Resource Evaluation Engine
//
// Purpose:
// Evaluate discovered external resources BEFORE they can become
// Career & Growth Experience Candidates.
//
// This engine deliberately separates:
//   resource quality
//   child personalization fit
//   safety / developmental fit
//   Journey novelty
//   evidence-generation potential
//
// A high-quality resource is NOT automatically a good fit for
// a particular child.
//
// This module performs deterministic evaluation only.
// It does NOT browse the web or modify Journey/Growth evidence.
// ============================================================


export const evaluationStatuses = {
  PASS: 'pass',
  REVIEW: 'review',
  REJECT: 'reject',
}


export const evaluationDimensions = {
  DEVELOPMENTAL_FIT:
    'developmental_fit',

  SOURCE_CREDIBILITY:
    'source_credibility',

  ACTIONABILITY:
    'actionability',

  PROFILE_FIT:
    'profile_fit',

  INTENT_ALIGNMENT:
    'intent_alignment',

  JOURNEY_NOVELTY:
    'journey_novelty',

  SAFETY:
    'safety',

  EVIDENCE_POTENTIAL:
    'evidence_potential',
}


const weights = {
  [evaluationDimensions.DEVELOPMENTAL_FIT]:
    0.18,

  [evaluationDimensions.SOURCE_CREDIBILITY]:
    0.12,

  [evaluationDimensions.ACTIONABILITY]:
    0.14,

  [evaluationDimensions.PROFILE_FIT]:
    0.16,

  [evaluationDimensions.INTENT_ALIGNMENT]:
    0.10,

  [evaluationDimensions.JOURNEY_NOVELTY]:
    0.10,

  [evaluationDimensions.SAFETY]:
    0.12,

  [evaluationDimensions.EVIDENCE_POTENTIAL]:
    0.08,
}


const unique =
  (values = []) =>
    [
      ...new Set(
        values
          .filter(Boolean)
      ),
    ]


const normalize =
  (value = '') =>
    String(value)
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(
        /[^a-z0-9 ]/g,
        ' '
      )
      .replace(
        /\s+/g,
        ' '
      )
      .trim()


const textBlob =
  (...values) =>
    normalize(
      values
        .flat(Infinity)
        .filter(Boolean)
        .join(' ')
    )


const overlap =
  (
    terms = [],
    resourceText = ''
  ) => {
    const normalizedTerms =
      unique(
        terms
          .map(normalize)
          .filter(Boolean)
      )

    if (!normalizedTerms.length) {
      return {
        matched: [],
        ratio: null,
      }
    }

    const matched =
      normalizedTerms.filter(
        (term) =>
          resourceText.includes(
            term
          )
      )

    return {
      matched,

      ratio:
        matched.length /
        normalizedTerms.length,
    }
  }


const dimensionResult =
  ({
    dimension,
    score,
    status = null,
    reasons = [],
    matched = [],
    metadata = {},
  }) => {
    const safeScore =
      Math.max(
        0,
        Math.min(
          1,
          Number(score) || 0
        )
      )

    return {
      dimension,

      score:
        Number(
          safeScore.toFixed(2)
        ),

      status:
        status ||
        (
          safeScore >= 0.7
            ? evaluationStatuses.PASS
            : safeScore >= 0.4
              ? evaluationStatuses.REVIEW
              : evaluationStatuses.REJECT
        ),

      reasons,
      matched,
      metadata,
    }
  }


// ============================================================
// DEVELOPMENTAL FIT
// ============================================================

const evaluateDevelopmentalFit =
  (
    resource,
    request
  ) => {
    const childAge =
      Number(
        request
          ?.audience
          ?.age
      )

    const minAge =
      Number(
        resource
          ?.ageRange
          ?.min
      )

    const maxAge =
      Number(
        resource
          ?.ageRange
          ?.max
      )

    if (
      !Number.isFinite(
        childAge
      )
    ) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .DEVELOPMENTAL_FIT,

        score: 0.5,

        status:
          evaluationStatuses.REVIEW,

        reasons: [
          'Child age is unavailable; developmental fit requires review.',
        ],
      })
    }

    const hasMin =
      Number.isFinite(
        minAge
      )

    const hasMax =
      Number.isFinite(
        maxAge
      )

    if (
      hasMin &&
      childAge < minAge
    ) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .DEVELOPMENTAL_FIT,

        score: 0,

        status:
          evaluationStatuses.REJECT,

        reasons: [
          `Resource minimum age is ${minAge}, above the child age of ${childAge}.`,
        ],
      })
    }

    if (
      hasMax &&
      childAge > maxAge
    ) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .DEVELOPMENTAL_FIT,

        score: 0,

        status:
          evaluationStatuses.REJECT,

        reasons: [
          `Resource maximum age is ${maxAge}, below the child age of ${childAge}.`,
        ],
      })
    }

    if (
      hasMin ||
      hasMax
    ) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .DEVELOPMENTAL_FIT,

        score: 1,

        reasons: [
          'Resource age metadata includes the child.',
        ],

        metadata: {
          childAge,
          resourceAgeRange:
            resource.ageRange,
        },
      })
    }

    return dimensionResult({
      dimension:
        evaluationDimensions
          .DEVELOPMENTAL_FIT,

      score: 0.55,

      status:
        evaluationStatuses.REVIEW,

      reasons: [
        'Resource does not provide a verified age range.',
      ],

      metadata: {
        childAge,
      },
    })
  }


// ============================================================
// SOURCE CREDIBILITY
//
// The discovery adapter should eventually provide richer source
// metadata. Missing metadata triggers REVIEW rather than making
// unsupported credibility claims.
// ============================================================

const evaluateSourceCredibility =
  (resource) => {
    const metadata =
      resource
        ?.sourceMetadata ||
      {}

    if (
      metadata
        .credibilityVerified ===
      true
    ) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .SOURCE_CREDIBILITY,

        score: 1,

        reasons: [
          'Discovery adapter marked source credibility as verified.',
        ],
      })
    }

    const evidence = [
      Boolean(
        resource.provider
      ),

      Boolean(
        resource.url
      ),

      Boolean(
        metadata
          .publishedAt ||
        metadata
          .updatedAt
      ),

      Boolean(
        metadata.author
      ),
    ]

    const count =
      evidence.filter(
        Boolean
      ).length

    if (count >= 3) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .SOURCE_CREDIBILITY,

        score: 0.75,

        reasons: [
          'Resource has identifiable provider/source provenance, but credibility has not been independently verified.',
        ],
      })
    }

    if (count >= 2) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .SOURCE_CREDIBILITY,

        score: 0.55,

        status:
          evaluationStatuses.REVIEW,

        reasons: [
          'Basic source provenance is available; additional credibility review is recommended.',
        ],
      })
    }

    return dimensionResult({
      dimension:
        evaluationDimensions
          .SOURCE_CREDIBILITY,

      score: 0.25,

      status:
        evaluationStatuses.REVIEW,

      reasons: [
        'Source provenance is incomplete.',
      ],
    })
  }


// ============================================================
// ACTIONABILITY
// ============================================================

const evaluateActionability =
  (resource) => {
    const indicators = [
      Boolean(
        resource.description
      ),

      Boolean(
        resource
          .estimatedTime
      ),

      (
        resource
          ?.materials
          ?.length ||
        0
      ) > 0,

      (
        resource
          ?.prerequisites
          ?.length ||
        0
      ) > 0,

      (
        resource
          ?.format
          ?.length ||
        0
      ) > 0,

      [
        'project_guide',
        'activity',
        'tutorial',
        'challenge',
        'experiment',
        'lesson',
        'course',
        'practice',
        'interactive',
        'study_guide',
        'reference',
      ].includes(
        resource
          .resourceType
      ),
    ]

    const count =
      indicators.filter(
        Boolean
      ).length

    const score =
      Math.min(
        1,
        0.25 +
        count * 0.125
      )

    return dimensionResult({
      dimension:
        evaluationDimensions
          .ACTIONABILITY,

      score,

      reasons: [
        count >= 4
          ? 'Resource contains enough structure to support a concrete experience.'
          : 'Resource may require additional transformation before it can become a concrete experience.',
      ],

      metadata: {
        actionableIndicators:
          count,
      },
    })
  }


// ============================================================
// PROFILE FIT
// ============================================================

const evaluateProfileFit =
  (
    resource,
    request
  ) => {
    const terms =
      unique([
        ...(
          request
            ?.personalization
            ?.anchorStrengths ||
          []
        ),

        ...(
          request
            ?.personalization
            ?.developmentOpportunities ||
          []
        ),

        ...(
          request
            ?.personalization
            ?.explorationContext ||
          []
        ),
      ])

    const resourceText =
      textBlob(
        resource.title,
        resource.description,
        resource.topics,
        resource.skills,
        resource.format
      )

    const match =
      overlap(
        terms,
        resourceText
      )

    if (
      match.ratio === null
    ) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .PROFILE_FIT,

        score: 0.5,

        status:
          evaluationStatuses.REVIEW,

        reasons: [
          'No structured profile terms were available for matching.',
        ],
      })
    }

    const score =
      match.matched.length
        ? Math.min(
            1,
            0.2 +
            match.ratio * 1.6
          )
        : 0.1

    return dimensionResult({
      dimension:
        evaluationDimensions
          .PROFILE_FIT,

      score,

      matched:
        match.matched,

      reasons: [
        match.matched.length
          ? `Resource content matches profile context: ${match.matched.join(', ')}.`
          : 'No direct structured profile-term match was found in the resource metadata.',
      ],
    })
  }


// ============================================================
// INTENT ALIGNMENT
// ============================================================

const evaluateIntentAlignment =
  (
    resource,
    request
  ) => {
    const intent =
      request
        ?.personalization
        ?.structuredIntent ||
      []

    if (!intent.length) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .INTENT_ALIGNMENT,

        score: 0.65,

        status:
          evaluationStatuses.PASS,

        reasons: [
          'No explicit structured student/parent intent is required for this resource.',
        ],
      })
    }

    const resourceText =
      textBlob(
        resource.title,
        resource.description,
        resource.topics,
        resource.skills
      )

    const match =
      overlap(
        intent,
        resourceText
      )

    const score =
      match.matched.length
        ? Math.min(
            1,
            0.5 +
            match.ratio
          )
        : 0.3

    return dimensionResult({
      dimension:
        evaluationDimensions
          .INTENT_ALIGNMENT,

      score,

      matched:
        match.matched,

      reasons: [
        match.matched.length
          ? `Resource aligns with explicit intent: ${match.matched.join(', ')}.`
          : 'Explicit student/parent intent is present but not evident in the resource metadata.',
      ],
    })
  }


// ============================================================
// JOURNEY NOVELTY
// ============================================================

const evaluateJourneyNovelty =
  (
    resource,
    request
  ) => {
    const existingIds =
      request
        ?.discoveryCriteria
        ?.journeyNovelty
        ?.existingExperienceIds ||
      []

    const normalizedExistingIds =
      unique(
        existingIds
          .flatMap(
            (id) => {
              const value =
                String(id || '')

              return [
                value,
                value.startsWith(
                  'candidate_'
                )
                  ? value.slice(
                      'candidate_'.length
                    )
                  : `candidate_${value}`,
              ]
            }
          )
      )

    const resourceIdentityIds =
      unique([
        resource?.id,

        resource
          ?.retrievedFor
          ?.experienceId,

        resource
          ?.sourceMetadata
          ?.experienceId,
      ])

    const normalizedResourceIds =
      unique(
        resourceIdentityIds
          .flatMap(
            (id) => {
              const value =
                String(id || '')

              return [
                value,
                value.startsWith(
                  'candidate_'
                )
                  ? value.slice(
                      'candidate_'.length
                    )
                  : `candidate_${value}`,
              ]
            }
          )
      )

    const duplicateId =
      normalizedResourceIds.find(
        (id) =>
          normalizedExistingIds.includes(
            id
          )
      )

    if (duplicateId) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .JOURNEY_NOVELTY,

        score: 0.15,

        status:
          evaluationStatuses.REVIEW,

        reasons: [
          'Resource matches an experience already represented in Journey; require meaningful additional depth before reuse.',
        ],

        metadata: {
          duplicateId,
          existingExperienceIds:
            existingIds,
          resourceIdentityIds,
        },
      })
    }

    return dimensionResult({
      dimension:
        evaluationDimensions
          .JOURNEY_NOVELTY,

      score: 0.85,

      reasons: [
        'No direct duplicate Journey experience was identified from available metadata.',
      ],

      metadata: {
        existingExperienceIds:
          existingIds,
        resourceIdentityIds,
      },
    })
  }


// ============================================================
// SAFETY
// ============================================================

const evaluateSafety =
  (resource) => {
    const metadata =
      resource
        ?.sourceMetadata ||
      {}

    if (
      metadata
        .safetyRejected ===
      true
    ) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .SAFETY,

        score: 0,

        status:
          evaluationStatuses.REJECT,

        reasons: [
          'Discovery or review metadata flagged the resource as unsuitable for child use.',
        ],
      })
    }

    if (
      metadata
        .safetyVerified ===
      true
    ) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .SAFETY,

        score: 1,

        reasons: [
          'Resource safety was explicitly reviewed and verified.',
        ],
      })
    }

    if (
      resource.supervision &&
      resource.supervision !==
        'unknown'
    ) {
      return dimensionResult({
        dimension:
          evaluationDimensions
            .SAFETY,

        score: 0.75,

        reasons: [
          `Resource provides a supervision expectation: ${resource.supervision}.`,
        ],
      })
    }

    return dimensionResult({
      dimension:
        evaluationDimensions
          .SAFETY,

      score: 0.5,

      status:
        evaluationStatuses.REVIEW,

      reasons: [
        'Safety/supervision metadata is incomplete and should be reviewed before child-facing use.',
      ],
    })
  }


// ============================================================
// EVIDENCE-GENERATION POTENTIAL
// ============================================================

const evaluateEvidencePotential =
  (
    resource,
    request
  ) => {
    const activeTypes = [
      'project_guide',
      'activity',
      'challenge',
      'experiment',
      'tutorial',
      'course',
      'lesson',
      'practice',
      'interactive',
    ]

    const active =
      activeTypes.includes(
        resource.resourceType
      )

    const hasSkills =
      (
        resource
          ?.skills
          ?.length ||
        0
      ) > 0

    const hasFormat =
      (
        resource
          ?.format
          ?.length ||
        0
      ) > 0

    const hasObjective =
      Boolean(
        request
          ?.evidenceObjective
      )

    const count =
      [
        active,
        hasSkills,
        hasFormat,
        hasObjective,
      ].filter(
        Boolean
      ).length

    return dimensionResult({
      dimension:
        evaluationDimensions
          .EVIDENCE_POTENTIAL,

      score:
        0.25 +
        count * 0.1875,

      reasons: [
        active
          ? 'Resource supports active participation that can generate observable Growth Intelligence evidence.'
          : 'Passive resource format may provide limited observable evidence unless transformed into an active experience.',
      ],
    })
  }


// ============================================================
// HARD GATES
// ============================================================

const getHardRejectReasons =
  (dimensions) =>
    dimensions
      .filter(
        (result) =>
          (
            result.dimension ===
              evaluationDimensions
                .DEVELOPMENTAL_FIT ||
            result.dimension ===
              evaluationDimensions
                .SAFETY
          ) &&
          result.status ===
            evaluationStatuses.REJECT
      )
      .flatMap(
        (result) =>
          result.reasons
      )


// ============================================================
// PUBLIC EVALUATION
// ============================================================

export const evaluateDiscoveredResource =
  (
    resource,
    discoveryRequest
  ) => {
    if (
      !resource ||
      !discoveryRequest
    ) {
      return null
    }

    const dimensions = [
      evaluateDevelopmentalFit(
        resource,
        discoveryRequest
      ),

      evaluateSourceCredibility(
        resource
      ),

      evaluateActionability(
        resource
      ),

      evaluateProfileFit(
        resource,
        discoveryRequest
      ),

      evaluateIntentAlignment(
        resource,
        discoveryRequest
      ),

      evaluateJourneyNovelty(
        resource,
        discoveryRequest
      ),

      evaluateSafety(
        resource
      ),

      evaluateEvidencePotential(
        resource,
        discoveryRequest
      ),
    ]

    const hardRejectReasons =
      getHardRejectReasons(
        dimensions
      )

    const profileFit =
      dimensions.find(
        (result) =>
          result.dimension ===
          evaluationDimensions
            .PROFILE_FIT
      )

    const hasStructuredProfileContext =
      (
        discoveryRequest
          ?.personalization
          ?.anchorStrengths
          ?.length ||
        discoveryRequest
          ?.personalization
          ?.developmentOpportunities
          ?.length ||
        discoveryRequest
          ?.personalization
          ?.explorationContext
          ?.length
      ) > 0

    const profileMismatch =
      hasStructuredProfileContext &&
      (
        profileFit?.score ??
        0
      ) < 0.4

    const weightedScore =
      dimensions.reduce(
        (
          total,
          result
        ) =>
          total +
          result.score *
            (
              weights[
                result.dimension
              ] ||
              0
            ),
        0
      )

    const reviewDimensions =
      dimensions.filter(
        (result) =>
          result.status ===
            evaluationStatuses.REVIEW
      )

    let status =
      evaluationStatuses.PASS

    if (
      hardRejectReasons.length
    ) {
      status =
        evaluationStatuses.REJECT
    } else if (
      profileMismatch ||
      weightedScore < 0.58 ||
      reviewDimensions.length >= 3
    ) {
      status =
        evaluationStatuses.REVIEW
    }

    const score =
      Number(
        weightedScore
          .toFixed(2)
      )

    return {
      resourceId:
        resource.id,

      discoveryRequestId:
        discoveryRequest.id,

      researchBriefId:
        discoveryRequest
          .researchBriefId,

      strategy:
        discoveryRequest
          .strategy,

      status,

      score,

      dimensions,

      hardRejectReasons,

      reviewReasons: [
        ...(
          profileMismatch
            ? [
                'Resource does not have enough direct alignment with the structured child profile to become an Experience Candidate automatically.',
              ]
            : []
        ),

        ...reviewDimensions
          .flatMap(
            (result) =>
              result.reasons
          ),
      ],

      strengths:
        dimensions
          .filter(
            (result) =>
              result.status ===
                evaluationStatuses.PASS
          )
          .flatMap(
            (result) =>
              result.reasons
          ),

      experienceCandidateEligible:
        discoveryRequest?.purpose ===
          'guided_learning'
          ? false
          : status ===
              evaluationStatuses.PASS,

      learningResourceEligible:
        discoveryRequest?.purpose ===
          'guided_learning' &&
        status !==
          evaluationStatuses.REJECT,

      evaluatedAt:
        new Date()
          .toISOString(),
    }
  }


export const evaluateDiscoveredResources =
  (
    resources = [],
    discoveryRequest
  ) =>
    resources
      .map(
        (resource) => ({
          resource,

          evaluation:
            evaluateDiscoveredResource(
              resource,
              discoveryRequest
            ),
        })
      )
      .filter(
        (item) =>
          item.evaluation
      )
      .sort(
        (a, b) =>
          b.evaluation.score -
          a.evaluation.score
      )


// ============================================================
// DEVELOPMENT INSPECTOR
// ============================================================

export const inspectResourceEvaluations =
  (
    resources = [],
    discoveryRequest
  ) => {
    const evaluated =
      evaluateDiscoveredResources(
        resources,
        discoveryRequest
      )

    console.group(
      '🧪 Career & Growth — Resource Evaluations'
    )

    evaluated.forEach(
      ({
        resource,
        evaluation,
      }) => {
        console.group(
          `${evaluation.status.toUpperCase()} — ${resource.title} — ${evaluation.score}`
        )

        console.log(
          'Resource:',
          resource
        )

        console.log(
          'Dimensions:',
          evaluation.dimensions
        )

        console.log(
          'Strengths:',
          evaluation.strengths
        )

        console.log(
          'Review Reasons:',
          evaluation.reviewReasons
        )

        console.log(
          'Hard Reject Reasons:',
          evaluation.hardRejectReasons
        )

        console.log(
          'Experience Candidate Eligible:',
          evaluation
            .experienceCandidateEligible
        )

        console.log(
          'Evaluation:',
          evaluation
        )

        console.groupEnd()
      }
    )

    console.groupEnd()

    return evaluated
  }


export default {
  evaluationStatuses,
  evaluationDimensions,
  evaluateDiscoveredResource,
  evaluateDiscoveredResources,
  inspectResourceEvaluations,
}
