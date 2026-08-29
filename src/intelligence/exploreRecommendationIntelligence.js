// SynapStride MVP v0.10.4 — inspectable Explore recommendation intelligence.
// Deterministic by design: every score is traceable to a child signal.

const POSITIVE_ENJOYMENT = new Set(['loved_it', 'liked_it'])

const textOf = (item = {}) => [
  item.id,
  item.title,
  item.description,
  item.intro,
  ...(item.tags || []),
  ...(item.skills || []),
  ...(item.domains || []),
].filter(Boolean).join(' ').toLowerCase()

const words = (value = '') => String(value).toLowerCase().match(/[a-z0-9]+/g) || []

const overlap = (candidate, values = []) => {
  const haystack = new Set(words(textOf(candidate)))
  return values.reduce((count, value) =>
    count + words(value).filter((word) => word.length > 3 && haystack.has(word)).length, 0)
}

const activityIsPositive = (activity = {}) =>
  POSITIVE_ENJOYMENT.has(activity.reflection?.enjoyment) ||
  activity.reflection?.wouldDoAgain === true ||
  activity.reflection?.wouldDoAgain === 'yes'

const activityWeight = (activity = {}) => {
  if (activityIsPositive(activity)) return 8
  if (['attended', 'completed'].includes(activity.status)) return 6
  if (activity.status === 'scheduled') return 4
  if (activity.status === 'saved') return 2
  return 1
}

const candidateMatchesActivity = (candidate, activity) => {
  const ids = [activity.opportunityId, activity.experienceId, activity.metadata?.experienceId]
    .filter(Boolean)
  if (ids.includes(candidate.id)) return true
  const related = activity.relatedExperienceIds || activity.metadata?.relatedExperienceIds || []
  return related.includes(candidate.id)
}

const fallbackReason = ({ candidate, positiveActivity, completed }) => {
  if (positiveActivity) {
    return `You enjoyed ${positiveActivity.title || 'something related'} — this is a way to keep building on that interest.`
  }
  if (completed) {
    return 'You have tried something in this area before, so this can help you take the next step.'
  }
  return candidate.reasons?.[0] || 'This matches clues SynapStride has learned from what you have explored so far.'
}

export function buildExploreRecommendationIntelligence({
  candidates = [],
  recommendations = [],
  completedExplorationIds = [],
  growthActivities = [],
  growthProfile = null,
  feedback = {},
} = {}) {
  const recommendationRank = new Map(
    recommendations.map((item, index) => [item.id, Math.max(1, 8 - index * 2)])
  )
  const completed = new Set(completedExplorationIds)
  const profileTerms = [
    ...(growthProfile?.topTraits || []),
    ...(growthProfile?.topDomains || []),
    ...(growthProfile?.traits || []),
    ...(growthProfile?.domains || []),
  ].map((item) => item?.label || item?.id || item).filter(Boolean)

  const scored = candidates
    .filter((item) => item?.id)
    .map((candidate) => {
      const matchingActivities = growthActivities.filter((activity) =>
        candidateMatchesActivity(candidate, activity)
      )
      const positiveActivity = matchingActivities.find(activityIsPositive) || null
      const isCompleted = completed.has(candidate.id)
      const rec = recommendations.find((item) => item.id === candidate.id)
      const reasons = []
      let score = 0

      if (recommendationRank.has(candidate.id)) {
        score += recommendationRank.get(candidate.id)
        reasons.push(rec?.reasons?.[0] || 'Matches your Discover and growth signals.')
      }

      const profileMatch = overlap(candidate, profileTerms)
      if (profileMatch > 0) {
        score += Math.min(profileMatch * 2, 6)
        reasons.push('Connects with interests or strengths showing up in your profile.')
      }

      matchingActivities.forEach((activity) => {
        score += activityWeight(activity)
      })

      if (positiveActivity) {
        reasons.unshift(
          `You ${positiveActivity.reflection?.enjoyment === 'loved_it' ? 'loved' : 'liked'} ${positiveActivity.title || 'a related activity'}.`
        )
      } else if (isCompleted) {
        score += 5
        reasons.push('Builds on an experience you already tried.')
      }

      if (feedback[candidate.id] === 'different') {
        score -= 20
        reasons.push('You asked for something different, so this has been moved down for now.')
      }

      return {
        ...candidate,
        ...(rec || {}),
        intelligence: {
          score,
          confidence: score >= 12 ? 'Strong match' : score >= 6 ? 'Good match' : 'Worth exploring',
          reasons: reasons.filter(Boolean).slice(0, 3),
          positiveActivity,
          completed: isCompleted,
          signalCount: reasons.filter(Boolean).length,
        },
        reasons: reasons.length ? reasons : [fallbackReason({ candidate, positiveActivity, completed: isCompleted })],
      }
    })
    .sort((a, b) => b.intelligence.score - a.intelligence.score || a.title.localeCompare(b.title))

  const pickedForYou = scored.filter((item) => feedback[item.id] !== 'different').slice(0, 2)
  const continueGrowing = scored.filter((item) =>
    item.intelligence.completed || item.intelligence.positiveActivity ||
    growthActivities.some((activity) => candidateMatchesActivity(item, activity))
  ).slice(0, 2)

  const used = new Set([...pickedForYou, ...continueGrowing].map((item) => item.id))
  const trySomethingDifferent = scored
    .filter((item) => !used.has(item.id) && feedback[item.id] !== 'different')
    .sort((a, b) => {
      const aDifferent = feedback[a.id] === 'different' ? -1 : 0
      const bDifferent = feedback[b.id] === 'different' ? -1 : 0
      return aDifferent - bDifferent || a.intelligence.score - b.intelligence.score
    })
    .slice(0, 3)

  return {
    pickedForYou,
    continueGrowing,
    trySomethingDifferent,
    ranked: scored,
    summary: {
      candidateCount: scored.length,
      activitySignals: growthActivities.length,
      profileSignals: profileTerms.length,
    },
  }
}
