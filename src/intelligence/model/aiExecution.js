/**
 * Feature-facing execution boundary. Feature adapters own prompts, schemas,
 * child-facing fallback. Gateway owns transport, validation, retries and logs.
 * Never log child data, prompts or model output.
 */
import { reasonWithModel } from './modelGateway'

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
  return reasonWithModel(request, configOverrides)
}
