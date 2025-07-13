'use client';

import dynamic from 'next/dynamic';
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from '@/context/LanguageContext';
import { 
  Brain, 
  Fingerprint, 
  Sparkles, 
  MessageSquareText, 
  HeartHandshake, 
  Telescope, 
  Zap,
  Lightbulb,
  Bot,
  Smile,
  PersonStanding,
  Hourglass,
  ShieldCheck,
  UserCheck,
  Star,
  MessageSquare,
  Target,
  User,
  Heart,
  Search,
  Calendar,
  Crown,
  Phone
} from 'lucide-react';

// Dynamically import components that use browser APIs
const Chatbot = dynamic(() => import("@/components/Chatbot"), {
  ssr: false,
});

const LottieWrapper = dynamic(() => import("lottie-react"), {
  ssr: false,
});

// Import animations
import securityAnimation from "../../public/animations/sec.json";
import matchmakingAnimation from "../../public/animations/matchmaking.json";
import kundliAnimation from "../../public/animations/kundli.json";
import aiInterviewAnimation from "../../public/animations/ai-interview.json";

export default function Home() {
  const { language } = useLanguage();
  const securityLottieRef = useRef(null);
  const matchmakingLottieRef = useRef(null);
  const kundliLottieRef = useRef(null);
  const aiInterviewLottieRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (response.ok && data.isAuthenticated && data.user) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Home page text based on language
  const homeText = {
    hi: {
      heroTitle: 'अपना सर्वश्रेष्ठ साथी खोजें',
      heroSubtitle: 'जहाँ रिश्ते दिल से बनते हैं',
      heroDescription: 'हजारों सफल जोड़ों में शामिल हों शुभ विवाह पर। आज ही अपनी प्रोफाइल बनाएं और अपने जीवन साथी को खोजने की यात्रा शुरू करें।',
      getStarted: 'शुरू करें',
      browseProfiles: 'प्रोफाइल देखें',
      scrollToExplore: 'और जानने के लिए स्क्रॉल करें',
      featuresTitle: 'हमारी विशेषताएं',
      featuresSubtitle: 'आपकी खुशी के लिए डिज़ाइन किया गया',
      aiMatching: 'AI मैचिंग',
      aiMatchingDesc: 'उन्नत AI तकनीक के साथ सर्वश्रेष्ठ मैच खोजें',
      secureData: 'सुरक्षित डेटा',
      secureDataDesc: 'आपकी जानकारी पूरी तरह से सुरक्षित रहेगी',
      kundliMatching: 'कुंडली मैचिंग',
      kundliMatchingDesc: 'पारंपरिक ज्योतिष के साथ वैज्ञानिक मैचिंग',
      privacyControl: 'गोपनीयता नियंत्रण',
      privacyControlDesc: 'आप अपनी जानकारी को नियंत्रित करते हैं',
      testimonialsTitle: 'सफल कहानियां',
      testimonialsSubtitle: 'हमारे सदस्यों की सफलता की कहानियां',
      joinNow: 'अभी शामिल हों',
      joinNowDesc: 'अपना सर्वश्रेष्ठ साथी खोजने के लिए आज ही शुरू करें'
    },
    en: {
      heroTitle: 'Find Your Perfect Match',
      heroSubtitle: 'जहाँ रिश्ते दिल से बनते हैं',
      heroDescription: 'Join thousands of successful matches on शुभ विवाह. Create your profile today and start your journey to find your life partner.',
      getStarted: 'Get Started',
      browseProfiles: 'Browse Profiles',
      scrollToExplore: 'Scroll to Explore',
      featuresTitle: 'Our Features',
      featuresSubtitle: 'Designed for your happiness',
      aiMatching: 'AI Matching',
      aiMatchingDesc: 'Find the best matches with advanced AI technology',
      secureData: 'Secure Data',
      secureDataDesc: 'Your information stays completely secure',
      kundliMatching: 'Kundli Matching',
      kundliMatchingDesc: 'Scientific matching with traditional astrology',
      privacyControl: 'Privacy Control',
      privacyControlDesc: 'You control your information',
      testimonialsTitle: 'Success Stories',
      testimonialsSubtitle: 'Stories of success from our members',
      joinNow: 'Join Now',
      joinNowDesc: 'Start today to find your perfect life partner'
    }
  };

  const t = homeText[language];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Chatbot */}
      <Chatbot />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center px-2 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden">
        {/* AI Matchmaking Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.8) contrast(1.1)' }}
          >
            <source src="/videos/ai-matchmaking.mp4" type="video/mp4" />
            {/* Fallback animated background if video doesn't load */}
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
              {/* Animated Starfield Background */}
              <div className="absolute inset-0">
                {/* Stars Layer 1 - Small stars */}
                <div className="absolute inset-0">
                  {[...Array(50)].map((_, i) => (
                    <motion.div
                      key={`star1-${i}`}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>

                {/* Stars Layer 2 - Medium stars */}
                <div className="absolute inset-0">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={`star2-${i}`}
                      className="absolute w-2 h-2 bg-blue-200 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0.4, 1, 0.4],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                      }}
                    />
                  ))}
                </div>

                {/* Stars Layer 3 - Large stars */}
                <div className="absolute inset-0">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={`star3-${i}`}
                      className="absolute w-3 h-3 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 4,
                      }}
                    />
                  ))}
                </div>

                {/* Shooting Stars */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`shooting-${i}`}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        x: [0, 200],
                        y: [0, 200],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                      }}
                    />
                  ))}
                </div>

                {/* Love Connections - Floating Hearts */}
                <div className="absolute inset-0">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={`heart-${i}`}
                      className="absolute text-pink-300"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 1, 0.3],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 4,
                      }}
                    >
                      <Heart className="w-4 h-4" />
                    </motion.div>
                  ))}
                </div>

                {/* Connection Lines */}
                <div className="absolute inset-0">
                  <svg className="w-full h-full" style={{ position: 'absolute' }}>
                    {[...Array(6)].map((_, i) => (
                      <motion.line
                        key={`line-${i}`}
                        x1={`${20 + Math.random() * 60}%`}
                        y1={`${20 + Math.random() * 60}%`}
                        x2={`${20 + Math.random() * 60}%`}
                        y2={`${20 + Math.random() * 60}%`}
                        stroke="rgba(147, 51, 234, 0.3)"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                        animate={{
                          strokeDashoffset: [0, 10],
                          opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </svg>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-1 h-1 bg-blue-300 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -100],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 6 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 6,
                      }}
                    />
                  ))}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-indigo-900/30 to-purple-900/40"></div>
              </div>
            </div>
          </video>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto py-16 sm:py-24 flex flex-col items-center justify-center min-h-screen">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3,
                  delayChildren: 0.8
                }
              }
            }}
          >

          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [0, 10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          >
            <div className="flex flex-col items-center gap-2">
              <p className="text-white text-sm font-medium tracking-wider">{t.scrollToExplore}</p>
              <svg 
                className="w-6 h-6 text-white animate-bounce" 
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Shards Section - Moved below the hero image */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Registration */}
              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="group"
                >
                  <button 
                    onClick={() => {
                      if (typeof window !== 'undefined' && typeof (window as any).showRegisterPopup === 'function') {
                        (window as any).showRegisterPopup();
                      }
                    }}
                    className="block w-full"
                  >
                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 h-48 flex flex-col justify-center items-center text-center border border-red-200 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-700 transition-all duration-300 group-hover:scale-105 shadow-lg">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {language === 'hi' ? 'खाता बनाएं' : 'Create Account'}
                      </h3>
                      <p className="text-sm text-white/90">
                        {language === 'hi' 
                          ? 'अपनी यात्रा शुरू करें'
                          : 'Start your journey'
                        }
                      </p>
                    </div>
                  </button>
                </motion.div>
              )}

              {/* Profile Management */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="group"
                >
                  <Link href="/profile" className="block">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 h-48 flex flex-col justify-center items-center text-center border border-blue-200 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group-hover:scale-105 shadow-lg">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {language === 'hi' ? 'मेरी प्रोफाइल' : 'My Profile'}
                      </h3>
                      <p className="text-sm text-white/90">
                        {language === 'hi' 
                          ? 'अपनी प्रोफाइल प्रबंधित करें'
                          : 'Manage your profile'
                        }
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Search Profiles */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <Link href="/search" className="block">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 h-48 flex flex-col justify-center items-center text-center border border-green-200 hover:bg-gradient-to-br hover:from-green-600 hover:to-green-700 transition-all duration-300 group-hover:scale-105 shadow-lg">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Search className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {language === 'hi' ? 'प्रोफाइल खोजें' : 'Search Profiles'}
                    </h3>
                    <p className="text-sm text-white/90">
                      {language === 'hi' 
                        ? 'सही साथी खोजें'
                        : 'Find the right match'
                      }
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* AI Matches */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="group"
              >
                <Link href="/personalized-matches" className="block">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 h-48 flex flex-col justify-center items-center text-center border border-purple-200 hover:bg-gradient-to-br hover:from-purple-600 hover:to-purple-700 transition-all duration-300 group-hover:scale-105 shadow-lg">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {language === 'hi' ? 'AI मैचेस' : 'AI Matches'}
                    </h3>
                    <p className="text-sm text-white/90">
                      {language === 'hi' 
                        ? 'AI द्वारा चुने गए मैचेस'
                        : 'AI-curated matches'
                      }
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* Matches */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="group"
                >
                  <Link href="/matches" className="block">
                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 h-48 flex flex-col justify-center items-center text-center border border-pink-200 hover:bg-gradient-to-br hover:from-pink-600 hover:to-pink-700 transition-all duration-300 group-hover:scale-105 shadow-lg">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {language === 'hi' ? 'मेरे मैचेस' : 'My Matches'}
                      </h3>
                      <p className="text-sm text-white/90">
                        {language === 'hi' 
                          ? 'अपने मैचेस देखें'
                          : 'View your matches'
                        }
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Messages */}
              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="group"
                >
                  <Link href="/messages" className="block">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 h-48 flex flex-col justify-center items-center text-center border border-blue-200 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group-hover:scale-105 shadow-lg">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {language === 'hi' ? 'संदेश' : 'Messages'}
                      </h3>
                      <p className="text-sm text-white/90">
                        {language === 'hi' 
                          ? 'चैट करें'
                          : 'Chat with connections'
                        }
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Kundli Matching */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="group"
              >
                <Link href="/kundli" className="block">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 h-48 flex flex-col justify-center items-center text-center border border-yellow-200 hover:bg-gradient-to-br hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 group-hover:scale-105 shadow-lg">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {language === 'hi' ? 'कुंडली मैचिंग' : 'Kundli Matching'}
                    </h3>
                    <p className="text-sm text-white/90">
                      {language === 'hi' 
                        ? 'ज्योतिष के अनुसार'
                        : 'Based on astrology'
                      }
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* Dating */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="group"
              >
                <Link href="/dating" className="block">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 h-48 flex flex-col justify-center items-center text-center border border-red-200 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-700 transition-all duration-300 group-hover:scale-105 shadow-lg">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {language === 'hi' ? 'डेटिंग' : 'Dating'}
                    </h3>
                    <p className="text-sm text-white/90">
                      {language === 'hi' 
                        ? 'रोमांटिक प्लान'
                        : 'Plan romantic dates'
                      }
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* Success Stories */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                className="group"
              >
                <Link href="/success-stories" className="block">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 h-48 flex flex-col justify-center items-center text-center border border-green-200 hover:bg-gradient-to-br hover:from-green-600 hover:to-green-700 transition-all duration-300 group-hover:scale-105 shadow-lg">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <HeartHandshake className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {language === 'hi' ? 'सफल कहानियां' : 'Success Stories'}
                    </h3>
                    <p className="text-sm text-white/90">
                      {language === 'hi' 
                        ? 'प्रेरणादायक कहानियां'
                        : 'Inspiring stories'
                      }
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* Premium Membership */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
                className="group"
              >
                <Link href="/premium" className="block">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 h-48 flex flex-col justify-center items-center text-center border border-yellow-200 hover:bg-gradient-to-br hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 group-hover:scale-105 shadow-lg">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {language === 'hi' ? 'प्रीमियम' : 'Premium'}
                    </h3>
                    <p className="text-sm text-white/90">
                      {language === 'hi' 
                        ? 'विशेष सुविधाएं'
                        : 'Exclusive features'
                      }
                    </p>
                  </div>
                </Link>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="group"
              >
                <Link href="/contact" className="block">
                  <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 h-48 flex flex-col justify-center items-center text-center border border-gray-200 hover:bg-gradient-to-br hover:from-gray-600 hover:to-gray-700 transition-all duration-300 group-hover:scale-105 shadow-lg">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {language === 'hi' ? 'संपर्क' : 'Contact'}
                    </h3>
                    <p className="text-sm text-white/90">
                      {language === 'hi' 
                        ? 'सहायता प्राप्त करें'
                        : 'Get support'
                      }
                    </p>
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Beautiful Memories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Beautiful Memories</h2>
            <p className="text-lg text-gray-600">Cherish the moments that last forever</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* First Memory */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group"
            >
              <div className="relative h-[350px] overflow-hidden rounded-lg">
                <Image
                  src="/images/wedding-hands1.jpg"
                  alt="Wedding ceremony hands"
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">Sacred Traditions</h3>
                <p className="mt-2 text-gray-600">Embracing our rich cultural heritage through meaningful ceremonies</p>
              </div>
            </motion.div>

            {/* Second Memory */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative group"
            >
              <div className="relative h-[350px] overflow-hidden rounded-lg">
                <Image
                  src="/images/wedding-hands2.jpg"
                  alt="Wedding ceremony"
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">Eternal Bonds</h3>
                <p className="mt-2 text-gray-600">Creating timeless connections that last a lifetime</p>
              </div>
            </motion.div>

            {/* Third Memory */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative group"
            >
              <div className="relative h-[350px] overflow-hidden rounded-lg">
                <Image
                  src="/images/wedding-ceremony.jpg"
                  alt="Wedding ceremony"
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">Joyous Celebrations</h3>
                <p className="mt-2 text-gray-600">Celebrating the union of two souls in love and harmony</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Next-Gen AI Matchmaking Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Next-Gen AI Matchmaking
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
              Experience the Future of Matrimony with Our Advanced AI Technology
            </p>
          </motion.div>

          {/* Main AI Features */}
          <div className="space-y-32">
            {/* Smart Match AI */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
                <div className="w-full md:w-5/12">
                  <div className="relative h-64 md:h-80">
                    <LottieWrapper
                      animationData={matchmakingAnimation}
                      loop={true}
                      autoplay={true}
                      className="w-full h-full object-contain [transform:rotateY(180deg)]"
                    />
                  </div>
                </div>
                <div className="w-full md:w-7/12">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Smart Match AI
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mt-1">
                        <Brain className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Deep Learning Matches</h4>
                        <p className="text-gray-600">Advanced AI analyzes preferences and behavior patterns.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mt-1">
                        <Sparkles className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Personalized Recommendations</h4>
                        <p className="text-gray-600">Get matches that align with your unique preferences.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Face Verification */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mr-0 md:mr-12 md:text-right"
            >
              <div className="flex flex-col-reverse md:flex-row-reverse items-center gap-8 md:gap-12">
                <div className="w-full md:w-5/12">
                  <div className="relative h-64 md:h-80">
                    <LottieWrapper
                      animationData={securityAnimation}
                      loop={true}
                      autoplay={true}
                      className="w-full h-full object-contain [transform:rotateY(180deg)]"
                    />
                  </div>
                </div>
                <div className="w-full md:w-7/12 md:pr-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Advanced Face Verification
                  </h3>
                  <div className="space-y-4 md:ml-auto">
                    <div className="flex items-start gap-3 md:flex-row-reverse md:text-right">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mt-1">
                        <Fingerprint className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Real-time Authentication</h4>
                        <p className="text-gray-600">State-of-the-art facial recognition with 99.9% accuracy.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:flex-row-reverse md:text-right">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mt-1">
                        <PersonStanding className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Liveness Detection</h4>
                        <p className="text-gray-600">Advanced AI ensures all profile photos are genuine.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Kundli Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
                <div className="w-full md:w-5/12">
                  <div className="relative h-64 md:h-80">
                    <LottieWrapper
                      animationData={kundliAnimation}
                      loop={true}
                      autoplay={true}
                      className="w-full h-full object-contain [transform:rotateY(180deg)]"
                    />
                  </div>
                </div>
                <div className="w-full md:w-7/12">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    AI Kundli Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mt-1">
                        <Star className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Instant Compatibility</h4>
                        <p className="text-gray-600">Advanced astrological matching powered by AI.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mt-1">
                        <Bot className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Detailed Analysis</h4>
                        <p className="text-gray-600">Get comprehensive insights about your match.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Interview */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mr-0 md:mr-12 md:text-right"
            >
              <div className="flex flex-col-reverse md:flex-row-reverse items-center gap-8 md:gap-12">
                <div className="w-full md:w-5/12">
                  <div className="relative h-64 md:h-80">
                    <LottieWrapper
                      animationData={aiInterviewAnimation}
                      loop={true}
                      autoplay={true}
                      className="w-full h-full object-contain [transform:rotateY(180deg)]"
                    />
                  </div>
                </div>
                <div className="w-full md:w-7/12 md:pr-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    AI Interview Experience
                  </h3>
                  <div className="space-y-4 md:ml-auto">
                    <div className="flex items-start gap-3 md:flex-row-reverse md:text-right">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center mt-1">
                        <MessageSquareText className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Interactive Conversations</h4>
                        <p className="text-gray-600">Natural dialogue with AI to understand your preferences.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:flex-row-reverse md:text-right">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center mt-1">
                        <Smile className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Personalized Experience</h4>
                        <p className="text-gray-600">Tailored matching based on your responses.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32 text-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-purple-500/5 to-red-500/5 rounded-3xl transform -skew-y-2"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-red-100">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
              >
                <div className="flex items-center justify-center mb-6 space-x-3">
                  <Sparkles className="w-8 h-8 text-red-500" />
                  <Brain className="w-8 h-8 text-purple-500" />
                  <HeartHandshake className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-red-600 text-transparent bg-clip-text mb-6">
                  Experience the Magic of AI Matchmaking
                </h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
                >
                  Let our intelligent algorithms understand your heart's desires and guide you to meaningful connections. Your perfect match awaits in our AI-curated journey to lasting love.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap justify-center gap-8 mt-12"
                >
                  <div className="flex items-center gap-3 text-purple-600">
                    <Bot className="w-6 h-6" />
                    <span className="text-lg font-medium">Smart Matching</span>
                  </div>
                  <div className="flex items-center gap-3 text-red-600">
                    <Fingerprint className="w-6 h-6" />
                    <span className="text-lg font-medium">Verified Profiles</span>
                  </div>
                  <div className="flex items-center gap-3 text-purple-600">
                    <MessageSquareText className="w-6 h-6" />
                    <span className="text-lg font-medium">AI Interview</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
