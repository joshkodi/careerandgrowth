import { resolveModelConfig, MODEL_PROVIDER_TYPES } from './modelConfig'
import { requireStructuredOutput } from './structuredOutput'
import { MODEL_OUTCOMES, classifyModelError, recordModelDiagnostic } from './modelDiagnostics'

const providers = new Map()

export function registerModelProvider(name, provider) {
  if (!name || typeof provider?.reason !== 'function') throw new Error('A model provider must expose reason(request).')
  providers.set(name, provider)
}

export function createMockModelProvider({ responder = null } = {}) {
  return {
    async reason(request = {}) {
      const output = typeof responder === 'function'
        ? await responder(request)
        : request.fallbackOutput || { status: 'mock', task: request.task || 'unknown' }
      return { __synapstrideProviderEnvelope: true, output, providerMeta: { mode: 'fallback', liveModel: false } }
    },
  }
}

export function createSynapStrideApiProvider() {
  return {
    async reason(request = {}) {
      const { endpoint, timeoutMs = 20000 } = request
      if (!endpoint) throw new Error('VITE_MODEL_API_URL is required when using the SynapStride API model provider.')
      const controller = new AbortController()
      let timedOut = false
      const timeout = setTimeout(() => { timedOut = true; controller.abort() }, timeoutMs)
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: request.task, context: request.context, modelId: request.modelId }),
          signal: controller.signal,
        })
        if (!response.ok) {
          const error = new Error(`SynapStride model API returned HTTP ${response.status}.`)
          error.diagnosticCode = MODEL_OUTCOMES.HTTP_ERROR
          error.httpStatus = response.status
          // API Gateway may surface a Bedrock ThrottlingException as HTTP 500.
          // Distinguish it from a generic server error to avoid retry storms.
          if (response.status === 429 || response.status === 500 || response.status === 503) {
            try {
              const body = await response.clone().json()
              if (response.status === 429 || /ThrottlingException|TooManyRequests|rate exceeded|quota exceeded/i.test(String(body?.error || body?.message || ''))) {
                error.isThrottled = true
              }
            } catch { if (response.status === 429) error.isThrottled = true }
          }
          throw error
        }
        let payload
        try { payload = await response.json() }
        catch (cause) { const error = new Error('SynapStride model API returned invalid JSON.'); error.diagnosticCode = MODEL_OUTCOMES.INVALID_RESPONSE; error.cause = cause; throw error }
        if (payload?.mode === 'mock') {
          return { __synapstrideProviderEnvelope: true, output: request.fallbackOutput || { status: 'mock', task: request.task || 'unknown' }, providerMeta: { mode: 'fallback', liveModel: false, transport: 'http', outcome: MODEL_OUTCOMES.MOCK_FALLBACK } }
        }
        if (payload?.success === false) { const error = new Error('SynapStride model API reported failure.'); error.diagnosticCode = MODEL_OUTCOMES.MODEL_ERROR; throw error }
        if (payload?.output !== undefined) return { __synapstrideProviderEnvelope: true, output: payload.output, providerMeta: { mode: 'live', liveModel: true, transport: 'http', outcome: MODEL_OUTCOMES.LIVE_MODEL, backendModel: payload.modelId || payload.model || null } }
        const error = new Error('SynapStride model API response did not contain an output field.')
        error.diagnosticCode = MODEL_OUTCOMES.INVALID_RESPONSE
        throw error
      } catch (error) {
        if (timedOut) error.diagnosticCode = MODEL_OUTCOMES.TIMEOUT
        throw error
      } finally { clearTimeout(timeout) }
    },
  }
}

registerModelProvider(MODEL_PROVIDER_TYPES.MOCK, createMockModelProvider())
registerModelProvider(MODEL_PROVIDER_TYPES.SYNAPSTRIDE_API, createSynapStrideApiProvider())

function isTransient(error) {
  const code = classifyModelError(error)
  return code === MODEL_OUTCOMES.TIMEOUT || code === MODEL_OUTCOMES.NETWORK_ERROR ||
    (code === MODEL_OUTCOMES.HTTP_ERROR && (error.httpStatus === 408 || error.httpStatus === 429 || error.httpStatus >= 500))
}

export async function reasonWithModel(request = {}, configOverrides = {}) {
  const config = resolveModelConfig(configOverrides)
  const provider = providers.get(config.provider)
  if (!provider) throw new Error(`No model provider registered for "${config.provider}".`)
  const startedAt = Date.now()
  // Retry only idempotent reasoning calls and only for transient transport failures.
  const maxRetries = config.provider === MODEL_PROVIDER_TYPES.SYNAPSTRIDE_API
    ? Math.min(1, Math.max(0, Number(config.maxRetries) || 0)) : 0
  const attemptHistory = []
  for (let attempt = 1; attempt <= maxRetries + 1; attempt += 1) {
    const attemptStartedAt = Date.now()
    try {
      const providerResult = await provider.reason({ ...request, modelId: config.modelId, endpoint: config.endpoint, timeoutMs: config.timeoutMs })
      const output = providerResult?.__synapstrideProviderEnvelope ? providerResult.output : providerResult
      const providerMeta = providerResult?.__synapstrideProviderEnvelope ? providerResult.providerMeta || {} : {}
      let validated
      try { validated = request.outputSchema ? requireStructuredOutput(output, request.outputSchema) : output }
      catch (error) { error.diagnosticCode = MODEL_OUTCOMES.INVALID_RESPONSE; throw error }
      const meta = { provider: config.provider, modelId: config.modelId, latencyMs: Date.now() - startedAt, outcome: providerMeta.liveModel ? MODEL_OUTCOMES.LIVE_MODEL : MODEL_OUTCOMES.MOCK_FALLBACK, ...providerMeta, attempts: attempt, retries: attempt - 1, attemptHistory }
      recordModelDiagnostic({ task: request.task, meta })
      return { output: validated, meta }
    } catch (error) {
      error.diagnosticCode = classifyModelError(error)
      attemptHistory.push({ attempt, outcome: error.diagnosticCode, latencyMs: Date.now() - attemptStartedAt, httpStatus: error.httpStatus ?? null })
      // Never immediately retry throttling; allow the UI fallback and avoid
      // multiplying pressure on Bedrock. Other transient failures retain the
      // existing single controlled retry.
      if (attempt <= maxRetries && isTransient(error) && !error.isThrottled) continue
      error.attempts = attempt
      error.attemptHistory = attemptHistory
      recordModelDiagnostic({ task: request.task, meta: { provider: config.provider, outcome: error.diagnosticCode, latencyMs: Date.now() - startedAt, httpStatus: error.httpStatus, attempts: attempt, retries: attempt - 1, attemptHistory } })
      throw error
    }
  }
}
