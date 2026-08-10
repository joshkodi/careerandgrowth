// src/intelligence/evidenceEngine.js

import {
  GROWTH_MODEL_VERSION,
  evidenceSourceTypes,
  isValidDomainId,
  isValidSignalId
} from "../data/growthTaxonomy";

//
// Career & Growth — MVP v0.3
// Evidence Engine
//
// Responsibilities:
//
// 1. Turn child interactions into canonical evidence events.
// 2. Validate signal IDs.
// 3. Normalize evidence weights.
// 4. Preserve source/context metadata.
// 5. Keep evidence independent from derived traits/careers.
//
// This engine does NOT calculate:
// - traits
// - domains
// - pathways
// - career families
//
// That belongs in growthEngine.js.
//

const MIN_WEIGHT = -1;
const MAX_WEIGHT = 1;

const validSourceTypes = new Set(
  Object.values(evidenceSourceTypes)
);

function clampWeight(weight) {
  const numericWeight = Number(weight);

  if (Number.isNaN(numericWeight)) {
    return 0;
  }

  return Math.max(
    MIN_WEIGHT,
    Math.min(MAX_WEIGHT, numericWeight)
  );
}

function createId(prefix = "evt") {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

//
// -----------------------------------------------------------------------------
// NORMALIZE EVIDENCE
// -----------------------------------------------------------------------------

export function normalizeEvidence(evidence = []) {
  if (!Array.isArray(evidence)) {
    return [];
  }

  return evidence
    .filter((item) => {
      return (
        item &&
        typeof item.signalId === "string" &&
        isValidSignalId(item.signalId)
      );
    })
    .map((item) => ({
      signalId: item.signalId,
      weight: clampWeight(item.weight)
    }))
    .filter((item) => item.weight !== 0);
}

//
// -----------------------------------------------------------------------------
// SOURCE VALIDATION
// -----------------------------------------------------------------------------

export function normalizeSource(source = {}) {
  const type = validSourceTypes.has(source.type)
    ? source.type
    : evidenceSourceTypes.ADVENTURE_QUESTION;

  return {
    type,

    experienceId:
      source.experienceId || null,

    questionId:
      source.questionId || null,

    responseId:
      source.responseId || null
  };
}

//
// -----------------------------------------------------------------------------
// CONTEXT VALIDATION
// -----------------------------------------------------------------------------

export function normalizeContext(context = {}) {
  let domainId = null;

  if (
    context.domainId &&
    isValidDomainId(context.domainId)
  ) {
    domainId = context.domainId;
  }

  return {
    domainId,
    sessionId: context.sessionId || null
  };
}

//
// -----------------------------------------------------------------------------
// CREATE EVIDENCE EVENT
// -----------------------------------------------------------------------------

export function createEvidenceEvent({
  childId,
  source,
  evidence,
  context = {},
  createdAt = null,
  metadata = {}
}) {
  if (!childId) {
    throw new Error(
      "createEvidenceEvent requires childId."
    );
  }

  const normalizedEvidence =
    normalizeEvidence(evidence);

  if (normalizedEvidence.length === 0) {
    return null;
  }

  return {
    id: createId("evt"),

    childId,

    source: normalizeSource(source),

    evidence: normalizedEvidence,

    context: normalizeContext(context),

    metadata: {
      ...metadata
    },

    createdAt:
      createdAt || new Date().toISOString(),

    modelVersion: GROWTH_MODEL_VERSION
  };
}

//
// -----------------------------------------------------------------------------
// CREATE EVENT FROM A QUESTION RESPONSE
// -----------------------------------------------------------------------------
//
// This helper will become useful when we update explorations.js.
//
// Example question structure:
//
// {
//   id: "robot_problem_03",
//   question: "Your robot stops moving. What do you do?",
//   choices: [
//     {
//       id: "take_it_apart",
//       label: "Take it apart and investigate",
//       evidence: [
//         { signalId: "problem_solving", weight: 1 },
//         { signalId: "hands_on", weight: 0.8 },
//         { signalId: "curiosity", weight: 0.6 }
//       ]
//     }
//   ]
// }
//
// Calling:
//
// createQuestionEvidenceEvent({
//   childId,
//   experienceId: "robot_builder",
//   domainId: "technology_robotics",
//   question,
//   choice
// });
//

export function createQuestionEvidenceEvent({
  childId,
  experienceId,
  domainId,
  question,
  choice,
  sessionId = null
}) {
  if (!question || !choice) {
    return null;
  }

  return createEvidenceEvent({
    childId,

    source: {
      type: evidenceSourceTypes.ADVENTURE_QUESTION,
      experienceId,
      questionId: question.id,
      responseId: choice.id
    },

    evidence: choice.evidence || [],

    context: {
      domainId,
      sessionId
    },

    metadata: {
      questionText:
        question.question ||
        question.prompt ||
        "",

      responseText:
        choice.label ||
        choice.text ||
        ""
    }
  });
}

//
// -----------------------------------------------------------------------------
// DISCOVERY EVIDENCE
// -----------------------------------------------------------------------------

export function createDiscoveryEvidenceEvent({
  childId,
  question,
  choice,
  sessionId = null
}) {
  if (!question || !choice) {
    return null;
  }

  return createEvidenceEvent({
    childId,

    source: {
      type: evidenceSourceTypes.DISCOVERY,
      experienceId: "discover_you",
      questionId: question.id,
      responseId: choice.id
    },

    evidence: choice.evidence || [],

    context: {
      domainId: choice.domainId || null,
      sessionId
    },

    metadata: {
      questionText:
        question.question ||
        question.prompt ||
        "",

      responseText:
        choice.label ||
        choice.text ||
        ""
    }
  });
}

//
// -----------------------------------------------------------------------------
// REFLECTION EVIDENCE
// -----------------------------------------------------------------------------

export function createReflectionEvidenceEvent({
  childId,
  experienceId,
  domainId,
  reflectionId,
  responseId,
  evidence,
  responseText = "",
  sessionId = null
}) {
  return createEvidenceEvent({
    childId,

    source: {
      type: evidenceSourceTypes.REFLECTION,
      experienceId,
      questionId: reflectionId,
      responseId
    },

    evidence,

    context: {
      domainId,
      sessionId
    },

    metadata: {
      responseText
    }
  });
}

//
// -----------------------------------------------------------------------------
// COMPLETION EVENT
// -----------------------------------------------------------------------------
//
// Completion should usually contain weaker evidence.
//
// Merely finishing an experience is NOT proof that the child
// strongly enjoys the domain.
//
// But completion can provide modest supporting evidence such
// as persistence.
//

export function createCompletionEvidenceEvent({
  childId,
  experienceId,
  domainId,
  sessionId = null,
  evidence = [
    {
      signalId: "persistence",
      weight: 0.2
    }
  ]
}) {
  return createEvidenceEvent({
    childId,

    source: {
      type: evidenceSourceTypes.COMPLETION,
      experienceId,
      questionId: null,
      responseId: "completed"
    },

    evidence,

    context: {
      domainId,
      sessionId
    },

    metadata: {}
  });
}

//
// -----------------------------------------------------------------------------
// EVENT VALIDATION
// -----------------------------------------------------------------------------

export function isValidEvidenceEvent(event) {
  if (!event) {
    return false;
  }

  if (!event.id || !event.childId) {
    return false;
  }

  if (!event.source?.type) {
    return false;
  }

  if (!Array.isArray(event.evidence)) {
    return false;
  }

  if (event.evidence.length === 0) {
    return false;
  }

  return event.evidence.every((item) => {
    return (
      isValidSignalId(item.signalId) &&
      typeof item.weight === "number" &&
      item.weight >= MIN_WEIGHT &&
      item.weight <= MAX_WEIGHT
    );
  });
}

//
// -----------------------------------------------------------------------------
// DEBUG HELPERS
// -----------------------------------------------------------------------------

export function describeEvidenceEvent(event) {
  if (!isValidEvidenceEvent(event)) {
    return null;
  }

  return {
    id: event.id,

    sourceType:
      event.source.type,

    experience:
      event.source.experienceId,

    question:
      event.metadata?.questionText || "",

    response:
      event.metadata?.responseText || "",

    signals: event.evidence.map((item) => ({
      signalId: item.signalId,
      weight: item.weight
    })),

    domain:
      event.context?.domainId || null,

    createdAt:
      event.createdAt
  };
}