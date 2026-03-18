import { useState, useMemo } from 'react'

function PerformanceBar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--border)' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: color, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--text2)', minWidth: 30, textAlign: 'right' }}>
        {value.toLocaleString()}
      </span>
    </div>
  )
}

function Badge({ type, color }) {
  const map = {
    pillar: { bg: color + '22', text: color, label: 'Pillar' },
    cluster: { bg: 'var(--bg3)', text: 'var(--text2)', label: 'Cluster' },
    standalone: { bg: 'var(--bg3)', text: 'var(--text3)', label: 'Standalone' },
  }
  const s = map[type] || map.cluster
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
      background: s.bg, color: s.text, letterSpacing: '0.03em',
    }}>
      {s.label}
    </span>
  )
}

export default function ListView({ clusters, postDetails, selected, onSelect }) {
  const [expanded, setExpanded] = useState(clusters[0]?.id)

  const maxClicks = useMemo(() =>
    Math.max(...Object.values(postDetails).map(p => p.gsc_clicks || 0), 1),
    [postDetails]
  )
  const maxImpressions = useMemo(() =>
    Math.max(...Object.values(postDetails).map(p => p.gsc_impressions || 0), 1),
    [postDetails]
  )

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {clusters.map(cluster => {
          const isOpen = expanded === cluster.id
          const posts = (cluster.posts || []).map(slug => postDetails[slug]).filter(Boolean)
          const pillar = posts.find(p => p.page_type === 'pillar')
          const clusterPosts = posts.filter(p => p.page_type !== 'pillar')
          const totalClicks = posts.reduce((s, p) => s + (p.gsc_clicks || 0), 0)

          return (
            <div key={cluster.id} style={{
              border: '1px solid var(--border)',
              borderLeft: `3px solid ${cluster.color}`,
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              <div
                onClick={() => setExpanded(isOpen ? null : cluster.id)}
                style={{
                  padding: '13px 16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: isOpen ? 'var(--bg2)' : 'transparent',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{cluster.name}</span>
                    {cluster.pillarStatus === 'needs-creation' && (
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: '#3d1515', color: '#f07070', fontWeight: 600 }}>
                        Needs pillar
                      </span>
                    )}
                    {(cluster.gaps?.length > 0) && (
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(212,132,26,0.12)', color: 'var(--gap-color)', fontWeight: 600 }}>
                        {cluster.gaps.length} gap{cluster.gaps.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                    {posts.length} posts
                    {cluster.headTerm && <> · <span style={{ color: 'var(--text2)' }}>{cluster.headTerm}</span> ({cluster.headTermVolume?.toLocaleString()}/mo)</>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{totalClicks.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>clicks</div>
                </div>
                <span style={{
                  fontSize: 12, color: 'var(--text3)',
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                  marginLeft: 4,
                }}>▼</span>
              </div>

              {isOpen && (
                <div style={{ padding: '4px 16px 16px' }}>
                  {pillar && (
                    <PostRow
                      post={pillar}
                      slug={cluster.posts.find(s => postDetails[s]?.page_type === 'pillar')}
                      color={cluster.color}
                      maxClicks={maxClicks}
                      maxImpressions={maxImpressions}
                      selected={selected}
                      onSelect={onSelect}
                    />
                  )}
                  {clusterPosts.map((post, i) => {
                    const slug = cluster.posts.find(s => postDetails[s] === post)
                    return (
                      <PostRow
                        key={slug || i}
                        post={post}
                        slug={slug}
                        color={cluster.color}
                        maxClicks={maxClicks}
                        maxImpressions={maxImpressions}
                        selected={selected}
                        onSelect={onSelect}
                      />
                    )
                  })}

                  {cluster.gaps?.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gap-color)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                        Content gaps
                      </div>
                      {cluster.gaps.map((gap, gi) => (
                        <div
                          key={gap.id || gi}
                          onClick={() => onSelect(gap.id)}
                          style={{
                            marginTop: 6, padding: '10px 12px', borderRadius: 8,
                            border: `1px dashed var(--gap-border)`,
                            background: 'var(--gap-bg)',
                            cursor: 'pointer',
                            outline: selected === gap.id ? `2px solid var(--gap-color)` : 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 3, background: 'rgba(212,132,26,0.18)', color: 'var(--gap-color)' }}>
                              {gap.status || 'suggested'}
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 500 }}>{gap.title}</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                            {gap.targetKeyword} · {gap.estVolume}/mo
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

function PostRow({ post, slug, color, maxClicks, maxImpressions, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(slug)}
      style={{
        marginTop: 8, padding: '10px 12px', borderRadius: 8,
        border: '1px solid var(--border)',
        background: selected === slug ? 'var(--bg3)' : 'transparent',
        cursor: 'pointer',
        outline: selected === slug ? `2px solid ${color}60` : 'none',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Badge type={post.page_type} color={color} />
        <span style={{ fontSize: 12, fontWeight: 500 }}>{post.title}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>
          Clicks <PerformanceBar value={post.gsc_clicks || 0} max={maxClicks} color={color} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>
          Impressions <PerformanceBar value={post.gsc_impressions || 0} max={maxImpressions} color={color} />
        </div>
        {post.top_keyword && (
          <div style={{ fontSize: 11, color: 'var(--text3)', gridColumn: '1/3' }}>
            Top kw: <span style={{ color: 'var(--text2)' }}>{post.top_keyword}</span>
            {post.top_kw_position > 0 && <> · pos {post.top_kw_position}</>}
          </div>
        )}
      </div>
    </div>
  )
}
