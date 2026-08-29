import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import './ExperienceResearchPanel.css'
import './JourneyPolish.css'
import './UnifiedJourney.css'
import './GrowthHome.css'
import './AssignmentDetailV09.css'
import './AssignmentHelpFlowV09.css'
import './CompletedSchoolworkV09.css'
import './AssignmentCompletionLifecycleV09.css'
import './AssignmentViewerV09.css'
import './AssignmentAttachmentsV09.css'
import './AssignmentEditV09.css'
import './LearningResourceDiversityV09.css'
import './GrowthCalendarV0103.css'
import './InterestsActivitiesV0104D.css'

import ExperienceResearchPanel from './ExperienceResearchPanel'
import AdventuresHub from './AdventuresHub'

import {
  learningHelpModeOptions,
} from '../intelligence/learningIntentEngine'

import {
  schoolSubjectIds,
  schoolSubjectOptions,
  normalizeSchoolSubject,
  resolveSchoolSubjectId,
} from '../intelligence/schoolLearningTaxonomy'

import {
  buildAssignmentLearningContext,
} from '../intelligence/assignmentLearningContext'

import {
  matchLearningResources,
} from '../intelligence/learningResourceMatcher'

import {
  extractAssignmentsFromImage,
} from '../intelligence/assignmentImageIntelligence'

import {
  buildIntelligenceRecommendationLoop,
} from '../intelligence/intelligenceRecommendationLoop'

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
  requestedGrowthView = 'overview',
  childProfile,
  discoveryComplete = false,
  completedExplorations = [],
  exploreRecommendations = [],
  exploreCatalog = [],
  onSaveGrowthOpportunity,
  onStartAdventure,
  evidenceEventCount = 0,
  growthProfile = null,
  evidenceEvents = [],
  topTraits = [],
  topDomains = [],
  recommendations = [],
  researchedExperienceCandidates = [],
  onAddResearchedExperienceToJourney,
  studentIntents = [],
  parentIntents = [],
  journeyItems = [],
  growthActivities = [],
  calendarActivities = [],
  upcomingGrowthActivities = [],
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
  onUpdateJourneyItem,
  onLearningHelpRequest,
  onLearningResourceFeedback,
  onLearningSupportOutcome,
  onGrowthActivityStatus,
  onUpdateGrowthActivity,
  onScheduleGrowthActivity,
  onGrowthActivityReflection,
  onDiscover,
  onExplore,
  onGrowthProfile,
  onParentPerspective,
}) {
  const [studentIdea, setStudentIdea] = useState('')
  const [journeyStartPath, setJourneyStartPath] = useState(journeyPaths.EXPERIENCES)

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

  const openJourney = (path = journeyPaths.EXPERIENCES) => {
    setJourneyStartPath(path)
    onJourney?.()
  }

  const openSchoolLearning = () =>
    openJourney(journeyPaths.SCHOOL_LEARNING)

  return (
    <div className="growthHomeV06 growthHomeV09">
      <main className="growthWorkspaceV06">

        {activeView === 'journey' ? (
          <JourneyPanel
            childName={childName}
            childProfile={childProfile}
            studentIntents={studentIntents}
            parentIntents={parentIntents}
            journeyItems={journeyItems}
            growthActivities={growthActivities}
            calendarActivities={calendarActivities}
            upcomingGrowthActivities={upcomingGrowthActivities}
            onGrowthActivityStatus={onGrowthActivityStatus}
            onUpdateGrowthActivity={onUpdateGrowthActivity}
            onScheduleGrowthActivity={onScheduleGrowthActivity}
            onGrowthActivityReflection={onGrowthActivityReflection}
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
            onUpdateJourneyItem={
              onUpdateJourneyItem
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
            onStartGrow={
              onStartGrow
            }
            onExplore={onExplore}
            exploreRecommendations={exploreRecommendations}
            exploreCatalog={exploreCatalog}
            completedExplorations={completedExplorations}
            onSaveGrowthOpportunity={onSaveGrowthOpportunity}
            onStartAdventure={onStartAdventure}
            initialPath={journeyStartPath}
            requestedGrowthView={requestedGrowthView}
          />
        ) : (
          <>
            {!discoveryComplete && (
              <section className="growthPageIntroV06">
                <div>
                  <span className="growthKickerV06">
                    MY GROWTH
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
            )}

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
              <div className="cgHomeV09">
                <section className="cgHomeHeroV09">
                  <div className="cgHomeHeroCopyV09">
                    <span className="cgEyebrowV09">MY GROWTH</span>
                    <h1>
                      Hi, {childName}! <span aria-hidden="true">👋</span>
                    </h1>
                    <p>
                      Discover what you enjoy, keep moving on what matters,
                      and learn something new about yourself along the way.
                    </p>

                    <div className="cgHeroActionsV09">
                      <button
                        type="button"
                        className="cgButtonV09 cgButtonPrimaryV09"
                        onClick={() =>
                          currentJourney
                            ? openJourney(currentJourney.path)
                            : onExplore?.()
                        }
                      >
                        {currentJourney ? 'Continue My Growth' : 'Find something to try'}
                        <span>→</span>
                      </button>

                      <button
                        type="button"
                        className="cgButtonV09 cgButtonSecondaryV09"
                        onClick={onExplore}
                      >
                        Explore
                      </button>
                    </div>
                  </div>

                  <div className="cgHomeHeroArtV09" aria-hidden="true">
                    <span className="cgHeroSparkV09">✦</span>
                    <div className="cgHeroOrbitV09">
                      <span>🚀</span>
                    </div>
                    <small>Keep growing</small>
                  </div>
                </section>

                <section className="cgQuickActionsV09" aria-label="Quick actions">
                  <button
                    type="button"
                    className="cgQuickActionV09 cgQuickJourneyV09"
                    onClick={onJourney}
                  >
                    <span className="cgQuickIconV09">↗</span>
                    <span>
                      <strong>My Growth</strong>
                      <small>See what I’m doing now</small>
                    </span>
                    <b>›</b>
                  </button>

                  <button
                    type="button"
                    className="cgQuickActionV09 cgQuickExploreV09"
                    onClick={onExplore}
                  >
                    <span className="cgQuickIconV09">✦</span>
                    <span>
                      <strong>Explore</strong>
                      <small>Find something new to try</small>
                    </span>
                    <b>›</b>
                  </button>

                  <button
                    type="button"
                    className="cgQuickActionV09 cgQuickLearningV09"
                    onClick={openSchoolLearning}
                  >
                    <span className="cgQuickIconV09">📚</span>
                    <span>
                      <strong>School &amp; Learning</strong>
                      <small>Homework, projects and support</small>
                    </span>
                    <b>›</b>
                  </button>
                </section>

                <section className="cgHomeStatsV09" aria-label="Growth summary">
                  <button type="button" onClick={onJourney}>
                    <span>IN PROGRESS</span>
                    <strong>{activeJourneyItems.length}</strong>
                    <small>Growth items</small>
                  </button>

                  <button type="button" onClick={onJourney}>
                    <span>COMPLETED</span>
                    <strong>{completedJourneyItems.length + completedExplorations.length}</strong>
                    <small>Things tried</small>
                  </button>

                  <button type="button" onClick={onGrowthProfile}>
                    <span>PROFILE CLUES</span>
                    <strong>{evidenceEventCount}</strong>
                    <small>Signals collected</small>
                  </button>
                </section>

                <section className="cgHomeGridV09">
                  <article className="cgPanelV09 cgCurrentPanelV09">
                    <div className="cgPanelHeadingV09">
                      <div>
                        <span className="cgEyebrowV09">WHAT I'M WORKING ON</span>
                        <h2>{currentJourney ? currentJourney.title : 'Ready for your next step?'}</h2>
                      </div>
                      <button type="button" onClick={onJourney}>View My Growth →</button>
                    </div>

                    {currentJourney ? (
                      <div className="cgCurrentItemV09">
                        <span className="cgCurrentEmojiV09">
                          {currentJourney.emoji || '🌱'}
                        </span>
                        <div>
                          <span className="cgTypePillV09">
                            {currentJourney.path
                              ? journeyPathLabels[currentJourney.path] || 'Journey'
                              : 'Journey'}
                          </span>
                          <p>
                            {currentJourney.description ||
                              currentJourney.learningStateLabel ||
                              'Keep going — every step counts.'}
                          </p>
                          <button
                            type="button"
                            className="cgButtonV09 cgButtonPrimaryV09 cgButtonSmallV09"
                            onClick={() => openJourney(currentJourney.path)}
                          >
                            Continue <span>→</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="cgEmptyCompactV09">
                        <span>🧭</span>
                        <div>
                          <strong>My Growth is ready.</strong>
                          <p>Find an interest or activity to try, or add what you’re already working on.</p>
                        </div>
                        <button type="button" onClick={onExplore}>Interests & Activities →</button>
                      </div>
                    )}
                  </article>

                  <article className="cgPanelV09 cgRecommendationPanelV09">
                    <div className="cgPanelHeadingV09">
                      <div>
                        <span className="cgEyebrowV09">PICKED FOR YOU</span>
                        <h2>What could help next</h2>
                      </div>
                    </div>

                    {topRecommendation ? (
                      <button
                        type="button"
                        className="cgRecommendationCardV09"
                        onClick={() => onStartGrow?.(topRecommendation)}
                      >
                        <span>{topRecommendation.emoji || '✨'}</span>
                        <span>
                          <strong>{topRecommendation.title}</strong>
                          <small>
                            {topRecommendation.reasons?.[0] ||
                              'Picked from your interests and recent growth.'}
                          </small>
                        </span>
                        <b>›</b>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="cgRecommendationCardV09"
                        onClick={onExplore}
                      >
                        <span>✨</span>
                        <span>
                          <strong>Try something new</strong>
                          <small>Exploring gives us better clues about what fits you.</small>
                        </span>
                        <b>›</b>
                      </button>
                    )}

                    {secondaryRecommendation && (
                      <button
                        type="button"
                        className="cgRecommendationCardV09 cgRecommendationSecondaryV09"
                        onClick={() => onStartGrow?.(secondaryRecommendation)}
                      >
                        <span>{secondaryRecommendation.emoji || '🧩'}</span>
                        <span>
                          <strong>{secondaryRecommendation.title}</strong>
                          <small>{secondaryRecommendation.reasons?.[0] || 'Another useful next step.'}</small>
                        </span>
                        <b>›</b>
                      </button>
                    )}
                  </article>
                </section>

                <section className="cgHomeGridV09 cgHomeInsightGridV09">
                  <article className="cgPanelV09 cgInsightPanelV09">
                    <div className="cgPanelHeadingV09">
                      <div>
                        <span className="cgEyebrowV09">WHAT WE’RE LEARNING ABOUT YOU</span>
                        <h2>Your profile is taking shape</h2>
                      </div>
                      <button type="button" onClick={onGrowthProfile}>My Profile →</button>
                    </div>

                    <div className="cgTraitGridV09">
                      {strongestTraits.length > 0 ? (
                        strongestTraits.map((trait) => (
                          <div key={trait.id} className="cgTraitV09">
                            <span>{trait.emoji || '🌱'}</span>
                            <strong>{trait.label}</strong>
                          </div>
                        ))
                      ) : (
                        <p className="cgMutedV09">
                          Keep discovering and trying things. Your first patterns will appear here.
                        </p>
                      )}
                    </div>

                    {strongestDomains.length > 0 && (
                      <div className="cgDomainLineV09">
                        <span>Interests showing up:</span>
                        {strongestDomains.map((domain) => (
                          <strong key={domain.id}>{domain.label}</strong>
                        ))}
                      </div>
                    )}
                  </article>

                  <article className="cgPanelV09 cgDiscoverPanelV09">
                    <span className="cgDiscoverIconV09">◎</span>
                    <div>
                      <span className="cgEyebrowV09">DISCOVER YOU</span>
                      <h2>Your voice matters too.</h2>
                      <p>
                        Discover tells us what feels true to you. My Growth then helps us learn
                        from what you actually try and do.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="cgButtonV09 cgButtonSecondaryV09 cgButtonSmallV09"
                      onClick={onDiscover}
                      data-cg-discover-entry="true"
                    >
                      Visit Discover
                    </button>
                  </article>
                </section>

                <section className="cgPanelV09 cgRecentPanelV09">
                  <div className="cgPanelHeadingV09">
                    <div>
                      <span className="cgEyebrowV09">RECENTLY</span>
                      <h2>Things you’ve done</h2>
                    </div>
                    <button type="button" onClick={onJourney}>View all →</button>
                  </div>

                  <div className="cgRecentGridV09">
                    {completedJourneyItems.slice(0, 3).map((item) => (
                      <button
                        type="button"
                        className="cgRecentItemV09"
                        key={item.id}
                        onClick={onJourney}
                      >
                        <span>{item.emoji || '✓'}</span>
                        <span>
                          <strong>{item.title}</strong>
                          <small>
                            {item.path === journeyPaths.SCHOOL_LEARNING
                              ? 'School & Learning'
                              : journeyPathLabels[item.path] || 'Journey'}
                          </small>
                        </span>
                        <b>✓</b>
                      </button>
                    ))}

                    {completedJourneyItems.length === 0 &&
                      completedExplorations.slice(0, 3).map((item, index) => (
                        <button
                          type="button"
                          className="cgRecentItemV09"
                          key={item.id || item.title || index}
                          onClick={onJourney}
                        >
                          <span>{item.emoji || '✨'}</span>
                          <span>
                            <strong>{item.title || 'Experience'}</strong>
                            <small>Experience</small>
                          </span>
                          <b>✓</b>
                        </button>
                      ))}

                    {completedJourneyItems.length === 0 &&
                      completedExplorations.length === 0 && (
                        <div className="cgEmptyCompactV09">
                          <span>✨</span>
                          <div>
                            <strong>Your history will grow here.</strong>
                            <p>Complete and reflect on things in My Growth.</p>
                          </div>
                        </div>
                      )}
                  </div>
                </section>

                <section className="cgBottomGridV09">
                  <article className="cgPanelV09 cgVoicePanelV09">
                    <span className="cgEyebrowV09">YOUR VOICE</span>
                    <h2>What sounds fun to try?</h2>
                    <form className="cgIdeaFormV09" onSubmit={handleStudentIdeaSubmit}>
                      <input
                        type="text"
                        value={studentIdea}
                        onChange={(event) => setStudentIdea(event.target.value)}
                        placeholder="I want to..."
                        aria-label="What do you want to try?"
                      />
                      <button type="submit" disabled={!studentIdea.trim()}>Save</button>
                    </form>
                    {latestStudentIntent && (
                      <p className="cgLatestIdeaV09">
                        You told us: “{latestStudentIntent.text}”
                      </p>
                    )}
                  </article>

                  <article className="cgPanelV09 cgParentPreviewV09">
                    <span className="cgEyebrowV09">FOR PARENTS</span>
                    <h2>Add another perspective</h2>
                    <p>
                      Parent observations help corroborate what shows up across Discover and My Growth.
                    </p>
                    <button type="button" onClick={onParentPerspective}>Open Parent View →</button>
                  </article>
                </section>

                <details className="cgResearchDetailsV09">
                  <summary>More researched experiences</summary>
                  <div className="cgResearchDetailsBodyV09">
                    <ExperienceResearchPanel
                      childName={childName}
                      candidates={researchedExperienceCandidates}
                      journeyItems={journeyItems}
                      onAddToJourney={onAddResearchedExperienceToJourney}
                    />
                  </div>
                </details>
              </div>
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
  childProfile = null,
  onFeedback,
  onDone,
}) {
  const request =
    item?.learningSupportRequest

  const pipelineRecommended =
    request
      ?.resourcePipeline
      ?.recommended ||
    []

  const curatedLearningContext =
    request?.learningContext ||
    buildAssignmentLearningContext({
      journeyItem: item,
      childProfile,
      helpMode:
        request?.helpMode ||
        request?.modeId ||
        '',
      learningIntent:
        request?.learningIntent ||
        '',
      studentNote:
        request?.studentNote ||
        '',
    })

  const curatedMatch =
    matchLearningResources({
      learningContext:
        curatedLearningContext,
      limit: 4,
    })

  const helpMode =
    request?.helpMode ||
    request?.modeId ||
    ''

  const normalizedHelpMode =
    String(helpMode).toLowerCase()

  // For curated MVP resources, the matcher now owns:
  // 1) relevance scoring and
  // 2) diversity-aware selection.
  //
  // Do not re-sort this child-facing set here, or we would undo
  // provider / format / learning-approach diversity.
  const ranked =
    curatedMatch.ranked.length > 0
      ? curatedMatch.ranked
      : pipelineRecommended

  const [
    activeResourceIndex,
    setActiveResourceIndex,
  ] = useState(0)

  useEffect(
    () => {
      setActiveResourceIndex(0)
    },

    [helpMode]
  )

  const helpModePresentation =
    normalizedHelpMode.includes(
      'understand'
    )
      ? {
          eyebrow:
            'HELP ME UNDERSTAND',
          title:
            'Start with a clear explanation.',
          description:
            'We’ll favor explanations that make the idea easier to understand before you go back to the assignment.',
        }
      : normalizedHelpMode.includes(
          'example'
        )
        ? {
            eyebrow:
              'SHOW ME AN EXAMPLE',
            title:
              'Start with a worked example.',
            description:
              'We’ll favor examples that show the steps without simply giving away your assignment answer.',
          }
        : normalizedHelpMode.includes(
            'start'
          )
          ? {
              eyebrow:
                'HELP ME GET STARTED',
              title:
                'Take the first small step.',
              description:
                'We’ll help you begin the assignment, then you can keep going on your own.',
            }
          : normalizedHelpMode.includes(
              'practice'
            )
            ? {
                eyebrow:
                  'GIVE ME PRACTICE',
                title:
                  'Try a little practice first.',
                description:
                  'We’ll favor short practice that builds confidence before you return to the assignment.',
              }
            : {
                eyebrow:
                  'HELP FOR THIS ASSIGNMENT',
                title:
                  'Let’s find a useful next step.',
                description:
                  'We’ll use what you told us to pick a good place to start.',
              }

  const firstAssignmentTask =
    item?.tasks?.[0]

  const firstStepText =
    typeof firstAssignmentTask ===
    'string'
      ? firstAssignmentTask
      : firstAssignmentTask?.label ||
        firstAssignmentTask?.text ||
        item?.description ||
        item?.topic ||
        item?.title

  if (!ranked.length) {
    return (
      <div className="synWorkspaceHelpLoadingV098">
        <span>✨</span>

        <div>
          <strong>
            Finding something that may help…
          </strong>

          <p>
            SynapStride is looking for a good fit for this assignment.
          </p>
        </div>
      </div>
    )
  }

  const safeIndex =
    Math.min(
      activeResourceIndex,
      ranked.length - 1
    )

  const active =
    ranked[safeIndex]

  const resource =
    active?.resource || {}

  const evaluation =
    active?.evaluation || {}

  const alternates =
    ranked
      .filter(
        (_, index) =>
          index !== safeIndex
      )
      .slice(0, 3)

  const switchToNextResource =
    () => {
      if (
        ranked.length <= 1
      ) {
        return
      }

      setActiveResourceIndex(
        (current) =>
          (
            current + 1
          ) % ranked.length
      )
    }

  return (
    <div className="synWorkspaceRecommendationV098">
      <section className="synHelpStrategyV099">
        <span className="synHelpStrategyIconV099">
          {normalizedHelpMode.includes('understand')
            ? '🧠'
            : normalizedHelpMode.includes('example')
              ? '✏️'
              : normalizedHelpMode.includes('start')
                ? '🚀'
                : normalizedHelpMode.includes('practice')
                  ? '🏋️'
                  : '✨'}
        </span>

        <div>
          <span className="cgEyebrowV09">
            {helpModePresentation.eyebrow}
          </span>

          <h4>
            {helpModePresentation.title}
          </h4>

          <p>
            {helpModePresentation.description}
          </p>
        </div>
      </section>


      {normalizedHelpMode.includes(
        'start'
      ) && (
        <section className="synHelpFirstStepV099">
          <div>
            <span>1</span>

            <div>
              <strong>
                Your first step
              </strong>

              <p>
                {firstStepText}
              </p>
            </div>
          </div>

          <small>
            Start here. You do not need to finish everything at once.
          </small>
        </section>
      )}


      <section className="synWorkspaceTryCardV098">
        <div className="synWorkspaceTryHeadingV098">
          <span>💡</span>

          <strong>
            Best place to start
          </strong>
        </div>

        <div className="synWorkspacePrimaryResourceV098">
          <div className="synWorkspaceResourceVisualV098">
            <span>
              {resource.resourceType ===
              'video'
                ? '▶'
                : resource.resourceType ===
                    'practice'
                  ? '✎'
                  : resource.resourceType ===
                      'interactive'
                    ? '✦'
                    : '📘'}
            </span>
          </div>

          <div className="synWorkspaceResourceCopyV098">
            <span className="synResourceBestMatchV0923">
              ✦ Best match for this request
            </span>

            <h4>
              {resource.title}
            </h4>

            <div>
              {resource.provider && (
                <strong>
                  {resource.provider}
                </strong>
              )}

              <span>
                {resource.provider
                  ? ' • '
                  : ''}
                {String(
                  resource.resourceType ||
                  'Lesson'
                ).replaceAll(
                  '_',
                  ' '
                )}
              </span>

              {resource.estimatedTime && (
                <span>
                  • {resource.estimatedTime}
                </span>
              )}
            </div>

            <p>
              {resource.description}
            </p>

            {evaluation
              ?.reasons
              ?.[0] && (
              <small>
                Why this fits: {evaluation.reasons[0]}
              </small>
            )}
          </div>

          {resource.url ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                onFeedback?.(
                  item.id,
                  resource.id,
                  'opened'
                )
              }
            >
              {normalizedHelpMode.includes(
                'practice'
              )
                ? 'Start practice →'
                : normalizedHelpMode.includes(
                    'example'
                  )
                  ? 'View example →'
                  : 'Open lesson →'}
            </a>
          ) : (
            <button
              type="button"
              onClick={() =>
                onFeedback?.(
                  item.id,
                  resource.id,
                  'opened'
                )
              }
            >
              Try this →
            </button>
          )}
        </div>

        {alternates.length > 0 && (
          <section className="synResourceAlternativesV0923">
            <div className="synResourceAlternativesHeaderV0923">
              <div>
                <strong>
                  Prefer something different?
                </strong>

                <p>
                  SynapStride picked other strong options with different
                  ways to learn this topic.
                </p>
              </div>

              <span>
                {alternates.length} other choice{alternates.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="synResourceAlternativeGridV0923">
              {alternates.map(
                (alternateCandidate) => {
                  const alternate =
                    alternateCandidate.resource ||
                    {}

                  const meta =
                    alternateCandidate
                      .recommendationMeta ||
                    {}

                  return (
                    <button
                      type="button"
                      className="synResourceAlternativeCardV0923"
                      key={alternate.id}
                      onClick={() => {
                        const next =
                          ranked.findIndex(
                            ({
                              resource:
                                candidate,
                            }) =>
                              candidate.id ===
                              alternate.id
                          )

                        if (next >= 0) {
                          setActiveResourceIndex(
                            next
                          )
                        }
                      }}
                    >
                      <span className="synResourceAlternativeIconV0923">
                        {meta.approachEmoji ||
                          (
                            alternate.resourceType ===
                            'practice'
                              ? '🏋️'
                              : alternate.resourceType ===
                                  'interactive'
                                ? '👀'
                                : alternate.resourceType ===
                                    'video'
                                  ? '▶️'
                                  : '✏️'
                          )}
                      </span>

                      <span className="synResourceAlternativeCopyV0923">
                        <em>
                          {meta.approachLabel ||
                            'Try another approach'}
                        </em>

                        <strong>
                          {alternate.title}
                        </strong>

                        <small>
                          {[
                            alternate.provider,
                            String(
                              alternate.resourceType ||
                              ''
                            ).replaceAll(
                              '_',
                              ' '
                            ),
                            alternate.estimatedTime,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </small>

                        {meta.approachDescription && (
                          <p>
                            {meta.approachDescription}
                          </p>
                        )}
                      </span>

                      <b>›</b>
                    </button>
                  )
                }
              )}
            </div>
          </section>
        )}
      </section>


      <section className="synWorkspaceOutcomeV098">
        <div className="synWorkspaceOutcomeHeadingV098">
          <span>👍</span>

          <div>
            <h4>
              Did that help?
            </h4>

            <p>
              Let us know so we can keep giving you the right help.
            </p>
          </div>
        </div>

        <div className="synWorkspaceOutcomeChoicesV098">
          <button
            type="button"
            className={
              request
                ?.outcome
                ?.outcomeType ===
              'resolved'
                ? 'active resolved'
                : 'resolved'
            }
            onClick={() => {
              if (resource.id) {
                onFeedback?.(
                  item.id,
                  resource.id,
                  'helpful'
                )
              }

              onDone?.(
                item.id,
                'resolved'
              )
            }}
          >
            <span>👍</span>

            <strong>
              Yes, I get it now
            </strong>

            <small>
              Back to working on it
            </small>
          </button>

          <button
            type="button"
            className={
              request
                ?.outcome
                ?.outcomeType ===
              'continue_work'
                ? 'active practice'
                : 'practice'
            }
            onClick={() => {
              if (resource.id) {
                onFeedback?.(
                  item.id,
                  resource.id,
                  'helpful'
                )
              }

              onDone?.(
                item.id,
                'continue_work'
              )
            }}
          >
            <span>🙂</span>

            <strong>
              A little — I want to keep practicing
            </strong>

            <small>
              Keep this topic going
            </small>
          </button>

          <button
            type="button"
            className={
              request
                ?.outcome
                ?.outcomeType ===
              'more_help'
                ? 'active more'
                : 'more'
            }
            onClick={() => {
              if (resource.id) {
                onFeedback?.(
                  item.id,
                  resource.id,
                  'not_useful'
                )
              }

              onDone?.(
                item.id,
                'more_help'
              )

              switchToNextResource()
            }}
          >
            <span>😕</span>

            <strong>
              Not really — try something different
            </strong>

            <small>
              Switch to another approach
            </small>
          </button>
        </div>

        {request?.outcome && (
          <div className="synHelpNextActionV099">
            {request.outcome.outcomeType ===
            'resolved' ? (
              <>
                <strong>
                  Nice — go back to your assignment.
                </strong>

                <span>
                  SynapStride recorded that this kind of help worked.
                </span>
              </>
            ) : request.outcome.outcomeType ===
              'continue_work' ? (
              <>
                <strong>
                  Keep practicing this topic.
                </strong>

                <span>
                  Your assignment stays active while you build confidence.
                </span>
              </>
            ) : (
              <>
                <strong>
                  Trying a different approach.
                </strong>

                <span>
                  The next resource is now selected above.
                </span>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  )
}


function formatSchoolDate(value) {
  if (!value) {
    return ''
  }

  const date =
    new Date(`${value}T12:00:00`)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value
  }

  return date.toLocaleDateString(
    undefined,
    {
      month: 'short',
      day: 'numeric',
    }
  )
}


function getLearningHelpPresentation(option) {
  const text =
    `${option?.id || ''} ${option?.label || ''}`
      .toLowerCase()

  if (text.includes('understand')) {
    return {
      emoji: '🧠',
      label: 'Help me understand',
      shortLabel: 'Explain the steps',
      description: 'Explain the idea in a simpler way.',
      shortDescription: 'Teach me the concept',
    }
  }

  if (text.includes('example')) {
    return {
      emoji: '✏️',
      label: 'Show me an example',
      shortLabel: 'Show me an example',
      description: 'Walk through a similar problem.',
      shortDescription: 'Walk through a similar problem',
    }
  }

  if (text.includes('start')) {
    return {
      emoji: '🚀',
      label: 'Help me get started',
      shortLabel: 'Help me get started',
      description: 'I’m not sure how to begin.',
      shortDescription: 'First step or hint',
    }
  }

  if (text.includes('practice')) {
    return {
      emoji: '🏋️',
      label: 'Give me practice',
      shortLabel: 'Give me practice',
      description: 'Let me try a few easier examples.',
      shortDescription: 'Try similar problems',
    }
  }

  return {
    emoji: '💬',
    label: 'Something else',
    shortLabel: 'Something else',
    description: 'Tell us what’s confusing.',
    shortDescription: 'Tell SynapStride what you need',
  }
}


function SchoolCalendar({
  items = [],
  onOpenItem,
  expanded = false,
}) {
  const datedItems =
    items
      .filter(
        (item) =>
          item.dueDate
      )
      .sort(
        (a, b) =>
          new Date(a.dueDate) -
          new Date(b.dueDate)
      )

  const firstDated =
    datedItems[0]?.dueDate
      ? new Date(
          `${datedItems[0].dueDate}T12:00:00`
        )
      : new Date()

  const [
    visibleMonth,
    setVisibleMonth,
  ] = useState(
    new Date(
      firstDated.getFullYear(),
      firstDated.getMonth(),
      1
    )
  )

  const [
    calendarFilter,
    setCalendarFilter,
  ] = useState('all')

  const filteredItems =
    datedItems.filter(
      (item) => {
        if (
          calendarFilter === 'all'
        ) {
          return true
        }

        if (
          calendarFilter === 'needs_help'
        ) {
          return (
            item.status ===
            journeyStatuses.NEED_HELP
          )
        }

        return (
          item.activityType ===
          calendarFilter
        )
      }
    )

  const year =
    visibleMonth.getFullYear()

  const month =
    visibleMonth.getMonth()

  const monthLabel =
    visibleMonth.toLocaleDateString(
      undefined,
      {
        month: 'long',
        year: 'numeric',
      }
    )

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay()

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate()

  const dueByDay =
    filteredItems.reduce(
      (map, item) => {
        const date =
          new Date(
            `${item.dueDate}T12:00:00`
          )

        if (
          date.getFullYear() === year &&
          date.getMonth() === month
        ) {
          const day =
            date.getDate()

          map[day] =
            map[day] || []

          map[day].push(item)
        }

        return map
      },

      {}
    )

  const calendarCells =
    []

  for (
    let index = 0;
    index < firstDay;
    index += 1
  ) {
    calendarCells.push(null)
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    calendarCells.push(day)
  }

  const upcoming =
    filteredItems
      .filter(
        (item) =>
          new Date(
            `${item.dueDate}T12:00:00`
          ) >=
          new Date(
            new Date()
              .setHours(
                0,
                0,
                0,
                0
              )
          )
      )
      .slice(
        0,
        expanded ? 12 : 5
      )

  const moveMonth =
    (offset) => {
      setVisibleMonth(
        (current) =>
          new Date(
            current.getFullYear(),
            current.getMonth() +
              offset,
            1
          )
      )
    }

  const filters = [
    [
      'all',
      'All',
    ],
    [
      journeyActivityTypes.HOMEWORK,
      'Homework',
    ],
    [
      journeyActivityTypes.TEST_QUIZ,
      'Test/Quiz',
    ],
    [
      journeyActivityTypes.PROJECT,
      'Project',
    ],
    [
      'needs_help',
      'Needs help',
    ],
  ]

  return (
    <aside
      className={
        expanded
          ? 'mgCalendarV092 expanded'
          : 'mgCalendarV092'
      }
    >
      <section className="mgCalendarCardV092">
        <div className="mgCalendarHeaderV092">
          <button
            type="button"
            onClick={() =>
              moveMonth(-1)
            }
            aria-label="Previous month"
          >
            ‹
          </button>

          <strong>
            {monthLabel}
          </strong>

          <button
            type="button"
            onClick={() =>
              moveMonth(1)
            }
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <div className="mgCalendarWeekV092">
          {[
            'SUN',
            'MON',
            'TUE',
            'WED',
            'THU',
            'FRI',
            'SAT',
          ].map(
            (day) => (
              <span key={day}>
                {day}
              </span>
            )
          )}
        </div>

        <div className="mgCalendarGridV092">
          {calendarCells.map(
            (day, index) => {
              const dayItems =
                day
                  ? dueByDay[day] || []
                  : []

              const hasItems =
                dayItems.length > 0

              const hasHelp =
                dayItems.some(
                  (item) =>
                    item.status ===
                    journeyStatuses.NEED_HELP
                )

              return (
                <button
                  type="button"
                  disabled={!hasItems}
                  className={[
                    hasItems
                      ? 'hasItems'
                      : '',
                    hasHelp
                      ? 'needsHelp'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={`${day || 'blank'}_${index}`}
                  title={
                    hasItems
                      ? dayItems
                          .map(
                            (item) =>
                              item.title
                          )
                          .join(', ')
                      : ''
                  }
                  onClick={() =>
                    hasItems &&
                    onOpenItem?.(
                      dayItems[0].id
                    )
                  }
                >
                  {day || ''}

                  {hasItems && (
                    <span>
                      {dayItems.length > 1
                        ? dayItems.length
                        : ''}
                    </span>
                  )}
                </button>
              )
            }
          )}
        </div>

        <div className="mgCalendarFiltersV093">
          {filters.map(
            ([
              id,
              label,
            ]) => (
              <button
                type="button"
                key={id}
                className={
                  calendarFilter === id
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setCalendarFilter(id)
                }
              >
                {label}
              </button>
            )
          )}
        </div>
      </section>

      <section className="mgUpcomingV092">
        <div className="mgUpcomingHeaderV092">
          <h3>Upcoming</h3>

          <span>
            {filteredItems.length} dated item{filteredItems.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mgUpcomingRowsV092">
          {upcoming.map(
            (item) => (
              <button
                type="button"
                key={item.id}
                onClick={() =>
                  onOpenItem?.(
                    item.id
                  )
                }
              >
                <span className="mgUpcomingDateV092">
                  {formatSchoolDate(
                    item.dueDate
                  )}
                </span>

                <span>
                  <strong>
                    {item.title}
                  </strong>

                  <small>
                    {item.subject ||
                      'School & Learning'}
                  </small>
                </span>

                <em
                  className={
                    item.status ===
                    journeyStatuses.NEED_HELP
                      ? 'needsHelp'
                      : ''
                  }
                >
                  {item.status ===
                  journeyStatuses.NEED_HELP
                    ? 'Needs help'
                    : item.estimatedTime ||
                      (item.activityType || '')
                        .replaceAll(
                          '_',
                          ' '
                        )}
                </em>

                <b>›</b>
              </button>
            )
          )}

          {upcoming.length === 0 && (
            <div className="mgUpcomingEmptyV092">
              <span>📅</span>

              <p>
                No upcoming assignments match this filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </aside>
  )
}


function JourneyPanel({
  childName,
  childProfile = null,
  studentIntents = [],
  parentIntents = [],
  journeyItems = [],
  growthActivities = [],
  calendarActivities = [],
  upcomingGrowthActivities = [],
  onGrowthActivityStatus,
  onUpdateGrowthActivity,
  onScheduleGrowthActivity,
  onGrowthActivityReflection,
  onHome,
  onJourneyProgress,
  onCompleteJourney,
  onAddLearningItem,
  onLearningItemStatus,
  onUpdateJourneyItem,
  onLearningHelpRequest,
  onLearningResourceFeedback,
  onLearningSupportOutcome,
  evidenceEvents = [],
  onStartGrow,
  onExplore,
  exploreRecommendations = [],
  exploreCatalog = [],
  completedExplorations = [],
  onSaveGrowthOpportunity,
  onStartAdventure,
  initialPath = journeyPaths.EXPERIENCES,
  requestedGrowthView = 'overview',
}) {
  const [
    activeJourneyPath,
    setActiveJourneyPath,
  ] = useState(
    initialPath || journeyPaths.EXPERIENCES
  )

  const [
    growthView,
    setGrowthView,
  ] = useState(
    (requestedGrowthView === 'calendar' ? 'overview' : requestedGrowthView) ||
      (
        initialPath === journeyPaths.SCHOOL_LEARNING
          ? 'school'
          : 'overview'
      )
  )

  const [
    schoolView,
    setSchoolView,
  ] = useState('tracker')

  const [
    completedFilter,
    setCompletedFilter,
  ] = useState('all')

  const [
    showAddMenu,
    setShowAddMenu,
  ] = useState(false)

  const [
    showLearningForm,
    setShowLearningForm,
  ] = useState(false)

  const [
    uploadPreview,
    setUploadPreview,
  ] = useState(null)


  const [
    assignmentViewerItem,
    setAssignmentViewerItem,
  ] = useState(null)

  const [
    attachmentTargetItemId,
    setAttachmentTargetItemId,
  ] = useState(null)

  const [
    showUploadReview,
    setShowUploadReview,
  ] = useState(false)

  const [
    uploadExtractionState,
    setUploadExtractionState,
  ] = useState({
    status: 'idle',
    message: '',
    mode: null,
  })

  const [
    uploadCandidates,
    setUploadCandidates,
  ] = useState([])

  const [
    activeUploadCandidateIndex,
    setActiveUploadCandidateIndex,
  ] = useState(0)

  const uploadDraft =
    uploadCandidates[
      activeUploadCandidateIndex
    ] || null

  const [
    expandedJourneyId,
    setExpandedJourneyId,
  ] = useState(null)


  const [
    editingJourneyId,
    setEditingJourneyId,
  ] = useState(null)

  const [
    assignmentEditDraft,
    setAssignmentEditDraft,
  ] = useState(null)


  const learningFormRef =
    useRef(null)

  const schoolDetailRef =
    useRef(null)

  const assignmentAttachmentInputRef =
    useRef(null)


  useEffect(
    () => {
      if (!requestedGrowthView) {
        return
      }

      setGrowthView(
        requestedGrowthView === 'calendar'
          ? 'overview'
          : requestedGrowthView
      )

      if (
        requestedGrowthView !== 'school'
      ) {
        setExpandedJourneyId(null)
        setEditingJourneyId(null)
        setAssignmentEditDraft(null)
        setShowLearningForm(false)
        setShowAddMenu(false)
        setShowUploadReview(false)
      }
    },

    [requestedGrowthView]
  )

  const [
    learningDraft,
    setLearningDraft,
  ] = useState({
    title: '',
    activityType:
      journeyActivityTypes.HOMEWORK,
    source:
      journeySources.SCHOOL,
    subjectId: '',
    subject: '',
    customSubject: '',
    topic: '',
    description: '',
    dueDate: '',
    estimatedTime: '',
  })

  const [
    learningDraftAttachments,
    setLearningDraftAttachments,
  ] = useState([])


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
    unifiedJourneyItems

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


  const completedSchoolSummary =
    useMemo(
      () => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setHours(0, 0, 0, 0)
        startOfWeek.setDate(now.getDate() - now.getDay())

        const startOfMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        )

        const getCompletedDate = (item) => {
          const value = item.completedAt || item.updatedAt || item.createdAt
          const date = value ? new Date(value) : null
          return date && !Number.isNaN(date.getTime()) ? date : null
        }

        const thisWeek = learningTracker.completed.filter((item) => {
          const date = getCompletedDate(item)
          return date && date >= startOfWeek
        })

        const thisMonth = learningTracker.completed.filter((item) => {
          const date = getCompletedDate(item)
          return date && date >= startOfMonth
        })

        const filtered =
          completedFilter === 'week'
            ? thisWeek
            : completedFilter === 'month'
              ? thisMonth
              : learningTracker.completed

        return {
          total: learningTracker.completed.length,
          thisWeek: thisWeek.length,
          thisMonth: thisMonth.length,
          filtered,
        }
      },
      [learningTracker.completed, completedFilter]
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


  const intelligenceRecommendationLoop =
    useMemo(
      () => {
        try {
          return (
            buildIntelligenceRecommendationLoop({
              childId:
                childProfile?.id ||
                childProfile?.name ||
                null,

              age:
                childProfile?.age ||
                null,

              evidenceEvents,
              journeyItems:
                unifiedJourneyItems,

              studentIntents,
              parentIntents,

              completedExperienceIds:
                unifiedJourneyItems
                  .map(
                    (item) =>
                      item.experienceId
                  )
                  .filter(Boolean),

              recommendationLimit: 5,
              actionLimit: 5,
            })
          )
        } catch (error) {
          console.error(
            'SynapStride v0.8.11 recommendation loop failed safely.',
            error
          )

          return null
        }
      },

      [
        childProfile?.id,
        childProfile?.name,
        childProfile?.age,
        evidenceEvents,
        unifiedJourneyItems,
        studentIntents,
        parentIntents,
      ]
    )


  const fallbackLearningNextSteps =
    useMemo(
      () =>
        buildLearningNextSteps(
          learningProgression
        ),

      [learningProgression]
    )


  const learningNextSteps =
    useMemo(
      () => {
        const loopNextSteps =
          intelligenceRecommendationLoop
            ?.recommendations
            ?.learningNextSteps

        const nextSteps =
          Array.isArray(loopNextSteps)
            ? loopNextSteps
            : (
                fallbackLearningNextSteps
                  ?.nextSteps || []
              )

        return {
          nextSteps,

          urgentCount:
            nextSteps.filter(
              (step) =>
                step.priority >= 90
            ).length,
        }
      },

      [
        intelligenceRecommendationLoop,
        fallbackLearningNextSteps,
      ]
    )


  const recommendationIntent =
    intelligenceRecommendationLoop
      ?.recommendations
      ?.intent || null


  const recommendationIntentLabel =
    ({
      support: 'Support now',
      practice: 'Practice next',
      deepen: 'Deepen an interest',
      explore: 'Explore next',
    }[
      recommendationIntent?.type
    ] || 'Next step')


  const experienceRecommendations =
    intelligenceRecommendationLoop
      ?.recommendations
      ?.growthExperiences || []


  const experienceStrategy =
    intelligenceRecommendationLoop
      ?.recommendations
      ?.experienceStrategy || null


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
    'My Journey'

  const selectedPathEmoji =
    '🛤️' 

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

  const openGrowthOverview =
    () => {
      setGrowthView('overview')
      setExpandedJourneyId(null)
      setHelpJourneyId(null)
      setEditingJourneyId(null)
      setAssignmentEditDraft(null)
    }

  const openSchoolTracker =
    ({ addNew = false } = {}) => {
      setGrowthView('school')
      setSchoolView('tracker')
      setActiveJourneyPath(
        journeyPaths.SCHOOL_LEARNING
      )
      setExpandedJourneyId(null)
      setShowLearningForm(addNew)

      if (addNew) {
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
    }

  const openSchoolItem =
    (itemId) => {
      setGrowthView('school')
      setSchoolView('tracker')
      setActiveJourneyPath(
        journeyPaths.SCHOOL_LEARNING
      )
      setShowLearningForm(false)
      setEditingJourneyId(null)
      setAssignmentEditDraft(null)
      setExpandedJourneyId(itemId)

      window.requestAnimationFrame(
        () => {
          window.requestAnimationFrame(
            () =>
              schoolDetailRef
                .current
                ?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
          )
        }
      )
    }


  const beginEditSchoolAssignment =
    (item) => {
      if (!item?.id) return

      const normalizedSubject =
        normalizeSchoolSubject({
          subject: item.subject || '',
          subjectId: item.subjectId || '',
          customSubject: item.customSubject || '',
        })

      setEditingJourneyId(item.id)
      setAssignmentEditDraft({
        title: item.title || '',
        activityType: item.activityType || journeyActivityTypes.HOMEWORK,
        source: item.source || journeySources.SCHOOL,
        subjectId: normalizedSubject.subjectId || '',
        subject: normalizedSubject.subject || '',
        customSubject: normalizedSubject.customSubject || '',
        topic: item.topic || '',
        description: item.description || '',
        dueDate: item.dueDate || '',
        estimatedTime: item.estimatedTime || '',
      })
    }


  const cancelEditSchoolAssignment =
    () => {
      setEditingJourneyId(null)
      setAssignmentEditDraft(null)
    }


  const saveEditedSchoolAssignment =
    (item) => {
      if (!item?.id || !assignmentEditDraft) return

      const title = assignmentEditDraft.title.trim()
      if (!title) return

      const normalizedSubject =
        normalizeSchoolSubject({
          subject: assignmentEditDraft.subject,
          subjectId: assignmentEditDraft.subjectId,
          customSubject: assignmentEditDraft.customSubject,
        })

      onUpdateJourneyItem?.(
        item.id,
        {
          title,
          activityType: assignmentEditDraft.activityType,
          source: assignmentEditDraft.source,
          ...normalizedSubject,
          topic: assignmentEditDraft.topic.trim(),
          description: assignmentEditDraft.description.trim(),
          dueDate: assignmentEditDraft.dueDate,
          estimatedTime: assignmentEditDraft.estimatedTime.trim(),
        }
      )

      setEditingJourneyId(null)
      setAssignmentEditDraft(null)
    }


  const completeSchoolAssignment =
    (itemId) => {
      onLearningItemStatus?.(
        itemId,
        journeyStatuses.COMPLETED
      )

      setHelpJourneyId(null)
      setHelpDraft({
        modeId: '',
        studentNote: '',
      })
    }


  const reopenSchoolAssignment =
    (itemId) => {
      onLearningItemStatus?.(
        itemId,
        journeyStatuses.IN_PROGRESS
      )

      setSchoolView('tracker')
      setHelpJourneyId(null)
      setHelpDraft({
        modeId: '',
        studentNote: '',
      })

      window.requestAnimationFrame(
        () => {
          schoolDetailRef
            .current
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
        }
      )
    }

  const updateUploadDraft =
    (patch) => {
      setUploadCandidates(
        (current) =>
          current.map(
            (candidate, index) =>
              index === activeUploadCandidateIndex
                ? {
                    ...candidate,
                    ...patch,
                  }
                : candidate
          )
      )
    }


  const handleAssignmentUpload =
    async (event) => {
      const file =
        event.target.files?.[0]

      event.target.value = ''

      if (!file) {
        return
      }

      if (uploadPreview?.url) {
        URL.revokeObjectURL(
          uploadPreview.url
        )
      }

      const previewUrl =
        URL.createObjectURL(file)

      const attachmentDataUrl =
        await new Promise((resolve) => {
          const reader = new FileReader()

          reader.onload = () =>
            resolve(
              typeof reader.result === 'string'
                ? reader.result
                : null
            )

          reader.onerror = () =>
            resolve(null)

          reader.readAsDataURL(file)
        })

      setUploadPreview({
        name: file.name,
        type: file.type,
        url: previewUrl,
        dataUrl: attachmentDataUrl,
      })

      setShowAddMenu(false)
      setShowLearningForm(false)
      setShowUploadReview(true)
      setSchoolView('tracker')
      setActiveUploadCandidateIndex(0)

      setUploadExtractionState({
        status: 'extracting',
        message:
          'Reading the assignment image…',
        mode: null,
      })

      try {
        const extraction =
          await extractAssignmentsFromImage(
            file
          )

        setUploadCandidates(
          extraction.assignments.map(
            (assignment) => {
              const normalizedSubject =
                normalizeSchoolSubject({
                  subject:
                    assignment.subject ||
                    '',
                })

              return {
                ...assignment,
                ...normalizedSubject,
                activityType:
                  assignment.activityType ||
                  journeyActivityTypes.HOMEWORK,
                source:
                  assignment.source ||
                  journeySources.SCHOOL,
              }
            }
          )
        )

        setUploadExtractionState({
          status: 'ready',
          message:
            extraction.message,
          mode:
            extraction.mode,
        })
      } catch (error) {
        console.error(
          'Assignment image extraction failed.',
          error
        )

        setUploadCandidates([
          {
            id:
              `assignment_candidate_${Date.now()}`,
            title:
              file.name
                .replace(/\.[^.]+$/, '')
                .replaceAll('_', ' ')
                .replaceAll('-', ' '),
            activityType:
              journeyActivityTypes.HOMEWORK,
            source:
              journeySources.SCHOOL,
            subjectId: '',
            subject: '',
            customSubject: '',
            topic: '',
            description: '',
            dueDate: '',
            estimatedTime: '',
            teacher: '',
            className: '',
            tasks: [],
            confidence: {},
          },
        ])

        setUploadExtractionState({
          status: 'error',
          message:
            'We could not read the assignment automatically. You can still review the image and enter the details.',
          mode:
            'review_only',
        })
      }
    }


  const cancelAssignmentUpload =
    () => {
      if (uploadPreview?.url) {
        URL.revokeObjectURL(
          uploadPreview.url
        )
      }

      setUploadPreview(null)
      setShowUploadReview(false)
      setUploadCandidates([])
      setActiveUploadCandidateIndex(0)

      setUploadExtractionState({
        status: 'idle',
        message: '',
        mode: null,
      })
    }


  const importUploadedAssignment =
    (candidate = uploadDraft) => {
      const title =
        candidate?.title?.trim()

      if (!title) {
        return
      }

      const normalizedSubject =
        normalizeSchoolSubject({
          subject:
            candidate.subject || '',
          subjectId:
            candidate.subjectId || '',
          customSubject:
            candidate.customSubject || '',
        })

      onAddLearningItem?.({
        ...candidate,
        ...normalizedSubject,
        title,

        subject:
          normalizedSubject.subject ||
          '',

        topic:
          candidate.topic?.trim() ||
          '',

        description:
          candidate.description?.trim() ||
          '',

        importSource:
          'assignment_image',

        attachments:
          uploadPreview?.dataUrl
            ? [
                {
                  id:
                    `attachment_${Date.now()}_source`,
                  name:
                    uploadPreview?.name ||
                    'Uploaded assignment',
                  type:
                    uploadPreview?.type ||
                    'image/*',
                  dataUrl:
                    uploadPreview.dataUrl,
                  purpose:
                    'assignment_source',
                  addedAt:
                    new Date().toISOString(),
                },
              ]
            : [],

        extractionMode:
          uploadExtractionState.mode,
      })

      const remaining =
        uploadCandidates.filter(
          (_, index) =>
            index !== activeUploadCandidateIndex
        )

      if (remaining.length > 0) {
        setUploadCandidates(
          remaining
        )

        setActiveUploadCandidateIndex(
          0
        )

        setUploadExtractionState(
          (current) => ({
            ...current,
            message:
              `${remaining.length} assignment${remaining.length === 1 ? '' : 's'} left to review.`,
          })
        )

        return
      }

      cancelAssignmentUpload()
    }


  const importAllUploadedAssignments =
    () => {
      const validCandidates =
        uploadCandidates.filter(
          (candidate) =>
            candidate
              ?.title
              ?.trim()
        )

      if (!validCandidates.length) {
        return
      }

      validCandidates.forEach(
        (candidate) => {
          const normalizedSubject =
            normalizeSchoolSubject({
              subject:
                candidate.subject || '',
              subjectId:
                candidate.subjectId || '',
              customSubject:
                candidate.customSubject || '',
            })

          onAddLearningItem?.({
            ...candidate,
            ...normalizedSubject,
            title:
              candidate.title.trim(),
            subject:
              normalizedSubject.subject ||
              '',
            topic:
              candidate.topic?.trim() ||
              '',
            description:
              candidate.description?.trim() ||
              '',
            importSource:
              'assignment_image',
            attachments:
              uploadPreview?.dataUrl
                ? [
                    {
                      id:
                        `attachment_${Date.now()}_${candidate.id || 'source'}`,
                      name:
                        uploadPreview?.name ||
                        'Uploaded assignment',
                      type:
                        uploadPreview?.type ||
                        'image/*',
                      dataUrl:
                        uploadPreview.dataUrl,
                      purpose:
                        'assignment_source',
                      addedAt:
                        new Date().toISOString(),
                    },
                  ]
                : [],
            extractionMode:
              uploadExtractionState.mode,
          })
        }
      )

      cancelAssignmentUpload()
    }


  const filesToAssignmentAttachments =
    async (
      files = [],
      purpose = 'assignment_source'
    ) => {
      const list =
        Array.from(files || [])

      return (
        await Promise.all(
          list.map(
            (file, index) =>
              new Promise(
                (resolve) => {
                  const reader =
                    new FileReader()

                  reader.onload = () =>
                    resolve({
                      id:
                        `attachment_${Date.now()}_${index}`,
                      name:
                        file.name ||
                        `Attachment ${index + 1}`,
                      type:
                        file.type ||
                        'application/octet-stream',
                      dataUrl:
                        typeof reader.result === 'string'
                          ? reader.result
                          : null,
                      purpose,
                      addedAt:
                        new Date().toISOString(),
                    })

                  reader.onerror = () =>
                    resolve(null)

                  reader.readAsDataURL(file)
                }
              )
          )
        )
      ).filter(Boolean)
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

      setLearningDraftAttachments([])
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

      const normalizedSubject =
        normalizeSchoolSubject({
          subject:
            learningDraft.subject,
          subjectId:
            learningDraft.subjectId,
          customSubject:
            learningDraft.customSubject,
        })

      onAddLearningItem?.({
        ...learningDraft,
        ...normalizedSubject,

        title,

        subject:
          normalizedSubject
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

        attachments:
          learningDraftAttachments,
      })

      resetLearningDraft()
      setShowLearningForm(false)
    }


  const openRelatedLearningDraft =
    (step) => {
      setGrowthView('school')

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

        subjectId:
          resolveSchoolSubjectId(
            step?.subject ||
            ''
          ),

        subject:
          step?.subject ||
          '',

        customSubject:
          resolveSchoolSubjectId(
            step?.subject ||
            ''
          ) === schoolSubjectIds.OTHER
            ? step?.subject || ''
            : '',

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


  const getAssignmentAttachments =
    (item) => {
      if (!item) return []

      if (Array.isArray(item.attachments)) {
        return item.attachments
      }

      if (item.attachmentDataUrl || item.attachmentName) {
        return [{
          id: `legacy_${item.id}`,
          name: item.attachmentName || 'Assignment attachment',
          type: item.attachmentType || 'image/*',
          dataUrl: item.attachmentDataUrl || null,
          addedAt: item.createdAt || null,
        }]
      }

      return []
    }


  const getPrimaryAssignmentAttachment =
    (item) => {
      const attachments =
        getAssignmentAttachments(item)

      return (
        attachments.find(
          (attachment) =>
            attachment.isPrimary === true
        ) ||
        attachments.find(
          (attachment) =>
            attachment.purpose === 'assignment_source'
        ) ||
        attachments[0] ||
        null
      )
    }


  const setPrimaryAssignmentAttachment =
    (item, attachmentId) => {
      const attachments =
        getAssignmentAttachments(item)

      if (!attachments.length) {
        return
      }

      onUpdateJourneyItem?.(
        item.id,
        {
          attachments:
            attachments.map(
              (attachment) => ({
                ...attachment,
                isPrimary:
                  attachment.id === attachmentId,
                purpose:
                  attachment.id === attachmentId
                    ? 'assignment_source'
                    : attachment.purpose,
              })
            ),
        }
      )
    }


  const openAssignmentAttachment =
    (item, attachment) => {
      setAssignmentViewerItem({
        ...item,
        activeAttachment: attachment,
      })
    }


  const handleAssignmentAttachmentFiles =
    async (event) => {
      const files = Array.from(event.target.files || [])
      const itemId = attachmentTargetItemId
      event.target.value = ''

      if (!itemId || files.length === 0) return

      const item =
        visibleJourneyItems.find(
          (entry) => entry.id === itemId
        )

      if (!item) return

      const newAttachments =
        (await Promise.all(
          files.map(
            (file, index) =>
              new Promise((resolve) => {
                const reader = new FileReader()

                reader.onload = () =>
                  resolve({
                    id: `attachment_${Date.now()}_${index}`,
                    name: file.name || `Attachment ${index + 1}`,
                    type: file.type || 'application/octet-stream',
                    dataUrl:
                      typeof reader.result === 'string'
                        ? reader.result
                        : null,
                    purpose: 'context_progress',
                    addedAt: new Date().toISOString(),
                  })

                reader.onerror = () => resolve(null)
                reader.readAsDataURL(file)
              })
          )
        )).filter(Boolean)

      if (newAttachments.length === 0) return

      const existingAttachments =
        getAssignmentAttachments(item)

      const alreadyHasPrimary =
        existingAttachments.some(
          (attachment) =>
            attachment.isPrimary === true ||
            attachment.purpose === 'assignment_source'
        )

      const preparedAttachments =
        newAttachments.map(
          (attachment, index) => ({
            ...attachment,
            isPrimary:
              !alreadyHasPrimary &&
              index === 0,
            purpose:
              !alreadyHasPrimary &&
              index === 0
                ? 'assignment_source'
                : attachment.purpose,
          })
        )

      onUpdateJourneyItem?.(
        itemId,
        {
          attachments: [
            ...existingAttachments,
            ...preparedAttachments,
          ],
          attachmentName: null,
          attachmentDataUrl: null,
          attachmentType: null,
        }
      )

      setAttachmentTargetItemId(null)
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

      onLearningItemStatus?.(
        journeyId,
        journeyStatuses.NEED_HELP
      )

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

      <section className="mgHeaderV091">
        <div>
          <span className="growthKickerV06">MY GROWTH</span>
          <h1>
            Everything you're learning, doing, and getting better at.
          </h1>
          <p>
            Keep schoolwork easy to find, follow the things you're actively
            doing, and come back whenever you need help or want to keep going.
          </p>
        </div>

        <div className="mgHeaderStatsV091">
          <div>
            <strong>{activeItems.length}</strong>
            <span>In progress</span>
          </div>
          <div>
            <strong>{learningTracker.needsAttention.length}</strong>
            <span>Need attention</span>
          </div>
          <div>
            <strong>{completedItems.length}</strong>
            <span>Completed</span>
          </div>
        </div>
      </section>

      <nav className="mgTabsV091" aria-label="My Growth sections">
        <button
          type="button"
          className={growthView === 'overview' ? 'active' : ''}
          onClick={openGrowthOverview}
        >
          Overview
        </button>
        <button
          type="button"
          className={growthView === 'school' ? 'active' : ''}
          onClick={() => openSchoolTracker()}
        >
          School &amp; Learning
          {learningTracker.needsAttention.length > 0 && (
            <span>{learningTracker.needsAttention.length}</span>
          )}
        </button>
        <button
          type="button"
          className={growthView === 'activities' ? 'active' : ''}
          onClick={() => setGrowthView('activities')}
        >
          Interests &amp; Activities
        </button>
      </nav>

      {growthView === 'overview' && (
        <>
          <section className="mgOverviewIntroV091">
            <div>
              <span className="cgEyebrowV09">MY GROWTH OVERVIEW</span>
              <h2>One place for the things that are part of your growth.</h2>
              <p>
                Keep schoolwork organized in School &amp; Learning, and bring the
                rest of your growth together in Interests &amp; Activities — the
                things you enjoy, do, try, and discover beyond school.
              </p>
            </div>
          </section>

          <section className="mgTrackerCardsV091 mgTrackerCardsV0103">

            <article className="mgTrackerCardV091 school">
              <div className="mgTrackerCardTopV091">
                <span className="mgTrackerIconV091">📚</span>
                <div>
                  <span className="cgEyebrowV09">CORE TRACKER</span>
                  <h2>School &amp; Learning</h2>
                </div>
              </div>
              <p>
                Homework, assignments, projects, tests, tutoring, extra
                practice, and anything you want help understanding.
              </p>
              <div className="mgTrackerMetricsV091">
                <span><strong>{learningTracker.workingOn.length}</strong> active</span>
                <span><strong>{learningTracker.needsAttention.length}</strong> need help</span>
                <span><strong>{learningTracker.completed.length}</strong> done</span>
              </div>
              <div className="mgTrackerActionsV091">
                <button type="button" className="primary" onClick={() => openSchoolTracker()}>
                  Open tracker <span>→</span>
                </button>
                <button type="button" onClick={() => openSchoolTracker({ addNew: true })}>
                  + Add schoolwork
                </button>
              </div>
            </article>

            <article className="mgTrackerCardV091 activity">
              <div className="mgTrackerCardTopV091">
                <span className="mgTrackerIconV091">✨</span>
                <div>
                  <span className="cgEyebrowV09">GROWTH BEYOND SCHOOL</span>
                  <h2>Interests &amp; Activities</h2>
                </div>
              </div>
              <p>
                One place for sports, music, clubs, hobbies, interests,
                SynapStride experiences, and real-world opportunities you choose to try.
              </p>
              <button type="button" onClick={() => setGrowthView('activities')}>
                Open Interests &amp; Activities <span>→</span>
              </button>
            </article>
          </section>

          {learningTracker.needsAttention.length > 0 && (
            <section className="mgAttentionV091">
              <div className="mgSectionHeadingV091">
                <div>
                  <span className="cgEyebrowV09">NEEDS YOUR ATTENTION</span>
                  <h2>Schoolwork that could use help.</h2>
                </div>
                <button type="button" onClick={() => openSchoolTracker()}>
                  Open School &amp; Learning →
                </button>
              </div>

              <div className="mgAttentionRowsV091">
                {learningTracker.needsAttention.slice(0, 3).map((item) => (
                  <button
                    type="button"
                    key={`attention-${item.id}`}
                    onClick={() => openSchoolItem(item.id)}
                  >
                    <span>{item.emoji || '📚'}</span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>
                        {[item.subject, item.topic, 'Needs help']
                          .filter(Boolean)
                          .join(' · ')}
                      </small>
                    </span>
                    <b>Continue ›</b>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="mgNowV091">
            <div className="mgSectionHeadingV091">
              <div>
                <span className="cgEyebrowV09">WHAT I'M WORKING ON</span>
                <h2>Pick up where you left off.</h2>
              </div>
            </div>

            <div className="cgJourneyCompactListV09">
              {activeItems.slice(0, 5).map((item) => {
                const isSchool = item.path === journeyPaths.SCHOOL_LEARNING
                const typeLabel = isSchool
                  ? 'School & Learning'
                  : item.path === journeyPaths.EXPERIENCES
                    ? 'Experience'
                    : 'Activity & Interest'
                const statusLabel =
                  item.status === journeyStatuses.PLANNED
                    ? 'Planned'
                    : item.status === journeyStatuses.NEED_HELP
                      ? 'Needs help'
                      : 'In progress'

                return (
                  <article className="cgJourneyCompactCardV09" key={`overview-${item.id}`}>
                    <div className="cgJourneyCompactIconV09">
                      {item.emoji || (isSchool ? '🏫' : '✨')}
                    </div>
                    <div className="cgJourneyCompactBodyV09">
                      <div className="cgJourneyCompactMetaV09">
                        <span>{typeLabel}</span>
                        <span>•</span>
                        <span>{statusLabel}</span>
                      </div>
                      <h3>{item.title}</h3>
                      {(item.subject || item.topic || item.dueDate) && (
                        <p>
                          {[item.subject, item.topic, item.dueDate ? `Due ${item.dueDate}` : null]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="cgButtonV09 cgButtonPrimaryV09 cgButtonSmallV09"
                      onClick={() =>
                        isSchool
                          ? openSchoolItem(item.id)
                          : setExpandedJourneyId((current) =>
                              current === item.id ? null : item.id
                            )
                      }
                    >
                      {item.status === journeyStatuses.PLANNED ? 'Start' : 'Continue'}
                    </button>
                  </article>
                )
              })}

              {activeItems.length === 0 && (
                <div className="cgEmptyCompactV09">
                  <span>🌱</span>
                  <div>
                    <strong>Nothing active yet.</strong>
                    <p>Add schoolwork or choose something new when you're ready.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {growthView === 'school' && (
        <section className="mgSchoolWorkspaceV092">
          <div className="mgSchoolTopbarV092">
            <div className="mgSchoolTitleV092">
              <button
                type="button"
                className="mgBackV091"
                onClick={openGrowthOverview}
              >
                ← My Growth
              </button>

              <div className="mgSchoolTitleRowV092">
                <span className="mgSchoolTitleIconV092">🎓</span>
                <div>
                  <h2>School &amp; Learning</h2>
                  <p>
                    Track your schoolwork, get help, and stay on top of what matters.
                  </p>
                </div>
              </div>
            </div>

            <div className="mgSchoolAddActionsV092">
              <div className="mgSchoolAddMenuWrapV092">
                <button
                  type="button"
                  className="mgSchoolAddButtonV092"
                  onClick={() =>
                    setShowAddMenu(
                      (current) => !current
                    )
                  }
                >
                  <span>＋</span>
                  Add schoolwork
                  <b>{showAddMenu ? '⌃' : '⌄'}</b>
                </button>

                {showAddMenu && (
                  <div className="mgSchoolAddMenuV092">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMenu(false)
                        setShowUploadReview(false)
                        setShowLearningForm(true)

                        window.requestAnimationFrame(
                          () =>
                            learningFormRef
                              .current
                              ?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                              })
                        )
                      }}
                    >
                      <span>✎</span>
                      <span>
                        <strong>Enter it myself</strong>
                        <small>Type in the details</small>
                      </span>
                    </button>

                    <label className="mgUploadMenuChoiceV092">
                      <span>📷</span>
                      <span>
                        <strong>Upload assignment</strong>
                        <small>Snap or upload a photo</small>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleAssignmentUpload}
                      />
                    </label>
                  </div>
                )}
              </div>

              <label className="mgQuickUploadV092">
                <span>📷</span>
                <span>
                  <strong>Upload assignment</strong>
                  <small>Snap or upload a photo</small>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleAssignmentUpload}
                />
              </label>
            </div>
          </div>

          <nav
            className="mgSchoolLocalTabsV092"
            aria-label="School and Learning views"
          >
            <button
              type="button"
              className={
                schoolView === 'tracker'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setSchoolView('tracker')
              }
            >
              Tracker
            </button>

            <button
              type="button"
              className={
                schoolView === 'calendar'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setSchoolView('calendar')
              }
            >
              Calendar
            </button>

            <button
              type="button"
              className={schoolView === 'completed' ? 'active' : ''}
              onClick={() => {
                setCompletedFilter('all')
                setSchoolView('completed')
              }}
            >
              Completed
              {learningTracker.completed.length > 0 && (
                <span className="mgCompletedTabCountV09">
                  {learningTracker.completed.length}
                </span>
              )}
            </button>
          </nav>

          {showUploadReview && (
            <section className="mgUploadReviewV093">
              <div className="mgUploadReviewPreviewV092">
                {uploadPreview?.url ? (
                  <img
                    src={uploadPreview.url}
                    alt="Uploaded assignment preview"
                  />
                ) : (
                  <span>📷</span>
                )}
              </div>

              <div className="mgUploadReviewBodyV093">
                <div className="mgUploadReviewHeaderV093">
                  <div>
                    <span className="cgEyebrowV09">
                      REVIEW WHAT WE FOUND
                    </span>

                    <h3>
                      {uploadExtractionState.status === 'extracting'
                        ? 'Reading your assignment…'
                        : uploadCandidates.length > 1
                          ? `We found ${uploadCandidates.length} assignments`
                          : 'Confirm the assignment details'}
                    </h3>

                    <p>
                      {uploadExtractionState.message ||
                        'Review the details before adding anything to School & Learning.'}
                    </p>
                  </div>

                  {uploadExtractionState.status === 'extracting' && (
                    <span className="mgExtractionSpinnerV093" aria-label="Reading assignment image" />
                  )}
                </div>

                {uploadCandidates.length > 1 && (
                  <div className="mgCandidateTabsV093">
                    {uploadCandidates.map(
                      (candidate, index) => (
                        <button
                          type="button"
                          key={candidate.id || index}
                          className={
                            activeUploadCandidateIndex === index
                              ? 'active'
                              : ''
                          }
                          onClick={() =>
                            setActiveUploadCandidateIndex(index)
                          }
                        >
                          {index + 1}. {candidate.title || 'Untitled assignment'}
                        </button>
                      )
                    )}
                  </div>
                )}

                {uploadDraft && (
                  <>
                    <div className="mgUploadReviewGridV092">
                      <label>
                        <span>Assignment</span>
                        <input
                          value={uploadDraft.title}
                          onChange={(event) =>
                            updateUploadDraft({
                              title:
                                event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        <span>Subject</span>
                        <select
                          value={
                            uploadDraft.subjectId ||
                            resolveSchoolSubjectId(
                              uploadDraft.subject ||
                              ''
                            )
                          }
                          onChange={(event) => {
                            const selectedId =
                              event.target.value

                            const selected =
                              schoolSubjectOptions.find(
                                (subject) =>
                                  subject.id === selectedId
                              )

                            updateUploadDraft({
                              subjectId:
                                selectedId,
                              subject:
                                selectedId ===
                                schoolSubjectIds.OTHER
                                  ? uploadDraft.customSubject ||
                                    ''
                                  : selected?.label || '',
                              customSubject:
                                selectedId ===
                                schoolSubjectIds.OTHER
                                  ? uploadDraft.customSubject ||
                                    uploadDraft.subject ||
                                    ''
                                  : '',
                            })
                          }}
                        >
                          <option value="">
                            Choose subject
                          </option>

                          {schoolSubjectOptions.map(
                            (subject) => (
                              <option
                                value={subject.id}
                                key={subject.id}
                              >
                                {subject.label}
                              </option>
                            )
                          )}
                        </select>

                        {(uploadDraft.subjectId ||
                          resolveSchoolSubjectId(
                            uploadDraft.subject ||
                            ''
                          )) ===
                          schoolSubjectIds.OTHER && (
                          <input
                            value={
                              uploadDraft.customSubject ||
                              uploadDraft.subject ||
                              ''
                            }
                            placeholder="Enter subject"
                            onChange={(event) =>
                              updateUploadDraft({
                                subjectId:
                                  schoolSubjectIds.OTHER,
                                subject:
                                  event.target.value,
                                customSubject:
                                  event.target.value,
                              })
                            }
                          />
                        )}
                      </label>

                      <label>
                        <span>Type</span>
                        <select
                          value={uploadDraft.activityType}
                          onChange={(event) =>
                            updateUploadDraft({
                              activityType:
                                event.target.value,
                            })
                          }
                        >
                          <option value={journeyActivityTypes.HOMEWORK}>Homework</option>
                          <option value={journeyActivityTypes.PROJECT}>Project</option>
                          <option value={journeyActivityTypes.TEST_QUIZ}>Test / Quiz</option>
                          <option value={journeyActivityTypes.STUDY}>Study</option>
                          <option value={journeyActivityTypes.READING}>Reading</option>
                          <option value={journeyActivityTypes.TUTORING}>Tutoring</option>
                          <option value={journeyActivityTypes.SUPPLEMENTAL_LEARNING}>Supplemental Learning</option>
                        </select>
                      </label>

                      <label>
                        <span>Due date</span>
                        <input
                          type="date"
                          value={uploadDraft.dueDate || ''}
                          onChange={(event) =>
                            updateUploadDraft({
                              dueDate:
                                event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        <span>Topic</span>
                        <input
                          value={uploadDraft.topic || ''}
                          placeholder="e.g. Fractions"
                          onChange={(event) =>
                            updateUploadDraft({
                              topic:
                                event.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        <span>Estimated time</span>
                        <input
                          value={uploadDraft.estimatedTime || ''}
                          placeholder="e.g. 30 min"
                          onChange={(event) =>
                            updateUploadDraft({
                              estimatedTime:
                                event.target.value,
                            })
                          }
                        />
                      </label>
                    </div>

                    <label className="mgUploadReviewNotesV092">
                      <span>Instructions / notes</span>
                      <textarea
                        rows="3"
                        value={uploadDraft.description || ''}
                        placeholder="Assignment instructions, pages, question numbers, or submission notes."
                        onChange={(event) =>
                          updateUploadDraft({
                            description:
                              event.target.value,
                          })
                        }
                      />
                    </label>

                    {uploadDraft.tasks?.length > 0 && (
                      <div className="mgExtractedTasksV093">
                        <span>Tasks we found</span>
                        <ul>
                          {uploadDraft.tasks.map((task, index) => (
                            <li key={`${task}_${index}`}>
                              {typeof task === 'string'
                                ? task
                                : task.label || task.text || JSON.stringify(task)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mgUploadReviewActionsV092">
                      <button
                        type="button"
                        onClick={cancelAssignmentUpload}
                      >
                        Cancel
                      </button>

                      {uploadCandidates.length > 1 && (
                        <button
                          type="button"
                          onClick={importAllUploadedAssignments}
                          disabled={
                            uploadCandidates.some(
                              (candidate) =>
                                !candidate?.title?.trim()
                            )
                          }
                        >
                          Add all {uploadCandidates.length}
                        </button>
                      )}

                      <button
                        type="button"
                        className="primary"
                        disabled={
                          !uploadDraft.title?.trim()
                        }
                        onClick={() =>
                          importUploadedAssignment(
                            uploadDraft
                          )
                        }
                      >
                        {uploadCandidates.length > 1
                          ? 'Add this assignment'
                          : 'Add to School & Learning'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {schoolView === 'tracker' ? (
            <div className="mgSchoolDashboardV092">
              <div className="mgSchoolTrackerColumnV092">
                {learningTracker.needsAttention.length > 0 && (
                  <div className="mgSchoolGroupV092 attention">
                    <div className="mgSchoolGroupTitleV092">
                      <span>!</span>
                      <h3>
                        Needs Attention ({learningTracker.needsAttention.length})
                      </h3>
                    </div>

                    <div className="mgSchoolRowsV092">
                      {learningTracker.needsAttention.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() =>
                            openSchoolItem(item.id)
                          }
                        >
                          <span className="mgSchoolItemIconV092 danger">
                            {item.emoji || '√x'}
                          </span>

                          <span className="mgSchoolItemMainV092">
                            <strong>{item.title}</strong>
                            <span className="mgSchoolTagsV092">
                              {item.subject && <em>{item.subject}</em>}
                              <em>{(item.activityType || 'Homework').replaceAll('_', ' ')}</em>
                            </span>
                            <small>
                              <b>Needs help</b>
                              {item.dueDate && <> · Due {formatSchoolDate(item.dueDate)}</>}
                            </small>
                          </span>

                          <span className="mgSchoolItemActionV092 danger">
                            Continue
                          </span>
                          <b className="mgSchoolRowChevronV092">›</b>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mgSchoolGroupV092">
                  <div className="mgSchoolGroupTitleV092 working">
                    <span>◷</span>
                    <h3>
                      Working On ({learningTracker.workingOn.length})
                    </h3>
                  </div>

                  <div className="mgSchoolRowsV092">
                    {learningTracker.workingOn.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() =>
                          openSchoolItem(item.id)
                        }
                      >
                        <span className="mgSchoolItemIconV092">
                          {item.emoji || '📘'}
                        </span>

                        <span className="mgSchoolItemMainV092">
                          <strong>{item.title}</strong>
                          <span className="mgSchoolTagsV092">
                            {item.subject && <em>{item.subject}</em>}
                            <em>{(item.activityType || 'Learning').replaceAll('_', ' ')}</em>
                          </span>
                          <small>
                            <b>In progress</b>
                            {item.dueDate && <> · Due {formatSchoolDate(item.dueDate)}</>}
                          </small>
                        </span>

                        <span className="mgSchoolItemActionV092">
                          Open
                        </span>
                        <b className="mgSchoolRowChevronV092">›</b>
                      </button>
                    ))}

                    {learningTracker.workingOn.length === 0 && (
                      <div className="mgSchoolEmptyV092">
                        <span>📚</span>
                        <div>
                          <strong>No active schoolwork.</strong>
                          <p>Add homework, a project, test prep, tutoring, or extra practice.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {learningTracker.completed.length > 0 && (
                  <div className="mgSchoolGroupV092 completed mgCompletedPreviewV09">
                    <div className="mgCompletedPreviewHeaderV09">
                      <div className="mgSchoolGroupTitleV092 done">
                        <span>✓</span>
                        <div>
                          <h3>Completed</h3>
                          <small>Recent finished schoolwork</small>
                        </div>
                      </div>

                      <div className="mgCompletedPreviewStatsV09">
                        <span><strong>{learningTracker.completed.length}</strong> total</span>
                        <span><strong>{completedSchoolSummary.thisMonth}</strong> this month</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCompletedFilter('all')
                            setSchoolView('completed')
                          }}
                        >
                          View all completed →
                        </button>
                      </div>
                    </div>

                    <div className="mgSchoolRowsV092 mgCompletedPreviewRowsV09">
                      {learningTracker.completed.slice(0, 3).map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => openSchoolItem(item.id)}
                        >
                          <span className="mgSchoolItemIconV092 done">✓</span>
                          <span className="mgSchoolItemMainV092">
                            <strong>{item.title}</strong>
                            <span className="mgSchoolTagsV092">
                              {item.subject && <em>{item.subject}</em>}
                              <em>{(item.activityType || 'Learning').replaceAll('_', ' ')}</em>
                            </span>
                            <small>
                              <b>Completed</b>
                              {(item.completedAt || item.updatedAt) && (
                                <> · {new Date(item.completedAt || item.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</>
                              )}
                            </small>
                          </span>
                          <span className="mgSchoolItemActionV092 done">View</span>
                          <b className="mgSchoolRowChevronV092">›</b>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mgSchoolTipV092">
                  <span>💡</span>
                  <div>
                    <strong>Tip: Upload assignments to save time!</strong>
                    <p>Snap a photo, review the details, and add it to your tracker.</p>
                  </div>
                  <label>
                    Try it now →
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleAssignmentUpload}
                    />
                  </label>
                </div>
              </div>

              <SchoolCalendar
                items={getJourneyItemsByPath(
                  unifiedJourneyItems,
                  journeyPaths.SCHOOL_LEARNING
                )}
                onOpenItem={openSchoolItem}
                expanded={false}
              />
            </div>
          ) : schoolView === 'calendar' ? (
            <SchoolCalendar
              items={getJourneyItemsByPath(
                unifiedJourneyItems,
                journeyPaths.SCHOOL_LEARNING
              )}
              onOpenItem={openSchoolItem}
              expanded
            />
          ) : (
            <section className="mgCompletedWorkspaceV09">
              <div className="mgCompletedWorkspaceHeaderV09">
                <div>
                  <span className="cgEyebrowV09">COMPLETED WORK</span>
                  <h2>Your finished schoolwork</h2>
                  <p>Keep the tracker focused on what is active while your completed work stays easy to revisit.</p>
                </div>
                <div className="mgCompletedSummaryV09">
                  <span><strong>{completedSchoolSummary.total}</strong><small>Total</small></span>
                  <span><strong>{completedSchoolSummary.thisMonth}</strong><small>This month</small></span>
                  <span><strong>{completedSchoolSummary.thisWeek}</strong><small>This week</small></span>
                </div>
              </div>

              <div className="mgCompletedFiltersV09" aria-label="Completed work filters">
                {[['week', 'This week'], ['month', 'This month'], ['all', 'All completed']].map(([id, label]) => (
                  <button
                    type="button"
                    key={id}
                    className={completedFilter === id ? 'active' : ''}
                    onClick={() => setCompletedFilter(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mgCompletedListV09">
                {completedSchoolSummary.filtered.map((item) => (
                  <button type="button" key={item.id} onClick={() => openSchoolItem(item.id)}>
                    <span className="mgCompletedCheckV09">✓</span>
                    <span className="mgCompletedItemCopyV09">
                      <strong>{item.title}</strong>
                      <small>{[item.subject, (item.activityType || 'Learning').replaceAll('_', ' '), item.topic].filter(Boolean).join(' · ')}</small>
                    </span>
                    <span className="mgCompletedDateV09">
                      {(item.completedAt || item.updatedAt)
                        ? new Date(item.completedAt || item.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                        : 'Completed'}
                    </span>
                    <span className="mgCompletedViewV09">View ›</span>
                  </button>
                ))}

                {completedSchoolSummary.filtered.length === 0 && (
                  <div className="mgCompletedEmptyV09">
                    <span>✓</span>
                    <div><strong>No completed work in this period.</strong><p>Try another filter to see more of your learning history.</p></div>
                  </div>
                )}
              </div>
            </section>
          )}

      {growthView === 'school' && expandedJourneyId && (
      <section
        className="journeySectionV06 mgSchoolDetailV091"
        ref={schoolDetailRef}
      >
        <div className="mgSchoolDetailHeaderV094">
          <div>
            <span className="cgEyebrowV09">SCHOOL &amp; LEARNING</span>
            <h3>Assignment details</h3>
            <p>Keep working, ask for help, or update the assignment status here.</p>
          </div>

          <div className="synAssignmentDetailHeaderActionsV0921">
            <button
              type="button"
              className="edit"
              onClick={() => {
                const item = visibleJourneyItems.find(
                  (entry) => entry.id === expandedJourneyId
                )
                if (item) beginEditSchoolAssignment(item)
              }}
            >
              ✎ Edit assignment
            </button>

            <button
              type="button"
              onClick={() => {
                setExpandedJourneyId(null)
                setHelpJourneyId(null)
                setEditingJourneyId(null)
                setAssignmentEditDraft(null)
              }}
            >
              Close details
            </button>
          </div>
        </div>

        <div className="journeySectionHeadingV06">
          <div>
            <span className="growthKickerV06">
              {selectedPathLabel.toUpperCase()}
            </span>
            <h2>Working on now</h2>
          </div>
        </div>

        {visibleJourneyItems.some((item) => item.id === expandedJourneyId) ? (
          <div className="journeyListV06">
            {visibleJourneyItems
              .filter((item) => item.id === expandedJourneyId)
              .map(
              (item, itemIndex) => {
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
                      className="synAssignmentDetailV09 synAssignmentWorkspaceV098"
                      key={item.id}
                    >
                      <header className="synWorkspaceAssignmentHeaderV098">
                        <div className="synWorkspaceAssignmentIdentityV098">
                          <span className="synWorkspaceAssignmentIconV098">{item.emoji || '📚'}</span>
                          <div>
                            <div className="synWorkspaceTitleLineV098">
                              <h2>{item.title}</h2>
                              <div className="synWorkspaceTagsV098">
                                <span>{item.subject || 'School & Learning'}</span>
                                {item.activityType && <span>{item.activityType.replaceAll('_', ' ')}</span>}
                              </div>
                            </div>
                            <p>{item.topic || item.description || 'Keep working on this assignment.'}</p>
                          </div>
                        </div>

                        <div className="synWorkspaceAssignmentMetaV098">
                          {item.dueDate && <span>📅 Due {formatSchoolDate(item.dueDate)}</span>}
                          {item.estimatedTime && <span>🕒 {item.estimatedTime}</span>}
                          <strong><i />{getLearningStateLabel(item)}</strong>
                        </div>
                      </header>

                      {editingJourneyId === item.id && assignmentEditDraft && (
                        <section className="synAssignmentEditPanelV0921">
                          <div className="synAssignmentEditHeadingV0921">
                            <span className="cgEyebrowV09">EDIT ASSIGNMENT</span>
                            <h3>Update assignment details</h3>
                            <p>Change the information below without creating a new assignment.</p>
                          </div>

                          <div className="synAssignmentEditGridV0921">
                            <label className="wide">
                              <span>Assignment</span>
                              <input
                                value={assignmentEditDraft.title}
                                onChange={(event) =>
                                  setAssignmentEditDraft((current) => ({
                                    ...current,
                                    title: event.target.value,
                                  }))
                                }
                              />
                            </label>

                            <label>
                              <span>Subject</span>
                              <select
                                value={assignmentEditDraft.subjectId}
                                onChange={(event) => {
                                  const selectedId = event.target.value
                                  const selected = schoolSubjectOptions.find(
                                    (subject) => subject.id === selectedId
                                  )
                                  setAssignmentEditDraft((current) => ({
                                    ...current,
                                    subjectId: selectedId,
                                    subject: selectedId === schoolSubjectIds.OTHER
                                      ? current.customSubject || ''
                                      : selected?.label || '',
                                    customSubject: selectedId === schoolSubjectIds.OTHER
                                      ? current.customSubject || ''
                                      : '',
                                  }))
                                }}
                              >
                                <option value="">Choose subject</option>
                                {schoolSubjectOptions.map((subject) => (
                                  <option value={subject.id} key={subject.id}>
                                    {subject.label}
                                  </option>
                                ))}
                              </select>

                              {assignmentEditDraft.subjectId === schoolSubjectIds.OTHER && (
                                <input
                                  value={assignmentEditDraft.customSubject}
                                  placeholder="Enter subject"
                                  onChange={(event) =>
                                    setAssignmentEditDraft((current) => ({
                                      ...current,
                                      subject: event.target.value,
                                      customSubject: event.target.value,
                                    }))
                                  }
                                />
                              )}
                            </label>

                            <label>
                              <span>Topic</span>
                              <input
                                value={assignmentEditDraft.topic}
                                placeholder="e.g. Fractions"
                                onChange={(event) =>
                                  setAssignmentEditDraft((current) => ({
                                    ...current,
                                    topic: event.target.value,
                                  }))
                                }
                              />
                            </label>

                            <label>
                              <span>Type</span>
                              <select
                                value={assignmentEditDraft.activityType}
                                onChange={(event) =>
                                  setAssignmentEditDraft((current) => ({
                                    ...current,
                                    activityType: event.target.value,
                                  }))
                                }
                              >
                                <option value={journeyActivityTypes.HOMEWORK}>Homework</option>
                                <option value={journeyActivityTypes.PROJECT}>Project</option>
                                <option value={journeyActivityTypes.TEST_QUIZ}>Test / Quiz</option>
                                <option value={journeyActivityTypes.STUDY}>Study</option>
                                <option value={journeyActivityTypes.READING}>Reading</option>
                                <option value={journeyActivityTypes.TUTORING}>Tutoring</option>
                                <option value={journeyActivityTypes.SUPPLEMENTAL_LEARNING}>Supplemental Learning</option>
                              </select>
                            </label>

                            <label>
                              <span>Due date</span>
                              <input
                                type="date"
                                value={assignmentEditDraft.dueDate}
                                onChange={(event) =>
                                  setAssignmentEditDraft((current) => ({
                                    ...current,
                                    dueDate: event.target.value,
                                  }))
                                }
                              />
                            </label>

                            <label>
                              <span>Estimated time</span>
                              <input
                                value={assignmentEditDraft.estimatedTime}
                                placeholder="e.g. 30 min"
                                onChange={(event) =>
                                  setAssignmentEditDraft((current) => ({
                                    ...current,
                                    estimatedTime: event.target.value,
                                  }))
                                }
                              />
                            </label>

                            <label className="wide">
                              <span>Notes or instructions</span>
                              <textarea
                                rows="4"
                                value={assignmentEditDraft.description}
                                placeholder="Assignment instructions, pages, question numbers, teacher notes, or other useful context."
                                onChange={(event) =>
                                  setAssignmentEditDraft((current) => ({
                                    ...current,
                                    description: event.target.value,
                                  }))
                                }
                              />
                            </label>
                          </div>

                          <div className="synAssignmentEditActionsV0921">
                            <button type="button" onClick={cancelEditSchoolAssignment}>
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="primary"
                              disabled={!assignmentEditDraft.title.trim()}
                              onClick={() => saveEditedSchoolAssignment(item)}
                            >
                              Save changes
                            </button>
                          </div>

                          <small className="synAssignmentEditNoteV0921">
                            Attachments stay intact and are managed separately below.
                          </small>
                        </section>
                      )}

                      <section
                        className={
                          item.status === journeyStatuses.COMPLETED
                            ? 'synWorkspaceAssignmentStateV0910 synAssignmentCompletedStateV0913'
                            : 'synWorkspaceAssignmentStateV0910'
                        }
                        aria-label="Assignment status and help actions"
                      >
                        {item.status === journeyStatuses.COMPLETED ? (
                          <div className="synAssignmentCompletedConfirmationV0913">
                            <div className="synAssignmentCompletedCheckV0913">
                              ✓
                            </div>

                            <div className="synAssignmentCompletedCopyV0913">
                              <span className="cgEyebrowV09">
                                ASSIGNMENT COMPLETED
                              </span>

                              <h3>Nice work — this assignment is complete.</h3>

                              <p>
                                It has moved to your Completed history. You can
                                still open it anytime, and if this was a mistake
                                you can put it back in Working On.
                              </p>
                            </div>

                            <div className="synAssignmentCompletedActionsV0913">
                              <button
                                type="button"
                                className="primary"
                                onClick={() =>
                                  reopenSchoolAssignment(item.id)
                                }
                              >
                                ↻ Reopen assignment
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedJourneyId(null)
                                  setHelpJourneyId(null)
                                  setSchoolView('completed')
                                }}
                              >
                                View completed work
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="synWorkspaceAssignmentStateHeadingV0910">
                              <strong>Where are you with this assignment?</strong>
                              <span>Choose what fits right now.</span>
                            </div>

                            <div className="synWorkspaceAssignmentStateChoicesV0910">
                              <button
                                type="button"
                                className={
                                  item.status === journeyStatuses.IN_PROGRESS
                                    ? 'active working'
                                    : 'working'
                                }
                                onClick={() => {
                                  onLearningItemStatus?.(
                                    item.id,
                                    journeyStatuses.IN_PROGRESS
                                  )
                                  setHelpJourneyId(null)
                                }}
                              >
                                <span>▶</span>
                                <span>
                                  <strong>Working on it</strong>
                                  <small>I’m making progress</small>
                                </span>
                              </button>

                              <button
                                type="button"
                                className={
                                  item.status === journeyStatuses.NEED_HELP ||
                                  helpJourneyId === item.id
                                    ? 'active help'
                                    : 'help'
                                }
                                onClick={() =>
                                  beginLearningHelp(item.id)
                                }
                              >
                                <span>✨</span>
                                <span>
                                  <strong>I need help</strong>
                                  <small>Get SynapStride support</small>
                                </span>
                              </button>

                              <button
                                type="button"
                                className="completed"
                                onClick={() =>
                                  completeSchoolAssignment(item.id)
                                }
                              >
                                <span>✓</span>
                                <span>
                                  <strong>Completed</strong>
                                  <small>Mark as finished</small>
                                </span>
                              </button>
                            </div>
                          </>
                        )}
                      </section>

                      <div className="synWorkspaceBodyV098">
                        <aside className="synWorkspaceContextV098">
                          <section className="synWorkspaceTodoV098">
                            <div className="synWorkspaceMiniHeadingV098">
                              <span>📋</span><h3>What you need to do</h3>
                            </div>

                            {item.tasks?.length > 0 ? (
                              <ul>
                                {item.tasks.map((task, index) => (
                                  <li key={`${item.id}_task_${index}`}>
                                    {typeof task === 'string' ? task : task.label || task.text || `Task ${index + 1}`}
                                  </li>
                                ))}
                              </ul>
                            ) : item.description ? (
                              <p>{item.description}</p>
                            ) : (
                              <p className="synWorkspaceMutedV098">No assignment instructions were added yet.</p>
                            )}

                            {(() => {
                              const primaryAttachment =
                                getPrimaryAssignmentAttachment(item)

                              if (primaryAttachment?.dataUrl) {
                                return (
                                  <button
                                    type="button"
                                    className="synAssignmentActualPreviewV0919"
                                    onClick={() =>
                                      openAssignmentAttachment(
                                        item,
                                        primaryAttachment
                                      )
                                    }
                                  >
                                    {primaryAttachment.type?.startsWith('image/') ? (
                                      <img
                                        src={primaryAttachment.dataUrl}
                                        alt={`${item.title} assignment preview`}
                                      />
                                    ) : (
                                      <span className="synAssignmentDocumentPreviewV0919">
                                        📄
                                      </span>
                                    )}

                                    <span className="synAssignmentActualPreviewCaptionV0919">
                                      <strong>Assignment preview</strong>
                                      <small>{primaryAttachment.name}</small>
                                    </span>
                                  </button>
                                )
                              }

                              if (item.tasks?.length > 0 || item.description) {
                                return (
                                  <div className="synAssignmentTextPreviewV0919">
                                    <strong>{item.title}</strong>

                                    {item.tasks?.length > 0 ? (
                                      <ul>
                                        {item.tasks.slice(0, 4).map(
                                          (task, index) => (
                                            <li key={`${item.id}_preview_${index}`}>
                                              {typeof task === 'string'
                                                ? task
                                                : task.label ||
                                                  task.text ||
                                                  `Task ${index + 1}`}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    ) : (
                                      <p>{item.description}</p>
                                    )}
                                  </div>
                                )
                              }

                              return (
                                <div className="synAssignmentNoPreviewV0919">
                                  <span>📄</span>
                                  <div>
                                    <strong>No assignment preview available</strong>
                                    <small>
                                      Add the original assignment or worksheet to show it here.
                                    </small>
                                  </div>
                                </div>
                              )
                            })()}

                            <button
                              type="button"
                              className="synWorkspaceViewAssignmentV098"
                              onClick={() => {
                                const primaryAttachment =
                                  getPrimaryAssignmentAttachment(item)

                                if (primaryAttachment) {
                                  openAssignmentAttachment(
                                    item,
                                    primaryAttachment
                                  )
                                } else {
                                  setAssignmentViewerItem(item)
                                }
                              }}
                            >
                              View assignment
                            </button>

                            <section className="synAssignmentAttachmentsV0916">
                              <div className="synAssignmentAttachmentsHeaderV0916">
                                <div>
                                  <span>📎</span>
                                  <strong>
                                    Attachments
                                    {getAssignmentAttachments(item).length > 0
                                      ? ` (${getAssignmentAttachments(item).length})`
                                      : ''}
                                  </strong>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setAttachmentTargetItemId(item.id)
                                    window.requestAnimationFrame(() =>
                                      assignmentAttachmentInputRef.current?.click()
                                    )
                                  }}
                                >
                                  + Add
                                </button>
                              </div>

                              {getAssignmentAttachments(item).length > 0 ? (
                                <div className="synAssignmentAttachmentListV0916">
                                  {getAssignmentAttachments(item).map(
                                    (attachment, index) => {
                                      const primaryAttachment =
                                        getPrimaryAssignmentAttachment(item)

                                      const isPrimary =
                                        primaryAttachment?.id === attachment.id

                                      return (
                                        <div
                                          className={
                                            isPrimary
                                              ? 'synAssignmentAttachmentRowV0919 primary'
                                              : 'synAssignmentAttachmentRowV0919'
                                          }
                                          key={attachment.id || `${item.id}_${index}`}
                                        >
                                          <button
                                            type="button"
                                            className="synAssignmentAttachmentOpenV0919"
                                            onClick={() =>
                                              openAssignmentAttachment(item, attachment)
                                            }
                                          >
                                            <span className="synAssignmentAttachmentIconV0916">
                                              {attachment.type?.startsWith('image/')
                                                ? '🖼️'
                                                : '📄'}
                                            </span>

                                            <span className="synAssignmentAttachmentNameV0916">
                                              <strong>
                                                {attachment.name || `Attachment ${index + 1}`}
                                              </strong>

                                              <small>
                                                {isPrimary
                                                  ? 'Primary assignment'
                                                  : 'Context / progress'}
                                              </small>
                                            </span>

                                            <span>›</span>
                                          </button>

                                          {!isPrimary && (
                                            <button
                                              type="button"
                                              className="synAssignmentMakePrimaryV0919"
                                              onClick={() =>
                                                setPrimaryAssignmentAttachment(
                                                  item,
                                                  attachment.id
                                                )
                                              }
                                            >
                                              Use as assignment
                                            </button>
                                          )}
                                        </div>
                                      )
                                    }
                                  )}
                                </div>
                              ) : (
                                <div className="synAssignmentAttachmentsEmptyV0916">
                                  <span>No files attached yet.</span>
                                  <small>
                                    Add the original assignment, another page,
                                    teacher instructions, or a progress photo.
                                  </small>

                                  <button
                                    type="button"
                                    className="synAssignmentAttachmentsEmptyActionV0917"
                                    onClick={() => {
                                      setAttachmentTargetItemId(item.id)
                                      window.requestAnimationFrame(() =>
                                        assignmentAttachmentInputRef.current?.click()
                                      )
                                    }}
                                  >
                                    + Add attachment
                                  </button>
                                </div>
                              )}
                            </section>
                          </section>

                          <section className="synWorkspaceProgressCardV098">
                            <div className="synWorkspaceMiniHeadingV098">
                              <span>📈</span><h3>Learning Progress</h3>
                            </div>
                            <strong>{item.topic || item.subject || 'This assignment'}</strong>
                            <div className="synWorkspaceProgressBarV098">
                              <span style={{
                                width:
                                  item.status === journeyStatuses.COMPLETED ? '100%' :
                                  item.learningSupportRequest?.outcome?.outcomeType === 'resolved' ? '75%' :
                                  item.status === journeyStatuses.NEED_HELP ? '45%' : '60%'
                              }} />
                            </div>
                            <div className="synWorkspaceProgressStepsV098">
                              <span className="done">✓ Understand basics</span>
                              <span className={item.status === journeyStatuses.NEED_HELP ? 'active' : ''}>⏳ Practice more</span>
                              <span>○ Master it</span>
                            </div>
                          </section>

                          {item.status !== journeyStatuses.COMPLETED && (
                            <section className="synWorkspaceHelpCalloutV0910">
                              <span className="synWorkspaceHelpCalloutIconV0910">💡</span>
                              <div>
                                <h3>Stuck or need some help?</h3>
                                <p>
                                  SynapStride can explain something, show an example,
                                  help you get started, or give you practice.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => beginLearningHelp(item.id)}
                              >
                                ✨ I need help
                              </button>
                            </section>
                          )}
                        </aside>

                        {item.status !== journeyStatuses.COMPLETED ? (
                        <main className="synWorkspaceHelpV098">
                          <div className="synWorkspaceHelpTopV098">
                            <button type="button" className="synWorkspaceBackToAssignmentV0910" onClick={() => setHelpJourneyId(null)}>← <span>Back to assignment</span></button>
                            <span>I need help</span>
                            <button type="button" aria-label="Close help" onClick={() => setHelpJourneyId(null)}>×</button>
                          </div>

                          <div className="synWorkspaceHelpHeroV098">
                            <span className="synWorkspaceBotV098">🤖</span>
                            <div><h3>How can SynapStride help?</h3><p>Choose what would be most useful.</p></div>
                          </div>

                          {helpJourneyId === item.id && (
                            <>
                              <div className="synWorkspaceHelpChoicesV098">
                                {learningHelpModeOptions.map((option) => {
                                  const view =
                                    getLearningHelpPresentation(option)

                                  return (
                                    <button
                                      type="button"
                                      key={option.id}
                                      className={helpDraft.modeId === option.id ? 'active' : ''}
                                      onClick={() =>
                                        setHelpDraft((current) => ({
                                          ...current,
                                          modeId: option.id,
                                        }))
                                      }
                                    >
                                      <span>{view.emoji}</span>
                                      <strong>{view.label}</strong>
                                      <small>{view.description}</small>
                                    </button>
                                  )
                                })}
                              </div>

                              <label className="synWorkspaceHelpNoteV098">
                                <span>✎ <strong>Tell us more</strong> (optional)</span>
                                <input
                                  value={helpDraft.studentNote}
                                  placeholder="e.g. I know how to add fractions, but different denominators confuse me."
                                  onChange={(event) => setHelpDraft((current) => ({...current, studentNote: event.target.value}))}
                                />
                              </label>

                              <div className="synWorkspaceGetHelpV098">
                                <button type="button" disabled={!helpDraft.modeId} onClick={() => submitLearningHelp(item.id)}>
                                  ✨ Get help <span>→</span>
                                </button>
                              </div>
                            </>
                          )}

                          {item.learningSupportRequest && helpJourneyId !== item.id && (
                            <>
                              <div className="synWorkspaceSelectedHelpV098">
                                <div>
                                  <span>You asked for</span>
                                  <strong>{item.learningSupportRequest.helpLabel}</strong>
                                  {item.learningSupportRequest.studentNote && (
                                    <p>{item.learningSupportRequest.studentNote}</p>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => beginLearningHelp(item.id)}
                                >
                                  Change
                                </button>
                              </div>

                              <section className="synWorkspaceOtherHelpV0912">
                                <div className="synWorkspaceOtherHelpHeaderV0912">
                                  <div>
                                    <span>✦</span>
                                    <strong>Other ways I can help</strong>
                                  </div>

                                  <small>
                                    Switch anytime
                                  </small>
                                </div>

                                <div className="synWorkspaceOtherHelpGridV0912">
                                  {learningHelpModeOptions
                                    .filter(
                                      (option) =>
                                        option.id !==
                                        (
                                          item.learningSupportRequest.helpMode ||
                                          item.learningSupportRequest.modeId
                                        )
                                    )
                                    .map((option) => {
                                      const view =
                                        getLearningHelpPresentation(option)

                                      return (
                                        <button
                                          type="button"
                                          key={option.id}
                                          onClick={() => {
                                            onLearningItemStatus?.(
                                              item.id,
                                              journeyStatuses.NEED_HELP
                                            )

                                            onLearningHelpRequest?.(
                                              item.id,
                                              {
                                                modeId: option.id,
                                                studentNote:
                                                  item.learningSupportRequest.studentNote || '',
                                              }
                                            )

                                            setHelpJourneyId(null)
                                          }}
                                        >
                                          <span>{view.emoji}</span>

                                          <span>
                                            <strong>{view.shortLabel}</strong>
                                            <small>{view.shortDescription}</small>
                                          </span>
                                        </button>
                                      )
                                    })}
                                </div>
                              </section>

                              <LearningResourceRecommendations
                                item={item}
                                childProfile={childProfile}
                                onFeedback={onLearningResourceFeedback}
                                onDone={onLearningSupportOutcome}
                              />
                            </>
                          )}

                          {!helpJourneyId && !item.learningSupportRequest && (
                            <div className="synWorkspaceHelpChoicesV098 preview">
                              {learningHelpModeOptions.map((option) => {
                                const view =
                                  getLearningHelpPresentation(option)

                                return (
                                  <button
                                    type="button"
                                    key={option.id}
                                    onClick={() => beginLearningHelp(item.id)}
                                  >
                                    <span>{view.emoji}</span>
                                    <strong>{view.label}</strong>
                                    <small>{view.description}</small>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </main>
                        ) : (
                          <main className="synWorkspaceHelpV098 synCompletedHistoryPanelV0913">
                            <div className="synCompletedHistoryInnerV0913">
                              <span className="synCompletedHistoryIconV0913">✓</span>

                              <div>
                                <span className="cgEyebrowV09">
                                  COMPLETED HISTORY
                                </span>

                                <h3>This assignment is saved in your learning history.</h3>

                                <p>
                                  You can review the instructions and learning progress
                                  here without changing anything. Reopen the assignment
                                  above if you need to work on it again.
                                </p>
                              </div>
                            </div>
                          </main>
                        )}
                      </div>


                    </article>
                  )
                }

                return (
                  <article
                    className={
                      itemIndex === 0
                        ? 'journeyCardV06 bppJourneyPrimaryItemV0810'
                        : 'journeyCardV06 bppJourneySecondaryItemV0810'
                    }
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



      )}

        </section>
      )}

      <input
        ref={assignmentAttachmentInputRef}
        type="file"
        accept="image/*,.pdf"
        multiple
        className="synAssignmentAttachmentInputV0916"
        onChange={handleAssignmentAttachmentFiles}
      />

      {assignmentViewerItem && (
        <div
          className="synAssignmentViewerBackdropV0914"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setAssignmentViewerItem(null)
            }
          }}
        >
          <section
            className="synAssignmentViewerModalV0914"
            role="dialog"
            aria-modal="true"
            aria-labelledby="synAssignmentViewerTitleV0914"
          >
            <header className="synAssignmentViewerHeaderV0914">
              <div>
                <span className="cgEyebrowV09">ASSIGNMENT</span>
                <h2 id="synAssignmentViewerTitleV0914">
                  {assignmentViewerItem.activeAttachment?.name ||
                    assignmentViewerItem.title}
                </h2>
                <p>
                  {assignmentViewerItem.subject || 'School & Learning'}
                  {assignmentViewerItem.topic
                    ? ` · ${assignmentViewerItem.topic}`
                    : ''}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close assignment viewer"
                onClick={() => setAssignmentViewerItem(null)}
              >
                ×
              </button>
            </header>

            <div className="synAssignmentViewerBodyV0914">
              {(
                assignmentViewerItem.activeAttachment?.dataUrl ||
                assignmentViewerItem.attachmentDataUrl
              ) ? (
                <div className="synAssignmentViewerImageWrapV0914">
                  {(
                    assignmentViewerItem.activeAttachment?.type ||
                    assignmentViewerItem.attachmentType ||
                    ''
                  ).includes('pdf') ? (
                    <iframe
                      className="synAssignmentViewerPdfV0916"
                      src={
                        assignmentViewerItem.activeAttachment?.dataUrl ||
                        assignmentViewerItem.attachmentDataUrl
                      }
                      title={`${assignmentViewerItem.title} attachment`}
                    />
                  ) : (
                    <img
                      src={
                        assignmentViewerItem.activeAttachment?.dataUrl ||
                        assignmentViewerItem.attachmentDataUrl
                      }
                      alt={`${assignmentViewerItem.title} assignment`}
                    />
                  )}
                </div>
              ) : (
                <div className="synAssignmentViewerFallbackV0914">
                  <div className="synAssignmentViewerPaperV0914">
                    <span className="synAssignmentViewerPaperTitleV0914">
                      {assignmentViewerItem.title}
                    </span>

                    {assignmentViewerItem.tasks?.length > 0 ? (
                      <ul>
                        {assignmentViewerItem.tasks.map((task, index) => (
                          <li key={`viewer_task_${index}`}>
                            {typeof task === 'string'
                              ? task
                              : task.label ||
                                task.text ||
                                `Task ${index + 1}`}
                          </li>
                        ))}
                      </ul>
                    ) : assignmentViewerItem.description ? (
                      <p>{assignmentViewerItem.description}</p>
                    ) : (
                      <p>
                        No assignment instructions or source material are available yet.
                      </p>
                    )}
                  </div>

                  <div className="synAssignmentViewerNoSourceV0914">
                    <span>📎</span>
                    <div>
                      <strong>No original assignment image is attached.</strong>
                      <p>
                        This assignment was created before SynapStride began
                        saving the uploaded image. New photo uploads will open
                        the original image here.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <footer className="synAssignmentViewerFooterV0914">
              <div>
                {assignmentViewerItem.attachmentName && (
                  <span>
                    📎 {assignmentViewerItem.attachmentName}
                  </span>
                )}

                {assignmentViewerItem.dueDate && (
                  <span>
                    📅 Due {formatSchoolDate(assignmentViewerItem.dueDate)}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setAssignmentViewerItem(null)}
              >
                Close
              </button>
            </footer>
          </section>
        </div>
      )}

      {(growthView === 'activities' || growthView === 'experiences') && (
        <GrowthAreaWorkspaceV0103
          area="activities"
          title="Interests & Activities"
          eyebrow="INTERESTS & ACTIVITIES"
          emoji="✨"
          description="The things you enjoy, do, try, and discover beyond school — all in one place."
          journeyItems={[
            ...getJourneyItemsByPath(unifiedJourneyItems, journeyPaths.ACTIVITIES_INTERESTS),
            ...getJourneyItemsByPath(unifiedJourneyItems, journeyPaths.EXPERIENCES),
          ]}
          growthActivities={growthActivities.filter((activity) =>
            ['activity', 'enrichment', 'experience', 'local_event', 'learning_resource'].includes(activity.type)
          )}
          onScheduleActivity={onScheduleGrowthActivity}
          onUpdateActivity={onUpdateGrowthActivity}
          onActivityStatus={onGrowthActivityStatus}
          onActivityReflection={onGrowthActivityReflection}
          onExplore={onExplore}
          exploreRecommendations={exploreRecommendations}
          exploreCatalog={exploreCatalog}
          completedExplorations={completedExplorations}
          onSaveGrowthOpportunity={onSaveGrowthOpportunity}
          onStartAdventure={onStartAdventure}
          childName={childName}
          onBack={openGrowthOverview}
        />
      )}

      {false && patternIntelligence
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

      <section className="cgJourneyToolsV09 cgCustomerHiddenV09">
        <div>
          <span className="cgEyebrowV09">ONE JOURNEY</span>
          <h2>Everything you’re doing belongs together.</h2>
          <p>
            Schoolwork, experiences, hobbies and interests all become part of your Journey.
            The labels tell you what kind of activity it is — you don’t need to manage separate journeys.
          </p>
        </div>

        <div className="cgJourneyToolActionsV09">
          <button
            type="button"
            className="cgButtonV09 cgButtonSecondaryV09 cgButtonSmallV09"
            onClick={() => {
              setShowLearningForm((current) => !current)
              window.requestAnimationFrame(() => {
                learningFormRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              })
            }}
          >
            + Add School &amp; Learning
          </button>

          <button
            type="button"
            className="cgButtonV09 cgButtonPrimaryV09 cgButtonSmallV09"
            onClick={onExplore}
          >
            Explore something new
          </button>
        </div>
      </section>

      {growthView === 'school' && showLearningForm && (
        <section className="learningWorkspaceV08 cgLearningWorkspaceOpenV09">
          <div className="learningWorkspaceHeaderV08">
            <div>
              <span className="growthKickerV06">
                SCHOOL & LEARNING
              </span>

              <h2>
                What are you working on?
              </h2>

              <p>
                Add schoolwork, projects, tests, tutoring, and supplemental learning to My Growth.
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

                  <select
                    value={
                      learningDraft
                        .subjectId
                    }
                    onChange={(event) => {
                      const selectedId =
                        event.target.value

                      const selected =
                        schoolSubjectOptions.find(
                          (subject) =>
                            subject.id ===
                            selectedId
                        )

                      setLearningDraft(
                        (current) => ({
                          ...current,

                          subjectId:
                            selectedId,

                          subject:
                            selectedId ===
                            schoolSubjectIds.OTHER
                              ? current.customSubject ||
                                ''
                              : selected?.label ||
                                '',

                          customSubject:
                            selectedId ===
                            schoolSubjectIds.OTHER
                              ? current.customSubject ||
                                ''
                              : '',
                        })
                      )
                    }}
                  >
                    <option value="">
                      Choose subject
                    </option>

                    {schoolSubjectOptions.map(
                      (subject) => (
                        <option
                          value={subject.id}
                          key={subject.id}
                        >
                          {subject.label}
                        </option>
                      )
                    )}
                  </select>

                  {learningDraft.subjectId ===
                    schoolSubjectIds.OTHER && (
                    <input
                      value={
                        learningDraft
                          .customSubject
                      }
                      placeholder="Enter subject"
                      onChange={(event) =>
                        setLearningDraft(
                          (current) => ({
                            ...current,
                            subject:
                              event.target.value,
                            customSubject:
                              event.target.value,
                          })
                        )
                      }
                    />
                  )}
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

              <section className="synLearningDraftAttachmentsV0917">
                <div className="synLearningDraftAttachmentsHeaderV0917">
                  <div>
                    <span>📎</span>
                    <div>
                      <strong>Assignment attachments</strong>
                      <small>
                        Optional — add a worksheet, screenshot, teacher handout,
                        or other source material now.
                      </small>
                    </div>
                  </div>

                  <label>
                    + Add attachment
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      multiple
                      onChange={async (event) => {
                        const attachments =
                          await filesToAssignmentAttachments(
                            event.target.files,
                            'assignment_source'
                          )

                        event.target.value = ''

                        setLearningDraftAttachments(
                          (current) => [
                            ...current,
                            ...attachments,
                          ]
                        )
                      }}
                    />
                  </label>
                </div>

                {learningDraftAttachments.length > 0 && (
                  <div className="synLearningDraftAttachmentListV0917">
                    {learningDraftAttachments.map(
                      (attachment) => (
                        <div key={attachment.id}>
                          <span>
                            {attachment.type?.startsWith('image/')
                              ? '🖼️'
                              : '📄'}
                          </span>

                          <span>
                            <strong>{attachment.name}</strong>
                            <small>Original assignment</small>
                          </span>

                          <button
                            type="button"
                            aria-label={`Remove ${attachment.name}`}
                            onClick={() =>
                              setLearningDraftAttachments(
                                (current) =>
                                  current.filter(
                                    (item) =>
                                      item.id !== attachment.id
                                  )
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>

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
                  Add to My Growth
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {false && learningTracker.total > 0 && (
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

      {learningProgression
          .topics
          .length > 0 && (
        <section className="learningProgressionV089B cgCustomerHiddenV09">
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
                SynapStride connects the history so you
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

      {learningNextSteps
          .nextSteps
          .length > 0 && (
        <section className="learningNextStepsV089C cgCustomerHiddenV09">
          <div className="learningNextStepsHeaderV089C">
            <div>
              <span className="growthKickerV06">
                WHAT COULD HELP NEXT
              </span>

              <h2>
                {recommendationIntent?.type === 'support'
                  ? 'Support that could help now'
                  : recommendationIntent?.type === 'practice'
                    ? 'A good time to practice again'
                    : 'Next steps from your learning history'}
              </h2>

              <p>
                {recommendationIntent?.reason ||
                  'These suggestions use what you have worked on, the help you asked for, and what happened afterward.'}
              </p>
            </div>

            <span className="learningNextStepsAttentionV089C">
              {learningNextSteps.urgentCount > 0
                ? `${learningNextSteps.urgentCount} need attention`
                : recommendationIntentLabel}
            </span>
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
            The recommendation loop uses learning history, support outcomes,
            growth evidence, and stated intent. Recommendations never become
            evidence and do not infer grades, mastery, weakness, or ability.
          </div>
        </section>
      )}

      {experienceRecommendations.length > 0 && (
        <section className="learningNextStepsV089C cgCustomerHiddenV09">
          <div className="learningNextStepsHeaderV089C">
            <div>
              <span className="growthKickerV06">
                WHAT COULD HELP NEXT
              </span>

              <h2>
                {experienceStrategy?.mode === 'deepen'
                  ? 'Build on a pattern that is taking shape'
                  : 'Explore something that can teach us more'}
              </h2>

              <p>
                {recommendationIntent?.reason ||
                  'Choose a useful next experience from the evidence and interests available so far.'}
              </p>
            </div>

            <span className="learningNextStepsAttentionV089C">
              {experienceStrategy?.mode === 'deepen'
                ? 'Deepen'
                : 'Explore'}
            </span>
          </div>

          <div className="learningNextStepsGridV089C">
            {experienceRecommendations
              .slice(0, 3)
              .map(
                (recommendation) => (
                  <article
                    className="learningNextStepCardV089C"
                    key={recommendation.experienceId}
                  >
                    <div className="learningNextStepTopicV089C">
                      <span>
                        {experienceStrategy?.mode === 'deepen'
                          ? 'DEEPEN'
                          : 'EXPLORE'}
                      </span>

                      <strong>
                        {recommendation.emoji || '✨'}
                      </strong>
                    </div>

                    <h3>
                      {recommendation.title}
                    </h3>

                    <p>
                      {recommendation.description}
                    </p>

                    <small>
                      Why: {recommendation.reasons?.[0] ||
                        'A useful next experience based on the current Journey.'}
                    </small>

                    <div className="learningNextStepFooterV089C">
                      <button
                        type="button"
                        onClick={() =>
                          onStartGrow?.(
                            recommendation
                          )
                        }
                      >
                        {experienceStrategy?.mode === 'deepen'
                          ? 'Deepen this'
                          : 'Try this'}
                      </button>

                      <em>
                        Recommendation only · not evidence
                      </em>
                    </div>
                  </article>
                )
              )}
          </div>

          <div className="learningNextStepsGuardrailV089C">
            Deepen requires a pattern that already passed corroboration and
            controlled promotion. Repetition from School & Learning alone
            cannot trigger Deepen. Explore is used when stronger guidance is
            not yet justified.
          </div>
        </section>
      )}

      {completedItems.length > 0 && (
        <section className="journeySectionV06 journeyCompletedSectionV07 cgCustomerHiddenV09">
          <div className="journeyCompletedHeaderV07">
            <div>
              <span className="growthKickerV06">
                COMPLETED
              </span>

              <h2>
                What you’ve completed
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



function GrowthAreaWorkspaceV0103({
  area,
  title,
  eyebrow,
  emoji,
  description,
  journeyItems = [],
  growthActivities = [],
  onScheduleActivity,
  onUpdateActivity,
  onActivityStatus,
  onActivityReflection,
  onExplore,
  exploreRecommendations = [],
  exploreCatalog = [],
  completedExplorations = [],
  onSaveGrowthOpportunity,
  onStartAdventure,
  childName = 'Explorer',
  onBack,
}) {
  const [localView, setLocalView] = useState('tracker')
  const [editActivity, setEditActivity] = useState(null)
  const [editDraft, setEditDraft] = useState({ title: '', type: 'activity', notes: '', date: '', time: '', durationMinutes: '60' })

  const openActivityEditor = (activity) => {
    const raw = activity?.schedule?.startAt || activity?.schedule?.date || ''
    setEditActivity(activity)
    setEditDraft({
      title: activity?.title || '',
      type: activity?.type || 'activity',
      notes: activity?.metadata?.notes || activity?.description || '',
      date: String(raw).slice(0, 10),
      time: String(raw).includes('T') ? String(raw).slice(11, 16) : '',
      durationMinutes: String(activity?.schedule?.durationMinutes || 60),
    })
  }

  const saveActivityEditor = () => {
    if (!editActivity) return
    onUpdateActivity?.(editActivity.id, {
      title: editDraft.title.trim() || editActivity.title,
      type: editDraft.type,
      description: editDraft.notes.trim(),
      metadata: { notes: editDraft.notes.trim() },
      ...(editDraft.date ? {
        status: editActivity.status === 'saved' ? 'scheduled' : editActivity.status,
        schedule: {
          ...(editActivity.schedule || {}),
          date: editDraft.date,
          startAt: editDraft.time ? `${editDraft.date}T${editDraft.time}:00` : '',
          durationMinutes: Number(editDraft.durationMinutes) || 60,
        },
      } : {}),
    })
    setEditActivity(null)
  }

  const scheduledActivities = useMemo(
    () => growthActivities
      .filter((activity) => activity?.schedule?.date || activity?.schedule?.startAt)
      .slice()
      .sort((a, b) => String(a.schedule?.startAt || a.schedule?.date || '')
        .localeCompare(String(b.schedule?.startAt || b.schedule?.date || ''))),
    [growthActivities]
  )

  const activeGrowthActivities = growthActivities.filter(
    (activity) => !['completed', 'attended', 'cancelled', 'skipped'].includes(activity.status)
  )
  const completedGrowthActivities = growthActivities.filter(
    (activity) => ['completed', 'attended'].includes(activity.status)
  )
  const activeJourneyItems = journeyItems.filter((item) => item.status !== 'completed')
  const completedJourneyItems = journeyItems.filter((item) => item.status === 'completed')

  return (
    <section className="gaWorkspaceV0103">
      <header className="gaHeaderV0103">
        <div className="gaHeaderTitleV0103">
          <span className="gaHeaderIconV0103">{emoji}</span>
          <div>
            <span className="cgEyebrowV09">{eyebrow}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
        <button type="button" className="gaBackV0103" onClick={onBack}>← My Growth</button>
      </header>

      <nav className="mgSchoolLocalTabsV092 gaLocalTabsV0103" aria-label={`${title} views`}>
        <button type="button" className={localView === 'tracker' ? 'active' : ''} onClick={() => setLocalView('tracker')}>
          Tracker
          {activeGrowthActivities.length + activeJourneyItems.length > 0 && (
            <span className="gaTabCountV0103">{activeGrowthActivities.length + activeJourneyItems.length}</span>
          )}
        </button>
        <button type="button" className={localView === 'calendar' ? 'active' : ''} onClick={() => setLocalView('calendar')}>
          Calendar
          {scheduledActivities.length > 0 && <span className="gaTabCountV0103">{scheduledActivities.length}</span>}
        </button>
        <button type="button" className={localView === 'explore' ? 'active' : ''} onClick={() => setLocalView('explore')}>
          Explore More
        </button>
        <button type="button" className={localView === 'completed' ? 'active' : ''} onClick={() => setLocalView('completed')}>
          Completed
          {completedGrowthActivities.length + completedJourneyItems.length > 0 && (
            <span className="gaTabCountV0103">{completedGrowthActivities.length + completedJourneyItems.length}</span>
          )}
        </button>
      </nav>

      {localView === 'tracker' && (
        <div className="iaTrackerV0104D">
          <div className="iaTrackerColumnsV0104D">
            <section className="iaPanelV0104D iaInterestsV0104D">
              <div className="iaPanelHeadV0104D"><strong>💚 My Interests</strong><button type="button" onClick={() => setLocalView('explore')}>Explore more</button></div>
              <div className="iaInterestChipsV0104D">
                {[...activeGrowthActivities, ...activeJourneyItems].slice(0, 6).map((item) => (
                  <span key={`interest-${item.id}`}>{item.emoji || '✨'} {item.metadata?.interest || item.label || item.title}</span>
                ))}
                {(activeGrowthActivities.length + activeJourneyItems.length) === 0 && <p>Try something that catches your attention. Your interests will grow here.</p>}
              </div>
              <button className="iaTextActionV0104D" type="button" onClick={() => setLocalView('explore')}>+ Discover a new interest</button>
            </section>

            <section className="iaPanelV0104D iaDoingV0104D">
              <div className="iaPanelHeadV0104D"><strong>🧑‍🤝‍🧑 What I’m Doing</strong><button type="button" onClick={() => setLocalView('explore')}>Add activity</button></div>
              <div className="iaDoingListV0104D">
                {activeGrowthActivities.slice(0, 4).map((activity) => (
                  <article key={activity.id}>
                    <span className="iaDoingEmojiV0104D">{activity.emoji || emoji}</span>
                    <div><strong>{activity.title}</strong><small><em data-type={activity.type}>{formatGrowthTypeV0104D(activity.type)}</em>{activity.schedule ? ` · ${formatGrowthScheduleV0103(activity.schedule)}` : ' · Not scheduled'}</small></div>
                    <button type="button" className="iaEditButtonV0104D" onClick={() => openActivityEditor(activity)} aria-label={`Edit ${activity.title}`}>✎</button>
                  </article>
                ))}
                {activeJourneyItems.slice(0, Math.max(0, 4 - activeGrowthActivities.length)).map((item) => (
                  <article key={`journey-${item.id}`}><span className="iaDoingEmojiV0104D">{item.emoji || emoji}</span><div><strong>{item.title}</strong><small><em>Experience</em> · {item.status === 'in_progress' ? 'In progress' : 'Started'}</small></div></article>
                ))}
                {(activeGrowthActivities.length + activeJourneyItems.length) === 0 && <p className="iaEmptyLineV0104D">Activities you add will appear here.</p>}
              </div>
              {(activeGrowthActivities.length + activeJourneyItems.length) > 4 && <button className="iaTextActionV0104D" type="button">View all ({activeGrowthActivities.length + activeJourneyItems.length})</button>}
            </section>

            <section className="iaPanelV0104D iaComingV0104D">
              <div className="iaPanelHeadV0104D"><strong>🗓️ Coming Up</strong><button type="button" onClick={() => setLocalView('calendar')}>View calendar →</button></div>
              <div className="iaComingListV0104D">
                {scheduledActivities.slice(0, 3).map((activity) => {
                  const raw = activity.schedule?.startAt || activity.schedule?.date
                  const date = raw ? new Date(`${String(raw).slice(0,10)}T12:00:00`) : null
                  return <article key={`up-${activity.id}`}><div className="iaDateTileV0104D"><b>{date ? date.toLocaleDateString(undefined,{weekday:'short'}).toUpperCase() : 'DATE'}</b><span>{date ? date.toLocaleDateString(undefined,{month:'short',day:'numeric'}).toUpperCase() : 'TBD'}</span></div><div><strong>{activity.title}</strong><small>{formatGrowthScheduleV0103(activity.schedule)}</small><em data-type={activity.type}>{formatGrowthTypeV0104D(activity.type)}</em></div></article>
                })}
                {scheduledActivities.length === 0 && <p className="iaEmptyLineV0104D">Nothing scheduled yet. Add a date to an activity when you’re ready.</p>}
              </div>
            </section>
          </div>
          <div className="iaExploreBridgeV0104D"><div><span>✨</span><div><strong>Explore More</strong><p>Ideas picked around what you’re interested in and what might be fun to try next.</p></div></div><button type="button" onClick={() => setLocalView('explore')}>See ideas →</button></div>
        </div>
      )}

      {localView === 'explore' && (
        <div className="gaExploreMoreV0104B">
          <AdventuresHub
            embedded
            childName={childName}
            recommendations={exploreRecommendations}
            catalog={exploreCatalog}
            completedExplorations={completedExplorations}
            growthActivities={growthActivities}
            onSaveGrowthOpportunity={onSaveGrowthOpportunity}
            onBack={() => setLocalView('tracker')}
            onStartAdventure={onStartAdventure}
          />
        </div>
      )}

      {localView === 'calendar' && (
        <GrowthCalendarV0103
          areaTitle={title}
          areaEmoji={emoji}
          contextual
          growthActivities={growthActivities}
          calendarActivities={scheduledActivities}
          onScheduleActivity={onScheduleActivity}
          onActivityStatus={onActivityStatus}
          onActivityReflection={onActivityReflection}
          onExplore={onExplore}
        />
      )}

      {localView === 'completed' && (
        <div className="gaCompletedV0103">
          <div className="gaSectionTitleV0103">
            <div><span className="cgEyebrowV09">COMPLETED</span><h3>Things you’ve finished</h3></div>
          </div>
          {(completedGrowthActivities.length + completedJourneyItems.length) > 0 ? (
            <div className="gaItemListV0103">
              {completedGrowthActivities.map((activity) => (
                <article className="gaItemV0103 done" key={`done-${activity.id}`}>
                  <span className="gaItemEmojiV0103">{activity.emoji || emoji}</span>
                  <div className="gaItemBodyV0103">
                    <small>{formatGrowthActivityStatusV0103(activity.status)}</small>
                    <h4>{activity.title}</h4>
                    <p>{activity.reflection?.favoritePart || activity.reflection?.learned || 'Completed growth activity'}</p>
                  </div>
                  {activity.reflection
                    ? <span className="gcReflectedV0103">✓ Reflected</span>
                    : <button type="button" onClick={() => setLocalView('calendar')}>Reflect</button>}
                </article>
              ))}
              {completedJourneyItems.map((item) => (
                <article className="gaItemV0103 done legacy" key={`done-journey-${item.id}`}>
                  <span className="gaItemEmojiV0103">{item.emoji || emoji}</span>
                  <div className="gaItemBodyV0103"><small>Completed</small><h4>{item.title}</h4><p>{item.reflection?.favoritePart || item.description || 'Completed experience'}</p></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="gaEmptyV0103"><span>✓</span><strong>Nothing completed here yet.</strong></div>
          )}
        </div>
      )}
      {editActivity && (
        <div className="iaEditOverlayV0104D" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditActivity(null) }}>
          <section className="iaEditModalV0104D" role="dialog" aria-modal="true" aria-label="Edit activity">
            <div className="iaEditHeadV0104D"><div><span className="cgEyebrowV09">EDIT ACTIVITY</span><h3>{editActivity.title}</h3></div><button type="button" onClick={() => setEditActivity(null)}>×</button></div>
            <label>Activity name<input value={editDraft.title} onChange={(e) => setEditDraft((d) => ({...d,title:e.target.value}))} /></label>
            <label>Type<select value={editDraft.type} onChange={(e) => setEditDraft((d) => ({...d,type:e.target.value}))}><option value="activity">Activity</option><option value="experience">Experience</option><option value="local_event">Local Event</option><option value="enrichment">Interest</option></select></label>
            <label>Notes<textarea rows="3" value={editDraft.notes} onChange={(e) => setEditDraft((d) => ({...d,notes:e.target.value}))} /></label>
            <div className="iaEditScheduleV0104D"><label>Date<input type="date" value={editDraft.date} onChange={(e) => setEditDraft((d) => ({...d,date:e.target.value}))} /></label><label>Time<input type="time" value={editDraft.time} onChange={(e) => setEditDraft((d) => ({...d,time:e.target.value}))} /></label></div>
            <div className="iaEditActionsV0104D"><button type="button" className="danger" onClick={() => { onActivityStatus?.(editActivity.id,'cancelled'); setEditActivity(null) }}>Remove</button><span /><button type="button" onClick={() => { onActivityStatus?.(editActivity.id, editActivity.type === 'local_event' ? 'attended' : 'completed'); setEditActivity(null) }}>Mark completed</button><button type="button" className="primary" onClick={saveActivityEditor}>Save changes</button></div>
          </section>
        </div>
      )}
    </section>
  )
}

function formatGrowthTypeV0104D(type) {
  return ({ local_event: 'Local Event', experience: 'Experience', learning_resource: 'Experience', enrichment: 'Interest', activity: 'Activity' }[type] || 'Activity')
}

function InterestsCalendarMiniV0104A({ activities = [], onOpenCalendar }) {
  const dated = activities
    .filter((activity) => activity?.schedule?.date || activity?.schedule?.startAt)
    .slice()
    .sort((a, b) => String(a.schedule?.startAt || a.schedule?.date || '').localeCompare(String(b.schedule?.startAt || b.schedule?.date || '')))
  const firstDate = dated[0]?.schedule?.startAt || dated[0]?.schedule?.date
  const anchor = firstDate ? new Date(`${String(firstDate).slice(0, 10)}T12:00:00`) : new Date()
  const year = anchor.getFullYear()
  const month = anchor.getMonth()
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array(first.getDay()).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))
  const eventDays = new Map()
  dated.forEach((activity) => {
    const raw = activity.schedule?.startAt || activity.schedule?.date
    const d = new Date(`${String(raw).slice(0, 10)}T12:00:00`)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const list = eventDays.get(d.getDate()) || []
      list.push(activity)
      eventDays.set(d.getDate(), list)
    }
  })
  const monthLabel = anchor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const typeLabel = (type) => ({ local_event: 'Local Event', experience: 'Experience', learning_resource: 'Experience', enrichment: 'Activity', activity: 'Activity' }[type] || 'Interest')

  return (
    <aside className="gaMiniCalendarV0104A">
      <div className="gaMiniCalendarHeaderV0104A"><strong>{monthLabel}</strong><button type="button" onClick={onOpenCalendar}>View calendar →</button></div>
      <div className="gaMiniWeekV0104A">{['SUN','MON','TUE','WED','THU','FRI','SAT'].map((d) => <span key={d}>{d}</span>)}</div>
      <div className="gaMiniDaysV0104A">
        {cells.map((day, index) => (
          <div className={`gaMiniDayV0104A ${day && eventDays.has(day) ? 'hasEvent' : ''}`} key={`${day || 'blank'}-${index}`}>
            {day && <><span>{day}</span>{eventDays.has(day) && <i aria-hidden="true" />}</>}
          </div>
        ))}
      </div>
      <div className="gaMiniFiltersV0104A">
        <span>All</span><span>Activity</span><span>Experience</span><span>Local Event</span>
      </div>
      <div className="gaMiniUpcomingV0104A">
        {dated.slice(0, 4).map((activity) => (
          <button type="button" key={`mini-${activity.id}`} onClick={onOpenCalendar}>
            <div><strong>{activity.title}</strong><small>{formatGrowthScheduleV0103(activity.schedule)}</small></div>
            <em data-type={activity.type}>{typeLabel(activity.type)}</em>
          </button>
        ))}
        {dated.length === 0 && <p>Scheduled activities and events will appear here.</p>}
      </div>
    </aside>
  )
}

function GrowthCalendarV0103({
  childName = '',
  areaTitle = 'Growth',
  areaEmoji = '🗓️',
  contextual = false,
  journeyItems = [],
  growthActivities = [],
  calendarActivities = [],
  upcomingGrowthActivities = [],
  onScheduleActivity,
  onActivityStatus,
  onActivityReflection,
  onExplore,
  onBack,
}) {
  const today = new Date()
  const [monthCursor, setMonthCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [scheduleTargetId, setScheduleTargetId] = useState(null)
  const [scheduleDraft, setScheduleDraft] = useState({
    date: '',
    time: '',
    durationMinutes: '60',
  })
  const [reflectionTargetId, setReflectionTargetId] = useState(null)
  const [activityReflection, setActivityReflection] = useState({
    enjoyment: '',
    favoritePart: '',
    learned: '',
    wouldDoAgain: '',
    wantsNext: '',
  })

  const schoolCalendarEntries = useMemo(
    () =>
      (contextual ? [] : journeyItems)
        .filter((item) => item?.dueDate)
        .map((item) => ({
          id: `school-${item.id}`,
          sourceId: item.id,
          sourceKind: 'school',
          title: item.title,
          emoji: item.emoji || '📚',
          date: item.dueDate,
          status: item.status,
          label: 'School & Learning',
        })),
    [journeyItems, contextual]
  )

  const activityCalendarEntries = useMemo(
    () =>
      calendarActivities.map((activity) => ({
        id: `activity-${activity.id}`,
        sourceId: activity.id,
        sourceKind: 'growth_activity',
        title: activity.title,
        emoji: activity.emoji || '🌱',
        date: activity.schedule?.date || activity.schedule?.startAt?.slice?.(0, 10),
        startAt: activity.schedule?.startAt || null,
        status: activity.status,
        label: activity.type === 'local_event' ? 'Near You' : 'Growth Activity',
        activity,
      })),
    [calendarActivities]
  )

  const allEntries = useMemo(
    () => [...activityCalendarEntries, ...schoolCalendarEntries]
      .filter((entry) => entry.date)
      .sort((a, b) => String(a.date).localeCompare(String(b.date))),
    [activityCalendarEntries, schoolCalendarEntries]
  )

  const unscheduledActivities = growthActivities
    .filter((activity) => !activity?.schedule?.date && !activity?.schedule?.startAt)
    .filter((activity) => !['completed', 'attended', 'cancelled', 'skipped'].includes(activity.status))

  const year = monthCursor.getFullYear()
  const month = monthCursor.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const monthLabel = monthCursor.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  const dateKeyForDay = (day) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const openSchedule = (activity) => {
    const existingDate = activity?.schedule?.date || ''
    const existingTime = activity?.schedule?.startAt
      ? activity.schedule.startAt.slice(11, 16)
      : ''
    setScheduleTargetId(activity.id)
    setScheduleDraft({
      date: existingDate,
      time: existingTime,
      durationMinutes: String(activity?.schedule?.durationMinutes || 60),
    })
  }

  const saveSchedule = (event) => {
    event.preventDefault()
    if (!scheduleTargetId || !scheduleDraft.date) return

    const startAt = scheduleDraft.time
      ? `${scheduleDraft.date}T${scheduleDraft.time}:00`
      : null

    onScheduleActivity?.(scheduleTargetId, {
      date: scheduleDraft.date,
      startAt,
      allDay: !scheduleDraft.time,
      durationMinutes: Number(scheduleDraft.durationMinutes) || 60,
    })
    setScheduleTargetId(null)
  }

  const openReflection = (activity) => {
    setReflectionTargetId(activity.id)
    setActivityReflection({
      enjoyment: activity.reflection?.enjoyment || '',
      favoritePart: activity.reflection?.favoritePart || '',
      learned: activity.reflection?.learned || '',
      wouldDoAgain:
        activity.reflection?.wouldDoAgain === true
          ? 'yes'
          : activity.reflection?.wouldDoAgain === false
            ? 'no'
            : '',
      wantsNext: activity.reflection?.wantsNext || '',
    })
  }

  const saveReflection = (event) => {
    event.preventDefault()
    if (!reflectionTargetId || !activityReflection.enjoyment) return
    onActivityReflection?.(reflectionTargetId, {
      enjoyment: activityReflection.enjoyment,
      favoritePart: activityReflection.favoritePart,
      learned: activityReflection.learned,
      wouldDoAgain:
        activityReflection.wouldDoAgain === 'yes'
          ? true
          : activityReflection.wouldDoAgain === 'no'
            ? false
            : null,
      wantsNext: activityReflection.wantsNext,
    })
    setReflectionTargetId(null)
  }

  const comingUpEntries = allEntries
    .filter((entry) => entry.date >= new Date().toISOString().slice(0, 10))
    .slice(0, 6)

  return (
    <section className="growthCalendarV0103">
      <header className="gcHeaderV0103">
        <div>
          <span className="cgEyebrowV09">{contextual ? `${areaTitle.toUpperCase()} · CALENDAR` : 'GROWTH CALENDAR'}</span>
          <h2>{contextual ? `${areaTitle} calendar` : `What’s coming up for ${childName}?`}</h2>
          <p>
            {contextual
              ? `Plan ${areaTitle.toLowerCase()} when they fit your real life. Scheduled items stay with this growth area.`
              : 'Add a date only when something is actually planned.'}
          </p>
        </div>
        {!contextual && onBack && <button type="button" onClick={onBack}>← My Growth</button>}
      </header>

      <div className="gcSummaryV0103">
        <div><strong>{calendarActivities.length}</strong><span>Scheduled activities</span></div>
        <div><strong>{unscheduledActivities.length}</strong><span>Saved to plan</span></div>
        {!contextual && <div><strong>{schoolCalendarEntries.length}</strong><span>School due dates</span></div>}
      </div>

      <div className="gcLayoutV0103">
        <article className="gcMonthCardV0103">
          <div className="gcMonthNavV0103">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setMonthCursor(new Date(year, month - 1, 1))}
            >‹</button>
            <strong>{monthLabel}</strong>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setMonthCursor(new Date(year, month + 1, 1))}
            >›</button>
          </div>

          <div className="gcWeekdaysV0103">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="gcGridV0103">
            {cells.map((day, index) => {
              if (!day) return <div className="gcDayV0103 empty" key={`empty-${index}`} />
              const dateKey = dateKeyForDay(day)
              const dayEntries = allEntries.filter((entry) => entry.date === dateKey)
              const isToday = dateKey === new Date().toISOString().slice(0, 10)
              return (
                <div className={`gcDayV0103 ${isToday ? 'today' : ''}`} key={dateKey}>
                  <span className="gcDayNumberV0103">{day}</span>
                  <div className="gcDayEntriesV0103">
                    {dayEntries.slice(0, 3).map((entry) => (
                      <span
                        className={`gcDotEntryV0103 ${entry.sourceKind}`}
                        key={entry.id}
                        title={entry.title}
                      >
                        {entry.emoji} {entry.title}
                      </span>
                    ))}
                    {dayEntries.length > 3 && <small>+{dayEntries.length - 3} more</small>}
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        <aside className="gcUpcomingV0103">
          <div className="gcSideHeadingV0103">
            <span className="cgEyebrowV09">COMING UP</span>
            <h3>{contextual ? `Next ${areaTitle.toLowerCase()}` : 'Next on the calendar'}</h3>
          </div>
          {comingUpEntries.length > 0 ? (
            <div className="gcUpcomingListV0103">
              {comingUpEntries.map((entry) => (
                <div className="gcUpcomingItemV0103" key={`upcoming-${entry.id}`}>
                  <span className="gcUpcomingDateV0103">
                    <b>{new Date(`${entry.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short' })}</b>
                    <strong>{Number(entry.date.slice(8, 10))}</strong>
                  </span>
                  <div>
                    <small>{entry.label}</small>
                    <strong>{entry.title}</strong>
                    {entry.startAt && (
                      <span>{new Date(entry.startAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                    )}
                  </div>
                  {entry.sourceKind === 'growth_activity' && (
                    <button type="button" onClick={() => openSchedule(entry.activity)}>Edit</button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="gcEmptyV0103">
              <span>{contextual ? areaEmoji : '🗓️'}</span>
              <strong>Nothing scheduled yet.</strong>
              <p>Save something interesting, then choose a date when your family is ready.</p>
            </div>
          )}
        </aside>
      </div>

      <section className="gcPlanV0103">
        <div className="gcSectionTitleV0103">
          <div>
            <span className="cgEyebrowV09">SAVED TO PLAN</span>
            <h3>{contextual ? 'Things to schedule' : 'Things worth finding time for'}</h3>
          </div>
          <button type="button" onClick={onExplore}>Explore more →</button>
        </div>

        {unscheduledActivities.length > 0 ? (
          <div className="gcPlanGridV0103">
            {unscheduledActivities.map((activity) => (
              <article key={activity.id}>
                <span>{activity.emoji || '🌱'}</span>
                <div>
                  <small>{activity.type === 'local_event' ? 'LOCAL EVENT' : 'ACTIVITY'}</small>
                  <h4>{activity.title}</h4>
                  <p>{activity.provider?.name || activity.location?.city || 'Saved activity'}</p>
                </div>
                <button type="button" onClick={() => openSchedule(activity)}>+ Schedule</button>
              </article>
            ))}
          </div>
        ) : (
          <div className="gcPlanEmptyV0103">
            <span>✨</span>
            <p>No unscheduled activities right now. Explore More can help you find something worth trying.</p>
            <button type="button" onClick={onExplore}>Explore More →</button>
          </div>
        )}
      </section>

      {calendarActivities.length > 0 && (
        <section className="gcManageV0103">
          <div className="gcSectionTitleV0103">
            <div>
              <span className="cgEyebrowV09">MY PLANNED ACTIVITIES</span>
              <h3>Plan → do → notice what you learned</h3>
            </div>
          </div>
          <div className="gcManageListV0103">
            {calendarActivities.map((activity) => (
              <article key={`manage-${activity.id}`}>
                <div className="gcManageMainV0103">
                  <span>{activity.emoji || '🌱'}</span>
                  <div>
                    <small>{formatGrowthActivityStatusV0103(activity.status)}</small>
                    <h4>{activity.title}</h4>
                    <p>{formatGrowthScheduleV0103(activity.schedule)}</p>
                  </div>
                </div>
                <div className="gcManageActionsV0103">
                  <button type="button" onClick={() => openSchedule(activity)}>Edit date</button>
                  {!['attended', 'completed'].includes(activity.status) && (
                    <button
                      type="button"
                      className="primary"
                      onClick={() => onActivityStatus?.(
                        activity.id,
                        activity.type === 'local_event' ? 'attended' : 'completed'
                      )}
                    >
                      {activity.type === 'local_event' ? 'I went' : 'Completed'}
                    </button>
                  )}
                  {['attended', 'completed'].includes(activity.status) && !activity.reflection && (
                    <button type="button" className="primary" onClick={() => openReflection(activity)}>Reflect</button>
                  )}
                  {activity.reflection && <span className="gcReflectedV0103">✓ Reflected</span>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {scheduleTargetId && (
        <div className="gcModalV0103" role="dialog" aria-modal="true" aria-label="Schedule growth activity">
          <form className="gcModalCardV0103" onSubmit={saveSchedule}>
            <span className="cgEyebrowV09">ADD TO CALENDAR</span>
            <h3>When will you do this?</h3>
            <label>
              Date
              <input
                type="date"
                value={scheduleDraft.date}
                onChange={(event) => setScheduleDraft((current) => ({ ...current, date: event.target.value }))}
                required
              />
            </label>
            <label>
              Time <small>(optional)</small>
              <input
                type="time"
                value={scheduleDraft.time}
                onChange={(event) => setScheduleDraft((current) => ({ ...current, time: event.target.value }))}
              />
            </label>
            <label>
              About how long?
              <select
                value={scheduleDraft.durationMinutes}
                onChange={(event) => setScheduleDraft((current) => ({ ...current, durationMinutes: event.target.value }))}
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
              </select>
            </label>
            <div className="gcModalActionsV0103">
              <button type="button" onClick={() => setScheduleTargetId(null)}>Cancel</button>
              <button type="submit" className="primary">Save to calendar</button>
            </div>
          </form>
        </div>
      )}

      {reflectionTargetId && (
        <div className="gcModalV0103" role="dialog" aria-modal="true" aria-label="Reflect on growth activity">
          <form className="gcModalCardV0103 gcReflectionV0103" onSubmit={saveReflection}>
            <span className="cgEyebrowV09">NOTICE WHAT HAPPENED</span>
            <h3>How did it feel?</h3>
            <div className="gcEnjoymentV0103">
              {[
                ['loved_it', '😍 Loved it'],
                ['liked_it', '🙂 Liked it'],
                ['okay', '😐 It was okay'],
                ['not_for_me', '🙃 Not for me'],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={activityReflection.enjoyment === value ? 'active' : ''}
                  onClick={() => setActivityReflection((current) => ({ ...current, enjoyment: value }))}
                >
                  {label}
                </button>
              ))}
            </div>
            <label>
              Favorite part
              <input
                value={activityReflection.favoritePart}
                onChange={(event) => setActivityReflection((current) => ({ ...current, favoritePart: event.target.value }))}
                placeholder="What stood out?"
              />
            </label>
            <label>
              What did you notice or learn?
              <textarea
                value={activityReflection.learned}
                onChange={(event) => setActivityReflection((current) => ({ ...current, learned: event.target.value }))}
                placeholder="A new idea, skill, question, or surprise..."
              />
            </label>
            <label>
              Would you do something like this again?
              <select
                value={activityReflection.wouldDoAgain}
                onChange={(event) => setActivityReflection((current) => ({ ...current, wouldDoAgain: event.target.value }))}
              >
                <option value="">Not sure yet</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label>
              What would you like to try next? <small>(optional)</small>
              <input
                value={activityReflection.wantsNext}
                onChange={(event) => setActivityReflection((current) => ({ ...current, wantsNext: event.target.value }))}
              />
            </label>
            <div className="gcModalActionsV0103">
              <button type="button" onClick={() => setReflectionTargetId(null)}>Not now</button>
              <button type="submit" className="primary" disabled={!activityReflection.enjoyment}>Save reflection</button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}

function formatGrowthActivityStatusV0103(status) {
  return ({
    saved: 'Saved',
    scheduled: 'Scheduled',
    in_progress: 'In progress',
    completed: 'Completed',
    attended: 'Attended',
    skipped: 'Skipped',
    cancelled: 'Cancelled',
  }[status] || 'My Growth')
}

function formatGrowthScheduleV0103(schedule) {
  if (!schedule?.date && !schedule?.startAt) return 'Not scheduled'
  const dateValue = schedule.date || schedule.startAt.slice(0, 10)
  const dateLabel = new Date(`${dateValue}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  if (!schedule.startAt) return dateLabel
  const timeLabel = new Date(schedule.startAt).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${dateLabel} · ${timeLabel}`
}


export default GrowthHome
