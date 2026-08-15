// src/intelligence/resourceValidationRunner.js

import {
  generateResearchStrategies,
} from './researchStrategyGenerator'

import {
  buildResourceDiscoveryRequests,
} from './resourceDiscoveryEngine'

import {
  inspectResourceEvaluations,
} from './resourceEvaluationEngine'

import {
  realResourceValidationFixtures,
} from './resourceValidationFixtures'


// ============================================================
// Career & Growth — MVP v0.7
// Phase 7.4B — Real Resource Validation Runner
//
// Development-only.
// Uses the current child context to build the real Strengthen
// discovery request, then evaluates controlled resource fixtures.
// ============================================================


export const runRealResourceValidation =
  ({
    childProfile = {},
    growthProfile = null,
    studentIntents = [],
    parentIntents = [],
    journeyItems = [],
  } = {}) => {
    const briefs =
      generateResearchStrategies({
        childProfile,
        growthProfile,
        studentIntents,
        parentIntents,
        journeyItems,
      })

    const requests =
      buildResourceDiscoveryRequests(
        briefs
      )

    const strengthenRequest =
      requests.find(
        (request) =>
          request.strategy ===
          'strengthen'
      )

    if (!strengthenRequest) {
      console.warn(
        'Career & Growth validation: Strengthen discovery request was not generated.'
      )

      return []
    }

    console.group(
      '🧭 Career & Growth — Real Resource Validation'
    )

    console.log(
      'Strengthen Discovery Request:',
      strengthenRequest
    )

    console.log(
      'Validation Resources:',
      realResourceValidationFixtures
    )

    const evaluated =
      inspectResourceEvaluations(
        realResourceValidationFixtures,
        strengthenRequest
      )

    console.log(
      'Validation Summary:',
      evaluated.map(
        ({
          resource,
          evaluation,
        }) => ({
          title:
            resource.title,

          status:
            evaluation.status,

          score:
            evaluation.score,

          candidateEligible:
            evaluation
              .experienceCandidateEligible,
        })
      )
    )

    console.groupEnd()

    return evaluated
  }


export default {
  runRealResourceValidation,
}
