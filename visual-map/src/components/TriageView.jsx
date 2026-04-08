const TRIAGE_GROUPS = [
  { key: 'high',   label: 'High traffic',   color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', desc: '100+ GSC clicks' },
  { key: 'medium', label: 'Medium traffic',  color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', desc: '10–99 clicks' },
  { key: 'low',    label: 'Low traffic',     color: '#d97706', bg: '#fffbeb', border: '#fde68a', desc: '1–9 clicks' },
  { key: 'none',   label: 'No traffic',      color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', desc: '0 clicks' },
]

const HERO_CARD = {
  crown: {
    border: '4px solid #d97706',
    background: 'linear-gradient(to right, rgba(217,119,6,0.07), rgba(217,119,6,0.02) 60%, #fff)',
    symbol: '★',
    symbolColor: '#d97706',
    label: 'Crown Hero',
  },
  hero: {
    border: '3px solid #7c3aed',
    background: 'linear-gradient(to right, rgba(124,58,237,0.06), rgba(124,58,237,0.01) 60%, #fff)',
    symbol: '◆',
    symbolColor: '#7c3aed',
    label: 'Hero',
  },
}

function PostCard({ slug, post, color, selected, onSelect }) {
  const clicks = post.gsc_clicks || 0
  const impressions = post.gsc_impressions || 0
  const hasOpt = !!post.optimization
  const optDone = hasOpt ? post.optimization.items.filter(i => i.done).length : 0
  const optTotal = hasOpt ? post.optimization.items.length : 0
  const hero = HERO_CARD[post.hero_tier]

  return (
    <div
      onClick={() => onSelect(slug)}
      className={`card card-clickable${selected === slug ? ' selected' : ''}`}
      style={{
        padding: '11px 14px',
        borderLeft: hero ? hero.border : `3px solid ${color}`,
        background: selected === slug
          ? '#f0f5ff'
          : hero
            ? hero.background
            : 'var(--bg2)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          {/* Title row — hero symbol inline */}
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 5, lineHeight: 1.4, display: 'flex', alignItems: 'baseline', gap: 5 }}>
            {hero && (
              <span style={{ color: hero.symbolColor, fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
                {hero.symbol}
              </span>
            )}
            {post.title}
          </div>
          {/* Meta row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 10px', fontSize: 11, color: 'var(--text3)', alignItems: 'center' }}>
            {hero && (
              <span style={{ fontSize: 10, fontWeight: 700, color: hero.symbolColor }}>{hero.label}</span>
            )}
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
              <div key={g.key} className="stat-block" style={{ background: g.bg, borderColor: g.border }}>
                <div className="stat-label" style={{ color: g.color }}>{g.label}</div>
                <div className="stat-value" style={{ color: g.color }}>{count}</div>
                <div style={{ fontSize: 10, color: g.color, opacity: 0.7, marginTop: 3 }}>{g.desc}</div>
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
              <div className="group-header">
                <span className="title" style={{ color: g.color }}>{g.label}</span>
                <span className="count">({posts.length})</span>
                <span className="desc">· {g.desc}</span>
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
