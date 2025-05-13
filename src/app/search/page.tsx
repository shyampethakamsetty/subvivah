'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  profession: string;
  photos: {
    url: string;
  }[];
}

export default function Search() {
  const [filters, setFilters] = useState({
    age: '',
    location: '',
    education: '',
    profession: '',
    religion: '',
    caste: ''
  });
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: page.toString(),
        limit: '12'
      });

      const response = await fetch(`/api/search?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setProfiles(data.profiles);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [filters, page]);

  return (
    <section className="relative min-h-screen flex flex-col items-center px-2 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Floral SVG Background */}
      <svg
        className="absolute left-1/2 top-0 -translate-x-1/2 z-0 w-[120vw] h-[60vh] pointer-events-none select-none"
        // ...rest of SVG
      >
        {/* ...SVG paths and circles... */}
      </svg>
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-black mb-4">
            Find Your Perfect Match
          </h1>
          <p className="text-lg sm:text-2xl font-semibold text-black mb-8" style={{ fontFamily: 'var(--font-devanagari, sans-serif)' }}>
            जहाँ रिश्ते दिल से बनते हैं
          </p>
          <p className="text-base sm:text-lg text-black mb-8">
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
              className="bg-purple-600 text-white border-2 border-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition duration-300 shadow-lg w-full sm:w-auto"
            >
              Browse Profiles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 