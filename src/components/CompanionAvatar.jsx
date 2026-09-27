import './CompanionAvatar.css'

function CompanionAvatar({
  state = 'idle',
  appearance = 'neutral',
  size = 48,
  label = 'SynapStride Companion',
}) {
  const thinking = state === 'thinking'

  return (
    <div
      className={`companionAvatarV017 companionAvatarV017--${state} companionAvatarV017--${appearance}`}
      style={{ '--companion-size': `${size}px` }}
      role="img"
      aria-label={thinking ? `${label} is thinking` : label}
    >
      <div className="companionAvatarCoreV017" aria-hidden="true">
        <span className="companionAvatarFaceV017">{thinking ? '◔' : '✦'}</span>
        {thinking && (
          <span className="companionAvatarThoughtV017">
            <i />
            <i />
            <i />
          </span>
        )}
      </div>
    </div>
  )
}

export default CompanionAvatar
