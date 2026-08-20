import {
  useEffect,
  useState,
} from 'react'

import './App.css'

import { explorations } from './data/explorations'

import {
  buildGrowthPatternIntelligence,
} from './intelligence/growthPatternCorroborationEngine'

import {
  buildPatternPromotionRegistry,
} from './intelligence/growthPatternPromotionEngine'

import GrowthHome from './components/GrowthHome'
import DiscoveryFlow from './components/DiscoveryFlow'
import GrowthProfileView from './components/GrowthProfileView'
import ParentPerspectiveFlow from './components/ParentPerspectiveFlow'
import AdventuresHub from './components/AdventuresHub'
import AdventureFlow from './components/AdventureFlow'
import PostAdventureParentObservation from './components/PostAdventureParentObservation'
import GrowthIntelligenceInspector from './components/developer/GrowthIntelligenceInspector'

import {
  evidenceSourceTypes,
} from './data/growthTaxonomy'

import {
  buildGrowthProfile,
  getTopTraits,
  getTopDomains,
  getTopPathways,
  getTopCareerFamilies,
} from './intelligence/growthEngine'

import {
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
  guidedAdventureParentObservationQuestions,
} from './intelligence/guidedAdventureParentObservationAdapter'

import {
  parentPerspectiveQuestions,
} from './intelligence/parentPerspectiveAdapter'

import useParentPerspective from './features/parent/useParentPerspective'

import useDiscovery from './features/discovery/useDiscovery'

import useAdventureFlow from './features/adventures/useAdventureFlow'

import useJourney from './features/journey/useJourney'

import useGrowthIntents from './features/growth/useGrowthIntents'

import {
  getChildEvidenceId,
} from './utils/session'

import {
  getGrowthRecommendations,
} from './intelligence/growthRecommendationEngine'




import {
  buildExperienceCandidates,
} from './intelligence/experienceCandidateBuilder'


import {
  generateResearchStrategies,
} from './intelligence/researchStrategyGenerator'

import {
  buildResourceDiscoveryRequests,
} from './intelligence/resourceDiscoveryEngine'

import {
  evaluateDiscoveredResources,
} from './intelligence/resourceEvaluationEngine'

import {
  realResourceValidationFixtures,
} from './intelligence/resourceValidationFixtures'


import {
  createJourneyItem,
  journeyOrigins,
} from './intelligence/journeyModels'

import {
  findJourneyByExperience,
  saveJourneyItem,
} from './storage/journeyStorage'


import {
  buildResearchedJourneyEvidence,
} from './intelligence/researchedJourneyEvidenceAdapter'



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
    growthIntelligenceProfile,
    setGrowthIntelligenceProfile,
  ] = useState(null)

  const [
    evidenceEventCount,
    setEvidenceEventCount,
  ] = useState(0)

  // ==========================================================
  // DERIVED DATA
  // ==========================================================

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
  // ADVENTURE CONTROLLER
  // ==========================================================

  const adventure =
    useAdventureFlow({
      childProfile,

      initialCompletedExplorations:
        storedAppState
          ?.completedExplorations ||
        [],

      setScreen,

      persistGrowthEvidence,
    })

  const {
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
  } = adventure


  // ==========================================================
  // PARENT VIEW CONTROLLER
  // ==========================================================

  const parentView =
    useParentPerspective({
      childProfile,

      completedExplorations,

      initialComplete:
        storedAppState
          ?.parentPerspectiveComplete ||
        false,

      setScreen,

      setActiveExploration,

      setEvidenceSessionId,

      persistGrowthEvidence,
    })

  const {
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

    handlePostAdventureParentAnswer:
      handlePostAdventureParentAnswerFromParentView,

    skipPostAdventureParentObservation,

    markParentPerspectiveComplete,

    resetParentPerspective,
  } = parentView


  // ==========================================================
  // DISCOVERING YOU CONTROLLER
  // ==========================================================

  const discovery =
    useDiscovery({
      childProfile,

      initialComplete:
        storedAppState
          ?.discoveryComplete ||
        false,

      setScreen,

      goToChildSpace:
        () =>
          setScreen(
            'childSpace'
          ),

      persistGrowthEvidence,
    })

  const {
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
  } = discovery


  // ==========================================================
  // GROWTH INTENT CONTROLLER
  // ==========================================================

  const growthIntents =
    useGrowthIntents({
      childProfile,
    })

  const {
    studentGrowthIntents,

    parentGrowthIntents,

    restoreGrowthIntents,

    handleSaveStudentIntent,

    handleSaveParentIntent,

    resetGrowthIntents,
  } = growthIntents


  // ==========================================================
  // JOURNEY / GROW CONTROLLER
  // ==========================================================

  const journey =
    useJourney({
      childProfile,

      setScreen,

      persistGrowthEvidence,

      onStudentIntent:
        handleSaveStudentIntent,
    })

  const {
    journeyItems,

    completedJourneyInsight,

    restoreJourney,

    handleStartGrow,

    goToJourney,

    handleJourneyProgress,

    handleAddLearningItem,

    handleLearningItemStatus,

    handleLearningHelpRequest,
    handleLearningResourceFeedback,
    handleLearningSupportOutcome,

    handleCompleteJourney:
      handleCompleteJourneyBase,

    dismissCompletedJourneyInsight,

    resetJourney,
  } = journey


  // ==========================================================
  // MVP v0.7 — RESEARCHED EXPERIENCE EVIDENCE LOOP
  // ==========================================================
  //
  // useJourney continues to own Journey completion and the
  // existing generic reflection/completion evidence.
  //
  // For researched experiences, we add supplemental evidence
  // ONLY from explicit child reflection about what happened
  // when the activity became difficult.
  //
  // The recommendation, resource match, or candidate profile
  // never becomes evidence by itself.
  // ==========================================================

  const handleCompleteJourney =
    (
      journeyId,
      reflection
    ) => {
      const completedItem =
        handleCompleteJourneyBase(
          journeyId,
          reflection
        )

      if (
        !completedItem
          ?.researchedExperience
      ) {
        return completedItem
      }

      const researchedEvidence =
        buildResearchedJourneyEvidence({
          childId:
            getChildEvidenceId(
              childProfile
            ),

          journeyItem:
            completedItem,

          reflection,
        })

      if (
        researchedEvidence.length > 0
      ) {
        persistGrowthEvidence(
          researchedEvidence
        )
      }

      console.group(
        '↻ MVP v0.7 — Researched Experience Learning Loop'
      )

      console.log(
        'Completed researched experience:',
        completedItem
      )

      console.log(
        'Supplemental reflection evidence:',
        researchedEvidence
      )

      console.log(
        'Growth Intelligence rebuilt from the expanded evidence store.'
      )

      console.groupEnd()

      return completedItem
    }


  // ==========================================================
  // ==========================================================
  // MVP v0.8 — RAW EVIDENCE FOR PATTERN CORROBORATION
  // ==========================================================

  const currentChildEvidenceEvents =
    childProfile.name.trim()
      ? getEvidenceEvents({
          childId:
            getChildEvidenceId(
              childProfile
            ),
        })
      : []


  const holisticPatternIntelligence =
    buildGrowthPatternIntelligence({
      journeyItems,
      evidenceEvents:
        currentChildEvidenceEvents,
    })

  const holisticPatternPromotion =
    buildPatternPromotionRegistry(
      holisticPatternIntelligence
    )

  const promotedGrowthPatterns =
    holisticPatternIntelligence.patterns.filter(
      (pattern) =>
        holisticPatternPromotion.eligiblePatterns.some(
          (decision) =>
            decision.patternId === pattern.id
        )
    )


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
  // MVP v0.7 — RESEARCHED EXPERIENCE CANDIDATES
  // ==========================================================
  //
  // For this first child-facing UI, we use the validated
  // controlled-resource pipeline. Live provider research comes
  // later behind the same contracts.
  // ==========================================================

  const researchBriefsV07 =
    generateResearchStrategies({
      childProfile,
      growthProfile:
        growthIntelligenceProfile,
      studentIntents:
        studentGrowthIntents,
      parentIntents:
        parentGrowthIntents,
      journeyItems,
    })

  const discoveryRequestsV07 =
    buildResourceDiscoveryRequests(
      researchBriefsV07
    )

  const strengthenRequestV07 =
    discoveryRequestsV07.find(
      (request) =>
        request.strategy ===
        'strengthen'
    ) || null

  const evaluatedResourcesV07 =
    strengthenRequestV07
      ? evaluateDiscoveredResources(
          realResourceValidationFixtures,
          strengthenRequestV07
        )
      : []

  const researchedExperienceCandidates =
    strengthenRequestV07
      ? buildExperienceCandidates(
          evaluatedResourcesV07,
          strengthenRequestV07
        )
      : []


  // ==========================================================
  // MVP v0.7 — RESEARCHED EXPERIENCE -> JOURNEY
  // ==========================================================

  const handleAddResearchedExperienceToJourney =
    (candidate) => {
      if (
        !candidate?.id
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
            candidate.id,
        })

      if (existingJourney) {
        setScreen(
          'journey'
        )

        return existingJourney
      }

      const baseJourneyItem =
        createJourneyItem({
          childId,

          experienceId:
            candidate.id,

          title:
            candidate.title,

          emoji:
            candidate.emoji ||
            '🧭',

          description:
            candidate.mission ||
            '',

          origin:
            journeyOrigins
              .RECOMMENDATION,

          recommendation: {
            score:
              candidate
                .personalizationSnapshot
                ?.evaluation
                ?.score ??
              null,

            reasons: [
              candidate.whyItFits,
            ].filter(Boolean),

            matches: {
              buildsOn:
                candidate
                  .buildsOn ||
                [],

              practices:
                candidate
                  .practices ||
                [],

              strategy:
                candidate
                  .strategy ||
                null,
            },
          },
        })

      const journeyItem = {
        ...baseJourneyItem,

        researchedExperience: {
          candidateId:
            candidate.id,

          version:
            candidate.version,

          strategy:
            candidate.strategy,

          mission:
            candidate.mission,

          whyItFits:
            candidate.whyItFits,

          buildsOn:
            candidate.buildsOn ||
            [],

          practices:
            candidate.practices ||
            [],

          estimatedTime:
            candidate.estimatedTime ||
            null,

          materials:
            candidate.materials ||
            [],

          prerequisites:
            candidate.prerequisites ||
            [],

          activitySteps:
            candidate.activitySteps ||
            [],

          parentRole:
            candidate.parentRole ||
            null,

          reflectionPrompts:
            candidate.reflectionPrompts ||
            [],

          evidencePlan:
            candidate.evidencePlan ||
            null,

          sourceResource:
            candidate.sourceResource ||
            null,

          personalizationSnapshot:
            candidate.personalizationSnapshot ||
            null,
        },
      }

      saveJourneyItem(
        journeyItem
      )

      restoreJourney()

      console.group(
        '🧭 Researched Experience -> Journey'
      )

      console.log(
        'Added Journey Item:',
        journeyItem
      )

      console.groupEnd()

      setScreen(
        'journey'
      )

      return journeyItem
    }



  // ==========================================================
  // LOAD / RESTORE V0.4 LOCAL DATA
  // ==========================================================

  useEffect(
    () => {
      if (
        !childProfile.name.trim()
      ) {
        resetGrowthIntents()
        resetJourney()
        setGrowthIntelligenceProfile(null)
        setEvidenceEventCount(0)

        return
      }

      const childId =
        getChildEvidenceId(
          childProfile
        )

      // Restore Student + Parent Intent.

      restoreGrowthIntents()

      // Restore Journey.

      restoreJourney()

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
                  .PARENT_OBSERVATION &&
              event.source?.experienceId ===
                'parent_perspective'
          )

        if (hasDiscoveryEvidence) {
          markDiscoveryComplete()
        }

        if (hasParentEvidence) {
          markParentPerspectiveComplete()
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

    resetDiscovery()

    resetParentPerspective()

    resetAdventure()

    setGrowthIntelligenceProfile(null)
    setEvidenceEventCount(0)

    resetGrowthIntents()
    resetJourney()

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
  // PARENT EXPERIENCE OBSERVATION BRIDGE
  // ==========================================================

  const handlePostAdventureParentAnswer =
    (answer) =>
      handlePostAdventureParentAnswerFromParentView({
        answer,
        currentExploration,
        evidenceSessionId,
      })


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
          evidenceEvents={
            currentChildEvidenceEvents
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

          researchedExperienceCandidates={
            researchedExperienceCandidates
          }

          onAddResearchedExperienceToJourney={
            handleAddResearchedExperienceToJourney
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

          onDismissJourneyInsight={
            dismissCompletedJourneyInsight
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

          onAddLearningItem={
            handleAddLearningItem
          }

          onLearningItemStatus={
            handleLearningItemStatus
          }

          onLearningHelpRequest={
            handleLearningHelpRequest
          }

          onLearningResourceFeedback={
            handleLearningResourceFeedback
          }

          onLearningSupportOutcome={
            handleLearningSupportOutcome
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
          promotedPatterns={
            promotedGrowthPatterns
          }

          patternIntelligence={
            holisticPatternIntelligence
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

          experienceObservations={
            parentExperienceObservations
          }

          onAddExperienceObservation={
            startParentExperienceObservation
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

          experienceObservations={
            parentExperienceObservations
          }

          onAddExperienceObservation={
            startParentExperienceObservation
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

          experienceObservations={
            parentExperienceObservations
          }

          onAddExperienceObservation={
            startParentExperienceObservation
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

          onKidExperienceAnswer={
            handleGuidedKidExperienceAnswer
          }

          onGuidedStageComplete={
            handleGuidedStageComplete
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
        'postAdventureParentObservation' && (
        <PostAdventureParentObservation
          childName={
            childProfile.name.trim()
          }

          adventureTitle={
            currentExploration
              ?.title ||
            'this Adventure'
          }

          questions={
            guidedAdventureParentObservationQuestions
          }

          currentQuestionIndex={
            postAdventureParentQuestionIndex
          }

          currentQuestion={
            postAdventureParentComplete
              ? null
              : currentPostAdventureParentQuestion
          }

          onAnswer={
            handlePostAdventureParentAnswer
          }

          onSkip={
            skipPostAdventureParentObservation
          }

          onDone={() =>
            setScreen(
              'growthProfile'
            )
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


export default App
