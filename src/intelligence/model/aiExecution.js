/**
 * Feature-facing execution boundary. Feature adapters own prompts, schemas,
 * child-facing fallback. Gateway owns transport, validation, retries and logs.
 * Never log child data, prompts or model output.
 */
import { reasonWithModel } from './modelGateway'

// Cache only idempotent recommendation tasks, never conversational or assignment work.
// Cache keys are non-reversible fingerprints; no child context or prompts are logged.
const settled = new Map()
const inflight = new Map()
const TTL_MS = 5 * 60 * 1000
const MAX_ENTRIES = 80
// Persistent, input-fingerprinted cache for read-only experience ranking.
// No raw prompts or context are stored; the model output stays on this device.
const EXPERIENCE_TTL_MS = 24 * 60 * 60 * 1000
const EXPERIENCE_PREFIX = 'synapstride:ai:experience:v1:'
const UNDERSTANDING_PREFIX = 'synapstride:ai:understanding:v1:'
function readPersistentExperience(key, prefix = EXPERIENCE_PREFIX) {
  try {
    if (typeof localStorage === 'undefined') return null
    const storageKey = prefix + key
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const entry = JSON.parse(raw)
    if (!entry || entry.expires <= Date.now() || !entry.value?.meta?.liveModel) {
      localStorage.removeItem(storageKey)
      return null
    }
    return entry.value
  } catch { return null }
}
function writePersistentExperience(key, value, prefix = EXPERIENCE_PREFIX) {
  try {
    if (typeof localStorage === 'undefined') return
    // Bound the number of cached responses on a shared device.
    const keys = []
    for (let i = 0; i < localStorage.length; i += 1) {
      const name = localStorage.key(i)
      if (name?.startsWith(prefix)) keys.push(name)
    }
    if (keys.length >= 20) {
      const oldest = keys.map((name) => {
        try { return { name, expires: JSON.parse(localStorage.getItem(name)).expires || 0 } }
        catch { return { name, expires: 0 } }
      }).sort((a, b) => a.expires - b.expires)
      oldest.slice(0, keys.length - 19).forEach(({ name }) => localStorage.removeItem(name))
    }
    localStorage.setItem(prefix + key, JSON.stringify({ expires: Date.now() + EXPERIENCE_TTL_MS, value }))
  } catch { /* Storage disabled/full: in-memory cache still works. */ }
}
function fingerprint(value) {
  const str = JSON.stringify(value) || ''
  let a = 2166136261, b = 5381
  for (let i = 0; i < str.length; i += 1) { a = Math.imul(a ^ str.charCodeAt(i), 16777619); b = Math.imul(b, 33) ^ str.charCodeAt(i) }
  return `${str.length}:${a >>> 0}:${b >>> 0}`
}
function eligible(request) {
  // Child understanding is a read-only hypothesis task. Reuse only identical
  // context within a short window; changed evidence always gets a new key.
  if (request.task === 'child_understanding') return true
  if (request.task === 'experience_personalization') return true
  return request.task === 'companion_conversation' && request.context?.immediateContext?.type === 'learning_experience_selection'
}


export const AI_TASKS = Object.freeze({
  ASSIGNMENT_INTERPRETATION: 'school_work_interpretation',
  COMPANION_CONVERSATION: 'companion_conversation',
  CHILD_UNDERSTANDING: 'child_understanding',
  EXPERIENCE_PERSONALIZATION: 'experience_personalization',
  SEMANTIC_ANALYSIS: 'semantic_analysis',
})

/** Retains Stage 4B's { output, meta } contract without transforming requests. */
export async function executeAiTask(request = {}, configOverrides = {}) {
  if (!request || typeof request.task !== 'string' || !request.task.trim()) {
    const error = new Error('An AI task identifier is required.')
    error.diagnosticCode = 'CONFIG_ERROR'
    throw error
  }
  if (!eligible(request)) return reasonWithModel(request, configOverrides)
  const key = fingerprint([request.task, request.context, configOverrides])
  const now = Date.now()
  const previous = settled.get(key)
  if (previous && previous.expires > now) return previous.value
  if (previous) settled.delete(key)
  if (request.task === 'experience_personalization' || request.task === 'child_understanding') {
    const prefix = request.task === 'child_understanding' ? UNDERSTANDING_PREFIX : EXPERIENCE_PREFIX
    const persisted = readPersistentExperience(key, prefix)
    if (persisted) {
      settled.set(key, { value: persisted, expires: Date.now() + TTL_MS })
      return persisted
    }
  }
  if (inflight.has(key)) return inflight.get(key)
  const pending = reasonWithModel(request, configOverrides).then((value) => {
    // Never cache a failure or a mock fallback. Successful model results are
    // briefly reused across re-renders and revisits with identical context.
    if (value?.meta?.liveModel) {
      if (settled.size >= MAX_ENTRIES) settled.delete(settled.keys().next().value)
      settled.set(key, { value, expires: Date.now() + TTL_MS })
      if (request.task === 'experience_personalization' || request.task === 'child_understanding') {
        writePersistentExperience(key, value, request.task === 'child_understanding' ? UNDERSTANDING_PREFIX : EXPERIENCE_PREFIX)
      }
    }
    return value
  }).finally(() => { inflight.delete(key) })
  inflight.set(key, pending)
  return pending
}
