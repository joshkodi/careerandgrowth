import {
  useEffect,
  useState,
} from 'react'


const humanize =
  (value = '') =>
    String(value)
      .replaceAll('_', ' ')
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      )


function ExperienceResearchPanel({
  childName,
  candidates = [],
  journeyItems = [],
  onAddToJourney,
}) {
  const [
    selectedCandidateId,
    setSelectedCandidateId,
  ] = useState(
    candidates?.[0]?.id ||
    null
  )

  useEffect(
    () => {
      if (
        selectedCandidateId &&
        candidates.some(
          (candidate) =>
            candidate.id ===
            selectedCandidateId
        )
      ) {
        return
      }

      setSelectedCandidateId(
        candidates?.[0]?.id ||
        null
      )
    },
    [
      candidates,
      selectedCandidateId,
    ]
  )

  const selectedCandidate =
    candidates.find(
      (candidate) =>
        candidate.id ===
        selectedCandidateId
    ) ||
    candidates[0] ||
    null

  const journeyExperienceIds =
    new Set(
      journeyItems
        .map(
          (item) =>
            item.experienceId
        )
        .filter(Boolean)
    )

  const alreadyInJourney =
    selectedCandidate
      ? journeyExperienceIds.has(
          selectedCandidate.id
        )
      : false

  if (!candidates.length) {
    return null
  }

  return (
    <section className="experienceResearchV07">

      <div className="experienceResearchHeaderV07">
        <div>
          <span className="growthKickerV06">
            RESEARCHED FOR YOU
          </span>

          <h2>
            Experiences picked for you
          </h2>

          <p>
            We looked for age-appropriate
            resources that connect with
            what we're learning about
            {` ${childName}`}.
          </p>
        </div>

        <span className="researchCountV07">
          {candidates.length} ideas
        </span>
      </div>


      <div className="experienceResearchGridV07">

        <div className="researchCandidateListV07">

          {candidates.map(
            (
              candidate,
              index
            ) => {
              const selected =
                candidate.id ===
                selectedCandidate?.id

              const inJourney =
                journeyExperienceIds.has(
                  candidate.id
                )

              return (
                <button
                  type="button"
                  className={
                    selected
                      ? 'researchCandidateCardV07 selected'
                      : 'researchCandidateCardV07'
                  }
                  key={candidate.id}
                  onClick={() =>
                    setSelectedCandidateId(
                      candidate.id
                    )
                  }
                >

                  <span className="candidateNumberV07">
                    {index + 1}
                  </span>

                  <span className="candidateCardBodyV07">

                    <span className="candidateStrategyV07">
                      {humanize(
                        candidate.strategy
                      )}

                      {inJourney && (
                        <span className="candidateJourneyBadgeV07">
                          In Journey
                        </span>
                      )}
                    </span>

                    <strong>
                      {candidate.title}
                    </strong>

                    <small>
                      {candidate.estimatedTime ||
                        'Flexible time'}
                      {' · '}
                      {
                        candidate
                          .sourceResource
                          ?.provider ||
                        'External resource'
                      }
                    </small>

                    <span className="candidateReasonV07">
                      {candidate.whyItFits}
                    </span>

                  </span>

                  <span className="candidateArrowV07">
                    →
                  </span>

                </button>
              )
            }
          )}

        </div>


        {selectedCandidate && (
          <article className="researchCandidateDetailV07">

            <div className="candidateDetailTopV07">

              <div className="candidateDetailIconV07">
                {selectedCandidate.emoji || '🧭'}
              </div>

              <div>
                <span className="candidateStrategyBadgeV07">
                  {humanize(
                    selectedCandidate.strategy
                  )}
                </span>

                <h3>
                  {selectedCandidate.title}
                </h3>
              </div>

            </div>


            <div className="candidateMissionV07">
              <span>
                YOUR MISSION
              </span>

              <p>
                {selectedCandidate.mission}
              </p>
            </div>


            <div className="candidateWhyV07">
              <span>
                WHY THIS FITS YOU
              </span>

              <p>
                {selectedCandidate.whyItFits}
              </p>
            </div>


            <div className="candidateMetaGridV07">

              <div>
                <span>
                  Time
                </span>

                <strong>
                  {selectedCandidate
                    .estimatedTime ||
                    'Flexible'}
                </strong>
              </div>

              <div>
                <span>
                  Source
                </span>

                <strong>
                  {
                    selectedCandidate
                      .sourceResource
                      ?.provider ||
                    'External resource'
                  }
                </strong>
              </div>

            </div>


            {selectedCandidate
              .practices
              ?.length > 0 && (
              <div className="candidatePracticeV07">

                <span>
                  YOU'LL PRACTICE
                </span>

                <div className="candidateChipRowV07">
                  {selectedCandidate
                    .practices
                    .slice(0, 5)
                    .map(
                      (practice) => (
                        <span
                          key={practice}
                        >
                          {humanize(
                            practice
                          )}
                        </span>
                      )
                    )}
                </div>

              </div>
            )}


            <div className="candidateActionsV07">

              {selectedCandidate
                .sourceResource
                ?.url && (
                <a
                  className="researchSourceLinkV07"
                  href={
                    selectedCandidate
                      .sourceResource
                      .url
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  View source
                </a>
              )}

              <button
                type="button"
                className={
                  alreadyInJourney
                    ? 'researchJourneyPreviewV07 added'
                    : 'researchJourneyPreviewV07'
                }
                onClick={() =>
                  onAddToJourney?.(
                    selectedCandidate
                  )
                }
              >
                {alreadyInJourney
                  ? 'Open in Journey'
                  : 'Add to Journey'}
              </button>

            </div>

            <p className="researchJourneyNoteV07">
              {alreadyInJourney
                ? 'This researched experience is already part of the Journey.'
                : 'Choose this experience when you are ready to make it part of the Journey.'}
            </p>

          </article>
        )}

      </div>

    </section>
  )
}


export default ExperienceResearchPanel
