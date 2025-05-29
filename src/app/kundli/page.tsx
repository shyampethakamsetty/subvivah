'use client';

import { useState } from 'react';
import KundliForm from '@/components/KundliForm';

interface KundliData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    gender: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  ascendant: {
    longitude: number;
    sign: string;
    degree: number;
  };
  sunPosition: {
    tropical: {
      longitude: number;
      sign: string;
      degree: number;
    };
    sidereal: {
      longitude: number;
      sign: string;
      degree: number;
      nakshatra: {
        name: string;
        ruler: string;
        pada: number;
      };
    };
  };
  houses: Array<{
    house: number;
    sign: string;
    degree: number;
    name: string;
  }>;
  ayanamsa: number;
  disclaimer: string;
}

export default function KundliPage() {
  const [kundliData, setKundliData] = useState<KundliData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName'),
      dob: formData.get('dob'),
      tob: formData.get('tob'),
      pob: formData.get('pob'),
      gender: formData.get('gender')
    };

    try {
      const response = await fetch('/api/kundli', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate kundli');
      }

      const result = await response.json();
      setKundliData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-purple-900 mb-8">
          Vedic Astrology Kundli
        </h1>
        
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                id="dob"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="tob" className="block text-sm font-medium text-gray-700">
                Time of Birth
              </label>
              <input
                type="time"
                name="tob"
                id="tob"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="pob" className="block text-sm font-medium text-gray-700">
                Place of Birth
              </label>
              <input
                type="text"
                name="pob"
                id="pob"
                required
                placeholder="City, Country"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Kundli'}
            </button>

            {error && (
              <div className="text-red-600 text-sm mt-2">
                {error}
              </div>
            )}
          </form>
        </div>

        {kundliData && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-purple-900 mb-6">
              Kundli Analysis for {kundliData.personalInfo.fullName}
            </h2>

            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Date of Birth</p>
                  <p className="font-medium">{kundliData.personalInfo.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-gray-600">Time of Birth</p>
                  <p className="font-medium">{kundliData.personalInfo.timeOfBirth}</p>
                </div>
                <div>
                  <p className="text-gray-600">Place of Birth</p>
                  <p className="font-medium">{kundliData.personalInfo.placeOfBirth}</p>
                </div>
                <div>
                  <p className="text-gray-600">Gender</p>
                  <p className="font-medium">{kundliData.personalInfo.gender}</p>
                </div>
              </div>
            </div>

            {/* Ascendant Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Ascendant (Lagna)</h3>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-lg">
                  <span className="font-medium">Sign:</span> {kundliData.ascendant.sign}
                </p>
                <p className="text-lg">
                  <span className="font-medium">Degree:</span> {kundliData.ascendant.degree.toFixed(2)}°
                </p>
              </div>
            </div>

            {/* Sun Position */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Sun Position</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Tropical (Western)</h4>
                  <p>Sign: {kundliData.sunPosition.tropical.sign}</p>
                  <p>Degree: {kundliData.sunPosition.tropical.degree.toFixed(2)}°</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Sidereal (Vedic)</h4>
                  <p>Sign: {kundliData.sunPosition.sidereal.sign}</p>
                  <p>Degree: {kundliData.sunPosition.sidereal.degree.toFixed(2)}°</p>
                  {kundliData.sunPosition.sidereal.nakshatra && (
                    <div className="mt-2">
                      <p>Nakshatra: {kundliData.sunPosition.sidereal.nakshatra.name}</p>
                      <p>Pada: {kundliData.sunPosition.sidereal.nakshatra.pada}</p>
                      <p>Ruler: {kundliData.sunPosition.sidereal.nakshatra.ruler}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Houses */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Houses (Bhavas)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {kundliData.houses.map((house) => (
                  <div key={house.house} className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">
                      {house.name}
                    </h4>
                    <p>Sign: {house.sign}</p>
                    <p>Degree: {house.degree.toFixed(2)}°</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ayanamsa */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Ayanamsa</h3>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-lg">
                  <span className="font-medium">Value:</span> {kundliData.ayanamsa.toFixed(2)}°
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">{kundliData.disclaimer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 