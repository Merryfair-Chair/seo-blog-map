import { useState } from 'react'

const COMMANDS = [
  {
    cmd: '/new-post [url]',
    desc: 'Run after publishing a new WordPress post. Crawls it, assigns it to a cluster, checks internal links, marks any gap as published, updates everything.',
    example: '/new-post https://www.merryfair.com/latest_updates/blog/your-new-slug/',
  },
  {
    cmd: '/optimize-post [slug]',
    desc: 'Full content audit against the master blog prompt standard. Writes a prioritized checklist into the visual map — you\'ll see it in the detail panel when you click the post.',
    example: '/optimize-post how-to-choose-the-best-ergonomic-chair-in-malaysia',
  },
  {
    cmd: '/monthly-update',
    desc: 'Run once a month after exporting fresh CSVs from GSC, Ahrefs, and GA4. Refreshes all performance data, re-triages posts, identifies new content gaps.',
    example: '/monthly-update',
  },
  {
    cmd: '/linking-audit',
    desc: 'Full internal link health check. Finds missing contextual links between cluster posts and pillars, flags orphans and islands.',
    example: '/linking-audit',
  },
]

function CommandsPanel({ onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.35)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: 80,
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg2)', borderRadius: 12, width: 560,
          boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Claude Code Commands</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
              Open Claude Code in the merryfair-seo folder, then type any command below.
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text3)', fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
        </div>
        <div style={{ padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {COMMANDS.map(c => (
            <div key={c.cmd} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 5 }}>{c.cmd}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 7 }}>{c.desc}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                Example: <code style={{ background: 'var(--bg2)', padding: '2px 6px', borderRadius: 3, color: 'var(--text2)' }}>{c.example}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Header({ view, setView, meta, clusters, postDetails, lastFetched, onRefresh, onAddIdea }) {
  const [showCommands, setShowCommands] = useState(false)

  const totalPosts   = Object.keys(postDetails).length
  const heroCount    = Object.values(postDetails).filter(p => p.hero_tier === 'crown' || p.hero_tier === 'hero').length
  const allGaps      = clusters.flatMap(c => c.gaps || [])
  const pipelineGaps = allGaps.filter(g => g.status === 'approved' || g.status === 'suggested' || g.status === 'in_progress').length
  const pendingFixes = Object.values(postDetails).filter(p => p.optimization?.items?.some(i => !i.done)).length

  const tabs = [
    { id: 'graph',    label: 'Graph' },
    { id: 'list',     label: 'List' },
    { id: 'triage',   label: 'Triage' },
    { id: 'gaps',     label: 'Gaps' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'optimize', label: pendingFixes > 0 ? `Optimize (${pendingFixes})` : 'Optimize', warn: pendingFixes > 0 },
  ]

  const ago = lastFetched ? (() => {
    const s = Math.floor((Date.now() - lastFetched) / 1000)
    if (s < 60) return 'just now'
    if (s < 3600) return `${Math.floor(s / 60)}m ago`
    return `${Math.floor(s / 3600)}h ago`
  })() : null

  return (
    <>
      <div style={{
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        boxShadow: '0 1px 0 var(--border)',
      }}>
        {/* Top row — brand + stats */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          height: 40, padding: '0 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text)', letterSpacing: '-0.01em' }}>Merryfair</span>
            <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>Content Map</span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, alignItems: 'center' }}>
            {[
              { label: 'posts',           value: totalPosts,    color: 'var(--text)' },
              { label: 'heroes',          value: heroCount,     color: 'var(--hero)' },
              { label: 'in pipeline',     value: pipelineGaps,  color: '#b45309' },
              { label: 'pending fixes',   value: pendingFixes,  color: pendingFixes > 0 ? '#dc2626' : 'var(--text3)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</span>
                <span style={{ fontSize: 10, color: 'var(--text3)' }}>{s.label}</span>
              </div>
            ))}

            <div style={{ fontSize: 10, color: 'var(--text3)', borderLeft: '1px solid var(--border)', paddingLeft: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Crawled {meta?.last_crawl?.slice(0, 10) || '—'}</span>
              {ago && <span style={{ color: 'var(--border2)' }}>· {ago}</span>}
              <button
                onClick={onRefresh}
                title="Refresh data now"
                style={{ fontSize: 11, color: 'var(--text3)', padding: '1px 5px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border)' }}
              >↻</button>
            </div>
          </div>
        </div>

        {/* Bottom row — tabs + actions */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          height: 44, padding: '0 20px',
        }}>
          <div style={{ display: 'flex', gap: 1, background: 'var(--bg3)', borderRadius: 8, padding: 3 }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                style={{
                  padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                  background: view === t.id ? 'var(--bg2)' : 'transparent',
                  color: view === t.id ? 'var(--text)' : t.warn ? 'var(--gap-color)' : 'var(--text3)',
                  boxShadow: view === t.id ? 'var(--shadow)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setShowCommands(true)}
              style={{
                fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 6,
                background: 'var(--bg3)', color: 'var(--text2)',
                border: '1px solid var(--border)',
              }}
              title="Claude Code commands reference"
            >
              Commands ?
            </button>
            <button
              onClick={onAddIdea}
              style={{
                fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 6,
                background: '#f59e0b', color: '#fff',
                border: 'none',
                boxShadow: '0 1px 4px rgba(245,158,11,0.35)',
              }}
              title="Add a new blog idea to the pipeline"
            >
              ＋ Add Idea
            </button>
          </div>
        </div>
      </div>
      {showCommands && <CommandsPanel onClose={() => setShowCommands(false)} />}
    </>
  )
}
