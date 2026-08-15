import {
  useMemo,
  useState,
} from 'react'


// ============================================================
// Career & Growth
// MVP v0.6 — Phase 2B — Guided Adventure Flow
//
// Keeps the existing App.jsx contract intact.
//
// For Adventures that contain exploration.guidedAdventure:
//
// Intro
//   ↓
// Get Ready
//   ↓
// Learn
//   ↓
// Try
//   ↓
// Build
//   ↓
// Existing Challenge Flow
//   ↓
// Existing Enjoyment + Favorite Part Reflection
//
// Phase 2B is presentation/navigation only.
// Resource/activity completion is NOT persisted as Growth evidence yet.
// That arrives in Phase 2C.
// ============================================================

function AdventureFlow({
  exploration,
  step,
  challengeIndex,
  onBack,
  onBeginMission,
  onKidExperienceAnswer,
  onGuidedStageComplete,
  onChallengeAnswer,
  onEnjoymentAnswer,
  onFavoritePartAnswer,
}) {
  const [guidedStageIndex, setGuidedStageIndex] =
    useState(null)

  const [
    exploredResourceIds,
    setExploredResourceIds,
  ] = useState([])

  const [
    selectedActivityId,
    setSelectedActivityId,
  ] = useState(null)


  const [
    kidExperienceIndex,
    setKidExperienceIndex,
  ] = useState(null)

  if (!exploration) {
    return null
  }

  const guidedAdventure =
    exploration.guidedAdventure || null

  const guidedStages =
    useMemo(
      () =>
        guidedAdventure?.stages
          ?.filter(
            (stageItem) =>
              ![
                'challenge',
                'reflect',
              ].includes(
                stageItem.id
              )
          )
          ?.sort(
            (a, b) =>
              (a.order || 0) -
              (b.order || 0)
          ) || [],
      [guidedAdventure]
    )

  const currentGuidedStage =
    guidedStageIndex !== null
      ? guidedStages[
          guidedStageIndex
        ]
      : null


  const kidExperiencePrompts =
    guidedAdventure
      ?.kidExperience
      ?.prompts || []

  const currentKidExperiencePrompt =
    kidExperienceIndex !== null
      ? kidExperiencePrompts[
          kidExperienceIndex
        ]
      : null

  const currentChallenge =
    exploration.challenges?.[
      challengeIndex
    ]

  const totalChallenges =
    exploration.challenges?.length || 0

  const adventureTitle =
    exploration.title ||
    exploration.intro?.title ||
    'Adventure'


  // ==========================================================
  // GUIDED ADVENTURE HELPERS
  // ==========================================================

  const startGuidedAdventure = () => {
    if (
      guidedAdventure &&
      guidedStages.length > 0
    ) {
      setGuidedStageIndex(0)
      return
    }

    onBeginMission()
  }


  const advanceGuidedStage = () => {
    const isLastGuidedStage =
      guidedStageIndex ===
      guidedStages.length - 1

    if (
      currentGuidedStage?.id ===
      'build'
    ) {
      onGuidedStageComplete?.({
        stage:
          currentGuidedStage,
      })
    }

    if (isLastGuidedStage) {
      setGuidedStageIndex(null)

      if (
        kidExperiencePrompts.length > 0
      ) {
        setKidExperienceIndex(0)
        return
      }

      onBeginMission()
      return
    }

    setGuidedStageIndex(
      (current) =>
        current + 1
    )
  }


  const goBackGuidedStage = () => {
    if (
      guidedStageIndex === null ||
      guidedStageIndex === 0
    ) {
      setGuidedStageIndex(null)
      return
    }

    setGuidedStageIndex(
      (current) =>
        current - 1
    )
  }


  const toggleResourceExplored =
    (resourceId) => {
      setExploredResourceIds(
        (current) =>
          current.includes(
            resourceId
          )
            ? current.filter(
                (id) =>
                  id !== resourceId
              )
            : [
                ...current,
                resourceId,
              ]
      )
    }


  const stageResources =
    currentGuidedStage
      ?.resourceIds
      ?.map(
        (resourceId) =>
          guidedAdventure
            ?.resources
            ?.find(
              (resource) =>
                resource.id ===
                resourceId
            )
      )
      .filter(Boolean) || []


  const canContinueGuidedStage = (() => {
    if (!currentGuidedStage) {
      return false
    }

    if (
      currentGuidedStage.type ===
      'resource'
    ) {
      const minimum =
        currentGuidedStage
          .minimumResources || 1

      const exploredCount =
        stageResources.filter(
          (resource) =>
            exploredResourceIds.includes(
              resource.id
            )
        ).length

      return exploredCount >= minimum
    }

    if (
      currentGuidedStage.id ===
      'try'
    ) {
      return Boolean(
        selectedActivityId
      )
    }

    return true
  })()


  const handleKidExperienceAnswer =
    (answer) => {
      if (
        !currentKidExperiencePrompt ||
        !answer
      ) {
        return
      }

      onKidExperienceAnswer?.({
        prompt:
          currentKidExperiencePrompt,

        answer,
      })

      const isLastPrompt =
        kidExperienceIndex ===
        kidExperiencePrompts.length - 1

      if (isLastPrompt) {
        setKidExperienceIndex(null)
        onBeginMission()
        return
      }

      setKidExperienceIndex(
        (current) =>
          current + 1
      )
    }


  // ==========================================================
  // KID EXPERIENCE — POST ACTIVITY
  // ==========================================================

  if (
    step === 'intro' &&
    currentKidExperiencePrompt
  ) {
    return (
      <KidExperienceStage
        exploration={exploration}
        prompt={
          currentKidExperiencePrompt
        }
        promptIndex={
          kidExperienceIndex
        }
        promptCount={
          kidExperiencePrompts.length
        }
        onAnswer={
          handleKidExperienceAnswer
        }
        onExit={onBack}
      />
    )
  }


  // ==========================================================
  // GUIDED STAGE
  // ==========================================================

  if (
    step === 'intro' &&
    currentGuidedStage
  ) {
    return (
      <GuidedStage
        exploration={exploration}
        guidedAdventure={guidedAdventure}
        stage={currentGuidedStage}
        stageIndex={guidedStageIndex}
        stageCount={guidedStages.length}
        resources={stageResources}
        exploredResourceIds={
          exploredResourceIds
        }
        selectedActivityId={
          selectedActivityId
        }
        canContinue={
          canContinueGuidedStage
        }
        onToggleResource={
          toggleResourceExplored
        }
        onSelectActivity={
          setSelectedActivityId
        }
        onBack={
          goBackGuidedStage
        }
        onExit={onBack}
        onContinue={
          advanceGuidedStage
        }
      />
    )
  }


  // ==========================================================
  // INTRO
  // ==========================================================

  if (step === 'intro') {
    const mission =
      guidedAdventure?.mission

    return (
      <section className="adventureV06">

        <div className="adventureTopbarV06">
          <button
            type="button"
            className="adventureBackV06"
            onClick={onBack}
          >
            ← Back to Explore
          </button>

          <span className="adventureMiniBrandV06">
            🌱 Career & Growth
          </span>
        </div>


        <div className="adventureShellV06">

          <aside className="adventureSceneV06">
            <span
              className="adventureSceneSpark adventureSceneSparkOne"
              aria-hidden="true"
            >
              ✦
            </span>

            <span
              className="adventureSceneSpark adventureSceneSparkTwo"
              aria-hidden="true"
            >
              ✨
            </span>

            <div className="adventureCharacterV06">
              {exploration.emoji || '🚀'}
            </div>

            <div className="adventureSpeechV06">
              <strong>
                Ready, explorer?
              </strong>

              <span>
                Let's see what you can figure out.
              </span>
            </div>
          </aside>


          <main className="adventureMainV06">

            <span className="adventureKickerV06">
              {exploration.intro?.eyebrow ||
                'YOUR ADVENTURE'}
            </span>

            <h1>
              {mission?.title ||
                exploration.intro?.title ||
                adventureTitle}
            </h1>

            <p className="adventureLeadV06">
              {mission?.story ||
                exploration.intro?.description}
            </p>


            <div className="adventureMissionV06">
              <div className="adventureMissionIconV06">
                🎯
              </div>

              <div>
                <span>
                  YOUR MISSION
                </span>

                <p>
                  {mission?.challenge ||
                    exploration.intro?.mission}
                </p>
              </div>
            </div>


            {guidedAdventure && (
              <div className="guidedIntroMetaV06">
                <span>
                  ⏱️ About{' '}
                  {
                    guidedAdventure
                      .estimatedMinutes
                      ?.typical || 60
                  }{' '}
                  min
                </span>

                <span>
                  🧰 Simple materials
                </span>

                <span>
                  🌐 Online + hands-on
                </span>
              </div>
            )}


            <button
              type="button"
              className="adventurePrimaryV06"
              onClick={
                startGuidedAdventure
              }
            >
              {guidedAdventure
                ? 'Begin Adventure'
                : 'Start Mission'}
              <span>→</span>
            </button>

          </main>

        </div>

      </section>
    )
  }


  // ==========================================================
  // CHALLENGE
  // ==========================================================

  if (
    step === 'challenge' &&
    currentChallenge
  ) {
    const progress =
      ((challengeIndex + 1) /
        totalChallenges) *
      100

    return (
      <section className="adventureV06">

        <div className="adventureTopbarV06">
          <button
            type="button"
            className="adventureBackV06"
            onClick={onBack}
          >
            ← Exit Adventure
          </button>

          <span className="adventureMiniBrandV06">
            {exploration.emoji || '🚀'}
            {' '}
            {adventureTitle}
          </span>
        </div>


        <div className="adventureChallengeShellV06">

          <aside className="adventureChallengeSideV06">

            <div className="adventureSideEmojiV06">
              {exploration.emoji || '🤖'}
            </div>

            <span className="adventureKickerV06">
              MISSION CHALLENGE
            </span>

            <h2>
              Think it through.
            </h2>

            <p>
              Pick the answer that feels
              most like what you would do.
            </p>


            <div className="adventureProgressLabelV06">
              <span>
                Challenge {challengeIndex + 1}
                {' '}of{' '}
                {totalChallenges}
              </span>

              <strong>
                {Math.round(progress)}%
              </strong>
            </div>

            <div className="adventureProgressTrackV06">
              <div
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>


            <div className="adventureSideNoteV06">
              <span aria-hidden="true">
                💡
              </span>

              <p>
                No trick questions.
                We're learning how you
                like to think and explore.
              </p>
            </div>

          </aside>


          <main className="adventureQuestionV06">

            <span className="adventureKickerV06">
              WHAT WOULD YOU DO?
            </span>

            <h1>
              {currentChallenge.question}
            </h1>


            <div className="adventureAnswersV06">
              {currentChallenge.answers.map(
                (answer, index) => (
                  <button
                    type="button"
                    key={answer.id}
                    className="adventureAnswerV06"
                    onClick={() =>
                      onChallengeAnswer(
                        answer
                      )
                    }
                  >
                    <span className="adventureAnswerLetterV06">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span className="adventureAnswerTextV06">
                      {answer.label}
                    </span>

                    <span
                      className="adventureAnswerArrowV06"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>
                )
              )}
            </div>

          </main>

        </div>

      </section>
    )
  }


  // ==========================================================
  // ENJOYMENT
  // ==========================================================

  if (step === 'enjoyment') {
    return (
      <section className="adventureV06">

        <div className="adventureTopbarV06">
          <span />

          <span className="adventureMiniBrandV06">
            {exploration.emoji || '🚀'}
            {' '}
            {adventureTitle}
          </span>
        </div>


        <div className="adventureReflectionV06">

          <div className="adventureCelebrationV06">
            <span aria-hidden="true">
              🎉
            </span>

            <span aria-hidden="true">
              ✨
            </span>

            <span aria-hidden="true">
              ⭐
            </span>
          </div>

          <span className="adventureKickerV06">
            MISSION COMPLETE
          </span>

          <h1>
            Nice work!
          </h1>

          <p>
            {exploration.reflection
              ?.enjoyment?.question}
          </p>


          <div className="adventureReflectionChoicesV06">
            {exploration.reflection
              ?.enjoyment?.answers
              ?.map(
                (answer) => (
                  <button
                    type="button"
                    key={answer.id}
                    onClick={() =>
                      onEnjoymentAnswer(
                        answer
                      )
                    }
                  >
                    {answer.label}
                  </button>
                )
              )}
          </div>

        </div>

      </section>
    )
  }


  // ==========================================================
  // FAVORITE PART
  // ==========================================================

  if (step === 'favorite') {
    return (
      <section className="adventureV06">

        <div className="adventureTopbarV06">
          <span />

          <span className="adventureMiniBrandV06">
            {exploration.emoji || '🚀'}
            {' '}
            {adventureTitle}
          </span>
        </div>


        <div className="adventureReflectionV06">

          <div className="adventureReflectionIconV06">
            💭
          </div>

          <span className="adventureKickerV06">
            ONE MORE THING
          </span>

          <h1>
            {exploration.reflection
              ?.favoritePart?.question}
          </h1>

          <p>
            What you enjoyed gives us
            another clue about you.
          </p>


          <div className="adventureFavoriteGridV06">
            {exploration.reflection
              ?.favoritePart?.answers
              ?.map(
                (answer) => (
                  <button
                    type="button"
                    key={answer.id}
                    onClick={() =>
                      onFavoritePartAnswer(
                        answer
                      )
                    }
                  >
                    <span>
                      {answer.label}
                    </span>

                    <span aria-hidden="true">
                      →
                    </span>
                  </button>
                )
              )}
          </div>

        </div>

      </section>
    )
  }


  return null
}


// ============================================================
// GUIDED STAGE
// ============================================================

function GuidedStage({
  exploration,
  guidedAdventure,
  stage,
  stageIndex,
  stageCount,
  resources = [],
  exploredResourceIds = [],
  selectedActivityId,
  canContinue,
  onToggleResource,
  onSelectActivity,
  onBack,
  onExit,
  onContinue,
}) {
  const progress =
    ((stageIndex + 1) /
      stageCount) *
    100

  return (
    <section className="guidedAdventureV06">

      <div className="guidedTopbarV06">
        <button
          type="button"
          className="guidedBackV06"
          onClick={onBack}
        >
          ← Back
        </button>

        <button
          type="button"
          className="guidedExitV06"
          onClick={onExit}
        >
          Exit Adventure
        </button>
      </div>


      <div className="guidedProgressHeaderV06">
        <div>
          <span className="guidedKickerV06">
            {exploration.emoji || '🚀'}
            {' '}
            {exploration.title}
          </span>

          <strong>
            {stage.kidLabel ||
              stage.title}
          </strong>
        </div>

        <span>
          Step {stageIndex + 1}
          {' '}of{' '}
          {stageCount}
        </span>
      </div>

      <div className="guidedProgressTrackV06">
        <div
          style={{
            width: `${progress}%`,
          }}
        />
      </div>


      <div className="guidedStageShellV06">

        <aside className="guidedStageAsideV06">

          <div className="guidedStageEmojiV06">
            {stage.emoji || '✨'}
          </div>

          <span className="guidedKickerV06">
            {stage.title}
          </span>

          <h2>
            {getGuidedStageHeadline(
              stage.id
            )}
          </h2>

          <p>
            {stage.instruction}
          </p>

          <div className="guidedTimeV06">
            ⏱️ About{' '}
            {stage.estimatedMinutes ||
              10}{' '}
            min
          </div>

        </aside>


        <main className="guidedStageMainV06">

          {stage.id ===
            'get_ready' && (
            <GetReadyStage
              guidedAdventure={
                guidedAdventure
              }
            />
          )}


          {stage.type ===
            'resource' && (
            <ResourceStage
              resources={resources}
              exploredResourceIds={
                exploredResourceIds
              }
              onToggleResource={
                onToggleResource
              }
            />
          )}


          {stage.id === 'try' && (
            <TryStage
              stage={stage}
              guidedAdventure={
                guidedAdventure
              }
              selectedActivityId={
                selectedActivityId
              }
              onSelectActivity={
                onSelectActivity
              }
            />
          )}


          {stage.id ===
            'build' && (
            <BuildStage
              stage={stage}
              guidedAdventure={
                guidedAdventure
              }
            />
          )}


          <div className="guidedStageActionsV06">
            {!canContinue && (
              <span className="guidedActionHintV06">
                {stage.type ===
                'resource'
                  ? 'Explore at least one resource to continue.'
                  : 'Choose one way to try the mission.'}
              </span>
            )}

            <button
              type="button"
              className="guidedContinueV06"
              onClick={onContinue}
              disabled={!canContinue}
            >
              {stageIndex ===
              stageCount - 1
                ? 'Go to Mission Challenge'
                : 'Continue'}
              <span>→</span>
            </button>
          </div>

        </main>

      </div>

    </section>
  )
}


function GetReadyStage({
  guidedAdventure,
}) {
  return (
    <>
      <div className="guidedMissionCardV06">
        <span className="guidedKickerV06">
          THE SITUATION
        </span>

        <h3>
          {guidedAdventure
            ?.mission?.title}
        </h3>

        <p>
          {guidedAdventure
            ?.mission?.story}
        </p>
      </div>

      <div className="guidedChoicePromptV06">
        <span>🤔</span>

        <div>
          <strong>
            Think before you build
          </strong>

          <p>
            {guidedAdventure
              ?.mission
              ?.successQuestion}
          </p>
        </div>
      </div>

      <div className="guidedMaterialsV06">
        <div>
          <span className="guidedKickerV06">
            YOU'LL NEED
          </span>

          {(guidedAdventure
            ?.materials
            ?.required || [])
            .map(
              (item) => (
                <span
                  key={item}
                >
                  ✓ {item}
                </span>
              )
            )}
        </div>

        <div>
          <span className="guidedKickerV06">
            OPTIONAL
          </span>

          {(guidedAdventure
            ?.materials
            ?.optional || [])
            .slice(0, 3)
            .map(
              (item) => (
                <span
                  key={item}
                >
                  + {item}
                </span>
              )
            )}
        </div>
      </div>
    </>
  )
}


function ResourceStage({
  resources,
  exploredResourceIds,
  onToggleResource,
}) {
  return (
    <>
      <div className="guidedSectionIntroV06">
        <span className="guidedKickerV06">
          PICK ONE
        </span>

        <h3>
          Learn just enough to get an idea.
        </h3>

        <p>
          You don't need to finish everything.
          Choose one resource that looks interesting.
        </p>
      </div>

      <div className="guidedResourceGridV06">
        {resources.map(
          (resource) => {
            const explored =
              exploredResourceIds.includes(
                resource.id
              )

            return (
              <article
                className={
                  explored
                    ? 'guidedResourceCardV06 explored'
                    : 'guidedResourceCardV06'
                }
                key={resource.id}
              >
                <div className="guidedResourceTopV06">
                  <span className="guidedResourceEmojiV06">
                    {resource.emoji ||
                      '🔎'}
                  </span>

                  <div>
                    <span className="guidedResourceProviderV06">
                      {resource.provider}
                    </span>

                    <h4>
                      {resource.title}
                    </h4>
                  </div>
                </div>

                <p>
                  {resource.kidDescription}
                </p>

                <div className="guidedResourceMetaV06">
                  <span>
                    ⏱️{' '}
                    {resource.estimatedMinutes}
                    {' '}min
                  </span>

                  <span>
                    {resource.difficulty}
                  </span>
                </div>

                <div className="guidedResourceActionsV06">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Resource ↗
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      onToggleResource(
                        resource.id
                      )
                    }
                  >
                    {explored
                      ? '✓ Explored'
                      : 'I explored this'}
                  </button>
                </div>
              </article>
            )
          }
        )}
      </div>
    </>
  )
}


function TryStage({
  stage,
  guidedAdventure,
  selectedActivityId,
  onSelectActivity,
}) {
  return (
    <>
      <div className="guidedSectionIntroV06">
        <span className="guidedKickerV06">
          YOUR TURN
        </span>

        <h3>
          Choose how you want to try it.
        </h3>

        <p>
          There is more than one way to be
          an engineer.
        </p>
      </div>

      <div className="guidedActivityGridV06">
        {(stage.activityOptions || [])
          .map(
            (activity) => {
              const selected =
                selectedActivityId ===
                activity.id

              const resource =
                activity.resourceId
                  ? guidedAdventure
                      ?.resources
                      ?.find(
                        (item) =>
                          item.id ===
                          activity.resourceId
                      )
                  : null

              return (
                <button
                  type="button"
                  key={activity.id}
                  className={
                    selected
                      ? 'guidedActivityCardV06 selected'
                      : 'guidedActivityCardV06'
                  }
                  onClick={() =>
                    onSelectActivity(
                      activity.id
                    )
                  }
                >
                  <span className="guidedActivityIconV06">
                    {activity.id ===
                    'virtual_robot'
                      ? '🎮'
                      : '✏️'}
                  </span>

                  <strong>
                    {activity.label}
                  </strong>

                  <p>
                    {resource
                      ?.kidDescription ||
                      activity.prompt}
                  </p>

                  {resource && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      Open tool ↗
                    </a>
                  )}

                  <span className="guidedSelectMarkV06">
                    {selected
                      ? '✓ Selected'
                      : 'Choose this'}
                  </span>
                </button>
              )
            }
          )}
      </div>
    </>
  )
}


function BuildStage({
  stage,
  guidedAdventure,
}) {
  return (
    <>
      <div className="guidedSectionIntroV06">
        <span className="guidedKickerV06">
          BUILD YOUR IDEA
        </span>

        <h3>
          Make your rescue robot better.
        </h3>

        <p>
          A sketch counts. A cardboard model
          counts. LEGO counts. What matters is
          thinking like a designer.
        </p>
      </div>

      <div className="guidedBuildPromptV06">
        <div className="guidedBuildRobotV06">
          🤖
        </div>

        <div>
          <strong>
            Your design goal
          </strong>

          <p>
            {guidedAdventure
              ?.mission?.challenge}
          </p>
        </div>
      </div>

      <div className="guidedPromptGridV06">
        {(stage.prompts || [])
          .map(
            (prompt, index) => (
              <div
                key={prompt}
                className="guidedPromptCardV06"
              >
                <span>
                  {index + 1}
                </span>

                <p>
                  {prompt}
                </p>
              </div>
            )
          )}
      </div>

      <div className="guidedBuildNoteV06">
        <span>🔄</span>

        <p>
          <strong>
            Engineer move:
          </strong>
          {' '}
          change at least one part of your
          first idea before continuing.
        </p>
      </div>
    </>
  )
}


// ============================================================
// KID EXPERIENCE STAGE
// ============================================================

function KidExperienceStage({
  exploration,
  prompt,
  promptIndex,
  promptCount,
  onAnswer,
  onExit,
}) {
  const progress =
    ((promptIndex + 1) /
      promptCount) *
    100

  return (
    <section className="guidedAdventureV06">

      <div className="guidedTopbarV06">
        <span className="guidedKickerV06">
          {exploration.emoji || '🚀'}
          {' '}
          {exploration.title}
        </span>

        <button
          type="button"
          className="guidedExitV06"
          onClick={onExit}
        >
          Exit Adventure
        </button>
      </div>


      <div className="guidedProgressHeaderV06">
        <div>
          <span className="guidedKickerV06">
            KID EXPERIENCE
          </span>

          <strong>
            Mission Check-In
          </strong>
        </div>

        <span>
          {promptIndex + 1}
          {' '}of{' '}
          {promptCount}
        </span>
      </div>

      <div className="guidedProgressTrackV06">
        <div
          style={{
            width:
              `${progress}%`,
          }}
        />
      </div>


      <div className="guidedKidExperienceV06">

        <div className="guidedKidExperienceIconV06">
          {promptIndex === 0
            ? '🎉'
            : promptIndex === 1
              ? '🧠'
              : '🧭'}
        </div>

        <span className="guidedKickerV06">
          WHAT FELT LIKE YOU?
        </span>

        <h1>
          {prompt.question}
        </h1>

        <p>
          This isn't a test. Tell us what
          the experience actually felt like
          for you.
        </p>


        <div className="guidedKidAnswerGridV06">
          {(prompt.options || [])
            .map(
              (answer) => (
                <button
                  type="button"
                  key={answer.id}
                  onClick={() =>
                    onAnswer(answer)
                  }
                >
                  <span>
                    {answer.label}
                  </span>

                  <span
                    aria-hidden="true"
                  >
                    →
                  </span>
                </button>
              )
            )}
        </div>

      </div>

    </section>
  )
}


function getGuidedStageHeadline(
  stageId
) {
  switch (stageId) {
    case 'get_ready':
      return 'Understand the problem.'

    case 'learn':
      return 'Unlock a few robot ideas.'

    case 'try':
      return 'Test something yourself.'

    case 'build':
      return 'Create your rescue robot.'

    default:
      return 'Keep exploring.'
  }
}


export default AdventureFlow
