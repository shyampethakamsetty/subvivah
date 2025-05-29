'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import KundliGenerator from '@/components/KundliGenerator';

export default function HoroscopePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    rashi: '',
    nakshatra: '',
    gothra: '',
    manglikStatus: '',
    horoscopeFile: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        horoscopeFile: e.target.files![0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    router.push('/register/complete');
  };

  const rashiOptions = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const nakshatraOptions = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
    'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Kundli Generator */}
          <KundliGenerator />

          {/* Manual Horoscope Details Form */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Horoscope & Kundli Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="timeOfBirth" className="block text-sm font-medium text-gray-700">
                      Time of Birth
                    </label>
                    <input
                      type="time"
                      name="timeOfBirth"
                      id="timeOfBirth"
                      value={formData.timeOfBirth}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700">
                      Place of Birth
                    </label>
                    <input
                      type="text"
                      name="placeOfBirth"
                      id="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="rashi" className="block text-sm font-medium text-gray-700">
                      Rashi (Moon Sign)
                    </label>
                    <select
                      name="rashi"
                      id="rashi"
                      value={formData.rashi}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    >
                      <option value="">Select Rashi</option>
                      {rashiOptions.map(rashi => (
                        <option key={rashi} value={rashi}>{rashi}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="nakshatra" className="block text-sm font-medium text-gray-700">
                      Nakshatra
                    </label>
                    <select
                      name="nakshatra"
                      id="nakshatra"
                      value={formData.nakshatra}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    >
                      <option value="">Select Nakshatra</option>
                      {nakshatraOptions.map(nakshatra => (
                        <option key={nakshatra} value={nakshatra}>{nakshatra}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="gothra" className="block text-sm font-medium text-gray-700">
                      Gothra
                    </label>
                    <input
                      type="text"
                      name="gothra"
                      id="gothra"
                      value={formData.gothra}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="manglikStatus" className="block text-sm font-medium text-gray-700">
                      Manglik Status
                    </label>
                    <select
                      name="manglikStatus"
                      id="manglikStatus"
                      value={formData.manglikStatus}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="partial">Partial</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="horoscopeFile" className="block text-sm font-medium text-gray-700">
                      Upload Horoscope (PDF/JPG/PNG)
                    </label>
                    <input
                      type="file"
                      name="horoscopeFile"
                      id="horoscopeFile"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-pink-50 file:text-pink-700
                        hover:file:bg-pink-100"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 