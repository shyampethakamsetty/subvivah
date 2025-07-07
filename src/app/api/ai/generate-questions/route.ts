import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { shardAnswers, language } = await request.json();

    // Create a prompt based on the shard answers
    const prompt = `Based on the following user preferences, generate 5-7 personalized questions about marriage, relationships, and partner matching. 
    
User Preferences:
${Object.entries(shardAnswers).map(([key, value]) => `${key}: ${value}`).join('\n')}

Generate questions that are:
1. Relevant to their specific preferences
2. Focused on marriage and relationship compatibility
3. Deep and meaningful for matching
4. In ${language === 'hi' ? 'Hindi' : 'English'} language
5. Include categories like: communication style, future goals, family values, lifestyle compatibility, emotional needs

Format the response as JSON:
{
  "questions": [
    {
      "id": "unique_id",
      "question": "The question text",
      "category": "category_name",
      "importance": "high|medium|low"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert marriage counselor and relationship advisor. Generate thoughtful, personalized questions based on user preferences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let questions;
    try {
      questions = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', response);
      throw new Error('Invalid response format from AI');
    }

    return NextResponse.json({ questions: questions.questions || [] });

  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
} 