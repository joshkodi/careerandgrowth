// src/intelligence/assignmentLearningContext.js

import {
  normalizeSchoolSubject,
  resolveSchoolSubjectId,
} from './schoolLearningTaxonomy'

const unique = (values = []) =>
  [...new Set(values.filter(Boolean))]

const normalize = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tokenize = (value = '') =>
  normalize(value)
    .split(' ')
    .filter(
      (token) =>
        token.length >= 3 &&
        ![
          'the', 'and', 'for', 'with', 'this', 'that',
          'from', 'your', 'into', 'show', 'work',
          'assignment', 'homework', 'page', 'pages',
        ].includes(token)
    )

const taskText = (tasks = []) =>
  tasks
    .map((task) =>
      typeof task === 'string'
        ? task
        : task?.label ||
          task?.text ||
          ''
    )
    .filter(Boolean)
    .join(' ')

const inferSkillTerms = (text = '') => {
  const normalized = normalize(text)

  const rules = [
    ['unlike denominators', ['fractions', 'common denominator', 'unlike denominators']],
    ['common denominator', ['fractions', 'common denominator']],
    ['simplify fractions', ['fractions', 'simplify fractions']],
    ['fraction', ['fractions']],
    ['decimal', ['decimals']],
    ['percent', ['percentages']],
    ['equation', ['equations']],
    ['algebra', ['algebra']],
    ['geometry', ['geometry']],
    ['area', ['area']],
    ['perimeter', ['perimeter']],
    ['ratio', ['ratios']],
    ['proportion', ['proportions']],
    ['grammar', ['grammar']],
    ['vocabulary', ['vocabulary']],
    ['main idea', ['reading comprehension', 'main idea']],
    ['compare and contrast', ['reading comprehension', 'compare and contrast']],
    ['compare', ['compare and contrast']],
    ['essay', ['writing', 'essay writing']],
    ['paragraph', ['writing']],
    ['cell', ['cells', 'cell structure']],
    ['photosynthesis', ['photosynthesis']],
    ['force', ['forces and motion']],
    ['motion', ['forces and motion']],
    ['matter', ['states of matter']],
    ['ecosystem', ['ecosystems']],
    ['revolution', ['revolutions']],
    ['civil war', ['civil war']],
    ['constitution', ['civics', 'constitution']],
    ['geography', ['geography']],
    ['verb', ['grammar', 'verbs']],
    ['coding', ['coding']],
    ['programming', ['programming']],
    ['robot', ['robotics']],
  ]

  return unique(
    rules.flatMap(
      ([phrase, terms]) =>
        normalized.includes(phrase)
          ? terms
          : []
    )
  )
}

const inferGradeFromAge = (age) => {
  const numericAge = Number(age)

  if (!Number.isFinite(numericAge)) {
    return null
  }

  const grade = Math.max(
    0,
    Math.min(12, Math.round(numericAge - 5))
  )

  return grade
}

export const buildAssignmentLearningContext =
  ({
    journeyItem = {},
    childProfile = null,
    helpMode = '',
    learningIntent = '',
    studentNote = '',
  } = {}) => {
    const subject =
      normalizeSchoolSubject({
        subject:
          journeyItem.subject || '',
        subjectId:
          journeyItem.subjectId || '',
        customSubject:
          journeyItem.customSubject || '',
      })

    const tasks =
      Array.isArray(journeyItem.tasks)
        ? journeyItem.tasks
        : []

    const instructions =
      String(
        journeyItem.description ||
        journeyItem.instructions ||
        ''
      ).trim()

    const topic =
      String(journeyItem.topic || '').trim()

    const title =
      String(journeyItem.title || '').trim()

    const combinedContext =
      [
        title,
        topic,
        instructions,
        taskText(tasks),
        studentNote,
      ]
        .filter(Boolean)
        .join(' ')

    const keywords =
      unique([
        ...tokenize(topic),
        ...tokenize(instructions),
        ...tokenize(taskText(tasks)),
        ...tokenize(studentNote),
      ]).slice(0, 24)

    const skills =
      inferSkillTerms(combinedContext)

    return {
      version: '0.9.20',
      subjectId:
        subject.subjectId ||
        resolveSchoolSubjectId(
          journeyItem.subject || ''
        ) ||
        null,
      subject:
        subject.subject ||
        journeyItem.subject ||
        null,
      topic: topic || null,
      notes: instructions || null,
      taskText:
        taskText(tasks) || null,
      tasks,
      title: title || null,
      skills,
      keywords,
      grade:
        childProfile?.grade ??
        journeyItem.grade ??
        inferGradeFromAge(
          childProfile?.age
        ),
      age:
        childProfile?.age ??
        journeyItem.age ??
        null,
      helpMode:
        helpMode || null,
      learningIntent:
        learningIntent || null,
      studentNote:
        String(studentNote || '').trim() || null,
      contextSources:
        unique([
          title ? 'title' : null,
          topic ? 'topic' : null,
          instructions ? 'notes_instructions' : null,
          tasks.length ? 'tasks' : null,
          journeyItem.attachments?.length
            ? 'attachments'
            : null,
          studentNote ? 'child_help_note' : null,
        ]),
    }
  }

export default {
  buildAssignmentLearningContext,
}
