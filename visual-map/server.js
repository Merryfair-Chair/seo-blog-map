/**
 * Merryfair Visual Map — local server for daily use.
 * Serves the built app + handles gap status writes back to JSON.
 *
 * Usage: node server.js   (or double-click start.bat)
 */

import http       from 'http'
import fs         from 'fs'
import path       from 'path'
import { spawn }  from 'child_process'
import { fileURLToPath } from 'url'

const __dirname   = path.dirname(fileURLToPath(import.meta.url))
const DIST        = path.join(__dirname, 'dist')
const JSON_PUBLIC = path.join(__dirname, 'public', 'merryfair_content_map.json')
const JSON_ROOT   = path.join(__dirname, '..', 'merryfair_content_map.json')
const SEO_ROOT    = path.join(__dirname, '..')
const PORT        = 3737

// After any local write: push to Supabase + commit + push to GitHub
// so the Vercel app and other machines see the change immediately.
function syncChanges(label) {
  const py = spawn('python3', ['push_to_supabase.py'], { cwd: SEO_ROOT })
  py.on('close', code => {
    if (code !== 0) { console.log(`[sync] Supabase push failed (${label})`); return }
    console.log(`[sync] Supabase updated (${label})`)
    const add = spawn('git', ['add', 'merryfair_content_map.json', 'visual-map/public/merryfair_content_map.json'], { cwd: SEO_ROOT })
    add.on('close', () => {
      const commit = spawn('git', ['commit', '-m', `chore: auto-sync content map — ${label}`], { cwd: SEO_ROOT })
      commit.on('close', code => {
        if (code !== 0) return // nothing staged, skip push
        const push = spawn('git', ['push', 'origin', 'main'], { cwd: SEO_ROOT })
        push.on('close', () => console.log(`[sync] Pushed to GitHub (${label})`))
      })
    })
  })
}

let crawlRunning = false
function runCrawl(label) {
  if (crawlRunning) { console.log(`[webhook] crawl already running, skipping ${label}`); return }
  crawlRunning = true
  console.log(`[webhook] Starting crawl triggered by: ${label}`)
  const py = spawn('python', ['crawl_and_summarize.py'], { cwd: SEO_ROOT, stdio: 'inherit' })
  py.on('close', code => {
    crawlRunning = false
    if (code === 0) {
      fs.copyFileSync(JSON_ROOT, JSON_PUBLIC)
      console.log('[webhook] Crawl complete. JSON updated.')
    } else {
      console.log(`[webhook] Crawl exited with code ${code}`)
    }
  })
}

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
}

http.createServer((req, res) => {
  // ── POST /api/webhook  (WordPress publish hook) ───────────────────────────
  // WordPress sends this when a post is published via WP Webhooks plugin
  if (req.method === 'POST' && req.url === '/api/webhook') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', () => {
      try {
        const payload = JSON.parse(body)
        const title = payload?.post_title || payload?.title || 'unknown post'
        runCrawl(title)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true, message: 'crawl started' }))
      } catch {
        res.writeHead(400); res.end()
      }
    })
    return
  }

  // ── PATCH /api/gap  ───────────────────────────────────────────────────────
  if (req.method === 'PATCH' && req.url === '/api/gap') {
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
        if (!found) {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ error: 'Gap not found' }))
        }
        const out = JSON.stringify(data, null, 2)
        fs.writeFileSync(JSON_PUBLIC, out, 'utf8')
        if (fs.existsSync(JSON_ROOT)) fs.writeFileSync(JSON_ROOT, out, 'utf8')
        syncChanges(`gap ${gapId} → ${status}`)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true }))
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: String(e) }))
      }
    })
    return
  }

  // ── POST /api/idea  ──────────────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/api/idea') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', () => {
      try {
        const { title, targetKeyword, clusterId, purpose, estVolume, source, heroTarget, notes } = JSON.parse(body)
        if (!title || !targetKeyword || !clusterId) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ error: 'title, targetKeyword, and clusterId are required' }))
        }
        const data = JSON.parse(fs.readFileSync(JSON_PUBLIC, 'utf8'))
        const cluster = data.clusters.find(c => c.id === clusterId)
        if (!cluster) { res.writeHead(404); return res.end(JSON.stringify({ error: 'cluster not found' })) }
        const prefix = clusterId.toUpperCase().replace(/-/g, '').slice(0, 4)
        const gapId = `gap-${prefix}-${Date.now()}`
        const newGap = {
          id: gapId, title, targetKeyword,
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
        syncChanges(`new idea: ${title}`)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true, gap: newGap }))
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: String(e) }))
      }
    })
    return
  }

  // ── PATCH /api/optimization-item  ────────────────────────────────────────
  if (req.method === 'PATCH' && req.url === '/api/optimization-item') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', () => {
      try {
        const { slug, itemId, done } = JSON.parse(body)
        const data = JSON.parse(fs.readFileSync(JSON_PUBLIC, 'utf8'))
        const post = data.post_details?.[slug]
        if (!post) { res.writeHead(404); return res.end(JSON.stringify({ error: 'post not found' })) }
        const item = (post.optimization?.items || []).find(i => i.id === itemId)
        if (!item) { res.writeHead(404); return res.end(JSON.stringify({ error: 'item not found' })) }
        item.done = done
        const out = JSON.stringify(data, null, 2)
        fs.writeFileSync(JSON_PUBLIC, out, 'utf8')
        if (fs.existsSync(JSON_ROOT)) fs.writeFileSync(JSON_ROOT, out, 'utf8')
        syncChanges(`optimization ${slug}/${itemId}`)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true }))
      } catch (e) {
        res.writeHead(500); res.end(JSON.stringify({ error: String(e) }))
      }
    })
    return
  }

  // ── Static file serving ───────────────────────────────────────────────────
  let urlPath = req.url.split('?')[0]
  if (urlPath === '/' || !path.extname(urlPath)) urlPath = '/index.html'

  const filePath = path.join(DIST, urlPath)
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403); return res.end()
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback
      fs.readFile(path.join(DIST, 'index.html'), (e2, d2) => {
        if (e2) { res.writeHead(404); return res.end('Not found') }
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(d2)
      })
      return
    }
    const ext = path.extname(filePath)
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(data)
  })
}).listen(PORT, () => {
  console.log(`\n  Merryfair Visual Map running at http://localhost:${PORT}\n`)
})
