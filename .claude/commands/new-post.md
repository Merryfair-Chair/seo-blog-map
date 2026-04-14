When a new blog post is published, do ALL of the following automatically without asking:

0. Run `python3 pull_from_supabase.py` FIRST — before touching anything — to merge any gap status
   changes or new ideas added via the Vercel visual map into the local JSON. This prevents
   overwriting UI decisions.

1. Run `python3 crawl_and_summarize.py` to re-crawl all posts and update internal link data.
   **Note:** This re-crawls all posts to capture new internal link relationships. This is necessary but slow as the blog grows. Flag if crawl fails for any URL (rate limit, 404, etc.) and proceed with cached data for that URL.

2. Read `merryfair_content_map.json`. Find the new post in post_details (it will be the one just added by the crawl). Extract its `extracted_text`, `cluster`, `internal_links_out`, and `internal_links_in`.

3. Generate a `content_summary` for the new post using its `extracted_text`. The summary must include:
   - `main_topic` (one sentence)
   - `subtopics_covered` (list — be specific, not just headings)
   - `angle` (what perspective the post takes)
   - `explicitly_not_covered` (related topics absent or only mentioned in passing — this field is critical for future gap analysis and cannibalization checks)
   - `target_audience` (be specific: who is this written for, what is their situation)
   - `content_type` (guide/comparison/listicle/educational/product-focused/opinion)
   - `merryfair_products_mentioned` (list of chair models)

4. Determine which cluster the new post belongs to based on its content (not its title). The clusters are defined in the "clusters" array in the JSON. Assign it to the correct cluster by adding its slug to that cluster's `posts` array.

5. Initialise performance and status fields for the new post:
   - `hero_tier: null`
   - `triage_status: "none"`
   - `optimization: null`
   These will be populated by `/monthly-update` and `/optimize-post` later.

6. Check internal linking:
   - Does the new post link to its cluster's pillar? If not, flag it.
   - Does the pillar link to the new post? If not, flag it.
   - Are there other posts in the same cluster it should cross-link with? Flag any missing links.
   - Check for broken outbound links: for each slug in `internal_links_out`, confirm the slug exists in `post_details`. If it doesn't, flag it as a broken internal link.

7. Check if this new post fills any existing gap in the cluster's `gaps` array. If it does, update that gap's `status` from `"suggested"` or `"approved"` to `"published"`.

8. Save all changes back to `merryfair_content_map.json`.

8b. Run `bash /Users/merryfair/seo-blog-map/.claude/full_sync.sh` — this copies the JSON to
    visual-map/public/, pushes to Supabase (Vercel app updates immediately), and commits+pushes
    to GitHub. All three destinations sync in one step.

9. Update `project-context.md`:
   - Add the new post to the correct cluster section
   - Update total post count
   - Mark any gap as published if applicable
   - Update the "Immediate next actions" section if relevant

10. Append an entry to the TOP of `session-log.md`:
   - Date
   - Post title and URL processed
   - Cluster assigned
   - Gap filled (if any)
   - Internal linking issues flagged
   - Any broken links found

11. Print a summary report:
   - Post title and assigned cluster
   - Internal links found (in and out)
   - Missing links that should be added
   - Broken links found
   - Whether it filled an existing gap
   - Any new gaps revealed by the content summary (based on `explicitly_not_covered`)

The new post URL will be provided as: $ARGUMENTS
