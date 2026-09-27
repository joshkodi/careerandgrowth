import { recordIntelligenceTrace } from '../observability/intelligenceTrace'
import { buildReflectionContext } from './reflectionContextBuilder'
import { reasonAboutReflections } from './reflectionReasoner'
import { getReflectionOutcomes } from './reflectionStorage'
import { reflectionStageVersion } from './reflectionModels'
export async function buildAdaptiveAboutMe({ childUnderstanding, modelConfig }={}) {
  const childId=childUnderstanding?.child?.id || null; const outcomes=getReflectionOutcomes({childId}); const context=buildReflectionContext({childUnderstanding,outcomes});
  if (!context.hypotheses.length) return { version:reflectionStageVersion, candidates:[], outcomes, model:null }
  const result=await reasonAboutReflections({context,modelConfig}); const value={version:reflectionStageVersion,candidates:result.validation.accepted,outcomes,model:result.model}
  recordIntelligenceTrace({type:'adaptive_about_me',version:reflectionStageVersion,childId,candidateCount:value.candidates.length,rejectedCount:result.validation.rejected.length,model:result.model}); return value
}
