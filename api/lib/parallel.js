
const API_KEY = process.env.PARALLEL_API_KEY || 'vsrwVARNxzuiI_k7C-4kW8PWRfaSyc_DRXz8dn5f';
const BASE_URL = 'https://api.parallel.ai';

export async function searchParallel(objective) {
  const response = await fetch(`${BASE_URL}/v1beta/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({ objective })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Parallel API Search Error');
  }
  
  return await response.json();
}

export async function chatParallel(messages, model = 'parallel-research') {
  const response = await fetch(`${BASE_URL}/v1beta/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({
      model,
      messages
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Parallel API Chat Error');
  }
  
  return await response.json();
}

export async function runTask(input, processor = 'core') {
  const response = await fetch(`${BASE_URL}/v1/tasks/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({ input, processor })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Parallel API Task Error');
  }
  
  const { run_id } = await response.json();
  return run_id;
}

export async function getTaskResult(runId, timeoutMs = 30000) {
  const response = await fetch(`${BASE_URL}/v1/tasks/runs/${runId}/result`, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Parallel API Task Result Error');
  }
  
  return await response.json();
}
