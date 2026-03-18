# Merryfair SEO Content Architecture System

## On every session start
Read `project-context.md` immediately. It contains the full current project status, completed phases, content calendar, and pending decisions. Do not ask the user to explain what the project is — it's all in that file.

## Auto-update project-context.md after every major action
After completing any of the following, update `project-context.md` automatically without being asked:
- A new blog post is published and processed via `/new-post`
- A gap status changes (suggested → approved / rejected / published)
- `/monthly-update` completes (update performance data, new gaps, last run date)
- `/linking-audit` completes and links are actioned
- A new cluster is created or a pillar page is published
- The visual map app is built or deployed
- Any "What has NOT been done yet" item is completed
Update only the relevant sections. Keep the file accurate to current state at all times.

## What this project is
This is the SEO content management system for merryfair.com's blog. It tracks 26+ blog posts organized into topic clusters, monitors performance data, identifies content gaps, and manages internal linking.

## Key files
- `merryfair_content_map.json` — THE source of truth. All clusters, posts, gaps, summaries, internal links. Every command reads from and writes to this file.
- `crawl_and_summarize.py` — Crawls all blog posts, extracts internal links and body text. Run whenever posts are added or updated.
- `merryfair_master_inventory.xlsx` — Reference spreadsheet with merged GSC/Ahrefs/GA4 data.
- `merryfair_linking_audit.xlsx` — Internal linking action items.

## Blog URL pattern
All blog posts live at: `https://www.merryfair.com/latest_updates/blog/[slug]/`

## The 6 topic clusters
1. **buying-guide** — "How to choose an ergonomic chair" (pillar: ultimate-guide-to-ergonomic-chairs)
2. **best-budget** — "Best chairs by budget" (pillar: best-ergonomic-office-chairs-every-budget)
3. **health-posture** — "Health & posture" (pillar: the-physical-benefits-of-ergonomics)
4. **gaming** — "Gaming & specialized" (pillar: gaming-chair-vs-office-chair)
5. **workspace** — "Workspace design & productivity" (NO PILLAR YET — needs creation)
6. **brand** — "Brand & seasonal" (no pillar needed)

## Critical rules for gap analysis
From the SEO strategy document — follow these always:
- A post with zero organic traffic can still be valuable for topical authority, EEAT, conversion contribution, or internal link centrality. Never recommend noindexing or deleting a post without checking ALL value dimensions.
- Every gap suggestion MUST explain WHY it's a genuine gap — which keyword, what search volume, what intent is unmet, what the closest existing post covers and why it doesn't fully address it. Generic topical suggestions are not acceptable.
- For low/zero volume suggestions, flag the volume but still explain strategic rationale if one exists (topical completeness, cluster coherence).
- Before suggesting a new post, always check if an existing post already covers the topic partially. If it does, the right output may be "optimize this existing post" rather than "write a new one."

## Available slash commands
- `/new-post [url]` — Process a newly published blog post (crawl, summarize, assign cluster, check links)
- `/monthly-update` — Monthly data refresh with fresh CSV exports (merge data, find gaps, report)
- `/linking-audit` — Full internal linking health check

## Sidebar links to exclude from linking analysis
The site has a "Read More" sidebar section that creates sitewide links to recent posts. These are NOT contextual editorial links. Any slug appearing as an outbound link from 20+ posts is a sidebar link — exclude from linking analysis.
