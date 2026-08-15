// src/intelligence/guidedAdventureParentObservationAdapter.js

export const guidedAdventureParentObservationQuestions = [
  {
    id: 'engagement',
    question:
      'While your child was doing the activity, what did you notice about their engagement?',
    answers: [
      {
        id: 'very_engaged',
        label:
          '🌟 Stayed very engaged and wanted to keep going',
        evidence: [
          { signalId: 'enjoyment', weight: 0.7 },
          { signalId: 'persistence', weight: 0.5 },
        ],
      },
      {
        id: 'engaged',
        label:
          '🙂 Seemed interested for most of the activity',
        evidence: [
          { signalId: 'enjoyment', weight: 0.45 },
        ],
      },
      {
        id: 'mixed',
        label:
          '🤔 Interest came and went depending on the step',
        evidence: [
          { signalId: 'enjoyment', weight: 0.1 },
        ],
      },
      {
        id: 'low',
        label:
          '↘️ Seemed ready to move on fairly quickly',
        evidence: [
          { signalId: 'enjoyment', weight: -0.3 },
        ],
      },
    ],
  },

  {
    id: 'difficulty_response',
    question:
      'When something was difficult or unclear, what did you most often observe?',
    answers: [
      {
        id: 'kept_trying',
        label:
          '🔄 Tried another approach or kept working at it',
        evidence: [
          { signalId: 'persistence', weight: 0.8 },
          { signalId: 'problem_solving', weight: 0.5 },
        ],
      },
      {
        id: 'investigated',
        label:
          '🔎 Tried to figure out what was going wrong',
        evidence: [
          { signalId: 'problem_solving', weight: 0.7 },
          { signalId: 'analytical_thinking', weight: 0.5 },
        ],
      },
      {
        id: 'asked_help',
        label:
          '🤝 Asked for help or wanted to solve it together',
        evidence: [
          { signalId: 'collaborating', weight: 0.6 },
          { signalId: 'communicating', weight: 0.4 },
        ],
      },
      {
        id: 'frustrated',
        label:
          '😕 Became frustrated and preferred to stop or switch',
        evidence: [
          { signalId: 'persistence', weight: -0.25 },
        ],
      },
    ],
  },

  {
    id: 'work_style',
    question:
      'What did you notice about how your child approached the building/design part?',
    answers: [
      {
        id: 'hands_on',
        label:
          '🛠️ Wanted to make, draw, change, or physically try ideas',
        evidence: [
          { signalId: 'hands_on', weight: 0.75 },
          { signalId: 'creating', weight: 0.45 },
        ],
      },
      {
        id: 'plan_first',
        label:
          '🧠 Thought through the idea carefully before changing things',
        evidence: [
          { signalId: 'analytical_thinking', weight: 0.65 },
          { signalId: 'problem_solving', weight: 0.45 },
        ],
      },
      {
        id: 'many_ideas',
        label:
          '💡 Came up with several different ideas or possibilities',
        evidence: [
          { signalId: 'creative_thinking', weight: 0.75 },
          { signalId: 'creating', weight: 0.45 },
        ],
      },
      {
        id: 'worked_together',
        label:
          '👥 Preferred talking through the activity with someone else',
        evidence: [
          { signalId: 'collaborating', weight: 0.65 },
          { signalId: 'communicating', weight: 0.45 },
        ],
      },
    ],
  },
]

const PARENT_ADVENTURE_OBSERVATION_MULTIPLIER = 0.8

export function getGuidedParentObservationEvidence(
  answer
) {
  if (!answer?.evidence) {
    return []
  }

  return answer.evidence
    .map(
      (item) => ({
        signalId:
          item.signalId,

        weight:
          Math.max(
            -1,
            Math.min(
              1,
              item.weight *
                PARENT_ADVENTURE_OBSERVATION_MULTIPLIER
            )
          ),
      })
    )
    .filter(
      (item) =>
        item.weight !== 0
    )
}
