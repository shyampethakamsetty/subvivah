import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { gender, age, education, profession, fullName, family, preferences } = body;

  // Do not block if fields are missing; just proceed with whatever data is present

  const prompt = `Generate 5 personalized interview questions for a matrimonial AI interview. The user is:
- Name: ${fullName || 'N/A'}
- Gender: ${gender || 'N/A'}
- Age: ${age || 'N/A'}
- Education: ${education || 'N/A'}
- Profession: ${profession || 'N/A'}
- Family: ${family || 'N/A'}
- Preferences: ${preferences || 'N/A'}

Questions should be open-ended, friendly, and relevant to the user's background. Return only the questions as a numbered list.`;

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OpenAI API key');
    }
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant for matrimonial interviews.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    // Parse questions from the response
    const questions = text
      .split(/\n\d+\. /)
      .filter(Boolean)
      .map((q: string) => q.replace(/^\d+\.\s*/, ''));
    if (questions.length > 0) {
      return NextResponse.json({ questions });
    }
  } catch (error) {
    // If OpenAI fails, fall back to mock questions
  }

  const questions = [
    'What are your long-term goals and how do you see your partner supporting them?',
    'How has your education shaped your outlook on life and relationships?',
    'Can you share a memorable experience from your professional journey?',
    'What family values are most important to you?',
    'What qualities do you value most in a life partner?'
  ];

  return NextResponse.json({ questions });
} 