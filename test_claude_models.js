const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const models = [
  "claude-3-5-sonnet-20241022",
  "claude-3-5-sonnet-20240620",
  "claude-3-7-sonnet-20250219",
  "claude-3-opus-20240229",
  "claude-3-sonnet-20240229",
  "claude-3-haiku-20240307"
];

async function checkModels() {
  for (const model of models) {
    try {
      console.log(`Checking ${model}...`);
      const response = await anthropic.messages.create({
        model,
        max_tokens: 10,
        messages: [{ role: "user", content: "hi" }],
      });
      console.log(`✅ ${model} WORKS!`);
      process.exit(0);
    } catch (error) {
      console.log(`❌ ${model} FAILED: ${error.message}`);
    }
  }
}

checkModels();
