import {
  useState,
} from 'react'

import './GrowthHome.css'
import './ExperienceResearchPanel.css'
import './JourneyPolish.css'

import ExperienceResearchPanel from './ExperienceResearchPanel'


function GrowthHome({
  activeView = 'home',
  childProfile,
  discoveryComplete = false,
  completedExplorations = [],
  evidenceEventCount = 0,
  growthProfile = null,
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

function JourneyPanel({
  childName,
  journeyItems = [],
  onHome,
  onJourneyProgress,
  onCompleteJourney,
}) {
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

  const activeItems =
    journeyItems
      .filter(
        (item) =>
          item.status !== 'completed'
      )
      .sort(
        (a, b) =>
          new Date(b.startedAt) -
          new Date(a.startedAt)
      )

  const completedItems =
    journeyItems
      .filter(
        (item) =>
          item.status === 'completed'
      )
      .sort(
        (a, b) =>
          new Date(b.completedAt) -
          new Date(a.completedAt)
      )

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

      <section className="journeySectionV06">
        <div className="journeySectionHeadingV06">
          <div>
            <span className="growthKickerV06">
              IN PROGRESS
            </span>
            <h2>
              Keep going
            </h2>
          </div>
        </div>

        {activeItems.length > 0 ? (
          <div className="journeyListV06">
            {activeItems.map(
              (item) => (
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
            )}
          </div>
        ) : (
          <div className="journeyEmptyV06">
            <span>🌱</span>
            <h3>
              Nothing in progress right now.
            </h3>
            <p>
              Pick a new experience from Home or Explore
              when you're ready.
            </p>
            <button
              className="growthPrimaryButtonV06"
              onClick={onHome}
            >
              Back Home
            </button>
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
                What you've tried
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

                    <div className="journeyCompletedReflectionV07">
                      <span>
                        YOUR REFLECTION
                      </span>

                      <p>
                        {item.reflection?.favoritePart
                          ? `“${item.reflection.favoritePart}”`
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
