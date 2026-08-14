// ============================================================
// Career & Growth
// MVP v0.4
//
// Journey Storage
//
// Local-only persistence for MVP v0.4.
//
// Later this interface can be backed by the API/database
// without requiring Journey UI components to understand
// persistence details.
// ============================================================


const JOURNEY_STORAGE_KEY =
  'career_growth_journey_v1'


// ============================================================
// READ ALL
// ============================================================

export function getAllJourneyItems() {
  try {
    const stored =
      localStorage.getItem(
        JOURNEY_STORAGE_KEY
      )

    if (!stored) {
      return []
    }

    const parsed =
      JSON.parse(stored)

    return Array.isArray(parsed)
      ? parsed
      : []
  } catch (error) {
    console.error(
      'Unable to read Journey storage.',
      error
    )

    return []
  }
}


// ============================================================
// GET JOURNEY FOR CHILD
// ============================================================

export function getJourneyItems({
  childId,
} = {}) {
  const items =
    getAllJourneyItems()

  if (!childId) {
    return items
  }

  return items.filter(
    (item) =>
      item.childId === childId
  )
}


// ============================================================
// GET ONE JOURNEY ITEM
// ============================================================

export function getJourneyItem(
  journeyId
) {
  if (!journeyId) {
    return null
  }

  return (
    getAllJourneyItems().find(
      (item) =>
        item.id === journeyId
    ) || null
  )
}


// ============================================================
// SAVE JOURNEY ITEM
// ============================================================

export function saveJourneyItem(
  journeyItem
) {
  if (!journeyItem?.id) {
    return null
  }

  const items =
    getAllJourneyItems()

  const existingIndex =
    items.findIndex(
      (item) =>
        item.id ===
        journeyItem.id
    )

  let updatedItems

  if (existingIndex >= 0) {
    updatedItems = [
      ...items,
    ]

    updatedItems[
      existingIndex
    ] = journeyItem
  } else {
    updatedItems = [
      ...items,
      journeyItem,
    ]
  }

  localStorage.setItem(
    JOURNEY_STORAGE_KEY,
    JSON.stringify(
      updatedItems
    )
  )

  return journeyItem
}


// ============================================================
// CHECK WHETHER EXPERIENCE IS ALREADY ACTIVE
// ============================================================

export function findJourneyByExperience({
  childId,
  experienceId,
}) {
  if (
    !childId ||
    !experienceId
  ) {
    return null
  }

  return (
    getJourneyItems({
      childId,
    }).find(
      (item) =>
        item.experienceId ===
        experienceId &&
        item.status !==
          'completed'
    ) || null
  )
}


// ============================================================
// DELETE JOURNEY ITEM
// ============================================================

export function deleteJourneyItem(
  journeyId
) {
  const items =
    getAllJourneyItems()

  const updatedItems =
    items.filter(
      (item) =>
        item.id !== journeyId
    )

  localStorage.setItem(
    JOURNEY_STORAGE_KEY,
    JSON.stringify(
      updatedItems
    )
  )
}


// ============================================================
// CLEAR JOURNEY STORAGE
// ============================================================

export function clearJourneyItems() {
  localStorage.removeItem(
    JOURNEY_STORAGE_KEY
  )
}