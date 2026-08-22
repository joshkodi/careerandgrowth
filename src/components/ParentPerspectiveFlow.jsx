import {
  useState,
} from 'react'

import './ParentPerspectiveFlow.css'


// ============================================================
// Career & Growth
// MVP v0.8.10B-4 — Option B++ Parent View
//
// Presentation/local-form-state only.
// Parent observations, goals, experience observations,
// evidence and persistence remain outside this component.
// ============================================================

function ParentPerspectiveFlow({
  mode,
  childName,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  parentIntents = [],
  experienceObservations = [],
  onBackToChildSpace,
  onBegin,
  onQuestionBack,
  onAnswer,
  onSaveParentIntent,
  onAddExperienceObservation,
}) {
  const [parentGoal, setParentGoal] =
    useState('')

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
      <section className="bppParentSection">

        <div className="bppParentSectionHead">
          <div>
            <span className="bppParentKicker">
              PARENT GOALS
            </span>

            <h2>
              What would you like to help
              {` ${childName} `}develop?
            </h2>

            <p>
              Goals guide future recommendations.
              They are different from observations
              about who {childName} is today.
            </p>
          </div>

          <span
            className="bppParentSectionIcon"
            aria-hidden="true"
          >
            🎯
          </span>
        </div>

        <form
          className="bppParentGoalForm"
          onSubmit={handleParentGoalSubmit}
        >
          <input
            type="text"
            value={parentGoal}
            onChange={(event) =>
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
            className="bppParentPrimary"
            disabled={!parentGoal.trim()}
          >
            Add Goal
          </button>
        </form>

        <div className="bppParentStarters">
          <span>Starting points</span>

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

        {activeParentIntents.length > 0 && (
          <div className="bppParentGoalList">
            <span className="bppParentKicker">
              ACTIVE GOALS
            </span>

            {activeParentIntents.map(
              (intent) => (
                <div
                  className="bppParentGoalItem"
                  key={intent.id}
                >
                  <span aria-hidden="true">
                    🎯
                  </span>

                  <p>{intent.text}</p>
                </div>
              )
            )}
          </div>
        )}

        <div className="bppParentNote">
          <span aria-hidden="true">i</span>

          <p>
            Goals influence recommendations.
            They do not automatically become
            strengths, traits, or abilities in
            {` ${childName}'s `}Growth Profile.
          </p>
        </div>

      </section>
    )

  const renderExperienceObservations =
    () => (
      <section className="bppParentSection">

        <div className="bppParentSectionHead">
          <div>
            <span className="bppParentKicker">
              EXPERIENCE OBSERVATIONS
            </span>

            <h2>
              Add what you noticed during
              {` ${childName}'s `}experiences
            </h2>

            <p>
              These observations are tied to a
              specific Adventure and can be added
              whenever it is convenient for you.
            </p>
          </div>

          <span
            className="bppParentSectionIcon"
            aria-hidden="true"
          >
            🧭
          </span>
        </div>

        {experienceObservations.length === 0 ? (
          <div className="bppParentEmpty">
            <span aria-hidden="true">
              🌱
            </span>

            <div>
              <strong>
                No completed experiences yet
              </strong>

              <p>
                When {childName} completes a Guided
                Adventure, it will appear here for
                optional parent observation.
              </p>
            </div>
          </div>
        ) : (
          <div className="bppParentExperienceList">
            {experienceObservations.map(
              (experience) => (
                <article
                  className="bppParentExperienceRow"
                  key={experience.id}
                >
                  <span className="bppParentExperienceEmoji">
                    {experience.emoji || '✨'}
                  </span>

                  <div className="bppParentExperienceCopy">
                    <strong>
                      {experience.title}
                    </strong>

                    <span>
                      Completed experience
                    </span>
                  </div>

                  <span
                    className={
                      experience.observationAdded
                        ? 'bppParentStatus complete'
                        : 'bppParentStatus'
                    }
                  >
                    {experience.observationAdded
                      ? '✓ Observation added'
                      : 'Not added'}
                  </span>

                  <button
                    type="button"
                    className="bppParentSecondary"
                    onClick={() =>
                      onAddExperienceObservation?.(
                        experience.id
                      )
                    }
                  >
                    {experience.observationAdded
                      ? 'Update Observation'
                      : 'Add Observation'}
                    <span>→</span>
                  </button>
                </article>
              )
            )}
          </div>
        )}

        <div className="bppParentNote">
          <span aria-hidden="true">i</span>

          <p>
            Only add an observation if you actually
            saw enough of the experience to comment.
            Skipping an experience is completely fine.
          </p>
        </div>

      </section>
    )


  if (mode === 'intro') {
    return (
      <section className="bppParent">

        <div className="bppParentTopbar">
          <button
            type="button"
            className="bppParentBack"
            onClick={onBackToChildSpace}
          >
            ← Back to {childName}'s Space
          </button>

          <span className="bppParentMode">
            Parent View
          </span>
        </div>

        <header className="bppParentHero">
          <div>
            <span className="bppParentKicker">
              PARENT PERSPECTIVE
            </span>

            <h1>
              Help us understand the
              moments you see.
            </h1>

            <p>
              You notice everyday patterns,
              interests, challenges, and growth
              that a questionnaire may never capture.
            </p>
          </div>

          <div
            className="bppParentHeroMark"
            aria-hidden="true"
          >
            <span>👀</span>
            <strong>Another perspective</strong>
          </div>
        </header>

        <div className="bppParentIntro">

          <section className="bppParentObservationLead">

            <div>
              <span className="bppParentKicker">
                EVERYDAY OBSERVATIONS
              </span>

              <h2>
                Share what you've noticed
                about {childName}
              </h2>

              <p>
                Six short questions help us add
                your perspective to the picture.
              </p>
            </div>

            <div className="bppParentPrinciple">
              <strong>
                One perspective, not the whole story.
              </strong>

              <p>
                Your observations add evidence.
                They do not replace what
                {` ${childName} `}tells us through
                Discovery, learning, and experiences.
              </p>
            </div>

            <button
              type="button"
              className="bppParentPrimary"
              onClick={onBegin}
            >
              Add My Perspective
              <span>→</span>
            </button>

          </section>

          {renderExperienceObservations()}

          {renderParentGoalCard()}

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
      <section className="bppParent">

        <div className="bppParentTopbar">
          <button
            type="button"
            className="bppParentBack"
            onClick={onQuestionBack}
          >
            ← Back
          </button>

          <span className="bppParentMode">
            Parent Observation
          </span>
        </div>

        <div className="bppParentQuestionLayout">

          <aside className="bppParentContext">
            <span className="bppParentKicker">
              PARENT PERSPECTIVE
            </span>

            <h2>
              What have you noticed?
            </h2>

            <p>
              Think about patterns you've
              actually seen over time rather
              than what you hope the answer
              should be.
            </p>

            <div className="bppParentContextRows">
              <div>
                <span>Observation</span>
                <strong>What you notice</strong>
              </div>

              <div>
                <span>Goal</span>
                <strong>What you hope to develop</strong>
              </div>
            </div>

            <div className="bppParentContextNote">
              Your answers add context.
              They don't define {childName}.
            </div>
          </aside>

          <main className="bppParentQuestionMain">

            <div className="bppParentProgressHead">
              <div>
                <span className="bppParentKicker">
                  YOUR OBSERVATION
                </span>

                <strong>
                  Question {currentQuestionIndex + 1}
                  {' '}of{' '}
                  {totalQuestions}
                </strong>
              </div>

              <span>
                {Math.round(progressPercentage)}%
              </span>
            </div>

            <div className="bppParentProgressTrack">
              <div
                style={{
                  width:
                    `${progressPercentage}%`,
                }}
              />
            </div>

            <article className="bppParentQuestionCard">
              <h1>
                {currentQuestion.question}
              </h1>

              <p>
                Choose the answer that best
                matches what you've observed.
              </p>

              <div className="bppParentAnswers">
                {currentQuestion.answers.map(
                  (answer, index) => (
                    <button
                      type="button"
                      key={answer.id}
                      className="bppParentAnswer"
                      onClick={() =>
                        onAnswer(answer)
                      }
                    >
                      <span className="bppParentAnswerLetter">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <span className="bppParentAnswerText">
                        {answer.label}
                      </span>

                      <span
                        className="bppParentAnswerArrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </button>
                  )
                )}
              </div>
            </article>

          </main>

        </div>

      </section>
    )
  }


  if (mode === 'complete') {
    return (
      <section className="bppParent">

        <div className="bppParentTopbar">
          <span />

          <span className="bppParentMode">
            Parent View
          </span>
        </div>

        <header className="bppParentCompleteHero">
          <div className="bppParentCompleteIcon">
            ✓
          </div>

          <div>
            <span className="bppParentKicker">
              PERSPECTIVE ADDED
            </span>

            <h1>
              Thanks for sharing what
              you've noticed.
            </h1>

            <p>
              Your observations are now one
              part of {childName}'s evolving
              Growth Intelligence.
            </p>
          </div>
        </header>

        <div className="bppParentCompleteBody">

          <div>
            <div className="bppParentPrinciple">
              <strong>
                Better patterns emerge when
                perspectives overlap.
              </strong>

              <p>
                Child Discovery, parent observations,
                experiences, learning, and reflections
                can reinforce or challenge one another
                over time.
              </p>
            </div>

            <button
              type="button"
              className="bppParentPrimary"
              onClick={onBackToChildSpace}
            >
              Back to {childName}'s Space
              <span>→</span>
            </button>
          </div>

          {renderParentGoalCard()}

        </div>

      </section>
    )
  }


  return null
}


export default ParentPerspectiveFlow
