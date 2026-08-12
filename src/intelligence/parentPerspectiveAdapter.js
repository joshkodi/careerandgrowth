// src/intelligence/parentPerspectiveAdapter.js

//
// Career & Growth — MVP v0.3
// Parent Perspective
//
// Parent input is OBSERVATIONAL evidence.
//
// It should:
// - complement child self-report
// - never overwrite child evidence
// - remain moderately weighted
// - focus on behaviors parents can actually observe
//
// It should NOT ask parents:
// - what career the child should pursue
// - what the child "is"
// - to diagnose personality
//

export const parentPerspectiveQuestions = [
  {
    id: 'deep_interest',

    question:
      'When your child becomes interested in something, what do you usually notice?',

    answers: [
      {
        id: 'understand',

        label:
          '🔍 Wants to understand how it works',

        evidence: [
          {
            signalId: 'curiosity',
            weight: 0.8,
          },
          {
            signalId: 'analytical_thinking',
            weight: 0.5,
          },
        ],
      },

      {
        id: 'build',

        label:
          '🛠️ Starts building, changing, or experimenting with it',

        evidence: [
          {
            signalId: 'hands_on',
            weight: 0.8,
          },
          {
            signalId: 'experimenting',
            weight: 0.6,
          },
          {
            signalId: 'creating',
            weight: 0.4,
          },
        ],
      },

      {
        id: 'imagine',

        label:
          '💡 Comes up with new ideas around it',

        evidence: [
          {
            signalId: 'creative_thinking',
            weight: 0.8,
          },
          {
            signalId: 'creating',
            weight: 0.5,
          },
        ],
      },

      {
        id: 'share',

        label:
          '💬 Wants to explain or involve other people',

        evidence: [
          {
            signalId: 'communicating',
            weight: 0.7,
          },
          {
            signalId: 'collaborating',
            weight: 0.5,
          },
        ],
      },
    ],
  },

  {
    id: 'difficulty',

    question:
      'When something is difficult, what does your child usually do?',

    answers: [
      {
        id: 'keep_trying',

        label:
          '🌱 Keeps trying different approaches',

        evidence: [
          {
            signalId: 'persistence',
            weight: 0.9,
          },
          {
            signalId: 'problem_solving',
            weight: 0.6,
          },
        ],
      },

      {
        id: 'investigate',

        label:
          '🔎 Tries to figure out what is going wrong',

        evidence: [
          {
            signalId: 'problem_solving',
            weight: 0.8,
          },
          {
            signalId: 'analytical_thinking',
            weight: 0.6,
          },
        ],
      },

      {
        id: 'ask_help',

        label:
          '🤝 Looks for help or works with someone',

        evidence: [
          {
            signalId: 'collaborating',
            weight: 0.7,
          },
          {
            signalId: 'communicating',
            weight: 0.4,
          },
        ],
      },

      {
        id: 'move_on',

        label:
          '➡️ Often prefers to move to something else',

        evidence: [
          {
            signalId: 'persistence',
            weight: -0.3,
          },
        ],
      },
    ],
  },

  {
    id: 'free_choice',

    question:
      'What does your child often choose to do without being prompted?',

    answers: [
      {
        id: 'make',

        label:
          '🧱 Build, make, or take things apart',

        evidence: [
          {
            signalId: 'hands_on',
            weight: 0.8,
          },
          {
            signalId: 'creating',
            weight: 0.6,
          },
        ],

        domainId:
          'engineering_making',
      },

      {
        id: 'explore',

        label:
          '🔬 Explore, investigate, or learn how something works',

        evidence: [
          {
            signalId: 'curiosity',
            weight: 0.8,
          },
          {
            signalId: 'experimenting',
            weight: 0.5,
          },
        ],

        domainId:
          'science_discovery',
      },

      {
        id: 'create',

        label:
          '🎨 Draw, write, imagine, or create',

        evidence: [
          {
            signalId: 'creative_thinking',
            weight: 0.8,
          },
          {
            signalId: 'creating',
            weight: 0.8,
          },
        ],

        domainId:
          'creative_arts_storytelling',
      },

      {
        id: 'people',

        label:
          '🤝 Spend time helping, talking with, or organizing people',

        evidence: [
          {
            signalId: 'helping',
            weight: 0.7,
          },
          {
            signalId: 'communicating',
            weight: 0.5,
          },
        ],

        domainId:
          'people_society',
      },
    ],
  },

  {
    id: 'problem_style',

    question:
      'When solving a problem, what approach do you see most often?',

    answers: [
      {
        id: 'logical',

        label:
          '🧩 Works through it step by step',

        evidence: [
          {
            signalId: 'problem_solving',
            weight: 0.8,
          },
          {
            signalId: 'analytical_thinking',
            weight: 0.7,
          },
        ],
      },

      {
        id: 'try',

        label:
          '🧪 Tries things until something works',

        evidence: [
          {
            signalId: 'experimenting',
            weight: 0.8,
          },
          {
            signalId: 'problem_solving',
            weight: 0.5,
          },
        ],
      },

      {
        id: 'invent',

        label:
          '💡 Thinks of an unusual or creative solution',

        evidence: [
          {
            signalId: 'creative_thinking',
            weight: 0.8,
          },
          {
            signalId: 'problem_solving',
            weight: 0.5,
          },
        ],
      },

      {
        id: 'together',

        label:
          '👥 Likes solving it with other people',

        evidence: [
          {
            signalId: 'collaborating',
            weight: 0.8,
          },
          {
            signalId: 'communicating',
            weight: 0.4,
          },
        ],
      },
    ],
  },

  {
    id: 'motivation',

    question:
      'What seems to motivate your child most?',

    answers: [
      {
        id: 'discover',

        label:
          '🔭 Discovering or understanding something new',

        evidence: [
          {
            signalId: 'curiosity',
            weight: 0.8,
          },
        ],
      },

      {
        id: 'create',

        label:
          '✨ Making something of their own',

        evidence: [
          {
            signalId: 'creating',
            weight: 0.8,
          },
          {
            signalId: 'creative_thinking',
            weight: 0.5,
          },
        ],
      },

      {
        id: 'help',

        label:
          '❤️ Helping or doing something useful for others',

        evidence: [
          {
            signalId: 'helping',
            weight: 0.9,
          },
        ],
      },

      {
        id: 'master',

        label:
          '🏆 Getting better at something challenging',

        evidence: [
          {
            signalId: 'challenge_seeking',
            weight: 0.7,
          },
          {
            signalId: 'persistence',
            weight: 0.6,
          },
        ],
      },
    ],
  },

  {
    id: 'social_style',

    question:
      'When working with others, what do you most often notice?',

    answers: [
      {
        id: 'lead',

        label:
          '🧭 Often takes the lead',

        evidence: [
          {
            signalId: 'leading',
            weight: 0.8,
          },
          {
            signalId: 'communicating',
            weight: 0.4,
          },
        ],
      },

      {
        id: 'team',

        label:
          '🤝 Enjoys contributing as part of the team',

        evidence: [
          {
            signalId: 'collaborating',
            weight: 0.8,
          },
        ],
      },

      {
        id: 'explain',

        label:
          '💬 Likes explaining ideas to others',

        evidence: [
          {
            signalId: 'communicating',
            weight: 0.8,
          },
        ],
      },

      {
        id: 'independent',

        label:
          '🧠 Usually prefers working independently',

        evidence: [
          {
            signalId: 'collaborating',
            weight: -0.2,
          },
          {
            signalId: 'persistence',
            weight: 0.3,
          },
        ],
      },
    ],
  },
]


//
// Parent observations receive a modest confidence adjustment.
//
// Parent reports are valuable evidence, but they should not
// outweigh either:
// - repeated child behavior
// - repeated experiences
//

const PARENT_EVIDENCE_MULTIPLIER = 0.85


export function getParentObservationEvidence(answer) {
  if (!answer?.evidence) {
    return []
  }

  return answer.evidence.map(
    (item) => ({
      signalId:
        item.signalId,

      weight:
        Math.max(
          -1,
          Math.min(
            1,
            item.weight *
              PARENT_EVIDENCE_MULTIPLIER
          )
        ),
    })
  )
}


export function getParentObservationDomainId(answer) {
  return answer?.domainId || null
}


export function getParentQuestionById(questionId) {
  return (
    parentPerspectiveQuestions.find(
      (question) =>
        question.id === questionId
    ) || null
  )
}


export function getParentAnswerById(
  question,
  answerId
) {
  return (
    question?.answers?.find(
      (answer) =>
        answer.id === answerId
    ) || null
  )
}