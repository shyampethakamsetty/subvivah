'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import SpeakingAvatar from '@/app/ai-personalization/components/SpeakingAvatar';
import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EndScreenProps {
  onBack: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const router = useRouter();

  const TEXT = {
    hi: {
      title: 'धन्यवाद!',
      subtitle: 'आपकी प्रोफ़ाइल पूरी हो गई है',
      message: 'आपकी प्रोफ़ाइल सफलतापूर्वक बनाई गई है। अब आप अपनी प्रोफ़ाइल देख सकते हैं और संभावित जीवनसाथी से मिल सकते हैं।',
      homeButton: 'होम पर जाएं'
    },
    en: {
      title: 'Thank You!',
      subtitle: 'Your Profile is Complete',
      message: 'Your profile has been successfully created. You can now view your profile and connect with potential life partners.',
      homeButton: 'Go to Home'
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
      <SpeakingAvatar 
        text={language === 'hi' 
          ? 'आपकी प्रोफ़ाइल सफलतापूर्वक बनाई गई है। आपका स्वागत है!'
          : 'Your profile has been successfully created. Welcome!'} 
        size="lg" 
      />

      <h1 className="text-4xl font-bold text-center mb-2 mt-8 text-white">
        {t.title}
      </h1>
      
      <h2 className="text-2xl text-pink-400 text-center mb-4">
        {t.subtitle}
      </h2>

      <p className="text-xl text-purple-200 text-center mb-8 max-w-2xl">
        {t.message}
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:from-pink-500 hover:to-purple-500 transition-colors flex items-center gap-2"
        onClick={() => router.push('/')}
      >
        <Home className="w-5 h-5" />
        {t.homeButton}
      </motion.button>
    </motion.div>
  );
};

export default EndScreen; 