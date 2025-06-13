'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
}

export default function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
  const router = useRouter();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (window.google?.accounts?.id) {
      setIsScriptLoaded(true);
      return;
    }

    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Google Sign-In script loaded');
      setIsScriptLoaded(true);
    };

    script.onerror = (error) => {
      console.error('Failed to load Google Sign-In script:', error);
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isScriptLoaded) return;

    try {
      console.log('Initializing Google Sign-In...');
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-login-button'),
        { theme: 'outline', size: 'large' }
      );
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
    }
  }, [isScriptLoaded]);

  const handleGoogleResponse = async (response: any) => {
    try {
      console.log('Attempting Google login...');
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();
      console.log('Google login response:', data);

      if (res.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          console.log('Login successful, redirecting to profile...');
          window.location.href = '/profile';
        }
      } else {
        console.error('Google login failed:', data.error);
        alert(data.error || 'Failed to login with Google. Please try again.');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div id="google-login-button" className="w-full flex justify-center"></div>
  );
} 