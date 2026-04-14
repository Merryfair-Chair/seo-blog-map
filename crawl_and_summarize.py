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
BLOG_SITEMAP = "https://www.merryfair.com/cpt-blogs-sitemap.xml"
MAP_FILE = "merryfair_content_map.json"


def discover_slugs():
    """Read all blog post slugs from the Yoast sitemap — always up to date."""
    print("  Fetching sitemap to discover blog posts...")
    try:
        resp = requests.get(BLOG_SITEMAP, timeout=30, headers={
            "User-Agent": "Mozilla/5.0 (compatible; MerryfairContentAudit/1.0)"
        })
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  ERROR fetching sitemap: {e}")
        return []

    slugs = []
    for m in re.finditer(
        rf"<loc>{re.escape(BASE_URL)}{re.escape(BLOG_PATH)}([^/<]+)/?</loc>",
        resp.text
    ):
        slug = m.group(1).strip()
        if slug and slug not in slugs:
            slugs.append(slug)

    print(f"  Found {len(slugs)} blog posts in sitemap.")
    return slugs


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

    # ── Remove "more posts / related posts" sections before extracting links ──
    # These are widget areas that show the latest N posts — not contextual links.
    NOISE_PATTERNS = re.compile(
        r"related.?posts?|more.?posts?|latest.?posts?|recent.?posts?|"
        r"you.?may.?also|read.?more|also.?read|post.?navigation|"
        r"elementor.?posts|wp-block-latest-posts|blog.?list|post.?list",
        re.I
    )
    for tag in main_content.find_all(True):
        classes = " ".join(tag.get("class", []))
        tag_id  = tag.get("id", "")
        if NOISE_PATTERNS.search(classes) or NOISE_PATTERNS.search(tag_id):
            tag.decompose()

    # ── Extract only in-content links (inside <p> or <li> in prose body) ────
    # Anchor text must be meaningful: skip "Read more", bare URLs, icon-only etc.
    SKIP_ANCHORS = re.compile(
        r"^(read more|learn more|click here|here|this|more|→|»|view|see|back)$",
        re.I
    )
    self_url = f"{BASE_URL}{BLOG_PATH}{slug}/"
    blog_links_out = []   # [{slug, anchor}]
    seen_slugs = set()

    for container in main_content.find_all(["p", "li"]):
        for a_tag in container.find_all("a", href=True):
            href = a_tag["href"]
            if href.startswith("/"):
                href = BASE_URL + href
            if BLOG_PATH not in href or href == self_url:
                continue
            match = re.search(rf"{re.escape(BLOG_PATH)}([^/?#]+)/?", href)
            if not match:
                continue
            linked_slug = match.group(1)
            if linked_slug == slug or linked_slug in seen_slugs:
                continue
            anchor = a_tag.get_text(strip=True)
            if not anchor or SKIP_ANCHORS.match(anchor):
                continue
            seen_slugs.add(linked_slug)
            blog_links_out.append({"slug": linked_slug, "anchor": anchor})

    product_links = set(
        (BASE_URL + a["href"]) if a["href"].startswith("/") else a["href"]
        for a in soup.find_all("a", href=True)
        if "/products/" in a["href"] or "/store/" in a["href"]
    )

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
        "extracted_text": body_text,
        "internal_blog_links_out": blog_links_out,   # [{slug, anchor}]
        "product_links_count": len(product_links),
        "models_mentioned": models_found,
    }


def build_link_matrix(all_posts):
    # links_out_to  = [{slug, anchor}]
    # linked_from   = [{slug, anchor}]  (from the SOURCE post's perspective)
    matrix = {}
    for post in all_posts:
        matrix[post["slug"]] = {
            "links_out_to": post["internal_blog_links_out"],
            "linked_from": [],
        }

    for post in all_posts:
        for link_obj in post["internal_blog_links_out"]:
            target_slug = link_obj["slug"]
            if target_slug in matrix:
                matrix[target_slug]["linked_from"].append({
                    "slug":   post["slug"],
                    "anchor": link_obj["anchor"],
                })

    return matrix


def update_content_map(all_posts, link_matrix):
    if os.path.exists(MAP_FILE):
        with open(MAP_FILE, "r", encoding="utf-8") as f:
            content_map = json.load(f)
    else:
        print(f"WARNING: {MAP_FILE} not found. Creating new.")
        content_map = {"meta": {}, "clusters": []}

    existing_details = content_map.get("post_details", {})

    # MERGE crawl data into existing post_details — preserve enriched fields
    # (cluster, page_type, triage_status, gsc_*, ahrefs_*, top_keyword, etc.)
    CRAWL_FIELDS = {
        "title", "url", "word_count", "extracted_text", "models_mentioned",
        "internal_links_out", "internal_links_in",
        "internal_links_out_count", "internal_links_in_count",
        "product_links_count",
    }

    for post in all_posts:
        slug = post["slug"]
        links = link_matrix.get(slug, {"links_out_to": [], "linked_from": []})

        crawl_data = {
            "title":                    post["title"],
            "url":                      post["url"],
            "word_count":               post["word_count"],
            "extracted_text":           post["extracted_text"],
            "models_mentioned":         post["models_mentioned"],
            "internal_links_out":       links["links_out_to"],   # [{slug, anchor}]
            "internal_links_in":        links["linked_from"],    # [{slug, anchor}]
            "internal_links_out_count": len(links["links_out_to"]),
            "internal_links_in_count":  len(links["linked_from"]),
            "product_links_count":      post["product_links_count"],
        }

        existing = existing_details.get(slug, {})
        # Start from existing (preserves enriched fields), then overwrite crawl fields
        merged = {**existing, **crawl_data}
        # Keep content_summary if it already exists
        if "content_summary" not in merged:
            merged["content_summary"] = None

        existing_details[slug] = merged

    content_map["post_details"] = existing_details

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

    with open(MAP_FILE, "w", encoding="utf-8") as f:
        json.dump(content_map, f, indent=2, default=str, ensure_ascii=False)

    return content_map


def main():
    print("=" * 60)
    print("MERRYFAIR BLOG CONTENT CRAWL")
    print("No API key needed")
    print("=" * 60)

    blog_slugs = discover_slugs()
    if not blog_slugs:
        print("ERROR: No slugs discovered. Check sitemap URL or network.")
        return

    print(f"\n[1/3] Fetching {len(blog_slugs)} blog posts...")
    all_posts = []
    for slug in blog_slugs:
        result = fetch_blog_post(slug)
        if result:
            all_posts.append(result)
        time.sleep(1)

    print(f"\n  Fetched: {len(all_posts)}/{len(blog_slugs)}")

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

    # Push to Supabase immediately so crawl results are visible everywhere
    import subprocess
    print("\n[sync] Pushing to Supabase...")
    result = subprocess.run(
        ["python3", "push_to_supabase.py"],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        print("[sync] Supabase push complete.")
    else:
        print(f"[sync] WARNING: Supabase push failed:\n{result.stderr}")
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
