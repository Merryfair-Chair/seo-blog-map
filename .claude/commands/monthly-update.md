Perform the monthly content intelligence update. Do ALL of the following automatically without asking:

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

6. Analyze the updated data for content gaps:
   - Which clusters have thin coverage (fewer than 4 posts)?
   - Which clusters have declining traffic month over month?
   - Are there keywords from the Ahrefs export where Merryfair ranks position 8-20 (striking distance) that no existing post specifically targets?
   - Are there high-impression, low-click pages in GSC that need title/meta optimization?
   - Based on content summaries, are there subtopics frequently "explicitly_not_covered" that represent genuine gaps?

7. For each new gap suggestion, write it to the appropriate cluster's gaps array with:
   - id (format: gap-XX-N)
   - title (proposed post title)
   - targetKeyword
   - estVolume (from Ahrefs data if available)
   - intent (informational/commercial/transactional)
   - rationale (WHY this is a genuine gap — which keyword, what intent is unmet, what the closest existing post covers and why it doesn't fully address it)
   - status: "suggested"
   - closestExistingPost
   - whyExistingDoesntCover

8. Update the meta section with today's date and data sources used.

9. Save everything back to merryfair_content_map.json.

9a. Copy merryfair_content_map.json to visual-map/public/merryfair_content_map.json so the visual map reflects updated data.

9b. Update project-context.md: refresh performance data highlights, update gap statuses, update last monthly update date.

10. Print a full report:
    - Performance changes: posts with significant traffic gains or losses
    - New gaps suggested (with full rationale)
    - Posts in striking distance (position 8-20) that could be optimized
    - Internal linking issues found
    - Cluster health summary (posts per cluster, total traffic per cluster)
