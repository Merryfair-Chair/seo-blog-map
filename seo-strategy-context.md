# Merryfair SEO Content Strategy Context

> This file is read by the /monthly-update automation to inform gap analysis. It captures the strategic context for Merryfair's blog content: what the blog is for, what makes a good post, hero page context, and the rules for identifying and categorizing gaps.

---

## Core Strategic Decisions Already Made

### On Content Deletion and Redirects
**Decision: Avoid both for existing indexed content wherever possible.**

Reasoning:
- Deleted pages remain indexed by Google until crawled and de-indexed — this can take weeks to months
- Redirected pages require updating all internal links pointing to them — not fully automatable in most setups
- Both options result in permanent loss of backlink equity if referring domains pointed to those URLs

**Preferred alternatives:**
- **Canonical tags** — for overlapping posts, designate one as canonical without touching URLs or internal links
- **Noindex tag** — for genuinely low-value pages with no traffic, no backlinks, and no strategic purpose. Page stays live for users but Google stops counting it against site quality
- **Content consolidation** — merge overlapping posts into one stronger piece, keeping the URL with more backlinks or traffic
- **Content upgrading** — improve underperforming posts rather than removing them

The only scenario where a redirect is still appropriate: a post with zero traffic, zero backlinks, no strategic value, and a clearly more relevant destination URL to redirect toward.

---

### On Post Value vs. Search Volume
**Decision: Search volume alone is not a proxy for content value.**

A post can be genuinely valuable even with zero organic traffic. Value exists across multiple dimensions:

- **Direct/referral traffic** — posts shared via email, social, or linked from other sites
- **Conversion contribution** — posts that appear consistently in the path before a conversion, even without being the entry point
- **Internal link centrality** — posts heavily linked to from other posts are load-bearing for site architecture
- **Backlink equity** — posts with referring domains have accumulated authority regardless of search traffic
- **Topical completeness** — some posts make a cluster authoritative as a whole; their value is architectural, not individual

**This affects both the audit framework and the AI suggestion process.** The AI must check whether a topic is already covered by a low-traffic post before suggesting a new one. The right output in that case is "this post already exists but has low search visibility — decide whether it serves other purposes before treating it as a gap."

---

## The Topic Cluster and Pillar Page Model — Clarified

### Does every cluster need exactly one pillar page?
In the classic model, yes. In practice, a large topic can have a primary pillar and a sub-pillar for a distinct major subtopic. What you must never have is two pages competing for the same broad keyword with the same intent — that is cannibalization, which is different from multiple pillars.

### What actually qualifies a page as a pillar page?
A pillar page qualifies by **function, not format**. It earns the designation when it is:
- The most broadly scoped, authoritative page on a topic that you own
- Targeting the broadest/head keyword in that topic space
- Written to inform and orient across the full topic landscape, not to answer one narrow question
- Linking outward to all cluster posts
- Receiving internal links back from all cluster posts
- The page you would send someone to if they knew nothing about the subject

Word count and "comprehensive guide" labels are not defining features. Function is.

### On content overlap between pillar and cluster posts
Overlap in mention is intentional and expected. Overlap in depth is a problem.

The pillar page mentions keyword research, technical SEO, link building — but only at surface level. The cluster post on keyword research goes three layers deep on that one topic. The mental model: **the pillar page is the table of contents. Each cluster post is a full chapter.**

If your pillar and a cluster post cover the same ground at the same depth, you have cannibalization.

### Keyword strategy for hub-and-spoke
- Pillar page targets the **head term** — broad, high volume, competitive (e.g. "keyword research")
- Cluster posts target **long-tail and mid-tail** variants with specific intent (e.g. "how to do keyword research for a new website")
- Cluster posts linking back to the pillar accumulate authority on the pillar, which helps it compete for the hard head term it couldn't rank for alone

### What if the SERP for the head term doesn't reward pillar-style pages?
**Match the intent Google is rewarding, not the model.**

If top-ranking pages for your target head term are specific focused articles, not comprehensive overviews, Google has determined that the intent is not "give me the broad overview." In this case:
- Do not force a pillar page as a ranking asset for that keyword
- The pillar page still serves as an **internal link hub and authority consolidator**
- It still earns topical authority signals for the site
- It still may rank for long-tail variants of the head term
- It just may not be the page that ranks position one for the broadest keyword

### Is the pillar page model still relevant in 2025/2026?
Pillar pages as a rigid structural requirement have become less important than **topical authority** as a concept. What Google evaluates is whether your site comprehensively covers a topic space with quality content and whether that content is well-connected.

The reason pillar pages still matter: they give your site clear architecture that search engines can follow and concentrate internal link equity in a way that random interconnection doesn't.

A tightly interconnected blog network with no formal pillar pages but comprehensive, coherent topic coverage will outperform a site with perfect pillar structure and thin cluster content. **The structure is in service of topical authority, not a goal in itself.**

---

## The Full A-to-Z Process

### Phase 1: Audit — Know What You Have

**Step 1: Crawl with Screaming Frog**
Run a full site crawl and export: every URL, HTTP status code, title tag, meta description, word count, and all internal link relationships. This is the skeleton of your site — every page that exists and how they connect.

**Step 2: Pull performance data from Google Search Console**
Export the Performance report (last 12 months). Per URL: clicks, impressions, average position, top queries. This shows which posts are doing something in search and which are invisible.

**Step 3: Enrich with Ahrefs**
Run a Site Audit and pull the Top Pages report. Per URL: organic traffic estimate, number of ranking keywords, top keyword, referring domains count. Referring domains is critical — it tells you which posts have accumulated backlink equity.

**Step 4: Pull GA4 traffic source data per URL**
Organic is not the only traffic that matters. Get direct, referral, social, and email traffic per URL. A post with 2,000 email visits and zero organic is not a low-value post.

**Step 5: Merge into a single master inventory**
One spreadsheet, one row per URL, all data sources combined. This is your audit foundation. Everything downstream depends on its completeness and accuracy.

---

### Phase 2: Triage — Decide the Fate of Each Post

Assign every post a triage status based on a **two-axis assessment**:

**Axis 1 — Search performance:** High / Medium / Low / None
**Axis 2 — Site value:** High / Medium / Low (based on non-search signals)

The combination determines the action:

| Search Performance | Site Value | Action |
|---|---|---|
| High | Any | Keep as-is, protect |
| Medium | High | Keep, optimize |
| Low | High | Keep, protect, do not suppress |
| Low | Medium | Optimize or consolidate |
| None | High | Keep — serves business purpose |
| None | Low | Noindex candidate |
| Low/None | Low (all signals) | Noindex or consolidate |

**What "low value across all signals" actually means:**
Zero organic traffic + zero direct/referral traffic + no conversion involvement + few inbound internal links + no backlinks + no clear topical function in a cluster. All of these simultaneously, not any one in isolation.

Do not move to clustering until every post has a triage status assigned.

---

### Phase 3: Cluster — Build the Architecture

**Step 6: Group posts by topic using Claude**
Feed Claude the full post list (titles + URLs) and ask it to propose topic clusters. Interrogate the output — ask whether posts belong in one cluster or another, whether clusters should be split or merged. Use Claude as a thinking partner, not an oracle.

**Step 7: Identify pillar page status per cluster**
For each cluster: does a pillar page exist, does a strong candidate exist that could be upgraded, or does one need to be created? Cross-reference with SERP research for each cluster's head term — does the SERP intent support a pillar-style page or a more specific article?

**Step 8: Audit internal linking per cluster**
Using Screaming Frog data, check: are cluster posts linking back to the pillar? Is the pillar linking out to all cluster posts? Are cluster posts cross-linking to related posts within the cluster? Map the gaps. Most existing sites have loose, inconsistent internal linking leaving significant authority on the table.

---

### Phase 4: Build the Visual Map

**Step 9: Choose and set up the persistent data store**
The visual map is a frontend layer. The data store is what matters for persistence and AI readability. Options:

- **JSON flat file** — free, works natively with Claude Code, simplest setup
- **Supabase** — free tier, proper relational database, 500MB storage, queryable
- **Notion database** — free tier, human-readable, accessible via Notion API

Each post node in the data store needs:
- URL
- Title
- Primary keyword
- Cluster name
- Page type (pillar / cluster post / standalone)
- Triage status
- Organic traffic (monthly)
- Total traffic by source (organic, direct, referral, social)
- Ranking keywords count
- Referring domains count
- Internal links in / out
- Content summary (100–150 words, AI-generated — see Phase 5)
- Value tier (manually set: search asset / business asset / both / unclear)
- Strategic notes (free text — why a low-search post matters)
- Content gaps flagged
- AI suggestion status (suggested / approved / rejected)

**Step 10: Build the visual graph**
Tool: **React Flow** (purpose-built node-based graph library).
Hosting: **Vercel** (free hobby tier).

Two views needed:
- **Cluster view** — each cluster as a group, pillar at center, cluster posts radiating outward. Visually shows which clusters are dense, thin, or missing a pillar.
- **Site-wide view** — all clusters and cross-cluster relationships. Some posts legitimately bridge two clusters and should be represented that way.

Color coding by triage status so health problems are visible at a glance across the entire site.

Node types visually distinguished:
- Pillar pages — larger, center node, distinct styling
- Cluster posts — standard nodes
- AI-suggested posts — dashed border, different color (e.g. purple), not yet written
- Optimize flagged — yellow indicator
- Noindex candidates — muted styling

---

### Phase 5: The AI Content Intelligence Loop

**Step 11: Content extraction and summarization (one-time bulk operation)**
Claude Code loops through every URL in the inventory, fetches page content, strips navigation/headers/footers to extract main body text, then generates a structured 100–150 word content summary per post capturing:
- Main topic
- Subtopics covered
- Angle taken
- What the post explicitly does not cover

These summaries are stored in the data store alongside each post's metadata. This is what enables accurate overlap detection and genuine gap analysis — without reading actual content, clustering is title-signal only (~60% accurate).

**Why summaries instead of full content:**
300 posts × 2,000 words = 600,000 words — too large for a single context window. Summaries of 100–150 words each fit 300 posts comfortably in one prompt, giving the AI a complete picture of the entire content library.

Re-crawl a URL only when you update its content.

**Step 12: Set up the Claude Code automation pipeline**
The loop:
1. Claude Code reads the current map data from the data store
2. Claude Code pulls fresh Ahrefs data (via manual CSV export or API)
3. Claude Code passes both to Claude with a gap analysis prompt
4. Claude returns suggestions with reasoning
5. Claude Code writes suggestions back to the map as proposed nodes with "suggested" status
6. You review, approve, or reject

**Critical constraint to build into the prompt:**
Claude must explain why each suggestion fills a genuine gap — which keyword, what search volume, what intent is currently unmet, what the closest existing post covers and why it doesn't fully address the gap. Generic topical suggestions are not acceptable outputs.

**For low/zero volume suggestions:**
The AI must also flag when a topic has low or zero search volume, but still explain the strategic rationale if one exists (topical completeness, cluster coherence, business asset potential).

**Step 13: SERP validation before writing anything**
Every suggested post, before entering the content calendar, gets a manual SERP check:
- What is currently ranking for the target keyword?
- Does the intent match what you'd write?
- Does an existing post already rank for this keyword at a low position? (Optimize instead of writing new)
- Is the volume worth the investment, or is the value non-search?

**Step 14: Keep the map current**
- Every new post published → immediately added to map with full metadata
- Every new internal link added → update map
- Weekly or monthly Ahrefs sync → update performance metrics
- Every content update → re-generate content summary for that post

---

## The Toolstack

| Tool | Purpose | Cost |
|---|---|---|
| Screaming Frog | Full site crawl, internal link map | Free up to 500 URLs / £249/yr after |
| Google Search Console | Organic performance data per URL | Free |
| GA4 | Full traffic source data per URL, conversion paths | Free |
| Ahrefs Webmaster Tools | Basic audit for own site only | Free (own site only) |
| Ahrefs Lite | Full keyword data, backlinks, competitor analysis | $129/month |
| Google Sheets | Master inventory spreadsheet | Free |
| Claude Pro | AI reasoning, clustering, gap analysis, suggestions | $20/month |
| Claude Code | Automation pipeline — crawl, summarize, suggest, update | Free (beta) |
| React Flow | Visual graph library for the cluster map | Free (open source) |
| Supabase | Persistent data store for map state | Free tier |
| Vercel | Hosting for the React Flow web app | Free tier |

**Realistic minimum to start:** $20/month (Claude Pro) + free tiers of everything else. Limits you to own-site Ahrefs data without competitor intelligence.

**The moment you need competitor gap analysis:** Ahrefs Lite at $129/month becomes necessary. Single biggest cost jump and single biggest capability jump.

**On Ahrefs API for full automation:** Starts at $500/month on enterprise plans. Not recommended to start. The practical workaround is scheduled manual CSV exports from Ahrefs fed to Claude Code — delivers ~90% of the automation value at zero additional API cost.

---

## What Was Considered and Rejected

**Obsidian as the visual map tool**
- Graph view is force-directed with no hierarchy control, no custom layout, no programmatic write access
- Better as a human-facing review layer than as the data layer
- Rejected as primary tool for this use case

**Notion + Miro combination**
- Notion as data layer, Miro as visual canvas
- Rejected because the two don't sync — changes in Notion don't auto-reflect in Miro, creating two diverging representations of the same data

**Deletion and hard redirects as default triage options**
- Rejected for existing indexed content due to de-indexation lag, broken internal link risk, and permanent backlink equity loss
- Replaced with canonical tags, noindex, and content consolidation as lower-risk alternatives

---

## Key Mental Models to Carry Forward

**The map is the source of truth.** Every decision — what to write, what to optimize, what to link — should be made with the map open. The map is only valuable if it's current.

**Cluster before you create.** Every new post idea should be checked against the map before writing begins. The question is never just "is this a good topic" but "does this already exist in some form, and where does it fit in the architecture."

**Value is multi-dimensional.** Organic traffic is one signal among many. A post with 100 organic visits and strong conversion contribution, high internal link centrality, and three referring domains is more strategically valuable than a post with 1,000 organic visits and nothing else.

**Structure serves topical authority, not the other way around.** The goal is comprehensive, coherent topic coverage. Pillar pages and hub-and-spoke are implementation patterns toward that goal, not the goal itself. When the SERP tells you a pattern doesn't fit a particular keyword, adapt.

**The AI is a thinking partner, not an oracle.** Every suggestion it makes should be interrogated against your own knowledge of your audience, your business, and your content. The AI brings data synthesis at scale. You bring context the data can't capture.

---

## Merryfair-Specific Context

### Brand & Blog Purpose

Merryfair is a Malaysian ergonomic chair manufacturer. The blog at merryfair.com/latest_updates/blog/ serves three distinct purposes:

1. **Traffic** — Non-branded organic keywords that support hero pages and drive top-of-funnel discovery. NOT focused on transactional conversion keywords — those SERPs are dominated by ecommerce aggregators where Merryfair cannot compete directly.

2. **Authority** — Topical completeness and EEAT. These posts may have zero or very low search volume in Malaysia but are strategically necessary to establish the site as a complete resource on ergonomic chairs. Being the definitive resource on a subtopic earns trust from both readers and Google.

3. **Hub** — Comprehensive reference resources designed to earn backlinks from journalists, bloggers, and workplace wellness content. Definitive guides that go beyond what competitors cover.

### What Makes a Good Post for Merryfair

- **EEAT-first**: Practical, expert advice grounded in real product knowledge. Merryfair makes chairs, so content should reflect manufacturer knowledge (mechanism design, materials, ergonomic standards).
- **Malaysian market context where relevant**: Pricing in RM, climate considerations (mesh vs fabric in tropical humidity), local shipping/warranty, Malaysian posture habits.
- **No conversion focus**: Merryfair's blog does not hard-sell. CTAs link to product pages naturally, but the post's primary value must be informational.
- **Cluster-aware**: Every post should fit into or extend an existing cluster. Orphan posts dilute topical authority.
- **Not duplicating existing coverage**: Before writing new, check if an existing post partially covers the topic. If so, optimize the existing post instead of writing new.

### Hero Pages

Hero pages are posts generating meaningful organic impressions. New posts should support heroes via internal linking.

**Crown Heroes (>10,000 impressions/month)**
- best-ergonomic-office-chairs-every-budget (56,728 imp) — Main budget pillar. Highest internal link value.
- 6-affordable-ergonomic-chairs-for-your-home-and-office (24,382 imp) — Affordable chairs comparison.
- how-to-choose-the-best-ergonomic-chair-in-malaysia (19,553 imp) — Malaysia-specific buying guide.

**Heroes (>2,000 impressions/month)**
- gaming-chair-vs-office-chair-which-one-should-you-really-buy (6,508 imp)
- office-chair-tilt-mechanism-guide (5,741 imp)
- the-ultimate-guide-to-ergonomic-chairs-must-have-features-and-best-types-for-every-workspace (5,340 imp)
- ergonomic-chair-size-guide (5,065 imp)
- best-study-chairs-students-guide (4,054 imp)
- eco-friendly-ergonomic-chairs-for-sustainable-offices-with-merryfair (2,998 imp)
- do-posture-correctors-work (2,502 imp)
- upgrade-your-workspace-affordable-working-chairs-under-rm1000 (2,320 imp)
- how-to-choose-the-best-ergonomic-chair-for-solo-movie-nights (2,196 imp)

### Content Gap Rules

Before suggesting any gap:

1. **Check cannibalization**: Does any existing post already target this keyword or a semantically close variant? Add `cannibalizes` field with the slug if so. Flag, don't block.

2. **Check existing gaps**: Is there already a gap in the pipeline covering this topic? Don't create a duplicate.

3. **Every gap must have a purpose field**: `traffic`, `authority`, or `hub`.
   - **traffic**: Measurable search volume, realistic path to clicks.
   - **authority**: Topical completeness, even with zero volume. Must explain strategic rationale.
   - **hub**: Comprehensive reference earning backlinks. Must explain what makes it link-worthy.

4. **For authority and hub gaps**: Zero search volume is acceptable. The rationale must explain WHY this builds authority or earns links, not just "this is a gap."

5. **For traffic gaps**: Focus on keywords where Merryfair has impressions but low CTR (positions 8–20), or thin cluster coverage relative to search demand.

### Publishing Target

**5 posts/week** target. Priority order:
1. Approved gaps first
2. Gaps that support a crown hero (high internal link value)
3. Suggested gaps with >100/mo MY search volume
4. Authority gaps completing a cluster
5. Hub gaps with backlink potential

Do not suggest new gaps if there are already 5+ approved gaps — publish existing backlog first.

### Cluster Priorities & Topical Coverage Goals

**buying-guide** — Strong coverage (9 posts). Authority gaps: chair certifications, showroom test-sit guide, chair lifespan/maintenance.

**best-chairs-budget** — Crown hero pillar. Thin sub-segments: budget breakdowns by RM tier, kids/teen chairs, specific use-case comparisons.

**health-posture** — Moderate coverage. Thin on: neck/shoulder pain from chairs, back pain symptom-to-solution format.

**gaming** — Thin (2 posts only). Strong hero. Must cover: best gaming chairs for long sessions, streaming ergonomics, gaming chair setup.

**workspace** — NO PILLAR YET. Priority: create workspace pillar first. Then: dual monitor setup, standing desk + ergonomic chair combination, lighting ergonomics.

**brand** — No pillar needed. Seasonal and brand storytelling only. Do not create topical authority posts here.

### Cannibalization Rules

- Two posts targeting the same primary keyword = cannibalization. Check `top_keyword` against proposed `targetKeyword`.
- Semantic overlap: "ergonomic chair Malaysia" vs "best ergonomic chair Malaysia" — NOT automatically cannibalization. The modifier "best" shifts intent to commercial investigation.
- If detected: add `cannibalizes` field with the conflicting slug. Flag, do not block the gap.
- Resolution options: (1) optimize existing post, (2) differentiate angle to serve different intent stages, (3) merge if existing post is thin.
- Always check existing post's `content_summary.subtopics_covered` before flagging — partial coverage ≠ full cannibalization.

### Valid Gap Status Values

- `suggested` — AI-generated, not yet reviewed
- `approved` — Reviewed and greenlit for writing
- `in_progress` — Currently being written
- `published` — Live on site
- `deprioritized` — Valid gap but low priority for now
- `rejected` — Not a genuine gap or not worth writing
