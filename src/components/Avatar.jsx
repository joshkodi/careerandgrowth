import { getAvatarById } from '../data/avatarCatalog'

function Hair({ style, color }) {
  if (style === 'curls') {
    return (
      <g fill={color}>
        <circle cx="36" cy="31" r="11" /><circle cx="49" cy="25" r="12" />
        <circle cx="63" cy="27" r="11" /><circle cx="72" cy="37" r="10" />
        <circle cx="28" cy="40" r="9" />
      </g>
    )
  }

  if (style === 'puffs') {
    return (
      <g fill={color}>
        <circle cx="28" cy="32" r="12" /><circle cx="75" cy="32" r="12" />
        <ellipse cx="51" cy="30" rx="25" ry="17" />
      </g>
    )
  }

  if (style === 'long') {
    return (
      <g fill={color}>
        <ellipse cx="51" cy="45" rx="33" ry="36" />
        <ellipse cx="51" cy="30" rx="28" ry="21" />
      </g>
    )
  }

  if (style === 'bob') {
    return (
      <g fill={color}>
        <ellipse cx="51" cy="43" rx="31" ry="30" />
        <ellipse cx="51" cy="29" rx="27" ry="19" />
      </g>
    )
  }

  if (style === 'crop') {
    return <path fill={color} d="M28 40c2-22 15-31 27-31 15 0 25 9 27 28-8-7-16-10-26-10-11 0-19 4-28 13Z" />
  }

  if (style === 'side') {
    return <path fill={color} d="M23 42C24 18 38 9 55 9c14 0 25 7 29 22-16-7-30-5-42 0-7 3-12 7-19 11Z" />
  }

  return <path fill={color} d="M22 43C24 18 39 8 55 9c13 1 24 8 29 23-14-7-26-6-37 0-9 5-14 9-25 11Z" />
}

export default function Avatar({ avatarId, size = 48, className = '', title = '' }) {
  const avatar = getAvatarById(avatarId)
  const isLongHair = avatar.hairStyle === 'long' || avatar.hairStyle === 'bob'

  return (
    <span
      className={`synAvatarV014 ${className}`.trim()}
      style={{ width: size, height: size, display: 'inline-flex', flex: `0 0 ${size}px` }}
      title={title || avatar.label}
      aria-label={`${avatar.label} avatar`}
      role="img"
    >
      <svg viewBox="0 0 104 104" width={size} height={size} aria-hidden="true">
        <circle cx="52" cy="52" r="50" fill={avatar.bg} />
        <path fill={avatar.shirt} d="M18 104c2-24 15-37 34-37s32 13 34 37H18Z" />
        {isLongHair && <Hair style={avatar.hairStyle} color={avatar.hair} />}
        <ellipse cx="52" cy="47" rx="25" ry="29" fill={avatar.skin} />
        {!isLongHair && <Hair style={avatar.hairStyle} color={avatar.hair} />}
        <circle cx="43" cy="48" r="3.2" fill="#1F2937" />
        <circle cx="62" cy="48" r="3.2" fill="#1F2937" />
        <circle cx="44" cy="47" r="1" fill="#FFF" />
        <circle cx="63" cy="47" r="1" fill="#FFF" />
        <path d="M45 59c4 4 11 4 15 0" fill="none" stroke="#9A4F3B" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="34" cy="56" r="3" fill="#E98B82" opacity=".45" />
        <circle cx="70" cy="56" r="3" fill="#E98B82" opacity=".45" />
      </svg>
    </span>
  )
}
