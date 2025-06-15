"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaUserGraduate, FaLaptopCode, FaChalkboardTeacher, FaBuilding, FaUserTie } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import SpeakingAvatar from './SpeakingAvatar';

interface WorkExperienceScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

const WORK_TYPES = [
  { key: 'student', label: 'Student', icon: <FaUserGraduate size={32} /> },
  { key: 'it', label: 'IT/Software', icon: <FaLaptopCode size={32} /> },
  { key: 'education', label: 'Education/Teaching', icon: <FaChalkboardTeacher size={32} /> },
  { key: 'corporate', label: 'Corporate', icon: <FaBuilding size={32} /> },
  { key: 'business', label: 'Business/Entrepreneur', icon: <FaUserTie size={32} /> },
  { key: 'other', label: 'Other', icon: <FaBriefcase size={32} /> },
];

const WorkExperienceScreen: React.FC<WorkExperienceScreenProps> = ({ onNext, onBack, initialData }) => {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<string>(initialData?.workType || '');

  const TEXT = {
    hi: {
      title: 'कार्य अनुभव',
      description: 'अपने कार्य अनुभव के बारे में बताएं',
      next: 'अगला',
      back: 'वापस',
    },
    en: {
      title: 'Work Experience',
      description: 'Tell us about your work experience',
      next: 'Next',
      back: 'Back',
    }
  };
  const t = TEXT[language];

  const handleSelect = (key: string) => {
    setSelected(key);
  };

  const handleNext = () => {
    if (selected) {
      onNext({ workType: selected });
    }
  };

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
          Select Your Work Experience
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {WORK_TYPES.map((type) => (
            <motion.div
              key={type.key}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center min-w-[140px] p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-md
                ${selected === type.key ? 'border-pink-500 bg-pink-500/20' : 'border-white/20 bg-white/5 hover:border-pink-400'}`}
              onClick={() => handleSelect(type.key)}
            >
              <div className="mb-2">{type.icon}</div>
              <div className={`font-medium text-white ${selected === type.key ? 'text-pink-400' : 'text-white/80'}`}>{type.label}</div>
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
            disabled={!selected}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.next}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkExperienceScreen; 