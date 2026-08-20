// src/intelligence/learningIntentEngine.js
import { learningSupportIntents } from './unifiedJourneyModels'

export const learningHelpModeOptions = Object.freeze([
  { id: 'understand', label: 'Help me understand', description: 'Explain the idea clearly and help me make sense of it.', resourceIntent: learningSupportIntents.UNDERSTAND },
  { id: 'example', label: 'Show me an example', description: 'Walk through a similar example without simply giving me my answer.', resourceIntent: learningSupportIntents.UNDERSTAND },
  { id: 'practice', label: 'Give me practice', description: 'Help me build confidence with practice at the right level.', resourceIntent: learningSupportIntents.PRACTICE },
  { id: 'review', label: 'Help me review', description: 'Organize what I should review for a quiz, test, or assignment.', resourceIntent: learningSupportIntents.REVIEW },
  { id: 'research', label: 'Help me research', description: 'Find credible information and resources for a topic or project.', resourceIntent: learningSupportIntents.RESEARCH },
  { id: 'get_unstuck', label: "I'm stuck", description: 'Help me figure out the next step without doing the work for me.', resourceIntent: learningSupportIntents.UNDERSTAND },
  { id: 'enrich', label: 'I want to go further', description: 'Give me something more challenging or interesting to explore.', resourceIntent: learningSupportIntents.ENRICH },
])

export function createLearningSupportRequest({ journeyItem, modeId, studentNote = '' } = {}) {
  if (!journeyItem?.id) throw new Error('Learning support request requires a Journey item.')
  const mode = learningHelpModeOptions.find((option) => option.id === modeId)
  if (!mode) throw new Error('Learning support request requires a valid help mode.')
  return {
    id: `learning_support_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    journeyId: journeyItem.id,
    childId: journeyItem.childId,
    path: journeyItem.path,
    activityType: journeyItem.activityType,
    subject: journeyItem.subject || null,
    topic: journeyItem.topic || null,
    title: journeyItem.title,
    helpMode: mode.id,
    helpLabel: mode.label,
    learningIntent: mode.resourceIntent,
    studentNote: studentNote?.trim?.() || '',
    status: 'ready_for_resources',
    createdAt: new Date().toISOString(),
  }
}
