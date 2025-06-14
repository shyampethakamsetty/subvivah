import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { basics, aiAnswers, preferences } = await req.json();

    const prompt = `Create a compelling and personalized profile summary based on the following information:

Basic Information:
- Name: ${basics.name}
- Age: ${basics.age}
- Gender: ${basics.gender}
- Location: ${basics.location}
- Profession: ${basics.profession}
- Education: ${basics.education}

Detailed Answers:
${aiAnswers.map((answer: string, index: number) => `Answer ${index + 1}: ${answer}`).join('\n')}

Preferences:
${Object.entries(preferences).map(([cardId, choice]) => `Card ${parseInt(cardId) + 1}: ${choice}`).join('\n')}

Generate a concise, engaging profile summary that:
1. Highlights their unique personality traits and values
2. Incorporates their preferences and choices
3. Maintains a professional yet personal tone
4. Is suitable for a matrimonial context
5. Is between 150-200 words

Format the response as a JSON object with a "summary" string.`;

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
    const summary = response.summary;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
} 