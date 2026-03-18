#!/usr/bin/env python3
"""
Webhook listener for WordPress publish events.
When a new blog post is published, this script automatically:
1. Runs the crawl
2. Updates the content map
3. Sends you a summary via email or saves a report

SETUP OPTIONS (pick one):

=== OPTION A: Simple — run manually after publishing ===
Just use the Claude Code slash command instead:
  /new-post https://www.merryfair.com/latest_updates/blog/your-new-post-slug/

=== OPTION B: Semi-auto — cron job that checks for new posts ===
Add to crontab (runs every 6 hours):
  0 */6 * * * cd /path/to/merryfair-seo && python3 check_new_posts.py

=== OPTION C: Full auto — WordPress webhook ===
1. Install "WP Webhooks" plugin in WordPress
2. Set it to fire a POST request to your server when a post is published
3. Run this script as a listener on your server

For most users, Option A (slash command) is the right choice.
Option C requires a server running 24/7 to receive webhooks.
"""

import json
import subprocess
import sys
import os
from datetime import datetime

MAP_FILE = "merryfair_content_map.json"
BLOG_BASE = "https://www.merryfair.com/latest_updates/blog/"


def check_for_new_posts():
    """Compare sitemap against content map to find new posts."""
    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError:
        print("pip install requests beautifulsoup4")
        return []

    # Load current map
    with open(MAP_FILE) as f:
        data = json.load(f)

    known_slugs = set(data.get("post_details", {}).keys())

    # Fetch the blog listing page to find all current posts
    # (or you could fetch the sitemap XML if available)
    resp = requests.get("https://www.merryfair.com/latest-updates/blog/",
                        timeout=30,
                        headers={"User-Agent": "MerryfairBot/1.0"})
    soup = BeautifulSoup(resp.text, "html.parser")

    found_slugs = set()
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "/latest_updates/blog/" in href:
            parts = href.rstrip("/").split("/")
            slug = parts[-1]
            if slug and slug != "blog":
                found_slugs.add(slug)

    new_slugs = found_slugs - known_slugs
    return list(new_slugs)


def process_new_post(slug):
    """Run the full new-post pipeline for a single slug."""
    url = f"{BLOG_BASE}{slug}/"
    print(f"\n{'='*60}")
    print(f"NEW POST DETECTED: {slug}")
    print(f"URL: {url}")
    print(f"Time: {datetime.now().isoformat()}")
    print(f"{'='*60}")

    # Step 1: Re-run crawl
    print("\n[1/2] Running crawl...")
    result = subprocess.run(
        [sys.executable, "crawl_and_summarize.py"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"Crawl error: {result.stderr}")
        return False
    print("Crawl complete.")

    # Step 2: Report
    with open(MAP_FILE) as f:
        data = json.load(f)

    if slug in data.get("post_details", {}):
        post = data["post_details"][slug]
        print(f"\n[2/2] Post added to map:")
        print(f"  Title: {post.get('title', 'unknown')}")
        print(f"  Word count: {post.get('word_count', 0)}")
        print(f"  Internal links out: {post.get('internal_links_out_count', 0)}")
        print(f"  Internal links in: {post.get('internal_links_in_count', 0)}")
        print(f"  Models mentioned: {post.get('models_mentioned', [])}")

        if post.get("internal_links_in_count", 0) == 0:
            print(f"\n  ⚠ WARNING: This post is an ORPHAN — no other post links to it.")
            print(f"  ACTION: Add a link to this post from the cluster pillar.")

        print(f"\n  NEXT: Open Claude Code and run:")
        print(f"  /new-post {url}")
        print(f"  This will generate the content summary and assign it to a cluster.")
        return True
    else:
        print(f"  ERROR: Post {slug} not found in map after crawl.")
        return False


def main():
    if len(sys.argv) > 1:
        # Manual mode: process a specific URL
        url = sys.argv[1]
        slug = url.rstrip("/").split("/")[-1]
        process_new_post(slug)
    else:
        # Auto mode: check for new posts
        print("Checking for new posts...")
        new_posts = check_for_new_posts()
        if new_posts:
            print(f"Found {len(new_posts)} new post(s)!")
            for slug in new_posts:
                process_new_post(slug)
        else:
            print("No new posts found. Map is up to date.")


if __name__ == "__main__":
    main()
