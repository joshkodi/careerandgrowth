import {
  journeyPaths,
  journeyStatuses,
  normalizeJourneyItems,
} from './unifiedJourneyModels'

const updatedTime = (item = {}) =>
  new Date(item.updatedAt || item.startedAt || item.createdAt || 0).getTime()

const itemKind = (item = {}) => {
  if (item.path === journeyPaths.SCHOOL_LEARNING) return 'School'
  if (item.path === journeyPaths.ACTIVITIES_INTERESTS) return 'Activity'
  return 'Project'
}

const nextStepFor = (item = {}) =>
  item.nextStep ||
  item.resumeContext?.nextAction ||
  item.currentTask ||
  item.nextAction ||
  (item.status === journeyStatuses.NEED_HELP ? 'Get some help and keep going' : null) ||
  'Pick up where you left off'

export const buildCompanionHomeContext = ({
  journeyItems = [],
  needsAttention = null,
  recommendedItem = null,
} = {}) => {
  const normalized = normalizeJourneyItems(journeyItems)
  const active = normalized
    .filter((item) => item.status !== journeyStatuses.COMPLETED)
    .sort((a, b) => updatedTime(b) - updatedTime(a))

  const attentionItem = needsAttention?.item || needsAttention || null
  const resumeItem = attentionItem || active[0] || null

  return {
    activeItems: active,
    resume: resumeItem
      ? {
          item: resumeItem,
          title: resumeItem.title || 'Keep going',
          kind: itemKind(resumeItem),
          nextStep: nextStepFor(resumeItem),
          needsHelp: resumeItem.status === journeyStatuses.NEED_HELP,
        }
      : null,
    recommendation: recommendedItem || null,
  }
}
