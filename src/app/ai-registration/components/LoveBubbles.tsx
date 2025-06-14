'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function LoveBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // Create initial bubbles
    const initialBubbles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 25 + 15,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 5,
    }));
    setBubbles(initialBubbles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute text-pink-500/50"
          initial={{ y: '100vh', x: `${bubble.x}vw` }}
          animate={{
            y: '-10vh',
            x: [`${bubble.x}vw`, `${bubble.x + (Math.random() * 20 - 10)}vw`],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            fontSize: `${bubble.size}px`,
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
} 