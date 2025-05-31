import React from 'react';
import { Moon, Sun, Stars } from 'lucide-react';
import KundliForm from './KundliForm';
import KundliIntro from './KundliIntro';
import KundliResult from './KundliResult';
import { useZodiac } from '../context/ZodiacContext';

const KundliGenerator: React.FC = () => {
  const { result } = useZodiac();

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`lg:col-span-${result ? '5' : '6'} lg:order-1 order-2`}>
          <KundliIntro />
          <KundliForm />
        </div>
        
        <div className={`lg:col-span-${result ? '7' : '6'} lg:order-2 order-1`}>
          <KundliResult />
        </div>
      </div>
      
      <footer className="mt-16 text-center text-sm text-purple-300 opacity-80">
        <p>© {new Date().getFullYear()} Celestial Insights. All celestial rights reserved.</p>
      </footer>
    </div>
  );
};

export default KundliGenerator;