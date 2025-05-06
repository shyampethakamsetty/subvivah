'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PDFDownloadLink } from '@react-pdf/renderer';
import KundliPDF from './KundliPDF';

interface KundliData {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

interface GeneratedKundli {
  rashi: string;
  nakshatra: string;
  gothra: string;
  manglikStatus: string;
  planetaryPositions: {
    sun: string;
    moon: string;
    mars: string;
    mercury: string;
    jupiter: string;
    venus: string;
    saturn: string;
    rahu: string;
    ketu: string;
  };
  predictions: {
    career: string;
    marriage: string;
    health: string;
    wealth: string;
  };
  doshas: {
    mangal: string;
    kaalSarpa: string;
    pitru: string;
    nadi: string;
  };
  gemstones: string[];
  remedies: string[];
  detailedAnalysis: {
    personality: string;
    education: string;
    family: string;
    relationships: string;
    careerProspects: string;
    healthAspects: string;
    financialProspects: string;
    remedies: string[];
  };
  compatibility: {
    bestMatches: string[];
    avoidMatches: string[];
    compatibilityScore: number;
  };
  auspiciousTimings: {
    marriage: string;
    career: string;
    education: string;
    travel: string;
  };
}

export default function KundliGenerator() {
  const [formData, setFormData] = useState<KundliData>({
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
  });

  const [generatedKundli, setGeneratedKundli] = useState<GeneratedKundli | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Sample detailed kundli data
    const kundli: GeneratedKundli = {
      rashi: 'Mithuna (Gemini)',
      nakshatra: 'Ardra',
      gothra: 'Kashyap',
      manglikStatus: 'Non-Manglik',
      planetaryPositions: {
        sun: 'Taurus (Vrishabha) - 2nd House',
        moon: 'Gemini (Mithuna) - 3rd House',
        mars: 'Leo (Simha) - 5th House',
        mercury: 'Taurus (Vrishabha) - 2nd House',
        jupiter: 'Cancer (Karka) - 4th House',
        venus: 'Aries (Mesha) - 1st House',
        saturn: 'Libra (Tula) - 7th House',
        rahu: 'Pisces (Meena) - 12th House',
        ketu: 'Virgo (Kanya) - 6th House',
      },
      predictions: {
        career: 'Strong potential in communication and creative fields. Good opportunities in media, writing, and education. Leadership qualities will develop with time.',
        marriage: 'Marriage prospects are favorable. Partner will be supportive and understanding. Best marriage period between 28-32 years.',
        health: 'Generally good health. Need to take care of respiratory system and maintain regular exercise routine.',
        wealth: 'Steady financial growth. Good opportunities for wealth accumulation through career and investments.',
      },
      doshas: {
        mangal: 'No Mangal Dosha',
        kaalSarpa: 'Partial Kaal Sarpa Yoga',
        pitru: 'No Pitru Dosha',
        nadi: 'Adi Nadi'
      },
      gemstones: [
        'Pearl (Moti)',
        'Moonstone',
        'White Sapphire'
      ],
      remedies: [
        'Wear Emerald (Panna) for Mercury',
        'Donate green items on Wednesdays',
        'Chant Mercury Mantra daily',
        'Keep a small plant in the study area',
      ],
      detailedAnalysis: {
        personality: 'Intelligent, communicative, and adaptable. Strong analytical skills with a creative streak. Natural ability to connect with people.',
        education: 'Good academic potential. Strong in languages and communication skills. Higher education will be beneficial.',
        family: 'Strong family support. Good relationships with siblings. Parents will be supportive of decisions.',
        relationships: 'Good social skills. Will maintain strong friendships. Romantic relationships will be meaningful and long-lasting.',
        careerProspects: 'Multiple career options available. Success in fields requiring communication and analytical skills. Good leadership potential.',
        healthAspects: 'Generally good health. Need to maintain regular exercise and balanced diet. Pay attention to respiratory health.',
        financialProspects: 'Steady income growth. Good investment opportunities. Financial stability achievable through careful planning.',
        remedies: [
          'Wear Emerald (Panna) for Mercury',
          'Donate green items on Wednesdays',
          'Chant Mercury Mantra daily',
          'Keep a small plant in the study area',
        ],
      },
      compatibility: {
        bestMatches: ['Virgo', 'Capricorn', 'Taurus'],
        avoidMatches: ['Sagittarius', 'Pisces'],
        compatibilityScore: 85,
      },
      auspiciousTimings: {
        marriage: '2025-2026',
        career: '2024 onwards',
        education: '2023-2024',
        travel: '2024-2025',
      },
    };

    setGeneratedKundli(kundli);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          Generate Your Kundli
        </h2>
        
        {!generatedKundli ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Time of Birth</label>
              <input
                type="time"
                value={formData.timeOfBirth}
                onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Place of Birth</label>
              <input
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="Enter city and country"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate Kundli'}
            </button>
          </form>
        ) : (
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Rashi (Moon Sign)</p>
                  <p className="font-semibold">{generatedKundli.rashi}</p>
                </div>
                <div>
                  <p className="text-gray-600">Nakshatra</p>
                  <p className="font-semibold">{generatedKundli.nakshatra}</p>
                </div>
                <div>
                  <p className="text-gray-600">Gothra</p>
                  <p className="font-semibold">{generatedKundli.gothra}</p>
                </div>
                <div>
                  <p className="text-gray-600">Manglik Status</p>
                  <p className="font-semibold">{generatedKundli.manglikStatus}</p>
                </div>
              </div>
            </div>

            {/* Planetary Positions */}
            <div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Planetary Positions</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(generatedKundli.planetaryPositions).map(([planet, position]) => (
                  <div key={planet} className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-600 capitalize">{planet}</p>
                    <p className="font-semibold">{position}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Analysis */}
            <div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Detailed Analysis</h3>
              <div className="space-y-4">
                {Object.entries(generatedKundli.detailedAnalysis).map(([aspect, description]) => (
                  <div key={aspect} className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-purple-700 capitalize">{aspect}</h4>
                    <p className="text-gray-600 mt-2">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compatibility */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Compatibility</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Best Matches</p>
                  <p className="font-semibold">{generatedKundli.compatibility.bestMatches.join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Avoid Matches</p>
                  <p className="font-semibold">{generatedKundli.compatibility.avoidMatches.join(', ')}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Compatibility Score</p>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-purple-600 h-4 rounded-full"
                      style={{ width: `${generatedKundli.compatibility.compatibilityScore}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{generatedKundli.compatibility.compatibilityScore}%</p>
                </div>
              </div>
            </div>

            {/* Auspicious Timings */}
            <div>
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Auspicious Timings</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(generatedKundli.auspiciousTimings).map(([event, timing]) => (
                  <div key={event} className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-600 capitalize">{event}</p>
                    <p className="font-semibold">{timing}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Remedies */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Remedies</h3>
              <ul className="list-disc list-inside space-y-2">
                {generatedKundli.detailedAnalysis.remedies.map((remedy, index) => (
                  <li key={index} className="text-gray-600">{remedy}</li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setGeneratedKundli(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Generate New Kundli
              </button>
              <PDFDownloadLink
                document={<KundliPDF kundliData={formData} generatedKundli={generatedKundli} />}
                fileName="kundli-report.pdf"
              >
                {({ loading }) => (
                  <button
                    className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    disabled={loading}
                  >
                    {loading ? 'Preparing PDF...' : 'Download PDF'}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 