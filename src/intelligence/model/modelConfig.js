export const DEFAULT_MODEL_CONFIG = Object.freeze({
  provider: 'mock',
  model: 'synapstride-semantic-mock-v2',
  endpoint: '',
  timeoutMs: 12000,
})

export function resolveModelConfig(overrides = {}) {
  const env = typeof import.meta !== 'undefined' ? import.meta.env || {} : {}
  return {
    ...DEFAULT_MODEL_CONFIG,
    provider: env.VITE_SYNAPSTRIDE_MODEL_PROVIDER || DEFAULT_MODEL_CONFIG.provider,
    model: env.VITE_SYNAPSTRIDE_MODEL_ID || DEFAULT_MODEL_CONFIG.model,
    endpoint: env.VITE_SYNAPSTRIDE_MODEL_ENDPOINT || DEFAULT_MODEL_CONFIG.endpoint,
    ...(overrides || {}),
  }
}
