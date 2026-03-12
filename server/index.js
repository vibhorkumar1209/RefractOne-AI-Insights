const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { findCompetitors, researchPeer } = require('./services/parallel');
const { synthesizeResearch } = require('./services/claude');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. Find Competitors
app.post('/api/competitors', async (req, res) => {
  const { targetCompany, industry } = req.body;
  if (!targetCompany || !industry) {
    return res.status(400).json({ error: 'Target company and industry are required.' });
  }

  try {
    const competitors = await findCompetitors(targetCompany, industry);
    res.json({ competitors });
  } catch (error) {
    console.error('Competitor discovery error:', error);
    res.status(500).json({ error: 'Failed to find competitors.', details: error.message });
  }
});

// 2. Research Single Peer (Granular for Vercel Hobby limits)
app.post('/api/research/peer', async (req, res) => {
  const { peer, targetAccount, industry, focusArea } = req.body;
  if (!peer || !targetAccount || !industry) {
    return res.status(400).json({ error: 'Missing required parameters for research.' });
  }

  try {
    const result = await researchPeer(peer, targetAccount, industry, focusArea);
    res.json({ peer, result });
  } catch (error) {
    console.error(`Research error for ${peer}:`, error);
    res.status(500).json({ error: `Research failed for ${peer}.`, details: error.message });
  }
});

// 3. Synthesize Results
app.post('/api/synthesize', async (req, res) => {
  const { researchData, templateData } = req.body;
  if (!researchData || !templateData) {
    return res.status(400).json({ error: 'Research data and template data are required.' });
  }

  try {
    const rawSynthesis = await synthesizeResearch(researchData, templateData);
    let synthesis = rawSynthesis;
    
    // Attempt to extract JSON from Claude response
    try {
      const jsonMatch = rawSynthesis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        synthesis = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('Failed to parse Claude output as JSON.');
    }
    
    res.json({ synthesis });
  } catch (error) {
    console.error('Synthesis error:', error);
    res.status(500).json({ error: 'Synthesis failed.', details: error.message });
  }
});

// Note: In Vercel, we might need to handle the whole app as a single function or separate ones.
// For locall testing and portable REST API:
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
