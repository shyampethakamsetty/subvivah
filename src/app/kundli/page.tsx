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
  const [gender, setGender] = useState('male');

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
          Get Your Kundli by Date of Birth
        </h1>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8 bg-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder='Enter Your Full Name'
                  required
                  className="mt-1 h-10 block placeholder-gray-200 w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className='flex gap-2'>
                  <div
                    className={`border border-gray-300 rounded-md p-2 w-1/3 cursor-pointer text-center 
                    ${gender === 'male' ? 'bg-purple-600 text-white' : 'bg-white text-black'}`}
                    onClick={() => setGender('male')}
                  >
                    <p>MALE</p>
                  </div>
                  <div
                    className={`border border-gray-300 rounded-md p-2 w-1/3 cursor-pointer text-center 
                     ${gender === 'female' ? 'bg-purple-600 text-white' : 'bg-white text-black'}`}
                    onClick={() => setGender('female')}
                  >
                    <p>FEMALE</p>
                  </div>
                </div>
                <input type="hidden" name="gender" value={gender} />

              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Day
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder='Enter Your Day'
                  id="fullName"
                  required
                  className="mt-1 h-10 block w-full placeholder-gray-50 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Month
                </label>

                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder='Enter Your Month'
                  required
                  className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Year
                </label>

                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder='Enter Your Year'
                  required
                  className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Hrs
                </label>

                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder='Enter Your Hrs'
                  required
                  className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Min
                </label>

                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder='Enter Your Min'
                  required
                  className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Sec
                </label>

                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder='Enter Your Sec'
                  required
                  className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label htmlFor="pob" className="block text-sm font-medium text-gray-700">
                Place of Birth (State, India)
              </label>
              <select
                name="pob"
                id="pob"
                required
                className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                defaultValue=""
              >
                <option value="" disabled>Select State, India</option>
                <option value="Andhra Pradesh, India">Andhra Pradesh, India</option>
                <option value="Arunachal Pradesh, India">Arunachal Pradesh, India</option>
                <option value="Assam, India">Assam, India</option>
                <option value="Bihar, India">Bihar, India</option>
                <option value="Chhattisgarh, India">Chhattisgarh, India</option>
                <option value="Goa, India">Goa, India</option>
                <option value="Gujarat, India">Gujarat, India</option>
                <option value="Haryana, India">Haryana, India</option>
                <option value="Himachal Pradesh, India">Himachal Pradesh, India</option>
                <option value="Jharkhand, India">Jharkhand, India</option>
                <option value="Karnataka, India">Karnataka, India</option>
                <option value="Kerala, India">Kerala, India</option>
                <option value="Madhya Pradesh, India">Madhya Pradesh, India</option>
                <option value="Maharashtra, India">Maharashtra, India</option>
                <option value="Manipur, India">Manipur, India</option>
                <option value="Meghalaya, India">Meghalaya, India</option>
                <option value="Mizoram, India">Mizoram, India</option>
                <option value="Nagaland, India">Nagaland, India</option>
                <option value="Odisha, India">Odisha, India</option>
                <option value="Punjab, India">Punjab, India</option>
                <option value="Rajasthan, India">Rajasthan, India</option>
                <option value="Sikkim, India">Sikkim, India</option>
                <option value="Tamil Nadu, India">Tamil Nadu, India</option>
                <option value="Telangana, India">Telangana, India</option>
                <option value="Tripura, India">Tripura, India</option>
                <option value="Uttar Pradesh, India">Uttar Pradesh, India</option>
                <option value="Uttarakhand, India">Uttarakhand, India</option>
                <option value="West Bengal, India">West Bengal, India</option>
                <option value="Delhi, India">Delhi, India</option>
                <option value="Puducherry, India">Puducherry, India</option>
                <option value="Chandigarh, India">Chandigarh, India</option>
                <option value="Andaman and Nicobar Islands, India">Andaman and Nicobar Islands, India</option>
                <option value="Dadra and Nagar Haveli and Daman and Diu, India">Dadra and Nagar Haveli and Daman and Diu, India</option>
                <option value="Jammu and Kashmir, India">Jammu and Kashmir, India</option>
                <option value="Ladakh, India">Ladakh, India</option>
                <option value="Lakshadweep, India">Lakshadweep, India</option>
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