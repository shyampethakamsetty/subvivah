'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaVolumeUp } from 'react-icons/fa';
import SpeakingAvatar from './SpeakingAvatar';

interface PersonalizedQuestionsScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData: {
    shardAnswers: Record<string, string>;
  };
}

interface GeneratedQuestion {
  id: string;
  question: string;
  category: string;
  importance: 'high' | 'medium' | 'low';
}

export default function PersonalizedQuestionsScreen({ onNext, onBack, initialData }: PersonalizedQuestionsScreenProps) {
  const { language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [currentWordIdx, setCurrentWordIdx] = useState(-1);
  const questionWords = questions[currentQuestionIndex]?.question.split(/\s+/);

  useEffect(() => {
    // Initialize audio
    const audioElement = new Audio('/selection_beep.mp3');
    setAudio(audioElement);
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentAnswer(transcript);
        setIsRecording(false);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
    
    generateQuestions();
  }, [language]);

  const generateQuestions = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shardAnswers: initialData.shardAnswers,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setLoading(false);
    } catch (err) {
      console.error('Error generating questions:', err);
      setError('Failed to generate personalized questions. Please try again.');
      setLoading(false);
    } finally {
      setGenerating(false);
    }
  };

  const handleVoiceInput = () => {
    if (recognition && !isRecording) {
      setIsRecording(true);
      recognition.start();
    }
  };

  const handleSubmitAnswer = () => {
    if (currentAnswer.trim()) {
      const newAnswers = { ...answers, [questions[currentQuestionIndex].id]: currentAnswer };
      setAnswers(newAnswers);
      setCurrentAnswer('');
      
      // Play sound effect
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // All questions completed
        onNext({ 
          personalizedAnswers: newAnswers,
          shardAnswers: initialData.shardAnswers 
        });
      }
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
    } else {
      onNext({ 
        personalizedAnswers: answers,
        shardAnswers: initialData.shardAnswers 
      });
    }
  };

  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const TEXT = {
    hi: {
      title: 'व्यक्तिगत प्रश्न',
      subtitle: 'आपकी पसंद के आधार पर तैयार किए गए विशेष प्रश्न',
      generating: 'आपके लिए प्रश्न तैयार कर रहे हैं...',
      recording: 'बोल रहे हैं...',
      startRecording: 'बोलने के लिए क्लिक करें',
      stopRecording: 'रोकने के लिए क्लिक करें',
      submit: 'जवाब भेजें',
      skip: 'छोड़ें',
      back: 'वापस',
      question: 'प्रश्न',
      of: 'का',
      error: 'प्रश्न तैयार करने में समस्या हुई। कृपया फिर से कोशिश करें।'
    },
    en: {
      title: 'Personalized Questions',
      subtitle: 'Special questions prepared based on your preferences',
      generating: 'Generating questions for you...',
      recording: 'Recording...',
      startRecording: 'Click to speak',
      stopRecording: 'Click to stop',
      submit: 'Submit Answer',
      skip: 'Skip',
      back: 'Back',
      question: 'Question',
      of: 'of',
      error: 'Failed to generate questions. Please try again.'
    }
  };

  const t = TEXT[language];

  if (loading || generating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-4xl mx-auto p-4"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-4">{t.title}</h2>
          <p className="text-purple-200 text-lg">{t.generating}</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-4xl mx-auto p-4"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-purple-200 mb-6">{t.error}</p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="px-6 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors"
            >
              {t.back}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateQuestions}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold hover:from-pink-500 hover:to-purple-500 transition-colors"
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-4xl mx-auto p-4"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center">
          <div className="text-yellow-400 text-6xl mb-4">🤔</div>
          <h2 className="text-2xl font-bold text-white mb-4">No Questions Generated</h2>
          <p className="text-purple-200 mb-6">Unable to generate personalized questions at this time.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold hover:from-pink-500 hover:to-purple-500 transition-colors"
          >
            {t.back}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm">
              {t.question} {currentQuestionIndex + 1} {t.of} {questions.length}
            </span>
            <span className="text-white/80 text-sm">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <SpeakingAvatar 
            text={currentQuestion.question} 
            size="lg" 
            onWordBoundary={setCurrentWordIdx}
          />
          {/* YouTube-style subtitle */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6 mb-4">
            {questionWords.map((word, idx) => (
              <span
                key={idx}
                className={
                  currentWordIdx === idx
                    ? 'text-3xl font-extrabold text-pink-400 transition-all duration-150 scale-110'
                    : currentWordIdx > idx
                      ? 'text-2xl font-semibold text-white/90 transition-all duration-150'
                      : 'text-2xl font-semibold text-purple-200 transition-all duration-150'
                }
                style={{ marginRight: 6 }}
              >
                {word}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm text-purple-300">
              {currentQuestion.category} • {currentQuestion.importance} importance
            </span>
          </div>
        </div>

        {/* Answer Input */}
        <div className="mb-8">
          <div className="relative">
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={language === 'hi' ? 'अपना जवाब यहाँ लिखें...' : 'Type your answer here...'}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 resize-none"
              rows={4}
            />
            
            {/* Voice Input Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceInput}
              disabled={isRecording}
              className={`absolute bottom-3 right-3 p-3 rounded-full transition-colors ${
                isRecording
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </motion.button>
          </div>
          
          {isRecording && (
            <div className="mt-2 text-center">
              <div className="flex items-center justify-center gap-2 text-pink-400">
                <FaVolumeUp className="animate-pulse" />
                <span className="text-sm">{t.recording}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="px-6 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors"
          >
            {t.back}
          </motion.button>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSkip}
              className="px-6 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors"
            >
              {t.skip}
            </motion.button>

            <motion.button
              whileHover={{ scale: currentAnswer.trim() ? 1.02 : 1 }}
              whileTap={{ scale: currentAnswer.trim() ? 0.98 : 1 }}
              disabled={!currentAnswer.trim()}
              onClick={handleSubmitAnswer}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                currentAnswer.trim()
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete' : t.submit}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 