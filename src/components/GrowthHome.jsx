import {
  useState,
} from 'react'

import './GrowthHome.css'


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
            <strong>
              Career & Growth
            </strong>

            <small>
              Grow into you.
            </small>
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

          <button
            onClick={onDiscover}
          >
            Discover
          </button>

          <button
            onClick={onExplore}
          >
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
              <strong>
                {childName}
              </strong>

              <small>
                Age {childProfile?.age}
              </small>
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

                <strong>
                  View profile →
                </strong>
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
                    Let's discover what
                    feels like you.
                  </h2>

                  <p>
                    A few simple questions
                    give us our first clues
                    about what you enjoy,
                    how you think, and what
                    makes you curious.
                  </p>
                </div>

                <button
                  className="growthPrimaryButtonV06"
                  onClick={onDiscover}
                >
                  Discover Me
                  <span>→</span>
                </button>
              </section>
            )}


            {completedJourneyInsight && (
              <PostReflectionInsight
                insight={
                  completedJourneyInsight
                }
                nextRecommendation={
                  topRecommendation
                }
                onAddNext={onStartGrow}
                onDismiss={
                  onDismissJourneyInsight
                }
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
                            <h3>
                              {currentJourney.title}
                            </h3>

                            <span>
                              {currentJourney
                                .progress
                                ?.percent || 0}
                              %
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
                            Continue
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="focusEmptyV06">
                        <span>
                          🛤️
                        </span>

                        <div>
                          <strong>
                            Nothing in progress yet.
                          </strong>

                          <p>
                            Pick an experience and it
                            will become part of your Journey.
                          </p>
                        </div>

                        <button
                          className="growthPrimaryButtonV06"
                          onClick={onExplore}
                        >
                          Find an Experience
                          <span>→</span>
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
                          <h3>
                            {topRecommendation.title}
                          </h3>

                          <p>
                            {topRecommendation
                              .reasons?.[0] ||
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
                            Explore This
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mutedCopyV06">
                        Recommendations will
                        appear as we learn more
                        about you.
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
                          {secondaryRecommendation.emoji ||
                            '🌱'}
                        </span>

                        <span>
                          <strong>
                            {secondaryRecommendation.title}
                          </strong>

                          <small>
                            Another idea worth trying
                          </small>
                        </span>

                        <span>
                          →
                        </span>
                      </button>
                    )}
                  </article>

                </section>


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
                          Keep exploring to reveal
                          more patterns.
                        </span>
                      )}
                    </div>

                    {strongestDomains.length > 0 && (
                      <div className="domainLineV06">
                        <span>
                          Curiosity:
                        </span>

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
                        <strong>
                          {journeyItems.length}
                        </strong>

                        <span>
                          Journey items
                        </span>
                      </div>

                      <div>
                        <strong>
                          {completedJourneyItems.length +
                            completedExplorations.length}
                        </strong>

                        <span>
                          Experiences tried
                        </span>
                      </div>

                      <div>
                        <strong>
                          {evidenceEventCount}
                        </strong>

                        <span>
                          Clues learned
                        </span>
                      </div>
                    </div>
                  </article>


                  <article className="studentVoiceV06">
                    <span className="growthKickerV06">
                      YOUR VOICE
                    </span>

                    <h2>
                      What sounds interesting
                      to you?
                    </h2>

                    <p>
                      You don't have to wait
                      for a recommendation.
                    </p>

                    <form
                      className="studentIdeaFormV06"
                      onSubmit={
                        handleStudentIdeaSubmit
                      }
                    >
                      <input
                        type="text"
                        value={studentIdea}
                        onChange={(event) =>
                          setStudentIdea(
                            event.target.value
                          )
                        }
                        placeholder="I want to..."
                        aria-label="What do you want to try?"
                      />

                      <button
                        type="submit"
                        disabled={
                          !studentIdea.trim()
                        }
                      >
                        →
                      </button>
                    </form>

                    {latestStudentIntent && (
                      <div className="latestIdeaV06">
                        <span>
                          You told us
                        </span>

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
  const reflection =
    insight?.reflection || {}

  const item =
    insight?.journeyItem

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
    enjoymentLabels[
      reflection.enjoyment
    ]
  ) {
    learningPoints.push(
      enjoymentLabels[
        reflection.enjoyment
      ]
    )
  }

  if (
    reflection.favoritePart
      ?.trim()
  ) {
    learningPoints.push(
      `Favorite: “${reflection.favoritePart.trim()}”`
    )
  }

  if (
    reflection.wouldDoAgain ===
    true
  ) {
    learningPoints.push(
      'You would try something like this again.'
    )
  }

  if (
    reflection.wouldDoAgain ===
    false
  ) {
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
          We learned something new
          from {item?.title || 'this experience'}.
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
              onAddNext?.(
                nextRecommendation
              )
            }
          >
            Try Next Idea
            <span>→</span>
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
      setReflectingJourneyId(
        journeyId
      )

      setReflectionDraft({
        enjoyment: null,
        favoritePart: '',
        difficultPart: '',
        wouldDoAgain: null,
        wantsNext: '',
      })
    }

  const cancelReflection =
    () =>
      setReflectingJourneyId(
        null
      )

  const submitReflection =
    (
      event,
      journeyId
    ) => {
      event.preventDefault()

      if (
        reflectionDraft.enjoyment ===
          null ||
        reflectionDraft.wouldDoAgain ===
          null
      ) {
        return
      }

      onCompleteJourney?.(
        journeyId,
        reflectionDraft
      )

      setReflectingJourneyId(
        null
      )
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
            <strong>
              {activeItems.length}
            </strong>

            <span>
              In progress
            </span>
          </div>

          <div>
            <strong>
              {completedItems.length}
            </strong>

            <span>
              Completed
            </span>
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
              What I'm doing now
            </h2>
          </div>

          <button
            className="textActionV06"
            onClick={onHome}
          >
            Back to Home →
          </button>
        </div>

        {activeItems.length === 0 ? (
          <div className="journeyEmptyV06">
            <span>
              🌱
            </span>

            <div>
              <strong>
                Your Journey is ready.
              </strong>

              <p>
                Choose an idea from Home
                or Explore and it will
                show up here.
              </p>
            </div>

            <button
              className="growthPrimaryButtonV06"
              onClick={onHome}
            >
              Find an Experience
              <span>→</span>
            </button>
          </div>
        ) : (
          <div className="journeyActiveListV06">

            {activeItems.map(
              (item) => {
                const progress =
                  item.progress?.percent ||
                  0

                const isReflecting =
                  reflectingJourneyId ===
                  item.id

                return (
                  <article
                    className="journeyCardV06"
                    key={item.id}
                  >

                    <div className="journeyCardTopV06">
                      <div className="journeyCardIdentityV06">
                        <div className="journeyCardEmojiV06">
                          {item.emoji}
                        </div>

                        <div>
                          <span className="growthKickerV06">
                            IN MY JOURNEY
                          </span>

                          <h3>
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      <span className="journeyStatusV06">
                        {progress > 0
                          ? `${progress}% complete`
                          : 'Just started'}
                      </span>
                    </div>

                    <p className="journeyDescriptionV06">
                      {item.description ||
                        'You chose this experience. Your Journey will keep track of what happens next.'}
                    </p>

                    <JourneyProgress
                      progress={progress}
                      onChange={(percent) =>
                        onJourneyProgress?.(
                          item.id,
                          percent
                        )
                      }
                    />

                    {!isReflecting ? (
                      <div className="journeyCardFooterV06">
                        <button
                          className="growthPrimaryButtonV06"
                          onClick={() =>
                            beginReflection(
                              item.id
                            )
                          }
                        >
                          Complete & Reflect
                          <span>→</span>
                        </button>

                        <span>
                          Started{' '}
                          {formatJourneyDate(
                            item.startedAt
                          )}
                        </span>
                      </div>
                    ) : (
                      <JourneyReflectionForm
                        childName={childName}
                        draft={
                          reflectionDraft
                        }
                        setDraft={
                          setReflectionDraft
                        }
                        onCancel={
                          cancelReflection
                        }
                        onSubmit={(event) =>
                          submitReflection(
                            event,
                            item.id
                          )
                        }
                      />
                    )}

                  </article>
                )
              }
            )}

          </div>
        )}
      </section>


      <details className="journeyHistoryV06">
        <summary>
          Things I've Tried
          <span>
            {completedItems.length}
          </span>
        </summary>

        {completedItems.length === 0 ? (
          <p className="mutedCopyV06">
            Completed experiences will
            collect here over time.
          </p>
        ) : (
          <div className="journeyHistoryListV06">

            {completedItems.map(
              (item) => (
                <article
                  className="journeyHistoryItemV06"
                  key={item.id}
                >
                  <span>
                    {item.emoji}
                  </span>

                  <div>
                    <div className="historyTitleRowV06">
                      <strong>
                        {item.title}
                      </strong>

                      <small>
                        {formatJourneyDate(
                          item.completedAt
                        )}
                      </small>
                    </div>

                    {item.reflection
                      ?.favoritePart && (
                      <p>
                        “{item.reflection.favoritePart}”
                      </p>
                    )}
                  </div>
                </article>
              )
            )}

          </div>
        )}
      </details>

    </div>
  )
}


function JourneyProgress({
  progress = 0,
  onChange,
}) {
  const steps = [
    {
      value: 25,
      label: 'Just started',
    },
    {
      value: 50,
      label: 'Making progress',
    },
    {
      value: 75,
      label: 'Almost there',
    },
  ]

  return (
    <div className="journeyProgressV06">

      <div className="journeyProgressTopV06">
        <div>
          <strong>
            How's it going?
          </strong>

          <span>
            Choose the step that feels closest.
          </span>
        </div>

        <strong>
          {progress}%
        </strong>
      </div>

      <div className="journeyProgressTrackV06">
        <div
          style={{
            width:
              `${progress}%`,
          }}
        />
      </div>

      <div className="journeyProgressChoicesV06">
        {steps.map(
          (step) => (
            <button
              type="button"
              key={step.value}
              className={
                progress === step.value
                  ? 'active'
                  : ''
              }
              onClick={() =>
                onChange?.(
                  step.value
                )
              }
            >
              {step.label}
            </button>
          )
        )}
      </div>

    </div>
  )
}


function JourneyReflectionForm({
  childName,
  draft,
  setDraft,
  onCancel,
  onSubmit,
}) {
  const updateDraft =
    (
      key,
      value
    ) =>
      setDraft(
        (current) => ({
          ...current,
          [key]: value,
        })
      )

  const ready =
    draft.enjoyment !== null &&
    draft.wouldDoAgain !== null

  return (
    <form
      className="journeyReflectionV06"
      onSubmit={onSubmit}
    >

      <div>
        <span className="growthKickerV06">
          QUICK REFLECTION
        </span>

        <h4>
          What did you notice,
          {` ${childName}`}?
        </h4>
      </div>

      <ReflectionChoice
        label="How much did you enjoy it?"
        options={[
          [
            'not_for_me',
            '😕 Not for me',
          ],
          [
            'okay',
            '🙂 It was okay',
          ],
          [
            'liked_it',
            '😄 I liked it',
          ],
          [
            'loved_it',
            '🤩 I loved it',
          ],
        ]}
        value={
          draft.enjoyment
        }
        onChange={(value) =>
          updateDraft(
            'enjoyment',
            value
          )
        }
      />

      <div className="reflectionTextGridV06">
        <ReflectionText
          label="Favorite part"
          value={
            draft.favoritePart
          }
          placeholder="I liked..."
          onChange={(value) =>
            updateDraft(
              'favoritePart',
              value
            )
          }
        />

        <ReflectionText
          label="Hard part"
          value={
            draft.difficultPart
          }
          placeholder="The hard part was..."
          onChange={(value) =>
            updateDraft(
              'difficultPart',
              value
            )
          }
        />
      </div>

      <ReflectionChoice
        label="Would you do something like this again?"
        options={[
          [
            true,
            '👍 Yes',
          ],
          [
            false,
            '👎 Probably not',
          ],
        ]}
        value={
          draft.wouldDoAgain
        }
        onChange={(value) =>
          updateDraft(
            'wouldDoAgain',
            value
          )
        }
      />

      <ReflectionText
        label="Anything you want to try next?"
        value={
          draft.wantsNext
        }
        placeholder="Next I want to..."
        onChange={(value) =>
          updateDraft(
            'wantsNext',
            value
          )
        }
      />

      <div className="reflectionActionsV06">
        <button
          type="submit"
          className="growthPrimaryButtonV06"
          disabled={!ready}
        >
          Complete Reflection
          <span>→</span>
        </button>

        <button
          type="button"
          className="textActionV06"
          onClick={onCancel}
        >
          Keep working on it
        </button>
      </div>

    </form>
  )
}


function ReflectionChoice({
  label,
  options,
  value,
  onChange,
}) {
  return (
    <div className="reflectionFieldV06">
      <strong>
        {label}
      </strong>

      <div className="reflectionChoicesV06">
        {options.map(
          (
            [
              optionValue,
              optionLabel,
            ]
          ) => (
            <button
              type="button"
              key={
                String(
                  optionValue
                )
              }
              className={
                value === optionValue
                  ? 'active'
                  : ''
              }
              onClick={() =>
                onChange(
                  optionValue
                )
              }
            >
              {optionLabel}
            </button>
          )
        )}
      </div>
    </div>
  )
}


function ReflectionText({
  label,
  value,
  placeholder,
  onChange,
}) {
  return (
    <label className="reflectionFieldV06">
      <strong>
        {label}
      </strong>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />
    </label>
  )
}


function formatJourneyDate(
  value
) {
  if (!value) {
    return 'recently'
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
    }
  ).format(
    new Date(value)
  )
}


export default GrowthHome
