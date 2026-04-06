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
