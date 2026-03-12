
const API_KEY = 'vsrwVARNxzuiI_k7C-4kW8PWRfaSyc_DRXz8dn5f';

async function testParallel() {
  try {
    const response = await fetch('https://api.parallel.ai/v1beta/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        objective: 'Top 3 competitors of Infosys Ltd 2024'
      })
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testParallel();
