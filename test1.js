require('dotenv').config();
const axios = require('axios');

async function testOpenAIAPI() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('Error: OPENAI_API_KEY not found in environment variables');
        return;
    }
    
    console.log('Testing OpenAI API with key:', apiKey ? 'Key exists' : 'No key found');
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'Not found');

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: "Say hello!" }],
                temperature: 0.7,
                max_tokens: 50
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('API Test Successful!');
        console.log('Response:', response.data.choices[0].message.content);
    } catch (error) {
        console.error('API Test Failed!');
        console.error('Error details:', error.response?.data || error.message);
    }
}

testOpenAIAPI();