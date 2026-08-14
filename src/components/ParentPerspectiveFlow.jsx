import {
  useState,
} from 'react'


// ============================================================
// Career & Growth
// MVP v0.5
//
// Parent Perspective + Parent Intent
//
// Parent Perspective:
// - Observations become Growth Intelligence evidence
//
// Parent Intent:
// - Parent goals influence future Grow recommendations
// - Parent goals do NOT directly change the Growth Profile
// ============================================================


function ParentPerspectiveFlow({
  mode,
  childName,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,

  parentIntents = [],

  onBackToChildSpace,
  onBegin,
  onQuestionBack,
  onAnswer,
  onSaveParentIntent,
}) {
  const [
    parentGoal,
    setParentGoal,
  ] = useState('')


  const activeParentIntents =
    [...parentIntents]
      .filter(
        (intent) =>
          intent.status === 'active'
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )


  const handleParentGoalSubmit =
    (event) => {
      event.preventDefault()

      const cleanedGoal =
        parentGoal.trim()

      if (!cleanedGoal) {
        return
      }

      onSaveParentIntent?.(
        cleanedGoal
      )

      setParentGoal('')
    }


  const chooseGoalStarter =
    (goal) => {
      setParentGoal(goal)
    }


  const renderParentGoalCard =
    () => (
      <section className="parentGoalPanel">

        <div className="parentPanelHeading">

          <div className="parentPanelIcon">
            🎯
          </div>

          <div>
            <p className="eyebrow">
              Parent Goals
            </p>

            <h3>
              What would you like to
              help {childName} develop?
            </h3>

            <p>
              Goals help shape future
              recommendations. They are
              different from observations
              about who {childName} is today.
            </p>
          </div>

        </div>


        <form
          className="parentGoalForm"
          onSubmit={
            handleParentGoalSubmit
          }
        >

          <input
            type="text"
            value={parentGoal}
            onChange={
              (event) =>
                setParentGoal(
                  event.target.value
                )
            }
            placeholder={
              `I'd like ${childName} to...`
            }
          />

          <button
            type="submit"
            className="parentPrimaryButton"
            disabled={
              !parentGoal.trim()
            }
          >
            Add Goal
          </button>

        </form>


        <div className="parentGoalStarters">

          <span>
            Try a starting point:
          </span>

          <button
            type="button"
            onClick={() =>
              chooseGoalStarter(
                `I'd like ${childName} to build more confidence`
              )
            }
          >
            Confidence
          </button>

          <button
            type="button"
            onClick={() =>
              chooseGoalStarter(
                `I'd like ${childName} to improve communication skills`
              )
            }
          >
            Communication
          </button>

          <button
            type="button"
            onClick={() =>
              chooseGoalStarter(
                `I'd like ${childName} to explore more STEM activities`
              )
            }
          >
            STEM exposure
          </button>

          <button
            type="button"
            onClick={() =>
              chooseGoalStarter(
                `I'd like ${childName} to become more independent`
              )
            }
          >
            Independence
          </button>

        </div>


        {activeParentIntents.length >
          0 && (

          <div className="parentGoalList">

            <p className="eyebrow">
              Active Goals
            </p>

            {activeParentIntents.map(
              (intent) => (

                <div
                  className="parentGoalItem"
                  key={intent.id}
                >
                  <span>
                    🎯
                  </span>

                  <p>
                    {intent.text}
                  </p>
                </div>

              )
            )}

          </div>

        )}


        <div className="parentGoalNote">

          <span>
            💡
          </span>

          <p>
            Parent goals influence what
            Career & Growth may recommend.
            They do not automatically become
            strengths, traits, or abilities
            in {childName}'s Growth Profile.
          </p>

        </div>

      </section>
    )


  if (mode === 'intro') {
    return (
      <section className="parentPerspective parentPerspectiveV05">

        <button
          className="backButton"
          onClick={
            onBackToChildSpace
          }
        >
          ← Back to {childName}'s Space
        </button>


        <div className="parentPerspectiveShell">

          <section className="parentPerspectiveHero">

            <div>

              <p className="eyebrow">
                Parent Perspective
              </p>

              <h1>
                Add what you've noticed
                about {childName}.
              </h1>

              <p className="parentPerspectiveLead">
                You see moments, patterns,
                interests, and challenges
                that a questionnaire may
                never capture.
              </p>

            </div>

            <div
              className="parentPerspectiveHeroIcon"
              aria-hidden="true"
            >
              👨‍👩‍👦
            </div>

          </section>


          <div className="parentPerspectiveColumns">

            <section className="parentObservationPanel">

              <div className="parentPanelHeading">

                <div className="parentPanelIcon">
                  👀
                </div>

                <div>

                  <p className="eyebrow">
                    Observations
                  </p>

                  <h2>
                    Share your perspective
                  </h2>

                  <p>
                    We'll ask six short
                    questions about what
                    you've observed in
                    everyday life.
                  </p>

                </div>

              </div>


              <div className="parentEvidencePrinciple">

                <span>
                  🌱
                </span>

                <div>

                  <strong>
                    One perspective, not the
                    whole story
                  </strong>

                  <p>
                    Your observations become
                    one source of evidence.
                    They do not replace what
                    {` ${childName} `}
                    tells us about themselves.
                  </p>

                </div>

              </div>


              <button
                className="parentPrimaryButton"
                onClick={onBegin}
              >
                Add My Perspective
                <span>→</span>
              </button>

            </section>


            {renderParentGoalCard()}

          </div>

        </div>

      </section>
    )
  }


  if (
    mode === 'questions' &&
    currentQuestion
  ) {
    const progressPercentage =
      ((currentQuestionIndex + 1) /
        totalQuestions) *
      100

    return (
      <section className="parentPerspective parentPerspectiveV05">

        <div className="parentQuestionShell">

          <aside className="parentQuestionContext">

            <button
              className="backButton"
              onClick={onQuestionBack}
            >
              ← Back
            </button>

            <div className="parentQuestionContextCard">

              <div className="parentPanelIcon">
                👨‍👩‍👦
              </div>

              <p className="eyebrow">
                Parent Perspective
              </p>

              <h2>
                What have you noticed?
              </h2>

              <p>
                Think about patterns you've
                seen over time, not what you
                hope the answer should be.
              </p>

              <div className="parentQuestionPrinciple">
                <span>🌱</span>
                <p>
                  Your answers add context.
                  They don't define
                  {` ${childName}`}.
                </p>
              </div>

            </div>

          </aside>


          <div className="parentQuestionMain">

            <div className="parentQuestionTop">

              <span className="questionCounter">
                Question{' '}
                {currentQuestionIndex + 1}
                {' '}of{' '}
                {totalQuestions}
              </span>

              <span className="parentQuestionHint">
                Choose what feels most true.
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


            <div className="parentQuestionCard parentQuestionCardV05">

              <p className="eyebrow">
                Your Observation
              </p>

              <h2 className="parentQuestionTitle">
                {
                  currentQuestion.question
                }
              </h2>


              <div className="answerGrid parentAnswerGrid">

                {currentQuestion.answers.map(
                  (answer) => (
                    <button
                      key={answer.id}
                      className="answerCard parentAnswerCard"
                      onClick={() =>
                        onAnswer(answer)
                      }
                    >
                      <span>
                        {answer.label}
                      </span>

                      <span
                        className="parentAnswerArrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </button>
                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </section>
    )
  }


  if (mode === 'complete') {
    return (
      <section className="parentPerspective parentPerspectiveV05">

        <div className="parentPerspectiveShell">

          <section className="parentCompletionHero">

            <div className="parentCompletionIcon">
              ✓
            </div>

            <p className="eyebrow">
              Perspective Added
            </p>

            <h1>
              Thanks for sharing what
              you've noticed.
            </h1>

            <p>
              Your observations are now one
              part of {childName}'s evolving
              Growth Intelligence.
            </p>

          </section>


          <div className="parentCompletionPrinciple">

            <span>
              ✨
            </span>

            <div>

              <strong>
                Patterns become more useful
                when perspectives overlap.
              </strong>

              <p>
                Child Discovery, parent
                observations, experiences,
                and reflections can reinforce
                or challenge one another over
                time.
              </p>

            </div>

          </div>


          {renderParentGoalCard()}


          <div className="parentCompletionActions">

            <button
              className="parentPrimaryButton"
              onClick={
                onBackToChildSpace
              }
            >
              Back to {childName}'s Space
              <span>→</span>
            </button>

          </div>

        </div>

      </section>
    )
  }


  return null
}


export default ParentPerspectiveFlow
