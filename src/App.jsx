import {
  useEffect,
  useState,
} from 'react'

import './App.css'

import { explorations } from './data/explorations'
import { discoveryQuestions } from './data/discoveryQuestions'
import { getGrowExperience } from './data/growExperiences'

import GrowthHome from './components/GrowthHome'
import DiscoveryFlow from './components/DiscoveryFlow'
import GrowthProfileView from './components/GrowthProfileView'
import ParentPerspectiveFlow from './components/ParentPerspectiveFlow'
import AdventuresHub from './components/AdventuresHub'
import AdventureFlow from './components/AdventureFlow'

import {
  evidenceSourceTypes,
} from './data/growthTaxonomy'

import {
  createEvidenceEvent,
} from './intelligence/evidenceEngine'

import {
  buildGrowthProfile,
  getTopTraits,
  getTopDomains,
  getTopPathways,
  getTopCareerFamilies,
} from './intelligence/growthEngine'

import {
  getPersona,
  interestSignals,
  tendencySignals,
  motivatorSignals,
  signalLabels,
  signalEmojis,
  calculateDiscoveryScores,
  calculateExperienceScores,
  combineScores,
  getTopSignals,
  getRecommendations,
  getGrowthSignals,
} from './intelligence/legacyProfileEngine'

import {
  appendEvidenceEvents,
  getEvidenceEvents,
  saveGrowthProfile,
} from './storage/growthStorage'

import {
  getChallengeEvidence,
  getReflectionEvidence,
  getEnjoymentEvidence,
  getCompletionEvidence,
  getExplorationDomainId,
} from './intelligence/legacyEvidenceAdapter'

import {
  getDiscoveryEvidence,
  getDiscoveryDomainId,
} from './intelligence/discoveryEvidenceAdapter'

import {
  parentPerspectiveQuestions,
  getParentObservationEvidence,
  getParentObservationDomainId,
} from './intelligence/parentPerspectiveAdapter'

import {
  createSessionId,
  getChildEvidenceId,
} from './utils/session'

import {
  createGrowthIntent,
  growthIntentActors,
  growthIntentTypes,
} from './intelligence/growthLoopModels'

import {
  getGrowthIntents,
  saveGrowthIntent,
} from './storage/growthLoopStorage'

import {
  getGrowthRecommendations,
} from './intelligence/growthRecommendationEngine'

import {
  createJourneyItem,
  journeyOrigins,
  updateJourneyProgress,
  completeJourneyWithReflection,
} from './intelligence/journeyModels'

import {
  findJourneyByExperience,
  getJourneyItems,
  saveJourneyItem,
} from './storage/journeyStorage'


// ============================================================
// V0.4 APP STATE PERSISTENCE
// ============================================================

const APP_STATE_STORAGE_KEY =
  'careerGrowth.v04.appState'


const defaultChildProfile = {
  name: '',
  age: '11',
  grade: '6th Grade',
}


const readStoredAppState = () => {
  try {
    const raw =
      localStorage.getItem(
        APP_STATE_STORAGE_KEY
      )

    if (!raw) {
      return null
    }

    const parsed =
      JSON.parse(raw)

    return parsed &&
      typeof parsed === 'object'
      ? parsed
      : null
  } catch (error) {
    console.error(
      'Unable to restore Career & Growth app state.',
      error
    )

    return null
  }
}


const storedAppState =
  readStoredAppState()


// ============================================================
// APP
// ============================================================

function App() {
  const [screen, setScreen] =
    useState(
      storedAppState
        ?.childProfile
        ?.name
        ?.trim()
        ? (
            storedAppState
              .screen ===
              'journey'
              ? 'journey'
              : 'childSpace'
          )
        : 'landing'
    )

  const [
    childProfile,
    setChildProfile,
  ] = useState(
    storedAppState
      ?.childProfile ||
      defaultChildProfile
  )

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
    storedAppState
      ?.discoveryComplete ||
      false
  )

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
    storedAppState
      ?.completedExplorations ||
      []
  )

  const [
    discoverySessionId,
    setDiscoverySessionId,
  ] = useState(null)

  const [
    evidenceSessionId,
    setEvidenceSessionId,
  ] = useState(null)

  const [
    parentPerspectiveComplete,
    setParentPerspectiveComplete,
  ] = useState(
    storedAppState
      ?.parentPerspectiveComplete ||
      false
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
    growthIntelligenceProfile,
    setGrowthIntelligenceProfile,
  ] = useState(null)

  const [
    evidenceEventCount,
    setEvidenceEventCount,
  ] = useState(0)

  const [
    studentGrowthIntents,
    setStudentGrowthIntents,
  ] = useState([])

  const [
    parentGrowthIntents,
    setParentGrowthIntents,
  ] = useState([])

  const [
    journeyItems,
    setJourneyItems,
  ] = useState([])


  const [
    completedJourneyInsight,
    setCompletedJourneyInsight,
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

  const currentParentQuestion =
    parentPerspectiveQuestions[
      parentQuestionIndex
    ]

  const currentExploration =
    activeExploration
      ? explorations[
          activeExploration
        ]
      : null


  // ==========================================================
  // LEGACY V0.2 PROFILE CALCULATIONS
  // ==========================================================

  const discoveryScores =
    calculateDiscoveryScores(
      discoveryResponses
    )

  const experienceScores =
    calculateExperienceScores(
      experienceResponses
    )

  const signalScores =
    combineScores(
      discoveryScores,
      experienceScores
    )

  getTopSignals(
    signalScores,
    interestSignals,
    3
  )

  getTopSignals(
    signalScores,
    tendencySignals,
    3
  )

  getTopSignals(
    signalScores,
    motivatorSignals,
    2
  )

  const recommendations =
    getRecommendations(
      signalScores,
      completedExplorations,
      3
    )

  const growthSignals =
    getGrowthSignals(
      discoveryScores,
      signalScores,
      3
    )


  // ==========================================================
  // V0.4 GROWTH RECOMMENDATIONS
  // ==========================================================

  const journeyExperienceIds =
    journeyItems
      .map(
        (item) =>
          item.experienceId
      )
      .filter(Boolean)

  const growthRecommendations =
    getGrowthRecommendations({
      age:
        childProfile.age,

      growthProfile:
        growthIntelligenceProfile,

      studentIntents:
        studentGrowthIntents,

      parentIntents:
        parentGrowthIntents,

      completedExperienceIds:
        journeyExperienceIds,

      limit: 5,
    })


  // ==========================================================
  // LOAD / RESTORE V0.4 LOCAL DATA
  // ==========================================================

  useEffect(
    () => {
      if (
        !childProfile.name.trim()
      ) {
        setStudentGrowthIntents([])
        setParentGrowthIntents([])
        setJourneyItems([])
        setGrowthIntelligenceProfile(null)
        setEvidenceEventCount(0)

        return
      }

      const childId =
        getChildEvidenceId(
          childProfile
        )

      // Restore Student + Parent Intent.

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

      // Restore Journey.

      setJourneyItems(
        getJourneyItems({
          childId,
        })
      )

      // Restore/rebuild Growth Intelligence
      // from the evidence store. Evidence is
      // the source of truth for intelligence.

      const storedEvidence =
        getEvidenceEvents({
          childId,
        })

      setEvidenceEventCount(
        storedEvidence.length
      )

      if (
        storedEvidence.length > 0
      ) {
        const restoredProfile =
          buildGrowthProfile({
            childId,
            evidenceEvents:
              storedEvidence,
          })

        setGrowthIntelligenceProfile(
          restoredProfile
        )

        saveGrowthProfile(
          restoredProfile
        )

        // If an older app-state record is
        // missing completion flags, infer
        // them from persisted evidence.

        const hasDiscoveryEvidence =
          storedEvidence.some(
            (event) =>
              event.source?.type ===
              evidenceSourceTypes
                .DISCOVERY
          )

        const hasParentEvidence =
          storedEvidence.some(
            (event) =>
              event.source?.type ===
              evidenceSourceTypes
                .PARENT_OBSERVATION
          )

        if (hasDiscoveryEvidence) {
          setDiscoveryComplete(true)
        }

        if (hasParentEvidence) {
          setParentPerspectiveComplete(
            true
          )
        }
      }
    },

    [
      childProfile.name,
      childProfile.age,
      childProfile.grade,
    ]
  )


  // ==========================================================
  // SAVE V0.4 APP/UI STATE
  // ==========================================================

  useEffect(
    () => {
      if (
        !childProfile.name.trim()
      ) {
        return
      }

      const safeScreen =
        screen === 'journey'
          ? 'journey'
          : 'childSpace'

      const appState = {
        childProfile,

        discoveryComplete,

        parentPerspectiveComplete,

        completedExplorations,

        screen:
          safeScreen,

        updatedAt:
          new Date().toISOString(),
      }

      localStorage.setItem(
        APP_STATE_STORAGE_KEY,
        JSON.stringify(
          appState
        )
      )
    },

    [
      childProfile,
      discoveryComplete,
      parentPerspectiveComplete,
      completedExplorations,
      screen,
    ]
  )


  // ==========================================================
  // STUDENT INTENT
  // ==========================================================

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


  // ==========================================================
  // PARENT INTENT
  // ==========================================================

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


  // ==========================================================
  // JOURNEY
  // ==========================================================

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

      // Turn Journey completion + reflection into
      // Growth Intelligence evidence.

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

      // A student's "what I want next" response
      // becomes a new Student Intent and therefore
      // participates in the next recommendation cycle.

      if (
        reflection
          ?.wantsNext
          ?.trim()
      ) {
        handleSaveStudentIntent(
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


  // ==========================================================
  // GROWTH INTELLIGENCE PERSISTENCE
  // ==========================================================

  const persistGrowthEvidence =
    (events = []) => {
      const validEvents =
        events.filter(Boolean)

      if (
        validEvents.length === 0
      ) {
        return null
      }

      const childId =
        getChildEvidenceId(
          childProfile
        )

      appendEvidenceEvents(
        validEvents
      )

      const allEvidence =
        getEvidenceEvents({
          childId,
        })

      const profile =
        buildGrowthProfile({
          childId,
          evidenceEvents:
            allEvidence,
        })

      saveGrowthProfile(
        profile
      )

      setGrowthIntelligenceProfile(
        profile
      )

      setEvidenceEventCount(
        allEvidence.length
      )

      return profile
    }


  // ==========================================================
  // DEVELOPER RESET
  // ==========================================================

  const resetTestData = () => {
    const confirmed =
      window.confirm(
        'Reset all Career & Growth test data?\n\nThis will remove the current child, Discovery responses, Parent Perspective, Adventures, Growth Intents, Journey items, and all stored Growth Intelligence evidence.'
      )

    if (!confirmed) {
      return
    }

    localStorage.clear()

    setChildProfile(
      defaultChildProfile
    )

    setCurrentQuestionIndex(0)
    setDiscoveryResponses([])
    setDiscoveryComplete(false)
    setDiscoverySessionId(null)

    setParentPerspectiveComplete(false)
    setParentQuestionIndex(0)
    setParentResponses([])
    setParentSessionId(null)

    setActiveExploration(null)
    setExplorationStep('intro')
    setChallengeIndex(0)
    setExperienceResponses([])
    setEnjoymentResponse(null)
    setCompletedExplorations([])
    setEvidenceSessionId(null)

    setGrowthIntelligenceProfile(null)
    setEvidenceEventCount(0)

    setStudentGrowthIntents([])
    setParentGrowthIntents([])
    setJourneyItems([])
    setCompletedJourneyInsight(null)

    setScreen('parentSetup')
  }


  // ==========================================================
  // CHILD SPACE
  // ==========================================================

  const handleProfileChange =
    (event) => {
      const {
        name,
        value,
      } = event.target

      setChildProfile(
        (currentProfile) => ({
          ...currentProfile,
          [name]: value,
        })
      )
    }


  const handleParentSetupSubmit =
    (event) => {
      event.preventDefault()

      if (
        !childProfile.name.trim()
      ) {
        return
      }

      setScreen('childSpace')
    }


  const goToChildSpace = () => {
    setScreen('childSpace')
  }


  // ==========================================================
  // DISCOVERY
  // ==========================================================

  const startDiscovery = () => {
    setCurrentQuestionIndex(0)
    setDiscoveryResponses([])
    setDiscoverySessionId(
      createSessionId()
    )
    setScreen('discovery')
  }


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

      if (
        currentQuestionIndex ===
        questions.length - 1
      ) {
        persistDiscoveryEvidence(
          updatedResponses
        )

        setDiscoveryComplete(true)
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
  // PARENT PERSPECTIVE
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
  // ADVENTURES
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

      setScreen('exploration')
    }


  const beginMission = () => {
    setExplorationStep(
      'challenge'
    )
  }


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

      setScreen('profileGrew')
    }


  // ==========================================================
  // GROWTH INTELLIGENCE VIEW
  // ==========================================================

  const intelligenceTraits =
    growthIntelligenceProfile
      ? getTopTraits(
          growthIntelligenceProfile,
          5
        )
      : []

  const intelligenceDomains =
    growthIntelligenceProfile
      ? getTopDomains(
          growthIntelligenceProfile,
          5
        )
      : []

  const intelligencePathways =
    growthIntelligenceProfile
      ? getTopPathways(
          growthIntelligenceProfile,
          5
        )
      : []

  const intelligenceCareers =
    growthIntelligenceProfile
      ? getTopCareerFamilies(
          growthIntelligenceProfile,
          5
        )
      : []


  // ==========================================================
  // UI
  // ==========================================================

  const useGrowthShell =
    screen === 'childSpace' ||
    screen === 'journey'

  return (
    <main
      className={
        useGrowthShell
          ? 'page pageGrowthShell'
          : 'page'
      }
    >

      {screen === 'landing' && (
        <section className="hero">

          <p className="eyebrow">
            Career & Growth
          </p>

          <h1>
            Helping kids discover who
            they are, what they love,
            and who they can become.
          </h1>

          <p className="subtext">
            A personal operating system
            for growing up — designed
            to help families explore
            interests, build skills,
            set goals, and grow with
            confidence.
          </p>

          <button
            className="cta"
            onClick={() =>
              setScreen(
                'parentSetup'
              )
            }
          >
            Create a Child's Space
          </button>

          <p className="tagline">
            A Personal Operating
            System for Growing Up
          </p>

        </section>
      )}


      {screen ===
        'parentSetup' && (
        <section className="setup">

          <button
            className="backButton"
            onClick={() =>
              setScreen(
                'landing'
              )
            }
          >
            ← Back
          </button>

          <div className="setupHeader">

            <p className="eyebrow">
              Create a Child's Space
            </p>

            <h2>
              Start their growth
              journey 🌱
            </h2>

            <p className="subtext">
              We'll create a personal
              space that grows as your
              child explores interests,
              strengths, and new
              experiences.
            </p>

          </div>

          <form
            className="profileForm"
            onSubmit={
              handleParentSetupSubmit
            }
          >

            <label>
              Child's first name
              or nickname

              <input
                type="text"
                name="name"
                value={
                  childProfile.name
                }
                onChange={
                  handleProfileChange
                }
                placeholder="Noah"
                autoFocus
              />
            </label>

            <label>
              Age

              <select
                name="age"
                value={
                  childProfile.age
                }
                onChange={
                  handleProfileChange
                }
              >
                {Array.from(
                  {
                    length: 13,
                  },

                  (_, index) => {
                    const age =
                      index + 5

                    return (
                      <option
                        key={age}
                        value={age}
                      >
                        {age}
                      </option>
                    )
                  }
                )}
              </select>
            </label>

            <label>
              Grade

              <select
                name="grade"
                value={
                  childProfile.grade
                }
                onChange={
                  handleProfileChange
                }
              >
                <option>Kindergarten</option>
                <option>1st Grade</option>
                <option>2nd Grade</option>
                <option>3rd Grade</option>
                <option>4th Grade</option>
                <option>5th Grade</option>
                <option>6th Grade</option>
                <option>7th Grade</option>
                <option>8th Grade</option>
                <option>9th Grade</option>
                <option>10th Grade</option>
                <option>11th Grade</option>
                <option>12th Grade</option>
              </select>
            </label>

            <button
              className="cta formCta"
              type="submit"
            >
              Create Space
            </button>

          </form>

        </section>
      )}
      {(screen === 'childSpace' ||
        screen === 'journey') && (
        <GrowthHome
          activeView={
            screen === 'journey'
              ? 'journey'
              : 'home'
          }

          childProfile={
            childProfile
          }

          discoveryComplete={
            discoveryComplete
          }

          completedExplorations={
            completedExplorations
          }

          evidenceEventCount={
            evidenceEventCount
          }

          growthProfile={
            growthIntelligenceProfile
          }

          topTraits={
            intelligenceTraits
          }

          topDomains={
            intelligenceDomains
          }

          recommendations={
            growthRecommendations
          }

          studentIntents={
            studentGrowthIntents
          }

          journeyItems={
            journeyItems
          }

          completedJourneyInsight={
            completedJourneyInsight
          }

          onDismissJourneyInsight={() =>
            setCompletedJourneyInsight(
              null
            )
          }

          onSaveStudentIntent={
            handleSaveStudentIntent
          }

          onStartGrow={
            handleStartGrow
          }

          onHome={
            goToChildSpace
          }

          onJourney={
            goToJourney
          }

          onJourneyProgress={
            handleJourneyProgress
          }

          onCompleteJourney={
            handleCompleteJourney
          }

          onDiscover={
            startDiscovery
          }

          onExplore={() =>
            setScreen(
              'adventures'
            )
          }

          onGrowthProfile={() =>
            setScreen(
              'growthProfile'
            )
          }

          onParentPerspective={
            startParentPerspective
          }
        />
      )}


      {screen ===
        'discovery' && (
        <DiscoveryFlow
          childProfile={
            childProfile
          }

          questions={
            questions
          }

          currentQuestionIndex={
            currentQuestionIndex
          }

          currentQuestion={
            currentQuestion
          }

          onBack={
            handleDiscoveryBack
          }

          onAnswer={
            handleAnswer
          }
        />
      )}


      {screen ===
        'discoveryComplete' && (
        <section className="handoff">

          <div className="handoffCard">

            <div className="handoffEmoji">
              ✨
            </div>

            <p className="eyebrow">
              Discovery Complete
            </p>

            <h2>
              Your Growth Profile
              has started!
            </h2>

            <p className="handoffText">
              We now have our first
              clues about what you
              enjoy, how you like to
              explore, and what seems
              to motivate you.
            </p>

            <p className="handoffText">
              Your Space will keep
              growing as you try new
              adventures and we learn
              from more perspectives.
            </p>

            <button
              className="cta"
              onClick={
                goToChildSpace
              }
            >
              Back to My Space
            </button>

          </div>

        </section>
      )}


      {screen ===
        'growthProfile' && (
        <GrowthProfileView
          childName={
            childProfile.name.trim()
          }

          profile={
            growthIntelligenceProfile
          }

          topTraits={
            intelligenceTraits
          }

          topDomains={
            intelligenceDomains
          }

          topPathways={
            intelligencePathways
          }

          parentPerspectiveComplete={
            parentPerspectiveComplete
          }

          completedExplorations={
            completedExplorations
          }

          onBack={
            goToChildSpace
          }

          onExploreAdventures={() =>
            setScreen(
              'adventures'
            )
          }

          developerInspector={
            growthIntelligenceProfile ? (
              <GrowthIntelligenceInspector
                profile={
                  growthIntelligenceProfile
                }

                evidenceEventCount={
                  evidenceEventCount
                }

                traits={
                  intelligenceTraits
                }

                domains={
                  intelligenceDomains
                }

                pathways={
                  intelligencePathways
                }

                careers={
                  intelligenceCareers
                }

                recommendations={
                  growthRecommendations
                }

                onReset={
                  resetTestData
                }
              />
            ) : null
          }
        />
      )}


      {screen ===
        'parentPerspectiveIntro' && (
        <ParentPerspectiveFlow
          mode="intro"

          childName={
            childProfile.name.trim()
          }

          currentQuestion={
            currentParentQuestion
          }

          currentQuestionIndex={
            parentQuestionIndex
          }

          totalQuestions={
            parentPerspectiveQuestions.length
          }

          parentIntents={
            parentGrowthIntents
          }

          onBackToChildSpace={
            goToChildSpace
          }

          onBegin={
            beginParentPerspective
          }

          onQuestionBack={
            handleParentPerspectiveBack
          }

          onAnswer={
            handleParentAnswer
          }

          onSaveParentIntent={
            handleSaveParentIntent
          }
        />
      )}


      {screen ===
        'parentPerspective' && (
        <ParentPerspectiveFlow
          mode="questions"

          childName={
            childProfile.name.trim()
          }

          currentQuestion={
            currentParentQuestion
          }

          currentQuestionIndex={
            parentQuestionIndex
          }

          totalQuestions={
            parentPerspectiveQuestions.length
          }

          parentIntents={
            parentGrowthIntents
          }

          onBackToChildSpace={
            goToChildSpace
          }

          onBegin={
            beginParentPerspective
          }

          onQuestionBack={
            handleParentPerspectiveBack
          }

          onAnswer={
            handleParentAnswer
          }

          onSaveParentIntent={
            handleSaveParentIntent
          }
        />
      )}


      {screen ===
        'parentPerspectiveComplete' && (
        <ParentPerspectiveFlow
          mode="complete"

          childName={
            childProfile.name.trim()
          }

          currentQuestion={
            currentParentQuestion
          }

          currentQuestionIndex={
            parentQuestionIndex
          }

          totalQuestions={
            parentPerspectiveQuestions.length
          }

          parentIntents={
            parentGrowthIntents
          }

          onBackToChildSpace={
            goToChildSpace
          }

          onBegin={
            beginParentPerspective
          }

          onQuestionBack={
            handleParentPerspectiveBack
          }

          onAnswer={
            handleParentAnswer
          }

          onSaveParentIntent={
            handleSaveParentIntent
          }
        />
      )}


      {screen ===
        'adventures' && (
        <AdventuresHub
          childName={
            childProfile.name.trim()
          }

          recommendations={
            recommendations
          }

          catalog={
            Object.values(explorations)
          }

          completedExplorations={
            completedExplorations
          }

          onBack={
            goToChildSpace
          }

          onStartAdventure={
            startExploration
          }
        />
      )}


      {screen ===
        'exploration' && (
        <AdventureFlow
          exploration={
            currentExploration
          }

          step={
            explorationStep
          }

          challengeIndex={
            challengeIndex
          }

          onBack={() =>
            setScreen(
              'adventures'
            )
          }

          onBeginMission={
            beginMission
          }

          onChallengeAnswer={
            handleChallengeAnswer
          }

          onEnjoymentAnswer={
            handleEnjoyment
          }

          onFavoritePartAnswer={
            handleFavoritePart
          }
        />
      )}


      {screen ===
        'profileGrew' && (
        <section className="profileGrew">

          <div className="profileGrewCard">

            <div className="profileGrewEmoji">
              🌱
            </div>

            <p className="eyebrow">
              Your Profile Grew
            </p>

            <h2>
              We learned something
              new about you,{' '}
              {childProfile.name.trim()}
              !
            </h2>

            {enjoymentResponse?.value ===
            0 ? (
              <p className="profileGrewIntro">
                Finding out what you
                don't enjoy is useful
                too. It helps us
                discover different
                adventures that may
                fit you better.
              </p>
            ) : (
              <p className="profileGrewIntro">
                Your Robot Builder
                adventure gave us
                stronger clues about
                the kinds of things
                you enjoy doing.
              </p>
            )}

            {growthSignals.length >
              0 && (
              <div className="growthSignalList">

                {growthSignals.map(
                  ({ signal }) => (
                    <div
                      className="growthSignal"
                      key={signal}
                    >

                      <span className="growthSignalEmoji">
                        {
                          signalEmojis[
                            signal
                          ]
                        }
                      </span>

                      <span>
                        {
                          signalLabels[
                            signal
                          ]
                        }
                      </span>

                      <span className="growthArrow">
                        ↑
                      </span>

                    </div>
                  )
                )}

              </div>
            )}

            <p className="profileGrewNote">
              Every adventure adds
              new evidence to your
              Growth Profile.
            </p>

            <div className="profileGrewActions">

              <button
                className="cta"
                onClick={() =>
                  setScreen(
                    'growthProfile'
                  )
                }
              >
                View Updated Profile
              </button>

              <button
                className="secondaryAction"
                onClick={
                  goToChildSpace
                }
              >
                Back to My Space
              </button>

            </div>

            {growthIntelligenceProfile && (
              <GrowthIntelligenceInspector
                profile={
                  growthIntelligenceProfile
                }

                evidenceEventCount={
                  evidenceEventCount
                }

                traits={
                  intelligenceTraits
                }

                domains={
                  intelligenceDomains
                }

                pathways={
                  intelligencePathways
                }

                careers={
                  intelligenceCareers
                }

                recommendations={
                  growthRecommendations
                }

                onReset={
                  resetTestData
                }
              />
            )}

          </div>

        </section>
      )}

    </main>
  )
}


// ============================================================
// DEVELOPMENT GROWTH INTELLIGENCE INSPECTOR
// ============================================================

function GrowthIntelligenceInspector({
  profile,
  evidenceEventCount,
  traits,
  domains,
  pathways,
  careers,
  recommendations = [],
  onReset,
}) {
  if (!profile) {
    return null
  }

  const rowStyle = {
    display: 'flex',
    justifyContent:
      'space-between',
    gap: '1rem',
    padding: '0.5rem 0',
    borderBottom:
      '1px solid #e4e7ee',
  }

  const valueStyle = {
    whiteSpace: 'nowrap',
    fontWeight: 700,
  }

  return (
    <details
      style={{
        maxWidth: '760px',
        margin: '2rem auto 0',
        padding: '1rem',
        border:
          '1px dashed #aeb6c7',
        borderRadius: '14px',
        background: '#f8f9fc',
        textAlign: 'left',
        color: '#172033',
      }}
    >

      <summary
        style={{
          cursor: 'pointer',
          fontWeight: 800,
        }}
      >
        🧪 Developer: Growth
        Intelligence Inspector
      </summary>

      <div
        style={{
          marginTop: '1rem',
          fontSize: '0.88rem',
          lineHeight: 1.45,
        }}
      >

        <div style={rowStyle}>
          <span>
            Evidence events
          </span>

          <span style={valueStyle}>
            {evidenceEventCount}
          </span>
        </div>

        <div style={rowStyle}>
          <span>
            Evidence observations
          </span>

          <span style={valueStyle}>
            {
              profile
                .evidenceSummary
                ?.observationCount ||
              0
            }
          </span>
        </div>

        <div style={rowStyle}>
          <span>
            Experiences represented
          </span>

          <span style={valueStyle}>
            {
              profile
                .evidenceSummary
                ?.experienceCount ||
              0
            }
          </span>
        </div>

        <div style={rowStyle}>
          <span>
            Source types represented
          </span>

          <span style={valueStyle}>
            {
              profile
                .evidenceSummary
                ?.sourceTypeCount ||
              0
            }
          </span>
        </div>


        <InspectorSection
          title="Level 2 — Traits"
          items={traits}
          renderValue={(item) =>
            `${item.score}/100 · ${item.confidence.label}`
          }
        />

        <InspectorSection
          title="Level 3 — Domains"
          items={domains}
          renderValue={(item) =>
            `${item.score}/100 · ${item.confidence.label}`
          }
        />

        <InspectorSection
          title="Level 4 — Pathways"
          items={pathways}
          renderValue={(item) =>
            `${item.score}/100 · ${item.confidence.label}`
          }
        />

        <InspectorSection
          title="Level 5 — Career Families"
          items={careers}
          renderValue={(item) =>
            `${item.relevance}/100 · ${item.status.label}`
          }
        />


        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop:
              '1px solid #d7dce6',
          }}
        >

          <strong>
            🎯 Recommendation Engine v1
          </strong>

          <p
            style={{
              margin:
                '0.35rem 0 0.8rem',
              color:
                '#68748a',
              fontSize:
                '0.78rem',
            }}
          >
            Experimental Grow
            recommendations based on
            Growth Profile, Student
            Intent, and Parent Goals.
          </p>

          {recommendations.length ===
          0 ? (
            <p>
              No recommendations yet.
            </p>
          ) : (
            recommendations.map(
              (
                recommendation,
                index
              ) => (
                <div
                  key={
                    recommendation
                      .experienceId
                  }
                  style={{
                    marginBottom:
                      '0.75rem',
                    padding:
                      '0.8rem',
                    border:
                      '1px solid #e1e5eb',
                    borderRadius:
                      '10px',
                    background:
                      '#ffffff',
                  }}
                >

                  <div
                    style={{
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      gap: '1rem',
                    }}
                  >

                    <strong>
                      {index + 1}.{' '}
                      {
                        recommendation
                          .emoji
                      }{' '}
                      {
                        recommendation
                          .title
                      }
                    </strong>

                    <span
                      style={{
                        whiteSpace:
                          'nowrap',
                        fontWeight:
                          800,
                      }}
                    >
                      {
                        recommendation
                          .score
                      }
                      /100
                    </span>

                  </div>

                  <div
                    style={{
                      marginTop:
                        '0.55rem',
                    }}
                  >
                    {
                      recommendation
                        .reasons
                        .map(
                          (
                            reason,
                            reasonIndex
                          ) => (
                            <div
                              key={
                                reasonIndex
                              }
                              style={{
                                marginTop:
                                  '0.3rem',
                                color:
                                  '#68748a',
                                fontSize:
                                  '0.78rem',
                                lineHeight:
                                  1.45,
                              }}
                            >
                              • {reason}
                            </div>
                          )
                        )
                    }
                  </div>

                  <div
                    style={{
                      marginTop:
                        '0.65rem',
                      display:
                        'flex',
                      flexWrap:
                        'wrap',
                      gap:
                        '0.4rem',
                    }}
                  >

                    <InspectorMatchBadge
                      label="Profile"
                      count={
                        recommendation
                          .matches
                          .profileSignals
                          .length
                      }
                    />

                    <InspectorMatchBadge
                      label="Student"
                      count={
                        recommendation
                          .matches
                          .studentIntents
                          .length
                      }
                    />

                    <InspectorMatchBadge
                      label="Parent"
                      count={
                        recommendation
                          .matches
                          .parentIntents
                          .length
                      }
                    />

                  </div>

                </div>
              )
            )
          )}

        </div>


        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop:
              '1px solid #d7dce6',
          }}
        >

          <strong>
            Developer Tools
          </strong>

          <p
            style={{
              margin:
                '0.35rem 0 0.75rem',
              color:
                '#68748a',
              fontSize:
                '0.78rem',
            }}
          >
            Clear all test evidence,
            intents, Journey items,
            and profile data and start
            a new persona from a
            completely clean state.
          </p>

          <button
            type="button"
            onClick={onReset}
            style={{
              padding:
                '0.55rem 0.8rem',
              border:
                '1px solid #b7bfce',
              borderRadius:
                '9px',
              background:
                '#ffffff',
              color:
                '#3f4c63',
              fontSize:
                '0.78rem',
              fontWeight:
                700,
              cursor:
                'pointer',
            }}
          >
            🧹 Reset Test Data
          </button>

        </div>

      </div>

    </details>
  )
}


// ============================================================
// INSPECTOR SECTION
// ============================================================

function InspectorSection({
  title,
  items,
  renderValue,
}) {
  return (
    <div
      style={{
        marginTop: '1.25rem',
      }}
    >

      <strong>
        {title}
      </strong>

      {items.length === 0 ? (
        <p>
          No evidence yet.
        </p>
      ) : (
        items.map(
          (item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                gap: '1rem',
                padding:
                  '0.5rem 0',
                borderBottom:
                  '1px solid #e4e7ee',
              }}
            >

              <span>
                {item.emoji
                  ? `${item.emoji} `
                  : ''}
                {item.label}
              </span>

              <span
                style={{
                  whiteSpace:
                    'nowrap',
                  fontWeight: 700,
                }}
              >
                {renderValue(
                  item
                )}
              </span>

            </div>
          )
        )
      )}

    </div>
  )
}


// ============================================================
// RECOMMENDATION MATCH BADGE
// ============================================================

function InspectorMatchBadge({
  label,
  count,
}) {
  const matched =
    count > 0

  return (
    <span
      style={{
        padding:
          '0.25rem 0.5rem',
        borderRadius:
          '999px',
        background:
          matched
            ? '#edf6ef'
            : '#f2f3f5',
        color:
          matched
            ? '#2d6845'
            : '#8a929d',
        fontSize:
          '0.68rem',
        fontWeight:
          700,
      }}
    >
      {matched ? '✓' : '—'}{' '}
      {label}

      {matched &&
        count > 1 &&
        ` (${count})`}
    </span>
  )
}


export default App
