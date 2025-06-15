import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import SpeakingAvatar from './SpeakingAvatar';

interface ReviewScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

export default function ReviewScreen({ onNext, onBack, initialData }: ReviewScreenProps) {
  const { language } = useLanguage();
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      setError(null);
      try {
        const prompt = `Given the following user data, generate a friendly, concise summary for a matrimonial profile review page.\nData: ${JSON.stringify(initialData, null, 2)}\nThe summary should be in the third person and highlight key details.`;
        const res = await fetch('/api/gpt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt, language, guestName: initialData?.basics?.fullName || '' }),
        });
        if (!res.ok) {
          setError('Failed to generate review summary.');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setSummary(data.response || 'No summary generated.');
      } catch (err) {
        setError('Could not load review summary. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [initialData, language]);

  const TEXT = {
    hi: {
      title: 'समीक्षा',
      description: 'अपनी जानकारी की समीक्षा करें',
      next: 'समाप्त',
      back: 'वापस',
    },
    en: {
      title: 'Review',
      description: 'Review your information',
      next: 'Finish',
      back: 'Back',
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
      <SpeakingAvatar text={summary || t.title} />

      <h1 className="text-4xl font-bold text-center mb-4 mt-8 text-white">
        {t.title}
      </h1>
      {loading ? (
        <div className="flex flex-col items-center justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
          <div className="text-white/80">Generating your review summary...</div>
        </div>
      ) : error ? (
        <div className="text-red-400 font-semibold my-8">{error}</div>
      ) : (
        <p className="text-xl text-purple-200 text-center mb-8 max-w-2xl whitespace-pre-line">
          {summary}
        </p>
      )}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-white/20 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-white/30 transition-colors"
          onClick={onBack}
        >
          {t.back}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:from-pink-500 hover:to-purple-500 transition-colors"
          onClick={() => onNext({})}
        >
          {t.next}
        </motion.button>
      </div>
    </motion.div>
  );
} 