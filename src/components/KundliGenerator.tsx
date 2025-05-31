'use client';

import React, { useState } from 'react';
import { Moon, Sun, Stars } from 'lucide-react';
import KundliForm from './KundliForm';
import KundliIntro from './KundliIntro';
import KundliResult from './KundliResult';
import { useZodiac } from '../context/ZodiacContext';

const containers = [
  { component: <KundliIntro />, label: 'Intro' },
  { component: <KundliForm />, label: 'Form' },
  { component: <KundliResult />, label: 'Result' },
];

const KundliGenerator: React.FC = () => {
  const { result } = useZodiac();
  // If result is available, always focus on the result container
  const [active, setActive] = useState(0);

  // If result is available, focus on result
  React.useEffect(() => {
    if (result) setActive(2);
  }, [result]);

  const prev = () => setActive((prev) => (prev === 0 ? 2 : prev - 1));
  const next = () => setActive((prev) => (prev === 2 ? 0 : prev + 1));

  // Calculate positions for coverflow effect
  const getPosition = (idx: number) => {
    if (idx === active) return 'center';
    if ((active === 0 && idx === 2) || idx === active - 1) return 'left';
    return 'right';
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 relative">
        <div className="absolute top-0 left-0 opacity-30">
          <Stars size={24} />
        </div>
        <div className="flex justify-center items-center gap-3 mb-2">
          <Sun className="text-amber-300" size={28} />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-purple-200">
            Celestial Birth Chart
          </h1>
          <Moon className="text-blue-200" size={24} />
        </div>
        <p className="text-lg text-purple-200 max-w-2xl mx-auto">
          Discover your cosmic blueprint and the celestial influences that shape your life journey
        </p>
      </header>

      <div className="flex flex-col items-center justify-center min-h-[160vh]">
        <div className="relative flex items-center justify-center w-full max-w-4xl h-[500px]">
          {containers.map((c, idx) => {
            const pos = getPosition(idx);
            let className =
              'absolute transition-all duration-500 ease-in-out flex items-center justify-center';
            if (pos === 'center') {
              className += ' left-1/2 -translate-x-1/2 z-20 scale-100 w-[650px] h-[100px]';
            } else if (pos === 'left') {
              className += ' left-0 z-10 scale-75 opacity-10 w-[500px] h-[50px]';
            } else {
              className += ' right-0 z-10 scale-75 opacity-10 w-[500px] h-[10px]';
            }
            return (
              <div key={c.label} className={className} style={{ pointerEvents: pos === 'center' ? 'auto' : 'none' }}>
                {c.component}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between w-full max-w-4xl mt-4">
          <button onClick={prev} className="px-4 py-2 rounded bg-purple-700 text-white">Previous</button>
          <button onClick={next} className="px-4 py-2 rounded bg-purple-700 text-white">Next</button>
        </div>
      </div>
      
      <footer className="mt-16 text-center text-sm text-purple-300 opacity-80">
        <p>© {new Date().getFullYear()} Celestial Insights. All celestial rights reserved.</p>
      </footer>
    </div>
  );
};

export default KundliGenerator;