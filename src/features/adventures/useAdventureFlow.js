// src/features/adventures/useAdventureFlow.js

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
  getChallengeEvidence,
  getReflectionEvidence,
  getEnjoymentEvidence,
  getCompletionEvidence,
  getExplorationDomainId,
} from '../../intelligence/legacyEvidenceAdapter'

import {
  getGuidedKidExperienceEvidence,
} from '../../intelligence/guidedAdventureEvidenceAdapter'

import {
  getGuidedStageCompletionEvidence,
} from '../../intelligence/guidedAdventureSystemEvidenceAdapter'

import {
  createSessionId,
  getChildEvidenceId,
} from '../../utils/session'


// ============================================================
// Career & Growth — MVP v0.6
// Adventure Controller
//
// Extracted from App.jsx with NO intended behavior change.
//
// Owns:
// - Active Adventure
// - Adventure step/challenge state
// - Legacy experience responses
// - Enjoyment response
// - Adventure evidence session
// - Adventure completion state
// - Guided Kid Experience evidence
// - Guided stage System Evidence
// - Challenge/reflection/completion evidence
//
// Does NOT own:
// - Global screen state
// - Growth Intelligence persistence implementation
// - Parent post-Adventure observation state
// ============================================================

export default function useAdventureFlow({
  childProfile,
  initialCompletedExplorations = [],
  setScreen,
  persistGrowthEvidence,
}) {
  const [
    activeExploration,
    setActiveExploration,
  ] = useState(null)

  const [
    explorationStep,
    setExplorationStep,
  ] = useState('intro')

  const [
    challengeIndex,
    setChallengeIndex,
  ] = useState(0)

  const [
    experienceResponses,
    setExperienceResponses,
  ] = useState([])

  const [
    enjoymentResponse,
    setEnjoymentResponse,
  ] = useState(null)

  const [
    completedExplorations,
    setCompletedExplorations,
  ] = useState(
    initialCompletedExplorations
  )

  const [
    evidenceSessionId,
    setEvidenceSessionId,
  ] = useState(null)


  // ==========================================================
  // DERIVED DATA
  // ==========================================================

  const currentExploration =
    activeExploration
      ? explorations[
          activeExploration
        ]
      : null


  // ==========================================================
  // START / NAVIGATION
  // ==========================================================

  const startExploration =
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

      setExplorationStep(
        'intro'
      )

      setChallengeIndex(0)
      setEnjoymentResponse(null)

      setEvidenceSessionId(
        createSessionId()
      )

      setScreen(
        'exploration'
      )
    }


  const beginMission = () => {
    setExplorationStep(
      'challenge'
    )
  }


  // ==========================================================
  // GUIDED ADVENTURE EVIDENCE
  // ==========================================================

  const handleGuidedKidExperienceAnswer =
    ({
      prompt,
      answer,
    }) => {
      if (
        !currentExploration ||
        !prompt ||
        !answer
      ) {
        return null
      }

      const evidence =
        getGuidedKidExperienceEvidence(
          prompt.id,
          answer.id
        )

      if (
        evidence.length === 0
      ) {
        return null
      }

      const event =
        createEvidenceEvent({
          childId:
            getChildEvidenceId(
              childProfile
            ),

          source: {
            type:
              evidenceSourceTypes
                .ADVENTURE_CHOICE,

            experienceId:
              currentExploration.id,

            questionId:
              `kid_experience_${prompt.id}`,

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
              prompt.question,

            responseText:
              answer.label,

            evidenceRole:
              'kid_experience',

            guidedAdventureVersion:
              currentExploration
                .guidedAdventure
                ?.version ||
              null,
          },
        })

      return persistGrowthEvidence([
        event,
      ])
    }


  const handleGuidedStageComplete =
    ({
      stage,
    }) => {
      if (
        !currentExploration ||
        !stage
      ) {
        return null
      }

      const evidence =
        getGuidedStageCompletionEvidence(
          stage.id
        )

      if (
        evidence.length === 0
      ) {
        return null
      }

      const event =
        createEvidenceEvent({
          childId:
            getChildEvidenceId(
              childProfile
            ),

          source: {
            type:
              evidenceSourceTypes
                .COMPLETION,

            experienceId:
              currentExploration.id,

            questionId:
              `guided_stage_${stage.id}`,

            responseId:
              'completed',
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
            stageId:
              stage.id,

            stageTitle:
              stage.title,

            evidenceRole:
              'system_evidence',

            evidenceStrength:
              'weak',

            guidedAdventureVersion:
              currentExploration
                .guidedAdventure
                ?.version ||
              null,
          },
        })

      return persistGrowthEvidence([
        event,
      ])
    }


  // ==========================================================
  // CHALLENGES
  // ==========================================================

  const handleChallengeAnswer =
    (answer) => {
      const challenge =
        currentExploration
          .challenges[
            challengeIndex
          ]

      setExperienceResponses(
        (responses) => [
          ...responses,

          {
            type:
              'challenge',

            explorationId:
              currentExploration.id,

            questionId:
              challenge.id,

            answerId:
              answer.id,

            signals:
              answer.signals,
          },
        ]
      )

      if (
        currentExploration.id ===
        'robotics'
      ) {
        const event =
          createEvidenceEvent({
            childId:
              getChildEvidenceId(
                childProfile
              ),

            source: {
              type:
                evidenceSourceTypes
                  .ADVENTURE_QUESTION,

              experienceId:
                currentExploration.id,

              questionId:
                challenge.id,

              responseId:
                answer.id,
            },

            evidence:
              getChallengeEvidence(
                answer
              ),

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
                challenge.question,

              responseText:
                answer.label,

              legacySignals:
                answer.signals ||
                [],
            },
          })

        persistGrowthEvidence([
          event,
        ])
      }

      if (
        challengeIndex ===
        currentExploration
          .challenges.length -
          1
      ) {
        setExplorationStep(
          'enjoyment'
        )

        return
      }

      setChallengeIndex(
        (current) =>
          current + 1
      )
    }


  // ==========================================================
  // REFLECTION
  // ==========================================================

  const handleEnjoyment =
    (answer) => {
      setEnjoymentResponse(
        answer
      )

      setExperienceResponses(
        (responses) => [
          ...responses,

          {
            type:
              'enjoyment',

            explorationId:
              currentExploration.id,

            answerId:
              answer.id,

            enjoyment:
              answer.value,
          },
        ]
      )

      if (
        currentExploration.id ===
        'robotics'
      ) {
        const event =
          createEvidenceEvent({
            childId:
              getChildEvidenceId(
                childProfile
              ),

            source: {
              type:
                evidenceSourceTypes
                  .REFLECTION,

              experienceId:
                currentExploration.id,

              questionId:
                'enjoyment',

              responseId:
                answer.id,
            },

            evidence:
              getEnjoymentEvidence(
                answer.value
              ),

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
                currentExploration
                  .reflection
                  .enjoyment
                  .question,

              responseText:
                answer.label,

              enjoymentValue:
                answer.value,
            },
          })

        persistGrowthEvidence([
          event,
        ])
      }

      setExplorationStep(
        'favorite'
      )
    }


  const handleFavoritePart =
    (answer) => {
      setExperienceResponses(
        (responses) => [
          ...responses,

          {
            type:
              'reflection',

            explorationId:
              currentExploration.id,

            answerId:
              answer.id,

            signals:
              answer.signals,
          },
        ]
      )

      if (
        currentExploration.id ===
        'robotics'
      ) {
        const childId =
          getChildEvidenceId(
            childProfile
          )

        const domainId =
          getExplorationDomainId(
            currentExploration.id
          )

        const reflectionEvent =
          createEvidenceEvent({
            childId,

            source: {
              type:
                evidenceSourceTypes
                  .REFLECTION,

              experienceId:
                currentExploration.id,

              questionId:
                'favorite_part',

              responseId:
                answer.id,
            },

            evidence:
              getReflectionEvidence(
                answer
              ),

            context: {
              domainId,

              sessionId:
                evidenceSessionId,
            },

            metadata: {
              questionText:
                currentExploration
                  .reflection
                  .favoritePart
                  .question,

              responseText:
                answer.label,

              legacySignals:
                answer.signals ||
                [],
            },
          })

        const completionEvent =
          createEvidenceEvent({
            childId,

            source: {
              type:
                evidenceSourceTypes
                  .COMPLETION,

              experienceId:
                currentExploration.id,

              questionId:
                null,

              responseId:
                'completed',
            },

            evidence:
              getCompletionEvidence(),

            context: {
              domainId,

              sessionId:
                evidenceSessionId,
            },

            metadata: {
              experienceTitle:
                currentExploration
                  .title ||
                'Robot Builder',
            },
          })

        persistGrowthEvidence([
          reflectionEvent,
          completionEvent,
        ])
      }

      setCompletedExplorations(
        (completed) => {
          if (
            completed.includes(
              currentExploration.id
            )
          ) {
            return completed
          }

          return [
            ...completed,
            currentExploration.id,
          ]
        }
      )

      setScreen(
        'profileGrew'
      )
    }


  // ==========================================================
  // RESET
  // ==========================================================

  const resetAdventure =
    () => {
      setActiveExploration(null)
      setExplorationStep('intro')
      setChallengeIndex(0)
      setExperienceResponses([])
      setEnjoymentResponse(null)
      setCompletedExplorations([])
      setEvidenceSessionId(null)
    }


  return {
    activeExploration,

    currentExploration,

    explorationStep,

    challengeIndex,

    experienceResponses,

    enjoymentResponse,

    completedExplorations,

    evidenceSessionId,

    setActiveExploration,

    setEvidenceSessionId,

    startExploration,

    beginMission,

    handleGuidedKidExperienceAnswer,

    handleGuidedStageComplete,

    handleChallengeAnswer,

    handleEnjoyment,

    handleFavoritePart,

    resetAdventure,
  }
}
