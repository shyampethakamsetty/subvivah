"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane } from 'react-icons/fa';
import SpeakingAvatar from '@/components/SpeakingAvatar';

interface PersonalizedInterviewProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData: {
    gender: string;
    fullName: string;
    education: string;
    workExperience: string;
    family: string;
    preferences: string;
  };
}

const PersonalizedInterview: React.FC<PersonalizedInterviewProps> = ({
  onNext,
  onBack,
  initialData,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Generate personalized questions based on user data
  const questions = [
    {
      id: 'career_goals',
      question: `Hi ${initialData.fullName}, I see you're ${initialData.gender === 'male' ? 'a man' : 'a woman'} with ${initialData.education} education. Could you tell me about your career aspirations and where you see yourself in 5 years?`,
    },
    {
      id: 'family_values',
      question: `I notice you mentioned ${initialData.family} about your family. What are your core family values and what kind of family environment would you like to create?`,
    },
    {
      id: 'partner_expectations',
      question: `Based on your preferences of ${initialData.preferences}, what qualities are most important to you in a life partner?`,
    },
    {
      id: 'life_goals',
      question: `With your background in ${initialData.workExperience}, what are your main life goals and how do you plan to achieve them?`,
    },
    {
      id: 'relationship_approach',
      question: `What's your approach to building and maintaining a strong relationship? How do you handle conflicts?`,
    },
  ];

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
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Here you would typically send the audio to a speech-to-text service
        // For now, we'll just simulate it with a timeout
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
      const newAnswers = { ...answers, [questions[currentQuestion].id]: answer };
      setAnswers(newAnswers);
      setAnswer('');

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        onNext(newAnswers);
      }
    }
  };

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
            message={questions[currentQuestion].question}
            isSpeaking={true}
          />
          <div className="flex-1">
            <div className="mb-6">
              <div className="text-white/90 text-lg mb-4">
                {questions[currentQuestion].question}
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

export default PersonalizedInterview; 