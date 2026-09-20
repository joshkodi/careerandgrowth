import './ParentPerspectiveV015.css'

// SynapStride v0.15 — Parent Perspective
// Presentation-only evolution of the existing Parent Perspective flow.
// Evidence generation, weighting, persistence, and Growth Intelligence remain unchanged.

function ParentPerspectiveFlow({
  childProfile,
  questions,
  currentQuestionIndex,
  currentQuestion,
  mode = 'questions',
  onBegin,
  onBack,
  onAnswer,
  onFinish,
}) {
  const childName = childProfile?.name?.trim() || 'your child'
  const totalQuestions = questions?.length || 0
  const currentNumber = currentQuestionIndex + 1
  const progressPercentage = totalQuestions
    ? (currentNumber / totalQuestions) * 100
    : 0

  if (mode === 'intro') {
    const perspectiveTypes = [
      ['✨', 'Something they’re interested in', 'Interests that keep coming back or spark unusual energy.'],
      ['🧩', 'Something they’re struggling with', 'Moments of frustration, hesitation, or where support seems useful.'],
      ['🌱', 'Something that seems to help', 'Approaches, environments, or encouragement that appear to work well.'],
      ['🔎', 'Something new you noticed', 'A behavior, choice, or moment that made you stop and notice.'],
      ['🚀', 'Something they want to try', 'Activities, skills, topics, or experiences they keep mentioning.'],
      ['🤝', 'Something you want help with', 'An area where you would like SynapStride to support their growth.'],
    ]

    return (
      <section className="ss-parent-perspective-v015">
        <header className="ss-parent-perspective-v015__hero">
          <div>
            <span className="ss-parent-perspective-v015__eyebrow">PARENT PERSPECTIVE</span>
            <h1>What are you noticing about {childName}?</h1>
            <p>
              You see parts of everyday life SynapStride cannot. Sharing that perspective helps build a richer,
              more balanced understanding over time.
            </p>
          </div>
          <div className="ss-parent-perspective-v015__hero-note">
            <span>👨‍👩‍👦</span>
            <strong>Your perspective adds context</strong>
            <small>It complements — never replaces — {childName}&apos;s own voice and experiences.</small>
          </div>
        </header>

        <section className="ss-parent-perspective-v015__types">
          <div className="ss-parent-perspective-v015__section-heading">
            <span>WHAT CAN I SHARE?</span>
            <h2>Anything that may help SynapStride understand {childName} better.</h2>
          </div>
          <div className="ss-parent-perspective-v015__type-grid">
            {perspectiveTypes.map(([emoji, title, description]) => (
              <article key={title}>
                <span>{emoji}</span>
                <div><strong>{title}</strong><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="ss-parent-perspective-v015__guided">
          <div>
            <span className="ss-parent-perspective-v015__eyebrow">GUIDED PERSPECTIVE</span>
            <h2>Start with a few quick prompts</h2>
            <p>
              For this release, SynapStride uses {totalQuestions} short prompts about things a parent can actually
              notice. In v0.16, this expands to natural-language sharing and intelligent follow-up questions.
            </p>
          </div>
          <button type="button" onClick={onBegin}>Share my perspective <span>→</span></button>
        </section>

        <footer className="ss-parent-perspective-v015__principle">
          <strong>One child, multiple perspectives.</strong>
          <span> SynapStride looks for patterns across child voice, real experiences, reflections, and parent perspective.</span>
        </footer>
      </section>
    )
  }

  if (!currentQuestion || !totalQuestions) {
    return (
      <section className="ss-parent-perspective-v015">
        <section className="ss-parent-perspective-v015__complete">
          <span>✓</span>
          <div>
            <span className="ss-parent-perspective-v015__eyebrow">PERSPECTIVE SHARED</span>
            <h1>Thanks for adding your perspective.</h1>
            <p>
              SynapStride will consider it alongside what {childName} says and does. No single perspective defines them.
            </p>
          </div>
          <button type="button" onClick={onFinish}>Back to Parent Space →</button>
        </section>
      </section>
    )
  }

  return (
    <section className="ss-parent-perspective-v015">
      <header className="ss-parent-perspective-v015__question-hero">
        <div>
          <button type="button" className="ss-parent-perspective-v015__back" onClick={onBack}>← Back</button>
          <span className="ss-parent-perspective-v015__eyebrow">PARENT PERSPECTIVE</span>
          <h1>Share what you actually notice.</h1>
          <p>Think about recent, everyday examples rather than what the “right” answer might be.</p>
        </div>
        <div className="ss-parent-perspective-v015__progress-copy">
          <strong>{currentNumber} of {totalQuestions}</strong>
          <span>Each answer adds one small piece of context.</span>
        </div>
      </header>

      <div className="ss-parent-perspective-v015__progress-track">
        <div style={{ width: `${progressPercentage}%` }} />
      </div>

      <main className="ss-parent-perspective-v015__question-card">
        <div className="ss-parent-perspective-v015__question-meta">
          <span>{String(currentNumber).padStart(2, '0')}</span>
          <small>WHAT HAVE YOU BEEN SEEING LATELY?</small>
        </div>
        <h2>{currentQuestion.question}</h2>
        <p>Choose the option that comes closest. This is a clue, not a permanent label.</p>

        <div className="ss-parent-perspective-v015__answers">
          {currentQuestion.answers.map((answer, index) => (
            <button type="button" key={answer.id} onClick={() => onAnswer(answer)}>
              <span>{String.fromCharCode(65 + index)}</span>
              <strong>{answer.label}</strong>
              <b aria-hidden="true">→</b>
            </button>
          ))}
        </div>
      </main>

      <footer className="ss-parent-perspective-v015__principle">
        <strong>Perspective, not verdict.</strong>
        <span> SynapStride combines this with {childName}&apos;s own choices and real experiences before stronger patterns emerge.</span>
      </footer>
    </section>
  )
}

export default ParentPerspectiveFlow
