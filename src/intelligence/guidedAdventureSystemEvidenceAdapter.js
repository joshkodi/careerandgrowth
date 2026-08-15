// src/intelligence/guidedAdventureSystemEvidenceAdapter.js

//
// Career & Growth — MVP v0.6
// Phase 2C-B — Guided Adventure System Evidence
//
// System Evidence should remain conservative.
//
// The system knows that the child progressed through a guided stage,
// but it does NOT know the quality of the work unless the product
// captures stronger behavioral evidence later.
//
// Therefore these weights are deliberately weak.
//

const SYSTEM_EVIDENCE_MULTIPLIER = 0.45

const clamp = (weight) =>
  Math.max(
    -1,
    Math.min(
      1,
      Number(weight) || 0
    )
  )

const STAGE_EVIDENCE = {
  build: [
    {
      signalId: 'hands_on',
      weight: 0.35,
    },
    {
      signalId: 'creating',
      weight: 0.3,
    },
    {
      signalId: 'persistence',
      weight: 0.2,
    },
  ],
}

export function getGuidedStageCompletionEvidence(
  stageId
) {
  const evidence =
    STAGE_EVIDENCE[
      stageId
    ] || []

  return evidence
    .map(
      (item) => ({
        signalId:
          item.signalId,

        weight:
          clamp(
            item.weight *
            SYSTEM_EVIDENCE_MULTIPLIER
          ),
      })
    )
    .filter(
      (item) =>
        item.weight !== 0
    )
}

export function describeGuidedStageCompletionEvidence(
  stageId
) {
  return {
    stageId,

    evidence:
      getGuidedStageCompletionEvidence(
        stageId
      ),
  }
}
