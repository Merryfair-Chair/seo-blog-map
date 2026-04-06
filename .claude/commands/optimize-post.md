Audit an existing Merryfair blog post against the master content standard and produce a prioritized optimization checklist.

## Setup — do this before anything else

1. Find the latest master prompt file in `C:\Users\wenxi.lee\Desktop\blog creation prompt\` — read the most recently modified `.md` file. This is the content standard every recommendation must be measured against.

2. Read `merryfair_content_map.json`. Find the post matching the slug in $ARGUMENTS. Pull: title, gsc_clicks, gsc_impressions, top_keyword, top_kw_position, top_kw_volume, triage_status, page_type, cluster, internal_links_in, internal_links_out, content_summary, word_count.

3. Fetch the live post at `https://www.merryfair.com/latest_updates/blog/[slug]/` and read the actual published content — title tag, meta description, URL, H1, all headings, opening paragraph, body content, FAQ section, conclusion, internal links with anchor text.

---

## Audit dimensions — check every one

### 1. SEARCH PERFORMANCE DIAGNOSIS
Before recommending what to fix, diagnose WHY the post is underperforming:
- If impressions are high but clicks are low → CTR problem (title tag / meta description)
- If impressions are low → ranking position problem (content depth / keyword targeting / topical authority)
- If ranking on position 5–15 → optimizing for featured snippet / PAA answers could push into top 3
- If triage = none → check if post is too new, or genuinely not indexed for anything meaningful
- State the primary diagnosis clearly before listing recommendations.

### 2. SEO FUNDAMENTALS
Check against the master prompt Phase 2 standards:
- [ ] Title tag: 55–60 chars? Keyword in first 3 words? Contains power word or number?
- [ ] Meta description: 150–160 chars? Value proposition (not summary)? Subtle CTA present?
- [ ] URL slug: 3–6 words? Keyword-forward? No stop words?
- [ ] Primary keyword in first sentence of post?
- [ ] Keyword density 0.5–1.5%?
- [ ] Primary keyword appears in H1, at least one H2, title tag, meta description?
- [ ] Secondary keywords distributed across sections (not front-loaded)?
- [ ] Semantic field vocabulary present throughout?

### 3. CONTENT STRUCTURE (AEO + GEO)
- [ ] H2s: are they engaging and specific? Any using generic labels ("Introduction", "Conclusion", "Final Thoughts", "Overview")? — flag each one
- [ ] H3s: written as exact search queries / PAA questions?
- [ ] Opening paragraph: follows Hook-Answer-Promise? Is the Answer portion 40–60 words, standalone, snippet-ready?
- [ ] Does every H2 and H3 open with a direct 40–60 word answer (QAC formula)?
- [ ] Is there at least one voice-search H3 (conversational, question-format)?
- [ ] Does the post cover the topic from 3 distinct angles (multi-angle GEO coverage)?
- [ ] FAQ section present? 4–6 real questions? Each answer 40–60 words, standalone?
- [ ] Is FAQ the last section?
- [ ] Conclusion: has engaging H2 (not generic)? Contains CTA? Does NOT summarize? Delivers final insight?

### 4. GEO SIGNALS
- [ ] 5–8 quotable insights (15–30 words each, standalone, citable)?
- [ ] At least 1 named original framework?
- [ ] All factual claims backed by a specific statistic, study, or concrete example?
- [ ] External citations with real URLs (not hallucinated)?
- [ ] Structured data language: definition-first, explicit categorization, numbered hierarchies?

### 5. E-E-A-T SIGNALS
- [ ] At least 3 experience signals ("what you'll actually notice", "in practice", "what most guides skip")?
- [ ] At least 1 expertise signal per H2 (nuance, caveat, expert observation)?
- [ ] Authority tone — does the post take clear positions with evidence?
- [ ] Any excessive hedging ("it might be", "some could argue")?
- [ ] Does the post acknowledge legitimate counterarguments?

### 6. INTERNAL LINKING
Use the post's internal_links_out data plus the live content:
- [ ] 5–7 internal links present?
- [ ] Links distributed across H2 sections (not clustered)?
- [ ] No more than 2 links in any one H2?
- [ ] Each destination page linked only once?
- [ ] Each anchor text unique?
- [ ] Anchor text describes destination specifically (not just broad topic)?
- [ ] Are there obvious missing links to cluster pillar or other cluster posts?
- [ ] Does the pillar link back to this post?

### 7. WRITING QUALITY (anti-AI + mobile-first)
- [ ] Any sentences exceeding 20 words?
- [ ] Any paragraphs exceeding 2 sentences (check for 3-sentence technical exception)?
- [ ] Any words from the blacklist: delve, crucial, pivotal, landscape (figurative), tapestry, intricate, meticulous, underscore (figurative), testament, vibrant, bolstered, fostering, showcasing, highlighting, leverage, streamline, utilize, comprehensive, robust, seamless, elevate, navigate (figurative), realm, multifaceted, cornerstone, empower, synergy, game-changer, harness?
- [ ] Any em dashes (—)?
- [ ] Any filler transitions: Furthermore / Moreover / Additionally / In conclusion / It's worth noting / It's important to remember / In today's world / Moving forward / At the end of the day?
- [ ] Sentence lengths vary (not all 15–20 words)?
- [ ] Contractions used naturally?
- [ ] Active voice dominant (passive under 10%)?

### 8. CONTENT COMPLETENESS
- [ ] Does the post answer every question a reader in this topic would reasonably have?
- [ ] Would a reader need to visit another site after reading this?
- [ ] Is word count appropriate to topic complexity (not padded, not shallow)?
- [ ] Are there tables or lists where prose is less clear?
- [ ] Is there at least one original insight not found in the top 3 competing posts?

---

## Output format

### DIAGNOSIS
One paragraph: what the data says about WHY this post is underperforming (CTR issue, ranking issue, topical gap, linking gap, etc.).

### PRIORITY OPTIMIZATION LIST
Ranked by expected impact. For each item:
- **Priority:** High / Medium / Low
- **Issue:** what exactly is wrong (be specific — quote the actual text if relevant)
- **Fix:** the specific change to make
- **Why it matters:** which ranking signal or user experience this improves

Group by: Quick wins (can fix in 10 minutes) → Content improvements (requires rewriting) → Structural changes (requires significant work).

### QUICK WINS
Separate list of fixes that take under 10 minutes: title tag rewrites, meta description rewrites, adding missing anchor text links, fixing generic H2 labels. Give the exact replacement text, ready to copy-paste.

### REWRITE SECTIONS
For any H2/H3 that needs significant rework, provide:
- The current heading
- Why it fails the standard
- A replacement heading (exact text)
- What the 40–60 word opening answer for that section should cover

### INTERNAL LINK OPPORTUNITIES
List every internal link that should be added with:
- Where in the post (which H2 section, near which sentence)
- Anchor text to use
- Destination post

### ESTIMATED IMPACT
Based on current position and impressions, what is realistically achievable if all High priority items are fixed?

---

## Output — two parts, both required

### Part 1: Write structured checklist to JSON

After completing the audit, write the optimization data into `merryfair_content_map.json` under `post_details.[slug].optimization` using this exact structure:

```json
"optimization": {
  "audited_at": "YYYY-MM-DD",
  "diagnosis": "One clear sentence explaining the primary reason this post is underperforming",
  "items": [
    {
      "id": "opt-[slug-short]-1",
      "priority": "high",
      "category": "quick-win",
      "issue": "Specific description of what is wrong",
      "fix": "Exact replacement text or specific action to take",
      "done": false
    }
  ]
}
```

- `priority`: `"high"` / `"medium"` / `"low"`
- `category`: `"quick-win"` (under 10 min) / `"content"` (requires rewriting) / `"structural"` (significant change) / `"linking"` (internal link work)
- `fix`: for quick-wins, provide the exact replacement text ready to copy-paste. For content/structural items, describe specifically what to write or change.
- After writing to `merryfair_content_map.json`, copy it to `visual-map/public/merryfair_content_map.json`

### Part 2: Print the full audit report in chat

Print the complete audit as readable text in the terminal — diagnosis, all items grouped by priority, quick wins with exact copy-paste text, rewrite suggestions, internal link opportunities, and estimated impact.

The post URL is: https://www.merryfair.com/latest_updates/blog/$ARGUMENTS/
