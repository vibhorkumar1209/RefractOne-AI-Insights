const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.PARALLEL_API_KEY;

async function testSynthesis() {
  console.log('Testing Parallel Synthesis with model: core...');
  try {
    const response = await axios.post('https://api.parallel.ai/v1beta/chat/completions', {
      model: 'core',
      messages: [
        { role: 'user', content: 'Compare Infosys and TCS in one paragraph. Return as JSON: {"comparison": "..."}' }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    });
    console.log('SUCCESS:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('FAILED:', error.response?.status, error.response?.data || error.message);
  }
}

testSynthesis();
