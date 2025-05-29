import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is stored securely
});

// Interview questions organized by categories
const interviewQuestions = {
  personal: [
    "Could you tell me about your hobbies and interests?",
    "What kind of food do you enjoy? Do you like cooking?",
    "Are you more of a movie person or a book person? What genres do you prefer?",
    "How do you like to spend your free time?",
    "What's your approach to fitness and health?"
  ],
  lifestyle: [
    "Do you prefer traveling by car or bike? What's your ideal weekend getaway?",
    "What's your ideal living situation - city life or suburban?",
    "How do you like to celebrate special occasions?",
    "What's your approach to work-life balance?",
    "How do you handle stress and challenges in life?"
  ],
  values: [
    "What are your thoughts on family values and traditions?",
    "How important is religion and spirituality in your life?",
    "What qualities are you looking for in a life partner?",
    "What are your views on marriage and commitment?",
    "How do you approach decision-making in important life matters?"
  ],
  future: [
    "What are your career goals and aspirations?",
    "What's your approach to financial planning?",
    "Where do you see yourself in the next 5 years?",
    "What are your thoughts on starting a family?",
    "What are your dreams and aspirations for the future?"
  ]
};

// Store conversation context
const conversations = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, sessionId } = req.body;

  // Initialize or get conversation context
  if (!conversations.has(sessionId)) {
    conversations.set(sessionId, {
      currentCategory: 'personal',
      currentQuestionIndex: 0,
      answers: {},
      lastQuestion: interviewQuestions.personal[0],
      categories: Object.keys(interviewQuestions),
      categoryIndex: 0,
      context: [],
      responseAnalysis: null
    });
  }

  const conversation = conversations.get(sessionId);

  try {
    if (!message) {
      // First interaction - send initial question
      return res.status(200).json({ 
        reply: conversation.lastQuestion,
        questionType: 'initial',
        category: conversation.currentCategory
      });
    }

    // Analyze the user's response
    const responseAnalysis = await analyzeResponse(message, conversation.lastQuestion);
    conversation.responseAnalysis = responseAnalysis;

    // If response is unclear or too short, ask for clarification
    if (responseAnalysis.needsClarification) {
      const clarificationQuestion = await generateClarificationQuestion(
        message,
        conversation.lastQuestion,
        responseAnalysis
      );
      
      conversation.context.push({
        role: 'user',
        content: message
      });
      conversation.context.push({
        role: 'assistant',
        content: clarificationQuestion
      });

      return res.status(200).json({
        reply: clarificationQuestion,
        questionType: 'clarification',
        category: conversation.currentCategory,
        analysis: responseAnalysis
      });
    }

    // Store the user's answer and context
    conversation.answers[conversation.currentQuestionIndex] = message;
    conversation.context.push({
      role: 'user',
      content: message
    });

    // Generate a contextual follow-up question using OpenAI
    const followUpQuestion = await generateFollowUpQuestion(conversation);
    
    // Move to next question if available in current category
    if (conversation.currentQuestionIndex < interviewQuestions[conversation.currentCategory].length - 1) {
      conversation.currentQuestionIndex++;
      conversation.lastQuestion = interviewQuestions[conversation.currentCategory][conversation.currentQuestionIndex];
    } else {
      // Move to next category
      conversation.categoryIndex++;
      if (conversation.categoryIndex < conversation.categories.length) {
        conversation.currentCategory = conversation.categories[conversation.categoryIndex];
        conversation.currentQuestionIndex = 0;
        conversation.lastQuestion = interviewQuestions[conversation.currentCategory][0];
      } else {
        // Interview completed
        const summary = await generateProfileSummary(conversation.answers, conversation.context);
        conversations.delete(sessionId); // Clean up the conversation
        
        return res.status(200).json({ 
          reply: "Thank you for completing the interview! Here's a summary of your profile:\n\n" + summary,
          questionType: 'complete',
          profileData: conversation.answers
        });
      }
    }

    // Add follow-up question to context
    conversation.context.push({
      role: 'assistant',
      content: followUpQuestion
    });

    return res.status(200).json({ 
      reply: followUpQuestion,
      questionType: 'followup',
      category: conversation.currentCategory,
      progress: {
        current: conversation.currentQuestionIndex + 1,
        total: interviewQuestions[conversation.currentCategory].length,
        category: conversation.currentCategory
      },
      analysis: responseAnalysis
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to process interview response' });
  }
}

async function analyzeResponse(response, question) {
  try {
    // First check if response is empty or too short
    if (!response || response.trim().length < 10) {
      return {
        needsClarification: true,
        analysis: 'Response is too short or empty',
        responseLength: response ? response.length : 0,
        isRelevant: false,
        clarificationType: 'empty'
      };
    }

    const analysis = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI interviewer analyzing responses. Determine if the response is clear, relevant, and sufficient. Consider length, relevance, and clarity. Be strict in your analysis.'
        },
        {
          role: 'user',
          content: `Question: ${question}\nResponse: ${response}\n\nAnalyze this response and determine if it needs clarification. Consider:\n1. Is it too short or unclear? (less than 2 sentences)\n2. Is it relevant to the question?\n3. Does it provide enough specific information?\n4. What aspects need clarification?\n\nProvide a detailed analysis.`
        }
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const analysisText = analysis.choices[0].message.content.trim();
    
    // More detailed analysis of the response
    const needsClarification = 
      analysisText.toLowerCase().includes('unclear') || 
      analysisText.toLowerCase().includes('short') ||
      analysisText.toLowerCase().includes('insufficient') ||
      analysisText.toLowerCase().includes('vague') ||
      analysisText.toLowerCase().includes('not specific enough');

    const isRelevant = !analysisText.toLowerCase().includes('irrelevant');
    const isSpecific = !analysisText.toLowerCase().includes('not specific') && 
                      !analysisText.toLowerCase().includes('vague');

    return {
      needsClarification,
      analysis: analysisText,
      responseLength: response.length,
      isRelevant,
      isSpecific,
      clarificationType: needsClarification ? 'unclear' : 'clear'
    };
  } catch (error) {
    console.error('Error analyzing response:', error);
    return {
      needsClarification: true,
      analysis: 'Unable to analyze response',
      responseLength: response ? response.length : 0,
      isRelevant: false,
      clarificationType: 'error'
    };
  }
}

async function generateClarificationQuestion(response, originalQuestion, analysis) {
  try {
    let systemPrompt = '';
    
    // Different prompts based on the type of clarification needed
    switch (analysis.clarificationType) {
      case 'empty':
        systemPrompt = 'Generate a gentle prompt to encourage the user to provide a response. Be encouraging and specific about what kind of information you\'re looking for.';
        break;
      case 'unclear':
        systemPrompt = 'Generate a specific follow-up question to clarify the user\'s response. Focus on getting more detailed information about the aspects that were unclear.';
        break;
      default:
        systemPrompt = 'Generate a polite and specific clarification question based on the user\'s response and analysis. Make it conversational and encouraging.';
    }

    const clarification = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Original Question: ${originalQuestion}\nUser's Response: ${response}\nAnalysis: ${analysis.analysis}\n\nGenerate a follow-up question to get more specific information.`
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    return clarification.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating clarification question:', error);
    return "Could you please elaborate on that? I'd like to understand better.";
  }
}

async function generateFollowUpQuestion(conversation) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI interviewer conducting a matrimonial interview. Generate a natural follow-up question based on the user\'s previous answer. Keep the question relevant to the current category and make it conversational.'
        },
        ...conversation.context.slice(-4), // Include last 2 Q&A pairs for context
        {
          role: 'user',
          content: 'Generate a natural follow-up question based on the conversation so far.'
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating follow-up question:', error);
    return conversation.lastQuestion; // Fallback to predefined question
  }
}

async function generateProfileSummary(answers, context) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a matrimonial profile analyzer. Create a comprehensive and engaging summary of the person based on their interview answers. Focus on their personality, values, lifestyle, and future aspirations. Make it sound natural and conversational.'
        },
        ...context,
        {
          role: 'user',
          content: `Please analyze these interview answers and create a detailed profile summary: ${JSON.stringify(answers)}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating profile summary:', error);
    return 'Unable to generate profile summary at this time.';
  }
} 