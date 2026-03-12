const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const synthesizeResearch = async (researchData, templateData) => {
  const { sellingOrg, targetAccount, industry, focusArea, solutionPortfolio } = templateData;
  
  const systemPrompt = `You are a senior B2B sales intelligence analyst. Your task is to synthesize research data into a Peer Benchmarking and Gap Analysis report.
  The goal is to create content for a 2-slide PowerPoint presentation as defined in the master prompt.`;

  const userPrompt = `
  === CONTEXT ===
  Target Account: ${targetAccount}
  Selling Organization: ${sellingOrg}
  Industry: ${industry}
  Focus Area: ${focusArea}
  Solution Portfolio: ${solutionPortfolio}

  === RESEARCH DATA ===
  ${JSON.stringify(researchData, null, 2)}

  === TASK ===
  1. Synthesize the research data into a structured response.
  2. Provide specific content for:
     - Slide 1: Peer Benchmarking Table (Target + 3-5 peers)
     - Slide 2: Gap Analysis & Opportunity Map (connecting gaps to ${sellingOrg}'s solutions)
  
  Ensure all claims have source citations from the research data. 
  
  REQUIRED JSON STRUCTURE:
  {
    "benchmarkingTable": {
      "headers": ["Peer 1", "Peer 2", ...],
      "rows": [
        { "dimension": "ERP Stack", "values": ["Peer 1 data", "Peer 2 data", ...] },
        ...
      ]
    },
    "gapAnalysis": [
      {
        "dimension": "AI Investments",
        "peerState": "...",
        "targetState": "...",
        "severity": "RED" | "AMBER" | "GREEN",
        "solution": {
          "name": "Your Product Name",
          "proofPoint": "Verified case study metric or result"
        }
      },
      ...
    ]
  }
  
  Output ONLY the JSON object.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Claude Synthesis Error:', error);
    throw error;
  }
};

const extractCompetitors = async (rawSearchData, targetAccount) => {
  const systemPrompt = `You are a business intelligence assistant. Extract a clean list of top 10 direct competitors from the provided research data.`;
  const userPrompt = `
  Target Company: ${targetAccount}
  
  RESEARCH DATA:
  ${typeof rawSearchData === 'string' ? rawSearchData : JSON.stringify(rawSearchData)}

  TASK:
  Extract exactly 5-10 direct competitors. 
  For each, provide:
  1. name (official company name)
  2. description (1-sentence relevance)

  OUTPUT FORMAT:
  Return ONLY a JSON array: [{"name": "...", "description": "..."}, ...]`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (error) {
    console.error('Claude Extraction Error:', error);
    return [];
  }
};

module.exports = {
  synthesizeResearch,
  extractCompetitors
};
