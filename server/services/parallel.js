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

const findCompetitors = async (targetCompany) => {
  const objective = `Find the 10 most relevant direct competitors for ${targetCompany}. For each competitor, provide their name and a one-sentence explanation of why they are a competitor. Format the output as a clean list.`;
  const result = await parallelSearch(objective);
  // Based on Parallel research, the result structure might contain 'output' or 'answer'
  return result.output || result.answer || result;
};

const researchPeer = async (peerName, targetAccount, focusArea) => {
  const objective = `Deep dive research on ${peerName} specifically comparing them to ${targetAccount}. Focus on these areas: ${focusArea || 'general technology stack and business priorities'}. 
  Dimensions to extract:
  1. ERP & Core IT Stack
  2. Digital Commerce capabilities
  3. AI / ML initiatives
  4. Estimated IT Spend signals
  5. Current business priorities.
  Provide brief, high-impact bullet points for each.`;
  
  const result = await parallelSearch(objective);
  return result.output || result.answer || result;
};

module.exports = {
  findCompetitors,
  researchPeer
};
