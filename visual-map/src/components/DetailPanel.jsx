import { useState } from 'react'

const BASE_URL = 'https://www.merryfair.com/latest_updates/blog/'

async function updateGapStatus(gapId, status) {
  await fetch('/api/gap', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gapId, status }),
  })
}

async function toggleOptimizationItem(slug, itemId, done) {
  await fetch('/api/optimization-item', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, itemId, done }),
  })
}

const PRIORITY_STYLE = {
  high:   { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'High' },
  medium: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Medium' },
  low:    { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', label: 'Low' },
}
const CATEGORY_LABEL = {
  'quick-win':  '⚡ Quick win',
  'content':    '✏️ Content',
  'structural': '🏗 Structural',
  'linking':    '🔗 Linking',
}

function BlogBriefSection({ brief }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(brief).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div className="section-label">📋 Blog Brief</div>
        <button
          onClick={handleCopy}
          style={{
            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 12,
            background: copied ? '#f0fdf4' : '#eff6ff',
            color: copied ? '#15803d' : '#1d4ed8',
            border: `1px solid ${copied ? '#bbf7d0' : '#bfdbfe'}`,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{
        fontSize: 10, color: 'var(--text2)', background: 'var(--bg3)',
        border: '1px solid var(--border)', borderRadius: 6,
        padding: '10px 12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        lineHeight: 1.6, margin: 0, fontFamily: 'monospace',
        maxHeight: 260, overflowY: 'auto',
      }}>
        {brief}
      </pre>
    </div>
  )
}

function OptimizationPanel({ opt, slug, onToggle }) {
  const items = opt.items || []
  const done  = items.filter(i => i.done).length
  const pct   = items.length > 0 ? Math.round((done / items.length) * 100) : 0

  const grouped = {
    high:   items.filter(i => i.priority === 'high'),
    medium: items.filter(i => i.priority === 'medium'),
    low:    items.filter(i => i.priority === 'low'),
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        Optimization checklist
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--bg3)' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: pct === 100 ? '#15803d' : '#2563eb', transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: 11, color: 'var(--text3)', minWidth: 36 }}>{done}/{items.length}</span>
      </div>

      {/* Diagnosis */}
      {opt.diagnosis && (
        <div style={{ fontSize: 11, color: 'var(--text2)', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '7px 10px', marginBottom: 10, lineHeight: 1.6 }}>
          <strong style={{ color: '#1d4ed8' }}>Diagnosis: </strong>{opt.diagnosis}
        </div>
      )}

      {/* Items grouped by priority */}
      {['high', 'medium', 'low'].map(p => {
        const group = grouped[p]
        if (!group.length) return null
        const ps = PRIORITY_STYLE[p]
        return (
          <div key={p} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: ps.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
              {ps.label} priority
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {group.map(item => (
                <div
                  key={item.id}
                  style={{
                    background: item.done ? '#f0fdf4' : 'var(--bg3)',
                    border: `1px solid ${item.done ? '#bbf7d0' : 'var(--border)'}`,
                    borderRadius: 6, padding: '8px 10px',
                    opacity: item.done ? 0.7 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={!!item.done}
                      onChange={e => onToggle(item.id, e.target.checked)}
                      style={{ marginTop: 2, cursor: 'pointer', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 10, color: 'var(--text3)' }}>{CATEGORY_LABEL[item.category] || item.category}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5, textDecoration: item.done ? 'line-through' : 'none' }}>
                        {item.issue}
                      </div>
                      {item.fix && !item.done && (
                        <div style={{ fontSize: 11, color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4, padding: '4px 7px', marginTop: 5, lineHeight: 1.5 }}>
                          Fix: {item.fix}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
        Audited {opt.audited_at || '—'} · Run <code style={{ background: 'var(--bg3)', padding: '1px 4px', borderRadius: 3 }}>/optimize-post [slug]</code> to refresh
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="section-label">{title}</div>
      {children}
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div className="stat-block">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: color || 'var(--text)', fontSize: 17 }}>{value ?? '—'}</div>
    </div>
  )
}

export default function DetailPanel({ post, gap, slug, postDetails, clusters, onClose, onGapStatusChange, onOptimizationToggle }) {
  const panelStyle = {
    width: 340, flexShrink: 0,
    borderLeft: '1px solid var(--border)',
    background: 'var(--bg2)',
    overflow: 'auto',
    padding: 20,
    boxShadow: '-2px 0 8px rgba(0,0,0,0.05)',
  }

  if (gap) {
    const STATUS = {
      suggested:     { color: '#b45309', bg: '#fffbeb' },
      approved:      { color: '#1d4ed8', bg: '#eff6ff' },
      in_progress:   { color: '#7c3aed', bg: 'rgba(124,58,237,0.06)' },
      published:     { color: '#15803d', bg: '#f0fdf4' },
      rejected:      { color: '#6b7280', bg: '#f9fafb' },
      deprioritized: { color: '#9ca3af', bg: '#fafafa' },
    }
    const currentStatus = gap.status || 'suggested'
    const s = STATUS[currentStatus] || STATUS.suggested

    const [saving, setSaving] = useState(false)
    const setStatus = async (newStatus) => {
      setSaving(true)
      await updateGapStatus(gap.id, newStatus)
      onGapStatusChange?.(gap.id, newStatus)
      setSaving(false)
    }

    const ACTION_BUTTONS = [
      { status: 'approved',      label: 'Approve',      filled: true,  color: '#fff',    bg: '#2563eb',             border: '#2563eb' },
      { status: 'in_progress',   label: 'In Progress',  filled: true,  color: '#fff',    bg: '#7c3aed',             border: '#7c3aed' },
      { status: 'published',     label: 'Published',    filled: true,  color: '#fff',    bg: '#15803d',             border: '#15803d' },
      { status: 'deprioritized', label: 'Deprioritize', filled: false, color: '#6b7280', bg: 'transparent',         border: '#d1d5db' },
      { status: 'rejected',      label: 'Reject',       filled: false, color: '#dc2626', bg: 'transparent',         border: '#fca5a5' },
      { status: 'suggested',     label: 'Reset',        filled: false, color: '#b45309', bg: '#fffbeb',             border: '#fde68a' },
    ].filter(b => b.status !== currentStatus)

    return (
      <div style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            {/* Cluster badge */}
          {gap.clusterName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: 2, background: gap.clusterColor, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: gap.clusterColor }}>{gap.clusterName}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
              <span className={`status-pill status-${currentStatus}`}>
                {currentStatus}
              </span>
              {gap.purpose && <span className={`badge badge-${gap.purpose}`}>{gap.purpose}</span>}
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>content gap</span>
              {gap.ahrefsValidated && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                  ✓ Ahrefs validated
                </span>
              )}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', lineHeight: 1.4 }}>{gap.title}</div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text3)', fontSize: 20, lineHeight: 1, padding: 2, marginLeft: 8 }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {ACTION_BUTTONS.map(b => (
            <button
              key={b.status}
              onClick={() => setStatus(b.status)}
              disabled={saving}
              style={{
                fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 20,
                background: b.bg, color: b.color, border: `1.5px solid ${b.border}`,
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
                transition: 'all 0.15s',
              }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Keyword metrics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <Stat label="MY volume" value={gap.estVolume != null ? `${gap.estVolume}/mo` : '—'} color={gap.estVolume > 0 ? '#b45309' : 'var(--text3)'} />
          <Stat label="Global volume" value={gap.globalVolume != null ? `${gap.globalVolume}/mo` : '—'} color="var(--text2)" />
          <Stat label="KD (Ahrefs)" value={gap.keywordDifficulty != null ? gap.keywordDifficulty : '—'} color={
            gap.keywordDifficulty == null ? 'var(--text3)' :
            gap.keywordDifficulty <= 10 ? '#15803d' :
            gap.keywordDifficulty <= 30 ? '#ca8a04' : '#dc2626'
          } />
          <Stat label="Traffic potential" value={gap.trafficPotential != null ? gap.trafficPotential.toLocaleString() : '—'} color="#0891b2" />
          <Stat label="Intent" value={gap.intent || '—'} />
          {gap.ahrefsValidationDate && <Stat label="Validated" value={gap.ahrefsValidationDate} />}
        </div>

        <Section title="Target keyword">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', background: 'var(--bg3)', padding: '8px 10px', borderRadius: 6 }}>
            {gap.targetKeyword}
          </div>
        </Section>

        {/* Ahrefs intelligence note */}
        {gap.ahrefsNote && (
          <Section title="Ahrefs intelligence">
            <div style={{ fontSize: 12, color: '#1e40af', lineHeight: 1.7, background: '#eff6ff', padding: '10px 12px', borderRadius: 6, border: '1px solid #bfdbfe' }}>
              {gap.ahrefsNote}
            </div>
          </Section>
        )}

        {/* Alternative keywords */}
        {gap.alternativeKeywords?.length > 0 && (
          <Section title="Related keywords (Ahrefs)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {gap.alternativeKeywords.map((k, i) => (
                <div key={i} style={{
                  fontSize: 11, padding: '6px 9px', borderRadius: 5,
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ color: 'var(--text2)', fontWeight: 500 }}>{k.keyword}</span>
                  <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--text3)', flexShrink: 0 }}>
                    {k.myVolume != null && <span style={{ color: k.myVolume > 0 ? '#b45309' : '#9ca3af', fontWeight: k.myVolume > 0 ? 700 : 400 }}>{k.myVolume}/mo MY</span>}
                    {k.globalVolume > 0 && <span>{k.globalVolume}/mo global</span>}
                    {k.kd != null && <span style={{ color: k.kd <= 10 ? '#15803d' : k.kd <= 30 ? '#ca8a04' : '#dc2626', fontWeight: 700 }}>KD {k.kd}</span>}
                    {k.tp > 0 && <span style={{ color: '#0891b2' }}>TP {k.tp.toLocaleString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {gap.rationale && (
          <Section title="Why this is a genuine gap">
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, background: 'var(--bg3)', padding: '10px 12px', borderRadius: 6, borderLeft: '3px solid var(--gap-color)' }}>
              {gap.rationale}
            </div>
          </Section>
        )}

        {gap.closestExistingPost && (
          <Section title="Closest existing post">
            <div style={{ fontSize: 12, color: 'var(--text2)', background: 'var(--bg3)', padding: '8px 10px', borderRadius: 6 }}>
              {gap.closestExistingPost}
              {gap.whyExistingDoesntCover && (
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5, fontStyle: 'italic', lineHeight: 1.5 }}>
                  {gap.whyExistingDoesntCover}
                </div>
              )}
            </div>
          </Section>
        )}

        {gap.blogBrief && <BlogBriefSection brief={gap.blogBrief} />}

        {gap.suggestedLinksOut?.length > 0 && (
          <Section title={`↗ Links out from this post (${gap.suggestedLinksOut.length})`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {gap.suggestedLinksOut.map((l, i) => (
                <div key={i} style={{ fontSize: 11, padding: '7px 9px', borderRadius: 6, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <div style={{ color: '#1e40af', fontWeight: 700, marginBottom: 2 }}>"{l.anchor}"</div>
                  <div style={{ color: '#64748b', fontSize: 10 }}>→ {l.slug}</div>
                  {l.note && <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 3, fontStyle: 'italic', lineHeight: 1.4 }}>{l.note}</div>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {gap.suggestedLinksIn?.length > 0 && (
          <Section title={`↙ Existing posts to link here (${gap.suggestedLinksIn.length})`}>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6, fontStyle: 'italic' }}>
              Anchor text status checked against first 5,000 chars of each post.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {gap.suggestedLinksIn.map((l, i) => {
                const sourceText = postDetails[l.slug]?.extracted_text || ''
                const anchorFound = sourceText.toLowerCase().includes(l.anchor.toLowerCase())
                return (
                  <div key={i} style={{ fontSize: 11, padding: '7px 9px', borderRadius: 6, background: '#f0fdfa', border: '1px solid #99f6e4' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, flexShrink: 0,
                        background: anchorFound ? '#dcfce7' : '#fff7ed',
                        color: anchorFound ? '#15803d' : '#c2410c',
                        border: `1px solid ${anchorFound ? '#bbf7d0' : '#fed7aa'}`,
                      }}>
                        {anchorFound ? '✓ Text exists' : '✏ Needs edit'}
                      </span>
                    </div>
                    <div style={{ color: '#0f766e', fontWeight: 700, marginBottom: 2 }}>"{l.anchor}"</div>
                    <div style={{ color: '#64748b', fontSize: 10 }}>← {l.slug}</div>
                    {l.note && <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 3, fontStyle: 'italic', lineHeight: 1.4 }}>{l.note}</div>}
                  </div>
                )
              })}
            </div>
          </Section>
        )}

      </div>
    )
  }

  if (!post) return null

  const cluster = clusters.find(c => c.id === post.cluster)
  const clusterColor = cluster?.color || '#2563eb'
  // support both old string format and new {slug, anchor} format
  const normalise = arr => (arr || []).map(x => typeof x === 'string' ? { slug: x, anchor: null } : x)
  const inLinks  = normalise(post.internal_links_in).filter(x => postDetails[x.slug])
  const outLinks = normalise(post.internal_links_out).filter(x => postDetails[x.slug])
  const clicks = post.gsc_clicks || 0
  const clickColor = clicks > 100 ? '#15803d' : clicks >= 10 ? '#1d4ed8' : clicks >= 1 ? '#ca8a04' : 'var(--text3)'
  const TRIAGE_COLOR = { high: '#15803d', medium: '#1d4ed8', low: '#ca8a04', none: '#6b7280', growing: '#15803d', declining: '#dc2626', stagnant: '#6b7280', healthy: '#15803d' }
  const triageColor = TRIAGE_COLOR[post.triage_status] || 'var(--text3)'

  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1, paddingRight: 8 }}>
          {cluster && (
            <div style={{ fontSize: 10, fontWeight: 700, color: clusterColor, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
              <div style={{ width: 7, height: 7, borderRadius: 2, background: clusterColor }} />
              {post.page_type === 'pillar' ? `Pillar · ${cluster.name}` : cluster.name}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
            {post.hero_tier && (
              <span style={{ color: 'var(--text3)', fontSize: 13, fontWeight: 700, flexShrink: 0, lineHeight: 1 }}>
                {post.hero_tier === 'crown' ? '★' : '◆'}
              </span>
            )}
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', lineHeight: 1.4 }}>{post.title}</div>
          </div>
          {post.hero_tier && (
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', marginBottom: 4 }}>
              {post.hero_tier === 'crown' ? 'Crown Hero · Priority optimization target' : 'Hero · High strategic value'}
            </div>
          )}
        </div>
        <button onClick={onClose} style={{ color: 'var(--text3)', fontSize: 20, lineHeight: 1, padding: 2, flexShrink: 0 }}>×</button>
      </div>

      <a
        href={`${BASE_URL}${slug}/`}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11,
          color: 'var(--accent)', fontWeight: 600, padding: '5px 10px',
          borderRadius: 6, background: 'rgba(37,99,235,0.07)',
          border: '1px solid rgba(37,99,235,0.15)', marginBottom: 16,
          textDecoration: 'none',
        }}
      >
        View post on site →
      </a>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        <Stat label="GSC Clicks" value={clicks.toLocaleString()} color={clickColor} />
        <Stat label="Impressions" value={(post.gsc_impressions || 0).toLocaleString()} />
        <Stat label="Ahrefs traffic" value={post.ahrefs_traffic || 0} />
        <Stat label="Ref. domains" value={post.ahrefs_referring_domains || 0} />
        <Stat label="Triage status" value={post.triage_status ? post.triage_status.charAt(0).toUpperCase() + post.triage_status.slice(1) : '—'} color={triageColor} />
        <Stat label="Page type" value={post.page_type ? post.page_type.charAt(0).toUpperCase() + post.page_type.slice(1) : '—'} />
      </div>

      {post.top_keyword && (
        <Section title="Top keyword">
          <div style={{ fontSize: 12, color: 'var(--text)', background: 'var(--bg3)', padding: '8px 10px', borderRadius: 6 }}>
            <span style={{ fontWeight: 600 }}>{post.top_keyword}</span>
            <span style={{ color: 'var(--text3)', marginLeft: 8 }}>
              pos {post.top_kw_position}
              {post.top_kw_volume > 0 && ` · ${post.top_kw_volume.toLocaleString()}/mo`}
            </span>
          </div>
        </Section>
      )}

      {post.content_summary && (
        <Section title="Content summary">
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, background: 'var(--bg3)', padding: '10px 12px', borderRadius: 6 }}>
            <div style={{ marginBottom: 5 }}>
              <span style={{ fontWeight: 700, color: 'var(--text3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Topic </span>
              {post.content_summary.main_topic}
            </div>
            <div style={{ marginBottom: 5 }}>
              <span style={{ fontWeight: 700, color: 'var(--text3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Angle </span>
              {post.content_summary.angle}
            </div>
            {post.content_summary.subtopics_covered?.length > 0 && (
              <div>
                <span style={{ fontWeight: 700, color: 'var(--text3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Covers </span>
                <ul style={{ paddingLeft: 16, marginTop: 3 }}>
                  {post.content_summary.subtopics_covered.map((s, i) => (
                    <li key={i} style={{ marginBottom: 2 }}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      <Section title={`Links in (${inLinks.length})`}>
        {inLinks.length === 0
          ? <div style={{ fontSize: 11, color: 'var(--text3)', fontStyle: 'italic' }}>No contextual inbound links</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {inLinks.map(({ slug: s, anchor }) => (
                <div key={s} style={{ fontSize: 11, color: 'var(--text2)', background: 'var(--bg3)', padding: '5px 9px', borderRadius: 5 }}>
                  <div style={{ fontWeight: 600 }}>{postDetails[s]?.title || s}</div>
                  {anchor && <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>anchor: "{anchor}"</div>}
                </div>
              ))}
            </div>
        }
      </Section>

      <Section title={`Links out (${outLinks.length})`}>
        {outLinks.length === 0
          ? <div style={{ fontSize: 11, color: 'var(--text3)', fontStyle: 'italic' }}>No outbound contextual links</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {outLinks.map(({ slug: s, anchor }) => (
                <div key={s} style={{ fontSize: 11, color: 'var(--text2)', background: 'var(--bg3)', padding: '5px 9px', borderRadius: 5 }}>
                  <div style={{ fontWeight: 600 }}>{postDetails[s]?.title || s}</div>
                  {anchor && <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>anchor: "{anchor}"</div>}
                </div>
              ))}
            </div>
        }
      </Section>

      {post.models_mentioned?.length > 0 && (
        <Section title="Chair models mentioned">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {post.models_mentioned.map(m => (
              <span key={m} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: `${clusterColor}15`, color: clusterColor, fontWeight: 600 }}>
                {m}
              </span>
            ))}
          </div>
        </Section>
      )}

      {post.optimization ? (
        <div style={{ paddingTop: 14, borderTop: '1px solid var(--border)', marginTop: 8 }}>
          <OptimizationPanel
            opt={post.optimization}
            slug={slug}
            onToggle={async (itemId, done) => {
              await toggleOptimizationItem(slug, itemId, done)
              // optimistic UI update handled by parent via onOptimizationToggle
              onOptimizationToggle?.(slug, itemId, done)
            }}
          />
        </div>
      ) : (
        <div style={{ fontSize: 11, color: 'var(--text3)', paddingTop: 12, borderTop: '1px solid var(--border)', marginTop: 8 }}>
          No optimization audit yet. Run{' '}
          <code style={{ background: 'var(--bg3)', padding: '1px 5px', borderRadius: 3, color: 'var(--text2)' }}>
            /optimize-post {slug}
          </code>{' '}
          in Claude Code.
        </div>
      )}

      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>
        {post.word_count?.toLocaleString()} words
      </div>
    </div>
  )
}
