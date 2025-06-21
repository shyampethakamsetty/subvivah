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
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Don't initialize popup on register or login pages or if authenticated
    if (!isRegisterPage && !isLoginPage && !isAuthenticated) {
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
    } else if (isAuthenticated) {
      // Clear any existing login popup function when authenticated
      if (window.showLoginPopup) {
        window.showLoginPopup = undefined;
      }
      setShowModal(false);
    }

    return () => {
      // Cleanup
      if (window.showLoginPopup) {
        window.showLoginPopup = undefined;
      }
    };
  }, [isRegisterPage, isLoginPage, hasShownInitialPopup, isAuthenticated]);

  // Reset hasShownInitialPopup when pathname changes
  useEffect(() => {
    setHasShownInitialPopup(false);
  }, [pathname]);

  // Ensure showLoginPopup is always available except on register/login pages and for authenticated users
  if (typeof window !== 'undefined' && !window.showLoginPopup && !isRegisterPage && !isLoginPage && !isAuthenticated) {
    window.showLoginPopup = () => {
      setShowModal(true);
    };
  }

  // Don't render anything on register or login pages or if authenticated
  if (isRegisterPage || isLoginPage || isAuthenticated) {
    return null;
  }

  return showModal ? <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} /> : null;
} 