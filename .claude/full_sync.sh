#!/bin/bash
# Full sync: copy JSON, push to Supabase, commit and push to GitHub.
# Call this at the END of every slash command workflow after all JSON changes are done.
# Call python3 pull_from_supabase.py at the START of every workflow before making changes.
#
# Usage: bash /Users/merryfair/seo-blog-map/.claude/full_sync.sh

set -e
cd /Users/merryfair/seo-blog-map

echo "[sync] Copying JSON to visual-map/public/..."
cp merryfair_content_map.json visual-map/public/merryfair_content_map.json

echo "[sync] Pushing to Supabase..."
python3 push_to_supabase.py

echo "[sync] Committing and pushing to GitHub..."
git add merryfair_content_map.json visual-map/public/merryfair_content_map.json
if ! git diff --cached --quiet; then
    git commit -m "chore: auto-sync content map"
    git pull --rebase origin main 2>/dev/null || true
    git push origin main
    echo "[sync] Done — Supabase and GitHub updated."
else
    echo "[sync] No JSON changes to commit."
fi
