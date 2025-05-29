import Image from "next/image";
import Link from "next/link";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Chatbot */}
      <Chatbot />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center px-2 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src="/images/home-bg.jpg"
              alt="Home background image"
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center 20%',
              }}
              className="opacity-80"
              priority
              sizes="100vw"
              quality={100}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-black/30 to-gray-900/60"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Find Your Perfect Match
            </h1>
            <p className="text-lg sm:text-2xl font-semibold text-white mb-8 drop-shadow-lg" style={{ fontFamily: 'var(--font-devanagari, sans-serif)' }}>
              जहाँ रिश्ते दिल से बनते हैं
            </p>
            <p className="text-base sm:text-lg text-white mb-8">
              Join thousands of successful matches on शुभ विवाह. Create your profile today and start your journey to find your life partner.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-300 shadow-lg w-full sm:w-auto"
              >
                Get Started
              </Link>
              <Link
                href="/search"
                className="bg-white/20 text-white border-2 border-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/30 transition duration-300 shadow-lg w-full sm:w-auto"
              >
                Browse Profiles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Moments Gallery */}
      <section className="py-12 px-2 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-red-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-red-900 mb-4">
            Beautiful Moments
          </h2>
          <p className="text-base sm:text-xl text-gray-600 text-center mb-8 sm:mb-12">
            Celebrate the sacred bond of marriage with traditional values
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="relative h-56 sm:h-80 md:h-[400px] overflow-hidden rounded-lg shadow-xl">
              <Image
                src="/images/wedding-hands1.jpg"
                alt="Traditional Indian wedding couple holding hands with mehndi"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                quality={100}
              />
            </div>
            <div className="relative h-56 sm:h-80 md:h-[400px] overflow-hidden rounded-lg shadow-xl">
              <Image
                src="/images/wedding-ceremony.jpg"
                alt="Traditional Indian wedding ceremony with haldi ritual"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                quality={100}
              />
            </div>
            <div className="relative h-56 sm:h-80 md:h-[400px] overflow-hidden rounded-lg shadow-xl">
              <Image
                src="/images/wedding-hands2.jpg"
                alt="Bride and groom holding hands with beautiful attire"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                quality={100}
              />
            </div>
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/success-stories"
              className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold"
            >
              View Success Stories
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="py-12 px-2 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-red-900 mb-8 sm:mb-12">
            Featured Profiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Profile 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-red-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-600">R</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">Rahul</h3>
                    <p className="text-gray-600">28 years, Software Engineer</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Bangalore, India</p>
                <Link
                  href="/profile/rahul"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  View Profile →
                </Link>
              </div>
            </div>

            {/* Profile 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-red-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-600">P</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">Priya</h3>
                    <p className="text-gray-600">26 years, Doctor</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Mumbai, India</p>
                <Link
                  href="/profile/priya"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  View Profile →
                </Link>
              </div>
            </div>

            {/* Profile 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-red-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-600">A</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">Amit</h3>
                    <p className="text-gray-600">30 years, Business Owner</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Delhi, India</p>
                <Link
                  href="/profile/amit"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  View Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-2 sm:px-6 lg:px-8 bg-red-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-red-900 mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verified Profiles
              </h3>
              <p className="text-gray-600">
                All profiles are verified to ensure authenticity and safety.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Advanced Search
              </h3>
              <p className="text-gray-600">
                Find your perfect match with our detailed search filters.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Messaging
              </h3>
              <p className="text-gray-600">
                Connect with matches through our secure messaging system.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
