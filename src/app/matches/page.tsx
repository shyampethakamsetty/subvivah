'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface MatchedProfile {
  id: string;
  userId: string;
  height: string | null;
  maritalStatus: string | null;
  religion: string | null;
  caste: string | null;
  education: string | null;
  occupation: string | null;
  workLocation: string | null;
  aboutMe: string | null;
  user: {
    firstName: string;
    lastName: string;
    dob: string;
    photos: {
      url: string;
      isProfile: boolean;
    }[];
  };
}

interface Match {
  profile: MatchedProfile;
  matchScore: number;
  matchingCriteria: string[];
  isBestMatch: boolean;
}

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

const MatchesPage = () => {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await userResponse.json();

        // Fetch preferences
        const preferencesResponse = await fetch(`/api/preferences?userId=${userData.user.id}`);
        if (preferencesResponse.ok) {
          const prefsData = await preferencesResponse.json();
          setPreferences(prefsData);
        } else if (preferencesResponse.status === 404) {
          router.push('/preferences');
          return;
        }

        // Get all matches
        const matchesResponse = await fetch(`/api/spotlight?userId=${userData.user.id}&all=true`);
        if (!matchesResponse.ok) {
          const errorData = await matchesResponse.json();
          setError(errorData.details || errorData.error || 'Failed to fetch matches');
          return;
        }

        const data = await matchesResponse.json();
        if (!data.matches || data.matches.length === 0) {
          setError('No matches found based on your preferences.');
          return;
        }

        // Sort matches by score, filter for 30% or higher, and mark the best match
        const sortedMatches = data.matches
          .filter((match: any) => match.matchScore >= 30)
          .sort((a: any, b: any) => b.matchScore - a.matchScore)
          .map((match: any, index: number) => ({
            ...match,
            isBestMatch: index === 0
          }));

        if (sortedMatches.length === 0) {
          setError('No matches found with 30% or higher match score. Try updating your preferences to find more matches.');
          return;
        }

        setMatches(sortedMatches);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Matches Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/preferences')}
            className="inline-block w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700"
          >
            Update Preferences
          </button>
        </div>
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

        {/* Spotlight Match */}
        {matches.length > 0 && matches[0].isBestMatch && (
          <div className="mb-8">
            <Link
              href="/matches/matched-profile"
              className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Spotlight Match</h2>
                    <p className="mt-1 text-gray-600">Your best match based on preferences</p>
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                    View Profile
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Display Preferences */}
        {preferences && (
          <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {preferences.ageFrom && preferences.ageTo && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Age Range:</span>
                  <p className="text-gray-900">{preferences.ageFrom} - {preferences.ageTo} years</p>
                </div>
              )}
              {preferences.heightFrom && preferences.heightTo && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Height Range:</span>
                  <p className="text-gray-900">{preferences.heightFrom} - {preferences.heightTo}</p>
                </div>
              )}
              {preferences.maritalStatus && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Marital Status:</span>
                  <p className="text-gray-900">{preferences.maritalStatus}</p>
                </div>
              )}
              {preferences.religion && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Religion:</span>
                  <p className="text-gray-900">{preferences.religion}</p>
                </div>
              )}
              {preferences.caste && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Caste:</span>
                  <p className="text-gray-900">{preferences.caste}</p>
                </div>
              )}
              {preferences.education && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Education:</span>
                  <p className="text-gray-900">{preferences.education}</p>
                </div>
              )}
              {preferences.occupation && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Occupation:</span>
                  <p className="text-gray-900">{preferences.occupation}</p>
                </div>
              )}
              {preferences.location && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Location:</span>
                  <p className="text-gray-900">{preferences.location}</p>
                </div>
              )}
              {preferences.income && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Income:</span>
                  <p className="text-gray-900">{preferences.income}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match.profile.userId}
              className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                match.isBestMatch ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              {/* Profile Image */}
              <div className="relative h-48">
                {match.profile.user.photos?.[0] ? (
                  <Image
                    src={match.profile.user.photos[0].url}
                    alt={`${match.profile.user.firstName}'s profile`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl font-bold text-purple-600">
                          {match.profile.user.firstName[0]}{match.profile.user.lastName[0]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">No photo available</p>
                    </div>
                  </div>
                )}
                
                {/* Best Match Badge */}
                {match.isBestMatch && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold">Best Match</span>
                  </div>
                )}

                {/* Match Score */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-purple-600 px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold">{match.matchScore}% Match</span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {match.profile.user.firstName} {match.profile.user.lastName},{' '}
                  {new Date().getFullYear() - new Date(match.profile.user.dob).getFullYear()}
                </h2>
                
                <p className="text-gray-600 mb-4">{match.profile.occupation}</p>
                
                {/* Matching Criteria */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {match.matchingCriteria.map((criteria, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {criteria}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/matches/matched-profile?userId=${match.profile.userId}`)}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchesPage; 