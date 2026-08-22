// ============================================================
// Career & Growth
// MVP v0.8.10B-2 — Option B++ Explore
//
// Presentation-only Explore consolidation.
// Recommendation logic, adventure state, evidence and persistence
// remain outside this component.
// ============================================================

import './AdventuresHub.css'

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

  const bestMatch = pickedForYou[0]
  const moreForYou = pickedForYou.slice(1)

  const exploreMore = catalog.filter(
    (item) => !recommendedIds.has(item.id)
  )

  const canStart = (id) => id === 'robotics'

  const isCompleted = (id) =>
    completedExplorations.includes(id)

  return (
    <section className="exploreV06 exploreBppV0810">

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

      <header className="bppExploreIntro">
        <div>
          <span className="exploreKickerV06">EXPLORE</span>
          <h1>What sounds fun to try?</h1>
          <p>
            Follow your curiosity. Trying something is how you
            discover what feels interesting to you.
          </p>
        </div>

        <div className="bppExploreSpark" aria-hidden="true">
          <span>✨</span>
          <strong>Pick. Try. Notice.</strong>
        </div>
      </header>

      {bestMatch && (
        <section className="bppBestSection">
          <div className="bppSectionLabel">
            <span className="exploreKickerV06">PICKED FOR YOU</span>
            <span>Based on clues we've learned about you</span>
          </div>

          <article
            className={`bppBestMatch bppTheme${getThemeClass(bestMatch.id)}`}
          >
            <div className="bppBestVisual" aria-hidden="true">
              <span className="bppBestBadge">BEST MATCH</span>
              <div className="bppBestEmoji">
                {bestMatch.emoji || '✨'}
              </div>
              <span className="bppBestDecor">
                {getDecorEmoji(bestMatch.id)}
              </span>
            </div>

            <div className="bppBestContent">
              <div>
                <span className="bppTinyLabel">A GOOD PLACE TO START</span>
                <h2>{bestMatch.title}</h2>
                <p>
                  {bestMatch.description ||
                    bestMatch.intro ||
                    'Try something new and see what you notice about yourself.'}
                </p>
              </div>

              {bestMatch.reasons?.length > 0 && (
                <div className="bppWhy">
                  <span aria-hidden="true">✨</span>
                  <p>
                    <strong>Why this?</strong>{' '}
                    {bestMatch.reasons[0]}
                  </p>
                </div>
              )}

              <ExperienceAction
                id={bestMatch.id}
                canStart={canStart(bestMatch.id)}
                completed={isCompleted(bestMatch.id)}
                onStartAdventure={onStartAdventure}
                primary
              />
            </div>
          </article>
        </section>
      )}

      {moreForYou.length > 0 && (
        <section className="bppExploreSection">
          <div className="bppSimpleHeading">
            <div>
              <span className="exploreKickerV06">MORE FOR YOU</span>
              <h2>Another idea you might like</h2>
            </div>
          </div>

          <div className="bppSuggestionList">
            {moreForYou.map((item) => (
              <article className="bppSuggestionRow" key={item.id}>
                <div
                  className={`bppRowIcon bppTheme${getThemeClass(item.id)}`}
                  aria-hidden="true"
                >
                  {item.emoji || '✨'}
                </div>

                <div className="bppRowCopy">
                  <div className="bppRowTitle">
                    <h3>{item.title}</h3>
                    {isCompleted(item.id) && (
                      <span className="bppTried">Tried</span>
                    )}
                  </div>

                  <p>
                    {item.description ||
                      item.intro ||
                      'A new experience that may fit your interests.'}
                  </p>

                  {item.reasons?.length > 0 && (
                    <small>{item.reasons[0]}</small>
                  )}
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
        </section>
      )}

      <section className="bppExploreSection bppBrowseSection">
        <div className="bppSimpleHeading">
          <div>
            <span className="exploreKickerV06">EXPLORE MORE</span>
            <h2>Choose your own direction</h2>
          </div>

          <p>
            Recommendations are only ideas. Your curiosity gets a vote too.
          </p>
        </div>

        {exploreMore.length > 0 ? (
          <div className="bppBrowseGrid">
            {exploreMore.map((item) => (
              <article className="bppBrowseItem" key={item.id}>
                <div
                  className={`bppBrowseIcon bppTheme${getThemeClass(item.id)}`}
                  aria-hidden="true"
                >
                  {item.emoji || '🔎'}
                </div>

                <div className="bppBrowseCopy">
                  <div className="bppRowTitle">
                    <h3>{item.title}</h3>
                    {isCompleted(item.id) && (
                      <span className="bppTried">Tried</span>
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
          <div className="bppExploreEmpty">
            <span aria-hidden="true">🌱</span>
            <div>
              <strong>More experiences are growing.</strong>
              <p>Try one of the ideas above for now.</p>
            </div>
          </div>
        )}
      </section>

      <aside className="bppExploreReassurance">
        <span aria-hidden="true">🧭</span>
        <p>
          <strong>You're not choosing a career.</strong>{' '}
          You're trying things, noticing what feels interesting,
          and learning more about yourself.
        </p>
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
  primary = false,
}) {
  if (!canStart) {
    return (
      <button
        type="button"
        className={`bppExploreAction bppExploreActionDisabled ${
          compact ? 'compact' : ''
        } ${primary ? 'primary' : ''}`}
        disabled
      >
        Coming soon
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`bppExploreAction ${
        compact ? 'compact' : ''
      } ${primary ? 'primary' : ''}`}
      onClick={() => onStartAdventure(id)}
    >
      {completed ? 'Explore Again' : 'Let’s Try It'}
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
