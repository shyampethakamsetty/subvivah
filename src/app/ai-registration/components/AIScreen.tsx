'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import SpeakingAvatar, { SpeakingAvatarHandle } from './SpeakingAvatar';

interface AIScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  userData: any;
}

export default function AIScreen({ onNext, onBack, userData }: AIScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const avatarRef = useRef<SpeakingAvatarHandle>(null);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    try {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData }),
      });

      const data = await response.json();
      setQuestions(data.questions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating questions:', error);
      setIsLoading(false);
    }
  };

  // Stop any ongoing speech when moving to next question
  const stopSpeaking = () => {
    avatarRef.current?.stopSpeaking();
  };

  const handleAnswer = (answer: string) => {
    stopSpeaking();
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      onNext({ aiAnswers: newAnswers });
    }
  };

  // Speech-to-text logic
  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAnswers(prev => {
        const updated = [...prev];
        updated[currentQuestion] = transcript;
        return updated;
      });
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Generating personalized questions...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex flex-col items-center">
        <SpeakingAvatar
          ref={avatarRef}
          text={questions[currentQuestion]}
          size="md"
          showStopButton={true}
          onStopSpeaking={stopSpeaking}
        />

        <div className="w-full bg-white rounded-lg shadow-lg p-6 mb-8 mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <p className="text-lg text-gray-700 mb-6 flex items-center gap-2">
            {questions[currentQuestion]}
            <span title="You can speak your answer">
              <svg className="inline w-6 h-6 text-purple-500 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v2m0 0c-3.314 0-6-2.686-6-6h2a4 4 0 008 0h2c0 3.314-2.686 6-6 6zm0 0V4m0 0a4 4 0 00-4 4v4a4 4 0 008 0V8a4 4 0 00-4-4z" />
              </svg>
            </span>
          </p>

          <div className="flex items-center gap-2">
            <textarea
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Type or speak your answer here..."
              value={answers[currentQuestion] || ''}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[currentQuestion] = e.target.value;
                setAnswers(newAnswers);
              }}
            />
            <button
              type="button"
              onClick={handleMicClick}
              className={`p-2 rounded-full border-2 ${isListening ? 'border-purple-600 bg-purple-100' : 'border-gray-300 bg-white'} focus:outline-none`}
              title={isListening ? 'Listening...' : 'Speak your answer'}
            >
              <svg className={`w-6 h-6 ${isListening ? 'text-purple-600 animate-pulse' : 'text-gray-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v2m0 0c-3.314 0-6-2.686-6-6h2a4 4 0 008 0h2c0 3.314-2.686 6-6 6zm0 0V4m0 0a4 4 0 00-4 4v4a4 4 0 008 0V8a4 4 0 00-4-4z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex justify-between w-full">
          <motion.button
            onClick={() => {
              stopSpeaking();
              onBack();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back
          </motion.button>

          <motion.button
            onClick={() => handleAnswer(answers[currentQuestion] || '')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            disabled={!answers[currentQuestion]}
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Continue'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 