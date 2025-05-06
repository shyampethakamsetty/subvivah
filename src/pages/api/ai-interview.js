import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is stored securely
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003', // Choose the appropriate model
      prompt: message,
      max_tokens: 150,
    });

    const aiReply = response.data.choices[0].text.trim();
    res.status(200).json({ reply: aiReply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
} 