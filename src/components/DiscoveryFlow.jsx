// ============================================================
// SynapStride
// MVP v0.15 — Discover UX refresh
//
// Presentation-only. Existing discovery questions, answer callbacks,
// evidence translation, scoring, persistence and profile inference
// remain owned by the existing application pipeline.
// ============================================================

import './DiscoverExperienceV015.css'

function DiscoveryFlow({
  childProfile,
  questions,
  currentQuestionIndex,
  currentQuestion,
  onBack,
  onAnswer,
}) {
  if (!currentQuestion || !questions?.length) return null

  const childName = childProfile?.name?.trim() || 'Explorer'
  const currentNumber = currentQuestionIndex + 1
  const progressPercentage = (currentNumber / questions.length) * 100
  const currentTopic = currentQuestion.shortLabel || 'Getting to know you'

  return (
    <section className="ss-discover-v015">
      <button
        type="button"
        className="ss-discover-v015__back"
        onClick={onBack}
      >
        ← My Profile
      </button>

      <div className="ss-discover-v015__shell">
        <header className="ss-discover-v015__top">
          <span className="ss-discover-v015__eyebrow">Discover</span>
          <h1>Let’s get to know you, {childName}.</h1>
          <p>
            There are no right answers. Pick what feels most like you today —
            SynapStride will keep learning with you as you grow.
          </p>

          <div className="ss-discover-v015__progress">
            <div
              className="ss-discover-v015__track"
              aria-label={`Question ${currentNumber} of ${questions.length}`}
            >
              <div
                className="ss-discover-v015__bar"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="ss-discover-v015__count">
              {currentNumber} of {questions.length}
            </span>
          </div>
        </header>

        <main className="ss-discover-v015__body">
          <div className="ss-discover-v015__question">
            <span className="ss-discover-v015__topic">✨ {currentTopic}</span>
            <h2>{currentQuestion.question}</h2>
            <p>Choose the one that sounds most like you. Don’t overthink it.</p>
          </div>

          <div className="ss-discover-v015__answers">
            {currentQuestion.answers.map((answer) => (
              <button
                type="button"
                key={answer.id}
                className="ss-discover-v015__answer"
                onClick={() => onAnswer(answer)}
              >
                <span className="ss-discover-v015__answerText">
                  {answer.label}
                </span>
                <span className="ss-discover-v015__arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>

          <div className="ss-discover-v015__note">
            <span className="ss-discover-v015__spark" aria-hidden="true">🌱</span>
            <span>
              <strong>This is just one clue.</strong> What you choose, try and reflect on
              over time helps SynapStride understand you better.
            </span>
          </div>
        </main>
      </div>
    </section>
  )
}

export default DiscoveryFlow
