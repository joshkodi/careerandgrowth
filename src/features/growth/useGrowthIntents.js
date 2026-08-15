// src/features/growth/useGrowthIntents.js

import {
  useState,
} from 'react'

import {
  createGrowthIntent,
  growthIntentActors,
  growthIntentTypes,
} from '../../intelligence/growthLoopModels'

import {
  getGrowthIntents,
  saveGrowthIntent,
} from '../../storage/growthLoopStorage'

import {
  getChildEvidenceId,
} from '../../utils/session'


// ============================================================
// Career & Growth — MVP v0.6
// Growth Intent Controller
//
// Owns:
// - Student Growth Intents
// - Parent Growth Goals
// - Intent restore
// - Intent persistence
// - Intent reset
//
// No recommendation or evidence behavior lives here.
// ============================================================

export default function useGrowthIntents({
  childProfile,
}) {
  const [
    studentGrowthIntents,
    setStudentGrowthIntents,
  ] = useState([])

  const [
    parentGrowthIntents,
    setParentGrowthIntents,
  ] = useState([])


  const restoreGrowthIntents =
    () => {
      if (
        !childProfile.name.trim()
      ) {
        setStudentGrowthIntents([])
        setParentGrowthIntents([])

        return
      }

      const childId =
        getChildEvidenceId(
          childProfile
        )

      const storedIntents =
        getGrowthIntents({
          childId,
        })

      setStudentGrowthIntents(
        storedIntents.filter(
          (intent) =>
            intent.actor ===
            growthIntentActors.STUDENT
        )
      )

      setParentGrowthIntents(
        storedIntents.filter(
          (intent) =>
            intent.actor ===
            growthIntentActors.PARENT
        )
      )
    }


  const handleSaveStudentIntent =
    (text) => {
      if (!text?.trim()) {
        return null
      }

      const childId =
        getChildEvidenceId(
          childProfile
        )

      const intent =
        createGrowthIntent({
          childId,

          actor:
            growthIntentActors.STUDENT,

          type:
            growthIntentTypes.OPEN_ENDED,

          text,

          source:
            'growth_home',
        })

      saveGrowthIntent(
        intent
      )

      setStudentGrowthIntents(
        (current) => [
          ...current,
          intent,
        ]
      )

      return intent
    }


  const handleSaveParentIntent =
    (text) => {
      if (!text?.trim()) {
        return null
      }

      const childId =
        getChildEvidenceId(
          childProfile
        )

      const intent =
        createGrowthIntent({
          childId,

          actor:
            growthIntentActors.PARENT,

          type:
            growthIntentTypes.GOAL,

          text,

          source:
            'parent_view',
        })

      saveGrowthIntent(
        intent
      )

      setParentGrowthIntents(
        (current) => [
          ...current,
          intent,
        ]
      )

      return intent
    }


  const resetGrowthIntents =
    () => {
      setStudentGrowthIntents([])
      setParentGrowthIntents([])
    }


  return {
    studentGrowthIntents,

    parentGrowthIntents,

    restoreGrowthIntents,

    handleSaveStudentIntent,

    handleSaveParentIntent,

    resetGrowthIntents,
  }
}
