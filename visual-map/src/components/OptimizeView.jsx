const PRIORITY_COLOR = { high: '#dc2626', medium: '#d97706', low: '#6b7280' }

function OptCard({ slug, post, clusterColor, selected, onSelect }) {
  const opt = post.optimization
  const items = opt.items || []
  const done = items.filter(i => i.done).length
  const total = items.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const isComplete = done === total

  const highCount = items.filter(i => i.priority === 'high' && !i.done).length
  const medCount  = items.filter(i => i.priority === 'medium' && !i.done).length

  return (
    <div
      onClick={() => onSelect(slug)}
      style={{
        padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
        border: `1px solid ${selected === slug ? clusterColor : 'var(--border)'}`,
        borderLeft: `4px solid ${isComplete ? '#15803d' : clusterColor}`,
        background: selected === slug ? '#f0f5ff' : 'var(--bg2)',
        outline: selected === slug ? `2px solid ${clusterColor}` : 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, flex: 1 }}>{post.title}</div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, flexShrink: 0,
          background: isComplete ? '#f0fdf4' : '#fff',
          color: isComplete ? '#15803d' : 'var(--text2)',
          border: `1px solid ${isComplete ? '#bbf7d0' : 'var(--border)'}`,
        }}>
          {isComplete ? 'Complete' : `${done}/${total}`}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--bg3)' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: isComplete ? '#15803d' : clusterColor, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: 10, color: 'var(--text3)', minWidth: 30 }}>{pct}%</span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Remaining priority badges */}
        {highCount > 0 && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#fef2f2', color: '#dc2626' }}>
            {highCount} high
          </span>
        )}
        {medCount > 0 && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#fffbeb', color: '#d97706' }}>
            {medCount} medium
          </span>
        )}
        {/* Diagnosis preview */}
        {opt.diagnosis && (
          <span style={{ fontSize: 10, color: 'var(--text3)', fontStyle: 'italic', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {opt.diagnosis}
          </span>
        )}
      </div>
    </div>
  )
}

export default function OptimizeView({ clusters, postDetails, selected, onSelect }) {
  const clusterById = Object.fromEntries(clusters.map(c => [c.id, c]))

  const withOpt = Object.entries(postDetails)
    .filter(([, p]) => p.optimization?.items?.length > 0)

  const pending  = withOpt.filter(([, p]) => {
    const items = p.optimization.items
    return items.some(i => !i.done)
  }).sort((a, b) => {
    const aHigh = a[1].optimization.items.filter(i => i.priority === 'high' && !i.done).length
    const bHigh = b[1].optimization.items.filter(i => i.priority === 'high' && !i.done).length
    return bHigh - aHigh
  })

  const complete = withOpt.filter(([, p]) => p.optimization.items.every(i => i.done))

  const noAudit = Object.entries(postDetails)
    .filter(([, p]) => !p.optimization)
    .sort((a, b) => (b[1].gsc_clicks || 0) - (a[1].gsc_clicks || 0))

  const totalPending = pending.reduce((s, [, p]) => s + p.optimization.items.filter(i => !i.done).length, 0)

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Pending fixes', value: totalPending, color: '#dc2626' },
            { label: 'Posts audited', value: withOpt.length, color: 'var(--text)' },
            { label: 'Not yet audited', value: noAudit.length, color: 'var(--text3)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Needs work */}
        {pending.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Needs work</span>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>({pending.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {pending.map(([slug, post]) => (
                <OptCard
                  key={slug} slug={slug} post={post}
                  clusterColor={clusterById[post.cluster]?.color || '#2563eb'}
                  selected={selected} onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Complete */}
        {complete.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Complete</span>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>({complete.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {complete.map(([slug, post]) => (
                <OptCard
                  key={slug} slug={slug} post={post}
                  clusterColor={clusterById[post.cluster]?.color || '#15803d'}
                  selected={selected} onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Not yet audited */}
        {noAudit.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Not yet audited</span>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>({noAudit.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {noAudit.map(([slug, post]) => (
                <div
                  key={slug}
                  onClick={() => onSelect(slug)}
                  style={{
                    padding: '9px 14px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${selected === slug ? '#6b7280' : 'var(--border)'}`,
                    borderLeft: `4px solid ${clusterById[post.cluster]?.color || 'var(--border)'}`,
                    background: selected === slug ? '#f0f5ff' : 'var(--bg2)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{post.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{post.gsc_clicks || 0} clicks · {post.triage_status} traffic</div>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text3)', fontStyle: 'italic' }}>Run /optimize-post {slug}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
