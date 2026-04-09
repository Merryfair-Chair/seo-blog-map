Suggest new blog post ideas for Merryfair. Do ALL of the following automatically without asking.

The argument `$ARGUMENTS` may optionally specify:
- A number (e.g. `5`) — how many suggestions to produce. Default: 5.
- A cluster name (e.g. `gaming`, `health-posture`) — restrict to that cluster only.
- A purpose type (`traffic`, `authority`, or `hub`) — restrict to that purpose type only.
- A combination (e.g. `3 gaming` or `authority health-posture`).

---

## Step 0 — Read strategy context

Read `seo-strategy-context.md` in full before anything else. This file contains:
- The three blog purposes (traffic / authority / hub) and what qualifies as each
- Hero page list with impression thresholds
- Cluster priorities and topical coverage goals
- Content gap rules and cannibalization rules
- Publishing target and priority order

---

## Step 1 — Read the content map (targeted fields only)

Read `merryfair_content_map.json`. Do NOT load `extracted_text` for any post — it is large and not needed. Extract only:

**From each cluster's `gaps` array:**
List all existing gaps with their `id`, `targetKeyword`, `status`, and `title`.

**Count gaps with `status: "approved"`**. If there are 5 or more, stop and print: "There are already N approved gaps in the pipeline. Publish existing backlog before adding more." Do not proceed with suggestions.

**From `post_details`, for every post, extract:**
- `content_summary.main_topic`
- `content_summary.subtopics_covered`
- `content_summary.angle`
- `content_summary.explicitly_not_covered`
- `content_summary.target_audience`
- `cluster`
- `gsc_impressions`
- `gsc_clicks`
- `gsc_avg_position`
- `ahrefs_traffic`
- `top_keyword`
- `top_kw_position`
- `hero_tier`

This is the canonical record of what every post actually covers. All cannibalization checks must be done against this data — never against titles, slugs, or keyword rankings alone.

---

## Step 2 — Identify candidate gaps

For each cluster (or the specified cluster if `$ARGUMENTS` restricts scope):

**Traffic signals:**
- Posts ranking positions 8–20 in Ahrefs for a keyword with >50/mo MY volume — first determine whether a new post OR an optimization of the existing post is the right fix. Only suggest a new post if the intent is genuinely different.
- GSC keywords where impressions are high and clicks are low — check for AI Overview presence using Ahrefs `serp-overview` before treating this as a content gap. If AI Overview is present, the problem is GEO, not a missing post.
- Clusters with fewer than 4 posts relative to search demand

**Authority signals:**
- Subtopics appearing frequently in `content_summary.explicitly_not_covered` fields across multiple posts — topics the library keeps skirting
- Topics listed as thin in `seo-strategy-context.md` "Cluster Priorities" with no existing post
- Subtopics that would complete a cluster's topical coverage for EEAT purposes

**Hub signals:**
- Topics where Merryfair's 50-year manufacturing expertise could produce a definitive Malaysian reference
- Topics journalists, HR teams, or workplace wellness bloggers would cite
- Calculators, comparison frameworks, standards guides with low competition and high strategic value

**Use Ahrefs MCP tools to validate demand for any candidate keyword:**
- `keywords-explorer-matching-terms` for MY volume, global volume, and KD
- `keywords-explorer-related-terms` to surface adjacent opportunities
- `gsc-keywords` (project_id: 9485639) for existing impression signals
- `serp-overview` for SERP intent validation and AI Overview detection — run this for every traffic gap candidate. The where filter syntax uses JSON: `{"field": "impressions", "is": ["gt", 500]}`

---

## Step 3 — Cannibalization check (content-level, mandatory for every candidate)

For every candidate gap before including it in output:

1. Identify the closest existing post by topic using content summaries — not keyword similarity or title matching.

2. Read that post's `content_summary.subtopics_covered` and `content_summary.explicitly_not_covered`.

3. Ask: does the existing post already answer the searcher's intent at content level?
   - If yes: discard this candidate. Note: "existing post `[slug]` already covers this — `[specific subtopic]` is listed in `subtopics_covered`."
   - If no: document specifically what the existing post covers and what it leaves out, citing the actual fields.

4. Check the existing gaps array. If a gap with a semantically identical `targetKeyword` already exists (any status), discard and note the duplicate gap ID.

5. Check `top_keyword` for posts in the same cluster. If the candidate's target keyword matches an existing post's `top_keyword`, flag with `cannibalizes: "[slug]"` but do not automatically discard — apply the rules from `seo-strategy-context.md`.

6. **Cross-check all new candidates against each other.** Two suggestions in the same session must not target the same intent. If two candidates overlap, keep the stronger one and discard the other.

---

## Step 4 — SERP validation (required for all traffic gap candidates)

For every traffic gap candidate, run `serp-overview` for the target keyword in `country: "my"`:
- What type of content ranks top 3? (guides, product pages, comparison posts, forum threads)
- Does the SERP intent match what Merryfair would write?
- Is an AI Overview present? If yes, flag — the primary value of this post would be GEO citation, not click traffic.
- Does Merryfair already rank anywhere on page 1 for this keyword? If yes, the answer is optimize, not write new.
- Is the top-ranking content thin or low quality? (indicates a rankable opportunity)

Add `serpValidated: true` and `serpIntent: "[what the SERP rewards]"` to each gap entry.

For authority and hub gaps, SERP validation is not required — note `serpValidated: false` and explain why volume is not the relevant measure.

---

## Step 5 — Classify and write each suggestion

For each suggestion that passes steps 3 and 4, classify purpose strictly:
- **traffic**: Measurable MY search volume or credible global signal. Realistic path to clicks.
- **authority**: Zero or low search volume (<50/mo MY). Must explain WHY this builds topical authority or EEAT — not just "this is a gap."
- **hub**: Comprehensive reference designed to earn backlinks. Must name specifically who would link to it and why.

Write to the appropriate cluster's `gaps` array in `merryfair_content_map.json`:

```json
{
  "id": "gap-XX-N",
  "title": "Proposed post title",
  "targetKeyword": "primary keyword",
  "estVolume": 0,
  "intent": "informational | commercial | transactional",
  "purpose": "traffic | authority | hub",
  "rationale": "Why genuine gap: keyword, MY volume, global volume, intent unmet. What closest existing post actually covers (cite subtopics_covered). What it explicitly doesn't cover (cite explicitly_not_covered). Why that coverage doesn't address the searcher's need.",
  "status": "suggested",
  "serpValidated": true,
  "serpIntent": "what the SERP rewards for this keyword",
  "aiOverviewDetected": false,
  "source": "suggest-posts",
  "closestExistingPost": "slug",
  "whyExistingDoesntCover": "Content-level explanation citing actual content_summary fields.",
  "heroTarget": "slug-of-hero-this-post-would-link-to",
  "cannibalizes": "slug-or-gap-id (only if keyword overlap detected)"
}
```

**Gap ID prefix reference** (must match actual cluster IDs in the JSON):
- `BG` = `buying-guide`
- `BB` = `best-chairs-budget`
- `HP` = `health-posture`
- `GM` = `gaming`
- `WS` = `workspace`
- `BR` = `brand`

Use the next available number within that cluster's gaps array.

After writing all suggestions, copy `merryfair_content_map.json` to `visual-map/public/merryfair_content_map.json` and run `python push_to_supabase.py`.

---

## Step 6 — Append to session-log.md

Append an entry to the TOP of `session-log.md`:
- Date
- Number of suggestions produced and their titles
- Any gaps formally rejected or closed based on today's analysis
- SERP validation findings (AI Overviews detected, intent mismatches)
- Pending decisions for the owner

---

## Step 7 — Print the full suggestion report

For each suggestion:

---
### [N]. "[Proposed post title]"
**Cluster:** [cluster name]  
**Purpose:** traffic | authority | hub  
**Target keyword:** "[keyword]" — [MY vol]/mo MY · [global vol]/mo global · KD [score]  
**SERP intent:** [what top-ranking content looks like]  
**AI Overview on SERP:** Yes / No  
**Closest existing post:** `[slug]`  

**Why this is a genuine gap:**  
[Content-level explanation: what the closest post's `subtopics_covered` includes, what `explicitly_not_covered` lists, what specific intent or question remains unaddressed. Do not rely on titles or keyword rankings.]

**Cannibalization risk:** None | Low | Medium — [explanation]  

**Hero linkage:** Links to `[hero-slug]` ([N,NNN] impressions/mo)  

**Strategic rationale:** [For authority/hub: why this matters beyond search volume. For traffic: what makes this a real opportunity right now.]

---

End with:
- Summary table: Title | Cluster | Purpose | MY vol | SERP validated | Priority
- Next recommended action for each (approve / owner decision needed / requires SERP check)
- Any existing gaps recommended for status changes (e.g. should be rejected because existing content already covers them)
