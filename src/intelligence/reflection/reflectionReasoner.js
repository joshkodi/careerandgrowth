import { reasonWithModel } from '../model/modelGateway'
import { reflectionOutputSchema } from './reflectionModels'
import { validateReflectionCandidates } from './reflectionValidator'
const dimensionFor = (type) => ({ emerging_interest:'interest', strength:'strength', preference:'learning_preference', learning_characteristic:'learning_preference', growth_opportunity:'growth', exploration_hypothesis:'exploration' }[type] || 'exploration')
const childFriendly = (h) => {
  const raw = String(h?.statement || '').replace(/^the child\s+/i, 'You ').replace(/\bthe child\b/gi, 'you')
  return raw || `You may be starting to explore ${String(h?.concept || 'something new').replaceAll('_',' ')}.`
}
export function deterministicReflectionOutput(context = {}) {
  return { candidates: (context?.hypotheses || []).slice(0,2).map((h,i)=>({ id:`reflection-${h?.concept || i}`, dimension:dimensionFor(h?.type), concept:h?.concept || `idea-${i}`, statement:childFriendly(h), confidence:Number(h?.confidence || .5), evidenceRefs:h?.evidenceRefs || [], source:'model_inferred' })) }
}
export async function reasonAboutReflections({ context, modelConfig } = {}) {
  const fallbackOutput = deterministicReflectionOutput(context)
  const result = await reasonWithModel({ task:'adaptive_about_me_reflections', context, outputSchema:reflectionOutputSchema, fallbackOutput }, modelConfig)
  return { validation: validateReflectionCandidates(result.output, context), model: result.meta }
}
