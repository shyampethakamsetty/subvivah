'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoginModal from './LoginModal';

// Define the showLoginPopup and showRegisterPopup function types globally
declare global {
  interface Window {
    showLoginPopup?: () => void;
    showRegisterPopup?: () => void;
  }
}

export default function DelayedLoginModal() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();

  // Don't show the modal on auth-related pages
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (response.ok && data.isAuthenticated && data.user) {
          setIsAuthenticated(true);
          // Clear any existing popup functions
          if (window.showLoginPopup) {
            window.showLoginPopup = undefined;
          }
          if (window.showRegisterPopup) {
            window.showRegisterPopup = undefined;
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Only proceed if auth check is complete and user is not authenticated
    if (!authChecked || isAuthenticated || isAuthPage) {
      return;
    }

    // Initialize showLoginPopup function
    window.showLoginPopup = () => {
      setShowAuthModal(true);
    };

    // Initialize showRegisterPopup function
    window.showRegisterPopup = () => {
      setShowAuthModal(true);
    };

    return () => {
      // Cleanup
      if (window.showLoginPopup) {
        window.showLoginPopup = undefined;
      }
      if (window.showRegisterPopup) {
        window.showRegisterPopup = undefined;
      }
    };
  }, [isAuthenticated, authChecked, isAuthPage]);

  // Don't render anything if authenticated or on auth pages
  if (isAuthenticated || !authChecked || isAuthPage) {
    return null;
  }

  return (
    <LoginModal 
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
    />
  );
} 