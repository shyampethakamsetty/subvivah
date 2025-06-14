'use client';

import { motion } from 'framer-motion';
import SpeakingAvatar from './SpeakingAvatar';

interface WelcomeScreenProps {
  onNext: (data: any) => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const welcomeMessage = "Welcome to Subvivah AI Interview! I'll help you create your perfect profile by asking personalized questions and understanding your preferences better.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[70vh]"
    >
      <SpeakingAvatar text={welcomeMessage} size="lg" />

      <h1 className="text-4xl font-bold text-center mb-4 mt-8 text-white">
        Welcome to Subvivah AI Interview!
      </h1>
      
      <p className="text-xl text-purple-200 text-center mb-8 max-w-2xl">
        I'll help you create your perfect profile by asking personalized questions
        and understanding your preferences better.
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:from-pink-500 hover:to-purple-500 transition-colors"
        onClick={() => onNext({})}
      >
        Let's Begin
      </motion.button>
    </motion.div>
  );
} 