// ============================================================
// Career & Growth
// MVP v0.6 — Phase 0 — Explore
//
// Kid-facing Explore workspace.
// Keeps recommendation logic, adventure state, evidence and
// persistence outside this presentation component.
// ============================================================

function AdventuresHub({
  childName,
  recommendations = [],
  catalog = [],
  completedExplorations = [],
  onBack,
  onStartAdventure,
}) {
  const safeName = childName || 'Explorer'

  const recommendedIds = new Set(
    recommendations
      .map((item) => item?.id)
      .filter(Boolean)
  )

  const catalogById = new Map(
    catalog
      .filter(Boolean)
      .map((item) => [item.id, item])
  )

  const pickedForYou = recommendations
    .slice(0, 2)
    .map((recommendation) => ({
      ...catalogById.get(recommendation.id),
      ...recommendation,
    }))

  const exploreMore = catalog.filter(
    (item) => !recommendedIds.has(item.id)
  )

  const canStart = (id) => id === 'robotics'

  const isCompleted = (id) =>
    completedExplorations.includes(id)

  return (
    <section className="exploreV06">

      <div className="exploreTopbarV06">
        <button
          type="button"
          className="exploreBackV06"
          onClick={onBack}
        >
          ← Growth Space
        </button>

        <div className="exploreChildPillV06">
          <span className="exploreChildAvatarV06">
            {safeName.charAt(0).toUpperCase()}
          </span>

          <span>{safeName}</span>
        </div>
      </div>


      <header className="exploreHeroV06">
        <div className="exploreHeroCopyV06">
          <span className="exploreKickerV06">
            EXPLORE
          </span>

          <h1>
            What catches your curiosity?
          </h1>

          <p>
            You don't have to know if you'll love it.
            Pick something that makes you think,
            “I want to try that.”
          </p>
        </div>

        <div
          className="exploreHeroSceneV06"
          aria-hidden="true"
        >
          <span className="sceneSparkV06 sceneSparkOneV06">
            ✦
          </span>

          <span className="sceneSparkV06 sceneSparkTwoV06">
            ✨
          </span>

          <div className="sceneBubbleV06">
            <strong>Try it.</strong>
            <span>Notice what feels fun.</span>
          </div>

          <div className="sceneRobotV06">
            🤖
          </div>
        </div>
      </header>


      {pickedForYou.length > 0 && (
        <section className="exploreSectionV06">
          <div className="exploreSectionHeadingV06">
            <div>
              <span className="exploreKickerV06">
                PICKED FOR YOU
              </span>

              <h2>
                Good places to start
              </h2>
            </div>

            <span className="exploreHeadingNoteV06">
              Based on clues we've learned about you.
            </span>
          </div>

          <div className="pickedGridV06">
            {pickedForYou.map((item, index) => (
              <article
                className={`pickedCardV06 pickedTheme${getThemeClass(item.id)}`}
                key={item.id}
              >
                <div className="pickedVisualV06">
                  <div className="pickedEmojiV06">
                    {item.emoji || '✨'}
                  </div>

                  <span className="pickedBadgeV06">
                    {index === 0 ? 'BEST MATCH' : 'FOR YOU'}
                  </span>

                  <span
                    className="pickedDecorV06"
                    aria-hidden="true"
                  >
                    {getDecorEmoji(item.id)}
                  </span>
                </div>

                <div className="pickedContentV06">
                  <div>
                    <h3>{item.title}</h3>

                    <p>
                      {item.description ||
                        item.intro ||
                        'Try something new and see what you notice about yourself.'}
                    </p>
                  </div>

                  {item.reasons?.length > 0 && (
                    <div className="exploreReasonV06">
                      <span aria-hidden="true">✨</span>
                      <p>{item.reasons[0]}</p>
                    </div>
                  )}

                  <ExperienceAction
                    id={item.id}
                    canStart={canStart(item.id)}
                    completed={isCompleted(item.id)}
                    onStartAdventure={onStartAdventure}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}


      <section className="exploreSectionV06 exploreMoreV06">
        <div className="exploreSectionHeadingV06">
          <div>
            <span className="exploreKickerV06">
              EXPLORE MORE
            </span>

            <h2>
              Choose your own direction
            </h2>
          </div>

          <span className="exploreHeadingNoteV06">
            Recommendations are ideas — your curiosity gets a vote too.
          </span>
        </div>

        {exploreMore.length > 0 ? (
          <div className="exploreCatalogGridV06">
            {exploreMore.map((item) => (
              <article
                className="catalogCardV06"
                key={item.id}
              >
                <div className={`catalogIconV06 catalogTheme${getThemeClass(item.id)}`}>
                  {item.emoji || '🔎'}
                </div>

                <div className="catalogContentV06">
                  <div className="catalogTitleRowV06">
                    <h3>{item.title}</h3>

                    {isCompleted(item.id) && (
                      <span className="triedBadgeV06">
                        Tried
                      </span>
                    )}
                  </div>

                  <p>
                    {item.description ||
                      item.intro ||
                      'Try this experience and see what feels interesting.'}
                  </p>
                </div>

                <ExperienceAction
                  id={item.id}
                  canStart={canStart(item.id)}
                  completed={isCompleted(item.id)}
                  onStartAdventure={onStartAdventure}
                  compact
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="exploreEmptyV06">
            <span>🌱</span>

            <div>
              <strong>
                More experiences are growing.
              </strong>

              <p>
                Try one of the ideas above for now.
              </p>
            </div>
          </div>
        )}
      </section>


      <div className="exploreReassuranceV06">
        <span aria-hidden="true">🧭</span>

        <p>
          <strong>You're not choosing a career.</strong>
          {' '}
          You're trying things and discovering more about yourself.
        </p>
      </div>

    </section>
  )
}


function ExperienceAction({
  id,
  canStart,
  completed,
  onStartAdventure,
  compact = false,
}) {
  if (!canStart) {
    return (
      <button
        type="button"
        className={`exploreActionV06 exploreActionDisabledV06 ${
          compact ? 'exploreActionCompactV06' : ''
        }`}
        disabled
      >
        Coming soon
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`exploreActionV06 ${
        compact ? 'exploreActionCompactV06' : ''
      }`}
      onClick={() => onStartAdventure(id)}
    >
      {completed ? 'Explore Again' : 'Explore This'}
      <span>→</span>
    </button>
  )
}


function getThemeClass(id = '') {
  if (id.includes('robot')) return 'Robot'
  if (id.includes('body') || id.includes('health')) return 'Health'
  if (id.includes('story') || id.includes('creative')) return 'Creative'
  if (id.includes('nature') || id.includes('animal')) return 'Nature'
  if (id.includes('science') || id.includes('space')) return 'Science'

  return 'Default'
}


function getDecorEmoji(id = '') {
  if (id.includes('robot')) return '⚙️'
  if (id.includes('body') || id.includes('health')) return '🧬'
  if (id.includes('story') || id.includes('creative')) return '✏️'
  if (id.includes('nature') || id.includes('animal')) return '🍃'
  if (id.includes('science') || id.includes('space')) return '🔭'

  return '✦'
}


export default AdventuresHub
