import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).end()

  const { slug, itemId, done } = req.body

  const { data: row, error: fetchError } = await supabase
    .from('content_map')
    .select('data')
    .eq('id', 1)
    .single()

  if (fetchError) return res.status(500).json({ error: fetchError.message })

  const map = row.data
  const post = map.post_details?.[slug]
  if (!post) return res.status(404).json({ error: 'Post not found' })

  const item = (post.optimization?.items || []).find(i => i.id === itemId)
  if (!item) return res.status(404).json({ error: 'Item not found' })

  item.done = done

  const { error: updateError } = await supabase
    .from('content_map')
    .update({ data: map, updated_at: new Date().toISOString() })
    .eq('id', 1)

  if (updateError) return res.status(500).json({ error: updateError.message })

  res.status(200).json({ ok: true })
}
