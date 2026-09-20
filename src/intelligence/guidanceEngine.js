// SynapStride v0.15 — Guidance Engine v1
// Chooses the next helpful intervention before a resource is selected.

const text = (value) => String(value || '').trim().toLowerCase()

export const guidanceActions = Object.freeze({
  EXPLAIN: 'explain',
  ASK_QUESTION: 'ask_question',
  GIVE_HINT: 'give_hint',
  SHOW_EXAMPLE: 'show_example',
  GUIDED_PRACTICE: 'guided_practice',
  SHOW_RESOURCE: 'show_resource',
  CONTINUE_WORK: 'continue_work',
  EXPLORE: 'explore',
  PROFILE: 'profile',
})

const presentationForMode = (modeId = '') => {
  const mode = text(modeId)
  if (mode.includes('example')) return { action: guidanceActions.SHOW_EXAMPLE, title: 'Let’s look at a similar example.', message: 'I’ll show the idea without doing your assignment for you.' }
  if (mode.includes('practice')) return { action: guidanceActions.GUIDED_PRACTICE, title: 'Let’s practice a little.', message: 'A short practice round can make the real work feel easier.' }
  if (mode.includes('get_unstuck') || mode.includes('stuck')) return { action: guidanceActions.GIVE_HINT, title: 'Let’s find the next small step.', message: 'I’ll help you move forward without taking over.' }
  if (mode.includes('research')) return { action: guidanceActions.SHOW_RESOURCE, title: 'Let’s find a useful source.', message: 'I’ll look for something focused and trustworthy for this part of the work.' }
  if (mode.includes('review')) return { action: guidanceActions.GUIDED_PRACTICE, title: 'Let’s make review manageable.', message: 'We’ll focus on the most useful thing to review next.' }
  if (mode.includes('enrich')) return { action: guidanceActions.EXPLORE, title: 'Let’s go a little further.', message: 'I’ll find a next step that stretches the idea without making it overwhelming.' }
  return { action: guidanceActions.EXPLAIN, title: 'Let’s make this clearer.', message: 'I’ll start simply, and we can try a different way if this one doesn’t click.' }
}

export function buildLearningGuidancePlan({ journeyItem, supportRequest, previousOutcome = null } = {}) {
  if (!journeyItem || !supportRequest) return null
  const base = presentationForMode(supportRequest.helpMode || supportRequest.modeId)
  const triedBefore = Array.isArray(journeyItem.learningHistory) && journeyItem.learningHistory.length > 0
  const needsAnotherWay = previousOutcome === 'more_help' || supportRequest?.outcome?.outcomeType === 'more_help'

  return {
    version: '0.15.0',
    contextType: 'school_work',
    journeyId: journeyItem.id,
    action: needsAnotherWay ? guidanceActions.SHOW_RESOURCE : base.action,
    title: needsAnotherWay ? 'Let’s try this a different way.' : base.title,
    message: needsAnotherWay
      ? 'The first approach didn’t get you unstuck, so I’m changing the kind of help instead of repeating it.'
      : base.message,
    currentStep: journeyItem.currentStep || journeyItem.nextStep || journeyItem.tasks?.[0]?.label || journeyItem.tasks?.[0] || null,
    topic: journeyItem.topic || journeyItem.title || null,
    adaptFromHistory: triedBefore,
    generatedAt: new Date().toISOString(),
  }
}

export function buildCompanionGuidance({ message, activeItem = null, recommendation = null, needsAttention = null } = {}) {
  const normalized = text(message)
  const schoolWords = /(homework|school|study|test|fraction|math|reading|science|history|assignment|worksheet)/
  const helpWords = /(help|stuck|confus|don.?t understand|dont understand|hard|hint)/
  const makeWords = /(build|make|robot|activity|project|fun|bored|create)/
  const profileWords = /(profile|about me|good at|strength|know about me|learning about me)/
  const continueWords = /(continue|keep going|where.*left|resume|progress|journey)/
  const whyWords = /(why.*(this|next|recommend)|why did you pick|why is this)/
  const nextWords = /(next|try|recommend|suggest|what should|guide me|something for me)/

  if (helpWords.test(normalized) && activeItem) {
    return {
      action: activeItem.path === 'school_learning' ? 'open_school_help' : guidanceActions.CONTINUE_WORK,
      text: `I know you’re working on “${activeItem.title}.” Let’s start from where you are instead of making you explain everything again.`,
      actionLabel: activeItem.path === 'school_learning' ? 'Help me with this →' : 'Continue →',
      contextual: true,
    }
  }
  if (schoolWords.test(normalized) || helpWords.test(normalized)) {
    return { action: 'open_school', text: 'Show me or tell me what you’re working on. I’ll help figure out the next step.', actionLabel: 'Open School →' }
  }
  if (whyWords.test(normalized) && recommendation) {
    return { action: 'try_recommendation', text: recommendation.reasons?.[0] || 'I picked this from the interests and growth clues SynapStride has enough evidence to use right now.', actionLabel: 'Try it →' }
  }
  if (continueWords.test(normalized) && activeItem) {
    return { action: guidanceActions.CONTINUE_WORK, text: `You were working on “${activeItem.title}.” I remember where you left off.`, actionLabel: 'Continue →', contextual: true }
  }
  if (nextWords.test(normalized)) {
    if (needsAttention?.item) return { action: 'open_school_help', text: `“${needsAttention.item.title}” still needs some help. I’d start there.`, actionLabel: 'Help me with this →', contextual: true }
    if (activeItem) return { action: guidanceActions.CONTINUE_WORK, text: `You already have “${activeItem.title}” in motion. We can pick it up from where you stopped.`, actionLabel: 'Continue →', contextual: true }
    if (recommendation) return { action: 'try_recommendation', text: `I think “${recommendation.title}” is worth trying.`, actionLabel: 'Try it →' }
  }
  if (makeWords.test(normalized)) return { action: guidanceActions.EXPLORE, text: 'Let’s find something you can make, test, or explore—not just something to read.', actionLabel: 'Find an idea →' }
  if (profileWords.test(normalized)) return { action: guidanceActions.PROFILE, text: 'I can show you the clues we’re beginning to connect. They can change as you do.', actionLabel: 'See Me →' }

  return {
    action: activeItem ? guidanceActions.CONTINUE_WORK : guidanceActions.EXPLORE,
    text: activeItem
      ? `You can ask me anything. I also remember you have “${activeItem.title}” in progress if that’s what you want help with.`
      : 'Ask me anything. I can help with school, explain something, help you make something, or find a worthwhile next step.',
    actionLabel: activeItem ? 'Continue →' : 'Explore ideas →',
    contextual: Boolean(activeItem),
  }
}
