const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function runTests() {
  console.log('🚀 Starting API Smoke Tests...');

  try {
    // 1. Health Check
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health Check passed:', health.data);

    // 2. Peer Selection (Simulated)
    // Note: This calls Parallel.AI, so it might take time.
    console.log('📡 Testing Competitor Discovery...');
    const competitors = await axios.post(`${API_URL}/competitors`, {
      targetCompany: 'Infosys',
      industry: 'IT Services'
    });
    console.log('✅ Competitor Discovery passed:', !!competitors.data.competitors);

    console.log('\n✨ All smoke tests passed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Only run if the server is expected to be up
runTests();
