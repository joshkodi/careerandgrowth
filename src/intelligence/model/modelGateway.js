import { resolveModelConfig, MODEL_PROVIDER_TYPES } from './modelConfig'
import { requireStructuredOutput } from './structuredOutput'

const providers = new Map()

export function registerModelProvider(name, provider) {
  if (!name || typeof provider?.reason !== 'function') throw new Error('A model provider must expose reason(request).')
  providers.set(name, provider)
}

export function createMockModelProvider({ responder = null } = {}) {
  return {
    async reason(request = {}) {
      if (typeof responder === 'function') return responder(request)
      return request.fallbackOutput || { status: 'mock', task: request.task || 'unknown' }
    },
  }
}

export function createSynapStrideApiProvider() {
  return {
    async reason(request = {}) {
      const { endpoint, timeoutMs = 8000 } = request
      if (!endpoint) throw new Error('VITE_MODEL_API_URL is required when using the SynapStride API model provider.')

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task: request.task,
            context: request.context,
            modelId: request.modelId,
          }),
          signal: controller.signal,
        })

        if (!response.ok) throw new Error(`SynapStride model API returned HTTP ${response.status}.`)

        const payload = await response.json()

        // During Stage 3B transport validation the Lambda intentionally returns a
        // mock service envelope. The network path is still exercised end-to-end,
        // while existing deterministic fallback output keeps the UI stable.
        if (payload?.mode === 'mock') {
          return request.fallbackOutput || { status: 'mock', task: request.task || 'unknown' }
        }

        if (payload?.success === false) throw new Error(payload.error || 'SynapStride model API request failed.')
        if (payload?.output !== undefined) return payload.output

        throw new Error('SynapStride model API response did not contain an output field.')
      } finally {
        clearTimeout(timeout)
      }
    },
  }
}

registerModelProvider(MODEL_PROVIDER_TYPES.MOCK, createMockModelProvider())
registerModelProvider(MODEL_PROVIDER_TYPES.SYNAPSTRIDE_API, createSynapStrideApiProvider())

export async function reasonWithModel(request = {}, configOverrides = {}) {
  const config = resolveModelConfig(configOverrides)
  const provider = providers.get(config.provider)
  if (!provider) throw new Error(`No model provider registered for "${config.provider}".`)
  const startedAt = Date.now()
  const output = await provider.reason({
    ...request,
    modelId: config.modelId,
    endpoint: config.endpoint,
    timeoutMs: config.timeoutMs,
  })
  const validated = request.outputSchema ? requireStructuredOutput(output, request.outputSchema) : output
  return {
    output: validated,
    meta: { provider: config.provider, modelId: config.modelId, latencyMs: Date.now() - startedAt },
  }
}
