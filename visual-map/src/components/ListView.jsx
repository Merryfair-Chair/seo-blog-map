import { useState, useMemo } from 'react'

function PerformanceBar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--bg3)' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: color, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--text3)', minWidth: 32, textAlign: 'right' }}>
        {value.toLocaleString()}
      </span>
    </div>
  )
}

function Badge({ type, color }) {
  const map = {
    pillar:     { bg: color + '18', text: color,          label: 'Pillar' },
    cluster:    { bg: 'var(--bg3)', text: 'var(--text2)', label: 'Cluster' },
    standalone: { bg: 'var(--bg3)', text: 'var(--text3)', label: 'Standalone' },
  }
  const s = map[type] || map.cluster
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
      background: s.bg, color: s.text, letterSpacing: '0.03em',
    }}>
      {s.label}
    </span>
  )
}

function PostRow({ post, slug, color, maxClicks, maxImpressions, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(slug)}
      style={{
        marginTop: 6, padding: '10px 12px', borderRadius: 8,
        border: '1px solid var(--border)',
        background: selected === slug ? '#f0f5ff' : 'var(--bg2)',
        outline: selected === slug ? `2px solid ${color}` : 'none',
        cursor: 'pointer',
        transition: 'background 0.12s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Badge type={post.page_type} color={color} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{post.title}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 16px' }}>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>
          Clicks <PerformanceBar value={post.gsc_clicks || 0} max={maxClicks} color={color} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>
          Impressions <PerformanceBar value={post.gsc_impressions || 0} max={maxImpressions} color={color} />
        </div>
        {post.top_keyword && (
          <div style={{ fontSize: 11, color: 'var(--text3)', gridColumn: '1/3', marginTop: 2 }}>
            Top kw: <span style={{ color: 'var(--text2)', fontWeight: 500 }}>{post.top_keyword}</span>
            {post.top_kw_position > 0 && <span style={{ color: 'var(--text3)' }}> · pos {post.top_kw_position}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ListView({ clusters, postDetails, selected, onSelect }) {
  const [expanded, setExpanded] = useState(clusters[0]?.id)

  const maxClicks = useMemo(() =>
    Math.max(...Object.values(postDetails).map(p => p.gsc_clicks || 0), 1), [postDetails])
  const maxImpressions = useMemo(() =>
    Math.max(...Object.values(postDetails).map(p => p.gsc_impressions || 0), 1), [postDetails])

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {clusters.map(cluster => {
          const isOpen = expanded === cluster.id
          const posts = (cluster.posts || []).map(slug => ({ slug, post: postDetails[slug] })).filter(p => p.post)
          const pillar = posts.find(p => p.post.page_type === 'pillar')
          const clusterPosts = posts.filter(p => p.post.page_type !== 'pillar')
          const totalClicks = posts.reduce((s, p) => s + (p.post.gsc_clicks || 0), 0)

          return (
            <div key={cluster.id} style={{
              border: '1px solid var(--border)',
              borderLeft: `4px solid ${cluster.color}`,
              borderRadius: 'var(--radius)',
              background: 'var(--bg2)',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <div
                onClick={() => setExpanded(isOpen ? null : cluster.id)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: isOpen ? '#f8f9ff' : 'transparent',
                  borderBottom: isOpen ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{cluster.name}</span>
                    {cluster.pillarStatus === 'needs-creation' && (
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: '#fef2f2', color: '#dc2626', fontWeight: 700 }}>
                        Needs pillar
                      </span>
                    )}
                    {(() => { const active = cluster.gaps?.filter(g => g.status !== 'published' && g.status !== 'rejected').length || 0; return active > 0 && (
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: '#fffbeb', color: '#b45309', fontWeight: 700 }}>
                        {active} gap{active > 1 ? 's' : ''}
                      </span>
                    )})()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                    {posts.length} posts
                    {cluster.headTerm && (
                      <> · <span style={{ color: 'var(--text2)' }}>{cluster.headTerm}</span> ({cluster.headTermVolume?.toLocaleString()}/mo)</>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{totalClicks.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>clicks</div>
                </div>
                <span style={{
                  fontSize: 11, color: 'var(--text3)',
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s', marginLeft: 4,
                }}>▼</span>
              </div>

              {isOpen && (
                <div style={{ padding: '8px 16px 16px' }}>
                  {pillar && <PostRow {...pillar} color={cluster.color} maxClicks={maxClicks} maxImpressions={maxImpressions} selected={selected} onSelect={onSelect} />}
                  {clusterPosts.map(({ slug, post }) => (
                    <PostRow key={slug} slug={slug} post={post} color={cluster.color} maxClicks={maxClicks} maxImpressions={maxImpressions} selected={selected} onSelect={onSelect} />
                  ))}
                  {cluster.gaps?.filter(g => g.status !== 'published' && g.status !== 'rejected').length > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                        Content gaps
                      </div>
                      {cluster.gaps.filter(g => g.status !== 'published' && g.status !== 'rejected').map((gap, gi) => (
                        <div
                          key={gap.id || gi}
                          onClick={() => onSelect(gap.id)}
                          style={{
                            marginTop: 6, padding: '10px 12px', borderRadius: 8,
                            border: '1px dashed var(--gap-border)',
                            background: selected === gap.id ? '#fff8ee' : 'var(--gap-bg)',
                            outline: selected === gap.id ? '2px solid var(--gap-color)' : 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: '#fef3c7', color: '#b45309' }}>
                              {gap.status || 'suggested'}
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{gap.title}</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                            {gap.targetKeyword} · <strong style={{ color: '#b45309' }}>{gap.estVolume}/mo</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
