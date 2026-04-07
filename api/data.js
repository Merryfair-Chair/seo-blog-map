import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const { data, error } = await supabase
    .from('content_map')
    .select('data')
    .eq('id', 1)
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json(data.data)
}
