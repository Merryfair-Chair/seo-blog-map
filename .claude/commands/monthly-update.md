Perform the monthly content intelligence update. Do ALL of the following automatically without asking:

0. Run `python pull_from_supabase.py` first to sync any gap status changes and optimization checklist states made via the Vercel visual map back into the local JSON. This prevents overwriting UI decisions when we push to Supabase at the end.

0b. Read `seo-strategy-context.md` in full. This file contains:
   - The three blog purposes (traffic / authority / hub) and what qualifies as each
   - Hero page list with impression thresholds
   - Cannibalization rules
   - Cluster priorities — which clusters need authority coverage even at zero volume
   - Publishing target and priority order

1. **Find the most recent monthly data folder.**
   Look inside `Monthly Data/` for subfolders named `[Month] [Year]` (e.g., `April 2026`). Pick the one with the most recent date. Inside that subfolder, look for CSV exports matching these patterns:
   - GSC pages: `Pages.csv` or `*pages*.csv` or `*Pages*.csv`
   - GSC queries: `Queries.csv` or `*queries*.csv` or `*Queries*.csv`
   - Ahrefs top pages: `*top-pages*.csv` or `*top_pages*.csv`
   - Ahrefs organic keywords: `*organic-keywords*.csv` or `*organic_keywords*.csv`
   - GA4: `*Pages_and_screens*.csv` or `*pages_and_screens*.csv`

   **If no file matches a pattern:** List all files in the folder and identify the correct file by content (open and inspect headers) rather than failing silently. Never proceed with missing data sources without flagging it.

2. Read `merryfair_content_map.json`. Extract only the fields needed for this update:
   - Per post: `gsc_clicks`, `gsc_impressions`, `gsc_avg_position`, `ahrefs_traffic`, `ahrefs_keywords`, `ahrefs_referring_domains`, `top_keyword`, `top_kw_volume`, `top_kw_position`, `ga4_organic_views`, `ga4_direct_views`, `hero_tier`, `cluster`, `content_summary`
   - All clusters with their `gaps` arrays
   - Do NOT load `extracted_text` — it is not needed and will consume unnecessary context

3. **Parse each CSV and update post performance fields with URL normalisation.**
   Before matching CSV rows to post_details entries, normalise all URLs to a consistent format:
   - Strip protocol (`https://`, `http://`)
   - Strip `www.`
   - Ensure trailing slash is present
   - Lowercase everything
   Apply this normalisation to both the CSV URLs and the `post_details` URL field before matching. Log any CSV rows that don't match a known post URL — these may be new posts or URL changes that need investigation.

   Update per matched post:
   - GSC: `gsc_clicks`, `gsc_impressions`, `gsc_avg_position`
   - Ahrefs: `ahrefs_traffic`, `ahrefs_keywords`, `ahrefs_referring_domains`, `top_keyword`, `top_kw_volume`, `top_kw_position`
   - GA4: `ga4_organic_views`, `ga4_direct_views`, `ga4_referral_views`, `ga4_social_views`

4. Run `python crawl_and_summarize.py` to refresh internal link data and catch any new posts published since last crawl.

5. Generate content summaries for any post where `content_summary` is null.

6. **Identify significant performance changes.**
   Flag as a significant drop (requires investigation): any post where GSC clicks dropped by more than 40% month-over-month, OR dropped by more than 20 clicks in absolute terms. Flag as a significant gain: any post where clicks increased by more than 50% month-over-month.
   For flagged drops: note whether the `top_kw_position` also dropped (ranking issue) or held steady (CTR issue — title/meta problem or AI Overview likely).

7. **Competitor gap analysis.**
   Use the Ahrefs MCP `site-explorer-organic-competitors` tool for `merryfair.com` to identify the top 3–5 organic competitors. Then use `site-explorer-organic-keywords` on each competitor to find keywords they rank for (positions 1–10, volume >50/mo MY) that no Merryfair post currently targets. Flag the top opportunities as competitor gap candidates for the gap analysis in step 8.

8. **Analyse the updated data for content gaps across all three purpose categories.**

   **Traffic gaps** (target: keywords with measurable search demand):
   - Posts ranking positions 8–20 in Ahrefs for a keyword with >50/mo MY volume — could a new supporting post OR a title/meta optimisation fix this? Distinguish clearly between the two.
   - High-impression, low-CTR pages in GSC (>1,000 impressions, CTR <1%) — diagnose first: is this a title/meta issue, an AI Overview on the SERP, or a genuine content gap?
   - Competitor gap candidates identified in step 7
   - Clusters with fewer than 4 posts relative to search demand in that topic area

   **Authority gaps** (target: topical completeness, EEAT, even at zero volume):
   - Subtopics appearing frequently in `content_summary.explicitly_not_covered` across multiple posts — these are topics the content library keeps intentionally skirting
   - Topics listed as thin in `seo-strategy-context.md` "Cluster Priorities" that still have no post
   - Zero/low volume topics that complete a cluster's coverage

   **Hub gaps** (target: reference content that earns backlinks):
   - Topics where Merryfair could be the definitive Malaysian resource (calculators, comparison tables, standards guides)
   - Topics journalists, HR teams, or workplace wellness bloggers would cite as a reference

   **Cannibalization check for each new gap suggestion:**
   1. Check against all existing post `content_summary.subtopics_covered` — not just titles
   2. Check against all existing gaps' `targetKeyword`
   3. Check each new gap suggestion against every OTHER new gap suggestion in this same run — two gaps suggested in the same update must not target the same intent
   If overlap found, add `cannibalizes` field and note in rationale. Flag, don't block.

   **Do not suggest new gaps if there are already 5 or more gaps with `status: "approved"`** — publish existing backlog first.

9. **For each new gap suggestion, write it to the appropriate cluster's gaps array** with:
   - `id` (format: gap-XX-N using cluster prefix: BG=buying-guide, BB=best-chairs-budget, HP=health-posture, GM=gaming, WS=workspace, BR=brand)
   - `title`
   - `targetKeyword`
   - `estVolume` (from Ahrefs data)
   - `intent` (informational/commercial/transactional)
   - `purpose`: `"traffic"` | `"authority"` | `"hub"` — mandatory
   - `rationale` — must reference actual `content_summary` fields of the closest existing post, not just titles. Include MY volume, global volume, and why the intent is unmet at content level.
   - `status`: `"suggested"`
   - `source`: `"monthly-update"`
   - `closestExistingPost`
   - `whyExistingDoesntCover` — content-level explanation
   - `heroTarget` — slug of crown/hero page this post would support via internal linking (optional)
   - `cannibalizes` — only if keyword overlap detected (optional)
   - `serpValidated`: `false` — all suggestions from monthly-update require SERP validation before approval
   - `suggestedLinksOut` — array of `{slug, anchor, note}`: 2–4 existing posts this new post should link TO. Always include the heroTarget post. Use specific anchor text.
   - `suggestedLinksIn` — array of `{slug, anchor, note}`: 2–3 existing posts that should add a link TO this new post. Identify posts whose `explicitly_not_covered` or `subtopics_covered` creates a natural handoff. Specify which section of the source post should carry the link.
   - `blogBrief` — pre-filled string for the master blog prompt (Section A + Section B). Use `\n` for newlines. Fill Topic from the gap title, Audience from the gap rationale's target reader, Goal from purpose (traffic → "rank on Google", authority → "build topical authority", hub → "earn backlinks and establish reference authority"), Target keyword from `targetKeyword`, Related posts as full URLs of closestExistingPost plus cluster posts that share concepts with this post.

10. Update the `meta` section with today's date and data sources used.

11. Save everything back to `merryfair_content_map.json`.

11a. Copy `merryfair_content_map.json` to `visual-map/public/merryfair_content_map.json`.

11b. Run hero detection. For each post in `post_details`, set `hero_tier` based on current `gsc_impressions`:
   - `gsc_impressions > 10000` → `hero_tier: "crown"`
   - `gsc_impressions > 2000` → `hero_tier: "hero"`
   - otherwise → `hero_tier: null`

11c. Run `python push_to_supabase.py` to sync to Supabase. If it fails due to a missing key, alert the user: `SUPABASE_SERVICE_KEY=your_key python push_to_supabase.py`

11d. Update `project-context.md`: refresh performance highlights, update gap statuses, update last monthly update date, update hero page list if any posts crossed a threshold.

12. Append an entry to the TOP of `session-log.md`:
    - Date
    - Data sources used and date range
    - Top performance changes (gains and drops)
    - New gaps suggested (count and titles)
    - Competitor gaps identified
    - Posts entering or leaving hero/crown status

13. **Print a full report:**
    - **Performance changes:** Posts with significant traffic gains or losses, with diagnosis (ranking issue vs CTR issue vs AI Overview)
    - **Competitor gaps:** Top keywords competitors rank for that Merryfair doesn't
    - **New gaps suggested:** Full rationale for each, classified by purpose, flagged as requiring SERP validation. For each gap also print:
      - **Links out:** which existing posts this new post should link to (anchor text + destination slug + reason)
      - **Links in:** which existing posts should add a link to this new post (anchor text + source slug + which section)
      - Note: Blog Brief is stored in the gap JSON and visible in the visual map detail panel (Pipeline tab → gap card → Copy button). No need to print it in the report.
    - **Posts in striking distance** (positions 8–20, >50/mo volume): specific optimisation recommendation for each
    - **CTR problems** (>1,000 impressions, <1% CTR): diagnosis and recommended fix
    - **Internal linking issues** found during crawl
    - **Cluster health summary:** posts per cluster, total traffic per cluster, gaps in pipeline per cluster
