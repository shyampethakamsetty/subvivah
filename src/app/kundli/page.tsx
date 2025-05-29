'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import KundliForm from '@/components/KundliForm';
import jsPDF from 'jspdf';

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
  analysisText?: string;
}

// PlaceAutocomplete component for place suggestions
interface PlaceAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
}
interface NominatimSuggestion {
  display_name: string;
  [key: string]: any;
}
function PlaceAutocomplete({ value, onChange }: PlaceAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debounce function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`
      );
      const data: NominatimSuggestion[] = await res.json();
      setSuggestions(data);
      setShowDropdown(true);
      console.log('Suggestions:', data);
      console.log('Show Dropdown:', true);
    } catch (err) {
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []); // 500ms debounce delay

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onChange(query);
    debouncedFetchSuggestions(query);
  };

  const handleSelect = (place: NominatimSuggestion) => {
    onChange(place.display_name);
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        name="pob"
        value={value}
        onChange={handleInput}
        autoComplete="off"
        required
        placeholder="Enter Place of Birth"
        className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2"
      />
      {loading && (
        <div className="absolute z-10 bg-white border w-full p-2 text-gray-500">Searching...</div>
      )}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full max-h-96 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-purple-100 cursor-pointer text-gray-800"
              onClick={() => handleSelect(s)}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function KundliPage() {
  const [kundliData, setKundliData] = useState<KundliData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gender, setGender] = useState('male');
  const [place, setPlace] = useState('');
  const kundliRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // List of Indian languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'as', name: 'Assamese' },
    { code: 'bn', name: 'Bengali' },
    { code: 'brx', name: 'Bodo' },
    { code: 'doi', name: 'Dogri' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'hi', name: 'Hindi' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ks', name: 'Kashmiri' },
    { code: 'gom', name: 'Konkani' },
    { code: 'mai', name: 'Maithili' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mni', name: 'Manipuri' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ne', name: 'Nepali' },
    { code: 'or', name: 'Odia' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'sa', name: 'Sanskrit' },
    { code: 'sat', name: 'Santali' },
    { code: 'sd', name: 'Sindhi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'ur', name: 'Urdu' }
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName'),
      day: formData.get('day'),
      month: formData.get('month'),
      year: formData.get('year'),
      hrs: formData.get('hrs'),
      min: formData.get('min'),
      sec: formData.get('sec'),
      pob: formData.get('pob'),
      gender: formData.get('gender'),
      language: selectedLanguage,
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

  const handleDownloadPDF = async () => {
    if (!kundliData) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/generate-kundli-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          kundliData,
          language: selectedLanguage 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${kundliData.personalInfo.fullName}-kundli.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white relative">
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
                <label htmlFor="day" className="block text-sm font-medium text-gray-700">
                  Day
                </label>

                <input
                  type="text"
                  name="day"
                  id="day"
                  placeholder='Enter Your Day'
                  required
                  className="mt-1 h-10 block w-full placeholder-gray-50 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                  Month
                </label>

                <input
                  type="text"
                  name="month"
                  id="month"
                  placeholder='Enter Your Month'
                  required
                  className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Year
                </label>

                <input
                  type="text"
                  name="year"
                  id="year"
                  placeholder='Enter Your Year'
                  required
                  className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="hrs" className="block text-sm font-medium text-gray-700">
                  Hrs
                </label>

                <input
                  type="text"
                  name="hrs"
                  id="hrs"
                  placeholder='Enter Your Hrs'
                  required
                  className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="min" className="block text-sm font-medium text-gray-700">
                  Min
                </label>

                <input
                  type="text"
                  name="min"
                  id="min"
                  placeholder='Enter Your Min'
                  required
                  className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="sec" className="block text-sm font-medium text-gray-700">
                  Sec
                </label>

                <input
                  type="text"
                  name="sec"
                  id="sec"
                  placeholder='Enter Your Sec'
                  required
                  className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-[#f9fafb] px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label htmlFor="pob" className="block text-sm font-medium text-gray-700">
                Place of Birth
              </label>
              <PlaceAutocomplete value={place} onChange={setPlace} />
              <input type="hidden" name="pob" value={place} />
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
          <>
            <div ref={kundliRef} className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-purple-900 mb-6">
                Kundli Analysis for {kundliData.personalInfo.fullName}
              </h2>

              {/* Personal Information is always shown */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Date of Birth</p>
                    <p className="font-medium text-gray-800">{kundliData.personalInfo.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time of Birth</p>
                    <p className="font-medium text-gray-800">{kundliData.personalInfo.timeOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Place of Birth</p>
                    <p className="font-medium text-gray-800">{kundliData.personalInfo.placeOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gender</p>
                    <p className="font-medium text-gray-800">{kundliData.personalInfo.gender}</p>
                  </div>
                </div>
              </div>

              {/* Show basic kundli details ONLY if no analysisText is present */}
              {!kundliData.analysisText && (
                <>
                  {/* Ascendant Information */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-purple-800 mb-4">Ascendant (Lagna)</h3>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-lg text-gray-800">
                        <span className="font-medium">Sign:</span> {kundliData.ascendant.sign}
                      </p>
                      <p className="text-lg text-gray-800">
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
                        <p className="text-gray-800">Sign: {kundliData.sunPosition.tropical.sign}</p>
                        <p className="text-gray-800">Degree: {kundliData.sunPosition.tropical.degree.toFixed(2)}°</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Sidereal (Vedic)</h4>
                        <p className="text-gray-800">Sign: {kundliData.sunPosition.sidereal.sign}</p>
                        <p className="text-gray-800">Degree: {kundliData.sunPosition.sidereal.degree.toFixed(2)}°</p>
                        {kundliData.sunPosition.sidereal.nakshatra && (
                          <div className="mt-2">
                            <p className="text-gray-800">Nakshatra: {kundliData.sunPosition.sidereal.nakshatra.name}</p>
                            <p className="text-gray-800">Pada: {kundliData.sunPosition.sidereal.nakshatra.pada}</p>
                            <p className="text-gray-800">Ruler: {kundliData.sunPosition.sidereal.nakshatra.ruler}</p>
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
                          <p className="text-gray-800">Sign: {house.sign}</p>
                          <p className="text-gray-800">Degree: {house.degree.toFixed(2)}°</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ayanamsa */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-purple-800 mb-4">Ayanamsa</h3>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-lg text-gray-800">
                        <span className="font-medium">Value:</span> {kundliData.ayanamsa.toFixed(2)}°
                      </p>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">{kundliData.disclaimer}</p>
                  </div>
                </>
              )}

              {/* Show detailed analysis text if present */}
              {kundliData.analysisText && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">Detailed Analysis</h3>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: kundliData.analysisText }} />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-6 space-x-4">
              <select
                id="language"
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 text-sm"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleDownloadPDF}
                disabled={loading}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Generating PDF...' : 'Download PDF'}
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="text-red-600 mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 