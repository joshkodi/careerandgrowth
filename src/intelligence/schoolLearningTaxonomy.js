// src/intelligence/schoolLearningTaxonomy.js

// ============================================================
// SynapStride MVP v0.9 — School Learning Taxonomy
//
// Broad subject is controlled for consistency.
// Topic and notes remain free-form.
// ============================================================

export const schoolSubjectIds = Object.freeze({
  MATH: 'math',
  ENGLISH_LANGUAGE_ARTS: 'english_language_arts',
  SCIENCE: 'science',
  SOCIAL_STUDIES_HISTORY: 'social_studies_history',
  WORLD_LANGUAGES: 'world_languages',
  COMPUTER_SCIENCE_TECHNOLOGY: 'computer_science_technology',
  ENGINEERING_STEM: 'engineering_stem',
  ART: 'art',
  MUSIC: 'music',
  HEALTH: 'health',
  PHYSICAL_EDUCATION: 'physical_education',
  OTHER: 'other',
})

export const schoolSubjectOptions = Object.freeze([
  { id: schoolSubjectIds.MATH, label: 'Math', shortLabel: 'Math' },
  { id: schoolSubjectIds.ENGLISH_LANGUAGE_ARTS, label: 'English / Language Arts', shortLabel: 'English' },
  { id: schoolSubjectIds.SCIENCE, label: 'Science', shortLabel: 'Science' },
  { id: schoolSubjectIds.SOCIAL_STUDIES_HISTORY, label: 'Social Studies / History', shortLabel: 'History' },
  { id: schoolSubjectIds.WORLD_LANGUAGES, label: 'World Languages', shortLabel: 'Languages' },
  { id: schoolSubjectIds.COMPUTER_SCIENCE_TECHNOLOGY, label: 'Computer Science / Technology', shortLabel: 'Technology' },
  { id: schoolSubjectIds.ENGINEERING_STEM, label: 'Engineering / STEM', shortLabel: 'STEM' },
  { id: schoolSubjectIds.ART, label: 'Art', shortLabel: 'Art' },
  { id: schoolSubjectIds.MUSIC, label: 'Music', shortLabel: 'Music' },
  { id: schoolSubjectIds.HEALTH, label: 'Health', shortLabel: 'Health' },
  { id: schoolSubjectIds.PHYSICAL_EDUCATION, label: 'Physical Education', shortLabel: 'PE' },
  { id: schoolSubjectIds.OTHER, label: 'Other', shortLabel: 'Other' },
])

const subjectAliases = Object.freeze({
  mathematics: schoolSubjectIds.MATH,
  maths: schoolSubjectIds.MATH,
  math: schoolSubjectIds.MATH,
  algebra: schoolSubjectIds.MATH,
  geometry: schoolSubjectIds.MATH,

  english: schoolSubjectIds.ENGLISH_LANGUAGE_ARTS,
  ela: schoolSubjectIds.ENGLISH_LANGUAGE_ARTS,
  reading: schoolSubjectIds.ENGLISH_LANGUAGE_ARTS,
  writing: schoolSubjectIds.ENGLISH_LANGUAGE_ARTS,
  grammar: schoolSubjectIds.ENGLISH_LANGUAGE_ARTS,
  'language arts': schoolSubjectIds.ENGLISH_LANGUAGE_ARTS,

  science: schoolSubjectIds.SCIENCE,
  biology: schoolSubjectIds.SCIENCE,
  chemistry: schoolSubjectIds.SCIENCE,
  physics: schoolSubjectIds.SCIENCE,
  'earth science': schoolSubjectIds.SCIENCE,

  history: schoolSubjectIds.SOCIAL_STUDIES_HISTORY,
  'social studies': schoolSubjectIds.SOCIAL_STUDIES_HISTORY,
  civics: schoolSubjectIds.SOCIAL_STUDIES_HISTORY,
  geography: schoolSubjectIds.SOCIAL_STUDIES_HISTORY,

  spanish: schoolSubjectIds.WORLD_LANGUAGES,
  french: schoolSubjectIds.WORLD_LANGUAGES,
  mandarin: schoolSubjectIds.WORLD_LANGUAGES,
  language: schoolSubjectIds.WORLD_LANGUAGES,
  languages: schoolSubjectIds.WORLD_LANGUAGES,

  coding: schoolSubjectIds.COMPUTER_SCIENCE_TECHNOLOGY,
  programming: schoolSubjectIds.COMPUTER_SCIENCE_TECHNOLOGY,
  'computer science': schoolSubjectIds.COMPUTER_SCIENCE_TECHNOLOGY,
  technology: schoolSubjectIds.COMPUTER_SCIENCE_TECHNOLOGY,

  engineering: schoolSubjectIds.ENGINEERING_STEM,
  stem: schoolSubjectIds.ENGINEERING_STEM,
  robotics: schoolSubjectIds.ENGINEERING_STEM,

  art: schoolSubjectIds.ART,
  'visual art': schoolSubjectIds.ART,

  music: schoolSubjectIds.MUSIC,
  band: schoolSubjectIds.MUSIC,
  orchestra: schoolSubjectIds.MUSIC,

  health: schoolSubjectIds.HEALTH,
  wellness: schoolSubjectIds.HEALTH,

  pe: schoolSubjectIds.PHYSICAL_EDUCATION,
  'physical education': schoolSubjectIds.PHYSICAL_EDUCATION,
  fitness: schoolSubjectIds.PHYSICAL_EDUCATION,
})

const normalize = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[&/]/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const getSchoolSubjectById =
  (subjectId) =>
    schoolSubjectOptions.find(
      (subject) => subject.id === subjectId
    ) || null

export const resolveSchoolSubjectId =
  (value = '') => {
    const normalized = normalize(value)

    if (!normalized) return ''

    const direct =
      schoolSubjectOptions.find(
        (subject) =>
          normalize(subject.label) === normalized ||
          normalize(subject.shortLabel) === normalized
      )

    if (direct) return direct.id

    const alias =
      Object.entries(subjectAliases)
        .find(([term]) =>
          normalized === term ||
          normalized.includes(term)
        )

    return alias?.[1] || schoolSubjectIds.OTHER
  }

export const normalizeSchoolSubject =
  ({
    subject = '',
    subjectId = '',
    customSubject = '',
  } = {}) => {
    const resolvedId =
      subjectId ||
      resolveSchoolSubjectId(subject)

    if (!resolvedId) {
      return {
        subjectId: '',
        subject: '',
        customSubject: '',
      }
    }

    if (resolvedId === schoolSubjectIds.OTHER) {
      const custom =
        String(
          customSubject ||
          subject ||
          ''
        ).trim()

      return {
        subjectId: schoolSubjectIds.OTHER,
        subject: custom,
        customSubject: custom,
      }
    }

    const option =
      getSchoolSubjectById(resolvedId)

    return {
      subjectId: option?.id || resolvedId,
      subject: option?.label || subject,
      customSubject: '',
    }
  }

export default {
  schoolSubjectIds,
  schoolSubjectOptions,
  getSchoolSubjectById,
  resolveSchoolSubjectId,
  normalizeSchoolSubject,
}
