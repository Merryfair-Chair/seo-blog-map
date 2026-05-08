import { useState } from 'react'

const COMMANDS = [
  {
    cmd: '/new-post [url]',
    desc: 'Run after publishing a new WordPress post. Crawls it, assigns it to a cluster, checks internal links, marks any gap as published, updates everything.',
    example: '/new-post https://www.merryfair.com/latest_updates/blog/your-new-slug/',
  },
  {
    cmd: '/optimize-post [slug]',
    desc: 'Full content audit against the master blog prompt standard. Writes a prioritized checklist into the visual map — visible in the detail panel when you click a post.',
    example: '/optimize-post how-to-choose-the-best-ergonomic-chair-in-malaysia',
  },
  {
    cmd: '/monthly-update',
    desc: 'Run once a month after exporting fresh CSVs from GSC, Ahrefs, and GA4. Refreshes all performance data, re-triages posts, identifies new content gaps.',
    example: '/monthly-update',
  },
  {
    cmd: '/linking-audit',
    desc: 'Full internal link health check. Finds missing contextual links between cluster posts and pillars, flags orphans and islands. Populates the Links queue.',
    example: '/linking-audit',
  },
  {
    cmd: '/sync-links',
    desc: 'Lightweight post-session sync. Run after a WordPress linking session. Re-crawls live pages, verifies items you marked done, resets any not actually saved.',
    example: '/sync-links',
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
          boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)',
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
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--bg3)', color: 'var(--text3)', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
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

const TAB_GROUPS = (pendingFixes, linksTotal) => [
  [
    { id: 'graph',    label: 'Graph' },
    { id: 'list',     label: 'List' },
  ],
  [
    { id: 'triage',   label: 'Triage' },
    { id: 'gaps',     label: 'Gaps' },
    { id: 'pipeline', label: 'Pipeline' },
  ],
  [
    { id: 'optimize', label: pendingFixes > 0 ? `Optimize (${pendingFixes})` : 'Optimize', warn: pendingFixes > 0 },
    { id: 'links',    label: linksTotal > 0    ? `Links (${linksTotal})`       : 'Links',    warn: linksTotal > 0 },
  ],
]

export default function Header({ view, setView, meta, linkQueue, linkHealthIssues, lastFetched, onRefresh, onAddIdea, searchQuery, onSearchChange, postDetails }) {
  const [showCommands, setShowCommands] = useState(false)

  const pendingFixes   = Object.values(postDetails || {}).filter(p => p.optimization?.items?.some(i => !i.done)).length
  const pendingLinks   = (linkQueue || []).filter(i => i.status === 'pending').length
  const openHealth     = (linkHealthIssues || []).filter(i => i.status === 'open').length
  const linksTotal     = pendingLinks + openHealth

  const ago = lastFetched ? (() => {
    const s = Math.floor((Date.now() - lastFetched) / 1000)
    if (s < 60) return 'just now'
    if (s < 3600) return `${Math.floor(s / 60)}m ago`
    return `${Math.floor(s / 3600)}h ago`
  })() : null

  const groups = TAB_GROUPS(pendingFixes, linksTotal)

  return (
    <>
      <div className="app-header" style={{
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        height: 52,
        display: 'flex', alignItems: 'center',
        gap: 12, padding: '0 16px',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, flexShrink: 0 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text)', letterSpacing: '-0.01em' }}>Merryfair</span>
          <span style={{ width: 1, height: 11, background: 'var(--border)', display: 'inline-block', marginBottom: -2 }} />
          <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>SEO</span>
        </div>

        {/* Tab strip with group separators */}
        <div className="tab-strip" style={{ flexShrink: 0 }}>
          {groups.map((group, gi) => (
            <div key={gi} style={{ display: 'contents' }}>
              {gi > 0 && <div className="tab-sep" />}
              {group.map(t => (
                <button
                  key={t.id}
                  onClick={() => setView(t.id)}
                  className={`tab-btn${view === t.id ? ' active' : ''}${t.warn ? ' warn' : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="header-search">
          <span className="header-search-icon">⌕</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Filter posts…"
            className="header-search-input"
          />
          {searchQuery && (
            <button className="header-search-clear" onClick={() => onSearchChange('')}>×</button>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Crawl info + refresh */}
        {meta?.last_crawl && (
          <div style={{ fontSize: 10, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <span>Crawled {meta.last_crawl.slice(0, 10)}</span>
            {ago && <span style={{ color: 'var(--border2)' }}>· {ago}</span>}
            <button
              onClick={onRefresh}
              title="Refresh data now"
              style={{ fontSize: 11, color: 'var(--text3)', padding: '1px 6px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border)' }}
            >↻</button>
          </div>
        )}

        {/* Commands */}
        <button
          onClick={() => setShowCommands(true)}
          className="btn btn-ghost"
          style={{ fontSize: 11, padding: '5px 10px', flexShrink: 0 }}
          title="Claude Code commands reference"
        >
          ? Help
        </button>

        {/* Add Idea */}
        <button
          onClick={onAddIdea}
          className="btn btn-primary"
          style={{ fontSize: 12, flexShrink: 0 }}
          title="Add a new blog idea to the pipeline"
        >
          ＋ Add Idea
        </button>
      </div>

      {showCommands && <CommandsPanel onClose={() => setShowCommands(false)} />}
    </>
  )
}
