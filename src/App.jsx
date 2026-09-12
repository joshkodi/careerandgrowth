import {
  useEffect,
  useState,
} from 'react'

import './App.css'
import './SynapStrideV0102.css'
import './SynapStrideV0119.css'
import './SynapStrideV01110.css'
import './FirstCustomerV01112.css'
import './WhySynapStrideV0116.css'
import './SynapStrideAuthV012.css'
import synapStrideMark from './assets/synapstride-mark.png'

import {
  createLocalAccount,
  validateLocalCredentials,
  createLocalSession,
  getLocalSession,
  getAccountForSession,
  clearLocalSession,
} from './services/localAuthStore'

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
  resetGrowthIntelligence,
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
  clearGrowthLoopData,
} from './storage/growthLoopStorage'

import {
  getFamilyStorageKey,
  migrateLegacyStorageKey,
  removeFamilyStorageKey,
} from './storage/familyStorage'

import {
  getChildEvidenceId,
} from './utils/session'

import {
  getGrowthRecommendations,
} from './intelligence/growthRecommendationEngine'

import {
  buildGrowthProfileUnderstanding,
} from './intelligence/growthProfileUnderstanding'




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
  clearJourneyItems,
} from './storage/journeyStorage'


import {
  buildResearchedJourneyEvidence,
} from './intelligence/researchedJourneyEvidenceAdapter'



// ============================================================
// V0.4 APP STATE PERSISTENCE
// ============================================================

const APP_STATE_STORAGE_KEY =
  'careerGrowth.v04.appState'


const readJsonStorage = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error(`Unable to restore ${key}.`, error)
    return null
  }
}



const defaultChildProfile = {
  name: '',
  age: '11',
  grade: '6th Grade',
}


const readStoredAppState = (familyId = null) => {
  try {
    const raw =
      localStorage.getItem(
        migrateLegacyStorageKey(
          APP_STATE_STORAGE_KEY,
          familyId
        )
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
      'Unable to restore SynapStride app state.',
      error
    )

    return null
  }
}


const storedAuthSession =
  getLocalSession()

const storedParentAccount =
  getAccountForSession(storedAuthSession)

const storedAppState =
  readStoredAppState(
    storedAuthSession?.familyId || null
  )


// ============================================================
// APP
// ============================================================

function App() {

  useEffect(() => {
    document.title = 'SynapStride'
  }, [])


  const [screen, setScreen] =
    useState(() => {
      if (!storedAuthSession?.signedIn) {
        return 'landing'
      }

      if (!storedAppState?.childProfile?.name?.trim()) {
        return 'parentSetup'
      }

      return storedAppState.screen === 'journey'
        ? 'journey'
        : 'childSpace'
    })


  const [
    myGrowthSection,
    setMyGrowthSection,
  ] = useState('overview')

  const [whyReturnScreen, setWhyReturnScreen] =
    useState('landing')

  const [authSession, setAuthSession] =
    useState(storedAuthSession)

  const [parentAccount, setParentAccount] =
    useState(storedParentAccount)

  const [authForm, setAuthForm] =
    useState({ email: '', password: '', confirmPassword: '' })

  const [authMessage, setAuthMessage] =
    useState('')


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

  const [
    profileGrowthSource,
    setProfileGrowthSource,
  ] = useState(null)

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

      onParentPerspectiveComplete:
        () =>
          setProfileGrowthSource(
            'parent'
          ),
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

    growthActivities,
    calendarActivities,
    upcomingGrowthActivities,

    completedJourneyInsight,
    completedGrowthActivityInsight,

    restoreJourney,

    handleStartGrow,

    goToJourney,

    handleJourneyProgress,

    handleAddLearningItem,

    handleLearningItemStatus,

    handleLearningHelpRequest,
    handleLearningResourceFeedback,
    handleLearningSupportOutcome,

    handleSaveGrowthOpportunity,
    handleUpdateGrowthActivity,
    handleGrowthActivityStatus,
    handleScheduleGrowthActivity,
    handleGrowthActivityReflection,

    handleCompleteJourney:
      handleCompleteJourneyBase,

    dismissCompletedJourneyInsight,
    dismissCompletedGrowthActivityInsight,

    resetJourney,
  } = journey


  // ==========================================================
  // MVP v0.9 — GENERIC JOURNEY ITEM UPDATE BRIDGE
  // ==========================================================

  const handleUpdateJourneyItem =
    (journeyId, updates = {}) => {
      const currentItem =
        journeyItems.find(
          (item) => item.id === journeyId
        )

      if (!currentItem || !updates || typeof updates !== 'object') {
        return null
      }

      const updatedItem = {
        ...currentItem,
        ...updates,
        id: currentItem.id,
        childId: currentItem.childId,
        updatedAt: new Date().toISOString(),
      }

      saveJourneyItem(updatedItem)
      restoreJourney()

      return updatedItem
    }


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
  // MVP v0.11 — UNIFIED PROFILE UNDERSTANDING
  // ==========================================================
  //
  // Profile is a synthesized interpretation of the same underlying
  // evidence used across Discover, Parent Perspective, Journey,
  // School & Learning, and Interests & Activities.
  //
  // It does not persist a second profile and it does not turn
  // recommendations into evidence.
  // ==========================================================

  const profileUnderstanding =
    buildGrowthProfileUnderstanding({
      child: {
        id:
          childProfile.name.trim()
            ? getChildEvidenceId(
                childProfile
              )
            : null,

        name:
          childProfile.name.trim() ||
          null,

        age:
          childProfile.age || null,

        grade:
          childProfile.grade || null,
      },

      evidenceEvents:
        currentChildEvidenceEvents,

      journeyItems,

      studentIntents:
        studentGrowthIntents,

      parentIntents:
        parentGrowthIntents,

      growthProfile:
        growthIntelligenceProfile,

      promotionRegistry:
        holisticPatternPromotion,

      recommendationSet: {
        items:
          growthRecommendations,
      },
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
        getFamilyStorageKey(
          APP_STATE_STORAGE_KEY,
          authSession?.familyId
        ),
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
      authSession?.familyId,
    ]
  )


  // ==========================================================
  // DEVELOPER RESET
  // ==========================================================

  const resetTestData = () => {
    const confirmed =
      window.confirm(
        'Reset all SynapStride test data?\n\nThis will remove the current child, Discovery responses, Parent Perspective, Adventures, Growth Intents, Journey items, and all stored Growth Intelligence evidence.'
      )

    if (!confirmed) {
      return
    }

    // Reset only the active family's workspace. Never clear other
    // local families or authentication accounts.
    removeFamilyStorageKey(
      APP_STATE_STORAGE_KEY,
      authSession?.familyId
    )
    resetGrowthIntelligence()
    clearJourneyItems()
    clearGrowthLoopData()

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
  // LOCAL AUTH FOUNDATION (Cognito-ready UI contract)
  // ==========================================================

  const handleAuthFieldChange = (event) => {
    const { name, value } = event.target
    setAuthForm((current) => ({ ...current, [name]: value }))
    setAuthMessage('')
  }


  const completeLocalSignIn = (account) => {
    // Persist the authenticated family first, then reload the local MVP shell.
    // This guarantees every hook/controller initializes from the newly selected
    // family's workspace rather than retaining the previous family's memory state.
    createLocalSession(account)
    window.location.reload()
  }


  const handleEmailSignUp = async (event) => {
    event.preventDefault()

    const email = authForm.email.trim().toLowerCase()
    const password = authForm.password
    const confirmPassword = authForm.confirmPassword

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setAuthMessage('Enter a valid email address.')
      return
    }

    if (password.length < 8) {
      setAuthMessage('Use at least 8 characters for your password.')
      return
    }

    if (password !== confirmPassword) {
      setAuthMessage('The passwords do not match.')
      return
    }

    const result = await createLocalAccount({ email, password })

    if (!result.ok && result.code === 'ACCOUNT_EXISTS') {
      setAuthMessage('An account already exists for this email. Sign in instead.')
      return
    }

    if (!result.ok) {
      setAuthMessage('We could not create the local account. Please try again.')
      return
    }

    completeLocalSignIn(result.account)
  }


  const handleEmailSignIn = async (event) => {
    event.preventDefault()

    const email = authForm.email.trim().toLowerCase()
    const password = authForm.password

    if (!email || !password) {
      setAuthMessage('Enter your email and password.')
      return
    }

    const result = await validateLocalCredentials({ email, password })

    if (!result.ok && result.code === 'ACCOUNT_NOT_FOUND') {
      setAuthMessage('No SynapStride account was found for that email. Choose Get Started to create one.')
      return
    }

    if (!result.ok) {
      setAuthMessage('That password does not match this account.')
      return
    }

    completeLocalSignIn(result.account)
  }


  const showProviderComingSoon = (provider) => {
    setAuthMessage(
      `${provider} sign-in is ready in the UI and will be connected through Amazon Cognito. Use email for the local MVP.`
    )
  }


  const handleSignOut = (event) => {
    // Make sign-out deterministic no matter where it is triggered from.
    // In particular, the sidebar account menu can sit inside other clickable
    // navigation surfaces, so prevent the click from being reused by them.
    event?.preventDefault?.()
    event?.stopPropagation?.()

    clearLocalSession()

    // Clear all in-memory account/session context as well as persisted session.
    // Product data remains untouched so the same family is restored after
    // a successful sign-in.
    setAuthSession(null)
    setParentAccount(null)
    setChildProfile(defaultChildProfile)
    resetDiscovery()
    resetParentPerspective()
    resetAdventure()
    resetGrowthIntents()
    resetJourney()
    setGrowthIntelligenceProfile(null)
    setEvidenceEventCount(0)
    setAuthForm({ email: '', password: '', confirmPassword: '' })
    setAuthMessage('')
    setWhyReturnScreen('landing')
    setScreen('signIn')
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


  const goToParentSpace = () => {
    setScreen('parentSpace')
  }


  const openParentSection =
    (section = 'overview') => {
      if (section === 'observation') {
        startParentPerspective()
        return
      }

      goToParentSpace()
    }


  const openMyGrowthSection =
    (section = 'overview') => {
      setMyGrowthSection(section === 'experiences' ? 'activities' : section)
      setScreen('journey')
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
    [
      'childSpace',
      'journey',
      'discovery',
      'growthProfile',
      'parentSpace',
      'settings',
      'parentPerspectiveIntro',
      'parentPerspective',
      'parentPerspectiveComplete',
    ].includes(screen)

  return (
    <main
      className={
        useGrowthShell
          ? 'page pageGrowthShell'
          : 'page'
      }
    >

      {screen === 'landing' && (
        <AuthWelcome
          onGetStarted={() => {
            setAuthMessage('')
            setScreen('signUp')
          }}
          onSignIn={() => {
            setAuthMessage('')
            setScreen('signIn')
          }}
          onWhy={() => {
            setWhyReturnScreen('landing')
            setScreen('whySynapStride')
          }}
        />
      )}


      {screen === 'signUp' && (
        <AuthAccountScreen
          mode="signup"
          authForm={authForm}
          message={authMessage}
          onChange={handleAuthFieldChange}
          onSubmit={handleEmailSignUp}
          onBack={() => setScreen('landing')}
          onSwitch={() => {
            setAuthMessage('')
            setScreen('signIn')
          }}
          onProvider={showProviderComingSoon}
        />
      )}


      {screen === 'signIn' && (
        <AuthAccountScreen
          mode="signin"
          authForm={authForm}
          message={authMessage}
          onChange={handleAuthFieldChange}
          onSubmit={handleEmailSignIn}
          onBack={() => setScreen('landing')}
          onSwitch={() => {
            setAuthMessage('')
            setScreen('signUp')
          }}
          onProvider={showProviderComingSoon}
        />
      )}


      {screen === 'whySynapStride' && (
        whyReturnScreen === 'landing' ? (
          <WhySynapStride
            childProfile={childProfile}
            onBack={() => setScreen('landing')}
            onGetStarted={() => setScreen('signUp')}
          />
        ) : (
          <BppWorkspaceShell
            activeSection="why"
            childProfile={childProfile}
            activeJourneyCount={journeyItems.filter((item) => item.status !== 'completed').length}
            onHome={goToChildSpace}
            onJourney={() => openMyGrowthSection('overview')}
            activeGrowthSection={myGrowthSection}
            onGrowthSection={openMyGrowthSection}
            onExplore={() => openMyGrowthSection('activities')}
            onDiscover={startDiscovery}
            onProfile={() => setScreen('growthProfile')}
            onParent={goToParentSpace}
            onParentSection={openParentSection}
            onWhySynapStride={() => { setWhyReturnScreen(screen); setScreen('whySynapStride') }}
            onSettings={() => setScreen('settings')}
            onSignOut={handleSignOut}
          >
            <WhySynapStride
              childProfile={childProfile}
              embedded
              onBack={() => setScreen(whyReturnScreen)}
              onGetStarted={goToChildSpace}
            />
          </BppWorkspaceShell>
        )
      )}


      {screen ===
        'parentSetup' && (
        <section className="synChildSetupV012">
          <div className="synAuthBrandV012">
            <img src={synapStrideMark} alt="" />
            <strong>Synap<span>Stride</span></strong>
          </div>

          <div className="synChildSetupCardV012">
            <button
              type="button"
              className="synAuthBackV012"
              onClick={handleSignOut}
            >
              ← Back
            </button>

            <div className="synChildSetupIconV012" aria-hidden="true">🌱</div>
            <p className="synAuthEyebrowV012">ONE QUICK STEP</p>
            <h1>Let&apos;s create your child&apos;s space.</h1>
            <p className="synAuthLeadV012">
              Just the basics for now. SynapStride will learn naturally as they learn, explore and try things.
            </p>

            <form className="synAuthFormV012" onSubmit={handleParentSetupSubmit}>
              <label>
                First name or nickname
                <input
                  type="text"
                  name="name"
                  value={childProfile.name}
                  onChange={handleProfileChange}
                  placeholder="Noah"
                  autoFocus
                  required
                />
              </label>

              <label>
                Age
                <select
                  name="age"
                  value={childProfile.age}
                  onChange={handleProfileChange}
                >
                  {Array.from({ length: 13 }, (_, index) => {
                    const age = index + 5
                    return <option key={age} value={age}>{age}</option>
                  })}
                </select>
              </label>

              <button className="synAuthPrimaryV012" type="submit">
                {childProfile.name.trim() ? `Enter ${childProfile.name.trim()}'s Space →` : 'Enter Child Space →'}
              </button>
            </form>

            <p className="synAuthFinePrintV012">
              You can add interests, parent perspective, location and preferences later.
            </p>
          </div>
        </section>
      )}

      {(screen === 'childSpace' ||
        screen === 'journey') && (
        <BppWorkspaceShell
          activeSection={
            screen === 'journey'
              ? 'journey'
              : 'home'
          }
          childProfile={childProfile}
          activeJourneyCount={
            journeyItems.filter(
              (item) => item.status !== 'completed'
            ).length
          }
          onHome={goToChildSpace}
          onJourney={() =>
            openMyGrowthSection('overview')
          }
          activeGrowthSection={myGrowthSection}
          onGrowthSection={openMyGrowthSection}
          onExplore={() =>
            openMyGrowthSection('activities')
          }
          onDiscover={startDiscovery}
          onProfile={() =>
            setScreen('growthProfile')
          }
          onParent={
            goToParentSpace
          }
          onWhySynapStride={() => { setWhyReturnScreen(screen); setScreen('whySynapStride') }}
          onSettings={() =>
            setScreen('settings')
          }
          onSignOut={handleSignOut}
        >
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

            exploreRecommendations={
              recommendations
            }

            exploreCatalog={
              Object.values(explorations)
            }

            onSaveGrowthOpportunity={
              handleSaveGrowthOpportunity
            }

            onStartAdventure={
              startExploration
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

            parentIntents={
              parentGrowthIntents
            }

            journeyItems={
              journeyItems
            }

            growthActivities={
              growthActivities
            }

            calendarActivities={
              calendarActivities
            }

            upcomingGrowthActivities={
              upcomingGrowthActivities
            }

            onGrowthActivityStatus={
              handleGrowthActivityStatus
            }

            onUpdateGrowthActivity={
              handleUpdateGrowthActivity
            }

            onScheduleGrowthActivity={
              handleScheduleGrowthActivity
            }

            onGrowthActivityReflection={
              handleGrowthActivityReflection
            }

            completedJourneyInsight={
              completedJourneyInsight
            }

            completedGrowthActivityInsight={
              completedGrowthActivityInsight
            }

            onDismissJourneyInsight={
              dismissCompletedJourneyInsight
            }

            onDismissGrowthActivityInsight={
              dismissCompletedGrowthActivityInsight
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

            onJourney={() =>
              openMyGrowthSection('overview')
            }

            requestedGrowthView={
              myGrowthSection
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

            onUpdateJourneyItem={
              handleUpdateJourneyItem
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
              openMyGrowthSection('activities')
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
        </BppWorkspaceShell>
      )}


      {screen ===
        'discovery' && (
        <BppWorkspaceShell
          activeSection="profile"
          childProfile={childProfile}
          activeJourneyCount={
            journeyItems.filter(
              (item) => item.status !== 'completed'
            ).length
          }
          onHome={goToChildSpace}
          onJourney={() =>
            openMyGrowthSection('overview')
          }
          activeGrowthSection={myGrowthSection}
          onGrowthSection={openMyGrowthSection}
          onExplore={() =>
            openMyGrowthSection('activities')
          }
          onDiscover={startDiscovery}
          onProfile={() =>
            setScreen('growthProfile')
          }
          onParent={
            goToParentSpace
          }
          onWhySynapStride={() => { setWhyReturnScreen(screen); setScreen('whySynapStride') }}
          onSettings={() =>
            setScreen('settings')
          }
          onSignOut={handleSignOut}
        >
          <DiscoveryFlow
            childProfile={childProfile}
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            currentQuestion={currentQuestion}
            onBack={() => {
              if (currentQuestionIndex === 0) {
                setScreen('growthProfile')
                return
              }

              handleDiscoveryBack()
            }}
            onAnswer={handleAnswer}
          />
        </BppWorkspaceShell>
      )}


      {screen ===
        'discoveryComplete' && (
        <BppWorkspaceShell
          activeSection="profile"
          childProfile={childProfile}
          activeJourneyCount={
            journeyItems.filter(
              (item) => item.status !== 'completed'
            ).length
          }
          onHome={goToChildSpace}
          onJourney={() =>
            openMyGrowthSection('overview')
          }
          activeGrowthSection={myGrowthSection}
          onGrowthSection={openMyGrowthSection}
          onExplore={() =>
            openMyGrowthSection('activities')
          }
          onDiscover={startDiscovery}
          onProfile={() =>
            setScreen('growthProfile')
          }
          onParent={
            goToParentSpace
          }
          onWhySynapStride={() => { setWhyReturnScreen(screen); setScreen('whySynapStride') }}
          onSettings={() =>
            setScreen('settings')
          }
          onSignOut={handleSignOut}
        >
          <section className="handoff">

            <div className="handoffCard">

              <div className="handoffEmoji">
                🌱
              </div>

              <p className="eyebrow">
                YOUR PROFILE GREW
              </p>

              <h2>
                Thanks, {childProfile.name.trim()}.
                We learned a little more about you.
              </h2>

              <p className="handoffText">
                What you shared is now part of your
                evolving Profile — alongside what you
                try, learn, reflect on, and what people
                who know you notice.
              </p>

              <p className="handoffText">
                These are clues, not permanent labels.
                As you grow and try new things, your
                Profile can grow and change too.
              </p>

              <button
                className="cta"
                onClick={() =>
                  setScreen(
                    'growthProfile'
                  )
                }
              >
                See What Changed →
              </button>

            </div>

          </section>
        </BppWorkspaceShell>
      )}


      {screen ===
        'growthProfile' && (
        <BppWorkspaceShell
          activeSection="profile"
          childProfile={childProfile}
          activeJourneyCount={
            journeyItems.filter(
              (item) => item.status !== 'completed'
            ).length
          }
          onHome={goToChildSpace}
          onJourney={() =>
            openMyGrowthSection('overview')
          }
          activeGrowthSection={myGrowthSection}
          onGrowthSection={openMyGrowthSection}
          onExplore={() =>
            openMyGrowthSection('activities')
          }
          onDiscover={startDiscovery}
          onProfile={() =>
            setScreen('growthProfile')
          }
          onParent={
            goToParentSpace
          }
          onWhySynapStride={() => { setWhyReturnScreen(screen); setScreen('whySynapStride') }}
          onSettings={() =>
            setScreen('settings')
          }
          onSignOut={handleSignOut}
        >
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

                    profileUnderstanding={
                      profileUnderstanding
                    }

                    profileGrowthSource={
                      profileGrowthSource
                    }

                    onContinueDiscover={
                      startDiscovery
                    }

                    growthActivities={
                      growthActivities
                    }

                    onSaveGrowthOpportunity={
                      handleSaveGrowthOpportunity
                    }
          
                    onBack={
                      goToChildSpace
                    }
          
                    onExploreAdventures={() =>
                      openMyGrowthSection('activities')
                    }
          
                  />
        </BppWorkspaceShell>
      )}


      {screen ===
        'parentSpace' && (
        <BppWorkspaceShell
          activeSection="parent"
          activeParentSection="overview"
          childProfile={childProfile}
          activeJourneyCount={
            journeyItems.filter(
              (item) => item.status !== 'completed'
            ).length
          }
          onHome={goToChildSpace}
          onJourney={() =>
            openMyGrowthSection('overview')
          }
          activeGrowthSection={myGrowthSection}
          onGrowthSection={openMyGrowthSection}
          onExplore={() =>
            openMyGrowthSection('activities')
          }
          onDiscover={startDiscovery}
          onProfile={() => setScreen('growthProfile')}
          onParent={goToParentSpace}
          onParentSection={openParentSection}
          onWhySynapStride={() => { setWhyReturnScreen(screen); setScreen('whySynapStride') }}
          onSettings={() => setScreen('settings')}
          onSignOut={handleSignOut}
        >
          <ParentOverview
            childProfile={childProfile}
            profileUnderstanding={profileUnderstanding}
            promotedPatterns={promotedGrowthPatterns}
            recommendations={growthRecommendations}
            journeyItems={journeyItems}
            parentPerspectiveComplete={parentPerspectiveComplete}
            onAddObservation={startParentPerspective}
            onWhySynapStride={() => { setWhyReturnScreen('parentSpace'); setScreen('whySynapStride') }}
          />
        </BppWorkspaceShell>
      )}


      {screen ===
        'parentPerspectiveIntro' && (
        <BppWorkspaceShell
          activeSection="parent"
          activeParentSection="observation"
          childProfile={childProfile}
          activeJourneyCount={
            journeyItems.filter(
              (item) => item.status !== 'completed'
            ).length
          }
          onHome={goToChildSpace}
          onJourney={() => openMyGrowthSection('overview')}
          activeGrowthSection={myGrowthSection}
          onGrowthSection={openMyGrowthSection}
          onExplore={() => openMyGrowthSection('activities')}
          onDiscover={startDiscovery}
          onProfile={() => setScreen('growthProfile')}
          onParent={goToParentSpace}
          onParentSection={openParentSection}
          onWhySynapStride={() => { setWhyReturnScreen(screen); setScreen('whySynapStride') }}
          onSettings={() => setScreen('settings')}
          onSignOut={handleSignOut}
        >
          <ParentPerspectiveFlow
            childProfile={childProfile}
            questions={parentPerspectiveQuestions}
            currentQuestionIndex={parentQuestionIndex}
            currentQuestion={currentParentQuestion}
            onBack={handleParentPerspectiveBack}
            onAnswer={handleParentAnswer}
            onFinish={goToParentSpace}
          />
        </BppWorkspaceShell>
      )}


      {screen ===
        'parentPerspective' && (
        <BppWorkspaceShell
          activeSection="parent"
          activeParentSection="observation"
          childProfile={childProfile}
          activeJourneyCount={
            journeyItems.filter(
              (item) => item.status !== 'completed'
            ).length
          }
          onHome={goToChildSpace}
          onJourney={() => openMyGrowthSection('overview')}
          activeGrowthSection={myGrowthSection}
          onGrowthSection={openMyGrowthSection}
          onExplore={() => openMyGrowthSection('activities')}
          onDiscover={startDiscovery}
          onProfile={() => setScreen('growthProfile')}
          onParent={goToParentSpace}
          onParentSection={openParentSection}
          onWhySynapStride={() => { setWhyReturnScreen(screen); setScreen('whySynapStride') }}
          onSettings={() => setScreen('settings')}
          onSignOut={handleSignOut}
        >
          <ParentPerspectiveFlow
            childProfile={childProfile}
            questions={parentPerspectiveQuestions}
            currentQuestionIndex={parentQuestionIndex}
            currentQuestion={currentParentQuestion}
            onBack={handleParentPerspectiveBack}
            onAnswer={handleParentAnswer}
            onFinish={goToParentSpace}
          />
        </BppWorkspaceShell>
      )}


      {screen ===
        'parentPerspectiveComplete' && (
        <BppWorkspaceShell
          activeSection="parent"
          activeParentSection="observation"
          childProfile={childProfile}
          activeJourneyCount={
            journeyItems.filter(
              (item) => item.status !== 'completed'
            ).length
          }
          onHome={goToChildSpace}
          onJourney={() => openMyGrowthSection('overview')}
          activeGrowthSection={myGrowthSection}
          onGrowthSection={openMyGrowthSection}
          onExplore={() => openMyGrowthSection('activities')}
          onDiscover={startDiscovery}
          onProfile={() => setScreen('growthProfile')}
          onParent={goToParentSpace}
          onParentSection={openParentSection}
          onWhySynapStride={() => { setWhyReturnScreen(screen); setScreen('whySynapStride') }}
          onSettings={() => setScreen('settings')}
          onSignOut={handleSignOut}
        >
          <ParentPerspectiveFlow
            childProfile={childProfile}
            questions={parentPerspectiveQuestions}
            currentQuestionIndex={parentQuestionIndex}
            currentQuestion={null}
            onBack={handleParentPerspectiveBack}
            onAnswer={handleParentAnswer}
            onFinish={goToParentSpace}
          />
        </BppWorkspaceShell>
      )}


      {screen ===
        'settings' && (
        <BppWorkspaceShell
          activeSection="settings"
          childProfile={childProfile}
          activeJourneyCount={
            journeyItems.filter(
              (item) => item.status !== 'completed'
            ).length
          }
          onHome={goToChildSpace}
          onJourney={() => openMyGrowthSection('overview')}
          activeGrowthSection={myGrowthSection}
          onGrowthSection={openMyGrowthSection}
          onExplore={() => openMyGrowthSection('activities')}
          onDiscover={startDiscovery}
          onProfile={() => setScreen('growthProfile')}
          onParent={goToParentSpace}
          onParentSection={openParentSection}
          onWhySynapStride={() => { setWhyReturnScreen(screen); setScreen('whySynapStride') }}
          onSettings={() => setScreen('settings')}
          onSignOut={handleSignOut}
        >
          <SettingsView
            childProfile={childProfile}
            profile={growthIntelligenceProfile}
            evidenceEventCount={evidenceEventCount}
            traits={intelligenceTraits}
            domains={intelligenceDomains}
            pathways={intelligencePathways}
            careers={intelligenceCareers}
            recommendations={growthRecommendations}
            parentAccount={parentAccount}
            onSignOut={handleSignOut}
            onReset={resetTestData}
          />
        </BppWorkspaceShell>
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
            openMyGrowthSection('activities')
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


          </div>

        </section>
      )}

    </main>
  )
}



function WhySynapStride({ childProfile, onBack, onGetStarted, embedded = false }) {
  const childName = childProfile?.name?.trim() || 'your child'

  const kidActions = [
    {
      icon: 'book',
      tone: 'violet',
      title: 'LEARN',
      text: 'Get unstuck, understand something better, practice, and find resources that fit.',
      visual: '📝',
    },
    {
      icon: 'rocket',
      tone: 'blue',
      title: 'EXPLORE',
      text: 'Follow your curiosity and discover activities, places, experiences and topics worth trying.',
      visual: '🪐',
    },
    {
      icon: 'tools',
      tone: 'green',
      title: 'TRY & BUILD',
      text: 'Turn an interest into a project, challenge, creation or real-world experience.',
      visual: '🤖',
    },
    {
      icon: 'sprout',
      tone: 'orange',
      title: 'DISCOVER YOURSELF',
      text: 'See patterns in what you enjoy, return to and keep working at.',
      visual: '🌱',
    },
    {
      icon: 'star',
      tone: 'violet',
      title: 'GET YOUR NEXT STEP',
      text: 'Get a personalized idea for what may be worth doing next — and why.',
      visual: '🧭',
    },
  ]

  const parentNow = ['Schoolwork & getting unstuck', 'A new curiosity', 'Finding an activity', 'Trying a project']
  const parentLearn = ['What clicked?', 'What did they return to?', 'What kind of support helped?', 'What did they want more of?']
  const compareRows = [
    ['Answers the current prompt', 'Helps now and learns from what happens'],
    ['General-purpose conversation', `Built around ${childName}'s ongoing growth journey`],
    ['Context is mostly supplied in the interaction', 'Connects learning, interests, activities, reflections and parent observations'],
    ['Waits for the next prompt', 'Can increasingly surface what may be worth trying next'],
    ['Optimizes the current interaction', 'Balances short-term support with long-term growth'],
    
  ]

  const loop = [
    ['book', 'LEARN', 'Gain knowledge'],
    ['telescope', 'EXPLORE', 'Follow curiosity'],
    ['tools', 'TRY', 'Take action'],
    ['chat', 'REFLECT', 'Think & share'],
    ['brain', 'UNDERSTAND', 'Connect the signals'],
    ['compass', 'GUIDE NEXT', 'Personalized direction'],
  ]

  return (
    <section className={`synWhyPageV0116 ${embedded ? 'embedded' : ''}`}>
      {!embedded && (
        <button type="button" className="synWhyBackV0116" onClick={onBack}>← Back</button>
      )}

      <header className="synWhyHeroV0116">
        <div className="synWhyKidPortraitV0116" aria-hidden="true"><span>🧒</span><i>✦</i><b>🚀</b></div>
        <div className="synWhyHeroCopyV0116">
          <h1>Why SynapStride?</h1>
          <h2>A growth guide that learns what helps — today and over time.</h2>
          <p>SynapStride learns from everyday learning, interests, activities and reflections — then turns those signals into guidance for what may be worth trying next.</p>
        </div>
        <div className="synWhyParentPortraitV0116" aria-hidden="true"><span>👩</span><i>♥</i><b>✦</b></div>
      </header>

      <div className="synWhyMainGridV0116">
        <section className="synWhyKidsPanelV0116">
          <div className="synWhySectionTitleV0116 kids">
            <span className="synWhyTitleIconV0116"><SynIcon name="star" /></span>
            <div><small>FOR KIDS</small><h2>Learn. Explore. Try things. Have fun.</h2></div>
          </div>
          <div className="synWhyKidActionsV0116">
            {kidActions.map((item) => (
              <article className="synWhyKidActionV0116" key={item.title}>
                <span className={`synWhyActionIconV0116 ${item.tone}`}><SynIcon name={item.icon} /></span>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
                <span className="synWhyActionVisualV0116" aria-hidden="true">{item.visual}</span>
              </article>
            ))}
          </div>
          <div className="synWhyKidsPromiseV0116"><span>♡</span><strong>Do interesting things. SynapStride learns with you.</strong></div>
        </section>

        <section className="synWhyParentsPanelV0116">
          <div className="synWhySectionTitleV0116 parents">
            <span className="synWhyTitleIconV0116"><SynIcon name="people" /></span>
            <div><small>FOR PARENTS</small><h2>Useful now. Smarter over time.</h2></div>
          </div>

          <div className="synWhyParentJourneyV0116">
            <article><h3>HELP WITH WHAT'S<br />HAPPENING TODAY</h3>{parentNow.map((x) => <p key={x}><span>✓</span>{x}</p>)}</article>
            <div className="synWhyJourneyArrowV0116">→</div>
            <article><h3>LEARN FROM<br />THE EXPERIENCE</h3>{parentLearn.map((x) => <p key={x}><span>●</span>{x}</p>)}</article>
            <div className="synWhyJourneyArrowV0116">→</div>
            <article className="synWhyUnderstandCardV0116"><h3>UNDERSTAND &amp; GUIDE<br />OVER TIME</h3><div>Connect the signals</div><b>↓</b><div>One evolving picture</div><b>↓</b><div>Better next-step guidance</div></article>
          </div>

          <div className="synWhyEverydayV0116"><span>🌱</span><strong>Help with today's moment. Learn from it. Use it to guide tomorrow.</strong></div>

          <section className="synWhyGuideCardV01161">
            <div className="synWhyGuideIntroV01161">
              <small>YOUR CHILD'S GROWTH GUIDE</small>
              <h3>One guide that learns more as the journey grows.</h3>
              <p>SynapStride brings together four useful roles — helping with what matters now while building context for what comes next.</p>
            </div>
            <div className="synWhyGuideRolesV01161">
              <div><span>⌕</span><strong>Concierge</strong><small>Finds useful options</small></div>
              <div><span>↗</span><strong>Coach</strong><small>Helps make progress</small></div>
              <div><span>◇</span><strong>Mentor</strong><small>Guides with context</small></div>
              <div><span>∞</span><strong>Growth OS</strong><small>Connects &amp; learns over time</small></div>
            </div>
          </section>

          <div className="synWhyDifferenceV0116">
            <h3>HOW SYNAPSTRIDE IS DIFFERENT</h3>
            <div className="synWhyCompareTableV0116">
              <div className="head generic">Generic AI assistants (ChatGPT, Gemini, etc.)</div><div className="head synap">SynapStride</div>
              {compareRows.flatMap(([left, right], index) => [
                <div className="cell generic" key={`l-${index}`}><span>×</span>{left}</div>,
                <div className="cell synap" key={`r-${index}`}><span>✓</span>{right}</div>,
              ])}
            </div>
          </div>
        </section>
      </div>

      <div className="synWhyBottomGridV0116">
        <section className="synWhyLoopV0116">
          <h2>THE SYNAPSTRIDE LOOP</h2>
          <div className="synWhyLoopStepsV0116">
            {loop.map(([icon, title, subtitle], index) => (
              <div className="synWhyLoopNodeV0116" key={title}>
                <span className={`synWhyLoopIconV0116 tone${index}`}><SynIcon name={icon} /></span>
                <strong>{title}</strong><small>{subtitle}</small>
                {index < loop.length - 1 && <i>→</i>}
              </div>
            ))}
          </div>
          <div className="synWhyLoopReturnV0116">↶ What happens next becomes another useful clue</div>
        </section>

        <aside className="synWhyBigQuestionV0116">
          <small>✦ &nbsp; THE BIG QUESTION</small>
          <h2>What might help this child learn, explore and grow next — and why?</h2>
          <p>That's what SynapStride is here to help discover.</p>
          {!embedded && <button type="button" className="cta" onClick={onGetStarted}>Create a Child's Space</button>}
        </aside>
      </div>
    </section>
  )
}

function SynapStrideLogoMark() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 31.5c6.4 0 8.2-8.5 14.4-8.5 4.4 0 5.8 4.4 9.6 4.4 2.1 0 3.6-.9 5-2.1" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round"/>
      <path d="M8.5 24.5c3.5-7.6 9-12 15.3-12 7.8 0 11.1 6.4 15.7 6.4" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" opacity=".94"/>
      <circle cx="9" cy="31.5" r="4" fill="currentColor"/>
      <circle cx="24" cy="12.5" r="3.7" fill="currentColor"/>
      <circle cx="40" cy="25" r="3.5" fill="currentColor"/>
      <path d="M16.5 37.5c3 1.5 6 2.2 9 2.2 4.9 0 9.2-1.7 12.6-4.7" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" opacity=".55"/>
    </svg>
  )
}


function AuthWelcome({ onGetStarted, onSignIn, onWhy }) {
  return (
    <section className="synAuthPageV012 synAuthWelcomePageV012">
      <div className="synAuthWelcomeCardV012">
        <div className="synAuthBrandV012 synAuthBrandHeroV012">
          <img src={synapStrideMark} alt="" />
          <strong>Synap<span>Stride</span></strong>
        </div>

        <div className="synAuthWelcomeCopyV012">
          <p className="synAuthEyebrowV012">DISCOVER · EXPLORE · GROW</p>
          <h1>Help your child learn, explore, and discover what comes next.</h1>
          <p className="synAuthLeadV012">
            A growth guide that becomes more useful as your child learns, tries things and grows.
          </p>
        </div>

        <div className="synAuthWelcomePointsV012">
          <span><b>✦</b> Helpful for what matters today</span>
          <span><b>🌱</b> Learns naturally over time</span>
          <span><b>🔒</b> Parent-controlled family space</span>
        </div>

        <div className="synAuthWelcomeActionsV012">
          <button type="button" className="synAuthPrimaryV012" onClick={onGetStarted}>
            Get Started
          </button>
          <button type="button" className="synAuthSecondaryV012" onClick={onSignIn}>
            Sign In
          </button>
        </div>

        <button type="button" className="synAuthWhyV012" onClick={onWhy}>
          Why SynapStride? →
        </button>
      </div>
    </section>
  )
}


function AuthAccountScreen({
  mode,
  authForm,
  message,
  onChange,
  onSubmit,
  onBack,
  onSwitch,
  onProvider,
}) {
  const isSignUp = mode === 'signup'

  return (
    <section className="synAuthPageV012">
      <div className="synAuthAccountCardV012">
        <button type="button" className="synAuthBackV012" onClick={onBack}>← Back</button>

        <div className="synAuthBrandV012 synAuthBrandCenteredV012">
          <img src={synapStrideMark} alt="" />
          <strong>Synap<span>Stride</span></strong>
        </div>

        <p className="synAuthEyebrowV012">PARENT ACCOUNT</p>
        <h1>{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
        <p className="synAuthLeadV012">
          {isSignUp
            ? "Start your family's SynapStride journey."
            : 'Sign in to continue to your family space.'}
        </p>

        <div className="synAuthProviderStackV012">
          <button type="button" onClick={() => onProvider('Google')}>
            <span className="synProviderGlyphV012">G</span> Continue with Google
          </button>
          <button type="button" onClick={() => onProvider('Apple')}>
            <span className="synProviderGlyphV012">●</span> Continue with Apple
          </button>
        </div>

        <div className="synAuthDividerV012"><span>or</span></div>

        <form className="synAuthFormV012" onSubmit={onSubmit}>
          <label>
            Email address
            <input
              type="email"
              name="email"
              value={authForm.email}
              onChange={onChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={authForm.password}
              onChange={onChange}
              placeholder={isSignUp ? 'At least 8 characters' : 'Your password'}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={isSignUp ? 8 : undefined}
              required
            />
          </label>

          {isSignUp && (
            <label>
              Confirm password
              <input
                type="password"
                name="confirmPassword"
                value={authForm.confirmPassword}
                onChange={onChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
          )}

          {message && <p className="synAuthMessageV012" role="alert">{message}</p>}

          <button type="submit" className="synAuthPrimaryV012">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="synAuthSwitchV012">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={onSwitch}>
            {isSignUp ? 'Sign in' : 'Get Started'}
          </button>
        </p>

        <p className="synAuthFinePrintV012">
          Local MVP accounts are stored in this browser for testing. Passwords are stored as salted hashes, not plain text. Production authentication will move to Amazon Cognito.
        </p>
      </div>
    </section>
  )
}


function SynIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M9.5 19.5v-6h5v6"/></>,
    growth: <><path d="M12 21V10"/><path d="M12 13C7 13 4 10 4 5c5 0 8 3 8 8Z"/><path d="M12 10c0-4 3-7 8-7 0 5-3 8-8 8"/></>,
    profile: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.7-4.1 3.1-6.2 7-6.2s6.3 2.1 7 6.2"/></>,
    people: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3.8 20c.5-4.1 2.2-6.2 5.2-6.2s4.8 2.1 5.3 6.2"/><path d="M14.2 14.5c3.4-.4 5.4 1.4 6 5"/></>,
    heart: <path d="M20.8 5.7c-2-2.1-5.2-1.8-6.9.4L12 8.4l-1.9-2.3C8.4 3.9 5.2 3.6 3.2 5.7c-2.2 2.3-1.7 5.8.5 8L12 21l8.3-7.3c2.2-2.2 2.7-5.7.5-8Z"/>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    chart: <><path d="M4 20V10"/><path d="M9 20V4"/><path d="M14 20v-7"/><path d="M19 20V8"/></>,
    book: <><path d="M4 5.5c3.2-.7 5.8 0 8 2.1v12c-2.2-2-4.8-2.7-8-2V5.5Z"/><path d="M20 5.5c-3.2-.7-5.8 0-8 2.1v12c2.2-2 4.8-2.7 8-2V5.5Z"/></>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>,
    observation: <><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 4V2.8h6V4"/><path d="M9 9h6M9 13h6M9 17h4"/></>,
    plus: <><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></>,
    rocket: <><path d="M14 4c3-1 5-1 6-1 0 1 0 3-1 6l-5 5-4-4 4-6Z"/><path d="m10 10-4 1-2 3 5 1"/><path d="m14 14-1 4-3 2-1-5"/><circle cx="16" cy="7" r="1"/></>,
    tools: <><path d="m14 6 4-3 3 3-3 4"/><path d="m13 7 4 4"/><path d="M4 20 15 9"/><path d="m5 4 4 4-2 2-4-4 2-2Z"/></>,
    sprout: <><path d="M12 21V10"/><path d="M12 13c-5 0-8-3-8-8 5 0 8 3 8 8Z"/><path d="M12 10c0-4 3-7 8-7 0 5-3 8-8 8"/></>,
    telescope: <><path d="m5 8 10-4 2 5-10 4-2-5Z"/><path d="m12 11 3 9M12 11l-6 9M12 11v9"/></>,
    chat: <><path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></>,
    brain: <><path d="M9 4a3 3 0 0 0-3 3v.2A3.2 3.2 0 0 0 4 10a3 3 0 0 0 2 2.8V15a3 3 0 0 0 3 3"/><path d="M15 4a3 3 0 0 1 3 3v.2a3.2 3.2 0 0 1 2 2.8 3 3 0 0 1-2 2.8V15a3 3 0 0 1-3 3"/><path d="M12 3v18M8.5 8.5c1.6 0 2.4.8 3.5 2M15.5 8.5c-1.6 0-2.4.8-3.5 2M8.5 15.5c1.6 0 2.4-.8 3.5-2M15.5 15.5c-1.6 0-2.4-.8-3.5-2"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></>,
  }
  return <svg {...common}>{paths[name] || paths.star}</svg>
}

function SettingsView({
  childProfile,
  profile,
  evidenceEventCount = 0,
  traits = [],
  domains = [],
  pathways = [],
  careers = [],
  recommendations = [],
  parentAccount,
  onSignOut,
  onReset,
}) {
  const childName = childProfile?.name?.trim() || 'your child'

  return (
    <section className="synSettingsV01112">
      <header className="synSettingsHeroV01112">
        <div>
          <span className="synSettingsEyebrowV01112">SETTINGS</span>
          <h1>SynapStride settings</h1>
          <p>
            Manage the family experience here. Technical inspection and test-data
            controls stay separated from {childName}&apos;s everyday growth experience.
          </p>
        </div>
        <div className="synSettingsHeroMarkV01112" aria-hidden="true">⚙</div>
      </header>

      <div className="synSettingsGridV01112">
        <article className="synSettingsCardV01112 synAccountCardV012">
          <span className="synSettingsCardIconV01112">🔐</span>
          <div>
            <span className="synSettingsEyebrowV01112">PARENT ACCOUNT</span>
            <h2>{parentAccount?.email || 'Local parent account'}</h2>
            <p>
              This parent account owns the family space. Sign-in is validated against the local account store for MVP testing; production authentication will move to Amazon Cognito.
            </p>
            <div className="synAuthIdentityMetaV0121">
              <span>Family ID: {parentAccount?.familyId || 'local-family'}</span>
              <span>Parent ID: {parentAccount?.id || 'local-parent'}</span>
            </div>
            <button type="button" className="synSignOutButtonV012" onClick={onSignOut}>
              Sign out
            </button>
          </div>
        </article>

        <article className="synSettingsCardV01112">
          <span className="synSettingsCardIconV01112">👤</span>
          <div>
            <span className="synSettingsEyebrowV01112">CHILD PROFILE</span>
            <h2>{childName}</h2>
            <p>
              Age {childProfile?.age || '—'} · {childProfile?.grade || 'Grade not set'}
            </p>
            <small>Profile editing can be added when account management is connected.</small>
          </div>
        </article>

        <article className="synSettingsCardV01112">
          <span className="synSettingsCardIconV01112">👨‍👩‍👦</span>
          <div>
            <span className="synSettingsEyebrowV01112">FAMILY</span>
            <h2>Family & preferences</h2>
            <p>
              Household members, notifications, permissions, and family preferences
              will live here as the product moves beyond the local MVP.
            </p>
          </div>
        </article>
      </div>

      <section className="synDeveloperToolsV01112">
        <div className="synDeveloperToolsHeaderV01112">
          <div>
            <span className="synSettingsEyebrowV01112">DEVELOPER TOOLS</span>
            <h2>Inspect the MVP without cluttering the customer experience.</h2>
            <p>
              These controls are for local development and validation. They should be
              hidden or access-controlled before production launch.
            </p>
          </div>
          <span className="synDeveloperBadgeV01112">LOCAL MVP</span>
        </div>

        {profile ? (
          <GrowthIntelligenceInspector
            profile={profile}
            evidenceEventCount={evidenceEventCount}
            traits={traits}
            domains={domains}
            pathways={pathways}
            careers={careers}
            recommendations={recommendations}
            onReset={onReset}
          />
        ) : (
          <div className="synDeveloperEmptyV01112">
            <span>🧪</span>
            <div>
              <strong>No Growth Intelligence state yet.</strong>
              <p>Use Discover, learning, activities, or parent observations to create evidence first.</p>
            </div>
            <button type="button" onClick={onReset}>Reset Test Data</button>
          </div>
        )}
      </section>
    </section>
  )
}


// ============================================================
// MVP v0.9 — FIRST CUSTOMER WORKSPACE SHELL
// ============================================================

function BppWorkspaceShell({
  activeSection,
  childProfile,
  activeJourneyCount = 0,
  activeGrowthSection = 'overview',
  activeParentSection = 'overview',
  onHome,
  onJourney,
  onGrowthSection,
  onExplore,
  onDiscover,
  onProfile,
  onParent,
  onParentSection,
  onWhySynapStride,
  onSettings,
  onSignOut,
  children,
}) {
  const childName = childProfile?.name?.trim() || 'Explorer'
  const childInitial = childName.charAt(0).toUpperCase()
  const childAge = childProfile?.age ? `Age ${childProfile.age}` : 'My Growth Space'

  const growthOpen = activeSection === 'journey'
  const parentOpen = activeSection === 'parent'
  const [childMenuOpen, setChildMenuOpen] = useState(false)

  const openAccountSettings = () => {
    setChildMenuOpen(false)
    onSettings?.()
  }

  const signOutFromChildMenu = (event) => {
    event?.preventDefault?.()
    event?.stopPropagation?.()

    // Call the app-level sign-out first. The shell will unmount as soon as
    // authentication returns to Sign In, so we do not rely on a menu-state
    // update completing before sign-out.
    onSignOut?.(event)
    setChildMenuOpen(false)
  }

  return (
    <div className="synShellV0116">
      <aside className="synSidebarV0116">
        <button type="button" className="synBrandV0116" onClick={onHome}>
          <span className="synBrandLogoV01161" aria-hidden="true"><img src={synapStrideMark} alt="" /></span>
          <span className="synBrandTextV01161">
            <span className="synBrandWordV0116">Synap<span>Stride</span><i>✦</i></span>
            <small><b>Discover</b><em>•</em><b>Explore</b><em>•</em><b>Grow</b></small>
          </span>
        </button>

        <nav className="synNavV0116" aria-label="SynapStride">
          <button type="button" className={activeSection === 'home' ? 'active' : ''} onClick={onHome}>
            <span className="synNavIconV0116"><SynIcon name="home" /></span><strong>Home</strong>
          </button>

          <div className={`synNavGroupV0116 ${growthOpen ? 'open' : ''}`}>
            <button type="button" className={growthOpen ? 'active' : ''} onClick={onJourney}>
              <span className="synNavIconV0116 growth"><SynIcon name="growth" /></span><strong>My Growth</strong>
              {activeJourneyCount > 0 && <small className="synNavCountV0116">{activeJourneyCount}</small>}
              <span className="synChevronV0116">⌄</span>
            </button>
            {growthOpen && (
              <div className="synSubnavV0116">
                <button type="button" className={activeGrowthSection === 'overview' ? 'active' : ''} onClick={() => onGrowthSection?.('overview')}><span><SynIcon name="chart" /></span>Overview</button>
                <button type="button" className={activeGrowthSection === 'school' ? 'active' : ''} onClick={() => onGrowthSection?.('school')}><span><SynIcon name="book" /></span>School &amp; Learning</button>
                <button type="button" className={activeGrowthSection === 'activities' ? 'active' : ''} onClick={() => onGrowthSection?.('activities')}><span><SynIcon name="star" /></span>Interests &amp; Activities</button>
              </div>
            )}
          </div>

          <button type="button" className={activeSection === 'profile' ? 'active' : ''} onClick={onProfile}>
            <span className="synNavIconV0116 profile"><SynIcon name="profile" /></span><strong>My Profile</strong>
          </button>

          <div className={`synNavGroupV0116 ${parentOpen ? 'open' : ''}`}>
            <button type="button" className={parentOpen ? 'active' : ''} onClick={onParent}>
              <span className="synNavIconV0116 parent"><SynIcon name="people" /></span><strong>Parent Space</strong><span className="synChevronV0116">⌄</span>
            </button>
            {parentOpen && (
              <div className="synSubnavV0116 parentSub">
                <button type="button" className={activeParentSection === 'overview' ? 'active' : ''} onClick={() => onParentSection?.('overview')}><span><SynIcon name="observation" /></span>Overview</button>
                <button type="button" className={activeParentSection === 'observation' ? 'active' : ''} onClick={() => onParentSection?.('observation')}><span><SynIcon name="plus" /></span>Add an Observation</button>
              </div>
            )}
          </div>
        </nav>

        <div className="synNavSpacerV0116" />

        <nav className="synBottomNavV0116" aria-label="About and settings">
          <button type="button" className={`synWhyNavButtonV0116 ${activeSection === 'why' ? 'active' : ''}`} onClick={onWhySynapStride}>
            <span className="synNavIconV0116 why"><SynIcon name="heart" /></span><strong>Why SynapStride?</strong>
          </button>
          <button type="button" className={activeSection === 'settings' ? 'active' : ''} onClick={onSettings}>
            <span className="synNavIconV0116"><SynIcon name="settings" /></span><strong>Settings</strong>
          </button>
        </nav>

        <div className={`synChildAccountWrapV0122 ${childMenuOpen ? 'open' : ''}`}>
          {childMenuOpen && (
            <div className="synChildAccountMenuV0122" role="menu" aria-label={`${childName} account menu`}>
              <div className="synChildAccountMenuHeadV0122">
                <div className="synChildAvatarV0116">{childInitial}</div>
                <div><strong>{childName}</strong><small>{childAge}</small></div>
              </div>

              <div className="synChildAccountMenuDividerV0122" />

              <button type="button" role="menuitem" disabled title="Available when your family has more than one child">
                <span>⇄</span><span><strong>Switch Child</strong><small>One child in this MVP</small></span>
              </button>
              <button type="button" role="menuitem" disabled title="Multi-child family setup is coming next">
                <span>＋</span><span><strong>Add Child</strong><small>Coming with multi-child support</small></span>
              </button>
              <button type="button" role="menuitem" onClick={openAccountSettings}>
                <span>⚙</span><span><strong>Account Settings</strong><small>Family and account details</small></span>
              </button>

              <div className="synChildAccountMenuDividerV0122" />

              <button type="button" role="menuitem" className="danger" onClick={signOutFromChildMenu}>
                <span>↪</span><span><strong>Sign Out</strong><small>Return to Sign In</small></span>
              </button>
            </div>
          )}

          <button
            type="button"
            className="synChildCardV0116 synChildCardButtonV0122"
            aria-haspopup="menu"
            aria-expanded={childMenuOpen}
            onClick={() => setChildMenuOpen((open) => !open)}
          >
            <div className="synChildAvatarV0116">{childInitial}</div>
            <div><strong>{childName}</strong><small>{childAge}</small></div>
            <span className="synChildMenuChevronV0122">⌃</span>
          </button>
        </div>
      </aside>

      <div className="synCanvasV0116">
        <header className="synMobileHeaderV0116">
          <button type="button" onClick={onHome} className="synMobileBrandV0116"><img src={synapStrideMark} alt="" /><span className="synMobileBrandTextV01181">Synap<span>Stride</span><i>✦</i></span></button>
          <button type="button" onClick={onProfile} className="synMobileAvatarV0116">{childInitial}</button>
        </header>
        {children}
      </div>

      <nav className="synMobileNavV0116" aria-label="Mobile SynapStride">
        <button type="button" className={activeSection === 'home' ? 'active' : ''} onClick={onHome}><SynIcon name="home" /><small>Home</small></button>
        <button type="button" className={activeSection === 'journey' ? 'active' : ''} onClick={onJourney}><SynIcon name="growth" /><small>Growth</small></button>
        <button type="button" className={activeSection === 'profile' ? 'active' : ''} onClick={onProfile}><SynIcon name="profile" /><small>Profile</small></button>
        <button type="button" className={activeSection === 'parent' ? 'active' : ''} onClick={onParent}><SynIcon name="people" /><small>Parent</small></button>
      </nav>
    </div>
  )
}

// ============================================================
// MVP v0.11 — PARENT SPACE OVERVIEW
// ============================================================

function ParentOverview({
  childProfile,
  profileUnderstanding,
  promotedPatterns = [],
  recommendations = [],
  journeyItems = [],
  parentPerspectiveComplete,
  onAddObservation,
  onWhySynapStride,
}) {
  const childName =
    childProfile?.name?.trim() ||
    'Your child'

  const parentContributionCount =
    profileUnderstanding
      ?.sources
      ?.parentContributionCount ||
    0

  const topPattern =
    promotedPatterns[0] ||
    null

  const nextRecommendation =
    recommendations[0] ||
    null

  const recentJourney =
    [...journeyItems]
      .sort(
        (a, b) =>
          new Date(
            b.updatedAt ||
            b.createdAt ||
            0
          ) -
          new Date(
            a.updatedAt ||
            a.createdAt ||
            0
          )
      )
      .slice(0, 3)

  return (
    <section className="synParentOverviewV01110">
      <header className="synParentOverviewHeroV01110">
        <div>
          <span className="synParentKickerV01110">
            PARENT SPACE
          </span>

          <h1>{childName}&apos;s Growth</h1>

          <p>
            See what SynapStride is beginning to understand, what may be worth encouraging,
            and where your perspective can add useful context.
          </p>
        </div>

        <div className="synParentOverviewSignalV01110">
          <span>🌱</span>
          <strong>
            One evolving picture
          </strong>
          <small>
            Child voice + real experiences + parent perspective
          </small>
          <button
            type="button"
            className="synParentWhyLinkV0115"
            onClick={onWhySynapStride}
          >
            How SynapStride helps →
          </button>
        </div>
      </header>

      <div className="synParentOverviewGridV01110">
        <article className="synParentInsightCardV01110 synParentInsightPrimaryV01110">
          <span className="synParentKickerV01110">
            WHAT&apos;S EMERGING
          </span>

          {topPattern ? (
            <>
              <h2>
                {topPattern.emoji ? `${topPattern.emoji} ` : ''}
                {topPattern.label}
              </h2>
              <p>
                This pattern has enough support across SynapStride evidence to be worth watching.
                It is still a clue, not a permanent label.
              </p>
            </>
          ) : (
            <>
              <h2>We&apos;re still gathering clues.</h2>
              <p>
                As {childName} learns, explores, reflects, and tries new things, stronger patterns
                can begin to emerge across different contexts.
              </p>
            </>
          )}
        </article>

        <article className="synParentInsightCardV01110">
          <span className="synParentKickerV01110">
            WHAT MIGHT HELP NEXT
          </span>

          {nextRecommendation ? (
            <>
              <h2>
                {nextRecommendation.emoji || '🧭'}{' '}
                {nextRecommendation.title}
              </h2>
              <p>
                {nextRecommendation.reasons?.[0] ||
                  'This could be a useful next experience based on what SynapStride understands so far.'}
              </p>
            </>
          ) : (
            <>
              <h2>Keep the journey moving.</h2>
              <p>
                SynapStride will suggest stronger next steps as it gets more evidence from real activity.
              </p>
            </>
          )}
        </article>

        <article className="synParentInsightCardV01110">
          <span className="synParentKickerV01110">
            HOW YOU CAN HELP
          </span>

          <h2>👀 Add what you&apos;ve noticed.</h2>
          <p>
            Everyday observations can reveal context SynapStride may not see during learning or activities.
          </p>

          <button
            type="button"
            className="synParentPrimaryActionV01110"
            onClick={onAddObservation}
          >
            Add an Observation →
          </button>

          <small className="synParentObservationCountV01110">
            {parentContributionCount > 0
              ? `${parentContributionCount} parent observation${parentContributionCount === 1 ? '' : 's'} contributing`
              : parentPerspectiveComplete
                ? 'Parent perspective has contributed to the Profile'
                : 'No parent observations yet'}
          </small>
        </article>

        <article className="synParentInsightCardV01110">
          <span className="synParentKickerV01110">
            RECENT GROWTH
          </span>

          {recentJourney.length > 0 ? (
            <div className="synParentRecentListV01110">
              {recentJourney.map((item) => (
                <div key={item.id}>
                  <span>{item.emoji || '•'}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>
                      {item.status === 'completed'
                        ? 'Completed'
                        : 'In progress'}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>
              Recent learning and exploration will appear here as {childName}&apos;s Journey grows.
            </p>
          )}
        </article>
      </div>
    </section>
  )
}


export default App
