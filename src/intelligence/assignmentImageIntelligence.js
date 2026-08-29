// src/intelligence/assignmentImageIntelligence.js
//
// SynapStride MVP v0.9 — Assignment Image Intelligence contract
//
// Frontend contract:
// file/image -> structured assignment candidates -> review -> save
//
// Real extraction is used when VITE_ASSIGNMENT_EXTRACTION_ENDPOINT is set.
// The endpoint should accept JSON:
// {
//   fileName,
//   mimeType,
//   imageDataUrl
// }
//
// and return either:
// { assignments: [...] }
// or a single assignment object.
//
// This module deliberately keeps provider/model details outside the UI.

const EXTRACTION_ENDPOINT =
  import.meta.env.VITE_ASSIGNMENT_EXTRACTION_ENDPOINT || ''

const DEFAULT_ASSIGNMENT = {
  title: '',
  activityType: 'homework',
  source: 'school',
  subject: '',
  topic: '',
  description: '',
  dueDate: '',
  estimatedTime: '',
  teacher: '',
  className: '',
  tasks: [],
  confidence: {},
}

const normalizeDate = (value) => {
  if (!value) {
    return ''
  }

  const raw = String(value).trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw
  }

  const parsed = new Date(raw)

  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const normalizeAssignment = (assignment = {}, index = 0) => ({
  ...DEFAULT_ASSIGNMENT,
  ...assignment,
  id:
    assignment.id ||
    `assignment_candidate_${Date.now()}_${index}`,
  title:
    String(
      assignment.title ||
      assignment.assignmentTitle ||
      ''
    ).trim(),
  activityType:
    assignment.activityType ||
    assignment.type ||
    'homework',
  source:
    assignment.source ||
    'school',
  subject:
    String(
      assignment.subject || ''
    ).trim(),
  topic:
    String(
      assignment.topic || ''
    ).trim(),
  description:
    String(
      assignment.description ||
      assignment.instructions ||
      ''
    ).trim(),
  dueDate:
    normalizeDate(
      assignment.dueDate ||
      assignment.due_date
    ),
  estimatedTime:
    String(
      assignment.estimatedTime ||
      assignment.estimated_time ||
      ''
    ).trim(),
  teacher:
    String(
      assignment.teacher || ''
    ).trim(),
  className:
    String(
      assignment.className ||
      assignment.class_name ||
      ''
    ).trim(),
  tasks:
    Array.isArray(assignment.tasks)
      ? assignment.tasks
      : [],
  confidence:
    assignment.confidence &&
    typeof assignment.confidence === 'object'
      ? assignment.confidence
      : {},
})

export const fileToDataUrl =
  (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () =>
        resolve(reader.result)

      reader.onerror = () =>
        reject(
          new Error(
            'Unable to read the assignment image.'
          )
        )

      reader.readAsDataURL(file)
    })

const buildFallbackCandidate =
  (file) => ({
    ...DEFAULT_ASSIGNMENT,
    id:
      `assignment_candidate_${Date.now()}`,
    title:
      file?.name
        ?.replace(/\.[^.]+$/, '')
        ?.replaceAll('_', ' ')
        ?.replaceAll('-', ' ') ||
      'New assignment',
    extractionMode: 'review_only',
  })

export async function extractAssignmentsFromImage(
  file
) {
  if (!file) {
    throw new Error(
      'No assignment image was provided.'
    )
  }

  const imageDataUrl =
    await fileToDataUrl(file)

  if (!EXTRACTION_ENDPOINT) {
    return {
      mode: 'review_only',
      message:
        'Assignment extraction backend is not configured yet. Review and fill the fields before saving.',
      assignments: [
        buildFallbackCandidate(file),
      ],
    }
  }

  const response =
    await fetch(
      EXTRACTION_ENDPOINT,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify({
            fileName:
              file.name,
            mimeType:
              file.type,
            imageDataUrl,
          }),
      }
    )

  if (!response.ok) {
    throw new Error(
      `Assignment extraction failed (${response.status}).`
    )
  }

  const payload =
    await response.json()

  const rawAssignments =
    Array.isArray(payload)
      ? payload
      : Array.isArray(payload.assignments)
        ? payload.assignments
        : [payload]

  const assignments =
    rawAssignments
      .map(normalizeAssignment)
      .filter(
        (assignment) =>
          assignment.title ||
          assignment.subject ||
          assignment.description ||
          assignment.dueDate
      )

  if (!assignments.length) {
    return {
      mode: 'review_only',
      message:
        'No structured assignment details were detected. Please review the image and enter the details manually.',
      assignments: [
        buildFallbackCandidate(file),
      ],
    }
  }

  return {
    mode: 'extracted',
    message:
      assignments.length > 1
        ? `We found ${assignments.length} assignments. Review each one before adding.`
        : 'We found one assignment. Review the details before adding.',
    assignments,
  }
}
