// ============================================================
// Career & Growth
// MVP v0.6 — Phase 0 — Discover You
//
// Presentation-only component.
// Discovery state, evidence, scoring, persistence, and Growth
// Intelligence remain owned by App.jsx.
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

  const childInitial =
    childName.charAt(0).toUpperCase()

  const currentNumber =
    currentQuestionIndex + 1

  const progressPercentage =
    (currentNumber / questions.length) * 100

  const currentTopic =
    currentQuestion.shortLabel ||
    'Getting to know you'

  return (
    <section className="discoverV06">

      <div className="discoverTopbarV06">
        <button
          type="button"
          className="discoverBackV06"
          onClick={onBack}
        >
          ← Growth Space
        </button>

        <div className="discoverChildPillV06">
          <span className="discoverChildAvatarV06">
            {childInitial}
          </span>

          <span>
            {childName}
          </span>
        </div>
      </div>


      <div className="discoverLayoutV06">

        <aside className="discoverContextV06">

          <div className="discoverContextVisualV06">
            <span
              className="discoverSparkV06 discoverSparkOneV06"
              aria-hidden="true"
            >
              ✦
            </span>

            <span
              className="discoverSparkV06 discoverSparkTwoV06"
              aria-hidden="true"
            >
              ✨
            </span>

            <div className="discoverCompassV06">
              🧭
            </div>
          </div>


          <span className="discoverKickerV06">
            DISCOVER YOU
          </span>

          <h2>
            We're collecting clues
            about what feels like you.
          </h2>

          <p>
            Pick what feels most like you
            today. There are no right or
            wrong answers.
          </p>


          <div className="discoverTopicV06">
            <span>
              Exploring now
            </span>

            <strong>
              {currentTopic}
            </strong>
          </div>


          <div className="discoverEncouragementV06">
            <span aria-hidden="true">
              🌱
            </span>

            <p>
              Your answers can change as
              you grow. That's part of
              discovering who you are.
            </p>
          </div>

        </aside>


        <main className="discoverQuestionV06">

          <div className="discoverProgressRowV06">
            <div>
              <span className="discoverKickerV06">
                DISCOVERING YOU
              </span>

              <strong>
                Question {currentNumber}
                {' '}of{' '}
                {questions.length}
              </strong>
            </div>

            <span>
              {Math.round(progressPercentage)}%
            </span>
          </div>


          <div
            className="discoverProgressTrackV06"
            aria-label={`Question ${currentNumber} of ${questions.length}`}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>


          <div className="discoverQuestionIntroV06">
            <span className="discoverQuestionNumberV06">
              {String(currentNumber).padStart(2, '0')}
            </span>

            <div>
              <span className="discoverKickerV06">
                {currentTopic}
              </span>

              <h1>
                {currentQuestion.question}
              </h1>

              <p>
                Don't overthink it — choose
                the one that sounds most like you.
              </p>
            </div>
          </div>


          <div className="discoverAnswersV06">
            {currentQuestion.answers.map(
              (answer, index) => (
                <button
                  type="button"
                  key={answer.id}
                  className="discoverAnswerV06"
                  onClick={() =>
                    onAnswer(answer)
                  }
                >
                  <span className="discoverAnswerLetterV06">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="discoverAnswerTextV06">
                    {answer.label}
                  </span>

                  <span
                    className="discoverAnswerArrowV06"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </button>
              )
            )}
          </div>


          <div className="discoverFooterV06">
            <span aria-hidden="true">
              ✨
            </span>

            Each answer adds another clue
            to your Growth Profile.
          </div>

        </main>

      </div>

    </section>
  )
}


export default DiscoveryFlow
