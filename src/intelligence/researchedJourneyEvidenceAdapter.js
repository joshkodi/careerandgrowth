// src/intelligence/researchedJourneyEvidenceAdapter.js

import {
  evidenceSourceTypes,
} from '../data/growthTaxonomy'

import {
  createEvidenceEvent,
} from './evidenceEngine'


// ============================================================
// Career & Growth — MVP v0.7
// Researched Journey Evidence Adapter
//
// Converts EXPLICIT child reflection about a researched
// experience into supplemental Growth Intelligence evidence.
//
// Core rule:
//
// Recommendation != evidence.
// Resource match != evidence.
// Candidate profile != evidence.
//
// Only what the child actually reports/does after participating
// may contribute new evidence.
// ============================================================


const challengeEvidenceMap = {
  kept_trying: [
    {
      signalId:
        'persistence',
      weight: 0.7,
    },
  ],

  changed_approach: [
    {
      signalId:
        'problem_solving',
      weight: 0.6,
    },

    {
      signalId:
        'experimenting',
      weight: 0.5,
    },
  ],

  asked_for_help: [
    {
      signalId:
        'communicating',
      weight: 0.4,
    },

    {
      signalId:
        'collaborating',
      weight: 0.35,
    },
  ],

  // "Mostly easy" is useful reflection context,
  // but it does not provide enough evidence for a Growth signal.
  mostly_easy: [],
}


const challengeResponseLabels = {
  kept_trying:
    'Kept trying',

  changed_approach:
    'Tried a different idea',

  asked_for_help:
    'Asked for help',

  mostly_easy:
    'It was mostly easy',
}


const createSessionId =
  () =>
    [
      'researched_journey',
      Date.now(),
      Math.random()
        .toString(36)
        .slice(2, 8),
    ].join('_')


const inferDomainId =
  (journeyItem) => {
    const researched =
      journeyItem
        ?.researchedExperience

    const source =
      researched
        ?.sourceResource ||
      {}

    const text = [
      journeyItem?.title,
      researched?.mission,
      researched?.whyItFits,
      ...(researched?.practices || []),
      source?.title,
      source?.provider,
      ...(source?.topics || []),
      ...(source?.skills || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const mappings = [
      {
        id:
          'technology_robotics',

        terms: [
          'robot',
          'coding',
          'technology',
          'computer',
          'website',
          'game',
        ],
      },

      {
        id:
          'engineering_making',

        terms: [
          'engineering',
          'build',
          'maker',
          'vehicle',
          'design',
          'prototype',
        ],
      },

      {
        id:
          'science_discovery',

        terms: [
          'science',
          'experiment',
          'variables',
          'investigate',
          'discovery',
        ],
      },

      {
        id:
          'health_human_body',

        terms: [
          'health',
          'human body',
          'medicine',
          'medical',
        ],
      },

      {
        id:
          'creative_arts_storytelling',

        terms: [
          'story',
          'animation',
          'art',
          'creative',
          'drawing',
        ],
      },

      {
        id:
          'nature_environment',

        terms: [
          'nature',
          'environment',
          'animal',
          'plant',
        ],
      },

      {
        id:
          'business_entrepreneurship',

        terms: [
          'business',
          'entrepreneur',
          'customer',
          'selling',
        ],
      },

      {
        id:
          'people_society',

        terms: [
          'people',
          'career',
          'communication',
          'leadership',
          'society',
        ],
      },
    ]

    return (
      mappings.find(
        (mapping) =>
          mapping.terms.some(
            (term) =>
              text.includes(
                term
              )
          )
      )?.id ||
      null
    )
  }


// ============================================================
// PUBLIC API
// ============================================================

export const buildResearchedJourneyEvidence =
  ({
    childId,
    journeyItem,
    reflection = {},
  } = {}) => {
    if (
      !childId ||
      !journeyItem
        ?.researchedExperience
    ) {
      return []
    }

    const response =
      reflection
        ?.challengeResponse

    const evidence =
      challengeEvidenceMap[
        response
      ] ||
      []

    if (
      evidence.length === 0
    ) {
      return []
    }

    const domainId =
      inferDomainId(
        journeyItem
      )

    const sessionId =
      createSessionId()

    return [
      createEvidenceEvent({
        childId,

        source: {
          type:
            evidenceSourceTypes
              .REFLECTION,

          experienceId:
            journeyItem
              .experienceId,

          questionId:
            'researched_journey_challenge_response',

          responseId:
            response,
        },

        evidence,

        context: {
          domainId,
          sessionId,
        },

        metadata: {
          questionText:
            'When something was difficult, what did you usually do?',

          responseText:
            challengeResponseLabels[
              response
            ] ||
            response,

          journeyId:
            journeyItem.id,

          researchedExperience:
            true,

          researchStrategy:
            journeyItem
              .researchedExperience
              ?.strategy ||
            null,

          sourceProvider:
            journeyItem
              .researchedExperience
              ?.sourceResource
              ?.provider ||
            null,

          sourceResourceId:
            journeyItem
              .researchedExperience
              ?.sourceResource
              ?.resourceId ||
            null,

          evidenceRole:
            'kid_reflection',

          evidenceStrength:
            'moderate',
        },
      }),
    ]
  }


export default {
  buildResearchedJourneyEvidence,
}
