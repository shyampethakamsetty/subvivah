'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  photos?: { url: string; caption?: string; isProfile?: boolean }[];
  profile?: {
    height?: number;
    weight?: number;
    maritalStatus?: string;
    religion?: string;
    caste?: string;
    motherTongue?: string;
    education?: string;
    occupation?: string;
    annualIncome?: number;
    workLocation?: string;
    fatherName?: string;
    fatherOccupation?: string;
    motherName?: string;
    motherOccupation?: string;
    siblings?: number;
    familyType?: string;
    familyStatus?: string;
    aboutMe?: string;
    hobbies?: string[];
  };
}

export default function withAuth<P extends { user?: User }>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuth(props: Omit<P, 'user'>) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch('/api/auth/me');
          const data = await response.json();
          
          if (response.ok && data.isAuthenticated && data.user) {
            setIsAuthenticated(true);
            setUser(data.user);
            // Clear any existing login popup
            if (typeof window !== 'undefined' && window.showLoginPopup) {
              window.showLoginPopup = undefined;
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
            // Show login popup for unauthenticated users
            if (typeof window !== 'undefined' && typeof window.showLoginPopup === 'function') {
              window.showLoginPopup();
            }
          }
        } catch (error) {
          console.error('Auth check error:', error);
          setIsAuthenticated(false);
          setUser(null);
          // Show login popup for unauthenticated users
          if (typeof window !== 'undefined' && typeof window.showLoginPopup === 'function') {
            window.showLoginPopup();
          }
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, []);

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
          {/* Blurred overlay */}
          <div className="absolute inset-0 backdrop-blur-md z-0" />
          {/* Professional SVG spinner */}
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
      return null;
    }

    return <WrappedComponent {...(props as P)} user={user as User} />;
  };
} 