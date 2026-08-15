// src/data/experienceCatalogV07.js

import {
  createExperienceAudienceProfile,
  createExperienceProfile,
  experienceOrigins,
  validateExperienceTemplate,
} from '../intelligence/experienceResearchModels'


// ============================================================
// Career & Growth — MVP v0.7 — Phase 7.1
// Normalized Internal Experience Catalog
//
// This is the v0.7 representation of the existing v0.6
// growExperiences catalog.
//
// IMPORTANT:
//
// This file is intentionally NOT wired into the current
// recommendation engine yet.
//
// v0.6 remains operational while v0.7 matching is built and
// tested beside it.
// ============================================================


const buildInternalExperience =
  ({
    id,
    title,
    emoji,
    description,
    audience,
    topics,
    interests,
    growthAlignment,
    skills,
    learningOutcomes,
    characteristics,
    practical,
  }) => ({
    id,

    origin:
      experienceOrigins
        .INTERNAL_TEMPLATE,

    title,
    emoji,
    description,

    audience:
      createExperienceAudienceProfile(
        audience
      ),

    profile:
      createExperienceProfile({
        topics,
        interests,
        growthAlignment,
        skills,
        learningOutcomes,
        characteristics,
      }),

    practical: {
      ...practical,
    },
  })


// ============================================================
// CATALOG
// ============================================================

export const experienceCatalogV07 = [
  buildInternalExperience({
    id: 'scratch_game',

    title:
      'Build Your First Game',

    emoji: '🎮',

    description:
      'Design and build a simple game using Scratch.',

    audience: {
      ageRange: {
        min: 8,
        max: 14,
      },

      difficulty:
        'beginner',

      participation:
        'independent',

      deliveryMode:
        'online',
    },

    topics: [
      'games',
      'coding',
      'design',
    ],

    interests: [
      'games',
      'coding',
      'design',
    ],

    growthAlignment: {
      domains: [
        'technology_robotics',
        'creative_arts_storytelling',
      ],

      pathways: [
        'engineering_intelligent_systems',
        'creative_design_expression',
      ],

      leverages: {
        signals: [
          'creating',
          'problem_solving',
          'hands_on',
        ],

        traits: [
          'creator',
          'builder',
          'problem_solver',
        ],
      },

      develops: {
        signals: [
          'problem_solving',
          'creative_thinking',
          'persistence',
          'experimenting',
        ],

        traits: [
          'problem_solver',
          'creator',
          'persistent_learner',
          'experimenter',
        ],
      },
    },

    skills: [
      'coding',
      'game_design',
      'digital_literacy',
    ],

    learningOutcomes: [
      'Create a simple interactive game.',
      'Practice debugging and iterative problem solving.',
      'Translate an idea into a working digital experience.',
    ],

    characteristics: {
      type: 'project',
      handsOn: true,
      structure: 'guided',
      collaboration:
        'optional',
    },

    practical: {
      estimatedTime:
        '2–4 hours',

      cost:
        'free_or_low_cost',
    },
  }),


  buildInternalExperience({
    id: 'animation_story',

    title:
      'Create a Short Animation',

    emoji: '🎬',

    description:
      'Create characters and turn a simple idea into a short animated story.',

    audience: {
      ageRange: {
        min: 8,
        max: 15,
      },

      difficulty:
        'beginner',

      participation:
        'independent',

      deliveryMode:
        'online',
    },

    topics: [
      'animation',
      'drawing',
      'stories',
      'design',
    ],

    interests: [
      'animation',
      'drawing',
      'stories',
      'design',
    ],

    growthAlignment: {
      domains: [
        'creative_arts_storytelling',
        'technology_robotics',
      ],

      pathways: [
        'creative_design_expression',
      ],

      leverages: {
        signals: [
          'creating',
          'creative_thinking',
          'communicating',
        ],

        traits: [
          'creator',
          'imaginative_thinker',
          'communicator',
        ],
      },

      develops: {
        signals: [
          'creating',
          'creative_thinking',
          'communicating',
          'persistence',
        ],

        traits: [
          'creator',
          'imaginative_thinker',
          'communicator',
          'persistent_learner',
        ],
      },
    },

    skills: [
      'storytelling',
      'animation',
      'visual_thinking',
      'digital_literacy',
    ],

    learningOutcomes: [
      'Turn an idea into a beginning, middle, and end.',
      'Use visual elements to communicate a story.',
      'Practice revising creative work.',
    ],

    characteristics: {
      type: 'project',
      handsOn: true,
      structure: 'guided',
      collaboration:
        'optional',
    },

    practical: {
      estimatedTime:
        '1–3 hours',

      cost:
        'free_or_low_cost',
    },
  }),


  buildInternalExperience({
    id: 'kitchen_science',

    title:
      'Kitchen Science Lab',

    emoji: '🧪',

    description:
      'Run a safe experiment using everyday household materials and explain what happened.',

    audience: {
      ageRange: {
        min: 7,
        max: 13,
      },

      difficulty:
        'beginner',

      participation:
        'parent_assisted',

      deliveryMode:
        'at_home',

      requiresAdultSupervision:
        true,
    },

    topics: [
      'science',
      'experiments',
      'how_things_work',
    ],

    interests: [
      'science',
      'experiments',
      'how_things_work',
    ],

    growthAlignment: {
      domains: [
        'science_discovery',
      ],

      pathways: [
        'science_exploration',
      ],

      leverages: {
        signals: [
          'curiosity',
          'experimenting',
          'hands_on',
        ],

        traits: [
          'curious_investigator',
          'experimenter',
        ],
      },

      develops: {
        signals: [
          'curiosity',
          'experimenting',
          'analytical_thinking',
          'pattern_recognition',
          'communicating',
        ],

        traits: [
          'curious_investigator',
          'experimenter',
          'pattern_finder',
          'communicator',
        ],
      },
    },

    skills: [
      'observation',
      'scientific_thinking',
      'cause_and_effect',
    ],

    learningOutcomes: [
      'Make an observation and describe what changed.',
      'Form a simple explanation based on evidence.',
      'Practice safe experimentation.',
    ],

    characteristics: {
      type: 'experiment',
      handsOn: true,
      structure: 'guided',
      collaboration:
        'parent_assisted',
    },

    practical: {
      estimatedTime:
        '45–90 minutes',

      cost:
        'low_cost',
    },
  }),


  buildInternalExperience({
    id: 'lego_engineering',

    title:
      'LEGO Engineering Challenge',

    emoji: '🧱',

    description:
      'Build a structure that solves a challenge using LEGO or other building materials.',

    audience: {
      ageRange: {
        min: 6,
        max: 13,
      },

      difficulty:
        'beginner',

      participation:
        'independent',

      deliveryMode:
        'at_home',
    },

    topics: [
      'building',
      'engineering',
      'making',
    ],

    interests: [
      'building',
      'engineering',
      'making',
    ],

    growthAlignment: {
      domains: [
        'engineering_making',
      ],

      pathways: [
        'engineering_intelligent_systems',
      ],

      leverages: {
        signals: [
          'hands_on',
          'creating',
          'problem_solving',
        ],

        traits: [
          'builder',
          'problem_solver',
        ],
      },

      develops: {
        signals: [
          'problem_solving',
          'persistence',
          'experimenting',
          'creative_thinking',
        ],

        traits: [
          'problem_solver',
          'persistent_learner',
          'experimenter',
          'builder',
        ],
      },
    },

    skills: [
      'spatial_thinking',
      'structural_design',
      'iterative_design',
    ],

    learningOutcomes: [
      'Design a structure around a constraint.',
      'Test and improve a physical design.',
      'Practice persistence when an initial design does not work.',
    ],

    characteristics: {
      type: 'challenge',
      handsOn: true,
      structure: 'open_ended',
      collaboration:
        'optional',
    },

    practical: {
      estimatedTime:
        '1–2 hours',

      cost:
        'uses_existing_materials',
    },
  }),


  buildInternalExperience({
    id: 'three_minute_talk',

    title:
      'Give a 3-Minute Talk',

    emoji: '🎤',

    description:
      'Choose something you care about and explain it to your family in three minutes.',

    audience: {
      ageRange: {
        min: 8,
        max: 17,
      },

      difficulty:
        'beginner',

      participation:
        'independent',

      deliveryMode:
        'at_home',
    },

    topics: [
      'speaking',
      'teaching',
      'sharing_ideas',
    ],

    interests: [
      'speaking',
      'teaching',
      'sharing_ideas',
    ],

    growthAlignment: {
      domains: [
        'people_society',
      ],

      pathways: [
        'people_leadership_society',
        'creative_design_expression',
      ],

      leverages: {
        signals: [
          'curiosity',
          'creating',
        ],

        traits: [
          'curious_investigator',
          'creator',
        ],
      },

      develops: {
        signals: [
          'communicating',
          'persistence',
          'leading',
        ],

        traits: [
          'communicator',
          'persistent_learner',
          'leader',
        ],
      },
    },

    skills: [
      'public_speaking',
      'organization',
      'explanation',
      'confidence_building',
    ],

    learningOutcomes: [
      'Organize an idea into a short explanation.',
      'Practice presenting to an audience.',
      'Build comfort explaining something personally meaningful.',
    ],

    characteristics: {
      type: 'practice',
      handsOn: false,
      structure: 'guided',
      collaboration:
        'family_audience',
    },

    practical: {
      estimatedTime:
        '30–60 minutes',

      cost: 'free',
    },
  }),


  buildInternalExperience({
    id: 'mini_business',

    title:
      'Create a Mini Business',

    emoji: '💡',

    description:
      'Invent a simple product or service and figure out who might want it and what it should cost.',

    audience: {
      ageRange: {
        min: 9,
        max: 17,
      },

      difficulty:
        'beginner',

      participation:
        'independent',

      deliveryMode:
        'flexible',
    },

    topics: [
      'business',
      'money',
      'creating',
      'selling',
    ],

    interests: [
      'business',
      'money',
      'creating',
      'selling',
    ],

    growthAlignment: {
      domains: [
        'business_entrepreneurship',
      ],

      pathways: [
        'innovation_entrepreneurship',
      ],

      leverages: {
        signals: [
          'creating',
          'problem_solving',
          'communicating',
        ],

        traits: [
          'creator',
          'problem_solver',
          'communicator',
        ],
      },

      develops: {
        signals: [
          'creative_thinking',
          'problem_solving',
          'communicating',
          'leading',
          'persistence',
        ],

        traits: [
          'creator',
          'problem_solver',
          'communicator',
          'leader',
          'persistent_learner',
        ],
      },
    },

    skills: [
      'decision_making',
      'financial_thinking',
      'customer_thinking',
      'pricing',
    ],

    learningOutcomes: [
      'Identify a simple need or customer problem.',
      'Shape an idea into a product or service.',
      'Make basic pricing and value decisions.',
    ],

    characteristics: {
      type: 'project',
      handsOn: true,
      structure: 'open_ended',
      collaboration:
        'optional',
    },

    practical: {
      estimatedTime:
        '2–4 hours',

      cost:
        'free_or_low_cost',
    },
  }),


  buildInternalExperience({
    id: 'career_interview',

    title:
      'Interview Someone About Their Career',

    emoji: '🧑‍💼',

    description:
      'Talk with an adult about what they do, how they got there, and what they enjoy about their work.',

    audience: {
      ageRange: {
        min: 9,
        max: 17,
      },

      difficulty:
        'beginner',

      participation:
        'parent_assisted',

      deliveryMode:
        'flexible',
    },

    topics: [
      'careers',
      'people',
      'future',
    ],

    interests: [
      'careers',
      'people',
      'future',
    ],

    growthAlignment: {
      domains: [
        'people_society',
      ],

      pathways: [
        'people_leadership_society',
      ],

      leverages: {
        signals: [
          'curiosity',
          'communicating',
        ],

        traits: [
          'curious_investigator',
          'communicator',
        ],
      },

      develops: {
        signals: [
          'curiosity',
          'communicating',
          'collaborating',
        ],

        traits: [
          'curious_investigator',
          'communicator',
        ],
      },
    },

    skills: [
      'career_awareness',
      'interviewing',
      'active_listening',
      'question_design',
    ],

    learningOutcomes: [
      'Prepare thoughtful questions.',
      'Learn how a real person entered and experiences a career.',
      'Reflect on what sounds interesting or uninteresting about that work.',
    ],

    characteristics: {
      type: 'conversation',
      handsOn: false,
      structure: 'guided',
      collaboration:
        'one_on_one',
    },

    practical: {
      estimatedTime:
        '30–60 minutes',

      cost: 'free',
    },
  }),


  buildInternalExperience({
    id: 'simple_website',

    title:
      'Build a Simple Website',

    emoji: '🌐',

    description:
      'Create a small website about something you care about.',

    audience: {
      ageRange: {
        min: 10,
        max: 17,
      },

      difficulty:
        'beginner',

      participation:
        'independent',

      deliveryMode:
        'online',
    },

    topics: [
      'coding',
      'design',
      'internet',
      'creating',
    ],

    interests: [
      'coding',
      'design',
      'internet',
      'creating',
    ],

    growthAlignment: {
      domains: [
        'technology_robotics',
        'creative_arts_storytelling',
      ],

      pathways: [
        'engineering_intelligent_systems',
        'creative_design_expression',
      ],

      leverages: {
        signals: [
          'creating',
          'problem_solving',
          'hands_on',
        ],

        traits: [
          'creator',
          'builder',
          'problem_solver',
        ],
      },

      develops: {
        signals: [
          'problem_solving',
          'creative_thinking',
          'persistence',
          'communicating',
        ],

        traits: [
          'problem_solver',
          'creator',
          'persistent_learner',
          'communicator',
        ],
      },
    },

    skills: [
      'coding',
      'web_design',
      'digital_literacy',
      'information_organization',
    ],

    learningOutcomes: [
      'Create a small working website.',
      'Organize information for another person to understand.',
      'Practice iterative design and debugging.',
    ],

    characteristics: {
      type: 'project',
      handsOn: true,
      structure: 'guided',
      collaboration:
        'optional',
    },

    practical: {
      estimatedTime:
        '2–5 hours',

      cost:
        'free_or_low_cost',
    },
  }),
]


// ============================================================
// LOOKUP
// ============================================================

export const getExperienceV07 =
  (experienceId) =>
    experienceCatalogV07.find(
      (experience) =>
        experience.id ===
        experienceId
    ) ||
    null


// ============================================================
// VALIDATION
// ============================================================

export const validateExperienceCatalogV07 =
  () => {
    const errors = []

    experienceCatalogV07.forEach(
      (experience) => {
        const validation =
          validateExperienceTemplate(
            experience
          )

        validation.errors.forEach(
          (error) => {
            errors.push(
              `${experience.id}: ${error}`
            )
          }
        )
      }
    )

    return {
      valid:
        errors.length === 0,

      experienceCount:
        experienceCatalogV07.length,

      errors,
    }
  }


export default experienceCatalogV07
