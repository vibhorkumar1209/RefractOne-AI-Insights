const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
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
      model: "claude-3-5-sonnet-latest",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    return response.content[0].text;
  } catch (error) {
    console.warn('Claude Synthesis Error (falling back to Parallel Chat):', error.message);
    try {
      const response = await axios.post('https://api.parallel.ai/v1beta/chat/completions', {
        model: 'parallel-research',
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.PARALLEL_API_KEY
        }
      });
      return response.data.choices[0].message.content;
    } catch (parallelError) {
      console.error('Total Synthesis Failure:', parallelError.message);
      throw error; // throw original claude error if fallback also fails
    }
  }
};

const extractCompetitors = async (rawSearchData, targetAccount) => {
  const systemPrompt = `You are a high-end business strategy consultant. Your task is to extract or identify the top 5-10 direct competitors for a company.`;
  const userPrompt = `
  Target Company: ${targetAccount}
  
  RESEARCH DATA (if any):
  ${JSON.stringify(rawSearchData)}

  INSTRUCTION:
  Based on the research data above AND your own extensive knowledge of the global market:
  1. Identify the top 5-8 direct competitors for ${targetAccount}.
  2. For each, provide a precise 1-sentence strategic explanation of why they are the primary peer.
  
  CRITICAL: If the provided RESEARCH DATA is empty, null, or contains errors, YOU MUST STILL provide a list of competitors based on your internal training data. NEVER return an empty list if you recognize the target company.

  OUTPUT FORMAT:
  Return ONLY a valid JSON array of objects. No intro/outro.
  Example: [{"name": "Company A", "description": "Primary competitor in cloud services..."}, ...]`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('Claude failed to return JSON list of competitors.');
      return [];
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.warn('Claude Extraction Error (trying Regex fallback):', error.message);
    
    // Last resort: Try to parse whatever we have in rawSearchData using regex
    try {
      const text = typeof rawSearchData === 'string' ? rawSearchData : (rawSearchData?.answer || JSON.stringify(rawSearchData));
      const competitors = [];
      
      // Look for numbered lists or lines with company names
      const lines = text.split('\n');
      for (const line of lines) {
        const match = line.match(/^[\d\.\-\s*]*([A-Z][A-Za-z0-9\s&,]+)[:\-](.*)/) || line.match(/^[\d\.\-\s*]+([A-Z][A-Za-z0-9\s&,]+)$/);
        if (match && competitors.length < 8) {
          const name = match[1].trim();
          if (name.length > 2 && !['Company', 'Target', 'Competitor'].includes(name)) {
            competitors.push({
              name,
              description: match[2]?.trim() || 'Key strategic competitor identified.'
            });
          }
        }
      }
      
      if (competitors.length > 0) return competitors;
    } catch (regexError) {
      console.error('Regex Fallback Failure:', regexError);
    }
    
    return [];
  }
};

module.exports = {
  synthesizeResearch,
  extractCompetitors
};
