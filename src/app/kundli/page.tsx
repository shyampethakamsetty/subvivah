'use client';

import { useState } from 'react';
import withAuth from '@/components/withAuth';

interface KundliData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  gender: string;
}

interface KundliResult {
  planetaryPositions: Record<string, string>;
  houseAnalysis: string[];
  compatibilityAnalysis: string;
  lifePathAnalysis: string;
}

function KundliPage() {
  const [kundliData, setKundliData] = useState<KundliData>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    gender: 'male',
  });
  const [loading, setLoading] = useState(false);
  const [kundliResult, setKundliResult] = useState<KundliResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/kundli/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kundliData),
      });

      if (response.ok) {
        const data = await response.json();
        setKundliResult(data);
      }
    } catch (error) {
      console.error('Error generating Kundli:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Kundli Generator</h1>
          <p className="mt-4 text-lg text-gray-600">
            Generate your detailed Kundli analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kundli Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Enter Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={kundliData.name}
                  onChange={(e) => setKundliData({ ...kundliData, name: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={kundliData.dateOfBirth}
                  onChange={(e) => setKundliData({ ...kundliData, dateOfBirth: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time of Birth</label>
                <input
                  type="time"
                  value={kundliData.timeOfBirth}
                  onChange={(e) => setKundliData({ ...kundliData, timeOfBirth: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Place of Birth</label>
                <input
                  type="text"
                  value={kundliData.placeOfBirth}
                  onChange={(e) => setKundliData({ ...kundliData, placeOfBirth: e.target.value })}
                  required
                  placeholder="City, State, Country"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={kundliData.gender}
                  onChange={(e) => setKundliData({ ...kundliData, gender: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Kundli'}
              </button>
            </form>
          </div>

          {/* Kundli Results */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Kundli Analysis</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Generating your Kundli...</p>
              </div>
            ) : kundliResult ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Planetary Positions</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    {Object.entries(kundliResult.planetaryPositions).map(([planet, position]) => (
                      <div key={planet} className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-900">{planet}</p>
                        <p className="text-sm text-gray-600">{position}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">House Analysis</h3>
                  <div className="mt-2 space-y-3">
                    {kundliResult.houseAnalysis.map((house, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-900">House {index + 1}</p>
                        <p className="text-sm text-gray-600">{house}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Compatibility Analysis</h3>
                  <p className="mt-2 text-sm text-gray-600">{kundliResult.compatibilityAnalysis}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Life Path Analysis</h3>
                  <p className="mt-2 text-sm text-gray-600">{kundliResult.lifePathAnalysis}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Enter your details to generate your Kundli
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(KundliPage); 