import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).end()

  const { gapId, status } = req.body

  const { data: row, error: fetchError } = await supabase
    .from('content_map')
    .select('data')
    .eq('id', 1)
    .single()

  if (fetchError) return res.status(500).json({ error: fetchError.message })

  const map = row.data
  let found = false
  for (const c of map.clusters) {
    for (const g of (c.gaps || [])) {
      if (g.id === gapId) { g.status = status; found = true; break }
    }
    if (found) break
  }

  if (!found) return res.status(404).json({ error: 'Gap not found' })

  const { error: updateError } = await supabase
    .from('content_map')
    .update({ data: map, updated_at: new Date().toISOString() })
    .eq('id', 1)

  if (updateError) return res.status(500).json({ error: updateError.message })

  res.status(200).json({ ok: true })
}
