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
    console.warn('Claude Synthesis Error (falling back to Parallel Chat - core):', error.message);
    try {
      const response = await axios.post('https://api.parallel.ai/v1beta/chat/completions', {
        model: 'core',
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
      throw error;
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

  // 1. Try Claude
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.warn('Claude Extraction Error (trying Parallel Chat fallback):', error.message);
  }

  // 2. Try Parallel Chat (Base model for quick list)
  try {
    const response = await axios.post('https://api.parallel.ai/v1beta/chat/completions', {
      model: 'base',
      messages: [
        { role: 'user', content: `Identify the top 5-8 direct competitors for ${targetAccount}. Return ONLY a JSON array of objects with "name" and "description" keys.` }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.PARALLEL_API_KEY
      }
    });
    
    const chatContent = response.data.choices[0].message.content;
    const jsonMatch = chatContent.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (fallbackError) {
    console.warn('Parallel Chat fallback failed:', fallbackError.message);
  }

  // 3. Last resort Knowledge Fallback
  const lowercaseTarget = targetAccount.toLowerCase();
  const manualFallbacks = {
    'infosys': ['TCS', 'Accenture', 'Wipro', 'Cognizant', 'HCLTech'],
    'accenture': ['Infosys', 'TCS', 'Capgemini', 'IBM', 'Deloitte'],
    'tcs': ['Infosys', 'Accenture', 'Wipro', 'HCLTech', 'Cognizant'],
    'apple': ['Samsung', 'Google', 'Microsoft', 'Xiaomi', 'Huawei'],
    'sap': ['Oracle', 'Microsoft', 'Salesforce', 'Workday', 'Infor']
  }[lowercaseTarget] || [];

  if (manualFallbacks.length > 0) {
    return manualFallbacks.map(name => ({ name, description: 'Direct global competitor identified via industry knowledge.' }));
  }

  // 4. Final attempt: Regex on search data if available
  if (rawSearchData) {
    try {
      const text = JSON.stringify(rawSearchData);
      const competitors = [];
      const globalGiants = ['Accenture', 'TCS', 'Wipro', 'Cognizant', 'HCLTech', 'Capgemini', 'IBM', 'Deloitte'];
      
      globalGiants.forEach(giant => {
        if (giant.toLowerCase() !== lowercaseTarget && text.includes(giant)) {
          competitors.push({ name: giant, description: 'Global competitor identified in research results.' });
        }
      });
      if (competitors.length > 0) return competitors;
    } catch (e) {}
  }

  return [];
};

module.exports = {
  synthesizeResearch,
  extractCompetitors
};
