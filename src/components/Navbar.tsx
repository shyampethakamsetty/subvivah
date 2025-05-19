"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setIsAuthenticated(false);
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              शुभ विवाह
            </Link>
          </div>
          <div className="flex md:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-purple-700 focus:outline-none"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Open main menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700">Home</Link>
              <Link href="/search" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700">Search</Link>
              <Link href="/dating" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700">Dating</Link>
              <Link href="/matches" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700">Matches</Link>
              <Link href="/messages" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700">Messages</Link>
              <Link href="/kundli" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700">Kundli Generator</Link>
              <Link href="/brahmand-chat" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700">ब्रह्मांड AI chat</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!loading && (
              isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-white text-purple-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-50"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700">Login</Link>
                  <Link href="/register" className="bg-white text-purple-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-50">Register</Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 block">Home</Link>
          <Link href="/search" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 block">Search</Link>
          <Link href="/dating" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 block">Dating</Link>
          <Link href="/matches" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 block">Matches</Link>
          <Link href="/messages" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 block">Messages</Link>
          <Link href="/kundli" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 block">Kundli Generator</Link>
          <Link href="/brahmand-chat" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 block">ब्रह्मांड AI chat</Link>
        </div>
      )}
    </nav>
  );
} 