# MASTER BLOG CREATION PROMPT
## Version 4.3 — Complete Edition
### Integrates: SERP Analysis · Information Gain · SEO · AEO · GEO · E-E-A-T · Voice · Polish · Mobile-First Readability · AI Detection Defense · Cross-Content Consistency · Canva Image Creation · Manual Design Specs

---

> **HOW TO USE THIS PROMPT**
> 1. Fill in Section A (Capability Mode) — select one, delete the others
> 2. Fill in Section B (Brief Input) — 3 required fields, up to 4 optional
> 3. Paste the entire prompt to Claude
> 4. Claude handles everything else autonomously across 5 sequential phases
> 5. Review the Phase 5 output and approve the blog content
> 6. On approval, Claude automatically delivers in one response:
>    MD file ([1]–[6]) → FAQ schema in chat (copy-pasteable) → image creation

---

## WEBSITE CONTEXT
*Fill in once and leave permanently. This context informs every
phase of the pipeline. Claude uses it for keyword strategy,
internal linking, content differentiation, author bio generation,
cannibalization checks, and brand voice consistency.*

```
BRAND NAME:         [your brand / company name]
WEBSITE URL:        [https://yoursite.com]
PRODUCTS/SERVICES:  [brief description of what you offer — 2–3 sentences max]
```

---

## SECTION A — CAPABILITY MODE
*Select one mode. Delete the others before running.*

```
MODE: Standard
Claude operates on trained knowledge only.
Flag all real-time data gaps with [VERIFY WITH SEO TOOL].
Proceed with best available estimates where live data is unavailable.
```

```
MODE: Web Search
Claude uses web search during all research phases before drafting.
Search for: current ranking pages, live statistics, trending angles,
PAA questions, and authoritative sources to cite.
Run searches during Phase 1 before any structural decisions are made.
```

```
MODE: Full Tool Access (Ahrefs)
Claude uses the Ahrefs API for keyword and SERP data.
Follow the Ahrefs Efficiency Protocol below for all API calls.
Pull hard data before any structural decision is made.
If any Ahrefs call returns an error, follow the Ahrefs Fallback
Protocol below. Do not silently proceed with estimates.
```

**AHREFS EFFICIENCY PROTOCOL**
*Active whenever Full Tool Access mode is selected.
Every Ahrefs API call consumes units. Use the minimum calls
and the minimum fields needed to get the data required.
Do not sacrifice research quality — but do not waste units.*

**Planned calls per blog post (maximum 3):**

Call 1 — `keywords-explorer-overview`
Purpose: keyword metrics for primary + secondary keywords.
Batch all keywords (primary + 3–5 secondaries) in a single
comma-separated `keywords` parameter. One call, not one per keyword.
Select ONLY these fields: `keyword,volume,difficulty,intents,serp_features,traffic_potential,parent_topic`
Do NOT select: `global_volume`, `parent_volume`, `volume_monthly_history`,
`cpc`, `clicks`, `cps` — these consume extra units and are not
needed for blog content planning.
Country: use the target country for the blog (default: MY).

Call 2 — `serp-overview`
Purpose: analyze the top 10 ranking pages for the primary keyword.
Set `top_positions: 10` to limit results.
Select ONLY these fields: `position,url,title,domain_rating,traffic,type,page_type`
Do NOT select: `backlinks`, `refdomains`, `keywords`, `url_rating`,
`value` — these are not needed for content strategy.
Country: same as Call 1.

Call 3 (optional) — `keywords-explorer-overview`
Purpose: if secondary keywords need separate analysis (e.g., different
intent from the primary), run one additional batched call.
Only use this if Call 1 did not provide sufficient data.

**Fields to avoid (high unit cost, low content strategy value):**
- `volume_monthly_history` (2 units per month, min 50 units)
- `global_volume` (10 units per keyword)
- `parent_volume` (10 units per keyword)

**Never do:**
- Separate API calls for each secondary keyword
- Call `serp-overview` for secondary keywords (only for primary)
- Call any Site Explorer tools unless specifically investigating
  a competitor page (this is rare and should be justified)

**AHREFS FALLBACK PROTOCOL**
*Active when any Ahrefs API call returns an error (quota exhausted,
rate limit, authentication failure, or any other error).*

When an Ahrefs call fails:

1. **Stop immediately.** Do not proceed with estimates or web search
   as a silent substitute. Do not continue the pipeline.

2. **Report the error.** Tell the user:
   - Which Ahrefs tool call failed
   - The exact error message returned
   - Which Phase 1 section the data was needed for

3. **Specify the exact reports needed.** Tell the user which Ahrefs
   reports to manually download and attach. Be precise:

   If Call 1 failed (keyword metrics):
   "I need the **Keywords Explorer > Overview** report from Ahrefs.
   Steps: Go to Keywords Explorer → enter these keywords: [list all
   primary + secondary keywords] → set country to [country] →
   export the overview. I need these columns: keyword, volume,
   difficulty, intents, SERP features, traffic potential, parent topic."

   If Call 2 failed (SERP overview):
   "I need the **SERP Overview** report from Ahrefs.
   Steps: Go to Keywords Explorer → enter the primary keyword:
   [keyword] → click SERP Overview → set country to [country] →
   export the top 10 results. I need these columns: position, URL,
   title, domain rating, traffic, result type."

4. **Wait for the attachment.** Once the user attaches the report
   (CSV, PDF, or screenshot), read it and resume Phase 1 from
   where it stopped. All other Phase 1 sections that don't require
   Ahrefs data can proceed in parallel using web search or
   trained knowledge.

5. **If Ahrefs is fully unavailable for the rest of the month:**
   Switch to Web Search mode for the remaining Phase 1 steps.
   Flag the output with [AHREFS DATA UNAVAILABLE — USING WEB SEARCH]
   so the user knows the data quality may differ.

---

## SECTION B — BRIEF INPUT
*The only fields you fill in. Everything else Claude determines autonomously.*

```
TOPIC:          [insert topic or seed idea — vague or specific, either works]
AUDIENCE:       [one sentence: who is reading this, what do they care about]
GOAL:           [rank on Google / inform / convert / build trust / go viral]

— OPTIONAL —
Competitor URL: [URL to outperform, or leave blank]
Target keyword: [specific keyword to target, or leave blank]
Funnel stage:   [Top / Middle / Bottom, or leave blank]
Format hint:    [listicle / guide / comparison / story-led, or leave blank]
Related posts:  [URLs of existing blog posts on related topics, or leave blank.
                 Claude will read these to ensure factual and conceptual
                 consistency with the new post. Strongly recommended when the
                 new post references concepts, frameworks, or data established
                 in previous posts.]
```

**Autonomous completion rule:** If any optional field is blank, research
and decide it yourself before proceeding. Do not ask for clarification —
make the best strategic decision and proceed.

---

## SECTION C — EXECUTION PIPELINE
*Run all five phases sequentially. Output each phase visibly before
proceeding to the next. Do not begin drafting until Phase 2 is complete.*

---

### ─── PHASE 1: PRE-RESEARCH ───────────────────────────────────────────

*Complete all research now. Output a full research summary before
proceeding to Phase 2. This is the intelligence foundation — every
subsequent decision builds on it.*

**Mode-specific data collection:**
- **Full Tool Access (Ahrefs):** Execute Ahrefs Call 1 (keyword metrics)
  and Call 2 (SERP overview) as defined in the Ahrefs Efficiency
  Protocol. Use the returned data to populate sections 1–4 below.
  Supplement with web search for questions, angles, and sources
  (sections 5–10). If any Ahrefs call fails, follow the Ahrefs
  Fallback Protocol immediately.
- **Web Search:** run all relevant searches now, before producing
  the Phase 1 output.
- **Standard:** use trained knowledge. Flag data gaps.

Determine and output all of the following:

**1. KEYWORD STRATEGY**
- Primary keyword — highest intent, most relevant to the topic
- 3–5 secondary keywords — semantic variations and related terms
- Full semantic field — the complete expert vocabulary of this topic:
  the terms, concepts, sub-topics, and related ideas that any
  authoritative, comprehensive post on this subject would naturally use
- Keyword density target: 0.5–1.5% for primary keyword

*If Full Tool Access: use Ahrefs Call 1 data (volume, difficulty,
intents, traffic_potential, parent_topic) to validate keyword
selection. If volume is below 50 or difficulty is above 80,
flag for discussion before proceeding.*

**2. SERP ANALYSIS**
*This step replaces guesswork with evidence. Every content decision
from this point forward must be grounded in what is actually ranking.*

*If Full Tool Access: use Ahrefs Call 2 data (serp-overview: top 10
positions with URL, title, domain_rating, traffic, type, page_type)
AND Ahrefs Call 1 data (intents, serp_features) to populate this
section. Cross-reference Ahrefs intent data with the actual SERP
results to determine the true dominant intent.*

If Web Search mode is active, search for the primary keyword and
analyze the top 5–10 ranking pages. If Standard mode, use best
knowledge and flag with [VERIFY WITH SERP ANALYSIS].

For each of the top 5–10 results, assess and output:

a) **Dominant search intent** — Do not infer intent from the keyword
   alone. Determine it from what Google is actually ranking:
   - Count how many of the top 10 are informational vs commercial
     vs transactional vs navigational
   - State the dominant intent with a ratio (e.g., "7/10 informational,
     3/10 commercial — dominant intent: informational")
   - If intents are mixed (e.g., 5/5 split), note this and decide
     which intent this post will serve, with reasoning

b) **Content format from SERP** — What format dominates the top results?
   - Count: how many are listicles, how-to guides, comparisons,
     pillar guides, product pages, etc.
   - The format decision for this post should match the SERP majority
     unless there is a strategic reason to deviate. If deviating,
     state the reason explicitly.
   - This overrides any format hint from Section B if the SERP data
     contradicts it.

c) **SERP features present** — Which features appear for this keyword?
   - AI Overview: yes / no. If yes, what format does it use?
     (This increases the importance of the Key Takeaways section
     and structured answers throughout the post.)
   - Featured snippet: yes / no. Format: paragraph / list / table
   - People Also Ask: yes / no. List the actual PAA questions.
   - Image pack: yes / no. (If yes, image strategy becomes more
     important for this post.)
   - Knowledge panel: yes / no
   - Note: video carousels are excluded from targeting.

d) **Entity coverage baseline** — What topics, subtopics, and concepts
   do ALL or MOST of the top-ranking pages cover?
   - List the core entities and subtopics that appear across 7+
     of the top 10 results. This is the baseline the post MUST cover.
   - Missing any of these is disqualifying. They are table stakes.

e) **Competitor weakness analysis** — Where are the top-ranking pages
   weak, outdated, shallow, or wrong?
   - For each of the top 3–5 competitors, identify at least one:
     stale data point, oversimplified explanation, missing edge case,
     outdated recommendation, or gap in coverage.
   - These weaknesses become the post's information gain opportunities.
   - Output as a table: | Competitor | Weakness | Our opportunity |

f) **Competition assessment** — Is this SERP dominated by high-authority
   domains, or are there open ranking opportunities?

**3. INFORMATION GAIN STRATEGY**
*The post must cover the baseline entities (from 2d) AND add
something the top-ranking pages don't have. This section plans
that differentiation explicitly.*

Based on the competitor weaknesses identified in 2e, define:
- 2–3 specific information gain angles — what will this post
  provide that the current top results do not?
  Types of information gain (use at least one):
  - Different perspective on a commonly accepted approach
  - Deeper coverage of a subtopic competitors treat superficially
  - Debunking or correcting outdated advice in the current SERP
  - Audience-specific application (narrower, more actionable)
  - Original framework, process, or mental model
  - First-party data, case study, or experience-based insight
  - Addressing edge cases or caveats competitors skip

**Balance rule:** The post must first satisfy the baseline entity
coverage (what every top result covers), then layer information
gain on top. Entity coverage is the floor. Information gain is
the differentiator. Neither alone is sufficient.

Output: baseline entities to cover + specific information gain
angles, with clear reasoning for each.

**4. CONTENT STRATEGY**
- Best content format: determined by SERP analysis (2b), not by
  abstract reasoning. If the SERP shows 8/10 listicles, the format
  is a listicle unless there is an explicit strategic reason to deviate.
- Ideal word count: calibrated to what is ranking AND topic complexity.
  Do not default to "longer is better." Check what length the top
  results are and match or exceed only where depth justifies it.
- YMYL assessment: does this topic touch health, finance, legal,
  safety, or news? Yes / No. (Triggers heightened E-E-A-T standards
  if yes — see Section D.)

**5. AUDIENCE AND VOICE**
- Voice position: authoritative / warm-practical / energetic /
  curious / conversational
  (inferred from the audience description in the brief)
- Reading level target: Grade 7–8 for general consumer /
  Grade 10–12 for professional audience
- Vocabulary register: technical / semi-technical / plain language
- **Audience segments within the keyword:** Identify 2–3 different
  reader profiles who might search for this same keyword but have
  different experience levels or contexts (e.g., beginner vs advanced,
  small business vs enterprise, DIY vs professional).
  The content should acknowledge these segments where natural,
  not by creating separate sections for each, but by including
  caveats, alternatives, or context switches that serve different
  readers. This increases dwell time and reduces pogosticking.

**6. QUESTION AND ANGLE MAPPING**
- 6–8 PAA-style questions: sourced from actual PAA boxes in the
  SERP (from 2c) first, supplemented by Reddit, Quora, and forum
  patterns if the SERP PAA is insufficient.
- 3 distinct angles or use cases through which this topic can be
  approached — these become the 3 primary H2 clusters and increase
  GEO query coverage
- Narrative thread: the journey from not-knowing to knowing —
  the progressive revelation arc the reader will travel

**7. GEO PREPARATION**
- 3–5 authoritative external sources likely to be relevant for citation
- 1 named original framework opportunity — a concept or process in
  this topic that can be given a distinct name and developed as
  original intellectual property
- 5–8 quotable insight opportunities — ideas in this topic that
  can be expressed as standalone citable sentences of 15–30 words

**8. CROSS-CONTENT CONSISTENCY CHECK**
This check has two parts: keyword cannibalization AND factual consistency.

**Part A — Keyword cannibalization:**
If Web Search mode is active, search the website URL from the
Website Context section for existing posts that target the same
or very similar primary keyword.
If Standard mode is active, flag this check with
[VERIFY: CHECK EXISTING BLOG CONTENT FOR KEYWORD OVERLAP].

If an existing post targets the same primary keyword:
- Assess cannibalization risk: high / medium / low
- If HIGH risk: the angle for this new post MUST be different from
  the existing post. This overrides the angle decisions made in
  section 6 above. Choose angles that complement (not compete with)
  the existing content. State clearly which angles were changed
  and why.
- If MEDIUM risk: note the overlap and adjust angles where possible
  without compromising the post's value.
- If LOW risk: proceed as normal but note the existing post for
  internal linking opportunities.

**Part B — Factual consistency:**
If related blog post URLs were provided in the Brief Input, read
each one and extract:
- Definitions, frameworks, processes, or models established in
  those posts (e.g., "ergonomic fit test has 3 factors: X, Y, Z")
- Specific data points, statistics, or claims made
- Terminology choices (e.g., always uses "clients" not "customers")

The new post MUST NOT contradict, redefine, or present conflicting
versions of any concept, framework, or data point established in
existing posts. If the new post references a concept from an
existing post, it must use the same definition, the same number
of components, and the same terminology.

If Web Search mode is active and no related post URLs were provided,
search the site for posts on related subtopics and read the top
2–3 most relevant results to extract established facts.

Output: established facts/frameworks to respect, cannibalization
risk level, and any angle adjustments made.

**9. CONTENT-TO-PRODUCT BRIDGE**
Using the products/services from the Website Context section, identify:
- 1–2 natural connection points where the blog content creates
  awareness of a problem or need that the product/service addresses.
- These are NOT hard sells. They are moments in the content where
  the reader naturally thinks "I need help with this" and the
  product/service is the logical next step.
- Plan where in the post these touchpoints will appear (which H2
  section) and how they will be framed (as a resource, a solution
  mention, or a CTA).
- The conclusion CTA should connect to the strongest product bridge.

**10. CONTENT REFRESH PLANNING**
Assess the freshness sensitivity of this topic:
- High sensitivity (refresh every 3–6 months): topics with rapidly
  changing data, pricing, regulations, tools, or trends
- Medium sensitivity (refresh every 6–12 months): topics where
  best practices evolve but core principles are stable
- Low sensitivity (refresh every 12–24 months): evergreen topics
  where the fundamentals rarely change

Output:
- Freshness sensitivity: high / medium / low
- Recommended refresh interval
- Specific elements most likely to become stale (e.g., statistics,
  tool recommendations, pricing, regulations)
- Flag with [REFRESH NOTE] in the draft next to any content that
  will need updating at the recommended interval

---

### ─── PHASE 2: OUTLINE CONSTRUCTION ──────────────────────────────────

*Build and output the complete outline before writing any draft content.
The outline is the blueprint — nothing gets built without it.*

**A. TITLE AND META FIELDS**

Generate 3 H1 options:
- Each must contain the primary keyword naturally
- Each must signal the content format (guide / list / how-to / etc.)
- Each must be 55–60 characters
- Select the strongest one with a one-line rationale
- The selected H1 becomes the post title

Title Tag:
- 55–60 characters
- Primary keyword as close to the front as possible
- Include a power word or number where natural
- Must not duplicate the H1 exactly — slight variation required

Meta Description:
- 150–160 characters
- Primary keyword included naturally
- Written as a value proposition, not a summary
- Include a subtle CTA: "Learn why..." / "Discover how..." / "Find out..."

URL Slug:
- Primary keyword included, as close to the front as possible
- All lowercase, words separated by hyphens
- Short and readable: 3–6 words maximum
- No stop words (a, the, in, of, for, and, etc.) unless
  removing them makes the slug unreadable
- Must clearly describe the page content
- Example: "ergonomic-chair-guide" not
  "the-complete-guide-to-choosing-an-ergonomic-chair-for-your-body"

**B. OPENING BLOCK PLAN**

Note the Hook-Answer-Promise structure for the opening paragraph:
- Hook: one attention-arresting sentence (surprising stat,
  counterintuitive claim, vivid scenario, or challenged assumption)
- Answer: direct answer to the core question in 1–2 sentences
  (40–60 words total, standalone, no prior context required,
  primary keyword in the first sentence — this is the AEO
  snippet-capture paragraph)
- Promise: what the reader gains by reading the full post

**B2. KEY TAKEAWAYS SECTION**

Immediately after the opening paragraph (before the first H2),
plan a Key Takeaways box. This section serves three purposes:
1. Reduces bounce rate — readers immediately confirm the content
   is relevant to their needs
2. Improves AI citability — structured summary for AI Overviews
   and generative search results
3. Increases featured snippet capture — concise, extractable points

Plan 3–5 bullet points that:
- Highlight the most actionable insights from the post
- Focus on outcomes and value, not just topic labels
  (e.g., "A 2024 study found that X reduces Y by 37%" not
  "This post covers X and Y")
- Include the primary keyword naturally in at least one bullet
- Are self-contained — each bullet makes sense without the others
- Total: 80–100 words for the entire Key Takeaways section

Format in the draft as a distinct section with a ## heading
like "Key Takeaways" or "What You'll Learn."

**C. FULL H2 / H3 STRUCTURE**

Rules for every header in the outline:

**Markdown heading mapping (for the final MD file):**
- H2 = `##` — main section headings (including conclusion)
- H3 = `###` — subsection headings and FAQ questions
- H4 = `####` — only if a third nesting level is truly needed
- Never use `#` (H1) inside the draft body content.

- H2s: written for human readability — engaging, no vague labels
  like "Introduction", "Overview", "Conclusion", "Final Thoughts",
  "Wrapping Up", "The Bottom Line", or "Final Words."
  This applies to ALL H2s including the conclusion section.
- H3s: written as exact search queries or questions — the precise
  phrases a user would type into Google (PAA and long-tail capture)
- No two H2s may overlap in topic or intent
- Every H2 must have at least one H3 beneath it
- At least one H2 per post must address a voice-search angle
  (conversational, question-format, spoken-word friendly)
- The 3 angles identified in Phase 1 must each have their own H2
- Structure must deliver progressive revelation — each H2 builds
  on the last, not sits beside it independently

**D. CONTENT ELEMENT PLANNING**

For each H2 section, decide whether any non-paragraph elements
would serve the reader better than prose alone:
- Comparison of 2+ items with multiple attributes → table
- Sequential process or ranked items → numbered list
- Unordered set of options, tips, or features → bullet list
- Binary or multi-option decisions → table or short list

Note the planned element type in the outline next to the
relevant H2/H3. If a section is best served by paragraphs alone,
leave it as prose. Do not insert tables, lists, or other elements
purely for visual variety. Every non-paragraph element must earn
its place by communicating the information more clearly than
prose would.

**E. CONCLUSION PLAN**

The conclusion must be concise and impactful. It does three things:
- Reinforce the core answer (AEO signal)
- Deliver a specific next step or CTA that connects to the
  content-to-product bridge identified in Phase 1, section 9.
  The CTA should feel like a natural next step from the content,
  not a disconnected sales pitch.
- End with a memorable final insight or reframe

The conclusion is not a summary. Do not recap what the post covered.
Do not restate points already made. A conclusion that reads like a
summary is a conclusion that lost the reader. Get in, land the
final insight, and get out.

**Conclusion H2 naming rule:**
The conclusion H2 follows the same rules as every other H2 in the
post. It must be engaging, specific, and relevant to the topic.
Never use generic labels like "Conclusion," "Final Thoughts,"
"To Conclude," "Wrapping Up," "The Bottom Line," or "Final Words."
Write it as a real H2 that signals what the reader gains from
this closing section.

**Content order:** The conclusion appears before the FAQ section
in the published post. The FAQ is always the last content section.

**F. FAQ SECTION**

- 4–6 questions sourced from the PAA questions identified in Phase 1
- Format: question as H3 header, answer as a normal paragraph below
- Each answer must be 40–60 words and fully standalone
- Questions must be real — things people actually ask, not
  invented questions nobody would search
- The FAQ section is always the last section of the post,
  positioned after the conclusion

**G. INTERNAL LINK MAP**

Identify 5–7 internal link opportunities within the post.

**Internal link distribution rule — non-negotiable:**
Links must be spread quasi-evenly throughout the body of the post.
Do not cluster links in the conclusion or in any single section.
If the post has 5 H2 sections, the links should touch at least
3–4 of those sections. No more than 2 internal links in any
single H2 section. The conclusion may contain at most 1 internal
link (as part of a CTA), but this is optional, not default.

**Internal linking rules — all four are non-negotiable:**

1. ONE DESTINATION PER POST — each linked page may appear only once
   across the entire post. If a page has already been linked,
   do not link to it again under any circumstances.

2. ONE ANCHOR TEXT PER POST — each anchor text phrase may be used
   only once. No anchor text may be reused for a different link
   or repeated for the same link.

3. CONTEXTUAL ANCHOR TEXT — the anchor text must describe the
   specific content of the destination page, not just the topic.
   Wrong: "ergonomic chairs" linking to a guide on choosing ergonomic chairs
   Right: "how to choose the right ergonomic chair for your body type"
   The anchor text should tell the reader exactly what they will find
   if they click — not just the broad subject area it belongs to.

4. NATURAL IN SENTENCE — the anchor text must read naturally within
   its sentence. Do not restructure a sentence awkwardly to force
   a keyword into the link.

Format known URLs as: [anchor text](https://yoursite.com/blog/page-slug)
Format unknown URLs as: [anchor text](INTERNAL_LINK:topic-description)
so the editor can replace the placeholder with the real URL before publishing.

**INTERNAL LINK FORMATTING — CRITICAL:**
Internal links must be valid markdown hyperlinks in the draft and MD file.
Broken links are the most common formatting failure. Follow these rules:

1. **Zero space between ] and (** — this is the #1 cause of broken links.
   CORRECT: `[anchor text](https://yoursite.com/blog/slug)`
   WRONG:   `[anchor text] (https://yoursite.com/blog/slug)`
   WRONG:   `[anchor text]  (INTERNAL_LINK:topic)`
   A single space breaks the markdown link. Zero tolerance.

2. **Resolve URLs whenever possible.** Use the Website URL from the
   Website Context section as the base. If you know the blog post
   exists (from the cross-content consistency check, the related
   posts field, or a web search), construct the full URL:
   `[anchor text](https://yoursite.com/blog/actual-slug-here)`
   If Web Search mode is active, search the site to find the actual
   URL before defaulting to a placeholder.

3. **Placeholder format for truly unknown URLs:**
   Use `INTERNAL_LINK:` prefix with a descriptive slug (no spaces,
   hyphens only). This makes it easy to find-and-replace later:
   CORRECT: `[how ergonomic chairs improve posture](INTERNAL_LINK:ergonomic-chairs-posture-guide)`
   WRONG:   `[how ergonomic chairs improve posture](INTERNAL LINK → effects of poor sitting posture and how ergonomics can help)`
   The placeholder must look like a URL (no spaces, no arrows, no
   long descriptions). Editors will search for `INTERNAL_LINK:` to
   find all unresolved links.

4. **Verify every link in the draft.** Before finalising, click-test
   mentally: is there a space before the `(`? Is the URL inside `()`
   a real URL or a properly formatted placeholder? If the format is
   wrong, fix it.

Before finalising the internal link map, run this self-check:
- List all anchor texts — are any identical or near-identical? Fix.
- List all destination pages — does any page appear more than once? Fix.
- Read each anchor text in isolation — does it clearly and specifically
  describe the destination content? If not, rewrite it.
- Check distribution — are links spread across multiple H2 sections? Fix if clustered.
- Verify markdown syntax: every link must have zero space between ] and (.

---

### ─── PHASE 3: DRAFT WRITING ──────────────────────────────────────────

*Write the full draft. All rules below are active simultaneously from
the first word. These are not a post-draft checklist — they are
writing instructions embedded into every paragraph as it is created.*

---

#### ■ SEO RULES

**Keyword placement (non-negotiable):**
- Primary keyword must appear in the first sentence of the post.
  If it cannot appear naturally in the first sentence, it must
  appear within the first paragraph at the latest.
- Primary keyword in: H1, first sentence/paragraph, at least one H2,
  title tag, meta description
- Secondary keywords distributed naturally across H2s, H3s, and body
  — never clustered in one section
- Semantic field vocabulary woven organically throughout the full post
  — not front-loaded into the intro
- Keyword density: 0.5–1.5% for primary keyword
- Golden rule: if the primary keyword cannot be placed naturally,
  skip it. Natural language always overrides keyword placement.

**Readability — mobile-first:**
- Default: maximum 2 sentences per paragraph
- Exception: a paragraph may contain 3 sentences only when the
  subject is technically complex AND all three sentences are
  under 12 words each. If any of the three exceeds 12 words,
  the paragraph must be split. This exception should be rare.
- Maximum sentence length: 20 words. Hard ceiling. If a sentence
  exceeds 20 words, split it or rewrite it. No exceptions.
  A 21-word sentence is a sentence that needs editing.
- Sentence rhythm: after every 2–3 sentences of 15–20 words,
  write one short sentence of 5–10 words. Let it land.
- Transition sentence between every major H2 section
- Reading level matched to the target audience (from Phase 1)
- Active voice default — passive voice under 10% of sentences
- Calibrate depth and length to topic complexity, not word count targets

**Content element usage:**
Use non-paragraph elements where the content structure calls for them:
- Comparison of items with multiple attributes → use a table
- Sequential steps or ranked items → use a numbered list
- Unordered set of options, features, or tips → use a bullet list
- Binary or multi-option decision → use a table or short list

These elements improve scannability, engagement, and snippet capture.
But they must serve the content. If a section communicates best as
prose, keep it as prose. Never insert a table or list just for
visual variety.

**Draft formatting rules:**
- Do not use horizontal rule separators (---) anywhere inside the
  blog draft content. Horizontal rules are for the prompt structure
  only, not the published blog.
- Image placeholders ([IMAGE-FEATURED], [IMAGE])
  must be on their own line with a blank line before and after.
  Never inline them within a paragraph.
- [QUOTABLE] markers must be on their own paragraph line, separate
  from the quoted sentence. The quotable sentence is its own paragraph;
  the [QUOTABLE] tag sits on the line immediately after it.
- The FAQ section must use H3 (###) for individual questions, not H2.
  The FAQ section itself may have an H2 header, but each question
  beneath it is an H3.
- All internal and external links must be valid markdown hyperlinks
  with zero space between `]` and `(`. A single space breaks the link.
  CORRECT: `[anchor text](https://example.com/page)`
  WRONG:   `[anchor text] (https://example.com/page)`
  Unresolved internal links use: `[anchor text](INTERNAL_LINK:slug)`
  Never use arrows, long descriptions, or spaces in link URLs.

---

#### ■ AEO RULES

**Opening paragraph — Hook-Answer-Promise:**
- Structure exactly as planned in Phase 2
- Total: 40–70 words
- The Answer portion (40–60 words) must be standalone —
  extractable by Google with no surrounding context
- Primary keyword must appear in the first sentence
- No throat-clearing opener under any circumstances

**Snippet format matching:**
Match the most critical section's format to the snippet type
identified in Phase 1:
- Paragraph snippet → 40–60 word direct answer paragraph
  immediately after the relevant header
- List snippet → clean numbered or bulleted list, each item
  a complete standalone point
- Table snippet → properly formatted comparison or data table
- Definition snippet → bolded term + 1–2 sentence definition

**QAC Formula — apply to every H3:**
- Q → the question as the H3 header (exact search query format)
- A → direct 40–60 word answer immediately below the header
  (fully standalone, snippet-ready)
- C → elaboration, evidence, and supporting detail in
  subsequent paragraphs

**40–60 Word Rule:**
Every H2 and every H3 opens with a direct, self-contained
40–60 word paragraph before any elaboration. This creates
snippet-capture opportunities throughout the entire post,
not just at the top.

**Voice search:**
At least one H3 per major H2 section must be written in
conversational, spoken-word format — phrased as someone
would ask it aloud, answered in a tone that reads naturally
when spoken.

**Schema-mirroring:**
- FAQ section: question as H3 header, answer as normal paragraph below
- How-to sections: numbered steps beginning with action verbs
- Definition sections: bolded term followed by concise definition

**Freshness:**
- Reference currency where relevant: "as of 2025...",
  "current research shows...", "the latest data indicates..."

---

#### ■ GEO RULES

**Factual density:**
Every major claim must be accompanied by a specific statistic,
data point, study reference, or concrete example.
Prohibited without immediate supporting specifics:
"many studies show", "research suggests", "some experts believe",
"it is generally accepted."
If a claim cannot be supported with a real source and URL,
reframe it or remove it.

**Quotable insights — craft 5–8 throughout the post:**
Each must:
- Be 15–30 words, a complete idea with no dangling references
- Convey a specific insight, not a generality
- Be memorable enough that a human would want to repeat it
- Be fully standalone — citable without surrounding context
Mark each with [QUOTABLE] during drafting

**Original framework:**
Introduce the named framework identified in Phase 1.
Give it a distinct name. Define it with 3–5 components.
Frame it as original intellectual property of this post.
Example framing: "The [Name] Framework identifies three stages..."

**External citation:**
For each major factual claim, cite the most authoritative
available source.
Format: "According to [Source Name](URL), [specific finding]."
Always include a real URL — search for the source if needed.
If a source cannot be verified, do not cite it at all.
Do not invent or hallucinate URLs or citations.
Acceptable sources: peer-reviewed research, institutional data,
government statistics, industry reports, established expert consensus.

**External link ecosystem rule:**
The same external URL may appear in a maximum of 2 blog posts
across the entire blog ecosystem. This is not a per-post limit;
it is a cross-site limit. When selecting external sources to cite:
- Prefer sources that are unlikely to have been cited in other
  blog posts on the site.
- If a source is commonly cited in SEO/marketing content (e.g.,
  a well-known industry report), consider whether it may already
  appear in 2 other posts. If uncertain, flag with
  [CHECK: EXTERNAL LINK MAY EXCEED 2-POST LIMIT — verify against
  existing blog content before publishing].
- Diversify external sources across the blog ecosystem. Do not
  default to the same "go-to" sources for every post.

**Structured data language:**
- Definition-first paragraphs: define before elaborating
- Explicit categorization: "There are three types of X: [1], [2], [3]"
- Comparative structures: "X differs from Y in three key ways..."
- Numbered hierarchies for all processes and ordered sequences
Write as if the content will be parsed by a machine as well as
read by a human — because it will be.

**Multi-angle coverage:**
The post must address the topic from all 3 angles identified
in Phase 1, each with its own clearly delineated H2.
This increases the number of query types the post can be
retrieved for across AI systems.

**Brand and author attribution:**
Frame original analysis, frameworks, and data interpretations
with explicit attribution language suitable for AI extraction.
Use the brand name from the Website Context section.
Examples: "Our analysis of X shows..." /
"The [Framework Name], developed here, suggests..." /
"[Brand Name]'s approach to X identifies..."

---

#### ■ E-E-A-T RULES

**YMYL protocol** (activate if YMYL = Yes from Phase 1):
- Every factual claim requires a verifiable source
- All recommendations framed as general information,
  not personal advice
- Include appropriate disclaimer:
  "This content is for informational purposes only.
  Consult a qualified [professional] before..."

**Experience signals — minimum 3 per post:**
Write from an experiential perspective throughout.
Include at least 3 observations, caveats, or insights that
imply direct engagement with the subject — not just knowledge of it.
Language that signals experience:
"what you'll actually notice", "what most guides skip",
"in practice", "in real use", "the thing nobody tells you",
"what changes after you try this"

**Expertise signals — minimum 1 per H2 section:**
Include at least one nuance, caveat, common misconception, or
expert-level observation per major section.
The reader should feel they are learning from someone who
genuinely knows this subject deeply — not from someone who
read the same top 10 articles they have.

**Authority tone:**
Take clear positions. Defend them with evidence.
Avoid excessive hedging language: "it might be", "some could argue",
"it's possible that", "in some cases."
One hedge on a genuinely uncertain claim is appropriate.
More than one hedge on the same claim signals low authority.
Write with the confidence of a subject matter leader.

**Trustworthiness:**
Where legitimate counterarguments or limitations exist,
acknowledge them. A post that presents only one side of a
nuanced topic reads as promotional, not authoritative.
Acknowledge complexity, then guide the reader to the
most evidence-supported conclusion.
No internal contradictions. Every claim consistent throughout.

**Helpful Content self-check** (apply before concluding the draft):
Ask internally:
- Does this post offer original information or insight?
- Is it complete — does the reader need to go elsewhere?
- Would a reader feel genuinely informed after reading?
- Is every paragraph earning its place?
Remove or rewrite any section that fails this test.

---

#### ■ DRAFTING AND VOICE RULES

**Voice — apply the position determined in Phase 1:**
- Authoritative: clear, direct, evidence-forward, no filler
- Warm-practical: knowledgeable friend, not a textbook
- Energetic: short sentences, high momentum, no academic hedging
- Curious: invite the reader into the investigation
- Conversational: writer and reader as equals exploring together
Voice must feel consistent from the first sentence to the last —
as if the same person wrote every paragraph.

**Anti-AI writing rules — enforce throughout:**

AI detection tools (ZeroGPT, GPTZero, Originality, Turnitin) measure
two core metrics: perplexity (how predictable word choices are) and
burstiness (how varied sentence structure and length are). AI text
scores low on both. The rules below are designed to produce writing
that scores high on both, while also avoiding the stylometric
patterns that Google's Helpful Content system flags as low-quality
automated output.

**PERPLEXITY: make word choices less predictable**

1. Choose the precise word, not the probable word.
   Where a generic AI would write "improve," write "sharpen,"
   "accelerate," or "overhaul" if that's more accurate.
   Where it would write "significant," write "measurable,"
   "outsized," or "hard to ignore." The goal is not to be
   fancy. The goal is to be specific, because specific is
   unpredictable.

2. Use contractions naturally.
   "You'll" not "You will." "It's" not "It is." "Don't" not
   "Do not." Formal non-contracted prose is a strong AI signal.
   Exception: skip contractions where emphasis or formality
   genuinely requires the full form.

3. Include colloquialisms and natural phrasing.
   "The math doesn't add up." "This is where things get messy."
   "That's the whole point." These are phrases a real writer
   uses. AI defaults to formal, sanitized alternatives.

4. Avoid the AI vocabulary blacklist — never use these words:
   delve, crucial, pivotal, landscape (figurative), tapestry,
   intricate/intricacies, meticulous/meticulously, underscore
   (figurative), testament, vibrant, bolstered, fostering,
   showcasing, highlighting, enhance (when "improve" works),
   leverage (when "use" works), streamline, utilize (when "use"
   works), comprehensive (when "complete" or "thorough" works),
   robust, seamless, elevate (figurative), navigate (figurative),
   realm, multifaceted, cornerstone, empower, synergy,
   game-changer, harness.
   These words are statistically overrepresented in AI output.
   Every one of them has a more natural alternative. Use it.

5. Zero filler transitions — never use:
   Furthermore / Moreover / Additionally / In conclusion /
   It's worth noting / It's important to remember /
   In today's world / It goes without saying / That being said /
   It should be noted / Moving forward / At the end of the day /
   plays a significant role in shaping.
   Connect ideas with logic, not filler words.

**BURSTINESS: vary structure aggressively**

6. Sentence length must swing, not settle.
   If three consecutive sentences are between 12 and 20 words,
   the fourth must be under 8. Or over 15 with a different
   structure. AI writes sentences that cluster around 15–20
   words with uniform structure. Humans don't.

7. Mix sentence types within every section.
   Declarative. Interrogative. Imperative. Fragment.
   Not every section needs all four, but no section should
   be 100% declarative statements. A well-placed question
   or a two-word fragment breaks the AI pattern.

8. Vary paragraph length asymmetrically.
   One paragraph: single sentence. Next: two sentences.
   Then maybe another single sentence for emphasis.
   AI produces evenly-sized paragraphs. Humans don't.
   Let importance and impact dictate paragraph length,
   not uniformity.

9. Vary depth by section importance.
   Not every H2 section deserves equal depth. AI gives every
   section the same weight and word count. Human writers
   spend 300 words on the most important point and 80 on the
   supporting one. Let the content's importance dictate length.

10. No consecutive sentence-start repetition.
    No two consecutive sentences may begin with the same word.
    Three consecutive sentences starting the same way is a
    critical writing failure. Vary sentence openings within
    every paragraph: if one sentence starts with "This," the
    next must start differently.

**STYLOMETRIC SIGNALS: write like a human, not a model**

11. Start some sentences with "And," "But," "So," or "Or."
    This breaks the formal pattern AI defaults to.
    Use sparingly (2–4 per post), not in every paragraph.

12. Use parenthetical asides naturally.
    (This is how humans think on the page.)
    AI almost never uses parentheses in body copy.
    One or two per post is enough.

13. Include rhetorical questions at key moments.
    Not as a crutch, but as a genuine invitation to think.
    One rhetorical question every 400–600 words feels natural.
    More than that becomes a pattern of its own.

14. No throat-clearing openers — ever.
    Start with the most interesting, specific, or useful thing
    you have to say. The first sentence must make the reader
    want to read the second.

15. Direct claims — one hedge maximum per uncertain statement.
    Stack of qualifiers = loss of authority.

16. Advancing conclusion — the conclusion must deliver a final
    insight, reframe, or next step. It must not summarize.

17. No em dashes (—) anywhere in the post — ever.
    Em dashes are a strong AI writing signal and must not appear
    in body copy, headers, meta fields, or any output field.
    Replace with: a comma, a colon, a period, parentheses,
    or a restructured sentence. Do a dedicated scan before
    passing Phase 4. Zero em dashes is the only acceptable count.

18. Concrete before abstract — lead with the example, scenario,
    or data point. Draw the principle from it afterward.
    Discovery is more engaging than lecture.

19. Take positions — neutrality without resolution is abdication.
    Where evidence points in a clear direction, state it clearly.

**Sentence-level craft:**
- 2–3 single-sentence paragraphs per post for maximum
  emphasis. Never more — they lose impact through overuse.
- Replace every vague quantity, timeframe, or reference with
  the most specific version available.
- Show before telling — illustrate the claim with a scenario,
  data point, or example before stating the abstract principle.

**Narrative thread:**
- Structure sections as progressive revelation — each H2 builds
  on the last, adding a new layer of understanding
- Open each major H2 with a tension or question; resolve it
  before moving to the next H2
- Plant at least one callback: an idea introduced early that
  resurfaces with greater meaning in a later section

**Engagement mechanics:**
- 2–3 bucket brigade phrases between sections to pull the reader
  forward: "Here's where it gets interesting." /
  "But there's a catch." / "The next part changes everything."
  Used sparingly — 2–3 maximum, or they lose effect.
- At least one open loop: introduce a concept early, defer
  its full resolution to a later section deliberately
- Deliberate 'you' address at key insight or emotional moments
  — not constantly (becomes patronizing), but pointedly
- Subtext acknowledgment: when the reader is likely to have
  an objection, address it before they can raise it mentally

**Image and media placeholders:**
Place image markers at natural breakpoints in the post where a
visual would enhance understanding or break up long text runs.

There are two marker types:

[IMAGE-FEATURED: description of visual concept | text overlay]
[IMAGE: description of visual concept | type: conceptual / infographic / diagram]

Rules:
- Exactly 1 [IMAGE-FEATURED] marker at the top of the post (before H1 content).
  This is the blog's hero/thumbnail image. Text overlay must be a
  shortened version of the blog title containing the primary keyword.
  Maximum 6–8 words. Never a full sentence, tagline, or subtitle.
  Claude generates this image via Canva.
- [IMAGE] markers for all in-content images. These are NOT generated
  by Claude. Claude provides detailed design specs in Section E
  for the user to build manually in Canva. The type field helps
  determine what kind of design spec to provide:
  - conceptual: illustrative visual for concepts, tips, section breaks
  - infographic: data, statistics, comparisons
  - diagram: processes, flows, step sequences
- Not every H2 needs an image. Place them where a visual adds value,
  not for decoration.
- Alt text descriptions must be specific (e.g., "flowchart showing the
  three stages of the Content Velocity Framework" not "diagram of framework").
- Text overlay suggestions should be minimal: a short phrase or key stat,
  never a full sentence. If no text overlay is needed, omit it.

**Niche adaptation:**
Keep structural craft and writing quality constant across
all niches. Adapt only:
- Vocabulary register (technical / semi-technical / plain)
- Example types (match to the niche's natural scenario space)
- Emotional tone (urgency / calm / enthusiasm / precision)

---

### ─── PHASE 4: SELF-AUDIT ─────────────────────────────────────────────

*Run all eight passes before declaring the draft complete.
Each pass has a single focus. Do not combine passes.*

**AUDIT HONESTY — NON-NEGOTIABLE:**
Do not declare a pass as passed unless the content genuinely
meets every criterion. If the draft violates a rule, flag it
and fix it before proceeding. Claiming the audit passes when
the content still contains violations is worse than failing
the audit, because it creates false confidence in the output.
If you are uncertain whether something passes, treat it as a
failure and fix it. Every "pass" declaration is a guarantee.

---

**PASS 1 — STRUCTURAL INTEGRITY**
Read headers only (H1, H2s, H3s, FAQ). Ask:
- Does the header sequence tell a coherent, logical story alone?
- Is any H2 removable without weakening the post?
- Is any H2 missing that the reader would expect?
- Do any two H2s overlap in topic or intent?
- Are all H3s genuine sub-topics of their parent H2?
Output: "Structure holds" or list specific issues to resolve.

**PASS 2 — PROMISE-DELIVERY ALIGNMENT**
Reread the opening paragraph and H1. Then read the full post.
- Did the post deliver exactly what the opening promised?
- Does the conclusion resolve the opening promise?
- Are there any promise-delivery gaps?
Flag gaps: [DELIVERY GAP] — resolve in the body or
revise the opening to match what was actually delivered.

**PASS 3 — EVIDENCE VERIFICATION**
Read only factual claims — skip transitions and context.
- Is every claim supported by a citation, data point, or example?
- Does every citation include a real, working URL?
- Are there unsupported claims dressed as facts?
Flag unsupported claims: [NEEDS EVIDENCE]

**PASS 4 — VOICE CONSISTENCY**
Read specifically listening for voice — not content.
- Is tone consistent from first paragraph to last?
- Are there sections that sound noticeably more generic or formal?
- Are there any paragraphs that sound like default AI prose?
- Are prohibited filler transitions present anywhere?
- Are there any em dashes (—) anywhere in the draft?
  If yes, rewrite every instance. Zero is the only acceptable count.
Flag voice breaks: rewrite before proceeding.

**PASS 5 — AI DETECTION SWEEP**
Read the entire draft specifically scanning for AI writing patterns.
This pass targets the two metrics AI detectors measure:
perplexity (word predictability) and burstiness (structural variation).

Perplexity check:
- Scan for any word from the AI vocabulary blacklist (rule 4 in
  anti-AI writing rules). Replace every instance. Zero tolerance.
- Identify sentences where every word is the most statistically
  probable choice. Rewrite with more precise, less predictable
  alternatives that still fit the context.
- Check for contractions. If fewer than 60% of eligible
  contractions are contracted, add more.
- Check for filler transitions from the banned list. Remove all.

Burstiness check:
- Read sentence lengths across every H2 section. If any section
  has 4+ consecutive sentences within the same 5-word length range
  (e.g., all between 15–20 words), rewrite to vary them.
- Check that every H2 section contains at least one sentence
  under 8 words and at least one over 15 words.
- Verify paragraph lengths vary within each H2 section. Three
  consecutive same-length paragraphs = rewrite.
- Confirm section depths are asymmetric. If all H2 sections are
  within 50 words of each other in length, redistribute. Important
  sections should be noticeably longer than supporting sections.

Stylometric check:
- Are there at least 2–4 sentences starting with "And," "But,"
  "So," or "Or" across the full post?
- Is there at least 1 parenthetical aside in the post?
- Are there rhetorical questions at natural points (roughly
  1 per 400–600 words)?
- Does the post use any three-part list pattern more than twice?
  ("X, Y, and Z" repeated = AI pattern.) Vary the structure.
- Read the first sentence of every paragraph. Do they follow
  the same grammatical structure? If yes, vary them.
- Check for consecutive sentence-start repetition: no two
  consecutive sentences within the same paragraph may begin with
  the same word or the same grammatical pattern (e.g., "This...
  This... This..." or "The... The... The..."). Three consecutive
  sentences with the same opening is a critical failure. Rewrite
  immediately.

If any check fails, rewrite before proceeding. Do not flag
for later. Fix it now.

**PASS 6 — DENSITY AND PADDING**
Read looking only for waste.
Test every sentence: does this add information, evidence,
nuance, or momentum not present elsewhere?
If no — it is padding.
Flag padding: [PADDING] — cut or transform.
Target: the post should emerge leaner and more powerful.
Not shorter for the sake of it — tighter for the sake of quality.

**PASS 7 — READER EXPERIENCE AND MOBILE READABILITY**
Read as the target audience member on a mobile phone
encountering this for the first time.
- Is there any moment of confusion or lost thread?
- Is there assumed knowledge the reader may not have?
- Is there undefined jargon?
- Does any paragraph exceed 2 sentences? If so, does it
  qualify for the 3-sentence technical exception (all under
  12 words)? If not, split it.
- Does any sentence exceed 20 words? If so, split or rewrite.
- Is there any section where reading feels like work?
- Is there any moment you'd want to close the tab?
- Would a reader finish this feeling genuinely informed and served?
- Are content elements (tables, lists) used where they would
  communicate more clearly than prose?
Flag friction: [READER FRICTION] — resolve before proceeding.

**PASS 8 — PUBLISHING READINESS**
Confirm every item:
- [ ] H1 selected and within 55–60 characters
- [ ] Title tag finalized, under 60 characters, keyword-forward
- [ ] Meta description finalized, under 160 characters,
      written as value proposition
- [ ] URL slug finalized, 3–6 words, keyword-forward, no stop words
- [ ] Primary keyword appears in the first sentence of the post
- [ ] FAQ schema JSON-LD generated and matches FAQ section
- [ ] Automation pipeline format: sections [2]–[7] use single #
      headings, [2]/[3]/[4] plain text on next line, [7] has
      literal script tags, no char counts on value lines
- [ ] Heading hierarchy in [6]: ## for article title and main
      sections, ### for subsections, no # (H1) inside draft content
- [ ] No paragraph exceeds 2 sentences (or 3 sentences under
      12 words each for technical exception)
- [ ] No sentence exceeds 20 words
- [ ] Internal link audit complete:
      — 5–7 internal links present
      — Links distributed quasi-evenly across H2 sections
      — No more than 2 links in any single H2 section
      — No more than 1 link in the conclusion
      — No destination page linked more than once
      — No anchor text used more than once
      — Every anchor text describes the destination specifically,
        not just the broad topic
      — All links read naturally within their sentences
      — Zero spaces between ] and ( in every markdown link
      — All resolved links use full URLs from Website Context base URL
      — All unresolved links use INTERNAL_LINK: prefix with hyphenated slug
      — No links use the old format (INTERNAL LINK → description)
- [ ] All external citations include a real working URL
- [ ] External links flagged if potentially exceeding 2-post ecosystem limit
- [ ] Keyword cannibalization check completed (or flagged for manual review)
- [ ] If high cannibalization risk: angles differentiated from existing post
- [ ] Cross-content consistency: no contradictions with existing blog posts
- [ ] SERP analysis completed: dominant intent, format, features identified
- [ ] Information gain: at least 1 differentiation angle implemented
- [ ] Baseline entity coverage: all core entities from SERP are addressed
- [ ] Content format matches SERP majority (or deviation justified)
- [ ] Key Takeaways section present after opening, 3–5 bullets, 80–100 words
- [ ] Content-to-product bridge present (natural, not promotional)
- [ ] Conclusion CTA connects to product bridge
- [ ] Content refresh sensitivity assessed, [REFRESH NOTE] flags placed
- [ ] SERP features targeted (AI Overview structure, snippet format, PAA)
- [ ] All [QUOTABLE] sentences marked
- [ ] FAQ formatted as H3 questions with normal paragraph answers
- [ ] Author bio block complete (see Phase 5)
- [ ] Word count appropriate to complexity from Phase 1
- [ ] Conclusion is concise, has engaging H2 (not generic label),
      contains a CTA, does not summarize
- [ ] Conclusion appears before FAQ in content order
- [ ] At least one named original framework present
- [ ] 5–8 [QUOTABLE] sentences present
- [ ] Opening paragraph follows Hook-Answer-Promise structure
- [ ] Exactly 1 [IMAGE-FEATURED] marker at top of post
- [ ] [IMAGE] markers for in-content images where appropriate
- [ ] All image markers include specific visual descriptions
- [ ] Image Brief ([13]) is complete
- [ ] Content order: body sections → conclusion → FAQ (last)
- [ ] Content elements (tables/lists) used where appropriate
- [ ] Zero horizontal rules (---) inside blog draft content
- [ ] All image placeholders on own line with blank lines around them
- [ ] All [QUOTABLE] markers on own paragraph line, not inline
- [ ] FAQ questions use H3 headers (not H2)
- [ ] Zero em dashes in the entire post
- [ ] Zero words from the AI vocabulary blacklist
- [ ] Contractions used naturally (60%+ of eligible instances)
- [ ] Sentence lengths vary within every H2 section
- [ ] Section depths are asymmetric (not all H2s same length)
- [ ] At least 2 sentences start with "And," "But," "So," or "Or"
- [ ] At least 1 parenthetical aside present
- [ ] Zero filler transitions from banned list
- [ ] No consecutive sentences start with the same word in any paragraph

Output: [READY TO PUBLISH] only when all items confirmed.
If any item is unresolved, list it and resolve before proceeding.

---

**COMPRESSION — apply after all eight passes:**
Remove throughout:
- Opening qualifiers: "It's important to understand that..." →
  cut the qualifier, start with the content
- Redundant pairs: "various and diverse", "each and every",
  "first and foremost" → pick one
- Weak intensifiers: "very", "really", "quite", "rather",
  "somewhat" → cut or replace with a stronger word
- Passive constructions: "it has been found that" →
  state the finding directly
- Throat-clear clauses: "When it comes to X, the thing to
  know is..." → just say the thing

**CONSISTENCY AUDIT — apply after compression:**
Audit and resolve inconsistencies in:
- Terminology: same term used consistently throughout
- Tone: voice does not drift between sections
- Claims: no internal contradictions
- Header formatting: H3s consistently formatted as questions
  or consistently as statements — not mixed
- Data: statistics cited identically wherever they appear
Flag: [INCONSISTENCY] — resolve to the correct version throughout.

**SEO FINAL VERIFICATION:**
- Primary keyword present in first sentence, H1,
  at least one H2, title tag, meta description, URL slug
- URL slug is 3–6 words, keyword-forward, no stop words
- Read the post listening for unnatural keyword repetition
- Secondary keywords distributed — none clustered in one section
- Semantic field vocabulary present throughout — not front-loaded
- Internal links distributed quasi-evenly, not clustered
- Meta title and description are final and within character limits
- FAQ schema JSON-LD matches FAQ section exactly

**ORIGINALITY CHECK:**
Does this post contain at least one idea, framework, insight,
or perspective that the reader could not get from the top 3
currently ranking posts on this topic?
If no — add it now. One original insight is sufficient to
differentiate the post from everything competing with it.
This is non-negotiable before declaring the post ready.

---

### ─── PHASE 5: FINAL OUTPUT ───────────────────────────────────────────

*Deliver the complete final package directly in the chat window
in markdown format. Do NOT create or save a separate file at this stage.
After the user approves the content, the Post-Approval Delivery
executes automatically: MD file ([1]–[6]) → FAQ schema in chat → image creation.*

---

**AUTOMATION PIPELINE FORMAT — CRITICAL**
The MD file output ([1] through [6]) must follow these exact
formatting rules. The automation pipeline parses section headings
to extract content. Any deviation will break the pipeline.

[7] FAQ SCHEMA is NOT included in the MD file. It is delivered
separately in the chat as a copy-pasteable code block.

Rules:
1. Section headings use a single # followed by a number in brackets.
   Example: # [2] TITLE TAG
   Do NOT use ## or ### for these top-level section markers.
2. For [2], [3], and [4]: the content value must appear on the very
   next line after the heading, as plain text only. No bold, no
   backticks, no extra blank lines before the value.
3. Do NOT append character counts (e.g., "(58 chars)") on the same
   line as the title or meta description. Put character counts on a
   separate line below, or omit them entirely.

---

**[1] POST METADATA**
*(This section is informational and not parsed by the pipeline.
Format as a code block.)*
```
Primary keyword:
Secondary keywords:
Search intent:
Snippet format targeted:
Voice position:
Word count:
Reading level:
YMYL: Yes / No
```

The sections below ([2] through [6]) are pipeline-parsed.
Follow the automation format rules exactly.

**Example of correct format for [2], [3], [4]:**
```
# [2] TITLE TAG
Your Exact Title Tag Here

# [3] META DESCRIPTION
Your exact meta description here without bold or formatting

# [4] URL SLUG
your-url-slug-here
```

**[2] TITLE TAG**
Single # heading. Title on the very next line, plain text only.
Under 60 characters. No bold, no backticks, no character count
on the same line.

**[3] META DESCRIPTION**
Single # heading. Meta on the very next line, plain text only.
Under 160 characters. No bold, no backticks, no character count
on the same line.

**[4] URL SLUG**
Single # heading. Slug on the very next line, plain text only.
No backticks around the slug. 3–6 words, keyword-forward,
no stop words.

**[5] SELECTED H1**
Single # heading. H1 text followed by rationale.
This section is informational and not parsed by the pipeline.

**[6] FULL POLISHED DRAFT**
Single # heading. Full article content follows.

**Heading hierarchy inside [6] — CRITICAL:**
The section marker `# [6] FULL POLISHED DRAFT` occupies H1 in the
markdown file. The WordPress post title is set separately as H1.
Therefore, the draft body must start its heading hierarchy at H2.
Do not add an extra heading level just because # [6] is present.
Write the draft as if ## is your top-level heading.

- `##` (H2) — the article title repeated at the top of the draft
- `##` (H2) — all main section headings within the article body
- `###` (H3) — all subsection headings
- `####` (H4) — only if a third level of nesting is truly needed
  (rare; avoid unless the content genuinely requires it)

Do NOT use `#` (H1) anywhere inside the draft content.
Do NOT use `###` for main section headings (they will render as
H3 in WordPress and Google Docs instead of the intended H2).

Complete post with all placeholders intact:
[anchor text](https://yoursite.com/blog/slug) — for resolved internal links
[anchor text](INTERNAL_LINK:descriptive-slug) — for unresolved internal links (no spaces, no arrows)
[anchor text](https://external-source.com/page) — for external citations
[QUOTABLE]
[IMAGE-FEATURED: description | text overlay]
[IMAGE: description | type]
[NEEDS EVIDENCE] — if any remain unresolved

**Internal link syntax reminder:** Zero space between ] and (.
Every internal link in the draft must be a valid markdown hyperlink.

Content order in the draft:
1. ## [Article Title] (repeated as H2)
2. Opening (Hook-Answer-Promise)
3. ## Key Takeaways (3–5 bullet points, 80–100 words)
4. Body ## / ### sections (with image markers where appropriate)
5. Conclusion (## engaging H2, not a generic label)
6. FAQ section (## heading, ### for individual questions, always last)

**[7] FAQ SCHEMA — CHAT ONLY (not in the MD file)**
This section is delivered directly in the chat as a copy-pasteable
code block during Step 2 of Post-Approval Delivery. It is NOT
included in the MD file.

Must contain the complete JSON-LD wrapped in literal
`<script type="application/ld+json">` and `</script>` tags.
A raw JSON block without the script wrapper will not work.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[question from FAQ section]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[answer from FAQ section]"
      }
    }
  ]
}
</script>
```
Include all 4–6 FAQ questions and answers from the post.
Answers must match the published FAQ answers exactly.

**[8] INTERNAL LINK MAP**
Complete list of all link opportunities with anchor text and
their location in the post (which H2 section):
- [anchor text](https://yoursite.com/blog/actual-slug) — in H2: [section name] — RESOLVED
- [anchor text](INTERNAL_LINK:descriptive-slug) — in H2: [section name] — UNRESOLVED
...

All UNRESOLVED links use the `INTERNAL_LINK:` prefix with a
hyphenated slug (no spaces). The editor can search for
`INTERNAL_LINK:` to find all links needing manual URL replacement.

**[9] SOCIAL PULL QUOTES**
The 5–8 [QUOTABLE] sentences extracted and ready to copy
for social media, newsletters, or promotional use.

**[10] EDITOR FLAGS — RESOLVE BEFORE PUBLISHING**
Consolidated list of all items requiring human verification:
- [NEEDS EVIDENCE]: list any claims still requiring support
- Broken or unverified URLs: list any links that could not be confirmed
- [CHECK: EXTERNAL LINK MAY EXCEED 2-POST LIMIT]: list any external
  URLs that may already appear in 2 other blog posts
- [VERIFY: KEYWORD OVERLAP]: if cannibalization check could not be
  completed (Standard mode), flag for manual verification
- [VERIFY WITH SERP ANALYSIS]: if SERP analysis could not be
  completed (Standard mode), flag for manual verification
- [REFRESH NOTE]: list all content elements flagged for future refresh
  with the recommended refresh interval
- [CROSS-CONTENT CHECK]: if related blog posts could not be read,
  flag concepts that should be verified for consistency
- [AHREFS DATA UNAVAILABLE — USING WEB SEARCH]: if Ahrefs API was
  unavailable and web search was used as fallback, note which
  Phase 1 sections were affected

**[11] AUTHOR BIO BLOCK**
60–80 words, third person.
Use the brand name from the Website Context section.
Establish expertise relevant to this specific topic.
Include 2–3 credibility signals appropriate to the niche
(years of experience, specific background, publications,
relevant achievements, certifications).
Tailor the bio to connect the author's expertise to the
products/services described in the Website Context.

**[12] PUBLISHING READINESS VERDICT**
```
Status: READY TO PUBLISH / NOT READY
Outstanding items (if not ready): [list]
```

**[13] IMAGE BRIEF**
A summary table of all images needed for this post.
The featured image is generated via Canva in Section E.
All in-content images receive detailed design specs in Section E
for the user to build manually.

| # | Type | Placement | Visual concept | Dimensions |
|---|------|-----------|---------------|------------|
| 1 | Featured (Canva) | Top of post | [description] — text: [6–8 word title] | 1920x1080 |
| 2 | [conceptual / infographic / diagram] | H2: [section] | [description] | 1920x1080 |
| ... | ... | ... | ... | ... |

Rules:
- Featured image: Canva-generated. Shortened blog title with primary
  keyword, 6–8 words max.
- All in-content images: manual design. Detailed specs delivered
  in Section E Part 2.
- All images: 1920x1080 px (16:9 landscape), no exceptions.

### POST-APPROVAL DELIVERY

*This step is triggered when the user approves the blog content.
Do not execute until the user explicitly approves the Phase 5 output.
Once triggered, execute all three steps below in one continuous
output with no pauses or prompts between them.*

When the user approves the blog content, deliver everything in
one single response in this exact order:

**Step 1 — MD file**
Create and present a markdown file containing Phase 5 items
[1] through [6] only. The MD file ends after the full polished draft.

CRITICAL: The MD file MUST follow the Automation Pipeline Format
rules defined in Phase 5. Specifically:
- Sections [2] through [6] use single # headings with bracket numbers
  (e.g., # [2] TITLE TAG). Not ## or ###.
- [2], [3], [4]: plain text value on the very next line after the
  heading. No bold, no backticks, no character counts on the same line.

Contents in order:
- # [1] POST METADATA (code block)
- # [2] TITLE TAG (plain text on next line)
- # [3] META DESCRIPTION (plain text on next line)
- # [4] URL SLUG (plain text on next line, no backticks)
- # [5] SELECTED H1 (H1 + rationale)
- # [6] FULL POLISHED DRAFT (full article)

Do NOT include # [7] FAQ SCHEMA in the MD file.
Do not include items [7] through [13] in the MD file.

Name the file: `[blog title].md`
Use the selected H1 from [5] as the blog title.
Replace spaces with hyphens. Lowercase. Remove special characters.
Example: `how-to-choose-ergonomic-chairs.md`

**Step 2 — FAQ schema in chat**
Immediately after presenting the MD file, output the FAQ schema
directly in the chat as a copy-pasteable code block with literal
`<script type="application/ld+json">` and `</script>` tags.
This is the only place the FAQ schema appears. It is NOT in the
MD file. The user copies it directly from chat into their CMS.

**Step 3 — Image creation (Section E)**
Immediately after the FAQ schema, proceed to execute Section E
(featured image generation via Canva + in-content image design
specs in chat). Do not wait for the user to trigger this separately.

---

## SECTION D — GLOBAL RULES
*Active at all times throughout the entire pipeline.
These override any instruction that conflicts with them.*

1. **Mobile-first, always.**
   Write for readers on a phone screen. Short paragraphs,
   short sentences, scannable structure. Every screen-scroll
   should deliver value. If a paragraph looks like a wall of
   text on a 6-inch screen, break it up.

2. **Primary keyword in the first sentence. No exceptions.**
   The primary keyword must appear naturally in the very first
   sentence of the post. Not the first paragraph. Not the first
   100 words. The first sentence. If this rule conflicts with
   any other drafting instruction, this rule wins.

3. **Humans first, algorithms second.**
   If a sentence reads as optimized rather than natural,
   rewrite it. SEO serves the writing — the writing does not
   serve the SEO.

4. **Never summarize when you can illustrate.**
   An example, scenario, or data point is always more
   valuable than an abstract restatement.

5. **Every sentence earns its place.**
   If removing a sentence loses nothing, remove it.

6. **Specificity over generality — always.**
   At every level: claims, examples, data, language.

7. **Be the most useful resource available.**
   The post must be the most comprehensive, trustworthy,
   and genuinely helpful resource a reader could find
   on this topic. If it isn't, it isn't finished.

8. **Never invent citations.**
   If a source cannot be verified with a real URL, do not cite it.
   Omit the claim or reframe it without citing a specific source.
   A missing citation is recoverable. A hallucinated one
   destroys trust permanently.

9. **The pipeline is sequential.**
   Phase 1 before Phase 2. Phase 2 before Phase 3.
   Phase 3 before Phase 4. Phase 4 before Phase 5.
   Do not collapse phases or skip steps.

---

## SECTION E — IMAGE CREATION
*This section is executed automatically as Step 3 of the
Post-Approval Delivery. Do not execute during the blog writing
pipeline (Phases 1–5).*

*This section generates ONLY the featured image via Canva.
All in-content images (conceptual, infographic, diagram) are
delivered as detailed design specs in markdown in the chat
for the user to build manually in Canva.*

---

### PART 1 — FEATURED IMAGE (Canva-generated)

**Step 1 — Retrieve brand kit**
Use the Canva `list-brand-kits` tool to retrieve the user's brand kit.
Pass the brand kit ID to the generate-design tool.

The brand kit's colours must NOT drive the design's colour palette.
The brand kit is attached for logo access and font fallback only.
Brand colours should not appear as backgrounds, dominant fills,
or primary colour schemes.

**Step 2 — Create blog folder**
Use the Canva `create-folder` tool to create a new folder named:
`Blog — [short blog title or primary keyword]`
The featured image will be moved into this folder after creation.

**Step 3 — Generate featured image**
Use the Canva `generate-design` tool with:
- `query`: a detailed description of the visual, derived from the
  Image Brief's featured image entry. Be specific. Include style
  direction, composition notes, and text overlay.
  Always include in the query: "landscape orientation, 16:9 aspect
  ratio, 1920x1080 pixels, wide horizontal layout."
- `design_type`: ALWAYS use `presentation`.
  This produces 1920x1080 px designs (16:9 landscape).
  Do not use `poster`, `infographic`, `flyer`, or any other type.
- `brand_kit_id`: the brand kit ID retrieved in Step 1.

Include in the query:
- "Use Open Sans as the only font. Open Sans Regular for body text,
  Open Sans Bold for headlines. No other fonts."
- "Do not use brand colours as the primary palette. Choose a fresh
  colour palette that suits this visual concept. Use 2–3
  complementary colours. Brand colours as minor accents only."
- Graphical elements (shapes, overlays, colour blocks, icons)
- Text overlay: ONLY a shortened version of the blog title
  containing the primary keyword. Maximum 6–8 words.
  Never subtitles, taglines, or full sentences.
- A composition that looks designed, not just generated

**Step 4 — Select candidate**
Present all candidates to the user with their preview thumbnails.
Ask the user to select their preferred option.

**Step 5 — Create and verify**
Use `create-design-from-candidate` with the selected candidate's
`candidate_id` and `job_id`.
Verify the design is 1920x1080 px landscape. If not, use
`resize-design` with: `{ "type": "custom", "width": 1920, "height": 1080 }`

**Step 6 — Export and organize**
Use `export-design` to export as JPG with regular quality.
Use `move-item-to-folder` to move into the blog folder.

### PART 2 — IN-CONTENT IMAGE DESIGN SPECS (manual build)

After the featured image is complete, output detailed design specs
for every in-content image directly in the chat, formatted in
markdown (not in a code block).

These specs must be detailed and descriptive enough that the user
can open Canva and build the design without guessing. Each spec
should paint a clear picture of what the final image looks like.

For each in-content image, output using this structure:

#### IMAGE #[number] — [short descriptive name]

**Placement:** H2: [section name]
**Type:** [conceptual / infographic / diagram / chart / comparison]
**Dimensions:** 1920x1080 px (16:9 landscape). If data cannot fit
in one image, note that it should be split into multiple images.

**Visual concept:**
[Detailed description of what the image looks like. Be specific:
describe the composition, what appears on the left vs right,
foreground vs background, the overall visual style and mood.
For conceptual images, describe the scene, metaphor, or visual
approach. For infographics/diagrams, describe what the viewer
sees at a glance.]

**Content / data:**
[For infographics: list all data points, statistics, labels,
values, and categories that appear on the image.
For conceptual images: describe any text overlay if applicable.
For diagrams: list all nodes, steps, connections, and labels.]

**Layout:**
- Structure: [e.g., left-to-right flow / top-to-bottom hierarchy /
  grid / side-by-side comparison / radial / timeline / centred focal]
- Sections: [describe how information is grouped visually]
- Visual hierarchy: [what is most prominent, what is secondary,
  what is supporting detail]

**Colour palette:**
- Primary colour: [hex code + name] — used for [what]
- Secondary colour: [hex code + name] — used for [what]
- Accent colour: [hex code + name] — used for [what]
- Background: [colour, gradient, or pattern]

(Choose colours that suit the content and section mood.
Do NOT default to brand colours. Each image can have its own palette.)

**Typography:**
- Font: Open Sans only
- Headline: Open Sans Bold, [size suggestion]
- Body/labels: Open Sans Regular, [size suggestion]

**Elements:**
[Describe specific visual elements: icons, arrows, shapes,
dividers, number callouts, progress bars, illustrations, etc.
Describe relationships between elements: what connects to what,
flow direction, grouping, spacing.]

**Alt text:** [Specific, descriptive alt text for this image]

---

### COMPLETION

After the featured image is exported and all in-content specs
are delivered, output:

```
IMAGE CREATION COMPLETE

FEATURED IMAGE:
Folder: Blog — [title]
File: [design name] | 1920x1080 | Exported (JPG)

IN-CONTENT IMAGES — DESIGN SPECS DELIVERED:
| # | Type | Placement | Dimensions |
|---|------|-----------|------------|
| 1 | [type] | H2: [section] | 1920x1080 |
| ... | ... | ... | ... |
```

### IMAGE RULES

1. **Featured image only via Canva.** All in-content images are
   design specs only. Never generate in-content images via Canva.

2. **User selects the featured image.** Never auto-select a candidate.
   Present options and wait for the user's choice.

3. **Always use `presentation` design type** for the featured image.
   Never use poster, infographic, flyer, or any other type.

4. **Always 1920x1080 landscape.** Featured image must be
   1920x1080 px in landscape orientation (16:9).

5. **Open Sans only.** No other fonts.

6. **Brand colours are NOT the palette.** Each image spec gets its
   own colour palette. Brand colours as minor accents only, or
   not at all.

7. **Featured image text: 6–8 words max.** Shortened blog title
   with primary keyword. No subtitles or full sentences.

8. **Design specs must be actionable.** Every in-content image spec
   must be detailed enough that the user can build the image in
   Canva without guessing about layout, colours, content, or
   visual hierarchy. If it's vague, it's not done.

9. **No generic stock-photo aesthetics.** Featured image and all
   design specs should describe intentionally designed visuals.

10. **Mobile readability.** Any text specified in design specs must
    be legible at mobile viewport sizes.

---

*MASTER BLOG CREATION PROMPT — Version 4.3*
*All sections integrated: Brief · Structure · SERP Analysis · Information Gain ·
SEO · AEO · GEO · E-E-A-T · Voice & Craft · Mobile-First Readability ·
AI Detection Defense · Cross-Content Consistency · Content-to-Product Bridge ·
Polish · Publishing Readiness · Canva Image Creation · Manual Design Specs*
