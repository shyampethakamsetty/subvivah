'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import withAuth from '@/components/withAuth';
import { Sparkles, Heart, MessageCircle } from 'lucide-react';

interface MatchedProfile {
  id: string;
  userId: string;
  height: string | null;
  weight: string | null;
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
      caption?: string;
    }[];
  };
}

interface SpotlightMatch {
  matchScore: number;
  matchingCriteria: string[];
}

interface MatchCriteria {
  name: string;
  score: number;
  matched: boolean;
}

interface AIAnalysis {
  analysis: string;
  userProfile: {
    name: string;
    education: string | null;
    occupation: string | null;
    location: string | null;
    about: string | null;
  };
  matchedProfile: {
    name: string;
    education: string | null;
    occupation: string | null;
    location: string | null;
    about: string | null;
  };
}

function MatchedProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<MatchedProfile | null>(null);
  const [spotlightMatch, setSpotlightMatch] = useState<SpotlightMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const fetchMatchedProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!searchParams) {
          setError('Invalid search parameters');
          return;
        }

        const matchedUserId = searchParams.get('userId');
        if (!matchedUserId) {
          setError('No user ID provided');
          return;
        }

        // Get current user
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await userResponse.json();

        // Get matched profile
        const profileResponse = await fetch(`/api/profiles/${matchedUserId}`);
        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          setError(errorData.details || errorData.error || 'Failed to fetch profile');
          return;
        }

        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Get match details
        const matchResponse = await fetch(`/api/matches/details?userId=${userData.user.id}&matchedUserId=${matchedUserId}`);
        if (matchResponse.ok) {
          const matchData = await matchResponse.json();
        setSpotlightMatch({
            matchScore: matchData.score,
            matchingCriteria: matchData.criteria.map((c: MatchCriteria) => c.name)
        });
        }

        // Fetch AI analysis
        setAnalyzing(true);
        try {
          const analysisResponse = await fetch('/api/ai/match-analysis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userData.user.id,
              matchedUserId: matchedUserId
            })
          });

          if (analysisResponse.ok) {
            const analysisData = await analysisResponse.json();
            setAiAnalysis(analysisData);
          }
        } catch (error) {
          console.error('Error fetching AI analysis:', error);
        } finally {
          setAnalyzing(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedProfile();
  }, [router, searchParams]);

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
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Match Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-4">
            <Link
              href="/preferences"
              className="inline-block w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700"
            >
              Update Preferences
            </Link>
            <Link
              href="/matches"
              className="inline-block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50"
            >
              Back to Matches
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const age = new Date().getFullYear() - new Date(profile.user.dob).getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-96">
            {profile.user.photos?.[0] ? (
              <Image
                src={profile.user.photos[0].url}
                alt={`${profile.user.firstName}'s profile`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold text-purple-600">
                      {profile.user.firstName[0]}{profile.user.lastName[0]}
                    </span>
                  </div>
                  <p className="text-gray-600">No photo available</p>
                </div>
              </div>
            )}
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full">
              {spotlightMatch?.matchScore}% Match
            </div>
          </div>

          {/* Photo Gallery Section */}
          {profile.user.photos && profile.user.photos.length > 1 && (
            <div className="px-8 py-6 border-t border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Photo Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {profile.user.photos.map((photo, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 shadow group flex flex-col">
                    <div className="relative w-full aspect-square">
                      <Image
                        src={photo.url}
                        alt={`Photo ${idx + 1}`}
                        fill
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                        sizes="300px"
                      />
                    </div>
                    {/* Caption if available */}
                    {photo.caption && (
                      <div className="p-2 text-center bg-gradient-to-t from-white/90 to-white/60">
                        <p className="text-xs text-gray-700 truncate">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile.user.firstName} {profile.user.lastName}, {age}
            </h1>

            {/* Matching Criteria */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Matching Criteria</h2>
              <div className="flex flex-wrap gap-2">
                {spotlightMatch?.matchingCriteria.map((criteria: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {criteria}
                  </span>
                ))}
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <dl className="space-y-3">
                  {profile.height && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Height</dt>
                      <dd className="text-gray-900">{profile.height}</dd>
                    </div>
                  )}
                  {profile.weight && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Weight</dt>
                      <dd className="text-gray-900">{profile.weight}</dd>
                    </div>
                  )}
                  {profile.maritalStatus && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Marital Status</dt>
                      <dd className="text-gray-900">{profile.maritalStatus}</dd>
                    </div>
                  )}
                  {profile.religion && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Religion</dt>
                      <dd className="text-gray-900">{profile.religion}</dd>
                    </div>
                  )}
                  {profile.caste && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Caste</dt>
                      <dd className="text-gray-900">{profile.caste}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
                <dl className="space-y-3">
                  {profile.education && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Education</dt>
                      <dd className="text-gray-900">{profile.education}</dd>
                    </div>
                  )}
                  {profile.occupation && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Occupation</dt>
                      <dd className="text-gray-900">{profile.occupation}</dd>
                    </div>
                  )}
                  {profile.workLocation && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Work Location</dt>
                      <dd className="text-gray-900">{profile.workLocation}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* About Me */}
            {profile.aboutMe && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">About Me</h2>
                <p className="text-gray-600">{profile.aboutMe}</p>
              </div>
            )}

            {/* AI Analysis */}
            <div className="mt-8 p-6 bg-purple-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Match Analysis
              </h2>
              {analyzing ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : aiAnalysis ? (
                <div className="prose prose-purple max-w-none">
                  <div className="whitespace-pre-line text-gray-600">
                    {aiAnalysis.analysis}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Unable to generate analysis at this time.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <Link
                href="/matches"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back to Matches
              </Link>
              <button
                onClick={() => {/* Implement interest functionality */}}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Show Interest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(MatchedProfilePage); 