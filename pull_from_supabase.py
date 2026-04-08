#!/usr/bin/env python3
"""
Pull Supabase-owned fields back into the local merryfair_content_map.json.
Merges: gap statuses + optimization checklist item states.

Run this before any local work (monthly-update, new-post) to avoid
overwriting UI decisions made on the Vercel visual map.

Usage:
  python pull_from_supabase.py
"""

import json
import os
import sys
from pathlib import Path

# Load .env from project root if present
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
}

# Fetch from Supabase
resp = requests.get(
    f"{SUPABASE_URL}/rest/v1/content_map?id=eq.1&select=data",
    headers=headers,
)

if resp.status_code != 200:
    print(f"Error fetching from Supabase: {resp.status_code} {resp.text}")
    sys.exit(1)

rows = resp.json()
if not rows:
    print("No data found in Supabase content_map table.")
    sys.exit(1)

remote_data = rows[0]["data"]

# Build lookup of remote gap statuses {gap_id: status}
remote_gap_statuses = {}
for cluster in remote_data.get("clusters", []):
    for gap in cluster.get("gaps", []):
        if "id" in gap and "status" in gap:
            remote_gap_statuses[gap["id"]] = gap["status"]

# Build lookup of remote optimization item states {slug: {item_id: done}}
remote_opt_states = {}
for slug, post in remote_data.get("post_details", {}).items():
    items = post.get("optimization", {}).get("items", [])
    if items:
        remote_opt_states[slug] = {
            item["id"]: item.get("done", False)
            for item in items if "id" in item
        }

# Load local JSON
local_path = Path("merryfair_content_map.json")
with open(local_path, encoding="utf-8") as f:
    local_data = json.load(f)

# Merge gap statuses into local
gaps_merged = 0
for cluster in local_data.get("clusters", []):
    for gap in cluster.get("gaps", []):
        if gap.get("id") in remote_gap_statuses:
            old = gap.get("status", "suggested")
            new = remote_gap_statuses[gap["id"]]
            if old != new:
                gap["status"] = new
                gaps_merged += 1

# Merge optimization item states into local
items_merged = 0
for slug, post in local_data.get("post_details", {}).items():
    items = post.get("optimization", {}).get("items", [])
    slug_states = remote_opt_states.get(slug, {})
    for item in items:
        if item.get("id") in slug_states:
            old = item.get("done", False)
            new = slug_states[item["id"]]
            if old != new:
                item["done"] = new
                items_merged += 1

# Save local copy
with open(local_path, "w", encoding="utf-8") as f:
    json.dump(local_data, f, indent=2, ensure_ascii=False)

# Also update visual-map/public copy
vm_path = Path("visual-map/public/merryfair_content_map.json")
if vm_path.exists():
    with open(vm_path, "w", encoding="utf-8") as f:
        json.dump(local_data, f, indent=2, ensure_ascii=False)

print(f"Pull complete — {gaps_merged} gap status(es) and {items_merged} checklist item(s) synced from Supabase.")
