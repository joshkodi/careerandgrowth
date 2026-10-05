import { useMemo, useState } from 'react'
import { interpretSchoolWorkWithModelV019 } from '../intelligence/schoolWorkInterpretationV019'
import './SchoolWorkIntakeV015.css'
import SynapStrideThinking from './SynapStrideThinking'

export default function SchoolWorkIntakeV015({ onCancel, onCreate, onUpload }) {
  const [mode, setMode] = useState('choose')
  const [text, setText] = useState('')
  const [draft, setDraft] = useState(null)
  const [interpreting, setInterpreting] = useState(false)
  const [interpretationMeta, setInterpretationMeta] = useState(null)
  const canInterpret = text.trim().length > 2
  const summary = useMemo(() => draft, [draft])

  const interpret = async () => {
    if (!canInterpret || interpreting) return
    setInterpreting(true)
    setInterpretationMeta(null)
    try {
      const result = await interpretSchoolWorkWithModelV019(text)
      setDraft(result.item)
      setInterpretationMeta(result.model)
    } finally {
      setInterpreting(false)
    }
  }

  if (summary) {
    return (
      <section className="schoolIntakeV015 schoolIntakeConfirmV015">
        <div className="schoolIntakeKickerV015">✦ Here’s what I understood</div>
        <h2>{summary.title}</h2>
        <p className="schoolIntakeMetaV015">{[summary.subject, summary.activityType?.replaceAll('_', ' '), summary.dueDate ? `Due ${summary.dueDate.replace(/^due\s+/i, '')}` : ''].filter(Boolean).join(' · ') || 'School work'}</p>
        <p className="schoolIntakeDescriptionV015">{summary.description}</p>
        {summary.assignmentUnderstanding && (
          <div className="schoolUnderstandingV019">
            {summary.assignmentUnderstanding.deliverable && <div><strong>What you’re making</strong><p>{summary.assignmentUnderstanding.deliverable}</p></div>}
            {summary.assignmentUnderstanding.requirements?.length > 0 && <div><strong>Your teacher wants you to</strong><ul>{summary.assignmentUnderstanding.requirements.map((requirement, index) => <li key={`${requirement}-${index}`}>{requirement}</li>)}</ul></div>}
            {summary.assignmentUnderstanding.learningNeeds?.length > 0 && <div><strong>What you may need to learn</strong><ul>{summary.assignmentUnderstanding.learningNeeds.map((need, index) => <li key={`${need}-${index}`}>{need}</li>)}</ul></div>}
            {summary.assignmentUnderstanding.clarificationQuestion && <div className="schoolClarificationV019"><strong>One thing I’m not sure about</strong><p>{summary.assignmentUnderstanding.clarificationQuestion}</p></div>}
          </div>
        )}
        <div className="schoolPlanPreviewV015">
          <strong>Here’s your path</strong>
          {summary.workPlan.steps.map((step, index) => (
            <div key={step.id} className={index === 0 ? 'current' : ''}>
              <span>{index === 0 ? '●' : '○'}</span><span>{step.label}</span>
            </div>
          ))}
        </div>
        {import.meta.env.DEV && interpretationMeta && <small className="schoolInterpretationSourceV019">Assignment understanding: {interpretationMeta.liveModel ? 'live AI' : 'safe fallback'}</small>}
        <div className="schoolIntakeActionsV015">
          <button type="button" className="secondary" onClick={() => { setDraft(null); setInterpretationMeta(null) }}>Change it</button>
          <button type="button" className="primary" onClick={() => onCreate?.(summary)}>Looks right — start →</button>
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
            <button type="button" className="primary" disabled={!canInterpret || interpreting} onClick={interpret}>{interpreting ? 'Reading your assignment…' : 'Help me set it up →'}</button>
          </div>
        </div>
      )}
      {interpreting && <SynapStrideThinking message="Looking at your assignment and figuring out how to set it up." />}
      <p className="schoolIntakeHintV015">✦ SynapStride will figure out what it can. You can always change something.</p>
    </section>
  )
}
