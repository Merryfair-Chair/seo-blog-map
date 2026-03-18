#!/usr/bin/env python3
"""
Merryfair Blog Content Crawl Script
====================================
Fetches all 26 blog posts, extracts internal links, and saves
raw content for Claude Code to summarize.

NO API KEY NEEDED. Only uses requests + BeautifulSoup.

After running, ask Claude Code:
  "Read merryfair_content_map.json and generate a structured
   content summary for each post using the extracted_text field.
   Write the summaries back into the content_summary field."

Requirements:
  pip install requests beautifulsoup4

Usage:
  python crawl_and_summarize.py
"""

import json
import re
import time
import os

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing required packages...")
    import subprocess
    subprocess.check_call(["pip", "install", "requests", "beautifulsoup4"])
    import requests
    from bs4 import BeautifulSoup


BASE_URL = "https://www.merryfair.com"
BLOG_PATH = "/latest_updates/blog/"
MAP_FILE = "merryfair_content_map.json"

BLOG_SLUGS = [
    "why-executive-comfort-is-the-new-productivity",
    "redefine-holiday-gifting-with-merryfair-ergonomic-chairs",
    "gaming-chair-vs-office-chair-which-one-should-you-really-buy",
    "playing-with-colours-workspace-decor-to-boost-inspiration",
    "cute-ergonomic-chairs-for-a-stylish-comfortable-cafe-experience",
    "eco-friendly-ergonomic-chairs-for-sustainable-offices-with-merryfair",
    "the-ultimate-guide-to-ergonomic-chairs-must-have-features-and-best-types-for-every-workspace",
    "be-a-true-gamer-with-ronin-the-best-gaming-chair-in-malaysia",
    "office-chairs-to-sit-with-power-focus-and-intention",
    "how-to-choose-the-best-ergonomic-chair-for-solo-movie-nights",
    "6-affordable-ergonomic-chairs-for-your-home-and-office",
    "how-to-choose-the-best-ergonomic-chair-in-malaysia",
    "how-merryfair-redefines-ergonomics-for-gamers-in-malaysia",
    "why-everyones-switching-to-ergonomics-swivel-chairs-in-2025",
    "upgrade-your-workspace-affordable-working-chairs-under-rm1000",
    "do-posture-correctors-work",
    "best-ergonomic-office-chairs-every-budget",
    "office-chair-material-guide-malaysia",
    "how-to-choose-office-chair-body-fit-test",
    "what-is-lumbar-support",
    "how-to-know-when-its-time-for-an-ergonomic-chair-upgrade",
    "the-role-of-ergonomic-office-chairs-in-preventing-back-pain",
    "the-physical-benefits-of-ergonomics-why-it-matters-for-your-health",
    "effects-of-poor-sitting-posture-and-how-ergonomics-can-help",
    "best-study-chairs-students-guide",
    "office-chair-tilt-mechanism-guide",
]


def fetch_blog_post(slug):
    url = f"{BASE_URL}{BLOG_PATH}{slug}/"
    print(f"  Fetching: {slug}...")

    try:
        resp = requests.get(url, timeout=30, headers={
            "User-Agent": "Mozilla/5.0 (compatible; MerryfairContentAudit/1.0)"
        })
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  ERROR: {e}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")

    for tag in soup.find_all(["nav", "header", "footer", "script", "style",
                               "noscript", "iframe"]):
        tag.decompose()

    main_content = (
        soup.find("article") or
        soup.find("div", class_=re.compile(r"entry-content|post-content|blog-content", re.I)) or
        soup.find("main") or
        soup.find("body") or
        soup
    )

    title_tag = soup.find("h1")
    title = title_tag.get_text(strip=True) if title_tag else slug.replace("-", " ").title()

    body_text = main_content.get_text(separator="\n", strip=True)
    body_text = re.sub(r"\n{3,}", "\n\n", body_text)

    all_links = []
    for a_tag in soup.find_all("a", href=True):
        href = a_tag["href"]
        if href.startswith("/"):
            href = BASE_URL + href
        all_links.append(href)

    self_url = f"{BASE_URL}{BLOG_PATH}{slug}/"
    blog_links_out = []
    for link in all_links:
        if BLOG_PATH in link and link != self_url:
            match = re.search(rf"{re.escape(BLOG_PATH)}([^/]+)/?", link)
            if match:
                linked_slug = match.group(1)
                if linked_slug != slug and linked_slug not in blog_links_out:
                    blog_links_out.append(linked_slug)

    product_links = set(l for l in all_links if "/products/" in l or "/store/" in l)

    text_lower = body_text.lower()
    all_models = ["wau", "zenit", "aire", "ronin", "spinelly", "boba", "saga",
                  "forte", "nez", "apollo", "anggun", "sonoma", "regent",
                  "fulkrum", "reya", "pogo", "kaden", "velo", "delphi", "lira",
                  "rookee"]
    models_found = [m.title() for m in all_models if m in text_lower]

    return {
        "slug": slug,
        "url": self_url,
        "title": title,
        "word_count": len(body_text.split()),
        "extracted_text": body_text[:5000],
        "internal_blog_links_out": blog_links_out,
        "product_links_count": len(product_links),
        "models_mentioned": models_found,
    }


def build_link_matrix(all_posts):
    matrix = {}
    for post in all_posts:
        matrix[post["slug"]] = {
            "links_out_to": post["internal_blog_links_out"],
            "linked_from": [],
        }

    for post in all_posts:
        for target_slug in post["internal_blog_links_out"]:
            if target_slug in matrix:
                matrix[target_slug]["linked_from"].append(post["slug"])

    return matrix


def update_content_map(all_posts, link_matrix):
    if os.path.exists(MAP_FILE):
        with open(MAP_FILE, "r") as f:
            content_map = json.load(f)
    else:
        print(f"WARNING: {MAP_FILE} not found. Creating new.")
        content_map = {"meta": {}, "clusters": []}

    content_map["post_details"] = {}

    for post in all_posts:
        slug = post["slug"]
        links = link_matrix.get(slug, {"links_out_to": [], "linked_from": []})

        content_map["post_details"][slug] = {
            "title": post["title"],
            "url": post["url"],
            "word_count": post["word_count"],
            "extracted_text": post["extracted_text"],
            "models_mentioned": post["models_mentioned"],
            "internal_links_out": links["links_out_to"],
            "internal_links_in": links["linked_from"],
            "internal_links_out_count": len(links["links_out_to"]),
            "internal_links_in_count": len(links["linked_from"]),
            "product_links_count": post["product_links_count"],
            "content_summary": None,
        }

    content_map["meta"]["last_crawl"] = time.strftime("%Y-%m-%d %H:%M:%S")
    content_map["meta"]["posts_crawled"] = len(all_posts)

    details = content_map["post_details"]
    orphans = [s for s, d in details.items() if d["internal_links_in_count"] == 0]
    islands = [s for s, d in details.items()
               if d["internal_links_out_count"] == 0 and d["internal_links_in_count"] == 0]
    most_linked = sorted(details.items(),
                         key=lambda x: x[1]["internal_links_in_count"], reverse=True)[:5]
    avg_out = round(sum(d["internal_links_out_count"] for d in details.values()) / len(details), 1)

    content_map["linking_health"] = {
        "orphan_posts_no_inbound_links": orphans,
        "island_posts_no_links_at_all": islands,
        "most_linked_to": [{"slug": s, "inbound_count": d["internal_links_in_count"]}
                           for s, d in most_linked],
        "average_outbound_links": avg_out,
    }

    with open(MAP_FILE, "w") as f:
        json.dump(content_map, f, indent=2, default=str)

    return content_map


def main():
    print("=" * 60)
    print("MERRYFAIR BLOG CONTENT CRAWL")
    print("No API key needed")
    print("=" * 60)

    print(f"\n[1/3] Fetching {len(BLOG_SLUGS)} blog posts...")
    all_posts = []
    for slug in BLOG_SLUGS:
        result = fetch_blog_post(slug)
        if result:
            all_posts.append(result)
        time.sleep(1)

    print(f"\n  Fetched: {len(all_posts)}/{len(BLOG_SLUGS)}")

    print("\n[2/3] Building internal link matrix...")
    link_matrix = build_link_matrix(all_posts)

    print(f"\n  {'Post':<55s} {'Out':>4s} {'In':>4s}")
    print("  " + "-" * 65)
    max_in = max((len(v["linked_from"]) for v in link_matrix.values()), default=0)
    for slug, links in sorted(link_matrix.items(),
                               key=lambda x: len(x[1]["linked_from"]), reverse=True):
        out_c = len(links["links_out_to"])
        in_c = len(links["linked_from"])
        marker = ""
        if in_c == 0 and out_c == 0:
            marker = " ISLAND"
        elif in_c == 0:
            marker = " ORPHAN"
        elif in_c == max_in:
            marker = " <-- most linked"
        print(f"  {slug[:55]:<55s} {out_c:>4d} {in_c:>4d}{marker}")

    print("\n[3/3] Updating content map...")
    content_map = update_content_map(all_posts, link_matrix)

    health = content_map["linking_health"]
    print("\n" + "=" * 60)
    print("LINKING HEALTH REPORT")
    print("=" * 60)

    print(f"\nOrphan posts (nothing links TO them): {len(health['orphan_posts_no_inbound_links'])}")
    for s in health["orphan_posts_no_inbound_links"]:
        print(f"  - {s}")

    print(f"\nIsland posts (no links in OR out): {len(health['island_posts_no_links_at_all'])}")
    for s in health["island_posts_no_links_at_all"]:
        print(f"  - {s}")

    print(f"\nMost linked to:")
    for item in health["most_linked_to"]:
        print(f"  - {item['slug']}: {item['inbound_count']} inbound")

    print(f"\nAvg outbound blog links per post: {health['average_outbound_links']}")

    print(f"\n{'=' * 60}")
    print("DONE — saved to merryfair_content_map.json")
    print(f"{'=' * 60}")
    print()
    print("NEXT: Ask Claude Code to generate content summaries:")
    print()
    print('  "Read merryfair_content_map.json. For each post in')
    print('   post_details, use the extracted_text to write a')
    print('   content_summary with: main_topic, subtopics_covered,')
    print('   angle, explicitly_not_covered, target_audience,')
    print('   and content_type. Save back to the JSON."')


if __name__ == "__main__":
    main()
