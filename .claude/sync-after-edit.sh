#!/bin/bash
# Called by Claude Code PostToolUse hook whenever merryfair_content_map.json is edited.
#
# Guarantees that ALL app decisions (gap statuses, new ideas, optimization states)
# are pulled from Supabase BEFORE committing, so redeployments never wipe app data.
#
# set -e means: any failure exits immediately — the commit only runs if pull succeeds.

set -e

cd /Users/merryfair/seo-blog-map

echo "[sync] Pulling latest app data from Supabase..."
python3 pull_from_supabase.py

# Ensure both JSON copies are in sync after the pull
cp merryfair_content_map.json visual-map/public/merryfair_content_map.json

# Stage both files
git add merryfair_content_map.json visual-map/public/merryfair_content_map.json

# Commit only if there are staged changes
if ! git diff --cached --quiet; then
    git commit -m "chore: auto-sync content map"
    git push origin main
    echo "[sync] Committed and pushed to GitHub"
else
    echo "[sync] No changes to commit"
fi
