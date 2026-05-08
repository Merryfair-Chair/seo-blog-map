Run a full internal linking audit using SEO best-practice principles. Relevance gates every link decision — cluster membership alone never justifies a link. Do ALL of the following automatically without asking:

**0.** Run `python3 pull_from_supabase.py`.

**1.** Run `python3 crawl_and_summarize.py --links-only` — refresh link data only. Content summaries and extracted text are already in the JSON from prior crawls.

**2.** Read `merryfair_content_map.json`. All relevance decisions use each post's `content_summary` fields (`main_topic`, `subtopics_covered`, `explicitly_not_covered`). Never infer from slugs or titles alone.

---

**3. Sidebar link detection.**
Any slug appearing as an outbound link from more than 60% of all published posts is a sitewide sidebar link — not a contextual editorial link. Exclude these slugs from all analysis below.

**4. Broken links — fix first.**
For every `internal_links_out` entry across all posts, check if the destination slug exists in `post_details`. Flag missing slugs with: source post, broken slug, anchor text used.

**5. Link density assessment.**
Count each post's contextual outbound links (sidebar slugs excluded). Apply type-aware thresholds:

| Post type | Healthy | Under-linked | Over-linked |
|-----------|---------|--------------|-------------|
| Supporting / cluster post | 3–8 | < 3 | > 8 |
| Pillar page | 6–15 | < 6 | > 15 |
| Brand / seasonal post | 1–4 | 0 | > 5 |

Determine post type from cluster membership and whether the slug matches a cluster's `pillar_slug`.

**6. Relevance-gated pillar ↔ cluster checks.**
For each cluster:

**a. Pillar → cluster post (missing link):**
Read the pillar's `content_summary.subtopics_covered`. Does any subtopic directly match the cluster post's `main_topic`? Only flag as a missing link if a genuine match exists. If the pillar doesn't cover that subtopic, the link would be forced — skip it.

**b. Cluster post → pillar (missing link):**
Flag every cluster post that doesn't already link to its own pillar. This is almost always valid: the pillar is the natural "want the full picture?" destination. Each post needs at most one link to its pillar.

**c. Cluster post → cluster post:**
Only flag if post A's `subtopics_covered` or `explicitly_not_covered` contains a topic that is post B's `main_topic`. Sharing a cluster is not sufficient justification — require explicit content-level overlap.

**7. Relevance-gated cross-cluster checks.**
For each post, check whether its `explicitly_not_covered` or `subtopics_covered` references the `main_topic` of a post in a different cluster. Only flag a cross-cluster link where this direct content connection exists. Do not apply blanket rules (e.g., "all health posts must link to the buying guide").

**8. Duplicate links and duplicate anchor texts within each post.**
Scan every post's `internal_links_out` for:

- **Duplicate link:** same destination slug linked more than once (even with different anchor texts). Only one link to any destination per post.
- **Duplicate anchor:** same anchor text (case-insensitive) used for two or more different destination slugs in the same post.

For each issue, add to `link_health_issues` if not already present (check by ID):

```json
{
  "id": "dup-link-{from_slug_40}-to-{to_slug_40}",
  "type": "duplicate_link",
  "from_slug": "...",
  "destination": "destination_slug",
  "anchors": ["anchor 1", "anchor 2"],
  "status": "open",
  "added_date": "YYYY-MM-DD",
  "dismissed_date": null
}
```

```json
{
  "id": "dup-anchor-{from_slug_40}-{first-5-words-slugified}",
  "type": "duplicate_anchor",
  "from_slug": "...",
  "anchor": "the exact anchor text",
  "destinations": ["slug1", "slug2"],
  "status": "open",
  "added_date": "YYYY-MM-DD",
  "dismissed_date": null
}
```

Initialise `link_health_issues` as `[]` if the key doesn't exist. Do not add these to `link_queue`.

**9. Pillar backlink check.**
For each pillar, report the `ahrefs_referring_domains` count. Pillars with zero referring domains rely entirely on internal link equity — flag as backlink opportunities.

---

**10. Anchor-first action workflow.**
For every missing link identified in steps 6 and 7, determine HOW to add it before it enters the queue:

**a.** Read the source post's `extracted_text`. A valid `hyperlink_existing` anchor must pass ALL of the following:

1. **Prose location only.** The phrase must appear inside a `<p>` or `<li>` element. Any phrase that only appears as a standalone heading, FAQ question ("What features should I look for in X?"), or section label is not valid — even if the crawler can detect a link placed there. If the only occurrence of a relevant phrase is a heading, treat it as no anchor found and proceed to 10c.

2. **Primary placement.** The anchor phrase must be a key element of its sentence — a subject, main object, or central descriptor. A passing mention inside an enumeration of unrelated items fails. ("They toggle between boardrooms, home offices, and hybrid video calls" — "home offices" is not a primary element here.)

3. **Context relevance.** Read the sentence and the one or two before it. The surrounding text must be substantively discussing a topic where the destination post adds useful depth. An anchor phrase that merely appears in a sentence about something else — because the keyword happens to occur — is not a valid anchor.

4. **Destination clarity.** The anchor phrase alone (without surrounding context) must set a clear expectation of what the destination post covers. Phrases of two words or fewer are almost always too vague. A reader who clicked the phrase mid-sentence must land where they expected to.

5. **No meta-context.** The sentence must not announce or summarize the destination post. Any sentence matching these patterns fails immediately, even if the anchor phrase itself is good:
   - "that guide covers X"
   - "for a full breakdown / full picture of X, see..."
   - "X is explained in detail in..."
   - "For more on X..."
   - "read our / see our / check our X"

6. **Surprise test.** If a reader clicked the anchor mid-reading, would they be surprised by where it goes? No surprise = valid anchor. Surprise = find a better phrase or proceed to 10c.

**b. Existing anchor found — all 6 criteria pass → action_type: `hyperlink_existing`**
- `existing_anchor`: the exact phrase to hyperlink
- `existing_anchor_context`: the full sentence it appears in (must be a body sentence, not a heading)
- No writing needed. Open post in WordPress and hyperlink the phrase.

If a candidate phrase fails even one criterion above, treat it as "no anchor found" and proceed to 10c — even if a topically related phrase exists in the text.

**c. No existing anchor found:**
- Re-assess relevance. If the connection is marginal, drop the link — do not force it.
- If the link is genuinely necessary: write one sentence that belongs in the post on its own terms, with the destination's topic embedded as the anchor.
- `action_type`: `insert_new`
- `insertion_suggestion`: the new sentence to write (see rules below)
- `insertion_location`: where in the post to insert it, referenced by the surrounding section topic (e.g., "In the section on lumbar support, after the paragraph explaining lumbar pad height")

**When drafting `insertion_suggestion`, apply `/seo-writing` writing rules:**

Read `/Users/merryfair/.claude/skills/seo-writing/references/anti-ai-rules.md` before writing. Apply all rules below to every insertion:

**The core principle:** Write a sentence that is true about the source post's own subject. The anchor is a phrase within that sentence that points to the destination — not a sentence whose purpose is to mention that the destination exists.

The reader must follow the link because the anchor phrase itself is interesting or useful, not because you told them to go read something.

**Prohibited patterns — never use any of these:**
- Sentences that start with "Our", "We", "Check", "Read", "See" or any first-person brand reference
- "Our guide to X covers Y", "our comparison of X and Y", "our article on X explains"
- "For more on X, see...", "if you want to know more about X...", "for a deeper look at X..."
- "We've put together a guide...", "we break down...", "we explore..."
- Any sentence whose sole purpose is to announce that a destination page exists
- Meta-description style sentences that summarise the destination post rather than making a claim about the source post's topic

**Required approach:**
1. Read the paragraph in `extracted_text` where the insertion will go. Understand what claim or point the surrounding text is making.
2. Write a sentence that advances or adds nuance to that same argument — a sentence the article would benefit from even if no link were being added.
3. Choose the anchor: the most specific noun or verb phrase in that sentence that describes what the destination post covers. The reader clicks because they want to know more about *that phrase*, not because they were directed to.
4. Each insertion must be driven by what the *source post* is saying. Two source posts linking to the same destination will produce different sentences because they are making different points.

**Example (tilt mechanism guide → how-to-adjust-office-chair):**
- Wrong: "Our guide to adjusting your office chair covers the full process."
- Right: "Tilt works in concert with seat height and lumbar position — dial those in first or the tilt tension will never feel right." [anchor: "seat height and lumbar position"]

**Example (correct-sitting-posture guide → health pillar):**
- Wrong: "The physical benefits of ergonomics go well past posture, covering circulation, lung capacity, and cognitive sharpness."
- Right: "Posture alone doesn't close the loop — how well your workstation fits your body determines circulation, lung volume, and cognitive load across a full day." [anchor: "circulation, lung volume, and cognitive load"]

**Formatting rules (from anti-ai-rules.md):**
1. **Match source post voice.** Read the first substantive paragraph of the source post's `extracted_text`. Mirror its sentence rhythm, formality, and contraction rate.
2. **Sentence length.** Hard ceiling of 20 words. One sentence is almost always enough.
3. **No em dashes.** Zero. Replace with a comma or colon.
4. **Anti-AI blacklist.** Never use: delve, crucial, pivotal, landscape (figurative), tapestry, intricate, meticulous, underscore (figurative), testament, vibrant, bolstered, fostering, showcasing, highlighting, enhance (when "improve" works), leverage (when "use" works), streamline, utilize (when "use" works), comprehensive, robust, seamless, elevate (figurative), navigate (figurative), realm, multifaceted, cornerstone, empower, synergy, game-changer, harness.
5. **No filler transitions.** No: Furthermore, Moreover, Additionally, In conclusion, That being said, It should be noted, Moving forward.

---

**11. Populate link queue.**
For every validated link from steps 4, 6, and 7 — skip if an item with the same ID already exists in `link_queue` (any status). Add new items:

```json
{
  "id": "link-{from_slug_40}-to-{to_slug_40}",
  "from_slug": "...",
  "to_slug": "...",
  "anchor_text": "the anchor text to use",
  "priority": "high|medium|low",
  "reason": "one sentence: why a reader of this post would genuinely benefit from the destination",
  "action_type": "hyperlink_existing|insert_new",
  "existing_anchor": "exact phrase or null",
  "existing_anchor_context": "full sentence or null",
  "insertion_suggestion": "new sentence to write or null",
  "insertion_location": "where in the post or null",
  "status": "pending",
  "added_date": "YYYY-MM-DD",
  "done_date": null
}
```

Priority:
- **High:** broken links, orphan fixes (post with zero inbound links), cluster post → its pillar
- **Medium:** pillar → cluster post, cross-cluster links with explicit content overlap
- **Low:** within-cluster non-pillar links

**12.** Save all changes to `merryfair_content_map.json`. Run `bash /Users/merryfair/seo-blog-map/.claude/full_sync.sh`.

**13.** Append an entry to the TOP of `session-log.md`:
- Date
- Broken links found
- Missing links identified (count by priority)
- Orphan posts
- Link health issues found
- Over/under-linked posts flagged

**14. Update Obsidian Vault — only if new link actions were generated or issues found.** Write to `/Users/merryfair/Documents/Obsidian Vault/Weekly SEO Log.md`:
- Find/create the current week's `### Week of [date]` heading and today's `#### YYYY-MM-DD` subheading
- Bullet entry: audit run, new queue items added (count by priority), orphans, health issues
- Update `Research Status.md` — Weekly SEO Log entry: This Session, Key Findings, Next Steps

**15. Print the full report** grouped by priority. For each action item:
- `[Source post] → [Destination post]`
- Relevance rationale (one line — why a reader would want this link)
- **[Hyperlink existing]** `"exact phrase"` — context: `"full sentence"` OR **[Insert new]** `"suggested text"` — location: `"where in the post"`

Include these sections in the report:
- **Broken links** (fix immediately — not in queue, require manual edit)
- **High / Medium / Low priority link actions** (from queue)
- **Under-linked posts** (informational — flag for next audit cycle)
- **Over-linked posts** (informational — do not add new links to these)
- **Link health issues** (duplicate links / anchors — list with fix instructions)
- **Pillar backlink gaps** (informational)
