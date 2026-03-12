
const API_KEY = 'vsrwVARNxzuiI_k7C-4kW8PWRfaSyc_DRXz8dn5f';

async function testParallel() {
  try {
    const response = await fetch('https://api.parallel.ai/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        query: 'Apple Inc financial performance 2024',
        limit: 3
      })
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testParallel();
