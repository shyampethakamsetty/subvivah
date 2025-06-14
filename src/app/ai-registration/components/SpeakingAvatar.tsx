'use client';

import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface SpeakingAvatarProps {
  text: string;
  onSpeakEnd?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showStopButton?: boolean;
  onStopSpeaking?: () => void;
}

export interface SpeakingAvatarHandle {
  stopSpeaking: () => void;
}

const sizeMap = {
  sm: 96,
  md: 128,
  lg: 192,
};

const SpeakingAvatar = forwardRef<SpeakingAvatarHandle, SpeakingAvatarProps>(
  ({ text, onSpeakEnd, size = 'md', showStopButton = false, onStopSpeaking }, ref) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [voiceError, setVoiceError] = useState(false);
    const lottieRef = useRef<any>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const isStoppedRef = useRef(false);
    const [animationData, setAnimationData] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    useEffect(() => {
      if (!isMounted) return;
      
      // Load the animation data
      fetch('/animations/Animation - 1749927050470.json')
        .then(response => response.json())
        .then(data => setAnimationData(data))
        .catch(error => console.error('Error loading animation:', error));
    }, [isMounted]);

    // Wait for voices to load and select a female voice
    useEffect(() => {
      if (!isMounted) return;

      function loadVoices() {
        const voices = window.speechSynthesis.getVoices();
        const female = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman') || v.name.toLowerCase().includes('girl') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('susan') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('eva') || v.name.toLowerCase().includes('karen') || v.name.toLowerCase().includes('nina') || v.name.toLowerCase().includes('linda') || v.name.toLowerCase().includes('mary') || v.name.toLowerCase().includes('lucia') || v.name.toLowerCase().includes('sofia'));
        if (female) {
          setFemaleVoice(female);
          setVoiceError(false);
        } else {
          setFemaleVoice(null);
          setVoiceError(true);
        }
      }
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      } else {
        loadVoices();
      }
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }, [isMounted]);

    // Expose stopSpeaking method via ref
    useImperativeHandle(ref, () => ({
      stopSpeaking: () => {
        if (isStoppedRef.current) return;
        isStoppedRef.current = true;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        if (lottieRef.current) {
          lottieRef.current.pause();
        }
      },
    }));

    useEffect(() => {
      if (!isMounted || !text || !femaleVoice) return;
      isStoppedRef.current = false;
      window.speechSynthesis.cancel();

      const speech = new window.SpeechSynthesisUtterance(text);
      speech.rate = 0.95;
      speech.pitch = 1.1;
      speech.voice = femaleVoice;
      utteranceRef.current = speech;

      speech.onstart = () => {
        setIsSpeaking(true);
        if (lottieRef.current) {
          lottieRef.current.play();
        }
      };
      speech.onend = () => {
        if (isStoppedRef.current) return;
        setIsSpeaking(false);
        if (lottieRef.current) {
          lottieRef.current.pause();
        }
        onSpeakEnd?.();
      };

      window.speechSynthesis.speak(speech);

      return () => {
        window.speechSynthesis.cancel();
        if (lottieRef.current) {
          lottieRef.current.pause();
        }
      };
    }, [text, femaleVoice, isMounted]);

    const svgSize = sizeMap[size];

    if (!isMounted || !animationData) {
      return (
        <div className="flex flex-col items-center justify-center relative">
          <div style={{ width: svgSize, height: svgSize }} className="bg-white/10 rounded-full animate-pulse" />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center relative">
        <div style={{ width: svgSize, height: svgSize }}>
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop={isSpeaking}
            autoplay={false}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        {/* Speaking Indicator */}
        {isSpeaking && (
          <motion.div
            className="mt-1"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          >
            <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto" />
          </motion.div>
        )}
        {voiceError && (
          <div className="text-red-500 text-sm mt-2">No female voice found. Please check your browser's speech settings.</div>
        )}
        {showStopButton && isSpeaking && (
          <button
            type="button"
            onClick={() => {
              if (isStoppedRef.current) return;
              isStoppedRef.current = true;
              window.speechSynthesis.cancel();
              setIsSpeaking(false);
              if (lottieRef.current) {
                lottieRef.current.pause();
              }
            }}
            className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100"
            title="Stop speaking"
          >
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

export default SpeakingAvatar; 