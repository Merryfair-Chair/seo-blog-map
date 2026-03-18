# Merryfair SEO Content Architecture System

## Quick start

```bash
# 1. Unzip the project
unzip merryfair-seo-project.zip -d merryfair-seo
cd merryfair-seo

# 2. Install dependencies (one time only)
pip install requests beautifulsoup4

# 3. Open Claude Code
claude
```

That's it. Claude Code reads CLAUDE.md automatically and knows the entire project context.

## How it works

Claude Code reads `CLAUDE.md` when it opens in this folder. That file tells it everything: what the project is, where the data lives, what the clusters are, and what rules to follow. You never need to explain the project again.

The data lives in `merryfair_content_map.json`. Every command reads from and writes to this file.

## Three slash commands

### When you publish a new blog post:
```
/new-post https://www.merryfair.com/latest_updates/blog/your-new-post-slug/
```
This automatically crawls the post, generates a content summary, assigns it to the right cluster, checks internal linking, and flags any missing links.

### Monthly performance refresh:
```
/monthly-update
```
Before running: drop fresh CSV exports from GSC, Ahrefs, and GA4 into the folder. The command merges performance data, finds new content gaps, and prints a full report.

### Internal linking health check:
```
/linking-audit
```
Re-crawls all posts and reports which cluster posts don't link to their pillar, which pillars don't link to their cluster posts, and which posts are orphaned.

## What each file does

| File | Purpose |
|------|---------|
| CLAUDE.md | Project instructions Claude Code reads automatically |
| .claude/commands/new-post.md | Slash command: process new blog post |
| .claude/commands/monthly-update.md | Slash command: monthly data refresh + gap analysis |
| .claude/commands/linking-audit.md | Slash command: internal link health check |
| merryfair_content_map.json | Source of truth — all clusters, posts, gaps, links, summaries |
| crawl_and_summarize.py | Crawls blog posts, extracts links and text |
| check_new_posts.py | Auto-detects new posts not yet in the map |
| merryfair_master_inventory.xlsx | Raw merged data from GSC + Ahrefs + GA4 |
| merryfair_linking_audit.xlsx | Internal linking action items spreadsheet |
| merryfair_cluster_map.jsx | Interactive cluster visualization (runs in Claude chat) |

## Monthly CSV exports needed

Same process each time — browser exports, no API needed:

**GSC:** Performance > Search results > last 12 months > export Pages tab and Queries tab

**Ahrefs:** Site Explorer > merryfair.com > Top Pages (filter to /latest_updates/blog/) > Export CSV. Then Organic Keywords (same filter) > Export CSV

**GA4:** Reports > Pages and screens > last 12 months > add "Session default channel group" dimension > filter to /latest_updates/blog/ > Export CSV

## Moving to a new laptop

Push this folder to GitHub. On new machine: `git clone`, `pip install requests beautifulsoup4`, open Claude Code. Done.
