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
      {/* Checkbox — only for pending/done, not verified */}
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
        {/* Target post */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>→</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: isVerified ? '#15803d' : 'var(--text)', lineHeight: 1.3 }}>
            {toPost?.title || item.to_slug}
          </span>
        </div>

        {/* Anchor text */}
        <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 5, fontStyle: 'italic' }}>
          Anchor: "{item.anchor_text}"
        </div>

        {/* Reason */}
        <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>
          {item.reason}
        </div>
      </div>

      {/* Priority badge */}
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
      {/* Group header */}
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

      {/* Items */}
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

export default function LinkQueueView({ linkQueue, postDetails, clusters, onQueueUpdate }) {
  const [filter, setFilter] = useState('pending')
  const [togglingId, setTogglingId] = useState(null)
  const [error, setError] = useState(null)

  const queue = linkQueue || []

  const pendingCount  = queue.filter(i => i.status === 'pending').length
  const doneCount     = queue.filter(i => i.status === 'done').length
  const verifiedCount = queue.filter(i => i.status === 'verified').length

  const filtered = filter === 'all'
    ? queue
    : queue.filter(i => i.status === filter)

  // Group by from_slug, preserving priority order within each group
  const groups = {}
  for (const item of filtered) {
    if (!groups[item.from_slug]) groups[item.from_slug] = []
    groups[item.from_slug].push(item)
  }
  // Sort groups: those with pending items first, then by slug
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

  const FILTERS = [
    { id: 'pending',  label: `Pending (${pendingCount})` },
    { id: 'done',     label: `Done (${doneCount})` },
    { id: 'verified', label: `Verified (${verifiedCount})` },
    { id: 'all',      label: `All (${queue.length})` },
  ]

  if (queue.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, color: 'var(--text3)' }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>No link actions in queue</div>
        <div style={{ fontSize: 12 }}>Run <code style={{ background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4 }}>/linking-audit</code> in Claude Code to populate the queue.</div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Summary stats */}
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

        {/* Workflow note */}
        {doneCount > 0 && (
          <div style={{
            padding: '10px 14px', borderRadius: 8, marginBottom: 18,
            background: '#fffbeb', border: '1px solid #fde68a',
            fontSize: 12, color: '#92400e', lineHeight: 1.5,
          }}>
            <strong>{doneCount} item{doneCount > 1 ? 's' : ''} marked done.</strong> Run <code style={{ background: '#fef3c7', padding: '1px 5px', borderRadius: 3 }}>/sync-links</code> in Claude Code after your WordPress session to verify these against the live site.
          </div>
        )}

        {/* Filter tabs */}
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

        {/* Groups */}
        {sortedGroups.length === 0 ? (
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

      </div>
    </div>
  )
}
