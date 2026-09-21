import { resolveModelConfig } from './modelConfig'
import { validateStructuredOutput } from './structuredOutput'

const clean = (value) => String(value || '').trim().toLowerCase()

function mockGuidance(context = {}, fallbackOutput = {}) {
  const message = clean(context?.interaction?.message || context?.interaction?.text)
  const intent = context?.interaction?.semanticIntent?.intent
  const hasExperience = Boolean(context?.experience?.title || context?.experience?.topic || context?.journey?.activeItem?.title)
  const intentActions = { example_request: 'show_example', hint_request: 'give_hint', practice_request: 'guided_practice', resource_request: 'show_resource', continue_request: 'continue_work', learning_help: 'explain' }
  const action = intentActions[intent] || fallbackOutput?.action || (hasExperience ? 'explain' : 'explore')
  return { action, reason: intent ? `Use semantic intent ${intent} with the active SynapStride context.` : 'Use current SynapStride context for a safe next step.', confidence: 0.55, strategy: { mode: 'contextual', preserveChildAgency: true }, resourceRequired: action === 'show_resource', memoryCandidates: [], growthSignalCandidates: [] }
}

function mockSemanticAnalysis(context = {}) {
  const message = clean(context?.interaction?.message)
  const experience = context?.experience || {}
  let intent = experience?.title || experience?.topic ? 'contextual_question' : 'general_question'
  if (/\b(stuck|confus|don.?t get|don.?t understand|help)\b/.test(message)) intent = 'learning_help'
  else if (/\b(example|show me)\b/.test(message)) intent = 'example_request'
  else if (/\b(hint|clue)\b/.test(message)) intent = 'hint_request'
  else if (/\b(practice|quiz|try one)\b/.test(message)) intent = 'practice_request'
  else if (/\b(resource|video|website|source)\b/.test(message)) intent = 'resource_request'
  else if (/\b(continue|resume|keep going)\b/.test(message)) intent = 'continue_request'
  return { intent, confidence: 0.55, concepts: [experience?.topic, experience?.title].filter(Boolean), taxonomyCandidates: [], difficultyType: null, source: 'mock_semantic_fallback' }
}

function mockCompanion(context = {}, fallbackOutput = {}) {
  return fallbackOutput || { text: 'Tell me what feels unclear and we can work through it together.', checkUnderstanding: true }
}

async function callHttpProvider(request, config) {
  if (!config.endpoint) throw new Error('VITE_SYNAPSTRIDE_MODEL_ENDPOINT is required for the http model provider.')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), config.timeoutMs)
  try {
    const response = await fetch(config.endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
      body: JSON.stringify({ task: request.task, model: config.model, context: request.context, outputSchema: request.outputSchema }),
    })
    if (!response.ok) throw new Error(`Model endpoint returned HTTP ${response.status}.`)
    const body = await response.json()
    return body?.output || body
  } finally { clearTimeout(timer) }
}

export async function reasonWithModel(request = {}, overrides = {}) {
  const config = resolveModelConfig(overrides)
  const startedAt = Date.now()
  let output
  if (config.provider === 'mock') {
    if (request.task === 'guidance_decision') output = mockGuidance(request.context, request.fallbackOutput)
    else if (request.task === 'semantic_analysis') output = mockSemanticAnalysis(request.context)
    else if (request.task === 'companion_response') output = mockCompanion(request.context, request.fallbackOutput)
    else if (request.task === 'resource_plan' || request.task === 'resource_evaluation') output = request.fallbackOutput || {}
    else output = request.fallbackOutput || {}
  } else if (config.provider === 'http') {
    output = await callHttpProvider(request, config)
  } else throw new Error(`Unsupported model provider "${config.provider}". Use mock or http.`)
  return { output: validateStructuredOutput(output, request.outputSchema), meta: { provider: config.provider, model: config.model, mocked: config.provider === 'mock', latencyMs: Date.now() - startedAt } }
}
