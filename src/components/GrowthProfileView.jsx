import './GrowthProfileView.css'
import './AvatarV014.css'
import Avatar from './Avatar'
import AvatarPicker from './AvatarPicker'

// ============================================================
// SynapStride
// MVP v0.11 — Phase 11.7
// Holistic Profile Story
//
// Presentation-only.
// The Profile presents ONE evolving interpretation of the child.
// Source provenance remains distinct underneath the story.
// ============================================================

function safeArray(value) {
  return Array.isArray(value) ? value : []
}

function itemLabel(item) {
  return item?.label || item?.name || item?.title || item?.id || null
}

function uniqueLabels(items = [], limit = 3) {
  return [...new Set(
    safeArray(items)
      .map(itemLabel)
      .filter(Boolean)
  )].slice(0, limit)
}

function naturalJoin(values = []) {
  const items = safeArray(values).filter(Boolean)

  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`

  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`
}

function buildIntegratedStory({
  discover = [],
  patterns = [],
  traits = [],
  domains = [],
  pathways = [],
  recommendations = [],
}) {
  const childVoice =
    uniqueLabels(discover, 2)

  const noticing =
    uniqueLabels(
      patterns.length
        ? patterns
        : traits,
      2
    )

  const curiosity =
    uniqueLabels(domains, 2)

  const direction =
    uniqueLabels(
      recommendations.length
        ? recommendations
        : pathways,
      2
    )

  const hasAny =
    childVoice.length ||
    noticing.length ||
    curiosity.length ||
    direction.length

  if (!hasAny) {
    return {
      headline:
        'Your story is just getting started.',
      narrative:
        'Tell SynapStride a little about yourself, then keep trying, learning, and reflecting. Over time, we will connect those clues into a clearer picture.',
      connection:
        'Nothing here is a permanent label. New experiences can strengthen, change, or challenge what we think we understand.',
      noticing,
      curiosity,
      direction,
    }
  }

  let headline =
    'A few parts of your story are beginning to connect.'

  if (noticing.length && curiosity.length) {
    headline =
      `${naturalJoin(noticing)} ${noticing.length === 1 ? 'is' : 'are'} beginning to show up around ${naturalJoin(curiosity)}.`
  } else if (noticing.length) {
    headline =
      `${naturalJoin(noticing)} ${noticing.length === 1 ? 'is' : 'are'} beginning to show up in how you approach things.`
  } else if (curiosity.length) {
    headline =
      `${naturalJoin(curiosity)} keeps showing up as something worth understanding better.`
  }

  const narrativeParts = []

  if (childVoice.length) {
    narrativeParts.push(
      `You have told us things like “${childVoice.join('” and “')}.”`
    )
  }

  if (noticing.length) {
    narrativeParts.push(
      `Across the clues we have so far, we are also beginning to notice ${naturalJoin(noticing).toLowerCase()}.`
    )
  }

  if (curiosity.length) {
    narrativeParts.push(
      `${naturalJoin(curiosity)} ${curiosity.length === 1 ? 'seems' : 'seem'} to keep pulling your attention.`
    )
  }

  const narrative =
    narrativeParts.join(' ') ||
    'We are beginning to connect what you say, what you try, and what shows up over time.'

  const connection = direction.length
    ? `That does not predict your future. It simply makes ${naturalJoin(direction)} ${direction.length === 1 ? 'a useful direction' : 'useful directions'} to explore next and learn from.`
    : 'We do not have enough evidence yet to push you toward a particular direction — and that is completely fine. More real experiences will make the picture clearer.'

  return {
    headline,
    narrative,
    connection,
    noticing,
    curiosity,
    direction,
  }
}

function StorySignal({
  icon,
  eyebrow,
  title,
  values = [],
  emptyCopy,
}) {
  const labels = uniqueLabels(values, 3)

  return (
    <div className="synProfileSignalRowV0117">
      <div className="synProfileSignalIconV0117">
        {icon}
      </div>

      <div className="synProfileSignalCopyV0117">
        <span>{eyebrow}</span>
        <strong>{title}</strong>

        {labels.length ? (
          <p>{naturalJoin(labels)}</p>
        ) : (
          <p className="muted">{emptyCopy}</p>
        )}
      </div>
    </div>
  )
}

function GrowthProfileView({
  childName,
  childProfile = null,
  onAvatarChange = null,
  profile,
  topTraits = [],
  topDomains = [],
  topPathways = [],
  promotedPatterns = [],
  parentPerspectiveComplete = false,
  completedExplorations = [],
  profileUnderstanding = null,
  profileGrowthSource = null,
  adaptiveAboutMe = null,
  onReflectionResponse = null,
  onContinueDiscover = null,
  onExploreAdventures,
}) {
  const safeName =
    childName || 'Explorer'

  const evidenceSummary =
    profile?.evidenceSummary || {}

  const understanding =
    profileUnderstanding ||
    profile?.profileUnderstanding ||
    profile?.understanding?.profileUnderstanding ||
    null

  const statedDiscover =
    safeArray(
      understanding?.stated?.discover
    )

  const storyTraits =
    safeArray(
      understanding?.derived?.traits
    ).length
      ? understanding.derived.traits
      : topTraits

  const storyDomains =
    safeArray(
      understanding?.derived?.domains
    ).length
      ? understanding.derived.domains
      : topDomains

  const storyPathways =
    safeArray(
      understanding?.derived?.pathways
    ).length
      ? understanding.derived.pathways
      : topPathways

  const storyPatterns =
    safeArray(
      understanding?.observed?.promotedPatterns
    ).length
      ? understanding.observed.promotedPatterns
      : promotedPatterns

  const recommendationItems =
    safeArray(
      understanding?.recommended?.items
    )

  const story =
    buildIntegratedStory({
      discover:
        statedDiscover,

      patterns:
        storyPatterns,

      traits:
        storyTraits,

      domains:
        storyDomains,

      pathways:
        storyPathways,

      recommendations:
        recommendationItems,
    })

  const journeyCount =
    understanding
      ?.sources
      ?.journeyContributionCount ??
    completedExplorations.length

  const parentCount =
    understanding
      ?.sources
      ?.parentContributionCount ??
    (
      parentPerspectiveComplete
        ? 1
        : 0
    )

  const discoverCount =
    understanding
      ?.sources
      ?.discoveryContributionCount ??
    statedDiscover.length

  const evidenceCount =
    evidenceSummary.eventCount || 0

  const hasProfileStory =
    story.noticing.length > 0 ||
    story.curiosity.length > 0 ||
    story.direction.length > 0

  return (
    <section className="synProfileV011 synProfileV0117">

      <header className="synProfileHeroV011 synProfileHeroV0117 ssLegacyProfileV01671">
        <div>
          <span className="synProfileEyebrowV011">
            ABOUT ME
          </span>

          <div className="synProfileHeroIdentityV014">
            <Avatar avatarId={childProfile?.avatarId} size={64} />
            <h1>
              Hi {safeName}. This is you — so far.
            </h1>
          </div>

          <p>
            SynapStride connects what you tell us, what you try,
            what you learn, and what trusted people notice —
            without turning any one clue into a label.
          </p>
        </div>

        <div
          className="synProfileHeroMarkV011"
          aria-hidden="true"
        >
          <span>🌱</span>
          <strong>Always evolving</strong>
        </div>
      </header>


      {profileGrowthSource === 'parent' ? (
        <div className="synProfileUpdateNoticeV0117 ssLegacyProfileV01671">
          <span>👨‍👩‍👦</span>
          <p>
            <strong>Your Profile has another perspective.</strong>
            {' '}
            A parent observation was added to the same evolving picture.
          </p>
        </div>
      ) : null}


      <section className="ssAboutLivingV018">
        <header className="ssAboutHeroV018">
          <div className="ssAboutHeroPersonV018">
            <Avatar avatarId={childProfile?.avatarId} size={92} />
            <div>
              <span className="synProfileEyebrowV011">✨ ABOUT ME</span>
              <h1>About Me</h1>
              <p>This is me — and I’m always growing!</p>
              <div className="ssAboutIntroBubbleV018">
                <strong>I’m {safeName}!</strong>
                <span>
                  {statedDiscover.length
                    ? `I’m into ${naturalJoin(uniqueLabels(statedDiscover, 2))}, and I’m learning new things about myself.`
                    : 'I’m discovering what I enjoy, how I learn, and what I want to try next.'}
                </span>
              </div>
            </div>
          </div>
          <div className="ssAboutGrowingV018">
            <span>🌱</span>
            <strong>Always growing</strong>
            <small>Clues, not labels</small>
          </div>
        </header>

        <div className="ssAboutPrimaryCardsV018">
          <article className="ssAboutPrimaryCardV018 ssAboutInterestsV018">
            <div className="ssAboutBigIconV018">❤️</div>
            <h2>What I’m Into</h2>
            <p>Things I love and enjoy</p>
            <div className="ssAboutMiniChipsV018">
              {uniqueLabels(statedDiscover, 3).map((label) => <span key={label}>{label}</span>)}
              {!statedDiscover.length ? <span>Tell me what you like</span> : null}
            </div>
            {onContinueDiscover ? (
              <button type="button" onClick={onContinueDiscover}>
                {discoverCount ? 'See my interests' : 'Add my interests'} →
              </button>
            ) : null}
          </article>

          <article className="ssAboutPrimaryCardV018 ssAboutNoticingV018">
            <div className="ssAboutBigIconV018">✨</div>
            <h2>What SynapStride Is Noticing</h2>
            <p>New things I might like</p>
            <div className="ssAboutNoticeCountV018">
              {(adaptiveAboutMe?.candidates || []).length
                ? `${adaptiveAboutMe.candidates.length} new ${adaptiveAboutMe.candidates.length === 1 ? 'insight' : 'insights'}`
                : 'Still learning about me'}
            </div>
            <a href="#syn-about-noticing">Check it out →</a>
          </article>

          <article className="ssAboutPrimaryCardV018 ssAboutGrowthV018">
            <div className="ssAboutBigIconV018">🌱</div>
            <h2>How I’m Growing</h2>
            <p>My strengths and progress</p>
            <div className="ssAboutGrowthBarsV018" aria-hidden="true">
              <i></i><i></i><i></i><i></i>
            </div>
            <a href="#syn-about-growth">See my growth →</a>
          </article>
        </div>

        <section className="ssAboutInteractiveV018" id="syn-about-noticing">
          <div className="ssAboutSectionHeadingV018">
            <span>✨</span>
            <div>
              <h2>What SynapStride Is Noticing</h2>
              <p>I’ll share one clue at a time. You decide whether it feels like you.</p>
            </div>
          </div>

          {(adaptiveAboutMe?.candidates || []).length ? (
            <div className="ssAboutInsightV018">
              <small>Something I noticed</small>
              <h3>{adaptiveAboutMe.candidates[0].statement}</h3>
              <p>Does that sound right?</p>
              <div className="ssAboutReactionRowV018">
                <button type="button" onClick={() => onReflectionResponse?.(adaptiveAboutMe.candidates[0], 'confirmed')}>👍 That’s me</button>
                <button type="button" onClick={() => onReflectionResponse?.(adaptiveAboutMe.candidates[0], 'maybe')}>🤔 Kind of</button>
                <button type="button" onClick={() => onReflectionResponse?.(adaptiveAboutMe.candidates[0], 'rejected')}>👎 Not really</button>
              </div>
            </div>
          ) : (
            <div className="ssAboutInsightEmptyV018">
              <span>🔎</span>
              <div>
                <strong>I’m still getting to know you.</strong>
                <p>Keep exploring, asking questions and trying things. I’ll share a clue when I notice something worth checking with you.</p>
              </div>
            </div>
          )}

          {(adaptiveAboutMe?.outcomes || []).some((item) => item?.response === 'confirmed') ? (
            <div className="ssAboutConfirmedV018">
              <strong>💛 Things you said feel like you</strong>
              <div className="ssAboutMiniChipsV018">
                {adaptiveAboutMe.outcomes
                  .filter((item) => item?.response === 'confirmed' && item?.statement)
                  .slice(-3)
                  .map((item) => <span key={item.id || item.candidateId}>{item.statement}</span>)}
              </div>
            </div>
          ) : null}
        </section>

        <section className="ssAboutGrowthPanelV018" id="syn-about-growth">
          <div className="ssAboutSectionHeadingV018">
            <span>🌱</span>
            <div>
              <h2>How I’m Growing</h2>
              <p>Strengths and skills that are showing up over time.</p>
            </div>
          </div>
          {storyPatterns.length || storyTraits.length ? (
            <div className="ssAboutStrengthGridV018">
              {uniqueLabels(storyPatterns.length ? storyPatterns : storyTraits, 4).map((label, index) => (
                <article key={label}>
                  <span>{['💡','🧩','🚩','🎨'][index] || '⭐'}</span>
                  <strong>{String(label).replaceAll('_', ' ')}</strong>
                  <p>{index % 2 === 0 ? 'This has shown up in things you’ve tried.' : 'I’m seeing this pattern more than once.'}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="ssAboutSimpleEmptyV018">Your growth story will appear here as you try, learn, finish and reflect.</p>
          )}
        </section>

        <section className="ssAboutNextV018">
          <div>
            <span>🧭</span>
            <div>
              <strong>Let’s Explore What’s Next!</strong>
              <p>Find activities, projects and ideas based on what you’re into and what I’m noticing.</p>
            </div>
          </div>
          {onExploreAdventures ? <button type="button" onClick={onExploreAdventures}>Explore Ideas →</button> : null}
        </section>

        <div className="ssAboutUtilityRowV018">
          {onContinueDiscover ? <button type="button" onClick={onContinueDiscover}>✏️ Change something about me</button> : null}
          {onAvatarChange ? (
            <details className="ssAboutAvatarV018">
              <summary>🙂 Change my avatar</summary>
              <AvatarPicker compact age={childProfile?.age} value={childProfile?.avatarId} onChange={onAvatarChange}/>
            </details>
          ) : null}
        </div>
      </section>

      <section className="synProfileAboutV011 synProfileAboutV0117 ssLegacyProfileV01671">
        <div className="synProfileAboutIntroV011">
          <span className="synProfileEyebrowV011">
            IN YOUR OWN WORDS
          </span>

          <h2>
            Things you&apos;ve told SynapStride about yourself
          </h2>
        </div>

        {statedDiscover.length > 0 ? (
          <div className="synProfileAboutChipsV011">
            {statedDiscover
              .slice(0, 4)
              .map((item) => (
                <span
                  className="synProfileAboutChipV011"
                  key={
                    item?.questionId ||
                    item?.id ||
                    item?.label
                  }
                >
                  {item.label}
                </span>
              ))}
          </div>
        ) : (
          <p className="synProfileAboutEmptyV011">
            Tell SynapStride a little about yourself.
            Your answers become part of this evolving Profile.
          </p>
        )}

        {onContinueDiscover ? (
          <button
            type="button"
            className="synProfileSecondaryActionV011"
            onClick={onContinueDiscover}
          >
            {discoverCount
              ? 'Tell us more'
              : 'Start Discover'}
            <span>→</span>
          </button>
        ) : null}
      </section>

      {onAvatarChange ? (
        <details className="synProfileAvatarEditV014 ssLegacyProfileV01671">
          <summary>Change my avatar</summary>
          <AvatarPicker
            compact
            age={childProfile?.age}
            value={childProfile?.avatarId}
            onChange={onAvatarChange}
          />
        </details>
      ) : null}


      <section className="synProfileStoryV011 synProfileStoryV0117 ssLegacyProfileV01671">
        <div className="synProfileStoryLeadV011 synProfileStoryLeadV0117">
          <span className="synProfileEyebrowV011">
            YOUR STORY SO FAR
          </span>

          <h2>{story.headline}</h2>

          <p className="synProfileStoryNarrativeV0117">
            {story.narrative}
          </p>

          <p className="synProfileStoryConnectionV0117">
            {story.connection}
          </p>
        </div>

        <div className="synProfileSignalsV0117">
          <StorySignal
            icon="🌱"
            eyebrow="HOW YOU SEEM TO ENGAGE"
            title="Patterns beginning to show"
            values={
              storyPatterns.length
                ? storyPatterns
                : storyTraits
            }
            emptyCopy="We need more real-world clues before calling out a pattern."
          />

          <StorySignal
            icon="🔎"
            eyebrow="WHAT KEEPS PULLING YOU IN"
            title="Curiosity taking shape"
            values={storyDomains}
            emptyCopy="More exploration will help reveal recurring areas of interest."
          />

          <StorySignal
            icon="🧭"
            eyebrow="WHERE TO LEARN MORE NEXT"
            title="Useful directions to explore"
            values={
              recommendationItems.length
                ? recommendationItems
                : storyPathways
            }
            emptyCopy="We are not ready to suggest a direction yet — keep exploring."
          />
        </div>

        {!hasProfileStory ? (
          <div className="synProfileStartingV011">
            <span>✨</span>
            <p>
              Your Profile gets clearer through real experiences,
              reflection, learning, and multiple perspectives.
            </p>
          </div>
        ) : null}
      </section>


      <section className="synProfileEvidenceV0117 ssLegacyProfileV01671">
        <div>
          <span className="synProfileEyebrowV011">
            WHY THIS PICTURE IS TAKING SHAPE
          </span>

          <h2>
            One story, built from different kinds of clues
          </h2>

          <p>
            SynapStride keeps each source separate behind the scenes
            so agreement, differences, and change over time stay visible.
          </p>
        </div>

        <div className="synProfileEvidenceSummaryV0117">
          <div className={discoverCount ? 'active' : ''}>
            <span>🧭</span>
            <strong>Your voice</strong>
            <small>
              {discoverCount
                ? `${discoverCount} Discover clue${discoverCount === 1 ? '' : 's'}`
                : 'Not added yet'}
            </small>
          </div>

          <div className={parentCount ? 'active' : ''}>
            <span>👨‍👩‍👦</span>
            <strong>Parent observations</strong>
            <small>
              {parentCount
                ? `${parentCount} observation${parentCount === 1 ? '' : 's'}`
                : 'Not added yet'}
            </small>
          </div>

          <div className={journeyCount ? 'active' : ''}>
            <span>🚀</span>
            <strong>What you&apos;ve done</strong>
            <small>
              {journeyCount
                ? `${journeyCount} Journey item${journeyCount === 1 ? '' : 's'}`
                : 'Keep exploring'}
            </small>
          </div>

          <div className={evidenceCount ? 'active' : ''}>
            <span>🧩</span>
            <strong>Connected clues</strong>
            <small>
              {evidenceCount
                ? `${evidenceCount} evidence event${evidenceCount === 1 ? '' : 's'}`
                : 'Picture still forming'}
            </small>
          </div>
        </div>
      </section>


      <section className="synProfileNextV011 synProfileNextV0117">
        <div>
          <span className="synProfileEyebrowV011">
            KEEP THE STORY MOVING
          </span>

          <h2>
            The next useful clue usually comes from doing something real.
          </h2>

          <p>
            A new activity can strengthen a theme, reveal something new,
            or change an earlier idea.
          </p>
        </div>

        <button
          type="button"
          className="synProfilePrimaryActionV011"
          onClick={onExploreAdventures}
        >
          Explore something new
          <span>→</span>
        </button>
      </section>


      <details className="synProfileDetailsV011">
        <summary>
          See the evidence behind this Profile
        </summary>

        <div className="synProfileStatsV011">
          <div>
            <strong>
              {evidenceSummary.eventCount || 0}
            </strong>
            <span>clues collected</span>
          </div>

          <div>
            <strong>
              {evidenceSummary.experienceCount || 0}
            </strong>
            <span>experiences represented</span>
          </div>

          <div>
            <strong>
              {evidenceSummary.sourceTypeCount || 0}
            </strong>
            <span>kinds of input</span>
          </div>
        </div>
      </details>

    </section>
  )
}

export default GrowthProfileView
