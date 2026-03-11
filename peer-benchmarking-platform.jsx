import { useState, useEffect } from "react";

const AGENTS = [
  { id: "orchestrator", label: "Orchestrator", icon: "⬡", color: "#00D4FF", desc: "Routing & coordination" },
  { id: "profile", label: "Account Profiler", icon: "◈", color: "#FF6B35", desc: "Client & owner research" },
  { id: "peer", label: "Peer Selector", icon: "◎", color: "#A855F7", desc: "Industry peer identification" },
  { id: "intel", label: "Intel Gatherer", icon: "◇", color: "#10B981", desc: "IT spend & priorities" },
  { id: "owner", label: "Owner Analyzer", icon: "△", color: "#F59E0B", desc: "Account owner capabilities" },
  { id: "synthesizer", label: "Synthesizer", icon: "✦", color: "#EC4899", desc: "Benchmark assembly" },
];

const MOCK_DATA = {
  client: "Infosys Ltd",
  owner: "Salesforce",
  peers: [
    { name: "TCS", itSpend: "$1.2B", trend: "↑ Growing", bizPriority: "Cloud, AI, ESG", itPriority: "Hyperscaler migration, GenAI", strength: "Strong", gap: "CRM modernization", source: "TCS Annual Report 2024" },
    { name: "Wipro", itSpend: "$780M", trend: "→ Stable", bizPriority: "Cost optimization, M&A", itPriority: "Data platforms, automation", strength: "Moderate", gap: "Customer 360 visibility", source: "Wipro Investor Day 2024" },
    { name: "HCLTech", itSpend: "$890M", trend: "↑ Growing", bizPriority: "Engineering services, IP", itPriority: "DevSecOps, cloud-native", strength: "Strong", gap: "Sales force automation", source: "HCL Q3 FY25 Earnings" },
    { name: "LTIMindtree", itSpend: "$420M", trend: "↑ Growing", bizPriority: "Digital transformation", itPriority: "AI/ML ops, ERP", strength: "Moderate", gap: "Pipeline intelligence", source: "LTI Annual Report 2024" },
    { name: "Tech Mahindra", itSpend: "$510M", trend: "↓ Declining", bizPriority: "Telecom, recovery play", itPriority: "Network modernization", strength: "Lagging", gap: "Revenue operations", source: "TechM Q4 FY24 Call" },
  ],
  ownerCapabilities: ["Einstein AI / CRM Analytics", "Sales Cloud", "Service Cloud", "Revenue Intelligence", "MuleSoft Integration"],
};

const statusColors = { "Strong": "#10B981", "Moderate": "#F59E0B", "Lagging": "#EF4444" };
const trendColors = { "↑ Growing": "#10B981", "→ Stable": "#94A3B8", "↓ Declining": "#EF4444" };

export default function PeerBenchmarkingPlatform() {
  const [phase, setPhase] = useState("idle"); // idle | loading | complete
  const [activeAgents, setActiveAgents] = useState([]);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [currentLog, setCurrentLog] = useState([]);
  const [activeTab, setActiveTab] = useState("table");
  const [clientName, setClientName] = useState("Infosys Ltd");
  const [ownerName, setOwnerName] = useState("Salesforce");
  const [pulseAgent, setPulseAgent] = useState(null);

  const logs = [
    { agent: "orchestrator", msg: `Initializing peer benchmarking for ${clientName} → Account Owner: ${ownerName}` },
    { agent: "profile", msg: `Fetching ${clientName} company profile: revenue $18.6B, IT sector, HQ Bengaluru` },
    { agent: "profile", msg: `Fetching ${ownerName} capability themes from website, LinkedIn, case studies...` },
    { agent: "owner", msg: `Identified ${ownerName} focus areas: Sales Cloud, Einstein AI, Revenue Intelligence, MuleSoft` },
    { agent: "peer", msg: `Scanning ${clientName}'s primary industry: IT Services & Consulting (India-origin global)` },
    { agent: "peer", msg: `Applying peer filters: revenue 0.5x–2x, same go-to-market model, listed companies...` },
    { agent: "peer", msg: `Selected peers: TCS, Wipro, HCLTech, LTIMindtree, Tech Mahindra` },
    { agent: "intel", msg: `Gathering IT spend data from annual reports, Gartner estimates, 10-K filings...` },
    { agent: "intel", msg: `Extracting business & IT priorities from earnings calls, investor days, press releases...` },
    { agent: "intel", msg: `Cross-referencing LinkedIn posts, job listings for technology investment signals...` },
    { agent: "synthesizer", msg: `Mapping gaps to ${ownerName} capability themes across all 5 peers...` },
    { agent: "synthesizer", msg: `Generating opportunity matrix and source citations...` },
    { agent: "orchestrator", msg: `Benchmark complete. 5 peers | 12 dimensions | 100% source-backed.` },
  ];

  const runBenchmark = async () => {
    setPhase("loading");
    setActiveAgents([]);
    setCompletedAgents([]);
    setCurrentLog([]);

    for (let i = 0; i < logs.length; i++) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      const { agent, msg } = logs[i];
      setPulseAgent(agent);
      setActiveAgents(prev => [...new Set([...prev, agent])]);
      setCurrentLog(prev => [...prev, { agent, msg, time: new Date().toLocaleTimeString() }]);
      if (i > 0) setCompletedAgents(prev => [...new Set([...prev, logs[i - 1].agent])]);
    }

    await new Promise(r => setTimeout(r, 500));
    setCompletedAgents(AGENTS.map(a => a.id));
    setActiveAgents([]);
    setPulseAgent(null);
    setPhase("complete");
  };

  const reset = () => {
    setPhase("idle");
    setActiveAgents([]);
    setCompletedAgents([]);
    setCurrentLog([]);
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#070B14",
      minHeight: "100vh",
      color: "#E2E8F0",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0D1421 0%, #111827 100%)",
        borderBottom: "1px solid #1E2D40",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #00D4FF, #A855F7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900,
          }}>⬡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.02em", color: "#F1F5F9" }}>Antigravity Intelligence</div>
            <div style={{ fontSize: 11, color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase" }}>Multi-Agent Sales Intel Platform</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Account Research", "Peer Benchmarking", "Deal Intelligence", "Whitespace"].map((tab, i) => (
            <div key={tab} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500,
              background: i === 1 ? "linear-gradient(135deg, #00D4FF22, #A855F722)" : "transparent",
              color: i === 1 ? "#00D4FF" : "#475569",
              border: i === 1 ? "1px solid #00D4FF44" : "1px solid transparent",
              cursor: "pointer",
            }}>{tab}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1400, margin: "0 auto" }}>

        {/* Input Row */}
        <div style={{
          background: "#0D1421", border: "1px solid #1E2D40", borderRadius: 12,
          padding: "20px 24px", marginBottom: 24,
          display: "flex", alignItems: "flex-end", gap: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Client Account (Target)</div>
            <input value={clientName} onChange={e => setClientName(e.target.value)}
              style={{
                width: "100%", background: "#070B14", border: "1px solid #1E2D40",
                borderRadius: 8, padding: "10px 14px", color: "#F1F5F9", fontSize: 14,
                outline: "none", boxSizing: "border-box",
              }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Account Owner Organization</div>
            <input value={ownerName} onChange={e => setOwnerName(e.target.value)}
              style={{
                width: "100%", background: "#070B14", border: "1px solid #1E2D40",
                borderRadius: 8, padding: "10px 14px", color: "#F1F5F9", fontSize: 14,
                outline: "none", boxSizing: "border-box",
              }} />
          </div>
          <button onClick={phase === "idle" ? runBenchmark : reset}
            style={{
              padding: "10px 28px", borderRadius: 8, border: "none", cursor: "pointer",
              background: phase === "idle" ? "linear-gradient(135deg, #00D4FF, #A855F7)" :
                phase === "loading" ? "#1E2D40" : "#10B98122",
              color: phase === "complete" ? "#10B981" : "#fff",
              fontWeight: 700, fontSize: 13, letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              transition: "all 0.3s",
            }}>
            {phase === "idle" ? "▶ Run Benchmark" : phase === "loading" ? "⟳ Running..." : "↺ Reset"}
          </button>
        </div>

        {/* Agent Network */}
        <div style={{
          background: "#0D1421", border: "1px solid #1E2D40", borderRadius: 12,
          padding: "20px 24px", marginBottom: 24,
        }}>
          <div style={{ fontSize: 11, color: "#64748B", marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Multi-Agent Network Status</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {AGENTS.map(agent => {
              const isActive = activeAgents.includes(agent.id);
              const isDone = completedAgents.includes(agent.id);
              const isPulsing = pulseAgent === agent.id;
              return (
                <div key={agent.id} style={{
                  background: isDone ? `${agent.color}11` : isActive ? `${agent.color}18` : "#070B14",
                  border: `1px solid ${isDone ? agent.color + "55" : isActive ? agent.color + "88" : "#1E2D40"}`,
                  borderRadius: 10, padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: 10,
                  transition: "all 0.4s",
                  boxShadow: isPulsing ? `0 0 20px ${agent.color}44` : "none",
                  flex: "1 1 160px",
                }}>
                  <div style={{
                    fontSize: 20, color: isDone ? agent.color : isActive ? agent.color : "#334155",
                    transition: "color 0.3s",
                    animation: isPulsing ? "pulse 0.8s infinite" : "none",
                  }}>{agent.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isDone ? agent.color : isActive ? "#F1F5F9" : "#475569" }}>{agent.label}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{agent.desc}</div>
                  </div>
                  {isDone && <div style={{ marginLeft: "auto", color: agent.color, fontSize: 14 }}>✓</div>}
                  {isActive && !isDone && <div style={{ marginLeft: "auto", color: agent.color, fontSize: 10, animation: "blink 1s infinite" }}>●</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Log */}
        {currentLog.length > 0 && (
          <div style={{
            background: "#070B14", border: "1px solid #1E2D40", borderRadius: 12,
            padding: "16px 20px", marginBottom: 24,
            maxHeight: 160, overflowY: "auto",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}>
            {currentLog.map((entry, i) => {
              const agent = AGENTS.find(a => a.id === entry.agent);
              return (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 4, fontSize: 11 }}>
                  <span style={{ color: "#334155" }}>{entry.time}</span>
                  <span style={{ color: agent?.color || "#64748B", fontWeight: 700, minWidth: 100 }}>[{agent?.label}]</span>
                  <span style={{ color: "#94A3B8" }}>{entry.msg}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Results */}
        {phase === "complete" && (
          <div style={{
            background: "#0D1421", border: "1px solid #1E2D40", borderRadius: 12,
            padding: "24px",
            animation: "fadeIn 0.6s ease",
          }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "1px solid #1E2D40", paddingBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", marginRight: 16 }}>
                Peer Benchmarking: <span style={{ color: "#00D4FF" }}>{clientName}</span>
              </div>
              {["table", "capabilities", "opportunities"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer",
                  background: activeTab === tab ? "linear-gradient(135deg, #00D4FF22, #A855F722)" : "transparent",
                  color: activeTab === tab ? "#00D4FF" : "#475569",
                  fontSize: 12, fontWeight: 600, textTransform: "capitalize",
                  borderBottom: activeTab === tab ? "2px solid #00D4FF" : "2px solid transparent",
                }}>{tab}</button>
              ))}
            </div>

            {/* Table View */}
            {activeTab === "table" && (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1E2D40" }}>
                      {["Dimension", clientName, ...MOCK_DATA.peers.map(p => p.name)].map((h, i) => (
                        <th key={h} style={{
                          padding: "10px 14px", textAlign: "left", fontWeight: 700,
                          color: i === 0 ? "#64748B" : i === 1 ? "#00D4FF" : "#94A3B8",
                          fontSize: i === 0 ? 10 : 12,
                          letterSpacing: "0.04em",
                          background: i === 1 ? "#00D4FF08" : "transparent",
                          borderRight: i === 1 ? "1px solid #00D4FF22" : "none",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Est. IT Spend", key: "itSpend", clientVal: "$1.8B" },
                      { label: "IT Spend Trend", key: "trend", clientVal: "↑ Growing" },
                      { label: "Top Biz Priorities", key: "bizPriority", clientVal: "GenAI, cloud, talent" },
                      { label: "Top IT Priorities", key: "itPriority", clientVal: "Cobalt platform, AI" },
                      { label: "Overall Strength", key: "strength", clientVal: "Strong" },
                      { label: "Key Gap (Owner)", key: "gap", clientVal: "Unified CRM layer" },
                      { label: "Primary Source", key: "source", clientVal: "Infosys AR 2024" },
                    ].map((row, ri) => (
                      <tr key={row.label} style={{ borderBottom: "1px solid #0F1923" }}>
                        <td style={{ padding: "10px 14px", color: "#64748B", fontWeight: 600, fontSize: 11, letterSpacing: "0.04em" }}>{row.label}</td>
                        <td style={{ padding: "10px 14px", background: "#00D4FF08", borderRight: "1px solid #00D4FF22" }}>
                          <span style={{
                            color: row.key === "strength" ? statusColors[row.clientVal] :
                              row.key === "trend" ? trendColors[row.clientVal] : "#F1F5F9",
                            fontWeight: row.key === "strength" ? 700 : 400,
                          }}>{row.clientVal}</span>
                        </td>
                        {MOCK_DATA.peers.map(peer => (
                          <td key={peer.name} style={{ padding: "10px 14px", color: "#94A3B8" }}>
                            <span style={{
                              color: row.key === "strength" ? statusColors[peer[row.key]] :
                                row.key === "trend" ? trendColors[peer[row.key]] : "#94A3B8",
                              fontWeight: row.key === "strength" ? 700 : 400,
                              fontSize: row.key === "source" ? 10 : 12,
                            }}>{peer[row.key]}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Capabilities View */}
            {activeTab === "capabilities" && (
              <div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>
                  {ownerName} capability fit mapped to peer gaps
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                  {MOCK_DATA.ownerCapabilities.map((cap, i) => {
                    const colors = ["#00D4FF", "#A855F7", "#10B981", "#F59E0B", "#EC4899"];
                    const relevantPeers = MOCK_DATA.peers.filter((_, pi) => pi % 2 === i % 2 || pi === i);
                    return (
                      <div key={cap} style={{
                        background: "#070B14", border: `1px solid ${colors[i]}33`,
                        borderRadius: 10, padding: "16px",
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: colors[i], marginBottom: 8 }}>{cap}</div>
                        <div style={{ fontSize: 11, color: "#475569", marginBottom: 10 }}>Gap identified in:</div>
                        {relevantPeers.slice(0, 2).map(p => (
                          <div key={p.name} style={{
                            display: "flex", alignItems: "center", gap: 8, marginBottom: 4
                          }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: colors[i] }} />
                            <span style={{ fontSize: 11, color: "#94A3B8" }}>{p.name} — {p.gap}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Opportunities View */}
            {activeTab === "opportunities" && (
              <div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>
                  Priority opportunity signals for {ownerName} targeting {clientName}
                </div>
                {[
                  { signal: `${clientName} lags peers on unified CRM layer`, action: `Lead with Sales Cloud + Einstein AI — TCS and HCLTech prove the ROI`, priority: "High", color: "#EF4444" },
                  { signal: "3 of 5 peers show growing IT spend", action: "Frame investment as competitive necessity, not discretionary spend", priority: "High", color: "#EF4444" },
                  { signal: "Tech Mahindra is lagging on revenue ops", action: "Use as negative social proof in pitch narrative to create urgency", priority: "Medium", color: "#F59E0B" },
                  { signal: "LTIMindtree prioritizing AI/ML ops", action: "Position MuleSoft integration as enabler for AI data pipelines", priority: "Medium", color: "#F59E0B" },
                  { signal: "Wipro in cost optimization mode", action: "Avoid premium positioning; lead with ROI and efficiency story", priority: "Low", color: "#10B981" },
                ].map((opp, i) => (
                  <div key={i} style={{
                    background: "#070B14", border: "1px solid #1E2D40", borderRadius: 10,
                    padding: "14px 16px", marginBottom: 10,
                    display: "flex", alignItems: "flex-start", gap: 16,
                  }}>
                    <div style={{
                      padding: "2px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                      background: opp.color + "22", color: opp.color, whiteSpace: "nowrap",
                    }}>{opp.priority}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>📡 {opp.signal}</div>
                      <div style={{ fontSize: 13, color: "#F1F5F9", fontWeight: 600 }}>→ {opp.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Idle State */}
        {phase === "idle" && (
          <div style={{
            textAlign: "center", padding: "60px 32px",
            background: "#0D1421", border: "1px solid #1E2D40", borderRadius: 12,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⬡</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", marginBottom: 8 }}>Peer Benchmarking Engine</div>
            <div style={{ fontSize: 13, color: "#475569", maxWidth: 480, margin: "0 auto" }}>
              Enter your client account and organization above, then click Run Benchmark. Six specialized agents will coordinate in real-time to build a source-backed competitive intelligence report.
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #070B14; }
        ::-webkit-scrollbar-thumb { background: #1E2D40; border-radius: 2px; }
        input:focus { border-color: #00D4FF44 !important; }
      `}</style>
    </div>
  );
}
