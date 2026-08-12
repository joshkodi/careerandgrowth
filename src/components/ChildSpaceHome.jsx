// ============================================================
// Career & Growth
// MVP v0.3
//
// Child Space Home
//
// Main home/dashboard for a child's Career & Growth space.
//
// This component:
// - Displays child information
// - Displays journey progress
// - Provides navigation into major experiences
//
// It intentionally does NOT own application state or
// Growth Intelligence logic.
// ============================================================


function ChildSpaceHome({
  childProfile,
  discoveryComplete,
  evidenceEventCount,
  completedExplorations,
  growthIntelligenceProfile,
  parentPerspectiveComplete,
  onStartDiscovery,
  onViewGrowthProfile,
  onExploreAdventures,
  onStartParentPerspective,
}) {
  const childName =
    childProfile.name.trim()

  const childInitial =
    childName
      .charAt(0)
      .toUpperCase()

  const evidenceSourceCount =
    growthIntelligenceProfile
      ?.evidenceSummary
      ?.sourceTypeCount || 0


  return (
    <section className="childSpace">

      {/* ======================================================
          HEADER
         ====================================================== */}

      <div className="spaceHeader">

        <div>

          <p className="spaceEyebrow">
            Career & Growth
          </p>

          <h1 className="spaceTitle">
            {childName}'s Space 🌱
          </h1>

          <p className="spaceSubtitle">
            A place that grows as{' '}
            {childName} grows.
          </p>

        </div>


        <div className="spaceProfilePill">

          <span className="spaceAvatar">
            {childInitial}
          </span>

          <div>

            <strong>
              {childName}
            </strong>

            <span>
              Age {childProfile.age}
              {' · '}
              {childProfile.grade}
            </span>

          </div>

        </div>

      </div>


      {/* ======================================================
          WELCOME / PROGRESS MESSAGE
         ====================================================== */}

      {!discoveryComplete ? (
        <div className="spaceWelcome">

          <span className="spaceWelcomeEmoji">
            👋
          </span>

          <div>

            <h2>
              Welcome, {childName}!
            </h2>

            <p>
              Let's start by
              discovering what makes
              you, you.
            </p>

          </div>

        </div>
      ) : (
        <div className="spaceWelcome spaceWelcomeComplete">

          <span className="spaceWelcomeEmoji">
            ✨
          </span>

          <div>

            <h2>
              Your Growth Profile
              has started!
            </h2>

            <p>
              Keep exploring and your
              profile will continue
              to grow.
            </p>

          </div>

        </div>
      )}


      {/* ======================================================
          GROWTH STATS
         ====================================================== */}

      {discoveryComplete && (
        <div className="spaceStats">

          <div className="spaceStat">

            <strong>
              {evidenceEventCount}
            </strong>

            <span>
              Evidence events
            </span>

          </div>


          <div className="spaceStat">

            <strong>
              {
                completedExplorations
                  .length
              }
            </strong>

            <span>
              Adventures completed
            </span>

          </div>


          <div className="spaceStat">

            <strong>
              {evidenceSourceCount}
            </strong>

            <span>
              Evidence sources
            </span>

          </div>

        </div>
      )}


      {/* ======================================================
          CHILD JOURNEY
         ====================================================== */}

      <div className="spaceSectionHeader">

        <div>

          <h2>
            Your Journey
          </h2>

          <p>
            Discover, explore, and
            keep growing.
          </p>

        </div>

      </div>


      <div className="spaceGrid">

        {/* DISCOVERING YOU */}

        <article className="spaceCard">

          <div className="spaceCardTop">

            <span className="spaceCardIcon">
              🧭
            </span>

            {discoveryComplete && (
              <span className="spaceStatusComplete">
                ✓ Complete
              </span>
            )}

          </div>


          <h3>
            Discovering You
          </h3>

          <p>
            Explore interests,
            strengths, and the things
            that seem to motivate you.
          </p>


          {!discoveryComplete ? (
            <button
              className="spaceAction"
              onClick={
                onStartDiscovery
              }
            >
              Start Discovery →
            </button>
          ) : (
            <span className="spaceCompletedText">
              Discovery completed
            </span>
          )}

        </article>


        {/* GROWTH PROFILE */}

        <article
          className={`spaceCard ${
            !discoveryComplete
              ? 'spaceCardLocked'
              : ''
          }`}
        >

          <div className="spaceCardTop">

            <span className="spaceCardIcon">
              🌱
            </span>

          </div>


          <h3>
            Growth Profile
          </h3>

          <p>
            See the interests,
            tendencies, and areas
            we're beginning to
            discover from the
            evidence so far.
          </p>


          {discoveryComplete ? (
            <button
              className="spaceAction"
              onClick={
                onViewGrowthProfile
              }
            >
              View Profile →
            </button>
          ) : (
            <span className="spaceLockedText">
              Complete Discovery first
            </span>
          )}

        </article>


        {/* ADVENTURES */}

        <article
          className={`spaceCard ${
            !discoveryComplete
              ? 'spaceCardLocked'
              : ''
          }`}
        >

          <div className="spaceCardTop">

            <span className="spaceCardIcon">
              🚀
            </span>

            {completedExplorations.length >
              0 && (
              <span className="spaceStatusComplete">
                {
                  completedExplorations
                    .length
                }{' '}
                completed
              </span>
            )}

          </div>


          <h3>
            Adventures
          </h3>

          <p>
            Try experiences that help
            us learn what you enjoy
            doing — not just what
            sounds interesting.
          </p>


          {discoveryComplete ? (
            <button
              className="spaceAction"
              onClick={
                onExploreAdventures
              }
            >
              Explore Adventures →
            </button>
          ) : (
            <span className="spaceLockedText">
              Unlocks after Discovery
            </span>
          )}

        </article>

      </div>


      {/* ======================================================
          PARENT AREA
         ====================================================== */}

      <div className="spaceSectionHeader parentSectionHeader">

        <div>

          <h2>
            For Parents
          </h2>

          <p>
            Add another perspective
            to the Growth Profile.
          </p>

        </div>

      </div>


      <div className="parentSpaceCard">

        <div className="parentSpaceIcon">
          👨‍👩‍👦
        </div>


        <div className="parentSpaceContent">

          <div className="parentSpaceHeading">

            <h3>
              Parent Perspective
            </h3>

            {parentPerspectiveComplete && (
              <span className="spaceStatusComplete">
                ✓ Added
              </span>
            )}

          </div>


          <p>
            Share what you've noticed
            about {childName}'s
            interests, behaviors,
            and ways of approaching
            challenges.
          </p>


          {!parentPerspectiveComplete ? (
            <button
              className="spaceAction"
              onClick={
                onStartParentPerspective
              }
            >
              Add Your Perspective →
            </button>
          ) : (
            <span className="spaceCompletedText">
              Parent perspective added
            </span>
          )}

        </div>

      </div>

    </section>
  )
}


export default ChildSpaceHome