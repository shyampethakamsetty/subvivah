'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import withAuth from '@/components/withAuth';
import UserSearch from '@/components/UserSearch';

interface Match {
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
  matchPercentage: number;
}

function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const handleUserSelect = (userId: string) => {
    // Navigate to the selected user's profile
    window.location.href = `/profile/${userId}`;
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/matches');
        if (response.ok) {
          const data = await response.json();
          setMatches(data.matches);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Your Matches</h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover people who match your preferences
          </p>
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <UserSearch onUserSelect={handleUserSelect} />
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No matches found yet. Try updating your preferences!</p>
            <Link
              href="/profile"
              className="mt-4 inline-block bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
            >
              Update Preferences
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-64">
                  {match.photos[0] ? (
                    <Image
                      src={match.photos[0].url}
                      alt={`${match.firstName}'s profile`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No photo</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-sm">
                    {match.matchPercentage}% Match
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {match.firstName} {match.lastName}, {match.age}
                  </h3>
                  <p className="text-gray-600 mt-1">{match.location}</p>
                  <p className="text-gray-500 mt-2 line-clamp-2">{match.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {match.interests.slice(0, 3).map((interest, index) => (
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
                      href={`/profile/${match.id}`}
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
  );
}

export default withAuth(MatchesPage); 