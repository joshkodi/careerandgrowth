import { reasonWithModel } from './model/modelGateway'
import { interpretSchoolWorkText } from './schoolWorkPlanningEngine'
import { normalizeSchoolSubject } from './schoolLearningTaxonomy'

export const schoolWorkInterpretationSchemaV019 = Object.freeze({
  type: 'object',
  required: ['title', 'subject', 'activityType', 'requirements', 'learningNeeds', 'deliverable'],
  properties: {
    title: { type: 'string' },
    subject: { type: 'string' },
    activityType: { type: 'string' },
    topic: { type: 'string' },
    deliverable: { type: 'string' },
    dueDate: { type: 'string' },
    requirements: { type: 'array', items: { type: 'string' } },
    learningNeeds: { type: 'array', items: { type: 'string' } },
    suggestedTopics: { type: 'array', items: { type: 'string' } },
    clarificationQuestion: { type: 'string' },
  },
})

const clean = value => String(value || '').replace(/\s+/g, ' ').trim()
const list = value => Array.isArray(value) ? value.map(clean).filter(Boolean).slice(0, 10) : []
const sentenceCase = value => {
  const text = clean(value).replace(/[.!?]+$/, '')
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : ''
}

function inferDueDate(text = '') {
  const source = clean(text)
  const explicit = source.match(/\b(?:due|by)\s+(?:(?:this|next)\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i)
  if (explicit) return sentenceCase(explicit[0].replace(/^by\s+/i, ''))
  const date = source.match(/\b(?:due|by)\s+((?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)\b/i)
  return date ? sentenceCase(date[1]) : ''
}

function stripDueDate(text = '') {
  return clean(text)
    .replace(/\b(?:it\s+is|it's|it is)\s+due\s+(?:(?:this|next)\s+)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b[.!]?/ig, '')
    .replace(/\b(?:due|by)\s+(?:(?:this|next)\s+)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b[.!]?/ig, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function inferDeliverable(text = '', activityType = '') {
  const source = stripDueDate(text)
  const presentation = source.match(/(?:make|create|prepare|build)?\s*(?:a|an)?\s*(\d+[- ]slide\s+presentation)(?:\s+about\s+([^.,]+))?/i)
  if (presentation) return sentenceCase(`${presentation[1]}${presentation[2] ? ` about ${presentation[2]}` : ''}`)
  const deliverable = source.match(/(?:make|create|write|prepare|build|complete)\s+(?:a|an|the)?\s*([^.,]+?(?:presentation|poster|report|essay|model|video|timeline|worksheet|project))/i)
  if (deliverable) return sentenceCase(deliverable[0])
  if (activityType === 'project') return 'A completed project based on your assignment'
  return 'Your completed schoolwork'
}

function inferShortTitle(text = '', deliverable = '') {
  const source = clean(text)
  const topicMatch = source.match(/\b(?:about|on)\s+(?:one\s+)?([^.,]+?)(?=\s+(?:source|and|with|that|which|for)\b|[.,]|$)/i)
  const topic = clean(topicMatch?.[1])
  const type = /presentation/i.test(deliverable || source) ? 'Presentation'
    : /poster/i.test(deliverable || source) ? 'Poster'
      : /report/i.test(deliverable || source) ? 'Report'
        : /essay/i.test(deliverable || source) ? 'Essay'
          : /project/i.test(source) ? 'Project' : 'Schoolwork'
  if (topic && topic.length <= 44) return `${sentenceCase(topic)} ${type}`
  const renewable = /renewable energy/i.test(source) ? 'Renewable Energy' : ''
  return renewable ? `${renewable} ${type}` : type
}

function splitRequirements(text = '') {
  let source = stripDueDate(text)
  source = source
    .replace(/^i\s+(?:have|need)\s+to\s+(?:make|create|do|write|prepare|build)\s+/i, 'Create ')
    .replace(/^my\s+(?:assignment|project)\s+is\s+to\s+/i, '')

  const chunks = source
    .split(/[.;]\s*|,\s*(?=(?:and\s+)?(?:include|add|list|explain|describe|compare|show|use|cite|choose|create|make|write)\b)/i)
    .flatMap(part => part.split(/\s+and\s+(?=(?:include|add|list|explain|describe|compare|show|use|cite|choose|create|make|write)\b)/i))
    .map(sentenceCase)
    .filter(Boolean)

  return [...new Set(chunks)].slice(0, 8)
}

function fallbackFromText(text = '') {
  const base = interpretSchoolWorkText(text)
  const dueDate = inferDueDate(text)
  const deliverable = inferDeliverable(text, base.activityType)
  return {
    ...base,
    title: inferShortTitle(text, deliverable),
    dueDate,
    interpretationSource: 'deterministic_fallback',
    assignmentUnderstanding: {
      deliverable,
      requirements: splitRequirements(text),
      learningNeeds: [],
      suggestedTopics: [],
      clarificationQuestion: '',
    },
  }
}

function normalizeModelOutput(output = {}, text = '') {
  const fallback = fallbackFromText(text)
  const normalizedSubject = normalizeSchoolSubject({ subject: clean(output.subject) })
  const modelRequirements = list(output.requirements)
  const requirements = modelRequirements.length > 1 ? modelRequirements : fallback.assignmentUnderstanding.requirements
  const learningNeeds = list(output.learningNeeds)
  const suggestedTopics = list(output.suggestedTopics)
  const modelDeliverable = clean(output.deliverable)
  const genericDeliverable = /complete the (?:project|schoolwork).*assignment/i.test(modelDeliverable)
  const deliverable = !modelDeliverable || genericDeliverable ? fallback.assignmentUnderstanding.deliverable : sentenceCase(modelDeliverable)
  const modelTitle = clean(output.title)
  const title = !modelTitle || modelTitle.length > 54 ? inferShortTitle(text, deliverable) : modelTitle
  const dueDate = clean(output.dueDate) || fallback.dueDate

  return {
    ...fallback,
    title,
    subject: normalizedSubject.subject || fallback.subject,
    subjectId: normalizedSubject.subjectId || fallback.subjectId,
    activityType: clean(output.activityType) || fallback.activityType,
    topic: clean(output.topic),
    dueDate,
    interpretationSource: 'model',
    assignmentUnderstanding: {
      deliverable,
      requirements,
      learningNeeds,
      suggestedTopics,
      clarificationQuestion: clean(output.clarificationQuestion),
    },
    resumeContext: {
      ...fallback.resumeContext,
      summary: 'SynapStride read and organized this school work.',
    },
  }
}

export async function interpretSchoolWorkWithModelV019(text = '', { modelConfig = {} } = {}) {
  const description = clean(text)
  const fallback = fallbackFromText(description)
  if (!description) return { item: fallback, model: null }

  const context = {
    version: '0.19.1',
    role: 'school_work_assignment_interpreter',
    assignmentText: description,
    instructions: [
      'Interpret only what the assignment says or strongly implies.',
      'Do not invent teacher requirements, due dates, sources, slide counts, or grading criteria.',
      'Use short child-friendly phrases.',
      'title must be a short project name, ideally 2-6 words, never the full assignment sentence.',
      'deliverable must say exactly what the student is making, for example “A 6-slide presentation about renewable energy”.',
      'Break requirements into separate atomic items. Never return the whole assignment as one requirement.',
      'Keep dueDate separate from requirements.',
      'Identify concepts the student likely needs to learn to complete the work.',
      'Suggested topics must be relevant choices, not fabricated requirements.',
      'If an important detail is genuinely missing, put one short question in clarificationQuestion; otherwise use an empty string.',
      'activityType should be one of project, homework, test_quiz, study, or reading when possible.',
      'dueDate should be empty unless the assignment states one.',
      'Return one JSON object only with these keys: title, subject, activityType, topic, deliverable, dueDate, requirements, learningNeeds, suggestedTopics, clarificationQuestion.',
      'requirements, learningNeeds, and suggestedTopics must be arrays of short strings. Do not include markdown or commentary outside the JSON object.',
    ],
  }

  try {
    const result = await reasonWithModel({
      task: 'school_work_interpretation',
      context,
      outputSchema: schoolWorkInterpretationSchemaV019,
      fallbackOutput: {
        title: fallback.title,
        subject: fallback.subject || '',
        activityType: fallback.activityType,
        topic: '',
        deliverable: fallback.assignmentUnderstanding.deliverable,
        dueDate: fallback.dueDate,
        requirements: fallback.assignmentUnderstanding.requirements,
        learningNeeds: [],
        suggestedTopics: [],
        clarificationQuestion: '',
      },
    }, { timeoutMs: 30000, ...modelConfig })

    const isLive = Boolean(result.meta?.liveModel)
    return {
      item: isLive ? normalizeModelOutput(result.output, description) : fallback,
      model: result.meta,
    }
  } catch (error) {
    return {
      item: { ...fallback, interpretationError: error?.message || String(error) },
      model: null,
    }
  }
}

export default { interpretSchoolWorkWithModelV019, schoolWorkInterpretationSchemaV019 }
