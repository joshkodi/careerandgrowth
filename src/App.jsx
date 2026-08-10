import { useState } from 'react'
import './App.css'

import { explorations } from './data/explorations'

import {
  evidenceSourceTypes,
} from './data/growthTaxonomy'

import {
  createEvidenceEvent,
} from './intelligence/evidenceEngine'

import {
  buildGrowthProfile,
  getTopTraits,
  getTopDomains,
  getTopPathways,
  getTopCareerFamilies,
} from './intelligence/growthEngine'

import {
  appendEvidenceEvents,
  getEvidenceEvents,
  saveGrowthProfile,
} from './storage/growthStorage'

import {
  getChallengeEvidence,
  getReflectionEvidence,
  getEnjoymentEvidence,
  getCompletionEvidence,
  getExplorationDomainId,
} from './intelligence/legacyEvidenceAdapter'

import {
  getDiscoveryEvidence,
  getDiscoveryDomainId,
} from './intelligence/discoveryEvidenceAdapter'


// ============================================================
// DISCOVERY QUESTIONS
// ============================================================

const discoveryQuestions = {
  explorer: [
    {
      id: 'free_time',
      shortLabel: 'Free-time choice',
      question:
        'You have lots of free time today. What sounds the most fun?',
      answers: [
        {
          id: 'experiment',
          label: '🧪 Try a fun experiment',
          signals: ['science', 'investigating'],
        },
        {
          id: 'build',
          label: '🧱 Build something awesome',
          signals: ['building', 'creating'],
        },
        {
          id: 'animals',
          label: '🐶 Spend time with animals',
          signals: ['animals', 'helping'],
        },
        {
          id: 'art',
          label: '🎨 Draw, make music, or create',
          signals: ['arts', 'creating'],
        },
      ],
    },
    {
      id: 'curious_place',
      shortLabel: 'Explore somewhere',
      question:
        'Which place would you most like to explore?',
      answers: [
        {
          id: 'space',
          label: '🚀 Outer space',
          signals: ['space', 'discovery'],
        },
        {
          id: 'ocean',
          label: '🐠 Under the ocean',
          signals: ['nature', 'animals'],
        },
        {
          id: 'lab',
          label: '🔬 A science lab',
          signals: ['science', 'investigating'],
        },
        {
          id: 'studio',
          label: '🎬 A movie or art studio',
          signals: ['arts', 'creating'],
        },
      ],
    },
    {
      id: 'broken',
      shortLabel: 'Solve a problem',
      question:
        'Your favorite toy stops working. What would you like to do?',
      answers: [
        {
          id: 'inspect',
          label:
            '🔍 Look closely to see what happened',
          signals: [
            'investigating',
            'problem_solving',
          ],
        },
        {
          id: 'fix',
          label: '🔧 Try to fix it',
          signals: [
            'building',
            'problem_solving',
          ],
        },
        {
          id: 'new',
          label: '💡 Think of a better version',
          signals: [
            'creating',
            'problem_solving',
          ],
        },
        {
          id: 'together',
          label:
            '🤝 Ask someone to help fix it',
          signals: [
            'collaborating',
            'helping',
          ],
        },
      ],
    },
    {
      id: 'super_skill',
      shortLabel: 'Super skill',
      question:
        'If you could be amazing at one thing, what would you pick?',
      answers: [
        {
          id: 'discover',
          label:
            '🔬 Discovering how things work',
          signals: ['science', 'discovery'],
        },
        {
          id: 'make',
          label: '🛠️ Making cool things',
          signals: ['building', 'creating'],
        },
        {
          id: 'people',
          label:
            '💬 Helping and talking with people',
          signals: ['people', 'helping'],
        },
        {
          id: 'perform',
          label:
            '🎭 Performing or creating stories',
          signals: [
            'arts',
            'communicating',
          ],
        },
      ],
    },
    {
      id: 'team',
      shortLabel: 'Team role',
      question:
        'Your friends are making something together. What sounds fun to you?',
      answers: [
        {
          id: 'idea',
          label: '💡 Think of the big idea',
          signals: ['creating', 'leading'],
        },
        {
          id: 'make',
          label: '🛠️ Help make it',
          signals: [
            'building',
            'collaborating',
          ],
        },
        {
          id: 'organize',
          label:
            '📋 Help everyone know what to do',
          signals: ['organizing', 'leading'],
        },
        {
          id: 'show',
          label:
            '🎤 Show everyone what you made',
          signals: [
            'communicating',
            'people',
          ],
        },
      ],
    },
    {
      id: 'create',
      shortLabel: 'Make something',
      question:
        'Which would you most like to make?',
      answers: [
        {
          id: 'robot',
          label: '🤖 A helpful robot',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'game',
          label: '🎮 Your own game',
          signals: [
            'technology',
            'creating',
          ],
        },
        {
          id: 'story',
          label: '📖 A story or video',
          signals: [
            'arts',
            'communicating',
          ],
        },
        {
          id: 'community',
          label:
            '🌱 Something that helps people nearby',
          signals: ['helping', 'impact'],
        },
      ],
    },
    {
      id: 'help',
      shortLabel: 'Help with something',
      question:
        'What would you most like to help with?',
      answers: [
        {
          id: 'health',
          label:
            '❤️ Helping someone feel better',
          signals: ['health', 'helping'],
        },
        {
          id: 'animals',
          label: '🐾 Helping animals',
          signals: ['animals', 'helping'],
        },
        {
          id: 'planet',
          label: '🌎 Helping the planet',
          signals: ['nature', 'impact'],
        },
        {
          id: 'discover',
          label:
            '🔭 Discovering something new',
          signals: ['science', 'discovery'],
        },
      ],
    },
    {
      id: 'adventure',
      shortLabel: 'Choose an adventure',
      question:
        'Which adventure sounds the most exciting?',
      answers: [
        {
          id: 'doctor',
          label:
            '🩺 Solve a health mystery',
          signals: [
            'health',
            'investigating',
          ],
        },
        {
          id: 'engineer',
          label:
            '🚀 Build something for space',
          signals: [
            'space',
            'technology',
            'building',
          ],
        },
        {
          id: 'wildlife',
          label:
            '🐯 Study animals in the wild',
          signals: [
            'animals',
            'nature',
            'discovery',
          ],
        },
        {
          id: 'creative',
          label:
            '🎬 Help make a movie or game',
          signals: ['arts', 'creating'],
        },
      ],
    },
  ],

  discoverer: [
    {
      id: 'free_time',
      shortLabel: 'Free Saturday',
      question:
        'You have a whole Saturday with nothing planned. What sounds the most fun?',
      answers: [
        {
          id: 'experiment',
          label: '🧪 Try a cool experiment',
          signals: [
            'science',
            'investigating',
          ],
        },
        {
          id: 'game',
          label:
            '🎮 Build something in a game',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'animals',
          label:
            '🐕 Spend time with animals',
          signals: ['animals', 'helping'],
        },
        {
          id: 'creative',
          label:
            '🎨 Draw, make music, or create something',
          signals: ['arts', 'creating'],
        },
      ],
    },
    {
      id: 'class_project',
      shortLabel: 'Class project',
      question:
        'Your class can choose one big project. Which would you pick?',
      answers: [
        {
          id: 'mars',
          label:
            '🚀 Design something for a Mars mission',
          signals: [
            'space',
            'technology',
            'building',
          ],
        },
        {
          id: 'brain',
          label:
            '🧠 Discover something about the human brain',
          signals: [
            'health',
            'science',
            'investigating',
          ],
        },
        {
          id: 'environment',
          label:
            '🌎 Find a way to protect the environment',
          signals: ['nature', 'impact'],
        },
        {
          id: 'movie',
          label:
            '🎬 Create a movie that tells an amazing story',
          signals: [
            'arts',
            'communicating',
            'creating',
          ],
        },
      ],
    },
    {
      id: 'broken',
      shortLabel: 'Something breaks',
      question:
        'Something you really like suddenly stops working. What would you want to do?',
      answers: [
        {
          id: 'inspect',
          label:
            "🔧 Take a closer look and figure out what's wrong",
          signals: [
            'investigating',
            'problem_solving',
          ],
        },
        {
          id: 'research',
          label:
            '📱 Research how it works and look for solutions',
          signals: [
            'investigating',
            'discovery',
          ],
        },
        {
          id: 'redesign',
          label:
            '💡 Imagine a better version and redesign it',
          signals: [
            'creating',
            'problem_solving',
          ],
        },
        {
          id: 'team',
          label:
            '🤝 Find someone and solve it together',
          signals: [
            'collaborating',
            'problem_solving',
          ],
        },
      ],
    },
    {
      id: 'instant_skill',
      shortLabel: 'Instant skill',
      question:
        'Imagine you could instantly become amazing at one thing. Which would you choose?',
      answers: [
        {
          id: 'science',
          label:
            '🔬 Understanding how the world works',
          signals: ['science', 'discovery'],
        },
        {
          id: 'tech',
          label:
            '💻 Building things with technology',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'creative',
          label:
            '🎨 Creating things people have never seen before',
          signals: ['arts', 'creating'],
        },
        {
          id: 'people',
          label:
            '💬 Understanding and connecting with people',
          signals: [
            'people',
            'communicating',
          ],
        },
      ],
    },
    {
      id: 'team_role',
      shortLabel: 'Team role',
      question:
        'Your friends decide to build something really cool together. Which role sounds most like you?',
      answers: [
        {
          id: 'idea',
          label:
            '💡 Come up with the big idea',
          signals: ['creating', 'leading'],
        },
        {
          id: 'build',
          label:
            '🛠️ Figure out how to build it',
          signals: [
            'building',
            'problem_solving',
          ],
        },
        {
          id: 'organize',
          label:
            '📋 Keep everyone organized and moving',
          signals: ['organizing', 'leading'],
        },
        {
          id: 'present',
          label:
            '🎤 Show everyone what you created',
          signals: [
            'communicating',
            'people',
          ],
        },
      ],
    },
    {
      id: 'make',
      shortLabel: 'Make something',
      question:
        'If you could make one of these today, which would you choose?',
      answers: [
        {
          id: 'robot',
          label:
            '🤖 A robot that can do something useful',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'game',
          label: '🎮 Your own game',
          signals: [
            'technology',
            'creating',
          ],
        },
        {
          id: 'story',
          label:
            '📖 A story, comic, or video',
          signals: [
            'arts',
            'communicating',
          ],
        },
        {
          id: 'community',
          label:
            '🌱 Something that makes your neighborhood better',
          signals: ['impact', 'helping'],
        },
      ],
    },
    {
      id: 'problem',
      shortLabel: 'Make a difference',
      question:
        'Which problem would you be most excited to help solve?',
      answers: [
        {
          id: 'health',
          label:
            '🩺 Helping people stay healthy',
          signals: ['health', 'helping'],
        },
        {
          id: 'animals',
          label:
            '🐾 Protecting animals and wildlife',
          signals: [
            'animals',
            'nature',
            'helping',
          ],
        },
        {
          id: 'planet',
          label:
            '🌎 Making the planet healthier',
          signals: ['nature', 'impact'],
        },
        {
          id: 'unknown',
          label:
            '🚀 Discovering something nobody knows yet',
          signals: ['science', 'discovery'],
        },
      ],
    },
    {
      id: 'day_with',
      shortLabel: 'See someone work',
      question:
        "You get to spend an entire day seeing someone's work. Which adventure would you choose?",
      answers: [
        {
          id: 'doctor',
          label:
            '🩺 Help a doctor solve a medical mystery',
          signals: [
            'health',
            'investigating',
            'helping',
          ],
        },
        {
          id: 'engineer',
          label:
            '🚀 Join an engineer designing something for space',
          signals: [
            'space',
            'technology',
            'building',
          ],
        },
        {
          id: 'wildlife',
          label:
            '🐅 Follow a wildlife scientist studying animals',
          signals: [
            'animals',
            'nature',
            'discovery',
          ],
        },
        {
          id: 'creative',
          label:
            '🎬 Join a creative team making a movie or game',
          signals: [
            'arts',
            'creating',
            'collaborating',
          ],
        },
      ],
    },
  ],

  pathfinder: [
    {
      id: 'free_time',
      shortLabel: 'Free weekend',
      question:
        'You suddenly have a free weekend. Which sounds most worthwhile?',
      answers: [
        {
          id: 'learn',
          label:
            '🔬 Dive into a topic I am curious about',
          signals: [
            'science',
            'investigating',
            'discovery',
          ],
        },
        {
          id: 'build',
          label:
            '💻 Build or experiment with technology',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'create',
          label:
            '🎨 Create something original',
          signals: ['arts', 'creating'],
        },
        {
          id: 'people',
          label:
            '🤝 Spend time helping or working with people',
          signals: ['people', 'helping'],
        },
      ],
    },
    {
      id: 'project',
      shortLabel: 'Lead a project',
      question:
        'You can lead one semester-long project. Which would you choose?',
      answers: [
        {
          id: 'engineering',
          label:
            '🚀 Design a solution to a difficult technical problem',
          signals: [
            'technology',
            'problem_solving',
            'building',
          ],
        },
        {
          id: 'health',
          label:
            '🧬 Investigate a health or biology question',
          signals: [
            'health',
            'science',
            'investigating',
          ],
        },
        {
          id: 'business',
          label:
            '💡 Launch a small business or new idea',
          signals: [
            'business',
            'leading',
            'achievement',
          ],
        },
        {
          id: 'impact',
          label:
            '🌎 Solve a problem affecting my community',
          signals: [
            'impact',
            'people',
            'helping',
          ],
        },
      ],
    },
    {
      id: 'new_technology',
      shortLabel: 'New technology',
      question:
        "You're given a technology you've never used before. What sounds most interesting?",
      answers: [
        {
          id: 'inside',
          label:
            '🔍 Understand how it works internally',
          signals: [
            'investigating',
            'technology',
          ],
        },
        {
          id: 'solve',
          label:
            '🛠️ Use it to solve a real problem',
          signals: [
            'problem_solving',
            'building',
          ],
        },
        {
          id: 'compare',
          label:
            '📊 Compare it with other approaches',
          signals: [
            'investigating',
            'problem_solving',
          ],
        },
        {
          id: 'invent',
          label:
            '💡 Build something completely new with it',
          signals: [
            'creating',
            'technology',
          ],
        },
      ],
    },
    {
      id: 'master',
      shortLabel: 'Master a skill',
      question:
        'Which ability would you most like to master?',
      answers: [
        {
          id: 'analysis',
          label:
            '🧠 Analyzing difficult problems',
          signals: [
            'investigating',
            'problem_solving',
          ],
        },
        {
          id: 'building',
          label:
            '💻 Designing and building useful things',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'communication',
          label:
            '🎤 Communicating ideas that influence people',
          signals: [
            'communicating',
            'people',
          ],
        },
        {
          id: 'leadership',
          label:
            '🧭 Leading people toward a goal',
          signals: ['leading', 'organizing'],
        },
      ],
    },
    {
      id: 'team_role',
      shortLabel: 'Team role',
      question:
        'In a challenging team project, which role would you naturally gravitate toward?',
      answers: [
        {
          id: 'vision',
          label:
            '💡 Shape the idea and direction',
          signals: ['creating', 'leading'],
        },
        {
          id: 'solve',
          label:
            '🛠️ Solve the hardest technical problems',
          signals: [
            'problem_solving',
            'building',
          ],
        },
        {
          id: 'coordinate',
          label:
            '📋 Coordinate people and execution',
          signals: ['organizing', 'leading'],
        },
        {
          id: 'communicate',
          label:
            '🎤 Present and explain the work',
          signals: [
            'communicating',
            'people',
          ],
        },
      ],
    },
    {
      id: 'create',
      shortLabel: 'Proud result',
      question:
        'Which result would make you most proud?',
      answers: [
        {
          id: 'product',
          label:
            '🤖 Building a useful product',
          signals: [
            'technology',
            'building',
            'achievement',
          ],
        },
        {
          id: 'business',
          label:
            '📈 Turning an idea into a successful venture',
          signals: [
            'business',
            'leading',
            'achievement',
          ],
        },
        {
          id: 'creative',
          label:
            '🎬 Creating something people connect with',
          signals: [
            'arts',
            'communicating',
            'creating',
          ],
        },
        {
          id: 'change',
          label:
            '🌱 Creating meaningful positive change',
          signals: ['impact', 'helping'],
        },
      ],
    },
    {
      id: 'impact',
      shortLabel: 'Big challenge',
      question:
        'Which challenge would you most want to contribute to?',
      answers: [
        {
          id: 'health',
          label:
            '🩺 Improving human health',
          signals: [
            'health',
            'science',
            'helping',
          ],
        },
        {
          id: 'environment',
          label:
            '🌎 Protecting the environment',
          signals: ['nature', 'impact'],
        },
        {
          id: 'innovation',
          label:
            '🚀 Advancing science or technology',
          signals: [
            'technology',
            'science',
            'discovery',
          ],
        },
        {
          id: 'society',
          label:
            '🤝 Improving how people live and work',
          signals: [
            'people',
            'impact',
            'helping',
          ],
        },
      ],
    },
    {
      id: 'shadow',
      shortLabel: 'Shadow a team',
      question:
        'If you could shadow one team for a day, which would you choose?',
      answers: [
        {
          id: 'medical',
          label:
            '🧬 A medical or research team',
          signals: [
            'health',
            'science',
            'investigating',
          ],
        },
        {
          id: 'tech',
          label:
            '💻 A team building new technology',
          signals: [
            'technology',
            'building',
          ],
        },
        {
          id: 'startup',
          label:
            '📈 A startup launching a new business',
          signals: [
            'business',
            'leading',
            'achievement',
          ],
        },
        {
          id: 'creative',
          label:
            '🎬 A creative team producing something original',
          signals: [
            'arts',
            'creating',
            'collaborating',
          ],
        },
      ],
    },
  ],
}


// ============================================================
// EXISTING V0.2 PROFILE HELPERS
// ============================================================

function getPersona(age) {
  const numericAge = Number(age)

  if (numericAge <= 8) {
    return { id: 'explorer' }
  }

  if (numericAge <= 12) {
    return { id: 'discoverer' }
  }

  return { id: 'pathfinder' }
}

const interestSignals = [
  'science',
  'technology',
  'health',
  'animals',
  'nature',
  'arts',
  'sports',
  'business',
  'people',
  'space',
]

const tendencySignals = [
  'investigating',
  'problem_solving',
  'building',
  'creating',
  'communicating',
  'organizing',
  'leading',
  'collaborating',
]

const motivatorSignals = [
  'helping',
  'discovery',
  'achievement',
  'impact',
  'adventure',
]

const signalLabels = {
  science: 'Science',
  technology: 'Technology',
  health: 'Health & Medicine',
  animals: 'Animals',
  nature: 'Nature',
  arts: 'Creativity & Arts',
  sports: 'Sports & Movement',
  business: 'Business & Ideas',
  people: 'People',
  space: 'Space',

  investigating: 'Curious Investigator',
  problem_solving: 'Problem Solver',
  building: 'Builder',
  creating: 'Creative Thinker',
  communicating: 'Communicator',
  organizing: 'Organizer',
  leading: 'Emerging Leader',
  collaborating: 'Team Player',

  helping: 'Helping Others',
  discovery: 'Discovery',
  achievement: 'Achievement',
  impact: 'Making an Impact',
  adventure: 'Adventure',
}

const signalEmojis = {
  science: '🧪',
  technology: '💻',
  health: '🩺',
  animals: '🐾',
  nature: '🌿',
  arts: '🎨',
  sports: '⚽',
  business: '💡',
  people: '🤝',
  space: '🚀',

  investigating: '🔎',
  problem_solving: '🧩',
  building: '🛠️',
  creating: '✨',
  communicating: '💬',
  organizing: '📋',
  leading: '🧭',
  collaborating: '🤝',

  helping: '❤️',
  discovery: '🔭',
  achievement: '🏆',
  impact: '🌎',
  adventure: '🗺️',
}

const explorationCatalog = [
  {
    id: 'space',
    title: 'Space Explorer',
    emoji: '🚀',
    description:
      'Explore how scientists and engineers solve problems beyond Earth.',
    signals: [
      'space',
      'science',
      'technology',
      'discovery',
    ],
  },
  {
    id: 'robotics',
    title: 'Robot Builder',
    emoji: '🤖',
    description:
      'Discover how creativity, engineering, and technology come together to build useful machines.',
    signals: [
      'technology',
      'building',
      'problem_solving',
      'creating',
    ],
  },
  {
    id: 'medicine',
    title: 'Human Body Detective',
    emoji: '🩺',
    description:
      'Explore how doctors and scientists investigate the human body and solve health mysteries.',
    signals: [
      'health',
      'science',
      'investigating',
      'helping',
    ],
  },
  {
    id: 'wildlife',
    title: 'Wildlife Explorer',
    emoji: '🐅',
    description:
      'Learn how people study, care for, and protect animals and their habitats.',
    signals: [
      'animals',
      'nature',
      'discovery',
      'helping',
    ],
  },
  {
    id: 'creative',
    title: 'Creative Story Lab',
    emoji: '🎬',
    description:
      'Explore storytelling, design, video, art, and ways to bring new ideas to life.',
    signals: [
      'arts',
      'creating',
      'communicating',
    ],
  },
  {
    id: 'entrepreneur',
    title: 'Idea Builder',
    emoji: '💡',
    description:
      'Explore how people turn ideas into products, projects, and businesses.',
    signals: [
      'business',
      'leading',
      'creating',
      'achievement',
    ],
  },
  {
    id: 'community',
    title: 'Community Changemaker',
    emoji: '🌎',
    description:
      'Explore ways to solve problems that help people and communities.',
    signals: [
      'people',
      'helping',
      'impact',
      'leading',
    ],
  },
]

function addSignals(scores, signals, weight) {
  if (!signals) return

  signals.forEach((signal) => {
    scores[signal] =
      (scores[signal] || 0) + weight
  })
}

function calculateDiscoveryScores(responses) {
  const scores = {}

  responses.forEach((response) => {
    addSignals(
      scores,
      response.signals,
      1
    )
  })

  return scores
}

function getEnjoymentWeight(enjoyment) {
  if (enjoyment === 3) return 2
  if (enjoyment === 2) return 1
  if (enjoyment === 1) return 0

  return -1
}

function calculateExperienceScores(responses) {
  const scores = {}
  const responsesByExploration = {}

  responses.forEach((response) => {
    if (
      !responsesByExploration[
        response.explorationId
      ]
    ) {
      responsesByExploration[
        response.explorationId
      ] = []
    }

    responsesByExploration[
      response.explorationId
    ].push(response)

    if (response.type === 'challenge') {
      addSignals(
        scores,
        response.signals,
        1.5
      )
    }

    if (response.type === 'reflection') {
      addSignals(
        scores,
        response.signals,
        2
      )
    }
  })

  Object.entries(
    responsesByExploration
  ).forEach(
    ([explorationId, events]) => {
      const enjoymentEvent =
        events.find(
          (event) =>
            event.type ===
            'enjoyment'
        )

      if (!enjoymentEvent) return

      const exploration =
        explorationCatalog.find(
          (item) =>
            item.id ===
            explorationId
        )

      if (!exploration) return

      addSignals(
        scores,
        exploration.signals,
        getEnjoymentWeight(
          enjoymentEvent.enjoyment
        )
      )
    }
  )

  return scores
}

function combineScores(...scoreSets) {
  const combined = {}

  scoreSets.forEach((scores) => {
    Object.entries(scores).forEach(
      ([signal, score]) => {
        combined[signal] =
          (combined[signal] || 0) +
          score
      }
    )
  })

  return combined
}

function getTopSignals(
  scores,
  allowedSignals,
  limit = 3
) {
  return allowedSignals
    .map((signal) => ({
      signal,
      score:
        scores[signal] || 0,
    }))
    .filter(
      (item) =>
        item.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, limit)
}

function getRecommendations(
  scores,
  completedExplorations = [],
  limit = 3
) {
  return explorationCatalog
    .map((exploration) => {
      const score =
        exploration.signals.reduce(
          (total, signal) =>
            total +
            Math.max(
              scores[signal] || 0,
              0
            ),
          0
        )

      return {
        ...exploration,
        score,
        completed:
          completedExplorations.includes(
            exploration.id
          ),
      }
    })
    .filter(
      (exploration) =>
        !exploration.completed
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, limit)
}

function getGrowthSignals(
  discoveryScores,
  cumulativeScores,
  limit = 3
) {
  const allSignals = [
    ...interestSignals,
    ...tendencySignals,
    ...motivatorSignals,
  ]

  return allSignals
    .map((signal) => ({
      signal,

      change:
        (cumulativeScores[signal] || 0) -
        (discoveryScores[signal] || 0),
    }))
    .filter(
      (item) =>
        item.change > 0
    )
    .sort(
      (a, b) =>
        b.change - a.change
    )
    .slice(0, limit)
}


// ============================================================
// V0.3 HELPERS
// ============================================================

function createSessionId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID ===
      'function'
  ) {
    return `session_${crypto.randomUUID()}`
  }

  return `session_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

function getChildEvidenceId(childProfile) {
  const normalizedName =
    childProfile.name
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        '-'
      )
      .replace(
        /^-+|-+$/g,
        ''
      ) || 'child'

  return `child_${normalizedName}_${childProfile.age}`
}


// ============================================================
// APP
// ============================================================

function App() {
  const [screen, setScreen] =
    useState('landing')

  const [
    childProfile,
    setChildProfile,
  ] = useState({
    name: '',
    age: '11',
    grade: '6th Grade',
  })

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0)

  const [
    discoveryResponses,
    setDiscoveryResponses,
  ] = useState([])

  const [
    discoveryComplete,
    setDiscoveryComplete,
  ] = useState(false)

  const [
    activeExploration,
    setActiveExploration,
  ] = useState(null)

  const [
    explorationStep,
    setExplorationStep,
  ] = useState('intro')

  const [
    challengeIndex,
    setChallengeIndex,
  ] = useState(0)

  const [
    experienceResponses,
    setExperienceResponses,
  ] = useState([])

  const [
    enjoymentResponse,
    setEnjoymentResponse,
  ] = useState(null)

  const [
    completedExplorations,
    setCompletedExplorations,
  ] = useState([])

  const [
    discoverySessionId,
    setDiscoverySessionId,
  ] = useState(null)

  const [
    evidenceSessionId,
    setEvidenceSessionId,
  ] = useState(null)

  const [
    growthIntelligenceProfile,
    setGrowthIntelligenceProfile,
  ] = useState(null)

  const [
    evidenceEventCount,
    setEvidenceEventCount,
  ] = useState(0)


  const persona =
    getPersona(childProfile.age)

  const questions =
    discoveryQuestions[persona.id]

  const currentQuestion =
    questions[currentQuestionIndex]

  const currentExploration =
    activeExploration
      ? explorations[
          activeExploration
        ]
      : null


  const discoveryScores =
    calculateDiscoveryScores(
      discoveryResponses
    )

  const experienceScores =
    calculateExperienceScores(
      experienceResponses
    )

  const signalScores =
    combineScores(
      discoveryScores,
      experienceScores
    )

  const topInterests =
    getTopSignals(
      signalScores,
      interestSignals,
      3
    )

  const topTendencies =
    getTopSignals(
      signalScores,
      tendencySignals,
      3
    )

  const topMotivators =
    getTopSignals(
      signalScores,
      motivatorSignals,
      2
    )

  const recommendations =
    getRecommendations(
      signalScores,
      completedExplorations,
      3
    )

  const growthSignals =
    getGrowthSignals(
      discoveryScores,
      signalScores,
      3
    )


  // ==========================================================
  // GROWTH INTELLIGENCE PERSISTENCE
  // ==========================================================

  const persistGrowthEvidence =
    (events = []) => {
      const validEvents =
        events.filter(Boolean)

      if (
        validEvents.length === 0
      ) {
        return null
      }

      const childId =
        getChildEvidenceId(
          childProfile
        )

      appendEvidenceEvents(
        validEvents
      )

      const allEvidence =
        getEvidenceEvents({
          childId,
        })

      const profile =
        buildGrowthProfile({
          childId,
          evidenceEvents:
            allEvidence,
        })

      saveGrowthProfile(
        profile
      )

      setGrowthIntelligenceProfile(
        profile
      )

      setEvidenceEventCount(
        allEvidence.length
      )

      return profile
    }


  // ==========================================================
  // DISCOVERY EVIDENCE
  // ==========================================================

  const persistDiscoveryEvidence =
    (responses) => {
      const childId =
        getChildEvidenceId(
          childProfile
        )

      const events =
        responses.map(
          (response) => {
            const question =
              questions.find(
                (item) =>
                  item.id ===
                  response.questionId
              )

            if (!question) {
              return null
            }

            const answer =
              question.answers.find(
                (item) =>
                  item.id ===
                  response.answerId
              )

            if (!answer) {
              return null
            }

            return createEvidenceEvent({
              childId,

              source: {
                type:
                  evidenceSourceTypes
                    .DISCOVERY,

                experienceId:
                  'discover_you',

                questionId:
                  question.id,

                responseId:
                  answer.id,
              },

              evidence:
                getDiscoveryEvidence(
                  answer
                ),

              context: {
                domainId:
                  getDiscoveryDomainId(
                    answer
                  ),

                sessionId:
                  discoverySessionId,
              },

              metadata: {
                questionText:
                  question.question,

                responseText:
                  answer.label,

                legacySignals:
                  answer.signals || [],

                persona:
                  persona.id,
              },
            })
          }
        )

      return persistGrowthEvidence(
        events
      )
    }


  // ==========================================================
  // CHILD SPACE / PROFILE SETUP
  // ==========================================================

  const handleProfileChange =
    (event) => {
      const {
        name,
        value,
      } = event.target

      setChildProfile(
        (currentProfile) => ({
          ...currentProfile,
          [name]: value,
        })
      )
    }

  const handleParentSetupSubmit =
    (event) => {
      event.preventDefault()

      if (
        !childProfile.name.trim()
      ) {
        return
      }

      //
      // IMPORTANT:
      // Setup now creates the Child's Space.
      //

      setScreen('childSpace')
    }

  const goToChildSpace = () => {
    setScreen('childSpace')
  }


  // ==========================================================
  // DISCOVERY
  // ==========================================================

  const startDiscovery = () => {
    setCurrentQuestionIndex(0)
    setDiscoveryResponses([])

    setDiscoverySessionId(
      createSessionId()
    )

    setScreen('discovery')
  }

  const handleAnswer =
    (answer) => {
      const response = {
        questionId:
          currentQuestion.id,

        answerId:
          answer.id,

        answerLabel:
          answer.label,

        signals:
          answer.signals,
      }

      const updatedResponses = [
        ...discoveryResponses.filter(
          (item) =>
            item.questionId !==
            currentQuestion.id
        ),

        response,
      ]

      setDiscoveryResponses(
        updatedResponses
      )

      if (
        currentQuestionIndex ===
        questions.length - 1
      ) {
        persistDiscoveryEvidence(
          updatedResponses
        )

        setDiscoveryComplete(true)

        //
        // Discovery now returns to the persistent Space.
        //

        setScreen(
          'discoveryComplete'
        )

        return
      }

      setCurrentQuestionIndex(
        (current) =>
          current + 1
      )
    }

  const handleDiscoveryBack =
    () => {
      if (
        currentQuestionIndex === 0
      ) {
        goToChildSpace()
        return
      }

      setCurrentQuestionIndex(
        (current) =>
          current - 1
      )
    }


  // ==========================================================
  // ADVENTURES
  // ==========================================================

  const startExploration =
    (explorationId) => {
      if (
        !explorations[
          explorationId
        ]
      ) {
        return
      }

      setActiveExploration(
        explorationId
      )

      setExplorationStep(
        'intro'
      )

      setChallengeIndex(0)

      setEnjoymentResponse(null)

      setEvidenceSessionId(
        createSessionId()
      )

      setScreen('exploration')
    }

  const beginMission = () => {
    setExplorationStep(
      'challenge'
    )
  }

  const handleChallengeAnswer =
    (answer) => {
      const challenge =
        currentExploration
          .challenges[
            challengeIndex
          ]

      setExperienceResponses(
        (responses) => [
          ...responses,

          {
            type: 'challenge',

            explorationId:
              currentExploration.id,

            questionId:
              challenge.id,

            answerId:
              answer.id,

            signals:
              answer.signals,
          },
        ]
      )

      if (
        currentExploration.id ===
        'robotics'
      ) {
        const event =
          createEvidenceEvent({
            childId:
              getChildEvidenceId(
                childProfile
              ),

            source: {
              type:
                evidenceSourceTypes
                  .ADVENTURE_QUESTION,

              experienceId:
                currentExploration.id,

              questionId:
                challenge.id,

              responseId:
                answer.id,
            },

            evidence:
              getChallengeEvidence(
                answer
              ),

            context: {
              domainId:
                getExplorationDomainId(
                  currentExploration.id
                ),

              sessionId:
                evidenceSessionId,
            },

            metadata: {
              questionText:
                challenge.question,

              responseText:
                answer.label,

              legacySignals:
                answer.signals || [],
            },
          })

        persistGrowthEvidence([
          event,
        ])
      }

      if (
        challengeIndex ===
        currentExploration
          .challenges.length -
          1
      ) {
        setExplorationStep(
          'enjoyment'
        )

        return
      }

      setChallengeIndex(
        (current) =>
          current + 1
      )
    }

  const handleEnjoyment =
    (answer) => {
      setEnjoymentResponse(
        answer
      )

      setExperienceResponses(
        (responses) => [
          ...responses,

          {
            type: 'enjoyment',

            explorationId:
              currentExploration.id,

            answerId:
              answer.id,

            enjoyment:
              answer.value,
          },
        ]
      )

      if (
        currentExploration.id ===
        'robotics'
      ) {
        const event =
          createEvidenceEvent({
            childId:
              getChildEvidenceId(
                childProfile
              ),

            source: {
              type:
                evidenceSourceTypes
                  .REFLECTION,

              experienceId:
                currentExploration.id,

              questionId:
                'enjoyment',

              responseId:
                answer.id,
            },

            evidence:
              getEnjoymentEvidence(
                answer.value
              ),

            context: {
              domainId:
                getExplorationDomainId(
                  currentExploration.id
                ),

              sessionId:
                evidenceSessionId,
            },

            metadata: {
              questionText:
                currentExploration
                  .reflection
                  .enjoyment
                  .question,

              responseText:
                answer.label,

              enjoymentValue:
                answer.value,
            },
          })

        persistGrowthEvidence([
          event,
        ])
      }

      setExplorationStep(
        'favorite'
      )
    }

  const handleFavoritePart =
    (answer) => {
      setExperienceResponses(
        (responses) => [
          ...responses,

          {
            type: 'reflection',

            explorationId:
              currentExploration.id,

            answerId:
              answer.id,

            signals:
              answer.signals,
          },
        ]
      )

      if (
        currentExploration.id ===
        'robotics'
      ) {
        const childId =
          getChildEvidenceId(
            childProfile
          )

        const domainId =
          getExplorationDomainId(
            currentExploration.id
          )

        const reflectionEvent =
          createEvidenceEvent({
            childId,

            source: {
              type:
                evidenceSourceTypes
                  .REFLECTION,

              experienceId:
                currentExploration.id,

              questionId:
                'favorite_part',

              responseId:
                answer.id,
            },

            evidence:
              getReflectionEvidence(
                answer
              ),

            context: {
              domainId,

              sessionId:
                evidenceSessionId,
            },

            metadata: {
              questionText:
                currentExploration
                  .reflection
                  .favoritePart
                  .question,

              responseText:
                answer.label,

              legacySignals:
                answer.signals || [],
            },
          })

        const completionEvent =
          createEvidenceEvent({
            childId,

            source: {
              type:
                evidenceSourceTypes
                  .COMPLETION,

              experienceId:
                currentExploration.id,

              questionId: null,

              responseId:
                'completed',
            },

            evidence:
              getCompletionEvidence(),

            context: {
              domainId,

              sessionId:
                evidenceSessionId,
            },

            metadata: {
              experienceTitle:
                currentExploration
                  .title ||
                'Robot Builder',
            },
          })

        persistGrowthEvidence([
          reflectionEvent,
          completionEvent,
        ])
      }

      setCompletedExplorations(
        (completed) => {
          if (
            completed.includes(
              currentExploration.id
            )
          ) {
            return completed
          }

          return [
            ...completed,
            currentExploration.id,
          ]
        }
      )

      setScreen(
        'profileGrew'
      )
    }


  // ==========================================================
  // GROWTH INTELLIGENCE INSPECTOR
  // ==========================================================

  const intelligenceTraits =
    growthIntelligenceProfile
      ? getTopTraits(
          growthIntelligenceProfile,
          5
        )
      : []

  const intelligenceDomains =
    growthIntelligenceProfile
      ? getTopDomains(
          growthIntelligenceProfile,
          5
        )
      : []

  const intelligencePathways =
    growthIntelligenceProfile
      ? getTopPathways(
          growthIntelligenceProfile,
          5
        )
      : []

  const intelligenceCareers =
    growthIntelligenceProfile
      ? getTopCareerFamilies(
          growthIntelligenceProfile,
          5
        )
      : []


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main className="page">

      {/* LANDING */}

      {screen === 'landing' && (
        <section className="hero">
          <p className="eyebrow">
            Career & Growth
          </p>

          <h1>
            Helping kids discover who
            they are, what they love,
            and who they can become.
          </h1>

          <p className="subtext">
            A personal operating system
            for growing up — designed
            to help families explore
            interests, build skills,
            set goals, and grow with
            confidence.
          </p>

          <button
            className="cta"
            onClick={() =>
              setScreen(
                'parentSetup'
              )
            }
          >
            Create a Child's Space
          </button>

          <p className="tagline">
            A Personal Operating
            System for Growing Up
          </p>
        </section>
      )}


      {/* PARENT SETUP */}

      {screen ===
        'parentSetup' && (
        <section className="setup">

          <button
            className="backButton"
            onClick={() =>
              setScreen('landing')
            }
          >
            ← Back
          </button>

          <div className="setupHeader">
            <p className="eyebrow">
              Create a Child's Space
            </p>

            <h2>
              Start their growth
              journey 🌱
            </h2>

            <p className="subtext">
              We'll create a personal
              space that grows as your
              child explores interests,
              strengths, and new
              experiences.
            </p>
          </div>

          <form
            className="profileForm"
            onSubmit={
              handleParentSetupSubmit
            }
          >
            <label>
              Child's first name
              or nickname

              <input
                type="text"
                name="name"
                value={
                  childProfile.name
                }
                onChange={
                  handleProfileChange
                }
                placeholder="Noah"
                autoFocus
              />
            </label>

            <label>
              Age

              <select
                name="age"
                value={
                  childProfile.age
                }
                onChange={
                  handleProfileChange
                }
              >
                {Array.from(
                  {
                    length: 13,
                  },

                  (_, index) => {
                    const age =
                      index + 5

                    return (
                      <option
                        key={age}
                        value={age}
                      >
                        {age}
                      </option>
                    )
                  }
                )}
              </select>
            </label>

            <label>
              Grade

              <select
                name="grade"
                value={
                  childProfile.grade
                }
                onChange={
                  handleProfileChange
                }
              >
                <option>
                  Kindergarten
                </option>
                <option>
                  1st Grade
                </option>
                <option>
                  2nd Grade
                </option>
                <option>
                  3rd Grade
                </option>
                <option>
                  4th Grade
                </option>
                <option>
                  5th Grade
                </option>
                <option>
                  6th Grade
                </option>
                <option>
                  7th Grade
                </option>
                <option>
                  8th Grade
                </option>
                <option>
                  9th Grade
                </option>
                <option>
                  10th Grade
                </option>
                <option>
                  11th Grade
                </option>
                <option>
                  12th Grade
                </option>
              </select>
            </label>

            <button
              className="cta formCta"
              type="submit"
            >
              Create Space
            </button>
          </form>
        </section>
      )}


      {/* CHILD SPACE HOME */}

      {screen === 'childSpace' && (
        <section className="childSpace">

          <div className="spaceHeader">
            <div>
              <p className="spaceEyebrow">
                Career & Growth
              </p>

              <h1 className="spaceTitle">
                {childProfile.name.trim()}'s
                Space 🌱
              </h1>

              <p className="spaceSubtitle">
                A place that grows as{' '}
                {childProfile.name.trim()}{' '}
                grows.
              </p>
            </div>

            <div className="spaceProfilePill">
              <span className="spaceAvatar">
                {childProfile.name
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </span>

              <div>
                <strong>
                  {childProfile.name.trim()}
                </strong>

                <span>
                  Age {childProfile.age}
                  {' · '}
                  {childProfile.grade}
                </span>
              </div>
            </div>
          </div>


          {!discoveryComplete ? (
            <div className="spaceWelcome">
              <span className="spaceWelcomeEmoji">
                👋
              </span>

              <div>
                <h2>
                  Welcome,{' '}
                  {childProfile.name.trim()}!
                </h2>

                <p>
                  Let's start by
                  discovering what
                  makes you, you.
                </p>
              </div>
            </div>
          ) : (
            <div className="spaceWelcome spaceWelcomeComplete">
              <span className="spaceWelcomeEmoji">
                ✨
              </span>

              <div>
                <h2>
                  Your Growth Profile
                  has started!
                </h2>

                <p>
                  Keep exploring and
                  your profile will
                  continue to grow.
                </p>
              </div>
            </div>
          )}


          {discoveryComplete && (
            <div className="spaceStats">
              <div className="spaceStat">
                <strong>
                  {evidenceEventCount}
                </strong>

                <span>
                  Evidence events
                </span>
              </div>

              <div className="spaceStat">
                <strong>
                  {
                    completedExplorations.length
                  }
                </strong>

                <span>
                  Adventures completed
                </span>
              </div>

              <div className="spaceStat">
                <strong>
                  {
                    intelligenceTraits.length
                  }
                </strong>

                <span>
                  Tendencies emerging
                </span>
              </div>
            </div>
          )}


          <div className="spaceSectionHeader">
            <div>
              <h2>Your Journey</h2>

              <p>
                Discover, explore, and
                keep growing.
              </p>
            </div>
          </div>


          <div className="spaceGrid">

            <article className="spaceCard">
              <div className="spaceCardTop">
                <span className="spaceCardIcon">
                  🧭
                </span>

                {discoveryComplete && (
                  <span className="spaceStatusComplete">
                    ✓ Complete
                  </span>
                )}
              </div>

              <h3>
                Discovering You
              </h3>

              <p>
                Answer fun questions
                about what you enjoy,
                how you think, and
                what motivates you.
              </p>

              {!discoveryComplete ? (
                <button
                  className="spaceAction"
                  onClick={
                    startDiscovery
                  }
                >
                  Start Discovery →
                </button>
              ) : (
                <span className="spaceCompletedText">
                  Discovery completed
                </span>
              )}
            </article>


            <article
              className={`spaceCard ${
                !discoveryComplete
                  ? 'spaceCardLocked'
                  : ''
              }`}
            >
              <div className="spaceCardTop">
                <span className="spaceCardIcon">
                  🌱
                </span>
              </div>

              <h3>
                Growth Profile
              </h3>

              <p>
                See the interests,
                tendencies, and areas
                we're beginning to
                discover.
              </p>

              {discoveryComplete ? (
                <button
                  className="spaceAction"
                  onClick={() =>
                    setScreen(
                      'growthProfile'
                    )
                  }
                >
                  View Profile →
                </button>
              ) : (
                <span className="spaceLockedText">
                  Complete Discovery
                  first
                </span>
              )}
            </article>


            <article
              className={`spaceCard ${
                !discoveryComplete
                  ? 'spaceCardLocked'
                  : ''
              }`}
            >
              <div className="spaceCardTop">
                <span className="spaceCardIcon">
                  🚀
                </span>

                {completedExplorations.length >
                  0 && (
                  <span className="spaceStatusComplete">
                    {
                      completedExplorations.length
                    }{' '}
                    completed
                  </span>
                )}
              </div>

              <h3>
                Adventures
              </h3>

              <p>
                Try experiences that
                help us learn what you
                enjoy doing — not just
                what sounds interesting.
              </p>

              {discoveryComplete ? (
                <button
                  className="spaceAction"
                  onClick={() =>
                    setScreen(
                      'adventures'
                    )
                  }
                >
                  Explore Adventures →
                </button>
              ) : (
                <span className="spaceLockedText">
                  Unlocks after
                  Discovery
                </span>
              )}
            </article>

          </div>


          <div className="spaceSectionHeader parentSectionHeader">
            <div>
              <h2>For Parents</h2>

              <p>
                Add another perspective
                to the Growth Profile.
              </p>
            </div>
          </div>


          <div className="parentSpaceCard">
            <div className="parentSpaceIcon">
              👨‍👩‍👦
            </div>

            <div className="parentSpaceContent">
              <div className="parentSpaceHeading">
                <h3>
                  Parent Perspective
                </h3>

                <span className="comingNextBadge">
                  Coming next
                </span>
              </div>

              <p>
                Share what you've
                observed about{' '}
                {childProfile.name.trim()}
                's interests, strengths,
                and learning behaviors.
                Your perspective will
                become another source
                of evidence — not a
                label.
              </p>
            </div>
          </div>

        </section>
      )}


      {/* DISCOVERY */}

      {screen === 'discovery' && (
        <section className="discoveryLayout">

          <aside className="discoveryCompanion">
            <div className="companionProfile">

              <div className="companionAvatar">
                {childProfile.name
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <p className="companionName">
                  {childProfile.name.trim()}
                </p>

                <p className="companionMeta">
                  Age {childProfile.age}
                  {' · '}
                  {childProfile.grade}
                </p>
              </div>
            </div>

            <div className="companionDivider" />

            <p className="companionHeading">
              Discovering You
            </p>

            <div className="journeyList">
              {questions.map(
                (
                  question,
                  index
                ) => {
                  const isComplete =
                    index <
                    currentQuestionIndex

                  const isCurrent =
                    index ===
                    currentQuestionIndex

                  return (
                    <div
                      key={question.id}
                      className={`journeyItem ${
                        isCurrent
                          ? 'journeyItemCurrent'
                          : ''
                      }`}
                    >
                      <span className="journeyStatus">
                        {isComplete
                          ? '✓'
                          : isCurrent
                            ? '→'
                            : '○'}
                      </span>

                      <span>
                        {
                          question.shortLabel
                        }
                      </span>
                    </div>
                  )
                }
              )}
            </div>
          </aside>


          <div className="discoveryMain">

            <div className="discoveryTop">

              <button
                className="backButton"
                onClick={
                  handleDiscoveryBack
                }
              >
                ← Back to Space
              </button>

              <span className="questionCounter">
                {currentQuestionIndex +
                  1}{' '}
                of {questions.length}
              </span>
            </div>

            <div className="progressTrack">
              <div
                className="progressBar"
                style={{
                  width: `${
                    ((currentQuestionIndex +
                      1) /
                      questions.length) *
                    100
                  }%`,
                }}
              />
            </div>

            <div className="questionCard">

              <p className="eyebrow">
                Discovering You
              </p>

              <h2 className="questionTitle">
                {
                  currentQuestion.question
                }
              </h2>

              <div className="answerGrid">
                {currentQuestion.answers.map(
                  (answer) => (
                    <button
                      key={answer.id}
                      className="answerCard"
                      onClick={() =>
                        handleAnswer(
                          answer
                        )
                      }
                    >
                      {answer.label}
                    </button>
                  )
                )}
              </div>

            </div>
          </div>

        </section>
      )}


      {/* DISCOVERY COMPLETE */}

      {screen ===
        'discoveryComplete' && (
        <section className="handoff">

          <div className="handoffCard">

            <div className="handoffEmoji">
              ✨
            </div>

            <p className="eyebrow">
              Discovery Complete
            </p>

            <h2>
              Your Growth Profile
              has started!
            </h2>

            <p className="handoffText">
              We now have our first
              clues about what you
              enjoy, how you like to
              explore, and what seems
              to motivate you.
            </p>

            <p className="handoffText">
              Your Space will keep
              growing as you try new
              adventures.
            </p>

            <button
              className="cta"
              onClick={
                goToChildSpace
              }
            >
              Back to My Space
            </button>

          </div>
        </section>
      )}


      {/* GROWTH PROFILE */}

      {screen ===
        'growthProfile' && (
        <section className="growthProfile">

          <button
            className="backButton"
            onClick={
              goToChildSpace
            }
          >
            ← Back to{' '}
            {childProfile.name.trim()}
            's Space
          </button>

          <div className="profileHero">

            <p className="eyebrow">
              Your Growth Profile
            </p>

            <h2>
              Here's what we're
              beginning to discover
              about you,{' '}
              {childProfile.name.trim()}.
            </h2>

            <p className="profileIntro">
              This is only the
              beginning. Your profile
              will change and grow as
              you explore new things.
            </p>

          </div>


          <div className="profileSection">
            <p className="profileSectionLabel">
              Things you're curious
              about
            </p>

            <div className="signalCards">
              {topInterests.map(
                ({ signal }) => (
                  <div
                    className="signalCard"
                    key={signal}
                  >
                    <span className="signalEmoji">
                      {
                        signalEmojis[
                          signal
                        ]
                      }
                    </span>

                    <span>
                      {
                        signalLabels[
                          signal
                        ]
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          </div>


          <div className="profileSection">
            <p className="profileSectionLabel">
              Strengths we're
              beginning to notice
            </p>

            <div className="signalCards">
              {topTendencies.map(
                ({ signal }) => (
                  <div
                    className="signalCard"
                    key={signal}
                  >
                    <span className="signalEmoji">
                      {
                        signalEmojis[
                          signal
                        ]
                      }
                    </span>

                    <span>
                      {
                        signalLabels[
                          signal
                        ]
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          </div>


          <div className="profileSection">
            <p className="profileSectionLabel">
              Things that seem to
              motivate you
            </p>

            <div className="signalCards">
              {topMotivators.map(
                ({ signal }) => (
                  <div
                    className="signalCard"
                    key={signal}
                  >
                    <span className="signalEmoji">
                      {
                        signalEmojis[
                          signal
                        ]
                      }
                    </span>

                    <span>
                      {
                        signalLabels[
                          signal
                        ]
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          </div>


          {completedExplorations.length >
            0 && (
            <div className="completedSection">

              <p className="profileSectionLabel">
                Adventures you've
                completed
              </p>

              <div className="completedAdventures">
                {completedExplorations.map(
                  (
                    explorationId
                  ) => {
                    const exploration =
                      explorationCatalog.find(
                        (item) =>
                          item.id ===
                          explorationId
                      )

                    if (
                      !exploration
                    ) {
                      return null
                    }

                    return (
                      <div
                        className="completedAdventure"
                        key={
                          exploration.id
                        }
                      >
                        <span>
                          {
                            exploration.emoji
                          }
                        </span>

                        <span>
                          {
                            exploration.title
                          }
                        </span>

                        <span className="completedCheck">
                          ✓ Completed
                        </span>
                      </div>
                    )
                  }
                )}
              </div>

            </div>
          )}


          <div className="profileFooterActions">

            <button
              className="cta"
              onClick={() =>
                setScreen(
                  'adventures'
                )
              }
            >
              Explore Adventures
            </button>

          </div>


          {growthIntelligenceProfile && (
            <GrowthIntelligenceInspector
              profile={
                growthIntelligenceProfile
              }
              evidenceEventCount={
                evidenceEventCount
              }
              traits={
                intelligenceTraits
              }
              domains={
                intelligenceDomains
              }
              pathways={
                intelligencePathways
              }
              careers={
                intelligenceCareers
              }
            />
          )}

        </section>
      )}


      {/* ADVENTURES HUB */}

      {screen === 'adventures' && (
        <section className="adventureHub">

          <button
            className="backButton"
            onClick={
              goToChildSpace
            }
          >
            ← Back to{' '}
            {childProfile.name.trim()}
            's Space
          </button>

          <div className="adventureHubHeader">

            <p className="eyebrow">
              Adventures
            </p>

            <h2>
              What should we explore
              next?
            </h2>

            <p>
              Adventures help us learn
              what you enjoy doing —
              not just what sounds
              interesting.
            </p>

          </div>


          <div className="recommendationGrid">

            {recommendations.map(
              (
                recommendation
              ) => (
                <div
                  className="recommendationCard"
                  key={
                    recommendation.id
                  }
                >

                  <div className="recommendationEmoji">
                    {
                      recommendation.emoji
                    }
                  </div>

                  <h3>
                    {
                      recommendation.title
                    }
                  </h3>

                  <p>
                    {
                      recommendation.description
                    }
                  </p>

                  {recommendation.id ===
                  'robotics' ? (
                    <button
                      className="exploreButton"
                      onClick={() =>
                        startExploration(
                          recommendation.id
                        )
                      }
                    >
                      Start Adventure
                    </button>
                  ) : (
                    <button
                      className="exploreButton exploreButtonDisabled"
                      disabled
                    >
                      Coming Soon
                    </button>
                  )}

                </div>
              )
            )}

          </div>

        </section>
      )}


      {/* ADVENTURE EXPERIENCE */}

      {screen ===
        'exploration' &&
        currentExploration && (
        <section className="exploration">

          {explorationStep ===
            'intro' && (
            <div className="explorationCard">

              <button
                className="backButton explorationBack"
                onClick={() =>
                  setScreen(
                    'adventures'
                  )
                }
              >
                ← Back to Adventures
              </button>

              <div className="explorationHeroEmoji">
                {
                  currentExploration.emoji
                }
              </div>

              <p className="eyebrow">
                {
                  currentExploration
                    .intro.eyebrow
                }
              </p>

              <h2>
                {
                  currentExploration
                    .intro.title
                }
              </h2>

              <p className="explorationText">
                {
                  currentExploration
                    .intro
                    .description
                }
              </p>

              <div className="missionBox">

                <span className="missionLabel">
                  Your Mission
                </span>

                <p>
                  {
                    currentExploration
                      .intro
                      .mission
                  }
                </p>

              </div>

              <button
                className="cta"
                onClick={
                  beginMission
                }
              >
                Start Mission
              </button>

            </div>
          )}


          {explorationStep ===
            'challenge' && (
            <div className="explorationCard">

              <p className="eyebrow">
                Mission Challenge
              </p>

              <div className="challengeProgress">
                Challenge{' '}
                {challengeIndex +
                  1}{' '}
                of{' '}
                {
                  currentExploration
                    .challenges.length
                }
              </div>

              <h2 className="questionTitle">
                {
                  currentExploration
                    .challenges[
                      challengeIndex
                    ].question
                }
              </h2>

              <div className="answerGrid">
                {currentExploration.challenges[
                  challengeIndex
                ].answers.map(
                  (answer) => (
                    <button
                      key={
                        answer.id
                      }
                      className="answerCard"
                      onClick={() =>
                        handleChallengeAnswer(
                          answer
                        )
                      }
                    >
                      {
                        answer.label
                      }
                    </button>
                  )
                )}
              </div>

            </div>
          )}


          {explorationStep ===
            'enjoyment' && (
            <div className="explorationCard">

              <div className="explorationHeroEmoji">
                🎉
              </div>

              <p className="eyebrow">
                Mission Complete
              </p>

              <h2>
                {
                  currentExploration
                    .reflection
                    .enjoyment
                    .question
                }
              </h2>

              <div className="reflectionGrid">
                {currentExploration.reflection.enjoyment.answers.map(
                  (answer) => (
                    <button
                      key={
                        answer.id
                      }
                      className="reflectionButton"
                      onClick={() =>
                        handleEnjoyment(
                          answer
                        )
                      }
                    >
                      {
                        answer.label
                      }
                    </button>
                  )
                )}
              </div>

            </div>
          )}


          {explorationStep ===
            'favorite' && (
            <div className="explorationCard">

              <p className="eyebrow">
                One More Thing
              </p>

              <h2>
                {
                  currentExploration
                    .reflection
                    .favoritePart
                    .question
                }
              </h2>

              <div className="answerGrid">
                {currentExploration.reflection.favoritePart.answers.map(
                  (answer) => (
                    <button
                      key={
                        answer.id
                      }
                      className="answerCard"
                      onClick={() =>
                        handleFavoritePart(
                          answer
                        )
                      }
                    >
                      {
                        answer.label
                      }
                    </button>
                  )
                )}
              </div>

            </div>
          )}

        </section>
      )}


      {/* PROFILE GREW */}

      {screen ===
        'profileGrew' && (
        <section className="profileGrew">

          <div className="profileGrewCard">

            <div className="profileGrewEmoji">
              🌱
            </div>

            <p className="eyebrow">
              Your Profile Grew
            </p>

            <h2>
              We learned something
              new about you,{' '}
              {childProfile.name.trim()}
              !
            </h2>

            {enjoymentResponse?.value ===
            0 ? (
              <p className="profileGrewIntro">
                Finding out what you
                don't enjoy is useful
                too. It helps us
                discover different
                adventures that may
                fit you better.
              </p>
            ) : (
              <p className="profileGrewIntro">
                Your Robot Builder
                adventure gave us
                stronger clues about
                the kinds of things
                you enjoy doing.
              </p>
            )}

            {growthSignals.length >
              0 && (
              <div className="growthSignalList">
                {growthSignals.map(
                  ({ signal }) => (
                    <div
                      className="growthSignal"
                      key={signal}
                    >
                      <span className="growthSignalEmoji">
                        {
                          signalEmojis[
                            signal
                          ]
                        }
                      </span>

                      <span>
                        {
                          signalLabels[
                            signal
                          ]
                        }
                      </span>

                      <span className="growthArrow">
                        ↑
                      </span>
                    </div>
                  )
                )}
              </div>
            )}

            <p className="profileGrewNote">
              Every adventure adds
              new evidence to your
              Growth Profile.
            </p>


            <div className="profileGrewActions">

              <button
                className="cta"
                onClick={() =>
                  setScreen(
                    'growthProfile'
                  )
                }
              >
                View Updated Profile
              </button>

              <button
                className="secondaryAction"
                onClick={
                  goToChildSpace
                }
              >
                Back to My Space
              </button>

            </div>


            {growthIntelligenceProfile && (
              <GrowthIntelligenceInspector
                profile={
                  growthIntelligenceProfile
                }
                evidenceEventCount={
                  evidenceEventCount
                }
                traits={
                  intelligenceTraits
                }
                domains={
                  intelligenceDomains
                }
                pathways={
                  intelligencePathways
                }
                careers={
                  intelligenceCareers
                }
              />
            )}

          </div>
        </section>
      )}

    </main>
  )
}


// ============================================================
// DEVELOPMENT INSPECTOR
// ============================================================

function GrowthIntelligenceInspector({
  profile,
  evidenceEventCount,
  traits,
  domains,
  pathways,
  careers,
}) {
  if (!profile) {
    return null
  }

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '0.55rem 0',
    borderBottom:
      '1px solid #e4e7ee',
  }

  const valueStyle = {
    whiteSpace: 'nowrap',
    fontWeight: 700,
  }

  return (
    <details
      style={{
        maxWidth: '760px',
        margin: '2rem auto 0',
        padding: '1rem',
        border:
          '1px dashed #aeb6c7',
        borderRadius: '14px',
        background: '#f8f9fc',
        textAlign: 'left',
        color: '#172033',
      }}
    >

      <summary
        style={{
          cursor: 'pointer',
          fontWeight: 800,
        }}
      >
        🧪 Developer: Growth Intelligence Inspector
      </summary>


      <div
        style={{
          marginTop: '1rem',
          fontSize: '0.9rem',
        }}
      >

        <div style={rowStyle}>
          <span>
            Evidence events
          </span>

          <span style={valueStyle}>
            {evidenceEventCount}
          </span>
        </div>

        <div style={rowStyle}>
          <span>
            Experiences represented
          </span>

          <span style={valueStyle}>
            {
              profile
                .evidenceSummary
                ?.experienceCount
            }
          </span>
        </div>

        <div style={rowStyle}>
          <span>
            Source types represented
          </span>

          <span style={valueStyle}>
            {
              profile
                .evidenceSummary
                ?.sourceTypeCount
            }
          </span>
        </div>


        <InspectorSection
          title="Level 2 — Traits"
          items={traits}
          renderValue={(item) =>
            `${item.score}/100 · ${item.confidence.label}`
          }
        />

        <InspectorSection
          title="Level 3 — Domains"
          items={domains}
          renderValue={(item) =>
            `${item.score}/100 · ${item.confidence.label}`
          }
        />

        <InspectorSection
          title="Level 4 — Pathways"
          items={pathways}
          renderValue={(item) =>
            `${item.score}/100 · ${item.confidence.label}`
          }
        />

        <InspectorSection
          title="Level 5 — Career Families"
          items={careers}
          renderValue={(item) =>
            `${item.relevance}/100 · ${item.status.label}`
          }
        />

      </div>
    </details>
  )
}


function InspectorSection({
  title,
  items,
  renderValue,
}) {
  return (
    <div
      style={{
        marginTop: '1.3rem',
      }}
    >

      <strong>
        {title}
      </strong>

      {items.length === 0 ? (
        <p>
          No evidence yet.
        </p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              gap: '1rem',
              padding:
                '0.55rem 0',
              borderBottom:
                '1px solid #e4e7ee',
            }}
          >

            <span>
              {item.emoji
                ? `${item.emoji} `
                : ''}
              {item.label}
            </span>

            <span
              style={{
                whiteSpace:
                  'nowrap',
                fontWeight: 700,
              }}
            >
              {renderValue(item)}
            </span>

          </div>
        ))
      )}

    </div>
  )
}


export default App