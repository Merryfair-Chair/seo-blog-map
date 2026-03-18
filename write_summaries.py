import json

with open('merryfair_content_map.json', encoding='utf-8-sig', errors='replace') as f:
    data = json.load(f)

summaries = {
    "why-executive-comfort-is-the-new-productivity": {
        "main_topic": "Why ergonomic seating is a strategic productivity tool for executives and knowledge workers",
        "subtopics_covered": ["cognitive impact of physical discomfort", "posture and focus research citations", "seating as leadership infrastructure", "hybrid/WFH era comfort needs", "ZENIT chair features"],
        "angle": "Research-backed argument reframing comfort as performance infrastructure, not indulgence — targets senior decision-makers",
        "explicitly_not_covered": ["desk or monitor ergonomics", "non-chair productivity tools", "pricing or model comparisons", "entry-level workers"],
        "target_audience": "Senior professionals, executives, B2B office procurement decision-makers",
        "content_type": "educational"
    },
    "redefine-holiday-gifting-with-merryfair-ergonomic-chairs": {
        "main_topic": "Positioning Merryfair ergonomic chairs as Christmas and holiday gifts",
        "subtopics_covered": ["comfort as a meaningful gift benefit", "health and posture gifting angle", "specific gift models (Reya, Ovo, Delphi, Apollo, Ronin)", "personalised adjustability as gift value", "durability and long-term value"],
        "angle": "Seasonal promotional post framing ergonomic chairs as thoughtful, health-conscious gifts rather than commodity purchases",
        "explicitly_not_covered": ["budget gift options under RM500", "non-Merryfair alternatives", "price comparisons", "gifting for commercial spaces"],
        "target_audience": "Holiday shoppers buying gifts for working professionals, family members who WFH",
        "content_type": "product-focused"
    },
    "gaming-chair-vs-office-chair-which-one-should-you-really-buy": {
        "main_topic": "Honest comparison of gaming chairs vs ergonomic office chairs for long sitting sessions",
        "subtopics_covered": ["what gaming chairs get right (aesthetics, bucket seat lateral support)", "gaming chair lumbar support failures (detachable pillow, shifting)", "bucket seat pressure on thighs over long sessions", "office chair ergonomic advantages", "Ronin as gaming-meets-ergonomic hybrid solution"],
        "angle": "Balanced but conclusive comparison — office chairs win on ergonomics, Ronin positioned as best-of-both-worlds",
        "explicitly_not_covered": ["price comparison across non-Merryfair brands", "standing desk alternatives", "specific competitor gaming chair models"],
        "target_audience": "Malaysian gamers considering a chair upgrade, WFH workers tempted by gaming chairs, first-time chair buyers",
        "content_type": "comparison"
    },
    "playing-with-colours-workspace-decor-to-boost-inspiration": {
        "main_topic": "How to match colourful Merryfair chairs to different workspace aesthetics and interior styles",
        "subtopics_covered": ["Boba in beige for eclectic decor", "Pogo in red for mid-century modern", "colour and workspace mood connection", "ergonomic features of featured chairs"],
        "angle": "Interior-design and mood-driven product showcase — ergonomics treated as secondary to aesthetics and self-expression",
        "explicitly_not_covered": ["colour psychology research", "full workspace setup beyond chairs", "chair pricing", "neutral workspace preferences"],
        "target_audience": "Design-conscious home office workers, creative professionals, interior design enthusiasts wanting functional statement pieces",
        "content_type": "product-focused"
    },
    "cute-ergonomic-chairs-for-a-stylish-comfortable-cafe-experience": {
        "main_topic": "Ergonomic and stylish Merryfair chairs suited for cafe and hospitality commercial spaces",
        "subtopics_covered": ["why cafe furniture impacts customer dwell time and loyalty", "Muze stackable chair for tight spaces", "Swing chair for playful environments", "Arena chairs for commercial durability"],
        "angle": "B2B commercial angle targeting cafe and hospitality operators — comfort framed as a customer experience and business revenue driver",
        "explicitly_not_covered": ["home office use", "residential pricing", "ergonomic health benefits for workers", "outdoor cafe furniture"],
        "target_audience": "Cafe owners, restaurant operators, hospitality and F&B business owners furnishing commercial spaces",
        "content_type": "product-focused"
    },
    "eco-friendly-ergonomic-chairs-for-sustainable-offices-with-merryfair": {
        "main_topic": "Merryfair's range of sustainable and eco-friendly ergonomic office chairs",
        "subtopics_covered": ["Forte (fully recyclable except foam and upholstery)", "Nez (97% recyclable materials)", "Apollo (100% recyclable polypropylene headrest and backrest)", "green living and sustainable office trends"],
        "angle": "Sustainability-first product showcase positioning eco-consciousness as a key differentiator",
        "explicitly_not_covered": ["manufacturing carbon footprint data", "lifecycle analysis", "price premium of eco options", "competitor sustainability claims"],
        "target_audience": "Environmentally-conscious office managers, sustainability-focused companies, individual green consumers",
        "content_type": "product-focused"
    },
    "the-ultimate-guide-to-ergonomic-chairs-must-have-features-and-best-types-for-every-workspace": {
        "main_topic": "Comprehensive guide to must-have ergonomic chair features and matching chair types to different workspaces",
        "subtopics_covered": ["adjustable lumbar support mechanics", "seat depth and width adjustment", "armrest adjustability and shoulder load", "headrest necessity by use case", "recline and tilt mechanisms", "chair types by workspace (task, executive, gaming, visitor)", "breathable material selection"],
        "angle": "Feature-first educational buyer's guide teaching readers what to evaluate before comparing any specific models",
        "explicitly_not_covered": ["specific price points or budget tiers", "brand-by-brand comparison", "standing desks", "chair assembly or maintenance"],
        "target_audience": "First-time ergonomic chair buyers, office managers, people experiencing back pain who want to understand features",
        "content_type": "guide"
    },
    "be-a-true-gamer-with-ronin-the-best-gaming-chair-in-malaysia": {
        "main_topic": "Ronin gaming chair features and why it is the best gaming chair for Malaysian gamers",
        "subtopics_covered": ["ergonomic design for long gaming sessions", "backrest ventilation and heat management", "2-way adjustable lumbar support", "height-adjustable headrest", "depth-adjustable seat", "aspirational pro-gamer identity framing"],
        "angle": "Aspirational gaming lifestyle post — the right chair as essential equipment for competitive gaming success",
        "explicitly_not_covered": ["price comparison with other gaming chairs", "office use case", "alternative gaming chairs from other brands", "gaming desk or peripheral setup"],
        "target_audience": "Malaysian gamers, aspiring professional gamers, gaming setup enthusiasts",
        "content_type": "product-focused"
    },
    "office-chairs-to-sit-with-power-focus-and-intention": {
        "main_topic": "Five Merryfair office chairs matched to different professional mindsets and ambitions",
        "subtopics_covered": ["Wau for leadership and strong presence", "Regent for executive ambition and tall backrest", "Ronin for creative thinking", "Fulkrum for calculated confidence with mesh ventilation", "new year workspace reset framing"],
        "angle": "Motivational and aspirational post using new year energy as hook — each chair mapped to a professional identity rather than ergonomic specs",
        "explicitly_not_covered": ["technical ergonomic features", "price points", "health or back pain benefits", "competitor chair comparison"],
        "target_audience": "Ambitious professionals, executives, people setting new year work intentions",
        "content_type": "product-focused"
    },
    "how-to-choose-the-best-ergonomic-chair-for-solo-movie-nights": {
        "main_topic": "How to choose an ergonomic desk chair that works for both work and solo movie watching",
        "subtopics_covered": ["dual-use chair requirements for work and leisure", "recline flexibility for viewing", "Zenit for premium relaxation", "Aire for minimalist lightweight setups", "Boba for cross-legged sitting", "Reddit and Quora community insights"],
        "angle": "Lifestyle-driven guide validating leisure as a legitimate chair buying criterion — targets the WFH-entertainment crossover use case",
        "explicitly_not_covered": ["dedicated couch or lounger alternatives", "TV room setups", "non-Merryfair options", "monitor arm or TV mount pairing"],
        "target_audience": "WFH workers who use their desk setup for Netflix and entertainment, people wanting one chair for work and leisure",
        "content_type": "guide"
    },
    "6-affordable-ergonomic-chairs-for-your-home-and-office": {
        "main_topic": "Six quality ergonomic chairs all priced under RM1,000 for home and office use",
        "subtopics_covered": ["Anggun (RM800) for task seating", "Rookee (RM860) for children aged 4-14", "Saga Collection (RM760) for long working hours", "affordable ergonomics without quality compromise"],
        "angle": "Budget-focused listicle for 2026 demand surge — reframes affordability as achievable rather than a compromise",
        "explicitly_not_covered": ["chairs above RM1,000", "premium ergonomic features like 4D armrests", "non-Merryfair budget chair comparison"],
        "target_audience": "Budget-conscious home office workers, parents seeking children's study chairs, first-time ergonomic chair buyers",
        "content_type": "listicle"
    },
    "how-to-choose-the-best-ergonomic-chair-in-malaysia": {
        "main_topic": "How to choose the right ergonomic chair specifically for Malaysian working conditions",
        "subtopics_covered": ["what genuinely makes a chair ergonomic vs marketing claims", "lumbar support height and depth adjustability", "seat height and depth for Malaysian bodies", "backrest movement and contact during recline", "breathable materials for Malaysia's heat and humidity", "adjustable armrests and shoulder load", "WFH vs office use case differences"],
        "angle": "Malaysia-specific practical buyer's guide cutting through marketing language to explain what actually matters locally",
        "explicitly_not_covered": ["specific model recommendations with prices", "comparison table of chairs", "standing desk alternatives"],
        "target_audience": "Malaysian office workers and WFH workers experiencing back pain or buying their first ergonomic chair",
        "content_type": "guide"
    },
    "how-merryfair-redefines-ergonomics-for-gamers-in-malaysia": {
        "main_topic": "How Merryfair's Ronin chair addresses the ergonomic shortcomings of traditional gaming chairs",
        "subtopics_covered": ["common complaints about traditional gaming chairs (style over substance)", "why gamers need ergonomics", "Ronin ventilated backrest", "adjustable lumbar for spinal alignment", "soft PU arm pads", "customisable seat depth and tilt"],
        "angle": "Problem-solution framing: traditional gaming chairs fail gamers ergonomically; Ronin is the purpose-built alternative",
        "explicitly_not_covered": ["price comparison with other gaming chairs", "other Merryfair products beyond Ronin", "non-gaming office use case"],
        "target_audience": "Malaysian gamers frustrated with traditional gaming chairs, serious gamers wanting ergonomic support without sacrificing aesthetics",
        "content_type": "product-focused"
    },
    "why-everyones-switching-to-ergonomics-swivel-chairs-in-2025": {
        "main_topic": "Why ergonomic swivel chairs are rising in popularity among Malaysians for WFH, gaming, and creative work",
        "subtopics_covered": ["swivel chair evolution into ergonomic tools", "Reya for all-day productivity", "Anggun for budget setups", "Wau for high-performance users", "Ronin for gamers", "Malaysian WFH and side-hustle trends"],
        "angle": "Trend-driven overview framing ergonomic swivel chairs as the obvious modern upgrade — Merryfair's lineup as leading the shift",
        "explicitly_not_covered": ["non-swivel ergonomic alternatives", "tilt mechanism technical details", "direct price-per-model comparison"],
        "target_audience": "Malaysians upgrading home offices, gamers, content creators, and side-hustlers needing versatile seating",
        "content_type": "listicle"
    },
    "upgrade-your-workspace-affordable-working-chairs-under-rm1000": {
        "main_topic": "Affordable ergonomic working chairs under RM1,000 for young professionals and first WFH setups",
        "subtopics_covered": ["Kaden (RM511) with 3D tilt for active sitters", "Work chair (RM503) for no-frills reliable comfort", "Saga (RM616) for all-day lumbar support", "WFH setup for young first-apartment professionals"],
        "angle": "Aspirational budget guide for entry-level professionals and students — positions RM500-700 as attainable ergonomic investment",
        "explicitly_not_covered": ["chairs above RM1,000", "children's or commercial chairs", "premium features beyond basics"],
        "target_audience": "Young professionals, students, WFH workers on a tight budget, people furnishing their first apartment",
        "content_type": "listicle"
    },
    "do-posture-correctors-work": {
        "main_topic": "Whether posture correctors work and why ergonomic chairs are the more effective long-term solution",
        "subtopics_covered": ["three types of posture correctors (braces, shirts, smart trainers)", "muscle dependency risk from extended use", "2024 posture corrector market size ($1.66B)", "research limitations on effectiveness (2019 BMC Musculoskeletal Disorders)", "ergonomic chair as foundational posture fix"],
        "angle": "Evidence-based debunking of posture corrector hype — positions the ergonomic chair as addressing root cause not symptom",
        "explicitly_not_covered": ["exercise and stretching routines", "standing desk benefits", "specific chair model recommendations", "posture corrector brand reviews"],
        "target_audience": "Desk workers using or considering posture correctors, people with persistent posture pain seeking lasting solutions",
        "content_type": "educational"
    },
    "best-ergonomic-office-chairs-every-budget": {
        "main_topic": "Best ergonomic office chairs in Malaysia across three budget tiers: under RM1K, RM1K-2K, and above RM2.5K",
        "subtopics_covered": ["what ergonomic means beyond marketing", "adjustable lumbar and seat depth as non-negotiables", "multi-directional armrests", "synchro-tilt mechanism", "mesh vs ventilated fabric for Malaysian climate", "curated picks per budget tier"],
        "angle": "No-filler opinionated buyer's guide — leads with the principle that body fit matters more than price",
        "explicitly_not_covered": ["children's study chairs", "commercial or bulk buying", "standing desks", "chair accessories"],
        "target_audience": "Malaysian office workers at all spending levels ready to invest properly in an ergonomic chair",
        "content_type": "guide"
    },
    "office-chair-material-guide-malaysia": {
        "main_topic": "Comparing mesh, fabric, and leather office chair materials for Malaysia's tropical climate",
        "subtopics_covered": ["Malaysia's 74-86% average relative humidity (Malaysian Meteorological Department)", "why mesh outperforms in tropical conditions", "leather degradation in humidity (adhesive failure, peeling)", "fabric moisture retention and microbial growth risk", "air conditioning microclimate effects", "material lifespan comparison"],
        "angle": "Malaysia-specific climate-first analysis overriding generic international reviews — mesh recommended as default with clearly explained caveats",
        "explicitly_not_covered": ["specific chair model recommendations", "price comparison by material", "detailed cleaning routines", "non-Malaysian climate comparison"],
        "target_audience": "Malaysian office workers choosing between chair materials, HR and procurement managers, home office buyers frustrated by premature degradation",
        "content_type": "educational"
    },
    "how-to-choose-office-chair-body-fit-test": {
        "main_topic": "A 3-layer fit test methodology for evaluating whether an ergonomic office chair genuinely matches your body",
        "subtopics_covered": ["why the 20-second sit test fails (pain shows at week 3)", "Layer 1 Static Fit: seat height, depth, width", "Layer 2 Support Fit: lumbar position, backrest contact, armrest alignment", "Layer 3 Dynamic Fit: tilt behavior, movement range, foot contact during recline", "70% of Malaysian office workers with MSK pain", "Merryfair 50-year manufacturing authority as framework source"],
        "angle": "Methodology-first approach providing a repeatable showroom testing framework — positions Merryfair as the expert authority",
        "explicitly_not_covered": ["specific chair model prices or comparisons", "buying online without physical testing", "post-purchase chair maintenance"],
        "target_audience": "First-time and replacement ergonomic chair buyers, people about to visit a showroom or begin a home trial",
        "content_type": "guide"
    },
    "what-is-lumbar-support": {
        "main_topic": "What lumbar support is, how it works anatomically, and why it is the most critical ergonomic chair feature",
        "subtopics_covered": ["lumbar spine anatomy: L1-L5 vertebrae and lordosis curve", "intervertebral disc function and pressure distribution", "consequences of absent lumbar support (disc compression, muscle fatigue)", "types: fixed, height-adjustable, depth-adjustable, dynamic lumbar", "how to position lumbar support correctly", "80.81% office worker MSD prevalence (2025 Scientific Reports)"],
        "angle": "Deep anatomical explainer anchored in published research — the most technically thorough lumbar post on the site, building genuine topical authority",
        "explicitly_not_covered": ["other ergonomic features beyond lumbar", "specific chair model recommendations", "lumbar support for driving or travel"],
        "target_audience": "People experiencing lower back pain, first-time ergonomic chair researchers, HR and wellbeing professionals",
        "content_type": "educational"
    },
    "how-to-know-when-its-time-for-an-ergonomic-chair-upgrade": {
        "main_topic": "Seven observable signs that your ergonomic chair has deteriorated and needs replacing",
        "subtopics_covered": ["persistent back or neck pain within 1-2 hours of sitting", "cushion compression and lost rebound", "damaged or seized adjustment mechanisms", "visible structural wear or instability", "chair age beyond 7-10 year lifespan", "posture worsening despite good habits", "squeaking or wobble under load"],
        "angle": "Problem-identification framework helping readers self-diagnose chair failure — gradual deterioration framed as easy to miss and important to catch early",
        "explicitly_not_covered": ["specific replacement model recommendations", "how to extend chair lifespan", "budget guidance for replacement"],
        "target_audience": "People with chairs 5+ years old, desk workers with recurring pain, office managers auditing furniture inventory",
        "content_type": "educational"
    },
    "the-role-of-ergonomic-office-chairs-in-preventing-back-pain": {
        "main_topic": "How ergonomic chairs prevent back pain through lumbar support, posture alignment, and correct seating mechanics",
        "subtopics_covered": ["intradiscal pressure during prolonged sitting (Nachemson research)", "how lumbar support maintains the spinal curve", "armrest height impact on trapezius loading", "DOSH Malaysia workplace seating regulations", "correct ergonomic setup for pain prevention", "movement breaks and disc nutrition"],
        "angle": "Evidence-based health and compliance guide with Malaysian regulatory context — addresses both individual pain relief and employer legal obligations under DOSH",
        "explicitly_not_covered": ["exercise or physiotherapy as complements", "standing desk alternatives", "specific chair model recommendations by pain type"],
        "target_audience": "Malaysian desk workers with back pain, HR and OSH managers seeking DOSH compliance, employers investing in staff wellbeing",
        "content_type": "educational"
    },
    "the-physical-benefits-of-ergonomics-why-it-matters-for-your-health": {
        "main_topic": "The full range of physical and cognitive health benefits of ergonomic workplace setup",
        "subtopics_covered": ["back pain and MSD reduction", "80.81% office worker MSD prevalence (Scientific Reports)", "blood circulation improvement", "cognitive focus and reduced fatigue", "long-term injury prevention", "59% MSD reduction from ergonomic improvements (250 case studies)", "30% of workplace injuries are MSDs (US BLS)"],
        "angle": "Broad health-benefits overview backed by multiple research citations — framed as ROI case for both employers and health-conscious individuals",
        "explicitly_not_covered": ["specific chair features or models", "desk or monitor ergonomics", "ergonomic keyboards or accessories", "pricing or purchasing guidance"],
        "target_audience": "Employers and HR professionals evaluating ergonomics ROI, health-conscious workers, workplace wellbeing decision-makers",
        "content_type": "educational"
    },
    "effects-of-poor-sitting-posture-and-how-ergonomics-can-help": {
        "main_topic": "Seven specific ways poor sitting posture damages the body across multiple systems, with an ergonomic fix for each",
        "subtopics_covered": ["spinal disc compression and chronic back pain", "neck strain and tension headaches from forward head posture", "reduced lung capacity from thoracic rounding", "disrupted sleep and fatigue", "slowed digestion and acid reflux", "nerve compression and referred pain", "lower mood and cognitive impairment", "27kg cervical load at 60 degrees forward tilt (Surgical Technology International 2014)"],
        "angle": "Comprehensive harm-first framing covering body systems far beyond back pain — the most complete health impact post on the site",
        "explicitly_not_covered": ["specific chair recommendations or prices", "exercise routines for posture correction", "standing desk benefits"],
        "target_audience": "Desk workers experiencing unexplained pain or fatigue, people wanting to understand the full systemic health impact of poor posture",
        "content_type": "educational"
    },
    "best-study-chairs-students-guide": {
        "main_topic": "How to choose an ergonomic study chair for children, with sizing guidance and Rookee as the primary recommendation",
        "subtopics_covered": ["83% of school children in mismatched furniture (Smith System)", "how poor seating affects a developing spine", "what makes a study chair ergonomic for growing bodies", "Rookee: 7-position back, footrest, adjustable arms, ages 4-14 (1.1-1.6m)", "how to size a study chair by child height", "children sitting 6-10 hours daily"],
        "angle": "Parent-focused health decision framing — study chair as a protective investment for child skeletal development, not just furniture",
        "explicitly_not_covered": ["adult study chairs", "desk height pairing for children", "non-Merryfair children's chair alternatives", "full classroom furniture"],
        "target_audience": "Parents of school-age children aged 4-14, teachers and school administrators purchasing study furniture",
        "content_type": "guide"
    },
    "office-chair-tilt-mechanism-guide": {
        "main_topic": "How office chair tilt mechanisms work and why synchro tilt is the superior standard for ergonomic seating",
        "subtopics_covered": ["what a tilt mechanism is and its location in the chair", "pivot point physics and its effect on comfort", "basic tilt: single-axis rotation and foot-lifting problem", "synchro tilt: coordinated backrest-to-seat ratio keeping feet on floor", "knee tilt for forward-task workers", "tilt tension adjustment by body weight", "matching mechanism to sitting style"],
        "angle": "Technical explainer demystifying the spec most buyers never examine — mechanism knowledge as the real differentiator between cheap and quality chairs",
        "explicitly_not_covered": ["specific chair model prices or brand comparisons", "other chair components beyond tilt", "lumbar support or armrest features"],
        "target_audience": "Ergonomic chair buyers wanting to understand technical specs, people comparison-shopping mid-to-high-end chairs",
        "content_type": "educational"
    }
}

posts = data["post_details"]
updated = 0
for slug, summary in summaries.items():
    if slug in posts:
        posts[slug]["content_summary"] = summary
        updated += 1

data["meta"]["summaries_generated"] = updated
data["meta"]["summaries_generated_by"] = "Claude Code"
data["meta"]["summaries_date"] = "2026-03-17"

with open('merryfair_content_map.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Updated {updated}/26 posts with content summaries.")
missing = [s for s, d in posts.items() if not d.get("content_summary")]
if missing:
    print(f"Missing summaries: {missing}")
else:
    print("All 26 posts have content summaries.")
