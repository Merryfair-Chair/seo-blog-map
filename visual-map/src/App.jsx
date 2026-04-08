import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import GraphView from './components/GraphView'
import ListView from './components/ListView'
import GapsView from './components/GapsView'
import TriageView from './components/TriageView'
import OptimizeView from './components/OptimizeView'
import DetailPanel from './components/DetailPanel'

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetched, setLastFetched] = useState(null)
  const [view, setView] = useState('graph')
  const [selected, setSelected] = useState(null)
  const [dataVersion, setDataVersion] = useState(0)

  const fetchData = useCallback((silent = false) => {
    if (!silent) setLoading(true)
    fetch('/api/data?t=' + Date.now())
      .then(r => {
        if (!r.ok) throw new Error('Could not load data file')
        return r.json()
      })
      .then(json => {
        setData(json)
        setLastFetched(new Date())
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  // Initial load
  useEffect(() => { fetchData() }, [fetchData])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const timer = setInterval(() => fetchData(true), REFRESH_INTERVAL)
    return () => clearInterval(timer)
  }, [fetchData])

  // Refresh when tab becomes visible again
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') fetchData(true) }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [fetchData])

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
  const selectedGap  = selected && !selectedPost ? (() => {
    for (const c of data.clusters) {
      const g = c.gaps?.find(g => g.id === selected)
      if (g) return { ...g, clusterName: c.name, clusterColor: c.color }
    }
    return null
  })() : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header
        view={view}
        setView={setView}
        meta={data.meta}
        clusters={data.clusters}
        postDetails={data.post_details}
        lastFetched={lastFetched}
        onRefresh={() => fetchData(true)}
      />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
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
            />
          )}
          {view === 'gaps' && (
            <GapsView
              clusters={data.clusters}
              selected={selected}
              onSelect={setSelected}
            />
          )}
          {view === 'triage' && (
            <TriageView
              clusters={data.clusters}
              postDetails={data.post_details}
              selected={selected}
              onSelect={setSelected}
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
        </div>
        {(selectedPost || selectedGap) && (
          <DetailPanel
            post={selectedPost}
            gap={selectedGap}
            slug={selected}
            postDetails={data.post_details}
            clusters={data.clusters}
            onClose={() => setSelected(null)}
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
    </div>
  )
}
