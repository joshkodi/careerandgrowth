// ============================================================
// Career & Growth
// MVP v0.3
//
// Adventures Hub
//
// Presentation component for selecting the next adventure.
//
// This component:
// - Displays recommended adventures
// - Shows available vs coming-soon experiences
// - Sends the selected adventure back to App.jsx
//
// It intentionally does NOT:
// - calculate recommendations
// - own adventure state
// - create evidence
// - persist anything
// ============================================================


function AdventuresHub({
  childName,
  recommendations = [],
  onBack,
  onStartAdventure,
}) {
  return (
    <section className="adventureHub">

      <button
        className="backButton"
        onClick={onBack}
      >
        ← Back to {childName}'s Space
      </button>


      <div className="adventureHubHeader">

        <p className="eyebrow">
          Adventures
        </p>

        <h2>
          What should we explore
          next?
        </h2>

        <p>
          Adventures help us learn
          what you enjoy doing —
          not just what sounds
          interesting.
        </p>

      </div>


      <div className="recommendationGrid">

        {recommendations.map(
          (recommendation) => (
            <article
              className="recommendationCard"
              key={
                recommendation.id
              }
            >

              <div className="recommendationEmoji">
                {recommendation.emoji}
              </div>


              <h3>
                {recommendation.title}
              </h3>


              <p>
                {
                  recommendation.description
                }
              </p>


              {recommendation.id ===
              'robotics' ? (
                <button
                  className="exploreButton"
                  onClick={() =>
                    onStartAdventure(
                      recommendation.id
                    )
                  }
                >
                  Start Adventure
                </button>
              ) : (
                <button
                  className="exploreButton exploreButtonDisabled"
                  disabled
                >
                  Coming Soon
                </button>
              )}

            </article>
          )
        )}

      </div>

    </section>
  )
}


export default AdventuresHub