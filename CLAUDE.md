# Merryfair SEO Content Architecture System

## On every session start
1. Read `project-context.md` — full current project status, completed phases, pending decisions. Do not ask the user to explain what the project is.
2. Read `session-log.md` — the chronological activity log. The most recent entry tells you exactly where things were left off.

## On every session end (mandatory)
Append a new entry to the TOP of `session-log.md` with:
- Date
- What was done (actions taken, commands run, files changed)
- Decisions made
- Pending / next actions

Then update `project-context.md` for any sections that changed. Do both automatically without being asked.

## Auto-update project-context.md after every major action
After completing any of the following, update `project-context.md` automatically without being asked:
- A new blog post is published and processed via `/new-post`
- A gap status changes (suggested → approved / rejected / published / deprioritized)
- `/monthly-update` completes (update performance data, new gaps, last run date)
- `/linking-audit` completes and links are actioned
- `/suggest-posts` runs and adds new gaps to the JSON
- A new cluster is created or a pillar page is published
- Any infrastructure change (new command, new workflow, sync setup)
- Any "What has NOT been done yet" item is completed
Update only the relevant sections. Keep the file accurate at all times.

## What this project is
SEO content management system for merryfair.com's blog. Tracks 33 blog posts in 6 topic clusters, monitors performance data, identifies content gaps, and manages internal linking. Merryfair is a Malaysian ergonomic chair manufacturer established 1974.

## Key files
- `merryfair_content_map.json` — THE source of truth. All clusters, posts, gaps, summaries, internal links, performance data. Every command reads from and writes to this file.
- `project-context.md` — Full project state. Updated after every session.
- `session-log.md` — Chronological activity log. Append-only. Most recent entry at top.
- `seo-strategy-context.md` — SEO strategy, three-purpose framework (traffic/authority/hub), hero pages, gap rules, cannibalization rules. Read this before any gap analysis.
- `crawl_and_summarize.py` — Crawls all blog posts, extracts internal links and body text.
- `push_to_supabase.py` / `pull_from_supabase.py` — Supabase sync scripts. Auth loads from `.env`.
- `merryfair_master_inventory.xlsx` — Reference spreadsheet with merged GSC/Ahrefs/GA4 data.

## Blog URL pattern
All blog posts live at: `https://www.merryfair.com/latest_updates/blog/[slug]/`

## The 6 topic clusters
1. **buying-guide** — "How to choose an ergonomic chair" (pillar: the-ultimate-guide-to-ergonomic-chairs-must-have-features-and-best-types-for-every-workspace)
2. **best-budget** — "Best chairs by budget" (pillar: best-ergonomic-office-chairs-every-budget)
3. **health-posture** — "Health & posture" (pillar: the-physical-benefits-of-ergonomics-why-it-matters-for-your-health)
4. **gaming** — "Gaming & specialized" (pillar: gaming-chair-vs-office-chair-which-one-should-you-really-buy)
5. **workspace** — "Workspace design & productivity" (pillar: ergonomic-home-office-setup-guide — published 2026-03-24)
6. **brand** — "Brand & seasonal" (no pillar needed)

## Critical rules for gap analysis
- A post with zero organic traffic can still be valuable for topical authority, EEAT, conversion contribution, or internal link centrality. Never recommend noindexing or deleting without checking ALL value dimensions.
- **Cannibalization checks are content-level, not keyword-level.** Read `content_summary.subtopics_covered` and `content_summary.explicitly_not_covered` for the closest existing post before claiming a gap exists. Never infer from slug names or titles alone.
- Every gap suggestion MUST include: which keyword, what search volume (MY and global), what intent is unmet, what the closest existing post actually says, and why it doesn't fully address the gap.
- For low/zero volume suggestions, flag the volume but explain strategic rationale (topical completeness, cluster coherence, EEAT).
- Every gap must have a `purpose` field: `traffic` / `authority` / `hub`.
- Do not suggest new gaps if there are already 5+ approved gaps — publish existing backlog first.

## Master content standard
The master blog creation prompt is the single standard for all content creation and optimization work. It lives at:
`blog-creation-prompt/master-blog-prompt-v4.3.md` (in this repo)
Always read this file before any content or optimization task. When a newer version is added to this folder, always use the most recently modified `.md` file.

## Available slash commands
- `/new-post [url]` — Process a newly published blog post (crawl, summarize, assign cluster, check links)
- `/monthly-update` — Monthly data refresh with fresh CSV exports (merge data, find gaps, report)
- `/linking-audit` — Full internal linking health check
- `/optimize-post [slug]` — Full audit of an existing post against the master content standard
- `/suggest-posts [n] [cluster] [purpose]` — Suggest new blog posts using content-level gap methodology

## Sidebar links to exclude from linking analysis
The site has a "Read More" sidebar section that creates sitewide links to recent posts. These are NOT contextual editorial links. Any slug appearing as an outbound link from 20+ posts is a sidebar link — exclude from linking analysis.

## Infrastructure
- GitHub: `github.com/Merryfair-Chair/seo-blog-map` (active)
- Vercel: Visual map deployed and live (connected to GitHub repo)
- Supabase: Active — JSON synced via push/pull scripts
- GitHub Actions: `crawl.yml` — daily crawl at 10am MYT + Supabase push + WordPress webhook trigger
