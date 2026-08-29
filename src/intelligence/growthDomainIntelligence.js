// src/intelligence/growthDomainIntelligence.js

// ============================================================
// SynapStride — MVP v0.11 — Phase 2
// Domain Intelligence Adapters
//
// Purpose:
// Give School & Learning, Interests & Activities, and Experiences
// a consistent read-only view of the same Growth Intelligence
// context and canonical recommendation set.
//
// IMPORTANT:
// - This module does not create new evidence.
// - This module does not re-score the child.
// - This module does not call providers or LLMs.
// - Domain views are derived and rebuildable.
// ============================================================

import {
  growthIntelligenceDomains,
} from './growthIntelligenceContext'

import {
  journeyPaths,
} from './unifiedJourneyModels'

import {
  buildGrowthOpportunityDiscoveryRequest,
} from './growthOpportunityDiscoveryEngine'

import {
  runGrowthOpportunityPipeline,
} from './growthOpportunityPipeline'

export const growthDomainIntelligenceVersion = '0.11.4'

const safeArray = (value) =>
  Array.isArray(value) ? value : []

const latestByCreatedAt = (values = []) =>
  safeArray(values)
    .filter(Boolean)
    .slice()
    .sort(
      (a, b) =>
        new Date(b?.createdAt || b?.updatedAt || 0) -
        new Date(a?.createdAt || a?.updatedAt || 0)
    )[0] || null

const journeyPathByDomain = Object.freeze({
  [growthIntelligenceDomains.SCHOOL_LEARNING]:
    journeyPaths.SCHOOL_LEARNING,

  [growthIntelligenceDomains.INTERESTS_ACTIVITIES]:
    journeyPaths.ACTIVITIES_INTERESTS,

  [growthIntelligenceDomains.EXPERIENCES]:
    journeyPaths.EXPERIENCES,
})

const itemsForDomain = (context, domain) => {
  const path =
    journeyPathByDomain[domain] ||
    domain

  return safeArray(context?.journey?.items)
    .filter((item) => item?.path === path)
}

const recommendationsForDomain = (
  recommendationSet,
  domain
) =>
  safeArray(recommendationSet?.items)
    .filter((item) => item?.domain === domain)

const getTopProfileAnchors = (context) => {
  const profile =
    context?.understanding?.growthProfile || {}

  const collect = (group) =>
    Object.values(group || {})
      .filter(Boolean)
      .slice()
      .sort(
        (a, b) =>
          Number(b?.score || b?.confidence?.score || 0) -
          Number(a?.score || a?.confidence?.score || 0)
      )
      .slice(0, 5)
      .map((item) => ({
        id: item.id || null,
        label: item.label || item.id || null,
        score:
          item.score ??
          item.confidence?.score ??
          null,
      }))

  return {
    traits: collect(profile.traits),
    domains: collect(profile.domains),
    pathways: collect(profile.pathways),
  }
}

const buildSchoolLearningDomain = ({
  context,
  recommendationSet,
}) => {
  const domain =
    growthIntelligenceDomains.SCHOOL_LEARNING

  const journeyItems =
    itemsForDomain(context, domain)

  const recommendations =
    recommendationsForDomain(
      recommendationSet,
      domain
    )

  return {
    id: domain,
    version: growthDomainIntelligenceVersion,
    status: 'ready',

    context: {
      journeyItems,
      learningProgression:
        context?.understanding?.learningProgression || null,
    },

    recommendations,
    primaryRecommendation:
      recommendations[0] || null,

    discoveryNeed:
      recommendations[0]
        ? {
            type: 'learning_resource',
            subject:
              recommendations[0]
                ?.context?.subject || null,
            topic:
              recommendations[0]
                ?.context?.topic || null,
            intent:
              recommendations[0]?.intent || null,
            journeyItemId:
              recommendations[0]
                ?.target?.journeyItemId || null,
          }
        : null,

    guardrails: {
      masteryInference: false,
      weaknessInference: false,
    },
  }
}

const buildInterestsActivitiesDomain = ({
  context,
  recommendationSet,
}) => {
  const domain =
    growthIntelligenceDomains.INTERESTS_ACTIVITIES

  const journeyItems =
    itemsForDomain(context, domain)

  const recommendations =
    recommendationsForDomain(
      recommendationSet,
      domain
    )

  const latestStudentIntent =
    context?.intent?.student?.latest || null

  const profileAnchors =
    getTopProfileAnchors(context)

  const discoveryNeed = {
    type: 'interest_activity',
    sourceIntentId:
      latestStudentIntent?.id || null,
    sourceIntentText:
      latestStudentIntent?.text || null,
    profileAnchors,
    existingActivityCount:
      journeyItems.length,
    includeLocal: false,
  }

  const discoveryRequest =
    buildGrowthOpportunityDiscoveryRequest({
      domain,
      discoveryNeed,
      child: context?.child || null,
    })

  const existingOpportunityIds =
    journeyItems
      .map(
        (item) =>
          item?.experienceId ||
          item?.opportunityId
      )
      .filter(Boolean)

  const opportunityPipeline =
    runGrowthOpportunityPipeline(
      discoveryRequest,
      {
        existingOpportunityIds,
        recommendationLimit: 5,
      }
    )

  return {
    id: domain,
    version: growthDomainIntelligenceVersion,
    status: 'ready_for_discovery',

    context: {
      journeyItems,
      latestStudentIntent,
      profileAnchors,
    },

    recommendations,
    primaryRecommendation:
      recommendations[0] || null,

    discoveryNeed,
    discoveryRequest,
    opportunityPipeline,
    discoveredOpportunities:
      opportunityPipeline.recommended,
    primaryDiscoveredOpportunity:
      opportunityPipeline.recommended[0] || null,

    guardrails: {
      statedInterestIsEvidence: false,
      recommendationIsEvidence: false,
      liveProviderCalled: false,
      curatedProviderExecuted: true,
      locationDiscoveryEnabled: false,
    },
  }
}

const buildExperiencesDomain = ({
  context,
  recommendationSet,
}) => {
  const domain =
    growthIntelligenceDomains.EXPERIENCES

  const journeyItems =
    itemsForDomain(context, domain)

  const recommendations =
    recommendationsForDomain(
      recommendationSet,
      domain
    )

  const latestJourneyItem =
    latestByCreatedAt(journeyItems)

  const discoveryNeed =
    recommendations.length
      ? null
      : {
          type: 'growth_experience',
          intent:
            recommendationSet?.intent?.type ||
            'explore',
          profileAnchors:
            getTopProfileAnchors(context),
          includeLocal: false,
        }

  const discoveryRequest =
    discoveryNeed
      ? buildGrowthOpportunityDiscoveryRequest({
          domain,
          discoveryNeed,
          child: context?.child || null,
        })
      : null

  const opportunityPipeline =
    discoveryRequest
      ? runGrowthOpportunityPipeline(
          discoveryRequest,
          {
            existingOpportunityIds:
              journeyItems
                .map((item) => item?.experienceId)
                .filter(Boolean),
            recommendationLimit: 5,
          }
        )
      : null

  return {
    id: domain,
    version: growthDomainIntelligenceVersion,
    status: 'ready',

    context: {
      journeyItems,
      latestJourneyItem,
      promotedPatterns:
        context
          ?.understanding
          ?.promotionRegistry
          ?.eligiblePatterns || [],
      profileAnchors:
        getTopProfileAnchors(context),
    },

    recommendations,
    primaryRecommendation:
      recommendations[0] || null,

    discoveryNeed,
    discoveryRequest,
    opportunityPipeline,
    discoveredOpportunities:
      opportunityPipeline?.recommended || [],
    primaryDiscoveredOpportunity:
      opportunityPipeline?.recommended?.[0] || null,

    guardrails: {
      schoolOnlyCanTriggerDeepen: false,
      recommendationIsEvidence: false,
    },
  }
}

export function buildGrowthDomainIntelligence({
  context = null,
  recommendationSet = null,
} = {}) {
  return {
    version: growthDomainIntelligenceVersion,

    [growthIntelligenceDomains.SCHOOL_LEARNING]:
      buildSchoolLearningDomain({
        context,
        recommendationSet,
      }),

    [growthIntelligenceDomains.INTERESTS_ACTIVITIES]:
      buildInterestsActivitiesDomain({
        context,
        recommendationSet,
      }),

    [growthIntelligenceDomains.EXPERIENCES]:
      buildExperiencesDomain({
        context,
        recommendationSet,
      }),

    [growthIntelligenceDomains.LOCATION]: {
      id: growthIntelligenceDomains.LOCATION,
      version: growthDomainIntelligenceVersion,
      status: 'deferred',
      context: null,
      recommendations:
        recommendationsForDomain(
          recommendationSet,
          growthIntelligenceDomains.LOCATION
        ),
      primaryRecommendation: null,
      discoveryNeed: null,
      guardrails: {
        liveLocationDiscoveryEnabled: false,
      },
    },
  }
}

export default {
  growthDomainIntelligenceVersion,
  buildGrowthDomainIntelligence,
}
