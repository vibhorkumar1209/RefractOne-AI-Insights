const axios = require('axios');
require('dotenv').config();

const PARALLEL_API_KEY = process.env.PARALLEL_API_KEY;

const parallelSearch = async (objective) => {
  try {
    const response = await axios.post('https://api.parallel.ai/v1beta/search', {
      objective
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': PARALLEL_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Parallel Search Error:', error.response?.data || error.message);
    throw error;
  }
};

const findCompetitors = async (targetCompany, industry) => {
  const objective = `Identify 5-10 direct competitors for ${targetCompany} in the ${industry} industry. For each competitor, provide their name and a brief 1-sentence description of their relevance.`;
  const result = await parallelSearch(objective);
  // Based on Parallel research, the result structure might contain 'output' or 'answer'
  return result.output || result.answer || result;
};

const researchPeer = async (peerName, targetAccount, industry, focusArea) => {
  const objective = `Research ${peerName} vs ${targetAccount} in ${industry}. Focus area: ${focusArea}. 
  Dimensions:
  - ERP & Core IT Stack
  - Digital Commerce & Customer Platform
  - AI / ML & Automation Investments
  - Estimated Annual IT Spend
  - Stated IT Priority / Focus Area
  Provide brief, specific details for each dimension. Max 100 words per peer.`;
  
  const result = await parallelSearch(objective);
  return result.output || result.answer || result;
};

module.exports = {
  findCompetitors,
  researchPeer
};
