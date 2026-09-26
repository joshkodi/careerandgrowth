const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)

export function validateStructuredOutput(value, schema = {}) {
  const errors = []
  if (!isObject(value)) errors.push('Model output must be an object.')
  ;(schema.required || []).forEach((key) => {
    if (value?.[key] === undefined || value?.[key] === null) errors.push(`Missing required field: ${key}`)
  })
  return { valid: errors.length === 0, errors, value }
}

export function requireStructuredOutput(value, schema = {}) {
  const result = validateStructuredOutput(value, schema)
  if (!result.valid) throw new Error(`Invalid structured model output: ${result.errors.join(' ')}`)
  return value
}
