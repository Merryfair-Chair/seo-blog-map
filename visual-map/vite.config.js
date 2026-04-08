import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const JSON_PUBLIC = path.resolve('./public/merryfair_content_map.json')
const JSON_ROOT   = path.resolve('../merryfair_content_map.json')

function apiPlugin() {
  return {
    name: 'gap-api',
    configureServer(server) {
      server.middlewares.use('/api/data', (req, res) => {
        if (req.method !== 'GET') { res.statusCode = 405; return res.end() }
        try {
          const src = fs.existsSync(JSON_PUBLIC) ? JSON_PUBLIC : JSON_ROOT
          const data = fs.readFileSync(src, 'utf8')
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(data)
        } catch (e) {
          res.statusCode = 500; res.end(JSON.stringify({ error: String(e) }))
        }
      })
      server.middlewares.use('/api/gap', (req, res) => {
        if (req.method !== 'PATCH') { res.statusCode = 405; return res.end(); }
        let body = ''
        req.on('data', c => body += c)
        req.on('end', () => {
          try {
            const { gapId, status } = JSON.parse(body)
            const data = JSON.parse(fs.readFileSync(JSON_PUBLIC, 'utf8'))
            let found = false
            for (const c of data.clusters) {
              for (const g of (c.gaps || [])) {
                if (g.id === gapId) { g.status = status; found = true; break }
              }
              if (found) break
            }
            if (!found) { res.statusCode = 404; return res.end(JSON.stringify({ error: 'not found' })) }
            const out = JSON.stringify(data, null, 2)
            fs.writeFileSync(JSON_PUBLIC, out, 'utf8')
            if (fs.existsSync(JSON_ROOT)) fs.writeFileSync(JSON_ROOT, out, 'utf8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (e) {
            res.statusCode = 500; res.end(JSON.stringify({ error: String(e) }))
          }
        })
      })
      // ── POST /api/idea  (add new idea/gap) ──────────────────────────────────
      server.middlewares.use('/api/idea', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; return res.end() }
        let body = ''
        req.on('data', c => body += c)
        req.on('end', () => {
          try {
            const { title, targetKeyword, clusterId, purpose, estVolume, source, heroTarget, notes } = JSON.parse(body)
            if (!title || !targetKeyword || !clusterId) {
              res.statusCode = 400
              return res.end(JSON.stringify({ error: 'title, targetKeyword, and clusterId are required' }))
            }
            const data = JSON.parse(fs.readFileSync(JSON_PUBLIC, 'utf8'))
            const cluster = data.clusters.find(c => c.id === clusterId)
            if (!cluster) { res.statusCode = 404; return res.end(JSON.stringify({ error: 'cluster not found' })) }
            const prefix = clusterId.toUpperCase().replace(/-/g, '').slice(0, 4)
            const gapId = `gap-${prefix}-${Date.now()}`
            const newGap = {
              id: gapId,
              title,
              targetKeyword,
              estVolume: parseInt(estVolume) || 0,
              intent: 'informational',
              purpose: purpose || 'authority',
              status: 'suggested',
              source: source || 'spontaneous',
              rationale: notes || '',
              closestExistingPost: '',
              whyExistingDoesntCover: '',
            }
            if (heroTarget) newGap.heroTarget = heroTarget
            if (notes) newGap.notes = notes
            if (!cluster.gaps) cluster.gaps = []
            cluster.gaps.push(newGap)
            const out = JSON.stringify(data, null, 2)
            fs.writeFileSync(JSON_PUBLIC, out, 'utf8')
            if (fs.existsSync(JSON_ROOT)) fs.writeFileSync(JSON_ROOT, out, 'utf8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, gap: newGap }))
          } catch (e) {
            res.statusCode = 500; res.end(JSON.stringify({ error: String(e) }))
          }
        })
      })
      // ── PATCH /api/optimization-item  (tick/untick checklist item) ──────────
      server.middlewares.use('/api/optimization-item', (req, res) => {
        if (req.method !== 'PATCH') { res.statusCode = 405; return res.end() }
        let body = ''
        req.on('data', c => body += c)
        req.on('end', () => {
          try {
            const { slug, itemId, done } = JSON.parse(body)
            const data = JSON.parse(fs.readFileSync(JSON_PUBLIC, 'utf8'))
            const post = data.post_details?.[slug]
            if (!post) { res.statusCode = 404; return res.end(JSON.stringify({ error: 'post not found' })) }
            const item = (post.optimization?.items || []).find(i => i.id === itemId)
            if (!item) { res.statusCode = 404; return res.end(JSON.stringify({ error: 'item not found' })) }
            item.done = done
            const out = JSON.stringify(data, null, 2)
            fs.writeFileSync(JSON_PUBLIC, out, 'utf8')
            if (fs.existsSync(JSON_ROOT)) fs.writeFileSync(JSON_ROOT, out, 'utf8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (e) {
            res.statusCode = 500; res.end(JSON.stringify({ error: String(e) }))
          }
        })
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
})
