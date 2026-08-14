const STORAGE_KEYS = {
  intents:
    'careerGrowth.v04.intents',

  journey:
    'careerGrowth.v04.journey',
}


// ============================================================
// HELPERS
// ============================================================

const readArray = (key) => {
  try {
    const stored =
      localStorage.getItem(key)

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
      `Unable to read ${key}`,
      error
    )

    return []
  }
}


const writeArray = (
  key,
  values
) => {
  localStorage.setItem(
    key,
    JSON.stringify(values)
  )

  return values
}


// ============================================================
// GROWTH INTENTS
// ============================================================

export const getGrowthIntents =
  ({ childId } = {}) => {
    const intents =
      readArray(
        STORAGE_KEYS.intents
      )

    if (!childId) {
      return intents
    }

    return intents.filter(
      (intent) =>
        intent.childId ===
        childId
    )
  }


export const saveGrowthIntent =
  (intent) => {
    if (!intent) {
      return null
    }

    const current =
      readArray(
        STORAGE_KEYS.intents
      )

    const updated = [
      ...current.filter(
        (item) =>
          item.id !== intent.id
      ),

      intent,
    ]

    writeArray(
      STORAGE_KEYS.intents,
      updated
    )

    return intent
  }


export const saveGrowthIntents =
  (intents = []) => {
    intents.forEach(
      saveGrowthIntent
    )

    return intents
  }


// ============================================================
// JOURNEY
// ============================================================

export const getJourneyItems =
  ({ childId } = {}) => {
    const journey =
      readArray(
        STORAGE_KEYS.journey
      )

    if (!childId) {
      return journey
    }

    return journey.filter(
      (item) =>
        item.childId ===
        childId
    )
  }


export const saveJourneyItem =
  (journeyItem) => {
    if (!journeyItem) {
      return null
    }

    const current =
      readArray(
        STORAGE_KEYS.journey
      )

    const updated = [
      ...current.filter(
        (item) =>
          item.id !==
          journeyItem.id
      ),

      journeyItem,
    ]

    writeArray(
      STORAGE_KEYS.journey,
      updated
    )

    return journeyItem
  }


// ============================================================
// RESET V0.4 LOOP DATA
// ============================================================

export const clearGrowthLoopData =
  () => {
    localStorage.removeItem(
      STORAGE_KEYS.intents
    )

    localStorage.removeItem(
      STORAGE_KEYS.journey
    )
  }