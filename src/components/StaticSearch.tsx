import Image from 'next/image';

const STATIC_PROFILES = [
  {
    name: "Priya Sharma",
    age: 27,
    location: "Delhi, India",
    education: "M.Tech",
    profession: "Software Engineer",
    photo: "/images/static/profile1.jpg"
  },
  {
    name: "Rahul Verma",
    age: 29,
    location: "Mumbai, India",
    education: "MBA",
    profession: "Business Analyst",
    photo: "/images/static/profile2.jpg"
  },
  {
    name: "Anjali Gupta",
    age: 26,
    location: "Bangalore, India",
    education: "MBBS",
    profession: "Doctor",
    photo: "/images/static/profile3.jpg"
  },
  {
    name: "Arjun Patel",
    age: 28,
    location: "Ahmedabad, India",
    education: "CA",
    profession: "Chartered Accountant",
    photo: "/images/static/profile4.jpg"
  }
];

export default function StaticSearch() {
  return (
    <section className="relative min-h-screen flex flex-col items-center px-2 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950">
      {/* Search Form */}
      <div className="relative z-10 w-full max-w-7xl mx-auto py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, location, or profession..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/5 text-white placeholder-gray-300"
                disabled
              />
            </div>
            <button
              className="px-4 py-2 bg-purple-600/50 text-white rounded-lg cursor-not-allowed"
              disabled
            >
              Show Filters
            </button>
          </div>
        </div>

        {/* Static Profile Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATIC_PROFILES.map((profile, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative h-48 w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-purple-900/40" />
                <div className="w-full h-full bg-purple-200 flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                <p className="text-purple-200 text-sm mt-1">
                  {profile.age} years • {profile.location}
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-purple-200 text-sm">
                    <span className="text-purple-300">Education:</span> {profile.education}
                  </p>
                  <p className="text-purple-200 text-sm">
                    <span className="text-purple-300">Profession:</span> {profile.profession}
                  </p>
                </div>
                <button
                  className="mt-4 w-full px-4 py-2 bg-purple-600/50 text-white rounded-lg cursor-not-allowed"
                  disabled
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Login Prompt */}
        <div className="mt-8 text-center">
          <p className="text-purple-200 text-lg">
            Login to view more profiles and connect with your potential match
          </p>
        </div>
      </div>
    </section>
  );
} 