const axios = require('axios');
require('dotenv').config();

const PARALLEL_API_KEY = process.env.PARALLEL_API_KEY;

const parallelSearch = async (objective) => {
  try {
    console.log(`Searching Parallel with objective: ${objective}`);
    const response = await axios.post('https://api.parallel.ai/v1beta/search', {
      objective
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': PARALLEL_API_KEY
      }
    });

    // Check if the response actually contains results
    if (response.data && (response.data.output || response.data.answer || response.data.results)) {
      return response.data;
    }
    
    console.warn('Parallel search returned empty or invalid data structure:', response.data);
    return response.data;
  } catch (error) {
    console.error('Parallel Search Error:', error.response?.data || error.message);
    throw error;
  }
};

const findCompetitors = async (targetCompany) => {
  const objective = `Research and identify the top 10 direct competitors for ${targetCompany}. For each competitor, provide their name and a one-sentence explanation of why they are a competitor.`;
  return await parallelSearch(objective);
};

const researchPeer = async (peerName, targetAccount, focusArea) => {
  const objective = `Research and analyze ${peerName} in the context of their competition with ${targetAccount}. Focus on: ${focusArea || 'market position, core technology, and strategic priorities'}.`;
  return await parallelSearch(objective);
};

module.exports = {
  findCompetitors,
  researchPeer
};
