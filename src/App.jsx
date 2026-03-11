
import { useState, useEffect } from "react";
import { 
  Activity, Search, Users, Database, Lightbulb, BarChart3, CheckCircle2, ArrowUpRight, 
  RefreshCcw, ExternalLink, ChevronRight, Target, Zap, Shield, Layout, MessageSquare, 
  Plane, Box, Truck, FileText, TrendingUp, AlertCircle, Globe, Code, Layers, Info, 
  Landmark, CreditCard, ShieldCheck, ShoppingCart, Cpu, Car, Droplets, ChevronDown, Rocket
} from "lucide-react";

// Feature List
const FEATURES = [
  { id: "financial-analysis", label: "Financial Analysis", icon: <BarChart3 size={18} />, desc: "Deep dive into financials" },
  { id: "peer-benchmarking", label: "Peer Benchmarking", icon: <Users size={18} />, desc: "Competitive comparison" },
  { id: "business-themes", label: "Business Themes", icon: <Lightbulb size={18} />, desc: "Strategic priorities" },
  { id: "technology-themes", label: "Technology Themes", icon: <Cpu size={18} />, desc: "IT & Digital stack" },
  { id: "sustainability-themes", label: "Sustainability Themes", icon: <Droplets size={18} />, desc: "ESG & Green initiatives" },
  { id: "key-buyers", label: "Key Prospective Buyers", icon: <Target size={18} />, desc: "Decision makers" },
  { id: "social-insights", label: "Social Insights", icon: <MessageSquare size={18} />, desc: "Brand & sentiment" },
  { id: "challenges-prospects", label: "Challenges & Growth", icon: <TrendingUp size={18} />, desc: "Risks & opportunities" },
  { id: "industry-trends", label: "Industry Trends", icon: <Globe size={18} />, desc: "Market movements" },
  { id: "sales-play", label: "Sales Play - Opp Mapping", icon: <Zap size={18} />, desc: "Strategic wedges" },
  { id: "account-plan", label: "Account Plan", icon: <FileText size={18} />, desc: "Full strategic roadmap" },
];

export default function App() {
  const [activeFeature, setActiveFeature] = useState("peer-benchmarking");
  const [organization, setOrganization] = useState("Infosys");
  const [targetAccount, setTargetAccount] = useState("HDFC Bank");
  const [focusArea, setFocusArea] = useState("");
  
  const [phase, setPhase] = useState("idle"); 
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);

  const runAnalysis = async () => {
    if (!organization || !targetAccount) return;
    
    setPhase("loading");
    setData(null);
    setLogs([
      { time: new Date().toLocaleTimeString(), msg: `Initializing ${activeFeature} for ${targetAccount}...` },
      { time: new Date().toLocaleTimeString(), msg: `Orchestrating agents with Parallel AI research...` },
    ]);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization,
          targetAccount,
          focusArea,
          feature: activeFeature
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch analysis');
      }

      const result = await response.json();
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `Analysis complete. Synthesizing report...` }]);
      setData(result);
      setPhase("complete");
    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `Error: ${error.message}` }]);
      setPhase("error");
    }
  };

  return (
    <div className="flex min-h-screen bg-deep text-primary">
      {/* Sidebar */}
      <aside className="w-72 bg-surface border-r flex flex-col fixed h-full z-50">
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-white shadow-lg">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Antigravity</h1>
            <p className="text-[10px] text-muted font-bold tracking-[0.15em] uppercase">AI Insights Engine</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {FEATURES.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                activeFeature === feature.id 
                ? "bg-active text-cyan border border-cyan-subtle" 
                : "text-muted hover:bg-accent hover:text-primary"
              }`}
              style={activeFeature === feature.id ? { 
                background: 'linear-gradient(90deg, #00D4FF10 0%, #A855F710 100%)',
                borderColor: '#00D4FF33',
                color: '#00D4FF'
              } : {}}
            >
              <span>{feature.icon}</span>
              <span className="truncate">{feature.label}</span>
              {activeFeature === feature.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t">
          <div className="bg-deep rounded-2xl p-4 border relative overflow-hidden group">
            <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-bold text-primary">System Live</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-8 min-h-screen">
        <div className="max-w-6xl mx-auto mb-10">
          <div className="bg-surface border rounded-3xl p-8 relative overflow-hidden">
             <div className="flex flex-col md:flex-row items-end gap-6 relative z-10">
               <div className="flex-1 w-full space-y-2">
                 <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2">Your Organization</label>
                 <input 
                   value={organization} 
                   onChange={(e) => setOrganization(e.target.value)}
                   className="w-full bg-deep border rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-cyan transition-all"
                   style={{ borderColor: 'var(--border-subtle)' }}
                 />
               </div>
               <div className="flex-1 w-full space-y-2">
                 <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2">Target Account</label>
                 <input 
                   value={targetAccount} 
                   onChange={(e) => setTargetAccount(e.target.value)}
                   className="w-full bg-deep border rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-purple transition-all"
                   style={{ borderColor: 'var(--border-subtle)' }}
                 />
               </div>
               <div className="flex-1 w-full space-y-2">
                 <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2">Focus Area</label>
                 <input 
                   value={focusArea} 
                   onChange={(e) => setFocusArea(e.target.value)}
                   className="w-full bg-deep border rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none transition-all"
                   style={{ borderColor: 'var(--border-subtle)' }}
                   placeholder="Optional"
                 />
               </div>
               <button 
                 onClick={runAnalysis}
                 disabled={phase === "loading"}
                 className={`px-10 py-4 rounded-2xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-3 shadow-xl ${
                   phase === "loading" ? "bg-accent opacity-50 cursor-not-allowed" : "primary-gradient text-white"
                 }`}
               >
                 {phase === "loading" ? <RefreshCcw size={18} className="animate-spin" /> : <Rocket size={18} />}
                 {phase === "loading" ? "Orchestrating..." : "Identify Insights"}
               </button>
             </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {phase === "loading" && (
            <div className="bg-surface border rounded-3xl p-12 text-center space-y-6">
               <Activity size={32} className="text-cyan animate-pulse mx-auto" />
               <h3 className="text-2xl font-black text-white">Researching {targetAccount}...</h3>
               <div className="max-w-md mx-auto space-y-3 text-left">
                 {logs.map((log, i) => (
                   <p key={i} className="font-mono text-xs text-muted">
                     <span className="text-cyan">{log.time}</span> {log.msg}
                   </p>
                 ))}
               </div>
            </div>
          )}

          {phase === "complete" && data && (
            <div className="animate-in fade-in zoom-in">
              {activeFeature === "peer-benchmarking" ? (
                 <PeerBenchmarkingResult data={data} clientName={targetAccount} ownerName={organization} />
              ) : (
                <PlaceholderResult title={FEATURES.find(f => f.id === activeFeature)?.label} data={data} />
              )}
            </div>
          )}

          {phase === "idle" && (
            <div className="bg-surface border rounded-[60px] p-24 text-center space-y-8">
               <div className="w-24 h-24 rounded-[32px] primary-gradient flex items-center justify-center text-white mx-auto shadow-2xl">
                 {FEATURES.find(f => f.id === activeFeature)?.icon}
               </div>
               <h2 className="text-5xl font-black text-white tracking-tighter">
                  Start {FEATURES.find(f => f.id === activeFeature)?.label}
               </h2>
               <p className="text-muted text-lg max-w-xl mx-auto">
                  {FEATURES.find(f => f.id === activeFeature)?.desc}. 
                  Deep research powered by Multi-Agent Parallel AI.
               </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function PlaceholderResult({ title, data }) {
  return (
    <div className="bg-surface border rounded-3xl p-12 text-center">
       <div className="text-4xl mb-4">🔮</div>
       <h2 className="text-3xl font-black text-white mb-4">{title}</h2>
       <p className="text-muted mb-8 italic">"{data.message || 'Analysis in progress...'}"</p>
       <div className="p-8 bg-deep border rounded-2xl inline-block">
          <p className="text-[10px] text-muted uppercase font-bold tracking-widest mb-4">Discovery Engine Active</p>
          <div className="space-y-2 opacity-20">
            <div className="w-64 h-4 bg-accent rounded" />
            <div className="w-48 h-4 bg-accent rounded" />
            <div className="w-56 h-4 bg-accent rounded" />
          </div>
       </div>
    </div>
  );
}

function PeerBenchmarkingResult({ data, clientName, ownerName }) {
  const [tab, setTab] = useState("table");

  return (
    <div className="bg-surface border rounded-[40px] p-12 shadow-2xl animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 pb-12 border-b">
        <div>
          <span className="px-3 py-1 bg-accent text-cyan text-[10px] font-black rounded-full uppercase tracking-wider mb-4 inline-block">Analysis Complete</span>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Benchmark: {clientName}</h2>
          <p className="text-muted italic">Strategic comparison generated for {ownerName}.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-deep p-4 rounded-2xl border text-center min-w-[100px]">
             <p className="text-[10px] font-black text-muted uppercase mb-1">Peers</p>
             <p className="text-xl font-black text-white">{data.peers?.length || 0}</p>
           </div>
           <div className="bg-deep p-4 rounded-2xl border text-center min-w-[100px]">
             <p className="text-[10px] font-black text-muted uppercase mb-1">Confidence</p>
             <p className="text-xl font-black text-success">High</p>
           </div>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        {["table", "capabilities", "opportunities"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === t ? "bg-accent text-cyan border" : "text-muted"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "table" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-4 text-[10px] font-black text-muted uppercase">Dimension</th>
                <th className="py-4 text-cyan text-sm font-black">{clientName}</th>
                {data.peers?.map((p, i) => <th key={i} className="py-4 text-white text-sm font-black">{p.name}</th>)}
              </tr>
            </thead>
            <tbody className="text-xs">
              {["itSpend", "trend", "bizPriority", "itPriority", "strength", "gap"].map((key) => (
                <tr key={key} className="border-b border-[#ffffff05]">
                  <td className="py-4 font-bold text-muted uppercase tracking-tighter">{key.replace(/([A-Z])/g, ' $1')}</td>
                  <td className="py-4 text-white font-bold">{key === 'strength' ? 'Strong' : 'Analysis...'}</td>
                  {data.peers?.map((p, i) => (
                    <td key={i} className="py-4 text-muted">{p[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "capabilities" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.ownerCapabilities?.map((cap, i) => (
            <div key={i} className="bg-deep border rounded-2xl p-6">
              <Activity size={20} className="text-cyan mb-4" />
              <h4 className="font-black text-white text-lg mb-2">{cap}</h4>
              <p className="text-xs text-muted leading-relaxed">Strategic capability mapped to identified market gaps.</p>
            </div>
          ))}
        </div>
      )}

      {tab === "opportunities" && (
        <div className="space-y-4">
           {data.opportunities?.map((opp, i) => (
             <div key={i} className="bg-deep border rounded-2xl p-6 border-l-4" style={{ borderLeftColor: opp.color }}>
                <p className="text-[10px] font-black text-muted uppercase mb-1">{opp.priority} Priority</p>
                <h4 className="font-black text-white text-xl tracking-tight mb-2">{opp.signal}</h4>
                <p className="text-sm text-muted">→ {opp.action}</p>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
