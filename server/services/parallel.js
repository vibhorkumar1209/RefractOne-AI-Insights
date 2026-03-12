const axios = require('axios');
require('dotenv').config();

const PARALLEL_API_KEY = process.env.PARALLEL_API_KEY;

const parallelSearch = async (query) => {
  try {
    // Switching to v1/search which uses query and Authorization: Bearer
    // This matches the user's working test_parallel.js
    const response = await axios.post('https://api.parallel.ai/v1/search', {
      query,
      limit: 5
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PARALLEL_API_KEY}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Parallel Search Error:', error.response?.data || error.message);
    // Fallback to v1beta if v1 fails
    try {
      const response = await axios.post('https://api.parallel.ai/v1beta/search', {
        objective: query
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': PARALLEL_API_KEY
        }
      });
      return response.data;
    } catch (betaError) {
      console.error('Secondary Parallel Search Error:', betaError.response?.data || betaError.message);
      throw betaError;
    }
  }
};

const findCompetitors = async (targetCompany) => {
  const query = `List the top 10 direct competitors for ${targetCompany} company. Provide names and brief descriptions.`;
  const result = await parallelSearch(query);
  return result;
};

const researchPeer = async (peerName, targetAccount, focusArea) => {
  const query = `Research and compare ${peerName} vs ${targetAccount} in terms of ${focusArea || 'technology stack, IT spend, and digital transformation strategy'}.`;
  const result = await parallelSearch(query);
  return result;
};

module.exports = {
  findCompetitors,
  researchPeer
};
