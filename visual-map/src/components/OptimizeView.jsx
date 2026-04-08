const HERO_OPT = {
  crown: { symbol: '★', label: 'Crown Hero' },
  hero:  { symbol: '◆', label: 'Hero' },
}

function OptCard({ slug, post, clusterColor, selected, onSelect }) {
  const opt = post.optimization
  const items = opt.items || []
  const done = items.filter(i => i.done).length
  const total = items.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const isComplete = done === total
  const hero = HERO_OPT[post.hero_tier]

  const highCount = items.filter(i => i.priority === 'high' && !i.done).length
  const medCount  = items.filter(i => i.priority === 'medium' && !i.done).length

  return (
    <div
      onClick={() => onSelect(slug)}
      className={`card card-clickable${selected === slug ? ' selected' : ''}`}
      style={{
        padding: '12px 14px',
        borderLeft: `3px solid ${isComplete ? '#15803d' : clusterColor}`,
        background: selected === slug ? '#f0f5ff' : 'var(--bg2)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flex: 1 }}>
          {hero && (
            <span style={{ color: 'var(--text3)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{hero.symbol}</span>
          )}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, flex: 1 }}>
            {post.title}
            {hero && <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 6px', marginLeft: 6 }}>{hero.label}</span>}
          </div>
        </div>
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
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%`, background: isComplete ? '#15803d' : clusterColor }} />
        </div>
        <span style={{ fontSize: 10, color: 'var(--text3)', minWidth: 30 }}>{pct}%</span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
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
    // Crown posts first, then by high priority count
    const aCrown = a[1].hero_tier === 'crown' ? 1 : 0
    const bCrown = b[1].hero_tier === 'crown' ? 1 : 0
    if (bCrown !== aCrown) return bCrown - aCrown
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
            <div key={s.label} className="stat-block">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Needs work */}
        {pending.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div className="group-header">
              <span className="title" style={{ color: '#dc2626' }}>Needs work</span>
              <span className="count">({pending.length})</span>
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
            <div className="group-header">
              <span className="title" style={{ color: '#15803d' }}>Complete</span>
              <span className="count">({complete.length})</span>
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
            <div className="group-header">
              <span className="title" style={{ color: 'var(--text3)' }}>Not yet audited</span>
              <span className="count">({noAudit.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {noAudit.map(([slug, post]) => (
                <div
                  key={slug}
                  onClick={() => onSelect(slug)}
                  style={{
                    padding: '9px 14px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${selected === slug ? '#6b7280' : 'var(--border)'}`,
                    borderLeft: `3px solid ${clusterById[post.cluster]?.color || 'var(--border)'}`,
                    background: selected === slug ? '#f0f5ff' : 'var(--bg2)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    opacity: 0.7,
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
