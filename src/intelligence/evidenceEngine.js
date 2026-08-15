// src/intelligence/evidenceEngine.js

import {
  GROWTH_MODEL_VERSION,
  evidenceStreams,
  evidenceSourceTypes,
  getEvidenceStreamForSourceType,
  isValidDomainId,
  isValidSignalId,
} from "../data/growthTaxonomy";

const MIN_WEIGHT = -1;
const MAX_WEIGHT = 1;

export const EVIDENCE_SCHEMA_VERSION =
  "0.6.0";

const validSourceTypes = new Set(
  Object.values(evidenceSourceTypes)
);

const validEvidenceStreams = new Set(
  Object.values(evidenceStreams)
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
      weight: clampWeight(item.weight),
    }))
    .filter((item) => item.weight !== 0);
}

// ============================================================
// MVP v0.6 — EVIDENCE STREAM RESOLUTION
// ============================================================
//
// New events persist source.stream explicitly.
//
// Older v0.3-v0.5 events remain compatible because the stream
// can be derived from source.type when source.stream is absent.
//

export function resolveEvidenceStream(
  source = {}
) {
  if (
    validEvidenceStreams.has(
      source.stream
    )
  ) {
    return source.stream;
  }

  return getEvidenceStreamForSourceType(
    source.type
  );
}

export function getEvidenceStream(
  eventOrSource = {}
) {
  const source =
    eventOrSource?.source ||
    eventOrSource;

  return resolveEvidenceStream(
    source
  );
}

export function normalizeSource(source = {}) {
  const type = validSourceTypes.has(source.type)
    ? source.type
    : evidenceSourceTypes.ADVENTURE_QUESTION;

  return {
    type,

    stream:
      resolveEvidenceStream({
        ...source,
        type,
      }),

    experienceId:
      source.experienceId || null,

    questionId:
      source.questionId || null,

    responseId:
      source.responseId || null,
  };
}

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
    sessionId:
      context.sessionId || null,
  };
}

export function createEvidenceEvent({
  childId,
  source,
  evidence,
  context = {},
  createdAt = null,
  metadata = {},
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

    source:
      normalizeSource(source),

    evidence:
      normalizedEvidence,

    context:
      normalizeContext(context),

    metadata: {
      ...metadata,
    },

    createdAt:
      createdAt ||
      new Date().toISOString(),

    modelVersion:
      GROWTH_MODEL_VERSION,

    schemaVersion:
      EVIDENCE_SCHEMA_VERSION,
  };
}

export function createQuestionEvidenceEvent({
  childId,
  experienceId,
  domainId,
  question,
  choice,
  sessionId = null,
}) {
  if (!question || !choice) {
    return null;
  }

  return createEvidenceEvent({
    childId,

    source: {
      type:
        evidenceSourceTypes
          .ADVENTURE_QUESTION,

      experienceId,

      questionId:
        question.id,

      responseId:
        choice.id,
    },

    evidence:
      choice.evidence || [],

    context: {
      domainId,
      sessionId,
    },

    metadata: {
      questionText:
        question.question ||
        question.prompt ||
        "",

      responseText:
        choice.label ||
        choice.text ||
        "",
    },
  });
}

export function createDiscoveryEvidenceEvent({
  childId,
  question,
  choice,
  sessionId = null,
}) {
  if (!question || !choice) {
    return null;
  }

  return createEvidenceEvent({
    childId,

    source: {
      type:
        evidenceSourceTypes
          .DISCOVERY,

      experienceId:
        "discover_you",

      questionId:
        question.id,

      responseId:
        choice.id,
    },

    evidence:
      choice.evidence || [],

    context: {
      domainId:
        choice.domainId || null,

      sessionId,
    },

    metadata: {
      questionText:
        question.question ||
        question.prompt ||
        "",

      responseText:
        choice.label ||
        choice.text ||
        "",
    },
  });
}

export function createReflectionEvidenceEvent({
  childId,
  experienceId,
  domainId,
  reflectionId,
  responseId,
  evidence,
  responseText = "",
  sessionId = null,
}) {
  return createEvidenceEvent({
    childId,

    source: {
      type:
        evidenceSourceTypes
          .REFLECTION,

      experienceId,

      questionId:
        reflectionId,

      responseId,
    },

    evidence,

    context: {
      domainId,
      sessionId,
    },

    metadata: {
      responseText,
    },
  });
}

export function createCompletionEvidenceEvent({
  childId,
  experienceId,
  domainId,
  sessionId = null,
  evidence = [
    {
      signalId: "persistence",
      weight: 0.2,
    },
  ],
}) {
  return createEvidenceEvent({
    childId,

    source: {
      type:
        evidenceSourceTypes
          .COMPLETION,

      experienceId,

      questionId: null,

      responseId:
        "completed",
    },

    evidence,

    context: {
      domainId,
      sessionId,
    },

    metadata: {},
  });
}

export function isValidEvidenceEvent(event) {
  if (!event) {
    return false;
  }

  if (!event.id || !event.childId) {
    return false;
  }

  if (
    !event.source?.type ||
    !validSourceTypes.has(
      event.source.type
    )
  ) {
    return false;
  }

  // Backward compatibility:
  // old evidence may not have source.stream.
  if (
    event.source.stream &&
    !validEvidenceStreams.has(
      event.source.stream
    )
  ) {
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

export function describeEvidenceEvent(event) {
  if (!isValidEvidenceEvent(event)) {
    return null;
  }

  return {
    id:
      event.id,

    evidenceStream:
      getEvidenceStream(event),

    sourceType:
      event.source.type,

    experience:
      event.source.experienceId,

    question:
      event.metadata?.questionText ||
      "",

    response:
      event.metadata?.responseText ||
      "",

    signals:
      event.evidence.map(
        (item) => ({
          signalId:
            item.signalId,

          weight:
            item.weight,
        })
      ),

    domain:
      event.context?.domainId ||
      null,

    createdAt:
      event.createdAt,

    schemaVersion:
      event.schemaVersion ||
      "legacy",
  };
}
