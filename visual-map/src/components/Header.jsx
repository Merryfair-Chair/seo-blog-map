export default function Header({ view, setView, meta, clusters, postDetails }) {
  const totalPosts = Object.keys(postDetails).length
  const totalGaps = clusters.reduce((s, c) => s + (c.gaps?.length || 0), 0)
  const approvedGaps = clusters.reduce((s, c) => s + (c.gaps?.filter(g => g.status === 'approved').length || 0), 0)
  const publishedGaps = clusters.reduce((s, c) => s + (c.gaps?.filter(g => g.status === 'published').length || 0), 0)
  const pillarsNeeded = clusters.filter(c => c.pillarStatus === 'needs-creation').length

  const tabs = [
    { id: 'graph', label: 'Graph view' },
    { id: 'list', label: 'List view' },
    { id: 'gaps', label: `Gaps (${totalGaps})` },
  ]

  return (
    <div style={{
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      padding: '0 20px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, height: 52 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>Merryfair</span>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>Content Map</span>
        </div>

        <div style={{ display: 'flex', gap: 2 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              style={{
                padding: '5px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                background: view === t.id ? 'var(--bg3)' : 'transparent',
                color: view === t.id ? 'var(--text)' : 'var(--text2)',
                border: view === t.id ? '1px solid var(--border2)' : '1px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 20 }}>
          {[
            { label: 'Posts', value: totalPosts },
            { label: 'Clusters', value: clusters.length },
            { label: 'Gaps', value: totalGaps, warn: true },
            pillarsNeeded > 0 && { label: 'Pillar needed', value: pillarsNeeded, warn: true },
          ].filter(Boolean).map(s => (
            <div key={s.label} style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: s.warn ? 'var(--gap-color)' : 'var(--text)' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: -2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: 'var(--text3)', borderLeft: '1px solid var(--border)', paddingLeft: 16 }}>
          Updated {meta?.last_crawl?.slice(0, 10) || '—'}
        </div>
      </div>
    </div>
  )
}
