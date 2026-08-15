// src/intelligence/resourceDiscoveryEngine.js

// ============================================================
// Career & Growth — MVP v0.7 — Phase 7.4A
// Resource Discovery Contract + Research Request Builder
//
// Purpose:
// Translate a Phase 7.3 ResearchBrief into a structured,
// provider-neutral request for external resource discovery.
//
// IMPORTANT:
// This module defines WHAT Career & Growth wants researched.
// It does not perform network/web calls from the browser.
//
// Future server-side adapters can execute these requests against
// approved search/research providers without changing the core
// Growth Intelligence architecture.
// ============================================================


export const resourceDiscoveryRequestVersion =
  '0.7.4a'


export const resourceTypes = {
  PROJECT_GUIDE: 'project_guide',
  ACTIVITY: 'activity',
  TUTORIAL: 'tutorial',
  COURSE: 'course',
  LESSON: 'lesson',
  CHALLENGE: 'challenge',
  EXPERIMENT: 'experiment',
  VIDEO: 'video',
  ARTICLE: 'article',
  TOOL: 'tool',
  COMMUNITY_PROGRAM: 'community_program',
  OTHER: 'other',
}


export const costTypes = {
  FREE: 'free',
  PAID: 'paid',
  FREEMIUM: 'freemium',
  UNKNOWN: 'unknown',
}


export const supervisionLevels = {
  NONE: 'none',
  LIGHT: 'light',
  ACTIVE: 'active',
  UNKNOWN: 'unknown',
}


// ============================================================
// DISCOVERED RESOURCE CONTRACT
//
// Phase 7.4B will evaluate objects shaped like this.
// ============================================================

export const createDiscoveredResource =
  ({
    id = null,
    title = '',
    provider = '',
    url = '',
    description = '',
    resourceType =
      resourceTypes.OTHER,
    ageRange = null,
    gradeRange = null,
    cost =
      costTypes.UNKNOWN,
    estimatedTime = null,
    prerequisites = [],
    materials = [],
    supervision =
      supervisionLevels.UNKNOWN,
    format = [],
    topics = [],
    skills = [],
    sourceMetadata = {},
    retrievedFor = {},
  } = {}) => ({
    id,

    title,
    provider,
    url,
    description,

    resourceType,

    ageRange,
    gradeRange,

    cost,
    estimatedTime,

    prerequisites,
    materials,

    supervision,
    format,

    topics,
    skills,

    sourceMetadata,

    retrievedFor,

    evaluation: null,

    candidateStatus:
      'discovered',
  })


// ============================================================
// HELPERS
// ============================================================

const unique =
  (values = []) =>
    [
      ...new Set(
        values
          .filter(Boolean)
      ),
    ]


const humanize =
  (value = '') =>
    String(value)
      .replaceAll(
        '_',
        ' '
      )
      .trim()


const flattenIds =
  (value) => {
    if (!value) {
      return []
    }

    if (Array.isArray(value)) {
      return value
        .flatMap(
          flattenIds
        )
    }

    if (
      typeof value ===
      'string'
    ) {
      return [value]
    }

    if (
      typeof value ===
      'object'
    ) {
      return Object.values(
        value
      ).flatMap(
        flattenIds
      )
    }

    return []
  }


const readableTerms =
  (value) =>
    unique(
      flattenIds(value)
        .map(humanize)
    )


const getExplicitGoals =
  (brief) => ({
    student:
      brief
        ?.intent
        ?.student
        ?.sourceText ||
      [],

    parent:
      brief
        ?.intent
        ?.parent
        ?.sourceText ||
      [],

    structured:
      unique([
        ...(
          brief
            ?.intent
            ?.student
            ?.structuredIntent ||
          []
        ),

        ...(
          brief
            ?.intent
            ?.parent
            ?.structuredIntent ||
          []
        ),
      ]),
  })


const getProfileTerms =
  (brief) => ({
    strengths:
      readableTerms(
        brief
          ?.anchorStrengths
      ),

    development:
      readableTerms(
        brief
          ?.developmentOpportunities
      ),

    exploration:
      readableTerms(
        brief
          ?.explorationContext
      ),
  })


const getAgePhrase =
  (brief) => {
    const age =
      brief
        ?.audience
        ?.age

    const bracket =
      brief
        ?.audience
        ?.ageBracket

    if (age) {
      return `age ${age}`
    }

    if (bracket) {
      return humanize(
        bracket
      )
    }

    return 'child'
  }


// ============================================================
// SEARCH QUERY BUILDER
//
// These are research prompts, not direct recommendations.
// Provider adapters may use one or several queries.
// ============================================================

const buildSearchQueries =
  (brief) => {
    const profile =
      getProfileTerms(
        brief
      )

    const goals =
      getExplicitGoals(
        brief
      )

    const agePhrase =
      getAgePhrase(
        brief
      )

    const strategy =
      humanize(
        brief
          ?.strategy ||
        ''
      )

    const primaryTerms =
      unique([
        ...profile.strengths,
        ...profile.development,
        ...profile.exploration,
        ...goals.structured.map(
          humanize
        ),
      ])
        .slice(
          0,
          8
        )

    const core =
      primaryTerms
        .join(' ')

    const queries = [
      `${agePhrase} ${strategy} hands-on project activity ${core}`,

      `${agePhrase} educational challenge tutorial ${core}`,

      `${agePhrase} project-based learning ${core}`,
    ]

    return unique(
      queries.map(
        (query) =>
          query
            .replace(
              /\s+/g,
              ' '
            )
            .trim()
      )
    )
  }


// ============================================================
// RESOURCE DISCOVERY REQUEST
// ============================================================

export const buildResourceDiscoveryRequest =
  (
    researchBrief,
    {
      maxResults = 12,
    } = {}
  ) => {
    if (
      !researchBrief ||
      !researchBrief.id
    ) {
      return null
    }

    const profile =
      getProfileTerms(
        researchBrief
      )

    const goals =
      getExplicitGoals(
        researchBrief
      )

    return {
      id:
        `discovery_${researchBrief.id}`,

      version:
        resourceDiscoveryRequestVersion,

      researchBriefId:
        researchBrief.id,

      purpose:
        researchBrief.purpose,

      strategy:
        researchBrief.strategy,

      audience:
        researchBrief.audience,

      searchQueries:
        buildSearchQueries(
          researchBrief
        ),

      personalization: {
        anchorStrengths:
          profile.strengths,

        developmentOpportunities:
          profile.development,

        explorationContext:
          profile.exploration,

        studentGoals:
          goals.student,

        parentGoals:
          goals.parent,

        structuredIntent:
          goals.structured,
      },

      discoveryCriteria: {
        preferredResourceTypes: [
          resourceTypes
            .PROJECT_GUIDE,

          resourceTypes
            .ACTIVITY,

          resourceTypes
            .CHALLENGE,

          resourceTypes
            .EXPERIMENT,

          resourceTypes
            .TUTORIAL,
        ],

        allowSupportingContent: [
          resourceTypes
            .VIDEO,

          resourceTypes
            .ARTICLE,

          resourceTypes
            .TOOL,
        ],

        developmentalFit:
          researchBrief
            ?.constraints
            ?.developmentalFit ||
          null,

        safety:
          researchBrief
            ?.constraints
            ?.safety ||
          null,

        resourceQuality:
          researchBrief
            ?.constraints
            ?.resourceQuality ||
          null,

        personalization:
          researchBrief
            ?.constraints
            ?.personalization ||
          null,

        journeyNovelty:
          researchBrief
            ?.constraints
            ?.journeyNovelty ||
          null,
      },

      evidenceObjective:
        researchBrief
          .evidenceObjective,

      researchObjective:
        researchBrief
          .researchObjective,

      resultContract: {
        maxResults,

        requiredFields: [
          'title',
          'provider',
          'url',
          'description',
          'resourceType',
        ],

        desiredFields: [
          'ageRange',
          'gradeRange',
          'cost',
          'estimatedTime',
          'prerequisites',
          'materials',
          'supervision',
          'format',
          'topics',
          'skills',
        ],

        rule:
          'Return resources for evaluation, not child-facing recommendations. Do not claim unknown metadata as fact.',
      },
    }
  }


export const buildResourceDiscoveryRequests =
  (
    researchBriefs = [],
    options = {}
  ) =>
    researchBriefs
      .map(
        (brief) =>
          buildResourceDiscoveryRequest(
            brief,
            options
          )
      )
      .filter(Boolean)


// ============================================================
// DEVELOPMENT INSPECTOR
// ============================================================

export const inspectResourceDiscoveryRequests =
  (
    researchBriefs = [],
    options = {}
  ) => {
    const requests =
      buildResourceDiscoveryRequests(
        researchBriefs,
        options
      )

    console.group(
      '🌐 Career & Growth — Resource Discovery Requests'
    )

    requests.forEach(
      (request) => {
        console.group(
          `${humanize(request.strategy)} — ${request.researchObjective}`
        )

        console.log(
          'Audience:',
          request.audience
        )

        console.log(
          'Search Queries:',
          request.searchQueries
        )

        console.log(
          'Personalization:',
          request.personalization
        )

        console.log(
          'Discovery Criteria:',
          request.discoveryCriteria
        )

        console.log(
          'Evidence Objective:',
          request.evidenceObjective
        )

        console.log(
          'Result Contract:',
          request.resultContract
        )

        console.log(
          'Discovery Request:',
          request
        )

        console.groupEnd()
      }
    )

    console.groupEnd()

    return requests
  }


export default {
  resourceDiscoveryRequestVersion,
  resourceTypes,
  costTypes,
  supervisionLevels,
  createDiscoveredResource,
  buildResourceDiscoveryRequest,
  buildResourceDiscoveryRequests,
  inspectResourceDiscoveryRequests,
}
