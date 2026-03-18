import { useState, useMemo } from "react";

const CLUSTER_DATA = {
  clusters: [
    {
      id: "buying-guide",
      name: "How to choose an ergonomic chair",
      headTerm: "ergonomic chair features",
      headTermVolume: 1100,
      color: "#1D9E75",
      pillarSlug: "the-ultimate-guide-to-ergonomic-chairs-must-have-features-and-best-types-for-every-workspace",
      pillarStatus: "exists",
      posts: [
        { slug: "the-ultimate-guide-to-ergonomic-chairs-must-have-features-and-best-types-for-every-workspace", title: "The Ultimate Guide to Ergonomic Chairs: Features & Types", type: "pillar", gscClicks: 137, gscImpressions: 36901, ahrefsTraffic: 6, ahrefsKeywords: 8, topKeyword: "ergonomic chair", topKwVolume: 1100, topKwPosition: 17, referringDomains: 1 },
        { slug: "how-to-choose-the-best-ergonomic-chair-in-malaysia", title: "Choosing the Right Ergonomic Chair in Malaysia", type: "cluster", gscClicks: 351, gscImpressions: 50140, ahrefsTraffic: 37, ahrefsKeywords: 11, topKeyword: "best ergonomic chair malaysia", topKwVolume: 250, topKwPosition: 8, referringDomains: 0 },
        { slug: "how-to-choose-office-chair-body-fit-test", title: "How to Choose Office Chair: 3-Layer Fit Test", type: "cluster", gscClicks: 2, gscImpressions: 501, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "office-chair-material-guide-malaysia", title: "Mesh vs Fabric vs Leather: Office Chair Material Guide", type: "cluster", gscClicks: 0, gscImpressions: 302, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "office-chair-tilt-mechanism-guide", title: "Office Chair Tilt Mechanism Guide", type: "cluster", gscClicks: 0, gscImpressions: 0, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "what-is-lumbar-support", title: "What Is Lumbar Support?", type: "cluster", gscClicks: 0, gscImpressions: 0, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "how-to-know-when-its-time-for-an-ergonomic-chair-upgrade", title: "5 Signs You Need An Ergonomic Chair Upgrade", type: "cluster", gscClicks: 5, gscImpressions: 927, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
      ],
      gaps: [
        { title: "Ergonomic chair size guide by height and weight", keyword: "ergonomic chair size guide", estVolume: 150, rationale: "Body fit test post covers methodology but not a lookup table for height/weight to chair size. This is a high-intent commercial query with no existing coverage." },
        { title: "How to adjust your ergonomic chair properly (step-by-step)", keyword: "how to adjust ergonomic chair", estVolume: 300, rationale: "Multiple posts mention adjustability as a feature, but none walk through the actual adjustment process. Classic 'how-to' intent gap." },
      ]
    },
    {
      id: "best-chairs-budget",
      name: "Best ergonomic chairs by budget",
      headTerm: "best ergonomic office chair",
      headTermVolume: 250,
      color: "#378ADD",
      pillarSlug: "best-ergonomic-office-chairs-every-budget",
      pillarStatus: "exists",
      posts: [
        { slug: "best-ergonomic-office-chairs-every-budget", title: "Best Ergonomic Office Chairs for Every Budget (2026)", type: "pillar", gscClicks: 25, gscImpressions: 24556, ahrefsTraffic: 11, ahrefsKeywords: 1, topKeyword: "best ergonomic office chairs", topKwVolume: 100, topKwPosition: 5, referringDomains: 0 },
        { slug: "6-affordable-ergonomic-chairs-for-your-home-and-office", title: "6 Affordable Ergonomic Chairs for Home and Office", type: "cluster", gscClicks: 393, gscImpressions: 43109, ahrefsTraffic: 1, ahrefsKeywords: 2, topKeyword: "best ergonomic chair malaysia", topKwVolume: 250, topKwPosition: 23, referringDomains: 0 },
        { slug: "upgrade-your-workspace-affordable-working-chairs-under-rm1000", title: "Best Budget Chairs Under RM1,000", type: "cluster", gscClicks: 10, gscImpressions: 4292, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "best-study-chairs-students-guide", title: "Best Study Chairs: Student's Guide", type: "cluster", gscClicks: 0, gscImpressions: 0, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
      ],
      gaps: [
        { title: "Best ergonomic chairs under RM2,000 (mid-range)", keyword: "ergonomic chair under RM2000", estVolume: 80, rationale: "You cover under RM1,000 and 'every budget' but no dedicated mid-range post. This is where Merryfair's strongest models (Wau, Zenit, Spinelly) compete." },
        { title: "Best ergonomic chairs for home office Malaysia", keyword: "best home office chair malaysia", estVolume: 200, rationale: "WFH is a major purchase driver. Your budget posts mention home use but none target 'home office chair' as the primary keyword." },
      ]
    },
    {
      id: "health-posture",
      name: "Ergonomics, health & posture",
      headTerm: "benefits of ergonomics",
      headTermVolume: 200,
      color: "#D85A30",
      pillarSlug: "the-physical-benefits-of-ergonomics-why-it-matters-for-your-health",
      pillarStatus: "exists",
      posts: [
        { slug: "the-physical-benefits-of-ergonomics-why-it-matters-for-your-health", title: "Benefits of Ergonomics: What It Does to Your Body", type: "pillar", gscClicks: 5, gscImpressions: 926, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "the-role-of-ergonomic-office-chairs-in-preventing-back-pain", title: "Ergonomic Chairs in Preventing Back Pain", type: "cluster", gscClicks: 1, gscImpressions: 523, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "effects-of-poor-sitting-posture-and-how-ergonomics-can-help", title: "Effects of Poor Sitting Posture", type: "cluster", gscClicks: 3, gscImpressions: 924, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "do-posture-correctors-work", title: "Do Posture Correctors Work? Why Your Chair Matters More", type: "cluster", gscClicks: 3, gscImpressions: 1352, ahrefsTraffic: 1, ahrefsKeywords: 1, topKeyword: "office chair posture corrector", topKwVolume: 20, topKwPosition: 9, referringDomains: 0 },
      ],
      gaps: [
        { title: "How to sit properly in an office chair (correct posture guide)", keyword: "how to sit properly office chair", estVolume: 500, rationale: "You cover what happens when you sit wrong, and what features help. But no post teaches the actual correct sitting position. This is a massive informational query." },
        { title: "Ergonomic chair vs standing desk: which is better for your back?", keyword: "ergonomic chair vs standing desk", estVolume: 150, rationale: "Standing desks are the main alternative to ergonomic seating. No post addresses this comparison. Builds topical authority and captures comparison intent." },
      ]
    },
    {
      id: "gaming-specialized",
      name: "Gaming & specialized seating",
      headTerm: "gaming chair vs office chair",
      headTermVolume: 200,
      color: "#7F77DD",
      pillarSlug: "gaming-chair-vs-office-chair-which-one-should-you-really-buy",
      pillarStatus: "exists",
      posts: [
        { slug: "gaming-chair-vs-office-chair-which-one-should-you-really-buy", title: "Gaming Chair vs Office Chair: Which Should You Buy?", type: "pillar", gscClicks: 27, gscImpressions: 21236, ahrefsTraffic: 23, ahrefsKeywords: 4, topKeyword: "gaming chair vs office chair", topKwVolume: 200, topKwPosition: 4, referringDomains: 1 },
        { slug: "be-a-true-gamer-with-ronin-the-best-gaming-chair-in-malaysia", title: "Be a True Gamer with Ronin: Best Gaming Chair", type: "cluster", gscClicks: 38, gscImpressions: 7609, ahrefsTraffic: 0, ahrefsKeywords: 1, topKeyword: "best gaming chair", topKwVolume: 90, topKwPosition: 41, referringDomains: 0 },
        { slug: "how-merryfair-redefines-ergonomics-for-gamers-in-malaysia", title: "How Merryfair Redefines Ergonomics for Gamers", type: "cluster", gscClicks: 0, gscImpressions: 570, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "how-to-choose-the-best-ergonomic-chair-for-solo-movie-nights", title: "Best Chairs for Solo Movie Nights", type: "cluster", gscClicks: 33, gscImpressions: 3236, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
      ],
      gaps: [
        { title: "Best ergonomic chair for long hours of gaming and streaming", keyword: "best chair for gaming long hours", estVolume: 120, rationale: "Your gaming posts focus on gaming vs office comparison and Ronin specifically. No post targets the long-session gamer intent, which is a different search query." },
      ]
    },
    {
      id: "workspace-lifestyle",
      name: "Workspace design & productivity",
      headTerm: "ergonomic workspace setup",
      headTermVolume: 150,
      color: "#D4537E",
      pillarSlug: null,
      pillarStatus: "needs-creation",
      posts: [
        { slug: "why-executive-comfort-is-the-new-productivity", title: "Why Executive Comfort Is the New Productivity", type: "cluster", gscClicks: 0, gscImpressions: 144, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "playing-with-colours-workspace-decor-to-boost-inspiration", title: "Playing with Colours: Workspace Decor", type: "cluster", gscClicks: 2, gscImpressions: 279, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "cute-ergonomic-chairs-for-a-stylish-comfortable-cafe-experience", title: "Cute Ergonomic Chairs for Café Experience", type: "cluster", gscClicks: 23, gscImpressions: 2752, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "why-everyones-switching-to-ergonomics-swivel-chairs-in-2025", title: "Why Everyone's Switching to Swivel Chairs", type: "cluster", gscClicks: 9, gscImpressions: 1647, ahrefsTraffic: 9, ahrefsKeywords: 1, topKeyword: "swivel chair", topKwVolume: 700, topKwPosition: 9, referringDomains: 0 },
      ],
      gaps: [
        { title: "Complete guide to setting up an ergonomic home office", keyword: "ergonomic home office setup guide", estVolume: 300, rationale: "PILLAR NEEDED. This cluster has 4 posts but no pillar. This guide would serve as the hub, covering desk height, chair position, monitor placement, and linking out to all workspace posts." },
        { title: "Ergonomic office setup for small spaces and apartments", keyword: "ergonomic setup small space", estVolume: 100, rationale: "Malaysian apartments are often compact. No post addresses space-constrained ergonomic setups, which is a distinct search intent." },
      ]
    },
    {
      id: "brand-seasonal",
      name: "Brand & seasonal content",
      headTerm: null,
      headTermVolume: 0,
      color: "#888780",
      pillarSlug: null,
      pillarStatus: "not-applicable",
      posts: [
        { slug: "redefine-holiday-gifting-with-merryfair-ergonomic-chairs", title: "Redefine Holiday Gifting with Merryfair", type: "standalone", gscClicks: 1, gscImpressions: 39, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "office-chairs-to-sit-with-power-focus-and-intention", title: "5 Office Chairs to Sit with Power & Focus (2025)", type: "standalone", gscClicks: 21, gscImpressions: 2599, ahrefsTraffic: 0, ahrefsKeywords: 0, topKeyword: "", topKwVolume: 0, topKwPosition: 0, referringDomains: 0 },
        { slug: "eco-friendly-ergonomic-chairs-for-sustainable-offices-with-merryfair", title: "Eco-Friendly Ergonomic Chairs for Sustainable Offices", type: "standalone", gscClicks: 115, gscImpressions: 20956, ahrefsTraffic: 2, ahrefsKeywords: 1, topKeyword: "sustainable office chairs", topKwVolume: 60, topKwPosition: 8, referringDomains: 0 },
      ],
      gaps: []
    }
  ],
  meta: {
    totalPosts: 26,
    lastUpdated: "2026-03-17",
    totalGaps: 7,
    note: "Eco-friendly post (115 clicks) could seed a future Sustainability cluster if more posts are added."
  }
};

const StatusBadge = ({ type }) => {
  const styles = {
    pillar: { bg: "#042C53", color: "#85B7EB", label: "Pillar" },
    cluster: { bg: "#04342C", color: "#5DCAA5", label: "Cluster" },
    standalone: { bg: "#2C2C2A", color: "#B4B2A9", label: "Standalone" },
    gap: { bg: "#26215C", color: "#AFA9EC", label: "Suggested" },
  };
  const s = styles[type] || styles.cluster;
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 500,
      padding: "2px 8px", borderRadius: 4,
      background: s.bg, color: s.color, letterSpacing: "0.02em",
    }}>{s.label}</span>
  );
};

const PerformanceBar = ({ value, max, color }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--color-border-tertiary)" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: color, transition: "width 0.4s ease" }} />
      </div>
      <span style={{ fontSize: 11, color: "var(--color-text-secondary)", minWidth: 32, textAlign: "right" }}>{value.toLocaleString()}</span>
    </div>
  );
};

export default function ClusterMap() {
  const [expandedCluster, setExpandedCluster] = useState("buying-guide");
  const [showGaps, setShowGaps] = useState(true);
  const [view, setView] = useState("map");

  const data = CLUSTER_DATA;
  const maxClicks = useMemo(() => Math.max(...data.clusters.flatMap(c => c.posts.map(p => p.gscClicks))), []);
  const maxImpressions = useMemo(() => Math.max(...data.clusters.flatMap(c => c.posts.map(p => p.gscImpressions))), []);

  const totalPosts = data.clusters.reduce((s, c) => s + c.posts.length, 0);
  const totalGaps = data.clusters.reduce((s, c) => s + c.gaps.length, 0);
  const clustersWithPillar = data.clusters.filter(c => c.pillarStatus === "exists").length;
  const clustersNeedPillar = data.clusters.filter(c => c.pillarStatus === "needs-creation").length;

  return (
    <div style={{ fontFamily: "var(--font-sans)", maxWidth: 720 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["map", "gaps"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "6px 16px", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer",
            border: "0.5px solid var(--color-border-secondary)",
            background: view === v ? "var(--color-text-primary)" : "transparent",
            color: view === v ? "var(--color-background-primary)" : "var(--color-text-secondary)",
            transition: "all 0.15s ease",
          }}>{v === "map" ? "Cluster map" : `Content gaps (${totalGaps})`}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginBottom: 24 }}>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 2 }}>Posts indexed</div>
          <div style={{ fontSize: 22, fontWeight: 500 }}>{totalPosts}</div>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 2 }}>Topic clusters</div>
          <div style={{ fontSize: 22, fontWeight: 500 }}>{data.clusters.length}</div>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 2 }}>Pillars active</div>
          <div style={{ fontSize: 22, fontWeight: 500 }}>{clustersWithPillar}<span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}> / {data.clusters.filter(c=>c.pillarStatus!=="not-applicable").length}</span></div>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 2 }}>Gaps identified</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-warning)" }}>{totalGaps}</div>
        </div>
      </div>

      {view === "map" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.clusters.map(cluster => {
            const isExpanded = expandedCluster === cluster.id;
            const pillar = cluster.posts.find(p => p.type === "pillar");
            const clusterPosts = cluster.posts.filter(p => p.type !== "pillar");
            const clusterClicks = cluster.posts.reduce((s, p) => s + p.gscClicks, 0);
            return (
              <div key={cluster.id} style={{
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: 12, overflow: "hidden",
                borderLeft: `3px solid ${cluster.color}`,
                transition: "all 0.2s ease",
              }}>
                <div onClick={() => setExpandedCluster(isExpanded ? null : cluster.id)} style={{
                  padding: "14px 18px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: isExpanded ? "var(--color-background-secondary)" : "transparent",
                  transition: "background 0.15s ease",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{cluster.name}</span>
                      {cluster.pillarStatus === "needs-creation" && (
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#501313", color: "#F09595", fontWeight: 500 }}>Needs pillar</span>
                      )}
                      {cluster.pillarStatus === "not-applicable" && (
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#2C2C2A", color: "#B4B2A9", fontWeight: 500 }}>No pillar needed</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                      {cluster.posts.length} post{cluster.posts.length !== 1 ? "s" : ""}
                      {cluster.headTerm && <> · Head term: <span style={{ color: "var(--color-text-secondary)" }}>{cluster.headTerm}</span> ({cluster.headTermVolume?.toLocaleString()}/mo)</>}
                      {cluster.gaps.length > 0 && <> · <span style={{ color: "#EF9F27" }}>{cluster.gaps.length} gap{cluster.gaps.length !== 1 ? "s" : ""}</span></>}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 16, fontWeight: 500 }}>{clusterClicks.toLocaleString()}</div>
                      <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>clicks</div>
                    </div>
                    <span style={{ fontSize: 14, color: "var(--color-text-tertiary)", transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: "0 18px 16px" }}>
                    {pillar && (
                      <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, border: `1px solid ${cluster.color}33`, background: `${cluster.color}0a` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <StatusBadge type="pillar" />
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{pillar.title}</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11, color: "var(--color-text-secondary)" }}>
                          <div>Clicks: <PerformanceBar value={pillar.gscClicks} max={maxClicks} color={cluster.color} /></div>
                          <div>Impressions: <PerformanceBar value={pillar.gscImpressions} max={maxImpressions} color={cluster.color} /></div>
                          {pillar.topKeyword && <div style={{ gridColumn: "1/3" }}>Top keyword: <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{pillar.topKeyword}</span> (vol: {pillar.topKwVolume?.toLocaleString()}, pos: {pillar.topKwPosition})</div>}
                          {pillar.referringDomains > 0 && <div>Referring domains: {pillar.referringDomains}</div>}
                        </div>
                      </div>
                    )}

                    {clusterPosts.map(post => (
                      <div key={post.slug} style={{
                        marginTop: 8, padding: "10px 14px", borderRadius: 8,
                        border: "0.5px solid var(--color-border-tertiary)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <StatusBadge type={post.type} />
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{post.title}</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11, color: "var(--color-text-secondary)" }}>
                          <div>Clicks: <PerformanceBar value={post.gscClicks} max={maxClicks} color={cluster.color} /></div>
                          <div>Impressions: <PerformanceBar value={post.gscImpressions} max={maxImpressions} color={cluster.color} /></div>
                        </div>
                      </div>
                    ))}

                    {showGaps && cluster.gaps.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: "#EF9F27", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Content gaps</div>
                        {cluster.gaps.map((gap, gi) => (
                          <div key={gi} style={{
                            marginTop: 6, padding: "10px 14px", borderRadius: 8,
                            border: "1px dashed #EF9F2766",
                            background: "#EF9F2708",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <StatusBadge type="gap" />
                              <span style={{ fontSize: 12, fontWeight: 500 }}>{gap.title}</span>
                            </div>
                            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>
                              Target: <span style={{ fontWeight: 500 }}>{gap.keyword}</span> · Est. volume: {gap.estVolume}/mo
                            </div>
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.5 }}>{gap.rationale}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view === "gaps" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.clusters.filter(c => c.gaps.length > 0).map(cluster => (
            <div key={cluster.id}>
              <div style={{ fontSize: 12, fontWeight: 500, color: cluster.color, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: cluster.color }} />
                {cluster.name}
              </div>
              {cluster.gaps.map((gap, gi) => (
                <div key={gi} style={{
                  marginBottom: 8, padding: "14px 16px", borderRadius: 10,
                  border: "1px dashed var(--color-border-secondary)",
                  borderLeft: `3px solid ${cluster.color}`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{gap.title}</div>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 8 }}>
                    <span>Keyword: <span style={{ fontWeight: 500 }}>{gap.keyword}</span></span>
                    <span>Volume: {gap.estVolume}/mo</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6, padding: "8px 12px", borderRadius: 6, background: "var(--color-background-secondary)" }}>
                    {gap.rationale}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, padding: "12px 16px", borderRadius: 8, background: "var(--color-background-secondary)", fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>
        <strong>Data freshness:</strong> GSC & GA4: 12 months ending March 2026. Ahrefs: exported March 17, 2026.
        <br /><strong>Note:</strong> Eco-friendly post (115 clicks, 20K impressions) currently sits in Brand/Seasonal but could seed a dedicated Sustainability cluster as more content is added. The swivel chairs post ranks #9 for "swivel chair" (700 vol/mo) — a strong signal despite low clicks.
      </div>
    </div>
  );
}
