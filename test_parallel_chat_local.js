const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.PARALLEL_API_KEY;

async function testParallelChat() {
  try {
    const response = await axios.post('https://api.parallel.ai/v1beta/chat/completions', {
      model: 'parallel-research',
      messages: [{ role: 'user', content: 'Say hello' }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    });
    console.log('SUCCESS:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('FAILED:', error.response?.data || error.message);
  }
}

testParallelChat();
