// src/intelligence/stabilizationValidationScenarios.js

// ============================================================
// Career & Growth — MVP v0.7
// Stabilization: Intelligence Validation Scenarios
//
// Purpose:
// Exercise the local Experience Research Engine against
// meaningfully different child profiles before we call v0.7
// stable.
//
// These scenarios are synthetic test fixtures only.
// They are NOT user data and do not create evidence.
// ============================================================


const confidence =
  (score = 0.8) => ({
    score,
    level:
      score >= 0.75
        ? 'high'
        : score >= 0.45
          ? 'medium'
          : 'low',
  })


const signal =
  (
    id,
    label,
    score,
    confidenceScore = 0.8
  ) => ({
    id,
    label,
    score,
    netStrength: score,
    confidence:
      confidence(
        confidenceScore
      ),
  })


const trait =
  (
    id,
    label,
    score,
    confidenceScore = 0.8
  ) => ({
    id,
    label,
    score,
    confidence:
      confidence(
        confidenceScore
      ),
  })


const domain =
  (
    id,
    label,
    score,
    confidenceScore = 0.8
  ) => ({
    id,
    label,
    score,
    confidence:
      confidence(
        confidenceScore
      ),
  })


const pathway =
  (
    id,
    label,
    score,
    confidenceScore = 0.75
  ) => ({
    id,
    label,
    score,
    confidence:
      confidence(
        confidenceScore
      ),
  })


const activeIntent =
  (
    id,
    text
  ) => ({
    id,
    type: 'student',
    text,
    status: 'active',
    createdAt:
      '2026-08-15T12:00:00.000Z',
  })


const activeParentGoal =
  (
    id,
    text
  ) => ({
    id,
    type: 'parent',
    text,
    status: 'active',
    createdAt:
      '2026-08-15T12:00:00.000Z',
  })


const growthProfile =
  ({
    childId,
    signals = [],
    traits = [],
    domains = [],
    pathways = [],
  }) => ({
    childId,

    generatedAt:
      '2026-08-15T12:00:00.000Z',

    signals:
      Object.fromEntries(
        signals.map(
          (item) => [
            item.id,
            item,
          ]
        )
      ),

    traits:
      Object.fromEntries(
        traits.map(
          (item) => [
            item.id,
            item,
          ]
        )
      ),

    domains:
      Object.fromEntries(
        domains.map(
          (item) => [
            item.id,
            item,
          ]
        )
      ),

    pathways:
      Object.fromEntries(
        pathways.map(
          (item) => [
            item.id,
            item,
          ]
        )
      ),
  })


// ============================================================
// SCENARIO A
// Builder / problem solver
// ============================================================

const builderProfile =
  growthProfile({
    childId:
      'scenario_builder',

    signals: [
      signal(
        'problem_solving',
        'Problem Solving',
        8.5
      ),

      signal(
        'hands_on',
        'Hands-On',
        8.1
      ),

      signal(
        'experimenting',
        'Experimenting',
        7.7
      ),

      signal(
        'persistence',
        'Persistence',
        7.2
      ),

      signal(
        'analytical_thinking',
        'Analytical Thinking',
        7.0
      ),

      signal(
        'curiosity',
        'Curiosity',
        6.8
      ),
    ],

    traits: [
      trait(
        'builder',
        'Builder',
        8.4
      ),

      trait(
        'problem_solver',
        'Problem Solver',
        8.1
      ),

      trait(
        'experimenter',
        'Experimenter',
        7.5
      ),

      trait(
        'persistent_learner',
        'Persistent Learner',
        7.0
      ),
    ],

    domains: [
      domain(
        'engineering_making',
        'Engineering & Making',
        8.6
      ),

      domain(
        'technology_robotics',
        'Technology & Robotics',
        7.8
      ),

      domain(
        'science_discovery',
        'Science & Discovery',
        7.0
      ),
    ],

    pathways: [
      pathway(
        'engineering_intelligent_systems',
        'Engineering & Intelligent Systems',
        8.4
      ),

      pathway(
        'science_exploration',
        'Science Exploration',
        6.8
      ),
    ],
  })


// ============================================================
// SCENARIO B
// Creator / communicator
// ============================================================

const creatorProfile =
  growthProfile({
    childId:
      'scenario_creator',

    signals: [
      signal(
        'creating',
        'Creating',
        8.7
      ),

      signal(
        'creative_thinking',
        'Creative Thinking',
        8.3
      ),

      signal(
        'communicating',
        'Communicating',
        7.9
      ),

      signal(
        'curiosity',
        'Curiosity',
        7.3
      ),

      signal(
        'helping',
        'Helping',
        6.8
      ),
    ],

    traits: [
      trait(
        'creator',
        'Creator',
        8.6
      ),

      trait(
        'imaginative_thinker',
        'Imaginative Thinker',
        8.2
      ),

      trait(
        'communicator',
        'Communicator',
        7.8
      ),

      trait(
        'helper',
        'Helper',
        6.7
      ),
    ],

    domains: [
      domain(
        'creative_arts_storytelling',
        'Creative Arts & Storytelling',
        8.8
      ),

      domain(
        'people_society',
        'People & Society',
        7.2
      ),

      domain(
        'technology_robotics',
        'Technology & Robotics',
        5.8
      ),
    ],

    pathways: [
      pathway(
        'creative_design_expression',
        'Creative Design & Expression',
        8.7
      ),

      pathway(
        'people_leadership_society',
        'People, Leadership & Society',
        6.9
      ),
    ],
  })


// ============================================================
// SCENARIO C
// Curious science / health explorer
// ============================================================

const scienceProfile =
  growthProfile({
    childId:
      'scenario_science',

    signals: [
      signal(
        'curiosity',
        'Curiosity',
        9.0
      ),

      signal(
        'analytical_thinking',
        'Analytical Thinking',
        8.4
      ),

      signal(
        'pattern_recognition',
        'Pattern Recognition',
        8.0
      ),

      signal(
        'experimenting',
        'Experimenting',
        7.8
      ),

      signal(
        'helping',
        'Helping',
        6.9
      ),
    ],

    traits: [
      trait(
        'curious_investigator',
        'Curious Investigator',
        9.0
      ),

      trait(
        'pattern_finder',
        'Pattern Finder',
        8.0
      ),

      trait(
        'experimenter',
        'Experimenter',
        7.7
      ),

      trait(
        'helper',
        'Helper',
        6.8
      ),
    ],

    domains: [
      domain(
        'science_discovery',
        'Science & Discovery',
        8.9
      ),

      domain(
        'health_human_body',
        'Health & Human Body',
        8.1
      ),

      domain(
        'nature_environment',
        'Nature & Environment',
        6.5
      ),
    ],

    pathways: [
      pathway(
        'science_exploration',
        'Science Exploration',
        8.8
      ),

      pathway(
        'health_human_sciences',
        'Health & Human Sciences',
        8.0
      ),
    ],
  })


// ============================================================
// SCENARIO D
// Younger child / sparse evidence
// ============================================================

const earlyExplorerProfile =
  growthProfile({
    childId:
      'scenario_early_explorer',

    signals: [
      signal(
        'curiosity',
        'Curiosity',
        4.2,
        0.45
      ),

      signal(
        'hands_on',
        'Hands-On',
        3.8,
        0.4
      ),
    ],

    traits: [
      trait(
        'curious_investigator',
        'Curious Investigator',
        3.9,
        0.42
      ),
    ],

    domains: [
      domain(
        'science_discovery',
        'Science & Discovery',
        3.7,
        0.4
      ),
    ],

    pathways: [],
  })


// ============================================================
// PUBLIC SCENARIOS
// ============================================================

export const stabilizationValidationScenarios = [
  {
    id:
      'builder_problem_solver',

    label:
      'Builder / Problem Solver',

    childProfile: {
      name:
        'Builder Test',

      age: '11',

      grade:
        '6th Grade',
    },

    growthProfile:
      builderProfile,

    studentIntents: [
      activeIntent(
        'builder_student_1',
        'I want to build something that moves.'
      ),
    ],

    parentIntents: [
      activeParentGoal(
        'builder_parent_1',
        'I want them to build confidence solving harder problems independently.'
      ),
    ],

    journeyItems: [],
  },


  {
    id:
      'creator_communicator',

    label:
      'Creator / Communicator',

    childProfile: {
      name:
        'Creator Test',

      age: '12',

      grade:
        '7th Grade',
    },

    growthProfile:
      creatorProfile,

    studentIntents: [
      activeIntent(
        'creator_student_1',
        'I want to make a story or animation.'
      ),
    ],

    parentIntents: [
      activeParentGoal(
        'creator_parent_1',
        'I want them to become more confident presenting their ideas.'
      ),
    ],

    journeyItems: [],
  },


  {
    id:
      'science_health_explorer',

    label:
      'Science / Health Explorer',

    childProfile: {
      name:
        'Science Test',

      age: '13',

      grade:
        '8th Grade',
    },

    growthProfile:
      scienceProfile,

    studentIntents: [
      activeIntent(
        'science_student_1',
        'I want to learn how the human body works.'
      ),
    ],

    parentIntents: [
      activeParentGoal(
        'science_parent_1',
        'I want them to keep developing analytical thinking and scientific curiosity.'
      ),
    ],

    journeyItems: [],
  },


  {
    id:
      'early_explorer_sparse',

    label:
      'Early Explorer / Sparse Evidence',

    childProfile: {
      name:
        'Early Test',

      age: '7',

      grade:
        '2nd Grade',
    },

    growthProfile:
      earlyExplorerProfile,

    studentIntents: [],

    parentIntents: [
      activeParentGoal(
        'early_parent_1',
        'I want them to explore safely and build confidence trying new things.'
      ),
    ],

    journeyItems: [],
  },


  {
    id:
      'builder_with_journey_history',

    label:
      'Builder / Existing Journey History',

    childProfile: {
      name:
        'Builder History Test',

      age: '11',

      grade:
        '6th Grade',
    },

    growthProfile:
      builderProfile,

    studentIntents: [
      activeIntent(
        'builder_history_student_1',
        'I want another engineering challenge.'
      ),
    ],

    parentIntents: [
      activeParentGoal(
        'builder_history_parent_1',
        'I want them to practice persistence when the first idea does not work.'
      ),
    ],

    journeyItems: [
      {
        id:
          'journey_existing_1',

        childId:
          'scenario_builder',

        experienceId:
          'candidate_teachengineering_mint_mobiles',

        title:
          'Exploring Variables with Mint-Mobiles',

        status:
          'completed',
      },

      {
        id:
          'journey_existing_2',

        childId:
          'scenario_builder',

        experienceId:
          'candidate_science_buddies_ball_run',

        title:
          'Ball Run Engineering Challenge',

        status:
          'completed',
      },
    ],
  },
]


export default stabilizationValidationScenarios
