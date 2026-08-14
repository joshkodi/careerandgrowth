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

  const topRecommendation =
    recommendations?.[0] || null

  const secondaryRecommendations =
    recommendations?.slice(1, 3) || []

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
    <div className="growthHomeV05">

      <header className="growthAppHeader">
        <button
          type="button"
          className="growthBrandButton"
          onClick={onHome}
        >
          <span className="growthBrandMarkV05">🌱</span>
          <span className="growthBrandCopy">
            <strong>Career & Growth</strong>
            <small>Grow into you.</small>
          </span>
        </button>

        <nav className="growthTopNav" aria-label="Primary">
          <button
            className={activeView === 'home' ? 'active' : ''}
            onClick={onHome}
          >
            Home
          </button>
          <button onClick={onDiscover}>Discover</button>
          <button onClick={onExplore}>Explore</button>
          <button
            className={activeView === 'journey' ? 'active' : ''}
            onClick={onJourney}
          >
            Journey
            {activeJourneyItems.length > 0 && (
              <span className="navCount">
                {activeJourneyItems.length}
              </span>
            )}
          </button>
        </nav>

        <div className="growthHeaderActions">
          <button
            className="parentViewLink"
            onClick={onParentPerspective}
          >
            Parent view
          </button>

          <button
            className="childMenuButton"
            onClick={onGrowthProfile}
            title="Open growth profile"
          >
            <span className="childAvatarV05">
              {childName.charAt(0).toUpperCase()}
            </span>
            <span className="childMenuCopy">
              <strong>{childName}</strong>
              <small>
                Age {childProfile?.age}
              </small>
            </span>
            <span className="childMenuChevron">⌄</span>
          </button>
        </div>
      </header>


      <main className="growthWorkspaceV05">
        {activeView === 'journey' ? (
          <JourneyPanel
            childName={childName}
            journeyItems={journeyItems}
            onHome={onHome}
            onJourneyProgress={onJourneyProgress}
            onCompleteJourney={onCompleteJourney}
          />
        ) : (
          <>
            <section className="growthPageIntro">
              <div>
                <p className="growthKicker">MY GROWTH SPACE</p>
                <h1>{childName}'s Growth Space</h1>
                <p>
                  See what you're discovering, exploring, and growing.
                </p>
              </div>

              <div className="growthIntroStatus">
                <span className="statusDot" />
                <span>
                  {growthProfile
                    ? 'Your profile is evolving'
                    : 'Your profile is getting started'}
                </span>
              </div>
            </section>


            {!discoveryComplete && (
              <section className="discoveryStartBanner">
                <div className="bannerIcon">🧭</div>
                <div className="bannerCopy">
                  <span className="growthKicker">START HERE</span>
                  <h2>Let's discover what makes you, you.</h2>
                  <p>
                    A few simple questions will give us our first clues about
                    what you enjoy, how you think, and what makes you curious.
                  </p>
                </div>
                <button
                  className="growthPrimaryButton"
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
                <section className="growthDashboardGrid">

                  <article className="dashboardPanel identityPanel">
                    <div className="panelHeaderRow">
                      <div>
                        <span className="growthKicker">WHO I'M BECOMING</span>
                        <h2>What we're noticing about you</h2>
                      </div>
                      <button
                        className="panelTextAction"
                        onClick={onGrowthProfile}
                      >
                        View profile →
                      </button>
                    </div>

                    {strongestTraits.length > 0 ? (
                      <div className="traitChipList">
                        {strongestTraits.map((trait) => (
                          <span className="traitChip" key={trait.id}>
                            {trait.emoji && <span>{trait.emoji}</span>}
                            {trait.label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="panelEmptyCopy">
                        Your first discoveries will start shaping this space.
                      </p>
                    )}

                    {strongestDomains.length > 0 && (
                      <div className="domainLine">
                        <span>Exploring:</span>
                        <strong>
                          {strongestDomains
                            .map((domain) => domain.label)
                            .join(' · ')}
                        </strong>
                      </div>
                    )}

                    <p className="panelFootnote">
                      These are clues, not labels. They can change as you grow.
                    </p>
                  </article>


                  <article className="dashboardPanel journeyPanelPreview">
                    <div className="panelHeaderRow">
                      <div>
                        <span className="growthKicker">MY JOURNEY</span>
                        <h2>What you're doing now</h2>
                      </div>
                      <button
                        className="panelTextAction"
                        onClick={onJourney}
                      >
                        Open Journey →
                      </button>
                    </div>

                    {activeJourneyItems.length > 0 ? (
                      <div className="currentJourneyCard">
                        <div className="currentJourneyIcon">
                          {activeJourneyItems[0].emoji || '🌱'}
                        </div>
                        <div className="currentJourneyCopy">
                          <strong>{activeJourneyItems[0].title}</strong>
                          <p>
                            {activeJourneyItems[0].description ||
                              'Keep moving this experience forward and tell us what you learn.'}
                          </p>
                          <div className="miniProgressTrack">
                            <div
                              className="miniProgressBar"
                              style={{
                                width: `${activeJourneyItems[0].progress?.percent || 0}%`,
                              }}
                            />
                          </div>
                          <small>
                            {activeJourneyItems[0].progress?.percent || 0}% complete
                          </small>
                        </div>
                      </div>
                    ) : (
                      <div className="journeyEmptyState">
                        <span>🛤️</span>
                        <div>
                          <strong>Your Journey is ready.</strong>
                          <p>
                            Add an idea below and it will become part of what
                            you're actually trying and learning.
                          </p>
                        </div>
                      </div>
                    )}
                  </article>
                </section>


                <section className="ideasSectionV05">
                  <div className="sectionTitleRowV05">
                    <div>
                      <span className="growthKicker">IDEAS FOR YOU</span>
                      <h2>What could you explore next?</h2>
                    </div>
                    <button
                      className="panelTextAction"
                      onClick={onExplore}
                    >
                      See all experiences →
                    </button>
                  </div>

                  <div className="ideasGridV05">
                    <article className="featuredIdeaCard">
                      <div className="ideaCardTop">
                        <div className="ideaIconV05">
                          {topRecommendation?.emoji || '✨'}
                        </div>
                        <span className="ideaBadge">PICKED FOR YOU</span>
                      </div>

                      <h3>
                        {topRecommendation?.title || 'Your next idea will appear here'}
                      </h3>

                      <p>
                        {topRecommendation
                          ? topRecommendation.reasons?.[0] ||
                            'This fits patterns we are starting to notice about you.'
                          : 'As we learn more about you, we will suggest experiences worth trying.'}
                      </p>

                      <button
                        className="growthPrimaryButton"
                        disabled={!topRecommendation}
                        onClick={() => onStartGrow?.(topRecommendation)}
                      >
                        Explore this idea <span>→</span>
                      </button>
                    </article>

                    <div className="secondaryIdeasColumn">
                      {secondaryRecommendations.length > 0 ? (
                        secondaryRecommendations.map((recommendation) => (
                          <article
                            className="secondaryIdeaCard"
                            key={recommendation.experienceId}
                          >
                            <div className="secondaryIdeaIcon">
                              {recommendation.emoji || '🌱'}
                            </div>
                            <div>
                              <h3>{recommendation.title}</h3>
                              <p>
                                {recommendation.reasons?.[0] ||
                                  'A different way to follow your curiosity.'}
                              </p>
                              <button
                                className="panelTextAction"
                                onClick={() => onStartGrow?.(recommendation)}
                              >
                                Explore idea →
                              </button>
                            </div>
                          </article>
                        ))
                      ) : (
                        <article className="secondaryIdeaCard mutedIdeaCard">
                          <div className="secondaryIdeaIcon">🔎</div>
                          <div>
                            <h3>Try something different</h3>
                            <p>
                              Browse Explore when you want to choose something
                              outside your current recommendations.
                            </p>
                            <button
                              className="panelTextAction"
                              onClick={onExplore}
                            >
                              Browse Explore →
                            </button>
                          </div>
                        </article>
                      )}
                    </div>
                  </div>
                </section>


                <section className="growthBottomGrid">
                  <article className="dashboardPanel growingPanel">
                    <div className="panelHeaderRow">
                      <div>
                        <span className="growthKicker">HOW I'M GROWING</span>
                        <h2>Your story is taking shape</h2>
                      </div>
                    </div>

                    <div className="growthSignalRowV05">
                      {strongestTraits.length > 0 ? (
                        strongestTraits.slice(0, 4).map((trait) => (
                          <div className="growthSignalMini" key={trait.id}>
                            <span>{trait.emoji || '🌱'}</span>
                            <div>
                              <strong>{trait.label}</strong>
                              <small>Growing ↑</small>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="panelEmptyCopy">
                          Complete Discovery and experiences to see growth clues here.
                        </p>
                      )}
                    </div>

                    <div className="growthMetricStrip">
                      <div>
                        <strong>{journeyItems.length}</strong>
                        <span>Journey items</span>
                      </div>
                      <div>
                        <strong>{completedJourneyItems.length + completedExplorations.length}</strong>
                        <span>Experiences tried</span>
                      </div>
                      <div>
                        <strong>{evidenceEventCount}</strong>
                        <span>Clues learned</span>
                      </div>
                    </div>
                  </article>


                  <article className="dashboardPanel ideaInputPanel">
                    <span className="growthKicker">YOUR VOICE</span>
                    <h2>What sounds interesting to you?</h2>
                    <p>
                      You do not have to wait for a recommendation. Tell us
                      what you want to try and we will remember it.
                    </p>

                    <form
                      className="studentIdeaFormV05"
                      onSubmit={handleStudentIdeaSubmit}
                    >
                      <input
                        type="text"
                        value={studentIdea}
                        onChange={(event) => setStudentIdea(event.target.value)}
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
                      <div className="latestIdeaNote">
                        <span>You told us</span>
                        <strong>“{latestStudentIntent.text}”</strong>
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
// POST-REFLECTION — WHAT WE LEARNED
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
      'You found some value in it, even if it was not a favorite.',

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
      `You especially liked: “${reflection.favoritePart.trim()}”`
    )
  }

  if (
    reflection.difficultPart
      ?.trim()
  ) {
    learningPoints.push(
      `You noticed a challenge: “${reflection.difficultPart.trim()}”`
    )
  }

  if (
    reflection.wouldDoAgain ===
    true
  ) {
    learningPoints.push(
      'You would like to do something like this again.'
    )
  }

  if (
    reflection.wouldDoAgain ===
    false
  ) {
    learningPoints.push(
      'You would rather explore something different next.'
    )
  }

  if (
    reflection.wantsNext
      ?.trim()
  ) {
    learningPoints.push(
      `You told us what you want next: “${reflection.wantsNext.trim()}”`
    )
  }


  return (
    <section
      style={{
        marginBottom: '30px',
        padding: '28px',
        border:
          '1px solid #dfe8df',
        borderRadius: '22px',
        background:
          'linear-gradient(135deg, #f0f8f1, #fbfaf1)',
      }}
    >

      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          gap: '24px',
          alignItems:
            'flex-start',
        }}
      >

        <div
          style={{
            maxWidth: '720px',
          }}
        >

          <span className="growthEyebrow">
            WHAT WE LEARNED
          </span>

          <h2
            style={{
              margin:
                '7px 0 8px',
            }}
          >
            Your Journey taught us
            something new.
          </h2>

          <p
            style={{
              margin: 0,
              color: '#6f7b73',
              fontSize: '12px',
              lineHeight: 1.6,
            }}
          >
            Completing{' '}
            <strong>
              {item?.title ||
                'this experience'}
            </strong>{' '}
            added new clues to your
            Growth Profile.
          </p>

        </div>

        <div
          aria-hidden="true"
          style={{
            width: '58px',
            height: '58px',
            flex:
              '0 0 58px',
            display: 'grid',
            placeItems:
              'center',
            borderRadius:
              '18px',
            background:
              '#ffffff',
            fontSize:
              '28px',
          }}
        >
          ✨
        </div>

      </div>


      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px',
          marginTop: '20px',
        }}
      >

        {learningPoints.map(
          (
            point,
            index
          ) => (
            <div
              key={index}
              style={{
                padding:
                  '13px 14px',
                borderRadius:
                  '13px',
                background:
                  '#ffffff',
                color:
                  '#4f5d54',
                fontSize:
                  '11px',
                fontWeight:
                  650,
                lineHeight:
                  1.5,
              }}
            >
              {point}
            </div>
          )
        )}

      </div>


      <div
        style={{
          marginTop: '22px',
          paddingTop: '20px',
          borderTop:
            '1px solid #dce6dc',
        }}
      >

        <span className="growthEyebrow">
          WHAT MIGHT BE NEXT
        </span>

        {nextRecommendation ? (
          <div
            style={{
              marginTop:
                '10px',
              padding:
                '18px',
              borderRadius:
                '16px',
              background:
                '#ffffff',
            }}
          >

            <div
              style={{
                display: 'flex',
                gap: '13px',
                alignItems:
                  'flex-start',
              }}
            >

              <div className="nextGrowIcon">
                {
                  nextRecommendation
                    .emoji
                }
              </div>

              <div
                style={{
                  flex: 1,
                }}
              >
                <span className="growthEyebrow">
                  RECOMMENDED NEXT
                </span>

                <h3
                  style={{
                    margin:
                      '5px 0 7px',
                  }}
                >
                  {
                    nextRecommendation
                      .title
                  }
                </h3>

                {nextRecommendation
                  .reasons
                  ?.slice(0, 2)
                  .map(
                    (
                      reason,
                      index
                    ) => (
                      <p
                        key={index}
                        style={{
                          margin:
                            '4px 0',
                          color:
                            '#758078',
                          fontSize:
                            '10px',
                          lineHeight:
                            1.45,
                        }}
                      >
                        • {reason}
                      </p>
                    )
                  )}
              </div>

            </div>


            <button
              className="growthPrimaryButton"
              style={{
                marginTop:
                  '15px',
              }}
              onClick={() =>
                onAddNext?.(
                  nextRecommendation
                )
              }
            >
              Add to My Journey
              <span>→</span>
            </button>

          </div>
        ) : (
          <p
            style={{
              color: '#758078',
              fontSize: '11px',
            }}
          >
            Keep exploring. We'll use
            what we learned to shape
            future recommendations.
          </p>
        )}

      </div>


      <button
        type="button"
        className="growthTextButton"
        style={{
          marginTop: '15px',
        }}
        onClick={onDismiss}
      >
        Continue to Home
      </button>

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
  const [reflectingJourneyId, setReflectingJourneyId] = useState(null)
  const [reflectionDraft, setReflectionDraft] = useState({
    enjoyment: null,
    favoritePart: '',
    difficultPart: '',
    wouldDoAgain: null,
    wantsNext: '',
  })

  const activeItems = journeyItems
    .filter((item) => item.status !== 'completed')
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))

  const completedItems = journeyItems
    .filter((item) => item.status === 'completed')
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

  const beginReflection = (journeyId) => {
    setReflectingJourneyId(journeyId)
    setReflectionDraft({
      enjoyment: null,
      favoritePart: '',
      difficultPart: '',
      wouldDoAgain: null,
      wantsNext: '',
    })
  }

  const cancelReflection = () => setReflectingJourneyId(null)

  const submitReflection = (event, journeyId) => {
    event.preventDefault()
    if (reflectionDraft.enjoyment === null || reflectionDraft.wouldDoAgain === null) return
    onCompleteJourney?.(journeyId, reflectionDraft)
    setReflectingJourneyId(null)
  }

  return (
    <div className="journeyV05">
      <section className="journeyHero">
        <div>
          <span className="growthEyebrow">MY JOURNEY</span>
          <h1>{childName}, this is what you're growing through.</h1>
          <p>
            Keep track of what you try, how it is going, and what each
            experience teaches you about yourself.
          </p>
        </div>
        <div className="journeyHeroStats" aria-label="Journey summary">
          <div><strong>{activeItems.length}</strong><span>In progress</span></div>
          <div><strong>{completedItems.length}</strong><span>Completed</span></div>
        </div>
      </section>

      <section className="journeySection">
        <div className="journeySectionHeading">
          <div>
            <span className="growthEyebrow">IN PROGRESS</span>
            <h2>What I'm doing now</h2>
            <p>Small steps count. Update your progress whenever something changes.</p>
          </div>
          <button className="growthTextButton" onClick={onHome}>Back to Home →</button>
        </div>

        {activeItems.length === 0 ? (
          <div className="journeyEmpty">
            <div className="journeyEmptyIcon">🌱</div>
            <div>
              <span className="growthEyebrow">READY WHEN YOU ARE</span>
              <h3>Your Journey is ready for something new.</h3>
              <p>Choose an idea from Home or Explore and it will show up here.</p>
            </div>
            <button className="growthPrimaryButton" onClick={onHome}>Find an Experience <span>→</span></button>
          </div>
        ) : (
          <div className="journeyActiveList">
            {activeItems.map((item) => {
              const progress = item.progress?.percent || 0
              const isReflecting = reflectingJourneyId === item.id
              return (
                <article className="journeyActiveCard" key={item.id}>
                  <div className="journeyCardHeader">
                    <div className="journeyCardIdentity">
                      <div className="journeyCardEmoji">{item.emoji}</div>
                      <div>
                        <span className="growthEyebrow">IN MY JOURNEY</span>
                        <h3>{item.title}</h3>
                      </div>
                    </div>
                    <span className="journeyStatusPill">{progress > 0 ? `${progress}% complete` : 'Just started'}</span>
                  </div>

                  <p className="journeyCardDescription">
                    {item.description || 'You chose this experience. Your Journey will keep track of what happens next.'}
                  </p>

                  <JourneyProgress progress={progress} onChange={(percent) => onJourneyProgress?.(item.id, percent)} />

                  {item.recommendationContext?.reasons?.length > 0 && (
                    <div className="journeyWhy">
                      <span>✨</span>
                      <div>
                        <strong>Why this became part of your Journey</strong>
                        {item.recommendationContext.reasons.slice(0, 2).map((reason, index) => (
                          <p key={index}>{reason}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isReflecting ? (
                    <div className="journeyCardFooter">
                      <button className="growthPrimaryButton" onClick={() => beginReflection(item.id)}>
                        Complete & Reflect <span>→</span>
                      </button>
                      <span>Started {formatJourneyDate(item.startedAt)}</span>
                    </div>
                  ) : (
                    <JourneyReflectionForm
                      childName={childName}
                      draft={reflectionDraft}
                      setDraft={setReflectionDraft}
                      onCancel={cancelReflection}
                      onSubmit={(event) => submitReflection(event, item.id)}
                    />
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="journeySection journeyHistorySection">
        <div className="journeySectionHeading">
          <div>
            <span className="growthEyebrow">THINGS I'VE TRIED</span>
            <h2>My experience history</h2>
            <p>Completed experiences become clues about what energizes you, challenges you, and what you may want next.</p>
          </div>
        </div>

        {completedItems.length === 0 ? (
          <div className="journeyHistoryEmpty">Your completed experiences will collect here over time.</div>
        ) : (
          <div className="journeyHistoryList">
            {completedItems.map((item) => (
              <article className="journeyHistoryItem" key={item.id}>
                <div className="journeyHistoryEmoji">{item.emoji}</div>
                <div className="journeyHistoryBody">
                  <div className="journeyHistoryTitleRow">
                    <h3>{item.title}</h3>
                    <span>Completed {formatJourneyDate(item.completedAt)}</span>
                  </div>
                  {item.reflection?.favoritePart && <p>“{item.reflection.favoritePart}”</p>}
                  <div className="journeyLearningChips">
                    {item.reflection?.enjoyment && <span>{formatEnjoyment(item.reflection.enjoyment)}</span>}
                    {item.reflection?.wouldDoAgain === true && <span>Would do something like this again</span>}
                    {item.reflection?.wouldDoAgain === false && <span>Ready to try something different</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="journeyLearningNote">
        <div className="journeyLearningIcon">✨</div>
        <div>
          <span className="growthEyebrow">WHAT I'M LEARNING ABOUT MYSELF</span>
          <h2>Your Journey is more than a list of activities.</h2>
          <p>
            Progress and reflections become new clues in your Growth Profile, helping Career & Growth make better suggestions as you keep exploring.
          </p>
        </div>
      </section>
    </div>
  )
}

function JourneyProgress({ progress = 0, onChange }) {
  const steps = [
    { value: 25, label: 'Just started' },
    { value: 50, label: 'Making progress' },
    { value: 75, label: 'Almost there' },
  ]

  return (
    <div className="journeyProgressBox">
      <div className="journeyProgressTop">
        <div><strong>How's it going?</strong><span>Choose the step that feels closest.</span></div>
        <strong>{progress}%</strong>
      </div>
      <div className="journeyProgressTrack"><div style={{ width: `${progress}%` }} /></div>
      <div className="journeyProgressChoices">
        {steps.map((step) => (
          <button
            type="button"
            key={step.value}
            className={progress === step.value ? 'journeyProgressChoice journeyProgressChoiceActive' : 'journeyProgressChoice'}
            onClick={() => onChange?.(step.value)}
          >
            {step.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function JourneyReflectionForm({ childName, draft, setDraft, onCancel, onSubmit }) {
  const updateDraft = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  const ready = draft.enjoyment !== null && draft.wouldDoAgain !== null

  return (
    <form className="journeyReflection" onSubmit={onSubmit}>
      <div className="journeyReflectionHeader">
        <span className="growthEyebrow">QUICK REFLECTION</span>
        <h4>What did you notice, {childName}?</h4>
        <p>There are no right answers. What you liked and what you didn't like are both useful clues.</p>
      </div>
      <ReflectionChoice
        label="How much did you enjoy it?"
        options={[
          ['not_for_me', '😕 Not for me'],
          ['okay', '🙂 It was okay'],
          ['liked_it', '😄 I liked it'],
          ['loved_it', '🤩 I loved it'],
        ]}
        value={draft.enjoyment}
        onChange={(value) => updateDraft('enjoyment', value)}
      />
      <ReflectionText label="What was your favorite part?" value={draft.favoritePart} placeholder="I liked..." onChange={(value) => updateDraft('favoritePart', value)} />
      <ReflectionText label="What felt difficult or frustrating?" value={draft.difficultPart} placeholder="The hard part was..." onChange={(value) => updateDraft('difficultPart', value)} />
      <ReflectionChoice
        label="Would you do something like this again?"
        options={[[true, '👍 Yes'], [false, '👎 Probably not']]}
        value={draft.wouldDoAgain}
        onChange={(value) => updateDraft('wouldDoAgain', value)}
      />
      <ReflectionText label="Anything you want to try next?" value={draft.wantsNext} placeholder="Next I want to..." onChange={(value) => updateDraft('wantsNext', value)} />
      <div className="journeyReflectionActions">
        <button type="submit" className="growthPrimaryButton" disabled={!ready}>Complete Reflection <span>→</span></button>
        <button type="button" className="growthTextButton" onClick={onCancel}>Keep working on it</button>
      </div>
    </form>
  )
}

function ReflectionChoice({ label, options, value, onChange }) {
  return (
    <div className="journeyReflectionField">
      <strong>{label}</strong>
      <div className="journeyReflectionChoices">
        {options.map(([optionValue, optionLabel]) => (
          <button
            type="button"
            key={String(optionValue)}
            className={value === optionValue ? 'journeyReflectionChoice journeyReflectionChoiceActive' : 'journeyReflectionChoice'}
            onClick={() => onChange(optionValue)}
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
  )
}

function ReflectionText({ label, value, placeholder, onChange }) {
  return (
    <label className="journeyReflectionField">
      <strong>{label}</strong>
      <input type="text" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function formatEnjoyment(value) {
  const labels = {
    not_for_me: 'Not really for me',
    okay: 'It was okay',
    liked_it: 'I liked it',
    loved_it: 'I loved it',
  }
  return labels[value] || value
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
