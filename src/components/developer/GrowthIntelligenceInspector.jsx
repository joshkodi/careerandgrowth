// src/components/developer/GrowthIntelligenceInspector.jsx

function GrowthIntelligenceInspector({
  profile,
  evidenceEventCount,
  traits,
  domains,
  pathways,
  careers,
  recommendations = [],
  onReset,
}) {
  if (!profile) {
    return null
  }

  const rowStyle = {
    display: 'flex',
    justifyContent:
      'space-between',
    gap: '1rem',
    padding: '0.5rem 0',
    borderBottom:
      '1px solid #e4e7ee',
  }

  const valueStyle = {
    whiteSpace: 'nowrap',
    fontWeight: 700,
  }

  return (
    <details
      style={{
        maxWidth: '760px',
        margin: '2rem auto 0',
        padding: '1rem',
        border:
          '1px dashed #aeb6c7',
        borderRadius: '14px',
        background: '#f8f9fc',
        textAlign: 'left',
        color: '#172033',
      }}
    >

      <summary
        style={{
          cursor: 'pointer',
          fontWeight: 800,
        }}
      >
        🧪 Developer: Growth
        Intelligence Inspector
      </summary>

      <div
        style={{
          marginTop: '1rem',
          fontSize: '0.88rem',
          lineHeight: 1.45,
        }}
      >

        <div style={rowStyle}>
          <span>
            Evidence events
          </span>

          <span style={valueStyle}>
            {evidenceEventCount}
          </span>
        </div>

        <div style={rowStyle}>
          <span>
            Evidence observations
          </span>

          <span style={valueStyle}>
            {
              profile
                .evidenceSummary
                ?.observationCount ||
              0
            }
          </span>
        </div>

        <div style={rowStyle}>
          <span>
            Experiences represented
          </span>

          <span style={valueStyle}>
            {
              profile
                .evidenceSummary
                ?.experienceCount ||
              0
            }
          </span>
        </div>

        <div style={rowStyle}>
          <span>
            Source types represented
          </span>

          <span style={valueStyle}>
            {
              profile
                .evidenceSummary
                ?.sourceTypeCount ||
              0
            }
          </span>
        </div>


        <InspectorSection
          title="Level 2 — Traits"
          items={traits}
          renderValue={(item) =>
            `${item.score}/100 · ${item.confidence.label}`
          }
        />

        <InspectorSection
          title="Level 3 — Domains"
          items={domains}
          renderValue={(item) =>
            `${item.score}/100 · ${item.confidence.label}`
          }
        />

        <InspectorSection
          title="Level 4 — Pathways"
          items={pathways}
          renderValue={(item) =>
            `${item.score}/100 · ${item.confidence.label}`
          }
        />

        <InspectorSection
          title="Level 5 — Career Families"
          items={careers}
          renderValue={(item) =>
            `${item.relevance}/100 · ${item.status.label}`
          }
        />


        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop:
              '1px solid #d7dce6',
          }}
        >

          <strong>
            🎯 Recommendation Engine v1
          </strong>

          <p
            style={{
              margin:
                '0.35rem 0 0.8rem',
              color:
                '#68748a',
              fontSize:
                '0.78rem',
            }}
          >
            Experimental Grow
            recommendations based on
            Growth Profile, Student
            Intent, and Parent Goals.
          </p>

          {recommendations.length ===
          0 ? (
            <p>
              No recommendations yet.
            </p>
          ) : (
            recommendations.map(
              (
                recommendation,
                index
              ) => (
                <div
                  key={
                    recommendation
                      .experienceId
                  }
                  style={{
                    marginBottom:
                      '0.75rem',
                    padding:
                      '0.8rem',
                    border:
                      '1px solid #e1e5eb',
                    borderRadius:
                      '10px',
                    background:
                      '#ffffff',
                  }}
                >

                  <div
                    style={{
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      gap: '1rem',
                    }}
                  >

                    <strong>
                      {index + 1}.{' '}
                      {
                        recommendation
                          .emoji
                      }{' '}
                      {
                        recommendation
                          .title
                      }
                    </strong>

                    <span
                      style={{
                        whiteSpace:
                          'nowrap',
                        fontWeight:
                          800,
                      }}
                    >
                      {
                        recommendation
                          .score
                      }
                      /100
                    </span>

                  </div>

                  <div
                    style={{
                      marginTop:
                        '0.55rem',
                    }}
                  >
                    {
                      recommendation
                        .reasons
                        .map(
                          (
                            reason,
                            reasonIndex
                          ) => (
                            <div
                              key={
                                reasonIndex
                              }
                              style={{
                                marginTop:
                                  '0.3rem',
                                color:
                                  '#68748a',
                                fontSize:
                                  '0.78rem',
                                lineHeight:
                                  1.45,
                              }}
                            >
                              • {reason}
                            </div>
                          )
                        )
                    }
                  </div>

                  <div
                    style={{
                      marginTop:
                        '0.65rem',
                      display:
                        'flex',
                      flexWrap:
                        'wrap',
                      gap:
                        '0.4rem',
                    }}
                  >

                    <InspectorMatchBadge
                      label="Profile"
                      count={
                        recommendation
                          .matches
                          .profileSignals
                          .length
                      }
                    />

                    <InspectorMatchBadge
                      label="Student"
                      count={
                        recommendation
                          .matches
                          .studentIntents
                          .length
                      }
                    />

                    <InspectorMatchBadge
                      label="Parent"
                      count={
                        recommendation
                          .matches
                          .parentIntents
                          .length
                      }
                    />

                  </div>

                </div>
              )
            )
          )}

        </div>


        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop:
              '1px solid #d7dce6',
          }}
        >

          <strong>
            Developer Tools
          </strong>

          <p
            style={{
              margin:
                '0.35rem 0 0.75rem',
              color:
                '#68748a',
              fontSize:
                '0.78rem',
            }}
          >
            Clear all test evidence,
            intents, Journey items,
            and profile data and start
            a new persona from a
            completely clean state.
          </p>

          <button
            type="button"
            onClick={onReset}
            style={{
              padding:
                '0.55rem 0.8rem',
              border:
                '1px solid #b7bfce',
              borderRadius:
                '9px',
              background:
                '#ffffff',
              color:
                '#3f4c63',
              fontSize:
                '0.78rem',
              fontWeight:
                700,
              cursor:
                'pointer',
            }}
          >
            🧹 Reset Test Data
          </button>

        </div>

      </div>

    </details>
  )
}


function InspectorSection({
  title,
  items,
  renderValue,
}) {
  return (
    <div
      style={{
        marginTop: '1.25rem',
      }}
    >

      <strong>
        {title}
      </strong>

      {items.length === 0 ? (
        <p>
          No evidence yet.
        </p>
      ) : (
        items.map(
          (item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                gap: '1rem',
                padding:
                  '0.5rem 0',
                borderBottom:
                  '1px solid #e4e7ee',
              }}
            >

              <span>
                {item.emoji
                  ? `${item.emoji} `
                  : ''}
                {item.label}
              </span>

              <span
                style={{
                  whiteSpace:
                    'nowrap',
                  fontWeight: 700,
                }}
              >
                {renderValue(
                  item
                )}
              </span>

            </div>
          )
        )
      )}

    </div>
  )
}


function InspectorMatchBadge({
  label,
  count,
}) {
  const matched =
    count > 0

  return (
    <span
      style={{
        padding:
          '0.25rem 0.5rem',
        borderRadius:
          '999px',
        background:
          matched
            ? '#edf6ef'
            : '#f2f3f5',
        color:
          matched
            ? '#2d6845'
            : '#8a929d',
        fontSize:
          '0.68rem',
        fontWeight:
          700,
      }}
    >
      {matched ? '✓' : '—'}{' '}
      {label}

      {matched &&
        count > 1 &&
        ` (${count})`}
    </span>
  )
}


export default GrowthIntelligenceInspector
