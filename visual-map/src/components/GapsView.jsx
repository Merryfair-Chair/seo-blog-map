import { useState } from 'react'

const STATUS_STYLE = {
  suggested:    { bg: '#fffbeb', text: '#b45309', border: '#fde68a', label: 'Suggested' },
  approved:     { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', label: 'Approved' },
  rejected:     { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb', label: 'Rejected' },
  published:    { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', label: 'Published' },
  in_progress:  { bg: 'rgba(124,58,237,0.09)', text: '#7c3aed', border: 'rgba(124,58,237,0.25)', label: 'In Progress' },
  deprioritized:{ bg: '#fafafa', text: '#9ca3af', border: '#e5e7eb', label: 'Deprioritized' },
}

const PURPOSE_STYLE = {
  traffic:   { label: 'Traffic',   bg: 'rgba(37,99,235,0.10)',  color: '#2563eb',  border: 'rgba(37,99,235,0.22)' },
  authority: { label: 'Authority', bg: 'rgba(124,58,237,0.10)', color: '#7c3aed',  border: 'rgba(124,58,237,0.22)' },
  hub:       { label: 'Hub',       bg: 'rgba(8,145,178,0.10)',  color: '#0891b2',  border: 'rgba(8,145,178,0.22)' },
}

function KdBadge({ kd }) {
  if (kd == null) return null
  const color = kd <= 10 ? '#15803d' : kd <= 30 ? '#ca8a04' : '#dc2626'
  const bg    = kd <= 10 ? '#f0fdf4' : kd <= 30 ? '#fffbeb' : '#fef2f2'
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
      background: bg, color, border: `1px solid ${color}33`,
    }}>
      KD {kd}
    </span>
  )
}

function PurposeBadge({ purpose }) {
  if (!purpose) return null
  const s = PURPOSE_STYLE[purpose] || PURPOSE_STYLE.authority
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 3,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {s.label}
    </span>
  )
}

export default function GapsView({ clusters, selected, onSelect, onAddIdea, postDetails }) {
  const [showRejected, setShowRejected] = useState(false)

  const allGaps = clusters.flatMap(c =>
    (c.gaps || []).map(g => ({ ...g, clusterName: c.name, clusterColor: c.color }))
  )

  // Split active vs rejected
  const activeGaps   = allGaps.filter(g => g.status !== 'rejected')
  const rejectedGaps = allGaps.filter(g => g.status === 'rejected')

  const byStatus = {
    approved:      activeGaps.filter(g => g.status === 'approved'),
    in_progress:   activeGaps.filter(g => g.status === 'in_progress'),
    suggested:     activeGaps.filter(g => g.status === 'suggested' || !g.status),
    published:     activeGaps.filter(g => g.status === 'published'),
    deprioritized: activeGaps.filter(g => g.status === 'deprioritized'),
  }

  const validatedCount = allGaps.filter(g => g.ahrefsValidated).length
  const approvedMyVol  = [...byStatus.approved, ...byStatus.suggested]
    .reduce((s, g) => s + (g.estVolume || 0), 0)

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        {/* Summary stats + Add Idea button */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { label: 'Total gaps',      value: activeGaps.length,          color: 'var(--text)' },
              { label: 'Approved',        value: byStatus.approved.length,   color: '#1d4ed8' },
              { label: 'In progress',     value: byStatus.in_progress.length,color: '#7c3aed' },
              { label: 'MY vol (active)', value: `${approvedMyVol}/mo`,      color: '#b45309' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '12px 14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <button
            onClick={onAddIdea}
            style={{
              padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              background: '#f59e0b', color: '#fff', border: 'none',
              boxShadow: '0 1px 4px rgba(245,158,11,0.35)',
              flexShrink: 0, whiteSpace: 'nowrap',
            }}
          >
            ＋ Add Idea
          </button>
        </div>

        {/* Ahrefs validation banner */}
        {validatedCount > 0 && (
          <div style={{
            background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8,
            padding: '9px 14px', marginBottom: 20, fontSize: 11, color: '#1e40af',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 14 }}>🔍</span>
            <span>
              <strong>{validatedCount}/{allGaps.length} gaps</strong> validated with live Ahrefs data · Last run: {allGaps.find(g => g.ahrefsValidationDate)?.ahrefsValidationDate || '—'}
            </span>
          </div>
        )}

        {/* Gaps by status (active only) */}
        {Object.entries(byStatus).filter(([, gaps]) => gaps.length > 0).map(([status, gaps]) => {
          const s = STATUS_STYLE[status] || STATUS_STYLE.suggested
          const isInProgress = status === 'in_progress'
          return (
            <div key={status} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: s.text, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {isInProgress && <span style={{ marginRight: 4 }}>◌</span>}
                  {s.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>({gaps.length})</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...gaps].sort((a, b) => (b.estVolume || 0) - (a.estVolume || 0)).map((gap, i) => (
                  <div
                    key={gap.id || i}
                    onClick={() => onSelect(gap.id)}
                    style={{
                      padding: '14px 16px', borderRadius: 'var(--radius)',
                      border: `1px solid ${selected === gap.id ? gap.clusterColor : 'var(--border)'}`,
                      borderLeft: `4px solid ${gap.clusterColor}`,
                      background: selected === gap.id ? '#f0f5ff' : status === 'deprioritized' ? '#fafafa' : 'var(--bg2)',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      outline: isInProgress ? '2px dashed #7c3aed' : selected === gap.id ? `2px solid ${gap.clusterColor}` : 'none',
                      outlineOffset: isInProgress ? '2px' : '0',
                      opacity: status === 'deprioritized' ? 0.75 : 1,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 5 }}>{gap.title}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', fontSize: 11, color: 'var(--text3)', alignItems: 'center' }}>
                          {/* Purpose badge */}
                          <PurposeBadge purpose={gap.purpose} />

                          <span style={{ color: gap.clusterColor, fontWeight: 600 }}>● {gap.clusterName}</span>
                          <span>KW: <strong style={{ color: 'var(--text2)' }}>{gap.targetKeyword}</strong></span>

                          {/* MY volume */}
                          {gap.estVolume > 0
                            ? <span style={{ color: '#b45309', fontWeight: 700 }}>{gap.estVolume}/mo MY</span>
                            : <span style={{ color: '#9ca3af' }}>0 MY</span>
                          }

                          {/* Global volume */}
                          {gap.globalVolume > 0 && (
                            <span style={{ color: '#6b7280' }}>{gap.globalVolume}/mo global</span>
                          )}

                          {/* KD badge */}
                          <KdBadge kd={gap.keywordDifficulty} />

                          {/* TP */}
                          {gap.trafficPotential > 0 && (
                            <span style={{ color: '#0891b2' }}>TP {gap.trafficPotential.toLocaleString()}</span>
                          )}

                          {gap.intent && <span style={{ fontStyle: 'italic' }}>{gap.intent}</span>}

                          {/* Ahrefs validated badge */}
                          {gap.ahrefsValidated && (
                            <span style={{
                              fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                              background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0',
                            }}>✓ Ahrefs</span>
                          )}

                          {/* Cannibalization warning */}
                          {gap.cannibalizes && (
                            <span style={{
                              fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                              background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a',
                            }}>⚠ overlap: {gap.cannibalizes}</span>
                          )}
                        </div>

                        {/* Hero target chip */}
                        {gap.heroTarget && postDetails?.[gap.heroTarget] && (
                          <div style={{
                            marginTop: 5, fontSize: 10, color: '#0891b2',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400,
                          }}>
                            → {postDetails[gap.heroTarget].title?.length > 55
                              ? postDetails[gap.heroTarget].title.slice(0, 55) + '…'
                              : postDetails[gap.heroTarget].title
                            }
                          </div>
                        )}
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, flexShrink: 0,
                        background: s.bg, color: s.text, border: `1px solid ${s.border}`,
                      }}>
                        {s.label}
                      </span>
                    </div>

                    {/* Ahrefs intelligence note */}
                    {gap.ahrefsNote && (
                      <div style={{
                        fontSize: 11, color: '#1e40af', lineHeight: 1.6,
                        padding: '7px 10px', borderRadius: 6,
                        background: '#eff6ff', border: '1px solid #bfdbfe',
                        marginTop: 8,
                      }}>
                        {gap.ahrefsNote}
                      </div>
                    )}

                    {/* Alternative keywords */}
                    {gap.alternativeKeywords?.length > 0 && (
                      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {gap.alternativeKeywords.filter(k => k.myVolume > 0).map((k, ki) => (
                          <span key={ki} style={{
                            fontSize: 10, padding: '2px 7px', borderRadius: 4,
                            background: 'var(--bg3)', color: 'var(--text2)',
                            border: '1px solid var(--border)',
                          }}>
                            {k.keyword} <strong style={{ color: '#b45309' }}>{k.myVolume}/mo</strong>
                            {k.kd != null && <span style={{ color: '#6b7280' }}> · KD {k.kd}</span>}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Original rationale (non-Ahrefs gaps) */}
                    {gap.rationale && !gap.ahrefsNote && (
                      <div style={{
                        fontSize: 12, color: 'var(--text2)', lineHeight: 1.65,
                        padding: '8px 10px', borderRadius: 6,
                        background: 'var(--bg3)',
                        marginTop: 8, borderLeft: `3px solid ${gap.clusterColor}40`,
                      }}>
                        {gap.rationale}
                      </div>
                    )}

                    {(gap.suggestedLinksOut?.length > 0 || gap.suggestedLinksIn?.length > 0) && (
                      <div style={{ marginTop: 7, fontSize: 10, color: 'var(--text3)', fontStyle: 'italic' }}>
                        ↗ {gap.suggestedLinksOut?.length || 0} links out · ↙ {gap.suggestedLinksIn?.length || 0} links in — click to see details
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Rejected section — collapsible */}
        {rejectedGaps.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <button
              onClick={() => setShowRejected(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 11, fontWeight: 700, color: 'var(--text3)',
                padding: '6px 0', background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <span style={{ transform: showRejected ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
              Rejected ({rejectedGaps.length})
            </button>

            {showRejected && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {rejectedGaps.map((gap, i) => {
                  const s = STATUS_STYLE.rejected
                  return (
                    <div
                      key={gap.id || i}
                      onClick={() => onSelect(gap.id)}
                      style={{
                        padding: '12px 14px', borderRadius: 'var(--radius)',
                        border: `1px solid ${selected === gap.id ? gap.clusterColor : 'var(--border)'}`,
                        borderLeft: `4px solid ${gap.clusterColor}`,
                        background: 'var(--bg2)',
                        cursor: 'pointer', opacity: 0.6,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text)', marginBottom: 3 }}>{gap.title}</div>
                          <div style={{ fontSize: 10, color: 'var(--text3)' }}>
                            <span style={{ color: gap.clusterColor }}>● {gap.clusterName}</span>
                            {' · '}KW: {gap.targetKeyword}
                          </div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: s.bg, color: s.text, border: `1px solid ${s.border}`, flexShrink: 0 }}>
                          Rejected
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
