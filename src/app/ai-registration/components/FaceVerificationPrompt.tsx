import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import SpeakingAvatar from './SpeakingAvatar';

interface FaceVerificationPromptProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function FaceVerificationPrompt({ onNext, onBack }: FaceVerificationPromptProps) {
  const { language } = useLanguage();

  const TEXT = {
    hi: {
      title: 'चेहरा सत्यापन',
      description: 'सबसे पहले, हमें आपके चेहरे की तस्वीर लेने की आवश्यकता है। यह हमें आपके लिंग की पहचान करने में मदद करेगा और आपकी प्रोफ़ाइल को बेहतर बनाएगा।',
      ready: 'मैं तैयार हूं',
    },
    en: {
      title: 'Face Verification',
      description: 'First, we need to take your photo. This will help us identify your gender and enhance your profile.',
      ready: "I'm Ready",
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
      <SpeakingAvatar text={t.description} size="lg" />

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
        {t.ready}
      </motion.button>
    </motion.div>
  );
} 