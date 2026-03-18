import { useMemo, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const CLUSTER_LAYOUT = {
  'buying-guide':      { cx: 300,  cy: 300  },
  'best-chairs-budget':{ cx: 900,  cy: 300  },
  'health-posture':    { cx: 1500, cy: 300  },
  'gaming-specialized':{ cx: 300,  cy: 850  },
  'workspace-lifestyle':{ cx: 900, cy: 850  },
  'brand-seasonal':    { cx: 1500, cy: 850  },
}

function buildGraph(clusters, postDetails) {
  const nodes = []
  const edges = []
  const slugToNodeId = {}

  clusters.forEach(cluster => {
    const layout = CLUSTER_LAYOUT[cluster.id] || { cx: 500, cy: 500 }
    const { cx, cy } = layout
    const posts = cluster.posts || []
    const pillarSlug = cluster.pillarSlug
    const color = cluster.color || '#555'

    // Group background node
    nodes.push({
      id: `group-${cluster.id}`,
      type: 'group',
      position: { x: cx - 260, y: cy - 220 },
      style: {
        width: 520,
        height: posts.length > 5 ? 480 : 440,
        background: `${color}08`,
        border: `1.5px solid ${color}30`,
        borderRadius: 16,
      },
      data: { label: cluster.name },
    })

    // Cluster label node
    nodes.push({
      id: `label-${cluster.id}`,
      type: 'default',
      position: { x: cx - 250, y: cy - 210 },
      parentId: `group-${cluster.id}`,
      extent: 'parent',
      draggable: false,
      selectable: false,
      style: { background: 'transparent', border: 'none', width: 500, pointerEvents: 'none' },
      data: {
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span style={{ fontWeight: 600, fontSize: 11, color: color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {cluster.name}
            </span>
            {cluster.pillarStatus === 'needs-creation' && (
              <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 3, background: '#4a1515', color: '#f07070', fontWeight: 600 }}>
                NEEDS PILLAR
              </span>
            )}
          </div>
        )
      },
    })

    // Post positions: pillar center, others in arc
    const nonPillarPosts = posts.filter(s => s !== pillarSlug)
    const positions = {}

    if (pillarSlug) {
      positions[pillarSlug] = { x: cx, y: cy - 60 }
    }

    nonPillarPosts.forEach((slug, i) => {
      const cols = Math.min(nonPillarPosts.length, 3)
      const col = i % cols
      const row = Math.floor(i / cols)
      positions[slug] = {
        x: cx - ((cols - 1) * 130) / 2 + col * 130,
        y: cy + 80 + row * 110,
      }
    })

    posts.forEach(slug => {
      const post = postDetails[slug]
      if (!post) return
      const pos = positions[slug] || { x: cx, y: cy }
      const isPillar = slug === pillarSlug
      const nodeId = `post-${slug}`
      slugToNodeId[slug] = nodeId
      const clicks = post.gsc_clicks || 0
      const triageColor = clicks > 100 ? '#34c77b' : clicks >= 10 ? '#4f8ef7' : clicks >= 1 ? '#c9c142' : '#4e5568'

      nodes.push({
        id: nodeId,
        position: pos,
        data: {
          slug,
          label: post.title,
          isPillar,
          clicks,
          triageColor,
          clusterColor: color,
          pageType: post.page_type,
        },
        style: {
          background: isPillar ? `${color}18` : 'var(--bg2)',
          border: isPillar ? `2px solid ${color}` : `1px solid var(--border2)`,
          borderRadius: isPillar ? 12 : 8,
          padding: '8px 12px',
          width: isPillar ? 220 : 180,
          cursor: 'pointer',
          boxShadow: isPillar ? `0 0 20px ${color}20` : 'none',
        },
        label: undefined,
        type: 'default',
      })
    })

    // Gap nodes
    ;(cluster.gaps || []).forEach((gap, gi) => {
      const gapId = `gap-${gap.id || `${cluster.id}-${gi}`}`
      const pos = {
        x: cx - 100 + gi * 220,
        y: cy + (nonPillarPosts.length > 2 ? 340 : 250),
      }
      nodes.push({
        id: gapId,
        position: pos,
        data: { gap, clusterColor: color, isGap: true },
        style: {
          background: 'var(--gap-bg)',
          border: `1px dashed ${color}50`,
          borderRadius: 8,
          padding: '7px 11px',
          width: 180,
          cursor: 'pointer',
        },
        type: 'default',
      })
    })
  })

  // Internal link edges
  Object.entries(postDetails).forEach(([slug, post]) => {
    const sourceId = `post-${slug}`
    ;(post.internal_links_out || []).forEach(targetSlug => {
      const targetId = `post-${targetSlug}`
      if (slugToNodeId[targetSlug]) {
        edges.push({
          id: `e-${slug}-${targetSlug}`,
          source: sourceId,
          target: targetId,
          animated: false,
          style: { stroke: '#2e3549', strokeWidth: 1.5 },
          markerEnd: { type: 'arrowclosed', color: '#2e3549', width: 12, height: 12 },
        })
      }
    })
  })

  return { nodes, edges }
}

function CustomNodeContent({ data }) {
  if (data.isGap) {
    return (
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--gap-color)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
          Suggested
        </div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', lineHeight: 1.3 }}>
          {data.gap.title}
        </div>
        {data.gap.estVolume > 0 && (
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>
            {data.gap.estVolume}/mo
          </div>
        )}
      </div>
    )
  }
  return (
    <div>
      {data.isPillar && (
        <div style={{ fontSize: 9, fontWeight: 700, color: data.clusterColor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
          Pillar
        </div>
      )}
      <div style={{ fontSize: data.isPillar ? 12 : 11, fontWeight: data.isPillar ? 600 : 500, color: 'var(--text)', lineHeight: 1.3 }}>
        {data.label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: data.triageColor, flexShrink: 0 }} />
        <span style={{ fontSize: 10, color: 'var(--text3)' }}>
          {data.clicks > 0 ? `${data.clicks} clicks` : 'No traffic'}
        </span>
      </div>
    </div>
  )
}

export default function GraphView({ clusters, postDetails, selected, onSelect }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(clusters, postDetails),
    [clusters, postDetails]
  )

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const onNodeClick = useCallback((_, node) => {
    if (node.data?.slug) onSelect(node.data.slug)
    else if (node.data?.gap?.id) onSelect(node.data.gap.id)
  }, [onSelect])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes.map(n => ({
          ...n,
          label: <CustomNodeContent data={n.data} />,
          selected: selected === n.data?.slug || selected === n.data?.gap?.id,
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={2}
        attributionPosition="bottom-right"
      >
        <Background variant={BackgroundVariant.Dots} color="#1e2333" gap={24} size={1} />
        <Controls />
        <MiniMap
          nodeColor={n => {
            if (n.data?.isGap) return '#c9842a'
            if (n.data?.isPillar) return n.data?.clusterColor || '#4f8ef7'
            return '#2e3549'
          }}
          maskColor="rgba(10,13,20,0.7)"
        />
      </ReactFlow>
      <div style={{
        position: 'absolute', bottom: 16, left: 16,
        display: 'flex', gap: 12,
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '8px 12px',
        fontSize: 11, color: 'var(--text2)',
        pointerEvents: 'none',
      }}>
        {[
          { color: '#34c77b', label: '100+ clicks' },
          { color: '#4f8ef7', label: '10–99 clicks' },
          { color: '#c9c142', label: '1–9 clicks' },
          { color: '#4e5568', label: 'No traffic' },
          { color: 'var(--gap-color)', label: 'Gap suggested', dashed: true },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: l.dashed ? 14 : 8, height: l.dashed ? 0 : 8,
              borderRadius: l.dashed ? 0 : '50%',
              background: l.dashed ? 'none' : l.color,
              border: l.dashed ? `1.5px dashed ${l.color}` : 'none',
            }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}
