import { useMemo, useState } from 'react'
import { interpretSchoolWorkText } from '../intelligence/schoolWorkPlanningEngine'
import './SchoolWorkIntakeV015.css'

export default function SchoolWorkIntakeV015({ onCancel, onCreate, onUpload }) {
  const [mode, setMode] = useState('choose')
  const [text, setText] = useState('')
  const [draft, setDraft] = useState(null)
  const canInterpret = text.trim().length > 2
  const summary = useMemo(() => draft, [draft])

  const interpret = () => setDraft(interpretSchoolWorkText(text))

  if (summary) {
    return (
      <section className="schoolIntakeV015 schoolIntakeConfirmV015">
        <div className="schoolIntakeKickerV015">✦ I think I’ve got it</div>
        <h2>{summary.title}</h2>
        <p className="schoolIntakeMetaV015">{[summary.subject, summary.activityType?.replaceAll('_', ' ')].filter(Boolean).join(' · ') || 'School work'}</p>
        <p className="schoolIntakeDescriptionV015">{summary.description}</p>
        <div className="schoolPlanPreviewV015">
          <strong>Here’s a simple way to get started</strong>
          {summary.workPlan.steps.map((step, index) => (
            <div key={step.id} className={index === 0 ? 'current' : ''}>
              <span>{index === 0 ? '●' : '○'}</span><span>{step.label}</span>
            </div>
          ))}
        </div>
        <div className="schoolIntakeActionsV015">
          <button type="button" className="secondary" onClick={() => setDraft(null)}>Change it</button>
          <button type="button" className="primary" onClick={() => onCreate?.(summary)}>Yep, add it →</button>
        </div>
      </section>
    )
  }

  return (
    <section className="schoolIntakeV015">
      <button type="button" className="schoolIntakeCloseV015" onClick={onCancel} aria-label="Close">×</button>
      <div className="schoolIntakeKickerV015">SCHOOL</div>
      <h2>What are you working on?</h2>
      <p>Show me, upload it, or just tell me. You don’t need to fill out a bunch of boxes.</p>

      <div className="schoolIntakeChoicesV015">
        <label className="schoolIntakeChoiceV015">
          <span className="icon">📷</span><strong>Show me</strong><small>Take a picture</small>
          <input type="file" accept="image/*" capture="environment" onChange={onUpload} />
        </label>
        <label className="schoolIntakeChoiceV015">
          <span className="icon">📄</span><strong>Upload</strong><small>Add a picture</small>
          <input type="file" accept="image/*" onChange={onUpload} />
        </label>
        <button type="button" className="schoolIntakeChoiceV015" onClick={() => setMode('tell')}>
          <span className="icon">✏️</span><strong>Tell me</strong><small>Type or paste it</small>
        </button>
      </div>

      {mode === 'tell' && (
        <div className="schoolTellV015">
          <label htmlFor="school-work-text">Tell me what you have to do</label>
          <textarea id="school-work-text" autoFocus rows="5" value={text} onChange={(event) => setText(event.target.value)} placeholder="Example: I have a science project about renewable energy. I need to make a presentation by Friday." />
          <div className="schoolIntakeActionsV015">
            <button type="button" className="secondary" onClick={() => { setMode('choose'); setText('') }}>Back</button>
            <button type="button" className="primary" disabled={!canInterpret} onClick={interpret}>Help me set it up →</button>
          </div>
        </div>
      )}
      <p className="schoolIntakeHintV015">✦ SynapStride will figure out what it can. You can always change something.</p>
    </section>
  )
}
