import json

with open('merryfair_content_map.json', encoding='utf-8') as f:
    data = json.load(f)

gap_updates = {

    # BUYING GUIDE

    "gap-BG-2": {
        "targetKeyword": "how to adjust office chair",
        "estVolume": 40,
        "globalVolume": 4050,
        "keywordDifficulty": None,
        "trafficPotential": None,
        "alternativeKeywords": [
            {"keyword": "how to adjust an office chair for comfort", "myVolume": 20, "globalVolume": 3600},
            {"keyword": "how to adjust office chair height", "myVolume": 10, "globalVolume": 150},
            {"keyword": "how to adjust office chair", "myVolume": 10, "globalVolume": 300},
        ],
        "ahrefsNote": "Low MY volume (40/mo) but strong global demand (4,050/mo). EEAT and post-purchase value justify the post — this serves existing Merryfair customers searching how to set up their chairs. Target the broader 'how to adjust office chair' cluster; feature Merryfair-specific controls (Wau, Zenit, Spinelly).",
        "ahrefsValidated": True,
        "ahrefsValidationDate": "2026-03-30",
        "intent": "informational",
        "status": "approved",
    },

    "gap-BG-3": {
        "targetKeyword": "how long does an office chair last",
        "estVolume": 0,
        "globalVolume": 370,
        "keywordDifficulty": None,
        "trafficPotential": None,
        "alternativeKeywords": [
            {"keyword": "how long does an office chair last", "myVolume": 0, "globalVolume": 300},
            {"keyword": "when to replace office chair", "myVolume": 0, "globalVolume": 70},
        ],
        "ahrefsNote": "Zero MY volume. Global demand is modest (370/mo). No search case for this post in the Malaysian market. Deprioritised — only revisit if targeting global/EN audience.",
        "ahrefsValidated": True,
        "ahrefsValidationDate": "2026-03-30",
        "status": "deprioritized",
    },

    "gap-BG-4": {
        "targetKeyword": "bifma certified chair",
        "estVolume": 0,
        "globalVolume": 40,
        "keywordDifficulty": None,
        "trafficPotential": None,
        "alternativeKeywords": [
            {"keyword": "bifma certified chair", "myVolume": 0, "globalVolume": 40},
        ],
        "ahrefsNote": "Negligible demand globally (40/mo) and zero in Malaysia. Could be a short FAQ section inside the ultimate buying guide instead of a standalone post.",
        "ahrefsValidated": True,
        "ahrefsValidationDate": "2026-03-30",
        "status": "deprioritized",
    },

    "gap-BG-5": {
        "targetKeyword": "how to test office chair",
        "estVolume": 0,
        "globalVolume": 0,
        "keywordDifficulty": None,
        "trafficPotential": None,
        "alternativeKeywords": [],
        "ahrefsNote": "No measurable search volume in Malaysia or globally. No SEO case as a standalone post. Fold showroom-testing tips as a section within the existing body fit test post.",
        "ahrefsValidated": True,
        "ahrefsValidationDate": "2026-03-30",
        "status": "deprioritized",
    },

    # BEST BUDGET

    "gap-BB-1": {
        "targetKeyword": "ergonomic chair rm2000",
        "estVolume": 0,
        "globalVolume": 0,
        "keywordDifficulty": None,
        "trafficPotential": None,
        "alternativeKeywords": [],
        "ahrefsNote": "Zero volume confirmed by Ahrefs. Already deprioritised in project strategy. Strengthen the existing 'every budget' pillar instead.",
        "ahrefsValidated": True,
        "ahrefsValidationDate": "2026-03-30",
        "status": "deprioritized",
    },

    "gap-BB-2": {
        "targetKeyword": "best office chair malaysia",
        "estVolume": 150,
        "globalVolume": 200,
        "keywordDifficulty": 0,
        "trafficPotential": 4000,
        "alternativeKeywords": [
            {"keyword": "best office chair malaysia", "myVolume": 150, "globalVolume": 200, "kd": 0, "tp": 4000},
            {"keyword": "ergonomic office chair malaysia", "myVolume": 200, "globalVolume": 300, "kd": 1, "tp": 30},
            {"keyword": "best ergonomic office chair malaysia", "myVolume": 50, "globalVolume": 80},
        ],
        "ahrefsNote": "KEYWORD REFRAME: Original keyword 'best home office chair malaysia' has zero MY volume. However 'best office chair malaysia' (150/mo, KD 0, TP 4,000) and 'ergonomic office chair malaysia' (200/mo, KD 1) are strong real opportunities. Before writing a new post, evaluate whether the existing 'best-ergonomic-office-chairs-every-budget' pillar can be optimised to target these terms. Owner decision: optimise existing pillar vs write a dedicated roundup.",
        "ahrefsValidated": True,
        "ahrefsValidationDate": "2026-03-30",
        "status": "suggested",
    },

    # HEALTH & POSTURE

    "gap-HP-1": {
        "targetKeyword": "correct sitting posture",
        "estVolume": 80,
        "globalVolume": 2600,
        "keywordDifficulty": 35,
        "trafficPotential": 60,
        "alternativeKeywords": [
            {"keyword": "sitting posture", "myVolume": 150, "globalVolume": 4100, "kd": 0, "tp": 150},
            {"keyword": "correct sitting posture", "myVolume": 80, "globalVolume": 2600, "kd": 35, "tp": 60},
            {"keyword": "proper sitting posture", "myVolume": 50, "globalVolume": 2400, "kd": 31, "tp": 150},
            {"keyword": "good sitting posture", "myVolume": 50, "globalVolume": 1900, "kd": 22, "tp": 150},
            {"keyword": "bad sitting posture", "myVolume": 40, "globalVolume": 1000, "kd": 44, "tp": 80},
        ],
        "ahrefsNote": "CONFIRMED #1 PRIORITY. Sitting posture cluster has strongest real MY volume of all gap topics: 'sitting posture' 150/mo (KD 0), 'correct sitting posture' 80/mo (KD 35), 'proper sitting posture' 50/mo (KD 31), 'good sitting posture' 50/mo (KD 22). Total cluster ~370/mo MY. Original 500/mo estimate was global-based. Primary target: 'correct sitting posture' or 'sitting posture'; frame post around office chair ergonomics to maintain cluster relevance.",
        "ahrefsValidated": True,
        "ahrefsValidationDate": "2026-03-30",
        "intent": "informational",
        "status": "approved",
    },

    "gap-HP-2": {
        "targetKeyword": "standing desk malaysia",
        "estVolume": 200,
        "globalVolume": 250,
        "keywordDifficulty": 4,
        "trafficPotential": 1100,
        "alternativeKeywords": [
            {"keyword": "standing desk malaysia", "myVolume": 200, "globalVolume": 250, "kd": 4, "tp": 1100},
            {"keyword": "best standing desk malaysia", "myVolume": 90, "globalVolume": 90, "kd": 7, "tp": 900},
            {"keyword": "malaysia standing desk", "myVolume": 20, "globalVolume": 30, "kd": 0, "tp": 1100},
        ],
        "ahrefsNote": "KEYWORD REFRAME: 'ergonomic chair vs standing desk' has zero MY volume. 'Standing desk malaysia' (200/mo, KD 4, TP 1,100) and 'best standing desk malaysia' (90/mo, KD 7, TP 900) have strong MY demand with low difficulty. Reframe post to target 'standing desk malaysia' as primary anchor — Malaysians researching whether to buy a standing desk will read a comparison with ergonomic chairs. Gives Merryfair a strong informational play in a commercially adjacent category. Combined cluster: ~290/mo MY.",
        "ahrefsValidated": True,
        "ahrefsValidationDate": "2026-03-30",
        "intent": "informational",
        "status": "approved",
    },

    # GAMING

    "gap-GM-1": {
        "targetKeyword": "best gaming chair malaysia",
        "estVolume": 100,
        "globalVolume": 150,
        "keywordDifficulty": 39,
        "trafficPotential": 60,
        "alternativeKeywords": [
            {"keyword": "gaming chair malaysia", "myVolume": 450, "globalVolume": 500, "kd": 0, "tp": 10},
            {"keyword": "best gaming chair malaysia", "myVolume": 100, "globalVolume": 150, "kd": 39, "tp": 60},
            {"keyword": "malaysia gaming chair", "myVolume": 50, "globalVolume": 60, "kd": 40, "tp": 6600},
            {"keyword": "top gaming chair malaysia", "myVolume": 30, "globalVolume": 40, "kd": 42, "tp": 9200},
            {"keyword": "best gaming chair for long hours", "myVolume": 0, "globalVolume": 250},
            {"keyword": "best chair for long gaming sessions", "myVolume": 0, "globalVolume": 100},
        ],
        "ahrefsNote": "KEYWORD REFRAME: Original angle 'best chair for long gaming sessions' has zero MY volume. Real MY opportunity: 'gaming chair malaysia' (450/mo, KD 0) but very low TP (10) — top pages capture little traffic. 'Best gaming chair malaysia' (100/mo, KD 39) is more competitive but commercially strong. 'Malaysia gaming chair' (50/mo, KD 40, TP 6,600) and 'top gaming chair malaysia' (30/mo, KD 42, TP 9,200) show very high traffic potential suggesting the parent topic ranks for the head term. Endurance/long-hours angle has no MY demand. Reframe as 'best gaming chair malaysia' guide featuring the Ronin. Note: KD 39-42 is the most competitive gap — lower priority given existing position #4 for 'gaming chair vs office chair'.",
        "ahrefsValidated": True,
        "ahrefsValidationDate": "2026-03-30",
        "intent": "commercial",
        "status": "suggested",
    },
}

# Apply updates
updated = []
for cluster in data['clusters']:
    for gap in cluster.get('gaps', []):
        gid = gap.get('id')
        if gid in gap_updates:
            gap.update(gap_updates[gid])
            updated.append(gid)

with open('merryfair_content_map.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated {len(updated)} gaps: {updated}")
