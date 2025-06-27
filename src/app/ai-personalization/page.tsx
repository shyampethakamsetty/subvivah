"use client";
import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import PersonalizedInterviewLLM from './components/PersonalizedInterviewLLM';
import PersonalizationQuestionsScreen from './components/PersonalizationQuestionsScreen';
import { useLanguage } from '@/context/LanguageContext';
import SpeakingAvatar from './components/SpeakingAvatar';

// Dynamically import components with no SSR
const WelcomeScreen = dynamic(() => import('./components/WelcomeScreen'), { ssr: false });
const ImprovedBasicInfoScreen = dynamic(() => import('./components/ImprovedBasicInfoScreen'), { ssr: false });
const EducationScreen = dynamic(() => import('./components/EducationScreen'), { ssr: false });
const WorkExperienceScreen = dynamic(() => import('./components/WorkExperienceScreen'), { ssr: false });
const FamilyScreen = dynamic(() => import('./components/FamilyScreen'), { ssr: false });
const PreferencesScreen = dynamic(() => import('./components/PreferencesScreen'), { ssr: false });
const PersonalizedInterview = dynamic(() => import('./components/PersonalizedInterview'), { ssr: false });
const PersonalityPreferencesScreen = dynamic(() => import('./components/PersonalityPreferencesScreen'), { ssr: false });
const ReviewScreen = dynamic(() => import('./components/ReviewScreen'), { ssr: false });
const EndScreen = dynamic(() => import('./components/EndScreen'), { ssr: false });

interface FormData {
  gender?: string;
  fullName?: string;
  education?: string;
  workExperience?: string;
  family?: string;
  preferences?: string;
  [key: string]: any;
}

export default function AIRegistration() {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});

  const handleNext = (data: FormData) => {
    const newFormData = { ...formData, ...data };
    setFormData(newFormData);
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSkipStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const steps = [
    { id: 0, name: { hi: 'स्वागत', en: 'Welcome' }, isOptional: false },
    { id: 1, name: { hi: 'मूल जानकारी', en: 'Basic Info' }, isOptional: false },
    { id: 2, name: { hi: 'शिक्षा', en: 'Education' }, isOptional: false },
    { id: 3, name: { hi: 'कार्य अनुभव', en: 'Work Experience' }, isOptional: false },
    { id: 4, name: { hi: 'परिवार', en: 'Family' }, isOptional: true },
    { id: 5, name: { hi: 'प्राथमिकताएं', en: 'Preferences' }, isOptional: false },
    { id: 6, name: { hi: 'AI साक्षात्कार', en: 'AI Interview' }, isOptional: true },
    { id: 7, name: { hi: 'व्यक्तित्व', en: 'Personality' }, isOptional: true },
    { id: 8, name: { hi: 'समीक्षा', en: 'Review' }, isOptional: false },
    { id: 9, name: { hi: 'समाप्त', en: 'Complete' }, isOptional: false },
  ];

  const screens = [
    <WelcomeScreen key="welcome" onNext={handleNext} />,
    <ImprovedBasicInfoScreen key="basic" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <EducationScreen key="education" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <WorkExperienceScreen key="work" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <FamilyScreen key="family" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <PreferencesScreen key="preferences" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <PersonalizedInterview key="interview" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <PersonalityPreferencesScreen key="personality" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <ReviewScreen key="review" onNext={handleNext} onBack={handleBack} formData={formData} />,
    <EndScreen key="end" onBack={handleBack} formData={formData} />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 relative pb-32">
      {/* Ensure complete background coverage */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 -z-10 h-full min-h-screen"></div>
      <div className="absolute top-0 left-0 w-full min-h-full bg-gradient-to-br from-purple-900/80 to-pink-900/80 -z-20"></div>
      {/* Progress Header - Show on all screens except Welcome */}
      {currentStep > 0 && (
        <div className="max-w-4xl mx-auto pt-4 px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">
                {language === 'hi' ? 'प्रगति' : 'Progress'}
              </span>
              <span className="text-purple-300 text-sm">
                {currentStep}/10
              </span>
            </div>
            <div className="w-full bg-purple-800/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 10) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-purple-300 text-xs">
                {steps[currentStep]?.name[language]}
              </span>
              {steps[currentStep]?.isOptional && (
                <button
                  onClick={handleSkipStep}
                  className="text-yellow-300 text-xs hover:text-yellow-200 transition-colors"
                >
                  {language === 'hi' ? 'छोड़ें' : 'Skip'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-col justify-center items-center min-h-screen">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full"
          >
            {screens[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 