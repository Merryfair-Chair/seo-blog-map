# Merryfair SEO — Session Log

Append a new entry at the top after every Claude Code session. One entry per session. Keep entries concise — decisions, actions taken, and anything that changes project state. Full context lives in `project-context.md`.

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
