// src/components/GrowthProfileView.jsx
// ============================================================
// Career & Growth
// MVP v0.8.10B-3 — Option B++ Profile
//
// Presentation-only profile consolidation.
// Intelligence, evidence, confidence and pathway logic are preserved.
// ============================================================

import './GrowthProfileView.css'

function confidenceCopy(level) {
  switch (level) {
    case 'strong':
      return 'We’re seeing this consistently'

    case 'developing':
      return 'This pattern is becoming clearer'

    case 'emerging':
      return 'We’re beginning to notice this'

    default:
      return 'Something worth exploring'
  }
}


function getEvidenceCopy(item) {
  const evidenceCount =
    item?.evidenceCount || 0

  const experienceCount =
    item?.experienceCount || 0

  const sourceTypeCount =
    item?.sourceTypeCount || 0

  if (!evidenceCount) {
    return ''
  }

  if (
    experienceCount > 1 &&
    sourceTypeCount > 1
  ) {
    return `Supported by ${evidenceCount} observations across different experiences and perspectives.`
  }

  if (sourceTypeCount > 1) {
    return `Supported by ${evidenceCount} observations from more than one perspective.`
  }

  if (experienceCount > 1) {
    return `Supported by ${evidenceCount} observations across multiple experiences.`
  }

  return `Based on ${evidenceCount} early observations so far.`
}


function ConfidenceBadge({
  confidence,
}) {
  if (!confidence) {
    return null
  }

  return (
    <span
      className={`bppProfileConfidence bppProfileConfidence-${confidence.level}`}
    >
      {confidence.label}
    </span>
  )
}


function TraitRow({
  trait,
}) {
  return (
    <article className="bppProfileTraitRow">

      <div className="bppProfileTraitIcon">
        {trait.emoji || '✨'}
      </div>

      <div className="bppProfileTraitCopy">
        <div className="bppProfileRowTitle">
          <h3>{trait.label}</h3>

          <ConfidenceBadge
            confidence={
              trait.confidence
            }
          />
        </div>

        <p className="bppProfileInterpretation">
          {confidenceCopy(
            trait.confidence?.level
          )}
        </p>

        <small>
          {getEvidenceCopy(trait)}
        </small>
      </div>

    </article>
  )
}


function DomainRow({
  domain,
}) {
  return (
    <article className="bppProfileDomainRow">

      <div className="bppProfileDomainIcon">
        {domain.emoji || '🔎'}
      </div>

      <div className="bppProfileTraitCopy">
        <div className="bppProfileRowTitle">
          <h3>{domain.label}</h3>

          <ConfidenceBadge
            confidence={
              domain.confidence
            }
          />
        </div>

        <small>
          {getEvidenceCopy(domain)}
        </small>
      </div>

    </article>
  )
}


function PathwayCard({
  pathway,
}) {
  return (
    <article className="bppProfilePathway">

      <div className="bppProfilePathwayIcon">
        {pathway.emoji || '🌱'}
      </div>

      <div>
        <span className="bppProfileKicker">
          WORTH TRYING
        </span>

        <h3>{pathway.label}</h3>

        <p>
          A direction worth exploring through
          more experiences — not a prediction
          about your future.
        </p>
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
  parentPerspectiveComplete = false,
  completedExplorations = [],
  onBack,
  onExploreAdventures,
  developerInspector = null,
}) {
  const evidenceSummary =
    profile?.evidenceSummary || {}

  const profileHasMultipleSources =
    (
      evidenceSummary.sourceTypeCount ||
      0
    ) > 1

  const hasProfileSignals =
    topTraits.length > 0 ||
    topDomains.length > 0

  const visibleTraits =
    topTraits.slice(0, 4)

  const visibleDomains =
    topDomains.slice(0, 3)

  const visiblePathways =
    topPathways.slice(0, 2)

  return (
    <section className="bppProfile">

      <div className="bppProfileTopbar">
        <button
          type="button"
          className="bppProfileBack"
          onClick={onBack}
        >
          ← Back to {childName}'s Space
        </button>

        <span className="bppProfileMode">
          My Profile
        </span>
      </div>


      <header className="bppProfileHero">

        <div>
          <span className="bppProfileKicker">
            MY GROWTH PROFILE
          </span>

          <h1>
            Here’s what we’re learning
            about you, {childName}.
          </h1>

          <p>
            This is an evolving picture, not a label.
            It grows as you answer questions, try things,
            reflect, and get observations from people
            who know you well.
          </p>
        </div>

        <div
          className="bppProfileHeroMark"
          aria-hidden="true"
        >
          <span>✨</span>
          <strong>Still growing</strong>
        </div>

      </header>


      {!hasProfileSignals ? (
        <section className="bppProfileStarting">
          <div className="bppProfileStartingIcon">
            🌱
          </div>

          <div>
            <span className="bppProfileKicker">
              JUST GETTING STARTED
            </span>

            <h2>
              Your profile will grow as you explore.
            </h2>

            <p>
              Try experiences, share what you notice,
              and keep telling us what interests you.
            </p>
          </div>

          <button
            type="button"
            className="bppProfilePrimary"
            onClick={onExploreAdventures}
          >
            Explore Something New
            <span>→</span>
          </button>
        </section>
      ) : (
        <>

          <section className="bppProfileMainGrid">

            <article className="bppProfileSection">

              <div className="bppProfileSectionHeading">
                <div>
                  <span className="bppProfileKicker">
                    WHAT WE'RE NOTICING
                  </span>

                  <h2>
                    Strengths taking shape
                  </h2>
                </div>

                <p>
                  Patterns can strengthen, change,
                  or fade as you grow.
                </p>
              </div>

              {visibleTraits.length > 0 ? (
                <div className="bppProfileTraitList">
                  {visibleTraits.map(
                    (trait) => (
                      <TraitRow
                        key={trait.id}
                        trait={trait}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="bppProfileEmpty">
                  Keep exploring to reveal more patterns.
                </div>
              )}

            </article>


            <article className="bppProfileSection">

              <div className="bppProfileSectionHeading">
                <div>
                  <span className="bppProfileKicker">
                    WHAT SPARKS YOU
                  </span>

                  <h2>
                    Curiosity right now
                  </h2>
                </div>

                <p>
                  Curiosity can move around.
                </p>
              </div>

              {visibleDomains.length > 0 ? (
                <div className="bppProfileDomainList">
                  {visibleDomains.map(
                    (domain) => (
                      <DomainRow
                        key={domain.id}
                        domain={domain}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="bppProfileEmpty">
                  More exploration will help us see
                  where curiosity shows up.
                </div>
              )}

            </article>

          </section>


          <section className="bppProfileEvidence">

            <div className="bppProfileSectionHeading">
              <div>
                <span className="bppProfileKicker">
                  WHERE THE CLUES COME FROM
                </span>

                <h2>
                  We learn from more than one kind of moment
                </h2>
              </div>

              <p>
                Confidence grows when different experiences
                begin pointing in similar directions.
              </p>
            </div>


            <div className="bppProfileEvidenceList">

              <div
                className={
                  profile
                    ? 'bppProfileEvidenceItem active'
                    : 'bppProfileEvidenceItem'
                }
              >
                <span className="bppProfileEvidenceIcon">
                  🧒
                </span>

                <div>
                  <strong>What you tell us</strong>
                  <p>
                    Discovery answers, preferences,
                    and reflections.
                  </p>
                </div>

                <span className="bppProfileEvidenceState">
                  {profile ? '✓ Included' : 'Waiting'}
                </span>
              </div>


              <div
                className={
                  completedExplorations.length > 0
                    ? 'bppProfileEvidenceItem active'
                    : 'bppProfileEvidenceItem'
                }
              >
                <span className="bppProfileEvidenceIcon">
                  🚀
                </span>

                <div>
                  <strong>What you try</strong>
                  <p>
                    What happens when you actually
                    do an experience.
                  </p>
                </div>

                <span className="bppProfileEvidenceState">
                  {completedExplorations.length > 0
                    ? '✓ Included'
                    : 'Waiting'}
                </span>
              </div>


              <div
                className={
                  parentPerspectiveComplete
                    ? 'bppProfileEvidenceItem active'
                    : 'bppProfileEvidenceItem'
                }
              >
                <span className="bppProfileEvidenceIcon">
                  👨‍👩‍👦
                </span>

                <div>
                  <strong>What others notice</strong>
                  <p>
                    Patterns noticed by a parent
                    in everyday life.
                  </p>
                </div>

                <span className="bppProfileEvidenceState">
                  {parentPerspectiveComplete
                    ? '✓ Included'
                    : 'Waiting'}
                </span>
              </div>

            </div>


            {!profileHasMultipleSources && (
              <div className="bppProfileGrowingNote">
                <span aria-hidden="true">
                  🌱
                </span>

                <p>
                  <strong>The picture is still growing.</strong>{' '}
                  More kinds of evidence will help us
                  understand which patterns keep showing up.
                </p>
              </div>
            )}

          </section>


          {visiblePathways.length > 0 && (
            <section className="bppProfileNext">

              <div className="bppProfileNextIntro">
                <span className="bppProfileKicker">
                  WHAT COULD YOU TRY NEXT?
                </span>

                <h2>
                  Ideas worth exploring
                </h2>

                <p>
                  These are invitations to experiment,
                  not career predictions.
                </p>
              </div>

              <div className="bppProfilePathwayGrid">
                {visiblePathways.map(
                  (pathway) => (
                    <PathwayCard
                      key={pathway.id}
                      pathway={pathway}
                    />
                  )
                )}
              </div>

            </section>
          )}

        </>
      )}


      <section className="bppProfileKeepGrowing">

        <div>
          <span className="bppProfileKicker">
            KEEP GROWING
          </span>

          <h2>
            The best way to understand yourself
            is to keep trying things.
          </h2>
        </div>

        <button
          type="button"
          className="bppProfilePrimary"
          onClick={onExploreAdventures}
        >
          Explore Something New
          <span>→</span>
        </button>

      </section>


      <details className="bppProfileDetails">
        <summary>
          Profile details
        </summary>

        <div className="bppProfileStats">

          <div>
            <strong>
              {evidenceSummary.eventCount || 0}
            </strong>

            <span>
              evidence events
            </span>
          </div>

          <div>
            <strong>
              {evidenceSummary.experienceCount || 0}
            </strong>

            <span>
              experiences
            </span>
          </div>

          <div>
            <strong>
              {evidenceSummary.sourceTypeCount || 0}
            </strong>

            <span>
              evidence sources
            </span>
          </div>

        </div>
      </details>


      {developerInspector}

    </section>
  )
}


export default GrowthProfileView
