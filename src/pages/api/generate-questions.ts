import type { NextApiRequest, NextApiResponse } from 'next';

// Uncomment and install openai if you want to use the real API
// import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { gender, age, education, profession, fullName, family, preferences } = req.body;

  if (!gender || !age || !education || !profession) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Example prompt for OpenAI
  const prompt = `Generate 5 personalized interview questions for a matrimonial AI interview. The user is:
- Name: ${fullName || 'N/A'}
- Gender: ${gender}
- Age: ${age}
- Education: ${education}
- Profession: ${profession}
- Family: ${family || 'N/A'}
- Preferences: ${preferences || 'N/A'}

Questions should be open-ended, friendly, and relevant to the user's background. Return only the questions as a numbered list.`;

  // Uncomment and configure this section for real OpenAI integration
  /*
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant for matrimonial interviews.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    const text = completion.data.choices[0].message?.content || '';
    // Parse questions from the response
    const questions = text.split(/\n\d+\. /).filter(Boolean).map(q => q.replace(/^\d+\.\s*/, ''));
    return res.status(200).json({ questions });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate questions', details: error });
  }
  */

  // For now, return mock questions
  const questions = [
    'What are your long-term goals and how do you see your partner supporting them?',
    'How has your education shaped your outlook on life and relationships?',
    'Can you share a memorable experience from your professional journey?',
    'What family values are most important to you?',
    'What qualities do you value most in a life partner?'
  ];

  return res.status(200).json({ questions });
} 