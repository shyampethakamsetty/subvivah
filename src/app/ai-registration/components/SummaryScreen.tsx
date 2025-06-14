'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SpeakingAvatar from './SpeakingAvatar';

interface SummaryScreenProps {
  onBack: () => void;
  formData: {
    basics: any;
    aiAnswers: string[];
    preferences: Record<number, 'left' | 'right'>;
  };
}

export default function SummaryScreen({ onBack, formData }: SummaryScreenProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateSummary();
  }, []);

  const generateSummary = async () => {
    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setSummary(data.summary);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating summary:', error);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch('/api/user/save-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          summary,
        }),
      });

      // Redirect to profile page or show success message
      window.location.href = '/profile';
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Generating your profile summary...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex flex-col items-center">
        <SpeakingAvatar 
          text="Here's your AI-crafted profile summary. I've combined all your answers and preferences to create a unique profile that represents you." 
          size="md" 
        />

        <h2 className="text-3xl font-bold text-center mb-8 mt-8">
          Your AI-Crafted Profile
        </h2>

        <div className="w-full bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>

        <div className="flex justify-between w-full">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back
          </motion.button>

          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Save Profile
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 