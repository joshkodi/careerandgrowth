// ============================================================
// Career & Growth
// MVP v0.3
//
// Parent Perspective Flow
//
// Presentation component for the parent contribution flow.
//
// This component:
// - Displays intro screen
// - Displays parent observation questions
// - Displays completion screen
//
// It intentionally does NOT:
// - own response state
// - create evidence
// - persist observations
// - calculate Growth Intelligence
// ============================================================


function ParentPerspectiveFlow({
  mode,
  childName,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  onBackToChildSpace,
  onBegin,
  onQuestionBack,
  onAnswer,
}) {
  // ==========================================================
  // INTRO
  // ==========================================================

  if (mode === 'intro') {
    return (
      <section className="parentPerspective">

        <button
          className="backButton"
          onClick={
            onBackToChildSpace
          }
        >
          ← Back to {childName}'s Space
        </button>


        <div className="parentPerspectiveIntroCard">

          <div className="parentPerspectiveEmoji">
            👨‍👩‍👦
          </div>

          <p className="eyebrow">
            For Parents
          </p>

          <h2>
            Add your perspective
          </h2>

          <p className="parentPerspectiveIntroText">
            You see things about{' '}
            {childName} that a
            questionnaire can't
            capture.
          </p>

          <p className="parentPerspectiveIntroText">
            We'll ask six short
            questions about things
            you've observed. There
            are no right or wrong
            answers.
          </p>


          <div className="parentEvidenceNote">

            <span>
              🌱
            </span>

            <p>
              Your answers become
              another source of
              evidence. They don't
              replace what {childName}{' '}
              tells us about
              themselves.
            </p>

          </div>


          <button
            className="cta"
            onClick={
              onBegin
            }
          >
            Add My Perspective
          </button>

        </div>

      </section>
    )
  }


  // ==========================================================
  // QUESTION FLOW
  // ==========================================================

  if (
    mode === 'questions' &&
    currentQuestion
  ) {
    const progressPercentage =
      ((currentQuestionIndex + 1) /
        totalQuestions) *
      100

    return (
      <section className="parentPerspective">

        <div className="parentPerspectiveTop">

          <button
            className="backButton"
            onClick={
              onQuestionBack
            }
          >
            ← Back
          </button>


          <span className="questionCounter">
            {currentQuestionIndex + 1}
            {' '}of{' '}
            {totalQuestions}
          </span>

        </div>


        <div className="progressTrack">

          <div
            className="progressBar"
            style={{
              width:
                `${progressPercentage}%`,
            }}
          />

        </div>


        <div className="parentQuestionCard">

          <p className="eyebrow">
            Parent Perspective
          </p>


          <h2 className="parentQuestionTitle">
            {
              currentQuestion.question
            }
          </h2>


          <div className="answerGrid">

            {currentQuestion.answers.map(
              (answer) => (
                <button
                  key={
                    answer.id
                  }
                  className="answerCard"
                  onClick={() =>
                    onAnswer(
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
  // COMPLETE
  // ==========================================================

  if (mode === 'complete') {
    return (
      <section className="parentPerspective">

        <div className="parentPerspectiveIntroCard">

          <div className="parentPerspectiveEmoji">
            🌱
          </div>

          <p className="eyebrow">
            Perspective Added
          </p>

          <h2>
            Thanks for sharing what
            you've noticed.
          </h2>

          <p className="parentPerspectiveIntroText">
            Your observations are
            now part of {childName}'s
            Growth Intelligence.
          </p>


          <div className="parentEvidenceNote">

            <span>
              ✨
            </span>

            <p>
              As child Discovery,
              parent observations,
              and adventure behavior
              begin to overlap, our
              confidence in emerging
              patterns can grow.
            </p>

          </div>


          <button
            className="cta"
            onClick={
              onBackToChildSpace
            }
          >
            Back to {childName}'s Space
          </button>

        </div>

      </section>
    )
  }


  return null
}


export default ParentPerspectiveFlow