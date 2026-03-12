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
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import pptxgen from 'pptxgenjs';

// --- Sub-components ---

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Setup', icon: Building2 },
    { id: 2, name: 'Peers', icon: Search },
    { id: 3, name: 'Research', icon: Layers },
    { id: 4, name: 'Insights', icon: Trophy }
  ];

  return (
    <div className="flex items-center justify-center space-x-4 mb-12">
      {steps.map((step) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex items-center">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full border-2 
              transition-all duration-500
              ${isActive ? 'border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.4)]' : ''}
              ${isCompleted ? 'bg-primary border-primary text-white' : 'border-border text-muted'}
              ${!isActive && !isCompleted ? 'bg-transparent text-muted' : ''}
            `}>
              {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
            </div>
            {step.id < steps.length && (
              <div className={`w-8 h-0.5 mx-2 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const SetupForm = ({ data, onChange, onNext }) => {
  const isFormValid = data.sellingOrg && data.targetAccount && data.industry;

  return (
    <div className="glass-card p-8 max-w-2xl mx-auto fade-in">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Project Configuration</h2>
      <div className="space-y-6">
        <div className="input-group">
          <label className="input-label">User Organization (Selling Side)</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="e.g. EdgeVerve, Salesforce" 
            value={data.sellingOrg}
            onChange={(e) => onChange('sellingOrg', e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">Target Account (Client Side)</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="e.g. Incora, Maersk" 
            value={data.targetAccount}
            onChange={(e) => onChange('targetAccount', e.target.value)}
          />
        </div>
        <div className="grid-cols-2">
          <div className="input-group">
            <label className="input-label">Industry Context</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Aerospace Supply Chain" 
              value={data.industry}
              onChange={(e) => onChange('industry', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Focus Area (Optional)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Sustainability, AI" 
              value={data.focusArea}
              onChange={(e) => onChange('focusArea', e.target.value)}
            />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Solution Portfolio (Your products to map)</label>
          <textarea 
            className="input-field" 
            rows="2"
            placeholder="e.g. AI Next, AssistEdge RPA, TradeEdge" 
            value={data.solutionPortfolio}
            onChange={(e) => onChange('solutionPortfolio', e.target.value)}
          />
        </div>
        <button 
          className="btn-primary w-full py-4 text-lg" 
          disabled={!isFormValid}
          onClick={onNext}
        >
          Identify Competitors <ArrowRight size={20} />
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
          targetCompany: data.targetAccount,
          industry: data.industry
        });
        
        // Handle Parallel.AI response format
        const output = response.data.competitors;
        let peers = [];
        if (typeof output === 'string') {
          // Simple parsing if AI returned a list string
          peers = output.split('\n').filter(p => p.trim()).map(p => ({ 
            name: p.replace(/^\d+\.\s*/, '').replace(/^- \s*/, '').split(':')[0].trim(),
            description: p.includes(':') ? p.split(':')[1].trim() : ''
          }));
        } else if (Array.isArray(output)) {
          peers = output;
        }

        setDiscoveredPeers(peers.slice(0, 10));
        setLoading(false);
      } catch (err) {
        console.error('Peer discovery error:', err);
        setError('Failed to discover competitors automatically.');
        setLoading(false);
      }
    };
    getCompetitors();
  }, [data.targetAccount, data.industry]);

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
        <h2 className="text-2xl font-bold text-white">Select Benchmarking Peers</h2>
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {discoveredPeers.map((peer, idx) => (
            <div 
              key={idx}
              onClick={() => togglePeer(peer.name)}
              className={`
                p-4 rounded-xl border cursor-pointer transition-all duration-200
                ${selectedPeers.includes(peer.name) 
                  ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'}
              `}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-white">{peer.name}</h3>
                {selectedPeers.includes(peer.name) && <CheckCircle2 className="text-primary" size={18} />}
              </div>
              <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">{peer.description}</p>
            </div>
          ))}
          {selectedPeers.filter(p => !discoveredPeers.some(dp => dp.name === p)).map((peer, idx) => (
            <div 
              key={`manual-${idx}`}
              onClick={() => togglePeer(peer)}
              className="p-4 rounded-xl border border-primary bg-primary/20 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-white">{peer}</h3>
                <CheckCircle2 className="text-primary" size={18} />
              </div>
              <p className="text-xs text-muted mt-1">Manually added competitor</p>
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
    const runProcess = async () => {
      try {
        // Step 1: Research Peers Individually (to avoid Vercel timeouts)
        const researchData = {};
        for (let i = 0; i < data.peers.length; i++) {
          const peer = data.peers[i];
          setStatus(`Researching ${peer}...`);
          setProgress(Math.round((i / data.peers.length) * 50));
          
          try {
            const res = await axios.post('/api/research/peer', {
              peer,
              targetAccount: data.targetAccount,
              industry: data.industry,
              focusArea: data.focusArea
            });
            researchData[peer] = res.data.result;
          } catch (err) {
            console.error(`Error researching ${peer}:`, err);
            researchData[peer] = "Information not available for this peer.";
          }
        }
        
        // Step 2: Synthesis
        setProgress(70);
        setStatus('Synthesizing research with Claude AI...');
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
        setStatus('An error occurred during research/synthesis.');
      }
    };
    runProcess();
  }, []);

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

  const benchmarkingTable = report.benchmarkingTable || [];
  const gapAnalysis = report.gapAnalysis || [];

  const exportToPPTX = () => {
    let pptx = new pptxgen();
    
    // Slide 1: Peer Benchmarking
    let slide1 = pptx.addSlide();
    slide1.addText("Peer Benchmarking Table", { x: 0.5, y: 0.5, fontSize: 24, color: "003366", bold: true });
    
    const headers = ["Dimension", ...(benchmarkingTable.headers || [])];
    const rows = benchmarkingTable.rows?.map(row => [row.dimension, ...row.values]) || [];
    
    slide1.addTable([headers, ...rows], { 
      x: 0.5, y: 1.2, w: 9, 
      fontSize: 8, 
      border: { pt: 1, color: "CCCCCC" },
      fill: { color: "F8FAFC" },
      autoPage: true
    });

    // Slide 2: Gap Analysis
    let slide2 = pptx.addSlide();
    slide2.addText("Gap Analysis & Opportunity Map", { x: 0.5, y: 0.5, fontSize: 24, color: "003366", bold: true });
    
    const gapHeaders = ["Dimension", "Peers Position", "Target Position", "Status", "Solution Fit"];
    const gapRows = gapAnalysis.map(item => [
      item.dimension, 
      item.peerState, 
      item.targetState, 
      item.severity, 
      `${item.solution.name}: ${item.solution.proofPoint}`
    ]);

    slide2.addTable([gapHeaders, ...gapRows], { 
      x: 0.5, y: 1.2, w: 9, 
      fontSize: 8, 
      border: { pt: 1, color: "CCCCCC" },
      fill: { color: "F8FAFC" }
    });

    pptx.writeFile({ fileName: `RefractOne_Insights_${formData.targetAccount}.pptx` });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 fade-in">
      <div className="flex justify-between items-center bg-white/5 border border-white/10 p-6 rounded-2xl">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Strategic Insights Dashboard</h1>
          <p className="text-muted mt-1">Actionable intelligence for account planning and pursuing</p>
        </div>
        <div className="flex gap-4">
          <button 
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold hover:bg-green-500/20 transition-all"
            onClick={exportToPPTX}
          >
            <Download size={20} /> Export PPTX
          </button>
          <button 
            className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors"
            onClick={onRestart}
          >
            New Project
          </button>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <Layers className="text-primary" />
          <h2 className="text-2xl font-bold text-white">Peer Benchmarking</h2>
        </div>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 text-sm font-bold text-muted uppercase tracking-wider">Dimension</th>
                  {benchmarkingTable.headers?.map((header, idx) => (
                    <th key={idx} className="p-4 text-sm font-bold text-white uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {benchmarkingTable.rows?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-primary/90">{row.dimension}</td>
                    {row.values.map((val, vIdx) => (
                      <td key={vIdx} className="p-4 text-sm text-slate-300 leading-relaxed min-w-[200px]">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <Target className="text-primary" />
          <h2 className="text-2xl font-bold text-white">Gap Analysis & Opportunity Map</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {gapAnalysis.map((item, idx) => (
            <div key={idx} className="glass-card p-6 flex flex-col md:flex-row gap-6 hover:border-primary/30 transition-all group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`
                    w-3 h-3 rounded-full shadow-[0_0_8px]
                    ${item.severity === 'RED' ? 'bg-red-500 shadow-red-500/50' : ''}
                    ${item.severity === 'AMBER' ? 'bg-amber-500 shadow-amber-500/50' : ''}
                    ${item.severity === 'GREEN' ? 'bg-green-500 shadow-green-500/50' : ''}
                  `} />
                  <h3 className="text-xl font-bold text-white">{item.dimension}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                  <div>
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Peers' Position</h4>
                    <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{item.peerState}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Target Position</h4>
                    <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{item.targetState}</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 bg-primary/10 border-l border-primary/20 p-6 rounded-r-xl group-hover:bg-primary/15 transition-all">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Solution Fit</h4>
                <div className="p-4 bg-primary/20 rounded-xl border border-primary/30">
                  <p className="font-bold text-white mb-1">{item.solution.name}</p>
                  <p className="text-xs text-slate-300 leading-relaxed italic">{item.solution.proofPoint}</p>
                </div>
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
    <div className="min-h-screen p-6 md:p-12 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Layers className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              RefractOne
            </h1>
            <p className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase">AI Sales Insights</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-xs font-medium text-white/40 uppercase tracking-widest">Powered by Parallel.AI & Claude 3.5</span>
          <div className="w-px h-4 bg-white/10" />
          <div className="text-xs font-bold px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70">
            Vercel Managed
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
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
      </main>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />
    </div>
  );
};

export default App;
