'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

interface SpotlightMatch {
  matchScore: number;
  matchingCriteria: string[];
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

const getCompatibilityCaption = (score: number, criteria: string[]) => {
  if (score >= 90) {
    return "Perfect match! You share many common interests and values.";
  } else if (score >= 80) {
    return "Great match! You both match on " + criteria.slice(0, 2).join(" and ") + "!";
  } else if (score >= 70) {
    return "Good match! You have similar preferences in " + criteria[0] + ".";
  } else {
    return "Potential match! Explore more to discover common interests.";
  }
};

const DailySuggestionBubble = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<MatchedProfile | null>(null);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [matchingCriteria, setMatchingCriteria] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const fetchMatchedProfile = async () => {
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

        // Get spotlight match
        const spotlightResponse = await fetch(`/api/spotlight?userId=${userData.user.id}`);
        if (!spotlightResponse.ok) {
          const errorData = await spotlightResponse.json();
          if (errorData.error === 'No suitable matches found') {
            setError('No matches found based on your preferences.');
          } else {
            setError(errorData.details || errorData.error || 'Failed to fetch matched profile');
          }
          return;
        }

        const data = await spotlightResponse.json();
        if (!data.matchedProfile) {
          setError('No matches found based on your preferences.');
          return;
        }

        setMatchedProfile(data.matchedProfile);
        setMatchScore(data.matchScore);
        setMatchingCriteria(data.matchingCriteria);

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
              matchedUserId: data.matchedProfile.userId
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

        // Show popup after 4 seconds
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 4000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error fetching matched profile:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch matched profile');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedProfile();
  }, [router]);

  const togglePopup = () => {
    if (isOpen) {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
    setIsOpen(!isOpen);
  };

  const handleViewProfile = () => {
    if (matchedProfile) {
      router.push('/matches/matched-profile');
    }
  };

  // Add this function to get initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  if (!matchedProfile) {
    return null;
  }

  const age = new Date().getFullYear() - new Date(matchedProfile.user.dob).getFullYear();
  const profileImage = matchedProfile.user.photos?.[0]?.url || 'https://randomuser.me/api/portraits/lego/1.jpg';
  const caption = getCompatibilityCaption(matchScore, matchingCriteria);

  return (
    <>
      {/* Floating Bubble */}
      <button
        onClick={togglePopup}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group"
      >
        <div className="relative">
          <Sparkles className="h-5 w-5 transform group-hover:rotate-12 transition-transform duration-300" fill="currentColor" />
          <span className="absolute -top-1 -right-1 bg-white text-pink-500 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            !
          </span>
        </div>
      </button>

      {/* Message after closing */}
      {showMessage && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 -translate-y-20 z-50">
          <div className="bg-white rounded-lg shadow-lg p-3 border border-pink-100 animate-slide-up-fade">
            <p className="text-xs text-gray-700 whitespace-nowrap flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-pink-500 animate-spin-slow" />
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent font-medium">
                New match found! ✨
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gradient-to-b from-white to-pink-50 rounded-xl shadow-xl p-5 w-[340px] relative overflow-hidden">
            {/* Floating Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 animate-float-heart-1">
                <Heart className="h-4 w-4 text-pink-200/30" fill="currentColor" />
              </div>
              <div className="absolute top-1/4 right-1/4 animate-float-heart-2">
                <Heart className="h-3 w-3 text-pink-200/30" fill="currentColor" />
              </div>
              <div className="absolute bottom-1/4 left-1/3 animate-float-heart-3">
                <Heart className="h-5 w-5 text-pink-200/30" fill="currentColor" />
              </div>
              <div className="absolute top-1/2 right-1/3 animate-float-heart-4">
                <Heart className="h-4 w-4 text-pink-200/30" fill="currentColor" />
              </div>
              <div className="absolute bottom-0 right-1/4 animate-float-heart-5">
                <Heart className="h-3 w-3 text-pink-200/30" fill="currentColor" />
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={togglePopup}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-110 hover:rotate-90 hover:bg-pink-50 z-10 border border-gray-200"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className="space-y-4 relative z-10">
              {/* Profile Image with Initials */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg hover:scale-105 transition-transform duration-300">
                  {getInitials(matchedProfile.user.firstName, matchedProfile.user.lastName)}
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-800">
                  {matchedProfile.user.firstName} {matchedProfile.user.lastName}
                </h4>
                <div className="flex items-center justify-center gap-1.5 text-gray-600 mt-1">
                  <span className="text-xs">{age} years</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-xs">{matchedProfile.occupation}</span>
                </div>
              </div>

              {/* Compatibility Meter */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-700">Match Score</span>
                  <span className="text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    {matchScore}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
              </div>

              {/* Matching Criteria */}
              <div className="flex flex-wrap gap-1 justify-center">
                {matchingCriteria.slice(0, 3).map((criteria, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 px-2 py-0.5 rounded-full text-xs font-medium border border-pink-100"
                  >
                    {criteria}
                  </span>
                ))}
              </div>

              {/* AI Analysis */}
              <div className="p-3 bg-white/80 rounded-lg border border-pink-100">
                <h3 className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-pink-500 animate-pulse" />
                  AI Analysis
                </h3>
                {analyzing ? (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                  </div>
                ) : aiAnalysis ? (
                  <div className="text-xs text-gray-600">
                    <p className="line-clamp-2 leading-relaxed">{aiAnalysis.analysis}</p>
                    <button 
                      onClick={handleViewProfile}
                      className="text-pink-600 hover:text-pink-700 text-xs font-medium flex items-center gap-1 group mt-1"
                    >
                      View full AI analysis
                      <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">→</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Analysis not available</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-1">
                <button 
                  onClick={handleViewProfile}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 text-xs font-semibold shadow-sm hover:shadow-md"
                >
                  View Profile
                </button>
                <button 
                  onClick={togglePopup}
                  className="flex-1 bg-white text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 text-xs font-semibold border border-gray-200 hover:border-gray-300"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Update styles
const styles = `
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slide-up-fade {
  0% { 
    transform: translateY(0) translateY(-20px);
    opacity: 0;
  }
  20% { 
    transform: translateY(0) translateY(-20px);
    opacity: 1;
  }
  80% { 
    transform: translateY(0) translateY(-20px);
    opacity: 1;
  }
  100% { 
    transform: translateY(0) translateY(-20px);
    opacity: 0;
  }
}

@keyframes float-heart-1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(10px, -10px) rotate(10deg); }
}

@keyframes float-heart-2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-8px, -8px) rotate(-8deg); }
}

@keyframes float-heart-3 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(12px, 8px) rotate(12deg); }
}

@keyframes float-heart-4 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-10px, 10px) rotate(-10deg); }
}

@keyframes float-heart-5 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(8px, -8px) rotate(8deg); }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.4s ease-out;
}

.animate-slide-up-fade {
  animation: slide-up-fade 3s ease-in-out;
}

.animate-float-heart-1 {
  animation: float-heart-1 4s ease-in-out infinite;
}

.animate-float-heart-2 {
  animation: float-heart-2 5s ease-in-out infinite;
}

.animate-float-heart-3 {
  animation: float-heart-3 6s ease-in-out infinite;
}

.animate-float-heart-4 {
  animation: float-heart-4 4.5s ease-in-out infinite;
}

.animate-float-heart-5 {
  animation: float-heart-5 5.5s ease-in-out infinite;
}
`;

export default DailySuggestionBubble; 