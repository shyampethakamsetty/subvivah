import { Search, Filter, MapPin, Briefcase, GraduationCap, Lock } from 'lucide-react';
import Link from 'next/link';

const STATIC_PROFILES = [
  {
    name: "Priya Sharma",
    age: 27,
    location: "Delhi, India",
    education: "M.Tech",
    profession: "Software Engineer"
  },
  {
    name: "Rahul Verma",
    age: 29,
    location: "Mumbai, India",
    education: "MBA",
    profession: "Business Analyst"
  },
  {
    name: "Anjali Gupta",
    age: 26,
    location: "Bangalore, India",
    education: "MBBS",
    profession: "Doctor"
  },
  {
    name: "Arjun Patel",
    age: 28,
    location: "Ahmedabad, India",
    education: "CA",
    profession: "Chartered Accountant"
  }
];

export default function StaticSearch() {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleViewProfile = () => {
    try {
      console.log('Attempting to show login popup from StaticSearch');
      if (typeof window !== 'undefined') {
        if (typeof window.showLoginPopup === 'function') {
          window.showLoginPopup();
        } else {
          console.error('showLoginPopup function is not available');
          // Try to initialize it if not available
          window.showLoginPopup = () => {
            console.log('Login popup triggered from StaticSearch initialization');
            // Since we can't access the DelayedLoginModal's state here,
            // we'll reload the page which will trigger the auth check
            window.location.reload();
          };
          window.showLoginPopup();
        }
      }
    } catch (error) {
      console.error('Error showing login popup:', error);
      // Fallback to redirect
      window.location.href = '/login';
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center px-2 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950">
      {/* Search Form */}
      <div className="relative z-10 w-full max-w-7xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Find Your Perfect Match</h1>
          <p className="text-lg text-purple-200">Join thousands of happy couples who found their soulmate on शुभ विवाह</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name, location, or profession..."
                className="w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/5 text-white placeholder-gray-300"
                disabled
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" />
            </div>
            <button
              className="px-4 py-3 bg-purple-600/50 text-white rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
              disabled
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Static Profile Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATIC_PROFILES.map((profile, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 relative group"
            >
              <div className="relative h-48 w-full bg-gradient-to-b from-purple-600/20 to-purple-900/40 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-purple-600/50 flex items-center justify-center">
                  <span className="text-3xl font-semibold text-white blur-[4px]">
                    {getInitials(profile.name)}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-purple-900/90 to-transparent">
                  <h3 className="text-lg font-semibold text-white blur-[4px]">{profile.name}</h3>
                  <p className="text-purple-200 text-sm blur-[4px]">
                    {profile.age} years • {profile.location}
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-200">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm blur-[4px]">{profile.education}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-200">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm blur-[4px]">{profile.profession}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-200">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm blur-[4px]">{profile.location}</span>
                </div>
              </div>

              {/* Lock Overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
                <Lock className="w-8 h-8 text-white/80" />
              </div>

              <div className="p-4 border-t border-purple-500/20">
                <button
                  onClick={handleViewProfile}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Login/Register CTA */}
        <div className="mt-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-purple-200 mb-8">
              Join शुभ विवाह today and connect with thousands of potential matches. Our advanced matchmaking system helps you find the perfect life partner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleViewProfile}
                className="px-8 py-3 bg-pink-600 text-white rounded-lg text-lg font-semibold hover:bg-pink-700 transition-colors"
              >
                Login Now
              </button>
              <Link
                href="/register"
                className="px-8 py-3 bg-purple-600 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 