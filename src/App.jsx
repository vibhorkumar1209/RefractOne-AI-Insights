import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Building2, 
  Target, 
  Layers, 
  ChevronRight, 
  CheckCircle2, 
  Loader2, 
  Download,
  Plus,
  Trash2,
  AlertCircle,
  Trophy,
  ArrowRight,
  TrendingUp,
  LineChart,
  Globe,
  Users,
  MessageSquare,
  Zap,
  Briefcase,
  PieChart,
  Layout
} from 'lucide-react';
import axios from 'axios';
import pptxgen from 'pptxgenjs';

// --- Sub-components ---

const Sidebar = ({ activeModule }) => {
  const menuItems = [
    { id: 'financial', name: 'Financial Analysis', icon: LineChart },
    { id: 'peers', name: 'Peer Benchmarking', icon: Layers, active: true },
    { id: 'business', name: 'Business Themes', icon: Briefcase },
    { id: 'tech', name: 'Technology Themes', icon: Zap },
    { id: 'sustainability', name: 'Sustainability Themes', icon: Globe },
    { id: 'buyers', name: 'Key Prospective Buyers', icon: Users },
    { id: 'social', name: 'Social Insights', icon: MessageSquare },
    { id: 'challenges', name: 'Growth & Challenges', icon: TrendingUp },
    { id: 'trends', name: 'Industry Trends', icon: PieChart },
    { id: 'sales', name: 'Sales Opportunity Map', icon: Target },
    { id: 'account', name: 'Account Plan', icon: Layout }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <Zap className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 leading-tight">RefractOne</h1>
          <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">AI Strategy Engine</p>
        </div>
      </div>
      
      <div className="sidebar-nav">
        <p className="nav-section-title">Strategic Insights</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id} 
              className={`nav-item ${item.active ? 'active' : 'disabled'}`}
              title={item.active ? '' : 'Coming soon'}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Configuration', icon: Building2 },
    { id: 2, name: 'Selection', icon: Search },
    { id: 3, name: 'Engine', icon: Layers },
    { id: 4, name: 'Report', icon: Trophy }
  ];

  return (
    <div className="step-indicator">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <React.Fragment key={step.id}>
            <div className="step-item">
              <div className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={22} />}
              </div>
              <span className={`step-label ${isActive ? 'active' : ''}`}>{step.name}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-12 h-0.5 mt-[-20px] rounded-full transition-colors duration-500 ${isCompleted ? 'bg-indigo-500' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const SetupForm = ({ data, onChange, onNext }) => {
  const isFormValid = data.sellingOrg && data.targetAccount;

  return (
    <div className="glass-card p-10 max-w-2xl mx-auto fade-in shadow-2xl bg-white border-0">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Project Builder</h2>
        <p className="text-slate-500">Configure your benchmarking mission to begin research</p>
      </div>
      
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="input-group mb-0">
            <label className="input-label">User Organization</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Your company name" 
              value={data.sellingOrg}
              onChange={(e) => onChange('sellingOrg', e.target.value)}
            />
          </div>
          <div className="input-group mb-0">
            <label className="input-label">Target Company</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Account to research" 
              value={data.targetAccount}
              onChange={(e) => onChange('targetAccount', e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Focus Area (Optional)</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="e.g. ESG, Cloud Computing, GenAI" 
            value={data.focusArea}
            onChange={(e) => onChange('focusArea', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Solution Portfolio</label>
          <textarea 
            className="input-field min-h-[100px] resize-none" 
            placeholder="List your products or key solution pillars to be mapped against target gaps..." 
            value={data.solutionPortfolio}
            onChange={(e) => onChange('solutionPortfolio', e.target.value)}
          />
        </div>

        <button 
          className="btn-primary w-full py-5 text-lg font-bold shadow-indigo-200" 
          disabled={!isFormValid}
          onClick={onNext}
        >
          Initialize Discovery Engine <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
};

const PeerSelection = ({ data, onPeersSelected, onBack }) => {
  const [discoveredPeers, setDiscoveredPeers] = useState([]);
  const [selectedPeers, setSelectedPeers] = useState([]);
  const [manualPeer, setManualPeer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCompetitors = async () => {
      try {
        const response = await axios.post('/api/competitors', {
          targetCompany: data.targetAccount
        });
        
        const output = response.data.competitors;
        let peers = [];
        
        if (Array.isArray(output)) {
          // If Claude already returned clean objects
          peers = output.map(p => ({
            name: p.name || p.companyName || p,
            description: p.description || p.relevance || 'Strategic competitor.'
          }));
        } else if (typeof output === 'string') {
          // Fallback parsing
          const lines = output.split('\n').filter(l => l.trim() && l.match(/[a-zA-Z]/));
          peers = lines.map(p => {
            const clean = p.replace(/^[\d\.\-\s*]+/, '').trim();
            const parts = clean.split(/[:\-]/);
            return {
              name: parts[0]?.trim() || clean,
              description: parts.slice(1).join(':').trim() || 'Direct competitor identified via research.'
            };
          }).filter(p => p.name.length > 2);
        }

        setDiscoveredPeers(peers.slice(0, 10));
        setLoading(false);
      } catch (err) {
        console.error('Peer discovery error:', err);
        setError('Discovery engine paused. You can still add peers manually below.');
        setLoading(false);
      }
    };
    getCompetitors();
  }, [data.targetAccount]);

  const togglePeer = (peerName) => {
    if (selectedPeers.includes(peerName)) {
      setSelectedPeers(selectedPeers.filter(p => p !== peerName));
    } else {
      if (selectedPeers.length >= 5) {
        alert("Maximum 5 peers allowed.");
        return;
      }
      setSelectedPeers([...selectedPeers, peerName]);
    }
  };

  const addManualPeer = () => {
    if (manualPeer && !selectedPeers.includes(manualPeer)) {
      if (selectedPeers.length >= 5) {
        alert("Maximum 5 peers allowed.");
        return;
      }
      setSelectedPeers([...selectedPeers, manualPeer]);
      setManualPeer('');
    }
  };

  return (
    <div className="glass-card p-8 max-w-4xl mx-auto fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Select Benchmarking Peers</h2>
        <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-indigo-600 text-white shadow-md">
          {selectedPeers.length} / 5 Selected
        </span>
      </div>

      <div className="mb-8">
        <div className="flex gap-2">
          <input 
            type="text" 
            className="input-field" 
            placeholder="Add competitor manually..." 
            value={manualPeer}
            onChange={(e) => setManualPeer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addManualPeer()}
          />
          <button onClick={addManualPeer} className="btn-primary px-4 bg-primary/10 border border-primary/30 hover:bg-primary/20 text-white">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-indigo-600 font-bold animate-pulse mb-4">
            <Loader2 className="animate-spin" />
            <span>AI Discovery Engine identifying top competitors...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 w-full" />)}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {discoveredPeers.length === 0 && !error && (
            <div className="col-span-full p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <Search className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-500 font-medium">No peers discovered automatically. Add them manually above.</p>
            </div>
          )}
          {discoveredPeers.map((peer, idx) => (
            <div 
              key={idx}
              onClick={() => togglePeer(peer.name)}
              className={`
                p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200
                ${selectedPeers.includes(peer.name) 
                  ? 'bg-indigo-50 border-indigo-600 shadow-lg shadow-indigo-100' 
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-bold transition-colors ${selectedPeers.includes(peer.name) ? 'text-indigo-900' : 'text-slate-800'}`}>
                  {peer.name}
                </h3>
                {selectedPeers.includes(peer.name) && <CheckCircle2 className="text-indigo-600" size={20} />}
              </div>
              <p className={`text-xs leading-relaxed line-clamp-2 ${selectedPeers.includes(peer.name) ? 'text-indigo-700' : 'text-slate-500'}`}>
                {peer.description}
              </p>
            </div>
          ))}
          {selectedPeers.filter(p => !discoveredPeers.some(dp => dp.name === p)).map((peer, idx) => (
            <div 
              key={`manual-${idx}`}
              onClick={() => togglePeer(peer)}
              className="p-5 rounded-2xl border-2 border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-indigo-900">{peer}</h3>
                <CheckCircle2 className="text-indigo-600" size={20} />
              </div>
              <p className="text-xs text-indigo-700">Manually added strategist target</p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 mb-6">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button className="flex-1 py-3 px-6 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors" onClick={onBack}>
          Back
        </button>
        <button 
          className="btn-primary flex-[2] py-4 text-lg" 
          disabled={selectedPeers.length === 0}
          onClick={() => onPeersSelected(selectedPeers)}
        >
          Generate Insights <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

const ResearchPhase = ({ data, onComplete }) => {
  const [status, setStatus] = useState('Researching peers...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!data.peers || data.peers.length === 0) {
      setStatus('Waiting for peer data...');
      return;
    }

    const runProcess = async () => {
      try {
        const researchData = {};
        for (let i = 0; i < data.peers.length; i++) {
          const peer = data.peers[i];
          setStatus(`Analyzing ${peer} strategic posture...`);
          setProgress(Math.round((i / data.peers.length) * 50));
          
          try {
            const res = await axios.post('/api/research/peer', {
              peer,
              targetAccount: data.targetAccount,
              focusArea: data.focusArea
            });
            // Truncate to avoid 413 Payload Too Large
            const resultStr = typeof res.data.result === 'string' 
              ? res.data.result 
              : JSON.stringify(res.data.result);
            researchData[peer] = resultStr.substring(0, 15000); 
          } catch (err) {
            console.error(`Error researching ${peer}:`, err);
            researchData[peer] = "Information not available for this peer.";
          }
        }
        
        setProgress(70);
        setStatus('Synthesizing high-impact benchmarking insights...');
        const synthesisRes = await axios.post('/api/synthesize', {
          researchData,
          templateData: {
            sellingOrg: data.sellingOrg,
            targetAccount: data.targetAccount,
            industry: data.industry,
            focusArea: data.focusArea,
            solutionPortfolio: data.solutionPortfolio || 'Standard portfolio'
          }
        });

        setProgress(100);
        onComplete(synthesisRes.data.synthesis);
      } catch (err) {
        console.error('Process error:', err);
        const errorMsg = err.response?.data?.details || err.response?.data?.error || err.message;
        setStatus(`Error: ${errorMsg}`);
      }
    };
    runProcess();
  }, [data.peers, data.targetAccount]);

  return (
    <div className="glass-card p-12 max-w-2xl mx-auto text-center fade-in">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div 
          className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" 
          style={{ animationDuration: '1.5s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-primary">
          {progress}%
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-white">Generating AI Insights</h2>
      <p className="text-muted text-lg mb-8">{status}</p>
      
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.6)]" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

const ResultsDashboard = ({ report, onRestart, formData }) => {
  if (!report) return null;

  // Ultra-resilient normalization
  const bTable = report.benchmarking_table || report.benchmarkingTable || report.table || {};
  const gAnalysis = report.gap_analysis || report.gapAnalysis || report.gaps || [];
  
  let benchmarkingTable = { headers: [], rows: [] };

  if (Array.isArray(bTable)) {
    // Row-as-object format: [{"category": "..", "peer1": ".."}, ...]
    const firstRow = bTable[0] || {};
    const keys = Object.keys(firstRow);
    const dimKey = keys.find(k => ['category', 'dimension', 'feature', 'metric'].includes(k.toLowerCase())) || keys[0];
    const valKeys = keys.filter(k => k !== dimKey);
    
    benchmarkingTable.headers = valKeys.map(k => k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' '));
    benchmarkingTable.rows = bTable.map(row => ({
      dimension: row[dimKey] || 'Metric',
      values: valKeys.map(k => row[k])
    }));
  } else {
    // Object-with-headers-and-rows format
    benchmarkingTable.headers = bTable.headers || bTable.columns || bTable.head || [];
    benchmarkingTable.rows = (bTable.rows || bTable.data || bTable.body || []).map(row => {
      if (Array.isArray(row)) return { dimension: row[0], values: row.slice(1) };
      return {
        dimension: row.dimension || row.category || row.feature || row.metric || 'Metric',
        values: row.values || row.data || Object.values(row).filter(v => typeof v === 'string' && v !== (row.dimension || row.category || row.feature || row.metric || 'Metric'))
      };
    });
  }

  const gapAnalysis = (Array.isArray(gAnalysis) ? gAnalysis : []).map(item => ({
    dimension: item.dimension || item.category || item.gap || item.title || 'Key Strategic Gap',
    peerState: item.peerState || item.peer_state || item.market_benchmark || item.description || item.value || 'N/A',
    targetState: item.targetState || item.target_state || item.target_status || item.current_state || 'N/A',
    severity: item.severity || item.priority || 'AMBER',
    solution: {
      name: item.solution?.name || item.solution_name || item.recommendation || 'Strategic Solution',
      proofPoint: item.solution?.proofPoint || item.solution?.proof_point || item.proof_point || item.evidence || 'Verified industry capability.'
    }
  }));

  const exportToPPTX = () => {
    let pptx = new pptxgen();
    let slide1 = pptx.addSlide();
    slide1.addText("Peer Benchmarking: " + formData.targetAccount, { x: 0.5, y: 0.5, fontSize: 22, color: "1a1a1a", bold: true });
    
    const headers = ["Dimension", ...(benchmarkingTable.headers || [])];
    const rows = benchmarkingTable.rows?.map(row => [row.dimension, ...row.values]) || [];
    
    slide1.addTable([headers, ...rows], { 
      x: 0.5, y: 1.2, w: 9, 
      fontSize: 9, 
      border: { pt: 0.5, color: "dddddd" },
      fill: { color: "ffffff" }
    });

    let slide2 = pptx.addSlide();
    slide2.addText("Opportunity Map & Solution Fit", { x: 0.5, y: 0.5, fontSize: 22, color: "1a1a1a", bold: true });
    
    const gapHeaders = ["Dimension", "Status", "Solution Fit"];
    const gapRows = gapAnalysis.map(item => [
      item.dimension, 
      item.severity, 
      `${item.solution.name}: ${item.solution.proofPoint}`
    ]);

    slide2.addTable([gapHeaders, ...gapRows], { 
      x: 0.5, y: 1.2, w: 9, 
      fontSize: 9, 
      border: { pt: 0.5, color: "dddddd" },
      fill: { color: "ffffff" }
    });

    pptx.writeFile({ fileName: `RefractOne_${formData.targetAccount}.pptx` });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 gap-6">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-3">
            Strategy Intelligence
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Briefing</h1>
          <p className="text-slate-500 mt-2 text-lg">Benchmark analysis for <span className="text-indigo-600 font-bold">{formData.targetAccount}</span></p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
            onClick={exportToPPTX}
          >
            <Download size={20} /> Export PPTX
          </button>
          <button 
            className="flex-1 md:flex-none px-6 py-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            onClick={onRestart}
          >
            New Brief
          </button>
        </div>
      </div>

      <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Layers size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 border-b-4 border-indigo-100 pb-1">Competitive Landscape</h2>
        </div>
        <div className="overflow-x-auto -mx-8 px-8">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Strategic Dimension</th>
                {benchmarkingTable.headers?.map((header, idx) => (
                  <th key={idx} className="pb-4 px-4 text-xs font-black text-indigo-500 uppercase tracking-widest text-center">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {benchmarkingTable.rows?.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 px-4 font-bold text-slate-800 bg-slate-50/30 rounded-l-xl w-64">{row.dimension}</td>
                  {(Array.isArray(row.values) ? row.values : []).map((val, vIdx) => (
                    <td key={vIdx} className="py-6 px-4 text-sm text-slate-600 leading-relaxed min-w-[220px] text-center">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
            <Target size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 border-b-4 border-rose-100 pb-1">Opportunity Velocity Map</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {gapAnalysis.map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-indigo-100 transition-all flex flex-col gap-6 relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${
                item.severity === 'RED' ? 'bg-rose-500' : item.severity === 'AMBER' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${
                    item.severity === 'RED' ? 'text-rose-600' : item.severity === 'AMBER' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {item.severity} Priority Gap
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 leading-none">{item.dimension}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Market Benchmark</h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{item.peerState}</p>
                </div>
                <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                  <h4 className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Target Status</h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-semibold">{item.targetState}</p>
                </div>
              </div>

              <div className="mt-2 p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl text-white shadow-lg shadow-indigo-200 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="px-2 py-1 bg-white/20 rounded text-[10px] font-bold uppercase">Solution Fit</div>
                </div>
                <h5 className="text-xl font-black mb-2">{item.solution.name}</h5>
                <p className="text-sm text-indigo-100 leading-relaxed">{item.solution.proofPoint}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sellingOrg: '',
    targetAccount: '',
    industry: '',
    focusArea: '',
    solutionPortfolio: '',
    peers: []
  });
  const [reportData, setReportData] = useState(null);

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleRestart = () => {
    setStep(1);
    setReportData(null);
    setFormData({
      sellingOrg: '',
      targetAccount: '',
      industry: '',
      focusArea: '',
      solutionPortfolio: '',
      peers: []
    });
  };

  return (
    <div className="app-container">
      <Sidebar activeModule="peers" />
      
      <main className="main-content">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Peer Benchmarking</h2>
            <p className="text-slate-500 font-medium">Strategic gap analysis vs. market leaders</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Live Environment</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-900">Claude 3.5 Sonnet Connected</span>
            </div>
          </div>
        </header>

        {step < 4 && <StepIndicator currentStep={step} />}

        {step === 1 && (
          <SetupForm 
            data={formData} 
            onChange={updateFormData} 
            onNext={() => setStep(2)} 
          />
        )}

        {step === 2 && (
          <PeerSelection 
            data={formData} 
            onBack={() => setStep(1)}
            onPeersSelected={(peers) => {
              updateFormData('peers', peers);
              setStep(3);
            }} 
          />
        )}

        {step === 3 && (
          <ResearchPhase 
            data={formData} 
            onComplete={(report) => {
              setReportData(report);
              setStep(4);
            }} 
          />
        )}

        {step === 4 && (
          <ResultsDashboard 
            report={reportData} 
            onRestart={handleRestart}
            formData={formData}
          />
        )}

        {/* Footer info */}
        <footer className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026 RefractOne AI Insights. All rights reserved. Precise, source-verified competitive intelligence.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
