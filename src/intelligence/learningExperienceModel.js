/** Stage 6B.2: bounded model proposal over the existing deployed companion task.
 * No invented URLs, no new backend task, and no child data in logs.
 * If the existing companion prompt cannot produce a parseable proposal, fallback wins.
 */
import { executeAiTask } from './model/aiExecution'
import { decideLearningExperience, LEARNING_EXPERIENCES } from './learningExperienceDecision'

const allowed = new Set(Object.values(LEARNING_EXPERIENCES))
const cache = new Map()
const pendingSelections = new Map()
const MAX_CACHE = 80
const FALLBACK_TTL_MS = 20 * 1000

function extractProposal(output) {
  // The deployed companion task may return a structured object or a text
  // field containing JSON (possibly fenced in Markdown).
  const candidates = [output, output?.response, output?.output,
    output?.text, output?.response?.text, output?.message,
    output?.content, output?.response?.content, output?.output?.text,
    output?.data?.text, output?.result?.text]
  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate) && candidate.type && candidate.title && candidate.why) return candidate
    if (typeof candidate !== 'string') continue
    const source = candidate.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    try { const parsed = JSON.parse(source); if (parsed?.type) return parsed } catch { /* look for an embedded object */ }
    const start = source.indexOf('{')
    if (start < 0) continue
    // Balanced-brace extraction avoids truncating JSON with nested fields.
    let depth = 0, inString = false, escaped = false
    for (let i = start; i < source.length; i += 1) {
      const ch = source[i]
      if (inString) {
        if (escaped) escaped = false
        else if (ch === '\\') escaped = true
        else if (ch === '"') inString = false
      } else if (ch === '"') inString = true
      else if (ch === '{') depth += 1
      else if (ch === '}') {
        depth -= 1
        if (depth === 0) {
          try { const parsed = JSON.parse(source.slice(start, i + 1)); if (parsed?.type) return parsed } catch { /* invalid model JSON */ }
          break
        }
      }
    }
  }
  return null
}

function validateProposal(proposal, fallback, hasTrustedResource) {
  if (!proposal || !allowed.has(proposal.type)) return null
  if (proposal.type === LEARNING_EXPERIENCES.RESOURCE && !hasTrustedResource) return null
  const title = typeof proposal.title === 'string' ? proposal.title.trim().slice(0, 90) : ''
  const why = typeof proposal.why === 'string' ? proposal.why.trim().slice(0, 180) : ''
  if (!title || !why) return null
  return { ...fallback, type: proposal.type, title, why, source: 'model' }
}

async function selectLearningExperienceUncached({ goal, assignmentTitle, grade, hasTrustedResource = false } = {}) {
  const fallback = { ...decideLearningExperience({ goal, hasTrustedResource }), source: 'fallback' }
  if (!goal?.title) return fallback
  const key = JSON.stringify([goal.title, goal.hint, assignmentTitle, grade, hasTrustedResource])
  const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) {
    if (import.meta.env.DEV) console.info('[SynapStride Learning Experience]', { outcome: 'CACHE_HIT', source: cached.value.source })
    return cached.value
  }
  if (cached) cache.delete(key)
  // Only minimal task context is sent; the backend owns the actual model prompt.
  const message = [
    'For an educational product, choose the single best FIRST learning experience for this goal.',
    'Your response MUST use the existing companion response contract. Put ONLY a compact JSON object in the companion text field, with keys type, title, why. No surrounding prose, markdown or links.',
    'Allowed types: adaptive_explanation, guided_practice, visual_exploration' + (hasTrustedResource ? ', external_resource' : '') + '.',
    'Use visual_exploration for a map, diagram, timeline or simulation; guided_practice for skills requiring practice; otherwise adaptive_explanation.',
    'Do not claim a resource exists, invent URLs, or make promises about available tools.',
    `Assignment: ${String(assignmentTitle || '').slice(0, 140)}`,
    `Learning goal: ${String(goal.title).slice(0, 160)}`,
    `Learning context: ${String(goal.hint || '').slice(0, 180)}`,
    `Grade: ${String(grade || 'not specified').slice(0, 30)}`,
  ].join('\n')
  let selection = fallback
  if (import.meta.env.DEV) console.info('[SynapStride Learning Experience]', { outcome: 'REQUEST_STARTED', task: 'companion_conversation' })
  try {
    const result = await executeAiTask({
      task: 'companion_conversation',
      context: { message, immediateContext: { type: 'learning_experience_selection', goal: goal.title }, conversation: [] },
      fallbackOutput: { text: '', intent: 'help', personalizationNeed: 'none', followUpOptions: [], actionProposal: { action: 'none' }, evidenceCandidates: [] },
    })
    if (result.meta?.liveModel) {
      const proposal = extractProposal(result.output)
      selection = validateProposal(proposal, fallback, hasTrustedResource) || fallback
      if (import.meta.env.DEV) console.info('[SynapStride Learning Experience]', { outcome: selection.source === 'model' ? 'MODEL_ACCEPTED' : proposal ? 'MODEL_PROPOSAL_REJECTED' : 'MODEL_RESPONSE_NOT_STRUCTURED', responseShape: typeof result.output === 'object' ? Object.keys(result.output || {}) : typeof result.output })
    } else if (import.meta.env.DEV) console.info('[SynapStride Learning Experience]', { outcome: 'MODEL_NOT_LIVE', modelOutcome: result.meta?.outcome })
  } catch (error) { if (import.meta.env.DEV) console.info('[SynapStride Learning Experience]', { outcome: 'MODEL_REQUEST_FAILED', code: error?.diagnosticCode || 'UNKNOWN' }) }
  if (cache.size >= MAX_CACHE) cache.clear()
  cache.set(key, { value: selection, expires: Date.now() + (selection.source === 'model' ? 5 * 60 * 1000 : FALLBACK_TTL_MS) })
  return selection
}

// React can mount/re-render the same goal more than once before the first
// decision completes. Coalesce these calls even if the gateway also dedupes.
export function selectLearningExperience(args = {}) {
  const { goal, assignmentTitle, grade, hasTrustedResource = false } = args
  const key = JSON.stringify([goal?.title, goal?.hint, assignmentTitle, grade, hasTrustedResource])
  const pending = pendingSelections.get(key)
  if (pending) return pending
  const request = selectLearningExperienceUncached(args).finally(() => {
    if (pendingSelections.get(key) === request) pendingSelections.delete(key)
  })
  pendingSelections.set(key, request)
  return request
}
