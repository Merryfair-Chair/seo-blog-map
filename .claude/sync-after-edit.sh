#!/bin/bash
# Fires via PostToolUse hook whenever Claude edits merryfair_content_map.json.
#
# No pull here — the workflow already pulled from Supabase at its start,
# so the local file is already based on the latest state. Just push the
# change to Supabase immediately and commit to GitHub.

set -e
cd /Users/merryfair/seo-blog-map

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
