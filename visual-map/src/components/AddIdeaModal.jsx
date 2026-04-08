import { useState, useMemo } from 'react'

const SOURCES = [
  { value: 'monthly-update',      label: 'Monthly Update' },
  { value: 'competitor-research', label: 'Competitor Research' },
  { value: 'spontaneous',         label: 'Spontaneous' },
  { value: 'customer-insight',    label: 'Customer Insight' },
]

// Keywords that suggest each cluster — used for auto-detect
const CLUSTER_KEYWORDS = {
  'buying-guide':       ['choose', 'select', 'pick', 'features', 'what to look', 'adjust', 'adjustable', 'lumbar', 'tilt', 'mechanism', 'material', 'size', 'fit', 'test', 'certification', 'bifma'],
  'best-chairs-budget': ['best', 'top', 'affordable', 'cheap', 'budget', 'under rm', 'rm500', 'rm1000', 'rm2000', 'value', 'price'],
  'health-posture':     ['posture', 'back pain', 'spine', 'ergonomics', 'health', 'sitting', 'posture corrector', 'neck', 'shoulder', 'wrist', 'pain'],
  'gaming-specialized': ['gaming', 'gamer', 'gaming chair', 'streaming', 'esports', 'pc gaming', 'console'],
  'workspace-lifestyle':['workspace', 'home office', 'setup', 'productivity', 'desk', 'monitor', 'lighting', 'decor', 'small space', 'apartment'],
  'brand-seasonal':     ['merryfair', 'brand', 'raya', 'christmas', 'gifting', 'seasonal', 'sale'],
}

function autoDetectCluster(keyword) {
  if (!keyword) return null
  const kw = keyword.toLowerCase()
  let best = null, bestScore = 0
  for (const [id, words] of Object.entries(CLUSTER_KEYWORDS)) {
    const score = words.filter(w => kw.includes(w)).length
    if (score > bestScore) { bestScore = score; best = id }
  }
  return best
}

function autoDetectPurpose(keyword, volume) {
  if (!keyword) return 'authority'
  if (volume > 50) return 'traffic'
  const kw = keyword.toLowerCase()
  if (['guide', 'hub', 'complete', 'ultimate', 'everything', 'comprehensive'].some(w => kw.includes(w))) return 'hub'
  return 'authority'
}

function checkCannibalization(keyword, postDetails, clusters) {
  if (!keyword || keyword.length < 3) return []
  const kw = keyword.toLowerCase()
  const matches = []

  // Check post top_keywords and titles
  for (const [slug, post] of Object.entries(postDetails)) {
    const topKw = (post.top_keyword || '').toLowerCase()
    const title = (post.title || '').toLowerCase()
    if (topKw && (topKw.includes(kw) || kw.includes(topKw))) {
      matches.push({ type: 'post', slug, title: post.title, reason: `top keyword: "${post.top_keyword}"` })
    } else if (title.includes(kw) || kw.split(' ').filter(w => w.length > 4).every(w => title.includes(w))) {
      matches.push({ type: 'post', slug, title: post.title, reason: 'title overlap' })
    }
  }

  // Check existing gap targetKeywords
  for (const c of clusters) {
    for (const g of (c.gaps || [])) {
      if (g.status === 'rejected') continue
      const gkw = (g.targetKeyword || '').toLowerCase()
      if (gkw && (gkw.includes(kw) || kw.includes(gkw))) {
        matches.push({ type: 'gap', slug: g.id, title: g.title, reason: `gap keyword: "${g.targetKeyword}"` })
      }
    }
  }

  return matches.slice(0, 3)
}

export default function AddIdeaModal({ clusters, postDetails, onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [targetKeyword, setTargetKeyword] = useState('')
  const [estVolume, setEstVolume] = useState('')
  const [source, setSource] = useState('spontaneous')
  const [heroTarget, setHeroTarget] = useState('')
  const [notes, setNotes] = useState('')
  const [showMore, setShowMore] = useState(false)
  const [saving, setSaving] = useState(false)

  const [clusterOverride, setClusterOverride] = useState(null)
  const [purposeOverride, setPurposeOverride] = useState(null)

  const vol = parseInt(estVolume) || 0
  const suggestedCluster = useMemo(() => autoDetectCluster(targetKeyword), [targetKeyword])
  const suggestedPurpose = useMemo(() => autoDetectPurpose(targetKeyword, vol), [targetKeyword, vol])

  const effectiveCluster = clusterOverride || suggestedCluster
  const effectivePurpose = purposeOverride || suggestedPurpose

  const cannibalization = useMemo(() =>
    checkCannibalization(targetKeyword, postDetails, clusters),
    [targetKeyword, postDetails, clusters]
  )

  const heroPosts = useMemo(() =>
    Object.entries(postDetails)
      .filter(([, p]) => p.hero_tier === 'crown' || p.hero_tier === 'hero')
      .sort((a, b) => (b[1].gsc_impressions || 0) - (a[1].gsc_impressions || 0)),
    [postDetails]
  )

  const canSubmit = title.trim() && targetKeyword.trim() && effectiveCluster

  const handleSubmit = async () => {
    if (!canSubmit || saving) return
    setSaving(true)

    const ideaData = {
      title: title.trim(),
      targetKeyword: targetKeyword.trim(),
      clusterId: effectiveCluster,
      purpose: effectivePurpose,
      estVolume: vol || 0,
      source,
      heroTarget: heroTarget || null,
      notes: notes.trim() || null,
    }

    try {
      await onAdd(ideaData)
      onClose()
    } catch (e) {
      console.error('Failed to add idea:', e)
      setSaving(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const PURPOSE_LABELS = { traffic: 'Traffic', authority: 'Authority', hub: 'Hub' }

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.4)', zIndex: 2000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div style={{
        background: 'var(--bg2)', borderRadius: 14, width: '100%', maxWidth: 540,
        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
        overflow: 'hidden',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Add Blog Idea</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>Add to the content pipeline</div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text3)', fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>

          {/* Title */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>
              Post title <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Best Ergonomic Chairs for Programmers"
              style={{
                width: '100%', padding: '9px 12px', borderRadius: 7, fontSize: 13,
                border: '1px solid var(--border)', background: 'var(--bg)',
                color: 'var(--text)', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              autoFocus
            />
          </div>

          {/* Target keyword */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>
              Target keyword <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              value={targetKeyword}
              onChange={e => setTargetKeyword(e.target.value)}
              placeholder="e.g. ergonomic chair for programmers"
              style={{
                width: '100%', padding: '9px 12px', borderRadius: 7, fontSize: 13,
                border: '1px solid var(--border)', background: 'var(--bg)',
                color: 'var(--text)', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Cannibalization warning */}
          {cannibalization.length > 0 && (
            <div style={{
              marginBottom: 14, padding: '10px 12px', borderRadius: 8,
              background: '#fffbeb', border: '1px solid #fde68a',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#b45309', marginBottom: 5 }}>
                ⚠ Possible keyword overlap
              </div>
              {cannibalization.map((m, i) => (
                <div key={i} style={{ fontSize: 11, color: '#92400e', marginBottom: 3 }}>
                  <strong>{m.type === 'post' ? 'Post' : 'Gap'}:</strong> {m.title} <span style={{ color: '#b45309' }}>({m.reason})</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: '#b45309', marginTop: 4, fontStyle: 'italic' }}>
                Consider optimizing the existing content instead of writing new. This will be flagged in the gap entry.
              </div>
            </div>
          )}

          {/* Auto-detected: Cluster + Purpose */}
          <div style={{ marginBottom: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {/* Cluster */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>
                Cluster <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={effectiveCluster || ''}
                onChange={e => setClusterOverride(e.target.value || null)}
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: 7, fontSize: 12,
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  color: effectiveCluster ? 'var(--text)' : 'var(--text3)',
                  cursor: 'pointer',
                }}
              >
                <option value="">Select cluster…</option>
                {clusters.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {suggestedCluster && !clusterOverride && (
                <div style={{ fontSize: 10, color: '#0891b2', marginTop: 3 }}>Auto-detected from keyword</div>
              )}
            </div>

            {/* Purpose */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>
                Purpose
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {['traffic', 'authority', 'hub'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPurposeOverride(p === effectivePurpose && purposeOverride ? null : p)}
                    style={{
                      flex: 1, padding: '7px 0', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: effectivePurpose === p
                        ? p === 'traffic' ? '#2563eb' : p === 'authority' ? '#7c3aed' : '#0891b2'
                        : 'var(--bg3)',
                      color: effectivePurpose === p ? '#fff' : 'var(--text3)',
                      border: `1px solid ${effectivePurpose === p ? 'transparent' : 'var(--border)'}`,
                      transition: 'all 0.15s',
                    }}
                  >
                    {PURPOSE_LABELS[p]}
                  </button>
                ))}
              </div>
              {!purposeOverride && (
                <div style={{ fontSize: 10, color: '#0891b2', marginTop: 3 }}>Auto-detected</div>
              )}
            </div>
          </div>

          {/* More details toggle */}
          <button
            onClick={() => setShowMore(v => !v)}
            style={{
              width: '100%', padding: '8px 0', borderRadius: 7, fontSize: 12, fontWeight: 600,
              background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              marginBottom: showMore ? 14 : 0,
            }}
          >
            More details
            <span style={{ transform: showMore ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
          </button>

          {showMore && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Est. volume */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>
                  Estimated MY volume (searches/mo)
                </label>
                <input
                  type="number"
                  value={estVolume}
                  onChange={e => setEstVolume(e.target.value)}
                  placeholder="0"
                  min="0"
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 7, fontSize: 13,
                    border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)',
                  }}
                />
              </div>

              {/* Source */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>
                  Source
                </label>
                <select
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 10px', borderRadius: 7, fontSize: 12,
                    border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)',
                    cursor: 'pointer',
                  }}
                >
                  {SOURCES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Hero target */}
              {heroPosts.length > 0 && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>
                    Supports hero page (optional)
                  </label>
                  <select
                    value={heroTarget}
                    onChange={e => setHeroTarget(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: 7, fontSize: 12,
                      border: '1px solid var(--border)', background: 'var(--bg)',
                      color: heroTarget ? 'var(--text)' : 'var(--text3)',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">None</option>
                    {heroPosts.map(([slug, post]) => (
                      <option key={slug} value={slug}>
                        {post.hero_tier === 'crown' ? '★ ' : '◆ '}
                        {post.title?.length > 55 ? post.title.slice(0, 55) + '…' : post.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Notes */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any extra context, competitor examples, customer insight…"
                  rows={3}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 7, fontSize: 12,
                    border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)',
                    resize: 'vertical', lineHeight: 1.5, fontFamily: 'inherit',
                  }}
                />
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px', borderTop: '1px solid var(--border)',
          display: 'flex', gap: 8, justifyContent: 'flex-end',
          flexShrink: 0, background: 'var(--bg)',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600,
              background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            style={{
              padding: '8px 20px', borderRadius: 7, fontSize: 13, fontWeight: 700,
              background: canSubmit ? '#f59e0b' : 'var(--bg3)',
              color: canSubmit ? '#fff' : 'var(--text3)',
              border: 'none',
              opacity: saving ? 0.6 : 1,
              cursor: canSubmit && !saving ? 'pointer' : 'not-allowed',
              boxShadow: canSubmit ? '0 1px 4px rgba(245,158,11,0.35)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {saving ? 'Adding…' : 'Add to Pipeline'}
          </button>
        </div>
      </div>
    </div>
  )
}
