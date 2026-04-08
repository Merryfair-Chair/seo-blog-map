import { useMemo } from 'react'

const COLUMNS = [
  {
    id: 'suggested',
    label: 'Ideas',
    theme: { header: '#b45309', bg: '#fffbeb', border: '#fde68a', light: '#fff8ee' },
  },
  {
    id: 'approved',
    label: 'Approved',
    theme: { header: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', light: '#f0f5ff' },
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    theme: { header: '#7c3aed', bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.2)', light: 'rgba(124,58,237,0.04)' },
  },
  {
    id: 'published',
    label: 'Published',
    theme: { header: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', light: '#f0fdf4' },
  },
]

const PURPOSE_STYLE = {
  traffic:   { label: 'Traffic',   bg: 'rgba(37,99,235,0.10)',   color: '#2563eb',   border: 'rgba(37,99,235,0.22)' },
  authority: { label: 'Authority', bg: 'rgba(124,58,237,0.10)',  color: '#7c3aed',   border: 'rgba(124,58,237,0.22)' },
  hub:       { label: 'Hub',       bg: 'rgba(8,145,178,0.10)',   color: '#0891b2',   border: 'rgba(8,145,178,0.22)' },
}

// Week boundaries: Monday-based ISO week
function getThisWeekBounds() {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 1=Mon...
  const diff = (day === 0 ? -6 : 1) - day
  const mon = new Date(now)
  mon.setDate(now.getDate() + diff)
  mon.setHours(0, 0, 0, 0)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 7)
  return { start: mon, end: sun }
}

function PurposeBadge({ purpose }) {
  if (!purpose) return null
  const s = PURPOSE_STYLE[purpose] || PURPOSE_STYLE.authority
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 3,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {s.label}
    </span>
  )
}

function GapCard({ gap, selected, onSelect, postDetails }) {
  const isSelected = selected === gap.id
  const hero = gap.heroTarget ? postDetails?.[gap.heroTarget] : null
  const heroTitle = hero?.title || gap.heroTarget

  return (
    <div
      onClick={() => onSelect(gap.id)}
      style={{
        background: isSelected ? '#f0f5ff' : 'var(--bg2)',
        border: `1px solid ${isSelected ? '#2563eb' : 'var(--border)'}`,
        borderLeft: `3px solid ${gap.clusterColor}`,
        borderRadius: 8,
        padding: '10px 12px',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.15s, transform 0.15s',
        userSelect: 'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none' }}
    >
      {/* Title */}
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 7 }}>
        {gap.title}
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px', alignItems: 'center' }}>
        <PurposeBadge purpose={gap.purpose} />

        {/* Cluster dot */}
        <span style={{ fontSize: 10, color: gap.clusterColor, fontWeight: 600 }}>
          ● {gap.clusterName}
        </span>

        {/* Volume */}
        {gap.estVolume > 0
          ? <span style={{ fontSize: 10, color: '#b45309', fontWeight: 700 }}>{gap.estVolume}/mo</span>
          : <span style={{ fontSize: 10, color: '#9ca3af' }}>0 vol</span>
        }
      </div>

      {/* Target keyword */}
      {gap.targetKeyword && (
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5 }}>
          KW: <strong style={{ color: 'var(--text2)' }}>{gap.targetKeyword}</strong>
        </div>
      )}

      {/* Hero target */}
      {heroTitle && (
        <div style={{
          marginTop: 6, fontSize: 10, color: '#0891b2',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          → {heroTitle.length > 42 ? heroTitle.slice(0, 42) + '…' : heroTitle}
        </div>
      )}
    </div>
  )
}

function EmptyState({ label }) {
  return (
    <div style={{
      padding: '24px 12px', textAlign: 'center',
      color: 'var(--text3)', fontSize: 11, fontStyle: 'italic',
      border: '1.5px dashed var(--border)', borderRadius: 8,
    }}>
      No {label.toLowerCase()} items
    </div>
  )
}

export default function PipelineView({ clusters, selected, onSelect, onAddIdea, postDetails }) {
  const allGaps = useMemo(() =>
    clusters.flatMap(c =>
      (c.gaps || []).map(g => ({ ...g, clusterName: c.name, clusterColor: c.color }))
    ), [clusters])

  const byStatus = useMemo(() => {
    const map = {}
    COLUMNS.forEach(col => { map[col.id] = [] })
    for (const g of allGaps) {
      const s = g.status || 'suggested'
      if (map[s]) map[s].push(g)
    }
    return map
  }, [allGaps])

  // Published-this-week count
  const thisWeekPublished = useMemo(() => {
    const { start, end } = getThisWeekBounds()
    return (byStatus.published || []).filter(g => {
      if (!g.published_date) return false
      const d = new Date(g.published_date)
      return d >= start && d < end
    }).length
  }, [byStatus])

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))',
        gap: 16,
        minWidth: 900,
      }}>
        {COLUMNS.map(col => {
          const items = byStatus[col.id] || []
          const t = col.theme

          return (
            <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Column header */}
              <div style={{
                background: t.bg,
                border: `1px solid ${t.border}`,
                borderRadius: 10,
                padding: '10px 14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.header, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {col.label}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 10,
                    background: 'rgba(0,0,0,0.06)', color: t.header,
                  }}>
                    {items.length}
                  </span>
                </div>

                {/* Weekly target indicator — only in Published column */}
                {col.id === 'published' && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: '#15803d', fontWeight: 600 }}>
                        {thisWeekPublished} / 5 this week
                      </span>
                      <span style={{ fontSize: 9, color: '#6b7280' }}>target</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: '#d1fae5' }}>
                      <div style={{
                        width: `${Math.min((thisWeekPublished / 5) * 100, 100)}%`,
                        height: '100%', borderRadius: 2, background: '#15803d',
                        transition: 'width 0.3s',
                      }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {items.length === 0
                  ? <EmptyState label={col.label} />
                  : items
                      .sort((a, b) => (b.estVolume || 0) - (a.estVolume || 0))
                      .map((gap, i) => (
                        <GapCard
                          key={gap.id || i}
                          gap={gap}
                          selected={selected}
                          onSelect={onSelect}
                          postDetails={postDetails}
                        />
                      ))
                }
              </div>

              {/* Add idea button on Ideas column */}
              {col.id === 'suggested' && (
                <button
                  onClick={onAddIdea}
                  style={{
                    padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: 'transparent', color: 'var(--text3)',
                    border: '1.5px dashed var(--border)',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.color = '#b45309' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)' }}
                >
                  ＋ Add idea
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
