#!/usr/bin/env python3
"""
Push merryfair_content_map.json to Supabase.
Used by GitHub Actions after every crawl, and can be run locally.

Usage:
  SUPABASE_URL=... SUPABASE_SERVICE_KEY=... python push_to_supabase.py
"""

import json
import os
import sys

try:
    import requests
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://kbliildkudzkxcskztvn.supabase.co")
SERVICE_KEY  = os.environ["SUPABASE_SERVICE_KEY"]

with open("merryfair_content_map.json", encoding="utf-8") as f:
    data = json.load(f)

headers = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates",
}

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
