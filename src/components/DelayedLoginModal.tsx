'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

// Define the showLoginPopup and showRegisterPopup function types globally
declare global {
  interface Window {
    showLoginPopup?: () => void;
    showRegisterPopup?: () => void;
  }
}

export default function DelayedLoginModal() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [hasShownInitialPopup, setHasShownInitialPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();

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
    if (!authChecked || isAuthenticated) {
      return;
    }

    // Initialize showLoginPopup function
    window.showLoginPopup = () => {
      setShowLoginModal(true);
    };

    // Initialize showRegisterPopup function
    window.showRegisterPopup = () => {
      setShowRegisterModal(true);
    };

    // Show initial login popup after 3 seconds if not shown before
    if (!hasShownInitialPopup) {
      const timer = setTimeout(() => {
        setShowLoginModal(true);
        setHasShownInitialPopup(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
        if (window.showLoginPopup) {
          window.showLoginPopup = undefined;
        }
        if (window.showRegisterPopup) {
          window.showRegisterPopup = undefined;
        }
      };
    }

    return () => {
      // Cleanup
      if (window.showLoginPopup) {
        window.showLoginPopup = undefined;
      }
      if (window.showRegisterPopup) {
        window.showRegisterPopup = undefined;
      }
    };
  }, [hasShownInitialPopup, isAuthenticated, authChecked]);

  // Reset hasShownInitialPopup when pathname changes
  useEffect(() => {
    setHasShownInitialPopup(false);
  }, [pathname]);

  // Don't render anything if authenticated
  if (isAuthenticated || !authChecked) {
    return null;
  }

  return (
    <>
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            window.location.reload();
          }}
        />
      )}
      {showRegisterModal && (
        <RegisterModal 
          isOpen={showRegisterModal} 
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            setShowRegisterModal(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
} 