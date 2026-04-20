#!/bin/bash
# Fires via PostToolUse hook after every Claude Write/Edit.
# Checks git status to see if merryfair_content_map.json actually changed.
# If yes: pushes to Supabase and commits to GitHub. Logs all outcomes visibly.

cd /Users/merryfair/seo-blog-map

# Only proceed if the root JSON file has been modified
if ! git status --porcelain merryfair_content_map.json 2>/dev/null | grep -q .; then
    exit 0
fi

echo "[sync] merryfair_content_map.json changed — syncing..."

cp merryfair_content_map.json visual-map/public/merryfair_content_map.json

if python3 push_to_supabase.py; then
    echo "[sync] ✓ Supabase updated"
else
    echo "[sync] ✗ WARNING: Supabase push FAILED — run 'python3 push_to_supabase.py' manually"
fi

git add merryfair_content_map.json visual-map/public/merryfair_content_map.json
if ! git diff --cached --quiet; then
    git commit -m "chore: auto-sync content map"
    git pull --rebase origin main 2>/dev/null || true
    if git push origin main; then
        echo "[sync] ✓ GitHub updated"
    else
        echo "[sync] ✗ WARNING: GitHub push FAILED"
    fi
fi
