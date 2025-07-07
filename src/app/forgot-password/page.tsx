'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
      } else {
        setMessage(data.error || 'Failed to send reset email');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-purple-600/30 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-purple-200" />
        </div>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-white">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-purple-200">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-sm py-6 sm:py-8 px-4 sm:px-10 shadow rounded-lg">
          {!isSuccess ? (
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm sm:text-base font-medium text-purple-200">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-purple-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-2.5 sm:py-3 border border-purple-500/30 rounded-lg bg-white/5 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {message && (
                <div 
                  className={`text-sm sm:text-base text-center ${
                    isSuccess ? 'text-green-400' : 'text-pink-400'
                  }`}
                >
                  {message}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-purple-900 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>

              <div className="text-center">
                <Link 
                  href="/login" 
                  className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                >
                  Back to login
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-5 sm:space-y-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-600/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Check your email</h3>
                <p className="text-purple-200 text-sm">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-purple-300 text-xs mt-2">
                  The link will expire in 1 hour for security reasons.
                </p>
              </div>

              <div className="text-center space-y-3">
                <Link 
                  href="/login" 
                  className="block text-sm text-purple-300 hover:text-purple-200 transition-colors"
                >
                  Back to login
                </Link>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setMessage('');
                    setEmail('');
                  }}
                  className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                >
                  Send another email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 