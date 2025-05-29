require('dotenv').config();

async function testOpenAI() {
    try {
        console.log('Testing API connection...');
        console.log('Using API Key:', process.env.OPENAI_API_KEY.substring(0, 10) + '...');

        // Try using the project-specific endpoint with a different base URL
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'OpenAI-Project': process.env.OPENAI_API_KEY.split('-')[2], // Extract project ID
                'OpenAI-Organization': 'org-...' // Add if you have an organization ID
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: "Hello, this is a test message."
                    }
                ],
                temperature: 0.7,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Response status:', response.status);
            console.error('Response headers:', response.headers);
            throw new Error(JSON.stringify(errorData, null, 2));
        }

        const data = await response.json();
        console.log('API Key Test Successful!');
        console.log('Response:', data.choices[0].message.content);
    } catch (error) {
        console.error('API Key Test Failed!');
        console.error('Error:', error.message);
        console.error('Full error:', error);
    }
}

testOpenAI(); 