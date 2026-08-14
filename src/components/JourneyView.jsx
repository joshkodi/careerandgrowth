import './JourneyView.css'


function JourneyView({
  childName,
  journeyItems = [],
  onBack,
}) {
  const activeItems =
    journeyItems
      .filter(
        (item) =>
          item.status !==
          'completed'
      )
      .sort(
        (a, b) =>
          new Date(b.startedAt) -
          new Date(a.startedAt)
      )

  const completedItems =
    journeyItems
      .filter(
        (item) =>
          item.status ===
          'completed'
      )
      .sort(
        (a, b) =>
          new Date(b.completedAt) -
          new Date(a.completedAt)
      )


  return (
    <section className="journeyView">

      <div className="journeyViewTop">

        <button
          className="journeyBackButton"
          onClick={onBack}
        >
          ← Back to My Space
        </button>

        <span className="journeyViewLabel">
          MY JOURNEY
        </span>

      </div>


      <header className="journeyHero">

        <div>

          <p className="journeyEyebrow">
            {childName}'s Journey
          </p>

          <h1>
            This is what you're
            growing through.
          </h1>

          <p>
            Your Journey keeps track
            of the things you actually
            try — not just what we
            recommend.
          </p>

        </div>

        <div className="journeyHeroIcon">
          🛤️
        </div>

      </header>


      <section className="journeySection">

        <div className="journeySectionHeader">

          <div>
            <span className="journeyEyebrow">
              ACTIVE
            </span>

            <h2>
              What you're working on
            </h2>
          </div>

          <span className="journeyCountBadge">
            {activeItems.length}
          </span>

        </div>


        {activeItems.length ===
        0 ? (

          <div className="journeyEmpty">

            <div className="journeyEmptyIcon">
              🌱
            </div>

            <h3>
              Nothing active yet.
            </h3>

            <p>
              Start a Grow from your
              Growth Home and it will
              appear here.
            </p>

          </div>

        ) : (

          <div className="journeyCards">

            {activeItems.map(
              (item) => (

                <article
                  key={item.id}
                  className="journeyCard"
                >

                  <div className="journeyCardTop">

                    <div className="journeyCardIcon">
                      {item.emoji}
                    </div>

                    <span className="journeyStatus">
                      Started
                    </span>

                  </div>


                  <span className="journeyEyebrow">
                    ACTIVE GROW
                  </span>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>


                  {item
                    .recommendationContext
                    ?.reasons
                    ?.length > 0 && (

                    <div className="journeyWhy">

                      <strong>
                        Why you started this
                      </strong>

                      {item
                        .recommendationContext
                        .reasons
                        .slice(0, 2)
                        .map(
                          (
                            reason,
                            index
                          ) => (
                            <p
                              key={index}
                            >
                              • {reason}
                            </p>
                          )
                        )}

                    </div>

                  )}


                  <div className="journeyCardFooter">

                    <span>
                      Started{' '}
                      {
                        formatDate(
                          item.startedAt
                        )
                      }
                    </span>

                    <span>
                      Reflection & progress
                      coming next
                    </span>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>


      {completedItems.length >
        0 && (

        <section className="journeySection">

          <div className="journeySectionHeader">

            <div>
              <span className="journeyEyebrow">
                COMPLETED
              </span>

              <h2>
                Things you've tried
              </h2>
            </div>

            <span className="journeyCountBadge">
              {completedItems.length}
            </span>

          </div>


          <div className="journeyCards">

            {completedItems.map(
              (item) => (

                <article
                  key={item.id}
                  className="journeyCard journeyCardCompleted"
                >

                  <div className="journeyCardTop">

                    <div className="journeyCardIcon">
                      {item.emoji}
                    </div>

                    <span className="journeyStatus">
                      Completed
                    </span>

                  </div>

                  <h3>
                    {item.title}
                  </h3>

                </article>

              )
            )}

          </div>

        </section>

      )}

    </section>
  )
}


function formatDate(
  value
) {
  if (!value) {
    return 'recently'
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
    }
  ).format(
    new Date(value)
  )
}


export default JourneyView