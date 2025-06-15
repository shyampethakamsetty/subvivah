"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane } from 'react-icons/fa';
import SpeakingAvatar from '@/components/SpeakingAvatar';

interface PersonalizedInterviewLLMProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData: {
    gender: string;
    age: string;
    education: string;
    profession: string;
    fullName?: string;
    family?: string;
    preferences?: string;
  };
}

const PersonalizedInterviewLLM: React.FC<PersonalizedInterviewLLMProps> = ({
  onNext,
  onBack,
  initialData,
}) => {
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

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      // Removed required fields check; always call the API
      try {
        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(initialData),
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
  }, [initialData]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Here you would typically send the audio to a speech-to-text service
        setIsProcessing(true);
        setTimeout(() => {
          setAnswer("This is a simulated transcription of your voice input.");
          setIsProcessing(false);
        }, 2000);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
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
        onNext(newAnswers);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
        <div className="text-white/80">Loading personalized questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="text-red-400 font-semibold mb-4">{error}</div>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <div className="flex items-start space-x-4">
          <SpeakingAvatar
            message={questions[currentQuestion]}
            isSpeaking={true}
          />
          <div className="flex-1">
            <div className="mb-6">
              <div className="text-white/90 text-lg mb-4">
                {questions[currentQuestion]}
              </div>
              <div className="relative">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-white/50 focus:outline-none focus:border-pink-500/50 resize-none"
                />
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2 rounded-full ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-pink-500 hover:bg-pink-600'
                    } transition-colors`}
                    disabled={isProcessing}
                  >
                    {isRecording ? (
                      <FaMicrophoneSlash className="text-white" />
                    ) : (
                      <FaMicrophone className="text-white" />
                    )}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!answer.trim() || isProcessing}
                    className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex justify-between items-center text-white/70 text-sm">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
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
              <button
                onClick={onBack}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || isProcessing}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion < questions.length - 1 ? 'Next' : 'Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalizedInterviewLLM; 