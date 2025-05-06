'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DatingProfile {
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

// Define a type for Restaurant
interface Restaurant {
  id: string;
  name: string;
}

declare global {
  interface Window {
    WebChat: any;
  }
}

export default function DatingPage() {
  const [profiles, setProfiles] = useState<DatingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [preferences, setPreferences] = useState({
    minAge: 18,
    maxAge: 40,
    gender: 'any',
    location: '',
    interests: [] as string[],
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [tableType, setTableType] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dating?userId=current&page=${page}&limit=10`);
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

  const savePreferences = async () => {
    try {
      const response = await fetch('/api/dating', {
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
        fetchProfiles();
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      // Simulate fetching restaurant data
      const data = {
        restaurants: [
          { id: '1', name: 'Symposium World Cousine, Sector-12 Dwarka Delhi' },
          { id: '2', name: 'Cafe After Hours, Sector-12 Dwarka Delhi' },
          { id: '3', name: 'Panache, Sector 17 Dwarka Delhi' },
        ],
      };
      setRestaurants(data.restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const bookTable = async () => {
    if (!selectedRestaurant || !tableType || !bookingDate || !bookingTime) return;
    try {
      const response = await fetch('/api/book-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: selectedRestaurant.id,
          userId: 'current',
          tableType,
          bookingDate,
          bookingTime,
        }),
      });
      if (response.ok) {
        alert('Table booked successfully!');
      }
    } catch (error) {
      console.error('Error booking table:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchRestaurants();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Match</h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover people who share your interests and values
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Preferences Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age Range</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="number"
                      value={preferences.minAge}
                      onChange={(e) => setPreferences({ ...preferences, minAge: parseInt(e.target.value) })}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={preferences.maxAge}
                      onChange={(e) => setPreferences({ ...preferences, maxAge: parseInt(e.target.value) })}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={preferences.gender}
                    onChange={(e) => setPreferences({ ...preferences, gender: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="any">Any</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={preferences.location}
                    onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Interests</label>
                  <input
                    type="text"
                    value={preferences.interests.join(', ')}
                    onChange={(e) => setPreferences({ ...preferences, interests: e.target.value.split(',').map(i => i.trim()) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter interests (comma separated)"
                  />
                </div>

                <button
                  onClick={savePreferences}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Update Preferences
                </button>
              </div>
            </div>
          </div>

          {/* Profiles Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading profiles...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
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

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}

            {/* Restaurant Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Restaurant</h2>
              <select
                value={selectedRestaurant ? selectedRestaurant.id : ''}
                onChange={(e) => {
                  const restaurant = restaurants.find(r => r.id === e.target.value);
                  if (restaurant) {
                    setSelectedRestaurant(restaurant);
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select a restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                ))}
              </select>

              <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-4">Select Table Type</h2>
              <select
                value={tableType}
                onChange={(e) => setTableType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select table type</option>
                <option value="romantic">Romantic Candle Light</option>
                <option value="others">Others</option>
              </select>

              <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-4">Select Date and Time</h2>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              <input
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />

              <button
                onClick={bookTable}
                disabled={!selectedRestaurant || !tableType || !bookingDate || !bookingTime}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-4"
              >
                Book Table
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 