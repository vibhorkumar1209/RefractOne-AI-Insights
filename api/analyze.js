
import { searchParallel, chatParallel } from './lib/parallel.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { organization, targetAccount, focusArea, feature } = req.body;

  if (!organization || !targetAccount) {
    return res.status(400).json({ error: 'Organization and Target Account are required' });
  }

  try {
    if (feature === 'Peer Benchmarking' || feature === 'peer-benchmarking') {
      const data = await performPeerBenchmarking(organization, targetAccount, focusArea);
      return res.status(200).json(data);
    } else {
      // Placeholder for other features
      return res.status(200).json({ 
        message: `${feature} is coming soon. Using simulated data for ${targetAccount}.`,
        isPlaceholder: true,
        client: targetAccount,
        owner: organization
      });
    }
  } catch (error) {
    console.error('Analysis Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function performPeerBenchmarking(organization, targetAccount, focusArea) {
  // 1. Research the target account and find peers
  const searchObjective = `Find the primary industry and top 5 public competitors/peers of ${targetAccount}. Also find ${targetAccount}'s estimated annual IT spend and digital transformation priorities for 2024.`;
  const searchResults = await searchParallel(searchObjective);

  // 2. Use LLM to synthesize the data into the requested format
  const prompt = `
    Conduct a peer benchmarking analysis for a sales team at ${organization} targeting ${targetAccount}.
    ${focusArea ? `The focus area is: ${focusArea}.` : ''}
    
    Research Results:
    ${JSON.stringify(searchResults, null, 2)}
    
    Task:
    1. Identify ${targetAccount}'s top 5 peers.
    2. For each peer and the target account, find/estimate:
       - Est. IT Spend (e.g., $1.2B)
       - IT Spend Trend (↑ Growing, → Stable, ↓ Declining)
       - Top Business Priorities
       - Top IT Priorities
       - Overall Strength (Strong, Moderate, Lagging)
       - Key Gap that ${organization} products can fill.
       - Primary Source
    3. Identify 5 capabilities of ${organization} that are relevant.
    4. Provide 5 priority opportunity signals.

    Return ONLY a JSON object in this exact format:
    {
      "client": "${targetAccount}",
      "owner": "${organization}",
      "peers": [
        { "name": "Peer Name", "itSpend": "$...", "trend": "↑ Growing", "bizPriority": "...", "itPriority": "...", "strength": "Strong", "gap": "...", "source": "..." }
      ],
      "ownerCapabilities": ["Capability 1", "Capability 2", "Capability 3", "Capability 4", "Capability 5"],
      "opportunities": [
        { "signal": "...", "action": "...", "priority": "High", "color": "#EF4444" }
      ]
    }
  `;

  const completion = await chatParallel([
    { role: 'system', content: 'You are a high-end sales intelligence consultant. Provide deep, accurate research data in structured JSON.' },
    { role: 'user', content: prompt }
  ]);

  let content = completion.choices[0].message.content;
  // Clean up markdown code blocks if present
  content = content.replace(/```json/g, '').replace(/```/g, '').trim();
  
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('JSON Parse Error:', content);
    throw new Error('Failed to parse agent synthesis. Raw: ' + content.substring(0, 100));
  }
}
