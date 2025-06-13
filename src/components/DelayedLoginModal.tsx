'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import LoginModal from './LoginModal';

// Define the showLoginPopup function type globally
declare global {
  interface Window {
    showLoginPopup: () => void;
  }
}

export default function DelayedLoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get('redirect') || null;

  // Initialize showLoginPopup immediately
  if (typeof window !== 'undefined') {
    window.showLoginPopup = () => {
      console.log('Login popup triggered'); // Add logging for debugging
      setIsOpen(true);
    };
  }

  useEffect(() => {
    // Ensure showLoginPopup is always available
    if (typeof window !== 'undefined' && !window.showLoginPopup) {
      window.showLoginPopup = () => {
        console.log('Login popup triggered from useEffect'); // Add logging for debugging
        setIsOpen(true);
      };
    }

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        
        if (!data.isAuthenticated) {
          // Check if current page requires authentication
          const authRequiredPages = ['/matches', '/dating', '/brahmand-chat', '/messages', '/kundli'];
          
          // Show popup for homepage after 3 seconds
          if (pathname === '/') {
            console.log('Homepage detected, showing login popup after 3 seconds');
            const timer = setTimeout(() => {
              console.log('Showing login popup for homepage');
              setIsOpen(true);
            }, 3000);
            return () => clearTimeout(timer);
          }
          
          // Show popup immediately for auth-required pages
          if (authRequiredPages.some(page => pathname?.startsWith(page))) {
            console.log('Auth required page detected:', pathname);
            const timer = setTimeout(() => {
              console.log('Showing login popup for auth-required page');
              setIsOpen(true);
            }, 1000); // Reduced delay for better UX
            return () => clearTimeout(timer);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };

    // Run auth check on both initial load and route changes
    checkAuth();
  }, [pathname]); // Add pathname as dependency to re-run on route changes

  const handleLoginSuccess = () => {
    setIsOpen(false);
    // Refresh and redirect to profile or specified redirect path
    window.location.href = redirectPath || '/profile';
  };

  return <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSuccess={handleLoginSuccess} />;
} 