Perform the monthly content intelligence update. Do ALL of the following automatically without asking:

0. Run `python pull_from_supabase.py` first to sync any gap status changes and optimization checklist states made via the Vercel visual map back into the local JSON. This prevents overwriting UI decisions when we push to Supabase at the end.

0b. Read `seo-strategy-context.md` to inform gap analysis. This file contains:
   - The three blog purposes (traffic / authority / hub) and what qualifies as each
   - Hero page list with impression thresholds — use this to set heroTarget on relevant gaps
   - Cannibalization rules — check every new gap suggestion against existing posts and existing gaps
   - Cluster priorities — which clusters need authority coverage even at zero volume
   - Publishing target and priority order

1. Find the most recent monthly data folder. Look inside "Monthly Data/" for subfolders named "[Month] [Year]" (e.g., "April 2026"). Pick the one with the most recent date. Then look inside that subfolder for CSV exports matching these patterns:
   - Pages.csv or *pages*.csv (GSC pages data)
   - Queries.csv or *queries*.csv (GSC queries data)
   - *top-pages*.csv (Ahrefs top pages)
   - *organic-keywords*.csv (Ahrefs organic keywords)
   - *Pages_and_screens*.csv (GA4 data)

2. Read merryfair_content_map.json.

3. For each CSV found, parse it and update the corresponding performance fields in post_details:
   - GSC: update gsc_clicks, gsc_impressions, gsc_avg_position per URL
   - Ahrefs: update ahrefs_traffic, ahrefs_keywords, ahrefs_referring_domains, top_keyword, top_kw_volume, top_kw_position per URL
   - GA4: update ga4_organic_views, ga4_direct_views, ga4_referral_views, ga4_social_views per URL

4. Run `python crawl_and_summarize.py` to refresh internal link data and catch any new posts that were published since last crawl.

5. Generate content summaries for any post where content_summary is null.

6. Analyze the updated data for content gaps across all three purpose categories:

   **Traffic gaps** (target: keywords with measurable search demand):
   - Keywords from Ahrefs where Merryfair ranks position 8–20 (striking distance) that no existing post specifically targets
   - High-impression, low-CTR pages in GSC that indicate ranking but not clicking — suggest title/meta optimization AND check if a new supporting post would help
   - Clusters with thin coverage (fewer than 4 posts) relative to search demand in that topic area

   **Authority gaps** (target: topical completeness, EEAT, even at zero volume):
   - Which clusters have declining traffic month over month? The gap may be topical incompleteness
   - Subtopics frequently listed as "explicitly_not_covered" in content_summary fields
   - Topical areas from seo-strategy-context.md "Cluster Priorities" section that must be covered for authority
   - Zero/low volume topics that complete a cluster's coverage and support EEAT (e.g., certifications, standards, maintenance, lifespan)

   **Hub gaps** (target: comprehensive reference content that earns backlinks):
   - Topics where Merryfair could be the definitive Malaysian resource — calculators, comparison guides, lookup tables
   - Topics that journalists, HR teams, or workplace wellness bloggers would link to as a reference
   - Topics where existing content is thin everywhere online (low competition + high strategic value)

   **Cannibalization check**: For each new gap suggestion, check whether targetKeyword overlaps with:
   - Any existing post's top_keyword field
   - Any existing post's title (semantic overlap check)
   - Any existing gap's targetKeyword
   If overlap found, add `cannibalizes: "[conflicting-slug-or-gap-id]"` field to the gap entry and note in rationale. This is a flag, not a blocker.

7. For each new gap suggestion, write it to the appropriate cluster's gaps array with:
   - id (format: gap-XX-N)
   - title (proposed post title)
   - targetKeyword
   - estVolume (from Ahrefs data if available)
   - intent (informational/commercial/transactional)
   - purpose: "traffic" | "authority" | "hub" — mandatory, based on the analysis above
   - rationale (WHY this is a genuine gap — which keyword, what intent is unmet, what the closest existing post covers and why it doesn't fully address it; for authority/hub: explain strategic rationale even if zero volume)
   - status: "suggested"
   - source: "monthly-update"
   - closestExistingPost
   - whyExistingDoesntCover
   - heroTarget: "[hero-slug]" — if this post would support a crown/hero page via internal linking (optional, use slugs from seo-strategy-context.md hero list)
   - cannibalizes: "[slug-or-gap-id]" — only if keyword overlap detected (optional)

8. Update the meta section with today's date and data sources used.

9. Save everything back to merryfair_content_map.json.

9a. Copy merryfair_content_map.json to visual-map/public/merryfair_content_map.json so the visual map reflects updated data.

9b. Run hero detection: For each post in post_details, set `hero_tier` based on current gsc_impressions:
   - gsc_impressions > 10000 → hero_tier: "crown"
   - gsc_impressions > 2000  → hero_tier: "hero"
   - otherwise               → hero_tier: null
   This field is used by the visual map to show hero badges and by AddIdeaModal to populate the hero target dropdown.

9c. Run `python3 push_to_supabase.py` to sync the updated JSON to Supabase so the live visual map reflects the new data. If the command fails due to a missing SUPABASE_SERVICE_KEY, alert the user and tell them to run: `SUPABASE_SERVICE_KEY=your_key python push_to_supabase.py`

9d. Update project-context.md: refresh performance data highlights, update gap statuses, update last monthly update date.

10. Print a full report:
    - Performance changes: posts with significant traffic gains or losses
    - New gaps suggested (with full rationale)
    - Posts in striking distance (position 8-20) that could be optimized
    - Internal linking issues found
    - Cluster health summary (posts per cluster, total traffic per cluster)
