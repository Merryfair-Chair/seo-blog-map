import { useState, useEffect } from 'react'
import Header from './components/Header'
import GraphView from './components/GraphView'
import ListView from './components/ListView'
import GapsView from './components/GapsView'
import DetailPanel from './components/DetailPanel'

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('graph') // 'graph' | 'list' | 'gaps'
  const [selected, setSelected] = useState(null) // selected post slug or gap id

  useEffect(() => {
    fetch('/merryfair_content_map.json')
      .then(r => {
        if (!r.ok) throw new Error('Could not load data file')
        return r.json()
      })
      .then(json => { setData(json); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header
        view={view}
        setView={setView}
        meta={data.meta}
        clusters={data.clusters}
        postDetails={data.post_details}
      />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {view === 'graph' && (
            <GraphView
              clusters={data.clusters}
              postDetails={data.post_details}
              selected={selected}
              onSelect={setSelected}
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
        </div>
        {(selectedPost || selectedGap) && (
          <DetailPanel
            post={selectedPost}
            gap={selectedGap}
            slug={selected}
            postDetails={data.post_details}
            clusters={data.clusters}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  )
}
