import { useState } from 'react'
import './IntelligenceValidationPanel.css'

const summarize = (result) => {
  const strategies = result?.strategyResults || []
  return {
    strategies: strategies.length,
    candidates: strategies.reduce(
      (total, item) => total + (item.candidates?.length || 0),
      0
    ),
  }
}

function IntelligenceValidationPanel({ results = [] }) {
  const [expanded, setExpanded] = useState(null)

  if (!results.length) return null

  return (
    <section className="validationPanelV07">
      <div className="validationHeaderV07">
        <div>
          <span>DEVELOPER VALIDATION</span>
          <h2>v0.7 Intelligence Validation</h2>
          <p>
            Temporary local tests showing how the Experience Research
            Engine responds to different synthetic child profiles.
          </p>
        </div>
        <b>Temporary</b>
      </div>

      <div className="validationListV07">
        {results.map((result) => {
          const summary = summarize(result)
          const open = expanded === result.scenarioId

          return (
            <article key={result.scenarioId} className="validationScenarioV07">
              <button
                type="button"
                className="validationRowV07"
                onClick={() => setExpanded(open ? null : result.scenarioId)}
              >
                <div>
                  <strong>✓ {result.label}</strong>
                  <small>
                    Age {result.child?.age}
                    {result.child?.grade ? ` · ${result.child.grade}` : ''}
                  </small>
                </div>
                <div className="validationMetricsV07">
                  <span>{summary.strategies} strategies</span>
                  <span>{summary.candidates} candidates</span>
                  <em>{open ? 'Hide details' : 'View details'}</em>
                </div>
              </button>

              {open && (
                <div className="validationDetailsV07">
                  {result.strategyResults.map((strategy, index) => (
                    <div className="validationStrategyV07" key={`${strategy.strategy}-${index}`}>
                      <div className="validationStrategyTitleV07">
                        <div>
                          <small>STRATEGY</small>
                          <strong>{strategy.strategy}</strong>
                        </div>
                        <span>{strategy.candidates?.length || 0} candidates</span>
                      </div>

                      <small className="validationLabelV07">SEARCH DIRECTIONS</small>
                      <ul>
                        {strategy.searchQueries?.slice(0, 3).map((query, i) => (
                          <li key={i}>{query}</li>
                        ))}
                      </ul>

                      <small className="validationLabelV07">EXPERIENCE CANDIDATES</small>
                      <div className="validationCandidatesV07">
                        {strategy.candidates?.length ? (
                          strategy.candidates.map((candidate) => (
                            <div key={candidate.id}>
                              <strong>{candidate.title}</strong>
                              <small>Builds on: {candidate.buildsOn?.join(', ') || '—'}</small>
                              <small>Practices: {candidate.practices?.join(', ') || '—'}</small>
                            </div>
                          ))
                        ) : (
                          <p>No eligible candidates for this strategy.</p>
                        )}
                      </div>

                      <div className="validationStatusesV07">
                        {strategy.evaluations?.map((evaluation) => (
                          <span key={evaluation.resourceId} className={evaluation.status}>
                            {evaluation.status} {evaluation.score}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          )
        })}
      </div>

      <p className="validationFooterV07">
        Synthetic profiles only. This panel does not modify the child's
        profile, Journey, evidence, or saved data.
      </p>
    </section>
  )
}

export default IntelligenceValidationPanel
