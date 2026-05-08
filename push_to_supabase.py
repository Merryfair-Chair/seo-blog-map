#!/usr/bin/env python3
"""
Push merryfair_content_map.json to Supabase.
Used by GitHub Actions after every crawl, and can be run locally.

Before pushing, fetches the current Supabase state and merges user-set
statuses (done, verified, dismissed) so that marking an item done in the
app is never overwritten by a local push.

Merge rules:
  link_queue items   — status rank: pending < done < verified
                       Supabase status wins if it is more advanced than local.
  link_health_issues — dismissed in Supabase is preserved even if local says open.

Usage:
  SUPABASE_URL=... SUPABASE_SERVICE_KEY=... python push_to_supabase.py
"""

import json
import os
import sys
from pathlib import Path

env_file = Path(__file__).parent / ".env"
if env_file.exists():
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

try:
    import requests
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://kbliildkudzkxcskztvn.supabase.co")
SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_KEY")

if not SERVICE_KEY:
    print("Error: SUPABASE_SERVICE_KEY not found. Add it to .env in the project root.")
    sys.exit(1)

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates",
}

# ── Load local data ────────────────────────────────────────────────────────────
with open("merryfair_content_map.json", encoding="utf-8") as f:
    data = json.load(f)

# ── Fetch current Supabase state ───────────────────────────────────────────────
resp = requests.get(
    f"{SUPABASE_URL}/rest/v1/content_map?id=eq.1&select=data",
    headers=headers,
)

remote_queue_by_id   = {}
remote_issues_by_id  = {}

if resp.status_code == 200:
    rows = resp.json()
    if rows:
        remote = rows[0]["data"]
        remote_queue_by_id  = {item["id"]: item for item in remote.get("link_queue", [])}
        remote_issues_by_id = {item["id"]: item for item in remote.get("link_health_issues", [])}
else:
    print(f"Warning: could not fetch Supabase state for merge ({resp.status_code}). Pushing local data as-is.")

# ── Status rank helpers ────────────────────────────────────────────────────────
QUEUE_RANK   = {"pending": 0, "done": 1, "verified": 2}
ISSUE_RANK   = {"open": 0, "dismissed": 1}

def merge_queue(local_items):
    merged = []
    for item in local_items:
        remote_item = remote_queue_by_id.get(item["id"])
        if remote_item:
            # _sync_reset=True means sync-links deliberately downgraded this item.
            # Local always wins in that case — never let Supabase's stale status override it.
            if item.get("_sync_reset"):
                item = {k: v for k, v in item.items() if k != "_sync_reset"}
            else:
                local_rank  = QUEUE_RANK.get(item.get("status", "pending"), 0)
                remote_rank = QUEUE_RANK.get(remote_item.get("status", "pending"), 0)
                if remote_rank > local_rank:
                    # Preserve the more-advanced status and done_date from Supabase
                    item = {**item, "status": remote_item["status"], "done_date": remote_item.get("done_date")}
        merged.append(item)
    return merged

def merge_issues(local_items):
    merged = []
    for item in local_items:
        remote_item = remote_issues_by_id.get(item["id"])
        if remote_item:
            local_rank  = ISSUE_RANK.get(item.get("status", "open"), 0)
            remote_rank = ISSUE_RANK.get(remote_item.get("status", "open"), 0)
            if remote_rank > local_rank:
                item = {**item, "status": remote_item["status"], "dismissed_date": remote_item.get("dismissed_date")}
        merged.append(item)
    return merged

# ── Apply merge ────────────────────────────────────────────────────────────────
if remote_queue_by_id:
    original_statuses  = {i["id"]: i.get("status") for i in data.get("link_queue", [])}
    data["link_queue"] = merge_queue(data.get("link_queue", []))
    preserved = [
        i["id"] for i in data["link_queue"]
        if i.get("status") != original_statuses.get(i["id"])
    ]
    if preserved:
        print(f"Preserved {len(preserved)} status(es) from Supabase: {preserved}")

if remote_issues_by_id:
    data["link_health_issues"] = merge_issues(data.get("link_health_issues", []))

# ── Write merged data back to local file ──────────────────────────────────────
with open("merryfair_content_map.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

local_public = Path("visual-map/public/merryfair_content_map.json")
if local_public.exists():
    with open(local_public, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# ── Push merged data to Supabase ──────────────────────────────────────────────
resp = requests.post(
    f"{SUPABASE_URL}/rest/v1/content_map",
    headers=headers,
    json={"id": 1, "data": data},
)

if resp.status_code in (200, 201):
    print("Supabase updated successfully")
else:
    print(f"Supabase update failed: {resp.status_code} {resp.text}")
    sys.exit(1)
