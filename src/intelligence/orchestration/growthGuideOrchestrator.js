import { guidanceCategories, makeGuidanceAction, GROWTH_GUIDE_VERSION } from './growthGuideModels'

const textOf = (value, fallback) => String(value || fallback || '').trim()

export function buildGrowthGuide({ context = {} } = {}) {
  const pg = context.personalizedGuidance || {}
  const actions = []
  const attention = pg.needsAttention
  const continuation = pg.continueAction
  const next = pg.tryNext

  if (attention?.item || continuation?.item) {
    const selected = attention?.item ? attention : continuation
    const item = selected.item
    actions.push(makeGuidanceAction({
      category: guidanceCategories.CONTINUE,
      source: item?.path === 'school_learning' ? 'school_learning' : 'journey',
      action: 'continue_work', targetId: item?.id, item,
      title: textOf(selected.title || item?.title, 'Continue what you started'),
      reason: textOf(selected.reason, 'You already have this in motion.'),
      priority: attention ? 100 : 85,
    }))
  }

  const recommendation = next?.recommendation || context.recommendations?.[0]
  if (recommendation) {
    actions.push(makeGuidanceAction({
      category: guidanceCategories.EXPLORE, source: 'personalization', action: 'try_recommendation',
      targetId: recommendation.id || recommendation.experienceId, item: recommendation,
      title: textOf(recommendation.title || recommendation.name, 'Try something new'),
      reason: textOf(next?.reason || recommendation.reasons?.[0], 'This connects with things you have been exploring.'), priority: 70,
    }))
  }

  const understanding = context.childUnderstanding
  const inferred = Array.isArray(understanding?.modelInferred) ? understanding.modelInferred : []
  const growthHypothesis = inferred.find(item => item?.type === 'growth_opportunity') || inferred.find(item => item?.type === 'learning_characteristic') || inferred[0] || null
  const statement = growthHypothesis?.statement || growthHypothesis?.description || growthHypothesis?.concept || null
  if (statement) {
    actions.push(makeGuidanceAction({
      category: guidanceCategories.GROW, source: 'child_understanding', action: 'profile',
      targetId: growthHypothesis.id || null,
      title: 'Notice how you’re growing',
      reason: textOf(statement, 'Take a look at something SynapStride has noticed about your growth.'), priority: 55,
      item: growthHypothesis,
    }))
  } else {
    actions.push(makeGuidanceAction({
      category: guidanceCategories.GROW, source: 'about_me', action: 'profile',
      title: 'See what you’re learning about yourself',
      reason: 'Your About Me space grows as you learn, explore, and reflect.', priority: 40,
    }))
  }

  const bestByCategory = Object.values(guidanceCategories).map(category =>
    actions.filter(action => action.category === category).sort((a,b) => b.priority - a.priority)[0]
  ).filter(Boolean)

  return { version: GROWTH_GUIDE_VERSION, actions: bestByCategory, primary: bestByCategory[0] || null, generatedAt: new Date().toISOString() }
}
