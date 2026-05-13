Sync internal link data after a manual linking session in WordPress. Run this after you've finished making internal link changes — NOT as a replacement for `/linking-audit`.

Do ALL of the following automatically without asking:

1. Run `python3 pull_from_supabase.py` to get the current state from Supabase (source of truth).

2. Run `python3 crawl_and_summarize.py --links-only` to re-crawl all live pages and update `internal_links_out` / `internal_links_in` for every post. This does NOT touch `extracted_text` or `content_summary` — link data only.

3. Read the updated `merryfair_content_map.json`.

4. **Reconcile the link queue.** For every item in `link_queue`:

   - **Status `done` or `pending`:** Check whether `post_details[from_slug].internal_links_out` now contains an entry with `slug === to_slug`.
     - If YES → set status to `"verified"`, set `done_date` to today's date. Log as confirmed.
     - If NO and status was `done` → reset status to `"pending"`, clear `done_date`, set `_sync_reset: true`. Log as a warning: "Marked done but not found in crawl — reset to pending."
     - If NO and status was `pending` → leave as-is (still outstanding).

   - **Status `verified`:** Skip — already confirmed, no action needed.

   When writing status changes, preserve all other fields on the item (`action_type`, `existing_anchor`, `existing_anchor_context`, `insertion_suggestion`, `insertion_location`) — only update `status`, `done_date`, and `_sync_reset`.

   **Note on `_sync_reset`:** This temporary flag tells the push script that this reset was intentional — so the merge step will not let a stale `done` status in Supabase override it. The flag is stripped automatically during the push.

5. Update `link_queue` in the JSON with all status changes from step 4.

5b. **Re-check link health issues.** For every item in `link_health_issues` with status `"open"`:
   - **`duplicate_link`:** Check `post_details[from_slug].internal_links_out` — count how many entries have `slug === issue.destination`. If the count is now ≤ 1, the duplicate is gone — set status to `"dismissed"` and `dismissed_date` to today. Log as "auto-resolved".
   - **`duplicate_anchor`:** Check `post_details[from_slug].internal_links_out` — collect all unique destination slugs that use the same anchor text (case-insensitive). If they all resolve to one destination (or the anchor no longer exists), set status to `"dismissed"` and `dismissed_date` to today. Log as "auto-resolved".
   - Update `link_health_issues` in the JSON with any auto-resolutions.
   - Include auto-resolved health issues in the sync report.

6. Update `linking_health` in the JSON (orphans, islands, most-linked) based on the fresh crawl data.

7. Run `bash /Users/merryfair/seo-blog-map/.claude/full_sync.sh` to copy the JSON to `visual-map/public/`, push to Supabase, and commit+push to GitHub.

8. Print a concise report:
   - **Verified:** List of queue items now confirmed in live pages (from_slug → to_slug)
   - **Reset to pending:** List of items marked done but not found in crawl (with a note to re-check WordPress)
   - **Still pending:** Count of remaining outstanding link actions
   - **New orphans:** Any posts that are now orphans that weren't before
   - **Resolved orphans:** Any posts that were orphans and now have inbound links

9. Append an entry to the TOP of `session-log.md`:
   - Date
   - Links verified (count + slugs)
   - Links reset to pending (count + reason)
   - Remaining pending count
   - Orphan status changes

10. **Update the Obsidian Vault**:
   - Read `~/.claude/skills/seo-log/SKILL.md` and follow its insertion procedure using the tool-run type. Include: links verified (count + specific from_slug → to_slug pairs), links reset to pending (slugs + reason), remaining pending count, any orphan resolutions or new orphans.
   - Then read `Research Status.md` in the vault and update the `Weekly SEO Log` entry's **This Session**, **Key Findings**, and **Next Steps** fields to reflect the sync results.
