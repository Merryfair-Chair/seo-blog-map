Audit an existing Merryfair blog post against the master content standard and produce a prioritized optimization checklist.

## Before anything else

Run `python3 pull_from_supabase.py` to merge any gap status changes or optimization checklist states made via the Vercel visual map into the local JSON.

## Setup

1. Find the latest master prompt file in `blog-creation-prompt/` inside this repo — read the most recently modified `.md` file. This is the content standard every recommendation must be measured against.

2. Read `merryfair_content_map.json`. Find the post matching the slug in `$ARGUMENTS`. Pull: `title`, `gsc_clicks`, `gsc_impressions`, `gsc_avg_position`, `top_keyword`, `top_kw_position`, `top_kw_volume`, `triage_status`, `page_type`, `cluster`, `internal_links_in`, `internal_links_out`, `content_summary`, `word_count`, `hero_tier`.

3. Fetch the live post at `https://www.merryfair.com/latest_updates/blog/[slug]/` and read the actual published content — title tag, meta description, URL, H1, all headings, opening paragraph, body content, images and their alt text, FAQ section, conclusion, internal links with anchor text, and page source for structured data/schema markup.

4. **Fetch the top 3 competing pages for the post's `top_keyword`.**
   Use the Ahrefs `serp-overview` tool for the target keyword in `country: "my"` to get the top-ranking URLs. Then fetch and read the content of the top 3 pages that are NOT merryfair.com. This is required for the originality check in section 8.

---

## Audit dimensions — check every one

### 1. SEARCH PERFORMANCE DIAGNOSIS
Before recommending what to fix, diagnose WHY the post is underperforming:
- **Check for AI Overview:** Use Ahrefs `serp-overview` for the target keyword. If `serp_features` includes `"ai_overview"`, flag this prominently. An AI Overview on the SERP means CTR will be structurally suppressed regardless of title/meta quality. The strategic response is GEO optimisation (getting cited inside the AI Overview), not just title fixes.
- If impressions are high but clicks are low AND no AI Overview: CTR problem (title tag / meta description)
- If impressions are low: ranking position problem (content depth / keyword targeting / topical authority)
- If ranking position 5–15: featured snippet / PAA optimisation may help, but check for AI Overview first
- If `triage_status: none`: check if post is too new, or genuinely not indexed for anything meaningful
- State the primary diagnosis clearly before listing recommendations.

### 2. SEO FUNDAMENTALS
Check against the master prompt standards:
- [ ] Title tag: 55–60 chars? Primary keyword in first 3 words? Contains a specific number or power word?
- [ ] Meta description: 150–160 chars? Answers "what will I get from this page"? Subtle CTA present?
- [ ] URL slug: 3–6 words? Keyword-forward? No stop words?
- [ ] Primary keyword in first sentence of post?
- [ ] Primary keyword appears in H1, at least one H2, title tag, meta description?
- [ ] Secondary keywords distributed across sections (not front-loaded)?
- [ ] **Semantic field coverage:** Does the post cover the core entities, concepts, and related terms a reader would expect on this topic? This matters more than keyword density — do not calculate or recommend a keyword density percentage. Instead, flag specific semantic gaps: concepts or entities the post should mention that it currently doesn't.

### 3. CONTENT STRUCTURE (AEO + GEO)
- [ ] H2s: engaging and specific? Flag any using generic labels ("Introduction", "Conclusion", "Final Thoughts", "Overview")
- [ ] H3s: written as exact search queries / PAA questions?
- [ ] Opening paragraph: follows Hook-Answer-Promise? Answer portion 40–60 words, standalone, snippet-ready?
- [ ] Does every H2 and H3 open with a direct 40–60 word answer (QAC formula)?
- [ ] At least one voice-search H3 (conversational, question-format)?
- [ ] Does the post cover the topic from 3 distinct angles (perspective, context, and application — not just three subsections of the same angle)?
- [ ] FAQ section present? 4–6 real questions? Each answer 40–60 words, standalone?
- [ ] FAQ is the last section before the conclusion?
- [ ] Conclusion: engaging H2 (not generic)? CTA present? Does NOT summarise — delivers a final insight?

### 4. GEO SIGNALS (Generative Engine Optimisation)
These signals improve the chance of being cited inside AI Overviews and AI assistants:
- [ ] 5–8 quotable insights (15–30 words each, standalone, citable without surrounding context)?
- [ ] At least 1 named original framework or methodology?
- [ ] All factual claims backed by a specific statistic, study, or concrete example with source?
- [ ] External citations with real, verifiable URLs?
- [ ] Structured data language: definition-first sentences, explicit categorisation, numbered hierarchies?
- [ ] **FAQPage schema:** Is FAQPage structured data implemented in the page HTML? Check the page source for `"@type": "FAQPage"`. If the post has an FAQ section but no schema markup, flag this — it blocks FAQ rich results and AI Overview citation eligibility.

### 5. E-E-A-T SIGNALS
- [ ] At least 3 experience signals ("what you'll actually notice", "in practice", "what most guides skip")?
- [ ] At least 1 expertise signal per H2 (nuance, caveat, manufacturer-level observation)?
- [ ] Authority tone — does the post take clear positions with evidence?
- [ ] Any excessive hedging ("it might be", "some could argue")?
- [ ] Does the post acknowledge legitimate counterarguments?
- [ ] Does the content reflect Merryfair's 50-year manufacturing expertise in at least one specific way (mechanism design, material knowledge, ergonomic standards)?

### 6. INTERNAL LINKING
Use the post's `internal_links_out` data plus the live content:
- [ ] Internal link count appropriate for post length? Target: 1 contextual link per 600 words (minimum 3, maximum 8). Flag if over or under.
- [ ] Links distributed across H2 sections (not clustered in one section)?
- [ ] No more than 2 links in any single H2?
- [ ] Each destination page linked only once?
- [ ] Each anchor text unique?
- [ ] Anchor text describes the destination specifically (not generic "click here" or broad topic labels)?
- [ ] Does the post link to its cluster pillar?
- [ ] Does the pillar link back to this post? (check `internal_links_in`)
- [ ] Are there obvious missing links to other cluster posts?

### 7. IMAGE ALT TEXT
- [ ] Does every image have an alt text attribute?
- [ ] Is alt text descriptive and specific (not filename, not "image", not empty)?
- [ ] Does at least one image alt text incorporate the primary keyword naturally?
- [ ] Are decorative images marked with `alt=""`?

### 8. WRITING QUALITY (anti-AI + mobile-first)
- [ ] Any sentences exceeding 20 words?
- [ ] Any paragraphs exceeding 2 sentences (with 3-sentence exception for technical explanations)?
- [ ] Any words from the blacklist: delve, crucial, pivotal, landscape (figurative), tapestry, intricate, meticulous, underscore (figurative), testament, vibrant, bolstered, fostering, showcasing, highlighting, leverage, streamline, utilize, comprehensive, robust, seamless, elevate, navigate (figurative), realm, multifaceted, cornerstone, empower, synergy, game-changer, harness?
- [ ] Any em dashes (—) used where a comma or period would be clearer?
- [ ] Any filler transitions: Furthermore / Moreover / Additionally / In conclusion / It's worth noting / It's important to remember / In today's world / Moving forward / At the end of the day?
- [ ] Sentence lengths vary naturally?
- [ ] Contractions used naturally?
- [ ] Active voice dominant (passive under 10%)?

### 9. CONTENT COMPLETENESS AND ORIGINALITY
- [ ] Does the post answer every question a reader on this topic would reasonably have?
- [ ] Would a reader need to visit another site after reading this?
- [ ] Is word count appropriate to topic complexity (not padded, not shallow)?
- [ ] Are tables or lists used where prose is less clear?
- [ ] **Originality check against top 3 competitors:** Based on the competitor pages fetched in Setup step 4, does this post contain at least one specific insight, data point, framework, or perspective NOT present in any of the top 3 ranking pages? If not, flag this — Google's Helpful Content system actively rewards genuine originality. Identify specifically what original insight could be added.

---

## Output format

### DIAGNOSIS
One paragraph: primary reason this post is underperforming. Lead with AI Overview presence if detected — this changes the entire strategy. Then address ranking, CTR, or content issues.

### PRIORITY OPTIMIZATION LIST
Ranked by expected impact. For each item:
- **Priority:** High / Medium / Low
- **Issue:** what exactly is wrong (quote actual text where relevant)
- **Fix:** the specific change to make
- **Why it matters:** which ranking signal or user experience this improves

Group by: Quick wins (under 10 minutes) → Content improvements (requires rewriting) → Structural changes (significant work)

### QUICK WINS
Fixes that take under 10 minutes. Give exact replacement text, ready to copy-paste:
- Title tag rewrite
- Meta description rewrite
- Alt text additions
- Missing anchor text links with exact destination and anchor text

### REWRITE SECTIONS
For any H2/H3 needing significant rework:
- Current heading
- Why it fails
- Replacement heading (exact text)
- What the 40–60 word opening answer should cover

### INTERNAL LINK OPPORTUNITIES
Every internal link that should be added:
- Which H2 section and near which sentence
- Anchor text to use
- Destination post

### ORIGINALITY GAPS
Specific insights, data points, or angles present in top competitor pages but missing from this post — and what Merryfair's manufacturing expertise could add as an original counterpoint.

### ESTIMATED IMPACT
Based on current position and impressions, what is realistically achievable if all High priority items are fixed? Adjust expectations if AI Overview is present.

---

## Output — two parts, both required

### Part 1: Write structured checklist to JSON

After completing the audit, write the optimization data into `merryfair_content_map.json` under `post_details.[slug].optimization`:

```json
"optimization": {
  "audited_at": "YYYY-MM-DD",
  "ai_overview_detected": true,
  "diagnosis": "One clear sentence explaining the primary reason this post is underperforming",
  "items": [
    {
      "id": "opt-[slug-3-words]-1",
      "priority": "high",
      "category": "quick-win",
      "issue": "Specific description of what is wrong",
      "fix": "Exact replacement text or specific action",
      "done": false
    }
  ]
}
```

- `priority`: `"high"` / `"medium"` / `"low"`
- `category`: `"quick-win"` / `"content"` / `"structural"` / `"linking"` / `"geo"`
- `id`: use first 3 meaningful words of the slug, not the full slug
- `ai_overview_detected`: true/false — required field
- After writing, run `bash /Users/merryfair/seo-blog-map/.claude/full_sync.sh` to copy the JSON
  to visual-map/public/, push to Supabase, and commit+push to GitHub in one step.

### Part 2: Append to session-log.md

Append an entry to the TOP of `session-log.md`:
- Date
- Post audited (title + slug)
- Primary diagnosis
- Count of high/medium/low items
- Whether AI Overview was detected
- Quick wins ready to implement

### Part 3: Print the full audit report in chat

Print the complete audit as readable text — diagnosis, all items grouped by priority, quick wins with exact copy-paste text, rewrite suggestions, internal link opportunities, originality gaps, and estimated impact.

The post URL is: `https://www.merryfair.com/latest_updates/blog/$ARGUMENTS/`
