// ============================================================
// SynapStride
// MVP v0.9 — Parent View
//
// Parent View answers:
// "How is my child growing, and how can I help?"
//
// Presentation-only. Parent answers, evidence generation,
// persistence and profile intelligence remain owned by App.jsx.
// ============================================================

function ParentPerspectiveFlow({
  childProfile,
  questions,
  currentQuestionIndex,
  currentQuestion,
  onBack,
  onAnswer,
  onFinish,
}) {
  const childName =
    childProfile?.name?.trim() || 'your child'

  const totalQuestions = questions?.length || 0
  const currentNumber = currentQuestionIndex + 1
  const progressPercentage = totalQuestions
    ? (currentNumber / totalQuestions) * 100
    : 0

  if (!currentQuestion || !totalQuestions) {
    return (
      <section className="synParentV09">
        <header className="synParentHeroV09">
          <div>
            <span className="synParentEyebrowV09">
              PARENT VIEW
            </span>

            <h1>
              Add another perspective on {childName}.
            </h1>

            <p>
              Your everyday observations help SynapStride understand
              patterns that may not show up in a questionnaire or a single activity.
            </p>
          </div>

          <div className="synParentHeroMarkV09" aria-hidden="true">
            <span>👨‍👩‍👦</span>
            <strong>Another point of view</strong>
          </div>
        </header>

        <section className="synParentEmptyV09">
          <span>✓</span>

          <div>
            <span className="synParentEyebrowV09">
              PERSPECTIVE COMPLETE
            </span>

            <h2>Thanks for sharing what you notice.</h2>

            <p>
              SynapStride will use these observations as one source of context
              alongside what {childName} says and does.
            </p>
          </div>

          <button
            type="button"
            className="synParentActionV09"
            onClick={onFinish}
          >
            Back to Home
            <span>→</span>
          </button>
        </section>
      </section>
    )
  }

  return (
    <section className="synParentV09">

      <header className="synParentHeroV09">
        <div>
          <span className="synParentEyebrowV09">
            PARENT VIEW
          </span>

          <h1>
            What are you noticing about {childName}?
          </h1>

          <p>
            You see moments SynapStride can't — what holds attention,
            what creates energy, what causes frustration, and what keeps
            coming back in everyday life.
          </p>
        </div>

        <div className="synParentHeroMarkV09" aria-hidden="true">
          <span>👨‍👩‍👦</span>
          <strong>Your observations matter</strong>
        </div>
      </header>


      <section className="synParentProgressV09">
        <div>
          <span className="synParentEyebrowV09">
            PARENT PERSPECTIVE
          </span>

          <strong>
            {currentNumber} of {totalQuestions}
          </strong>
        </div>

        <div className="synParentProgressTrackV09">
          <div
            className="synParentProgressBarV09"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </section>


      <div className="synParentLayoutV09">

        <aside className="synParentContextV09">
          <div className="synParentContextIconV09">
            🔎
          </div>

          <span className="synParentEyebrowV09">
            WHAT HELPS
          </span>

          <h2>
            Share what you actually notice — not what you think the answer should be.
          </h2>

          <p>
            Parent observations are useful because they add context from
            real life. They do not override {childName}'s own voice.
          </p>

          <div className="synParentPrinciplesV09">
            <div>
              <span>1</span>
              <p>Think about recent, everyday examples.</p>
            </div>

            <div>
              <span>2</span>
              <p>Patterns matter more than one perfect moment.</p>
            </div>

            <div>
              <span>3</span>
              <p>There is no “best” answer for a child.</p>
            </div>
          </div>

          <div className="synParentEvidenceNoteV09">
            <span>PARENT → PROFILE</span>

            <p>
              Your observations become one perspective in {childName}'s
              evolving Profile — alongside Discover and Journey.
            </p>
          </div>
        </aside>


        <main className="synParentQuestionV09">
          <div className="synParentQuestionMetaV09">
            <span className="synParentQuestionNumberV09">
              {String(currentNumber).padStart(2, '0')}
            </span>

            <span>
              Your observation
            </span>
          </div>

          <h2>
            {currentQuestion.question}
          </h2>

          <p className="synParentQuestionHelpV09">
            Choose the answer that best matches what you've been seeing lately.
          </p>


          <div className="synParentAnswersV09">
            {currentQuestion.answers.map(
              (answer, index) => (
                <button
                  type="button"
                  key={answer.id}
                  className="synParentAnswerV09"
                  onClick={() => onAnswer(answer)}
                >
                  <span className="synParentAnswerLetterV09">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span>
                    {answer.label}
                  </span>

                  <span
                    className="synParentAnswerArrowV09"
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


      <footer className="synParentFooterV09">
        <span aria-hidden="true">🤝</span>

        <p>
          <strong>One child, multiple perspectives.</strong>
          {' '}
          SynapStride looks for patterns across the child's voice,
          real experiences, reflections, and parent observations.
        </p>
      </footer>

    </section>
  )
}


export default ParentPerspectiveFlow
