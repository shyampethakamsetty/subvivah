'use client';

import { motion } from 'framer-motion';
import SpeakingAvatar from './SpeakingAvatar';
import { useLanguage } from '@/context/LanguageContext';

interface WelcomeScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function WelcomeScreen({ onNext, onBack }: WelcomeScreenProps) {
  const { language, setLanguage } = useLanguage();

  const TEXT = {
    hi: {
      welcomeMessage: "Subvivah AI साक्षात्कार में आपका स्वागत है! मैं आपकी प्रोफ़ाइल बनाने में आपकी मदद करूंगा, व्यक्तिगत प्रश्न पूछकर और आपकी पसंद को बेहतर समझकर।",
      title: 'Subvivah AI साक्षात्कार में आपका स्वागत है!',
      description: 'मैं आपकी प्रोफ़ाइल बनाने में आपकी मदद करूंगा, व्यक्तिगत प्रश्न पूछकर और आपकी पसंद को बेहतर समझकर।',
      begin: 'शुरू करें',
      changeLang: 'Change to English',
    },
    en: {
      welcomeMessage: "Welcome to Subvivah AI Interview! I'll help you create your perfect profile by asking personalized questions and understanding your preferences better.",
      title: 'Welcome to Subvivah AI Interview!',
      description: "I'll help you create your perfect profile by asking personalized questions and understanding your preferences better.",
      begin: "Let's Begin",
      changeLang: 'हिंदी में बदलें',
    }
  };
  const t = TEXT[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[70vh] relative"
    >
      {/* Language Switch Button */}
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold hover:bg-white/30 transition-colors z-10"
        onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
      >
        {t.changeLang}
      </button>

      <SpeakingAvatar text={t.welcomeMessage} size="lg" />

      <h1 className="text-4xl font-bold text-center mb-4 mt-8 text-white">
        {t.title}
      </h1>
      
      <p className="text-xl text-purple-200 text-center mb-8 max-w-2xl">
        {t.description}
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:from-pink-500 hover:to-purple-500 transition-colors"
        onClick={() => onNext({})}
      >
        {t.begin}
      </motion.button>
    </motion.div>
  );
} 