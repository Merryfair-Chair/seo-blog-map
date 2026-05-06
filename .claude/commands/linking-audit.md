Run a full internal linking audit. Do ALL of the following automatically without asking:

0. Run `python3 pull_from_supabase.py` FIRST — before touching anything — to merge any gap status
   changes or new ideas added via the Vercel visual map into the local JSON.

1. Run `python3 crawl_and_summarize.py` to get fresh internal link data.

2. Read `merryfair_content_map.json`.

3. **Identify sidebar links (sitewide, non-contextual).**
   The site has a "Read More" sidebar that links to recent posts from every page. These are NOT contextual links.
   Identify sidebar links by finding slugs that appear as outbound links from more than **60% of all published posts** (not a fixed number — this threshold scales automatically as the blog grows). Exclude all identified sidebar slugs from the rest of the analysis.

4. **Check for broken internal links (do this first).**
   For every `internal_links_out` entry across all posts, check whether the destination slug exists in `post_details`. If it doesn't exist, flag it as a broken internal link with: source post, broken destination slug, and the anchor text used. Broken links must be fixed before any other linking action.

5. **Check pillar ↔ cluster post connections.** For each cluster:
   - Does the pillar link out to ALL cluster posts (contextually, not via sidebar)?
   - Does each cluster post link back to the pillar?
   - Are there any orphan posts (zero contextual inbound links from any post)?

6. **Check cross-cluster links.** The following cross-cluster connections should always exist — flag any that are missing:
   - health-posture posts → buying-guide pillar (ergonomic chair health claims should reference the buying guide)
   - buying-guide posts → health-posture pillar (chair features should reference health benefits)
   - best-budget posts → buying-guide pillar (budget decisions require feature knowledge)
   - gaming posts → buying-guide pillar (gaming chair buyers need ergonomic feature context)
   - workspace posts → buying-guide pillar (workspace setup requires chair selection guidance)

7. **Check for over-linked posts.**
   Flag any post with more than 8 contextual outbound internal links. Too many outbound links dilute PageRank flow and reduce the value passed to each destination.

7b. **Check for duplicate links and duplicate anchor texts within each post.**

   Scan every post's `internal_links_out` array for two types of issues:

   - **Duplicate link:** The same destination slug appears more than once in a single post's outbound links (even with different anchor texts). Linking to the same page twice from the same post dilutes link equity and confuses readers — only one link to any destination should exist per post.

   - **Duplicate anchor:** The same anchor text (case-insensitive, trimmed) is used to link to two or more *different* destination slugs within the same post. This sends contradictory topical signals to search engines.

   For each issue found, add to `link_health_issues` in the JSON using this structure:

   For duplicate links:
   ```json
   {
     "id": "dup-link-{from_slug_40chars}-to-{to_slug_40chars}",
     "type": "duplicate_link",
     "from_slug": "...",
     "destination": "destination_slug",
     "anchors": ["first anchor text", "second anchor text"],
     "status": "open",
     "added_date": "YYYY-MM-DD",
     "dismissed_date": null
   }
   ```

   For duplicate anchors:
   ```json
   {
     "id": "dup-anchor-{from_slug_40chars}-{first-5-words-of-anchor-slugified}",
     "type": "duplicate_anchor",
     "from_slug": "...",
     "anchor": "the exact anchor text",
     "destinations": ["slug1", "slug2"],
     "status": "open",
     "added_date": "YYYY-MM-DD",
     "dismissed_date": null
   }
   ```

   Rules:
   - Initialise `link_health_issues` as `[]` if the key doesn't exist in the JSON.
   - Check by ID — if an issue with the same ID already exists (any status), skip it to avoid duplicates.
   - Do NOT add these to `link_queue` — they are edit/removal actions, not add-link actions.
   - Include a count in the final report under "Link Health Issues" and list each issue with the post title, issue type, and what to fix.

8. **Check pillar pages for external inbound links.**
   For each pillar page, report the `ahrefs_referring_domains` count. Pillars with zero referring domains are relying entirely on internal link equity — flag these as backlink opportunities.

9. Generate a specific action list grouped by priority:
   - **Fix first:** Broken links (exact replacement to use)
   - **High:** Missing pillar ↔ cluster connections and orphan posts
   - **Medium:** Missing cross-cluster links
   - **Low:** Over-linked posts to thin out

   For each action: "Add a link FROM [post A] TO [post B] with anchor text [suggestion] because [reason]."

9b. **Populate the link queue.** For every action identified in step 9 (broken links, missing pillar connections, orphan fixes, cross-cluster links — everything except "over-linked" warnings which require no new link):

   - Generate a deterministic ID: `link-{from_slug}-to-{to_slug}` (truncate each slug to 40 chars if needed to keep IDs readable)
   - Check `link_queue` in the current JSON — if an item with that ID already exists (any status), skip it entirely. Never duplicate.
   - For new items only, add to `link_queue`:
     ```json
     {
       "id": "link-{from_slug}-to-{to_slug}",
       "from_slug": "...",
       "to_slug": "...",
       "anchor_text": "suggested anchor text",
       "priority": "high" | "medium" | "low",
       "reason": "one-sentence explanation",
       "status": "pending",
       "added_date": "YYYY-MM-DD",
       "done_date": null
     }
     ```
   - Initialise `link_queue` as an empty array if the key doesn't exist yet.

10. Save updated link data, the updated `link_queue`, and the updated `link_health_issues` to `merryfair_content_map.json`.

11. Run `bash /Users/merryfair/seo-blog-map/.claude/full_sync.sh` to copy the JSON to
    visual-map/public/, push to Supabase immediately, and commit+push to GitHub.

12. Append an entry to the TOP of `session-log.md`:
    - Date
    - Broken links found (count and details)
    - Missing links identified (count)
    - Orphan posts (list)
    - Actions completed vs flagged for owner

12b. **Update the Obsidian Vault — only if links were actually added or fixed** (not for a read-only audit). Write to `/Users/merryfair/Documents/Obsidian Vault/Weekly SEO Log.md`:
    - Find the current week's `### Week of [date]` heading (or create one at the top of the Log section)
    - Add/append a `#### YYYY-MM-DD` subheading for today
    - Write a bullet entry with: linking audit run, number of links added/fixed, any orphans resolved, remaining orphans still outstanding
    - Then update the `Weekly SEO Log` entry in `Research Status.md` to reflect the audit

13. Print the full report with all action items grouped by priority, plus a "Link Health Issues" section listing any new duplicate link or duplicate anchor issues found (with the post, issue type, and what to fix — e.g. "Remove the second link to [slug] in [post]" or "Change anchor '[text]' in [post] — currently used for both [slug1] and [slug2]").
