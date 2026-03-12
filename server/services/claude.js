const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

async function tryClaudeModels(system, user, max_tokens) {
  // Use Sonnet 4.6 as primary, with a reasonable timeout
  try {
    console.log(`[AI] Calling Claude: claude-sonnet-4-6`);
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: max_tokens,
      system: system,
      messages: [{ role: "user", content: user }],
    }, { timeout: 20000 }); // 20s for Claude
    return response.content[0].text;
  } catch (e) {
    console.warn(`[AI] Claude primary failed:`, e.message);
    if (e.message.toLowerCase().includes('credit') || e.message.toLowerCase().includes('balance')) throw e;
    throw e;
  }
}

const synthesizeResearch = async (researchData, templateData) => {
  const { sellingOrg, targetAccount, focusArea } = templateData;
  console.log(`[AI] Synthesizing for ${targetAccount}`);

  const sysPrompt = "B2B Sales Analyst. Synthesize research into Peer Benchmarking JSON.";
  
  // Drastic data reduction for synthesis
  const summary = {};
  for (const peer in researchData) {
    summary[peer] = String(researchData[peer]).substring(0, 5000);
  }

  const userPrompt = `
  Target: ${targetAccount} | Seller: ${sellingOrg} | Focus: ${focusArea}
  Research: ${JSON.stringify(summary)}
  JSON Structure: { benchmarkingTable: { headers: [], rows: [{ dimension, values: [] }] }, gapAnalysis: [{ dimension, peerState, targetState, severity, solution: { name, proofPoint } }] }
  Return JSON ONLY.`;

  try {
    return await tryClaudeModels(sysPrompt, userPrompt, 3000);
  } catch (error) {
    console.warn('[AI] Claude failed, using Parallel Core fallback');
    
    try {
      const response = await axios.post('https://api.parallel.ai/v1beta/chat/completions', {
        model: 'core',
        messages: [{ role: 'user', content: `${sysPrompt}\n\n${userPrompt}` }]
      }, {
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.PARALLEL_API_KEY },
        timeout: 25000 // 25s for Parallel
      });
      
      const content = response.data.choices[0].message.content;
      if (content && content.includes('{')) return content;
    } catch (perr) {
      console.error('[AI] Fallback failed:', perr.message);
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
