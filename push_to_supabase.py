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
from pathlib import Path

# Load .env from project root if present (so SUPABASE_SERVICE_KEY doesn't need to be exported manually)
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
