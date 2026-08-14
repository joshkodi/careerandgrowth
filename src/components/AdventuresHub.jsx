// ============================================================
// Career & Growth
// MVP v0.5 — Explore
//
// Presentation-only Explore experience.
// Recommendation logic, adventure state, evidence and persistence
// remain owned by App.jsx and the intelligence layer.
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
    <section className="exploreV05">
      <div className="exploreTopbarV05">
        <button
          className="backButton"
          onClick={onBack}
        >
          ← Back to Growth Space
        </button>

        <div className="exploreChildPill">
          <span className="exploreChildAvatar">
            {safeName.charAt(0).toUpperCase()}
          </span>
          <span>{safeName}</span>
        </div>
      </div>

      <header className="exploreHeroV05">
        <div>
          <p className="exploreKicker">EXPLORE</p>
          <h1>Follow your curiosity.</h1>
          <p>
            Try something that catches your attention. You do not have to
            know whether you will love it — trying it is how we learn more
            about you.
          </p>
        </div>

        <div className="exploreHeroNote" aria-hidden="true">
          <span>✨</span>
          <strong>Try</strong>
          <small>Notice what feels interesting.</small>
        </div>
      </header>

      {pickedForYou.length > 0 && (
        <section className="exploreSectionV05">
          <div className="exploreSectionHeadingV05">
            <div>
              <span className="exploreKicker">PICKED FOR YOU</span>
              <h2>Good places to start</h2>
              <p>
                These ideas connect with clues we have already learned about you.
              </p>
            </div>
          </div>

          <div className="pickedGridV05">
            {pickedForYou.map((item, index) => (
              <article className="pickedCardV05" key={item.id}>
                <div className="pickedCardTopV05">
                  <div className="exploreEmojiV05">
                    {item.emoji || '✨'}
                  </div>
                  <span className="pickedBadgeV05">
                    {index === 0 ? 'BEST MATCH' : 'FOR YOU'}
                  </span>
                </div>

                <div className="pickedCardBodyV05">
                  <h3>{item.title}</h3>
                  <p>
                    {item.description || item.intro ||
                      'A new way to explore something that may fit your interests.'}
                  </p>
                </div>

                {item.reasons?.length > 0 && (
                  <div className="exploreWhyV05">
                    <span>Why this?</span>
                    <p>{item.reasons[0]}</p>
                  </div>
                )}

                <ExperienceAction
                  id={item.id}
                  canStart={canStart(item.id)}
                  completed={isCompleted(item.id)}
                  onStartAdventure={onStartAdventure}
                />
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="exploreSectionV05 exploreMoreSectionV05">
        <div className="exploreSectionHeadingV05 exploreSectionHeadingRowV05">
          <div>
            <span className="exploreKicker">EXPLORE MORE</span>
            <h2>Choose for yourself</h2>
            <p>
              Recommendations are only suggestions. Curiosity can take you
              somewhere completely different.
            </p>
          </div>

          <span className="exploreChoiceNoteV05">
            Your choices matter too.
          </span>
        </div>

        {exploreMore.length > 0 ? (
          <div className="exploreCatalogGridV05">
            {exploreMore.map((item) => (
              <article className="catalogCardV05" key={item.id}>
                <div className="catalogCardIconV05">
                  {item.emoji || '🔎'}
                </div>

                <div className="catalogCardBodyV05">
                  <div className="catalogTitleRowV05">
                    <h3>{item.title}</h3>
                    {isCompleted(item.id) && (
                      <span className="completedBadgeV05">Tried</span>
                    )}
                  </div>

                  <p>
                    {item.description || item.intro ||
                      'Try this experience and notice what you enjoy along the way.'}
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
          <div className="exploreEmptyV05">
            <span>🌱</span>
            <div>
              <strong>More experiences are growing.</strong>
              <p>
                For now, try one of the ideas above. New kinds of experiences
                can be added to this catalog over time.
              </p>
            </div>
          </div>
        )}
      </section>

      <aside className="exploreFooterNoteV05">
        <span>🧭</span>
        <div>
          <strong>You are not choosing a career.</strong>
          <p>
            Explore is for trying things, noticing what feels interesting,
            and giving your Growth Profile better clues about what to suggest next.
          </p>
        </div>
      </aside>
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
        className={`exploreActionV05 exploreActionDisabledV05 ${
          compact ? 'exploreActionCompactV05' : ''
        }`}
        disabled
      >
        Coming soon
      </button>
    )
  }

  return (
    <button
      className={`exploreActionV05 ${
        compact ? 'exploreActionCompactV05' : ''
      }`}
      onClick={() => onStartAdventure(id)}
    >
      {completed ? 'Explore Again' : 'Explore This'}
      <span>→</span>
    </button>
  )
}


export default AdventuresHub
