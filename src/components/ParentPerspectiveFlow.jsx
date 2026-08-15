import {
  useState,
} from 'react'


// ============================================================
// Career & Growth
// MVP v0.6 — Phase 0 — Parent Perspective
//
// Parent Observation:
// - Adds a parent's observations as evidence.
//
// Parent Goals:
// - Shape future recommendations.
// - Do NOT directly become child traits or strengths.
//
// This component remains presentation/local-form-state only.
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
      <section className="parentGoalV06">

        <div className="parentPanelHeadingV06">
          <div className="parentPanelIconV06">
            🎯
          </div>

          <div>
            <span className="parentKickerV06">
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
        </div>

        <form
          className="parentGoalFormV06"
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
            className="parentPrimaryV06"
            disabled={!parentGoal.trim()}
          >
            Add Goal
          </button>
        </form>

        <div className="parentGoalStartersV06">
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
          <div className="parentGoalListV06">
            <span className="parentKickerV06">
              ACTIVE GOALS
            </span>

            {activeParentIntents.map(
              (intent) => (
                <div
                  className="parentGoalItemV06"
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

        <div className="parentGoalNoteV06">
          <span aria-hidden="true">
            i
          </span>

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
      <section className="parentExperienceV06">

        <div className="parentPanelHeadingV06">
          <div className="parentPanelIconV06">
            🧭
          </div>

          <div>
            <span className="parentKickerV06">
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
        </div>

        {experienceObservations.length === 0 ? (
          <div className="parentExperienceEmptyV06">
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
          <div className="parentExperienceListV06">
            {experienceObservations.map(
              (experience) => (
                <article
                  className="parentExperienceItemV06"
                  key={experience.id}
                >
                  <div className="parentExperienceIdentityV06">
                    <span className="parentExperienceEmojiV06">
                      {experience.emoji || '✨'}
                    </span>

                    <div>
                      <strong>
                        {experience.title}
                      </strong>

                      <span>
                        Completed experience
                      </span>

                      {experience.description && (
                        <p className="parentExperienceDescriptionV06">
                          {experience.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="parentExperienceStatusV06">
                    <span
                      className={
                        experience.observationAdded
                          ? 'parentExperienceBadgeV06 complete'
                          : 'parentExperienceBadgeV06'
                      }
                    >
                      {experience.observationAdded
                        ? '✓ Observation added'
                        : 'Observation not added'}
                    </span>

                    <button
                      type="button"
                      className="parentExperienceActionV06"
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
                  </div>
                </article>
              )
            )}
          </div>
        )}

        <div className="parentGoalNoteV06">
          <span aria-hidden="true">
            i
          </span>

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
      <section className="parentV06">

        <div className="parentTopbarV06">
          <button
            type="button"
            className="parentBackV06"
            onClick={onBackToChildSpace}
          >
            ← Back to {childName}'s Space
          </button>

          <span className="parentModePillV06">
            Parent view
          </span>
        </div>

        <header className="parentHeroV06">
          <div>
            <span className="parentKickerV06">
              PARENT PERSPECTIVE
            </span>

            <h1>
              Add what you've noticed
              about {childName}.
            </h1>

            <p>
              You see everyday patterns,
              interests, and challenges that
              a questionnaire may never capture.
            </p>
          </div>

          <div
            className="parentHeroMarkV06"
            aria-hidden="true"
          >
            <span>👀</span>
            <small>Observe patterns</small>
          </div>
        </header>

        <div className="parentIntroGridV06 parentIntroGridV06Expanded">

          <section className="parentObservationV06">
            <div className="parentPanelHeadingV06">
              <div className="parentPanelIconV06">
                ◌
              </div>

              <div>
                <span className="parentKickerV06">
                  OBSERVATIONS
                </span>

                <h2>
                  Share your perspective
                </h2>

                <p>
                  Six short questions about
                  patterns you've noticed in
                  everyday life.
                </p>
              </div>
            </div>

            <div className="parentPrincipleV06">
              <strong>
                One perspective, not the whole story.
              </strong>

              <p>
                Your observations add another source
                of evidence. They do not replace what
                {` ${childName} `}tells us through
                Discovery and experiences.
              </p>
            </div>

            <button
              type="button"
              className="parentPrimaryV06"
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
      <section className="parentV06">

        <div className="parentTopbarV06">
          <button
            type="button"
            className="parentBackV06"
            onClick={onQuestionBack}
          >
            ← Back
          </button>

          <span className="parentModePillV06">
            Parent observation
          </span>
        </div>

        <div className="parentQuestionLayoutV06">

          <aside className="parentQuestionContextV06">
            <span className="parentKickerV06">
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

            <div className="parentContextRuleV06">
              <span>Observation</span>
              <strong>What you notice</strong>

              <span>Goal</span>
              <strong>What you hope to develop</strong>
            </div>

            <div className="parentContextNoteV06">
              Your answers add context.
              They don't define {childName}.
            </div>
          </aside>

          <main className="parentQuestionMainV06">

            <div className="parentProgressRowV06">
              <div>
                <span className="parentKickerV06">
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

            <div className="parentProgressTrackV06">
              <div
                style={{
                  width:
                    `${progressPercentage}%`,
                }}
              />
            </div>

            <article className="parentQuestionCardV06">
              <h1>
                {currentQuestion.question}
              </h1>

              <p>
                Choose the answer that best
                matches what you've observed.
              </p>

              <div className="parentAnswersV06">
                {currentQuestion.answers.map(
                  (answer, index) => (
                    <button
                      type="button"
                      key={answer.id}
                      className="parentAnswerV06"
                      onClick={() =>
                        onAnswer(answer)
                      }
                    >
                      <span className="parentAnswerLetterV06">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <span className="parentAnswerTextV06">
                        {answer.label}
                      </span>

                      <span
                        className="parentAnswerArrowV06"
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
      <section className="parentV06">

        <div className="parentTopbarV06">
          <span />

          <span className="parentModePillV06">
            Parent view
          </span>
        </div>

        <header className="parentCompleteV06">
          <div className="parentCompleteIconV06">
            ✓
          </div>

          <div>
            <span className="parentKickerV06">
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

        <div className="parentCompleteGridV06">

          <div>
            <div className="parentCompletePrincipleV06">
              <strong>
                Better patterns emerge when
                perspectives overlap.
              </strong>

              <p>
                Child Discovery, parent
                observations, experiences,
                and reflections can reinforce
                or challenge one another over time.
              </p>
            </div>

            <button
              type="button"
              className="parentPrimaryV06"
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
