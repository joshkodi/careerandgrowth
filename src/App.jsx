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
import './PublicLandingV018.css'
import './components/AvatarV014.css'
import './components/ParentFirstUseV014.css'
import './components/FamilyOnboardingV014.css'
import './components/ParentSpaceV015.css'
import synapStrideMark from './assets/synapstride-mark.png'

import {
  createLocalAccount,
  createLocalChildAccount,
  validateLocalCredentials,
  validateLocalChildCredentials,
  createLocalSession,
  createLocalChildSession,
  getLocalSession,
  getAccountForSession,
  getChildAccountForSession,
  clearLocalSession,
} from './services/localAuthStore'

import { explorations } from './data/explorations'

import {
  buildGrowthPatternIntelligence,
} from './intelligence/growthPatternCorroborationEngine'

import {
  buildPatternPromotionRegistry,
} from './intelligence/growthPatternPromotionEngine'

import {
  buildFirstUseSignals,
  explainRecommendation,
} from './intelligence/firstUsePersonalization'

import GrowthHome from './components/GrowthHome'
import Avatar from './components/Avatar'
import AvatarPicker from './components/AvatarPicker'
import { getAvatarsForAge } from './data/avatarCatalog'
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

import { buildGrowthIntelligenceContext } from './intelligence/growthIntelligenceContext'
import { buildModelBackedChildUnderstanding } from './intelligence/understanding/childUnderstandingRuntime'
import { buildAdaptiveAboutMe } from './intelligence/reflection/reflectionRuntime'
import { buildCompanionExplorationEvidence } from './intelligence/companionExplorationEvidenceAdapter'
import { saveReflectionOutcome } from './intelligence/reflection/reflectionStorage'




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

const CHILD_PRIVACY_CONSENT_STORAGE_KEY =
  'synapstride.childPrivacyConsent.v1'

const CHILD_PRIVACY_NOTICE_VERSION = '2026-10-03'


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
  avatarId: 'ethan-blue',
  avatarSetupComplete: false,
}

const defaultParentIntent = {
  goals: [],
  note: '',
  setupComplete: false,
}

const parentIntentGoals = [
  'Discover interests',
  'Support learning',
  'Explore beyond school',
  'Build confidence & independence',
  'Understand strengths',
  'Find direction',
]


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

const storedChildAccount =
  getChildAccountForSession(storedAuthSession)

const storedAppState =
  readStoredAppState(
    storedAuthSession?.familyId || null
  )

const storedChildPrivacyConsent =
  storedAuthSession?.familyId
    ? readJsonStorage(getFamilyStorageKey(CHILD_PRIVACY_CONSENT_STORAGE_KEY, storedAuthSession.familyId))
    : null


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

      if (storedAuthSession?.role === 'child') {
        return storedChildAccount ? 'childSpace' : 'signIn'
      }

      if (!storedAppState?.childProfile?.name?.trim()) {
        return storedChildPrivacyConsent?.status === 'active'
          ? 'parentSetup'
          : 'parentConsent'
      }

      return storedAppState.screen === 'journey'
        ? 'journey'
        : 'childSpace'
    })

  // Reset the viewport whenever SynapStride navigates to a different page/screen.
  // This keeps pages opened from footer links (Privacy, Terms, Contact, etc.)
  // from inheriting the previous page's scroll position.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [screen])


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

  const [childPrivacyConsent, setChildPrivacyConsent] =
    useState(storedChildPrivacyConsent)

  const [privacyReturnScreen, setPrivacyReturnScreen] =
    useState('landing')

  const [termsReturnScreen, setTermsReturnScreen] =
    useState('landing')

  const [contactReturnScreen, setContactReturnScreen] =
    useState('landing')

  const [childAccess, setChildAccess] = useState({
    enabled: false,
    username: '',
    password: '',
    confirmPassword: '',
    message: '',
  })


  const [
    childProfile,
    setChildProfile,
  ] = useState(
    storedAppState
      ?.childProfile ||
      defaultChildProfile
  )

  const [parentIntent, setParentIntent] = useState(
    storedAppState?.parentIntent || defaultParentIntent
  )

  const [
    growthIntelligenceProfile,
    setGrowthIntelligenceProfile,
  ] = useState(null)

  const [
    evidenceEventCount,
    setEvidenceEventCount,
  ] = useState(0)

  const [modelBackedChildUnderstanding, setModelBackedChildUnderstanding] = useState(null)
  const [isChildUnderstandingLoading, setIsChildUnderstandingLoading] = useState(false)
  const [adaptiveAboutMe, setAdaptiveAboutMe] = useState(null)

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
  // v0.17 Stage 4 — COMPANION EXPLORATION → GROWTH EVIDENCE
  // Only explicit child exploration language is promoted, and only
  // as weak curiosity evidence. Conversation itself is not evidence.
  // ==========================================================

  const handleCompanionExploration =
    (message, { activeTopic = null, isFollowUp = false } = {}) => {
      const childId =
        getChildEvidenceId(
          childProfile
        )

      const event =
        buildCompanionExplorationEvidence({
          childId,
          message,
          activeTopic,
          isFollowUp,
        })

      if (!event) {
        return false
      }

      persistGrowthEvidence([event])
      return {
        recorded: true,
        topic: event.metadata?.topic || activeTopic || null,
      }
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
  // MVP v0.17 Stage 1 — MODEL-BACKED CHILD UNDERSTANDING
  // Shadow mode only: model hypotheses are inspectable but do not
  // change recommendations, profile state, or customer execution.
  // ==========================================================
  useEffect(() => {
    let cancelled = false

    if (!childProfile?.name?.trim()) {
      setModelBackedChildUnderstanding(null)
      setIsChildUnderstandingLoading(false)
      return () => { cancelled = true }
    }

    setIsChildUnderstandingLoading(true)

    const growthContext = buildGrowthIntelligenceContext({
      childId: getChildEvidenceId(childProfile),
      age: childProfile?.age || null,
      evidenceEvents: currentChildEvidenceEvents,
      journeyItems,
      studentIntents: studentGrowthIntents,
      parentIntents: parentGrowthIntents,
      completedExperienceIds: journeyExperienceIds,
      growthProfile: growthIntelligenceProfile,
      patternIntelligence: holisticPatternIntelligence,
      promotionRegistry: holisticPatternPromotion,
    })

    buildModelBackedChildUnderstanding({ growthContext })
      .then((result) => {
        if (!cancelled) setModelBackedChildUnderstanding(result)
      })
      .catch((error) => {
        console.warn('[v0.17 Stage 1] Model-backed child understanding unavailable:', error)
        if (!cancelled) setModelBackedChildUnderstanding(null)
      })
      .finally(() => {
        if (!cancelled) setIsChildUnderstandingLoading(false)
      })

    return () => { cancelled = true }
  }, [
    childProfile,
    evidenceEventCount,
    journeyItems,
    studentGrowthIntents,
    parentGrowthIntents,
    growthIntelligenceProfile,
  ])


  // ==========================================================
  // MVP v0.17 Stage 4 — ADAPTIVE ABOUT ME
  // Reflections are child-correctable candidates, never profile facts.
  // ==========================================================
  useEffect(() => {
    let cancelled = false
    if (!modelBackedChildUnderstanding) { setAdaptiveAboutMe(null); return () => { cancelled = true } }
    buildAdaptiveAboutMe({ childUnderstanding: modelBackedChildUnderstanding })
      .then((result) => { if (!cancelled) setAdaptiveAboutMe(result) })
      .catch((error) => { console.warn('[v0.17 Stage 4] Adaptive About Me unavailable:', error); if (!cancelled) setAdaptiveAboutMe(null) })
    return () => { cancelled = true }
  }, [modelBackedChildUnderstanding])

  const handleReflectionResponse = (candidate, response) => {
    const childId = modelBackedChildUnderstanding?.child?.id || getChildEvidenceId(childProfile)
    saveReflectionOutcome({ childId, candidateId: candidate?.id, concept: candidate?.concept, dimension: candidate?.dimension, statement: candidate?.statement, childFacingStatement: candidate?.childFacingStatement || null, response, evidenceRefs: candidate?.evidenceRefs || [], source: candidate?.source || 'model_inferred' })
    setAdaptiveAboutMe((current) => current ? { ...current, candidates: (current.candidates || []).filter((item) => item.id !== candidate?.id), outcomes: [...(current.outcomes || []), { candidateId: candidate?.id, concept: candidate?.concept, dimension: candidate?.dimension, statement: candidate?.statement, response }] } : current)
  }


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

        parentIntent,

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
      parentIntent,
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
    setParentIntent(defaultParentIntent)

    resetDiscovery()

    resetParentPerspective()

    resetAdventure()

    setGrowthIntelligenceProfile(null)
    setEvidenceEventCount(0)

    resetGrowthIntents()
    resetJourney()

    setScreen(childPrivacyConsent?.status === 'active' ? 'parentSetup' : 'parentConsent')
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

    const identifier = authForm.email.trim()
    const password = authForm.password

    if (!identifier || !password) {
      setAuthMessage('Enter your email or child username and password.')
      return
    }

    const looksLikeEmail = identifier.includes('@')

    if (!looksLikeEmail) {
      const childResult = await validateLocalChildCredentials({
        username: identifier,
        password,
      })

      if (childResult.ok) {
        const familyState = readStoredAppState(childResult.account.familyId)

        if (!familyState?.childProfile?.name?.trim()) {
          setAuthMessage(
            'Your child sign-in exists, but the family workspace could not be restored. Sign in with the parent account once, then try again.'
          )
          return
        }

        createLocalChildSession(childResult.account)
        window.location.reload()
        return
      }

      setAuthMessage(
        childResult.code === 'ACCOUNT_NOT_FOUND'
          ? 'No child account was found for that username.'
          : 'That password does not match the child account.'
      )
      return
    }

    const parentResult = await validateLocalCredentials({
      email: identifier,
      password,
    })

    if (parentResult.ok) {
      completeLocalSignIn(parentResult.account)
      return
    }

    setAuthMessage(
      parentResult.code === 'ACCOUNT_NOT_FOUND'
        ? 'No parent account was found for that email.'
        : 'That password does not match the parent account.'
    )
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
  // CHILD PRIVACY / PARENT CONSENT FOUNDATION
  // ==========================================================

  const acceptChildPrivacyConsent = () => {
    if (!authSession?.familyId || authSession?.role !== 'parent') return

    const consent = {
      status: 'active',
      noticeVersion: CHILD_PRIVACY_NOTICE_VERSION,
      acceptedAt: new Date().toISOString(),
      parentAccountId: parentAccount?.id || null,
      parentEmail: parentAccount?.email || null,
    }

    localStorage.setItem(
      getFamilyStorageKey(CHILD_PRIVACY_CONSENT_STORAGE_KEY, authSession.familyId),
      JSON.stringify(consent)
    )
    setChildPrivacyConsent(consent)
    setScreen('parentSetup')
  }

  const openPrivacyNotice = (returnScreen = screen) => {
    setPrivacyReturnScreen(returnScreen)
    setScreen('privacyPolicy')
  }

  const openTermsOfUse = (returnScreen = screen) => {
    setTermsReturnScreen(returnScreen)
    setScreen('termsOfUse')
  }

  const openContact = (returnScreen = screen) => {
    setContactReturnScreen(returnScreen)
    setScreen('contact')
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
        (currentProfile) => {
          const nextProfile = {
            ...currentProfile,
            [name]: value,
          }

          if (name === 'age') {
            const ageAvatars = getAvatarsForAge(value)
            const currentStillFits = ageAvatars.some(
              (avatar) => avatar.id === currentProfile.avatarId
            )

            if (!currentStillFits) {
              nextProfile.avatarId = ageAvatars[0]?.id || currentProfile.avatarId
            }
          }

          return nextProfile
        }
      )
    }


  const handleParentSetupSubmit =
    async (event) => {
      event.preventDefault()

      if (!childProfile.name.trim()) return

      if (childAccess.enabled) {
        const username = childAccess.username.trim().toLowerCase()

        if (!/^[a-z0-9._-]{4,24}$/.test(username)) {
          setChildAccess((current) => ({
            ...current,
            message: 'Use 4–24 letters, numbers, dots, dashes or underscores.',
          }))
          return
        }

        if (childAccess.password.length < 8) {
          setChildAccess((current) => ({
            ...current,
            message: 'Use at least 8 characters for the child password.',
          }))
          return
        }

        if (childAccess.password !== childAccess.confirmPassword) {
          setChildAccess((current) => ({
            ...current,
            message: 'The child passwords do not match.',
          }))
          return
        }

        const result = await createLocalChildAccount({
          familyId: authSession?.familyId,
          childId: getChildEvidenceId(childProfile),
          childName: childProfile.name.trim(),
          username,
          password: childAccess.password,
        })

        if (!result.ok) {
          setChildAccess((current) => ({
            ...current,
            message:
              result.code === 'USERNAME_EXISTS'
                ? 'That child username is already in use. Try another.'
                : result.code === 'CHILD_ACCOUNT_VERIFICATION_FAILED'
                  ? 'The child sign-in could not be verified. Please re-enter the password and try again.'
                  : 'We could not create the child sign-in. Please try again.',
          }))
          return
        }

        // The account store has already re-validated these exact credentials.
        // Persist only the username with the child profile; never persist the password.
        setChildProfile((current) => ({
          ...current,
          childLoginUsername: result.account.username,
          childLoginEnabled: true,
          avatarSetupComplete: true,
        }))
      } else {
        setChildProfile((current) => ({
          ...current,
          childLoginUsername: null,
          childLoginEnabled: false,
          avatarSetupComplete: true,
        }))
      }

      // Do not move forward until child account creation + verification succeeded.
      setScreen('parentIntentSetup')
    }


  const toggleParentIntentGoal = (goal) => {
    setParentIntent((current) => {
      const selected = current.goals.includes(goal)

      if (selected) {
        return {
          ...current,
          goals: current.goals.filter((item) => item !== goal),
        }
      }

      if (current.goals.length >= 3) return current

      return {
        ...current,
        goals: [...current.goals, goal],
      }
    })
  }


  const finishParentIntentSetup = () => {
    setParentIntent((current) => ({
      ...current,
      setupComplete: true,
    }))
    setScreen('parentHandoff')
  }


  const goToChildSpace = () => {
    setScreen('childSpace')
  }


  const goToParentSpace = () => {
    if (authSession?.role === 'child') {
      // Parent Space remains protected. A child session must authenticate as
      // the parent before entering it; do not silently ignore the click.
      clearLocalSession()
      setAuthSession(null)
      setParentAccount(null)
      setAuthForm({ email: '', password: '', confirmPassword: '' })
      setAuthMessage('Parent Space is protected. Sign in with the parent email and password to continue.')
      setScreen('signIn')
      return
    }

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
          onPrivacy={() => openPrivacyNotice('landing')}
          onTerms={() => openTermsOfUse('landing')}
          onContact={() => openContact('landing')}
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
          authRole={authSession?.role}
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


      {screen === 'parentConsent' && (
        <ChildPrivacyConsentScreen
          parentEmail={parentAccount?.email}
          onAccept={acceptChildPrivacyConsent}
          onReview={() => openPrivacyNotice('parentConsent')}
          onBack={handleSignOut}
        />
      )}

      {screen === 'privacyPolicy' && (
        <PrivacyPolicyScreen
          onBack={() => setScreen(privacyReturnScreen || 'landing')}
        />
      )}

      {screen === 'termsOfUse' && (
        <TermsOfUseScreen
          onBack={() => setScreen(termsReturnScreen || 'landing')}
        />
      )}

      {screen === 'contact' && (
        <ContactScreen
          onBack={() => setScreen(contactReturnScreen || 'landing')}
        />
      )}

      {screen ===
        'parentSetup' && (
        <section className="synChildSetupV012 synFamilySetupPageV014">
          <div className="synAuthBrandV012">
            <img src={synapStrideMark} alt="" />
            <strong>Synap<span>Stride</span></strong>
          </div>

          <div className="synChildSetupCardV012 synFamilySetupCardV014">
            <button type="button" className="synAuthBackV012" onClick={handleSignOut}>← Back</button>
            <div className="synFamilyStepV014">STEP 2 OF 3 · CHILD SETUP</div>
            <h1>Set up your child&apos;s space</h1>
            <p className="synAuthLeadV012">Just the essentials. SynapStride will learn the rest naturally from what they discover, learn and experience.</p>

            <form className="synAuthFormV012 synFamilySetupFormV014" onSubmit={handleParentSetupSubmit}>
              <div className="synFamilyBasicsV014">
                <label>
                  First name or nickname
                  <input type="text" name="name" value={childProfile.name} onChange={handleProfileChange} placeholder="Ethan" autoFocus required />
                </label>
                <label>
                  Age
                  <select name="age" value={childProfile.age} onChange={handleProfileChange}>
                    {Array.from({ length: 11 }, (_, index) => {
                      const age = index + 5
                      return <option key={age} value={age}>{age}</option>
                    })}
                  </select>
                </label>
              </div>

              <div className="synFamilyAvatarSectionV014">
                <AvatarPicker
                  age={childProfile.age}
                  value={childProfile.avatarId}
                  compact
                  onChange={(avatarId) => setChildProfile((current) => ({ ...current, avatarId }))}
                />
              </div>

              <fieldset className="synChildAccessV014">
                <legend>How should {childProfile.name.trim() || 'your child'} sign in later?</legend>

                <label className={!childAccess.enabled ? 'selected' : ''}>
                  <input type="radio" name="childAccessMode" checked={!childAccess.enabled}
                    onChange={() => setChildAccess((current) => ({ ...current, enabled: false, message: '' }))} />
                  <span><strong>Through the family account</strong><small>Simple for younger children or a shared family device.</small></span>
                </label>

                <label className={childAccess.enabled ? 'selected' : ''}>
                  <input type="radio" name="childAccessMode" checked={childAccess.enabled}
                    onChange={() => setChildAccess((current) => ({ ...current, enabled: true, message: '' }))} />
                  <span><strong>Give {childProfile.name.trim() || 'my child'} their own sign-in</strong><small>They can return directly to their space without using your parent credentials.</small></span>
                </label>

                {childAccess.enabled && (
                  <div className="synChildCredentialsV014">
                    <label>Child username
                      <input type="text" value={childAccess.username}
                        onChange={(event) => setChildAccess((current) => ({ ...current, username: event.target.value, message: '' }))}
                        placeholder="ethan.k" autoComplete="off" />
                    </label>
                    <label>Password
                      <input type="password" value={childAccess.password}
                        onChange={(event) => setChildAccess((current) => ({ ...current, password: event.target.value, message: '' }))}
                        placeholder="At least 8 characters" autoComplete="new-password" />
                    </label>
                    <label>Confirm password
                      <input type="password" value={childAccess.confirmPassword}
                        onChange={(event) => setChildAccess((current) => ({ ...current, confirmPassword: event.target.value, message: '' }))}
                        placeholder="Repeat password" autoComplete="new-password" />
                    </label>
                    <p>Parent-managed access · Child sign-in opens only this child&apos;s space.</p>
                  </div>
                )}

                {childAccess.message && <div className="synChildAccessMessageV014">{childAccess.message}</div>}
              </fieldset>

              <button className="synAuthPrimaryV012" type="submit">Continue to Parent Goals →</button>
            </form>
          </div>
        </section>
      )}

      {screen === 'parentIntentSetup' && (
        <section className="synParentIntentPageV014">
          <div className="synAuthBrandV012"><img src={synapStrideMark} alt="" /><strong>Synap<span>Stride</span></strong></div>
          <div className="synParentIntentCardV014">
            <button type="button" className="synAuthBackV012" onClick={() => setScreen('parentSetup')}>← Back</button>
            <div className="synFamilyStepV014">STEP 3 OF 3 · YOUR GOALS</div>
            <h1>What would you like SynapStride to help {childProfile.name || 'your child'} with?</h1>
            <p className="synParentIntentLeadV014">Choose up to three. Your goals guide what SynapStride emphasizes without defining who your child is.</p>
            <div className="synParentIntentGridV014">
              {parentIntentGoals.map((goal) => {
                const selected = parentIntent.goals.includes(goal)
                const disabled = !selected && parentIntent.goals.length >= 3
                return (
                  <button key={goal} type="button" className={selected ? 'selected' : ''} disabled={disabled} onClick={() => toggleParentIntentGoal(goal)}>
                    <span>{selected ? '✓' : '+'}</span>{goal}
                  </button>
                )
              })}
            </div>
            <label className="synParentIntentNoteV014">
              Anything else you want us to keep in mind? <small>Optional</small>
              <textarea value={parentIntent.note} maxLength={240}
                onChange={(event) => setParentIntent((current) => ({ ...current, note: event.target.value }))}
                placeholder="For example: I'd like them to become more confident trying new things." />
            </label>
            <div className="synParentIntentActionsV014">
              <span>{parentIntent.goals.length}/3 selected</span>
              <button type="button" className="synAuthPrimaryV012" onClick={finishParentIntentSetup}>Finish Setup →</button>
            </div>
          </div>
        </section>
      )}

      {screen === 'parentHandoff' && (
        <section className="synParentIntentPageV014">
          <div className="synAuthBrandV012"><img src={synapStrideMark} alt="" /><strong>Synap<span>Stride</span></strong></div>
          <div className="synParentHandoffCardV014">
            <Avatar avatarId={childProfile.avatarId} size={76} />
            <p className="synAuthEyebrowV012">YOU&apos;RE ALL SET</p>
            <h1>{childProfile.name || 'Your child'}&apos;s SynapStride is ready.</h1>
            <p>Now it&apos;s {childProfile.name || 'their'}&apos;s turn. SynapStride will start by listening to their own interests and preferences.</p>
            <div className="synHandoffPrinciplesV014">
              <span>🔎 They discover</span><span>🚀 They experience</span>
              <span>🧠 SynapStride learns</span><span>❤️ You add perspective</span>
            </div>
            <p className="synHandoffGuardrailV014">Your goals help guide SynapStride, but they don&apos;t define {childProfile.name || 'your child'}.</p>
            <button type="button" className="synAuthPrimaryV012" onClick={goToChildSpace}>Hand over to {childProfile.name || 'Child'} →</button>
            <button type="button" className="synHandoffParentSpaceV014" onClick={goToParentSpace}>Go to Parent Space</button>
            <button type="button" className="synParentIntentBackLinkV014" onClick={() => setScreen('parentIntentSetup')}>← Edit parent goals</button>
          </div>
        </section>
      )}

      {(screen === 'childSpace' ||
        screen === 'journey') && (
        <BppWorkspaceShell
          authRole={authSession?.role}
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

            onCompanionExploration={
              handleCompanionExploration
            }

            evidenceEventCount={
              evidenceEventCount
            }

            growthProfile={
              growthIntelligenceProfile
            }
            modelBackedUnderstanding={modelBackedChildUnderstanding}
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
          authRole={authSession?.role}
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
          authRole={authSession?.role}
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
                ABOUT ME
              </p>

              <h2>
                Thanks, {childProfile.name.trim()}.
                I learned a little more about you.
              </h2>

              <p className="handoffText">
                What you shared is one part of your
                evolving About Me story — alongside what you
                try, learn, and reflect on inside SynapStride.
              </p>

              <p className="handoffText">
                These are clues, not permanent labels.
                As you grow and try new things, what SynapStride
                understands about you can grow and change too.
              </p>

              <button
                className="cta"
                onClick={() =>
                  setScreen(
                    'growthProfile'
                  )
                }
              >
                See My About Me →
              </button>

            </div>

          </section>
        </BppWorkspaceShell>
      )}


      {screen ===
        'growthProfile' && (
        <BppWorkspaceShell
          authRole={authSession?.role}
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
                    childProfile={childProfile}
                    onAvatarChange={(avatarId) =>
                      setChildProfile((current) => ({
                        ...current,
                        avatarId,
                      }))
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

                    adaptiveAboutMe={adaptiveAboutMe}
                    isChildUnderstandingLoading={isChildUnderstandingLoading}
                    onReflectionResponse={handleReflectionResponse}

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
          authRole={authSession?.role}
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
            evidenceEvents={currentChildEvidenceEvents}
            topTraits={intelligenceTraits}
            topDomains={intelligenceDomains}
            parentPerspectiveComplete={parentPerspectiveComplete}
            onAddObservation={startParentPerspective}
            onWhySynapStride={() => { setWhyReturnScreen('parentSpace'); setScreen('whySynapStride') }}
          />
        </BppWorkspaceShell>
      )}


      {screen ===
        'parentPerspectiveIntro' && (
        <BppWorkspaceShell
          authRole={authSession?.role}
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
            mode="intro"
            onBegin={beginParentPerspective}
            onBack={handleParentPerspectiveBack}
            onAnswer={handleParentAnswer}
            onFinish={goToParentSpace}
          />
        </BppWorkspaceShell>
      )}


      {screen ===
        'parentPerspective' && (
        <BppWorkspaceShell
          authRole={authSession?.role}
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
          authRole={authSession?.role}
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
          authRole={authSession?.role}
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
            modelBackedUnderstanding={modelBackedChildUnderstanding}
            parentAccount={parentAccount}
            childPrivacyConsent={childPrivacyConsent}
            onPrivacy={() => openPrivacyNotice('settings')}
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


function AuthWelcome({ onGetStarted, onSignIn, onWhy, onPrivacy, onTerms, onContact }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const journey = [
    { icon: '📘', title: 'Learn', text: 'Get help with schoolwork without simply being handed the answer.', tone: 'learn' },
    { icon: '🔭', title: 'Explore', text: 'Discover topics, ideas and experiences based on curiosity.', tone: 'explore' },
    { icon: '🛠️', title: 'Try', text: 'Turn interests into activities, projects and real-world experiences.', tone: 'try' },
    { icon: '🧭', title: 'Discover Me', text: 'See interests, strengths and experiences come together over time.', tone: 'discover' },
  ]

  const growthSignals = [
    ['📚', 'School & Learning'], ['⭐', 'Interests'], ['🎯', 'Activities'],
    ['🏔️', 'Experiences'], ['💬', 'Reflections'], ['👨‍👩‍👧', 'Parent perspective'],
  ]

  return (
    <div className="synPublicV018 synPublicRedesign">
      <nav className="synPublicNavV018" aria-label="Public website">
        <button className="synPublicBrandV018" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={synapStrideMark} alt="" /><span>Synap<span>Stride</span></span>
        </button>
        <div className="synPublicLinksV018">
          <a href="#how-it-works">How it works</a>
          <a href="#for-parents">For Parents</a>
          <button type="button" onClick={onWhy}>Why SynapStride</button>
          <a href="#about">About</a>
        </div>
        <div className="synPublicActionsV018">
          <button type="button" className="synPublicBtnV018" onClick={onSignIn}>Sign In</button>
          <button type="button" className="synPublicBtnV018 primary" onClick={onGetStarted}>Get Started</button>
        </div>
      </nav>

      <header className="synPublicHeroV018">
        <div className="synPublicWrapV018 synPublicHeroGridV018">
          <div className="synHeroCopy">
            <p className="synPublicKickerV018">A PERSONAL GROWTH GUIDE FOR KIDS</p>
            <h1>Help your child <span className="wordLearn">learn</span>, <span className="wordExplore">explore</span>, and <span className="wordDiscover">discover</span> what comes next.</h1>
            <p className="synPublicLeadV018">SynapStride is an AI-powered growth guide that learns from what your child is learning, interested in, trying, and experiencing — and uses that understanding to help guide what comes next.</p>
            <div className="synPublicHeroButtonsV018">
              <button type="button" className="synPublicBtnV018 primary" onClick={onGetStarted}>Get Started <span>→</span></button>
              <button type="button" className="synPublicBtnV018 soft" onClick={() => scrollTo('how-it-works')}>▶ &nbsp; See how it works</button>
            </div>
            <div className="synPublicProofV018">
              <div><b>♥</b><strong>Built for curious minds</strong><small>Designed for growing kids</small></div>
              <div><b>🛡</b><strong>Safe and parent-guided</strong><small>A family-controlled space</small></div>
              <div><b>●●●</b><strong>Supports growth</strong><small>Today and tomorrow</small></div>
            </div>
          </div>

          <div className="synHeroWorld" aria-label="Kids learning, exploring and discovering">
            <div className="synHeroBlob"></div>
            <div className="synKidPair synNeutralLearners" aria-hidden="true">
              <div className="synNeutralPerson synNeutralPersonLarge"><span className="synNeutralHead"></span><span className="synNeutralBody"></span></div>
              <div className="synNeutralPerson synNeutralPersonSmall"><span className="synNeutralHead"></span><span className="synNeutralBody"></span></div>
              <div className="synLaptop">⌨</div>
            </div>
            <span className="synDoodle rocket">🚀</span><span className="synDoodle globe">🌎</span><span className="synDoodle bulb">💡</span>
            <span className="synDoodle planet">🪐</span><span className="synDoodle art">🎨</span><span className="synDoodle music">♫</span>
            <span className="synHeroPill learn">Learn</span><span className="synHeroPill explore">Explore</span><span className="synHeroPill try">Try</span><span className="synHeroPill discover">Discover Me</span>
          </div>
        </div>
      </header>

      <main>
        <section className="synJourneySection" id="how-it-works">
          <div className="synPublicWrapV018 compact">
            <div className="synSectionTitleRow">
              <div><p className="synMiniLabel">WHAT YOUR CHILD CAN DO</p><h2>A place for every step of their journey.</h2></div>
              <p>From homework to hobbies, curiosity to real-world experiences — SynapStride helps kids take the next step with confidence.</p>
            </div>
            <div className="synJourneyGrid">
              {journey.map((item, index) => <article className={`synJourneyCard ${item.tone}`} key={item.title}>
                <div className="synJourneyIcon">{item.icon}</div><div className="synJourneyNumber">0{index + 1}</div>
                <h3>{item.title}</h3><p>{item.text}</p><span className="synRoundArrow">→</span>
              </article>)}
            </div>
          </div>
        </section>

        <section className="synWhyGrowthSection">
          <div className="synPublicWrapV018 compact synWhyGrowthGrid">
            <article className="synWhyPanel">
              <p className="synMiniLabel">WHY SYNAPSTRIDE</p>
              <h2>Most AI helps with a question.<br/><span>SynapStride helps with the journey.</span></h2>
              <div className="synCompareGrid">
                <div className="synCompare typical"><h3>💬 &nbsp; Typical AI</h3><div className="synSimpleFlow"><span>Ask</span><i>→</i><span>Answer</span><i>→</i><span>Done</span></div><p>Great for a quick answer, but the journey usually stops there.</p></div>
                <div className="synCompare stride"><h3><img src={synapStrideMark} alt=""/> SynapStride</h3><div className="synJourneyMini"><span>📘<small>Learn</small></span><i>→</i><span>🔭<small>Explore</small></span><i>→</i><span>🛠️<small>Try</small></span><i>→</i><span>💬<small>Reflect</small></span></div><strong>Understand the child</strong><b>↓</b><strong>Guide what's next</strong></div>
              </div>
              <p className="synWhyNote">The more your child learns, explores and experiences, the more SynapStride can understand what may be helpful next.</p>
            </article>

            <article className="synGrowthPanel">
              <p className="synMiniLabel">HOW IT GROWS WITH YOUR CHILD</p>
              <h2>It starts by helping today.<br/>It becomes more useful <span>over time.</span></h2>
              <p className="synGrowthIntro">As your child learns, explores, tries new things and reflects, SynapStride builds a growing understanding of their interests, strengths and experiences.</p>
              <div className="synGrowthDiagram">
                <div className="synSignalStack">{growthSignals.map(([icon,label]) => <div key={label}><span>{icon}</span>{label}</div>)}</div>
                <div className="synGrowthLines">➜</div>
                <div className="synGrowthCore"><img src={synapStrideMark} alt=""/><strong>Growth<br/>Intelligence</strong></div>
                <div className="synGrowthArrow">→</div>
                <div className="synWhatsNext"><b>💡</b><strong>What's next?</strong><small>Personalized guidance for their growth journey.</small></div>
              </div>
            </article>
          </div>
        </section>

        <section className="synParentsSection" id="for-parents">
          <div className="synPublicWrapV018 compact synParentsPanel">
            <div className="synParentsCopy">
              <p className="synMiniLabel">FOR PARENTS</p><h2>For parents, it isn't another thing to manage.</h2>
              <p>See what your child is exploring, what they're working on, what they're discovering about themselves, and where they may benefit from encouragement or another opportunity.</p>
              <div className="synParentBenefits"><div><b>♥</b><strong>Help today</strong><small>Support their learning and interests now.</small></div><div><b>▥</b><strong>Understand over time</strong><small>See their growth and emerging interests.</small></div><div><b>●●●</b><strong>Guide what comes next</strong><small>Identify opportunities and encourage their journey.</small></div></div>
            </div>
            <div className="synFamilyScene" aria-label="Family learning together"><div className="synFamilyPeople synNeutralFamily" aria-hidden="true"><div className="synNeutralPerson synNeutralParent"><span className="synNeutralHead"></span><span className="synNeutralBody"></span></div><div className="synNeutralPerson synNeutralChildOne"><span className="synNeutralHead"></span><span className="synNeutralBody"></span></div><div className="synNeutralPerson synNeutralChildTwo"><span className="synNeutralHead"></span><span className="synNeutralBody"></span></div></div><div className="synFamilyDevice">▰</div><div className="synTrustList"><span>✓ Simple and easy to use</span><span>✓ Private and secure</span><span>✓ Built for real family life</span><span>✓ Designed for curious minds</span></div></div>
          </div>
        </section>

        <section className="synFinalCta">
          <div className="synScenery"><div className="synHikers synNeutralHikers" aria-hidden="true"><div className="synNeutralPerson synHikerOne"><span className="synNeutralHead"></span><span className="synNeutralBody"></span><span className="synBackpack"></span></div><div className="synNeutralPerson synHikerTwo"><span className="synNeutralHead"></span><span className="synNeutralBody"></span><span className="synBackpack"></span></div></div><div><h2>Every child is figuring out who they are.</h2><h3>Give them a place designed to grow with them.</h3><button type="button" className="synPublicBtnV018 primary" onClick={onGetStarted}>Create Your Family Space &nbsp; →</button></div></div>
        </section>

        <section className="synAboutStrip" id="about"><div><strong>SynapStride LLC</strong><span>An Arizona-based technology company building AI-powered experiences for children and families.</span></div></section>
      </main>

      <footer className="synPublicFooterV018 simple">
        <button className="synPublicBrandV018" type="button" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}><img src={synapStrideMark} alt=""/><span>Synap<span>Stride</span></span></button>
        <div className="synFooterLinks"><a href="#about">About</a><button type="button" onClick={() => { window.scrollTo({ top: 0, behavior: 'auto' }); onContact?.() }}>Contact</button><button type="button" onClick={onPrivacy}>Privacy</button><button type="button" onClick={onTerms}>Terms</button></div>
        <p>© 2026 SynapStride LLC</p>
      </footer>
    </div>
  )
}

function ChildPrivacyConsentScreen({ parentEmail, onAccept, onReview, onBack }) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <section className="synPrivacyPage">
      <div className="synPrivacyBrand">
        <img src={synapStrideMark} alt="" />
        <strong>Synap<span>Stride</span></strong>
      </div>
      <div className="synConsentCard">
        <button type="button" className="synAuthBackV012" onClick={onBack}>← Back</button>
        <div className="synPrivacyEyebrow">PARENT PRIVACY NOTICE</div>
        <h1>Before we create your child&apos;s space</h1>
        <p className="synPrivacyLead">
          SynapStride uses information about your child&apos;s learning, interests, activities and experiences to provide personalized guidance and build an evolving Growth Profile.
        </p>

        <div className="synConsentGrid">
          <div><span>✨</span><strong>We use it to help them</strong><p>Personalize learning, exploration, activities and guidance.</p></div>
          <div><span>🤖</span><strong>AI helps provide guidance</strong><p>Some information may be processed by our AI technology providers to create personalized responses.</p></div>
          <div><span>🚫</span><strong>We don&apos;t sell child data</strong><p>We do not use children&apos;s personal information for targeted advertising.</p></div>
          <div><span>🛡️</span><strong>You&apos;re in control</strong><p>Parents can review our privacy practices and will have controls for access, deletion and consent.</p></div>
        </div>

        <button type="button" className="synPrivacyNoticeLink" onClick={onReview}>Review Children&apos;s Privacy Notice →</button>

        <label className="synConsentCheck">
          <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
          <span>I am the parent or legal guardian and consent to SynapStride collecting and using my child&apos;s information as described in the Children&apos;s Privacy Notice.</span>
        </label>

        <button type="button" className="synConsentPrimary" disabled={!confirmed} onClick={onAccept}>
          Agree &amp; Create Child Space →
        </button>
        <p className="synConsentIdentity">Parent account: {parentEmail || 'signed-in parent'}</p>
        <p className="synConsentCaution">MVP privacy foundation: before broad public use by children under 13, SynapStride will add a production verifiable-parental-consent mechanism and parent data controls.</p>
      </div>
    </section>
  )
}

function PrivacyPolicyScreen({ onBack }) {
  return (
    <section className="synPrivacyDocumentPage">
      <header className="synPrivacyDocHeader">
        <button type="button" className="synPublicBrandV018" onClick={onBack}><img src={synapStrideMark} alt=""/><span>Synap<span>Stride</span></span></button>
        <button type="button" className="synPrivacyBack" onClick={onBack}>← Back</button>
      </header>
      <article className="synPrivacyDocument">
        <p className="synPrivacyEyebrow">PRIVACY</p>
        <h1>Privacy Policy &amp; Children&apos;s Privacy Notice</h1>
        <p className="synPrivacyUpdated">Draft for MVP review · October 3, 2026</p>
        <div className="synLegalDraftBanner"><strong>Pre-launch draft.</strong> This notice describes the current SynapStride MVP and is being finalized before broad public child use.</div>

        <h2>Our approach</h2>
        <p>SynapStride LLC builds tools that help children learn, explore interests, reflect on experiences and receive personalized guidance. We design SynapStride around parent-led family accounts and collect information to provide the service—not to sell children&apos;s personal information or target advertising to them.</p>

        <h2>Information we collect</h2>
        <p>Depending on how a family uses SynapStride, information may include a parent&apos;s account information; a child&apos;s first name or nickname, age, grade, avatar and optional child username; learning topics and schoolwork; interests, activities and experiences; child reflections and questions; parent observations and goals; and product-generated Growth Intelligence such as evidence, recommendations and guidance outcomes.</p>

        <h2>How we use information</h2>
        <p>We use information to operate the family and child spaces, provide learning and exploration guidance, personalize recommendations, maintain the child&apos;s evolving Growth Profile, improve the experience, protect the service and support parents in understanding their child&apos;s journey.</p>

        <h2>AI processing</h2>
        <p>SynapStride uses AI-assisted features. Information relevant to a request may be sent through SynapStride&apos;s service infrastructure to AI technology providers to generate guidance, interpret context or support personalization. SynapStride may also retain derived signals and outcomes that are useful to the child&apos;s Growth Profile.</p>

        <h2>Children under 13</h2>
        <p>SynapStride is designed to be parent-led. For children under 13, we intend to provide parents with direct notice and obtain verifiable parental consent before collecting personal information from the child, except where an applicable legal exception permits otherwise. The current MVP consent screen is a product foundation and is not represented as the final production verification mechanism.</p>

        <h2>Sharing</h2>
        <p>We do not sell children&apos;s personal information and do not use it for targeted advertising. We may use service providers that are necessary to operate SynapStride, such as hosting, security, authentication and AI-processing providers. We intend to limit information shared with providers to what is reasonably necessary for those services and require appropriate protections.</p>

        <h2>Parent choices and controls</h2>
        <p>Parents may contact SynapStride to ask about information associated with their family, request access or deletion, or withdraw consent. Product-based access, deletion and consent-management controls are planned before broad public child use.</p>

        <h2>Retention and security</h2>
        <p>We intend to retain children&apos;s personal information only as long as reasonably necessary for the purpose for which it was collected, subject to legal, security and backup requirements. The MVP currently uses local browser storage for portions of family and Growth Intelligence state while production account and data infrastructure is being completed.</p>

        <h2>Contact</h2>
        <p>Privacy questions, parental-rights requests and questions about a child&apos;s information can be directed to SynapStride LLC at <a href="mailto:privacy@synapstride.com">privacy@synapstride.com</a>.</p>

        <p className="synLegalDisclaimer">This draft is provided as a product/compliance working document and is not legal advice. SynapStride LLC should have the final policy and parental-consent implementation reviewed by qualified counsel before broad public use by children under 13.</p>
      </article>
    </section>
  )
}

function TermsOfUseScreen({ onBack }) {
  return (
    <section className="synPrivacyDocumentPage">
      <header className="synPrivacyDocHeader">
        <button type="button" className="synPublicBrandV018" onClick={onBack}><img src={synapStrideMark} alt=""/><span>Synap<span>Stride</span></span></button>
        <button type="button" className="synPrivacyBack" onClick={onBack}>← Back</button>
      </header>
      <article className="synPrivacyDocument">
        <p className="synPrivacyEyebrow">TERMS</p>
        <h1>Terms of Use</h1>
        <p className="synPrivacyUpdated">Draft for MVP review · October 3, 2026</p>
        <div className="synLegalDraftBanner"><strong>Pre-launch draft.</strong> These terms describe the current SynapStride MVP and will be finalized before broad public launch.</div>

        <h2>About SynapStride</h2>
        <p>SynapStride is operated by SynapStride LLC. The service provides tools that help families support children as they learn, explore interests, reflect on experiences and receive personalized guidance. These Terms of Use govern access to and use of the SynapStride website and service.</p>

        <h2>Parent-led family accounts</h2>
        <p>SynapStride is designed around a parent or legal guardian creating and managing the family account. A parent or legal guardian is responsible for creating or authorizing child profiles and child access, providing accurate information, maintaining account security and supervising use of the service as appropriate for the child.</p>

        <h2>Using SynapStride</h2>
        <p>You agree to use SynapStride only for lawful purposes and in a way that does not harm children, other users, the service or its systems. You may not attempt to gain unauthorized access, interfere with operation of the service, misuse another person&apos;s account, introduce malicious code, scrape or reverse engineer protected portions of the service except where applicable law expressly permits it.</p>

        <h2>AI-generated guidance</h2>
        <p>SynapStride uses artificial intelligence to help generate explanations, suggestions, recommendations and other guidance. AI-generated content may be incomplete, inaccurate or inappropriate for a particular situation and should not be treated as professional, medical, legal, financial or other expert advice. Parents and children should use judgment and, where appropriate, verify important information with a qualified adult, educator or professional.</p>

        <h2>Educational use</h2>
        <p>SynapStride is intended to support learning and growth, not replace a parent, teacher, school or qualified professional. The service does not guarantee academic outcomes, admission results, career outcomes or any particular result from following a recommendation.</p>

        <h2>Your content</h2>
        <p>Families may provide information, questions, reflections, activities and other content to SynapStride. You retain ownership of content you provide. You authorize SynapStride to process that content as reasonably necessary to operate, personalize, secure and improve the service, subject to our Privacy Policy and Children&apos;s Privacy Notice.</p>

        <h2>SynapStride content and intellectual property</h2>
        <p>SynapStride&apos;s software, design, branding, interfaces and original service content are owned by SynapStride LLC or its licensors and are protected by applicable intellectual-property laws. These terms give you permission to use the service; they do not transfer ownership of SynapStride intellectual property.</p>

        <h2>Third-party services and resources</h2>
        <p>SynapStride may use or link to third-party services and educational resources. Those services may have their own terms and privacy practices. A link or recommendation does not mean SynapStride controls or guarantees the third-party service, resource or content.</p>

        <h2>Privacy and children&apos;s information</h2>
        <p>Our collection and use of personal information is described in the SynapStride Privacy Policy &amp; Children&apos;s Privacy Notice. Parent consent and child privacy protections are being finalized before broad public use by children under 13.</p>

        <h2>MVP and service changes</h2>
        <p>SynapStride is currently an evolving MVP. Features may be added, changed, interrupted or removed as the product develops. We may update these terms as the service changes and will post an updated effective date when a production version is published.</p>

        <h2>Accounts and termination</h2>
        <p>We may suspend or terminate access when reasonably necessary to protect children, users, SynapStride or others; respond to unlawful or abusive activity; or comply with legal obligations. A parent may stop using the service at any time. Production account and data-deletion procedures will be published before broad public launch.</p>

        <h2>Disclaimers and limitation of liability</h2>
        <p>To the extent permitted by applicable law, the service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without guarantees that it will always be uninterrupted, error-free or suitable for every purpose. Any limitations of liability in the final production terms will be written to preserve rights and remedies that cannot legally be waived.</p>

        <h2>Contact</h2>
        <p>Questions about these terms may be directed to SynapStride LLC at <a href="mailto:info@synapstride.com">info@synapstride.com</a>.</p>

        <p className="synLegalDisclaimer">This pre-launch draft is a product/legal working document and is not legal advice. SynapStride LLC should have the final production terms reviewed by qualified counsel before broad public launch.</p>
      </article>
    </section>
  )
}

function ContactScreen({ onBack }) {
  return (
    <section className="synPrivacyDocumentPage">
      <header className="synPrivacyDocHeader">
        <button type="button" className="synPublicBrandV018" onClick={onBack}><img src={synapStrideMark} alt=""/><span>Synap<span>Stride</span></span></button>
        <button type="button" className="synPrivacyBack" onClick={onBack}>← Back</button>
      </header>
      <article className="synPrivacyDocument synContactDocument">
        <p className="synPrivacyEyebrow">CONTACT</p>
        <h1>Contact SynapStride</h1>
        <p className="synPrivacyLead">Have a question about SynapStride, your family account, privacy, partnerships or the product? We&apos;d be happy to hear from you.</p>

        <div className="synContactGrid">
          <div className="synContactCard">
            <h2>General inquiries</h2>
            <p>Questions about SynapStride, partnerships or the product.</p>
            <div className="synContactEmailRow">
              <a className="synContactEmailLink" href="mailto:info@synapstride.com">info@synapstride.com</a>
            </div>
          </div>
          <div className="synContactCard">
            <h2>Privacy &amp; children&apos;s data</h2>
            <p>Questions about privacy, parental rights or your child&apos;s information.</p>
            <div className="synContactEmailRow">
              <a className="synContactEmailLink" href="mailto:privacy@synapstride.com">privacy@synapstride.com</a>
            </div>
          </div>
        </div>

        <h2>Company</h2>
        <p><strong>SynapStride LLC</strong><br/>Arizona, United States</p>
        <p className="synContactResponse">We aim to respond to inquiries within 2–3 business days.</p>
      </article>
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
            {isSignUp ? 'Email address' : 'Email or child username'}
            <input
              type={isSignUp ? 'email' : 'text'}
              name="email"
              value={authForm.email}
              onChange={onChange}
              placeholder={isSignUp ? 'you@example.com' : 'you@example.com or ethan.k'}
              autoComplete={isSignUp ? 'email' : 'username'}
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
  modelBackedUnderstanding = null,
  parentAccount,
  childPrivacyConsent,
  onPrivacy,
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

        <article className="synSettingsCardV01112 synPrivacySettingsCard">
          <span className="synSettingsCardIconV01112">🛡️</span>
          <div>
            <span className="synSettingsEyebrowV01112">PRIVACY &amp; DATA</span>
            <h2>Child privacy</h2>
            <p>
              Parent consent: <strong>{childPrivacyConsent?.status === 'active' ? 'Active' : 'Not recorded'}</strong>
              {childPrivacyConsent?.acceptedAt ? ` · ${new Date(childPrivacyConsent.acceptedAt).toLocaleDateString()}` : ''}
            </p>
            <button type="button" className="synPrivacyTextButton" onClick={onPrivacy}>
              View Children&apos;s Privacy Notice
            </button>
            <small>Data download, deletion, and consent withdrawal controls will be added before broad public child use.</small>
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
            modelBackedUnderstanding={modelBackedUnderstanding}
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
  authRole,
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
  const sessionLabel = authRole === 'parent' ? `Parent session · viewing ${childName}` : `${childAge} · Child session`

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
            <span className="synNavIconV0116 profile"><SynIcon name="profile" /></span><strong>About Me</strong>
          </button>

          <div className={`synNavGroupV0116 ${parentOpen ? 'open' : ''}`}>
            <button type="button" className={parentOpen ? 'active' : ''} onClick={onParent}>
              <span className="synNavIconV0116 parent"><SynIcon name="people" /></span><strong>Parent Space</strong><span className="synChevronV0116">⌄</span>
            </button>
            {parentOpen && (
              <div className="synSubnavV0116 parentSub">
                <button type="button" className={activeParentSection === 'overview' ? 'active' : ''} onClick={() => onParentSection?.('overview')}><span><SynIcon name="observation" /></span>Overview</button>
                <button type="button" className={activeParentSection === 'observation' ? 'active' : ''} onClick={() => onParentSection?.('observation')}><span><SynIcon name="plus" /></span>Share Perspective</button>
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
                <div className="synChildAvatarV0116 synChildAvatarImageV014"><Avatar avatarId={childProfile?.avatarId} size={40} /></div>
                <div><strong>{childName}</strong><small>{sessionLabel}</small></div>
              </div>

              <div className="synChildAccountMenuDividerV0122" />

              <button type="button" role="menuitem" disabled title="Available when your family has more than one child">
                <span>⇄</span><span><strong>Switch Child</strong><small>One child in this MVP</small></span>
              </button>
              <button type="button" role="menuitem" disabled title="Multi-child family setup is coming next">
                <span>＋</span><span><strong>Add Child</strong><small>Coming with multi-child support</small></span>
              </button>
              {authRole === 'child' ? (
                <button type="button" role="menuitem" onClick={onParent}>
                  <span>🔐</span><span><strong>Parent sign in</strong><small>Authenticate to open Parent Space</small></span>
                </button>
              ) : (
                <button type="button" role="menuitem" onClick={onHome}>
                  <span>↔</span><span><strong>Open child space</strong><small>Stay signed in as parent</small></span>
                </button>
              )}
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
            <div className="synChildAvatarV0116 synChildAvatarImageV014"><Avatar avatarId={childProfile?.avatarId} size={40} /></div>
            <div><strong>{childName}</strong><small>{sessionLabel}</small></div>
            <span className="synChildMenuChevronV0122">⌃</span>
          </button>
        </div>
      </aside>

      <div className="synCanvasV0116">
        <header className="synMobileHeaderV0116">
          <button type="button" onClick={onHome} className="synMobileBrandV0116"><img src={synapStrideMark} alt="" /><span className="synMobileBrandTextV01181">Synap<span>Stride</span><i>✦</i></span></button>
          <button type="button" onClick={onProfile} className="synMobileAvatarV0116 synMobileAvatarImageV014"><Avatar avatarId={childProfile?.avatarId} size={34} /></button>
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
  evidenceEvents = [],
  topTraits = [],
  topDomains = [],
  parentPerspectiveComplete,
  onAddObservation,
  onWhySynapStride,
}) {
  const childName = childProfile?.name?.trim() || 'Your child'
  const parentContributionCount = profileUnderstanding?.sources?.parentContributionCount || 0
  const topPattern = promotedPatterns[0] || null
  const nextRecommendation = recommendations[0] || null

  const firstUseSignals = buildFirstUseSignals({
    evidenceEvents,
    topTraits,
    topDomains,
    limit: 3,
  })

  const nextRecommendationReason = explainRecommendation(
    nextRecommendation,
    firstUseSignals
  )

  const recentJourney = [...journeyItems]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .slice(0, 3)

  const activeJourney = recentJourney.filter((item) => item.status !== 'completed')

  const recentParentPerspectives = evidenceEvents
    .filter((event) =>
      event.source?.type === evidenceSourceTypes.PARENT_OBSERVATION &&
      event.source?.experienceId === 'parent_perspective' &&
      event.metadata?.responseText
    )
    .sort((a, b) => new Date(b.createdAt || b.timestamp || 0) - new Date(a.createdAt || a.timestamp || 0))
    .slice(0, 4)

  return (
    <section className="ss-parent-v015">
      <header className="ss-parent-v015__hero">
        <div className="ss-parent-v015__identity">
          <Avatar avatarId={childProfile?.avatarId} size={58} />
          <div>
            <span className="ss-parent-v015__eyebrow">PARENT SPACE</span>
            <h1>{childName}&apos;s week at a glance</h1>
            <p>
              A simple view of what {childName} is working on, what SynapStride is beginning
              to notice, and where your perspective may help.
            </p>
          </div>
        </div>
        <button type="button" className="ss-parent-v015__quietLink" onClick={onWhySynapStride}>
          How SynapStride helps →
        </button>
      </header>

      <div className="ss-parent-v015__grid">
        <article className="ss-parent-v015__card ss-parent-v015__card--wide">
          <span className="ss-parent-v015__eyebrow">WHAT {childName.toUpperCase()} IS WORKING ON</span>
          {activeJourney.length > 0 ? (
            <div className="ss-parent-v015__workList">
              {activeJourney.map((item) => (
                <div className="ss-parent-v015__workItem" key={item.id}>
                  <span className="ss-parent-v015__workEmoji">{item.emoji || '•'}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.status === 'completed' ? 'Completed' : 'In progress'}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ss-parent-v015__empty">
              <strong>No active work yet.</strong>
              <p>School work, activities, and experiences will appear here as {childName} uses SynapStride.</p>
            </div>
          )}
        </article>

        <article className="ss-parent-v015__card ss-parent-v015__card--signal">
          <span className="ss-parent-v015__eyebrow">SYNAPSTRIDE IS BEGINNING TO NOTICE</span>
          {topPattern ? (
            <>
              <h2>{topPattern.emoji ? `${topPattern.emoji} ` : '🌱 '}{topPattern.label}</h2>
              <p>This pattern has support across more than one piece of evidence. It is still an evolving clue, not a permanent label.</p>
            </>
          ) : firstUseSignals.length > 0 ? (
            <>
              <h2>🌱 Early clues are taking shape</h2>
              <p>These are starting points from {childName}&apos;s own choices. SynapStride will wait for real experiences to strengthen or change them.</p>
              <div className="ss-parent-v015__chips">
                {firstUseSignals.map((signal) => (
                  <span key={signal.id}>{signal.emoji || '✨'} {signal.label}</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2>We&apos;re still gathering clues</h2>
              <p>Understanding will grow as {childName} learns, explores, reflects, and tries new things.</p>
            </>
          )}
        </article>

        <article className="ss-parent-v015__card">
          <span className="ss-parent-v015__eyebrow">HOW YOU COULD HELP</span>
          <h2>🤝 Share your perspective</h2>
          <p>You see interests, struggles, motivations, and everyday moments SynapStride may not. Your perspective adds useful context to the evolving picture.</p>
          <button type="button" className="ss-parent-v015__primary" onClick={onAddObservation}>
            Share Perspective →
          </button>
          <small className="ss-parent-v015__meta">
            {parentContributionCount > 0
              ? `${parentContributionCount} parent perspective contribution${parentContributionCount === 1 ? '' : 's'}`
              : parentPerspectiveComplete
                ? 'Parent perspective is contributing to the Profile'
                : 'No parent perspective shared yet'}
          </small>
        </article>

        <article className="ss-parent-v015__card ss-parent-perspective-history-v015">
          <span className="ss-parent-v015__eyebrow">RECENT PERSPECTIVE</span>
          {recentParentPerspectives.length > 0 ? (
            <>
              <h2>What you&apos;ve shared</h2>
              <div className="ss-parent-perspective-history-v015__list">
                {recentParentPerspectives.map((event, index) => (
                  <div key={event.id || `${event.source?.questionId}-${index}`}>
                    <span>💬</span>
                    <div>
                      <strong>{event.metadata?.responseText}</strong>
                      <small>{event.metadata?.questionText || 'Parent perspective'}</small>
                    </div>
                  </div>
                ))}
              </div>
              <p className="ss-parent-perspective-history-v015__note">
                These are pieces of context — not labels. SynapStride looks for corroboration across {childName}&apos;s own voice and real experiences.
              </p>
            </>
          ) : (
            <>
              <h2>Your perspective grows over time</h2>
              <p>As you share what you notice, recent perspectives will appear here so you can see the context you&apos;ve contributed.</p>
            </>
          )}
        </article>

        <article className="ss-parent-v015__card">
          <span className="ss-parent-v015__eyebrow">SOMETHING WORTH CONSIDERING</span>
          {nextRecommendation ? (
            <>
              <h2>{nextRecommendation.emoji || '🧭'} {nextRecommendation.title}</h2>
              <p>{nextRecommendation.reasons?.[0] || nextRecommendationReason || 'This may be a useful next experience based on what SynapStride understands so far.'}</p>
            </>
          ) : (
            <>
              <h2>🧭 Keep the journey moving</h2>
              <p>SynapStride will surface a stronger suggestion after it has more evidence from real activity.</p>
            </>
          )}
        </article>
      </div>

      <footer className="ss-parent-v015__note">
        <span>🔒</span>
        <p><strong>Parent perspective adds context.</strong> It does not overwrite {childName}&apos;s voice or turn an early clue into a label.</p>
      </footer>
    </section>
  )
}


export default App
