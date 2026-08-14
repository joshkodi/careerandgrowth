// src/components/GrowthProfileView.jsx

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
      className={`growthConfidenceBadge growthConfidence-${confidence.level}`}
    >
      {confidence.label}
    </span>
  )
}


function TraitCard({
  trait,
}) {
  return (
    <article className="profileSignalCard">

      <div className="profileSignalIcon">
        {trait.emoji}
      </div>

      <div className="profileSignalBody">

        <div className="profileSignalHeading">

          <h3>
            {trait.label}
          </h3>

          <ConfidenceBadge
            confidence={
              trait.confidence
            }
          />

        </div>

        <p className="profileSignalInterpretation">
          {confidenceCopy(
            trait.confidence?.level
          )}
        </p>

        <p className="profileSignalEvidence">
          {getEvidenceCopy(trait)}
        </p>

      </div>

    </article>
  )
}


function DomainCard({
  domain,
}) {
  return (
    <article className="profileDomainRow">

      <div className="profileDomainIcon">
        {domain.emoji}
      </div>

      <div className="profileDomainBody">

        <div className="profileDomainHeading">

          <h3>
            {domain.label}
          </h3>

          <ConfidenceBadge
            confidence={
              domain.confidence
            }
          />

        </div>

        <p>
          {getEvidenceCopy(domain)}
        </p>

      </div>

    </article>
  )
}


function PathwayCard({
  pathway,
}) {
  return (
    <article className="profilePathwayCard">

      <div className="profilePathwayIcon">
        {pathway.emoji}
      </div>

      <div>

        <span className="profileSectionEyebrow">
          Worth exploring
        </span>

        <h3>
          {pathway.label}
        </h3>

        <p>
          This is an area that may be
          worth trying through more
          experiences. It is not a
          prediction about your future.
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

  return (
    <section className="growthProfileV05">

      <button
        className="backButton"
        onClick={onBack}
      >
        ← Back to {childName}'s Space
      </button>


      <header className="profileHero">

        <div>

          <p className="profileSectionEyebrow">
            My Growth Profile
          </p>

          <h1>
            What we're learning
            about you, {childName}.
          </h1>

          <p className="profileHeroLead">
            This isn't a test result or a
            label. It's an evolving picture
            built from what you tell us,
            what you try, what you enjoy,
            and what people who know you
            notice over time.
          </p>

        </div>

        <div
          className="profileHeroIcon"
          aria-hidden="true"
        >
          ✨
        </div>

      </header>


      {!hasProfileSignals && (
        <section className="profileStartingState">

          <div className="profileStartingIcon">
            🌱
          </div>

          <div>

            <span className="profileSectionEyebrow">
              Just Getting Started
            </span>

            <h2>
              Your profile will grow
              as you explore.
            </h2>

            <p>
              Try experiences, share what
              you notice, and keep telling
              us what interests you.
            </p>

          </div>

        </section>
      )}


      {hasProfileSignals && (
        <>

          <section className="profileSection">

            <div className="profileSectionHeading">

              <div>

                <p className="profileSectionEyebrow">
                  Strengths We're Noticing
                </p>

                <h2>
                  Ways you seem to
                  approach the world
                </h2>

              </div>

              <p>
                These are patterns we're
                noticing right now. They can
                strengthen, change, or fade
                as you grow.
              </p>

            </div>


            {topTraits.length > 0 ? (
              <div className="profileSignalGrid">

                {topTraits
                  .slice(0, 4)
                  .map(
                    (trait) => (
                      <TraitCard
                        key={trait.id}
                        trait={trait}
                      />
                    )
                  )}

              </div>
            ) : (
              <div className="profileEmptyState">
                Keep exploring to reveal
                more patterns.
              </div>
            )}

          </section>


          <section className="profileSection">

            <div className="profileSectionHeading">

              <div>

                <p className="profileSectionEyebrow">
                  Things That Spark Curiosity
                </p>

                <h2>
                  Areas that seem to
                  catch your attention
                </h2>

              </div>

              <p>
                Curiosity can move around.
                Exploring new areas helps us
                see what keeps pulling you
                back.
              </p>

            </div>


            {topDomains.length > 0 ? (
              <div className="profileDomainList">

                {topDomains
                  .slice(0, 4)
                  .map(
                    (domain) => (
                      <DomainCard
                        key={domain.id}
                        domain={domain}
                      />
                    )
                  )}

              </div>
            ) : (
              <div className="profileEmptyState">
                More exploration will help
                us understand where your
                curiosity shows up.
              </div>
            )}

          </section>

        </>
      )}


      <section className="profileSection profileEvidenceSection">

        <div className="profileSectionHeading">

          <div>

            <p className="profileSectionEyebrow">
              How We Learn About You
            </p>

            <h2>
              Different perspectives,
              one evolving picture
            </h2>

          </div>

          <p>
            We trust patterns more when
            different kinds of experiences
            begin pointing in similar
            directions.
          </p>

        </div>


        <div className="profileEvidenceGrid">

          <div
            className={
              profile
                ? 'profileEvidenceItem profileEvidenceItemActive'
                : 'profileEvidenceItem'
            }
          >

            <div className="profileEvidenceIcon">
              🧭
            </div>

            <div>

              <strong>
                What you tell us
              </strong>

              <p>
                Your interests, preferences,
                and Discovery answers.
              </p>

            </div>

          </div>


          <div
            className={
              parentPerspectiveComplete
                ? 'profileEvidenceItem profileEvidenceItemActive'
                : 'profileEvidenceItem'
            }
          >

            <div className="profileEvidenceIcon">
              👨‍👩‍👦
            </div>

            <div>

              <strong>
                What parents notice
              </strong>

              <p>
                Patterns seen in everyday
                life from another
                perspective.
              </p>

            </div>

          </div>


          <div
            className={
              completedExplorations.length >
              0
                ? 'profileEvidenceItem profileEvidenceItemActive'
                : 'profileEvidenceItem'
            }
          >

            <div className="profileEvidenceIcon">
              🚀
            </div>

            <div>

              <strong>
                What you actually try
              </strong>

              <p>
                Choices, enjoyment,
                challenges, and reflection
                from real experiences.
              </p>

            </div>

          </div>

        </div>


        {!profileHasMultipleSources && (
          <div className="profileEvidenceNotice">

            <span>
              🌱
            </span>

            <div>

              <strong>
                We're still building the
                picture.
              </strong>

              <p>
                Confidence grows when
                different experiences and
                perspectives begin to
                reinforce similar patterns.
              </p>

            </div>

          </div>
        )}

      </section>


      {topPathways.length > 0 && (
        <section className="profileSection">

          <div className="profileSectionHeading">

            <div>

              <p className="profileSectionEyebrow">
                Ideas Worth Trying
              </p>

              <h2>
                Areas you may want to
                explore next
              </h2>

            </div>

            <p>
              These are directions for
              exploration, not career
              predictions.
            </p>

          </div>


          <div className="profilePathwayGrid">

            {topPathways
              .slice(0, 2)
              .map(
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


      <section className="profileKeepGrowing">

        <div>

          <p className="profileSectionEyebrow">
            Keep Growing
          </p>

          <h2>
            The best way to understand
            yourself is to keep trying
            things.
          </h2>

          <p>
            New experiences can confirm
            what we're seeing, reveal
            something completely new, or
            show that an earlier pattern
            wasn't as important as it first
            seemed.
          </p>

        </div>


        <button
          className="growthPrimaryButton"
          onClick={
            onExploreAdventures
          }
        >
          Explore Something New
          <span>→</span>
        </button>

      </section>


      <details className="profileEvidenceDetails">

        <summary>
          Profile details
        </summary>

        <div className="profileEvidenceStats">

          <div>
            <strong>
              {
                evidenceSummary
                  .eventCount || 0
              }
            </strong>

            <span>
              evidence events
            </span>
          </div>


          <div>
            <strong>
              {
                evidenceSummary
                  .experienceCount || 0
              }
            </strong>

            <span>
              experiences
            </span>
          </div>


          <div>
            <strong>
              {
                evidenceSummary
                  .sourceTypeCount || 0
              }
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
