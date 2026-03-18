const BASE_URL = 'https://www.merryfair.com/latest_updates/blog/'

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 6, padding: '8px 10px' }}>
      <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: color || 'var(--text)' }}>{value ?? '—'}</div>
    </div>
  )
}

export default function DetailPanel({ post, gap, slug, postDetails, clusters, onClose }) {
  if (gap) {
    const s = { suggested: '#d4841a', approved: '#4f8ef7', published: '#34c77b', rejected: '#666' }
    return (
      <div style={{
        width: 320, flexShrink: 0, borderLeft: '1px solid var(--border)',
        background: 'var(--bg2)', overflow: 'auto', padding: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: s[gap.status] || 'var(--gap-color)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Content gap · {gap.status || 'suggested'}
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>{gap.title}</div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text3)', fontSize: 18, lineHeight: 1, padding: 4 }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <Stat label="Est. volume" value={`${gap.estVolume}/mo`} color="var(--gap-color)" />
          <Stat label="Intent" value={gap.intent || '—'} />
        </div>

        <Section title="Target keyword">
          <div style={{ fontSize: 13, color: 'var(--text)', background: 'var(--bg)', padding: '8px 10px', borderRadius: 6 }}>
            {gap.targetKeyword}
          </div>
        </Section>

        <Section title="Why this is a genuine gap">
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, background: 'var(--bg)', padding: '10px 12px', borderRadius: 6 }}>
            {gap.rationale}
          </div>
        </Section>

        {gap.closestExistingPost && (
          <Section title="Closest existing post">
            <div style={{ fontSize: 12, color: 'var(--text2)', background: 'var(--bg)', padding: '8px 10px', borderRadius: 6 }}>
              {gap.closestExistingPost}
            </div>
          </Section>
        )}

        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>
          Cluster: <span style={{ color: gap.clusterColor }}>{gap.clusterName}</span>
        </div>
      </div>
    )
  }

  if (!post) return null

  const cluster = clusters.find(c => c.id === post.cluster)
  const clusterColor = cluster?.color || '#4f8ef7'

  const inLinks = (post.internal_links_in || []).filter(s => postDetails[s])
  const outLinks = (post.internal_links_out || []).filter(s => postDetails[s])

  return (
    <div style={{
      width: 320, flexShrink: 0, borderLeft: '1px solid var(--border)',
      background: 'var(--bg2)', overflow: 'auto', padding: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ flex: 1, paddingRight: 8 }}>
          {post.page_type === 'pillar' && (
            <div style={{ fontSize: 10, fontWeight: 700, color: clusterColor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Pillar · {cluster?.name}
            </div>
          )}
          {post.page_type !== 'pillar' && cluster && (
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>
              <span style={{ color: clusterColor }}>●</span> {cluster.name}
            </div>
          )}
          <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>{post.title}</div>
        </div>
        <button onClick={onClose} style={{ color: 'var(--text3)', fontSize: 18, lineHeight: 1, padding: 4, flexShrink: 0 }}>×</button>
      </div>

      <a
        href={`${BASE_URL}${slug}/`}
        target="_blank"
        rel="noreferrer"
        style={{ fontSize: 11, color: 'var(--accent)', wordBreak: 'break-all', display: 'block', marginBottom: 16 }}
      >
        View post →
      </a>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        <Stat label="GSC Clicks" value={(post.gsc_clicks || 0).toLocaleString()} color={post.gsc_clicks > 100 ? '#34c77b' : post.gsc_clicks > 0 ? '#4f8ef7' : undefined} />
        <Stat label="Impressions" value={(post.gsc_impressions || 0).toLocaleString()} />
        <Stat label="Ahrefs traffic" value={post.ahrefs_traffic || 0} />
        <Stat label="Ref. domains" value={post.ahrefs_referring_domains || 0} />
      </div>

      {post.top_keyword && (
        <Section title="Top keyword">
          <div style={{ fontSize: 12, color: 'var(--text)', background: 'var(--bg)', padding: '8px 10px', borderRadius: 6 }}>
            <span style={{ fontWeight: 500 }}>{post.top_keyword}</span>
            <span style={{ color: 'var(--text3)', marginLeft: 8 }}>
              pos {post.top_kw_position} · {post.top_kw_volume?.toLocaleString()}/mo
            </span>
          </div>
        </Section>
      )}

      {post.content_summary && (
        <Section title="Content summary">
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, background: 'var(--bg)', padding: '10px 12px', borderRadius: 6 }}>
            <div style={{ marginBottom: 6 }}><strong style={{ color: 'var(--text3)' }}>Topic:</strong> {post.content_summary.main_topic}</div>
            <div style={{ marginBottom: 6 }}><strong style={{ color: 'var(--text3)' }}>Angle:</strong> {post.content_summary.angle}</div>
            {post.content_summary.subtopics_covered?.length > 0 && (
              <div>
                <strong style={{ color: 'var(--text3)' }}>Covers:</strong>
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
        {inLinks.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>No contextual inbound links</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {inLinks.map(s => (
              <div key={s} style={{ fontSize: 11, color: 'var(--text2)', background: 'var(--bg)', padding: '5px 8px', borderRadius: 5 }}>
                {postDetails[s]?.title || s}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title={`Links out (${outLinks.length})`}>
        {outLinks.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>No outbound contextual links</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {outLinks.map(s => (
              <div key={s} style={{ fontSize: 11, color: 'var(--text2)', background: 'var(--bg)', padding: '5px 8px', borderRadius: 5 }}>
                {postDetails[s]?.title || s}
              </div>
            ))}
          </div>
        )}
      </Section>

      {post.models_mentioned?.length > 0 && (
        <Section title="Chair models mentioned">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {post.models_mentioned.map(m => (
              <span key={m} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: `${clusterColor}18`, color: clusterColor }}>
                {m}
              </span>
            ))}
          </div>
        </Section>
      )}

      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        {post.word_count?.toLocaleString()} words · {post.triage_status} traffic
      </div>
    </div>
  )
}
