// src/features/parent/useParentPerspective.js

import {
  useState,
} from 'react'

import { explorations } from '../../data/explorations'

import {
  evidenceSourceTypes,
} from '../../data/growthTaxonomy'

import {
  createEvidenceEvent,
} from '../../intelligence/evidenceEngine'

import {
  parentPerspectiveQuestions,
  getParentObservationEvidence,
  getParentObservationDomainId,
} from '../../intelligence/parentPerspectiveAdapter'

import {
  guidedAdventureParentObservationQuestions,
  getGuidedParentObservationEvidence,
} from '../../intelligence/guidedAdventureParentObservationAdapter'

import {
  getEvidenceEvents,
} from '../../storage/growthStorage'

import {
  createSessionId,
  getChildEvidenceId,
} from '../../utils/session'

import {
  getExplorationDomainId,
} from '../../intelligence/legacyEvidenceAdapter'


// ============================================================
// Career & Growth — MVP v0.6
// Parent Perspective Controller
//
// Extracted from App.jsx with NO intended behavior change.
//
// Owns:
// - General Parent Perspective state/navigation
// - Experience Observation state/navigation
// - Parent evidence creation for both flows
// - Parent Experience Observation status derivation
//
// Does NOT own:
// - Parent Growth Goals / intents
// - Global screen state
// - Growth Intelligence persistence implementation
// ============================================================

export default function useParentPerspective({
  childProfile,
  completedExplorations,
  initialComplete = false,
  setScreen,
  setActiveExploration,
  setEvidenceSessionId,
  persistGrowthEvidence,
}) {
  const [
    parentPerspectiveComplete,
    setParentPerspectiveComplete,
  ] = useState(
    initialComplete
  )

  const [
    parentQuestionIndex,
    setParentQuestionIndex,
  ] = useState(0)

  const [
    parentResponses,
    setParentResponses,
  ] = useState([])

  const [
    parentSessionId,
    setParentSessionId,
  ] = useState(null)

  const [
    postAdventureParentQuestionIndex,
    setPostAdventureParentQuestionIndex,
  ] = useState(0)

  const [
    postAdventureParentResponses,
    setPostAdventureParentResponses,
  ] = useState([])

  const [
    postAdventureParentComplete,
    setPostAdventureParentComplete,
  ] = useState(false)


  // ==========================================================
  // DERIVED DATA
  // ==========================================================

  const currentParentQuestion =
    parentPerspectiveQuestions[
      parentQuestionIndex
    ]

  const currentPostAdventureParentQuestion =
    guidedAdventureParentObservationQuestions[
      postAdventureParentQuestionIndex
    ]

  const parentExperienceObservations =
    childProfile.name.trim()
      ? completedExplorations
          .map(
            (explorationId) => {
              const exploration =
                explorations[
                  explorationId
                ]

              if (!exploration) {
                return null
              }

              const childId =
                getChildEvidenceId(
                  childProfile
                )

              const observationEvents =
                getEvidenceEvents({
                  childId,
                }).filter(
                  (event) =>
                    event.source?.type ===
                      evidenceSourceTypes
                        .PARENT_OBSERVATION &&
                    event.source?.experienceId ===
                      explorationId &&
                    event.metadata
                      ?.observationContext ===
                      'post_adventure'
                )

              return {
                id:
                  explorationId,

                title:
                  exploration.title,

                emoji:
                  exploration.emoji,

                description:
                  exploration.description ||
                  exploration.intro
                    ?.description ||
                  '',

                completed:
                  true,

                observationAdded:
                  observationEvents.length > 0,

                observationCount:
                  observationEvents.length,
              }
            }
          )
          .filter(Boolean)
      : []


  // ==========================================================
  // GENERAL PARENT PERSPECTIVE
  // ==========================================================

  const startParentPerspective =
    () => {
      setParentQuestionIndex(0)
      setParentResponses([])
      setParentSessionId(
        createSessionId()
      )

      setScreen(
        'parentPerspectiveIntro'
      )
    }


  const beginParentPerspective =
    () => {
      setScreen(
        'parentPerspective'
      )
    }


  const persistParentPerspective =
    (responses) => {
      const childId =
        getChildEvidenceId(
          childProfile
        )

      const events =
        responses.map(
          (response) => {
            const question =
              parentPerspectiveQuestions.find(
                (item) =>
                  item.id ===
                  response.questionId
              )

            if (!question) {
              return null
            }

            const answer =
              question.answers.find(
                (item) =>
                  item.id ===
                  response.answerId
              )

            if (!answer) {
              return null
            }

            return createEvidenceEvent({
              childId,

              source: {
                type:
                  evidenceSourceTypes
                    .PARENT_OBSERVATION,

                experienceId:
                  'parent_perspective',

                questionId:
                  question.id,

                responseId:
                  answer.id,
              },

              evidence:
                getParentObservationEvidence(
                  answer
                ),

              context: {
                domainId:
                  getParentObservationDomainId(
                    answer
                  ),

                sessionId:
                  parentSessionId,
              },

              metadata: {
                questionText:
                  question.question,

                responseText:
                  answer.label,

                observerRole:
                  'parent',
              },
            })
          }
        )

      persistGrowthEvidence(
        events
      )
    }


  const handleParentAnswer =
    (answer) => {
      const response = {
        questionId:
          currentParentQuestion.id,

        answerId:
          answer.id,
      }

      const updatedResponses = [
        ...parentResponses.filter(
          (item) =>
            item.questionId !==
            currentParentQuestion.id
        ),

        response,
      ]

      setParentResponses(
        updatedResponses
      )

      if (
        parentQuestionIndex ===
        parentPerspectiveQuestions.length -
          1
      ) {
        persistParentPerspective(
          updatedResponses
        )

        setParentPerspectiveComplete(
          true
        )

        setScreen(
          'parentPerspectiveComplete'
        )

        return
      }

      setParentQuestionIndex(
        (current) =>
          current + 1
      )
    }


  const handleParentPerspectiveBack =
    () => {
      if (
        parentQuestionIndex === 0
      ) {
        setScreen(
          'parentPerspectiveIntro'
        )

        return
      }

      setParentQuestionIndex(
        (current) =>
          current - 1
      )
    }


  // ==========================================================
  // EXPERIENCE OBSERVATIONS
  // ==========================================================

  const startParentExperienceObservation =
    (explorationId) => {
      if (
        !explorations[
          explorationId
        ]
      ) {
        return
      }

      setActiveExploration(
        explorationId
      )

      setPostAdventureParentQuestionIndex(0)
      setPostAdventureParentResponses([])
      setPostAdventureParentComplete(false)

      setEvidenceSessionId(
        createSessionId()
      )

      setScreen(
        'postAdventureParentObservation'
      )
    }


  const handlePostAdventureParentAnswer =
    ({
      answer,
      currentExploration,
      evidenceSessionId,
    }) => {
      const question =
        currentPostAdventureParentQuestion

      if (
        !question ||
        !answer ||
        !currentExploration
      ) {
        return
      }

      const response = {
        questionId:
          question.id,

        answerId:
          answer.id,
      }

      setPostAdventureParentResponses(
        (current) => [
          ...current.filter(
            (item) =>
              item.questionId !==
              question.id
          ),

          response,
        ]
      )

      const evidence =
        getGuidedParentObservationEvidence(
          answer
        )

      const event =
        createEvidenceEvent({
          childId:
            getChildEvidenceId(
              childProfile
            ),

          source: {
            type:
              evidenceSourceTypes
                .PARENT_OBSERVATION,

            experienceId:
              currentExploration.id,

            questionId:
              `post_adventure_${question.id}`,

            responseId:
              answer.id,
          },

          evidence,

          context: {
            domainId:
              getExplorationDomainId(
                currentExploration.id
              ),

            sessionId:
              evidenceSessionId,
          },

          metadata: {
            questionText:
              question.question,

            responseText:
              answer.label,

            observerRole:
              'parent',

            observationContext:
              'post_adventure',

            adventureTitle:
              currentExploration.title,
          },
        })

      persistGrowthEvidence([
        event,
      ])

      const isFinalQuestion =
        postAdventureParentQuestionIndex ===
        guidedAdventureParentObservationQuestions.length -
          1

      if (isFinalQuestion) {
        setPostAdventureParentComplete(true)

        setPostAdventureParentQuestionIndex(
          guidedAdventureParentObservationQuestions.length
        )

        return
      }

      setPostAdventureParentQuestionIndex(
        (current) =>
          current + 1
      )
    }


  const skipPostAdventureParentObservation =
    () => {
      setScreen(
        'growthProfile'
      )
    }


  // ==========================================================
  // RESTORE / RESET HELPERS
  // ==========================================================

  const markParentPerspectiveComplete =
    () => {
      setParentPerspectiveComplete(
        true
      )
    }


  const resetParentPerspective =
    () => {
      setParentPerspectiveComplete(false)

      setParentQuestionIndex(0)
      setParentResponses([])
      setParentSessionId(null)

      setPostAdventureParentQuestionIndex(0)
      setPostAdventureParentResponses([])
      setPostAdventureParentComplete(false)
    }


  return {
    parentPerspectiveComplete,

    currentParentQuestion,

    currentPostAdventureParentQuestion,

    parentQuestionIndex,

    postAdventureParentQuestionIndex,

    postAdventureParentComplete,

    parentExperienceObservations,

    startParentPerspective,

    beginParentPerspective,

    startParentExperienceObservation,

    handleParentAnswer,

    handleParentPerspectiveBack,

    handlePostAdventureParentAnswer,

    skipPostAdventureParentObservation,

    markParentPerspectiveComplete,

    resetParentPerspective,
  }
}
