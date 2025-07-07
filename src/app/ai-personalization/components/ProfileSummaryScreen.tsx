'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import SpeakingAvatar from './SpeakingAvatar';

interface ProfileSummaryScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData: {
    shardAnswers: Record<string, string>;
    personalizedAnswers: Record<string, string>;
  };
}

interface ProfileSummary {
  summary: string;
  keyTraits: string[];
  compatibilityNotes: string;
  matchPreferences: string;
}

export default function ProfileSummaryScreen({ onNext, onBack, initialData }: ProfileSummaryScreenProps) {
  const { language } = useLanguage();
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarText, setAvatarText] = useState('');

  useEffect(() => {
    generateSummary();
  }, []);

  const generateSummary = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shardAnswers: initialData.shardAnswers,
          personalizedAnswers: initialData.personalizedAnswers,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data);
      setAvatarText(data.summary);
      setLoading(false);
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('Failed to generate profile summary. Please try again.');
      setLoading(false);
    } finally {
      setGenerating(false);
    }
  };

  const handleComplete = async () => {
    try {
      // Save all data to database
      const saveResponse = await fetch('/api/ai/save-personalization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shardAnswers: initialData.shardAnswers,
          personalizedAnswers: initialData.personalizedAnswers,
          profileSummary: summary,
          isCompleted: true
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save personalization data');
      }

      const saveData = await saveResponse.json();
      console.log('AI Personalization saved:', saveData);

      // Proceed to next step
      onNext({ 
        profileSummary: summary,
        shardAnswers: initialData.shardAnswers,
        personalizedAnswers: initialData.personalizedAnswers,
        isCompleted: true
      });
    } catch (error) {
      console.error('Error saving personalization data:', error);
      // Still proceed even if save fails
      onNext({ 
        profileSummary: summary,
        shardAnswers: initialData.shardAnswers,
        personalizedAnswers: initialData.personalizedAnswers,
        isCompleted: true
      });
    }
  };

  const TEXT = {
    hi: {
      title: 'आपकी प्रोफ़ाइल सारांश',
      subtitle: 'आपकी पसंद और जवाबों के आधार पर तैयार किया गया',
      generating: 'आपकी प्रोफ़ाइल तैयार कर रहे हैं...',
      keyTraits: 'मुख्य विशेषताएं',
      compatibilityNotes: 'संगतता नोट्स',
      matchPreferences: 'मैच प्राथमिकताएं',
      complete: 'पूरा करें',
      back: 'वापस',
      error: 'प्रोफ़ाइल सारांश तैयार करने में समस्या हुई। कृपया फिर से कोशिश करें।'
    },
    en: {
      title: 'Your Profile Summary',
      subtitle: 'Generated based on your preferences and answers',
      generating: 'Preparing your profile...',
      keyTraits: 'Key Traits',
      compatibilityNotes: 'Compatibility Notes',
      matchPreferences: 'Match Preferences',
      complete: 'Complete',
      back: 'Back',
      error: 'Failed to generate profile summary. Please try again.'
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
              onClick={generateSummary}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold hover:from-pink-500 hover:to-purple-500 transition-colors"
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!summary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-4xl mx-auto p-4"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center">
          <div className="text-yellow-400 text-6xl mb-4">🤔</div>
          <h2 className="text-2xl font-bold text-white mb-4">No Summary Generated</h2>
          <p className="text-purple-200 mb-6">Unable to generate profile summary at this time.</p>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{t.title}</h1>
          <p className="text-purple-200 text-lg">{t.subtitle}</p>
        </div>

        {/* Avatar Speaking Summary */}
        <div className="mb-8">
          <SpeakingAvatar text={avatarText} size="lg" />
        </div>

        {/* Summary Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Key Traits */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-pink-400">✨</span>
              {t.keyTraits}
            </h3>
            <div className="space-y-2">
              {summary.keyTraits.map((trait, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-pink-400">•</span>
                  <span className="text-purple-200">{trait}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compatibility Notes */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">💝</span>
              {t.compatibilityNotes}
            </h3>
            <p className="text-purple-200 leading-relaxed">
              {summary.compatibilityNotes}
            </p>
          </div>
        </div>

        {/* Match Preferences */}
        <div className="bg-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">🎯</span>
            {t.matchPreferences}
          </h3>
          <p className="text-purple-200 leading-relaxed">
            {summary.matchPreferences}
          </p>
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold hover:from-pink-500 hover:to-purple-500 transition-colors"
          >
            {t.complete}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 