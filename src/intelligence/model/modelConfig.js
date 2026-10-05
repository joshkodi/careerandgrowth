export const MODEL_PROVIDER_TYPES = Object.freeze({
  MOCK: 'mock',
  SYNAPSTRIDE_API: 'synapstride-api',
})

const env = import.meta.env || {}

export const defaultModelConfig = Object.freeze({
  provider: env.VITE_MODEL_PROVIDER || MODEL_PROVIDER_TYPES.MOCK,
  modelId: env.VITE_MODEL_ID || 'synapstride-mock-v1',
  endpoint: env.VITE_MODEL_API_URL || '',
  timeoutMs: 20000,
  maxRetries: 1,
  structuredOutput: true,
})

export function resolveModelConfig(overrides = {}) {
  return { ...defaultModelConfig, ...overrides }
}
