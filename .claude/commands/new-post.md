When a new blog post is published, do ALL of the following automatically without asking:

1. Run `python crawl_and_summarize.py` to re-crawl all posts and update internal link data.

2. Read merryfair_content_map.json. Find the new post in post_details (it will be the one just added by the crawl).

3. Generate a content_summary for the new post using its extracted_text. The summary must include:
   - main_topic (one sentence)
   - subtopics_covered (list)
   - angle (what perspective the post takes)
   - explicitly_not_covered (related topics absent or only mentioned)
   - target_audience
   - content_type (guide/comparison/listicle/educational/product-focused/opinion)
   - merryfair_products_mentioned (list of chair models)

4. Determine which cluster the new post belongs to based on its content. The clusters are defined in the "clusters" array in the JSON. Assign it to the correct cluster by adding its slug to that cluster's posts array.

5. Check internal linking:
   - Does the new post link to its cluster's pillar? If not, flag it.
   - Does the pillar link to the new post? If not, flag it.
   - Are there other posts in the same cluster it should cross-link with? Flag any missing links.

6. Check if this new post fills any existing gap in the cluster's "gaps" array. If it does, update that gap's status from "suggested" to "published".

7. Save all changes back to merryfair_content_map.json.

7a. Copy merryfair_content_map.json to visual-map/public/merryfair_content_map.json so the visual map reflects the update.

7b. Run `python push_to_supabase.py` to sync the updated local JSON to Supabase, so the Vercel dashboard reflects Claude's enriched data (summaries, cluster assignment, gap status) instead of being overwritten by the next GitHub Actions crawl.

8. Update project-context.md to reflect the new post (add it to the correct cluster section, update total post count, mark any gap as published if applicable).

9. Print a summary report showing:
   - Post title and assigned cluster
   - Internal links found (in and out)
   - Missing links that should be added
   - Whether it filled an existing gap
   - Any new gaps revealed by the content summary

The new post URL will be provided as: $ARGUMENTS
