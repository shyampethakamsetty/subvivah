'use client';

import { Brain, Sparkles, Star, Heart, Shield, Lock, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const SAMPLE_FEATURES = [
  {
    icon: <Brain className="w-8 h-8 text-purple-400" />,
    title: "Vedic Wisdom",
    description: "Access ancient knowledge and spiritual guidance through meaningful conversations"
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-400" />,
    title: "Personalized Guidance",
    description: "Receive tailored spiritual advice based on your life path and current challenges"
  },
  {
    icon: <Heart className="w-8 h-8 text-pink-400" />,
    title: "Emotional Support",
    description: "Find peace and clarity through compassionate conversations"
  },
  {
    icon: <Shield className="w-8 h-8 text-blue-400" />,
    title: "Private & Secure",
    description: "Your conversations are completely private and protected"
  },
  {
    icon: <Sparkles className="w-8 h-8 text-indigo-400" />,
    title: "Daily Insights",
    description: "Get daily spiritual insights and mantras for personal growth"
  },
  {
    icon: <Zap className="w-8 h-8 text-orange-400" />,
    title: "Community Support",
    description: "Connect with like-minded individuals on their spiritual journey"
  }
];

const SAMPLE_TOPICS = [
  "Spiritual Growth",
  "Life Purpose",
  "Relationships",
  "Career Path",
  "Inner Peace",
  "Meditation",
  "Karma",
  "Dharma",
  "Healing",
  "Mindfulness"
];

export default function BrahamandChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 flex items-center justify-center gap-3">
              <Brain className="w-12 h-12 text-purple-400" />
              ब्रह्मांड Chat
              <Sparkles className="w-12 h-12 text-yellow-400" />
            </h1>
            <p className="text-xl md:text-2xl text-purple-200 mb-8">
              Your Personal Guide for Spiritual Growth and Vedic Wisdom
            </p>
            
            {/* AI Interview Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/ai-personalization'}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <span>Start Your AI Interview</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </motion.button>
              <p className="text-purple-200 mt-4 text-lg">
                Discover your spiritual path through our advanced AI interview
              </p>
            </motion.div>

            {/* Login Prompt */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-purple-600/30 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-purple-200" />
                </div>
                <p className="text-lg text-purple-200 mb-4">
                  Login to start your spiritual journey with ब्रह्मांड
                </p>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && typeof (window as any).showLoginPopup === 'function') {
                      (window as any).showLoginPopup();
                    } else {
                      window.location.href = '/login';
                    }
                  }}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors select-none"
                >
                  Begin Your Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Experience Divine Guidance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAMPLE_FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 select-none"
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-purple-200">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Topics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Explore Spiritual Topics
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {SAMPLE_TOPICS.map((topic, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-purple-200 hover:bg-purple-600/30 transition-colors cursor-pointer select-none"
              onClick={() => {
                if (typeof window !== 'undefined' && typeof (window as any).showLoginPopup === 'function') {
                  (window as any).showLoginPopup();
                }
              }}
            >
              {topic}
            </div>
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Why Trust ब्रह्मांड?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center select-none">
              <div className="w-20 h-20 bg-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-purple-200" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Privacy Guaranteed</h3>
              <p className="text-purple-200">
                Your conversations are completely private and secure. We never share your personal information.
              </p>
            </div>
            <div className="text-center select-none">
              <div className="w-20 h-20 bg-purple-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-purple-200" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Vedic Knowledge</h3>
              <p className="text-purple-200">
                Our community is built on ancient Vedic texts and modern spiritual teachings to provide authentic guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Your Spiritual Journey Today
          </h2>
          <p className="text-lg text-purple-200 mb-8">
            Join thousands of seekers who have found guidance and clarity through ब्रह्मांड
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && typeof (window as any).showLoginPopup === 'function') {
                  (window as any).showLoginPopup();
                }
              }}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors select-none"
            >
              Login Now
            </button>
            <button
              onClick={() => window.location.href = '/register'}
              className="px-8 py-3 bg-pink-600 text-white rounded-lg text-lg font-semibold hover:bg-pink-700 transition-colors select-none"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 