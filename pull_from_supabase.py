#!/usr/bin/env python3
"""
Pull the full content map from Supabase and write it to local files.

Supabase is the single source of truth. This script makes the local file
match Supabase exactly — no partial merging, no conflict risk.

Run this at the START of every slash command workflow before making any changes.

Usage:
  python3 pull_from_supabase.py
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

# Write to both local copies — Supabase is the source of truth
local_path  = Path("merryfair_content_map.json")
public_path = Path("visual-map/public/merryfair_content_map.json")

with open(local_path, "w", encoding="utf-8") as f:
    json.dump(remote_data, f, indent=2, ensure_ascii=False)

if public_path.exists():
    with open(public_path, "w", encoding="utf-8") as f:
        json.dump(remote_data, f, indent=2, ensure_ascii=False)

print("Pull complete — local file is now in sync with Supabase.")
