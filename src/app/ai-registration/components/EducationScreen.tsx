"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface EducationScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

const EducationScreen: React.FC<EducationScreenProps> = ({ onNext, onBack }) => {
  const handleNext = () => {
    onNext({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto p-6"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-center text-white mb-6">
          Education
        </h2>
        <div className="text-white/80 text-center mb-8">
          Your education details have already been collected.<br />
          Please proceed to the next step.
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EducationScreen; 