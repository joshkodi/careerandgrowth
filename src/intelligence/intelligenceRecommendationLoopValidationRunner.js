// src/intelligence/intelligenceRecommendationLoopValidationRunner.js

// ============================================================
// Career & Growth — MVP v0.8.11
// Intelligence & Recommendation Loop — Validation Runner
//
// Local development test suite for orchestration behavior.
// No writes. No localStorage. No evidence creation.
// ============================================================

import {
  buildIntelligenceRecommendationLoop,
} from './intelligenceRecommendationLoop'

import {
  intelligenceRecommendationLoopValidationScenarios,
} from './intelligenceRecommendationLoopValidationScenarios'


const snapshotInput =
  (input) =>
    JSON.stringify(input)


const assertion = (
  condition,
  message
) => ({
  passed: Boolean(condition),
  message,
})


const validateScenario = (
  scenario,
  result,
  inputBefore,
  inputAfter
) => {
  const checks = []

  if (scenario.expectedIntent) {
    checks.push(
      assertion(
        result
          ?.recommendations
          ?.intent
          ?.type ===
          scenario.expectedIntent,
        `Expected intent "${scenario.expectedIntent}"; received "${result?.recommendations?.intent?.type || 'none'}".`
      )
    )
  }

  if (scenario.expectedIntentNot) {
    checks.push(
      assertion(
        result
          ?.recommendations
          ?.intent
          ?.type !==
          scenario.expectedIntentNot,
        `Intent must not be "${scenario.expectedIntentNot}".`
      )
    )
  }

  if (
    Number.isFinite(
      scenario
        .expectedEligiblePatternCount
    )
  ) {
    checks.push(
      assertion(
        result
          ?.intelligence
          ?.promotionRegistry
          ?.eligiblePatterns
          ?.length ===
          scenario
            .expectedEligiblePatternCount,
        `Expected ${scenario.expectedEligiblePatternCount} eligible promoted pattern(s).`
      )
    )
  }

  if (
    scenario
      .expectedPromotedPattern
  ) {
    checks.push(
      assertion(
        result
          ?.intelligence
          ?.promotionRegistry
          ?.eligiblePatterns
          ?.some(
            (pattern) =>
              pattern.patternId ===
              scenario
                .expectedPromotedPattern
          ),
        `Expected promoted pattern "${scenario.expectedPromotedPattern}".`
      )
    )
  }

  checks.push(
    assertion(
      result
        ?.guardrails
        ?.recommendationIsEvidence ===
        false,
      'Recommendations must never become evidence.'
    ),
    assertion(
      result
        ?.guardrails
        ?.intentIsEvidence ===
        false,
      'Intent must never become evidence.'
    ),
    assertion(
      result
        ?.guardrails
        ?.academicMasteryInference ===
        false,
      'The loop must not infer academic mastery.'
    ),
    assertion(
      result
        ?.guardrails
        ?.academicWeaknessInference ===
        false,
      'The loop must not infer academic weakness.'
    ),
    assertion(
      result
        ?.guardrails
        ?.mutatesEvidence ===
        false,
      'The loop must report that it does not mutate evidence.'
    ),
    assertion(
      inputBefore === inputAfter,
      'Input objects must remain unchanged.'
    )
  )

  return checks
}


export const runIntelligenceRecommendationLoopValidationScenario =
  (scenario) => {
    const inputBefore =
      snapshotInput(
        scenario.input
      )

    const result =
      buildIntelligenceRecommendationLoop(
        scenario.input
      )

    const inputAfter =
      snapshotInput(
        scenario.input
      )

    const checks =
      validateScenario(
        scenario,
        result,
        inputBefore,
        inputAfter
      )

    return {
      scenarioId:
        scenario.id,
      label:
        scenario.label,
      passed:
        checks.every(
          (check) =>
            check.passed
        ),
      checks,
      result,
    }
  }


export const runAllIntelligenceRecommendationLoopValidationScenarios =
  () => {
    const results =
      intelligenceRecommendationLoopValidationScenarios.map(
        runIntelligenceRecommendationLoopValidationScenario
      )

    const passedCount =
      results.filter(
        (result) =>
          result.passed
      ).length

    const failedCount =
      results.length -
      passedCount

    console.group(
      '🧠 MVP v0.8.11 — Intelligence & Recommendation Loop Validation'
    )

    results.forEach(
      (validation) => {
        console.group(
          `${validation.passed ? '✅' : '❌'} ${validation.label}`
        )

        console.log(
          'Intent:',
          validation
            .result
            ?.recommendations
            ?.intent
        )

        console.log(
          'Eligible patterns:',
          validation
            .result
            ?.intelligence
            ?.promotionRegistry
            ?.eligiblePatterns || []
        )

        console.log(
          'Next actions:',
          validation
            .result
            ?.recommendations
            ?.nextActions || []
        )

        validation.checks.forEach(
          (check) =>
            console.log(
              check.passed
                ? '✅'
                : '❌',
              check.message
            )
        )

        console.groupEnd()
      }
    )

    console.log(
      `Validation summary: ${passedCount}/${results.length} passed; ${failedCount} failed.`
    )

    console.groupEnd()

    return {
      version: '0.8.11',
      passed:
        failedCount === 0,
      passedCount,
      failedCount,
      scenarioCount:
        results.length,
      results,
    }
  }


export default {
  runIntelligenceRecommendationLoopValidationScenario,
  runAllIntelligenceRecommendationLoopValidationScenarios,
}
