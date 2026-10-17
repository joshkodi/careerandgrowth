// Diagnostics contain no prompts, responses, child identifiers, or assignment content.
export const MODEL_OUTCOMES = Object.freeze({ LIVE_MODEL: 'LIVE_MODEL', MOCK_FALLBACK: 'MOCK_FALLBACK', TIMEOUT: 'TIMEOUT', HTTP_ERROR: 'HTTP_ERROR', MODEL_ERROR: 'MODEL_ERROR', INVALID_RESPONSE: 'INVALID_RESPONSE', NETWORK_ERROR: 'NETWORK_ERROR', CONFIG_ERROR: 'CONFIG_ERROR' })

export function classifyModelError(error) {
  if (error?.diagnosticCode) return error.diagnosticCode
  if (error?.name === 'AbortError' || error?.name === 'TimeoutError') return MODEL_OUTCOMES.TIMEOUT
  if (/Invalid structured model output|did not contain an output field|JSON/i.test(error?.message || '')) return MODEL_OUTCOMES.INVALID_RESPONSE
  if (/VITE_MODEL_API_URL|No model provider/i.test(error?.message || '')) return MODEL_OUTCOMES.CONFIG_ERROR
  if (error instanceof TypeError) return MODEL_OUTCOMES.NETWORK_ERROR
  return MODEL_OUTCOMES.MODEL_ERROR
}

export function modelFallbackMeta(error, startedAt = Date.now()) {
  return { provider: 'fallback', liveModel: false, outcome: classifyModelError(error), latencyMs: Date.now() - startedAt }
}

export function recordModelDiagnostic({ task, meta }) {
  if (!import.meta.env.DEV) return
  // Avoid logging request context, outputs, user content, or backend error bodies.
  console.info('[SynapStride AI]', { task: task || 'unknown', outcome: meta?.outcome || 'UNKNOWN', latencyMs: meta?.latencyMs ?? null, httpStatus: meta?.httpStatus ?? null, provider: meta?.provider || 'unknown', attempts: meta?.attempts ?? 1, retries: meta?.retries ?? 0, attemptHistory: meta?.attemptHistory ?? [] })
}
