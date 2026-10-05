import CompanionAvatar from './CompanionAvatar'
import './SynapStrideThinking.css'

export default function SynapStrideThinking({ message = 'Working on the best next step for you.' }) {
  return (
    <div className="synUniversalThinkingV019" role="status" aria-live="polite" aria-busy="true">
      <CompanionAvatar state="thinking" size={54} />
      <div className="synUniversalThinkingCopyV019">
        <strong>SynapStride is thinking…</strong>
        <span>{message}</span>
        <i aria-hidden="true"><b></b><b></b><b></b></i>
      </div>
    </div>
  )
}
