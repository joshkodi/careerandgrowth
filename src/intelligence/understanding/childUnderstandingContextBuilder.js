const safeArray = (value) => Array.isArray(value) ? value : []
const safeObject = (value) => value && typeof value === 'object' ? value : {}

const compactEvidence = (events = [], limit = 40) =>
  safeArray(events)
    .filter((event) => event?.id)
    .slice()
    .sort((a, b) => new Date(b?.createdAt || b?.timestamp || 0) - new Date(a?.createdAt || a?.timestamp || 0))
    .slice(0, limit)
    .map((event) => ({
      id: String(event.id),
      sourceType: event?.source?.type || 'unknown',
      signalType: event?.type || event?.signalType || event?.kind || null,
      label: event?.metadata?.responseText || event?.metadata?.answerLabel || event?.metadata?.title || event?.metadata?.label || null,
      createdAt: event?.createdAt || event?.timestamp || null,
    }))

const compactJourney = (items = [], limit = 20) =>
  safeArray(items).slice(0, limit).map((item) => ({
    id: item?.id || null,
    experienceId: item?.experienceId || null,
    title: item?.title || item?.topic || null,
    path: item?.path || null,
    status: item?.status || null,
  }))

export function buildChildUnderstandingContext(growthContext = {}) {
  const understanding = safeObject(growthContext?.understanding)
  const profile = safeObject(understanding?.profileUnderstanding)

  return {
    version: '0.17.0-stage1',
    purpose: 'Interpret supported child context into evidence-linked hypotheses. Do not invent facts or recommendations.',
    child: {
      id: growthContext?.child?.id || profile?.child?.id || null,
      age: growthContext?.child?.age ?? profile?.child?.age ?? null,
      grade: profile?.child?.grade || null,
    },
    stated: safeObject(profile?.stated),
    observed: safeObject(profile?.observed),
    derived: safeObject(profile?.derived),
    establishedPatterns: safeArray(profile?.observed?.promotedPatterns),
    recentJourney: compactJourney(growthContext?.journey?.items),
    evidenceIndex: compactEvidence(growthContext?.evidence?.events),
    intent: {
      student: growthContext?.intent?.student?.latest || null,
      parent: growthContext?.intent?.parent?.latest || null,
    },
    constraints: {
      evidenceRequiredForInference: true,
      modelOutputIsHypothesisOnly: true,
      recommendationAuthority: 'synapstride',
      rawEvidenceIsSourceOfTruth: true,
    },
  }
}
