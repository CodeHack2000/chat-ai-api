require('dotenv').config({ path: '@env' });

module.exports = {
    apiKey: process.env.OPENAI_KEY,
    basePrompt: process.env.BASE_PROMPT
};