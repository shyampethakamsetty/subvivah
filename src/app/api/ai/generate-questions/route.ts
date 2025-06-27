import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userData, language = 'en' } = await req.json();

    const prompt = `You are an expert matchmaker for a matrimonial service. Your job is to ask 3 personalized, open-ended questions that will help you understand the user's values, relationship goals, compatibility factors, and preferences for matchmaking. Do NOT ask generic personality questions. All questions must be strictly relevant to finding a compatible life partner, understanding their expectations from marriage, and what matters most to them in a relationship. Use the user's background to personalize the questions, but always keep the matchmaking context primary.

User Information:
- Name: ${userData.name}
- Age: ${userData.age}
- Gender: ${userData.gender}
- Location: ${userData.location}
- Profession: ${userData.profession}
- Education: ${userData.education}

Generate 3 questions that:
1. Are strictly about matchmaking, compatibility, and relationship values
2. Are personalized to their background
3. Are open-ended and encourage detailed responses
4. Are suitable for a matrimonial context

${language === 'hi' ? 'All questions must be in Hindi.' : 'All questions must be in English.'}

Format the response as a JSON object: { "questions": [ ... ] }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const response = JSON.parse(content);
    const questions = response.questions;

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
} 