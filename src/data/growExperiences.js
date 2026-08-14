export const growExperiences = [
  {
    id: 'scratch_game',
    title: 'Build Your First Game',
    emoji: '🎮',

    description:
      'Design and build a simple game using Scratch.',

    domains: [
      'technology',
      'creative_design',
    ],

    develops: [
      'problem_solving',
      'creativity',
      'persistence',
    ],

    interests: [
      'games',
      'coding',
      'design',
    ],

    ageRange: {
      min: 8,
      max: 14,
    },

    difficulty: 'beginner',

    estimatedTime:
      '2–4 hours',

    type: 'project',
  },

  {
    id: 'animation_story',
    title: 'Create a Short Animation',
    emoji: '🎬',

    description:
      'Create characters and turn a simple idea into a short animated story.',

    domains: [
      'creative_design',
      'technology',
      'communication',
    ],

    develops: [
      'creativity',
      'storytelling',
      'visual_thinking',
    ],

    interests: [
      'animation',
      'drawing',
      'stories',
      'design',
    ],

    ageRange: {
      min: 8,
      max: 15,
    },

    difficulty: 'beginner',

    estimatedTime:
      '1–3 hours',

    type: 'project',
  },

  {
    id: 'kitchen_science',
    title: 'Kitchen Science Lab',
    emoji: '🧪',

    description:
      'Run a safe experiment using everyday household materials and explain what happened.',

    domains: [
      'science',
      'problem_solving',
    ],

    develops: [
      'curiosity',
      'observation',
      'scientific_thinking',
    ],

    interests: [
      'science',
      'experiments',
      'how_things_work',
    ],

    ageRange: {
      min: 7,
      max: 13,
    },

    difficulty: 'beginner',

    estimatedTime:
      '45–90 minutes',

    type: 'experiment',
  },

  {
    id: 'lego_engineering',
    title: 'LEGO Engineering Challenge',
    emoji: '🧱',

    description:
      'Build a structure that solves a challenge using LEGO or other building materials.',

    domains: [
      'engineering',
      'creative_design',
    ],

    develops: [
      'problem_solving',
      'spatial_thinking',
      'persistence',
    ],

    interests: [
      'building',
      'engineering',
      'making',
    ],

    ageRange: {
      min: 6,
      max: 13,
    },

    difficulty: 'beginner',

    estimatedTime:
      '1–2 hours',

    type: 'challenge',
  },

  {
    id: 'three_minute_talk',
    title: 'Give a 3-Minute Talk',
    emoji: '🎤',

    description:
      'Choose something you care about and explain it to your family in three minutes.',

    domains: [
      'communication',
      'leadership',
    ],

    develops: [
      'communication',
      'confidence',
      'organization',
    ],

    interests: [
      'speaking',
      'teaching',
      'sharing_ideas',
    ],

    ageRange: {
      min: 8,
      max: 17,
    },

    difficulty: 'beginner',

    estimatedTime:
      '30–60 minutes',

    type: 'practice',
  },

  {
    id: 'mini_business',
    title: 'Create a Mini Business',
    emoji: '💡',

    description:
      'Invent a simple product or service and figure out who might want it and what it should cost.',

    domains: [
      'business',
      'creative_problem_solving',
    ],

    develops: [
      'creativity',
      'decision_making',
      'financial_thinking',
      'communication',
    ],

    interests: [
      'business',
      'money',
      'creating',
      'selling',
    ],

    ageRange: {
      min: 9,
      max: 17,
    },

    difficulty: 'beginner',

    estimatedTime:
      '2–4 hours',

    type: 'project',
  },

  {
    id: 'career_interview',
    title: 'Interview Someone About Their Career',
    emoji: '🧑‍💼',

    description:
      'Talk with an adult about what they do, how they got there, and what they enjoy about their work.',

    domains: [
      'career_exploration',
      'communication',
    ],

    develops: [
      'curiosity',
      'communication',
      'career_awareness',
    ],

    interests: [
      'careers',
      'people',
      'future',
    ],

    ageRange: {
      min: 9,
      max: 17,
    },

    difficulty: 'beginner',

    estimatedTime:
      '30–60 minutes',

    type: 'conversation',
  },

  {
    id: 'simple_website',
    title: 'Build a Simple Website',
    emoji: '🌐',

    description:
      'Create a small website about something you care about.',

    domains: [
      'technology',
      'creative_design',
    ],

    develops: [
      'problem_solving',
      'creativity',
      'digital_literacy',
    ],

    interests: [
      'coding',
      'design',
      'internet',
      'creating',
    ],

    ageRange: {
      min: 10,
      max: 17,
    },

    difficulty: 'beginner',

    estimatedTime:
      '2–5 hours',

    type: 'project',
  },
]


export const getGrowExperience =
  (experienceId) =>
    growExperiences.find(
      (experience) =>
        experience.id ===
        experienceId
    ) || null