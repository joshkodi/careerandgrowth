import Avatar from './Avatar'
import './FirstUsePersonalizedHome.css'

export default function FirstUsePersonalizedHome({
  childProfile,
  personalization,
  onExplore,
  onGrowthProfile,
  onDiscover,
}) {
  const childName = childProfile?.name?.trim() || 'Explorer'
  const signals = personalization?.signals || []
  const recommendations = personalization?.recommendations || []

  return (
    <section className="synPersonalizedHomeV014">
      <header className="synPersonalizedHeroV014">
        <Avatar avatarId={childProfile?.avatarId} size={72} />
        <div>
          <span>YOUR SYNAPSTRIDE IS TAKING SHAPE</span>
          <h1>Nice to meet you, {childName}! 👋</h1>
          <p>Here&apos;s what I&apos;m starting to learn about you.</p>
        </div>
      </header>

      <section className="synPersonalizedSignalsV014">
        <div className="synPersonalizedSectionHeadV014">
          <div>
            <span>FIRST CLUES</span>
            <h2>Things you&apos;ve told me</h2>
          </div>
          <button type="button" onClick={onGrowthProfile}>See My Profile →</button>
        </div>

        <div className="synPersonalizedSignalGridV014">
          {signals.map((signal) => (
            <article key={signal.id}>
              <b>{signal.emoji || '✨'}</b>
              <strong>{signal.label}</strong>
            </article>
          ))}
        </div>

        <p className="synPersonalizedCautionV014">
          These are early clues, not labels. SynapStride will keep learning as you try and reflect on things.
        </p>
      </section>

      <section className="synPersonalizedIdeasV014">
        <div className="synPersonalizedSectionHeadV014">
          <div>
            <span>YOUR FIRST IDEAS</span>
            <h2>Picked with you in mind</h2>
          </div>
          <button type="button" onClick={onExplore}>Explore more →</button>
        </div>

        <div className="synPersonalizedIdeaGridV014">
          {recommendations.map((item, index) => (
            <button type="button" key={item.id || item.title || index} onClick={onExplore}>
              <span>{item.emoji || (index === 0 ? '🚀' : index === 1 ? '🛠️' : '✨')}</span>
              <div>
                <strong>{item.title || item.label || 'Something worth trying'}</strong>
                <p>{item.description || item.summary || 'Try it and see what you notice.'}</p>
                <small>✨ {item.personalizationReason}</small>
              </div>
              <b>→</b>
            </button>
          ))}

          {recommendations.length === 0 && (
            <article className="synPersonalizedEmptyV014">
              <span>🌱</span>
              <div>
                <strong>Your first ideas are growing.</strong>
                <p>Explore something now, or tell SynapStride a little more about you.</p>
              </div>
              <button type="button" onClick={onDiscover}>Tell me more →</button>
            </article>
          )}
        </div>
      </section>
    </section>
  )
}
