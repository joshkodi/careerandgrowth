import './GrowthProfileViewV088D.css'

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
      className={`profileConfidenceV06 profileConfidence-${confidence.level}`}
    >
      {confidence.label}
    </span>
  )
}


function TraitCard({
  trait,
}) {
  return (
    <article className="profileTraitV06">

      <div className="profileTraitIconV06">
        {trait.emoji}
      </div>

      <div className="profileTraitBodyV06">

        <div className="profileTraitHeadingV06">
          <h3>
            {trait.label}
          </h3>

          <ConfidenceBadge
            confidence={
              trait.confidence
            }
          />
        </div>

        <p className="profileTraitInterpretationV06">
          {confidenceCopy(
            trait.confidence?.level
          )}
        </p>

        <p className="profileTraitEvidenceV06">
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
    <article className="profileDomainV06">

      <div className="profileDomainIconV06">
        {domain.emoji}
      </div>

      <div className="profileDomainBodyV06">

        <div className="profileDomainHeadingV06">
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
    <article className="profilePathwayV06">

      <div className="profilePathwayIconV06">
        {pathway.emoji}
      </div>

      <div>
        <span className="profileKickerV06">
          WORTH EXPLORING
        </span>

        <h3>
          {pathway.label}
        </h3>

        <p>
          A direction worth trying through
          more experiences — not a prediction
          about your future.
        </p>
      </div>

    </article>
  )
}


function PromotedPatternCard({ pattern }) {
  const sourceLabels = {
    student_self_report: 'Discover You',
    parent_observation: 'Parent Observation',
    experience_behavior: 'Experience',
    experience_reflection: 'Experience Reflection',
    school_learning_behavior: 'School & Learning',
  }

  const visibleSources = (pattern.sources || [])
    .filter((source) => source !== 'system_completion')
    .map((source) => sourceLabels[source] || source.replaceAll('_', ' '))

  return (
    <article className="promotedPatternV088D">
      <div className="promotedPatternIconV088D">{pattern.emoji}</div>
      <div className="promotedPatternBodyV088D">
        <div className="promotedPatternHeadingV088D">
          <h3>{pattern.label}</h3>
          <span>{pattern.status}</span>
        </div>
        <p>
          We’re seeing this pattern repeatedly across different parts
          of your growth journey.
        </p>
        <div className="promotedPatternSourcesV088D">
          {visibleSources.map((source) => (
            <span key={source}>{source}</span>
          ))}
        </div>
        <small>
          {pattern.evidenceCount} observations · {pattern.contextDiversity} contexts
        </small>
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
  patternIntelligence = null,
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
    topDomains.length > 0 ||
    promotedPatterns.length > 0

  const visibleTraits =
    topTraits.slice(0, 4)

  const visibleDomains =
    topDomains.slice(0, 3)

  const visiblePathways =
    topPathways.slice(0, 2)

  return (
    <section className="growthProfileV06">

      <div className="profileTopbarV06">
        <button
          type="button"
          className="profileBackV06"
          onClick={onBack}
        >
          ← Back to {childName}'s Space
        </button>

        <span className="profileModePillV06">
          Growth Profile
        </span>
      </div>


      <header className="profileHeroV06">

        <div>
          <span className="profileKickerV06">
            MY GROWTH PROFILE
          </span>

          <h1>
            What we're learning about
            {` ${childName}`}.
          </h1>

          <p>
            This is an evolving picture —
            not a test result or a label.
            It grows from what you tell us,
            what you try, and what others
            notice over time.
          </p>
        </div>

        <div
          className="profileHeroMarkV06"
          aria-hidden="true"
        >
          <span>✨</span>
          <small>Evolving</small>
        </div>

      </header>


      {!hasProfileSignals ? (
        <section className="profileStartingV06">

          <div className="profileStartingIconV06">
            🌱
          </div>

          <div>
            <span className="profileKickerV06">
              JUST GETTING STARTED
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

          <button
            type="button"
            className="profilePrimaryV06"
            onClick={onExploreAdventures}
          >
            Explore Something New
            <span>→</span>
          </button>

        </section>
      ) : (
        <>
          {promotedPatterns.length > 0 && (
            <section className="promotedPatternsSectionV088D">
              <div className="promotedPatternsIntroV088D">
                <div>
                  <span className="profileKickerV06">
                    PATTERNS BECOMING CLEARER
                  </span>
                  <h2>
                    What different parts of your journey are beginning to tell us
                  </h2>
                </div>
                <p>
                  These patterns have been seen across multiple independent
                  experiences or perspectives. They can still strengthen,
                  change, or fade as you grow.
                </p>
              </div>
              <div className="promotedPatternsGridV088D">
                {promotedPatterns.map((pattern) => (
                  <PromotedPatternCard key={pattern.id} pattern={pattern} />
                ))}
              </div>
            </section>
          )}

          <section className="profileOverviewGridV06">

            <article className="profilePanelV06">
              <div className="profilePanelHeadingV06">
                <div>
                  <span className="profileKickerV06">
                    PATTERNS WE'RE NOTICING
                  </span>

                  <h2>
                    How you tend to approach things
                  </h2>
                </div>

                <span className="profileQuietNoteV06">
                  Patterns can strengthen, change,
                  or fade as you grow.
                </span>
              </div>

              {visibleTraits.length > 0 ? (
                <div className="profileTraitGridV06">
                  {visibleTraits.map(
                    (trait) => (
                      <TraitCard
                        key={trait.id}
                        trait={trait}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="profileEmptyV06">
                  Keep exploring to reveal
                  more patterns.
                </div>
              )}
            </article>


            <article className="profilePanelV06">
              <div className="profilePanelHeadingV06">
                <div>
                  <span className="profileKickerV06">
                    CURIOSITY RIGHT NOW
                  </span>

                  <h2>
                    Areas catching your attention
                  </h2>
                </div>

                <span className="profileQuietNoteV06">
                  Curiosity can move around.
                </span>
              </div>

              {visibleDomains.length > 0 ? (
                <div className="profileDomainListV06">
                  {visibleDomains.map(
                    (domain) => (
                      <DomainCard
                        key={domain.id}
                        domain={domain}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="profileEmptyV06">
                  More exploration will help
                  us see where curiosity shows up.
                </div>
              )}
            </article>

          </section>


          <section className="profileEvidenceStripV06">

            <div className="profileEvidenceIntroV06">
              <span className="profileKickerV06">
                WHERE THE CLUES COME FROM
              </span>

              <h2>
                Different perspectives,
                one evolving picture
              </h2>
            </div>


            <div className="profileEvidenceSourcesV06">

              <div
                className={
                  profile
                    ? 'profileEvidenceSourceV06 active'
                    : 'profileEvidenceSourceV06'
                }
              >
                <span className="profileEvidenceSourceIconV06">
                  🧒
                </span>

                <div>
                  <strong>
                    Kid Experience
                  </strong>

                  <p>
                    Discovery answers,
                    preferences, and reflections.
                  </p>
                </div>
              </div>


              <div
                className={
                  parentPerspectiveComplete
                    ? 'profileEvidenceSourceV06 active'
                    : 'profileEvidenceSourceV06'
                }
              >
                <span className="profileEvidenceSourceIconV06">
                  👨‍👩‍👦
                </span>

                <div>
                  <strong>
                    Parent Observation
                  </strong>

                  <p>
                    Patterns noticed in
                    everyday life.
                  </p>
                </div>
              </div>


              <div
                className={
                  completedExplorations.length > 0
                    ? 'profileEvidenceSourceV06 active'
                    : 'profileEvidenceSourceV06'
                }
              >
                <span className="profileEvidenceSourceIconV06">
                  🚀
                </span>

                <div>
                  <strong>
                    Experience Evidence
                  </strong>

                  <p>
                    What happens when you
                    actually try something.
                  </p>
                </div>
              </div>

              <div
                className={
                  patternIntelligence?.patterns?.some(
                    (pattern) =>
                      pattern.sources?.includes('school_learning_behavior')
                  )
                    ? 'profileEvidenceSourceV06 active'
                    : 'profileEvidenceSourceV06'
                }
              >
                <span className="profileEvidenceSourceIconV06">📚</span>
                <div>
                  <strong>School & Learning</strong>
                  <p>
                    How you seek help, use resources, persist,
                    and learn over time.
                  </p>
                </div>
              </div>

            </div>


            {!profileHasMultipleSources && (
              <div className="profileEvidenceNoticeV06">
                <span aria-hidden="true">
                  🌱
                </span>

                <p>
                  We're still building the picture.
                  Confidence grows when different
                  experiences and perspectives begin
                  reinforcing similar patterns.
                </p>
              </div>
            )}

          </section>


          {visiblePathways.length > 0 && (
            <section className="profileNextGridV06">

              <div className="profileNextCopyV06">
                <span className="profileKickerV06">
                  IDEAS WORTH TRYING
                </span>

                <h2>
                  Where might you explore next?
                </h2>

                <p>
                  These are directions for exploration,
                  not career predictions.
                </p>
              </div>

              <div className="profilePathwayGridV06">
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


      <section className="profileBottomBarV06">

        <div>
          <span className="profileKickerV06">
            KEEP GROWING
          </span>

          <h2>
            The best way to understand
            yourself is to keep trying things.
          </h2>
        </div>

        <button
          type="button"
          className="profilePrimaryV06"
          onClick={onExploreAdventures}
        >
          Explore Something New
          <span>→</span>
        </button>

      </section>


      <details className="profileDetailsV06">
        <summary>
          Profile details
        </summary>

        <div className="profileStatsV06">

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
