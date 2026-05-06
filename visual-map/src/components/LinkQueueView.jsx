import { useState } from 'react'

const PRIORITY_STYLE = {
  high:   { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  medium: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  low:    { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
}

const STATUS_STYLE = {
  pending:  { bg: '#fafafa',  color: '#6b7280', border: '#e5e7eb', label: 'Pending' },
  done:     { bg: '#fffbeb',  color: '#d97706', border: '#fde68a', label: 'Done — awaiting verify' },
  verified: { bg: '#f0fdf4',  color: '#15803d', border: '#bbf7d0', label: 'Verified' },
}

function QueueItem({ item, postDetails, onToggle, toggling }) {
  const toPost = postDetails[item.to_slug]
  const pri = PRIORITY_STYLE[item.priority] || PRIORITY_STYLE.medium
  const isPending = item.status === 'pending'
  const isDone = item.status === 'done'
  const isVerified = item.status === 'verified'

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 12px', borderRadius: 8,
      border: `1px solid ${isVerified ? '#bbf7d0' : 'var(--border)'}`,
      background: isVerified ? '#f0fdf4' : isDone ? '#fffdf0' : 'var(--bg2)',
      opacity: isVerified ? 0.7 : 1,
      transition: 'opacity 0.15s',
    }}>
      {isVerified ? (
        <span style={{ fontSize: 14, color: '#15803d', marginTop: 1, flexShrink: 0 }}>✓</span>
      ) : (
        <input
          type="checkbox"
          checked={isDone}
          disabled={toggling}
          onChange={() => onToggle(item, isDone ? 'pending' : 'done')}
          style={{ marginTop: 3, flexShrink: 0, cursor: 'pointer', accentColor: '#d97706' }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>→</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: isVerified ? '#15803d' : 'var(--text)', lineHeight: 1.3 }}>
            {toPost?.title || item.to_slug}
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 5, fontStyle: 'italic' }}>
          Anchor: "{item.anchor_text}"
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>
          {item.reason}
        </div>
      </div>

      <span style={{
        fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
        background: pri.bg, color: pri.color, border: `1px solid ${pri.border}`,
        flexShrink: 0, alignSelf: 'flex-start',
      }}>
        {item.priority}
      </span>
    </div>
  )
}

function PostGroup({ fromSlug, items, postDetails, clusters, onToggle, togglingId }) {
  const fromPost = postDetails[fromSlug]
  const cluster = clusters.find(c => c.id === fromPost?.cluster)
  const pendingCount = items.filter(i => i.status === 'pending').length
  const doneCount = items.filter(i => i.status === 'done').length
  const verifiedCount = items.filter(i => i.status === 'verified').length
  const allDone = pendingCount === 0

  return (
    <div style={{
      borderRadius: 10, border: `1px solid ${allDone ? '#bbf7d0' : 'var(--border)'}`,
      background: allDone ? '#f0fdf4' : 'var(--bg2)',
      overflow: 'hidden', marginBottom: 12,
    }}>
      <div style={{
        padding: '10px 14px',
        borderBottom: `1px solid ${allDone ? '#bbf7d0' : 'var(--border)'}`,
        borderLeft: `4px solid ${cluster?.color || '#94a3b8'}`,
        display: 'flex', alignItems: 'center', gap: 8,
        background: allDone ? '#ecfdf5' : 'var(--bg3)',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: allDone ? '#15803d' : 'var(--text)', lineHeight: 1.3 }}>
            {fromPost?.title || fromSlug}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            {cluster?.name || fromPost?.cluster || '—'} · Open in WordPress to add these links
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {pendingCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 12, background: '#fee2e2', color: '#dc2626' }}>
              {pendingCount} pending
            </span>
          )}
          {doneCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 12, background: '#fffbeb', color: '#d97706' }}>
              {doneCount} done
            </span>
          )}
          {verifiedCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 12, background: '#f0fdf4', color: '#15803d' }}>
              {verifiedCount} verified
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(item => (
          <QueueItem
            key={item.id}
            item={item}
            postDetails={postDetails}
            onToggle={onToggle}
            toggling={togglingId === item.id}
          />
        ))}
      </div>
    </div>
  )
}

// ── Health Issues ─────────────────────────────────────────────────────────────

const ISSUE_TYPE_META = {
  duplicate_link:   { label: 'Duplicate Link',   color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  duplicate_anchor: { label: 'Duplicate Anchor', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
}

function HealthIssueCard({ issue, postDetails, clusters, onDismiss, toggling }) {
  const fromPost = postDetails[issue.from_slug]
  const cluster = clusters.find(c => c.id === fromPost?.cluster)
  const meta = ISSUE_TYPE_META[issue.type] || ISSUE_TYPE_META.duplicate_link
  const isDismissed = issue.status === 'dismissed'

  let description = ''
  let fixHint = ''

  if (issue.type === 'duplicate_link') {
    const destPost = postDetails[issue.destination]
    const destTitle = destPost?.title || issue.destination
    description = `Links to "${destTitle}" appear ${issue.anchors?.length || 2}× in this post`
    fixHint = `Keep only the most relevant link. Remove the extra occurrence(s) in WordPress.`
  } else if (issue.type === 'duplicate_anchor') {
    description = `Anchor "${issue.anchor}" points to ${issue.destinations?.length || 2} different pages`
    const destTitles = (issue.destinations || []).map(s => postDetails[s]?.title || s)
    fixHint = `Change one of the anchors so each destination has its own distinct anchor text. Destinations: ${destTitles.join(' · ')}`
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 12px', borderRadius: 8,
      border: `1px solid ${isDismissed ? '#d1fae5' : meta.border}`,
      background: isDismissed ? '#f0fdf4' : meta.bg,
      opacity: isDismissed ? 0.65 : 1,
      transition: 'opacity 0.15s',
    }}>
      {isDismissed ? (
        <span style={{ fontSize: 13, color: '#15803d', marginTop: 1, flexShrink: 0 }}>✓</span>
      ) : (
        <input
          type="checkbox"
          checked={false}
          disabled={toggling}
          onChange={() => onDismiss(issue)}
          title="Dismiss this issue"
          style={{ marginTop: 3, flexShrink: 0, cursor: 'pointer', accentColor: meta.color }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: isDismissed ? '#15803d' : 'var(--text)', marginBottom: 4, lineHeight: 1.3 }}>
          {description}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>
          {fixHint}
        </div>
        {issue.dismissed_date && (
          <div style={{ fontSize: 10, color: '#15803d', marginTop: 4 }}>
            Dismissed {issue.dismissed_date}
          </div>
        )}
      </div>

      <span style={{
        fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
        background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
        flexShrink: 0, alignSelf: 'flex-start', whiteSpace: 'nowrap',
      }}>
        {meta.label}
      </span>
    </div>
  )
}

function HealthPostGroup({ fromSlug, issues, postDetails, clusters, onDismiss, togglingId }) {
  const fromPost = postDetails[fromSlug]
  const cluster = clusters.find(c => c.id === fromPost?.cluster)
  const openCount = issues.filter(i => i.status === 'open').length
  const allClear = openCount === 0

  return (
    <div style={{
      borderRadius: 10, border: `1px solid ${allClear ? '#bbf7d0' : 'var(--border)'}`,
      background: allClear ? '#f0fdf4' : 'var(--bg2)',
      overflow: 'hidden', marginBottom: 12,
    }}>
      <div style={{
        padding: '10px 14px',
        borderBottom: `1px solid ${allClear ? '#bbf7d0' : 'var(--border)'}`,
        borderLeft: `4px solid ${cluster?.color || '#94a3b8'}`,
        display: 'flex', alignItems: 'center', gap: 8,
        background: allClear ? '#ecfdf5' : 'var(--bg3)',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: allClear ? '#15803d' : 'var(--text)', lineHeight: 1.3 }}>
            {fromPost?.title || fromSlug}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            {cluster?.name || fromPost?.cluster || '—'} · Fix in WordPress, then run /sync-links to auto-resolve
          </div>
        </div>
        {openCount > 0 && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 12, background: '#ede9fe', color: '#7c3aed' }}>
            {openCount} open
          </span>
        )}
      </div>

      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {issues.map(issue => (
          <HealthIssueCard
            key={issue.id}
            issue={issue}
            postDetails={postDetails}
            clusters={clusters}
            onDismiss={onDismiss}
            toggling={togglingId === issue.id}
          />
        ))}
      </div>
    </div>
  )
}

function HealthIssuesPanel({ healthIssues, postDetails, clusters, onHealthUpdate }) {
  const [filter, setFilter] = useState('open')
  const [togglingId, setTogglingId] = useState(null)
  const [error, setError] = useState(null)

  const issues = healthIssues || []
  const openCount = issues.filter(i => i.status === 'open').length
  const dismissedCount = issues.filter(i => i.status === 'dismissed').length

  const filtered = filter === 'all' ? issues : issues.filter(i => i.status === filter)

  const groups = {}
  for (const issue of filtered) {
    if (!groups[issue.from_slug]) groups[issue.from_slug] = []
    groups[issue.from_slug].push(issue)
  }
  const sortedGroups = Object.entries(groups).sort(([aSlug, aIssues], [bSlug, bIssues]) => {
    const aOpen = aIssues.filter(i => i.status === 'open').length
    const bOpen = bIssues.filter(i => i.status === 'open').length
    if (bOpen !== aOpen) return bOpen - aOpen
    return aSlug.localeCompare(bSlug)
  })

  const handleDismiss = async (issue) => {
    setTogglingId(issue.id)
    setError(null)
    try {
      const res = await fetch('/api/link-health-item', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: issue.id, status: 'dismissed' }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error || 'Update failed')
      }
      const { item: updated } = await res.json()
      onHealthUpdate(updated)
    } catch (e) {
      setError(e.message)
    } finally {
      setTogglingId(null)
    }
  }

  if (issues.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: 60 }}>
        No link health issues found. Run <code style={{ background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4 }}>/linking-audit</code> to check.
      </div>
    )
  }

  const FILTERS = [
    { id: 'open',      label: `Open (${openCount})` },
    { id: 'dismissed', label: `Dismissed (${dismissedCount})` },
    { id: 'all',       label: `All (${issues.length})` },
  ]

  return (
    <>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Open issues',     value: openCount,      color: '#7c3aed' },
          { label: 'Dismissed',       value: dismissedCount, color: '#15803d' },
        ].map(s => (
          <div key={s.label} className="stat-block">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.value > 0 ? s.color : 'var(--text4)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {openCount > 0 && (
        <div style={{
          padding: '10px 14px', borderRadius: 8, marginBottom: 18,
          background: '#f5f3ff', border: '1px solid #ddd6fe',
          fontSize: 12, color: '#5b21b6', lineHeight: 1.5,
        }}>
          Fix issues in WordPress, then run <code style={{ background: '#ede9fe', padding: '1px 5px', borderRadius: 3 }}>/sync-links</code> — resolved issues will be auto-dismissed based on the live crawl. Or tick the checkbox to manually dismiss.
        </div>
      )}

      <div className="tab-strip" style={{ marginBottom: 16 }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`tab-btn${filter === f.id ? ' active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: '8px 12px', borderRadius: 6, background: '#fef2f2', color: '#dc2626', fontSize: 12, marginBottom: 14, border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {sortedGroups.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: 40 }}>
          No {filter} issues.
        </div>
      ) : (
        sortedGroups.map(([fromSlug, issues]) => (
          <HealthPostGroup
            key={fromSlug}
            fromSlug={fromSlug}
            issues={issues}
            postDetails={postDetails}
            clusters={clusters}
            onDismiss={handleDismiss}
            togglingId={togglingId}
          />
        ))
      )}
    </>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function LinkQueueView({ linkQueue, linkHealthIssues, postDetails, clusters, onQueueUpdate, onHealthUpdate }) {
  const [mode, setMode] = useState('queue')
  const [filter, setFilter] = useState('pending')
  const [togglingId, setTogglingId] = useState(null)
  const [error, setError] = useState(null)

  const queue = linkQueue || []
  const health = linkHealthIssues || []

  const pendingCount  = queue.filter(i => i.status === 'pending').length
  const doneCount     = queue.filter(i => i.status === 'done').length
  const verifiedCount = queue.filter(i => i.status === 'verified').length
  const openHealthCount = health.filter(i => i.status === 'open').length

  const filtered = filter === 'all'
    ? queue
    : queue.filter(i => i.status === filter)

  const groups = {}
  for (const item of filtered) {
    if (!groups[item.from_slug]) groups[item.from_slug] = []
    groups[item.from_slug].push(item)
  }
  const sortedGroups = Object.entries(groups).sort(([aSlug, aItems], [bSlug, bItems]) => {
    const aPending = aItems.filter(i => i.status === 'pending').length
    const bPending = bItems.filter(i => i.status === 'pending').length
    if (bPending !== aPending) return bPending - aPending
    return aSlug.localeCompare(bSlug)
  })

  const handleToggle = async (item, newStatus) => {
    setTogglingId(item.id)
    setError(null)
    try {
      const res = await fetch('/api/link-queue-item', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, status: newStatus }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error || 'Update failed')
      }
      const { item: updated } = await res.json()
      onQueueUpdate(updated)
    } catch (e) {
      setError(e.message)
    } finally {
      setTogglingId(null)
    }
  }

  const QUEUE_FILTERS = [
    { id: 'pending',  label: `Pending (${pendingCount})` },
    { id: 'done',     label: `Done (${doneCount})` },
    { id: 'verified', label: `Verified (${verifiedCount})` },
    { id: 'all',      label: `All (${queue.length})` },
  ]

  const MODES = [
    { id: 'queue',  label: `Queue${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
    { id: 'health', label: `Health Issues${openHealthCount > 0 ? ` (${openHealthCount})` : ''}` },
  ]

  if (queue.length === 0 && health.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, color: 'var(--text3)' }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>No link data yet</div>
        <div style={{ fontSize: 12 }}>Run <code style={{ background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4 }}>/linking-audit</code> in Claude Code to populate the queue.</div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Mode switcher */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                border: `1px solid ${mode === m.id
                  ? (m.id === 'health' ? '#7c3aed' : 'var(--accent)')
                  : 'var(--border)'}`,
                background: mode === m.id
                  ? (m.id === 'health' ? '#7c3aed' : 'var(--accent)')
                  : 'var(--bg2)',
                color: mode === m.id ? '#fff' : 'var(--text2)',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {m.label}
              {m.id === 'health' && openHealthCount > 0 && mode !== 'health' && (
                <span style={{
                  position: 'absolute', top: -5, right: -5,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#7c3aed', border: '1.5px solid var(--bg)',
                }} />
              )}
            </button>
          ))}
        </div>

        {/* ── Queue mode ── */}
        {mode === 'queue' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Pending',  value: pendingCount,  color: '#dc2626' },
                { label: 'Done — awaiting /sync-links', value: doneCount, color: '#d97706' },
                { label: 'Verified', value: verifiedCount, color: '#15803d' },
              ].map(s => (
                <div key={s.label} className="stat-block">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{ color: s.value > 0 ? s.color : 'var(--text4)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {doneCount > 0 && (
              <div style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 18,
                background: '#fffbeb', border: '1px solid #fde68a',
                fontSize: 12, color: '#92400e', lineHeight: 1.5,
              }}>
                <strong>{doneCount} item{doneCount > 1 ? 's' : ''} marked done.</strong> Run <code style={{ background: '#fef3c7', padding: '1px 5px', borderRadius: 3 }}>/sync-links</code> in Claude Code after your WordPress session to verify these against the live site.
              </div>
            )}

            <div className="tab-strip" style={{ marginBottom: 16 }}>
              {QUEUE_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`tab-btn${filter === f.id ? ' active' : ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {error && (
              <div style={{ padding: '8px 12px', borderRadius: 6, background: '#fef2f2', color: '#dc2626', fontSize: 12, marginBottom: 14, border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            {queue.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: 60 }}>
                No link actions in queue. Run <code style={{ background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4 }}>/linking-audit</code> to populate.
              </div>
            ) : sortedGroups.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: 40 }}>
                No {filter} items.
              </div>
            ) : (
              sortedGroups.map(([fromSlug, items]) => (
                <PostGroup
                  key={fromSlug}
                  fromSlug={fromSlug}
                  items={items}
                  postDetails={postDetails}
                  clusters={clusters}
                  onToggle={handleToggle}
                  togglingId={togglingId}
                />
              ))
            )}
          </>
        )}

        {/* ── Health Issues mode ── */}
        {mode === 'health' && (
          <HealthIssuesPanel
            healthIssues={health}
            postDetails={postDetails}
            clusters={clusters}
            onHealthUpdate={onHealthUpdate}
          />
        )}

      </div>
    </div>
  )
}
