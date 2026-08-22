// src/intelligence/intelligenceRecommendationLoopValidationScenarios.js

// ============================================================
// Career & Growth — MVP v0.8.11
// Intelligence & Recommendation Loop — Validation Scenarios
//
// Synthetic fixtures only. These do not represent user data and
// do not write to Journey, evidence, or localStorage.
// ============================================================

import {
  evidenceSourceTypes,
} from '../data/growthTaxonomy'

import {
  journeyPaths,
  journeyStatuses,
  journeyActivityTypes,
  journeySources,
} from './unifiedJourneyModels'


const timestamp =
  '2026-08-21T12:00:00.000Z'


const evidenceEvent = ({
  id,
  childId,
  sourceType,
  experienceId = null,
  signalId,
  weight = 0.8,
  responseText = '',
}) => ({
  id,
  childId,
  createdAt: timestamp,
  source: {
    type: sourceType,
    experienceId,
  },
  evidence: [
    {
      signalId,
      weight,
    },
  ],
  metadata: {
    responseText:
      responseText || signalId,
  },
})


const schoolItem = ({
  id,
  childId,
  title,
  subject,
  topic,
  status,
  outcomeType = null,
  learningSignals = [],
  createdAt = timestamp,
  updatedAt = timestamp,
}) => ({
  id,
  childId,
  modelVersion: '0.8.0',
  path:
    journeyPaths.SCHOOL_LEARNING,
  activityType:
    journeyActivityTypes.HOMEWORK,
  source:
    journeySources.SCHOOL,
  title,
  subject,
  topic,
  status,
  createdAt,
  updatedAt,
  learningSupportRequest:
    outcomeType
      ? {
          outcome: {
            outcomeType,
          },
        }
      : null,
  learningIntelligence: {
    signals: learningSignals,
  },
})


const childId =
  'validation_child_0811'


export const intelligenceRecommendationLoopValidationScenarios = [
  {
    id: 'support_now',
    label:
      'Support wins when current learning needs help',
    expectedIntent: 'support',
    input: {
      childId,
      age: 11,
      journeyItems: [
        schoolItem({
          id: 'fractions_help_1',
          childId,
          title:
            'Fractions Homework',
          subject: 'Math',
          topic: 'Fractions',
          status:
            journeyStatuses.NEED_HELP,
        }),
      ],
    },
  },

  {
    id: 'practice_after_help',
    label:
      'Practice follows a resolved support cycle',
    expectedIntent: 'practice',
    input: {
      childId,
      age: 11,
      journeyItems: [
        schoolItem({
          id: 'fractions_resolved_1',
          childId,
          title:
            'Fractions Homework',
          subject: 'Math',
          topic: 'Fractions',
          status:
            journeyStatuses.IN_PROGRESS,
          outcomeType: 'resolved',
          createdAt:
            '2026-08-20T12:00:00.000Z',
          updatedAt:
            '2026-08-20T13:00:00.000Z',
        }),
      ],
    },
  },

  {
    id: 'deepen_cross_source',
    label:
      'Deepen requires corroborated cross-source growth evidence',
    expectedIntent: 'deepen',
    expectedPromotedPattern:
      'problem_solving',
    input: {
      childId,
      age: 11,
      evidenceEvents: [
        evidenceEvent({
          id: 'discovery_problem_solving',
          childId,
          sourceType:
            evidenceSourceTypes.DISCOVERY,
          signalId:
            'problem_solving',
          weight: 0.9,
          responseText:
            'I like figuring out hard problems.',
        }),
        evidenceEvent({
          id: 'parent_problem_solving',
          childId,
          sourceType:
            evidenceSourceTypes.PARENT_OBSERVATION,
          experienceId:
            'parent_perspective',
          signalId:
            'problem_solving',
          weight: 0.8,
          responseText:
            'Keeps trying different ways to solve things.',
        }),
        evidenceEvent({
          id: 'adventure_problem_solving',
          childId,
          sourceType:
            evidenceSourceTypes.ADVENTURE_QUESTION,
          experienceId:
            'robotics',
          signalId:
            'problem_solving',
          weight: 0.9,
          responseText:
            'Changed the design after the first attempt failed.',
        }),
      ],
    },
  },

  {
    id: 'school_only_not_deepen',
    label:
      'Repeated school signals cannot promote a holistic pattern',
    expectedIntentNot: 'deepen',
    expectedEligiblePatternCount: 0,
    input: {
      childId,
      age: 11,
      journeyItems: [
        schoolItem({
          id: 'school_resolution_1',
          childId,
          title: 'Math Practice 1',
          subject: 'Math',
          topic: 'Fractions',
          status:
            journeyStatuses.COMPLETED,
          learningSignals: [
            {
              type:
                'learning_resolution',
              direction: 'positive',
              strength: 0.8,
              rationale:
                'Resolved after guided support.',
            },
          ],
        }),
        schoolItem({
          id: 'school_resolution_2',
          childId,
          title: 'Math Practice 2',
          subject: 'Math',
          topic: 'Decimals',
          status:
            journeyStatuses.COMPLETED,
          learningSignals: [
            {
              type:
                'learning_resolution',
              direction: 'positive',
              strength: 0.8,
              rationale:
                'Resolved after trying a new example.',
            },
          ],
        }),
        schoolItem({
          id: 'school_resolution_3',
          childId,
          title: 'Science Practice',
          subject: 'Science',
          topic: 'Energy',
          status:
            journeyStatuses.COMPLETED,
          learningSignals: [
            {
              type:
                'learning_resolution',
              direction: 'positive',
              strength: 0.8,
              rationale:
                'Resolved after reviewing a resource.',
            },
          ],
        }),
      ],
    },
  },

  {
    id: 'explore_without_stronger_signal',
    label:
      'Explore is the safe fallback without support or promoted patterns',
    expectedIntent: 'explore',
    input: {
      childId,
      age: 11,
      evidenceEvents: [],
      journeyItems: [],
      studentIntents: [],
      parentIntents: [],
      completedExperienceIds: [],
    },
  },
]


export default {
  intelligenceRecommendationLoopValidationScenarios,
}
