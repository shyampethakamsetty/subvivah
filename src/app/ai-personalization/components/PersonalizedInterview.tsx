"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane } from 'react-icons/fa';
import SpeakingAvatar from '@/app/ai-personalization/components/SpeakingAvatar';
import { useLanguage } from '@/context/LanguageContext';

interface PersonalizedInterviewProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData: {
    gender?: string;
    fullName?: string;
    education?: string;
    workExperience?: string;
    family?: string;
    preferences?: string;
  };
}

const PersonalizedInterview: React.FC<PersonalizedInterviewProps> = ({
  onNext,
  onBack,
  initialData,
}) => {
  const { language } = useLanguage();
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...initialData,
            language
          }),
        });
        if (!res.ok) {
          setError('Failed to generate personalized questions. Please try again.');
          setQuestions([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (error) {
        setError('Could not load personalized questions. Please try again later.');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [initialData, language]);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setAnswer(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError('Speech recognition error. Please try again.');
        setIsRecording(false);
      };
    } else {
      setError('Speech recognition is not supported in your browser.');
    }
  }, [language]);

  const startRecording = async () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
        setError(null);
      }
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Could not start speech recognition. Please try again.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (answer.trim()) {
      const newAnswers = { ...answers, [questions[currentQuestion]]: answer };
      setAnswers(newAnswers);
      setAnswer('');

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        onNext({ interviewResponses: newAnswers });
      }
    }
  };

  const TEXT = {
    hi: {
      title: 'व्यक्तिगत साक्षात्कार',
      subtitle: 'कृपया इन सवालों के जवाब दें',
      questionCount: 'प्रश्न',
      of: 'का',
      back: 'वापस',
      next: 'अगला',
      complete: 'पूरा करें',
      loading: 'प्रश्न लोड हो रहे हैं...',
      error: 'प्रश्न लोड करने में त्रुटि हुई। कृपया पुनः प्रयास करें।',
      placeholder: 'अपना उत्तर यहाँ लिखें...',
      recording: 'रिकॉर्डिंग रोकें',
      startRecording: 'रिकॉर्डिंग शुरू करें',
      submit: 'उत्तर भेजें'
    },
    en: {
      title: 'Personalized Interview',
      subtitle: 'Please answer these questions',
      questionCount: 'Question',
      of: 'of',
      back: 'Back',
      next: 'Next',
      complete: 'Complete',
      loading: 'Loading questions...',
      error: 'Error loading questions. Please try again.',
      placeholder: 'Type your answer here...',
      recording: 'Stop Recording',
      startRecording: 'Start Recording',
      submit: 'Submit Answer'
    }
  };

  const t = TEXT[language];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center justify-center min-h-[70vh]"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
        <div className="text-white/80">{t.loading}</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center justify-center min-h-[70vh]"
      >
        <div className="text-red-400 font-semibold mb-4">{t.error}</div>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          {t.back}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto p-4"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
        <SpeakingAvatar 
          text={questions[currentQuestion]} 
          size="md" 
        />

        <div className="mt-6 space-y-6">
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white/90 mb-2">
              {t.questionCount} {currentQuestion + 1} {t.of} {questions.length}
            </h3>
            <p className="text-white/80 text-sm">
              {questions[currentQuestion]}
            </p>
          </div>

          <div className="relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t.placeholder}
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-pink-500 transition-colors resize-none pr-20"
            />
            <div className="absolute bottom-4 right-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-pink-500 hover:bg-pink-600'
                } transition-colors shadow-lg`}
                title={isRecording ? t.recording : t.startRecording}
              >
                {isRecording ? (
                  <FaMicrophoneSlash className="w-6 h-6 text-white" />
                ) : (
                  <FaMicrophone className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-between items-center text-white/70 text-sm">
            <span>
              {t.questionCount} {currentQuestion + 1} {t.of} {questions.length}
            </span>
            <div className="flex space-x-1">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentQuestion
                      ? 'bg-pink-500'
                      : index < currentQuestion
                      ? 'bg-green-500'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <motion.button
              type="button"
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              {t.back}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={!answer.trim() || isProcessing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion < questions.length - 1 ? t.next : t.complete}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalizedInterview; 