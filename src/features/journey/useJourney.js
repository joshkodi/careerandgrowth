// src/features/journey/useJourney.js

import {
  useState,
} from 'react'

import {
  evidenceSourceTypes,
} from '../../data/growthTaxonomy'

import {
  createEvidenceEvent,
} from '../../intelligence/evidenceEngine'

import {
  getEnjoymentEvidence,
  getCompletionEvidence,
} from '../../intelligence/legacyEvidenceAdapter'

import {
  createJourneyItem,
  journeyOrigins,
  updateJourneyProgress,
  completeJourneyWithReflection,
} from '../../intelligence/journeyModels'

import {
  findJourneyByExperience,
  getJourneyItems,
  saveJourneyItem,
} from '../../storage/journeyStorage'

import {
  createSessionId,
  getChildEvidenceId,
} from '../../utils/session'

import {
  getGrowExperience,
} from '../../data/growExperiences'


// ============================================================
// Career & Growth — MVP v0.6
// Journey / Grow Controller
//
// Pure extraction from App.jsx.
// No intended UI, evidence, scoring, or storage changes.
// ============================================================

export default function useJourney({
  childProfile,
  setScreen,
  persistGrowthEvidence,
  onStudentIntent,
}) {
  const [
    journeyItems,
    setJourneyItems,
  ] = useState([])

  const [
    completedJourneyInsight,
    setCompletedJourneyInsight,
  ] = useState(null)


  const restoreJourney =
    () => {
      if (
        !childProfile.name.trim()
      ) {
        setJourneyItems([])
        return
      }

      const childId =
        getChildEvidenceId(
          childProfile
        )

      setJourneyItems(
        getJourneyItems({
          childId,
        })
      )
    }


  const handleStartGrow =
    (recommendation) => {
      if (
        !recommendation
          ?.experienceId
      ) {
        return null
      }

      const childId =
        getChildEvidenceId(
          childProfile
        )

      const existingJourney =
        findJourneyByExperience({
          childId,

          experienceId:
            recommendation
              .experienceId,
        })

      if (existingJourney) {
        setScreen('journey')

        return existingJourney
      }

      const experience =
        getGrowExperience(
          recommendation
            .experienceId
        )

      const journeyItem =
        createJourneyItem({
          childId,

          experienceId:
            recommendation
              .experienceId,

          title:
            experience?.title ||
            recommendation.title,

          emoji:
            experience?.emoji ||
            recommendation.emoji ||
            '🌱',

          description:
            experience?.description ||
            '',

          origin:
            journeyOrigins
              .RECOMMENDATION,

          recommendation,
        })

      saveJourneyItem(
        journeyItem
      )

      setJourneyItems(
        (current) => [
          ...current,
          journeyItem,
        ]
      )

      console.group(
        '🛤️ Journey v1'
      )

      console.log(
        'Started Grow:',
        journeyItem
      )

      console.groupEnd()

      setScreen('journey')

      return journeyItem
    }


  const goToJourney = () => {
    setScreen('journey')
  }


  const handleJourneyProgress =
    (
      journeyId,
      percent
    ) => {
      const currentItem =
        journeyItems.find(
          (item) =>
            item.id ===
            journeyId
        )

      if (!currentItem) {
        return null
      }

      const updatedItem =
        updateJourneyProgress(
          currentItem,
          percent
        )

      saveJourneyItem(
        updatedItem
      )

      setJourneyItems(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              updatedItem.id
                ? updatedItem
                : item
          )
      )

      return updatedItem
    }


  const handleCompleteJourney =
    (
      journeyId,
      reflection
    ) => {
      const currentItem =
        journeyItems.find(
          (item) =>
            item.id ===
            journeyId
        )

      if (!currentItem) {
        return null
      }

      const completedItem =
        completeJourneyWithReflection(
          currentItem,
          reflection
        )

      saveJourneyItem(
        completedItem
      )

      setJourneyItems(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              completedItem.id
                ? completedItem
                : item
          )
      )

      const childId =
        getChildEvidenceId(
          childProfile
        )

      const experience =
        getGrowExperience(
          completedItem
            .experienceId
        )

      const domainId =
        experience?.domainId ||
        experience?.domain ||
        null

      const sessionId =
        createSessionId()

      const enjoymentMap = {
        not_for_me: 0,
        okay: 1,
        liked_it: 2,
        loved_it: 3,
      }

      const enjoymentValue =
        enjoymentMap[
          reflection?.enjoyment
        ]

      const evidenceEvents = []

      if (
        enjoymentValue !==
        undefined
      ) {
        evidenceEvents.push(
          createEvidenceEvent({
            childId,

            source: {
              type:
                evidenceSourceTypes
                  .REFLECTION,

              experienceId:
                completedItem
                  .experienceId,

              questionId:
                'journey_enjoyment',

              responseId:
                reflection
                  .enjoyment,
            },

            evidence:
              getEnjoymentEvidence(
                enjoymentValue
              ),

            context: {
              domainId,
              sessionId,
            },

            metadata: {
              questionText:
                'How much did you enjoy it?',

              responseText:
                reflection
                  .enjoyment,

              enjoymentValue,

              journeyId:
                completedItem.id,

              favoritePart:
                reflection
                  ?.favoritePart ||
                '',

              difficultPart:
                reflection
                  ?.difficultPart ||
                '',

              wouldDoAgain:
                reflection
                  ?.wouldDoAgain ??
                null,

              wantsNext:
                reflection
                  ?.wantsNext ||
                '',
            },
          })
        )
      }

      evidenceEvents.push(
        createEvidenceEvent({
          childId,

          source: {
            type:
              evidenceSourceTypes
                .COMPLETION,

            experienceId:
              completedItem
                .experienceId,

            questionId:
              null,

            responseId:
              'completed',
          },

          evidence:
            getCompletionEvidence(),

          context: {
            domainId,
            sessionId,
          },

          metadata: {
            experienceTitle:
              completedItem.title,

            journeyId:
              completedItem.id,

            origin:
              completedItem.origin,
          },
        })
      )

      const updatedProfile =
        persistGrowthEvidence(
          evidenceEvents
        )

      setCompletedJourneyInsight({
        journeyItem:
          completedItem,

        reflection,

        updatedProfile,

        completedAt:
          completedItem
            .completedAt,
      })

      if (
        reflection
          ?.wantsNext
          ?.trim()
      ) {
        onStudentIntent?.(
          reflection.wantsNext
        )
      }

      console.group(
        '↻ Growth Loop v0.4'
      )

      console.log(
        'Journey completed:',
        completedItem
      )

      console.log(
        'Growth evidence added:',
        evidenceEvents
      )

      console.log(
        'Next recommendations will recalculate from the updated profile and intent.'
      )

      console.groupEnd()

      return completedItem
    }


  const dismissCompletedJourneyInsight =
    () => {
      setCompletedJourneyInsight(
        null
      )
    }


  const resetJourney =
    () => {
      setJourneyItems([])
      setCompletedJourneyInsight(null)
    }


  return {
    journeyItems,

    completedJourneyInsight,

    restoreJourney,

    handleStartGrow,

    goToJourney,

    handleJourneyProgress,

    handleCompleteJourney,

    dismissCompletedJourneyInsight,

    resetJourney,
  }
}
