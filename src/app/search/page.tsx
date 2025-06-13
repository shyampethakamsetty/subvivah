'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import StaticSearch from '@/components/StaticSearch';

interface Profile {
  id: string;
  firstName?: string;
  lastName?: string;
  age: number;
  location: string;
  profession: string;
  education: string;
  religion: string;
  caste: string;
  motherTongue: string;
  maritalStatus: string;
  photos: {
    url: string;
  }[];
  user?: {
    firstName: string;
    lastName: string;
  };
}

function AuthenticatedSearch() {
  const [filters, setFilters] = useState({
    age: '',
    location: '',
    education: '',
    profession: '',
    religion: '',
    caste: '',
    motherTongue: '',
    maritalStatus: '',
    height: '',
    weight: '',
    manglikStatus: '',
    rashi: '',
    nakshatra: '',
    occupation: '',
    annualIncome: '',
    workLocation: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: page.toString(),
        limit: '12'
      });

      const response = await fetch(`/api/search?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setProfiles(data.profiles);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center px-2 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950">
      {/* Search Form */}
      <div className="relative z-10 w-full max-w-7xl mx-auto py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, location, or profession..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/5 text-white placeholder-gray-300"
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Basic Filters */}
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Age Range</label>
                  <input
                    type="text"
                    name="age"
                    value={filters.age}
                    onChange={handleFilterChange}
                    placeholder="e.g., 25-35"
                    className="w-full px-3 py-2 border rounded-md bg-white/5 text-white placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City, State"
                    className="w-full px-3 py-2 border rounded-md bg-white/5 text-white placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Education</label>
                  <select
                    name="education"
                    value={filters.education}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border rounded-md bg-white/5 text-white placeholder-gray-300"
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
                  </select>
                </div>

                {/* Professional Details */}
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={filters.occupation}
                    onChange={handleFilterChange}
                    placeholder="Enter occupation"
                    className="w-full px-3 py-2 border rounded-md bg-white/5 text-white placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Annual Income</label>
                  <select
                    name="annualIncome"
                    value={filters.annualIncome}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border rounded-md bg-white/5 text-white placeholder-gray-300"
                  >
                    <option value="">Select Income Range</option>
                    <option value="0-300000">Below 3 LPA</option>
                    <option value="300000-500000">3-5 LPA</option>
                    <option value="500000-800000">5-8 LPA</option>
                    <option value="800000-1200000">8-12 LPA</option>
                    <option value="1200000-1500000">12-15 LPA</option>
                    <option value="1500000-2000000">15-20 LPA</option>
                    <option value="2000000+">Above 20 LPA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Work Location</label>
                  <input
                    type="text"
                    name="workLocation"
                    value={filters.workLocation}
                    onChange={handleFilterChange}
                    placeholder="Enter work location"
                    className="w-full px-3 py-2 border rounded-md bg-white/5 text-white placeholder-gray-300"
                  />
                </div>

                {/* Personal Details */}
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Religion</label>
                  <select
                    name="religion"
                    value={filters.religion}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border rounded-md bg-white/5 text-white placeholder-gray-300"
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
                  <label className="block text-sm font-medium text-white mb-1">Caste</label>
                  <input
                    type="text"
                    name="caste"
                    value={filters.caste}
                    onChange={handleFilterChange}
                    placeholder="Enter caste"
                    className="w-full px-3 py-2 border rounded-md bg-white/5 text-white placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Mother Tongue</label>
                  <input
                    type="text"
                    name="motherTongue"
                    value={filters.motherTongue}
                    onChange={handleFilterChange}
                    placeholder="Enter mother tongue"
                    className="w-full px-3 py-2 border rounded-md bg-white/5 text-white placeholder-gray-300"
                  />
                </div>

                {/* Horoscope Details */}
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Rashi</label>
                  <select
                    name="rashi"
                    value={filters.rashi}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border rounded-md bg-white/5 text-white placeholder-gray-300"
                  >
                    <option value="">Select Rashi</option>
                    <option value="aries">Aries</option>
                    <option value="taurus">Taurus</option>
                    <option value="gemini">Gemini</option>
                    <option value="cancer">Cancer</option>
                    <option value="leo">Leo</option>
                    <option value="virgo">Virgo</option>
                    <option value="libra">Libra</option>
                    <option value="scorpio">Scorpio</option>
                    <option value="sagittarius">Sagittarius</option>
                    <option value="capricorn">Capricorn</option>
                    <option value="aquarius">Aquarius</option>
                    <option value="pisces">Pisces</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Manglik Status</label>
                  <select
                    name="manglikStatus"
                    value={filters.manglikStatus}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border rounded-md bg-white/5 text-white placeholder-gray-300"
                  >
                    <option value="">Select Status</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Height Range (cm)</label>
                  <input
                    type="text"
                    name="height"
                    value={filters.height}
                    onChange={handleFilterChange}
                    placeholder="e.g., 160-180"
                    className="w-full px-3 py-2 border rounded-md bg-white/5 text-white placeholder-gray-300"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={fetchProfiles}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Applying Filters...
                    </>
                  ) : (
                    'Apply Filters'
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Results Section */}
        <div className="mt-8">
          {loading ? (
            <div className="relative min-h-[300px] flex items-center justify-center">
              {/* Blurred overlay */}
              <div className="absolute inset-0 backdrop-blur-md z-0 rounded-xl" />
              {/* Professional SVG spinner */}
              <div className="relative z-10 flex flex-col items-center">
                <svg className="animate-spin h-14 w-14 text-purple-300 mb-4" viewBox="0 0 50 50">
                  <circle className="opacity-20" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" />
                  <circle className="opacity-70" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="31.4 94.2" />
                </svg>
                <span className="text-purple-200 text-lg font-medium animate-pulse">Loading profiles...</span>
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {profiles.length === 0 && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        y: {
                          type: "spring",
                          stiffness: 100,
                          damping: 20
                        },
                        opacity: {
                          duration: 0.8
                        }
                      }
                    }}
                    exit={{ opacity: 0, y: 50 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <motion.div
                      animate={{
                        y: [0, -15, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Image
                        src="/Beach wedding-amico.svg"
                        alt="Beach Wedding Illustration"
                        width={400}
                        height={400}
                        className="mb-4"
                      />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-600 text-lg text-center"
                    >
                      {showFilters ? 'Apply filters to find your perfect match' : 'Click "Show Filters" to start your search'}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {profiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {profiles.map((profile) => (
                    <div key={profile.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="relative h-48">
                        {profile.photos?.[0] ? (
                          <Image
                            src={profile.photos[0].url}
                            alt={`${profile.user?.firstName || ''} ${profile.user?.lastName || ''}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl font-bold text-purple-600">
                                  {profile.user?.firstName?.[0] || ''}{profile.user?.lastName?.[0] || ''}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm">No photo available</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {profile.user?.firstName || ''} {profile.user?.lastName || ''}
                        </h3>
                        <p className="text-gray-600">{profile.age} years</p>
                        <p className="text-gray-600">{profile.location}</p>
                        <p className="text-gray-600">{profile.profession}</p>
                        <Link
                          href={`/profile/${profile.id}`}
                          className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function SearchPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        
        if (!data.isAuthenticated) {
          // Show login popup after 4 seconds
          const timer = setTimeout(() => {
            if (typeof window !== 'undefined' && typeof (window as any).showLoginPopup === 'function') {
              (window as any).showLoginPopup();
            }
          }, 4000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md z-0" />
        <div className="relative z-10 flex flex-col items-center">
          <svg className="animate-spin h-14 w-14 text-purple-300 mb-4" viewBox="0 0 50 50">
            <circle className="opacity-20" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" />
            <circle className="opacity-70" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="31.4 94.2" />
          </svg>
          <span className="text-purple-200 text-lg font-medium animate-pulse">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <StaticSearch />;
  }

  return <AuthenticatedSearch />;
} 