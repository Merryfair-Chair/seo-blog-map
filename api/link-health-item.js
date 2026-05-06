import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).end()

  const { id, status } = req.body

  if (!id || !['open', 'dismissed'].includes(status)) {
    return res.status(400).json({ error: 'id and status (open|dismissed) are required' })
  }

  const { data: row, error: fetchError } = await supabase
    .from('content_map')
    .select('data')
    .eq('id', 1)
    .single()

  if (fetchError) return res.status(500).json({ error: fetchError.message })

  const map = row.data

  if (!Array.isArray(map.link_health_issues)) {
    return res.status(404).json({ error: 'link_health_issues not found in content map' })
  }

  const item = map.link_health_issues.find(i => i.id === id)
  if (!item) return res.status(404).json({ error: 'Health issue not found' })

  item.status = status
  item.dismissed_date = status === 'dismissed' ? new Date().toISOString().slice(0, 10) : null

  const { error: updateError } = await supabase
    .from('content_map')
    .update({ data: map, updated_at: new Date().toISOString() })
    .eq('id', 1)

  if (updateError) return res.status(500).json({ error: updateError.message })

  res.status(200).json({ ok: true, item })
}
