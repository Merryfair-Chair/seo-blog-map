Enrich manually-added blog ideas with full research details. Do ALL of the following automatically without asking.

Run `python3 pull_from_supabase.py` FIRST to get the latest data including any ideas added via the app.

The argument `$ARGUMENTS` may optionally be a specific gap ID (e.g. `gap-B2BO-1776223061321`).
If no argument is given, enrich ALL gaps where `source: "spontaneous"` and `blogBrief` is missing or empty.

---

## Step 0 — Read strategy context

Read `seo-strategy-context.md` in full. This governs purpose classification, hero linkage, cannibalization rules, and what qualifies as a genuine gap.

---

## Step 1 — Identify gaps to enrich

Read `merryfair_content_map.json`. Find all gaps matching:
- `source: "spontaneous"` (manually added via app)
- `blogBrief` is missing or empty string

If `$ARGUMENTS` is a specific gap ID, restrict to that gap only.

For each gap to enrich, note what the user already provided:
- `title` — user's proposed title (preserve exactly)
- `targetKeyword` — user's chosen keyword
- `purpose` — user's chosen purpose
- `estVolume` — user's estimate (may be 0 if unknown)
- `rationale` / `notes` — any notes the user wrote

These are the USER'S INPUTS. Research may confirm, refine, or conflict with them. Never silently overwrite — preserve conflicts.

---

## Step 2 — Read existing content (cannibalization check)

From `post_details`, for every post extract:
- `content_summary.main_topic`
- `content_summary.subtopics_covered`
- `content_summary.explicitly_not_covered`
- `content_summary.angle`
- `cluster`

This is the only reliable way to check cannibalization. Never infer from titles or slugs alone.

Also read all existing gaps (id, title, targetKeyword, status) to check for overlap with other pipeline gaps.

---

## Step 3 — Research each gap

For each gap to enrich, do the following:

**A. Keyword research**
Use the Ahrefs `keywords-explorer-overview` MCP tool for the user's `targetKeyword` (country: MY).
Also check 2–3 keyword variations to find the best volume/KD combination.

If research volume differs significantly from user's `estVolume`:
- If user set 0 (unknown): fill in the research figure
- If user set a specific number that differs: record both — `estVolume` = research figure, add a `userNote` field: "User estimated [N]; research shows [M]"

**B. SERP intent**
Use `serp-overview` MCP for the target keyword. Determine:
- What type of content ranks (listicles, guides, comparison pages, product pages)
- Whether an AI Overview is present (if yes, flag `aiOverviewDetected: true`)
- Whether the user's proposed angle matches what ranks

If the user's angle conflicts with SERP intent, do NOT silently change the angle.
Record both: fill `serpIntent` with what SERP shows, and add a `userNote` explaining the conflict and its implication.

**C. Cannibalization check**
Read `content_summary.subtopics_covered` and `explicitly_not_covered` for the closest existing post.
Determine if this gap would duplicate existing content at the content level (not keyword level).

If risk exists: set `cannibalizes` to the slug and explain in `whyExistingDoesntCover` what the existing post covers and what angle remains genuinely uncovered.

**D. Hero linkage**
Identify which hero page (from `seo-strategy-context.md`) this post should link to. Set `heroTarget`.

---

## Step 4 — Write the enriched fields

Populate every missing field. For fields where user input exists and research agrees, use the research-refined version. For conflicts, preserve both using the `userNote` field.

```json
{
  "id": "[existing gap ID — do not change]",
  "title": "[user's title — do not change]",
  "targetKeyword": "[user's keyword — do not change unless user left it blank]",
  "intent": "informational | commercial | navigational",
  "source": "spontaneous",
  "status": "[existing status — do not change]",
  "purpose": "[user's purpose — do not change]",
  "estVolume": "[research figure for MY monthly volume]",
  "serpValidated": true | false,
  "serpIntent": "[one sentence: what type of content dominates this SERP]",
  "aiOverviewDetected": true | false,
  "rationale": "[research-backed explanation: why this gap exists, what intent is unmet, what the traffic/authority opportunity is]",
  "closestExistingPost": "[slug of the most topically similar published post]",
  "whyExistingDoesntCover": "[content-level explanation: what subtopics the closest post covers, what it explicitly doesn't, and what intent angle remains genuinely open]",
  "cannibalizes": "[slug or gap-id if overlap detected, else omit]",
  "heroTarget": "[slug of hero page this post should link to]",
  "userNote": "[ONLY if user input conflicts with research: explain both sides clearly. Format: 'User suggested X. Research shows Y. Implication: Z.']",
  "suggestedLinksOut": [
    { "slug": "existing-post-slug", "anchor": "exact anchor text", "note": "which section / why" }
  ],
  "suggestedLinksIn": [
    { "slug": "existing-post-slug", "anchor": "exact anchor text", "note": "which section of that post" }
  ],
  "blogBrief": "BRAND NAME:         Merryfair\nWEBSITE URL:        https://www.merryfair.com\nPRODUCTS/SERVICES:  Ergonomic office chairs and workspace furniture manufactured in Malaysia since 1974. Products range from task chairs and mesh chairs to executive, gaming, and children's study chairs. Sold direct and through dealers across Malaysia.\n\nMODE: Full Tool Access (Ahrefs)\n\nTOPIC:          [user's exact title]\nAUDIENCE:       [who is searching this, what they need — from SERP research]\nGOAL:           [rank on Google / build topical authority / earn backlinks — from purpose]\n\n— OPTIONAL —\nTarget keyword: [targetKeyword]\nFunnel stage:   [Top / Middle / Bottom]\nRelated posts:  [full URLs of closestExistingPost + key cluster posts]"
}
```

**`userNote` field rules:**
- Only add if there is a genuine conflict between what the user specified and what research shows
- Format always: "User suggested [X]. Research shows [Y]. Implication: [Z — what this means for content strategy]."
- Never add `userNote` just to repeat what the user wrote — only for actual conflicts

---

## Step 5 — Update the JSON and sync

Write the enriched gap back into `merryfair_content_map.json`, preserving all other fields.

Then run:
```
bash /Users/merryfair/seo-blog-map/.claude/full_sync.sh
```

---

## Step 6 — Update session-log.md

Append an entry to the TOP of `session-log.md`:
- Date
- Which gaps were enriched (IDs and titles)
- Key research findings (keyword volumes, SERP intent, cannibalization risks found)
- Any conflicts between user input and research (summarise the `userNote` content)

---

## Step 7 — Print enrichment report

For each gap enriched:

---
### "[Gap title]"
**Gap ID:** [id]
**Cluster:** [cluster]
**Target keyword:** "[keyword]" — [MY vol]/mo MY · KD [score]
**SERP intent:** [what ranks]
**AI Overview:** Yes / No
**Closest existing post:** `[slug]`
**Cannibalization risk:** None | Low | Medium — [explanation]

**Research rationale:**
[Why this gap is real, what intent is unaddressed]

**Conflicts with user input:** None | [describe conflict and userNote written]

**Links out:** [list anchors + targets]
**Links in:** [list anchors + sources]

> Blog Brief stored in JSON — visible in Pipeline tab detail panel.
---
