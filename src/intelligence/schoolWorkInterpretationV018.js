import { reasonWithModel } from './model/modelGateway'
import { interpretSchoolWorkText } from './schoolWorkPlanningEngine'
import { normalizeSchoolSubject } from './schoolLearningTaxonomy'

export const schoolWorkInterpretationSchemaV018 = Object.freeze({
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

const clean = value => String(value || '').trim()
const list = value => Array.isArray(value) ? value.map(clean).filter(Boolean).slice(0, 8) : []

function fallbackFromText(text = '') {
  const base = interpretSchoolWorkText(text)
  return {
    ...base,
    interpretationSource: 'deterministic_fallback',
    assignmentUnderstanding: {
      deliverable: base.activityType === 'project' ? 'Complete the project described in the assignment.' : 'Complete the schoolwork described in the assignment.',
      requirements: clean(text) ? [clean(text)] : [],
      learningNeeds: [],
      suggestedTopics: [],
      clarificationQuestion: '',
    },
  }
}

function normalizeModelOutput(output = {}, text = '') {
  const base = interpretSchoolWorkText(text)
  const normalizedSubject = normalizeSchoolSubject({ subject: clean(output.subject) })
  const requirements = list(output.requirements)
  const learningNeeds = list(output.learningNeeds)
  const suggestedTopics = list(output.suggestedTopics)

  return {
    ...base,
    title: clean(output.title) || base.title,
    subject: normalizedSubject.subject || base.subject,
    subjectId: normalizedSubject.subjectId || base.subjectId,
    activityType: clean(output.activityType) || base.activityType,
    topic: clean(output.topic),
    dueDate: clean(output.dueDate),
    interpretationSource: 'model',
    assignmentUnderstanding: {
      deliverable: clean(output.deliverable),
      requirements,
      learningNeeds,
      suggestedTopics,
      clarificationQuestion: clean(output.clarificationQuestion),
    },
    resumeContext: {
      ...base.resumeContext,
      summary: 'SynapStride read and organized this school work.',
    },
  }
}

export async function interpretSchoolWorkWithModelV018(text = '', { modelConfig = {} } = {}) {
  const description = clean(text)
  const fallback = fallbackFromText(description)
  if (!description) return { item: fallback, model: null }

  const context = {
    version: '0.18.0',
    role: 'school_work_assignment_interpreter',
    assignmentText: description,
    instructions: [
      'Interpret only what the assignment says or strongly implies.',
      'Do not invent teacher requirements, due dates, sources, slide counts, or grading criteria.',
      'Use short child-friendly phrases.',
      'Identify the concrete deliverable and explicit requirements.',
      'Identify concepts the student likely needs to learn to complete the work.',
      'Suggested topics must be relevant choices, not fabricated requirements.',
      'If an important detail is genuinely missing, put one short question in clarificationQuestion; otherwise use an empty string.',
      'activityType should be one of project, homework, test_quiz, study, or reading when possible.',
      'dueDate should be empty unless the assignment states one.',
    ],
  }

  try {
    const result = await reasonWithModel({
      task: 'school_work_interpretation',
      context,
      outputSchema: schoolWorkInterpretationSchemaV018,
      fallbackOutput: {
        title: fallback.title,
        subject: fallback.subject || '',
        activityType: fallback.activityType,
        topic: '',
        deliverable: fallback.assignmentUnderstanding.deliverable,
        dueDate: '',
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

export default { interpretSchoolWorkWithModelV018, schoolWorkInterpretationSchemaV018 }
