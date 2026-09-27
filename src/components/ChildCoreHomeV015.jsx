import { useMemo } from 'react'
import Avatar from './Avatar'
import CompanionAvatar from './CompanionAvatar'
import './ChildCoreHomeV015.css'
import { buildChildExperienceProfile } from '../intelligence/childExperienceProfile'
import { buildCompanionHomeContext } from '../intelligence/companionContextEngine'
import { journeyPaths } from '../intelligence/unifiedJourneyModels'

function ChildCoreHomeV015({
  childProfile,
  journeyItems = [],
  needsAttention,
  recommendation,
  personalizedGuidance,
  growthGuide,
  guideInput,
  guideReply,
  setGuideInput,
  handleGuideSubmit,
  runGuideRequest,
  guideBusy = false,
  onSchool,
  onJourney,
  onExplore,
  onGrowthProfile,
  onStartGrow,
}) {
  const childName = childProfile?.name?.trim() || 'Explorer'
  const experience = useMemo(
    () => buildChildExperienceProfile(childProfile),
    [childProfile]
  )
  const context = useMemo(
    () => buildCompanionHomeContext({ journeyItems, needsAttention, recommendedItem: recommendation }),
    [journeyItems, needsAttention, recommendation]
  )

  const resume = context.resume
  const whyRecommendation =
    personalizedGuidance?.tryNext?.reason ||
    recommendation?.reasons?.[0] ||
    'It connects with things you have shown interest in and gives you something new to try.'

  const guideActions = growthGuide?.actions || []
  const continueGuide = guideActions.find((item) => item.category === 'continue')
  const exploreGuide = guideActions.find((item) => item.category === 'explore')
  const growGuide = guideActions.find((item) => item.category === 'grow')

  const runGrowthGuideAction = (guide) => {
    if (!guide) return
    if (guide.action === 'continue_work') return continueItem()
    if (guide.action === 'try_recommendation') return onStartGrow?.(guide.item)
    if (guide.action === 'profile') return onGrowthProfile?.()
    if (guide.action === 'explore') return onExplore?.()
  }

  const continueItem = () => {
    if (!resume?.item) return onJourney?.()
    if (resume.item.path === journeyPaths.SCHOOL_LEARNING) return onSchool?.()
    if (resume.item.path === journeyPaths.ACTIVITIES_INTERESTS) return onExplore?.()
    return onJourney?.(resume.item.path)
  }

  return (
    <div className={`childCoreV015 childCoreV015--${experience.band}`}>
      <header className="childCoreWelcomeV015">
        <div className="childCoreGreetingV015">
          <Avatar avatarId={childProfile?.avatarId} size={54} />
          <div>
            <span>YOUR SPACE</span>
            <h1>Hi {childName}! <span aria-hidden="true">👋</span></h1>
            <p>{experience.greetingPrompt}</p>
          </div>
        </div>
        <button type="button" className="childCoreProfileV015" onClick={onGrowthProfile}>
          <span>🌱</span> See what I’m learning about you
        </button>
      </header>

      <section className="companionHeroV015" aria-label="SynapStride Companion">
        <div className="companionIdentityV015">
          <div className="companionMarkV015" aria-hidden="true">✦</div>
          <div>
            <span className="childCoreEyebrowV015">SYNAPSTRIDE COMPANION</span>
            <h2>{resume ? `Want a hand with what’s next?` : `I’m here when you need me.`}</h2>
            <p>Ask a question, get unstuck, or find a good next step. I’ll use what you’re working on to make the help more useful.</p>
          </div>
        </div>

        {guideBusy && (
          <div className="companionThinkingV017" aria-live="polite">
            <CompanionAvatar state="thinking" size={46} />
            <div><strong>Thinking about that...</strong><small>Your Companion is working on a helpful answer.</small></div>
          </div>
        )}

        {!guideBusy && guideReply && (
          <div className="companionReplyV015" aria-live="polite">
            <small>You asked: {guideReply.question}</small>
            <p>{guideReply.text}</p>
            {guideReply.followUpOptions?.length > 0 && (
              <div className="companionFollowUpsV017" aria-label="Suggested follow-up questions">
                {guideReply.followUpOptions.map((option) => (
                  <button type="button" key={option.id || option.label} disabled={guideBusy} onClick={() => runGuideRequest(option.prompt)}>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            {guideReply.actionLabel && guideReply.action && (
              <button type="button" onClick={guideReply.action}>{guideReply.actionLabel}</button>
            )}
          </div>
        )}

        <form className="companionAskV015" onSubmit={handleGuideSubmit}>
          <input
            value={guideInput}
            disabled={guideBusy}
            onChange={(event) => setGuideInput(event.target.value)}
            placeholder={experience.companionPlaceholder}
            aria-label="Ask your SynapStride Companion"
          />
          <button type="submit" disabled={guideBusy || !guideInput.trim()} aria-label="Send">→</button>
        </form>

        <div className="companionQuickV015">
          {resume?.item && (
            <button type="button" onClick={() => runGuideRequest(`Help me continue ${resume.title}`)}>▶ Help me continue</button>
          )}
          <button type="button" onClick={() => runGuideRequest('I need help with school work')}>📚 School help</button>
          <button type="button" onClick={() => runGuideRequest('What should I try next?')}>✨ What should I try?</button>
          <button type="button" onClick={() => runGuideRequest('I want to make something')}>🛠 Make something</button>
        </div>
      </section>

      <section className="growthGuideV0175" aria-label="Your Growth Guide">
        <div className="growthGuideHeadV0175">
          <div><span className="childCoreEyebrowV015">YOUR GROWTH GUIDE</span><h2>What feels right next?</h2></div>
          <p>A few useful choices — based on what’s already in motion and what SynapStride is learning with you.</p>
        </div>
        <div className="growthGuideGridV0175">
          {[
            ['continue', '▶', 'CONTINUE', continueGuide],
            ['explore', '✨', 'EXPLORE', exploreGuide],
            ['grow', '🌱', 'GROW', growGuide],
          ].map(([kind, icon, label, guide]) => guide && (
            <article className={`growthGuideCardV0175 growthGuideCardV0175--${kind}`} key={kind}>
              <small>{icon} {label}</small>
              <h3>{guide.title}</h3>
              <p>{guide.reason}</p>
              <button type="button" onClick={() => runGrowthGuideAction(guide)}>
                {kind === 'continue' ? 'Continue →' : kind === 'explore' ? 'Try it →' : 'See my growth →'}
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="childCoreGridV015">
        <section className="childCoreCardV015 keepGoingV015">
          <div className="childCoreSectionHeadV015">
            <div><span>▶</span><strong>Keep going</strong></div>
            <button type="button" onClick={onJourney}>My Growth →</button>
          </div>
          {resume ? (
            <div className="resumeItemV015">
              <div className="resumeIconV015">{resume.item.emoji || (resume.kind === 'School' ? '📚' : '🚀')}</div>
              <div>
                <small>{resume.kind}{resume.needsHelp ? ' · NEEDS HELP' : ''}</small>
                <h3>{resume.title}</h3>
                <p><b>Next:</b> {resume.nextStep}</p>
              </div>
              <button type="button" onClick={continueItem}>Continue →</button>
            </div>
          ) : (
            <div className="childCoreEmptyV015">
              <span>🌱</span>
              <div><strong>Nothing in progress yet.</strong><p>Start with school work or try something that interests you.</p></div>
            </div>
          )}
        </section>

        <section className="childCoreCardV015 schoolStartV015">
          <div className="childCoreSectionHeadV015"><div><span>📚</span><strong>Got school stuff?</strong></div></div>
          <p>Don’t fill out a bunch of boxes. Just show me or tell me what you’re working on.</p>
          <div className="schoolStartActionsV015">
            <button type="button" onClick={onSchool}>📷 <span>Show me</span></button>
            <button type="button" onClick={onSchool}>📄 <span>Upload</span></button>
            <button type="button" onClick={onSchool}>✏️ <span>Tell me</span></button>
          </div>
        </section>
      </div>

      <section className="childCoreCardV015 somethingForYouV015">
        <div className="childCoreSectionHeadV015">
          <div><span>👀</span><strong>Something for you</strong></div>
          <button type="button" onClick={onExplore}>Explore more →</button>
        </div>
        {recommendation ? (
          <div className="recommendationV015">
            <div className="recommendationArtV015">{recommendation.emoji || '🚀'}</div>
            <div>
              <small>THOUGHT YOU MIGHT LIKE THIS</small>
              <h3>{recommendation.title || recommendation.name}</h3>
              <p>{recommendation.description || whyRecommendation}</p>
              <details><summary>Why this?</summary><p>{whyRecommendation}</p></details>
            </div>
            <div className="recommendationActionsV015">
              <button type="button" className="primary" onClick={() => onStartGrow?.(recommendation)}>Try it →</button>
              <button type="button" onClick={() => runGuideRequest('Show me something different')}>Something different</button>
            </div>
          </div>
        ) : (
          <div className="childCoreEmptyV015">
            <span>🧭</span>
            <div><strong>Let’s find something that feels like you.</strong><p>The more you explore, the better these ideas can become.</p></div>
            <button type="button" onClick={onExplore}>Explore →</button>
          </div>
        )}
      </section>
    </div>
  )
}

export default ChildCoreHomeV015
