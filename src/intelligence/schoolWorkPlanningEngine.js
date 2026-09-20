import { journeyActivityTypes } from './unifiedJourneyModels'
import { normalizeSchoolSubject } from './schoolLearningTaxonomy'

const clean = (value = '') => String(value || '').trim()
const lower = (value = '') => clean(value).toLowerCase()

const inferType = (text = '') => {
  const value = lower(text)
  if (/(project|presentation|slides|poster|report|research)/.test(value)) return journeyActivityTypes.PROJECT
  if (/(quiz|test|exam)/.test(value)) return journeyActivityTypes.TEST_QUIZ
  if (/(read|chapter|book)/.test(value)) return journeyActivityTypes.READING
  if (/(study|review|prepare)/.test(value)) return journeyActivityTypes.STUDY
  return journeyActivityTypes.HOMEWORK
}

const inferSubject = (text = '') => {
  const value = lower(text)
  const rules = [
    ['Math', /(math|fraction|decimal|percent|equation|algebra|geometry|ratio)/],
    ['Science', /(science|solar|energy|ecosystem|cell|photosynthesis|force|motion|matter|planet|space)/],
    ['English / Language Arts', /(english|ela|essay|writing|reading|vocabulary|grammar|novel|book report)/],
    ['Social Studies', /(history|social studies|geography|civics|constitution|revolution|civil war)/],
    ['Computer Science / Technology', /(coding|computer|programming|scratch|robot|technology)/],
  ]
  const match = rules.find(([, pattern]) => pattern.test(value))
  return normalizeSchoolSubject({ subject: match?.[0] || '' })
}

const titleFromText = (text = '') => {
  const firstLine = clean(text).split(/\n+/)[0]
  if (!firstLine) return 'School work'
  return firstLine.length > 72 ? `${firstLine.slice(0, 69)}…` : firstLine
}

const planFor = (activityType, title) => {
  if (activityType === journeyActivityTypes.PROJECT) {
    return [
      'Understand what you need to do',
      'Choose your focus',
      'Learn or research the important parts',
      'Create your project',
      'Check and finish it',
    ]
  }
  if (activityType === journeyActivityTypes.TEST_QUIZ || activityType === journeyActivityTypes.STUDY) {
    return ['See what you need to know', 'Review the tricky parts', 'Practice', 'Do a quick final check']
  }
  if (activityType === journeyActivityTypes.READING) {
    return ['See what you need to read', 'Read the next part', 'Capture the important ideas', 'Finish and check your work']
  }
  return [`Understand ${title || 'the assignment'}`, 'Work through it', 'Check your answers', 'Finish it']
}

export const interpretSchoolWorkText = (text = '') => {
  const description = clean(text)
  const activityType = inferType(description)
  const subject = inferSubject(description)
  const title = titleFromText(description)
  const steps = planFor(activityType, title).map((label, index) => ({
    id: `step_${index + 1}`,
    label,
    status: index === 0 ? 'current' : 'upcoming',
  }))

  return {
    title,
    description,
    activityType,
    ...subject,
    topic: '',
    dueDate: '',
    estimatedTime: '',
    tasks: steps,
    workPlan: {
      version: '0.15.0',
      steps,
      currentStepId: steps[0]?.id || null,
      nextStep: steps[0]?.label || null,
    },
    resumeContext: {
      summary: 'You just added this school work.',
      nextAction: steps[0]?.label || 'Get started',
    },
    intakeMode: 'tell',
  }
}

export const buildSchoolWorkPlan = (item = {}) => {
  if (item.workPlan?.steps?.length) return item.workPlan
  const steps = planFor(item.activityType, item.title).map((label, index) => ({
    id: `step_${index + 1}`,
    label,
    status: index === 0 ? 'current' : 'upcoming',
  }))
  return { version: '0.15.0', steps, currentStepId: steps[0]?.id || null, nextStep: steps[0]?.label || null }
}

export default { interpretSchoolWorkText, buildSchoolWorkPlan }
