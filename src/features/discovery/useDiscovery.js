// src/features/discovery/useDiscovery.js

import {
  useState,
} from 'react'

import {
  discoveryQuestions,
} from '../../data/discoveryQuestions'

import {
  evidenceSourceTypes,
} from '../../data/growthTaxonomy'

import {
  createEvidenceEvent,
} from '../../intelligence/evidenceEngine'

import {
  getDiscoveryEvidence,
  getDiscoveryDomainId,
} from '../../intelligence/discoveryEvidenceAdapter'

import {
  getPersona,
} from '../../intelligence/legacyProfileEngine'

import {
  createSessionId,
  getChildEvidenceId,
} from '../../utils/session'


// ============================================================
// Career & Growth — MVP v0.6
// Discovering You Controller
//
// Extracted from App.jsx with NO intended behavior change.
//
// Owns:
// - Discovery question state
// - Discovery responses
// - Discovery completion state
// - Discovery session
// - Discovery navigation
// - Discovery evidence creation
//
// Does NOT own:
// - Global screen state
// - Growth Intelligence persistence implementation
// - Child profile
// ============================================================

export default function useDiscovery({
  childProfile,
  initialComplete = false,
  setScreen,
  goToChildSpace,
  persistGrowthEvidence,
}) {
  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0)

  const [
    discoveryResponses,
    setDiscoveryResponses,
  ] = useState([])

  const [
    discoveryComplete,
    setDiscoveryComplete,
  ] = useState(
    initialComplete
  )

  const [
    discoverySessionId,
    setDiscoverySessionId,
  ] = useState(null)


  // ==========================================================
  // DERIVED DATA
  // ==========================================================

  const persona =
    getPersona(
      childProfile.age
    )

  const questions =
    discoveryQuestions[
      persona.id
    ]

  const currentQuestion =
    questions[
      currentQuestionIndex
    ]


  // ==========================================================
  // START / NAVIGATION
  // ==========================================================

  const startDiscovery = () => {
    setCurrentQuestionIndex(0)
    setDiscoveryResponses([])

    setDiscoverySessionId(
      createSessionId()
    )

    setScreen(
      'discovery'
    )
  }


  const handleDiscoveryBack =
    () => {
      if (
        currentQuestionIndex === 0
      ) {
        goToChildSpace()

        return
      }

      setCurrentQuestionIndex(
        (current) =>
          current - 1
      )
    }


  // ==========================================================
  // EVIDENCE
  // ==========================================================

  const persistDiscoveryEvidence =
    (responses) => {
      const childId =
        getChildEvidenceId(
          childProfile
        )

      const events =
        responses.map(
          (response) => {
            const question =
              questions.find(
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
                    .DISCOVERY,

                experienceId:
                  'discover_you',

                questionId:
                  question.id,

                responseId:
                  answer.id,
              },

              evidence:
                getDiscoveryEvidence(
                  answer
                ),

              context: {
                domainId:
                  getDiscoveryDomainId(
                    answer
                  ),

                sessionId:
                  discoverySessionId,
              },

              metadata: {
                questionText:
                  question.question,

                responseText:
                  answer.label,

                legacySignals:
                  answer.signals ||
                  [],

                persona:
                  persona.id,
              },
            })
          }
        )

      persistGrowthEvidence(
        events
      )
    }


  // ==========================================================
  // ANSWER
  // ==========================================================

  const handleAnswer =
    (answer) => {
      const response = {
        questionId:
          currentQuestion.id,

        answerId:
          answer.id,

        answerLabel:
          answer.label,

        signals:
          answer.signals,
      }

      const updatedResponses = [
        ...discoveryResponses.filter(
          (item) =>
            item.questionId !==
            currentQuestion.id
        ),

        response,
      ]

      setDiscoveryResponses(
        updatedResponses
      )

      const isFinalQuestion =
        currentQuestionIndex ===
        questions.length - 1

      if (isFinalQuestion) {
        try {
          persistDiscoveryEvidence(
            updatedResponses
          )
        } catch (error) {
          console.error(
            'Unable to persist Discover You evidence.',
            error
          )
        }

        setDiscoveryComplete(
          true
        )

        setScreen(
          'discoveryComplete'
        )

        return
      }

      setCurrentQuestionIndex(
        (current) =>
          current + 1
      )
    }


  // ==========================================================
  // RESTORE / RESET HELPERS
  // ==========================================================

  const markDiscoveryComplete =
    () => {
      setDiscoveryComplete(
        true
      )
    }


  const resetDiscovery =
    () => {
      setCurrentQuestionIndex(0)
      setDiscoveryResponses([])
      setDiscoveryComplete(false)
      setDiscoverySessionId(null)
    }


  return {
    persona,

    questions,

    currentQuestion,

    currentQuestionIndex,

    discoveryResponses,

    discoveryComplete,

    startDiscovery,

    handleAnswer,

    handleDiscoveryBack,

    markDiscoveryComplete,

    resetDiscovery,
  }
}
