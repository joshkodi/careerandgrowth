import {
  learningResourceCatalog,
} from '../data/learningResourceCatalog'

// src/intelligence/resourceProviderEngine.js

// ============================================================
// Career & Growth — MVP v0.8 — Phase 8.6A
// Resource Provider Engine
//
// Stable provider boundary between Resource Intelligence and
// external catalogs/search APIs.
//
// Phase 8.6A includes a deterministic DEVELOPMENT provider so
// the candidate/evaluation pipeline can be exercised end-to-end
// without coupling React to live web search.
//
// Later providers can implement the same discover(request)
// contract for curated catalogs, educational APIs, or backend
// search services.
// ============================================================


export const resourceProviderTypes =
  Object.freeze({
    DEVELOPMENT:
      'development',

    CURATED_CATALOG:
      'curated_catalog',

    EXTERNAL_API:
      'external_api',

    SEARCH_SERVICE:
      'search_service',
  })


const unique =
  (values = []) =>
    [
      ...new Set(
        values.filter(Boolean)
      ),
    ]


const humanize =
  (value = '') =>
    String(value)
      .replaceAll('_', ' ')
      .trim()


const makeCandidate =
  ({
    request,
    index,
    resourceType,
    titlePrefix,
    description,
    format = [],
  }) => {
    const learning =
      request?.learningContext ||
      {}

    const subject =
      learning.subject ||
      'Learning'

    const topic =
      learning.topic ||
      'Current topic'

    const intent =
      learning.learningIntent ||
      request.strategy ||
      'understand'

    return {
      id:
        `dev_resource_${request.id}_${index}`,

      provider:
        'Career & Growth Development Catalog',

      providerType:
        resourceProviderTypes
          .DEVELOPMENT,

      title:
        `${titlePrefix}: ${topic}`,

      description,

      resourceType,

      url: null,

      ageRange: {
        min: 6,
        max: 18,
      },

      subjects:
        unique([
          subject,
        ]),

      topics:
        unique([
          topic,
        ]),

      skills:
        unique([
          intent,
          topic,
        ]),

      tags:
        unique([
          subject,
          topic,
          intent,
          resourceType,
        ]),

      format,

      estimatedTime:
        resourceType ===
        'practice'
          ? '15–25 min'
          : '10–20 min',

      materials: [],

      prerequisites: [],

      supervision:
        'independent_or_parent_supported',

      sourceMetadata: {
        credibilityVerified:
          false,

        safetyVerified:
          true,

        developmentCandidate:
          true,

        note:
          'Synthetic Phase 8.6A candidate. Replace with a real provider result before production use.',
      },
    }
  }


const buildDevelopmentCandidates =
  (request) => {
    const preferred =
      request
        ?.discoveryCriteria
        ?.preferredResourceTypes ||
      []

    const learning =
      request?.learningContext ||
      {}

    const topic =
      learning.topic ||
      'this topic'

    const intent =
      learning.learningIntent ||
      request.strategy ||
      'understand'

    const descriptions = {
      lesson:
        `A structured lesson designed to help the student ${humanize(intent)} ${topic}.`,

      tutorial:
        `A step-by-step tutorial focused on the student's stated learning need for ${topic}.`,

      video:
        `A concise visual explanation intended to make ${topic} easier to understand.`,

      interactive:
        `An interactive learning activity for exploring and checking understanding of ${topic}.`,

      practice:
        `Targeted practice for building confidence and fluency with ${topic}.`,

      study_guide:
        `A review-oriented guide that organizes the key ideas the student should know about ${topic}.`,

      reference:
        `A reference resource for researching reliable background information about ${topic}.`,

      article:
        `An educational reading resource that provides context and explanation for ${topic}.`,

      activity:
        `A hands-on extension activity that helps the student explore ${topic} further.`,

      challenge:
        `A more challenging extension for a student who wants to go deeper into ${topic}.`,

      course:
        `A broader guided learning sequence related to ${topic}.`,
    }

    const prefixes = {
      lesson: 'Guided lesson',
      tutorial: 'Step-by-step tutorial',
      video: 'Visual explanation',
      interactive: 'Interactive exploration',
      practice: 'Practice set',
      study_guide: 'Review guide',
      reference: 'Reference',
      article: 'Educational reading',
      activity: 'Learning activity',
      challenge: 'Go-further challenge',
      course: 'Guided course',
    }

    const types =
      unique([
        ...preferred,
        'lesson',
        'practice',
      ])
        .slice(0, 6)

    return types.map(
      (
        resourceType,
        index
      ) =>
        makeCandidate({
          request,

          index,

          resourceType,

          titlePrefix:
            prefixes[
              resourceType
            ] ||
            'Learning resource',

          description:
            descriptions[
              resourceType
            ] ||
            `Learning support for ${topic}.`,

          format:
            resourceType ===
            'video'
              ? ['video']
              : resourceType ===
                  'interactive'
                ? ['interactive']
                : resourceType ===
                    'practice'
                  ? ['practice']
                  : ['guided'],
        })
    )
  }



const normalizeText =
  (value = '') =>
    String(value)
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(
        /[^a-z0-9 ]/g,
        ' '
      )
      .replace(
        /\s+/g,
        ' '
      )
      .trim()


const buildCatalogMatchText =
  (resource) =>
    normalizeText(
      [
        resource.title,
        resource.description,
        resource.subjects,
        resource.topics,
        resource.skills,
        resource.tags,
        resource.resourceType,
      ]
        .flat(Infinity)
        .filter(Boolean)
        .join(' ')
    )


const buildRequestTerms =
  (request) => {
    const learning =
      request?.learningContext ||
      {}

    return unique([
      learning.subject,
      learning.topic,
      learning.learningIntent,
      learning.helpMode,
      ...(
        request
          ?.intent
          ?.structuredIntent ||
        []
      ),
    ])
      .map(
        normalizeText
      )
      .filter(Boolean)
  }


const scoreCatalogResource =
  (
    resource,
    request
  ) => {
    const terms =
      buildRequestTerms(
        request
      )

    const blob =
      buildCatalogMatchText(
        resource
      )

    const preferred =
      request
        ?.discoveryCriteria
        ?.preferredResourceTypes ||
      []

    let score = 0

    terms.forEach(
      (term) => {
        if (
          blob.includes(term)
        ) {
          score += 2
        }

        term
          .split(' ')
          .filter(
            (word) =>
              word.length >= 4
          )
          .forEach(
            (word) => {
              if (
                blob.includes(
                  word
                )
              ) {
                score += 0.5
              }
            }
          )
      }
    )

    if (
      preferred.includes(
        resource.resourceType
      )
    ) {
      score += 2
    }

    return score
  }


export const curatedLearningResourceProvider =
  Object.freeze({
    id:
      'career_growth_curated_learning_catalog',

    type:
      resourceProviderTypes
        .CURATED_CATALOG,

    label:
      'Career & Growth Curated Learning Catalog',

    discover:
      (discoveryRequest) => {
        if (
          !discoveryRequest?.id
        ) {
          return []
        }

        const maxResults =
          Number(
            discoveryRequest
              ?.retrieval
              ?.maxResults
          ) || 8

        return learningResourceCatalog
          .map(
            (resource) => ({
              resource,

              matchScore:
                scoreCatalogResource(
                  resource,
                  discoveryRequest
                ),
            })
          )
          .filter(
            (item) =>
              item.matchScore > 0
          )
          .sort(
            (a, b) =>
              b.matchScore -
              a.matchScore
          )
          .slice(
            0,
            maxResults
          )
          .map(
            ({ resource }) => ({
              ...resource,

              providerType:
                resourceProviderTypes
                  .CURATED_CATALOG,
            })
          )
      },
  })


export const developmentResourceProvider =
  Object.freeze({
    id:
      'career_growth_development_provider',

    type:
      resourceProviderTypes
        .DEVELOPMENT,

    label:
      'Career & Growth Development Provider',

    discover:
      (discoveryRequest) => {
        if (
          !discoveryRequest?.id
        ) {
          return []
        }

        return buildDevelopmentCandidates(
          discoveryRequest
        )
      },
  })


export const discoverResourceCandidates =
  (
    discoveryRequest,
    {
      provider = null,
      includeDevelopmentFallback =
        true,
    } = {}
  ) => {
    if (!discoveryRequest) {
      return []
    }

    if (provider?.discover) {
      return provider.discover(
        discoveryRequest
      )
    }

    const curated =
      curatedLearningResourceProvider
        .discover(
          discoveryRequest
        )

    if (
      curated.length >= 3 ||
      !includeDevelopmentFallback
    ) {
      return curated
    }

    const development =
      developmentResourceProvider
        .discover(
          discoveryRequest
        )

    const existingIds =
      new Set(
        curated.map(
          (resource) =>
            resource.id
        )
      )

    return [
      ...curated,

      ...development.filter(
        (resource) =>
          !existingIds.has(
            resource.id
          )
      ),
    ]
  }



export default {
  resourceProviderTypes,
  curatedLearningResourceProvider,
  developmentResourceProvider,
  discoverResourceCandidates,
}
