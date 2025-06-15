'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import SpeakingAvatar from '../ai-registration/components/SpeakingAvatar';

interface FaceVerificationProps {
  onNext: (data: any) => void;
}

export default function FaceVerification({ onNext }: FaceVerificationProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<'initial' | 'capturing' | 'verifying' | 'success'>('initial');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const TEXT = {
    hi: {
      title: 'चेहरा सत्यापन',
      step1: 'अपना चेहरा कैमरे के सामने रखें',
      step2: 'अपना चेहरा सीधा रखें',
      step3: 'अपना चेहरा थोड़ा ऊपर रखें',
      start: 'शुरू करें',
      capture: 'तस्वीर लें',
      retake: 'फिर से लें',
      verifying: 'सत्यापित कर रहे हैं...',
      success: 'सत्यापन सफल!',
      next: 'अगला',
    },
    en: {
      title: 'Face Verification',
      step1: 'Position your face in front of the camera',
      step2: 'Keep your face straight',
      step3: 'Tilt your face slightly upward',
      start: 'Start',
      capture: 'Capture',
      retake: 'Retake',
      verifying: 'Verifying...',
      success: 'Verification Successful!',
      next: 'Next',
    }
  };
  const t = TEXT[language];

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsCameraActive(true);
      setVerificationStep('capturing');
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        setIsCapturing(true);
        setVerificationStep('verifying');
        
        // Simulate verification process
        setTimeout(() => {
          setVerificationStep('success');
          if (step < 3) {
            // Move to next step
            setStep(prev => prev + 1);
            setCapturedImage(null);
            setIsCapturing(false);
            setVerificationStep('capturing');
          } else {
            // On final step, return gender data
            const genderConfidence = Math.floor(Math.random() * (98 - 70 + 1)) + 70;
            onNext({ gender: 'male', genderConfidence });
          }
        }, 2000);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setIsCapturing(false);
    setVerificationStep('capturing');
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return t.step1;
      case 2:
        return t.step2;
      case 3:
        return t.step3;
      default:
        return t.step1;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[70vh] relative"
    >
      <SpeakingAvatar text={getStepDescription()} size="lg" />

      <h1 className="text-4xl font-bold text-center mb-4 mt-8 text-white">
        {t.title} - {language === 'hi' ? `चरण ${step}` : `Step ${step}`}
      </h1>

      <div className="relative w-full max-w-2xl aspect-video bg-black/20 rounded-2xl overflow-hidden mb-8">
        {!isCameraActive ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:from-pink-500 hover:to-purple-500 transition-colors"
              onClick={startCamera}
            >
              {t.start}
            </motion.button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {capturedImage && (
              <div className="absolute inset-0">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {verificationStep === 'verifying' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-xl">{t.verifying}</div>
              </div>
            )}
            {verificationStep === 'success' && step === 3 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-xl flex items-center gap-2">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {t.success}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isCameraActive && !isCapturing && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:from-pink-500 hover:to-purple-500 transition-colors"
          onClick={captureImage}
        >
          {t.capture}
        </motion.button>
      )}

      {isCapturing && verificationStep !== 'success' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-white/20 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-white/30 transition-colors"
          onClick={retakePhoto}
        >
          {t.retake}
        </motion.button>
      )}

      {verificationStep === 'success' && step === 3 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:from-pink-500 hover:to-purple-500 transition-colors"
          onClick={() => {
            stopCamera();
            onNext({});
          }}
        >
          {t.next}
        </motion.button>
      )}
    </motion.div>
  );
} 