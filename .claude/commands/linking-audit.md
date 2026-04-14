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

8. **Check pillar pages for external inbound links.**
   For each pillar page, report the `ahrefs_referring_domains` count. Pillars with zero referring domains are relying entirely on internal link equity — flag these as backlink opportunities.

9. Generate a specific action list grouped by priority:
   - **Fix first:** Broken links (exact replacement to use)
   - **High:** Missing pillar ↔ cluster connections and orphan posts
   - **Medium:** Missing cross-cluster links
   - **Low:** Over-linked posts to thin out

   For each action: "Add a link FROM [post A] TO [post B] with anchor text [suggestion] because [reason]."

10. Save updated link data to `merryfair_content_map.json` if any corrections were made during the audit.

11. Run `bash /Users/merryfair/seo-blog-map/.claude/full_sync.sh` to copy the JSON to
    visual-map/public/, push to Supabase immediately, and commit+push to GitHub.

12. Append an entry to the TOP of `session-log.md`:
    - Date
    - Broken links found (count and details)
    - Missing links identified (count)
    - Orphan posts (list)
    - Actions completed vs flagged for owner

13. Print the full report with all action items grouped by priority.
