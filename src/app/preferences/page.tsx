'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Preferences {
  ageFrom: number | null;
  ageTo: number | null;
  heightFrom: string | null;
  heightTo: string | null;
  maritalStatus: string | null;
  religion: string | null;
  caste: string | null;
  education: string | null;
  occupation: string | null;
  location: string | null;
  income: string | null;
}

export default function PreferencesPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<Preferences>({
    ageFrom: null,
    ageTo: null,
    heightFrom: null,
    heightTo: null,
    maritalStatus: null,
    religion: null,
    caste: null,
    education: null,
    occupation: null,
    location: null,
    income: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/preferences?userId=current');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate age range
    if (preferences.ageFrom && preferences.ageTo && preferences.ageFrom > preferences.ageTo) {
      alert('Age "From" must be less than Age "To"');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'current',
          ...preferences,
        }),
      });

      if (response.ok) {
        router.push('/dating');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Partner Preferences</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Age Range */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Age Range</label>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={preferences.ageFrom || ''}
                    onChange={(e) => setPreferences({ ...preferences, ageFrom: parseInt(e.target.value) || null })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    placeholder="From"
                  />
                  <input
                    type="number"
                    value={preferences.ageTo || ''}
                    onChange={(e) => setPreferences({ ...preferences, ageTo: parseInt(e.target.value) || null })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    placeholder="To"
                  />
                </div>
              </div>

              {/* Height Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Height Range</label>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={preferences.heightFrom || ''}
                    onChange={(e) => setPreferences({ ...preferences, heightFrom: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    placeholder="From (e.g., 5'6)"
                  />
                  <input
                    type="text"
                    value={preferences.heightTo || ''}
                    onChange={(e) => setPreferences({ ...preferences, heightTo: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    placeholder="To (e.g., 6'0)"
                  />
                </div>
              </div>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Marital Status</label>
              <select
                value={preferences.maritalStatus || ''}
                onChange={(e) => setPreferences({ ...preferences, maritalStatus: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              >
                <option value="">Select marital status</option>
                <option value="never_married">Never Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="awaiting_divorce">Awaiting Divorce</option>
              </select>
            </div>

            {/* Religion and Caste */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Religion</label>
                <select
                  value={preferences.religion || ''}
                  onChange={(e) => setPreferences({ ...preferences, religion: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  <option value="">Select Religion</option>
                  <option value="hindu">Hindu</option>
                  <option value="muslim">Muslim</option>
                  <option value="christian">Christian</option>
                  <option value="sikh">Sikh</option>
                  <option value="jain">Jain</option>
                  <option value="buddhist">Buddhist</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Caste</label>
                <input
                  type="text"
                  value={preferences.caste || ''}
                  onChange={(e) => setPreferences({ ...preferences, caste: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  placeholder="Enter preferred caste"
                />
              </div>
            </div>

            {/* Education and Occupation */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Education</label>
                <select
                  value={preferences.education || ''}
                  onChange={(e) => setPreferences({ ...preferences, education: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  <option value="">Select Education</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="MBBS">MBBS</option>
                  <option value="B.Com">B.Com</option>
                  <option value="BBA">BBA</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="Ph.D">Ph.D</option>
                  <option value="CA">CA</option>
                  <option value="LLB">LLB</option>
                  <option value="B.Arch">B.Arch</option>
                  <option value="BDS">BDS</option>
                  <option value="B.Pharm">B.Pharm</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="high_school">High School</option>
                  <option value="any">Any</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Occupation</label>
                <input
                  type="text"
                  value={preferences.occupation || ''}
                  onChange={(e) => setPreferences({ ...preferences, occupation: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  placeholder="Enter preferred occupation"
                />
              </div>
            </div>

            {/* Location and Income */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Location</label>
                <input
                  type="text"
                  value={preferences.location || ''}
                  onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  placeholder="Enter preferred work location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Annual Income Range</label>
                <select
                  value={preferences.income || ''}
                  onChange={(e) => setPreferences({ ...preferences, income: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  <option value="">Select Income Range</option>
                  <option value="0-3">Below 3 LPA</option>
                  <option value="3-5">3-5 LPA</option>
                  <option value="5-8">5-8 LPA</option>
                  <option value="8-12">8-12 LPA</option>
                  <option value="12-15">12-15 LPA</option>
                  <option value="15-20">15-20 LPA</option>
                  <option value="20+">Above 20 LPA</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dating')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 