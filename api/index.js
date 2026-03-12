const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { findCompetitors, researchPeer } = require('./services/parallel');
const { synthesizeResearch, extractCompetitors } = require('./services/claude');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 1. Find Competitors
app.post('/api/competitors', async (req, res) => {
  const { targetCompany } = req.body;
  if (!targetCompany) {
    return res.status(400).json({ error: 'Target company is required.' });
  }

  try {
    let rawCompetitors = null;
    try {
      rawCompetitors = await findCompetitors(targetCompany);
    } catch (e) {
      console.warn('Initial search for competitors failed, falling back to AI knowledge:', e.message);
    }
    
    const cleanCompetitors = await extractCompetitors(rawCompetitors, targetCompany);
    res.json({ competitors: cleanCompetitors });
  } catch (error) {
    console.error('Total failure in competitor discovery:', error);
    res.status(500).json({ error: 'Failed to discover competitors.', details: error.message });
  }
});

// 2. Research Single Peer
app.post('/api/research/peer', async (req, res) => {
  const { peer, targetAccount, focusArea } = req.body;
  if (!peer || !targetAccount) {
    return res.status(400).json({ error: 'Missing required parameters for research.' });
  }

  try {
    const result = await researchPeer(peer, targetAccount, focusArea);
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

module.exports = app;
