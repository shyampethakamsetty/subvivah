'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoginModal from './LoginModal';

// Define the showLoginPopup function type globally
declare global {
  interface Window {
    showLoginPopup?: () => void;
  }
}

export default function DelayedLoginModal() {
  const [showModal, setShowModal] = useState(false);
  const [hasShownInitialPopup, setHasShownInitialPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const isRegisterPage = pathname === '/register';
  const isLoginPage = pathname === '/login';

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (response.ok && data.isAuthenticated && data.user) {
          setIsAuthenticated(true);
          // Clear any existing login popup function
          if (window.showLoginPopup) {
            window.showLoginPopup = undefined;
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
    if (!authChecked || isAuthenticated || isRegisterPage || isLoginPage) {
      return;
    }

    // Initialize showLoginPopup function
    window.showLoginPopup = () => {
      setShowModal(true);
    };

    // Show initial popup after 3 seconds if not shown before
    if (!hasShownInitialPopup) {
      const timer = setTimeout(() => {
        setShowModal(true);
        setHasShownInitialPopup(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
        if (window.showLoginPopup) {
          window.showLoginPopup = undefined;
        }
      };
    }

    return () => {
      // Cleanup
      if (window.showLoginPopup) {
        window.showLoginPopup = undefined;
      }
    };
  }, [isRegisterPage, isLoginPage, hasShownInitialPopup, isAuthenticated, authChecked]);

  // Reset hasShownInitialPopup when pathname changes
  useEffect(() => {
    setHasShownInitialPopup(false);
  }, [pathname]);

  // Don't render anything on register or login pages or if authenticated
  if (isRegisterPage || isLoginPage || isAuthenticated || !authChecked) {
    return null;
  }

  return showModal ? <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} /> : null;
} 