// src/intelligence/stabilizationValidationRunner.js

import {
  generateResearchStrategies,
} from './researchStrategyGenerator'

import {
  buildResourceDiscoveryRequests,
} from './resourceDiscoveryEngine'

import {
  evaluateDiscoveredResources,
} from './resourceEvaluationEngine'

import {
  buildExperienceCandidates,
} from './experienceCandidateBuilder'

import {
  realResourceValidationFixtures,
} from './resourceValidationFixtures'

import {
  stabilizationValidationScenarios,
} from './stabilizationValidationScenarios'


// ============================================================
// Career & Growth — MVP v0.7
// Stabilization: Intelligence Validation Runner
//
// This is a local development test suite.
// It does not touch localStorage, Journey, or evidence.
// ============================================================


const summarizeBrief =
  (brief) => ({
    strategy:
      brief.strategy,

    anchorStrengths:
      brief.anchorStrengths,

    developmentOpportunities:
      brief.developmentOpportunities,

    intent:
      {
        student:
          brief.intent
            ?.student
            ?.structuredIntent ||
          [],

        parent:
          brief.intent
            ?.parent
            ?.structuredIntent ||
          [],
      },

    explorationContext:
      brief.explorationContext,

    evidenceObjective:
      brief.evidenceObjective,
  })


const summarizeEvaluation =
  ({
    resource,
    evaluation,
  }) => ({
    resourceId:
      resource.id,

    title:
      resource.title,

    status:
      evaluation.status,

    score:
      evaluation.score,

    candidateEligible:
      evaluation
        .experienceCandidateEligible,

    profileFit:
      evaluation
        .dimensions
        .find(
          (item) =>
            item.dimension ===
            'profile_fit'
        )
        ?.score ??
      null,

    intentAlignment:
      evaluation
        .dimensions
        .find(
          (item) =>
            item.dimension ===
            'intent_alignment'
        )
        ?.score ??
      null,

    developmentalFit:
      evaluation
        .dimensions
        .find(
          (item) =>
            item.dimension ===
            'developmental_fit'
        )
        ?.score ??
      null,
  })


export const runStabilizationValidationScenario =
  (scenario) => {
    const briefs =
      generateResearchStrategies({
        childProfile:
          scenario.childProfile,

        growthProfile:
          scenario.growthProfile,

        studentIntents:
          scenario.studentIntents,

        parentIntents:
          scenario.parentIntents,

        journeyItems:
          scenario.journeyItems,
      })

    const requests =
      buildResourceDiscoveryRequests(
        briefs
      )

    const strategyResults =
      requests.map(
        (request) => {
          const evaluated =
            evaluateDiscoveredResources(
              realResourceValidationFixtures,
              request
            )

          const candidates =
            buildExperienceCandidates(
              evaluated,
              request
            )

          return {
            strategy:
              request.strategy,

            searchQueries:
              request.searchQueries,

            evaluations:
              evaluated.map(
                summarizeEvaluation
              ),

            candidates:
              candidates.map(
                (candidate) => ({
                  id:
                    candidate.id,

                  title:
                    candidate.title,

                  strategy:
                    candidate.strategy,

                  buildsOn:
                    candidate.buildsOn,

                  practices:
                    candidate.practices,
                })
              ),
          }
        }
      )

    return {
      scenarioId:
        scenario.id,

      label:
        scenario.label,

      child:
        scenario.childProfile,

      researchBriefs:
        briefs.map(
          summarizeBrief
        ),

      strategyResults,
    }
  }


export const runAllStabilizationValidationScenarios =
  () => {
    const results =
      stabilizationValidationScenarios.map(
        runStabilizationValidationScenario
      )

    console.group(
      '🧪 MVP v0.7 — Stabilization Intelligence Validation'
    )

    results.forEach(
      (result) => {
        console.group(
          result.label
        )

        console.log(
          'Child:',
          result.child
        )

        console.log(
          'Research Briefs:',
          result.researchBriefs
        )

        result
          .strategyResults
          .forEach(
            (strategyResult) => {
              console.group(
                strategyResult
                  .strategy
              )

              console.log(
                'Search Queries:',
                strategyResult
                  .searchQueries
              )

              console.table(
                strategyResult
                  .evaluations
              )

              console.log(
                'Experience Candidates:',
                strategyResult
                  .candidates
              )

              console.groupEnd()
            }
          )

        console.groupEnd()
      }
    )

    console.groupEnd()

    return results
  }


export default {
  runStabilizationValidationScenario,
  runAllStabilizationValidationScenarios,
}
