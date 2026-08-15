// src/components/PostAdventureParentObservation.jsx

function PostAdventureParentObservation({
  childName,
  adventureTitle,
  questions = [],
  currentQuestionIndex = 0,
  currentQuestion,
  onAnswer,
  onSkip,
  onDone,
}) {
  const safeName =
    childName || 'your child'

  if (!currentQuestion) {
    return (
      <section className="postAdventureParentV06">

        <div className="postAdventureParentCompleteV06">

          <div className="postAdventureParentCompleteIconV06">
            ✓
          </div>

          <span className="postAdventureParentKickerV06">
            PARENT OBSERVATION ADDED
          </span>

          <h1>
            Thanks for sharing what you noticed.
          </h1>

          <p>
            Your observations are now one more perspective
            alongside {safeName}'s own experience and what the
            system recorded during {adventureTitle || 'the Adventure'}.
          </p>

          <button
            type="button"
            className="postAdventureParentPrimaryV06"
            onClick={onDone}
          >
            Back to Growth Profile
            <span>→</span>
          </button>

        </div>

      </section>
    )
  }

  const progress =
    ((currentQuestionIndex + 1) /
      questions.length) *
    100

  return (
    <section className="postAdventureParentV06">

      <div className="postAdventureParentTopbarV06">

        <button
          type="button"
          className="postAdventureParentSkipV06"
          onClick={onSkip}
        >
          Skip for now
        </button>

        <span>
          Parent view
        </span>

      </div>


      <div className="postAdventureParentShellV06">

        <aside className="postAdventureParentContextV06">

          <span className="postAdventureParentKickerV06">
            AFTER THE ADVENTURE
          </span>

          <h2>
            What did you actually notice?
          </h2>

          <p>
            These questions are about observable behavior during
            {` ${adventureTitle || 'the activity'}`}, not what you
            hope {safeName} will become.
          </p>

          <div className="postAdventureParentRuleV06">
            <span>👀</span>

            <p>
              Observation adds context. It does not override what
              {` ${safeName} `}said about the experience.
            </p>
          </div>

        </aside>


        <main className="postAdventureParentMainV06">

          <div className="postAdventureParentProgressV06">

            <div>
              <span className="postAdventureParentKickerV06">
                YOUR OBSERVATION
              </span>

              <strong>
                Question {currentQuestionIndex + 1}
                {' '}of{' '}
                {questions.length}
              </strong>
            </div>

            <span>
              {Math.round(progress)}%
            </span>

          </div>

          <div className="postAdventureParentTrackV06">
            <div
              style={{
                width: `${progress}%`,
              }}
            />
          </div>


          <h1>
            {currentQuestion.question}
          </h1>

          <p className="postAdventureParentHelpV06">
            Choose the answer that best matches what you observed.
          </p>


          <div className="postAdventureParentAnswersV06">

            {currentQuestion.answers.map(
              (answer, index) => (
                <button
                  type="button"
                  key={answer.id}
                  onClick={() =>
                    onAnswer(answer)
                  }
                >
                  <span className="postAdventureParentLetterV06">
                    {String.fromCharCode(
                      65 + index
                    )}
                  </span>

                  <span>
                    {answer.label}
                  </span>

                  <span aria-hidden="true">
                    →
                  </span>
                </button>
              )
            )}

          </div>

        </main>

      </div>

    </section>
  )
}


export default PostAdventureParentObservation
