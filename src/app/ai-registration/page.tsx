"use client";
import React, { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import PersonalizedInterviewLLM from './components/PersonalizedInterviewLLM';
import PersonalizationQuestionsScreen from './components/PersonalizationQuestionsScreen';

// Dynamically import components with no SSR
const WelcomeScreen = dynamic(() => import('./components/WelcomeScreen'), { ssr: false });
const BasicInfoScreen = dynamic(() => import('./components/BasicInfoScreen'), { ssr: false });
const EducationScreen = dynamic(() => import('./components/EducationScreen'), { ssr: false });
const WorkExperienceScreen = dynamic(() => import('./components/WorkExperienceScreen'), { ssr: false });
const FamilyScreen = dynamic(() => import('./components/FamilyScreen'), { ssr: false });
const PreferencesScreen = dynamic(() => import('./components/PreferencesScreen'), { ssr: false });
const ReviewScreen = dynamic(() => import('./components/ReviewScreen'), { ssr: false });
const PersonalizedInterview = dynamic(() => import('./components/PersonalizedInterview'), { ssr: false });
const FaceVerificationPrompt = dynamic(() => import('./components/FaceVerificationPrompt'), { ssr: false });
const FaceVerification = dynamic(() => import('@/components/FaceVerification'), { ssr: false });

interface ScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

export default function AIRegistration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [showFaceVerification, setShowFaceVerification] = useState(false);

  // Debug: Log state changes
  useEffect(() => {
    console.log('[DEBUG] currentStep:', currentStep);
  }, [currentStep]);
  useEffect(() => {
    console.log('[DEBUG] showFaceVerification:', showFaceVerification);
  }, [showFaceVerification]);
  useEffect(() => {
    console.log('[DEBUG] formData:', formData);
  }, [formData]);

  const handleNext = (data: any) => {
    console.log('[DEBUG] handleNext called with data:', data);
    console.log('[DEBUG] currentStep before handleNext:', currentStep);
    console.log('[DEBUG] showFaceVerification before handleNext:', showFaceVerification);

    // 1. Handle face verification completion FIRST
    if (data?.gender) {
      console.log('[DEBUG] Received gender data:', data);
      setFormData((prev: any) => {
        const updated = {
          ...prev,
          gender: data.gender,
          genderConfidence: data.genderConfidence
        };
        console.log('[DEBUG] Updated formData:', updated);
        return updated;
      });
      setShowFaceVerification(false);
      setTimeout(() => {
        console.log('[DEBUG] Advancing to BasicInfoScreen (step 2)');
        setCurrentStep(2); // Move directly to BasicInfoScreen
      }, 0);
      return;
    }

    // 2. Only open overlay if not already handling gender
    if (currentStep === 1) {
      console.log('[DEBUG] Entering face verification overlay');
      setShowFaceVerification(true);
      return;
    }

    // 3. All other steps
    setFormData((prev: any) => {
      const updated = { ...prev, ...data };
      console.log('[DEBUG] Updated formData (other step):', updated);
      return updated;
    });
    setCurrentStep(prev => {
      const nextStep = prev + 1;
      console.log('[DEBUG] Advancing to next step:', nextStep);
      return nextStep;
    });
  };

  const handleBack = () => {
    if (showFaceVerification) {
      console.log('[DEBUG] Closing face verification overlay');
      setShowFaceVerification(false);
    } else {
      setCurrentStep(prev => {
        const prevStep = prev - 1;
        console.log('[DEBUG] Going back to previous step:', prevStep);
        return prevStep;
      });
    }
  };

  const screens: React.ReactElement<ScreenProps>[] = [
    <WelcomeScreen key="welcome" onNext={handleNext} onBack={handleBack} />,
    <FaceVerificationPrompt key="face-verification-prompt" onNext={handleNext} onBack={handleBack} />,
    <BasicInfoScreen key="basic-info" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <EducationScreen key="education" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <WorkExperienceScreen key="work-experience" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <FamilyScreen key="family" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <PreferencesScreen key="preferences" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <PersonalizationQuestionsScreen key="personalization-questions" onNext={handleNext} onBack={handleBack} initialData={formData} />,
    <ReviewScreen key="review" onNext={handleNext} onBack={handleBack} initialData={formData} />
  ];

  // Debug: Log which screen is being rendered
  useEffect(() => {
    console.log('[DEBUG] Rendering screen index:', currentStep, 'showFaceVerification:', showFaceVerification);
  }, [currentStep, showFaceVerification]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
        </div>
      }>
        <AnimatePresence>
          {showFaceVerification ? (
            <motion.div
              key="face-verification"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <FaceVerification onNext={handleNext} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              {screens[currentStep]}
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
} 