// src/intelligence/researchStrategyGenerator.js

import {
  createChildContext,
  recommendationStrategies,
} from './experienceResearchModels'


// ============================================================
// Career & Growth — MVP v0.7 — Phase 7.3C
// Research Intent & Strategy Refinement
//
// Converts Growth Intelligence + intent + Journey history into
// structured research briefs for external-resource discovery.
//
// Key concepts:
// - anchor strengths: established characteristics to leverage
// - development opportunities: useful areas to practice/deepen
// - parent/student intent: explicit goals, never invented
// - Journey novelty: avoid simple repetition
// - evidence objective: what the experience should help us learn
//
// External web research remains Phase 7.4.
// ============================================================


export const researchPurposes = {
  GROWTH_EXPERIENCE: 'growth_experience',

  // Reserved for MVP v0.8.
  GUIDED_LEARNING: 'guided_learning',
}


export const researchBriefStatuses = {
  DRAFT: 'draft',
  READY: 'ready',
}


const strategyLabels = {
  [recommendationStrategies.STRENGTHEN]:
    'Strengthen',

  [recommendationStrategies.STRETCH]:
    'Stretch',

  [recommendationStrategies.EXPLORE]:
    'Explore',

  [recommendationStrategies.DISCOVER]:
    'Discover',
}


const asCollection =
  (value) => {
    if (Array.isArray(value)) {
      return value
    }

    if (
      value &&
      typeof value === 'object'
    ) {
      return Object.values(value)
    }

    return []
  }


const rankedPositive =
  (
    value,
    limit = 12
  ) =>
    asCollection(value)
      .filter(Boolean)
      .map(
        (item) => ({
          id:
            item.id ||
            item.signalId ||
            null,

          label:
            item.label ||
            item.id ||
            item.signalId ||
            '',

          score:
            Number(
              item.score ??
              item.netStrength ??
              0
            ),

          confidence:
            Number(
              item.confidence
                ?.score ??
              0
            ),
        })
      )
      .filter(
        (item) =>
          item.id &&
          item.score > 0
      )
      .sort(
        (a, b) =>
          (
            b.score +
            b.confidence * 0.25
          ) -
          (
            a.score +
            a.confidence * 0.25
          )
      )
      .slice(
        0,
        limit
      )


const activeIntentTexts =
  (intents = []) =>
    intents
      .filter(
        (intent) =>
          intent?.status ===
            'active' &&
          intent?.text
      )
      .map(
        (intent) =>
          intent.text.trim()
      )


const unique =
  (values = []) =>
    [
      ...new Set(
        values.filter(Boolean)
      ),
    ]


const journeyExperienceIds =
  (journeyItems = []) =>
    unique(
      journeyItems.map(
        (item) =>
          item?.experienceId ||
          item?.experienceCandidateId
      )
    )


const ids =
  (
    collection,
    count
  ) =>
    collection
      .slice(0, count)
      .map(
        (item) =>
          item.id
      )


const labels =
  (
    collection,
    count
  ) =>
    collection
      .slice(0, count)
      .map(
        (item) =>
          item.label
      )


// ============================================================
// INTENT CLASSIFICATION
//
// Parent/student goals remain preserved verbatim.
// These tags only help external research understand the type
// of growth being requested. They do not replace the source text.
// ============================================================

const intentRules = [
  {
    id: 'confidence',
    terms: [
      'confidence',
      'confident',
      'self esteem',
      'self-esteem',
      'speak up',
    ],
  },

  {
    id: 'communication',
    terms: [
      'communicat',
      'speaking',
      'present',
      'express',
      'conversation',
    ],
  },

  {
    id: 'leadership',
    terms: [
      'leader',
      'leadership',
      'lead ',
      'initiative',
    ],
  },

  {
    id: 'persistence',
    terms: [
      'persist',
      'persever',
      'resilien',
      'not give up',
      'finish',
      'follow through',
    ],
  },

  {
    id: 'problem_solving',
    terms: [
      'problem solv',
      'critical think',
      'analytical',
      'reasoning',
    ],
  },

  {
    id: 'creativity',
    terms: [
      'creativ',
      'imagin',
      'design',
      'invent',
    ],
  },

  {
    id: 'independence',
    terms: [
      'independent',
      'independence',
      'self directed',
      'self-directed',
      'responsib',
    ],
  },

  {
    id: 'collaboration',
    terms: [
      'team',
      'collaborat',
      'work with others',
      'social',
    ],
  },

  {
    id: 'career_awareness',
    terms: [
      'career',
      'future',
      'profession',
      'job',
    ],
  },

  {
    id: 'academic_growth',
    terms: [
      'school',
      'academic',
      'math',
      'science',
      'reading',
      'writing',
      'learn',
    ],
  },
]


const classifyIntentTexts =
  (texts = []) =>
    unique(
      texts.flatMap(
        (text) => {
          const normalized =
            text.toLowerCase()

          return intentRules
            .filter(
              (rule) =>
                rule.terms.some(
                  (term) =>
                    normalized.includes(
                      term
                    )
                )
            )
            .map(
              (rule) =>
                rule.id
            )
        }
      )
    )


const buildIntentContext =
  ({
    studentIntents,
    parentIntents,
  }) => {
    const student =
      activeIntentTexts(
        studentIntents
      )

    const parent =
      activeIntentTexts(
        parentIntents
      )

    return {
      student: {
        sourceText:
          student,

        structuredIntent:
          classifyIntentTexts(
            student
          ),

        present:
          student.length > 0,
      },

      parent: {
        sourceText:
          parent,

        structuredIntent:
          classifyIntentTexts(
            parent
          ),

        present:
          parent.length > 0,
      },
    }
  }


// ============================================================
// PROFILE INTERPRETATION
// ============================================================

const buildProfileContext =
  (growthProfile) => {
    const signals =
      rankedPositive(
        growthProfile
          ?.signals
      )

    const traits =
      rankedPositive(
        growthProfile
          ?.traits
      )

    const domains =
      rankedPositive(
        growthProfile
          ?.domains
      )

    const pathways =
      rankedPositive(
        growthProfile
          ?.pathways
      )

    // Top demonstrated characteristics become anchors.
    const anchorSignals =
      signals.slice(
        0,
        3
      )

    const anchorTraits =
      traits.slice(
        0,
        3
      )

    // Development opportunities should not simply be the next
    // strongest traits. Prefer characteristics with positive
    // evidence but lower relative strength/confidence.
    const developmentSignals =
      signals
        .slice()
        .reverse()
        .slice(
          0,
          3
        )

    const developmentTraits =
      traits
        .slice()
        .reverse()
        .slice(
          0,
          3
        )

    return {
      signals,
      traits,
      domains,
      pathways,

      anchorSignals,
      anchorTraits,

      developmentSignals,
      developmentTraits,
    }
  }


const buildJourneyContext =
  (journeyItems = []) => ({
    experienceIds:
      journeyExperienceIds(
        journeyItems
      ),

    count:
      journeyItems.length,

    noveltyRequirement:
      'Prefer a meaningfully new challenge, format, subject, or level of depth rather than simply repeating a Journey experience.',
  })


const buildConstraints =
  ({
    childContext,
    journeyContext,
  }) => ({
    developmentalFit: {
      childAge:
        childContext.age,

      ageBracket:
        childContext
          .ageBracket,

      grade:
        childContext.grade,

      requirement:
        'The source and resulting experience must be understandable, achievable, and developmentally appropriate for this child.',
    },

    safety: {
      requirement:
        'Use child-appropriate resources with safe instructions and explicit adult-supervision expectations when relevant.',
    },

    journeyNovelty: {
      existingExperienceIds:
        journeyContext
          .experienceIds,

      requirement:
        journeyContext
          .noveltyRequirement,
    },

    resourceQuality: {
      requirement:
        'Prefer credible, accessible, actionable resources with enough substance to support a concrete experience rather than a passive content recommendation.',
    },

    personalization: {
      requirement:
        'The resource must have an explainable connection to the child context. Do not recommend solely because it is generally popular for the age group.',
    },
  })


const makeBrief =
  ({
    strategy,
    childContext,
    intentContext,
    journeyContext,
    anchorStrengths,
    developmentOpportunities,
    explorationContext,
    rationale,
    researchObjective,
    evidenceObjective,
  }) => ({
    id:
      `research_${strategy}`,

    version:
      '0.7.3c',

    purpose:
      researchPurposes
        .GROWTH_EXPERIENCE,

    status:
      researchBriefStatuses
        .READY,

    strategy,

    strategyLabel:
      strategyLabels[
        strategy
      ],

    audience: {
      age:
        childContext.age,

      ageBracket:
        childContext
          .ageBracket,

      grade:
        childContext.grade,
    },

    anchorStrengths,

    developmentOpportunities,

    intent: {
      student:
        intentContext.student,

      parent:
        intentContext.parent,

      rule:
        'Use explicit student and parent intent when present. Never invent a student goal when none has been provided.',
    },

    explorationContext,

    constraints:
      buildConstraints({
        childContext,
        journeyContext,
      }),

    rationale,

    researchObjective,

    evidenceObjective,

    outputExpectation: {
      resource:
        'A credible external resource suitable for evaluation.',

      experience:
        'A personalized, concrete experience candidate derived from the resource.',

      explanation:
        'A child/parent-readable explanation of why the experience fits this child.',

      evidencePlan:
        'A small set of observable behaviors or reflections that can generate new Growth Intelligence evidence after the experience.',
    },

    futureExtensions: {
      guidedLearningCompatible:
        true,

      homeworkModeEnabled:
        false,

      note:
        'MVP v0.8 can reuse this research/evaluation pipeline with purpose=guided_learning while applying assignment-specific safeguards and learning guidance.',
    },
  })


// ============================================================
// STRATEGIES
// ============================================================

const buildStrengthen =
  ({
    childContext,
    profile,
    intentContext,
    journeyContext,
  }) => {
    const anchorStrengths = {
      signals:
        ids(
          profile
            .anchorSignals,
          3
        ),

      traits:
        ids(
          profile
            .anchorTraits,
          3
        ),

      domains:
        ids(
          profile.domains,
          2
        ),

      pathways:
        ids(
          profile.pathways,
          2
        ),
    }

    return makeBrief({
      strategy:
        recommendationStrategies
          .STRENGTHEN,

      childContext,
      intentContext,
      journeyContext,

      anchorStrengths,

      developmentOpportunities: {
        signals: [],
        traits: [],
        intentTargets:
          unique([
            ...intentContext
              .student
              .structuredIntent,

            ...intentContext
              .parent
              .structuredIntent,
          ]),
      },

      explorationContext: {
        preferredDomains:
          ids(
            profile.domains,
            2
          ),

        preferredPathways:
          ids(
            profile.pathways,
            2
          ),
      },

      rationale:
        `Build on demonstrated strengths such as ${[
          ...labels(
            profile
              .anchorTraits,
            2
          ),
          ...labels(
            profile
              .anchorSignals,
            2
          ),
        ].join(', ')}.`,

      researchObjective:
        'Find a high-quality, age-appropriate external resource that can become a new hands-on experience reinforcing demonstrated strengths while adding meaningful depth or challenge.',

      evidenceObjective:
        'Observe whether the child continues to show strong engagement, persistence, problem solving, or creation when the familiar strength is tested at a deeper level.',
    })
  }


const buildStretch =
  ({
    childContext,
    profile,
    intentContext,
    journeyContext,
  }) => {
    const intentTargets =
      unique([
        ...intentContext
          .student
          .structuredIntent,

        ...intentContext
          .parent
          .structuredIntent,
      ])

    const developmentOpportunities = {
      signals:
        ids(
          profile
            .developmentSignals,
          3
        ),

      traits:
        ids(
          profile
            .developmentTraits,
          3
        ),

      intentTargets,
    }

    return makeBrief({
      strategy:
        recommendationStrategies
          .STRETCH,

      childContext,
      intentContext,
      journeyContext,

      anchorStrengths: {
        signals:
          ids(
            profile
              .anchorSignals,
            2
          ),

        traits:
          ids(
            profile
              .anchorTraits,
            2
          ),
      },

      developmentOpportunities,

      explorationContext: {
        bridgeDomains:
          ids(
            profile.domains,
            2
          ),

        bridgePathways:
          ids(
            profile.pathways,
            2
          ),
      },

      rationale:
        intentTargets.length
          ? `Use established strengths as a bridge toward explicit growth goals such as ${intentTargets.join(', ')}.`
          : `Use established strengths as a bridge toward lower-evidence characteristics such as ${[
            ...labels(
              profile
                .developmentTraits,
              2
            ),
            ...labels(
              profile
                .developmentSignals,
              1
            ),
          ].join(', ')}.`,

      researchObjective:
        'Find an age-appropriate resource that starts from an established strength but requires meaningful practice of a development opportunity or explicit parent/student growth goal.',

      evidenceObjective:
        'Observe how the child responds when a familiar strength must be combined with a less-established capability: willingness, confidence, persistence, help-seeking, and improvement.',
    })
  }


const buildExplore =
  ({
    childContext,
    profile,
    intentContext,
    journeyContext,
  }) =>
    makeBrief({
      strategy:
        recommendationStrategies
          .EXPLORE,

      childContext,
      intentContext,
      journeyContext,

      anchorStrengths: {
        signals:
          ids(
            profile
              .anchorSignals,
            2
          ),

        traits:
          ids(
            profile
              .anchorTraits,
            2
          ),
      },

      developmentOpportunities: {
        intentTargets:
          unique([
            ...intentContext
              .student
              .structuredIntent,

            ...intentContext
              .parent
              .structuredIntent,
          ]),
      },

      explorationContext: {
        adjacentDomains:
          ids(
            profile
              .domains
              .slice(1),
            3
          ),

        adjacentPathways:
          ids(
            profile
              .pathways
              .slice(1),
            3
          ),

        declaredInterests:
          childContext
            .declaredInterests,
      },

      rationale:
        'Investigate an adjacent direction connected to demonstrated characteristics, explicit goals, or declared interests without merely repeating the strongest current domain.',

      researchObjective:
        'Find an external resource in an adjacent domain or pathway that connects naturally to established characteristics but gives the child a genuinely new type of experience.',

      evidenceObjective:
        'Learn whether established strengths transfer into a neighboring subject or activity and whether the child shows new enjoyment, curiosity, initiative, or sustained engagement.',
    })


const buildDiscover =
  ({
    childContext,
    profile,
    intentContext,
    journeyContext,
  }) =>
    makeBrief({
      strategy:
        recommendationStrategies
          .DISCOVER,

      childContext,
      intentContext,
      journeyContext,

      anchorStrengths: {
        transferableSignals:
          ids(
            profile
              .anchorSignals,
            2
          ),

        transferableTraits:
          ids(
            profile
              .anchorTraits,
            2
          ),
      },

      developmentOpportunities: {
        intentTargets:
          unique([
            ...intentContext
              .student
              .structuredIntent,

            ...intentContext
              .parent
              .structuredIntent,
          ]),
      },

      explorationContext: {
        moveBeyondDomains:
          ids(
            profile.domains,
            3
          ),

        moveBeyondPathways:
          ids(
            profile.pathways,
            3
          ),

        requirement:
          'Look beyond the strongest current domains/pathways while retaining enough transferable strengths for the experience to feel approachable.',
      },

      rationale:
        'Create controlled novelty so Career & Growth can discover interests or tendencies that the existing profile may not yet reveal.',

      researchObjective:
        'Find a safe, age-appropriate external resource in a meaningfully different subject or activity that can be transformed into a low-risk discovery experience.',

      evidenceObjective:
        'Generate new evidence: Does the child become curious, engaged, creative, persistent, communicative, or energized in an area not strongly represented in the current profile?',
    })


// ============================================================
// PUBLIC API
// ============================================================

export const generateResearchStrategies =
  ({
    childProfile = {},
    growthProfile = null,
    studentIntents = [],
    parentIntents = [],
    journeyItems = [],
    declaredInterests = [],
    experiencePreferences = {},
  } = {}) => {
    const childContext =
      createChildContext({
        childProfile,
        growthProfile,
        studentIntents,
        parentIntents,
        journeyItems,
        declaredInterests,
        experiencePreferences,
      })

    const profile =
      buildProfileContext(
        growthProfile
      )

    const intentContext =
      buildIntentContext({
        studentIntents,
        parentIntents,
      })

    const journeyContext =
      buildJourneyContext(
        journeyItems
      )

    const context = {
      childContext,
      profile,
      intentContext,
      journeyContext,
    }

    return [
      buildStrengthen(
        context
      ),

      buildStretch(
        context
      ),

      buildExplore(
        context
      ),

      buildDiscover(
        context
      ),
    ]
  }


export const inspectResearchStrategies =
  (options = {}) => {
    const briefs =
      generateResearchStrategies(
        options
      )

    console.group(
      '🔬 Career & Growth — Research Strategies'
    )

    briefs.forEach(
      (brief) => {
        console.group(
          `${brief.strategyLabel} — ${brief.researchObjective}`
        )

        console.log(
          'Audience:',
          brief.audience
        )

        console.log(
          'Anchor Strengths:',
          brief.anchorStrengths
        )

        console.log(
          'Development Opportunities:',
          brief
            .developmentOpportunities
        )

        console.log(
          'Intent:',
          brief.intent
        )

        console.log(
          'Exploration Context:',
          brief
            .explorationContext
        )

        console.log(
          'Rationale:',
          brief.rationale
        )

        console.log(
          'Evidence Objective:',
          brief
            .evidenceObjective
        )

        console.log(
          'Constraints:',
          brief.constraints
        )

        console.log(
          'Research Brief:',
          brief
        )

        console.groupEnd()
      }
    )

    console.groupEnd()

    return briefs
  }


export default {
  researchPurposes,
  researchBriefStatuses,
  generateResearchStrategies,
  inspectResearchStrategies,
}
