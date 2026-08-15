// src/intelligence/growthEngine.js

import {
  traits,
  domains,
  pathways,
  careerFamilies,
  evidenceStreams,
  getConfidenceLevel,
} from "../data/growthTaxonomy";

import {
  getEvidenceStream,
} from "./evidenceEngine";

//
// Career & Growth — MVP v0.6 — Phase 1C-B
// Growth Intelligence Engine
//
// Responsibilities:
//
// 1. Aggregate raw evidence events.
// 2. Calculate signal strength.
// 3. Derive traits from signals.
// 4. Derive domain affinity from contextual evidence.
// 5. Derive pathways from traits + domains.
// 6. Derive career-family relevance from pathways.
// 7. Calculate confidence using:
//    - evidence volume
//    - consistency
//    - source diversity
//    - experience diversity
//
// IMPORTANT:
//
// Raw evidence events remain the source of truth.
// Everything generated here is derived and can be rebuilt.
//

//
// -----------------------------------------------------------------------------
// CONFIGURATION
// -----------------------------------------------------------------------------
//
// These are deliberately simple MVP rules.
//
// We can tune these later using real usage data.
//

const MAX_EVENTS_FOR_VOLUME = 10;
const MAX_EXPERIENCES_FOR_DIVERSITY = 4;
const MAX_SOURCE_TYPES_FOR_DIVERSITY = 4;

//
// Confidence components:
//
// 35% evidence volume
// 30% consistency
// 20% experience diversity
// 15% source diversity
//
// Recency is intentionally deferred for the first v0.3 implementation.
// For children, we should be careful about allowing old evidence to
// "decay" too aggressively.
//

const CONFIDENCE_WEIGHTS = {
  volume: 0.35,
  consistency: 0.3,
  experienceDiversity: 0.2,
  sourceDiversity: 0.15
};

//
// -----------------------------------------------------------------------------
// GENERIC UTILITIES
// -----------------------------------------------------------------------------

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function round(value, decimals = 0) {
  const multiplier = 10 ** decimals;

  return (
    Math.round(value * multiplier) /
    multiplier
  );
}

function average(values = []) {
  if (!values.length) {
    return 0;
  }

  return (
    values.reduce(
      (sum, value) => sum + value,
      0
    ) / values.length
  );
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}


//
// -----------------------------------------------------------------------------
// MVP v0.6 — EVIDENCE STREAM SUMMARIES
// -----------------------------------------------------------------------------
//
// IMPORTANT:
// Phase 1B is observational only.
//
// Evidence streams are NOT used to change trait/domain/pathway scores yet.
// We are adding stream counts and convergence metadata first so we can
// validate the model before changing confidence behavior.
//

function countByEvidenceStream(
  observations = []
) {
  const counts = {
    [evidenceStreams.KID_EXPERIENCE]: 0,
    [evidenceStreams.PARENT_OBSERVATION]: 0,
    [evidenceStreams.SYSTEM_EVIDENCE]: 0,
  };

  observations.forEach(
    (observation) => {
      const stream =
        observation?.evidenceStream;

      if (
        Object.prototype.hasOwnProperty.call(
          counts,
          stream
        )
      ) {
        counts[stream] += 1;
      }
    }
  );

  return counts;
}

function summarizeEvidenceStreams(
  observations = []
) {
  const streamCounts =
    countByEvidenceStream(
      observations
    );

  const activeStreams =
    Object.entries(
      streamCounts
    )
      .filter(
        ([, count]) => count > 0
      )
      .map(
        ([stream]) => stream
      );

  return {
    streamCounts,

    streamCount:
      activeStreams.length,

    activeStreams,

    hasKidExperience:
      streamCounts[
        evidenceStreams
          .KID_EXPERIENCE
      ] > 0,

    hasParentObservation:
      streamCounts[
        evidenceStreams
          .PARENT_OBSERVATION
      ] > 0,

    hasSystemEvidence:
      streamCounts[
        evidenceStreams
          .SYSTEM_EVIDENCE
      ] > 0,

    hasCrossStreamEvidence:
      activeStreams.length > 1,

    hasFullConvergence:
      activeStreams.length ===
      Object.values(
        evidenceStreams
      ).length,
  };
}

//
// -----------------------------------------------------------------------------
// MVP v0.6 — CROSS-STREAM CONVERGENCE
// -----------------------------------------------------------------------------
//
// Convergence describes whether independent evidence streams point in the
// same direction. Phase 1C-A is descriptive only: it does NOT change
// strength, confidence, pathway, career, or recommendation scores.
//

function getStreamDirection(
  observations = []
) {
  if (!observations.length) {
    return {
      averageWeight: 0,
      direction: 'none',
    };
  }

  const averageWeight =
    observations.reduce(
      (total, observation) =>
        total + observation.weight,
      0
    ) / observations.length;

  const DIRECTION_THRESHOLD = 0.05;

  let direction = 'neutral';

  if (
    averageWeight >
    DIRECTION_THRESHOLD
  ) {
    direction = 'positive';
  } else if (
    averageWeight <
    -DIRECTION_THRESHOLD
  ) {
    direction = 'negative';
  }

  return {
    averageWeight:
      Number(
        averageWeight.toFixed(3)
      ),

    direction,
  };
}

function summarizeConvergence(
  observations = []
) {
  const byStream = {};

  Object.values(
    evidenceStreams
  ).forEach((stream) => {
    const streamObservations =
      observations.filter(
        (observation) =>
          observation.evidenceStream ===
          stream
      );

    if (
      streamObservations.length > 0
    ) {
      byStream[stream] = {
        evidenceCount:
          streamObservations.length,

        ...getStreamDirection(
          streamObservations
        ),
      };
    }
  });

  const activeEntries =
    Object.entries(byStream);

  if (
    activeEntries.length < 2
  ) {
    return {
      convergenceStatus:
        'single_stream',

      converging: false,
      conflicting: false,

      convergingStreams: [],
      conflictingStreams: [],

      streamDirections:
        byStream,
    };
  }

  const directionalEntries =
    activeEntries.filter(
      ([, summary]) =>
        summary.direction ===
          'positive' ||
        summary.direction ===
          'negative'
    );

  const directions =
    unique(
      directionalEntries.map(
        ([, summary]) =>
          summary.direction
      )
    );

  if (
    directionalEntries.length >= 2 &&
    directions.length === 1
  ) {
    return {
      convergenceStatus:
        'converging',

      converging: true,
      conflicting: false,

      convergingStreams:
        directionalEntries.map(
          ([stream]) => stream
        ),

      conflictingStreams: [],

      streamDirections:
        byStream,
    };
  }

  if (
    directions.includes(
      'positive'
    ) &&
    directions.includes(
      'negative'
    )
  ) {
    return {
      convergenceStatus:
        'mixed',

      converging: false,
      conflicting: true,

      convergingStreams: [],

      conflictingStreams:
        directionalEntries.map(
          ([stream]) => stream
        ),

      streamDirections:
        byStream,
    };
  }

  return {
    convergenceStatus:
      'inconclusive',

    converging: false,
    conflicting: false,

    convergingStreams: [],
    conflictingStreams: [],

    streamDirections:
      byStream,
  };
}

//
// -----------------------------------------------------------------------------
// EVIDENCE NORMALIZATION
// -----------------------------------------------------------------------------
//
// Convert the evidence-event structure into one flat list of observations.
//
// Example:
//
// {
//   eventId,
//   signalId,
//   weight,
//   sourceType,
//   experienceId,
//   domainId
// }
//

export function flattenEvidenceEvents(
  evidenceEvents = []
) {
  if (!Array.isArray(evidenceEvents)) {
    return [];
  }

  const observations = [];

  evidenceEvents.forEach((event) => {
    if (!event || !Array.isArray(event.evidence)) {
      return;
    }

    event.evidence.forEach((item) => {
      if (
        !item ||
        typeof item.signalId !== "string" ||
        typeof item.weight !== "number"
      ) {
        return;
      }

      observations.push({
        eventId: event.id,
        childId: event.childId,

        signalId: item.signalId,
        weight: item.weight,

        sourceType:
          event.source?.type || null,

        evidenceStream:
          getEvidenceStream(event),

        experienceId:
          event.source?.experienceId || null,

        questionId:
          event.source?.questionId || null,

        responseId:
          event.source?.responseId || null,

        domainId:
          event.context?.domainId || null,

        sessionId:
          event.context?.sessionId || null,

        createdAt:
          event.createdAt || null
      });
    });
  });

  return observations;
}

//
// -----------------------------------------------------------------------------
// CONFIDENCE CALCULATION
// -----------------------------------------------------------------------------
//
// Confidence does NOT mean:
//
// "We are 82% certain this child is a Builder."
//
// It means:
//
// "We currently have relatively strong and diverse evidence
// supporting this emerging pattern."
//

function calculateVolumeScore(
  observationCount
) {
  return clamp(
    (observationCount /
      MAX_EVENTS_FOR_VOLUME) *
      100
  );
}

function calculateConsistencyScore(
  weights = []
) {
  if (!weights.length) {
    return 0;
  }

  const positive =
    weights.filter((weight) => weight > 0)
      .length;

  const negative =
    weights.filter((weight) => weight < 0)
      .length;

  const directionalObservations =
    positive + negative;

  if (!directionalObservations) {
    return 0;
  }

  const dominantDirection =
    Math.max(positive, negative);

  return (
    dominantDirection /
    directionalObservations
  ) * 100;
}

function calculateExperienceDiversityScore(
  experienceIds = []
) {
  const count =
    unique(experienceIds).length;

  return clamp(
    (count /
      MAX_EXPERIENCES_FOR_DIVERSITY) *
      100
  );
}

function calculateSourceDiversityScore(
  sourceTypes = []
) {
  const count =
    unique(sourceTypes).length;

  return clamp(
    (count /
      MAX_SOURCE_TYPES_FOR_DIVERSITY) *
      100
  );
}

//
// -----------------------------------------------------------------------------
// MVP v0.6 — CONFIDENCE CONVERGENCE ADJUSTMENT
// -----------------------------------------------------------------------------
//
// Convergence changes confidence, NOT strength.
//
// Conservative rules:
// - 2-stream convergence: up to +6 confidence points
// - 3-stream convergence: up to +10 confidence points
// - mixed/conflicting streams: down to -8 confidence points
// - single-stream/inconclusive: no adjustment
//
// The adjustment is scaled by evidence volume. With only 2 observations,
// only half of the maximum adjustment is applied. Full adjustment requires
// at least 4 relevant observations.
//

function calculateConvergenceAdjustment(
  convergence = null,
  observationCount = 0
) {
  if (!convergence) {
    return 0;
  }

  const evidenceFactor =
    clamp(
      observationCount / 4,
      0,
      1
    );

  const activeStreamCount =
    Object.keys(
      convergence.streamDirections || {}
    ).length;

  let maximumAdjustment = 0;

  if (
    convergence.convergenceStatus ===
    'converging'
  ) {
    maximumAdjustment =
      activeStreamCount >= 3
        ? 10
        : 6;
  } else if (
    convergence.convergenceStatus ===
    'mixed'
  ) {
    maximumAdjustment = -8;
  }

  return round(
    maximumAdjustment *
      evidenceFactor,
    1
  );
}

export function calculateConfidence({
  weights = [],
  experienceIds = [],
  sourceTypes = [],
  convergence = null
}) {
  const volume =
    calculateVolumeScore(
      weights.length
    );

  const consistency =
    calculateConsistencyScore(weights);

  const experienceDiversity =
    calculateExperienceDiversityScore(
      experienceIds
    );

  const sourceDiversity =
    calculateSourceDiversityScore(
      sourceTypes
    );

  const baseScore =
    volume *
      CONFIDENCE_WEIGHTS.volume +
    consistency *
      CONFIDENCE_WEIGHTS.consistency +
    experienceDiversity *
      CONFIDENCE_WEIGHTS.experienceDiversity +
    sourceDiversity *
      CONFIDENCE_WEIGHTS.sourceDiversity;

  const convergenceAdjustment =
    calculateConvergenceAdjustment(
      convergence,
      weights.length
    );

  const normalizedScore =
    round(
      clamp(
        baseScore +
          convergenceAdjustment
      )
    );

  return {
    score: normalizedScore,

    level:
      getConfidenceLevel(
        normalizedScore
      ).id,

    label:
      getConfidenceLevel(
        normalizedScore
      ).label,

    components: {
      volume:
        round(volume),

      consistency:
        round(consistency),

      experienceDiversity:
        round(
          experienceDiversity
        ),

      sourceDiversity:
        round(sourceDiversity),

      baseScore:
        round(baseScore),

      convergenceAdjustment
    }
  };
}

//
// -----------------------------------------------------------------------------
// SIGNAL AGGREGATION
// -----------------------------------------------------------------------------
//
// Signals are the first derived layer.
//
// We keep:
// - positive evidence
// - negative evidence
// - net strength
// - confidence
//

export function calculateSignals(
  evidenceEvents = []
) {
  const observations =
    flattenEvidenceEvents(
      evidenceEvents
    );

  const grouped = {};

  observations.forEach((observation) => {
    const { signalId } = observation;

    if (!grouped[signalId]) {
      grouped[signalId] = [];
    }

    grouped[signalId].push(
      observation
    );
  });

  const result = {};

  Object.entries(grouped).forEach(
    ([signalId, signalObservations]) => {

      const weights =
        signalObservations.map(
          (observation) =>
            observation.weight
        );

      const positiveStrength =
        weights
          .filter(
            (weight) => weight > 0
          )
          .reduce(
            (sum, weight) =>
              sum + weight,
            0
          );

      const negativeStrength =
        Math.abs(
          weights
            .filter(
              (weight) => weight < 0
            )
            .reduce(
              (sum, weight) =>
                sum + weight,
              0
            )
        );

      const netStrength =
        positiveStrength -
        negativeStrength;

      const experienceIds =
        signalObservations.map(
          (observation) =>
            observation.experienceId
        );

      const sourceTypes =
        signalObservations.map(
          (observation) =>
            observation.sourceType
        );

      const streamSummary =
        summarizeEvidenceStreams(
          signalObservations
        );

      const convergence =
        summarizeConvergence(
          signalObservations
        );

      result[signalId] = {
        signalId,

        observationCount:
          signalObservations.length,

        positiveStrength:
          round(
            positiveStrength,
            2
          ),

        negativeStrength:
          round(
            negativeStrength,
            2
          ),

        netStrength:
          round(netStrength, 2),

        experienceCount:
          unique(
            experienceIds
          ).length,

        sourceTypeCount:
          unique(
            sourceTypes
          ).length,

        evidenceStreamCount:
          streamSummary.streamCount,

        evidenceStreamCounts:
          streamSummary.streamCounts,

        evidenceStreams:
          streamSummary.activeStreams,

        hasCrossStreamEvidence:
          streamSummary.hasCrossStreamEvidence,

        convergence,

        confidence:
          calculateConfidence({
            weights,
            experienceIds,
            sourceTypes,
            convergence
          })
      };
    }
  );

  return result;
}

//
// -----------------------------------------------------------------------------
// TRAIT CALCULATION
// -----------------------------------------------------------------------------
//
// Traits are derived from signals.
//
// Each trait contains a signalWeights mapping defined
// in growthTaxonomy.js.
//
// Example:
//
// problem_solver:
//
// problem_solving     1.0
// analytical_thinking 0.6
// persistence         0.4
//

function getTraitObservations(
  traitDefinition,
  observations
) {
  const relevantSignalIds =
    Object.keys(
      traitDefinition.signalWeights || {}
    );

  return observations.filter(
    (observation) =>
      relevantSignalIds.includes(
        observation.signalId
      )
  );
}

function calculateWeightedTraitStrength(
  traitDefinition,
  observations
) {
  let positiveStrength = 0;
  let negativeStrength = 0;

  observations.forEach(
    (observation) => {

      const multiplier =
        traitDefinition
          .signalWeights[
            observation.signalId
          ] || 0;

      const weightedValue =
        observation.weight *
        multiplier;

      if (weightedValue > 0) {
        positiveStrength +=
          weightedValue;
      }

      if (weightedValue < 0) {
        negativeStrength +=
          Math.abs(
            weightedValue
          );
      }
    }
  );

  return {
    positiveStrength,
    negativeStrength,
    netStrength:
      positiveStrength -
      negativeStrength
  };
}

//
// Strength and confidence are intentionally different.
//
// strength:
// How much supporting evidence exists.
//
// confidence:
// How broad and consistent that evidence is.
//
// For MVP we normalize strength based on an expected
// evidence ceiling of roughly 8 weighted observations.
//

function normalizeTraitStrength(
  netStrength
) {
  const TARGET_STRENGTH = 6;

  return round(
    clamp(
      (Math.max(
        0,
        netStrength
      ) /
        TARGET_STRENGTH) *
        100
    )
  );
}

export function calculateTraits(
  evidenceEvents = []
) {
  const observations =
    flattenEvidenceEvents(
      evidenceEvents
    );

  const result = {};

  Object.entries(traits).forEach(
    ([traitId, traitDefinition]) => {

      const relevant =
        getTraitObservations(
          traitDefinition,
          observations
        );

      if (!relevant.length) {
        result[traitId] = {
          id: traitId,
          label:
            traitDefinition.label,
          emoji:
            traitDefinition.emoji,

          score: 0,

          confidence: {
            score: 0,
            level: "exploratory",
            label: "Exploratory",
            components: {
              volume: 0,
              consistency: 0,
              experienceDiversity: 0,
              sourceDiversity: 0
            }
          },

          evidenceCount: 0,
          experienceCount: 0,
          sourceTypeCount: 0,
          evidenceStreamCount: 0,
          evidenceStreamCounts: {
            [evidenceStreams.KID_EXPERIENCE]: 0,
            [evidenceStreams.PARENT_OBSERVATION]: 0,
            [evidenceStreams.SYSTEM_EVIDENCE]: 0,
          },
          evidenceStreams: [],
          hasCrossStreamEvidence: false,
          convergence: {
            convergenceStatus: 'single_stream',
            converging: false,
            conflicting: false,
            convergingStreams: [],
            conflictingStreams: [],
            streamDirections: {},
          }
        };

        return;
      }

      const weightedStrength =
        calculateWeightedTraitStrength(
          traitDefinition,
          relevant
        );

      const weightedValues =
        relevant.map(
          (observation) =>
            observation.weight *
            (
              traitDefinition
                .signalWeights[
                  observation.signalId
                ] || 0
            )
        );

      const experienceIds =
        relevant.map(
          (observation) =>
            observation.experienceId
        );

      const sourceTypes =
        relevant.map(
          (observation) =>
            observation.sourceType
        );

      const streamSummary =
        summarizeEvidenceStreams(
          relevant
        );

      const convergence =
        summarizeConvergence(
          relevant
        );

      result[traitId] = {
        id: traitId,

        label:
          traitDefinition.label,

        emoji:
          traitDefinition.emoji,

        score:
          normalizeTraitStrength(
            weightedStrength.netStrength
          ),

        positiveStrength:
          round(
            weightedStrength
              .positiveStrength,
            2
          ),

        negativeStrength:
          round(
            weightedStrength
              .negativeStrength,
            2
          ),

        evidenceCount:
          relevant.length,

        experienceCount:
          unique(
            experienceIds
          ).length,

        sourceTypeCount:
          unique(
            sourceTypes
          ).length,

        evidenceStreamCount:
          streamSummary.streamCount,

        evidenceStreamCounts:
          streamSummary.streamCounts,

        evidenceStreams:
          streamSummary.activeStreams,

        hasCrossStreamEvidence:
          streamSummary.hasCrossStreamEvidence,

        convergence,

        confidence:
          calculateConfidence({
            weights:
              weightedValues,

            experienceIds,
            sourceTypes,
            convergence
          })
      };
    }
  );

  return result;
}

//
// -----------------------------------------------------------------------------
// DOMAIN CALCULATION
// -----------------------------------------------------------------------------
//
// Domain evidence is contextual.
//
// Example:
//
// curiosity +0.8
//
// inside:
//
// domainId = technology_robotics
//
// contributes evidence toward Technology & Robotics.
//
// This lets the same signal appear differently across domains.
//

function normalizeDomainStrength(
  netStrength
) {
  const TARGET_STRENGTH = 6;

  return round(
    clamp(
      (
        Math.max(
          0,
          netStrength
        ) /
        TARGET_STRENGTH
      ) * 100
    )
  );
}

export function calculateDomains(
  evidenceEvents = []
) {
  const observations =
    flattenEvidenceEvents(
      evidenceEvents
    );

  const result = {};

  Object.entries(domains).forEach(
    ([domainId, domainDefinition]) => {

      const relevant =
        observations.filter(
          (observation) =>
            observation.domainId ===
            domainId
        );

      if (!relevant.length) {
        result[domainId] = {
          id: domainId,

          label:
            domainDefinition.label,

          emoji:
            domainDefinition.emoji,

          score: 0,

          evidenceCount: 0,
          experienceCount: 0,
          sourceTypeCount: 0,
          evidenceStreamCount: 0,
          evidenceStreamCounts: {
            [evidenceStreams.KID_EXPERIENCE]: 0,
            [evidenceStreams.PARENT_OBSERVATION]: 0,
            [evidenceStreams.SYSTEM_EVIDENCE]: 0,
          },
          evidenceStreams: [],
          hasCrossStreamEvidence: false,
          convergence: {
            convergenceStatus: 'single_stream',
            converging: false,
            conflicting: false,
            convergingStreams: [],
            conflictingStreams: [],
            streamDirections: {},
          },

          confidence: {
            score: 0,
            level: "exploratory",
            label: "Exploratory",
            components: {
              volume: 0,
              consistency: 0,
              experienceDiversity: 0,
              sourceDiversity: 0
            }
          }
        };

        return;
      }

      const weights =
        relevant.map(
          (observation) =>
            observation.weight
        );

      const positiveStrength =
        weights
          .filter(
            (weight) => weight > 0
          )
          .reduce(
            (sum, weight) =>
              sum + weight,
            0
          );

      const negativeStrength =
        Math.abs(
          weights
            .filter(
              (weight) => weight < 0
            )
            .reduce(
              (sum, weight) =>
                sum + weight,
              0
            )
        );

      const netStrength =
        positiveStrength -
        negativeStrength;

      const experienceIds =
        relevant.map(
          (observation) =>
            observation.experienceId
        );

      const sourceTypes =
        relevant.map(
          (observation) =>
            observation.sourceType
        );

      const streamSummary =
        summarizeEvidenceStreams(
          relevant
        );

      const convergence =
        summarizeConvergence(
          relevant
        );

      result[domainId] = {
        id: domainId,

        label:
          domainDefinition.label,

        emoji:
          domainDefinition.emoji,

        score:
          normalizeDomainStrength(
            netStrength
          ),

        positiveStrength:
          round(
            positiveStrength,
            2
          ),

        negativeStrength:
          round(
            negativeStrength,
            2
          ),

        evidenceCount:
          relevant.length,

        experienceCount:
          unique(
            experienceIds
          ).length,

        sourceTypeCount:
          unique(
            sourceTypes
          ).length,

        evidenceStreamCount:
          streamSummary.streamCount,

        evidenceStreamCounts:
          streamSummary.streamCounts,

        evidenceStreams:
          streamSummary.activeStreams,

        hasCrossStreamEvidence:
          streamSummary.hasCrossStreamEvidence,

        convergence,

        confidence:
          calculateConfidence({
            weights,
            experienceIds,
            sourceTypes,
            convergence
          })
      };
    }
  );

  return result;
}

//
// -----------------------------------------------------------------------------
// PATHWAY CALCULATION
// -----------------------------------------------------------------------------
//
// Pathways are inference-driven.
//
// They combine:
//
// trait scores
// +
// domain scores
//
// We do NOT directly read raw adventure responses here.
//

export function calculatePathways({
  traitProfile = {},
  domainProfile = {}
} = {}) {
  const result = {};

  Object.entries(pathways).forEach(
    ([pathwayId, pathway]) => {

      let score = 0;

      const traitContributions = {};
      const domainContributions = {};

      Object.entries(
        pathway.traitWeights || {}
      ).forEach(
        ([traitId, weight]) => {

          const traitScore =
            traitProfile[
              traitId
            ]?.score || 0;

          const contribution =
            traitScore * weight;

          score += contribution;

          traitContributions[
            traitId
          ] = round(
            contribution,
            1
          );
        }
      );

      Object.entries(
        pathway.domainWeights || {}
      ).forEach(
        ([domainId, weight]) => {

          const domainScore =
            domainProfile[
              domainId
            ]?.score || 0;

          const contribution =
            domainScore * weight;

          score += contribution;

          domainContributions[
            domainId
          ] = round(
            contribution,
            1
          );
        }
      );

      const normalizedScore =
        round(
          clamp(score)
        );

      //
      // Pathway confidence should be more conservative than
      // trait/domain confidence.
      //
      // We use the average confidence of the contributing
      // traits/domains, then reduce it slightly because this
      // layer is inferential.
      //

      const contributingConfidenceScores =
        [];

      Object.keys(
        pathway.traitWeights || {}
      ).forEach((traitId) => {
        const confidence =
          traitProfile[
            traitId
          ]?.confidence?.score;

        if (
          typeof confidence ===
          "number"
        ) {
          contributingConfidenceScores.push(
            confidence
          );
        }
      });

      Object.keys(
        pathway.domainWeights || {}
      ).forEach((domainId) => {
        const confidence =
          domainProfile[
            domainId
          ]?.confidence?.score;

        if (
          typeof confidence ===
          "number"
        ) {
          contributingConfidenceScores.push(
            confidence
          );
        }
      });

      const rawConfidence =
        average(
          contributingConfidenceScores
        );

      const pathwayConfidence =
        round(
          clamp(
            rawConfidence * 0.85
          )
        );

      result[pathwayId] = {
        id: pathwayId,

        label:
          pathway.label,

        emoji:
          pathway.emoji,

        score:
          normalizedScore,

        confidence: {
          score:
            pathwayConfidence,

          level:
            getConfidenceLevel(
              pathwayConfidence
            ).id,

          label:
            getConfidenceLevel(
              pathwayConfidence
            ).label
        },

        contributions: {
          traits:
            traitContributions,

          domains:
            domainContributions
        }
      };
    }
  );

  return result;
}

//
// -----------------------------------------------------------------------------
// CAREER-FAMILY CALCULATION
// -----------------------------------------------------------------------------
//
// Career families should NOT be shown as:
// "82% chance of becoming a Robotics Engineer."
//
// They are simply exploration relevance.
//
// Career relevance is based primarily on pathway scores.
//

function careerStatusFromScore(
  score
) {
  if (score >= 70) {
    return {
      id: "strong_connection",
      label: "Strong Connection"
    };
  }

  if (score >= 45) {
    return {
      id: "worth_exploring",
      label: "Worth Exploring"
    };
  }

  return {
    id: "explore",
    label: "Explore"
  };
}

export function calculateCareerFamilies(
  pathwayProfile = {}
) {
  const result = {};

  Object.entries(
    careerFamilies
  ).forEach(
    ([
      careerFamilyId,
      careerFamily
    ]) => {

      const pathwayScores =
        (
          careerFamily.pathwayIds ||
          []
        ).map(
          (pathwayId) =>
            pathwayProfile[
              pathwayId
            ]?.score || 0
        );

      const relevance =
        pathwayScores.length
          ? average(
              pathwayScores
            )
          : 0;

      const normalizedRelevance =
        round(
          clamp(relevance)
        );

      result[
        careerFamilyId
      ] = {
        id:
          careerFamilyId,

        label:
          careerFamily.label,

        relevance:
          normalizedRelevance,

        status:
          careerStatusFromScore(
            normalizedRelevance
          ),

        pathwayIds:
          [
            ...(
              careerFamily
                .pathwayIds ||
              []
            )
          ],

        examples:
          [
            ...(
              careerFamily
                .examples ||
              []
            )
          ]
      };
    }
  );

  return result;
}

//
// -----------------------------------------------------------------------------
// COMPLETE GROWTH PROFILE
// -----------------------------------------------------------------------------
//
// This is the primary public function.
//
// Usage:
//
// const profile =
//   buildGrowthProfile({
//     childId,
//     evidenceEvents
//   });
//

export function buildGrowthProfile({
  childId = null,
  evidenceEvents = []
} = {}) {
  let filteredEvents =
    evidenceEvents;

  if (childId) {
    filteredEvents =
      evidenceEvents.filter(
        (event) =>
          event.childId ===
          childId
      );
  }

  const signalProfile =
    calculateSignals(
      filteredEvents
    );

  const traitProfile =
    calculateTraits(
      filteredEvents
    );

  const domainProfile =
    calculateDomains(
      filteredEvents
    );

  const pathwayProfile =
    calculatePathways({
      traitProfile,
      domainProfile
    });

  const careerFamilyProfile =
    calculateCareerFamilies(
      pathwayProfile
    );

  return {
    childId,

    evidenceSummary: (() => {
      const observations =
        flattenEvidenceEvents(
          filteredEvents
        );

      const streamSummary =
        summarizeEvidenceStreams(
          observations
        );

      const convergence =
        summarizeConvergence(
          observations
        );

      return {
        eventCount:
          filteredEvents.length,

        observationCount:
          observations.length,

        experienceCount:
          unique(
            filteredEvents.map(
              (event) =>
                event.source
                  ?.experienceId
            )
          ).length,

        sourceTypeCount:
          unique(
            filteredEvents.map(
              (event) =>
                event.source
                  ?.type
            )
          ).length,

        evidenceStreamCount:
          streamSummary.streamCount,

        evidenceStreamCounts:
          streamSummary.streamCounts,

        evidenceStreams:
          streamSummary.activeStreams,

        hasKidExperience:
          streamSummary.hasKidExperience,

        hasParentObservation:
          streamSummary.hasParentObservation,

        hasSystemEvidence:
          streamSummary.hasSystemEvidence,

        hasCrossStreamEvidence:
          streamSummary.hasCrossStreamEvidence,

        hasFullConvergence:
          streamSummary.hasFullConvergence,

        convergence
      };
    })(),

    signals:
      signalProfile,

    traits:
      traitProfile,

    domains:
      domainProfile,

    pathways:
      pathwayProfile,

    careerFamilies:
      careerFamilyProfile,

    generatedAt:
      new Date().toISOString()
  };
}

//
// -----------------------------------------------------------------------------
// RANKING UTILITIES
// -----------------------------------------------------------------------------
//
// These will be useful for UI and recommendations.
//

export function getTopTraits(
  growthProfile,
  limit = 4
) {
  return Object.values(
    growthProfile?.traits || {}
  )
    .filter(
      (trait) =>
        trait.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(
      0,
      limit
    );
}

export function getTopDomains(
  growthProfile,
  limit = 4
) {
  return Object.values(
    growthProfile?.domains || {}
  )
    .filter(
      (domain) =>
        domain.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(
      0,
      limit
    );
}

export function getTopPathways(
  growthProfile,
  limit = 3
) {
  return Object.values(
    growthProfile?.pathways || {}
  )
    .filter(
      (pathway) =>
        pathway.score > 0
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(
      0,
      limit
    );
}

export function getTopCareerFamilies(
  growthProfile,
  limit = 5
) {
  return Object.values(
    growthProfile
      ?.careerFamilies || {}
  )
    .filter(
      (careerFamily) =>
        careerFamily.relevance > 0
    )
    .sort(
      (a, b) =>
        b.relevance -
        a.relevance
    )
    .slice(
      0,
      limit
    );
}

//
// -----------------------------------------------------------------------------
// EVIDENCE EXPLANATION
// -----------------------------------------------------------------------------
//
// Useful later for:
//
// "Why are we seeing this?"
//
// and for the developer Evidence Inspector.
//

export function explainTrait(
  traitId,
  evidenceEvents = []
) {
  const traitDefinition =
    traits[traitId];

  if (!traitDefinition) {
    return null;
  }

  const observations =
    flattenEvidenceEvents(
      evidenceEvents
    );

  const relevant =
    getTraitObservations(
      traitDefinition,
      observations
    );

  return {
    traitId,

    label:
      traitDefinition.label,

    evidence:
      relevant.map(
        (observation) => ({
          signalId:
            observation.signalId,

          signalWeight:
            observation.weight,

          traitMultiplier:
            traitDefinition
              .signalWeights[
                observation
                  .signalId
              ],

          contribution:
            round(
              observation.weight *
                traitDefinition
                  .signalWeights[
                    observation
                      .signalId
                  ],
              2
            ),

          experienceId:
            observation
              .experienceId,

          sourceType:
            observation
              .sourceType,

          evidenceStream:
            observation
              .evidenceStream,

          domainId:
            observation
              .domainId
        })
      )
  };
}

//
// -----------------------------------------------------------------------------
// DEBUG SUMMARY
// -----------------------------------------------------------------------------

export function createGrowthDebugSummary(
  growthProfile
) {
  return {
    evidence:
      growthProfile
        ?.evidenceSummary,

    topTraits:
      getTopTraits(
        growthProfile,
        5
      ),

    topDomains:
      getTopDomains(
        growthProfile,
        5
      ),

    topPathways:
      getTopPathways(
        growthProfile,
        5
      ),

    topCareerFamilies:
      getTopCareerFamilies(
        growthProfile,
        5
      )
  };
}

export default buildGrowthProfile;