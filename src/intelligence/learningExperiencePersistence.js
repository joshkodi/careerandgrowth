/** Stage 6B.3B: browser-only, family-scoped cache for validated model decisions.
 * Not an authoritative child record. Never store prompts, model transcripts or fallbacks.
 * A future authenticated backend can replace this adapter.
 */
import { getActiveFamilyId, getFamilyStorageKey } from '../storage/familyStorage'

const BASE_KEY = 'synapstride.learningExperience.v1'
const SCHEMA = 1
const TTL_MS = 30 * 24 * 60 * 60 * 1000
const MAX_ENTRIES = 80
const MAX_BYTES = 120000
const VALID_TYPES = new Set(['adaptive_explanation', 'guided_practice', 'visual_exploration', 'external_resource'])

export function getLearningExperienceScope() {
  try { return getActiveFamilyId() || null } catch { return null }
}

function storageKey(familyId) { return getFamilyStorageKey(BASE_KEY, familyId) }

function readEntries(familyId) {
  if (!familyId || typeof window === 'undefined') return {}
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey(familyId)) || '{}')
    if (parsed.schema !== SCHEMA || !parsed.entries || typeof parsed.entries !== 'object' || Array.isArray(parsed.entries)) return {}
    return parsed.entries
  } catch { return {} }
}

function valid(value, hasTrustedResource) {
  return value && value.source === 'model' && VALID_TYPES.has(value.type) &&
    (value.type !== 'external_resource' || hasTrustedResource) &&
    typeof value.title === 'string' && value.title.trim().length > 0 && value.title.length <= 90 &&
    typeof value.why === 'string' && value.why.trim().length > 0 && value.why.length <= 180
}

export function readLearningExperience(familyId, key, hasTrustedResource) {
  if (!familyId || !key) return null
  const entry = readEntries(familyId)[key]
  if (!entry || !Number.isFinite(entry.expires) || entry.expires <= Date.now() || !valid(entry.value, hasTrustedResource)) return null
  return { type: entry.value.type, title: entry.value.title, why: entry.value.why, source: 'model' }
}

export function saveLearningExperience(familyId, key, value, hasTrustedResource) {
  if (!familyId || !key || !valid(value, hasTrustedResource) || typeof window === 'undefined') return
  try {
    const now = Date.now()
    const entries = readEntries(familyId)
    for (const [k, v] of Object.entries(entries)) if (!v || v.expires <= now) delete entries[k]
    entries[key] = { value: { type: value.type, title: value.title, why: value.why, source: 'model' }, expires: now + TTL_MS, savedAt: now }
    const sorted = Object.entries(entries).sort((a, b) => (b[1].savedAt || 0) - (a[1].savedAt || 0)).slice(0, MAX_ENTRIES)
    while (sorted.length) {
      const payload = JSON.stringify({ schema: SCHEMA, entries: Object.fromEntries(sorted) })
      if (payload.length <= MAX_BYTES) { window.localStorage.setItem(storageKey(familyId), payload); return }
      sorted.pop()
    }
  } catch { /* blocked/quota storage must never break learning */ }
}
