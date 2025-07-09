'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, X, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface MatchProfile {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    photos: { url: string; isProfile: boolean }[];
  };
  matchScore: number;
  matchingCriteria: string[];
}

interface ErrorState {
  message: string;
  code?: string;
  suggestion?: string;
}

export default function PersonalizedMatches() {
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const router = useRouter();
  const { language } = useLanguage();

  // Memoize fetchMatches to prevent recreation on every render
  const fetchMatches = useCallback(async () => {
    try {
      const response = await fetch('/api/matches/personalized', {
        credentials: 'include'
      });

      if (!response.ok) {
        let errorMessage: ErrorState = {
          message: 'Failed to fetch matches',
          code: 'UNKNOWN_ERROR'
        };

        if (response.status === 401) {
          errorMessage = {
            message: t[language].error.notAuthenticated,
            code: 'NOT_AUTHENTICATED',
            suggestion: 'Please login to view personalized matches.'
          };
          router.push('/login');
          return;
        }

        if (response.status === 400) {
          const data = await response.json();
          if (data.error === 'Personalization not completed') {
            errorMessage = {
              message: t[language].error.aiNotComplete,
              code: 'AI_NOT_COMPLETE',
              suggestion: 'Complete your personalization to get matched with compatible profiles.'
            };
          }
        }

        throw errorMessage;
      }

      const data = await response.json();
      setMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
      if (err instanceof Error) {
        setError({
          message: t[language].error.networkError,
          code: 'NETWORK_ERROR',
          suggestion: 'Please check your internet connection and try again.'
        });
      } else if (typeof err === 'object' && err !== null) {
        setError(err as ErrorState);
      } else {
        setError({
          message: t[language].error.unknownError,
          code: 'UNKNOWN_ERROR',
          suggestion: 'Please try refreshing the page.'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [language, router]);

  // Only fetch on mount and language change
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleSendInterest = useCallback(async (matchId: string) => {
    try {
      const response = await fetch('/api/interests/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId: matchId }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to send interest');
      }

      // Update UI to show interest sent
      setMatches(prevMatches => 
        prevMatches.map(match => 
          match.id === matchId 
            ? { ...match, interestSent: true }
            : match
        )
      );
    } catch (error) {
      console.error('Error sending interest:', error);
    }
  }, []);

  const t = {
    hi: {
      title: 'व्यक्तिगत मैच',
      subtitle: 'AI द्वारा चुने गए आपके लिए सर्वश्रेष्ठ मैच',
      loading: 'आपके लिए सर्वश्रेष्ठ मैच खोज रहे हैं...',
      error: {
        title: 'एक त्रुटि हुई है',
        tryAgain: 'पुनः प्रयास करें',
        goToProfile: 'प्रोफ़ाइल पर जाएं',
        notAuthenticated: 'कृपया लॉगिन करें',
        aiNotComplete: 'AI व्यक्तिगतकरण अधूरा है',
        networkError: 'नेटवर्क त्रुटि',
        serverError: 'सर्वर त्रुटि',
        unknownError: 'अज्ञात त्रुटि'
      },
      noMatches: 'कोई मैच नहीं मिला',
      viewProfile: 'प्रोफ़ाइल देखें',
      sendInterest: 'रुचि भेजें',
      message: 'संदेश',
      matchScore: 'मैच स्कोर',
      compatibility: 'संगतता',
    },
    en: {
      title: 'Personalized Matches',
      subtitle: 'Best matches for you, chosen by AI',
      loading: 'Finding your best matches...',
      error: {
        title: 'An Error Occurred',
        tryAgain: 'Try Again',
        goToProfile: 'Go to Profile',
        notAuthenticated: 'Please Login',
        aiNotComplete: 'AI Personalization Incomplete',
        networkError: 'Network Error',
        serverError: 'Server Error',
        unknownError: 'Unknown Error'
      },
      noMatches: 'No matches found',
      viewProfile: 'View Profile',
      sendInterest: 'Send Interest',
      message: 'Message',
      matchScore: 'Match Score',
      compatibility: 'Compatibility',
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-200">{t[language].loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-500">
              {t[language].error.title}
            </h2>
            <p className="text-lg mb-2 text-white">
              {error.message}
            </p>
            {error.suggestion && (
              <p className="text-sm mb-6 text-gray-300">
                {error.suggestion}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchMatches();
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {t[language].error.tryAgain}
              </button>
              {error.code === 'AI_NOT_COMPLETE' && (
                <Link
                  href="/ai-personalization"
                  className="bg-white/10 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  {t[language].error.goToProfile}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold mb-2">{t[language].title}</h1>
        <p className="text-gray-300">{t[language].subtitle}</p>
      </motion.div>

      {matches.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <p>{t[language].noMatches}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={match.user.photos.find(p => p.isProfile)?.url || '/default-profile.jpg'}
                  alt={`${match.user.firstName}'s photo`}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                  {match.matchScore}% {t[language].matchScore}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {match.user.firstName} {match.user.lastName}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {match.matchingCriteria.slice(0, 3).map((criteria, i) => (
                    <span
                      key={i}
                      className="bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded-full"
                    >
                      {criteria}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`/profile/${match.id}`}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    {t[language].viewProfile}
                  </Link>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSendInterest(match.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                      title={t[language].sendInterest}
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <Link
                      href={`/messages/${match.id}`}
                      className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full"
                      title={t[language].message}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 