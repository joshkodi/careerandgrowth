// ============================================================
// SynapStride
// MVP v0.9 — Discover
//
// Discover answers: "Who am I?"
// Presentation-only. Discovery state, evidence, scoring,
// persistence and profile inference remain owned by App.jsx.
// ============================================================

function DiscoveryFlow({
  childProfile,
  questions,
  currentQuestionIndex,
  currentQuestion,
  onBack,
  onAnswer,
}) {
  if (!currentQuestion || !questions?.length) {
    return null
  }

  const childName =
    childProfile?.name?.trim() || 'Explorer'

  const currentNumber =
    currentQuestionIndex + 1

  const progressPercentage =
    (currentNumber / questions.length) * 100

  const currentTopic =
    currentQuestion.shortLabel ||
    'Getting to know you'

  return (
    <section className="synDiscoverV09">

      <header className="synDiscoverHeroV09">
        <div>
          <span className="synDiscoverEyebrowV09">
            DISCOVER
          </span>

          <h1>
            Discover more about you, {childName}.
          </h1>

          <p>
            What you tell SynapStride gives us important clues about
            what you enjoy, how you like to think, and what makes you curious.
          </p>
        </div>

        <div className="synDiscoverHeroMarkV09" aria-hidden="true">
          <span>🧭</span>
          <strong>Your voice matters</strong>
        </div>
      </header>


      <section className="synDiscoverProgressPanelV09">

        <div className="synDiscoverProgressHeadingV09">
          <div>
            <span className="synDiscoverEyebrowV09">
              DISCOVERING YOU
            </span>

            <h2>
              One small question at a time
            </h2>
          </div>

          <strong>
            {currentNumber} of {questions.length}
          </strong>
        </div>

        <div
          className="synDiscoverProgressTrackV09"
          aria-label={`Question ${currentNumber} of ${questions.length}`}
        >
          <div
            className="synDiscoverProgressBarV09"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>

      </section>


      <div className="synDiscoverLayoutV09">

        <aside className="synDiscoverContextV09">

          <div className="synDiscoverContextIconV09">
            ✨
          </div>

          <span className="synDiscoverEyebrowV09">
            WHY DISCOVER?
          </span>

          <h2>
            You know things about yourself that activities alone can't tell us.
          </h2>

          <p>
            Your answers are one part of your evolving Profile.
            What you try in Journey and what you reflect on add other clues.
          </p>

          <div className="synDiscoverContextNotesV09">
            <div>
              <span>✓</span>
              <p>No right or wrong answers.</p>
            </div>

            <div>
              <span>♡</span>
              <p>Choose what feels most like you today.</p>
            </div>

            <div>
              <span>↻</span>
              <p>Your answers can evolve as you grow.</p>
            </div>
          </div>

          <div className="synDiscoverProfileLinkV09">
            <span>DISCOVER → PROFILE</span>
            <p>
              What you share here helps SynapStride understand you more clearly.
            </p>
          </div>

        </aside>


        <main className="synDiscoverQuestionV09">

          <div className="synDiscoverQuestionMetaV09">
            <span className="synDiscoverQuestionNumberV09">
              {String(currentNumber).padStart(2, '0')}
            </span>

            <span className="synDiscoverTopicV09">
              {currentTopic}
            </span>
          </div>

          <h2>
            {currentQuestion.question}
          </h2>

          <p className="synDiscoverQuestionHelpV09">
            Pick the answer that sounds most like you.
            Don't overthink it.
          </p>


          <div className="synDiscoverAnswersV09">

            {currentQuestion.answers.map(
              (answer, index) => (
                <button
                  type="button"
                  key={answer.id}
                  className="synDiscoverAnswerV09"
                  onClick={() => onAnswer(answer)}
                >
                  <span className="synDiscoverAnswerLetterV09">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span>
                    {answer.label}
                  </span>

                  <span
                    className="synDiscoverAnswerArrowV09"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </button>
              )
            )}

          </div>

        </main>

      </div>


      <footer className="synDiscoverFooterV09">
        <span aria-hidden="true">🌱</span>
        <p>
          <strong>Discover is just one source of clues.</strong>
          {' '}
          Your Journey, reflections, and parent observations help the picture grow.
        </p>
      </footer>

    </section>
  )
}


export default DiscoveryFlow
