Suggest new blog post ideas for Merryfair. Do ALL of the following automatically without asking.

The argument `$ARGUMENTS` may optionally specify:
- A number (e.g. `5`) — how many suggestions to produce. Default: 5.
- A cluster name (e.g. `gaming`, `health-posture`) — restrict suggestions to that cluster only.
- A purpose type (`traffic`, `authority`, or `hub`) — restrict to that purpose type only.
- A combination (e.g. `3 gaming` or `authority health-posture`).

---

## Step 0 — Read strategy context

Read `seo-strategy-context.md` in full. This file contains:
- The three blog purposes (traffic / authority / hub) and what qualifies as each
- Hero page list with impression thresholds
- Cluster priorities and topical coverage goals
- Content gap rules and cannibalization rules
- Publishing target and priority order

Do not proceed without reading this file. Every decision downstream depends on it.

---

## Step 1 — Read the content map

Read `merryfair_content_map.json` in full. Extract:

**A. From each cluster's gaps array:**
List all existing gaps with their `id`, `targetKeyword`, `status`, and `title`. You will use this to avoid suggesting duplicates.

Count how many gaps currently have `status: "approved"`. If there are already 5 or more approved gaps, do not suggest new ones — instead print a message: "There are already N approved gaps in the pipeline. Publish existing backlog before adding more. Run /monthly-update to see the full pipeline."

**B. From post_details, for every post:**
Extract the following fields (NOT just the title and slug):
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

This is the canonical record of what every post actually covers. Cannibalization checks must be done against this data — not against titles, slugs, or keyword rankings alone.

---

## Step 2 — Identify candidate gaps

For each cluster (or the specified cluster if $ARGUMENTS restricts scope), identify candidate topics that are not yet covered. Sources to draw from:

**Traffic signals:**
- GSC keywords where Merryfair has >500 impressions but <10 clicks and no existing post specifically targets that keyword
- Posts ranking position 8–20 in Ahrefs for a keyword with >50/mo volume — check if a new supporting post (not optimization) is the right fix
- Clusters with fewer than 4 posts relative to search demand in that topic area

**Authority signals:**
- Subtopics that appear frequently in `content_summary.explicitly_not_covered` fields across multiple posts — these are topics the content library keeps intentionally skirting
- Topics listed as thin in `seo-strategy-context.md` under Cluster Priorities that have no existing post
- Any cluster where the pillar exists but fewer than 3 cluster posts support it with specific subtopics

**Hub signals:**
- Topics where Merryfair, as a 50-year ergonomic chair manufacturer, could be the definitive Malaysian reference (calculators, comparison frameworks, standards guides)
- Topics that workplace wellness bloggers, HR teams, or journalists would cite as a reference source
- Topics with thin or low-quality coverage across the entire web (low competition + high strategic relevance)

Use the Ahrefs MCP tools to validate search demand for any candidate keyword before including it:
- Use `keywords-explorer-matching-terms` for volume and KD in `country: "my"`
- Also pull `global_volume` — low MY volume with high global volume can still justify an authority or hub post
- Use `gsc-keywords` with `project_id: 9485639` to pull current GSC impression data for relevant queries

---

## Step 3 — Cannibalization check (content-level, mandatory)

For every candidate gap, before including it in the output:

1. Identify the closest existing post by topic (use cluster assignment and content summaries — not just keyword similarity).

2. Read that post's `content_summary.subtopics_covered` and `content_summary.explicitly_not_covered`.

3. Ask: does the existing post already answer the searcher's intent at content level?
   - If yes: the gap does not exist. Note "existing post [slug] already covers this — consider optimizing that post instead" and discard this candidate.
   - If no: proceed. Document specifically what the existing post covers and what it leaves out, using the actual content summary fields.

4. Check the existing gaps array. If a gap with a semantically identical `targetKeyword` already exists (any status), discard this candidate and note the duplicate gap ID.

5. Check `top_keyword` for every post in the same cluster. If the candidate's target keyword matches an existing post's top_keyword, flag a cannibalization risk with `cannibalizes: "[slug]"` — but do not automatically discard. Apply the cannibalization rules from seo-strategy-context.md (same primary keyword = risk; modifier shift like "best" = different intent = may be fine).

---

## Step 4 — Classify and write each suggestion

For each suggestion that passes the cannibalization check, produce a full gap entry. Classify the purpose strictly:

- **traffic**: There is measurable MY search volume (any amount) or a credible global volume signal. The post has a realistic path to search clicks.
- **authority**: Zero or very low search volume, but the topic completes a cluster or establishes EEAT in a subtopic Merryfair must own. Rationale must explain WHY this builds authority — not just "this is a gap."
- **hub**: Comprehensive reference content designed to earn backlinks. Must explain what makes it link-worthy and who would link to it.

Write each suggestion to the appropriate cluster's gaps array in `merryfair_content_map.json` using this exact structure:

```json
{
  "id": "gap-XX-N",
  "title": "Proposed post title",
  "targetKeyword": "primary keyword",
  "estVolume": 0,
  "intent": "informational | commercial | transactional",
  "purpose": "traffic | authority | hub",
  "rationale": "Why this is a genuine gap: what keyword, what search volume (MY and global), what intent is unmet, what the closest existing post actually covers at content level (cite subtopics_covered and explicitly_not_covered), and why that coverage does not fully address the searcher's need.",
  "status": "suggested",
  "source": "suggest-posts",
  "closestExistingPost": "slug-of-nearest-post",
  "whyExistingDoesntCover": "Specific gap at content level — reference actual content summary fields, not title assumptions.",
  "heroTarget": "slug-of-hero-page-this-post-should-link-to",
  "cannibalizes": "slug-or-gap-id (only if keyword overlap detected)"
}
```

- `id`: Use the cluster prefix (BG = buying-guide, BB = best-budget, HP = health-posture, GM = gaming, WS = workspace, BR = brand) and the next available number in that cluster's gaps array.
- `heroTarget`: Assign if the new post would logically link to a crown hero or hero from seo-strategy-context.md. Use slugs from the hero list.
- `cannibalizes`: Only include if keyword overlap detected. Do not include if no overlap.

After writing all suggestions to `merryfair_content_map.json`, copy the file to `visual-map/public/merryfair_content_map.json`.

---

## Step 5 — Print the full suggestion report

Print a clear report in chat with this structure for each suggestion:

---
### [N]. "[Proposed post title]"
**Cluster:** [cluster name]
**Purpose:** traffic | authority | hub
**Target keyword:** "[keyword]" — [MY vol]/mo MY · [global vol]/mo global · KD [score]
**Closest existing post:** `[slug]`

**Why this is a genuine gap:**
[Explain at content level: what the closest existing post says (cite actual subtopics_covered), what it explicitly doesn't cover (cite explicitly_not_covered), and what specific intent or question remains unaddressed. Do not rely on titles. Do not infer from keyword rankings alone.]

**Cannibalization risk:** None | Low | Medium — [brief explanation if any]

**Hero linkage:** This post would link to `[hero-slug]` (N,NNN impressions/mo)

**Strategic rationale:** [For authority/hub posts: why this matters beyond search volume. For traffic posts: what makes this a real opportunity now.]

---

End the report with:
- A summary table: Post title | Cluster | Purpose | MY vol | Priority
- The next recommended action for each suggestion (approve / validate SERP first / owner decision needed)
- Any gap status changes recommended based on today's analysis (e.g., gaps that should be rejected because existing content already covers them — flag these explicitly with the reason)
