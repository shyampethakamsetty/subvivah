'use client';

import { useState, useEffect } from 'react';
import UserSearch from '@/components/UserSearch';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Filter, X } from 'lucide-react';
import withAuth from '@/components/withAuth';

interface SearchUser {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  height: string | null;
  maritalStatus: string | null;
  religion: string | null;
  caste: string | null;
  motherTongue: string | null;
  education: string | null;
  occupation: string | null;
  annualIncome: string | null;
  workLocation: string | null;
  photo: string | null;
}

interface QuickSearchUser {
  id: string;
  firstName: string;
  lastName: string;
  photo: string | null;
}

interface SearchFilters {
  ageMin: string;
  ageMax: string;
  heightMin: string;
  heightMax: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  motherTongue: string;
  education: string;
  occupation: string;
  customOccupation: string;
  workLocation: string;
}

function SearchPage() {
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
    perPage: 20
  });
  const [filters, setFilters] = useState<SearchFilters>({
    ageMin: '18',
    ageMax: '70',
    heightMin: '',
    heightMax: '',
    maritalStatus: '',
    religion: '',
    caste: '',
    motherTongue: '',
    education: '',
    occupation: '',
    customOccupation: '',
    workLocation: ''
  });

  const router = useRouter();

  const handleSearch = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        occupation: filters.occupation === 'custom' ? filters.customOccupation : filters.occupation,
        page: page.toString()
      });

      const response = await fetch(`/api/search?${queryParams}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      ageMin: '18',
      ageMax: '70',
      heightMin: '',
      heightMax: '',
      maritalStatus: '',
      religion: '',
      caste: '',
      motherTongue: '',
      education: '',
      occupation: '',
      customOccupation: '',
      workLocation: ''
    });
  };

  const handleQuickSearchUserSelect = (user: QuickSearchUser) => {
    router.push(`/profile/${user.id}`);
  };

  const handleSearchUserSelect = (user: SearchUser) => {
    router.push(`/profile/${user.id}`);
  };

  useEffect(() => {
    handleSearch();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Find Your Perfect Match</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          <div className="mt-4">
            <UserSearch onUserSelect={handleQuickSearchUserSelect} />
          </div>
        </div>

        {showFilters && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Age Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="ageMin"
                    value={filters.ageMin}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  />
                  <input
                    type="number"
                    name="ageMax"
                    value={filters.ageMax}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Height Range</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="heightMin"
                    value={filters.heightMin}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  />
                  <input
                    type="text"
                    name="heightMax"
                    value={filters.heightMax}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={filters.maritalStatus}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                >
                  <option value="">Any</option>
                  <option value="never_married">Never Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Religion</label>
                <select
                  name="religion"
                  value={filters.religion}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                >
                  <option value="">Any</option>
                  <option value="hindu">Hindu</option>
                  <option value="muslim">Muslim</option>
                  <option value="christian">Christian</option>
                  <option value="sikh">Sikh</option>
                  <option value="buddhist">Buddhist</option>
                  <option value="jain">Jain</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Caste</label>
                <input
                  type="text"
                  name="caste"
                  value={filters.caste}
                  onChange={handleFilterChange}
                  placeholder="Enter caste"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Mother Tongue</label>
                <input
                  type="text"
                  name="motherTongue"
                  value={filters.motherTongue}
                  onChange={handleFilterChange}
                  placeholder="Enter mother tongue"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Education</label>
                <select
                  name="education"
                  value={filters.education}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                >
                  <option value="">Any</option>
                  <option value="high_school">High School</option>
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Occupation</label>
                <select
                  name="occupation"
                  value={filters.occupation}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                >
                  <option value="">Any</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Bank Manager">Bank Manager</option>
                  <option value="Government Employee">Government Employee</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Lawyer">Lawyer</option>
                  <option value="Architect">Architect</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Consultant">Consultant</option>
                  <option value="custom">Other (Custom)</option>
                </select>
                {filters.occupation === 'custom' && (
                  <input
                    type="text"
                    name="customOccupation"
                    value={filters.customOccupation}
                    onChange={handleFilterChange}
                    placeholder="Enter custom occupation"
                    className="mt-2 w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Work Location</label>
                <input
                  type="text"
                  name="workLocation"
                  value={filters.workLocation}
                  onChange={handleFilterChange}
                  placeholder="Enter work location"
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-white">Loading...</div>
          ) : users.length === 0 ? (
            <div className="col-span-full text-center text-white">No matches found</div>
          ) : (
            users.map(user => (
              <div
                key={user.id}
                onClick={() => handleSearchUserSelect(user)}
                className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer hover:bg-white/20 transition-colors"
              >
                <div className="aspect-w-3 aspect-h-4 relative">
                  {user.photo ? (
                    <Image
                      src={user.photo}
                      alt={`${user.firstName} ${user.lastName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-white text-4xl">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-300">
                    <p>{user.age} years</p>
                    {user.height && <p>{user.height}</p>}
                    {user.religion && <p>{user.religion}</p>}
                    {user.caste && <p>{user.caste}</p>}
                    {user.education && <p>{user.education}</p>}
                    {user.occupation && <p>{user.occupation}</p>}
                    {user.workLocation && <p>Works in {user.workLocation}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {users.length > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handleSearch(page)}
                className={`px-4 py-2 rounded-lg ${
                  pagination.currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(SearchPage);
