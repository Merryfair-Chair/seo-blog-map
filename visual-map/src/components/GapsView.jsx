const STATUS_STYLE = {
  suggested:  { bg: 'rgba(212,132,26,0.12)', text: '#d4841a', label: 'Suggested' },
  approved:   { bg: 'rgba(79,142,247,0.12)', text: '#4f8ef7', label: 'Approved' },
  rejected:   { bg: 'rgba(100,100,100,0.12)', text: '#666', label: 'Rejected' },
  published:  { bg: 'rgba(52,199,123,0.12)', text: '#34c77b', label: 'Published' },
}

export default function GapsView({ clusters, selected, onSelect }) {
  const allGaps = clusters.flatMap(c =>
    (c.gaps || []).map(g => ({ ...g, clusterName: c.name, clusterColor: c.color }))
  )

  const byStatus = {
    approved: allGaps.filter(g => g.status === 'approved'),
    suggested: allGaps.filter(g => g.status === 'suggested' || !g.status),
    published: allGaps.filter(g => g.status === 'published'),
    rejected: allGaps.filter(g => g.status === 'rejected'),
  }

  const totalVol = allGaps
    .filter(g => g.status !== 'rejected')
    .reduce((s, g) => s + (g.estVolume || 0), 0)

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Total gaps', value: allGaps.length },
            { label: 'Approved', value: byStatus.approved.length, color: '#4f8ef7' },
            { label: 'Published', value: byStatus.published.length, color: '#34c77b' },
            { label: 'Est. monthly vol.', value: `${totalVol}/mo`, color: 'var(--gap-color)' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '12px 14px',
            }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: s.color || 'var(--text)' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {Object.entries(byStatus).filter(([, gaps]) => gaps.length > 0).map(([status, gaps]) => (
          <div key={status} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: STATUS_STYLE[status]?.text || 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              {STATUS_STYLE[status]?.label} ({gaps.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {gaps.sort((a, b) => (b.estVolume || 0) - (a.estVolume || 0)).map((gap, i) => {
                const s = STATUS_STYLE[status] || STATUS_STYLE.suggested
                return (
                  <div
                    key={gap.id || i}
                    onClick={() => onSelect(gap.id)}
                    style={{
                      padding: '14px 16px', borderRadius: 'var(--radius)',
                      border: `1px solid var(--border)`,
                      borderLeft: `3px solid ${gap.clusterColor}`,
                      background: selected === gap.id ? 'var(--bg3)' : 'var(--bg2)',
                      cursor: 'pointer',
                      outline: selected === gap.id ? `2px solid ${gap.clusterColor}60` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{gap.title}</div>
                        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text3)' }}>
                          <span style={{ color: gap.clusterColor }}>
                            <div style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 2, background: gap.clusterColor, marginRight: 4, verticalAlign: 'middle' }} />
                            {gap.clusterName}
                          </span>
                          <span>Keyword: <span style={{ color: 'var(--text2)' }}>{gap.targetKeyword}</span></span>
                          <span>{gap.estVolume}/mo</span>
                          {gap.intent && <span style={{ color: 'var(--text3)' }}>{gap.intent}</span>}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
                        background: s.bg, color: s.text, flexShrink: 0,
                      }}>
                        {s.label}
                      </span>
                    </div>
                    {gap.rationale && (
                      <div style={{
                        fontSize: 12, color: 'var(--text2)', lineHeight: 1.6,
                        padding: '8px 10px', borderRadius: 6, background: 'var(--bg)',
                        marginTop: 8,
                      }}>
                        {gap.rationale}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
