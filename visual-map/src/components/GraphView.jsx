import { useState, useEffect, useCallback } from 'react'
import {
  ReactFlow, Background, Controls, MiniMap,
  useNodesState, useEdgesState,
  BackgroundVariant, Panel, Handle, Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  forceSimulation, forceManyBody, forceLink,
  forceCenter, forceCollide,
} from 'd3-force'

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_FORCES = {
  repulsion:     -900,
  linkDistance:  180,
  linkStrength:  0.3,
  clusterForce:  0.5,
  centerForce:   0.02,
}
const STORAGE_KEY = 'merryfair-graph-forces'

function loadForces() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULT_FORCES, ...JSON.parse(saved) } : DEFAULT_FORCES
  } catch { return DEFAULT_FORCES }
}

// ── Invisible handle style (needed for edges to connect) ──────────────────────

const HANDLE_STYLE = {
  width: 6, height: 6,
  background: 'transparent',
  border: '1.5px solid #94a3b8',
  opacity: 0,
}

// ── Simulation ────────────────────────────────────────────────────────────────

function runSimulation(clusters, postDetails, forces) {
  const simNodes = []
  const links    = []
  const clusterCenters = {}

  const active = clusters.filter(c => (c.posts?.length || 0) > 0)
  const R = active.length <= 3 ? 600 : 900
  active.forEach((c, i) => {
    const a = (2 * Math.PI * i) / active.length - Math.PI / 2
    clusterCenters[c.id] = { x: Math.cos(a) * R, y: Math.sin(a) * R }
  })

  clusters.forEach(cluster => {
    const center = clusterCenters[cluster.id] || { x: 0, y: 0 }
    ;(cluster.posts || []).forEach(slug => {
      const post = postDetails[slug]
      if (!post) return
      simNodes.push({
        id: `post-${slug}`, slug,
        cluster: cluster.id, clusterColor: cluster.color,
        isPillar: cluster.pillarSlug === slug,
        needsPillar: cluster.pillarStatus === 'needs-creation',
        post,
        x: center.x + (Math.random() - 0.5) * 60,
        y: center.y + (Math.random() - 0.5) * 60,
      })
    })
    // Only show gaps that are not yet published or rejected
    ;(cluster.gaps || []).filter(g => g.status !== 'published' && g.status !== 'rejected').forEach((gap, gi) => {
      const id = gap.id || `gap-${cluster.id}-${gi}`
      simNodes.push({
        id, gap, gapId: id,
        cluster: cluster.id, clusterColor: cluster.color,
        isGap: true,
        x: (center.x || 0) + (Math.random() - 0.5) * 100,
        y: (center.y || 0) + (Math.random() - 0.5) * 100,
      })
    })
  })

  const nodeIdSet = new Set(simNodes.map(n => n.id))

  // Build a slug→clusterId lookup for cross-cluster link detection
  const slugToCluster = {}
  clusters.forEach(c => (c.posts || []).forEach(slug => { slugToCluster[slug] = c.id }))

  Object.entries(postDetails).forEach(([slug, post]) => {
    ;(post.internal_links_out || []).forEach(link => {
      const targetSlug = typeof link === 'string' ? link : link.slug
      const s = `post-${slug}`, t = `post-${targetSlug}`
      if (!nodeIdSet.has(s) || !nodeIdSet.has(t)) return
      const crossCluster = slugToCluster[slug] !== slugToCluster[targetSlug]
      links.push({ source: s, target: t, crossCluster })
    })
  })
  clusters.forEach(cluster => {
    if (!cluster.pillarSlug) return
    ;(cluster.gaps || []).forEach(gap => {
      const s = gap.id, t = `post-${cluster.pillarSlug}`
      if (nodeIdSet.has(s) && nodeIdSet.has(t)) links.push({ source: s, target: t, weak: true })
    })
  })

  const sim = forceSimulation(simNodes)
    .force('charge',    forceManyBody().strength(forces.repulsion))
    .force('link',      forceLink(links).id(d => d.id).distance(forces.linkDistance).strength(d => d.weak ? 0.02 : d.crossCluster ? 0.02 : forces.linkStrength))
    .force('center',    forceCenter(0, 0).strength(forces.centerForce))
    .force('collision', forceCollide(d => d.isPillar ? 130 : 110))
    .force('cluster', alpha => {
      simNodes.forEach(n => {
        const c = clusterCenters[n.cluster]
        if (!c) return
        n.vx += (c.x - n.x) * forces.clusterForce * alpha
        n.vy += (c.y - n.y) * forces.clusterForce * alpha
      })
    })
    .stop()

  for (let i = 0; i < 500; i++) sim.tick()
  return { simNodes, links }
}


// ── Custom node types ─────────────────────────────────────────────────────────
// IMPORTANT: Handle components are required for edges to connect correctly.
// Without them, React Flow renders edges as zero-length lines.

function PostNodeComponent({ data }) {
  const { post, isPillar, clusterColor, isSelected } = data
  if (!post) return null
  const clicks = post.gsc_clicks || 0
  const dot = clicks > 100 ? '#16a34a' : clicks >= 10 ? '#2563eb' : clicks >= 1 ? '#ca8a04' : '#9ca3af'

  const isCrown = post.hero_tier === 'crown'
  const isHero  = post.hero_tier === 'hero'

  // Determine visual treatment by tier
  const nodeWidth = isCrown ? 210 : isHero ? 175 : isPillar ? 195 : 165
  const nodeBg = isCrown
    ? 'linear-gradient(135deg, #fff 60%, rgba(217,119,6,0.08))'
    : isHero
      ? 'linear-gradient(135deg, #fff 70%, rgba(124,58,237,0.06))'
      : isPillar
        ? `linear-gradient(135deg,#fff 60%,${clusterColor}18)`
        : '#fff'
  const nodeBorder = isCrown
    ? '3px solid #d97706'
    : isHero
      ? '2px solid #7c3aed'
      : isPillar
        ? `3px solid ${clusterColor}`
        : `2px solid ${clusterColor}`
  const nodeBorderRadius = isPillar || isCrown ? 12 : 8
  const nodePadding = isPillar || isCrown ? '10px 14px' : '8px 12px'
  const nodeBoxShadow = isSelected
    ? `0 0 0 3px ${isCrown ? '#d97706' : isHero ? '#7c3aed' : clusterColor}, 0 4px 20px rgba(0,0,0,0.18)`
    : isCrown
      ? '0 2px 12px rgba(217,119,6,0.3), 0 1px 4px rgba(0,0,0,0.08)'
      : isHero
        ? '0 2px 12px rgba(124,58,237,0.2), 0 1px 4px rgba(0,0,0,0.08)'
        : isPillar
          ? `0 2px 12px ${clusterColor}40, 0 1px 4px rgba(0,0,0,0.08)`
          : '0 1px 5px rgba(0,0,0,0.09)'

  return (
    <>
      <Handle type="target" position={Position.Top}    style={HANDLE_STYLE} />
      <Handle type="target" position={Position.Left}   style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Bottom} style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Right}  style={HANDLE_STYLE} />
      <div style={{
        background: nodeBg,
        border: nodeBorder,
        borderRadius: nodeBorderRadius,
        padding: nodePadding,
        width: nodeWidth,
        boxShadow: nodeBoxShadow,
        cursor: 'pointer',
        userSelect: 'none',
      }}>
        {isCrown && (
          <div style={{ fontSize: 9, fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 4 }}>
            ★ Crown Hero
          </div>
        )}
        {!isCrown && isPillar && (
          <div style={{ fontSize: 9, fontWeight: 800, color: clusterColor, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 4 }}>
            ★ Pillar
          </div>
        )}
        {isHero && !isCrown && (
          <div style={{ fontSize: 9, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 4 }}>
            ◆ Hero
          </div>
        )}
        <div style={{ fontSize: (isPillar || isCrown) ? 12 : 11, fontWeight: (isPillar || isCrown) ? 700 : 600, color: '#111827', lineHeight: 1.35, marginBottom: 6 }}>
          {post.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: '#6b7280' }}>
            {clicks > 0 ? `${clicks.toLocaleString()} clicks` : 'No traffic'}
          </span>
        </div>
      </div>
    </>
  )
}

const GAP_STATUS_STYLE = {
  suggested:    { color: '#b45309', label: '◌ Suggested' },
  approved:     { color: '#1d4ed8', label: '✓ Approved' },
  deprioritized:{ color: '#9ca3af', label: '— Deprioritized' },
}

function GapNodeComponent({ data }) {
  const { gap, clusterColor, isSelected } = data
  if (!gap) return null
  const s = GAP_STATUS_STYLE[gap.status] || GAP_STATUS_STYLE.suggested
  return (
    <>
      <Handle type="target" position={Position.Top}    style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Bottom} style={HANDLE_STYLE} />
      <div style={{
        background: `${clusterColor}18`,
        border: `1.5px dashed ${clusterColor}`,
        borderRadius: 8,
        padding: '8px 12px',
        width: 160,
        boxShadow: isSelected ? `0 0 0 2.5px ${s.color}, 0 4px 14px rgba(0,0,0,0.13)` : '0 1px 4px rgba(0,0,0,0.07)',
        cursor: 'pointer',
        userSelect: 'none',
      }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: s.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{s.label}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#1f2937', lineHeight: 1.35, marginBottom: 4 }}>{gap.title}</div>
        {gap.estVolume > 0 && <div style={{ fontSize: 10, color: '#92400e', fontWeight: 600 }}>{gap.estVolume}/mo</div>}
      </div>
    </>
  )
}

const nodeTypes = {
  postNode: PostNodeComponent,
  gapNode:  GapNodeComponent,
}

// ── Force settings ────────────────────────────────────────────────────────────

function ForceSettings({ forces, setForces, onRerun }) {
  const [open, setOpen] = useState(false)
  const sliders = [
    { key: 'repulsion',    label: 'Repulsion',      min: -1500, max: -80,  step: 20,   hint: 'How far apart nodes push each other' },
    { key: 'linkDistance', label: 'Link distance',  min: 60,    max: 400,  step: 10,   hint: 'Preferred length of connecting lines' },
    { key: 'linkStrength', label: 'Link strength',  min: 0,     max: 1,    step: 0.05, hint: 'How strongly linked posts attract' },
    { key: 'clusterForce', label: 'Cluster pull',   min: 0,     max: 0.6,  step: 0.01, hint: 'How tightly each cluster groups together' },
    { key: 'centerForce',  label: 'Center gravity', min: 0,     max: 0.2,  step: 0.01, hint: 'Pull everything toward center' },
  ]
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{ padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, background: open ? '#1e293b' : '#fff', color: open ? '#fff' : '#374151', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 6 }}>
        ⚙ Forces
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 38, right: 0, zIndex: 9999, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', width: 272, boxShadow: '0 8px 32px rgba(0,0,0,0.14)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Physics settings</div>
          {sliders.map(s => (
            <div key={s.key} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1f2937' }}>{s.label}</span>
                <span style={{ fontSize: 11, color: '#6b7280', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{forces[s.key]}</span>
              </div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>{s.hint}</div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={forces[s.key]}
                onChange={e => setForces(f => ({ ...f, [s.key]: parseFloat(e.target.value) }))}
                style={{ width: '100%', accentColor: '#2563eb' }} />
            </div>
          ))}
          <button onClick={onRerun} style={{ width: '100%', padding: '8px 0', borderRadius: 7, background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 12, marginTop: 4 }}>
            Re-run simulation
          </button>
          <button onClick={() => { setForces(DEFAULT_FORCES); setTimeout(onRerun, 50) }} style={{ width: '100%', padding: '6px 0', borderRadius: 7, background: 'transparent', color: '#9ca3af', fontSize: 11, marginTop: 6, border: '1px solid var(--border)' }}>
            Reset to defaults
          </button>
        </div>
      )}
    </div>
  )
}

function Legend({ clusters }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 14px', display: 'flex', flexWrap: 'wrap', gap: '6px 16px', fontSize: 11, color: '#374151', boxShadow: 'var(--shadow)', maxWidth: 420 }}>
      {[
        { color: '#16a34a', label: '100+ clicks',   dot: true },
        { color: '#2563eb', label: '10–99 clicks',  dot: true },
        { color: '#ca8a04', label: '1–9 clicks',    dot: true },
        { color: '#9ca3af', label: 'No traffic',    dot: true },
        { color: '#475569', label: 'Internal link', line: true },
      ].map(l => (
        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {l.dot  && <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />}
          {l.line && <div style={{ width: 18, height: 0, borderTop: `2px solid ${l.color}` }} />}
          {l.label}
        </div>
      ))}
      <div style={{ width: '100%', height: 0, borderTop: '1px solid var(--border)', margin: '2px 0' }} />
      {clusters.map(c => (
        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 18, height: 12, borderRadius: 3, border: `2px solid ${c.color}`, background: 'transparent', flexShrink: 0 }} />
          <span>{c.name}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 18, height: 12, borderRadius: 3, border: `1.5px dashed #888`, background: 'rgba(100,100,100,0.1)', flexShrink: 0 }} />
        <span>Suggested gap</span>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function GraphView({ clusters, postDetails, selected, onSelect, dataVersion }) {
  const [forces, setForces] = useState(loadForces)
  const [simKey, setSimKey] = useState(0)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const rebuild = useCallback((f) => {
    const { simNodes, links } = runSimulation(clusters, postDetails, f)

    const rfNodes = simNodes.map(n => ({
      id: n.id,
      type: n.isGap ? 'gapNode' : 'postNode',
      position: { x: n.x ?? 0, y: n.y ?? 0 },
      data: {
        slug: n.slug, post: n.post,
        gap: n.gap, gapId: n.gapId,
        isGap: !!n.isGap, isPillar: !!n.isPillar,
        clusterColor: n.clusterColor, cluster: n.cluster,
        isSelected: false, // selection highlight applied by separate effect
      },
    }))

    const seen = new Set()
    const rfEdges = links.map(l => {
      const src = typeof l.source === 'object' ? l.source.id : l.source
      const tgt = typeof l.target === 'object' ? l.target.id : l.target
      const eid = `e-${src}-${tgt}`
      if (seen.has(eid)) return null
      seen.add(eid)
      return {
        id: eid, source: src, target: tgt,
        style: {
          stroke: l.weak ? 'rgba(148,163,184,0.45)' : 'rgba(148,163,184,0.6)',
          strokeWidth: l.weak ? 1.2 : 1.5,
          strokeDasharray: l.weak ? '5,3' : undefined,
        },
        markerEnd: { type: 'arrowclosed', color: l.weak ? 'rgba(148,163,184,0.45)' : 'rgba(148,163,184,0.6)', width: 12, height: 12 },
      }
    }).filter(Boolean)

    setNodes(rfNodes)
    setEdges(rfEdges)
  }, [clusters, postDetails, dataVersion]) // selected intentionally excluded — handled by separate highlight effect

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(forces)) }, [forces])
  // Re-run simulation on mount, manual trigger, or whenever cluster/post data changes
  useEffect(() => { rebuild(forces) }, [rebuild])
  useEffect(() => { rebuild(forces) }, [simKey])

  useEffect(() => {
    setNodes(prev => prev.map(n => ({
      ...n,
      data: { ...n.data, isSelected: selected === n.data?.slug || selected === n.data?.gapId },
    })))
  }, [selected])

  const onNodeClick = useCallback((_, node) => {
    if (node.data?.slug)  onSelect(node.data.slug)
    else if (node.data?.gapId) onSelect(node.data.gapId)
  }, [onSelect])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.1}
        maxZoom={2.5}
        nodesDraggable
        attributionPosition="bottom-right"
      >
        <Background variant={BackgroundVariant.Dots} color="#c8cde0" gap={28} size={1.2} />
        <Controls />
        <MiniMap
          nodeColor={n => {
            if (n.data?.isGap) return '#f59e0b'
            if (n.data?.isPillar) return n.data?.clusterColor || '#2563eb'
            const c = n.data?.post?.gsc_clicks || 0
            return c > 100 ? '#16a34a' : c >= 10 ? '#2563eb' : c >= 1 ? '#ca8a04' : '#d1d5db'
          }}
          maskColor="rgba(240,242,247,0.8)"
        />
        <Panel position="top-right">
          <ForceSettings forces={forces} setForces={setForces} onRerun={() => setSimKey(k => k + 1)} />
        </Panel>
        <Panel position="bottom-left">
          <Legend clusters={clusters} />
        </Panel>
      </ReactFlow>
    </div>
  )
}
