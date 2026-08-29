// ============================================================
// SynapStride
// MVP v0.10.2 — Explore Intelligence & Redesign
// ============================================================

import './AdventuresHub.css'
import './AdventuresHubV0102.css'
import './InterestsActivitiesV0104D.css'

const explorationSeeds = [
  {
    id: 'music-maker-preview',
    title: 'Music Maker',
    emoji: '🎵',
    description: 'Explore rhythm, sounds, and creating something of your own.',
  },
  {
    id: 'nature-investigator-preview',
    title: 'Nature Investigator',
    emoji: '🌱',
    description: 'Look closely at plants, animals, patterns, and the world around you.',
  },
]

const localOpportunityPreview = [
  {
    id: 'az-science-center',
    type: 'local_event',
    label: 'Museum',
    emoji: '🔬',
    title: 'Hands-on science programs',
    provider: { name: 'Arizona Science Center', type: 'museum' },
    description: 'Science exhibits, demonstrations, and family learning programs.',
    location: { city: 'Phoenix', state: 'AZ' },
    relatedExperienceIds: ['space', 'human-body'],
    metadata: { preview: true, curatedArea: 'Phoenix metro' },
  },
  {
    id: 'phoenix-library',
    type: 'local_event',
    label: 'Library',
    emoji: '🤖',
    title: 'STEM & maker programs',
    provider: { name: 'Phoenix Public Library', type: 'library' },
    description: 'Look for coding, robotics, maker, and creative learning sessions.',
    location: { city: 'Phoenix', state: 'AZ' },
    relatedExperienceIds: ['robotics'],
    metadata: { preview: true, curatedArea: 'Phoenix metro' },
  },
  {
    id: 'desert-botanical-garden',
    type: 'local_event',
    label: 'Nature',
    emoji: '🌵',
    title: 'Explore desert science',
    provider: { name: 'Desert Botanical Garden', type: 'garden' },
    description: 'Connect nature, observation, ecosystems, and outdoor discovery.',
    location: { city: 'Phoenix', state: 'AZ' },
    relatedExperienceIds: ['nature-investigator-preview'],
    metadata: { preview: true, curatedArea: 'Phoenix metro' },
  },
  {
    id: 'riparian-preserve',
    type: 'local_event',
    label: 'Outdoors',
    emoji: '🦆',
    title: 'Nature observation outing',
    provider: { name: 'Riparian Preserve at Water Ranch', type: 'outdoors' },
    description: 'Practice noticing wildlife, habitats, patterns, and environmental clues.',
    location: { city: 'Gilbert', state: 'AZ' },
    relatedExperienceIds: ['nature-investigator-preview'],
    metadata: { preview: true, curatedArea: 'Phoenix metro' },
  },
]

function AdventuresHub({
  childName,
  recommendations = [],
  catalog = [],
  completedExplorations = [],
  growthActivities = [],
  onSaveGrowthOpportunity,
  onBack,
  onStartAdventure,
  embedded = false,
}) {
  const safeName = childName || 'Explorer'

  const catalogById = new Map(
    catalog
      .filter(Boolean)
      .map((item) => [item.id, item])
  )

  const personalized = recommendations
    .slice(0, 2)
    .map((recommendation) => ({
      ...catalogById.get(recommendation.id),
      ...recommendation,
    }))
    .filter((item) => item?.id)

  const bestMatch = personalized[0] || catalog[0]
  const moreForYou = personalized.slice(1)

  const continueGrowing = completedExplorations
    .map((id) => catalogById.get(id))
    .filter(Boolean)
    .slice(0, 2)

  const excludedIds = new Set([
    ...personalized.map((item) => item?.id),
    ...continueGrowing.map((item) => item?.id),
  ].filter(Boolean))

  const trySomethingDifferent = [
    ...catalog.filter((item) => item && !excludedIds.has(item.id)),
    ...explorationSeeds,
  ].filter(
    (item, index, items) =>
      items.findIndex((candidate) => candidate.id === item.id) === index
  ).slice(0, 3)

  const canStart = (id) => id === 'robotics'
  const isCompleted = (id) => completedExplorations.includes(id)

  if (embedded) {
    return (
      <EmbeddedExploreMoreV0104D
        bestMatch={bestMatch}
        moreForYou={moreForYou}
        continueGrowing={continueGrowing}
        trySomethingDifferent={trySomethingDifferent}
        localOpportunityPreview={localOpportunityPreview}
        growthActivities={growthActivities}
        onSaveGrowthOpportunity={onSaveGrowthOpportunity}
        onStartAdventure={onStartAdventure}
      />
    )
  }

  return (
    <section className="exploreV06 exploreBppV0810 exploreV0102">
      {!embedded && (
        <div className="exploreTopbarV06">
          <button type="button" className="exploreBackV06" onClick={onBack}>
            ← Growth Space
          </button>
          <div className="exploreChildPillV06">
            <span className="exploreChildAvatarV06">{safeName.charAt(0).toUpperCase()}</span>
            <span>{safeName}</span>
          </div>
        </div>
      )}

      <header className={`bppExploreIntro v0102Intro ${embedded ? 'embedded' : ''}`}>
        <div>
          <span className="exploreKickerV06">{embedded ? 'EXPLORE MORE' : 'EXPLORE'}</span>
          <h1>{embedded ? 'What else would you like to try?' : 'What sounds fun to try?'}</h1>
          <p>
            Follow your curiosity. Trying something is how you discover
            what feels interesting to you.
          </p>
        </div>

        <div className="bppExploreSpark" aria-hidden="true">
          <span>✨</span>
          <strong>Pick. Try. Notice.</strong>
        </div>
      </header>

      {bestMatch && (
        <ExploreSection
          number="1"
          label="PICKED FOR YOU"
          helper="Based on clues we've learned about you"
          className="picked"
        >
          <div className="v0102PickedGrid">
            <article className={`v0102BestCard bppTheme${getThemeClass(bestMatch.id)}`}>
              <div className="v0102BestVisual" aria-hidden="true">
                <span className="bppBestBadge">BEST MATCH</span>
                <div className="v0102HeroEmoji">{bestMatch.emoji || '✨'}</div>
              </div>

              <div className="v0102BestContent">
                <span className="bppTinyLabel">A GOOD PLACE TO START</span>
                <h2>{bestMatch.title}</h2>
                <p>{getDescription(bestMatch)}</p>

                {bestMatch.reasons?.length > 0 && (
                  <div className="v0102Why">
                    <span>✨</span>
                    <span><strong>Why this?</strong> {bestMatch.reasons[0]}</span>
                  </div>
                )}

                <ExperienceAction
                  id={bestMatch.id}
                  canStart={canStart(bestMatch.id)}
                  completed={isCompleted(bestMatch.id)}
                  onStartAdventure={onStartAdventure}
                  primary
                />
              </div>
            </article>

            {moreForYou.length > 0 && (
              <div className="v0102MoreForYou">
                <span className="exploreKickerV06">MORE FOR YOU</span>
                {moreForYou.map((item) => (
                  <ExperienceTile
                    key={item.id}
                    item={item}
                    canStart={canStart(item.id)}
                    completed={isCompleted(item.id)}
                    onStartAdventure={onStartAdventure}
                  />
                ))}
              </div>
            )}
          </div>
        </ExploreSection>
      )}

      <div className="v0102TwinSections">
        <ExploreSection
          number="2"
          label="CONTINUE GROWING"
          helper="Build on what you've already tried"
          className="continue"
        >
          {continueGrowing.length > 0 ? (
            <div className="v0102CompactGrid">
              {continueGrowing.map((item) => (
                <ExperienceTile
                  key={item.id}
                  item={item}
                  canStart={canStart(item.id)}
                  completed
                  onStartAdventure={onStartAdventure}
                  continueMode
                />
              ))}
            </div>
          ) : (
            <div className="v0102EmptyState">
              <span>🌱</span>
              <div>
                <strong>Your next step will appear here.</strong>
                <p>Once you try an experience, SynapStride can help you build on it.</p>
              </div>
            </div>
          )}
        </ExploreSection>

        <ExploreSection
          number="3"
          label="TRY SOMETHING DIFFERENT"
          helper="Step outside your usual picks"
          className="different"
        >
          <div className="v0102CompactGrid">
            {trySomethingDifferent.map((item) => (
              <ExperienceTile
                key={item.id}
                item={item}
                canStart={canStart(item.id)}
                completed={isCompleted(item.id)}
                onStartAdventure={onStartAdventure}
              />
            ))}
          </div>
        </ExploreSection>
      </div>

      <ExploreSection
        number="4"
        label="EXPLORE NEAR YOU"
        helper="Real-world places and programs that can deepen an interest"
        className="nearby"
      >
        <div className="v0102NearbyNote">
          <span>📍 Phoenix-area prototype</span>
          <small>Curated preview · live local discovery comes next</small>
        </div>

        <div className="v0102NearbyGrid">
          {localOpportunityPreview.map((item) => (
            <article className="v0102NearbyCard" key={item.id}>
              <div className="v0102NearbyEmoji" aria-hidden="true">{item.emoji}</div>
              <div>
                <span className="v0102OpportunityType">{item.label}</span>
                <h3>{item.title}</h3>
                <strong>{item.provider?.name}</strong>
                <p>{item.description}</p>
              </div>
              <button
                type="button"
                className="v0103SaveOpportunity"
                disabled={growthActivities.some(
                  (activity) => activity.opportunityId === item.id
                )}
                onClick={() => onSaveGrowthOpportunity?.(item)}
              >
                {growthActivities.some(
                  (activity) => activity.opportunityId === item.id
                )
                  ? '✓ Added to Activities'
                  : '+ Add to Activities'}
              </button>
            </article>
          ))}
        </div>
      </ExploreSection>

      <aside className="bppExploreReassurance v0102Reassurance">
        <span aria-hidden="true">💡</span>
        <p>
          <strong>You're not choosing a career.</strong>{' '}
          You're trying things, noticing what feels interesting,
          and learning more about yourself.
        </p>
      </aside>
    </section>
  )
}


function EmbeddedExploreMoreV0104D({
  bestMatch,
  moreForYou = [],
  continueGrowing = [],
  trySomethingDifferent = [],
  localOpportunityPreview = [],
  growthActivities = [],
  onSaveGrowthOpportunity,
  onStartAdventure,
}) {
  const added = (id) => growthActivities.some((activity) => activity.opportunityId === id)
  const saveExperience = (item) => onSaveGrowthOpportunity?.({
    ...item,
    type: item.type || 'experience',
    description: getDescription(item),
    metadata: { ...(item.metadata || {}), source: 'explore_more' },
  })
  const groups = [
    { key: 'picked', title: 'Picked for You', helper: 'A strong match for what we know so far', tone: 'purple', items: [bestMatch, ...moreForYou].filter(Boolean).slice(0, 3) },
    { key: 'keep', title: 'Keep Exploring', helper: 'Build on things you’ve already enjoyed', tone: 'green', items: continueGrowing.length ? continueGrowing : [bestMatch].filter(Boolean) },
    { key: 'new', title: 'Try Something New', helper: 'A few ideas outside your usual picks', tone: 'orange', items: trySomethingDifferent.slice(0, 3) },
    { key: 'near', title: 'Near You', helper: 'Real-world places and programs nearby', tone: 'blue', items: localOpportunityPreview.slice(0, 4) },
  ]
  return (
    <section className="iaExploreMoreV0104D">
      <header className="iaExploreIntroV0104D"><div><span className="exploreKickerV06">EXPLORE MORE</span><h2>What would you like to try next?</h2><p>Ideas picked around what you’re interested in, what you’ve tried, and what might be fun to explore next.</p></div><button type="button" className="iaHowV0104D">How we suggest ideas ⓘ</button></header>
      <div className="iaExploreGroupsV0104D">
        {groups.map((group) => (
          <section className={`iaExploreGroupV0104D ${group.tone}`} key={group.key}>
            <div className="iaExploreGroupHeadV0104D"><div><strong>{group.title}</strong><small>{group.helper}</small></div><button type="button">See all →</button></div>
            <div className="iaExploreCardRowV0104D">
              {group.items.map((item) => (
                <article className="iaExploreCardV0104D" key={`${group.key}-${item.id}`}>
                  <span className="iaExploreEmojiV0104D">{item.emoji || '✨'}</span>
                  <div className="iaExploreCardCopyV0104D"><strong>{item.title}</strong>{item.provider?.name && <small>{item.provider.name}</small>}<p>{getDescription(item)}</p></div>
                  <button type="button" className="iaAddActivityV0104D" disabled={added(item.id)} onClick={() => saveExperience(item)}>{added(item.id) ? '✓ Added to Activities' : '+ Add to Activities'}</button>
                  {item.id === 'robotics' && <button type="button" className="iaStartNowV0104D" onClick={() => onStartAdventure?.(item.id)}>Start now →</button>}
                </article>
              ))}
              {group.items.length === 0 && <div className="iaExploreEmptyV0104D">More ideas will appear as SynapStride learns what you enjoy.</div>}
            </div>
          </section>
        ))}
      </div>
      <aside className="iaExploreTipV0104D">💡 <strong>Tip:</strong> Try something new, keep what you love, and notice what makes you curious.</aside>
    </section>
  )
}

function ExploreSection({
  number,
  label,
  helper,
  className = '',
  children,
}) {
  return (
    <section className={`v0102Section ${className}`}>
      <div className="v0102SectionHeading">
        <span>{number}. {label}</span>
        <small>{helper}</small>
      </div>
      {children}
    </section>
  )
}

function ExperienceTile({
  item,
  canStart,
  completed,
  onStartAdventure,
  continueMode = false,
}) {
  return (
    <article className={`v0102ExperienceTile bppTheme${getThemeClass(item.id)}`}>
      <div className="v0102TileIcon" aria-hidden="true">
        {item.emoji || '🔎'}
      </div>

      <div className="v0102TileCopy">
        <div className="bppRowTitle">
          <h3>{item.title}</h3>
          {completed && <span className="bppTried">Tried</span>}
        </div>
        <p>{getDescription(item)}</p>

        {item.reasons?.length > 0 && (
          <small className="v0102Reason">{item.reasons[0]}</small>
        )}

        <ExperienceAction
          id={item.id}
          canStart={canStart}
          completed={completed}
          onStartAdventure={onStartAdventure}
          compact
          continueMode={continueMode}
        />
      </div>
    </article>
  )
}

function ExperienceAction({
  id,
  canStart,
  completed,
  onStartAdventure,
  compact = false,
  primary = false,
  continueMode = false,
}) {
  if (!canStart) {
    return (
      <button
        type="button"
        className={`bppExploreAction bppExploreActionDisabled ${compact ? 'compact' : ''} ${primary ? 'primary' : ''}`}
        disabled
      >
        Coming soon
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`bppExploreAction ${compact ? 'compact' : ''} ${primary ? 'primary' : ''}`}
      onClick={() => onStartAdventure(id)}
    >
      {continueMode ? 'Keep Going' : completed ? 'Explore Again' : 'Let’s Try It'}
      <span>→</span>
    </button>
  )
}

function getDescription(item = {}) {
  return item.description || item.intro || 'Try this experience and see what feels interesting.'
}

function getThemeClass(id = '') {
  if (id.includes('robot')) return 'Robot'
  if (id.includes('body') || id.includes('health')) return 'Health'
  if (id.includes('story') || id.includes('creative')) return 'Creative'
  if (id.includes('nature') || id.includes('animal')) return 'Nature'
  if (id.includes('music')) return 'Creative'
  if (id.includes('science') || id.includes('space')) return 'Science'
  return 'Default'
}

export default AdventuresHub
