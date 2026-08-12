import { useState } from 'react'
import './App.css'

import { explorations } from './data/explorations'
import { discoveryQuestions } from './data/discoveryQuestions'

import ChildSpaceHome from './components/ChildSpaceHome'
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


// ============================================================
// APP
// ============================================================

function App() {
  const [
    screen,
    setScreen,
  ] = useState('landing')

  const [
    childProfile,
    setChildProfile,
  ] = useState({
    name: '',
    age: '11',
    grade: '6th Grade',
  })

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
  ] = useState(false)

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
  ] = useState([])

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
  ] = useState(false)

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

      console.group(
        '🌱 Growth Intelligence v0.3'
      )

      console.log(
        'New evidence:',
        validEvents
      )

      console.log(
        'All evidence:',
        allEvidence
      )

      console.log(
        'Growth profile:',
        profile
      )

      console.groupEnd()

      return profile
    }


  // ==========================================================
  // DEVELOPER RESET
  // ==========================================================

  const resetTestData = () => {
    const confirmed =
      window.confirm(
        'Reset all Career & Growth test data?\n\nThis will remove the current child, Discovery responses, Parent Perspective, Adventures, and all stored Growth Intelligence evidence.'
      )

    if (!confirmed) {
      return
    }

    // Clear persisted browser data for this site.
    localStorage.clear()

    // Child Space
    setChildProfile({
      name: '',
      age: '11',
      grade: '6th Grade',
    })

    // Discovery
    setCurrentQuestionIndex(0)
    setDiscoveryResponses([])
    setDiscoveryComplete(false)
    setDiscoverySessionId(null)

    // Parent Perspective
    setParentPerspectiveComplete(false)
    setParentQuestionIndex(0)
    setParentResponses([])
    setParentSessionId(null)

    // Adventures
    setActiveExploration(null)
    setExplorationStep('intro')
    setChallengeIndex(0)
    setExperienceResponses([])
    setEnjoymentResponse(null)
    setCompletedExplorations([])
    setEvidenceSessionId(null)

    // Growth Intelligence
    setGrowthIntelligenceProfile(null)
    setEvidenceEventCount(0)

    // Return to fresh Child Space setup.
    setScreen('parentSetup')

    console.log(
      '🧹 Career & Growth test data reset.'
    )
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

      setScreen(
        'childSpace'
      )
    }


  const goToChildSpace = () => {
    setScreen(
      'childSpace'
    )
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

    setScreen(
      'discovery'
    )
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

      setEnjoymentResponse(
        null
      )

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

      setScreen(
        'profileGrew'
      )
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

  return (
    <main className="page">

      {/* LANDING */}

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


      {/* CREATE CHILD SPACE */}

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


      {/* CHILD SPACE */}

      {screen ===
        'childSpace' && (
        <ChildSpaceHome
          childProfile={
            childProfile
          }

          discoveryComplete={
            discoveryComplete
          }

          evidenceEventCount={
            evidenceEventCount
          }

          completedExplorations={
            completedExplorations
          }

          growthIntelligenceProfile={
            growthIntelligenceProfile
          }

          parentPerspectiveComplete={
            parentPerspectiveComplete
          }

          onStartDiscovery={
            startDiscovery
          }

          onViewGrowthProfile={() =>
            setScreen(
              'growthProfile'
            )
          }

          onExploreAdventures={() =>
            setScreen(
              'adventures'
            )
          }

          onStartParentPerspective={
            startParentPerspective
          }
        />
      )}


      {/* DISCOVERY */}

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


      {/* DISCOVERY COMPLETE */}

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


      {/* GROWTH PROFILE */}

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
                onReset={
                  resetTestData
                }
              />
            ) : null
          }
        />
      )}


      {/* PARENT PERSPECTIVE */}

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
        />
      )}


      {/* ADVENTURES HUB */}

      {screen ===
        'adventures' && (
        <AdventuresHub
          childName={
            childProfile.name.trim()
          }
          recommendations={
            recommendations
          }
          onBack={
            goToChildSpace
          }
          onStartAdventure={
            startExploration
          }
        />
      )}


      {/* ADVENTURE EXPERIENCE */}

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


      {/* PROFILE GREW */}

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
            Clear all test evidence
            and start a new persona
            from a completely clean
            state.
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


export default App