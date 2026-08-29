// ============================================================
// SynapStride
// MVP v0.9 — Profile
//
// Profile answers: "What are we learning about me?"
// Presentation-only. Evidence, inference, scoring and persistence
// remain owned by the intelligence layer and App.jsx.
// ============================================================

function confidenceLabel(level) {
  switch (level) {
    case 'strong':
      return 'Showing up often'
    case 'developing':
      return 'Getting clearer'
    case 'emerging':
      return 'Starting to show'
    default:
      return 'Worth exploring'
  }
}


function evidenceSummaryCopy(item) {
  const evidenceCount = item?.evidenceCount || 0
  const experienceCount = item?.experienceCount || 0
  const sourceTypeCount = item?.sourceTypeCount || 0

  if (!evidenceCount) {
    return 'We need a little more experience before saying more.'
  }

  if (sourceTypeCount > 1 && experienceCount > 1) {
    return `We’ve noticed this ${evidenceCount} times across different experiences and perspectives.`
  }

  if (sourceTypeCount > 1) {
    return `More than one kind of perspective is pointing in this direction.`
  }

  if (experienceCount > 1) {
    return `This has shown up across more than one experience.`
  }

  return `This is based on ${evidenceCount} early clue${evidenceCount === 1 ? '' : 's'} so far.`
}


function SignalCard({ item, type = 'trait' }) {
  return (
    <article className="synProfileSignalV09">
      <div
        className={
          type === 'domain'
            ? 'synProfileSignalIconV09 domain'
            : 'synProfileSignalIconV09'
        }
      >
        {item.emoji || '✨'}
      </div>

      <div className="synProfileSignalBodyV09">
        <div className="synProfileSignalTopV09">
          <h3>{item.label}</h3>

          <span className="synProfileStageV09">
            {confidenceLabel(item.confidence?.level)}
          </span>
        </div>

        <p>{evidenceSummaryCopy(item)}</p>
      </div>
    </article>
  )
}


function GrowthProfileView({
  childName,
  profile,
  topTraits = [],
  topDomains = [],
  topPathways = [],
  promotedPatterns = [],
  parentPerspectiveComplete = false,
  completedExplorations = [],
  onExploreAdventures,
}) {
  const safeName = childName || 'Explorer'
  const evidenceSummary = profile?.evidenceSummary || {}

  const hasProfileSignals =
    topTraits.length > 0 ||
    topDomains.length > 0 ||
    promotedPatterns.length > 0

  const discoveryActive = Boolean(profile)
  const journeyActive = completedExplorations.length > 0
  const parentActive = parentPerspectiveComplete

  return (
    <section className="synProfileV09">

      <header className="synProfileHeroV09">
        <div>
          <span className="synProfileEyebrowV09">
            PROFILE
          </span>

          <h1>
            What are we learning about you, {safeName}?
          </h1>

          <p>
            Your Profile is an evolving picture — built from what you tell
            SynapStride, what you choose to try, how you reflect, and what
            people who know you notice over time.
          </p>
        </div>

        <div className="synProfileHeroMarkV09" aria-hidden="true">
          <span>🌱</span>
          <strong>Always evolving</strong>
        </div>
      </header>


      <section className="synProfileSourceStripV09">
        <div className={discoveryActive ? 'active' : ''}>
          <span>🧭</span>
          <strong>What you tell us</strong>
          <small>Discover</small>
        </div>

        <div className={journeyActive ? 'active' : ''}>
          <span>🚀</span>
          <strong>What you try</strong>
          <small>Journey</small>
        </div>

        <div className={parentActive ? 'active' : ''}>
          <span>👨‍👩‍👦</span>
          <strong>What parents notice</strong>
          <small>Parent View</small>
        </div>
      </section>


      {!hasProfileSignals ? (
        <section className="synProfileEmptyV09">
          <span>🌱</span>

          <div>
            <span className="synProfileEyebrowV09">
              JUST GETTING STARTED
            </span>

            <h2>Your Profile will grow with you.</h2>

            <p>
              Tell us more in Discover, try something in Explore,
              and reflect on what happens in Journey.
            </p>
          </div>
        </section>
      ) : (
        <>
          <section className="synProfileSectionV09">
            <div className="synProfileSectionHeadingV09">
              <div>
                <span className="synProfileEyebrowV09">
                  WHAT WE’RE NOTICING
                </span>

                <h2>Ways you seem to approach the world</h2>
              </div>

              <p>
                These are emerging patterns, not permanent labels.
                They can strengthen, change, or fade as you grow.
              </p>
            </div>

            {topTraits.length > 0 ? (
              <div className="synProfileSignalGridV09">
                {topTraits.slice(0, 4).map((trait) => (
                  <SignalCard
                    key={trait.id}
                    item={trait}
                  />
                ))}
              </div>
            ) : (
              <div className="synProfileQuietEmptyV09">
                Keep exploring to reveal more patterns.
              </div>
            )}
          </section>


          <section className="synProfileSectionV09">
            <div className="synProfileSectionHeadingV09">
              <div>
                <span className="synProfileEyebrowV09">
                  WHAT SPARKS CURIOSITY
                </span>

                <h2>Things that keep catching your attention</h2>
              </div>

              <p>
                Curiosity can move around. We pay attention to what
                keeps pulling you back over time.
              </p>
            </div>

            {topDomains.length > 0 ? (
              <div className="synProfileDomainGridV09">
                {topDomains.slice(0, 4).map((domain) => (
                  <SignalCard
                    key={domain.id}
                    item={domain}
                    type="domain"
                  />
                ))}
              </div>
            ) : (
              <div className="synProfileQuietEmptyV09">
                More experiences will help us see where your curiosity shows up.
              </div>
            )}
          </section>
        </>
      )}


      <section className="synProfileEvidenceV09">
        <div className="synProfileSectionHeadingV09">
          <div>
            <span className="synProfileEyebrowV09">
              WHY WE THINK THIS
            </span>

            <h2>Different clues build one picture</h2>
          </div>

          <p>
            A pattern becomes more meaningful when different sources
            begin pointing in a similar direction.
          </p>
        </div>

        <div className="synProfileEvidenceCardsV09">
          <article className={discoveryActive ? 'active' : ''}>
            <span>🧭</span>
            <div>
              <strong>What you told us</strong>
              <p>Your interests, preferences, and Discover answers.</p>
            </div>
          </article>

          <article className={journeyActive ? 'active' : ''}>
            <span>🚀</span>
            <div>
              <strong>What you actually tried</strong>
              <p>Your choices, challenges, enjoyment, and reflections.</p>
            </div>
          </article>

          <article className={parentActive ? 'active' : ''}>
            <span>👨‍👩‍👦</span>
            <div>
              <strong>What parents noticed</strong>
              <p>Another perspective from everyday life.</p>
            </div>
          </article>
        </div>
      </section>


      {topPathways.length > 0 && (
        <section className="synProfileSectionV09">
          <div className="synProfileSectionHeadingV09">
            <div>
              <span className="synProfileEyebrowV09">
                WORTH EXPLORING
              </span>

              <h2>Directions that may be interesting to try</h2>
            </div>

            <p>
              These are ideas for exploration — not predictions about your future.
            </p>
          </div>

          <div className="synProfilePathwayGridV09">
            {topPathways.slice(0, 2).map((pathway) => (
              <article
                className="synProfilePathwayV09"
                key={pathway.id}
              >
                <div className="synProfilePathwayIconV09">
                  {pathway.emoji || '✨'}
                </div>

                <div>
                  <h3>{pathway.label}</h3>
                  <p>
                    Try a few experiences here and see what feels interesting,
                    energizing, or worth learning more about.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}


      <section className="synProfileNextV09">
        <div>
          <span className="synProfileEyebrowV09">
            KEEP DISCOVERING
          </span>

          <h2>
            The clearest picture comes from trying, noticing, and reflecting.
          </h2>

          <p>
            A new experience can strengthen what we’re seeing,
            reveal something new, or change an earlier idea.
          </p>
        </div>

        <button
          type="button"
          className="synProfileActionV09"
          onClick={onExploreAdventures}
        >
          Explore something new
          <span>→</span>
        </button>
      </section>


      <details className="synProfileDetailsV09">
        <summary>How much information is shaping this Profile?</summary>

        <div className="synProfileStatsV09">
          <div>
            <strong>{evidenceSummary.eventCount || 0}</strong>
            <span>clues collected</span>
          </div>

          <div>
            <strong>{evidenceSummary.experienceCount || 0}</strong>
            <span>experiences represented</span>
          </div>

          <div>
            <strong>{evidenceSummary.sourceTypeCount || 0}</strong>
            <span>kinds of input</span>
          </div>
        </div>
      </details>

    </section>
  )
}


export default GrowthProfileView
