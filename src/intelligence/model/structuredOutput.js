const typeOf = (value) => Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value

function validateNode(value, schema = {}, path = 'output') {
  if (!schema || typeof schema !== 'object') return
  if (schema.type && typeOf(value) !== schema.type) throw new Error(`${path} must be ${schema.type}.`)
  if (schema.enum && !schema.enum.includes(value)) throw new Error(`${path} must be one of: ${schema.enum.join(', ')}`)
  if (typeof value === 'number') {
    if (Number.isFinite(schema.minimum) && value < schema.minimum) throw new Error(`${path} must be >= ${schema.minimum}.`)
    if (Number.isFinite(schema.maximum) && value > schema.maximum) throw new Error(`${path} must be <= ${schema.maximum}.`)
  }
  if (Array.isArray(value) && schema.items) value.forEach((item, index) => validateNode(item, schema.items, `${path}[${index}]`))
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const required = Array.isArray(schema.required) ? schema.required : []
    const missing = required.filter((key) => value[key] === undefined || value[key] === null)
    if (missing.length) throw new Error(`${path} missing required fields: ${missing.join(', ')}`)
    Object.entries(schema.properties || {}).forEach(([key, childSchema]) => {
      if (value[key] !== undefined && value[key] !== null) validateNode(value[key], childSchema, `${path}.${key}`)
    })
  }
}

export function validateStructuredOutput(value, schema = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Model output must be an object.')
  validateNode(value, { type: 'object', ...schema })
  return value
}
