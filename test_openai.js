require('dotenv').config();
const { OpenAI } = require('openai');

async function testOpenAIKey() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log('Testing OpenAI API connection...');
    
    // Make a simple test request
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello, this is a test message." }],
      max_tokens: 10
    });

    console.log('✅ API Key is valid! Test response received.');
    console.log('Response preview:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ Error testing OpenAI API key:', error.message);
  }
}

testOpenAIKey(); 