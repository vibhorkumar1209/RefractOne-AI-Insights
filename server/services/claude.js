const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

async function tryClaudeModels(system, user, max_tokens) {
  const models = [
    "claude-3-5-sonnet-20241022",
    "claude-3-5-sonnet-20240620",
    "claude-3-sonnet-20240229",
    "claude-3-opus-20240229",
    "claude-3-haiku-20240307"
  ];

  for (const model of models) {
    try {
      console.log(`Trying Claude model: ${model}`);
      const response = await anthropic.messages.create({
        model: model,
        max_tokens: max_tokens,
        system: system,
        messages: [{ role: "user", content: user }],
      });
      return response.content[0].text;
    } catch (e) {
      console.warn(`Claude ${model} failed:`, e.message);
      if (e.message.includes('credit') || e.message.includes('balance')) throw e;
    }
  }
  throw new Error('All Claude models failed');
}

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
    return await tryClaudeModels(systemPrompt, userPrompt, 4000);
  } catch (error) {
    console.warn('All Claude models failed, falling back to Parallel Chat:', error.message);
    
    const truncatedResearch = {};
    for (const peer in researchData) {
      const data = typeof researchData[peer] === 'string' ? researchData[peer] : JSON.stringify(researchData[peer]);
      truncatedResearch[peer] = data.substring(0, 5000);
    }

    const fallbackUserPrompt = `
      === CONTEXT ===
      Target: ${targetAccount}, Seller: ${sellingOrg}, Focus: ${focusArea}
      === RESEARCH SUMMARY ===
      ${JSON.stringify(truncatedResearch, null, 2)}
      === TASK ===
      Synthesize into Benchmarking Table and Gap Analysis JSON.
    `;

    for (const model of ['base', 'core', 'speed']) {
      try {
        console.log(`Trying synthesis with Parallel model: ${model}`);
        const response = await axios.post('https://api.parallel.ai/v1beta/chat/completions', {
          model: model,
          messages: [
            { role: 'user', content: `${systemPrompt}\n\n${fallbackUserPrompt}` }
          ]
        }, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.PARALLEL_API_KEY
          },
          timeout: 45000
        });
        
        const content = response.data.choices[0].message.content;
        if (content && content.includes('{')) return content;
      } catch (parallelError) {
        console.warn(`Parallel ${model} failed:`, parallelError.message);
      }
    }
    
    throw error;
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
    const text = await tryClaudeModels(systemPrompt, userPrompt, 1500);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.warn('Claude Extraction failed, trying Parallel fallback:', error.message);
  }

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

  return [];
};

module.exports = {
  synthesizeResearch,
  extractCompetitors
};
