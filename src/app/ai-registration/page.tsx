'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import BasicInfoScreen from './components/BasicInfoScreen';
import AIScreen from './components/AIScreen';
import SwipeCardsScreen from './components/SwipeCardsScreen';
import SummaryScreen from './components/SummaryScreen';
import LoveBubbles from './components/LoveBubbles';

interface FormData {
  basics: Record<string, any>;
  aiAnswers: string[];
  preferences: Record<number, 'left' | 'right'>;
}

export default function AIRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    basics: {},
    aiAnswers: [],
    preferences: {},
  });

  const totalSteps = 5;

  const handleNext = (data: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 relative">
      <LoveBubbles />
      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Screens */}
        <AnimatePresence>
          {currentStep === 1 && (
            <WelcomeScreen onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <BasicInfoScreen
              onNext={handleNext}
              onBack={handleBack}
              initialData={formData.basics}
            />
          )}
          {currentStep === 3 && (
            <AIScreen
              onNext={handleNext}
              onBack={handleBack}
              userData={formData.basics}
            />
          )}
          {currentStep === 4 && (
            <SwipeCardsScreen
              onNext={handleNext}
              onBack={handleBack}
              aiAnswers={formData.aiAnswers}
            />
          )}
          {currentStep === 5 && (
            <SummaryScreen
              onBack={handleBack}
              formData={formData}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 