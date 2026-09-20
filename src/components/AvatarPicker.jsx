import { useMemo, useState } from 'react'
import Avatar from './Avatar'
import { getAgeBand, getAvatarsForBand } from '../data/avatarCatalog'

export default function AvatarPicker({
  age,
  value,
  onChange,
  compact = false,
  showAllAgeBands = true,
}) {
  const suggestedBand = getAgeBand(age)
  const [ageFilter, setAgeFilter] = useState(suggestedBand)
  const [genderFilter, setGenderFilter] = useState('all')

  const avatars = useMemo(
    () => getAvatarsForBand(showAllAgeBands ? ageFilter : suggestedBand),
    [ageFilter, showAllAgeBands, suggestedBand]
  )

  const visible =
    genderFilter === 'all'
      ? avatars
      : avatars.filter((item) => item.gender === genderFilter)

  return (
    <section className={`synAvatarPickerV014 ${compact ? 'compact' : ''}`}>
      <div className="synAvatarPickerHeadingV014">
        <div>
          <span>YOUR AVATAR</span>
          <strong>Choose one that feels like you</strong>
        </div>
        <small>
          {showAllAgeBands
            ? `${visible.length} avatar${visible.length === 1 ? '' : 's'} shown`
            : 'You can change it later.'}
        </small>
      </div>

      {showAllAgeBands && (
        <div className="synAvatarAgeFiltersV014" role="tablist" aria-label="Avatar age ranges">
          <button type="button" className={ageFilter === 'all' ? 'active' : ''} onClick={() => setAgeFilter('all')}>All 24</button>
          <button type="button" className={ageFilter === '5-7' ? 'active' : ''} onClick={() => setAgeFilter('5-7')}>Ages 5–7</button>
          <button type="button" className={ageFilter === '8-12' ? 'active' : ''} onClick={() => setAgeFilter('8-12')}>Ages 8–12</button>
          <button type="button" className={ageFilter === '13-15' ? 'active' : ''} onClick={() => setAgeFilter('13-15')}>Ages 13–15</button>
        </div>
      )}

      <div className="synAvatarFiltersV014" role="tablist" aria-label="Avatar options">
        <button type="button" className={genderFilter === 'all' ? 'active' : ''} onClick={() => setGenderFilter('all')}>All</button>
        <button type="button" className={genderFilter === 'boy' ? 'active' : ''} onClick={() => setGenderFilter('boy')}>Boys</button>
        <button type="button" className={genderFilter === 'girl' ? 'active' : ''} onClick={() => setGenderFilter('girl')}>Girls</button>
      </div>

      <div className="synAvatarGridV014">
        {visible.map((avatar) => {
          const selected = avatar.id === value
          return (
            <button
              key={avatar.id}
              type="button"
              className={selected ? 'selected' : ''}
              onClick={() => onChange?.(avatar.id)}
              aria-pressed={selected}
              aria-label={`Choose ${avatar.label} avatar`}
            >
              <Avatar avatarId={avatar.id} size={compact ? 54 : 68} />
              <span>{avatar.label}</span>
              {selected && <b aria-hidden="true">✓</b>}
            </button>
          )
        })}
      </div>
    </section>
  )
}
