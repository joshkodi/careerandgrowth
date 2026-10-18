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
function fingerprint(value) {
  const str = JSON.stringify(value) || ''
  let a = 2166136261, b = 5381
  for (let i = 0; i < str.length; i += 1) { a = Math.imul(a ^ str.charCodeAt(i), 16777619); b = Math.imul(b, 33) ^ str.charCodeAt(i) }
  return `${str.length}:${a >>> 0}:${b >>> 0}`
}
function eligible(request) {
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
  if (inflight.has(key)) return inflight.get(key)
  const pending = reasonWithModel(request, configOverrides).then((value) => {
    // Never cache a failure or a mock fallback. Successful model results are
    // briefly reused across re-renders and revisits with identical context.
    if (value?.meta?.liveModel) {
      if (settled.size >= MAX_ENTRIES) settled.delete(settled.keys().next().value)
      settled.set(key, { value, expires: Date.now() + TTL_MS })
    }
    return value
  }).finally(() => { inflight.delete(key) })
  inflight.set(key, pending)
  return pending
}
