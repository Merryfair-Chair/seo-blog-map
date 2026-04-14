#!/bin/bash
# Called by Claude Code PostToolUse hook whenever merryfair_content_map.json is edited.
#
# Order matters:
#   1. Pull from Supabase first — preserves any gap status/idea changes made in the Vercel UI
#   2. Copy merged JSON to visual-map/public/
#   3. Push to Supabase immediately — Vercel app sees the change right away (no GitHub Actions delay)
#   4. Commit and push to GitHub — keeps the repo in sync

set -e
cd /Users/merryfair/seo-blog-map

echo "[sync] Pulling latest app data from Supabase..."
python3 pull_from_supabase.py

cp merryfair_content_map.json visual-map/public/merryfair_content_map.json

echo "[sync] Pushing to Supabase..."
python3 push_to_supabase.py

git add merryfair_content_map.json visual-map/public/merryfair_content_map.json
if ! git diff --cached --quiet; then
    git commit -m "chore: auto-sync content map"
    git pull --rebase origin main 2>/dev/null || true
    git push origin main
    echo "[sync] Committed and pushed to GitHub"
else
    echo "[sync] No changes to commit"
fi
