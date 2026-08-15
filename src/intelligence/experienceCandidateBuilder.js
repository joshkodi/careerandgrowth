// src/intelligence/experienceCandidateBuilder.js

// ============================================================
// Career & Growth — MVP v0.7 — Phase 7.4C
// Personalized Experience Candidate Builder
//
// Qualified Resource + Evaluation + Research Context
//                    ↓
//        Personalized Experience Candidate
//
// IMPORTANT:
// - Only PASS resources are automatically eligible.
// - The external resource remains provenance/supporting material.
// - The Career & Growth candidate is the child-facing object.
// - This builder does NOT add anything to Journey.
// - This builder does NOT create Growth Intelligence evidence.
// ============================================================


export const experienceCandidateVersion =
  '0.7.4c'


export const experienceCandidateStatuses = {
  CANDIDATE: 'candidate',
  SELECTED: 'selected',
  DISMISSED: 'dismissed',
}


const unique =
  (values = []) =>
    [
      ...new Set(
        values
          .filter(Boolean)
      ),
    ]


const humanize =
  (value = '') =>
    String(value)
      .replaceAll('_', ' ')
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      )


const shortList =
  (
    values = [],
    limit = 4
  ) =>
    unique(values)
      .slice(
        0,
        limit
      )


const getEvaluationDimension =
  (
    evaluation,
    dimension
  ) =>
    evaluation
      ?.dimensions
      ?.find(
        (item) =>
          item.dimension ===
          dimension
      ) ||
    null


const matchedProfileTerms =
  (evaluation) =>
    shortList(
      getEvaluationDimension(
        evaluation,
        'profile_fit'
      )?.matched ||
      []
    )


const matchedIntentTerms =
  (evaluation) =>
    shortList(
      getEvaluationDimension(
        evaluation,
        'intent_alignment'
      )?.matched ||
      []
    )


const derivePractices =
  (
    resource,
    discoveryRequest
  ) =>
    shortList([
      ...(resource.skills || []),

      ...(
        discoveryRequest
          ?.personalization
          ?.developmentOpportunities ||
        []
      ),

      ...(
        discoveryRequest
          ?.personalization
          ?.structuredIntent ||
        []
      ),
    ], 6)


const deriveStrengths =
  (
    resource,
    discoveryRequest,
    evaluation
  ) =>
    shortList([
      ...matchedProfileTerms(
        evaluation
      ),

      ...(
        discoveryRequest
          ?.personalization
          ?.anchorStrengths ||
        []
      ),

      ...(resource.skills || []),
    ], 5)


const buildMission =
  (
    resource,
    strategy
  ) => {
    const type =
      resource.resourceType

    if (
      type === 'challenge' ||
      type === 'project_guide'
    ) {
      return `Take on the ${resource.title} challenge: build or create something, test your ideas, notice what happens, and improve your solution.`
    }

    if (
      type === 'experiment'
    ) {
      return `Use ${resource.title} as an experiment: make a prediction, try it, observe what happens, and explain what you discovered.`
    }

    if (
      type === 'activity' ||
      type === 'tutorial'
    ) {
      return `Complete ${resource.title} as a hands-on mission. Follow the core activity, make your own decisions along the way, test the result, and reflect on what you would change next.`
    }

    return `Use ${resource.title} as the starting point for a ${humanize(strategy || 'growth')} experience. Do something active with the resource, create or test an idea, and reflect on what you learned.`
  }


const buildWhyItFits =
  ({
    resource,
    discoveryRequest,
    evaluation,
  }) => {
    const strengths =
      deriveStrengths(
        resource,
        discoveryRequest,
        evaluation
      )

    const intent =
      matchedIntentTerms(
        evaluation
      )

    const pieces = []

    if (strengths.length) {
      pieces.push(
        `It connects with strengths and interests such as ${strengths.map(humanize).join(', ')}`
      )
    }

    if (intent.length) {
      pieces.push(
        `It also supports goals around ${intent.map(humanize).join(', ')}`
      )
    }

    if (!pieces.length) {
      pieces.push(
        'It was selected because its activity format and subject fit the current Growth Intelligence research strategy'
      )
    }

    return `${pieces.join('. ')}. The goal is not just to finish the resource, but to turn it into an experience that reveals how the child thinks, creates, experiments, and responds to challenge.`
  }


const buildActivitySteps =
  (resource) => {
    const steps = [
      {
        id: 'prepare',
        title: 'Get ready',
        instruction:
          resource.materials?.length
            ? `Review the source and gather the needed materials: ${resource.materials.join(', ')}.`
            : 'Review the source and gather any materials needed for the activity.',
      },

      {
        id: 'predict',
        title: 'Make a plan',
        instruction:
          'Before starting, decide what you want to make, test, solve, or discover. Make at least one prediction about what might happen.',
      },

      {
        id: 'do',
        title: 'Build, try, or investigate',
        instruction:
          `Use the external resource as guidance, but make your own decisions while completing the core ${humanize(resource.resourceType || 'activity').toLowerCase()}.`,
      },

      {
        id: 'improve',
        title: 'Test and improve',
        instruction:
          'Notice what worked and what did not. Change at least one thing and try again when the activity allows it.',
      },

      {
        id: 'reflect',
        title: 'Tell us what happened',
        instruction:
          'Reflect on what you enjoyed, what was difficult, what you changed, and what you would want to try next.',
      },
    ]

    return steps
  }


const buildParentRole =
  (resource) => ({
    supervision:
      resource.supervision ||
      'unknown',

    guidance:
      'Help with setup, safety, materials, and clarification when needed. Prefer questions and encouragement over solving the challenge for the child.',

    observationPrompts: [
      'What did the child choose to do without prompting?',
      'What happened when something did not work?',
      'Did the child test another idea or ask for help?',
      'Which part seemed to create the most energy or enjoyment?',
    ],
  })


const buildReflectionPrompts =
  () => [
    'What part did you enjoy the most?',
    'What was the hardest part?',
    'What did you change after your first try?',
    'What did you figure out that you did not know before?',
    'Would you want to do something like this again? Why or why not?',
  ]


const buildEvidencePlan =
  ({
    resource,
    discoveryRequest,
  }) => ({
    objective:
      discoveryRequest
        ?.evidenceObjective ||
      'Observe how the child engages with the experience and what new Growth Intelligence evidence emerges.',

    observeFor:
      shortList([
        ...(resource.skills || []),

        ...(
          discoveryRequest
            ?.personalization
            ?.anchorStrengths ||
          []
        ),

        ...(
          discoveryRequest
            ?.personalization
            ?.developmentOpportunities ||
          []
        ),
      ], 8),

    childEvidence: [
      'enjoyment / interest',
      'perceived difficulty',
      'what the child chose to change or improve',
      'whether the child wants to continue exploring',
    ],

    parentEvidence: [
      'independent initiative',
      'persistence after difficulty',
      'problem-solving behavior',
      'help-seeking behavior',
      'observable excitement or disengagement',
    ],

    rule:
      'Completing the experience alone is not evidence of a trait. Growth Intelligence should use observable behavior and reflection generated during the experience.',
  })


const buildSourceResource =
  (resource) => ({
    resourceId:
      resource.id,

    title:
      resource.title,

    provider:
      resource.provider,

    url:
      resource.url,

    resourceType:
      resource.resourceType,

    ageRange:
      resource.ageRange,

    gradeRange:
      resource.gradeRange,

    estimatedTime:
      resource.estimatedTime,

    cost:
      resource.cost,

    retrievedMetadata:
      resource.sourceMetadata ||
      {},
  })


const buildPersonalizationSnapshot =
  ({
    discoveryRequest,
    evaluation,
  }) => ({
    capturedAt:
      new Date()
        .toISOString(),

    researchBriefId:
      discoveryRequest
        ?.researchBriefId ||
      null,

    discoveryRequestId:
      discoveryRequest
        ?.id ||
      null,

    strategy:
      discoveryRequest
        ?.strategy ||
      null,

    audience:
      discoveryRequest
        ?.audience ||
      null,

    anchorStrengths:
      discoveryRequest
        ?.personalization
        ?.anchorStrengths ||
      [],

    developmentOpportunities:
      discoveryRequest
        ?.personalization
        ?.developmentOpportunities ||
      [],

    studentGoals:
      discoveryRequest
        ?.personalization
        ?.studentGoals ||
      [],

    parentGoals:
      discoveryRequest
        ?.personalization
        ?.parentGoals ||
      [],

    structuredIntent:
      discoveryRequest
        ?.personalization
        ?.structuredIntent ||
      [],

    evaluation: {
      status:
        evaluation.status,

      score:
        evaluation.score,

      strengths:
        evaluation.strengths,

      reviewReasons:
        evaluation.reviewReasons,
    },
  })


// ============================================================
// PUBLIC API
// ============================================================

export const buildExperienceCandidate =
  ({
    resource,
    evaluation,
    discoveryRequest,
  } = {}) => {
    if (
      !resource ||
      !evaluation ||
      !discoveryRequest
    ) {
      return null
    }

    if (
      evaluation.status !==
        'pass' ||
      evaluation
        .experienceCandidateEligible !==
        true
    ) {
      return null
    }

    const strategy =
      discoveryRequest.strategy

    const practices =
      derivePractices(
        resource,
        discoveryRequest
      )

    return {
      id:
        `candidate_${resource.id}`,

      version:
        experienceCandidateVersion,

      status:
        experienceCandidateStatuses
          .CANDIDATE,

      title:
        resource.title,

      emoji:
        '🧭',

      strategy,

      mission:
        buildMission(
          resource,
          strategy
        ),

      whyItFits:
        buildWhyItFits({
          resource,
          discoveryRequest,
          evaluation,
        }),

      buildsOn:
        deriveStrengths(
          resource,
          discoveryRequest,
          evaluation
        ),

      practices,

      estimatedTime:
        resource.estimatedTime,

      materials:
        resource.materials ||
        [],

      prerequisites:
        resource.prerequisites ||
        [],

      activitySteps:
        buildActivitySteps(
          resource
        ),

      parentRole:
        buildParentRole(
          resource
        ),

      reflectionPrompts:
        buildReflectionPrompts(),

      evidencePlan:
        buildEvidencePlan({
          resource,
          discoveryRequest,
        }),

      sourceResource:
        buildSourceResource(
          resource
        ),

      personalizationSnapshot:
        buildPersonalizationSnapshot({
          discoveryRequest,
          evaluation,
        }),

      journeyEntry: {
        eligible:
          true,

        enteredJourney:
          false,

        rule:
          'The candidate must be explicitly selected before it becomes a Journey item.',
      },
    }
  }


export const buildExperienceCandidates =
  (
    evaluatedResources = [],
    discoveryRequest
  ) =>
    evaluatedResources
      .map(
        ({
          resource,
          evaluation,
        }) =>
          buildExperienceCandidate({
            resource,
            evaluation,
            discoveryRequest,
          })
      )
      .filter(Boolean)


// ============================================================
// DEVELOPMENT INSPECTOR
// ============================================================

export const inspectExperienceCandidates =
  (
    evaluatedResources = [],
    discoveryRequest
  ) => {
    const candidates =
      buildExperienceCandidates(
        evaluatedResources,
        discoveryRequest
      )

    console.group(
      '✨ Career & Growth — Personalized Experience Candidates'
    )

    candidates.forEach(
      (candidate) => {
        console.group(
          `${candidate.title} — ${humanize(candidate.strategy)}`
        )

        console.log(
          'Mission:',
          candidate.mission
        )

        console.log(
          'Why It Fits:',
          candidate.whyItFits
        )

        console.log(
          'Builds On:',
          candidate.buildsOn
        )

        console.log(
          'Practices:',
          candidate.practices
        )

        console.log(
          'Activity Steps:',
          candidate.activitySteps
        )

        console.log(
          'Parent Role:',
          candidate.parentRole
        )

        console.log(
          'Reflection Prompts:',
          candidate.reflectionPrompts
        )

        console.log(
          'Evidence Plan:',
          candidate.evidencePlan
        )

        console.log(
          'Source Resource:',
          candidate.sourceResource
        )

        console.log(
          'Personalization Snapshot:',
          candidate.personalizationSnapshot
        )

        console.log(
          'Experience Candidate:',
          candidate
        )

        console.groupEnd()
      }
    )

    console.groupEnd()

    return candidates
  }


export default {
  experienceCandidateVersion,
  experienceCandidateStatuses,
  buildExperienceCandidate,
  buildExperienceCandidates,
  inspectExperienceCandidates,
}
