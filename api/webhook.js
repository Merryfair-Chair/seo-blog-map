/**
 * POST /api/webhook
 * Called by WordPress (WP Webhooks plugin) when a post is published.
 * Triggers the GitHub Actions crawl workflow.
 *
 * Required env var: GITHUB_PAT (personal access token with repo scope)
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const pat = process.env.GITHUB_PAT
  if (!pat) return res.status(500).json({ error: 'GITHUB_PAT not configured' })

  const response = await fetch(
    'https://api.github.com/repos/Merryfair-Chair/seo-blog-map/dispatches',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_type: 'wordpress-publish' }),
    }
  )

  if (!response.ok) {
    return res.status(500).json({ error: 'Failed to trigger crawl workflow' })
  }

  res.status(200).json({ ok: true, message: 'Crawl triggered' })
}
