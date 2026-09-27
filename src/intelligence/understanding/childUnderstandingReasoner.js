import { reasonWithModel } from '../model/modelGateway'
import { childUnderstandingOutputSchema, emptyChildUnderstandingOutput } from './childUnderstandingModels'
import { validateChildUnderstandingInterpretation } from './childUnderstandingValidator'

export async function reasonAboutChild({ context, modelConfig } = {}) {
  const result = await reasonWithModel({
    task: 'child_understanding',
    context,
    outputSchema: childUnderstandingOutputSchema,
    fallbackOutput: emptyChildUnderstandingOutput(),
  }, {
  timeoutMs: 30000,
  ...modelConfig,
  })

  const validation = validateChildUnderstandingInterpretation(result.output, context)

  return {
    modelInterpretation: result.output,
    validation,
    model: result.meta,
  }
}
