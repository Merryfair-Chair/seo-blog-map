# Merryfair SEO — Session Log

Append a new entry at the top after every Claude Code session. One entry per session. Keep entries concise — decisions, actions taken, and anything that changes project state. Full context lives in `project-context.md`.

---

## 2026-05-08 — /sync-links run #3 (all 12 done items verified)

**Links verified (12 newly confirmed — all items previously marked done in app):**
- how-to-know-when-its-time-for-an-ergonomic-chair-upgrade → the-ultimate-guide-to-ergonomic-chairs ✓
- how-to-adjust-office-chair → the-ultimate-guide-to-ergonomic-chairs ✓
- best-office-chair-short-people → the-ultimate-guide-to-ergonomic-chairs ✓
- best-ergonomic-chair-back-pain → the-physical-benefits-of-ergonomics ✓
- the-role-of-ergonomic-office-chairs-in-preventing-back-pain → best-ergonomic-chair-back-pain ✓
- office-chair-tilt-mechanism-guide → how-to-adjust-office-chair ✓
- the-physical-benefits-of-ergonomics → best-ergonomic-chair-back-pain ✓
- the-physical-benefits-of-ergonomics → correct-sitting-posture-guide ✓
- what-is-lumbar-support → lumbar-cushion-vs-built-in-support ✓
- lumbar-cushion-vs-built-in-support → best-ergonomic-chair-back-pain ✓
- why-executive-comfort-is-the-new-productivity → ergonomic-home-office-setup-guide ✓
- why-everyones-switching-to-ergonomics-swivel-chairs-in-2025 → ergonomic-home-office-setup-guide ✓

**Reset to pending:** 0

**Queue:** 31 verified / 0 pending / 31 total — queue fully complete.

**Orphans:** 2 remaining — both brand/seasonal islands (office-chairs-to-sit-with-power-focus-and-intention, redefine-holiday-gifting-with-merryfair-ergonomic-chairs). Expected.

**Infrastructure fixes this session:**
- push_to_supabase.py: now merges statuses from Supabase before pushing — prevents done/verified marks being overwritten
- sync-links.md: _sync_reset flag added so deliberate pending resets survive the merge
- full_sync.sh: updated to use status-merge push
- linking-audit.md Step 10a: 6-gate hyperlink_existing validation added (heading exclusion, primary placement, context relevance, destination clarity, no meta-context, surprise test)
- 5 queue items reclassified from hyperlink_existing to insert_new (anchors were headings, FAQ questions, or announcing the destination)

---

## 2026-05-08 — /sync-links run #2 (after crawl script heading fix)

**Links verified (1 newly confirmed):**
- effects-of-poor-sitting-posture-and-how-ergonomics-can-help → standing-desk-vs-ergonomic-chair ✓ (previously missed — link is in an H3; fixed by adding h2/h3/h4 to crawl script)

**Reset to pending: 0**

**Remaining pending: 12** | Queue: 19 verified / 12 pending / 31 total

**Orphan status: unchanged** — best-ergonomic-chair-back-pain still the only non-brand orphan

**Crawl script fix:** `crawl_and_summarize.py` now includes h2/h3/h4 in link extraction. Previously any link inside a heading tag was invisible to the crawler — this caused the false "reset to pending" for the ergonomic-home-office → standing-desk link in the prior run.

---

## 2026-05-08 — /sync-links run (post WordPress linking session)

**Links verified (9 newly confirmed live):**
- correct-sitting-posture-guide → the-physical-benefits-of-ergonomics-why-it-matters-for-your-health
- 6-affordable-ergonomic-chairs-for-your-home-and-office → best-study-chairs-students-guide
- correct-sitting-posture-guide → standing-desk-vs-ergonomic-chair
- ergonomic-home-office-setup-guide → how-to-adjust-office-chair
- ergonomic-chair-size-guide → best-office-chair-short-people
- ergonomic-chair-size-guide → how-to-adjust-office-chair
- office-furniture-supplier-malaysia-corporate-guide → bifma-certified-office-furniture-malaysia
- office-furniture-supplier-malaysia-corporate-guide → best-office-furniture-supplier-malaysia
- effects-of-poor-sitting-posture-and-how-ergonomics-can-help → correct-sitting-posture-guide

**Reset to pending (2 — marked done but not found in crawl):**
- effects-of-poor-sitting-posture-and-how-ergonomics-can-help → standing-desk-vs-ergonomic-chair
- ergonomic-home-office-setup-guide → standing-desk-vs-ergonomic-chair

**Remaining pending: 12**

**Orphan changes:**
- Resolved: best-office-chair-short-people, best-study-chairs-students-guide, standing-desk-vs-ergonomic-chair (all now have inbound links)
- Still orphan: best-ergonomic-chair-back-pain (priority — add links from the-role-of-ergonomic and health pillar)
- Islands: office-chairs-to-sit-with-power-focus-and-intention, redefine-holiday-gifting (brand posts, no action)

**Queue total: 31 items (17 verified, 12 pending)**

---

## 2026-05-08 — /linking-audit completed (Option A: clean slate rebuild)

**What was done:**
- Completed the `/linking-audit` with the new relevance-gated, anchor-first workflow (Option A — clear all 46 pending items, rebuild from scratch)
- Broken link found: `be-a-true-gamer-with-ronin-the-best-gaming-chair-in-malaysia` → `on-to-the-year-of-the-dragon-5-tips-to-sit-like-a-leader` (slug doesn't exist — fix in WordPress)
- No duplicate link/anchor health issues found in current link data
- Identified 6 orphaned posts: best-ergonomic-chair-back-pain, best-office-chair-short-people, best-study-chairs-students-guide, standing-desk-vs-ergonomic-chair, office-chairs-to-sit-with-power-focus-and-intention, redefine-holiday-gifting-with-merryfair-ergonomic-chairs
- 2 island posts (0 in, 0 out): office-chairs-to-sit-with-power-focus-and-intention, redefine-holiday-gifting-with-merryfair-ergonomic-chairs (both brand/seasonal)
- Populated link_queue with 23 new items: 11 HIGH, 10 MEDIUM, 2 LOW
- 14 of 23 items use hyperlink_existing (existing phrase found in extracted_text); 9 use insert_new
- Ran `full_sync.sh` — JSON pushed to Supabase and GitHub

**Decisions made:**
- Pillar → cluster links flagged only if pillar's subtopics_covered match cluster post's main_topic
- Cluster → pillar links always flagged (once per post, readers benefit from the full guide)
- Cross-cluster links only where explicit content overlap in content_summary
- Posts with >60% of site linking to them (best-ergonomic-office-chairs-every-budget — 20+ posts) treated as sidebar links and excluded from editorial analysis
- Island posts (office-chairs-to-sit-with-power-focus-and-intention, redefine-holiday-gifting) are brand/seasonal — no queue items added, flagged informational only

**Pending / next actions:**
- Fix broken link in `be-a-true-gamer-with-ronin` post in WordPress (destination slug doesn't exist)
- Work through 11 HIGH priority queue items in WordPress
- After WordPress session, run `/sync-links` to verify

---

## 2026-05-07 — Linking audit and sync-links skills redesigned

**What was done:**
- Rewrote `/linking-audit` skill with relevance-gated logic and anchor-first workflow:
  - Links are now only flagged if content_summary shows genuine topical overlap — cluster membership alone no longer justifies a link
  - Per-post link density thresholds added by type (supporting: 3–8, pillar: 6–15, brand: 1–4)
  - Anchor-first workflow: for each flagged link, searches extracted_text for an existing phrase to hyperlink before suggesting new text
  - Link queue schema updated with: `action_type`, `existing_anchor`, `existing_anchor_context`, `insertion_suggestion`, `insertion_location`
  - Switched from full crawl to `--links-only` (content already in JSON)
- Updated `LinkQueueView.jsx`: new `ActionGuidance` component renders per-item in the visual map — green "Hyperlink existing" block (exact phrase + context sentence) or orange "Insert new text" block (location + suggested sentence)
- Updated `sync-links.md`: preserves new schema fields when writing status changes
- Added `/sync-links` to Obsidian Vault mandatory commands in CLAUDE.md and sync-links.md
- Backfilled the missing sync-links vault entry from earlier today

**Decisions made:**
- Relevance gate is content_summary-level (reads subtopics_covered / explicitly_not_covered) — never infers from slugs or titles
- Anchor-first: if no natural anchor exists in extracted_text AND relevance is marginal, link is dropped entirely — no forced insertions
- Old queue items (45 pending) don't have new fields yet — will be enriched on next `/linking-audit` run

**Pending / next actions:**
- Run `/linking-audit` to regenerate queue with new relevance-gated, anchor-first logic — some of the 45 pending items may be pruned

---

## 2026-05-07 — /new-post: best-office-chair-short-people (buying-guide, fills gap-BG-7)

**What was done:**
- Ran `pull_from_supabase.py` — synced latest JSON from Supabase
- Ran `crawl_and_summarize.py` — full crawl (42 posts), new post discovered with 2 outbound links, 0 inbound (orphan)
- Generated `content_summary` for `best-office-chair-short-people`:
  - Main topic: 5-chair product recommendation guide for users under 5'6", evaluated against proprietary 5th-Percentile Fit Standard (3 thresholds: seat height, seat depth, lumbar range)
  - Products mentioned: Tune, Spinelly, Zenit, Aire, Ovo
  - Angle: manufacturer-grade dimensional spec evaluation cutting through "petite-friendly" marketing claims
  - Explicitly not covered: non-Merryfair brands, tall people, budget tiers, children's chairs
- Assigned to `buying-guide` cluster (post 12)
- Initialized `hero_tier: null`, `triage_status: none`, `optimization: null`
- Marked **gap-BG-7** as `published` (2026-05-07)
- Updated JSON, pushed to Supabase, committed and pushed to GitHub

**Decisions made:**
- Cluster assignment: buying-guide (not best-chairs-budget) — content is body-type selection methodology, not budget comparison
- gap-BG-7 confirmed as filled — content matches the gap spec exactly (5th-Percentile Fit Standard, manufacturer-grade specs, Merryfair model recommendations for petite users)

**Internal linking issues flagged:**
- ORPHAN: `best-office-chair-short-people` has 0 inbound links
- Missing outbound: post does NOT link to cluster pillar (`the-ultimate-guide-to-ergonomic-chairs-must-have-features-and-best-types-for-every-workspace`)
- Missing inbound (per gap-BG-7 spec): `ergonomic-chair-size-guide`, `how-to-choose-office-chair-body-fit-test`, and the cluster pillar should all link here

**Pending / next actions:**
- Add outbound link from `best-office-chair-short-people` → cluster pillar in WordPress
- Add inbound links from: ergonomic-chair-size-guide, how-to-choose-office-chair-body-fit-test, the-ultimate-guide
- No approved gaps remain — approve next from suggested pipeline (BG-8, GM-3, HP-7, etc.)

---

## 2026-05-07 — /sync-links run: 8 links verified, 1 reset to pending

**What was done:**
- Ran `pull_from_supabase.py` — synced latest JSON from Supabase
- Ran `crawl_and_summarize.py --links-only` — re-crawled all 41 live pages, refreshed `internal_links_out` / `internal_links_in`
- Reconciled link queue (54 items total):
  - **8 verified:** all 7 outbound links from `the-ultimate-guide-to-ergonomic-chairs-must-have-features-and-best-types-for-every-workspace` confirmed, plus `bifma-certified-office-furniture-malaysia → best-office-furniture-supplier-malaysia`
  - **1 reset to pending:** `ergonomic-home-office-setup-guide → why-executive-comfort-is-the-new-productivity` (was marked done, not found in crawl — needs re-check in WordPress)
  - **45 still pending**
- No link_health_issues to process (none exist yet — requires `/linking-audit` to run first)
- Updated `linking_health`: 3 orphans, 2 islands (unchanged from prior state)
- Pushed updated JSON to Supabase and GitHub (resolved rebase conflict — remote had an ahead commit)

**Decisions made:**
- None — routine sync.

**Pending / next actions:**
- Re-add the link from `ergonomic-home-office-setup-guide` to `why-executive-comfort-is-the-new-productivity` in WordPress (was marked done but not found in crawl)
- 45 pending queue items remain — next manual linking session should target these

---

## 2026-05-06 — Added duplicate link/anchor health checks to linking audit and app

**What was done:**
- Updated `/linking-audit` skill: new step 7b checks for two issue types within each post: (1) duplicate links — same destination slug linked more than once, (2) duplicate anchors — same anchor text used for different destinations. Issues stored as `link_health_issues[]` in the JSON.
- Updated `/sync-links` skill: step 5b auto-resolves health issues after each re-crawl if the problem no longer exists in live link data.
- Created `api/link-health-item.js`: PATCH endpoint to dismiss/re-open health issues from the app.
- Updated `LinkQueueView.jsx`: added "Health Issues" mode (button toggle at top of Links view) showing issues grouped by post, with dismiss checkbox, type badge (Duplicate Link / Duplicate Anchor), and fix instructions.
- Updated `Header.jsx` + `App.jsx`: Links tab badge now counts open health issues + pending queue items combined; data wired through from JSON.
- Built and pushed to GitHub (Vercel will redeploy automatically).

**Decisions made:**
- Health issues stored separately from `link_queue` (they are edit/remove actions, not add-link actions).
- `/sync-links` auto-resolves issues based on live crawl — user can also manually dismiss from the app.
- Links tab badge sums pending queue + open health issues so the user sees the full "attention needed" count.

**Pending / next actions:**
- Next `/linking-audit` run will populate `link_health_issues` for the first time if any issues exist.

---

## 2026-05-06 — Linking audit run, link_queue populated for the first time

**What was done:**
- Ran `pull_from_supabase.py` — synced latest JSON
- Ran `crawl_and_summarize.py` — fresh crawl of all 41 posts
- Ran full `/linking-audit` analysis

**Audit findings:**
- Broken links: **1** — `be-a-true-gamer-with-ronin-the-best-gaming-chair-in-malaysia` has a broken outbound link to `on-to-the-year-of-the-dragon-5-tips-to-sit-like-a-leader` (post deleted/unpublished). Must be removed manually.
- Sidebar slugs: **0** (none exceed 60% threshold)
- Over-linked posts: **0** (all within 8-link limit)
- Missing pillar→cluster links: 19
- Missing cluster→pillar links: 9
- Missing cross-cluster links: 24
- Orphan posts (no inbound links): **9**
  - `how-to-adjust-office-chair`, `footrest-office-chair-guide`, `how-to-clean-office-chair-malaysia`, `best-study-chairs-students-guide`, `standing-desk-vs-ergonomic-chair`, `best-ergonomic-chair-back-pain`, `best-office-furniture-supplier-malaysia`, `redefine-holiday-gifting-with-merryfair-ergonomic-chairs`, `office-chairs-to-sit-with-power-focus-and-intention`
- Note: brand-seasonal and b2b-office-furniture posts (`redefine-holiday-gifting-*`, `office-chairs-to-sit-*`) are low-priority orphans as brand posts don't require pillar connection.

**Link queue populated:**
- 54 new items written to `link_queue` in JSON (all status: pending)
- 30 HIGH priority (pillar↔cluster connections + orphan fixes)
- 24 MEDIUM priority (cross-cluster links)
- Synced to Supabase and GitHub (commit 9aefb48)

**Pending / next actions:**
- Fix broken link: remove/replace link in `be-a-true-gamer-with-ronin-*` pointing to deleted post
- Work through the Links tab in visual map (grouped by source post) to batch WordPress edits
- Run `/sync-links` after each WordPress editing session

---

## 2026-05-05 — Infrastructure: Link Queue system built

**What was built:**
- `api/link-queue-item.js` — PATCH endpoint to toggle queue item status (pending → done → verified). Same read-from-Supabase / mutate / write-back pattern as all existing API routes.
- `crawl_and_summarize.py --links-only` flag — re-crawls all pages but only updates link fields in JSON; skips `extracted_text` and `content_summary`. Used by `/sync-links`.
- `.claude/commands/sync-links.md` — new lightweight slash command for post-WordPress-session reconciliation. Pulls from Supabase, runs `--links-only` crawl, verifies/resets queue items, pushes back. No AI analysis, no token waste.
- `/linking-audit` updated (step 9b) — now populates `link_queue` array in JSON with deterministic IDs and deduplication when it runs.
- `visual-map/src/components/LinkQueueView.jsx` — new "Links" tab in the visual map. Items grouped by source post so edits are batched per WordPress visit. Filter by pending/done/verified. Checkbox marks done via API immediately.
- `App.jsx` / `Header.jsx` updated — Links tab added with live pending count badge; `/sync-links` added to Commands panel.
- `CLAUDE.md` updated — `/sync-links` added to available slash commands.

**Decisions:**
- Supabase remains source of truth — all queue writes go through the same read-modify-write API pattern.
- `link_queue` lives at top level of the JSON blob. Item ID is deterministic: `link-{from_slug}-to-{to_slug}`. Dedup prevents duplicates on repeated `/linking-audit` runs.
- Status flow: `pending` → `done` (user marks in UI) → `verified` (confirmed by `/sync-links` crawl). Reset to `pending` if marked done but not found in crawl.
- `/sync-links` is the post-session command; `/linking-audit` is the periodic deep analysis. Neither replaces the other.

**Pending:**
- Run `/linking-audit` to populate the queue with current outstanding link actions.
- The `link_queue` key does not yet exist in the JSON — it will be initialised the first time `/linking-audit` runs.

---

## 2026-05-05 — /new-post: footrest-office-chair-guide

**Post processed:** "Footrest for Office Chair: Who Needs One and Which Type"
**URL:** https://www.merryfair.com/latest_updates/blog/footrest-office-chair-guide/
**Date published:** 2026-05-05

**Actions:**
- Pulled from Supabase (pre-merge)
- Re-crawled all 41 blog posts via `crawl_and_summarize.py` (41st post discovered)
- Resolved git merge conflict (local b20d0c9 vs remote daily crawl bbf2fd0) — took our version (more recent crawl 14:54 MYT vs 04:56), committed merge
- Generated `content_summary` for new post
- Assigned to cluster: `buying-guide` (11th post in cluster)
- Initialised `hero_tier: null`, `triage_status: "none"`, `optimization: null`
- Marked gap `gap-BG-9` (Do You Need a Footrest with Your Office Chair?) → `published`
- Full sync: Supabase updated + pushed to GitHub (commit 2dbdab0)

**Content summary:** Diagnostic-first educational guide that frames footrests as a geometric correction for a specific chair-desk mismatch — not a comfort accessory. Core structure: 4-question diagnostic check (dangling feet, thigh-edge pressure, fixed desk, lower-leg fatigue), three footrest types (flat/tilted/rocker) matched to user need, feature criteria (adjustable height, grippy surface, 30cm width), setup via popliteal gap measurement, 3 common mistakes, built-in vs. separate comparison, FAQ section. No Merryfair products mentioned. No brand recommendations.

**Internal linking:**
- **Links OUT (6):** ergonomic-chair-size-guide, small-home-office-ideas, how-to-choose-office-chair-body-fit-test, the-ultimate-guide-to-ergonomic-chairs (PILLAR — good), ergonomic-home-office-setup-guide, best-ergonomic-office-chairs-every-budget — all valid, no broken links
- **Post DOES link to cluster pillar** ✓
- **Post is ORPHAN** — 0 inbound links

**Missing links to add:**
- Pillar (the-ultimate-guide-to-ergonomic-chairs) → new post: add link (pillar does not currently link to footrest guide)
- `ergonomic-chair-size-guide` → new post (foot-dangling section directly leads here)
- `how-to-adjust-office-chair` → new post (chair adjustment flow → footrest as secondary fix)
- `ergonomic-home-office-setup-guide` → new post (accessories section)

**Gap filled:** gap-BG-9 (Do You Need a Footrest with Your Office Chair?) → published

**New gap-BG-9 status in JSON:** Now also confirmed gap-BG-7 was already approved in the visual map ("Best Ergonomic Chairs for Short and Petite People") — this is next in the writing queue.

**Decisions:**
- Cluster: buying-guide (diagnostic/buying guide for ergonomic accessories; links out to buying-guide pillar)
- No new gaps revealed: post covers footrests comprehensively; what's explicitly not covered (brand comparisons, standing desk footrests, DOSH regulations) doesn't create immediate gap demand

**Pending / next actions:**
- Write gap-BG-7 ("Best Ergonomic Chairs for Short and Petite People") — approved, next in queue
- Add inbound links to footrest-office-chair-guide (4 links above)
- Approve/reject remaining suggested gaps: HP-3, HP-5, HP-7, GM-2, GM-3, B2B-1, BG-8

---

## 2026-05-04 — /new-post: best-ergonomic-chair-back-pain

**Post processed:** "Best Ergonomic Chair for Back Pain by Pain Pattern (2026)"
**URL:** https://www.merryfair.com/latest_updates/blog/best-ergonomic-chair-back-pain/
**Date published:** 2026-05-04

**Actions:**
- Pulled from Supabase (pre-merge)
- Re-crawled all 40 blog posts via `crawl_and_summarize.py` (40th post discovered)
- Resolved git rebase conflict (auto-sync commit c7a4cba vs HEAD 1106319) — took incoming commit's post data, then applied updates on top
- Generated `content_summary` for new post
- Assigned to cluster: `health-posture` (8th post in cluster)
- Initialised `hero_tier: null`, `triage_status: "none"`, `optimization: null`
- Marked gap `gap-HP-6` (Best Ergonomic Chairs for Back Pain) → `published`
- Full sync: Supabase updated + pushed to GitHub (commit 78b6fa3)

**Content summary:** Manufacturer-authority buying guide using the "Pain-First Fit Method" — a four-step diagnostic framework (Pinpoint, Pressure-Test, Pair, Prove) that maps specific pain patterns to chair feature failures and engineering fixes. Five Merryfair chairs matched to pain patterns: Wau (chronic lower back), Reya (disc/sciatic), Zenit (mid-back/shoulder), Ronin (tall sitters), Anggun (budget). Backed by PLOS One 2015 lordosis study and UC Berkeley HFEP micromotion research. Includes chair setup protocol, FAQ section, and explicit disclaimer to seek medical advice for disc/sciatic conditions.

**Internal linking:**
- **Links OUT (6):** the-role-of-ergonomic-office-chairs-in-preventing-back-pain, what-is-lumbar-support, lumbar-cushion-vs-built-in-support, office-chair-tilt-mechanism-guide, best-ergonomic-chair-long-hours, correct-sitting-posture-guide — all valid, no broken links
- **Post does NOT link to its cluster pillar** (the-physical-benefits-of-ergonomics-why-it-matters-for-your-health) — FLAG
- **Post is ORPHAN** — 0 inbound links

**Missing links to add:**
- New post → pillar: `the-physical-benefits-of-ergonomics-why-it-matters-for-your-health` should be added as outbound from new post
- Pillar → new post: `the-physical-benefits-of-ergonomics-why-it-matters-for-your-health` should link to `best-ergonomic-chair-back-pain` (back pain section)
- `the-role-of-ergonomic-office-chairs-in-preventing-back-pain` → new post (natural next step: prevention to product picks)
- `lumbar-cushion-vs-built-in-support` → new post (built-in support conclusion section)

**Gap filled:** gap-HP-6 (Best Ergonomic Chairs for Back Pain) → published

**Decisions:**
- Cluster assignment: health-posture (content is a health/back-pain product guide, fills HP-6 which is in that cluster)
- gap-HP-3 (informational: feature criteria for back pain) remains suggested — can stand as a separate informational complement now that HP-6 is published as the commercial counterpart

**Pending / next actions:**
- Add inbound links to resolve orphan status (3 links above)
- Add outbound link from new post to cluster pillar
- Approve/reject remaining suggested gaps: HP-3, HP-5, HP-7, GM-2, GM-3, B2B-1, BG-7, BG-8, BG-9
- No approved gaps in the pipeline — owner needs to approve at least one to continue content production

---

## 2026-05-04 — /monthly-update (April 2026 data) + sync architecture fix

**Data sources used:** GSC Pages + Queries (April 2026), Ahrefs Top Pages + Organic Keywords (April 2026), GA4 Pages & Screens (April 2026), Ahrefs MCP competitor analysis

**Actions:**
- Pulled from Supabase before starting
- Parsed all April 2026 CSVs → updated gsc_clicks, gsc_impressions, gsc_ctr, gsc_avg_position, ahrefs_traffic, ahrefs_keywords, ahrefs_referring_domains, top_keyword, top_kw_volume, top_kw_position, ga4_organic_views for all 39 posts
- Re-ran `crawl_and_summarize.py` — internal link data refreshed
- Hero tier recalculation run — several tier changes (see below)
- Competitor analysis via Ahrefs MCP: officepro.my, ergoworks.com.my, alterseat.com
- 3 new gaps written to JSON; full sync to Supabase + GitHub
- **Infrastructure fix:** `crawl.yml` updated — added Supabase pull step before crawl runs. Closes data-loss window where daily crawl could overwrite web-app gap status changes. Committed as 0b7cdb7.

**Performance changes:**
- GAINS: best-ergonomic-office-chairs-every-budget 51→133 clicks (+161%), ergonomic-chair-size-guide 17→48 (+182%), office-chair-tilt-mechanism-guide 32→53 (+66%), best-study-chairs-students-guide 5→21 (+320%)
- DROPS: how-to-choose-the-best-ergonomic-chair-in-malaysia 87→41 (-53%, CTR issue — pos held at 5.8), 6-affordable-ergonomic-chairs-for-your-home-and-office 62→28 (-55%, CTR 0.27% — AI Overview likely)

**Hero tier changes:**
- DROPPED to hero: how-to-choose-the-best-ergonomic-chair-in-malaysia (crown→hero, imp fell to 9,904)
- DROPPED out: do-posture-correctors-work (hero→null, imp=347), how-to-choose-the-best-ergonomic-chair-for-solo-movie-nights (hero→null, imp=1,569)
- NEW heroes: correct-sitting-posture-guide (6,270 imp), best-ergonomic-chair-long-hours (3,864 imp), standing-desk-vs-ergonomic-chair (2,270 imp), how-to-know-when-its-time-for-an-ergonomic-chair-upgrade (2,093 imp), effects-of-poor-sitting-posture-and-how-ergonomics-can-help (3,733 imp)

**New gaps suggested (3):**
- gap-GM-3: Best Gaming Chairs Malaysia 2026 (gaming cluster, traffic) — "gaming chair" 4,900 MY vol
- gap-HP-7: Neck and Shoulder Pain from Sitting (health-posture cluster, authority) — 4 posts explicitly exclude this topic
- gap-BG-9: Do You Need a Footrest with Your Office Chair? (buying-guide cluster, traffic) — "footrest" 800 MY vol, ergoworks ranks pos 6

**Decisions:**
- Supabase confirmed as source of truth; GitHub Actions crawl now pulls from Supabase first to prevent overwrite
- gap-GM-3 is distinct from rejected gap-GM-1: GM-1 was "best ergonomic chair for gaming" (ergonomic angle), GM-3 is "best gaming chairs Malaysia" (commercial buying guide for gaming chairs specifically)

**Pending / next actions:**
- Owner to approve/reject new gaps in visual map: gap-GM-3, gap-HP-7, gap-BG-9 (plus existing suggested: HP-3, HP-5, HP-6, GM-2, B2B-1, BG-7, BG-8)
- CRITICAL: best-ergonomic-office-chairs-every-budget title/meta rewrite — 65,887 impressions, 0.20% CTR. Biggest ROI action available.
- 6-affordable-ergonomic-chairs-for-your-home-and-office: 10,494 imp, 0.27% CTR, pos 3.2 — CTR issue despite strong position. Likely AI Overview. Test title/meta.
- correct-sitting-posture-guide: 6,270 imp, 0% CTR, pos 11.8 — investigate AI Overview
- Vault sync pending (Weekly SEO Log + Research Status)

---

## 2026-04-23 — /new-post: best-ergonomic-chair-long-hours

**Post processed:** "5 Best Ergonomic Chairs for Long Hours of Sitting (2026)"
**URL:** https://www.merryfair.com/latest_updates/blog/best-ergonomic-chair-long-hours/
**Date published:** 2026-04-23

**Actions:**
- Pulled from Supabase (pre-merge)
- Re-crawled all 39 blog posts via `crawl_and_summarize.py` (39th post discovered)
- Generated `content_summary` for new post
- Assigned to cluster: `best-chairs-budget` (6th post in cluster)
- Initialised `hero_tier: null`, `triage_status: "none"`, `optimization: null`
- Marked gap `gap-BB-5` (Best Ergonomic Chairs for Long Hours of Sitting) → `published`
- Full sync: Supabase + GitHub (commit be7b33c)

**Content summary:** Engineering-first product round-up introducing Merryfair's "8-Hour Test" — five criteria (Mechanism, Lumbar, Thermal, Depth, Fatigue) — and positioning five chairs against it: Zenit (premium full-day), Tune (mid-tier adjustability), Spinelly (dynamic active sitting), Ovo (tropical climate/heat), Aire (compact home office). Backs framework with UC Riverside PLOS One 2024 + JAMA Network Open research on prolonged sitting health risk. Also addresses gaming chairs vs office chairs for long hours and mesh vs foam thermal comparison.

**Internal linking:**
- **Links OUT (4):** office-chair-tilt-mechanism-guide, what-is-lumbar-support, 6-affordable-ergonomic-chairs-for-your-home-and-office, best-ergonomic-office-chairs-every-budget — all valid, no broken links
- **Post links to its pillar** (best-ergonomic-office-chairs-every-budget) ✓
- **Post is ORPHAN** — 0 inbound links

**Missing links to add:**
- Pillar → new post: `best-ergonomic-office-chairs-every-budget` should link to `best-ergonomic-chair-long-hours`
- `the-role-of-ergonomic-office-chairs-in-preventing-back-pain` → new post (prolonged sitting health research overlap)
- New post → `lumbar-cushion-vs-built-in-support` (both cover lumbar mechanics extensively — natural cross-link)
- New post → `correct-sitting-posture-guide` (posture for long-hour sitters)

**Gap filled:** gap-BB-5 (Best Ergonomic Chairs for Long Hours of Sitting) → published

**Pending / next actions:**
- Add inbound links to resolve orphan status (4 links above)
- Approve/reject remaining 8 suggested gaps: HP-3, HP-5, GM-2, B2B-1, HP-6, BG-7, BG-8

---

## 2026-04-23 — 4 new use-case gaps added (manual enrichment)

**Actions:**
- Assessed use-case based "best ergonomic chair for [X]" post ideas against existing content for cannibalization risk
- Reviewed Ahrefs SERP CSVs (manually uploaded by owner — US data, no MY volume available for these keywords)
- Added 4 fully enriched gaps to `merryfair_content_map.json` with SERP-validated data, blogBriefs, and link suggestions
- Synced to GitHub and Supabase via `full_sync.sh`

**Gaps added:**
| ID | Title | Cluster | KD | Parent Topic Vol (US) | Traffic Potential |
|----|-------|---------|----|-----------------------|-------------------|
| gap-BB-5 | Best Ergonomic Chairs for Long Hours of Sitting | best-chairs-budget | 5 | 4,000 | 5,700 |
| gap-HP-6 | Best Ergonomic Chairs for Back Pain | health-posture | 19 | 5,700 | 8,000 |
| gap-BG-7 | Best Ergonomic Chairs for Short and Petite People | buying-guide | 0 | 400 | 800 |
| gap-BG-8 | Best Ergonomic Chairs for Tall and Big People | buying-guide | 0 | 400 | 900 |

**Key findings:**
- All 4 keyword intents match SERP (commercial investigation / product round-ups) — no intent mismatch
- Zero MY volume for all keywords — US data only; strategic value is authority + traffic from global/regional queries
- gap-HP-6 (back pain) flags overlap with gap-HP-3 (suggested, not written) — owner must decide: write as two posts (informational features guide + commercial product list) or merge into one
- gap-BB-5 (long hours) is the highest-value/lowest-risk: KD 5, parent topic 4,000, existing Saga positioning matches perfectly
- gap-BG-7 and gap-BG-8 form a natural companion pair with ergonomic-chair-size-guide as the inbound link source for both
- User confirmed tall people post should include "big and tall" angle (height + weight), matching Forbes/Sihoo SERP approach
- Ahrefs API at 393/25,000 units — enrichment done manually from CSV data; units reset 2026-04-25

**Decisions:**
- Gaps added with status: "suggested" — require owner approval in visual map before writing begins
- "Big AND tall" framing confirmed for gap-BG-8 (not height-only)
- neck pain not added as standalone post — parent topic only 200 vol; can be a section inside gap-HP-6

**Pending / next actions:**
- Approve/reject the 4 new gaps in visual map Pipeline tab
- Resolve gap-HP-3 vs gap-HP-6 relationship before writing either (merge or two posts?)
- Previously pending: approve/reject HP-3, HP-5, GM-2, B2B-1

---

## 2026-04-22 — Obsidian Vault Sync infrastructure

**Actions:**
- Added "Obsidian Vault Sync (mandatory)" section to `CLAUDE.md` in this project
- Added "Cross-Project Sync from seo-blog-map" section to `Obsidian Vault/CLAUDE.md`
- Updated `project-context.md` to record the new sync infrastructure

**Decisions:**
- Sync trigger is Claude instruction-based (CLAUDE.md), not a script or hook — Claude writes to the vault as part of every major command execution
- Weekly SEO Log is the primary bridge; Research Status.md handles cascade to research notes
- Vault CLAUDE.md reads `seo-blog-map/session-log.md` as fallback when user types "update" in vault context
- Cascade is adaptive: reads Research Status.md to determine which notes are in scope — no hardcoded list

**Pending / next actions:**
- None from this session — sync will activate automatically from next command onwards

---

## 2026-04-22 — /new-post: lumbar-cushion-vs-built-in-support

**Post processed:** "Lumbar Cushion vs Built-In Lumbar Support: What Really Works"
**URL:** https://www.merryfair.com/latest_updates/blog/lumbar-cushion-vs-built-in-support/
**Date published:** 2026-04-22

**Actions:**
- Pulled from Supabase (pre-merge)
- Re-crawled all 38 blog posts via `crawl_and_summarize.py`
- Generated `content_summary` for new post
- Assigned to cluster: `health-posture` (7th post in cluster)
- Initialised `hero_tier: null`, `triage_status: "none"`, `optimization: null`
- Marked gap `gap-HP-4` (Built-in lumbar support vs lumbar cushion) → `published`
- Full sync: Supabase + GitHub (commit c92eab9)

**Content summary:** Diagnostic comparison guide structured around the "Cushion-Ready Test" (three conditions: Chair Contour, Curve Match, Contact Consistency). Covers the biomechanics of lumbar support (filling lordosis gap, not cushioning), how each solution tracks posture over time, lordosis variation research (PLOS One, -69° to -13.6° range), when cushion is rational vs when built-in is the only fix, and why combining both is usually wrong. Explicitly NOT covered: specific product/brand recommendations, sciatica-specific advice, car seats, standing desks, active seating.

**Internal linking:**
- **Links OUT (6):** what-is-lumbar-support, the-role-of-ergonomic-office-chairs-in-preventing-back-pain, the-ultimate-guide-to-ergonomic-chairs-must-have-features-and-best-types-for-every-workspace, how-to-know-when-its-time-for-an-ergonomic-chair-upgrade, how-to-choose-office-chair-body-fit-test, best-ergonomic-office-chairs-every-budget ✓ all valid, no broken links
- **Links IN (0):** ORPHAN — no posts link to it yet
- **Pillar link:** New post does NOT link to the health-posture pillar (the-physical-benefits-of-ergonomics-why-it-matters-for-your-health) — should be added
- **Pillar → new post:** Pillar does not link here yet — should be added

**Missing links to add (WordPress edits needed):**
1. `the-physical-benefits-of-ergonomics-why-it-matters-for-your-health` (pillar) → add link here
2. `the-role-of-ergonomic-office-chairs-in-preventing-back-pain` → add inbound link here
3. `do-posture-correctors-work` → add inbound link here (related: both address alternative-to-proper-support)
4. `correct-sitting-posture-guide` → add inbound link here (mentions lumbar as part of correct posture)

**Gap filled:** gap-HP-4 (in_progress → published)

**New gaps revealed by explicitly_not_covered:** None requiring immediate action. Sciatica-specific seating advice could be a future authority gap (niche medical intent, low volume expected).

---

## 2026-04-21 — /new-post: best-office-furniture-supplier-malaysia

**Post processed:** "How to Find The Best Office Furniture Supplier Malaysia for Your Business"
**URL:** https://www.merryfair.com/latest_updates/blog/best-office-furniture-supplier-malaysia/
**Date published:** 2026-04-21

**Actions:**
- Pulled from Supabase (pre-merge)
- Re-crawled all 37 blog posts via `crawl_and_summarize.py`
- Generated `content_summary` for new post
- Assigned to cluster: `b2b-office-furniture` (3rd post in cluster)
- Initialised `hero_tier: null`, `triage_status: "none"`, `optimization: null`
- Marked gap `gap-B2BO-1776223061321` → `published` (linked to this slug)
- Full sync: Supabase + GitHub (commit 3d6a5ee)

**Content summary:** B2B procurement guide; covers entity-fit supplier matrix (SME/MNC/healthcare/education/GLC), five supplier profiles, certification stack (BIFMA/ISO9001/Greenguard Gold), eight first-call questions, warranty gap pitfalls, lead time benchmarks. Explicitly NOT covered: specific competitor pricing, online channels, fit-out design, product SKU comparisons.

**Internal linking:**
- **Links OUT (5):** office-furniture-supplier-malaysia-corporate-guide, best-ergonomic-office-chairs-every-budget, correct-sitting-posture-guide, bifma-certified-office-furniture-malaysia, office-chair-tilt-mechanism-guide ✓ all valid slugs, no broken links
- **Links IN (0):** ORPHAN — neither cluster peer (corporate-guide nor bifma post) links to this new post
- **Pillar missing:** B2B cluster pillar (gap-B2B-1) not yet published — cannot link to pillar

**Gaps revealed by explicitly_not_covered:**
- Office furniture rental/leasing options (niche, low priority)
- SME online purchasing channels (Lazada/Shopee) — low B2B intent, probably not worth pursuing

**Missing links to add (manual WordPress edits):**
1. `office-furniture-supplier-malaysia-corporate-guide` → add link to this post (direct SME readers from its intro)
2. `bifma-certified-office-furniture-malaysia` → add link to this post (in procurement section)

**Gap filled:** gap-B2BO-1776223061321 (approved → published)

---

## 2026-04-20 — Enriched manual gap: How to Find The Best Office Furniture Supplier in Malaysia

**Action:** Ran `/enrich-idea gap-B2BO-1776223061321` — enriched the manually-added gap with full research.

**Gap enriched:** `gap-B2BO-1776223061321` — "How to Find The Best Office Furniture Supplier in Malaysia (2026 Guide)"

**Key research findings:**
- User's keyword "best office furniture supplier" = 0 MY volume (global 80). Better target: "office furniture supplier malaysia" = 70/mo MY, KD ~29, commercial+local intent.
- Cannibalization risk: MEDIUM — overlaps with published post `office-furniture-supplier-malaysia-corporate-guide`, which covers large corporate fit-outs (50–300+ workstations). Differentiator: user's gap should target SMEs/small offices (5–50 workstations) with a supplier comparison format — a segment the existing post explicitly excludes.
- SERP intent: Commercial investigation. Mix of local directories and supplier comparison guides.
- AI Overview: Not detected.
- Hero target set: `best-ergonomic-office-chairs-every-budget` (update to gap-B2B-1 pillar slug once published).

**Conflicts with user input:**
- Keyword pivoted from "best office furniture supplier" (0 vol) to "office furniture supplier malaysia" (70/mo). `userNote` field records both sides.

**Links out:** corporate guide, BIFMA post, best-budget hero
**Links in:** from corporate guide intro (directing SME readers here), from BIFMA post procurement section

**Sync:** Supabase and GitHub updated — commit 13be76f.

---

## 2026-04-20 — Full sync audit, root cause found and fixed permanently

**Root cause identified:** The `master` branch (stale, months behind `main`) was the repo's default branch. GitHub scheduled workflows always run on the default branch. So `crawl.yml` ran daily on `master` (6 clusters, 13 gaps — old data), pushed that to Supabase, wiping all new data. This is why data disappeared every week.

**What was done:**
- Full audit of every sync path: PostToolUse hook, crontab, GitHub Actions, Vercel API functions
- Discovered `master` branch was default — deleted `master`, set `main` as default branch
- Discovered crontab was running from wrong directory (`/Users/merryfair/` instead of project root) — had been silently failing for weeks — removed entirely (was also a data corruption risk)
- Discovered PostToolUse hook used fragile `$CLAUDE_TOOL_INPUT` parser that silently failed — replaced with simple `git status` check in `sync-after-edit.sh`
- Restored correct JSON data (7 clusters, 36 posts, 23 gaps) from git and pushed to Supabase
- Deployed latest code to Vercel production via `vercel --prod` (`.vercel/project.json` created to link CLI)
- Created `.github/workflows/deploy-production.yml`: auto-deploys to Vercel production on every `main` push
- Fixed `crawl.yml`: now commits updated JSON back to GitHub after daily crawl
- Added all 3 GitHub secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (were already present), `VERCEL_TOKEN` (added this session)
- Confirmed `deploy-production.yml` workflow now succeeds (first successful run: `chore: trigger production deploy with VERCEL_TOKEN`)

**Decisions made:**
- Crontab removed permanently — slash commands pull from Supabase at start (sufficient); auto-pull was a data corruption risk
- `master` branch deleted permanently — all work is on `main`
- PostToolUse hook simplified to just call the script; script checks `git status` to detect real changes

**Current sync state — fully automatic, no manual steps:**
- App UI change → Supabase instantly → local on next command start
- Claude command → pulls Supabase at start → pushes at end → Vercel auto-deploys
- Claude edits JSON → hook detects via git status → pushes to Supabase → commits to GitHub → Vercel auto-deploys
- Daily crawl → runs on `main` (correct) → pushes to Supabase → commits back to GitHub → Vercel auto-deploys

**Pending / next actions:**
- None — sync is fully operational

---

## 2026-04-15 — /new-post: bifma-certified-office-furniture-malaysia

**What was done:**
- Ran `pull_from_supabase.py` — merged remote gap status changes before touching local JSON
- Ran `crawl_and_summarize.py` — re-crawled all 36 posts (sitemap now shows 36 URLs); internal link matrix refreshed
- New post `bifma-certified-office-furniture-malaysia` found: 5 outbound internal links, 0 inbound (orphan)
- Generated full `content_summary` (main_topic, subtopics_covered, angle, explicitly_not_covered, target_audience, content_type, merryfair_products_mentioned)
- Assigned to cluster: `b2b-office-furniture`
- Initialized performance fields: `hero_tier: null`, `triage_status: "none"`, `optimization: null`
- Updated gap-B2B-3 status: `in_progress` → `published` (publishedSlug set)
- Ran `full_sync.sh` — JSON copied to visual-map/public/, pushed to Supabase, committed and pushed to GitHub

**Decisions made:**
- Post content is B2B procurement-angle BIFMA explainer — correctly fills gap-B2B-3 (authority purpose)
- Content angle is distinct from deprioritized gap-BG-4 (B2C "what is BIFMA") — no cannibalization

**Internal linking issues flagged:**
- Post is an ORPHAN — no other posts link to it yet
- Pillar (gap-B2B-1) not yet published — no pillar link possible yet
- `office-furniture-supplier-malaysia-corporate-guide` does not link back to this post — should add a contextual link in its certifications section to `bifma-certified-office-furniture-malaysia`
- No links from `best-ergonomic-office-chairs-every-budget` or buying-guide posts despite BIFMA being a relevant criteria mention

**Broken links:** None — all 5 outbound slugs confirmed valid

**Pending / next actions:**
- Add inbound link from `office-furniture-supplier-malaysia-corporate-guide` certifications section → this post
- Once gap-B2B-1 (pillar listicle) is published, ensure it links to this post with anchor "BIFMA certified office furniture"
- Total published posts: 36

---

## 2026-04-14 — Sync architecture overhaul (continued)

**What was done:**
- Updated `crawl_and_summarize.py`: now pushes to Supabase immediately after saving JSON (final missing piece)
- Committed and pushed all three pending sync architecture files: `pull_from_supabase.py`, `.claude/sync-after-edit.sh`, `crawl_and_summarize.py` (commit b5429ec)

**Architecture now complete — every local write path syncs to Supabase instantly:**
- Claude Edit/Write → PostToolUse hook → `sync-after-edit.sh` → push to Supabase + git push
- Slash commands → pull at start, `full_sync.sh` at end
- `crawl_and_summarize.py` → push to Supabase after JSON save
- App gap approvals → Supabase → picked up on next workflow pull
- Local crontab (every 2 min) → `pull_from_supabase.py` → local file mirrors Supabase

**Decisions:**
- Supabase is the single source of truth; `pull_from_supabase.py` does full state replacement (no partial merge)
- `sync-after-edit.sh` is push-only (no pull — workflow already pulled at start, pulling would overwrite Claude's changes)
- `sync-from-supabase.yml` GitHub Action deleted (was routing Supabase→GitHub→local with 25 min latency, wrong approach)

**Pending:** Nothing — architecture is complete.

---

## 2026-04-14 — /new-post: office-furniture-supplier-malaysia-corporate-guide

**Post processed:** "How to Source Office Furniture for Corporate Fit-Outs in Malaysia"
**URL:** https://www.merryfair.com/latest_updates/blog/office-furniture-supplier-malaysia-corporate-guide/

**What was done:**
- Re-crawled all 35 blog posts — new post detected (4 outbound links, 0 inbound)
- Generated full `content_summary` for the new post
- Assigned to cluster: `b2b-office-furniture` — **first post in this cluster**
- Updated gap-B2B-2 status: `approved` → `published`; added `publishedSlug` field
- Set `hero_tier: null`, `triage_status: "none"`, `optimization: null`
- Saved to `merryfair_content_map.json`, copied to `visual-map/public/`, pushed to Supabase
- Updated `project-context.md`: cluster 7 now has 1 post, total post count 34 → 35, gap pipeline updated

**Gap filled:** gap-B2B-2 — "How to Source Office Furniture for Corporate Fit-Outs in Malaysia"
(Note: gap-B2B-2 was already `approved` before this post went live — no approval step needed)

**Internal linking issues flagged:**
1. **New post is an orphan** — 0 inbound contextual links. Being the cluster's first post, no other b2b-office-furniture posts exist yet to cross-link
2. **No pillar exists yet** — gap-B2B-1 (pillar listicle) not yet written; once published, it must link to this post
3. **Potential cross-cluster inbound links to add:** The `eco-friendly-ergonomic-chairs-for-sustainable-offices-with-merryfair` post (mentions sustainability/corporate buyers) could link to this post; `why-executive-comfort-is-the-new-productivity` (workspace cluster, corporate audience) is another candidate

**Outbound links from new post (all valid, no broken links):**
- `correct-sitting-posture-guide` ✓ (health-posture cluster)
- `best-ergonomic-office-chairs-every-budget` ✓ (best-budget cluster pillar)
- `eco-friendly-ergonomic-chairs-for-sustainable-offices-with-merryfair` ✓ (brand cluster)
- `office-chair-tilt-mechanism-guide` ✓ (buying-guide cluster)

**Broken links:** None

**New gaps revealed by explicitly_not_covered:**
- Corporate furniture leasing/rental in Malaysia — no existing post; low-medium priority
- Government tender/procurement process for office furniture — niche B2B angle; low priority unless keyword demand confirmed
- Specific corporate furniture categories (conference room, reception, breakout) — potential future cluster expansion posts

**Pending / next actions:**
- Owner to approve gap-B2B-1 (pillar listicle) and gap-B2B-3 (BIFMA authority) in visual map
- Once gap-B2B-1 pillar is published: update cluster `pillarSlug` and `pillarStatus`; add inbound link to this post from the pillar
- Add contextual inbound link from `eco-friendly-ergonomic-chairs-for-sustainable-offices-with-merryfair` or `why-executive-comfort-is-the-new-productivity` to this post

---

## 2026-04-12 — New cluster: b2b-office-furniture

**What was done:**
- Added 7th cluster `b2b-office-furniture` to `merryfair_content_map.json` with 3 gap entries
- Copied JSON to `visual-map/public/`, pushed to Supabase
- Cluster and gaps are now visible in the visual map Pipeline tab

**New cluster:**
- ID: `b2b-office-furniture` — "B2B office furniture & manufacturing"
- Head term: "office furniture manufacturer malaysia" / "furniture manufacturer malaysia" (100 vol, KD 16)
- Pillar status: not-created (gap-B2B-1 is the pillar candidate)
- Color: #C07D1A (amber)

**Gaps added:**

| Gap ID | Title | Keyword | Volume | Purpose |
|--------|-------|---------|--------|---------|
| gap-B2B-1 | Top Office Furniture Manufacturers in Malaysia [2026] | office furniture manufacturer malaysia | 100 (via "furniture manufacturer malaysia") | traffic — PILLAR |
| gap-B2B-2 | How to Source Office Furniture for Corporate Fit-Outs in Malaysia | office furniture supplier malaysia | 70 | traffic |
| gap-B2B-3 | BIFMA Certified Office Furniture: Why It Matters for Malaysian Businesses | BIFMA certified office furniture malaysia | ~0 | authority |

**Strategic context:**
- These gaps are driven by B2B entity-level strategy discussed in Obsidian Vault → Office Furniture Keywords.md
- Merryfair currently ranks for zero B2B keywords; all 34 posts are B2C
- Root cause: merryfair.com entity is classified by Google as a B2C ergonomic chair seller
- These 3 posts begin the topical authority shift toward office furniture manufacturer/supplier
- gap-B2B-1 (pillar listicle) uses the proven format: vaseat.com and blossomfurnishings.com listicles both rank page 1 for these queries
- gap-B2B-3 differentiates from deprioritized gap-BG-4: B2B procurement audience vs B2C consumer audience

**Decisions made:**
- No specific write-order required — all 3 are status: "suggested", awaiting approval in visual map
- All 3 gaps include full blogBrief, suggestedLinksOut, suggestedLinksIn fields per standard schema

**Pending / next actions:**
- Owner to approve/reject the 3 B2B gaps in the visual map Pipeline tab
- Once gap-B2B-1 is approved and written: update cluster `pillarSlug` and `pillarStatus` to "exists"
- B2B directory citations research complete (see Obsidian Vault) — implement listings in parallel with content

---

## 2026-04-09 — /new-post: how-to-clean-office-chair-malaysia

**Post processed:** "How to Clean and Maintain Your Office Chair in Malaysia"
**URL:** https://www.merryfair.com/latest_updates/blog/how-to-clean-office-chair-malaysia/

**What was done:**
- Re-crawled all 34 blog posts (new post detected, 4 outbound links found, 0 inbound)
- Generated full `content_summary` for the new post
- Assigned to cluster: `buying-guide` (10 posts now)
- Updated gap-BG-6 status: `suggested` → `published`
- Set `hero_tier: null`, `triage_status: "none"`, `optimization: null`
- Saved to `merryfair_content_map.json`, copied to `visual-map/public/`, pushed to Supabase
- Updated `project-context.md`: cluster count, gap pipeline, total post count (33 → 34)

**Gap filled:** gap-BG-6 — "How to clean and maintain your ergonomic office chair to make it last"

**Internal linking issues flagged:**
1. **Pillar does NOT link to new post** — `the-ultimate-guide-to-ergonomic-chairs-must-have-features-and-best-types-for-every-workspace` should add a link to the cleaning guide (e.g., in the ownership/care section)
2. **`how-to-adjust-office-chair` does not link to new post** — both are post-purchase care guides; should cross-link
3. **New post is an orphan** — 0 inbound contextual links. Minimum needed: pillar + `how-to-adjust-office-chair`

**Outbound links from new post (all valid, no broken links):**
- `office-chair-material-guide-malaysia` — already exists ✓
- `how-to-choose-the-best-ergonomic-chair-in-malaysia` — already exists ✓
- `how-to-know-when-its-time-for-an-ergonomic-chair-upgrade` — already exists ✓
- `the-ultimate-guide-to-ergonomic-chairs-must-have-features-and-best-types-for-every-workspace` — already exists ✓

**Broken links:** None

**New gaps revealed by explicitly_not_covered:**
- Chair component repair/part replacement (gas lift, mechanism) — not covered in any existing post; low priority unless demand confirmed
- Professional chair cleaning services Malaysia — very niche, low priority

**Pending / next actions:**
- Owner to add inbound links: pillar → cleaning guide; `how-to-adjust-office-chair` → cleaning guide
- Approve/reject remaining 4 gaps (HP-3, HP-4, HP-5, GM-2) in visual map

---

## 2026-04-09 (continued — Blog Brief + links in/out added to visual map)

**What was done:**
- Upgraded the Blog Brief from chat-only output to a persistent JSON field (`blogBrief`) stored on each gap entry, readable in the visual map
- Added `BlogBriefSection` component to `DetailPanel.jsx` — renders the pre-filled brief in a monospace block with a one-click **Copy** button
- `suggestedLinksOut` and `suggestedLinksIn` UI sections already existed in the gap detail panel but the data was never being written to JSON — fixed in both `/suggest-posts` and `/monthly-update` skill files
- Retroactively added `blogBrief`, `suggestedLinksOut`, `suggestedLinksIn` to all 5 gaps created today (HP-3, HP-4, HP-5, GM-2, BG-6)
- Updated `/suggest-posts` gap schema: now mandates writing all three fields for every gap
- Updated `/monthly-update` gap schema: same three fields added; report format updated (brief no longer printed in chat — just in the visual map)
- Committed and pushed to GitHub; Vercel deploy triggered automatically

**Decisions made:**
- Blog Brief lives in the JSON gap entries (not just chat output) so it's always accessible in the visual map without re-running anything
- Links in/out use `{slug, anchor, note}` schema matching the existing UI — anchor text is exact and ready to use; note specifies which section of the source post should carry the link

**Pending / next actions:**
- Owner to approve/reject the 5 new gaps in the visual map Pipeline tab
- Once a gap is approved: click its card → expand Blog Brief → Copy → paste into Claude Chat master prompt

---

## 2026-04-09 (continued — blog brief panel added to skill files)

**What was done:**
- Read `blog-creation-prompt/master-blog-prompt-v4.3.md` to identify the Section A/B input fields required when using the master prompt in Claude Chat
- Updated `/suggest-posts` skill: each suggestion now includes a collapsible `📋 Blog Brief` panel with Website Context + Section A (Full Tool Access mode) + Section B fields (Topic, Audience, Goal, Target keyword, Funnel stage, Related posts) pre-filled and ready to copy-paste
- Updated `/monthly-update` skill: same Blog Brief panel added to the "New gaps suggested" section of the printed report

**Decisions made:**
- Website Context block (Brand, URL, Products/Services) is hardcoded as static text — it never changes
- Mode is hardcoded to "Full Tool Access (Ahrefs)" since the system has Ahrefs MCP access
- Audience, Goal, Funnel stage, and Related posts are filled from each gap's rationale and closestExistingPost fields at generation time

**Pending / next actions:**
- Owner to approve/reject the 5 new suggested gaps (HP-3, HP-4, HP-5, GM-2, BG-6) in the visual map
- Once a gap is approved, use its Blog Brief panel to kick off writing in Claude Chat

---

## 2026-04-09 (continued — /suggest-posts execution)

**What was done:**
- Completed full `/suggest-posts` execution: Steps 0–7 including SERP validation and content-level cannibalization checks
- Added 5 new gap entries to merryfair_content_map.json, pushed to Supabase and visual-map/public/

**Gaps added:**
1. `gap-HP-3` — "Ergonomic chair features for back pain: what to look for and why order matters" (health-posture, **authority**)
2. `gap-HP-4` — "Built-in lumbar support vs lumbar cushion: which actually fixes your back" (health-posture, **authority**)
3. `gap-HP-5` — "Malaysia workplace ergonomics guide: DOSH regulations, OSH requirements, and what employers must provide" (health-posture, **hub**)
4. `gap-GM-2` — "Gaming ergonomics beyond the chair: monitor distance, desk height, and arm setup for long sessions" (gaming-specialized, **authority**)
5. `gap-BG-6` — "How to clean and maintain your ergonomic office chair to make it last" (buying-guide, **authority**)

**SERP validation findings:**
- "ergonomic chair for back pain" (US): Google Shopping carousel at position 1, product collection at position 2, Reddit at position 4. AI Overview present. Commercial intent dominates — reclassified candidate from traffic to authority.
- "best office chair for back support" (US): Same pattern — commercial/product-listing intent dominates. Low MY volume (0 for all back pain chair terms tested).
- "lumbar support for office chair" (MY): Shopee, Ergoworks, IKEA — pure shopping intent. Informational angle (built-in vs cushion) not served by SERP — validated as authority gap.
- "ergonomic workstation setup" (US): YouTube/Mayo Clinic/OSHA dominate, AI Overview present, DR 91-94 competition. Discarded — `ergonomic-home-office-setup-guide` already covers this at content level.
- All authority/hub gaps: SERP validation not required per methodology.

**Candidates discarded:**
- "Ergonomic workstation setup" — cannibalized by `ergonomic-home-office-setup-guide` (covers 5 zones: chair, desk, screen, peripherals, environment)
- "Lumbar support built-in vs add-on" (as traffic) — SERP is commercial/shopping; reclassified as authority

**Pending decisions for owner:**
- All 5 new gaps require owner approval before writing begins
- HP-5 (DOSH compliance hub) is the highest strategic value but requires the most research investment
- HP-3 (back pain features) and HP-4 (lumbar cushion vs built-in) should be sequenced together as a lumbar support content cluster

---

## 2026-04-09

**What was done:**
- Ran Ahrefs gap analysis session (Keywords Explorer, GSC data pull) to suggest 5 new blog posts
- Identified methodology flaw: previous gap suggestions were based on slug/title inference rather than reading actual content summaries — corrected going forward
- gap-BB-4 ("Best Study Chairs for Kids and Teenagers") formally **rejected**: the existing `best-study-chairs-students-guide` post already fully covers parents of school-age children ages 4–14, including the Rookee chair, 3-Point Growth Fit Test, and growth adjustability. The original gap rationale was wrong.
- gap-GM-1 status confirmed as **rejected** in the JSON (was incorrectly shown as approved in project-context.md)
- Built new `/suggest-posts` command (`.claude/commands/suggest-posts.md`) — enforces content-level cannibalization checks, three-purpose framework (traffic/authority/hub), Ahrefs validation, and proper gap schema
- Identified that project-context.md had multiple stale entries — GitHub, Vercel, Supabase, GitHub Actions all active but listed as "not set up"
- Began setting up full bidirectional sync: PostToolUse hook + GitHub Actions on-push + Supabase→GitHub cron + local auto-pull
- Updated project-context.md to reflect current state

**Decisions made:**
- Blog suggestion methodology: must read `content_summary.subtopics_covered` and `explicitly_not_covered` before any cannibalization claim — never infer from slug or title
- Sync architecture: Option B (GitHub as intermediary) — local → GitHub → Supabase/Vercel; Supabase → GitHub cron → local pull
- session-log.md created as running activity record for all future sessions

**Pending / next actions:**
- Write the 4 remaining valid blog post suggestions from today's session (back pain, gaming chair, lumbar support, accessories) — need SERP validation before approving
- Complete bidirectional sync setup (PostToolUse hook, GitHub Actions workflows, launchd job)
- The `best-ergonomic-office-chairs-every-budget` pillar CTR crisis (38,400 impressions, 0 clicks) — title/meta rewrite is overdue and is the single highest-ROI action available
