const TRIAGE_GROUPS = [
  { key: 'high',   label: 'High traffic',   color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', desc: '100+ GSC clicks' },
  { key: 'medium', label: 'Medium traffic',  color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', desc: '10–99 clicks' },
  { key: 'low',    label: 'Low traffic',     color: '#d97706', bg: '#fffbeb', border: '#fde68a', desc: '1–9 clicks' },
  { key: 'none',   label: 'No traffic',      color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', desc: '0 clicks' },
]

function PostCard({ slug, post, color, selected, onSelect }) {
  const clicks = post.gsc_clicks || 0
  const impressions = post.gsc_impressions || 0
  const hasOpt = !!post.optimization
  const optDone = hasOpt ? post.optimization.items.filter(i => i.done).length : 0
  const optTotal = hasOpt ? post.optimization.items.length : 0

  return (
    <div
      onClick={() => onSelect(slug)}
      style={{
        padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
        border: `1px solid ${selected === slug ? color : 'var(--border)'}`,
        borderLeft: `4px solid ${color}`,
        background: selected === slug ? '#f0f5ff' : 'var(--bg2)',
        outline: selected === slug ? `2px solid ${color}` : 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4, lineHeight: 1.4 }}>{post.title}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 12px', fontSize: 11, color: 'var(--text3)' }}>
            <span style={{ color: clicks > 0 ? 'var(--text2)' : 'var(--text3)' }}>{clicks.toLocaleString()} clicks</span>
            <span>{impressions.toLocaleString()} impressions</span>
            {post.top_keyword && <span>#{post.top_kw_position} · {post.top_keyword}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${color}18`, color }}>
            {post.page_type}
          </span>
          {hasOpt && (
            <span style={{ fontSize: 10, color: optDone === optTotal ? '#15803d' : '#d97706', fontWeight: 600 }}>
              {optDone}/{optTotal} fixed
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TriageView({ clusters, postDetails, selected, onSelect }) {
  const clusterById = Object.fromEntries(clusters.map(c => [c.id, c]))

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
          {TRIAGE_GROUPS.map(g => {
            const count = Object.values(postDetails).filter(p => (p.triage_status || 'none') === g.key).length
            return (
              <div key={g.key} style={{
                background: g.bg, border: `1px solid ${g.border}`,
                borderRadius: 'var(--radius)', padding: '12px 14px',
              }}>
                <div style={{ fontSize: 10, color: g.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{g.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: g.color }}>{count}</div>
                <div style={{ fontSize: 10, color: g.color, opacity: 0.7 }}>{g.desc}</div>
              </div>
            )
          })}
        </div>

        {/* Groups */}
        {TRIAGE_GROUPS.map(g => {
          const posts = Object.entries(postDetails)
            .filter(([, p]) => (p.triage_status || 'none') === g.key)
            .sort((a, b) => (b[1].gsc_clicks || 0) - (a[1].gsc_clicks || 0))

          if (!posts.length) return null
          const cluster = (slug) => clusterById[postDetails[slug]?.cluster]

          return (
            <div key={g.key} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: g.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {g.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>({posts.length})</span>
                <span style={{ fontSize: 10, color: 'var(--text3)' }}>· {g.desc}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {posts.map(([slug, post]) => (
                  <PostCard
                    key={slug}
                    slug={slug}
                    post={post}
                    color={cluster(slug)?.color || g.color}
                    selected={selected}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
