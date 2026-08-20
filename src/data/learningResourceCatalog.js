// src/data/learningResourceCatalog.js

// ============================================================
// Career & Growth — MVP v0.8 — Phase 8.7A
// Curated Learning & Growth Resource Catalog
//
// First production-shaped provider dataset.
// Entries below point to real external educational resources.
//
// IMPORTANT:
// - Catalog metadata is intentionally conservative.
// - Age ranges are broad MVP matching ranges, not provider claims.
// - Resources remain subject to Resource Evaluation before display.
// ============================================================

export const learningResourceCatalogVersion = '0.8.7A'

export const learningResourceCatalog = [
  {
    id: 'khan_add_fractions_unlike_denominators_practice',

    provider: 'Khan Academy',

    title:
      'Add fractions with unlike denominators',

    description:
      'Practice adding fractions that have different denominators.',

    resourceType:
      'practice',

    url:
      'https://www.khanacademy.org/math/cc-fifth-grade-math/imp-fractions-3/imp-adding-and-subtracting-fractions-with-unlike-denominators/e/adding_fractions',

    ageRange: {
      min: 9,
      max: 14,
    },

    subjects: [
      'math',
    ],

    topics: [
      'fractions',
      'adding fractions',
      'unlike denominators',
      'different denominators',
      'common denominator',
    ],

    skills: [
      'practice',
      'fractions',
      'adding fractions',
    ],

    tags: [
      'math',
      'fractions',
      'practice',
      'unlike denominators',
    ],

    format: [
      'practice',
      'interactive',
    ],

    estimatedTime:
      '10–20 min',

    materials: [],

    prerequisites: [
      'basic fraction understanding',
    ],

    supervision:
      'independent_or_parent_supported',

    sourceMetadata: {
      curated:
        true,

      credibilityVerified:
        true,

      safetyVerified:
        true,

      catalogVersion:
        learningResourceCatalogVersion,
    },
  },

  {
    id: 'khan_understand_fractions',

    provider: 'Khan Academy',

    title:
      'Understand fractions',

    description:
      'A broader arithmetic unit for understanding fractions, equivalent fractions, and fraction operations.',

    resourceType:
      'lesson',

    url:
      'https://www.khanacademy.org/math/arithmetic/fraction-arithmetic',

    ageRange: {
      min: 8,
      max: 14,
    },

    subjects: [
      'math',
    ],

    topics: [
      'fractions',
      'equivalent fractions',
      'adding fractions',
      'subtracting fractions',
    ],

    skills: [
      'understand',
      'review',
      'fractions',
    ],

    tags: [
      'math',
      'fractions',
      'lesson',
      'review',
    ],

    format: [
      'lesson',
      'video',
      'practice',
    ],

    estimatedTime:
      '15–30 min',

    materials: [],

    prerequisites: [],

    supervision:
      'independent_or_parent_supported',

    sourceMetadata: {
      curated:
        true,

      credibilityVerified:
        true,

      safetyVerified:
        true,

      catalogVersion:
        learningResourceCatalogVersion,
    },
  },

  {
    id: 'phet_fractions_intro',

    provider:
      'PhET Interactive Simulations',

    title:
      'Fractions: Intro',

    description:
      'Explore fractions using interactive visual objects and fraction games.',

    resourceType:
      'interactive',

    url:
      'https://phet.colorado.edu/en/simulations/fractions-intro',

    ageRange: {
      min: 8,
      max: 14,
    },

    subjects: [
      'math',
    ],

    topics: [
      'fractions',
      'fraction sense',
      'equivalent fractions',
      'visual fractions',
    ],

    skills: [
      'understand',
      'visual learning',
      'fractions',
    ],

    tags: [
      'math',
      'fractions',
      'interactive',
      'visual',
    ],

    format: [
      'interactive',
      'simulation',
    ],

    estimatedTime:
      '10–20 min',

    materials: [],

    prerequisites: [],

    supervision:
      'independent_or_parent_supported',

    sourceMetadata: {
      curated:
        true,

      credibilityVerified:
        true,

      safetyVerified:
        true,

      catalogVersion:
        learningResourceCatalogVersion,
    },
  },

  {
    id: 'phet_build_a_fraction',

    provider:
      'PhET Interactive Simulations',

    title:
      'Build a Fraction',

    description:
      'Build fractions from shapes and numbers and explore them through an interactive fractions lab.',

    resourceType:
      'interactive',

    url:
      'https://phet.colorado.edu/en/simulations/build-a-fraction',

    ageRange: {
      min: 8,
      max: 14,
    },

    subjects: [
      'math',
    ],

    topics: [
      'fractions',
      'fraction sense',
      'equivalent fractions',
      'mixed numbers',
    ],

    skills: [
      'understand',
      'practice',
      'fractions',
    ],

    tags: [
      'math',
      'fractions',
      'interactive',
      'practice',
    ],

    format: [
      'interactive',
      'simulation',
    ],

    estimatedTime:
      '10–20 min',

    materials: [],

    prerequisites: [],

    supervision:
      'independent_or_parent_supported',

    sourceMetadata: {
      curated:
        true,

      credibilityVerified:
        true,

      safetyVerified:
        true,

      catalogVersion:
        learningResourceCatalogVersion,
    },
  },

  {
    id: 'ck12_adding_fractions',

    provider: 'CK-12',

    title:
      'Adding Fractions (Like and Unlike Denominators)',

    description:
      'A structured lesson explaining how to add fractions and why denominators must match first.',

    resourceType:
      'lesson',

    url:
      'https://flexbooks.ck12.org/cbook/ck-12-cbse-maths-class-6/section/5.4/primary/lesson/adding-fractions/',

    ageRange: {
      min: 9,
      max: 14,
    },

    subjects: [
      'math',
    ],

    topics: [
      'fractions',
      'adding fractions',
      'like denominators',
      'unlike denominators',
      'common denominator',
    ],

    skills: [
      'understand',
      'review',
      'adding fractions',
    ],

    tags: [
      'math',
      'fractions',
      'lesson',
      'unlike denominators',
    ],

    format: [
      'lesson',
      'reading',
    ],

    estimatedTime:
      '10–20 min',

    materials: [],

    prerequisites: [
      'basic fraction understanding',
    ],

    supervision:
      'independent_or_parent_supported',

    sourceMetadata: {
      curated:
        true,

      credibilityVerified:
        true,

      safetyVerified:
        true,

      catalogVersion:
        learningResourceCatalogVersion,
    },
  },

  {
    id: 'mathsisfun_adding_fractions',

    provider:
      'Math Is Fun',

    title:
      'Adding Fractions',

    description:
      'A visual step-by-step explanation of adding fractions, including the need for common denominators.',

    resourceType:
      'tutorial',

    url:
      'https://www.mathsisfun.com/fractions_addition.html',

    ageRange: {
      min: 8,
      max: 14,
    },

    subjects: [
      'math',
    ],

    topics: [
      'fractions',
      'adding fractions',
      'common denominator',
      'equivalent fractions',
    ],

    skills: [
      'understand',
      'example',
      'fractions',
    ],

    tags: [
      'math',
      'fractions',
      'tutorial',
      'visual',
    ],

    format: [
      'tutorial',
      'visual',
      'reading',
    ],

    estimatedTime:
      '10–15 min',

    materials: [],

    prerequisites: [],

    supervision:
      'independent_or_parent_supported',

    sourceMetadata: {
      curated:
        true,

      credibilityVerified:
        true,

      safetyVerified:
        true,

      catalogVersion:
        learningResourceCatalogVersion,
    },
  },

  {
    id: 'mathsisfun_fraction_addition_animation',

    provider:
      'Math Is Fun',

    title:
      'Adding Fractions Illustrated with Steps',

    description:
      'An illustrated explanation that shows the steps for adding fractions and making denominators the same.',

    resourceType:
      'interactive',

    url:
      'https://www.mathsisfun.com/numbers/fractions-addition-animation.html',

    ageRange: {
      min: 8,
      max: 14,
    },

    subjects: [
      'math',
    ],

    topics: [
      'fractions',
      'adding fractions',
      'common denominator',
      'visual fractions',
    ],

    skills: [
      'understand',
      'example',
      'fractions',
    ],

    tags: [
      'math',
      'fractions',
      'interactive',
      'visual',
    ],

    format: [
      'visual',
      'interactive',
    ],

    estimatedTime:
      '5–10 min',

    materials: [],

    prerequisites: [],

    supervision:
      'independent_or_parent_supported',

    sourceMetadata: {
      curated:
        true,

      credibilityVerified:
        true,

      safetyVerified:
        true,

      catalogVersion:
        learningResourceCatalogVersion,
    },
  },
]


export default {
  learningResourceCatalogVersion,
  learningResourceCatalog,
}
