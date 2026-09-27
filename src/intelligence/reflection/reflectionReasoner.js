import { validateReflectionCandidates } from './reflectionValidator'

const dimensionFor = (type) => ({
  emerging_interest: 'interest',
  strength: 'strength',
  preference: 'learning_preference',
  learning_characteristic: 'learning_preference',
  growth_opportunity: 'growth',
  exploration_hypothesis: 'exploration',
}[type] || 'exploration')

const childFriendly = (hypothesis) => {
  const raw = String(hypothesis?.statement || '')
    .replace(/^the child\s+/i, 'You ')
    .replace(/\bthe child\b/gi, 'you')

  return raw ||
    `You may be starting to explore ${String(hypothesis?.concept || 'something new').replaceAll('_', ' ')}.`
}

// v0.17 Stage 4:
// Child Understanding owns the model-backed interpretation.
// About Me turns those already-validated hypotheses into child-correctable
// reflections deterministically. This avoids a second LLM call simply to
// rewrite an inference for presentation.
export function deterministicReflectionOutput(context = {}) {
  return {
    candidates: (context?.hypotheses || []).slice(0, 2).map((hypothesis, index) => ({
      id: `reflection-${hypothesis?.concept || index}`,
      dimension: dimensionFor(hypothesis?.type),
      concept: hypothesis?.concept || `idea-${index}`,
      statement: childFriendly(hypothesis),
      childFacingStatement: hypothesis?.childFacingStatement || null,
      confidence: Number(hypothesis?.confidence || 0.5),
      evidenceRefs: hypothesis?.evidenceRefs || [],
      source: 'model_inferred',
    })),
  }
}

export async function reasonAboutReflections({ context } = {}) {
  const output = deterministicReflectionOutput(context)

  return {
    validation: validateReflectionCandidates(output, context),
    model: null,
  }
}
