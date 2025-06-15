"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaUtensils, FaGlobe, FaChild, FaHeart, FaPlane, FaBook, FaDog } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import SpeakingAvatar from './SpeakingAvatar';

interface PreferencesScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

const PREFERENCES = [
  { key: 'vegetarian', label: 'Vegetarian', icon: <FaLeaf size={32} /> },
  { key: 'non_vegetarian', label: 'Non-Vegetarian', icon: <FaUtensils size={32} /> },
  { key: 'open_to_relocation', label: 'Open to Relocation', icon: <FaGlobe size={32} /> },
  { key: 'wants_kids', label: 'Wants Kids', icon: <FaChild size={32} /> },
  { key: 'pet_friendly', label: 'Pet Friendly', icon: <FaDog size={32} /> },
  { key: 'book_lover', label: 'Book Lover', icon: <FaBook size={32} /> },
  { key: 'travel_lover', label: 'Travel Lover', icon: <FaPlane size={32} /> },
  { key: 'romantic', label: 'Romantic', icon: <FaHeart size={32} /> },
];

const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ onNext, onBack, initialData }) => {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<string[]>(initialData?.preferences || []);

  const handleSelect = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleNext = () => {
    if (selected.length > 0) {
      onNext({ preferences: selected });
    }
  };

  const TEXT = {
    hi: {
      title: 'पसंद',
      description: 'अपनी पसंद के बारे में बताएं',
      next: 'अगला',
      back: 'वापस',
    },
    en: {
      title: 'Preferences',
      description: 'Tell us about your preferences',
      next: 'Next',
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
      <SpeakingAvatar text={t.description} size="lg" />

      <h1 className="text-4xl font-bold text-center mb-4 mt-8 text-white">
        {t.title}
      </h1>
      
      <p className="text-xl text-purple-200 text-center mb-8 max-w-2xl">
        {t.description}
      </p>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-center text-white mb-6">
          Select Your Preferences
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {PREFERENCES.map((pref) => (
            <motion.div
              key={pref.key}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center min-w-[140px] p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-md
                ${selected.includes(pref.key) ? 'border-pink-500 bg-pink-500/20' : 'border-white/20 bg-white/5 hover:border-pink-400'}`}
              onClick={() => handleSelect(pref.key)}
            >
              <div className="mb-2">{pref.icon}</div>
              <div className={`font-medium text-white ${selected.includes(pref.key) ? 'text-pink-400' : 'text-white/80'}`}>{pref.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            {t.back}
          </button>
          <button
            onClick={handleNext}
            disabled={selected.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.next}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PreferencesScreen; 