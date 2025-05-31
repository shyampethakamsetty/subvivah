import React from 'react';
import { useZodiac } from '../context/ZodiacContext';
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sun, 
  Moon, 
  ArrowUp, 
  Share2, 
  Download,
  RefreshCw
} from 'lucide-react';
import PlanetInfo from './PlanetInfo';
import ZodiacChart from './ZodiacChart';

const KundliResult: React.FC = () => {
  const { result, clearResult } = useZodiac();

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="relative">
          <div className="w-60 h-60 mx-auto">
            <ZodiacChart isPlaceholder />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-center text-purple-300 text-lg bg-indigo-950/70 backdrop-blur-sm p-4 rounded-lg">
              Your birth chart will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-500/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] opacity-5 bg-cover bg-center"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sun className="text-amber-300" size={20} />
            <span>Your Celestial Blueprint</span>
          </h2>
          
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-purple-800/50 hover:bg-purple-700/70 transition-colors" 
                    title="Share Birth Chart">
              <Share2 size={18} />
            </button>
            <button className="p-2 rounded-full bg-purple-800/50 hover:bg-purple-700/70 transition-colors" 
                    title="Download Birth Chart">
              <Download size={18} />
            </button>
            <button 
              className="p-2 rounded-full bg-purple-800/50 hover:bg-purple-700/70 transition-colors" 
              title="Start New Chart"
              onClick={clearResult}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-indigo-950/60 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-3 text-purple-200">Birth Details</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-purple-300" />
                  <span className="text-purple-300">Name:</span>
                  <span className="text-white font-medium">{result.birthDetails.fullName}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-purple-300" />
                  <span className="text-purple-300">Date of Birth:</span>
                  <span className="text-white font-medium">{result.birthDetails.dob}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-purple-300" />
                  <span className="text-purple-300">Time of Birth:</span>
                  <span className="text-white font-medium">{result.birthDetails.tob}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-purple-300" />
                  <span className="text-purple-300">Place of Birth:</span>
                  <span className="text-white font-medium">{result.birthDetails.pob}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-purple-300" />
                  <span className="text-purple-300">Gender:</span>
                  <span className="text-white font-medium capitalize">{result.birthDetails.gender}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-950/60 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3 text-purple-200">Key Positions</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ArrowUp size={16} className="text-amber-300" />
                  <span className="text-purple-300">Ascendant (Rising Sign):</span>
                  <span className="text-white font-medium">{result.ascendant}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Sun size={16} className="text-amber-300" />
                  <span className="text-purple-300">Sun Sign:</span>
                  <span className="text-white font-medium">{result.planets.sun.sign}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Moon size={16} className="text-blue-200" />
                  <span className="text-purple-300">Moon Sign:</span>
                  <span className="text-white font-medium">{result.planets.moon.sign}</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Object.entries(result.planets).map(([planet, data]: [string, any]) => (
                  <PlanetInfo 
                    key={planet} 
                    planet={planet} 
                    sign={data.sign} 
                    house={data.house}
                    degree={data.degree}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="aspect-square relative">
              <ZodiacChart />
            </div>
            
            <div className="bg-indigo-950/60 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3 text-purple-200">Celestial Insights</h3>
              
              <div className="space-y-4">
                {Object.entries(result.predictions).map(([area, prediction]: [string, any]) => (
                  <div key={area} className="border-l-2 border-purple-500 pl-3">
                    <h4 className="text-amber-200 font-medium capitalize mb-1">{area}</h4>
                    <p className="text-sm text-purple-100">{prediction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KundliResult;