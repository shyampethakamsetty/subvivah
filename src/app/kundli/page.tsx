'use client';

import { useState, useEffect } from 'react';
import StaticKundli from '@/components/StaticKundli';
import KundliGenerator from '@/components/KundliGenerator';
import { ZodiacProvider } from '@/context/ZodiacContext';

export default function KundliPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        
        if (!data.isAuthenticated) {
          // Show login popup after 4 seconds
          const timer = setTimeout(() => {
            if (typeof window !== 'undefined' && typeof (window as any).showLoginPopup === 'function') {
              (window as any).showLoginPopup();
            }
          }, 4000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md z-0" />
        <div className="relative z-10 flex flex-col items-center">
          <svg className="animate-spin h-14 w-14 text-purple-300 mb-4" viewBox="0 0 50 50">
            <circle className="opacity-20" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" />
            <circle className="opacity-70" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="31.4 94.2" />
          </svg>
          <span className="text-purple-200 text-lg font-medium animate-pulse">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <StaticKundli />;
  }

  return (
    <ZodiacProvider>
      <div>
        <KundliGenerator />
      </div>
    </ZodiacProvider>
  );
}