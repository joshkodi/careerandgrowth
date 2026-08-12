// ============================================================
// Career & Growth
// MVP v0.3
//
// Adventure Flow
//
// Presentation component for running an adventure.
//
// Flow:
// Intro
//   ↓
// Challenges
//   ↓
// Enjoyment reflection
//   ↓
// Favorite-part reflection
//
// This component intentionally does NOT:
// - own adventure state
// - create evidence events
// - calculate Growth Intelligence
// - persist responses
//
// App.jsx remains responsible for those behaviors.
// ============================================================


function AdventureFlow({
  exploration,
  step,
  challengeIndex,
  onBack,
  onBeginMission,
  onChallengeAnswer,
  onEnjoymentAnswer,
  onFavoritePartAnswer,
}) {
  if (!exploration) {
    return null
  }

  const currentChallenge =
    exploration.challenges?.[
      challengeIndex
    ]


  // ==========================================================
  // INTRO
  // ==========================================================

  if (step === 'intro') {
    return (
      <section className="exploration">

        <div className="explorationCard">

          <button
            className="backButton explorationBack"
            onClick={onBack}
          >
            ← Back to Adventures
          </button>


          <div className="explorationHeroEmoji">
            {exploration.emoji}
          </div>


          <p className="eyebrow">
            {exploration.intro.eyebrow}
          </p>


          <h2>
            {exploration.intro.title}
          </h2>


          <p className="explorationText">
            {
              exploration.intro
                .description
            }
          </p>


          <div className="missionBox">

            <span className="missionLabel">
              Your Mission
            </span>

            <p>
              {
                exploration.intro
                  .mission
              }
            </p>

          </div>


          <button
            className="cta"
            onClick={onBeginMission}
          >
            Start Mission
          </button>

        </div>

      </section>
    )
  }


  // ==========================================================
  // CHALLENGE
  // ==========================================================

  if (
    step === 'challenge' &&
    currentChallenge
  ) {
    return (
      <section className="exploration">

        <div className="explorationCard">

          <p className="eyebrow">
            Mission Challenge
          </p>


          <div className="challengeProgress">
            Challenge{' '}
            {challengeIndex + 1}
            {' '}of{' '}
            {exploration.challenges.length}
          </div>


          <h2 className="questionTitle">
            {currentChallenge.question}
          </h2>


          <div className="answerGrid">

            {currentChallenge.answers.map(
              (answer) => (
                <button
                  key={answer.id}
                  className="answerCard"
                  onClick={() =>
                    onChallengeAnswer(
                      answer
                    )
                  }
                >
                  {answer.label}
                </button>
              )
            )}

          </div>

        </div>

      </section>
    )
  }


  // ==========================================================
  // ENJOYMENT REFLECTION
  // ==========================================================

  if (step === 'enjoyment') {
    return (
      <section className="exploration">

        <div className="explorationCard">

          <div className="explorationHeroEmoji">
            🎉
          </div>


          <p className="eyebrow">
            Mission Complete
          </p>


          <h2>
            {
              exploration.reflection
                .enjoyment.question
            }
          </h2>


          <div className="reflectionGrid">

            {exploration.reflection
              .enjoyment.answers.map(
                (answer) => (
                  <button
                    key={answer.id}
                    className="reflectionButton"
                    onClick={() =>
                      onEnjoymentAnswer(
                        answer
                      )
                    }
                  >
                    {answer.label}
                  </button>
                )
              )}

          </div>

        </div>

      </section>
    )
  }


  // ==========================================================
  // FAVORITE PART REFLECTION
  // ==========================================================

  if (step === 'favorite') {
    return (
      <section className="exploration">

        <div className="explorationCard">

          <p className="eyebrow">
            One More Thing
          </p>


          <h2>
            {
              exploration.reflection
                .favoritePart.question
            }
          </h2>


          <div className="answerGrid">

            {exploration.reflection
              .favoritePart.answers.map(
                (answer) => (
                  <button
                    key={answer.id}
                    className="answerCard"
                    onClick={() =>
                      onFavoritePartAnswer(
                        answer
                      )
                    }
                  >
                    {answer.label}
                  </button>
                )
              )}

          </div>

        </div>

      </section>
    )
  }


  return null
}


export default AdventureFlow