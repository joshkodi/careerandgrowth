// src/intelligence/learningResearchStrategyGenerator.js

import {
  researchPurposes,
  researchBriefStatuses,
} from './researchStrategyGenerator'

export const learningResearchBriefVersion = '0.8.5'

const unique = (values = []) => [...new Set(values.filter(Boolean))]
const humanize = (value = '') => String(value).replaceAll('_', ' ').trim()

export const buildLearningResearchBrief = ({
  journeyItem,
  supportRequest,
  childProfile = {},
} = {}) => {
  if (!journeyItem?.id || !supportRequest?.id) return null

  const subject = journeyItem.subject || null
  const topic = journeyItem.topic || journeyItem.title || null
  const learningIntent = supportRequest.learningIntent || 'understand'
  const studentNote = supportRequest.studentNote || ''

  return {
    id: `learning_brief_${supportRequest.id}`,
    version: learningResearchBriefVersion,
    status: researchBriefStatuses.READY,
    purpose: researchPurposes.GUIDED_LEARNING,
    strategy: learningIntent,
    strategyLabel: supportRequest.helpLabel || humanize(learningIntent),

    audience: {
      age: childProfile?.age || null,
      ageBracket: null,
      grade: childProfile?.grade || null,
    },

    learningContext: {
      journeyId: journeyItem.id,
      activityType: journeyItem.activityType || null,
      source: journeyItem.source || null,
      subject,
      topic,
      dueDate: journeyItem.dueDate || null,
      estimatedTime: journeyItem.estimatedTime || null,
      helpMode: supportRequest.helpMode || null,
      learningIntent,
      studentNote,
    },

    anchorStrengths: [],
    developmentOpportunities: [],
    explorationContext: unique([subject, topic]),

    intent: {
      student: {
        sourceText: studentNote ? [studentNote] : [],
        structuredIntent: unique([learningIntent, subject, topic]),
      },
      parent: {
        sourceText: [],
        structuredIntent: [],
      },
    },

    constraints: {
      developmentalFit: 'Age- and grade-appropriate learning support.',
      safety: 'Use child-appropriate, safe educational resources.',
      resourceQuality: 'Prefer credible educational providers and clear instructional content.',
      personalization: 'Match the stated learning intent and specific student difficulty.',
      journeyNovelty: null,
    },

    researchObjective:
      `${supportRequest.helpLabel || humanize(learningIntent)} — ${subject || 'Learning'}: ${topic || journeyItem.title}`,

    evidenceObjective:
      'Support learning first. Do not infer a strength or weakness merely because help was requested.',

    createdAt: new Date().toISOString(),
  }
}

export default {
  learningResearchBriefVersion,
  buildLearningResearchBrief,
}
