"use client";
import React, { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import PersonalizedInterviewLLM from './components/PersonalizedInterviewLLM';
import PersonalizationQuestionsScreen from './components/PersonalizationQuestionsScreen';
import { useLanguage } from '@/context/LanguageContext';
import SpeakingAvatar from './components/SpeakingAvatar';

// Dynamically import components with no SSR
const WelcomeScreen = dynamic(() => import('./components/WelcomeScreen'), { ssr: false });
const BasicInfoScreen = dynamic(() => import('./components/BasicInfoScreen'), { ssr: false });
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
    setFormData((prev: FormData) => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const screens = [
    <WelcomeScreen key="welcome" onNext={handleNext} onBack={handleBack} />,
    <BasicInfoScreen key="basic-info" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <EducationScreen key="education" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <WorkExperienceScreen key="work-experience" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <FamilyScreen key="family" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <PreferencesScreen key="preferences" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <PersonalizedInterview key="interview" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <PersonalityPreferencesScreen key="personality-preferences" onNext={handleNext} onBack={handleBack} />,
    <ReviewScreen key="review" onNext={handleNext} onBack={handleBack} profileData={formData} interviewResponses={formData.interviewResponses} personalityPreferences={formData.personalityPreferences} />,
    <EndScreen key="end" onBack={handleBack} />
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex flex-col justify-center items-center">
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
  );
} 