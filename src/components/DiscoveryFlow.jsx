// ============================================================
// Career & Growth
// MVP v0.3
//
// Discovery Flow
//
// Presentation component for the Discovering You questionnaire.
//
// This component:
// - Displays child context
// - Displays question progress
// - Displays the current question and answers
// - Sends navigation/answer events back to App.jsx
//
// It intentionally does NOT:
// - own Discovery state
// - create evidence events
// - calculate Growth Intelligence
// - persist responses
// ============================================================


function DiscoveryFlow({
  childProfile,
  questions,
  currentQuestionIndex,
  currentQuestion,
  onBack,
  onAnswer,
}) {
  if (
    !currentQuestion ||
    !questions?.length
  ) {
    return null
  }

  const childName =
    childProfile.name.trim()

  const childInitial =
    childName
      .charAt(0)
      .toUpperCase()

  const progressPercentage =
    ((currentQuestionIndex + 1) /
      questions.length) *
    100


  return (
    <section className="discoveryLayout">

      {/* ======================================================
          LEFT COMPANION / JOURNEY
         ====================================================== */}

      <aside className="discoveryCompanion">

        <div className="companionProfile">

          <div className="companionAvatar">
            {childInitial}
          </div>


          <div>

            <p className="companionName">
              {childName}
            </p>

            <p className="companionMeta">
              Age {childProfile.age}
              {' · '}
              {childProfile.grade}
            </p>

          </div>

        </div>


        <div className="companionDivider" />


        <p className="companionHeading">
          Discovering You
        </p>


        <div className="journeyList">

          {questions.map(
            (
              question,
              index
            ) => {
              const isComplete =
                index <
                currentQuestionIndex

              const isCurrent =
                index ===
                currentQuestionIndex

              return (
                <div
                  key={
                    question.id
                  }
                  className={`journeyItem ${
                    isCurrent
                      ? 'journeyItemCurrent'
                      : ''
                  }`}
                >

                  <span className="journeyStatus">
                    {isComplete
                      ? '✓'
                      : isCurrent
                        ? '→'
                        : '○'}
                  </span>


                  <span>
                    {
                      question.shortLabel
                    }
                  </span>

                </div>
              )
            }
          )}

        </div>

      </aside>


      {/* ======================================================
          QUESTION AREA
         ====================================================== */}

      <div className="discoveryMain">

        <div className="discoveryTop">

          <button
            className="backButton"
            onClick={onBack}
          >
            ← Back
          </button>


          <span className="questionCounter">
            {currentQuestionIndex + 1}
            {' '}of{' '}
            {questions.length}
          </span>

        </div>


        {/* ====================================================
            PROGRESS
           ==================================================== */}

        <div className="progressTrack">

          <div
            className="progressBar"
            style={{
              width:
                `${progressPercentage}%`,
            }}
          />

        </div>


        {/* ====================================================
            CURRENT QUESTION
           ==================================================== */}

        <div className="questionCard">

          <p className="eyebrow">
            Discovering You
          </p>


          <h2 className="questionTitle">
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

      </div>

    </section>
  )
}


export default DiscoveryFlow