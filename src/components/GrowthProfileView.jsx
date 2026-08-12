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
    <article className="growthTraitCard">

      <div className="growthTraitTop">

        <span className="growthTraitEmoji">
          {trait.emoji}
        </span>

        <ConfidenceBadge
          confidence={
            trait.confidence
          }
        />

      </div>


      <h3>
        {trait.label}
      </h3>


      <p className="growthTraitInterpretation">
        {confidenceCopy(
          trait.confidence?.level
        )}
      </p>


      <p className="growthEvidenceCopy">
        {getEvidenceCopy(trait)}
      </p>

    </article>
  )
}


function DomainCard({
  domain,
}) {
  return (
    <article className="growthDomainCard">

      <span className="growthDomainEmoji">
        {domain.emoji}
      </span>


      <div className="growthDomainContent">

        <div className="growthDomainHeading">

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
    <article className="growthPathwayCard">

      <span className="growthPathwayEmoji">
        {pathway.emoji}
      </span>


      <div>

        <p className="growthPathwayLabel">
          Growth pathway
        </p>

        <h3>
          {pathway.label}
        </h3>

        <p>
          This is an area that may be
          worth exploring through more
          experiences. It is not a
          career prediction.
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

  return (
    <section className="growthProfileV03">

      <button
        className="backButton"
        onClick={onBack}
      >
        ← Back to {childName}'s Space
      </button>


      <header className="growthProfileHeader">

        <p className="growthProfileKicker">
          Growth Profile
        </p>

        <h1>
          What we're discovering
          about {childName}
        </h1>

        <p className="growthProfileLead">
          This profile grows from
          what {childName} tells us,
          what parents observe, and
          what we learn through real
          experiences.
        </p>

      </header>


      <div className="growthProfileSummary">

        <div className="growthSummaryItem">

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


        <div className="growthSummaryItem">

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


        <div className="growthSummaryItem">

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


      {!profileHasMultipleSources && (
        <div className="growthProfileNotice">

          <span>
            🌱
          </span>

          <div>

            <strong>
              This profile is still
              getting started.
            </strong>

            <p>
              Confidence grows when
              different experiences
              and perspectives point
              toward similar patterns.
            </p>

          </div>

        </div>
      )}


      {/* ======================================================
          TRAITS
         ====================================================== */}

      <section className="growthProfileSection">

        <div className="growthSectionHeading">

          <div>

            <p className="growthSectionKicker">
              Emerging strengths
            </p>

            <h2>
              How {childName} seems
              to approach the world
            </h2>

          </div>


          <p>
            These are tendencies,
            not fixed personality
            labels.
          </p>

        </div>


        {topTraits.length > 0 ? (
          <div className="growthTraitGrid">

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
          <div className="growthEmptyState">
            Keep exploring to reveal
            emerging strengths.
          </div>
        )}

      </section>


      {/* ======================================================
          DOMAINS
         ====================================================== */}

      <section className="growthProfileSection">

        <div className="growthSectionHeading">

          <div>

            <p className="growthSectionKicker">
              Learning domains
            </p>

            <h2>
              Where curiosity is
              showing up
            </h2>

          </div>


          <p>
            Domains can change as
            {` ${childName}`} explores
            new things.
          </p>

        </div>


        {topDomains.length > 0 ? (
          <div className="growthDomainList">

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
          <div className="growthEmptyState">
            More exploration will help
            us understand where
            curiosity is strongest.
          </div>
        )}

      </section>


      {/* ======================================================
          WHY THIS PROFILE
         ====================================================== */}

      <section className="growthProfileSection">

        <div className="growthSectionHeading">

          <div>

            <p className="growthSectionKicker">
              Why we're seeing this
            </p>

            <h2>
              Different evidence,
              one evolving picture
            </h2>

          </div>

        </div>


        <div className="growthEvidenceSources">

          <div
            className={`growthEvidenceSource ${
              profile
                ? 'growthEvidenceSourceActive'
                : ''
            }`}
          >

            <span>
              🧭
            </span>

            <div>

              <strong>
                Discovering You
              </strong>

              <p>
                What {childName}
                says they enjoy and
                how they see
                themselves.
              </p>

            </div>

          </div>


          <div
            className={`growthEvidenceSource ${
              parentPerspectiveComplete
                ? 'growthEvidenceSourceActive'
                : ''
            }`}
          >

            <span>
              👨‍👩‍👦
            </span>

            <div>

              <strong>
                Parent Perspective
              </strong>

              <p>
                Behaviors and patterns
                observed outside the
                questionnaire.
              </p>

            </div>

          </div>


          <div
            className={`growthEvidenceSource ${
              completedExplorations.length >
              0
                ? 'growthEvidenceSourceActive'
                : ''
            }`}
          >

            <span>
              🚀
            </span>

            <div>

              <strong>
                Adventures
              </strong>

              <p>
                Choices, behavior,
                enjoyment, and
                reflection during
                experiences.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          PATHWAYS
         ====================================================== */}

      {topPathways.length > 0 && (
        <section className="growthProfileSection">

          <div className="growthSectionHeading">

            <div>

              <p className="growthSectionKicker">
                Explore next
              </p>

              <h2>
                Growth pathways worth
                trying
              </h2>

            </div>


            <p>
              Pathways help choose
              experiences. They do not
              determine a future
              career.
            </p>

          </div>


          <div className="growthPathwayGrid">

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


      {/* ======================================================
          NEXT ACTION
         ====================================================== */}

      <div className="growthProfileNext">

        <div>

          <p className="growthSectionKicker">
            Keep learning
          </p>

          <h2>
            The best way to improve
            this profile is to
            explore.
          </h2>

          <p>
            New adventures give us
            stronger behavioral
            evidence and can confirm,
            broaden, or challenge
            what we're seeing today.
          </p>

        </div>


        <button
          className="cta"
          onClick={
            onExploreAdventures
          }
        >
          Explore Adventures
        </button>

      </div>


      {developerInspector}

    </section>
  )
}


export default GrowthProfileView