import { createEvidenceEvent } from './evidenceEngine'
import { evidenceSourceTypes } from '../data/growthTaxonomy'

const EXPLORATION_PATTERNS = [
  /\bi(?:'m| am) curious about\s+(.+?)(?:[.!?]|$)/i,
  /\bi want to (?:learn|know|understand) (?:more )?about\s+(.+?)(?:[.!?]|$)/i,
  /\bi(?:'m| am) interested in\s+(.+?)(?:[.!?]|$)/i,
]

function cleanTopic(value = '') {
  return String(value)
    .replace(/^(the|a|an)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
}

export function extractCompanionExploration(message = '') {
  const text = String(message || '').trim()
  if (!text) return null

  for (const pattern of EXPLORATION_PATTERNS) {
    const match = text.match(pattern)
    const topic = cleanTopic(match?.[1] || '')
    if (topic) {
      return {
        topic,
        explicit: true,
        signalId: 'curiosity',
        weight: 0.15,
      }
    }
  }

  return null
}

export function buildCompanionExplorationEvidence({
  childId,
  message,
  sessionId = null,
  activeTopic = null,
  isFollowUp = false,
} = {}) {
  const explicitExploration = extractCompanionExploration(message)
  const followUpTopic = isFollowUp ? cleanTopic(activeTopic || '') : ''
  const exploration = explicitExploration || (
    followUpTopic
      ? {
          topic: followUpTopic,
          explicit: false,
          signalId: 'curiosity',
          weight: 0.1,
        }
      : null
  )

  if (!childId || !exploration) return null

  return createEvidenceEvent({
    childId,
    source: {
      type: evidenceSourceTypes.COMPANION_EXPLORATION,
      experienceId: 'synapstride_companion',
      questionId: null,
      responseId: null,
    },
    evidence: [
      {
        signalId: exploration.signalId,
        weight: exploration.weight,
      },
    ],
    context: {
      sessionId,
    },
    metadata: {
      label: exploration.topic,
      topic: exploration.topic,
      childMessage: String(message).trim().slice(0, 300),
      evidenceStrength: 'weak',
      evidenceMeaning: exploration.explicit
        ? 'explicit_child_exploration'
        : 'companion_follow_up_exploration',
      identityClaim: false,
    },
  })
}
