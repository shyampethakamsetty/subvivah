"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { GraduationCap, Building2, Calendar } from 'lucide-react';
import SpeakingAvatar from '@/app/ai-personalization/components/SpeakingAvatar';

interface EducationScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

const EducationScreen: React.FC<EducationScreenProps> = ({ onNext, onBack, initialData }) => {
  const { language } = useLanguage();
  const [education, setEducation] = useState({
    degree: initialData?.degree || '',
    institution: initialData?.institution || '',
    yearOfCompletion: initialData?.yearOfCompletion || '',
  });

  const degrees = [
    { value: 'high_school', label: { hi: 'हाई स्कूल', en: 'High School' } },
    { value: 'bachelors', label: { hi: 'स्नातक', en: 'Bachelor\'s' } },
    { value: 'masters', label: { hi: 'स्नातकोत्तर', en: 'Master\'s' } },
    { value: 'phd', label: { hi: 'पीएचडी', en: 'PhD' } },
    { value: 'diploma', label: { hi: 'डिप्लोमा', en: 'Diploma' } },
    { value: 'other', label: { hi: 'अन्य', en: 'Other' } },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1970 + 1 },
    (_, i) => currentYear - i
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (education.degree && education.institution && education.yearOfCompletion) {
      onNext(education);
    }
  };

  const avatarText = {
    hi: 'अपनी शिक्षा के बारे में बताएं',
    en: 'Tell us about your education'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto p-6"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <SpeakingAvatar text={avatarText[language]} size="md" />
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Degree Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/90">
              <GraduationCap className="w-5 h-5" />
              <span>{language === 'hi' ? 'डिग्री' : 'Degree'}</span>
            </label>
            <select
              value={education.degree}
              onChange={(e) => setEducation(prev => ({ ...prev, degree: e.target.value }))}
              required
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">{language === 'hi' ? 'डिग्री चुनें' : 'Select degree'}</option>
              {degrees.map((degree) => (
                <option key={degree.value} value={degree.value}>
                  {degree.label[language]}
                </option>
              ))}
            </select>
          </div>

          {/* Institution Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/90">
              <Building2 className="w-5 h-5" />
              <span>{language === 'hi' ? 'संस्थान' : 'Institution'}</span>
            </label>
            <input
              type="text"
              value={education.institution}
              onChange={(e) => setEducation(prev => ({ ...prev, institution: e.target.value }))}
              required
              placeholder={language === 'hi' ? 'संस्थान का नाम दर्ज करें' : 'Enter institution name'}
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Year of Completion */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/90">
              <Calendar className="w-5 h-5" />
              <span>{language === 'hi' ? 'पूर्णता का वर्ष' : 'Year of Completion'}</span>
            </label>
            <select
              value={education.yearOfCompletion}
              onChange={(e) => setEducation(prev => ({ ...prev, yearOfCompletion: e.target.value }))}
              required
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">{language === 'hi' ? 'वर्ष चुनें' : 'Select year'}</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between mt-8">
            <motion.button
              type="button"
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              {language === 'hi' ? 'वापस' : 'Back'}
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors"
              disabled={!education.degree || !education.institution || !education.yearOfCompletion}
            >
              {language === 'hi' ? 'अगला' : 'Next'}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EducationScreen; 