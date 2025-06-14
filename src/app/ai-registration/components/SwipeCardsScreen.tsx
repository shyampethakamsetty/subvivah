'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SwipeCardsScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  aiAnswers: string[];
}

interface Card {
  id: number;
  left: string;
  right: string;
  leftEmoji: string;
  rightEmoji: string;
}

export default function SwipeCardsScreen({ onNext, onBack, aiAnswers }: SwipeCardsScreenProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, 'left' | 'right'>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateCards();
  }, []);

  const generateCards = async () => {
    try {
      const response = await fetch('/api/ai/generate-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aiAnswers }),
      });

      const data = await response.json();
      setCards(data.cards);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating cards:', error);
      setIsLoading(false);
    }
  };

  const handleChoice = (choice: 'left' | 'right') => {
    setSelectedChoices(prev => ({
      ...prev,
      [currentCard]: choice
    }));

    if (currentCard < cards.length - 1) {
      setCurrentCard(prev => prev + 1);
    } else {
      onNext({ preferences: selectedChoices });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Generating your preferences...</p>
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
        <h2 className="text-3xl font-bold text-center mb-8">
          Quick Choices
        </h2>
        
        <p className="text-lg text-gray-600 text-center mb-8">
          Based on what you told us, which do you prefer?
        </p>

        <div className="relative w-full h-[400px] mb-8">
          <AnimatePresence>
            {cards[currentCard] && (
              <motion.div
                key={currentCard}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0"
              >
                <div className="grid grid-cols-2 gap-4 h-full">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChoice('left')}
                    className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:bg-purple-50 transition-colors"
                  >
                    <span className="text-4xl mb-4">{cards[currentCard].leftEmoji}</span>
                    <span className="text-xl font-semibold text-center">
                      {cards[currentCard].left}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChoice('right')}
                    className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:bg-purple-50 transition-colors"
                  >
                    <span className="text-4xl mb-4">{cards[currentCard].rightEmoji}</span>
                    <span className="text-xl font-semibold text-center">
                      {cards[currentCard].right}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

          <div className="text-gray-600">
            {currentCard + 1} of {cards.length}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 