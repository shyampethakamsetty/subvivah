'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonRendered, setButtonRendered] = useState(false);
  
  useEffect(() => {
    // Load Google SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
        });
        
        // Render the button if the container exists
        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer && !buttonRendered) {
          window.google.accounts.id.renderButton(
            buttonContainer,
            { 
              type: 'standard', 
              theme: 'outline', 
              size: 'large',
              shape: 'rectangular',
              text: 'continue_with',
              logo_alignment: 'left',
              width: '100%'
            }
          );
          setButtonRendered(true);
        }
      }
    };

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [buttonRendered]);

  const handleCredentialResponse = async (response: any) => {
    if (!response.credential) {
      console.error('No credential received');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      if (res.ok) {
        window.location.href = '/profile';
      } else {
        console.error('Google login failed');
        alert('Failed to login with Google. Please try again.');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      alert('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <button
          disabled
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500 mr-2"></div>
          Connecting...
        </button>
      ) : (
        <div id="google-signin-button" className="w-full"></div>
      )}
    </div>
  );
} 