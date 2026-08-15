// src/intelligence/resourceValidationFixtures.js

import {
  createDiscoveredResource,
  resourceTypes,
  costTypes,
  supervisionLevels,
} from './resourceDiscoveryEngine'


// ============================================================
// Career & Growth — MVP v0.7
// Phase 7.4B — Real Resource Validation Fixtures
//
// These fixtures represent external resources selected for
// controlled evaluator validation.
//
// IMPORTANT:
// Metadata here is intentionally conservative. Unknown fields
// remain unknown rather than being invented.
// ============================================================


export const realResourceValidationFixtures = [
  createDiscoveredResource({
    id: 'science_buddies_ball_run',

    title:
      'Ball Run Engineering Challenge',

    provider:
      'Science Buddies',

    url:
      'https://www.sciencebuddies.org/blog/engineering-challenge-ball-run-steps-for-success',

    description:
      'A hands-on engineering design challenge where students build, test, observe, problem solve, and improve a ball-run design.',

    resourceType:
      resourceTypes.CHALLENGE,

    ageRange: {
      min: 6,
      max: 18,
    },

    cost:
      costTypes.UNKNOWN,

    estimatedTime:
      null,

    prerequisites: [],

    materials: [
      'building materials',
      'ball',
    ],

    supervision:
      supervisionLevels.LIGHT,

    format: [
      'hands_on',
      'engineering_design',
      'build_test_improve',
    ],

    topics: [
      'engineering',
      'design',
      'problem solving',
      'experimentation',
    ],

    skills: [
      'problem solving',
      'building',
      'observation',
      'persistence',
      'analytical thinking',
    ],

    sourceMetadata: {
      sourceType:
        'educational_organization',

      credibilityVerified:
        false,

      safetyVerified:
        false,

      validationFixture:
        true,
    },

    retrievedFor: {
      strategy:
        'strengthen',
    },
  }),


  createDiscoveredResource({
    id: 'teachengineering_mint_mobiles',

    title:
      'Exploring Variables with Mint-Mobiles',

    provider:
      'TeachEngineering',

    url:
      'https://www.teachengineering.org/activities/view/cub-2537-exploring-variables-mint-mobiles-middle-school',

    description:
      'A middle-school engineering activity where students design and build a model vehicle, test variables, collect data, analyze results, and improve the design.',

    resourceType:
      resourceTypes.ACTIVITY,

    ageRange: {
      min: 11,
      max: 14,
    },

    gradeRange: {
      min: 6,
      max: 8,
    },

    cost:
      costTypes.UNKNOWN,

    estimatedTime:
      'about 1 hour',

    prerequisites: [],

    materials: [
      'activity materials',
      'model vehicle materials',
    ],

    supervision:
      supervisionLevels.ACTIVE,

    format: [
      'hands_on',
      'engineering_design',
      'data_collection',
      'build_test_improve',
    ],

    topics: [
      'engineering',
      'variables',
      'data',
      'design',
      'experimentation',
    ],

    skills: [
      'problem solving',
      'analytical thinking',
      'building',
      'observation',
      'experimentation',
    ],

    sourceMetadata: {
      sourceType:
        'engineering_education_resource',

      credibilityVerified:
        false,

      safetyVerified:
        false,

      validationFixture:
        true,
    },

    retrievedFor: {
      strategy:
        'strengthen',
    },
  }),


  createDiscoveredResource({
    id: 'teachengineering_cooler_design',

    title:
      'Design Your Own Cooler Challenge',

    provider:
      'TeachEngineering',

    url:
      'https://www.teachengineering.org/makerchallenges/view/rice-2405-cooler-design-engineering-challenge',

    description:
      'A maker challenge in which students design, prototype, measure, test, compare results, and improve a cooler solution using the engineering design process.',

    resourceType:
      resourceTypes.CHALLENGE,

    ageRange: {
      min: 11,
      max: 14,
    },

    gradeRange: {
      min: 6,
      max: 8,
    },

    cost:
      costTypes.UNKNOWN,

    estimatedTime:
      'about 90 minutes',

    prerequisites: [],

    materials: [
      'prototype materials',
      'measurement materials',
    ],

    supervision:
      supervisionLevels.ACTIVE,

    format: [
      'hands_on',
      'maker',
      'engineering_design',
      'prototype_test_improve',
    ],

    topics: [
      'engineering',
      'design',
      'measurement',
      'experimentation',
    ],

    skills: [
      'problem solving',
      'building',
      'analytical thinking',
      'observation',
      'persistence',
    ],

    sourceMetadata: {
      sourceType:
        'engineering_education_resource',

      credibilityVerified:
        false,

      safetyVerified:
        false,

      validationFixture:
        true,
    },

    retrievedFor: {
      strategy:
        'strengthen',
    },
  }),


  // Deliberately incomplete fixture.
  // It tests whether missing metadata produces REVIEW rather
  // than artificial confidence.
  createDiscoveredResource({
    id: 'incomplete_generic_resource',

    title:
      'Fun Engineering Ideas',

    provider:
      'Unknown Learning Site',

    url:
      'https://example.com/fun-engineering-ideas',

    description:
      'A page containing several general engineering ideas for children.',

    resourceType:
      resourceTypes.ARTICLE,

    ageRange:
      null,

    cost:
      costTypes.UNKNOWN,

    estimatedTime:
      null,

    prerequisites: [],

    materials: [],

    supervision:
      supervisionLevels.UNKNOWN,

    format: [],

    topics: [
      'engineering',
    ],

    skills: [],

    sourceMetadata: {
      credibilityVerified:
        false,

      safetyVerified:
        false,

      validationFixture:
        true,

      intentionallyIncomplete:
        true,
    },

    retrievedFor: {
      strategy:
        'strengthen',
    },
  }),


  // Deliberately age-inappropriate fixture.
  // This verifies the developmental hard gate.
  createDiscoveredResource({
    id: 'adult_engineering_course',

    title:
      'Advanced Professional Engineering Systems',

    provider:
      'Example Professional Institute',

    url:
      'https://example.com/advanced-professional-engineering',

    description:
      'An advanced professional engineering course intended for adult learners.',

    resourceType:
      resourceTypes.COURSE,

    ageRange: {
      min: 18,
      max: 99,
    },

    cost:
      costTypes.PAID,

    estimatedTime:
      '20 hours',

    prerequisites: [
      'advanced mathematics',
      'college-level physics',
    ],

    materials: [],

    supervision:
      supervisionLevels.NONE,

    format: [
      'course',
    ],

    topics: [
      'engineering',
    ],

    skills: [
      'analytical thinking',
    ],

    sourceMetadata: {
      credibilityVerified:
        false,

      safetyVerified:
        false,

      validationFixture:
        true,

      intentionallyAgeInappropriate:
        true,
    },

    retrievedFor: {
      strategy:
        'strengthen',
    },
  }),

  // ==========================================================
  // Synthetic local fixtures used only by the v0.7
  // stabilization matrix. These are deliberately domain-
  // diverse so profile-fit behavior can be validated without
  // web search, an LLM, or a database.
  // ==========================================================

  createDiscoveredResource({
    id: 'validation_storyboard_challenge',
    title: 'Storyboard a Short Adventure',
    provider: 'Career & Growth Validation Fixture',
    url: null,
    description:
      'A creative storytelling activity where a child develops characters, sequences scenes, communicates an idea visually, and revises a short storyboard.',
    resourceType: resourceTypes.ACTIVITY,
    ageRange: { min: 9, max: 14 },
    cost: costTypes.FREE,
    estimatedTime: '45–60 minutes',
    prerequisites: [],
    materials: ['paper', 'pencil or drawing tools'],
    supervision: supervisionLevels.LIGHT,
    format: [
      'creative_project',
      'storytelling',
      'visual_communication',
    ],
    topics: [
      'creative arts',
      'storytelling',
      'communication',
      'design',
    ],
    skills: [
      'creating',
      'creative thinking',
      'communicating',
      'imagination',
      'storytelling',
    ],
    sourceMetadata: {
      credibilityVerified: false,
      safetyVerified: false,
      validationFixture: true,
      syntheticValidationOnly: true,
    },
    retrievedFor: { strategy: 'strengthen' },
  }),

  createDiscoveredResource({
    id: 'validation_animation_pitch',
    title: 'Create and Pitch a Mini Animation Idea',
    provider: 'Career & Growth Validation Fixture',
    url: null,
    description:
      'A creative communication challenge where a child invents an animation concept, creates a simple visual plan, and presents the idea to another person.',
    resourceType: resourceTypes.CHALLENGE,
    ageRange: { min: 10, max: 15 },
    cost: costTypes.FREE,
    estimatedTime: '60 minutes',
    prerequisites: [],
    materials: ['paper or simple animation tool'],
    supervision: supervisionLevels.LIGHT,
    format: [
      'creative_project',
      'presentation',
      'visual_storytelling',
    ],
    topics: [
      'creative arts',
      'storytelling',
      'people society',
      'communication',
    ],
    skills: [
      'creating',
      'creative thinking',
      'communicating',
      'imagination',
      'presentation',
    ],
    sourceMetadata: {
      credibilityVerified: false,
      safetyVerified: false,
      validationFixture: true,
      syntheticValidationOnly: true,
    },
    retrievedFor: { strategy: 'strengthen' },
  }),

  createDiscoveredResource({
    id: 'validation_story_interview',
    title: 'Interview Someone and Turn It into a Story',
    provider: 'Career & Growth Validation Fixture',
    url: null,
    description:
      'A people-and-storytelling activity where a child asks questions, listens carefully, identifies an interesting theme, and communicates it as a short story.',
    resourceType: resourceTypes.ACTIVITY,
    ageRange: { min: 10, max: 16 },
    cost: costTypes.FREE,
    estimatedTime: '45–75 minutes',
    prerequisites: [],
    materials: ['notes'],
    supervision: supervisionLevels.LIGHT,
    format: [
      'interview',
      'storytelling',
      'communication',
    ],
    topics: [
      'people society',
      'storytelling',
      'communication',
      'creative arts',
    ],
    skills: [
      'communicating',
      'creating',
      'listening',
      'creative thinking',
      'storytelling',
    ],
    sourceMetadata: {
      credibilityVerified: false,
      safetyVerified: false,
      validationFixture: true,
      syntheticValidationOnly: true,
    },
    retrievedFor: { strategy: 'strengthen' },
  }),

  createDiscoveredResource({
    id: 'validation_body_system_investigation',
    title: 'Investigate How a Body System Works',
    provider: 'Career & Growth Validation Fixture',
    url: null,
    description:
      'A science investigation where a child chooses a human body system, asks questions, identifies patterns, explains how parts work together, and communicates findings.',
    resourceType: resourceTypes.ACTIVITY,
    ageRange: { min: 10, max: 15 },
    cost: costTypes.FREE,
    estimatedTime: '60 minutes',
    prerequisites: [],
    materials: ['reference material', 'notes'],
    supervision: supervisionLevels.LIGHT,
    format: [
      'science_investigation',
      'research',
      'explanation',
    ],
    topics: [
      'science discovery',
      'health human body',
      'human body',
      'biology',
    ],
    skills: [
      'curiosity',
      'analytical thinking',
      'pattern recognition',
      'investigation',
      'communicating',
    ],
    sourceMetadata: {
      credibilityVerified: false,
      safetyVerified: false,
      validationFixture: true,
      syntheticValidationOnly: true,
    },
    retrievedFor: { strategy: 'strengthen' },
  }),

  createDiscoveredResource({
    id: 'validation_pulse_experiment',
    title: 'Pulse and Activity Observation',
    provider: 'Career & Growth Validation Fixture',
    url: null,
    description:
      'A simple human-body science observation where a child compares pulse measurements before and after ordinary activity, records data, notices patterns, and explains results.',
    resourceType: resourceTypes.EXPERIMENT,
    ageRange: { min: 9, max: 14 },
    cost: costTypes.FREE,
    estimatedTime: '30–45 minutes',
    prerequisites: [],
    materials: ['timer', 'notes'],
    supervision: supervisionLevels.ACTIVE,
    format: [
      'science_experiment',
      'data_collection',
      'observation',
    ],
    topics: [
      'science discovery',
      'health human body',
      'human body',
      'data',
    ],
    skills: [
      'curiosity',
      'analytical thinking',
      'pattern recognition',
      'experimenting',
      'observation',
    ],
    sourceMetadata: {
      credibilityVerified: false,
      safetyVerified: false,
      validationFixture: true,
      syntheticValidationOnly: true,
    },
    retrievedFor: { strategy: 'strengthen' },
  }),

  createDiscoveredResource({
    id: 'validation_science_pattern_detective',
    title: 'Become a Science Pattern Detective',
    provider: 'Career & Growth Validation Fixture',
    url: null,
    description:
      'A science exploration challenge where a child gathers observations, looks for patterns, forms an explanation, and identifies a new question to investigate.',
    resourceType: resourceTypes.CHALLENGE,
    ageRange: { min: 8, max: 14 },
    cost: costTypes.FREE,
    estimatedTime: '45 minutes',
    prerequisites: [],
    materials: ['observation notes'],
    supervision: supervisionLevels.LIGHT,
    format: [
      'science_investigation',
      'pattern_finding',
      'exploration',
    ],
    topics: [
      'science discovery',
      'science exploration',
      'patterns',
      'investigation',
    ],
    skills: [
      'curiosity',
      'analytical thinking',
      'pattern recognition',
      'experimenting',
      'observation',
    ],
    sourceMetadata: {
      credibilityVerified: false,
      safetyVerified: false,
      validationFixture: true,
      syntheticValidationOnly: true,
    },
    retrievedFor: { strategy: 'strengthen' },
  }),

]


export default realResourceValidationFixtures
