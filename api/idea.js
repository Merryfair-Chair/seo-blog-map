import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// POST /api/idea — adds a new gap/idea to the appropriate cluster
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { title, targetKeyword, clusterId, purpose, estVolume, source, heroTarget, notes } = req.body

  // Validate required fields
  if (!title || !targetKeyword || !clusterId) {
    return res.status(400).json({ error: 'title, targetKeyword, and clusterId are required' })
  }

  // Fetch current data from Supabase
  const { data: row, error: fetchError } = await supabase
    .from('content_map')
    .select('data')
    .eq('id', 1)
    .single()

  if (fetchError) return res.status(500).json({ error: fetchError.message })

  const map = row.data

  // Find the target cluster
  const cluster = map.clusters.find(c => c.id === clusterId)
  if (!cluster) return res.status(404).json({ error: `Cluster '${clusterId}' not found` })

  // Generate a unique gap ID: gap-[CLUSTER_PREFIX]-[timestamp]
  const prefix = clusterId.toUpperCase().replace(/-/g, '').slice(0, 4)
  const gapId = `gap-${prefix}-${Date.now()}`

  // Build the new gap entry
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

  // Initialize gaps array if needed
  if (!cluster.gaps) cluster.gaps = []
  cluster.gaps.push(newGap)

  // Save back to Supabase
  const { error: updateError } = await supabase
    .from('content_map')
    .update({ data: map, updated_at: new Date().toISOString() })
    .eq('id', 1)

  if (updateError) return res.status(500).json({ error: updateError.message })

  res.status(200).json({ ok: true, gap: newGap })
}
