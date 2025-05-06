'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  profession: string;
  photos: {
    url: string;
  }[];
}

export default function Search() {
  const [filters, setFilters] = useState({
    age: '',
    location: '',
    education: '',
    profession: '',
    religion: '',
    caste: ''
  });
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

  useEffect(() => {
    fetchProfiles();
  }, [filters, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <select
                  name="age"
                  value={filters.age}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">Any</option>
                  <option value="18-25">18-25</option>
                  <option value="26-30">26-30</option>
                  <option value="31-35">31-35</option>
                  <option value="36-40">36-40</option>
                  <option value="41+">41+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Education</label>
                <select
                  name="education"
                  value={filters.education}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">Any</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Profession</label>
                <select
                  name="profession"
                  value={filters.profession}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">Any</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Religion</label>
                <select
                  name="religion"
                  value={filters.religion}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">Any</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Caste</label>
                <select
                  name="caste"
                  value={filters.caste}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">Any</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                </div>
              ) : profiles.length > 0 ? (
                profiles.map((profile) => (
                  <div key={profile.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative h-64">
                      {profile.photos && profile.photos[0] ? (
                        <Image
                          src={profile.photos[0].url}
                          alt={`${profile.firstName} ${profile.lastName}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No photo</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <p className="text-gray-600">{profile.age} years</p>
                      <p className="text-gray-600">{profile.profession}</p>
                      <p className="text-gray-600">{profile.location}</p>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors">
                          View Profile
                        </button>
                        <button className="flex-1 bg-white text-red-500 border border-red-500 py-2 px-4 rounded-md hover:bg-red-50 transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No profiles found matching your criteria</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded-md ${
                        page === pageNum
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 