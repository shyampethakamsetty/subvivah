'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import withAuth from '@/components/withAuth';

interface SearchResult {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  photos: {
    url: string;
    isProfilePhoto: boolean;
  }[];
}

function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    ageRange: [18, 40],
    location: '',
    religion: '',
    education: '',
    occupation: '',
  });

  useEffect(() => {
    fetchSearchResults();
  }, [searchParams]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        minAge: searchParams.ageRange[0].toString(),
        maxAge: searchParams.ageRange[1].toString(),
        location: searchParams.location,
        religion: searchParams.religion,
        education: searchParams.education,
        occupation: searchParams.occupation,
      });

      const response = await fetch(`/api/search?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Search Profiles</h1>
          <p className="mt-4 text-lg text-gray-600">
            Find your perfect match using advanced filters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age Range</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="number"
                      value={searchParams.ageRange[0]}
                      onChange={(e) => setSearchParams({
                        ...searchParams,
                        ageRange: [parseInt(e.target.value), searchParams.ageRange[1]]
                      })}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={searchParams.ageRange[1]}
                      onChange={(e) => setSearchParams({
                        ...searchParams,
                        ageRange: [searchParams.ageRange[0], parseInt(e.target.value)]
                      })}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Religion</label>
                  <input
                    type="text"
                    value={searchParams.religion}
                    onChange={(e) => setSearchParams({ ...searchParams, religion: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter religion"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Education</label>
                  <input
                    type="text"
                    value={searchParams.education}
                    onChange={(e) => setSearchParams({ ...searchParams, education: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter education"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Occupation</label>
                  <input
                    type="text"
                    value={searchParams.occupation}
                    onChange={(e) => setSearchParams({ ...searchParams, occupation: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter occupation"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading results...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No profiles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.map((profile) => (
                  <div key={profile.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative h-64">
                      {profile.photos[0] ? (
                        <Image
                          src={profile.photos[0].url}
                          alt={`${profile.firstName}'s profile`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No photo</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {profile.firstName} {profile.lastName}, {profile.age}
                      </h3>
                      <p className="text-gray-600 mt-1">{profile.location}</p>
                      <p className="text-gray-500 mt-2 line-clamp-2">{profile.bio}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {profile.interests.slice(0, 3).map((interest, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Link
                          href={`/profile/${profile.id}`}
                          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-center block"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SearchPage); 