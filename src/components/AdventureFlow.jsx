// ============================================================
// SynapStride
// MVP v0.9 — Explore
//
// Explore answers: "What could I try?"
// It remains presentation-only. Recommendation logic, adventure
// state, evidence and persistence stay outside this component.
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
    .slice(0, 3)
    .map((recommendation) => ({
      ...catalogById.get(recommendation.id),
      ...recommendation,
    }))
    .filter((item) => item?.id)

  const exploreMore = catalog
    .filter((item) => !recommendedIds.has(item.id))
    .slice(0, 6)

  const canStart = (id) => id === 'robotics'

  const isCompleted = (id) =>
    completedExplorations.includes(id)

  return (
    <section className="synExploreV09">

      <header className="synExploreHeroV09">
        <div>
          <span className="synExploreEyebrowV09">
            EXPLORE
          </span>

          <h1>
            What would you like to try, {safeName}?
          </h1>

          <p>
            Follow your curiosity. Pick something that looks interesting,
            give it a try, and it can become part of your Journey.
          </p>
        </div>

        <div
          className="synExploreHeroMarkV09"
          aria-hidden="true"
        >
          <span>✨</span>
          <strong>Try something new</strong>
        </div>
      </header>


      {pickedForYou.length > 0 && (
        <section className="synExploreSectionV09">

          <div className="synExploreSectionHeadingV09">
            <div>
              <span className="synExploreEyebrowV09">
                PICKED FOR YOU
              </span>

              <h2>
                Good places to start
              </h2>
            </div>

            <p>
              Based on what SynapStride is learning about you.
            </p>
          </div>


          <div className="synExplorePickedGridV09">

            {pickedForYou.map((item, index) => (
              <article
                className="synExplorePickedCardV09"
                key={item.id}
              >
                <div
                  className={`synExploreVisualV09 synExploreTheme${getThemeClass(item.id)}`}
                >
                  <span className="synExploreEmojiV09">
                    {item.emoji || '✨'}
                  </span>

                  <span className="synExploreMatchBadgeV09">
                    {index === 0 ? 'TOP PICK' : 'FOR YOU'}
                  </span>
                </div>

                <div className="synExplorePickedBodyV09">

                  <div>
                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.description ||
                        item.intro ||
                        'Try something new and see what you notice about yourself.'}
                    </p>
                  </div>

                  {item.reasons?.length > 0 && (
                    <div className="synExploreWhyV09">
                      <span>Why this fits</span>
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


      <section className="synExploreSectionV09">

        <div className="synExploreSectionHeadingV09">
          <div>
            <span className="synExploreEyebrowV09">
              EXPLORE MORE
            </span>

            <h2>
              Follow your own curiosity
            </h2>
          </div>

          <p>
            Recommendations are suggestions. Your choices matter too.
          </p>
        </div>


        {exploreMore.length > 0 ? (
          <div className="synExploreCatalogV09">

            {exploreMore.map((item) => (
              <article
                className="synExploreCatalogCardV09"
                key={item.id}
              >
                <div
                  className={`synExploreCatalogIconV09 synExploreTheme${getThemeClass(item.id)}`}
                >
                  {item.emoji || '🔎'}
                </div>

                <div className="synExploreCatalogBodyV09">
                  <div className="synExploreCatalogTitleV09">
                    <h3>{item.title}</h3>

                    {isCompleted(item.id) && (
                      <span>Tried</span>
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
          <div className="synExploreEmptyV09">
            <span>🌱</span>

            <div>
              <strong>More experiences are growing.</strong>
              <p>Try one of the ideas above for now.</p>
            </div>
          </div>
        )}

      </section>


      <div className="synExploreJourneyNoteV09">
        <span aria-hidden="true">↗</span>

        <div>
          <strong>Explore finds it. Journey tracks it.</strong>
          <p>
            When you start something here, your ongoing work belongs in Journey.
          </p>
        </div>
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
      <span
        className={
          compact
            ? 'synExploreSoonV09 compact'
            : 'synExploreSoonV09'
        }
      >
        More soon
      </span>
    )
  }

  return (
    <button
      type="button"
      className={
        compact
          ? 'synExploreActionV09 compact'
          : 'synExploreActionV09'
      }
      onClick={() => onStartAdventure(id)}
    >
      {completed ? 'Try again' : 'Try this'}
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


export default AdventuresHub
