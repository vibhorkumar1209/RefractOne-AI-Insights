const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function runTests() {
  console.log('🚀 Starting API Smoke Tests...');

  try {
    // 1. Health Check
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health Check passed:', health.data);

    // 2. Peer Selection
    console.log('📡 Testing Competitor Discovery...');
    const competitorsRes = await axios.post(`${API_URL}/competitors`, {
      targetCompany: 'Infosys'
    });
    const comps = competitorsRes.data.competitors;
    console.log('✅ Competitor Discovery passed:', !!comps && comps.length > 0);
    if (comps) console.log('   Sample:', comps[0].name);

    // 3. Synthesis (Critical fallback test)
    console.log('🧪 Testing Research Synthesis Fallback...');
    const synthRes = await axios.post(`${API_URL}/synthesize`, {
      researchData: { "TCS": "Major competitor with strong AI focus.", "Accenture": "Global leader in digital transformation." },
      templateData: {
        sellingOrg: "EdgeVerve",
        targetAccount: "Infosys",
        industry: "IT Services",
        focusArea: "GenAI",
        solutionPortfolio: "AssistEdge, XtractEdge"
      }
    });
    
    const synth = synthRes.data.synthesis;
    console.log('✅ Synthesis passed:', !!synth);
    if (synth) {
      console.log('   Benchmarking Table data present:', !!synth.benchmarkingTable);
      console.log('   Gap Analysis data present:', !!synth.gapAnalysis);
    }

    console.log('\n✨ All smoke tests passed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

runTests();
