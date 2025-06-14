'use client';

import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';

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
    const [mouthOpen, setMouthOpen] = useState(false);
    const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [voiceError, setVoiceError] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const isStoppedRef = useRef(false);

    // Wait for voices to load and select a female voice
    useEffect(() => {
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
    }, []);

    // Expose stopSpeaking method via ref
    useImperativeHandle(ref, () => ({
      stopSpeaking: () => {
        if (isStoppedRef.current) return;
        isStoppedRef.current = true;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setMouthOpen(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      },
    }));

    useEffect(() => {
      if (!text || !femaleVoice) return;
      isStoppedRef.current = false;
      window.speechSynthesis.cancel();

      const speech = new window.SpeechSynthesisUtterance(text);
      speech.rate = 0.95;
      speech.pitch = 1.1;
      speech.voice = femaleVoice;
      utteranceRef.current = speech;

      speech.onstart = () => {
        setIsSpeaking(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setMouthOpen(prev => !prev);
        }, 120);
      };
      speech.onend = () => {
        if (isStoppedRef.current) return;
        setIsSpeaking(false);
        setMouthOpen(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        onSpeakEnd?.();
      };

      window.speechSynthesis.speak(speech);

      return () => {
        window.speechSynthesis.cancel();
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [text, femaleVoice]);

    const svgSize = sizeMap[size];

    return (
      <div className="flex flex-col items-center justify-center relative">
        <svg width={svgSize} height={svgSize} viewBox="0 0 128 128" className="mb-2">
          {/* Head */}
          <ellipse cx="64" cy="64" rx="60" ry="60" fill="#f9e2e7" stroke="#e0bfcf" strokeWidth="4" />
          {/* Eyes */}
          <ellipse cx="48" cy="60" rx="7" ry="10" fill="#222" />
          <ellipse cx="80" cy="60" rx="7" ry="10" fill="#222" />
          {/* Smile (mouth) */}
          <motion.ellipse
            cx="64"
            cy={mouthOpen ? 92 : 96}
            rx="18"
            ry={mouthOpen ? 12 : 4}
            fill="#d16d8a"
            animate={{ ry: mouthOpen ? 12 : 4, cy: mouthOpen ? 92 : 96 }}
            transition={{ duration: 0.1 }}
          />
          {/* Cheeks */}
          <ellipse cx="38" cy="80" rx="5" ry="2.5" fill="#f7b6c2" />
          <ellipse cx="90" cy="80" rx="5" ry="2.5" fill="#f7b6c2" />
        </svg>
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
              setMouthOpen(false);
              if (intervalRef.current) clearInterval(intervalRef.current);
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