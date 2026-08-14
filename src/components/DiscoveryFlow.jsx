// ============================================================
// Career & Growth
// MVP v0.5 — Discover You
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
    <section className="discoverV05">

      <div className="discoverV05Shell">

        <header className="discoverV05Header">

          <button
            type="button"
            className="discoverV05Back"
            onClick={onBack}
          >
            <span aria-hidden="true">←</span>
            Back
          </button>

          <div className="discoverV05Brand">
            <span className="discoverV05BrandMark">
              🌱
            </span>

            <span>
              Career & Growth
            </span>
          </div>

        </header>


        <div className="discoverV05Layout">

          <aside className="discoverV05Context">

            <div className="discoverV05Profile">

              <div className="discoverV05Avatar">
                {childInitial}
              </div>

              <div>
                <strong>
                  {childName}
                </strong>

                <span>
                  Age {childProfile?.age}
                  {' · '}
                  {childProfile?.grade}
                </span>
              </div>

            </div>


            <div className="discoverV05ContextIntro">

              <span className="discoverV05Eyebrow">
                DISCOVER YOU
              </span>

              <h2>
                We're getting to know
                what feels like you.
              </h2>

              <p>
                Your answers give us clues
                about what you enjoy, how
                you like to think, and what
                makes you curious.
              </p>

            </div>


            <div className="discoverV05CurrentTopic">

              <span>
                Exploring now
              </span>

              <strong>
                {currentTopic}
              </strong>

            </div>


            <div className="discoverV05Reminders">

              <div>
                <span aria-hidden="true">✓</span>
                <p>
                  There are no right or
                  wrong answers.
                </p>
              </div>

              <div>
                <span aria-hidden="true">♡</span>
                <p>
                  Pick what feels most
                  like you today.
                </p>
              </div>

              <div>
                <span aria-hidden="true">↻</span>
                <p>
                  What we learn can keep
                  changing as you grow.
                </p>
              </div>

            </div>

          </aside>


          <main className="discoverV05Main">

            <div className="discoverV05ProgressRow">

              <div>
                <span className="discoverV05Eyebrow">
                  DISCOVERING YOU
                </span>

                <strong>
                  Question {currentNumber}
                  {' '}of{' '}
                  {questions.length}
                </strong>
              </div>

              <span className="discoverV05ProgressPercent">
                {Math.round(progressPercentage)}%
              </span>

            </div>


            <div
              className="discoverV05ProgressTrack"
              aria-label={`Question ${currentNumber} of ${questions.length}`}
            >
              <div
                className="discoverV05ProgressBar"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>


            <article className="discoverV05QuestionCard">

              <div className="discoverV05QuestionIntro">

                <span className="discoverV05QuestionNumber">
                  {String(currentNumber).padStart(2, '0')}
                </span>

                <div>
                  <span className="discoverV05Eyebrow">
                    {currentTopic}
                  </span>

                  <h1>
                    {currentQuestion.question}
                  </h1>

                  <p>
                    Choose the answer that
                    sounds most like you.
                    Don't overthink it.
                  </p>
                </div>

              </div>


              <div className="discoverV05Answers">

                {currentQuestion.answers.map(
                  (answer, index) => (
                    <button
                      type="button"
                      key={answer.id}
                      className="discoverV05Answer"
                      onClick={() =>
                        onAnswer(answer)
                      }
                    >
                      <span className="discoverV05AnswerIndex">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="discoverV05AnswerLabel">
                        {answer.label}
                      </span>

                      <span
                        className="discoverV05AnswerArrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </button>
                  )
                )}

              </div>

            </article>


            <div className="discoverV05FooterNote">
              <span aria-hidden="true">✨</span>
              Each answer adds another small clue to your Growth Profile.
            </div>

          </main>

        </div>

      </div>

    </section>
  )
}


export default DiscoveryFlow
