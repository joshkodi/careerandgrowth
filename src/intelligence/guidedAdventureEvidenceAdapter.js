// src/intelligence/guidedAdventureEvidenceAdapter.js

//
// Career & Growth — MVP v0.6
// Phase 2C-A — Guided Adventure Kid Experience Evidence
//
// This adapter converts the child's post-activity experience responses
// into canonical signal evidence.
//
// Important:
// - These are child-reported EXPERIENCE responses.
// - They belong to the Kid Experience evidence stream.
// - They should be meaningful, but not overpower repeated behavior.
// - Clicking/opening a resource is NOT evidence here.
//

const KID_EXPERIENCE_MULTIPLIER = 0.8

const clamp = (weight) =>
  Math.max(
    -1,
    Math.min(
      1,
      Number(weight) || 0
    )
  )

const EVIDENCE_BY_RESPONSE = {
  most_fun: {
    learning: [
      {
        signalId: 'curiosity',
        weight: 0.8,
      },
      {
        signalId: 'analytical_thinking',
        weight: 0.4,
      },
    ],

    trying: [
      {
        signalId: 'experimenting',
        weight: 0.9,
      },
      {
        signalId: 'challenge_seeking',
        weight: 0.3,
      },
    ],

    designing: [
      {
        signalId: 'creating',
        weight: 0.8,
      },
      {
        signalId: 'hands_on',
        weight: 0.7,
      },
    ],

    solving: [
      {
        signalId: 'problem_solving',
        weight: 0.9,
      },
      {
        signalId: 'analytical_thinking',
        weight: 0.5,
      },
    ],
  },

  challenge_response: {
    try_again: [
      {
        signalId: 'persistence',
        weight: 0.9,
      },
      {
        signalId: 'experimenting',
        weight: 0.6,
      },
    ],

    figure_out: [
      {
        signalId: 'problem_solving',
        weight: 0.8,
      },
      {
        signalId: 'analytical_thinking',
        weight: 0.6,
      },
    ],

    ask_help: [
      {
        signalId: 'collaborating',
        weight: 0.7,
      },
      {
        signalId: 'communicating',
        weight: 0.4,
      },
    ],

    move_on: [
      {
        signalId: 'persistence',
        weight: -0.25,
      },
    ],
  },

  do_again: {
    yes: [
      {
        signalId: 'enjoyment',
        weight: 0.8,
      },
      {
        signalId: 'challenge_seeking',
        weight: 0.5,
      },
    ],

    maybe: [
      {
        signalId: 'enjoyment',
        weight: 0.35,
      },
    ],

    different_kind: [
      {
        signalId: 'curiosity',
        weight: 0.35,
      },
      {
        signalId: 'enjoyment',
        weight: 0.1,
      },
    ],

    no: [
      {
        signalId: 'enjoyment',
        weight: -0.4,
      },
    ],
  },
}

export function getGuidedKidExperienceEvidence(
  promptId,
  responseId
) {
  const evidence =
    EVIDENCE_BY_RESPONSE[
      promptId
    ]?.[
      responseId
    ] || []

  return evidence
    .map(
      (item) => ({
        signalId:
          item.signalId,

        weight:
          clamp(
            item.weight *
            KID_EXPERIENCE_MULTIPLIER
          ),
      })
    )
    .filter(
      (item) =>
        item.weight !== 0
    )
}

export function describeGuidedKidExperienceEvidence(
  promptId,
  responseId
) {
  return {
    promptId,
    responseId,
    evidence:
      getGuidedKidExperienceEvidence(
        promptId,
        responseId
      ),
  }
}
