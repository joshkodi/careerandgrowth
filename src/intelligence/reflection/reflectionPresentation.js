const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim()

function sentenceCase(value) {
  const text = clean(value)
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : ''
}

function conceptLabel(candidate = {}) {
  return clean(candidate?.concept).replaceAll('_', ' ')
}

function simplifyInference(statement = '') {
  let text = clean(statement)
  if (!text) return ''

  // Remove analyst-style evidence clauses. The underlying candidate still keeps
  // the original statement and evidenceRefs for validation / feedback storage.
  text = text
    .replace(/^[A-Z][A-Za-z0-9_-]*\s+may\s+have\s+a\s+developing\s+interest\s+in\s+/i, 'You seem interested in ')
    .replace(/^the child\s+may\s+have\s+a\s+developing\s+interest\s+in\s+/i, 'You seem interested in ')
    .replace(/^the child\s+/i, 'You ')
    .replace(/\bthe child\b/gi, 'you')
    .replace(/\s+with a practical, useful-application framing/gi, ' — especially when you can use it to make something useful')
    .replace(/,?\s+(?:suggested|supported|shown|indicated)\s+by\s+.*$/i, '')
    .replace(/,?\s+as evidenced by\s+.*$/i, '')
    .replace(/,?\s+based on\s+.*$/i, '')

  text = sentenceCase(text).replace(/[,.\s]+$/, '')
  return text ? `${text}.` : ''
}

export function presentAboutMeCandidate(candidate = {}) {
  const concept = conceptLabel(candidate)
  // Prefer the model's explicitly child-facing copy. The analytical statement
  // remains on the candidate for reasoning, evidence traceability, and storage.
  const childFacingStatement = clean(candidate?.childFacingStatement)
  const statement = childFacingStatement || simplifyInference(candidate?.statement)
  const fallback = concept
    ? `You seem to be getting interested in ${concept}.`
    : 'I noticed something new that might be worth exploring.'

  const evidenceCount = Array.isArray(candidate?.evidenceRefs)
    ? candidate.evidenceRefs.filter(Boolean).length
    : 0

  let why = 'I noticed this from things you’ve explored, asked about, or tried.'
  if (evidenceCount >= 2) {
    why = `I found ${evidenceCount} clues from things you’ve explored, asked about, or tried.`
  }

  return {
    headline: statement || fallback,
    why,
  }
}
