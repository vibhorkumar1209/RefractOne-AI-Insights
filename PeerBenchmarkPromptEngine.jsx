import { useState } from "react";

const sections = [
  {
    id: "overview",
    title: "Overview",
    icon: "🎯",
  },
  {
    id: "inputs",
    title: "Inputs & Placeholders",
    icon: "⚙️",
  },
  {
    id: "prompt",
    title: "The Master Prompt",
    icon: "📋",
  },
  {
    id: "example",
    title: "Worked Example",
    icon: "💡",
  },
  {
    id: "why",
    title: "Why This Works",
    icon: "🧠",
  },
  {
    id: "customize",
    title: "Customization Ideas",
    icon: "🔧",
  },
];

const inputFields = [
  {
    name: "TARGET_ACCOUNT",
    label: "Target Account",
    desc: "The company you are targeting",
    examples: "Incora, Maersk, Caterpillar",
    required: true,
  },
  {
    name: "SELLING_ORGANIZATION",
    label: "Selling Organization",
    desc: "Your company or the vendor whose solutions you are positioning",
    examples: "EdgeVerve, Salesforce, Infosys",
    required: true,
  },
  {
    name: "INDUSTRY_CONTEXT",
    label: "Industry Context",
    desc: "Brief industry descriptor to help identify relevant peers",
    examples: "Aerospace supply chain distribution, Industrial manufacturing, Retail banking",
    required: true,
  },
  {
    name: "FOCUS_AREAS",
    label: "Focus Areas",
    desc: "Specific dimensions to benchmark (defaults provided if left blank)",
    examples: "Sustainability tech, Cybersecurity posture, Cloud migration maturity",
    required: false,
  },
  {
    name: "SPECIFIC_PEERS",
    label: "Specific Peers",
    desc: "Known competitors to benchmark against (AI selects if omitted)",
    examples: "Boeing Distribution, Satair, AAR Corp",
    required: false,
  },
  {
    name: "SOLUTION_PORTFOLIO",
    label: "Solution Portfolio",
    desc: "Key products/platforms to map against gaps",
    examples: "AI Next, AssistEdge RPA, XtractEdge, TradeEdge",
    required: false,
  },
  {
    name: "ADDITIONAL_CONTEXT",
    label: "Additional Context",
    desc: "Known intelligence about the target (M&A, restructuring, tech stack, stakeholders)",
    examples: "Emerged from Ch.11 Jan 2025, runs SAP/Oracle, 644K SKUs...",
    required: false,
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? "#059669" : "#6D28D9",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "8px 18px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {copied ? "✓ Copied!" : "Copy to Clipboard"}
    </button>
  );
}

const masterPromptTemplate = (vals) => {
  const v = (k) => vals[k] || `{{${k}}}`;
  const hasVal = (k) => vals[k] && vals[k].trim().length > 0;

  return `You are a senior B2B sales intelligence analyst building a peer benchmarking and gap analysis deliverable. Your output will be used by enterprise sales teams to prepare for strategic account pursuits.

=== TASK ===

Build a 2-slide PowerPoint presentation that:

SLIDE 1 — PEER BENCHMARKING TABLE
Compare ${v("TARGET_ACCOUNT")} against 3 direct competitors on the following dimensions:
- ERP & Core IT Stack (what systems they run, cloud vs. legacy, recent migrations)
- Digital Commerce & Customer Platform (ecommerce, self-service portals, marketplace capabilities)
- AI / ML & Automation Investments (named AI initiatives, vendor partnerships, deployed tools)
- Estimated Annual IT Spend (as % of revenue, absolute estimates, recent capex signals)
- Stated IT Priority / Focus Area for current and next fiscal year

Industry context: ${v("INDUSTRY_CONTEXT")}
${
  hasVal("SPECIFIC_PEERS")
    ? `\nBenchmark against these specific peers: ${v("SPECIFIC_PEERS")}`
    : `\nSelect the 3 most relevant direct competitors — companies that operate in the same market segment, compete for the same customers, and whose technology investments would be meaningful comparisons. Prioritize peers where public information on IT/digital strategy is available. Avoid comparing against companies that are in fundamentally different businesses even if they are in the same broad industry.`
}
${hasVal("FOCUS_AREAS") ? `\nAdditionally benchmark on these specific dimensions: ${v("FOCUS_AREAS")}` : ""}

SLIDE 2 — GAP ANALYSIS & OPPORTUNITY MAP
For each capability dimension, create a structured comparison:
- Column 1: "Capability Dimension" — the area being assessed
- Column 2: "What Peers Are Doing" — synthesize the strongest capability across all 3 peers for that dimension
- Column 3: "Where ${v("TARGET_ACCOUNT")} Stands Today" — current state based on research
- Column 4: "Gap / Strength Assessment" — color-coded rating:
  * GREEN = Target account leads or is comparable to peers (strength)
  * AMBER = Partial or significant gap, but some foundation exists
  * RED = Critical gap — target account materially lags all peers, catch-up required
- Column 5: "${v("SELLING_ORGANIZATION")} Solution Fit" — map the specific product/platform from ${v("SELLING_ORGANIZATION")} that addresses each gap, with a verified proof point (client result, case study metric, or analyst recognition)
${hasVal("SOLUTION_PORTFOLIO") ? `\n${v("SELLING_ORGANIZATION")}'s key solutions to map against gaps: ${v("SOLUTION_PORTFOLIO")}` : ""}

=== RESEARCH REQUIREMENTS ===

1. **Web search is mandatory.** Search for each company individually to find:
   - Recent press releases, earnings calls, and investor presentations (last 12-18 months)
   - Technology partnership announcements
   - Job postings that signal technology priorities (e.g., hiring for SAP S/4HANA migration, AI/ML engineers)
   - Industry analyst reports mentioning the company's digital maturity
   - Conference presentations or case studies

2. **IT spend estimation methodology:**
   - Use industry benchmarks (Gartner, Avasant, IDC) for IT spend as % of revenue by sector
   - Cross-reference with any disclosed technology investments, acquisitions, or partnerships
   - Note if spend was likely suppressed (e.g., during restructuring, bankruptcy) or elevated (e.g., post-IPO, digital transformation initiative)

3. **Source verification:**
   - Every factual claim must be traceable to a specific, publicly accessible source
   - Include source citations on every slide (URLs or publication references)
   - Do NOT fabricate case studies, metrics, or partnerships
   - If information is unavailable for a dimension, state "Not publicly disclosed" rather than speculating

4. **For ${v("SELLING_ORGANIZATION")}'s solution mapping:**
   - Only reference case studies and client results that can be verified through the company's website or public announcements
   - Include source URLs for every proof point
   - Map solutions to gaps with specificity — not generic capability descriptions, but precise problem-solution fit
${
  hasVal("ADDITIONAL_CONTEXT")
    ? `\n=== KNOWN INTELLIGENCE ABOUT ${v("TARGET_ACCOUNT")} ===\n${v("ADDITIONAL_CONTEXT")}`
    : ""
}

=== DESIGN SPECIFICATIONS ===

**Slide 1 — Peer Benchmarking Table:**
- 5-column layout: Dimension | Target Account | Peer 1 | Peer 2 | Peer 3
- Each peer column header should include: Company name, revenue (if known), employee count, key descriptor
- Color-code each peer column with a distinct, muted background tint for scannability
- Target account column should use a warm/amber tint to visually distinguish it as the focus
- 5-6 rows covering the benchmarking dimensions
- Font size 6-7pt for table body (this is a dense data slide, readability at projection size is secondary to completeness)
- Include a source citation bar at the bottom with abbreviated source references

**Slide 2 — Gap Analysis & Opportunity Map:**
- 5-column layout: Capability Dimension | What Peers Are Doing | Where Target Stands | Gap/Strength | Selling Org Solution Fit
- Gap/Strength column should use semantic color coding:
  * Red background (#FEF2F2) with red text for Critical Gap
  * Amber background (#FFFBEB) with dark amber text for Significant/Partial Gap
  * Green background (#ECFDF5) with green text for Strength
- Solution Fit column should use a distinct purple/violet tint (#F5F3FF) to visually separate it as the "action" column
- Include a color legend bar at the bottom
- Each solution mapping should name the specific product AND include one verified metric/proof point
- 6 rows covering: ERP/Data, Digital Commerce, AI/Automation, Contract/Process Automation, Supply Chain (or domain-specific advantage), Scale/Investment Capacity

**General Design:**
- Professional dark navy header bar on each slide with white title text
- Teal accent for section labels
- Off-white for dimension label cells
- Clean sans-serif fonts
- Thin light gray borders between cells
- Data-dense analytical slides, not marketing pieces

=== OUTPUT FORMAT ===

Produce a .pptx file with exactly 2 slides using pptxgenjs (Node.js). The file should be presentation-ready for an enterprise sales meeting.

Before building the slides, present your research findings as a structured brief so the user can review the intelligence before it gets locked into the presentation. Organize findings by company, then by dimension.`;
};

export default function PeerBenchmarkPromptBuilder() {
  const [activeSection, setActiveSection] = useState("overview");
  const [vals, setVals] = useState({});
  const [showGenerated, setShowGenerated] = useState(false);

  const updateVal = (key, value) => setVals((prev) => ({ ...prev, [key]: value }));

  const generatedPrompt = masterPromptTemplate(vals);

  const hasRequiredFields =
    vals.TARGET_ACCOUNT?.trim() &&
    vals.SELLING_ORGANIZATION?.trim() &&
    vals.INDUSTRY_CONTEXT?.trim();

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", background: "#0B1120", minHeight: "100vh", color: "#E2E8F0" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", borderBottom: "1px solid rgba(99,102,241,0.2)", padding: "20px 28px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#818CF8", marginBottom: 4 }}>
          SALES INTELLIGENCE PROMPT ENGINE
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", lineHeight: 1.2 }}>
          Peer Benchmarking & Gap Analysis
        </div>
        <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>
          Reusable prompt template for IT priorities, digital investments & opportunity mapping
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
        {/* Sidebar Nav */}
        <div style={{ width: 220, borderRight: "1px solid rgba(99,102,241,0.12)", padding: "16px 0", flexShrink: 0, background: "rgba(15,23,42,0.6)" }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSection(s.id);
                setShowGenerated(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 20px",
                border: "none",
                background: activeSection === s.id ? "rgba(99,102,241,0.15)" : "transparent",
                borderLeft: activeSection === s.id ? "3px solid #818CF8" : "3px solid transparent",
                color: activeSection === s.id ? "#C7D2FE" : "#94A3B8",
                fontSize: 13,
                fontWeight: activeSection === s.id ? 600 : 400,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 15 }}>{s.icon}</span>
              {s.title}
            </button>
          ))}
          <div style={{ borderTop: "1px solid rgba(99,102,241,0.12)", margin: "12px 20px" }} />
          <button
            onClick={() => {
              setActiveSection("generator");
              setShowGenerated(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "10px 20px",
              border: "none",
              background: activeSection === "generator" ? "rgba(109,40,217,0.2)" : "transparent",
              borderLeft: activeSection === "generator" ? "3px solid #A78BFA" : "3px solid transparent",
              color: activeSection === "generator" ? "#C4B5FD" : "#A78BFA",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 15 }}>🚀</span>
            Generate Prompt
          </button>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "24px 32px", overflowY: "auto", maxHeight: "calc(100vh - 100px)" }}>
          {/* OVERVIEW */}
          {activeSection === "overview" && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", marginBottom: 16 }}>What This Prompt Produces</h2>
              <p style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.7, marginBottom: 20 }}>
                A 2-slide PowerPoint deliverable that benchmarks a target account against 3 direct competitors on IT priorities and digital investments, then maps the gaps to your solution portfolio — creating a precise, data-backed opportunity map for enterprise sales conversations.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                {[
                  {
                    title: "Slide 1: Peer Benchmarking Table",
                    color: "#3B82F6",
                    items: [
                      "ERP & Core IT Stack comparison",
                      "Digital Commerce & Customer Platform",
                      "AI / ML & Automation Investments",
                      "Estimated Annual IT Spend",
                      "Stated IT Priority / Focus Areas",
                    ],
                  },
                  {
                    title: "Slide 2: Gap Analysis & Opportunity Map",
                    color: "#8B5CF6",
                    items: [
                      "What peers are doing (best-in-class synthesis)",
                      "Where target stands today",
                      "RED / AMBER / GREEN gap severity",
                      "Your solution mapped to each gap",
                      "Verified proof points per solution",
                    ],
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    style={{
                      background: "rgba(30,41,59,0.7)",
                      borderRadius: 10,
                      padding: 20,
                      border: `1px solid ${card.color}33`,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: card.color, marginBottom: 12 }}>{card.title}</div>
                    {card.items.map((item, i) => (
                      <div key={i} style={{ fontSize: 12.5, color: "#94A3B8", padding: "4px 0", display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ color: card.color, fontSize: 8, marginTop: 5 }}>●</span>
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(99,102,241,0.08)", borderRadius: 8, padding: 16, border: "1px solid rgba(99,102,241,0.15)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#A5B4FC", marginBottom: 8 }}>Key Design Principles</div>
                <div style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.8 }}>
                  <strong style={{ color: "#C7D2FE" }}>Research-first:</strong> Forces web search before output — prevents hallucination.{" "}
                  <strong style={{ color: "#C7D2FE" }}>Source-verified:</strong> Every claim must have a traceable URL.{" "}
                  <strong style={{ color: "#C7D2FE" }}>Color-coded severity:</strong> RED/AMBER/GREEN for instant scannability.{" "}
                  <strong style={{ color: "#C7D2FE" }}>Action-oriented:</strong> Solution Fit column connects intelligence directly to sales conversations.
                </div>
              </div>
            </div>
          )}

          {/* INPUTS */}
          {activeSection === "inputs" && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", marginBottom: 6 }}>Inputs & Placeholders</h2>
              <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
                Fill in these fields to generate a customized prompt. Required fields are marked with *.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {inputFields.map((f) => (
                  <div key={f.name} style={{ background: "rgba(30,41,59,0.5)", borderRadius: 8, padding: 16, border: "1px solid rgba(99,102,241,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>
                        {f.label}
                        {f.required && <span style={{ color: "#F87171", marginLeft: 3 }}>*</span>}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: f.required ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.1)",
                          color: f.required ? "#FCA5A5" : "#818CF8",
                          fontWeight: 600,
                        }}
                      >
                        {f.required ? "REQUIRED" : "OPTIONAL"}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>{f.desc}</div>
                    {f.name === "ADDITIONAL_CONTEXT" ? (
                      <textarea
                        value={vals[f.name] || ""}
                        onChange={(e) => updateVal(f.name, e.target.value)}
                        placeholder={f.examples}
                        rows={3}
                        style={{
                          width: "100%",
                          background: "rgba(15,23,42,0.6)",
                          border: "1px solid rgba(99,102,241,0.2)",
                          borderRadius: 6,
                          padding: "8px 12px",
                          color: "#E2E8F0",
                          fontSize: 13,
                          fontFamily: "inherit",
                          resize: "vertical",
                          boxSizing: "border-box",
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={vals[f.name] || ""}
                        onChange={(e) => updateVal(f.name, e.target.value)}
                        placeholder={f.examples}
                        style={{
                          width: "100%",
                          background: "rgba(15,23,42,0.6)",
                          border: "1px solid rgba(99,102,241,0.2)",
                          borderRadius: 6,
                          padding: "8px 12px",
                          color: "#E2E8F0",
                          fontSize: 13,
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                <button
                  onClick={() => {
                    setActiveSection("generator");
                    setShowGenerated(true);
                  }}
                  disabled={!hasRequiredFields}
                  style={{
                    background: hasRequiredFields ? "linear-gradient(135deg, #6D28D9, #7C3AED)" : "#334155",
                    color: hasRequiredFields ? "#fff" : "#64748B",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 24px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: hasRequiredFields ? "pointer" : "not-allowed",
                  }}
                >
                  🚀 Generate Prompt
                </button>
                <button
                  onClick={() => setVals({})}
                  style={{
                    background: "transparent",
                    color: "#94A3B8",
                    border: "1px solid rgba(148,163,184,0.3)",
                    borderRadius: 8,
                    padding: "10px 20px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* THE MASTER PROMPT */}
          {activeSection === "prompt" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>The Master Prompt (Raw Template)</h2>
                <CopyButton text={masterPromptTemplate({})} />
              </div>
              <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16 }}>
                This is the raw template with {"{{placeholders}}"}. Copy it and manually replace the variables, or use the Inputs tab to auto-fill.
              </p>
              <pre
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: 8,
                  padding: 20,
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: "#CBD5E1",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxHeight: "65vh",
                  overflowY: "auto",
                }}
              >
                {masterPromptTemplate({})}
              </pre>
            </div>
          )}

          {/* WORKED EXAMPLE */}
          {activeSection === "example" && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", marginBottom: 6 }}>Worked Example: EdgeVerve → Incora</h2>
              <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20 }}>
                Here's how each placeholder was filled for the Incora peer benchmarking deliverable.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "TARGET_ACCOUNT", value: "Incora" },
                  { label: "SELLING_ORGANIZATION", value: "EdgeVerve" },
                  {
                    label: "INDUSTRY_CONTEXT",
                    value: "Aerospace supply chain distribution — independent providers of end-to-end supply chain management (procurement, inventory, logistics) for aerospace & defense OEMs",
                  },
                  { label: "SPECIFIC_PEERS", value: "Boeing Distribution (formerly Aviall), Satair (Airbus subsidiary), AAR Corp" },
                  {
                    label: "SOLUTION_PORTFOLIO",
                    value:
                      "AI Next for GBS (contract management, agentic AI), AssistEdge RPA (enterprise process automation across SAP/Oracle), XtractEdge (document AI for contracts & procurement), TradeEdge (multi-enterprise supply chain network, order management, demand sensing)",
                  },
                  {
                    label: "ADDITIONAL_CONTEXT",
                    value:
                      "Incora emerged from Chapter 11 bankruptcy on January 31, 2025 with de-leveraged balance sheet and $100M new equity. $1.6B revenue, 3,800 employees, 68 locations across 17 countries. Runs multi-instance SAP + Oracle (legacy). 644,000+ SKU portfolio. Recently announced investments in warehouse robotics, TMS, and vertical carousels at Northlake facility.",
                  },
                ].map((ex) => (
                  <div
                    key={ex.label}
                    style={{
                      background: "rgba(30,41,59,0.5)",
                      borderRadius: 8,
                      padding: "12px 16px",
                      border: "1px solid rgba(99,102,241,0.1)",
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                    }}
                  >
                    <code
                      style={{
                        background: "rgba(109,40,217,0.15)",
                        color: "#C4B5FD",
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {`{{${ex.label}}}`}
                    </code>
                    <span style={{ fontSize: 12.5, color: "#CBD5E1", lineHeight: 1.6 }}>{ex.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, background: "rgba(5,150,105,0.08)", borderRadius: 8, padding: 16, border: "1px solid rgba(5,150,105,0.15)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#6EE7B7", marginBottom: 8 }}>Output Produced</div>
                <div style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.7 }}>
                  <strong style={{ color: "#A7F3D0" }}>Slide 1:</strong> 5-column table comparing Incora vs Boeing Distribution, Satair, AAR Corp across ERP stack, digital commerce, AI/ML, IT spend, and stated priorities. Each peer color-coded with distinct tint.
                  <br />
                  <strong style={{ color: "#A7F3D0" }}>Slide 2:</strong> 6-row gap analysis with RED (ERP, Digital Commerce, Contract Mgmt), AMBER (AI/ML, Scale), GREEN (Multi-OEM Independence) ratings. Each gap mapped to specific EdgeVerve product with verified case study metric and source URL.
                </div>
              </div>
            </div>
          )}

          {/* WHY THIS WORKS */}
          {activeSection === "why" && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", marginBottom: 20 }}>Why This Prompt Works</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  {
                    num: "01",
                    title: "Research-Before-Build Phase",
                    desc: "The prompt forces the AI to present findings as a structured brief before locking them into slides. This creates a human review checkpoint that prevents hallucination and lets you course-correct before the final output.",
                    color: "#3B82F6",
                  },
                  {
                    num: "02",
                    title: "Dual-Slide Architecture Separates Data from Insight",
                    desc: "Slide 1 is pure descriptive benchmarking (what is). Slide 2 is prescriptive gap analysis (what to do about it). This mirrors how enterprise sales teams actually consume and present competitive intelligence.",
                    color: "#8B5CF6",
                  },
                  {
                    num: "03",
                    title: "Color-Coded Severity System",
                    desc: "The RED / AMBER / GREEN framework makes the gap analysis instantly scannable in a sales meeting. The audience immediately sees where the target account is most vulnerable without reading every cell.",
                    color: "#F59E0B",
                  },
                  {
                    num: "04",
                    title: "Hard Source Verification Requirement",
                    desc: "The prompt explicitly prohibits fabricated case studies and requires traceable URLs. This is critical for B2B enterprise sales where sophisticated buyers will verify every claim you make.",
                    color: "#EF4444",
                  },
                  {
                    num: "05",
                    title: "Solution Fit Column Connects Intelligence to Action",
                    desc: "Rather than ending at gap identification, the prompt maps each gap to a specific product with a verified proof point — transforming analysis into a ready-made sales conversation and demo justification.",
                    color: "#10B981",
                  },
                  {
                    num: "06",
                    title: "Industry-Agnostic, Peer-Selection-Aware",
                    desc: "The benchmarking dimensions (ERP, digital commerce, AI/ML, IT spend, priorities) are universal enterprise IT concerns. The peer selection logic ensures the AI picks relevant comparisons regardless of industry.",
                    color: "#EC4899",
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    style={{
                      display: "flex",
                      gap: 16,
                      background: "rgba(30,41,59,0.4)",
                      borderRadius: 8,
                      padding: 16,
                      border: "1px solid rgba(99,102,241,0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: item.color,
                        opacity: 0.7,
                        flexShrink: 0,
                        width: 32,
                        textAlign: "center",
                      }}
                    >
                      {item.num}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.7 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOMIZATION */}
          {activeSection === "customize" && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", marginBottom: 20 }}>Customization Ideas</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  {
                    title: "Add Stakeholder Talk Tracks",
                    desc: "Add a row to Slide 2 mapping each gap to the buyer persona who owns that problem (CIO, CSCO, CFO, etc.)",
                    tag: "EXTEND",
                    tagColor: "#3B82F6",
                  },
                  {
                    title: "Time Sensitivity Indicators",
                    desc: "Show which gaps are becoming more urgent due to regulatory deadlines, competitor moves, or contract renewals.",
                    tag: "EXTEND",
                    tagColor: "#3B82F6",
                  },
                  {
                    title: "3rd Slide: Phased Engagement",
                    desc: "Add a Quick Win → Scale → Transform engagement plan derived from the gap priorities identified in Slide 2.",
                    tag: "ADD SLIDE",
                    tagColor: "#8B5CF6",
                  },
                  {
                    title: "Swap IT for Functional Dimensions",
                    desc: "For HR tech: Talent Acquisition, HRIS, L&D, People Analytics, Payroll. For supply chain: Planning, Execution, Visibility, Returns.",
                    tag: "MODIFY",
                    tagColor: "#F59E0B",
                  },
                  {
                    title: "Financial Benchmarking Layer",
                    desc: "Add revenue per employee, margin comparison, R&D intensity if targeting CFO/finance stakeholders.",
                    tag: "EXTEND",
                    tagColor: "#3B82F6",
                  },
                  {
                    title: "Competitive Win/Loss Analysis",
                    desc: "Add a column showing where the selling org has won or lost against the same competitors benchmarked.",
                    tag: "ADD SLIDE",
                    tagColor: "#8B5CF6",
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    style={{
                      background: "rgba(30,41,59,0.5)",
                      borderRadius: 8,
                      padding: 16,
                      border: "1px solid rgba(99,102,241,0.1)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: `${card.tagColor}20`,
                          color: card.tagColor,
                          letterSpacing: 1,
                        }}
                      >
                        {card.tag}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0", marginBottom: 6 }}>{card.title}</div>
                    <div style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.6 }}>{card.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GENERATOR OUTPUT */}
          {activeSection === "generator" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>Generated Prompt</h2>
                  <p style={{ fontSize: 13, color: "#94A3B8", margin: "4px 0 0 0" }}>
                    {hasRequiredFields
                      ? "Your customized prompt is ready. Copy and paste it into Claude."
                      : "Fill in the required fields in the Inputs tab first."}
                  </p>
                </div>
                {hasRequiredFields && <CopyButton text={generatedPrompt} />}
              </div>

              {!hasRequiredFields && (
                <div
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <div style={{ fontSize: 13, color: "#FCA5A5", fontWeight: 600 }}>Missing required fields:</div>
                  <div style={{ fontSize: 12.5, color: "#F87171", marginTop: 4 }}>
                    {!vals.TARGET_ACCOUNT?.trim() && "• Target Account  "}
                    {!vals.SELLING_ORGANIZATION?.trim() && "• Selling Organization  "}
                    {!vals.INDUSTRY_CONTEXT?.trim() && "• Industry Context"}
                  </div>
                  <button
                    onClick={() => setActiveSection("inputs")}
                    style={{
                      marginTop: 10,
                      background: "rgba(239,68,68,0.15)",
                      color: "#FCA5A5",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: 6,
                      padding: "6px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Go to Inputs →
                  </button>
                </div>
              )}

              <pre
                style={{
                  background: "rgba(15,23,42,0.8)",
                  border: `1px solid ${hasRequiredFields ? "rgba(109,40,217,0.3)" : "rgba(99,102,241,0.1)"}`,
                  borderRadius: 8,
                  padding: 20,
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: hasRequiredFields ? "#CBD5E1" : "#64748B",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
              >
                {generatedPrompt}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
