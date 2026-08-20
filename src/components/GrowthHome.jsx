import {
  useMemo,
  useRef,
  useState,
} from 'react'

import './GrowthHome.css'
import './ExperienceResearchPanel.css'
import './JourneyPolish.css'
import './UnifiedJourney.css'

import ExperienceResearchPanel from './ExperienceResearchPanel'

import {
  learningHelpModeOptions,
} from '../intelligence/learningIntentEngine'

import {
  buildLearningNextSteps,
} from '../intelligence/learningNextStepEngine'

import {
  buildLearningProgression,
} from '../intelligence/learningProgressionEngine'

import {
  buildGrowthPatternIntelligence,
} from '../intelligence/growthPatternCorroborationEngine'

import {
  buildPatternPromotionRegistry,
} from '../intelligence/growthPatternPromotionEngine'

import {
  journeyPaths,
  journeyPathLabels,
  journeyPathEmojis,
  journeyActivityTypes,
  journeySources,
  journeyStatuses,
  getJourneyItemsByPath,
  normalizeJourneyItems,
} from '../intelligence/unifiedJourneyModels'


function GrowthHome({
  activeView = 'home',
  childProfile,
  discoveryComplete = false,
  completedExplorations = [],
  evidenceEventCount = 0,
  growthProfile = null,
  evidenceEvents = [],
  topTraits = [],
  topDomains = [],
  recommendations = [],
  researchedExperienceCandidates = [],
  onAddResearchedExperienceToJourney,
  studentIntents = [],
  journeyItems = [],
  completedJourneyInsight = null,
  onDismissJourneyInsight,
  onSaveStudentIntent,
  onStartGrow,
  onHome,
  onJourney,
  onJourneyProgress,
  onCompleteJourney,
  onAddLearningItem,
  onLearningItemStatus,
  onLearningHelpRequest,
  onLearningResourceFeedback,
  onLearningSupportOutcome,
  onDiscover,
  onExplore,
  onGrowthProfile,
  onParentPerspective,
}) {
  const [studentIdea, setStudentIdea] = useState('')

  const childName =
    childProfile?.name?.trim() ||
    'Explorer'

  const activeJourneyItems =
    journeyItems.filter(
      (item) => item.status !== 'completed'
    )

  const completedJourneyItems =
    journeyItems.filter(
      (item) => item.status === 'completed'
    )

  const currentJourney =
    activeJourneyItems[0] || null

  const topRecommendation =
    recommendations?.[0] || null

  const secondaryRecommendation =
    recommendations?.[1] || null

  const latestStudentIntent =
    [...studentIntents]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )[0] || null

  const strongestTraits =
    topTraits.slice(0, 4)

  const strongestDomains =
    topDomains.slice(0, 3)

  const handleStudentIdeaSubmit =
    (event) => {
      event.preventDefault()

      const cleanedIdea =
        studentIdea.trim()

      if (!cleanedIdea) {
        return
      }

      onSaveStudentIntent?.(
        cleanedIdea
      )

      setStudentIdea('')
    }

  return (
    <div className="growthHomeV06">

      <header className="growthAppHeaderV06">
        <button
          type="button"
          className="growthBrandButtonV06"
          onClick={onHome}
        >
          <span className="growthBrandMarkV06">
            🌱
          </span>

          <span className="growthBrandCopyV06">
            <strong>Career & Growth</strong>
            <small>Grow into you.</small>
          </span>
        </button>

        <nav
          className="growthTopNavV06"
          aria-label="Primary"
        >
          <button
            className={
              activeView === 'home'
                ? 'active'
                : ''
            }
            onClick={onHome}
          >
            Home
          </button>

          <button onClick={onDiscover}>
            Discover
          </button>

          <button onClick={onExplore}>
            Explore
          </button>

          <button
            className={
              activeView === 'journey'
                ? 'active'
                : ''
            }
            onClick={onJourney}
          >
            Journey

            {activeJourneyItems.length > 0 && (
              <span className="navCountV06">
                {activeJourneyItems.length}
              </span>
            )}
          </button>
        </nav>

        <div className="growthHeaderActionsV06">
          <button
            className="parentViewLinkV06"
            onClick={onParentPerspective}
          >
            Parent View
          </button>

          <button
            className="childMenuButtonV06"
            onClick={onGrowthProfile}
            title="Open growth profile"
          >
            <span className="childAvatarV06">
              {childName
                .charAt(0)
                .toUpperCase()}
            </span>

            <span className="childMenuCopyV06">
              <strong>{childName}</strong>
              <small>Age {childProfile?.age}</small>
            </span>
          </button>
        </div>
      </header>

      <main className="growthWorkspaceV06">

        {activeView === 'journey' ? (
          <JourneyPanel
            childName={childName}
            journeyItems={journeyItems}
            onHome={onHome}
            onJourneyProgress={
              onJourneyProgress
            }
            onCompleteJourney={
              onCompleteJourney
            }
            onAddLearningItem={
              onAddLearningItem
            }
            onLearningItemStatus={
              onLearningItemStatus
            }
            onLearningHelpRequest={
              onLearningHelpRequest
            }
            onLearningResourceFeedback={
              onLearningResourceFeedback
            }
            onLearningSupportOutcome={
              onLearningSupportOutcome
            }
            evidenceEvents={
              evidenceEvents
            }
          />
        ) : (
          <>
            <section className="growthPageIntroV06">
              <div>
                <span className="growthKickerV06">
                  MY GROWTH SPACE
                </span>

                <h1>
                  Hi {childName}.
                </h1>

                <p>
                  Pick up where you left off,
                  explore something new, or
                  tell us what sounds interesting.
                </p>
              </div>

              <button
                className="profileStatusV06"
                onClick={onGrowthProfile}
              >
                <span className="statusDotV06" />
                <span>
                  {growthProfile
                    ? 'Profile is evolving'
                    : 'Profile is getting started'}
                </span>
                <strong>View profile →</strong>
              </button>
            </section>

            {!discoveryComplete && (
              <section className="discoveryStartBannerV06">
                <div className="bannerIconV06">
                  🧭
                </div>
                <div>
                  <span className="growthKickerV06">
                    START HERE
                  </span>
                  <h2>
                    Let's discover what feels like you.
                  </h2>
                  <p>
                    A few simple questions give us our first clues
                    about what you enjoy, how you think, and what
                    makes you curious.
                  </p>
                </div>
                <button
                  className="growthPrimaryButtonV06"
                  onClick={onDiscover}
                >
                  Discover Me <span>→</span>
                </button>
              </section>
            )}

            {completedJourneyInsight && (
              <PostReflectionInsight
                insight={completedJourneyInsight}
                nextRecommendation={topRecommendation}
                onAddNext={onStartGrow}
                onDismiss={onDismissJourneyInsight}
              />
            )}

            {discoveryComplete && (
              <>
                <section className="homePrimaryGridV06">

                  <article className="homeFocusCardV06">
                    <div className="cardHeadingRowV06">
                      <div>
                        <span className="growthKickerV06">
                          CONTINUE
                        </span>
                        <h2>
                          What you're doing now
                        </h2>
                      </div>
                      <button
                        className="textActionV06"
                        onClick={onJourney}
                      >
                        Open Journey →
                      </button>
                    </div>

                    {currentJourney ? (
                      <div className="currentJourneyV06">
                        <div className="currentJourneyIconV06">
                          {currentJourney.emoji || '🌱'}
                        </div>

                        <div className="currentJourneyBodyV06">
                          <div className="currentJourneyTitleRowV06">
                            <h3>{currentJourney.title}</h3>
                            <span>
                              {currentJourney.progress?.percent || 0}%
                            </span>
                          </div>

                          <p>
                            {currentJourney.description ||
                              'Keep moving this experience forward and notice what you learn.'}
                          </p>

                          <div className="miniProgressTrackV06">
                            <div
                              style={{
                                width:
                                  `${currentJourney.progress?.percent || 0}%`,
                              }}
                            />
                          </div>

                          <button
                            className="growthPrimaryButtonV06"
                            onClick={onJourney}
                          >
                            Continue <span>→</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="focusEmptyV06">
                        <span>🛤️</span>
                        <div>
                          <strong>
                            Nothing in progress yet.
                          </strong>
                          <p>
                            Pick an experience and it will become
                            part of your Journey.
                          </p>
                        </div>
                        <button
                          className="growthPrimaryButtonV06"
                          onClick={onExplore}
                        >
                          Find an Experience <span>→</span>
                        </button>
                      </div>
                    )}
                  </article>

                  <article className="homeRecommendationCardV06">
                    <div className="cardHeadingRowV06">
                      <div>
                        <span className="growthKickerV06">
                          PICKED FOR YOU
                        </span>
                        <h2>
                          Try something next
                        </h2>
                      </div>
                      <button
                        className="textActionV06"
                        onClick={onExplore}
                      >
                        Explore all →
                      </button>
                    </div>

                    {topRecommendation ? (
                      <div className="recommendationMainV06">
                        <div className="recommendationIconV06">
                          {topRecommendation.emoji || '✨'}
                        </div>
                        <div>
                          <h3>{topRecommendation.title}</h3>
                          <p>
                            {topRecommendation.reasons?.[0] ||
                              'This fits patterns we are starting to notice about you.'}
                          </p>
                          <button
                            className="growthPrimaryButtonV06"
                            onClick={() =>
                              onStartGrow?.(
                                topRecommendation
                              )
                            }
                          >
                            Explore This <span>→</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mutedCopyV06">
                        Recommendations will appear as we learn
                        more about you.
                      </p>
                    )}

                    {secondaryRecommendation && (
                      <button
                        className="secondaryRecommendationV06"
                        onClick={() =>
                          onStartGrow?.(
                            secondaryRecommendation
                          )
                        }
                      >
                        <span>
                          {secondaryRecommendation.emoji || '🌱'}
                        </span>
                        <span>
                          <strong>
                            {secondaryRecommendation.title}
                          </strong>
                          <small>
                            Another idea worth trying
                          </small>
                        </span>
                        <span>→</span>
                      </button>
                    )}
                  </article>

                </section>

                <ExperienceResearchPanel
                  childName={childName}
                  candidates={
                    researchedExperienceCandidates
                  }
                  journeyItems={
                    journeyItems
                  }
                  onAddToJourney={
                    onAddResearchedExperienceToJourney
                  }
                />

                <section className="homeSnapshotV06">

                  <article className="snapshotProfileV06">
                    <div className="cardHeadingRowV06">
                      <div>
                        <span className="growthKickerV06">
                          WHAT WE'RE NOTICING
                        </span>
                        <h2>
                          Your Growth Profile
                        </h2>
                      </div>
                      <button
                        className="textActionV06"
                        onClick={onGrowthProfile}
                      >
                        See details →
                      </button>
                    </div>

                    <div className="traitChipListV06">
                      {strongestTraits.length > 0 ? (
                        strongestTraits.map(
                          (trait) => (
                            <span
                              className="traitChipV06"
                              key={trait.id}
                            >
                              <span>
                                {trait.emoji || '🌱'}
                              </span>
                              {trait.label}
                            </span>
                          )
                        )
                      ) : (
                        <span className="mutedCopyV06">
                          Keep exploring to reveal more patterns.
                        </span>
                      )}
                    </div>

                    {strongestDomains.length > 0 && (
                      <div className="domainLineV06">
                        <span>Curiosity:</span>
                        <strong>
                          {strongestDomains
                            .map(
                              (domain) =>
                                domain.label
                            )
                            .join(' · ')}
                        </strong>
                      </div>
                    )}

                    <div className="metricStripV06">
                      <div>
                        <strong>{journeyItems.length}</strong>
                        <span>Journey items</span>
                      </div>
                      <div>
                        <strong>
                          {completedJourneyItems.length +
                            completedExplorations.length}
                        </strong>
                        <span>Experiences tried</span>
                      </div>
                      <div>
                        <strong>{evidenceEventCount}</strong>
                        <span>Clues learned</span>
                      </div>
                    </div>
                  </article>

                  <article className="studentVoiceV06">
                    <span className="growthKickerV06">
                      YOUR VOICE
                    </span>
                    <h2>
                      What sounds interesting to you?
                    </h2>
                    <p>
                      You don't have to wait for a recommendation.
                    </p>

                    <form
                      className="studentIdeaFormV06"
                      onSubmit={handleStudentIdeaSubmit}
                    >
                      <input
                        type="text"
                        value={studentIdea}
                        onChange={(event) =>
                          setStudentIdea(event.target.value)
                        }
                        placeholder="I want to..."
                        aria-label="What do you want to try?"
                      />
                      <button
                        type="submit"
                        disabled={!studentIdea.trim()}
                      >
                        →
                      </button>
                    </form>

                    {latestStudentIntent && (
                      <div className="latestIdeaV06">
                        <span>You told us</span>
                        <strong>
                          “{latestStudentIntent.text}”
                        </strong>
                      </div>
                    )}
                  </article>

                </section>
              </>
            )}
          </>
        )}

      </main>
    </div>
  )
}


// ============================================================
// POST-REFLECTION
// ============================================================

function PostReflectionInsight({
  insight,
  nextRecommendation,
  onAddNext,
  onDismiss,
}) {
  const reflection = insight?.reflection || {}
  const item = insight?.journeyItem

  const enjoymentLabels = {
    not_for_me:
      'This one was not really for you.',
    okay:
      'You found some value in it.',
    liked_it:
      'You enjoyed this experience.',
    loved_it:
      'You really enjoyed this experience.',
  }

  const learningPoints = []

  if (
    reflection.enjoyment &&
    enjoymentLabels[reflection.enjoyment]
  ) {
    learningPoints.push(
      enjoymentLabels[reflection.enjoyment]
    )
  }

  if (reflection.favoritePart?.trim()) {
    learningPoints.push(
      `Favorite: “${reflection.favoritePart.trim()}”`
    )
  }

  if (reflection.wouldDoAgain === true) {
    learningPoints.push(
      'You would try something like this again.'
    )
  }

  if (reflection.wouldDoAgain === false) {
    learningPoints.push(
      'You would rather try something different.'
    )
  }

  return (
    <section className="postReflectionV06">
      <div className="postReflectionCopyV06">
        <span className="growthKickerV06">
          YOUR PROFILE GREW
        </span>
        <h2>
          We learned something new from{' '}
          {item?.title || 'this experience'}.
        </h2>
        <div className="reflectionChipsV06">
          {learningPoints.map(
            (point, index) => (
              <span key={index}>
                {point}
              </span>
            )
          )}
        </div>
      </div>

      <div className="postReflectionActionsV06">
        {nextRecommendation && (
          <button
            className="growthPrimaryButtonV06"
            onClick={() =>
              onAddNext?.(nextRecommendation)
            }
          >
            Try Next Idea <span>→</span>
          </button>
        )}
        <button
          className="textActionV06"
          onClick={onDismiss}
        >
          Dismiss
        </button>
      </div>
    </section>
  )
}


// ============================================================
// JOURNEY PANEL
// ============================================================

function LearningResourceRecommendations({
  item,
  onFeedback,
  onDone,
}) {
  const request =
    item
      ?.learningSupportRequest

  const recommended =
    request
      ?.resourcePipeline
      ?.recommended ||
    []

  const feedback =
    request
      ?.resourceFeedback ||
    {}

  if (!recommended.length) {
    return null
  }

  return (
    <div className="learningRecommendationsV086">
      <div className="learningRecommendationsHeaderV086">
        <span className="growthKickerV06">
          RECOMMENDED FOR YOU
        </span>

        <h4>
          Learning support selected for this need
        </h4>

        <p>
          These recommendations were evaluated against the subject,
          topic, and kind of help requested.
        </p>
      </div>

      <div className="learningRecommendationListV086">
        {recommended
          .slice(0, 3)
          .map(
            (
              {
                resource,
                evaluation,
              },
              index
            ) => {
              const savedFeedback =
                feedback[
                  resource.id
                ]
                  ?.feedbackType ||
                null

              return (
                <article
                  className="learningRecommendationCardV086"
                  key={
                    resource.id
                  }
                >
                  <div className="learningRecommendationRankV086">
                    {index + 1}
                  </div>

                  <div className="learningRecommendationBodyV086">
                    <div className="learningRecommendationMetaV086">
                      <span>
                        {
                          resource
                            .resourceType
                            ?.replaceAll(
                              '_',
                              ' '
                            )
                        }
                      </span>

                      {resource.provider && (
                        <span>
                          {resource.provider}
                        </span>
                      )}

                      {resource
                        .estimatedTime && (
                        <span>
                          {
                            resource
                              .estimatedTime
                          }
                        </span>
                      )}
                    </div>

                    <h5>
                      {resource.title}
                    </h5>

                    <p>
                      {
                        resource
                          .description
                      }
                    </p>

                    <div className="learningWhyV086">
                      <strong>
                        Why this helps you
                      </strong>

                      <span>
                        {
                          evaluation
                            ?.reasons
                            ?.slice(
                              0,
                              2
                            )
                            .join(' ')
                        }
                      </span>
                    </div>

                    <div className="learningRecommendationActionsV086">
                      {resource.url ? (
                        <a
                          href={
                            resource.url
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open resource
                        </a>
                      ) : (
                        <span className="learningResourcePreviewV086">
                          Preview candidate
                        </span>
                      )}

                      <button
                        type="button"
                        className={
                          savedFeedback ===
                          'helpful'
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          onFeedback?.(
                            item.id,
                            resource.id,
                            'helpful'
                          )
                        }
                      >
                        This helped
                      </button>

                      <button
                        type="button"
                        className={
                          savedFeedback ===
                          'not_useful'
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          onFeedback?.(
                            item.id,
                            resource.id,
                            'not_useful'
                          )
                        }
                      >
                        Not useful
                      </button>
                    </div>
                  </div>
                </article>
              )
            }
          )}
      </div>

      <div className="learningRecommendationsDoneV086C">
        <div>
          <strong>
            Finished reviewing these recommendations?
          </strong>

          <span>
            Your resource feedback is saved automatically. Use Done to choose what happens next.
          </span>
        </div>

        <details
          open={
            Boolean(
              request
                ?.outcome
            )
          }
        >
          <summary>
            {request?.outcome
              ? 'Update next step'
              : 'Done with these recommendations'}
          </summary>

          <div className="learningOutcomeChoicesV086C">
            <button
              type="button"
              className={
                request
                  ?.outcome
                  ?.outcomeType ===
                'continue_work'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                onDone?.(
                  item.id,
                  'continue_work'
                )
              }
            >
              <strong>
                Continue my school work
              </strong>
              <span>
                Go back to the assignment with the help I found.
              </span>
            </button>

            <button
              type="button"
              className={
                request
                  ?.outcome
                  ?.outcomeType ===
                'resolved'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                onDone?.(
                  item.id,
                  'resolved'
                )
              }
            >
              <strong>
                I understand it now
              </strong>
              <span>
                Resolve this help request and continue the Journey.
              </span>
            </button>

            <button
              type="button"
              className={
                request
                  ?.outcome
                  ?.outcomeType ===
                'more_help'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                onDone?.(
                  item.id,
                  'more_help'
                )
              }
            >
              <strong>
                I still need help
              </strong>
              <span>
                Keep this learning need open so we can try something different.
              </span>
            </button>
          </div>

          {request?.outcome && (
            <div className="learningOutcomeSavedV086C">
              ✓ Next step saved
            </div>
          )}


          {item
            ?.learningIntelligence
            ?.lastInterpretation && (
            <div className="learningIntelligenceV087B">
              <span className="growthKickerV06">
                LEARNING HISTORY
              </span>

              <strong>
                This learning cycle was added to the Journey history.
              </strong>

              <span>
                Asking for help is not treated as an academic weakness.
                Career & Growth keeps these signals conservative until
                patterns repeat across learning activities.
              </span>

              {item.learningIntelligence.lastInterpretation.signals?.length > 0 && (
                <div className="learningSignalTagsV087B">
                  {item.learningIntelligence.lastInterpretation.signals.map(
                    (signal, index) => (
                      <span key={`${signal.type}_${index}`}>
                        {signal.type.replaceAll('_', ' ')}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </details>
      </div>


      {recommended
        .slice(0, 3)
        .some(
          ({ resource }) =>
            resource
              ?.sourceMetadata
              ?.developmentCandidate ===
            true
        ) && (
        <div className="learningRecommendationsNoteV086">
          <strong>
            Development fallback
          </strong>

          <span>
            Some recommendations are development candidates because the
            curated catalog did not yet have enough matching real resources.
          </span>
        </div>
      )}
    </div>
  )
}


function JourneyPanel({
  childName,
  journeyItems = [],
  onHome,
  onJourneyProgress,
  onCompleteJourney,
  onAddLearningItem,
  onLearningItemStatus,
  onLearningHelpRequest,
  onLearningResourceFeedback,
  onLearningSupportOutcome,
  evidenceEvents = [],
}) {
  const [
    activeJourneyPath,
    setActiveJourneyPath,
  ] = useState(
    journeyPaths.EXPERIENCES
  )

  const [
    showLearningForm,
    setShowLearningForm,
  ] = useState(false)


  const learningFormRef =
    useRef(null)

  const [
    learningDraft,
    setLearningDraft,
  ] = useState({
    title: '',
    activityType:
      journeyActivityTypes.HOMEWORK,
    source:
      journeySources.SCHOOL,
    subject: '',
    topic: '',
    description: '',
    dueDate: '',
    estimatedTime: '',
  })

  const [
    helpJourneyId,
    setHelpJourneyId,
  ] = useState(null)

  const [
    helpDraft,
    setHelpDraft,
  ] = useState({
    modeId: '',
    studentNote: '',
  })

  const [
    reflectingJourneyId,
    setReflectingJourneyId,
  ] = useState(null)

  const [
    reflectionDraft,
    setReflectionDraft,
  ] = useState({
    enjoyment: null,
    favoritePart: '',
    difficultPart: '',
    challengeResponse: null,
    wouldDoAgain: null,
    wantsNext: '',
  })

  const unifiedJourneyItems =
    normalizeJourneyItems(
      journeyItems
    )


  const patternIntelligence =
    useMemo(
      () =>
        buildGrowthPatternIntelligence({
          journeyItems:
            unifiedJourneyItems,

          evidenceEvents,
        }),

      [
        unifiedJourneyItems,
        evidenceEvents,
      ]
    )

  const patternPromotionRegistry =
    useMemo(
      () =>
        buildPatternPromotionRegistry(
          patternIntelligence
        ),

      [patternIntelligence]
    )


  const journeyPathOptions = [
    {
      id:
        journeyPaths
          .SCHOOL_LEARNING,
      description:
        'Schoolwork, projects, tests, tutoring, and supplemental learning.',
    },
    {
      id:
        journeyPaths.EXPERIENCES,
      description:
        'Challenges and experiences that help you discover and grow.',
    },
    {
      id:
        journeyPaths
          .ACTIVITIES_INTERESTS,
      description:
        'Sports, music, clubs, hobbies, and things you choose to pursue.',
    },
  ]

  const visibleJourneyItems =
    getJourneyItemsByPath(
      unifiedJourneyItems,
      activeJourneyPath
    )

  const activeItems =
    visibleJourneyItems
      .filter(
        (item) =>
          item.status !== 'completed'
      )
      .sort(
        (a, b) =>
          new Date(
            b.startedAt ||
            b.createdAt ||
            0
          ) -
          new Date(
            a.startedAt ||
            a.createdAt ||
            0
          )
      )

  const completedItems =
    visibleJourneyItems
      .filter(
        (item) =>
          item.status === 'completed'
      )
      .sort(
        (a, b) =>
          new Date(
            b.completedAt ||
            b.updatedAt ||
            0
          ) -
          new Date(
            a.completedAt ||
            a.updatedAt ||
            0
          )
      )

  const learningTracker =
    useMemo(
      () => {
        const schoolItems =
          getJourneyItemsByPath(
            unifiedJourneyItems,
            journeyPaths
              .SCHOOL_LEARNING
          )

        const needsAttention =
          schoolItems.filter(
            (item) =>
              item.status ===
              journeyStatuses
                .NEED_HELP
          )

        const workingOn =
          schoolItems.filter(
            (item) =>
              item.status !==
                journeyStatuses
                  .COMPLETED &&
              item.status !==
                journeyStatuses
                  .NEED_HELP
          )

        const completed =
          schoolItems.filter(
            (item) =>
              item.status ===
              journeyStatuses
                .COMPLETED
          )

        const recent =
          [...schoolItems]
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
            )[0] ||
          null

        const subjects =
          [
            ...new Set(
              schoolItems
                .map(
                  (item) =>
                    item.subject
                )
                .filter(Boolean)
            ),
          ]

        return {
          total:
            schoolItems.length,

          needsAttention,
          workingOn,
          completed,
          recent,
          subjects,
        }
      },

      [unifiedJourneyItems]
    )


  const learningProgression =
    useMemo(
      () =>
        buildLearningProgression(
          unifiedJourneyItems
        ),

      [unifiedJourneyItems]
    )


  const getLearningStateLabel =
    (item) => {
      if (!item) {
        return ''
      }

      const outcome =
        item
          ?.learningSupportRequest
          ?.outcome
          ?.outcomeType

      if (
        outcome ===
        'resolved'
      ) {
        return 'Support helped · keep going'
      }

      if (
        outcome ===
        'more_help'
      ) {
        return 'Still needs support'
      }

      if (
        item.status ===
        journeyStatuses
          .NEED_HELP
      ) {
        return 'Needs attention'
      }

      if (
        item.status ===
        journeyStatuses
          .COMPLETED
      ) {
        return 'Completed'
      }

      if (
        item.status ===
        journeyStatuses
          .IN_PROGRESS
      ) {
        return 'Working on it'
      }

      return 'Planned'
    }


  const learningNextSteps =
    useMemo(
      () =>
        buildLearningNextSteps(
          learningProgression
        ),

      [learningProgression]
    )


  const learningProgressStateLabel =
    (state) => ({
      planned:
        'Planned',
      working:
        'Working on it',
      needs_attention:
        'Needs attention',
      needs_more_support:
        'Still needs support',
      support_resolved:
        'Support helped',
      completed:
        'Completed',
    }[state] || 'Learning')


  const selectedPathLabel =
    journeyPathLabels[
      activeJourneyPath
    ]

  const selectedPathEmoji =
    journeyPathEmojis[
      activeJourneyPath
    ]

  const emptyPathCopy = {
    [journeyPaths.SCHOOL_LEARNING]: {
      title:
        'Your School & Learning journey starts here.',
      description:
        'Add schoolwork, projects, tests, tutoring, and supplemental learning so your Journey can support what you are learning every day.',
    },

    [journeyPaths.EXPERIENCES]: {
      title:
        'Nothing in progress right now.',
      description:
        'Pick a new experience from Home or Explore when you are ready.',
    },

    [journeyPaths.ACTIVITIES_INTERESTS]: {
      title:
        'Your Activities & Interests will live here.',
      description:
        'This path will bring together sports, music, clubs, hobbies, and personal projects as part of your overall growth journey.',
    },
  }

  const resetLearningDraft =
    () => {
      setLearningDraft({
        title: '',
        activityType:
          journeyActivityTypes.HOMEWORK,
        source:
          journeySources.SCHOOL,
        subject: '',
        topic: '',
        description: '',
        dueDate: '',
        estimatedTime: '',
      })
    }


  const submitLearningItem =
    () => {
      const title =
        learningDraft
          .title
          .trim()

      if (!title) {
        return
      }

      onAddLearningItem?.({
        ...learningDraft,

        title,

        subject:
          learningDraft
            .subject
            .trim(),

        topic:
          learningDraft
            .topic
            .trim(),

        description:
          learningDraft
            .description
            .trim(),
      })

      resetLearningDraft()
      setShowLearningForm(false)
    }


  const openRelatedLearningDraft =
    (step) => {
      setActiveJourneyPath(
        journeyPaths
          .SCHOOL_LEARNING
      )

      setLearningDraft({
        title:
          step?.topic
            ? `${step.topic} follow-up`
            : 'Follow-up learning',

        activityType:
          journeyActivityTypes
            .HOMEWORK,

        source:
          journeySources
            .SCHOOL,

        subject:
          step?.subject ||
          '',

        topic:
          step?.topic ||
          '',

        description:
          '',

        dueDate:
          '',

        estimatedTime:
          '',
      })

      setShowLearningForm(
        true
      )

      window.requestAnimationFrame(
        () => {
          learningFormRef
            .current
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
        }
      )
    }


  const handleLearningNextStep =
    (step) => {
      if (!step) {
        return
      }

      if (
        step.type ===
          'continue_support' ||
        step.type ===
          'start_with_support'
      ) {
        if (
          step.latestItemId
        ) {
          beginLearningHelp(
            step.latestItemId
          )
        }

        return
      }

      if (
        step.type ===
          'practice_again' ||
        step.type ===
          'reflect_after_completion' ||
        step.type ===
          'keep_building'
      ) {
        openRelatedLearningDraft(
          step
        )
      }
    }


  const beginLearningHelp =
    (journeyId) => {
      const journeyItem =
        journeyItems.find(
          (item) =>
            item.id === journeyId
        )

      const existingRequest =
        journeyItem
          ?.learningSupportRequest ||
        null

      setHelpJourneyId(
        journeyId
      )

      setHelpDraft({
        modeId:
          existingRequest
            ?.helpMode ||
          '',

        studentNote:
          existingRequest
            ?.studentNote ||
          '',
      })

      onLearningItemStatus?.(
        journeyId,
        journeyStatuses.NEED_HELP
      )
    }


  const cancelLearningHelp =
    () => {
      setHelpJourneyId(null)

      setHelpDraft({
        modeId: '',
        studentNote: '',
      })
    }


  const submitLearningHelp =
    (journeyId) => {
      if (!helpDraft.modeId) {
        return
      }

      onLearningHelpRequest?.(
        journeyId,
        helpDraft
      )

      cancelLearningHelp()
    }


  const beginReflection =
    (journeyId) => {
      setReflectingJourneyId(journeyId)
      setReflectionDraft({
        enjoyment: null,
        favoritePart: '',
        difficultPart: '',
        challengeResponse: null,
        wouldDoAgain: null,
        wantsNext: '',
      })
    }

  const cancelReflection =
    () => setReflectingJourneyId(null)

  const submitReflection =
    (event, journeyId) => {
      event.preventDefault()

      if (
        reflectionDraft.enjoyment === null ||
        reflectionDraft.wouldDoAgain === null
      ) {
        return
      }

      onCompleteJourney?.(
        journeyId,
        reflectionDraft
      )

      setReflectingJourneyId(null)
    }

  return (
    <div className="journeyV06">

      <section className="journeyHeaderV06">
        <div>
          <span className="growthKickerV06">
            MY JOURNEY
          </span>
          <h1>
            What you're working on,
            {` ${childName}`}.
          </h1>
          <p>
            Continue what you're trying,
            reflect when you're done,
            and keep a history of what
            you've explored.
          </p>
        </div>

        <div className="journeyStatsV06">
          <div>
            <strong>{activeItems.length}</strong>
            <span>In progress</span>
          </div>
          <div>
            <strong>{completedItems.length}</strong>
            <span>Completed</span>
          </div>
        </div>
      </section>

      {patternIntelligence
        .patterns
        .length > 0 && (
        <section className="patternIntelligenceV088A">
          <div className="patternIntelligenceHeaderV088A">
            <div>
              <span className="growthKickerV06">
                PATTERN INTELLIGENCE
              </span>

              <h3>
                Patterns beginning to connect across your Journey
              </h3>

              <p>
                Built from independent raw Discover, Parent, Experience, and
                School evidence. Profile promotion remains disabled for validation.
              </p>
            </div>

            <span className="patternModeV088A">
              Observe · Corroborate · Validate
            </span>
          </div>

          <div className="patternCardsV088A">
            {patternIntelligence
              .patterns
              .slice(0, 4)
              .map(
                (pattern) => (
                  <article
                    key={pattern.id}
                    className="patternCardV088A"
                  >
                    <div className="patternCardTitleV088A">
                      <span>
                        {pattern.emoji}
                      </span>

                      <div>
                        <strong>
                          {pattern.label}
                        </strong>

                        <small>
                          {pattern.status.replaceAll('_', ' ')}
                        </small>
                      </div>
                    </div>

                    <div className="patternMetricsV088A">
                      <span>
                        {pattern.evidenceCount} observations
                      </span>

                      <span>
                        {pattern.sourceDiversity} source types
                      </span>

                      <span>
                        {pattern.contextDiversity} contexts
                      </span>
                    </div>

                    {(() => {
                      const promotion =
                        patternPromotionRegistry
                          .decisions
                          .find(
                            (decision) =>
                              decision
                                .patternId ===
                              pattern.id
                          )

                      if (!promotion) {
                        return null
                      }

                      return (
                        <div
                          className={
                            promotion.eligible
                              ? 'patternPromotionV088C eligible'
                              : promotion.status ===
                                  'held_for_review'
                                ? 'patternPromotionV088C review'
                                : 'patternPromotionV088C'
                          }
                        >
                          <strong>
                            {promotion.eligible
                              ? 'Eligible for profile promotion'
                              : promotion.status ===
                                  'held_for_review'
                                ? 'Held for review'
                                : 'Not yet eligible'}
                          </strong>

                          <span>
                            {promotion.eligible
                              ? promotion.reasons[0]
                              : promotion.blockers[0]}
                          </span>
                        </div>
                      )
                    })()}

                    <div className="patternSourcesV088B">
                      {pattern.sources
                        .slice(0, 4)
                        .map(
                          (source) => (
                            <span key={source}>
                              {source.replaceAll('_', ' ')}
                            </span>
                          )
                        )}
                    </div>
                  </article>
                )
              )}
          </div>

          <div className="patternPromotionSummaryV088C">
            <div>
              <strong>
                {patternPromotionRegistry.eligiblePatterns.length}
              </strong>

              <span>
                patterns currently qualify for controlled promotion
              </span>
            </div>

            <p>
              Eligibility is derived from independent source diversity,
              context diversity, consistency, and confidence. School-only
              repetition and mixed evidence cannot auto-promote a pattern.
              Existing Growth Profile scores are still unchanged in 8.8C.
            </p>
          </div>
        </section>
      )}

      <section
        className="unifiedJourneyPathsV08"
        aria-label="Journey paths"
      >
        {journeyPathOptions.map(
          (path) => {
            const pathItems =
              getJourneyItemsByPath(
                unifiedJourneyItems,
                path.id
              )

            const isActive =
              activeJourneyPath ===
              path.id

            return (
              <button
                type="button"
                key={path.id}
                className={
                  isActive
                    ? 'unifiedJourneyPathCardV08 active'
                    : 'unifiedJourneyPathCardV08'
                }
                onClick={() => {
                  setActiveJourneyPath(
                    path.id
                  )

                  setReflectingJourneyId(
                    null
                  )
                }}
              >
                <span className="unifiedJourneyPathIconV08">
                  {
                    journeyPathEmojis[
                      path.id
                    ]
                  }
                </span>

                <span className="unifiedJourneyPathBodyV08">
                  <span className="unifiedJourneyPathTitleRowV08">
                    <strong>
                      {
                        journeyPathLabels[
                          path.id
                        ]
                      }
                    </strong>

                    <span>
                      {pathItems.length}
                    </span>
                  </span>

                  <small>
                    {path.description}
                  </small>
                </span>
              </button>
            )
          }
        )}
      </section>

      {activeJourneyPath ===
        journeyPaths
          .SCHOOL_LEARNING && (
        <section className="learningWorkspaceV08">
          <div className="learningWorkspaceHeaderV08">
            <div>
              <span className="growthKickerV06">
                SCHOOL & LEARNING
              </span>

              <h2>
                What are you working on?
              </h2>

              <p>
                Add schoolwork, projects, tests, tutoring, and supplemental learning to your Journey.
              </p>
            </div>

            <button
              type="button"
              className="growthPrimaryButtonV06"
              onClick={() =>
                setShowLearningForm(
                  (current) =>
                    !current
                )
              }
            >
              {showLearningForm
                ? 'Close'
                : '+ Add Learning Item'}
            </button>
          </div>

          {showLearningForm && (
            <div
              className="learningFormV08"
              ref={learningFormRef}
            >
              <label>
                <span>
                  What are you working on?
                </span>

                <input
                  value={
                    learningDraft.title
                  }
                  placeholder="e.g. Fractions homework"
                  onChange={(event) =>
                    setLearningDraft(
                      (current) => ({
                        ...current,

                        title:
                          event.target
                            .value,
                      })
                    )
                  }
                />
              </label>

              <div className="learningFormGridV08">
                <label>
                  <span>Type</span>

                  <select
                    value={
                      learningDraft
                        .activityType
                    }
                    onChange={(event) =>
                      setLearningDraft(
                        (current) => ({
                          ...current,

                          activityType:
                            event.target
                              .value,
                        })
                      )
                    }
                  >
                    <option value={journeyActivityTypes.HOMEWORK}>
                      Homework
                    </option>
                    <option value={journeyActivityTypes.PROJECT}>
                      Project
                    </option>
                    <option value={journeyActivityTypes.TEST_QUIZ}>
                      Test / Quiz
                    </option>
                    <option value={journeyActivityTypes.STUDY}>
                      Study
                    </option>
                    <option value={journeyActivityTypes.READING}>
                      Reading
                    </option>
                    <option value={journeyActivityTypes.TUTORING}>
                      Tutoring
                    </option>
                    <option value={journeyActivityTypes.SUPPLEMENTAL_LEARNING}>
                      Supplemental Learning
                    </option>
                  </select>
                </label>

                <label>
                  <span>Source</span>

                  <select
                    value={
                      learningDraft.source
                    }
                    onChange={(event) =>
                      setLearningDraft(
                        (current) => ({
                          ...current,

                          source:
                            event.target
                              .value,
                        })
                      )
                    }
                  >
                    <option value={journeySources.SCHOOL}>
                      School
                    </option>
                    <option value={journeySources.TEACHER}>
                      Teacher
                    </option>
                    <option value={journeySources.TUTOR}>
                      Tutor
                    </option>
                    <option value={journeySources.LEARNING_PROGRAM}>
                      Learning Program
                    </option>
                    <option value={journeySources.PARENT}>
                      Parent
                    </option>
                    <option value={journeySources.CHILD}>
                      Self
                    </option>
                  </select>
                </label>

                <label>
                  <span>Subject</span>

                  <input
                    value={
                      learningDraft
                        .subject
                    }
                    placeholder="e.g. Math"
                    onChange={(event) =>
                      setLearningDraft(
                        (current) => ({
                          ...current,

                          subject:
                            event.target
                              .value,
                        })
                      )
                    }
                  />
                </label>

                <label>
                  <span>Topic</span>

                  <input
                    value={
                      learningDraft.topic
                    }
                    placeholder="e.g. Fractions"
                    onChange={(event) =>
                      setLearningDraft(
                        (current) => ({
                          ...current,

                          topic:
                            event.target
                              .value,
                        })
                      )
                    }
                  />
                </label>

                <label>
                  <span>Due date</span>

                  <input
                    type="date"
                    value={
                      learningDraft
                        .dueDate
                    }
                    onChange={(event) =>
                      setLearningDraft(
                        (current) => ({
                          ...current,

                          dueDate:
                            event.target
                              .value,
                        })
                      )
                    }
                  />
                </label>

                <label>
                  <span>
                    Estimated time
                  </span>

                  <input
                    value={
                      learningDraft
                        .estimatedTime
                    }
                    placeholder="e.g. 30 min"
                    onChange={(event) =>
                      setLearningDraft(
                        (current) => ({
                          ...current,

                          estimatedTime:
                            event.target
                              .value,
                        })
                      )
                    }
                  />
                </label>
              </div>

              <label>
                <span>
                  Notes or instructions
                </span>

                <textarea
                  rows="3"
                  value={
                    learningDraft
                      .description
                  }
                  placeholder="Add anything useful about the assignment or what you need to do."
                  onChange={(event) =>
                    setLearningDraft(
                      (current) => ({
                        ...current,

                        description:
                          event.target
                            .value,
                      })
                    )
                  }
                />
              </label>

              <div className="learningFormActionsV08">
                <button
                  type="button"
                  className="growthSecondaryButtonV06"
                  onClick={() => {
                    resetLearningDraft()

                    setShowLearningForm(
                      false
                    )
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="growthPrimaryButtonV06"
                  disabled={
                    !learningDraft
                      .title
                      .trim()
                  }
                  onClick={
                    submitLearningItem
                  }
                >
                  Add to Journey
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {activeJourneyPath ===
        journeyPaths
          .SCHOOL_LEARNING &&
        learningTracker.total > 0 && (
        <section className="learningTrackerV089A">
          <div className="learningTrackerHeaderV089A">
            <div>
              <span className="growthKickerV06">
                LEARNING PROGRESS
              </span>

              <h2>
                Your school & learning tracker
              </h2>

              <p>
                Keep school, tutoring, and supplemental learning
                together so you can see what needs attention and
                how your learning changes over time.
              </p>
            </div>

            {learningTracker.recent && (
              <div className="learningTrackerLatestV089A">
                <span>
                  LATEST
                </span>

                <strong>
                  {learningTracker.recent.title}
                </strong>

                <small>
                  {getLearningStateLabel(
                    learningTracker.recent
                  )}
                </small>
              </div>
            )}
          </div>

          <div className="learningTrackerBucketsV089A">
            <div className="learningTrackerBucketV089A working">
              <span>WORKING ON</span>
              <strong>
                {learningTracker.workingOn.length}
              </strong>
              <small>
                Active learning items
              </small>
            </div>

            <div className="learningTrackerBucketV089A attention">
              <span>NEEDS ATTENTION</span>
              <strong>
                {learningTracker.needsAttention.length}
              </strong>
              <small>
                Items asking for support
              </small>
            </div>

            <div className="learningTrackerBucketV089A completed">
              <span>COMPLETED</span>
              <strong>
                {learningTracker.completed.length}
              </strong>
              <small>
                Learning history
              </small>
            </div>
          </div>

          {learningTracker.subjects.length > 0 && (
            <div className="learningTrackerSubjectsV089A">
              <span>
                Learning across
              </span>

              {learningTracker.subjects
                .slice(0, 6)
                .map(
                  (subject) => (
                    <strong key={subject}>
                      {subject}
                    </strong>
                  )
                )}
            </div>
          )}
        </section>
      )}

      {activeJourneyPath ===
        journeyPaths
          .SCHOOL_LEARNING &&
        learningProgression
          .topics
          .length > 0 && (
        <section className="learningProgressionV089B">
          <div className="learningProgressionHeaderV089B">
            <div>
              <span className="growthKickerV06">
                LEARNING OVER TIME
              </span>

              <h2>
                Topics you are building on
              </h2>

              <p>
                When the same subject and topic comes back,
                Career & Growth connects the history so you
                can see how the learning journey is changing.
              </p>
            </div>

            <div className="learningProgressionCountV089B">
              <strong>
                {learningProgression.repeatedTopicCount}
              </strong>

              <span>
                topics revisited
              </span>
            </div>
          </div>

          <div className="learningProgressionGridV089B">
            {learningProgression
              .topics
              .slice(0, 4)
              .map(
                (topic) => (
                  <article
                    className="learningProgressionCardV089B"
                    key={topic.key}
                  >
                    <div className="learningProgressionTitleV089B">
                      <div>
                        <span>
                          {topic.subject}
                        </span>

                        <h3>
                          {topic.topic}
                        </h3>
                      </div>

                      <strong>
                        {learningProgressStateLabel(
                          topic.latestState
                        )}
                      </strong>
                    </div>

                    <p>
                      {topic.narrative}
                    </p>

                    <div className="learningProgressionMetricsV089B">
                      <span>
                        {topic.itemCount} learning item{topic.itemCount === 1 ? '' : 's'}
                      </span>

                      <span>
                        {topic.supportCycles} support cycle{topic.supportCycles === 1 ? '' : 's'}
                      </span>

                      <span>
                        {topic.completedCount} completed
                      </span>
                    </div>

                    {topic.itemCount > 1 && (
                      <div className="learningProgressionTimelineV089B">
                        {topic.history
                          .slice(-4)
                          .map(
                            (
                              event,
                              index
                            ) => (
                              <span
                                key={
                                  event.journeyId
                                }
                                title={
                                  event.title
                                }
                              >
                                {index + 1}
                              </span>
                            )
                          )}
                      </div>
                    )}
                  </article>
                )
              )}
          </div>

          <div className="learningProgressionGuardrailV089B">
            This view describes learning history and support patterns.
            It does not label a topic as mastered, strong, or weak.
          </div>
        </section>
      )}

      {activeJourneyPath ===
        journeyPaths
          .SCHOOL_LEARNING &&
        learningNextSteps
          .nextSteps
          .length > 0 && (
        <section className="learningNextStepsV089C">
          <div className="learningNextStepsHeaderV089C">
            <div>
              <span className="growthKickerV06">
                WHAT COULD HELP NEXT
              </span>

              <h2>
                Next steps from your learning history
              </h2>

              <p>
                These suggestions use what you have worked on,
                the help you asked for, and what happened afterward.
                You can act on them directly from here.
              </p>
            </div>

            {learningNextSteps.urgentCount > 0 && (
              <span className="learningNextStepsAttentionV089C">
                {learningNextSteps.urgentCount} need attention
              </span>
            )}
          </div>

          <div className="learningNextStepsGridV089C">
            {learningNextSteps
              .nextSteps
              .slice(0, 3)
              .map(
                (step) => (
                  <article
                    className="learningNextStepCardV089C"
                    key={step.id}
                  >
                    <div className="learningNextStepTopicV089C">
                      <span>
                        {step.subject}
                      </span>

                      <strong>
                        {step.topic}
                      </strong>
                    </div>

                    <h3>
                      {step.title}
                    </h3>

                    <p>
                      {step.description}
                    </p>

                    <small>
                      Why: {step.rationale}
                    </small>

                    <div className="learningNextStepFooterV089C">
                      <button
                        type="button"
                        onClick={() =>
                          handleLearningNextStep(
                            step
                          )
                        }
                      >
                        {step.actionLabel}
                      </button>

                      <em>
                        Take the next step
                      </em>
                    </div>
                  </article>
                )
              )}
          </div>

          <div className="learningNextStepsGuardrailV089C">
            Recommendations are based on learning history and support
            outcomes—not grades, mastery labels, or assumptions about ability.
          </div>
        </section>
      )}

      <section className="journeySectionV06">
        <div className="journeySectionHeadingV06">
          <div>
            <span className="growthKickerV06">
              {selectedPathLabel.toUpperCase()}
            </span>
            <h2>
              {activeJourneyPath ===
              journeyPaths
                .SCHOOL_LEARNING
                ? 'Keep learning'
                : activeJourneyPath ===
                    journeyPaths
                      .ACTIVITIES_INTERESTS
                  ? 'Keep growing'
                  : 'Keep going'}
            </h2>
          </div>
        </div>

        {activeItems.length > 0 ? (
          <div className="journeyListV06">
            {activeItems.map(
              (item) => {
                if (
                  item.path ===
                  journeyPaths
                    .SCHOOL_LEARNING
                ) {
                  const statusLabel = {
                    [journeyStatuses.PLANNED]:
                      'Planned',

                    [journeyStatuses.IN_PROGRESS]:
                      'In progress',

                    [journeyStatuses.NEED_HELP]:
                      'Need help',

                    [journeyStatuses.COMPLETED]:
                      'Completed',
                  }[item.status] ||
                    'Planned'

                  return (
                    <article
                      className="learningItemCardV08"
                      key={item.id}
                    >
                      <div className="learningItemTopV08">
                        <div className="journeyCardIconV06">
                          {item.emoji || '🏫'}
                        </div>

                        <div className="learningItemMainV08">
                          <div className="learningItemMetaV08">
                            <span>
                              {item.subject ||
                                'School & Learning'}
                            </span>

                            {item.topic && (
                              <span>
                                {item.topic}
                              </span>
                            )}

                            <span>
                              {statusLabel}
                            </span>
                          </div>

                          <h3>
                            {item.title}
                          </h3>

                          {item.description && (
                            <p>
                              {item.description}
                            </p>
                          )}

                          <div className="learningItemDetailsV08">
                            {item.dueDate && (
                              <span>
                                Due {item.dueDate}
                              </span>
                            )}

                            {item.estimatedTime && (
                              <span>
                                {item.estimatedTime}
                              </span>
                            )}
                          </div>

                          <div className="learningCurrentStateV089A">
                            <span>
                              LEARNING STATE
                            </span>

                            <strong>
                              {getLearningStateLabel(item)}
                            </strong>

                            {item
                              ?.learningSupportRequest
                              ?.outcome
                              ?.recordedAt && (
                              <small>
                                Updated after your latest help cycle
                              </small>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="learningStatusActionsV08">
                        <button
                          type="button"
                          className={
                            item.status ===
                            journeyStatuses
                              .IN_PROGRESS
                              ? 'active'
                              : ''
                          }
                          onClick={() =>
                            onLearningItemStatus?.(
                              item.id,

                              journeyStatuses
                                .IN_PROGRESS
                            )
                          }
                        >
                          Working on it
                        </button>

                        <button
                          type="button"
                          className={
                            item.status ===
                            journeyStatuses
                              .NEED_HELP
                              ? 'active'
                              : ''
                          }
                          onClick={() =>
                            beginLearningHelp(
                              item.id
                            )
                          }
                        >
                          I need help
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onLearningItemStatus?.(
                              item.id,

                              journeyStatuses
                                .COMPLETED
                            )
                          }
                        >
                          Completed
                        </button>
                      </div>

                      {helpJourneyId === item.id && (
                        <div className="learningHelpIntentV08">
                          <strong>What kind of help would be useful?</strong>
                          <span>Tell Career & Growth what you need before we look for resources.</span>

                          <div className="learningHelpModeGridV08">
                            {learningHelpModeOptions.map((option) => (
                              <button
                                type="button"
                                key={option.id}
                                className={helpDraft.modeId === option.id ? 'active' : ''}
                                onClick={() => setHelpDraft((current) => ({
                                  ...current,
                                  modeId: option.id,
                                }))}
                              >
                                <strong>{option.label}</strong>
                                <span>{option.description}</span>
                              </button>
                            ))}
                          </div>

                          <label className="learningHelpNoteV08">
                            <span>Anything specific?</span>
                            <textarea
                              rows="3"
                              value={helpDraft.studentNote}
                              placeholder="e.g. I understand adding fractions, but I get confused when the denominators are different."
                              onChange={(event) => setHelpDraft((current) => ({
                                ...current,
                                studentNote: event.target.value,
                              }))}
                            />
                          </label>

                          <div className="learningFormActionsV08">
                            <button type="button" className="growthSecondaryButtonV06" onClick={cancelLearningHelp}>
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="growthPrimaryButtonV06"
                              disabled={!helpDraft.modeId}
                              onClick={() => submitLearningHelp(item.id)}
                            >
                              Find the right help
                            </button>
                          </div>
                        </div>
                      )}

                      {item.learningSupportRequest && helpJourneyId !== item.id && (
                        <div className="learningHelpReadyV08">
                          <div>
                            <span className="growthKickerV06">HELP INTENT</span>
                            <strong>{item.learningSupportRequest.helpLabel}</strong>
                            {item.learningSupportRequest.studentNote && (
                              <p>{item.learningSupportRequest.studentNote}</p>
                            )}
                          </div>
                          <div>
                            <span>
                              {item.learningSupportRequest.discoveryRequest
                                ? 'Resource research plan ready'
                                : 'Ready for Resource Intelligence'}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                beginLearningHelp(
                                  item.id
                                )
                              }
                            >
                              Change help
                            </button>
                          </div>

                          {item.learningSupportRequest.discoveryRequest && (
                            <div className="learningResearchPlanV085">
                              <span className="growthKickerV06">
                                RESOURCE PLAN
                              </span>

                              <p>
                                {item.learningSupportRequest.researchBrief?.researchObjective}
                              </p>

                              {item.learningSupportRequest.resourcePipeline && (
                                <div className="learningPipelineStatusV086">
                                  <strong>
                                    Candidate evaluation complete
                                  </strong>

                                  <span>
                                    {item.learningSupportRequest.resourcePipeline.candidateCount} candidates discovered ·{' '}
                                    {item.learningSupportRequest.resourcePipeline.recommended?.length || 0} ready for recommendation
                                  </span>

                                  <small>
                                    Real curated educational resources are preferred. Development candidates are used only as fallback when catalog coverage is limited.
                                  </small>
                                </div>
                              )}

                              <div className="learningResearchPlanTagsV085">
                                {item.learningSupportRequest.discoveryRequest.discoveryCriteria?.preferredResourceTypes
                                  ?.slice(0, 4)
                                  .map((type) => (
                                    <span key={type}>
                                      {type.replaceAll('_', ' ')}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}

                          <LearningResourceRecommendations
                            item={item}
                            onFeedback={
                              onLearningResourceFeedback
                            }
                            onDone={
                              onLearningSupportOutcome
                            }
                          />
                        </div>
                      )}
                    </article>
                  )
                }

                return (
                  <article
                    className="journeyCardV06"
                    key={item.id}
                  >
                  <div className="journeyCardIconV06">
                    {item.emoji || '🌱'}
                  </div>

                  <div className="journeyCardBodyV06">
                    <div className="journeyCardTitleRowV06">
                      <div>
                        <span className="growthKickerV06">
                          {item.origin || 'GROW'}
                        </span>
                        <h3>{item.title}</h3>
                      </div>
                      <strong>
                        {item.progress?.percent || 0}%
                      </strong>
                    </div>

                    <p>
                      {item.description ||
                        'Keep this experience moving forward.'}
                    </p>

                    {item.researchedExperience && (
                      <ResearchedJourneyDetails
                        researchedExperience={
                          item.researchedExperience
                        }
                      />
                    )}

                    <div className="journeyProgressV06">
                      <div
                        style={{
                          width:
                            `${item.progress?.percent || 0}%`,
                        }}
                      />
                    </div>

                    <div className="journeyProgressActionsV06">
                      {[25, 50, 75, 100].map(
                        (percent) => (
                          <button
                            type="button"
                            key={percent}
                            className={
                              (item.progress?.percent || 0) === percent
                                ? 'active'
                                : ''
                            }
                            onClick={() =>
                              onJourneyProgress?.(
                                item.id,
                                percent
                              )
                            }
                          >
                            {percent}%
                          </button>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      className="growthPrimaryButtonV06"
                      onClick={() =>
                        beginReflection(item.id)
                      }
                    >
                      Finish & Reflect
                      <span>→</span>
                    </button>

                    {reflectingJourneyId === item.id && (
                      <form
                        className="journeyReflectionV06"
                        onSubmit={(event) =>
                          submitReflection(
                            event,
                            item.id
                          )
                        }
                      >
                        <div className="journeyReflectionHeaderV07">
                          <div className="journeyReflectionIconV07">
                            ✨
                          </div>

                          <div>
                            <span className="journeyReflectionEyebrowV07">
                              FINISH & REFLECT
                            </span>

                            <h4>
                              What was this experience like?
                            </h4>

                            <p>
                              A quick reflection helps your Growth Profile
                              learn from what actually happened.
                            </p>
                          </div>
                        </div>

                        <div className="journeyReflectionSectionV07">
                          <span className="journeyReflectionLabelV07">
                            HOW DID IT FEEL?
                          </span>

                          <div className="reflectionChoiceRowV06">
                          {[
                            ['not_for_me', 'Not for me'],
                            ['okay', 'Okay'],
                            ['liked_it', 'Liked it'],
                            ['loved_it', 'Loved it'],
                          ].map(
                            ([value, label]) => (
                              <button
                                type="button"
                                key={value}
                                className={
                                  reflectionDraft.enjoyment === value
                                    ? 'active'
                                    : ''
                                }
                                onClick={() =>
                                  setReflectionDraft(
                                    (current) => ({
                                      ...current,
                                      enjoyment: value,
                                    })
                                  )
                                }
                              >
                                {label}
                              </button>
                            )
                          )}
                          </div>
                        </div>

                        <div className="journeyReflectionSectionV07">
                          <label>
                            Favorite part
                          <textarea
                            value={reflectionDraft.favoritePart}
                            onChange={(event) =>
                              setReflectionDraft(
                                (current) => ({
                                  ...current,
                                  favoritePart: event.target.value,
                                })
                              )
                            }
                          />
                          </label>

                          <label>
                            What was difficult?
                          <textarea
                            value={reflectionDraft.difficultPart}
                            onChange={(event) =>
                              setReflectionDraft(
                                (current) => ({
                                  ...current,
                                  difficultPart: event.target.value,
                                })
                              )
                            }
                          />
                          </label>
                        </div>

                        {item.researchedExperience && (
                          <div className="researchedReflectionQuestionV07">
                            <span>
                              When something was difficult,
                              what did you usually do?
                            </span>

                            <p>
                              This helps your Growth Profile learn
                              from what actually happened during
                              the experience.
                            </p>

                            <div className="researchedReflectionChoicesV07">
                              {[
                                [
                                  'kept_trying',
                                  'Kept trying',
                                ],
                                [
                                  'changed_approach',
                                  'Tried a different idea',
                                ],
                                [
                                  'asked_for_help',
                                  'Asked for help',
                                ],
                                [
                                  'mostly_easy',
                                  'It was mostly easy',
                                ],
                              ].map(
                                ([
                                  value,
                                  label,
                                ]) => (
                                  <button
                                    type="button"
                                    key={value}
                                    className={
                                      reflectionDraft.challengeResponse === value
                                        ? 'active'
                                        : ''
                                    }
                                    onClick={() =>
                                      setReflectionDraft(
                                        (current) => ({
                                          ...current,
                                          challengeResponse:
                                            value,
                                        })
                                      )
                                    }
                                  >
                                    {label}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        <div className="journeyReflectionSectionV07">
                          <div className="reflectionQuestionV06">
                            <span className="journeyReflectionLabelV07">
                              WOULD YOU TRY SOMETHING LIKE THIS AGAIN?
                            </span>
                          <div className="reflectionChoiceRowV06">
                            <button
                              type="button"
                              className={
                                reflectionDraft.wouldDoAgain === true
                                  ? 'active'
                                  : ''
                              }
                              onClick={() =>
                                setReflectionDraft(
                                  (current) => ({
                                    ...current,
                                    wouldDoAgain: true,
                                  })
                                )
                              }
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              className={
                                reflectionDraft.wouldDoAgain === false
                                  ? 'active'
                                  : ''
                              }
                              onClick={() =>
                                setReflectionDraft(
                                  (current) => ({
                                    ...current,
                                    wouldDoAgain: false,
                                  })
                                )
                              }
                            >
                              No
                            </button>
                            </div>
                          </div>
                        </div>

                        <div className="journeyReflectionSectionV07">
                          <label>
                            What would you want to try next?
                          <textarea
                            value={reflectionDraft.wantsNext}
                            onChange={(event) =>
                              setReflectionDraft(
                                (current) => ({
                                  ...current,
                                  wantsNext: event.target.value,
                                })
                              )
                            }
                          />
                          </label>
                        </div>

                        <div className="journeyReflectionActionsV06">
                          <button
                            type="button"
                            className="textActionV06"
                            onClick={cancelReflection}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="growthPrimaryButtonV06"
                            disabled={
                              reflectionDraft.enjoyment === null ||
                              reflectionDraft.wouldDoAgain === null ||
                              (
                                item.researchedExperience &&
                                reflectionDraft.challengeResponse === null
                              )
                            }
                          >
                            Complete Reflection
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </article>
                )
              }
            )}
          </div>
        ) : (
          <div className="journeyEmptyV06 unifiedJourneyEmptyV08">
            <span>
              {selectedPathEmoji}
            </span>

            <h3>
              {
                emptyPathCopy[
                  activeJourneyPath
                ].title
              }
            </h3>

            <p>
              {
                emptyPathCopy[
                  activeJourneyPath
                ].description
              }
            </p>

            {activeJourneyPath ===
              journeyPaths.EXPERIENCES && (
              <button
                className="growthPrimaryButtonV06"
                onClick={onHome}
              >
                Back Home
              </button>
            )}
          </div>
        )}
      </section>

      {completedItems.length > 0 && (
        <section className="journeySectionV06 journeyCompletedSectionV07">
          <div className="journeyCompletedHeaderV07">
            <div>
              <span className="growthKickerV06">
                COMPLETED
              </span>

              <h2>
                {activeJourneyPath ===
                journeyPaths
                  .SCHOOL_LEARNING
                  ? 'What you have completed'
                  : activeJourneyPath ===
                      journeyPaths
                        .ACTIVITIES_INTERESTS
                    ? 'What you have practiced'
                    : 'What you\'ve tried'}
              </h2>

              <p>
                A growing history of experiences,
                reflections, and things you've learned
                about yourself.
              </p>
            </div>

            <div className="journeyCompletedCountV07">
              <strong>
                {completedItems.length}
              </strong>

              <span>
                completed
              </span>
            </div>
          </div>

          <div className="journeyCompletedGridV06">
            {completedItems.map(
              (item) => (
                <article
                  className="journeyCompletedCardV06"
                  key={item.id}
                >
                  <div className="journeyCompletedIconV07">
                    {item.emoji || '✨'}
                  </div>

                  <div className="journeyCompletedBodyV07">
                    <div className="journeyCompletedTitleRowV07">
                      <div>
                        <span className="journeyCompletedBadgeV07">
                          ✓ Completed
                        </span>

                        <h3>
                          {item.title}
                        </h3>
                      </div>

                      {item.researchedExperience && (
                        <span className="journeyCompletedResearchBadgeV07">
                          Researched
                        </span>
                      )}
                    </div>

                    {item.path ===
                      journeyPaths
                        .SCHOOL_LEARNING && (
                      <div className="completedLearningMetaV089A">
                        {item.subject && (
                          <span>
                            {item.subject}
                          </span>
                        )}

                        {item.topic && (
                          <span>
                            {item.topic}
                          </span>
                        )}

                        <strong>
                          {getLearningStateLabel(item)}
                        </strong>
                      </div>
                    )}

                    <div className="journeyCompletedReflectionV07">
                      <span>
                        {item.path ===
                          journeyPaths
                            .SCHOOL_LEARNING
                          ? 'LEARNING HISTORY'
                          : 'YOUR REFLECTION'}
                      </span>

                      <p>
                        {item.reflection?.favoritePart
                          ? `“${item.reflection.favoritePart}”`
                          : item.path ===
                              journeyPaths
                                .SCHOOL_LEARNING
                            ? 'Learning item completed.'
                            : 'Reflection saved.'}
                      </p>
                    </div>

                    <div className="journeyCompletedMetaV07">
                      {item.reflection?.enjoyment && (
                        <span>
                          {item.reflection.enjoyment
                            .replaceAll('_', ' ')}
                        </span>
                      )}

                      {item.reflection?.wouldDoAgain === true && (
                        <span>
                          Would try again
                        </span>
                      )}

                      {item.reflection?.wouldDoAgain === false && (
                        <span>
                          Ready for something different
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </section>
      )}

    </div>
  )
}


// ============================================================
// RESEARCHED JOURNEY DETAILS
// ============================================================

function ResearchedJourneyDetails({
  researchedExperience,
}) {
  const {
    strategy,
    mission,
    whyItFits,
    buildsOn = [],
    practices = [],
    estimatedTime,
    activitySteps = [],
    parentRole,
    sourceResource,
  } = researchedExperience

  const [showDetails, setShowDetails] =
    useState(false)

  const humanize =
    (value = '') =>
      String(value)
        .replaceAll('_', ' ')
        .replace(
          /\b\w/g,
          (char) =>
            char.toUpperCase()
        )

  return (
    <div className="researchedJourneyV07">

      <div className="researchedJourneySummaryV07">

        <div>
          <span className="researchedJourneyLabelV07">
            RESEARCHED EXPERIENCE
          </span>

          <div className="researchedJourneyMetaV07">
            {strategy && (
              <span>
                {humanize(strategy)}
              </span>
            )}

            {estimatedTime && (
              <span>
                {estimatedTime}
              </span>
            )}

            {sourceResource?.provider && (
              <span>
                {sourceResource.provider}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="researchedJourneyToggleV07"
          onClick={() =>
            setShowDetails(
              (current) => !current
            )
          }
        >
          {showDetails
            ? 'Hide details'
            : 'View experience'}
        </button>

      </div>


      {mission && (
        <div className="researchedJourneyMissionV07">
          <span>
            YOUR MISSION
          </span>

          <p>
            {mission}
          </p>
        </div>
      )}


      {showDetails && (
        <div className="researchedJourneyExpandedV07">

          {whyItFits && (
            <div className="researchedJourneySectionV07">
              <span>
                WHY THIS FITS YOU
              </span>

              <p>
                {whyItFits}
              </p>
            </div>
          )}


          {(buildsOn.length > 0 ||
            practices.length > 0) && (
            <div className="researchedJourneySkillGridV07">

              {buildsOn.length > 0 && (
                <div>
                  <span>
                    BUILDS ON
                  </span>

                  <div className="researchedJourneyChipsV07">
                    {buildsOn
                      .slice(0, 5)
                      .map(
                        (item) => (
                          <span key={item}>
                            {humanize(item)}
                          </span>
                        )
                      )}
                  </div>
                </div>
              )}

              {practices.length > 0 && (
                <div>
                  <span>
                    YOU'LL PRACTICE
                  </span>

                  <div className="researchedJourneyChipsV07">
                    {practices
                      .slice(0, 5)
                      .map(
                        (item) => (
                          <span key={item}>
                            {humanize(item)}
                          </span>
                        )
                      )}
                  </div>
                </div>
              )}

            </div>
          )}


          {activitySteps.length > 0 && (
            <div className="researchedJourneySectionV07">
              <span>
                EXPERIENCE STEPS
              </span>

              <ol className="researchedJourneyStepsV07">
                {activitySteps.map(
                  (
                    step,
                    index
                  ) => (
                    <li key={step.id || index}>
                      <strong>
                        {step.title}
                      </strong>

                      <p>
                        {step.instruction}
                      </p>
                    </li>
                  )
                )}
              </ol>
            </div>
          )}


          {parentRole?.guidance && (
            <div className="researchedJourneyParentV07">
              <span>
                PARENT ROLE
              </span>

              <p>
                {parentRole.guidance}
              </p>
            </div>
          )}


          {sourceResource?.url && (
            <div className="researchedJourneySourceV07">

              <div>
                <span>
                  ORIGINAL RESOURCE
                </span>

                <strong>
                  {sourceResource.provider ||
                    sourceResource.title}
                </strong>
              </div>

              <a
                href={sourceResource.url}
                target="_blank"
                rel="noreferrer"
              >
                Open source ↗
              </a>

            </div>
          )}

        </div>
      )}

    </div>
  )
}


export default GrowthHome
