import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import GraphView from './components/GraphView'
import ListView from './components/ListView'
import GapsView from './components/GapsView'
import TriageView from './components/TriageView'
import OptimizeView from './components/OptimizeView'
import PipelineView from './components/PipelineView'
import LinkQueueView from './components/LinkQueueView'
import AddIdeaModal from './components/AddIdeaModal'
import DetailPanel from './components/DetailPanel'

const REFRESH_INTERVAL = 5 * 60 * 1000

// ── Toast system ──────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.type === 'error' ? '✕' : t.type === 'info' ? 'ℹ' : '✓'}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button className="toast-dismiss" onClick={() => onDismiss(t.id)}>×</button>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetched, setLastFetched] = useState(null)
  const [view, setView] = useState('triage')
  const [selected, setSelected] = useState(null)
  const [dataVersion, setDataVersion] = useState(0)
  const [showAddIdea, setShowAddIdea] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const fetchData = useCallback((silent = false) => {
    if (!silent) setLoading(true)
    fetch('/api/data?t=' + Date.now())
      .then(r => {
        if (!r.ok) throw new Error('Could not load data file')
        return r.json()
      })
      .then(json => {
        setData(prev => {
          if (!prev || !silent) return json
          const STATUS_RANK = { pending: 0, done: 1, verified: 2 }
          const prevById = Object.fromEntries((prev.link_queue || []).map(i => [i.id, i]))
          return {
            ...json,
            link_queue: (json.link_queue || []).map(item => {
              const prevItem = prevById[item.id]
              if (!prevItem) return item
              const freshRank = STATUS_RANK[item.status] ?? 0
              const localRank = STATUS_RANK[prevItem.status] ?? 0
              return localRank > freshRank ? prevItem : item
            }),
          }
        })
        setLastFetched(new Date())
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const timer = setInterval(() => fetchData(true), REFRESH_INTERVAL)
    return () => clearInterval(timer)
  }, [fetchData])

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') fetchData(true) }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [fetchData])

  // Escape key closes detail panel
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && selected) setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text2)' }}>
      Loading content map…
    </div>
  )

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#e05c5c' }}>
      Error: {error}
    </div>
  )

  const selectedPost = selected && data.post_details[selected] ? data.post_details[selected] : null
  const selectedGap = selected && !selectedPost ? (() => {
    for (const c of data.clusters) {
      const g = c.gaps?.find(g => g.id === selected)
      if (g) return { ...g, clusterName: c.name, clusterColor: c.color }
    }
    return null
  })() : null

  const handleAddIdea = async (ideaData) => {
    const response = await fetch('/api/idea', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ideaData),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(err.error || 'Failed to add idea')
    }
    const { gap: newGap } = await response.json()
    setData(prev => ({
      ...prev,
      clusters: prev.clusters.map(c => {
        if (c.id !== ideaData.clusterId) return c
        return { ...c, gaps: [...(c.gaps || []), newGap] }
      })
    }))
    setDataVersion(v => v + 1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header
        view={view}
        setView={setView}
        meta={data.meta}
        clusters={data.clusters}
        postDetails={data.post_details}
        linkQueue={data.link_queue || []}
        linkHealthIssues={data.link_health_issues || []}
        lastFetched={lastFetched}
        onRefresh={() => fetchData(true)}
        onAddIdea={() => setShowAddIdea(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main content — position:relative so DetailPanel can overlay */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {view === 'graph' && (
          <GraphView
            clusters={data.clusters}
            postDetails={data.post_details}
            selected={selected}
            onSelect={setSelected}
            dataVersion={dataVersion}
          />
        )}
        {view === 'list' && (
          <ListView
            clusters={data.clusters}
            postDetails={data.post_details}
            selected={selected}
            onSelect={setSelected}
            searchQuery={searchQuery}
          />
        )}
        {view === 'gaps' && (
          <GapsView
            clusters={data.clusters}
            postDetails={data.post_details}
            selected={selected}
            onSelect={setSelected}
            onAddIdea={() => setShowAddIdea(true)}
          />
        )}
        {view === 'pipeline' && (
          <PipelineView
            clusters={data.clusters}
            postDetails={data.post_details}
            selected={selected}
            onSelect={setSelected}
            onAddIdea={() => setShowAddIdea(true)}
          />
        )}
        {view === 'triage' && (
          <TriageView
            clusters={data.clusters}
            postDetails={data.post_details}
            selected={selected}
            onSelect={setSelected}
            searchQuery={searchQuery}
          />
        )}
        {view === 'optimize' && (
          <OptimizeView
            clusters={data.clusters}
            postDetails={data.post_details}
            selected={selected}
            onSelect={setSelected}
          />
        )}
        {view === 'links' && (
          <LinkQueueView
            linkQueue={data.link_queue || []}
            linkHealthIssues={data.link_health_issues || []}
            postDetails={data.post_details}
            clusters={data.clusters}
            onQueueUpdate={(updatedItem) => {
              setData(prev => ({
                ...prev,
                link_queue: (prev.link_queue || []).map(i =>
                  i.id === updatedItem.id ? updatedItem : i
                ),
              }))
              setDataVersion(v => v + 1)
            }}
            onHealthUpdate={(updatedItem) => {
              setData(prev => ({
                ...prev,
                link_health_issues: (prev.link_health_issues || []).map(i =>
                  i.id === updatedItem.id ? updatedItem : i
                ),
              }))
              setDataVersion(v => v + 1)
            }}
          />
        )}

        {/* Detail panel overlays content — no layout reflow */}
        {(selectedPost || selectedGap) && (
          <DetailPanel
            post={selectedPost}
            gap={selectedGap}
            slug={selected}
            postDetails={data.post_details}
            clusters={data.clusters}
            onClose={() => setSelected(null)}
            onToast={addToast}
            onGapStatusChange={(gapId, status) => {
              setData(prev => ({
                ...prev,
                clusters: prev.clusters.map(c => ({
                  ...c,
                  gaps: (c.gaps || []).map(g => g.id === gapId ? { ...g, status } : g)
                }))
              }))
              setDataVersion(v => v + 1)
            }}
            onOptimizationToggle={(slug, itemId, done) => {
              setData(prev => ({
                ...prev,
                post_details: {
                  ...prev.post_details,
                  [slug]: {
                    ...prev.post_details[slug],
                    optimization: {
                      ...prev.post_details[slug].optimization,
                      items: prev.post_details[slug].optimization.items.map(i =>
                        i.id === itemId ? { ...i, done } : i
                      )
                    }
                  }
                }
              }))
            }}
          />
        )}
      </div>

      {showAddIdea && (
        <AddIdeaModal
          clusters={data.clusters}
          postDetails={data.post_details}
          onClose={() => setShowAddIdea(false)}
          onAdd={handleAddIdea}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
