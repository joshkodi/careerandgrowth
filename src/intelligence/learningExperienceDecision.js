/**
 * Stage 6B.1: deterministic, inspectable first-pass learning experience decision.
 * This is NOT model-based personalization or live external discovery.
 * Future model output can propose an experience, but must pass validation here.
 */
export const LEARNING_EXPERIENCES = Object.freeze({
  EXPLANATION: 'adaptive_explanation',
  PRACTICE: 'guided_practice',
  VISUAL: 'visual_exploration',
  RESOURCE: 'external_resource',
})
const has = (text, words) => words.some(word => text.includes(word))
export function decideLearningExperience({ goal, hasTrustedResource = false } = {}) {
  const text = [goal?.title, goal?.hint, goal?.lesson].filter(Boolean).join(' ').toLowerCase()
  if (has(text, ['practice', 'solve', 'calculate', 'equation', 'fraction', 'multiplication', 'division'])) {
    return { type: LEARNING_EXPERIENCES.PRACTICE, title: 'Try it step by step', why: 'Practicing a small example may help this idea stick.', action: 'Ask SynapStride for a practice example' }
  }
  if (has(text, ['orbit', 'map', 'diagram', 'visual', 'geography', 'planet', 'shape', 'cycle', 'timeline'])) {
    if (hasTrustedResource) return { type: LEARNING_EXPERIENCES.RESOURCE, title: 'Explore a visual resource', why: 'Seeing this idea may help you understand it.', action: 'Explore the recommended resource' }
    return { type: LEARNING_EXPERIENCES.VISUAL, title: 'Explore it with an example', why: 'A picture or concrete example may make this clearer.', action: 'Ask SynapStride for a visual explanation' }
  }
  if (hasTrustedResource && has(text, ['watch', 'video', 'simulation', 'interactive'])) {
    return { type: LEARNING_EXPERIENCES.RESOURCE, title: 'Explore a learning resource', why: 'A trusted resource can add another way to learn.', action: 'Open recommended resource' }
  }
  return { type: LEARNING_EXPERIENCES.EXPLANATION, title: 'Start with a clear explanation', why: 'Understanding the main idea is a good first step.', action: 'Teach me this' }
}
