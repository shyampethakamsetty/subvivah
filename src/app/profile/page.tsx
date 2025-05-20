'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
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

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleVerifyEmail = async () => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user?.email }),
      });

      if (response.ok) {
        alert('Verification email sent! Please check your inbox.');
      } else {
        alert('Failed to send verification email.');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      alert('An error occurred while sending the verification email.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            {!user.isVerified && (
              <button
                onClick={handleVerifyEmail}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Verify Email
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-gray-900">{`${user.firstName} ${user.lastName}`}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Verification</label>
                  <p className="mt-1 text-gray-900">
                    {user.isVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
            </div>

            {user.profile && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Details</h2>
                <div className="space-y-4">
                  {user.profile.height && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Height</label>
                      <p className="mt-1 text-gray-900">{user.profile.height} cm</p>
                    </div>
                  )}
                  {user.profile.weight && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Weight</label>
                      <p className="mt-1 text-gray-900">{user.profile.weight} kg</p>
                    </div>
                  )}
                  {user.profile.maritalStatus && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                      <p className="mt-1 text-gray-900">{user.profile.maritalStatus}</p>
                    </div>
                  )}
                  {user.profile.religion && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Religion</label>
                      <p className="mt-1 text-gray-900">{user.profile.religion}</p>
                    </div>
                  )}
                  {user.profile.caste && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Caste</label>
                      <p className="mt-1 text-gray-900">{user.profile.caste}</p>
                    </div>
                  )}
                  {user.profile.motherTongue && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mother Tongue</label>
                      <p className="mt-1 text-gray-900">{user.profile.motherTongue}</p>
                    </div>
                  )}
                  {user.profile.education && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Education</label>
                      <p className="mt-1 text-gray-900">{user.profile.education}</p>
                    </div>
                  )}
                  {user.profile.occupation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Occupation</label>
                      <p className="mt-1 text-gray-900">{user.profile.occupation}</p>
                    </div>
                  )}
                  {user.profile.annualIncome && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                      <p className="mt-1 text-gray-900">₹{user.profile.annualIncome.toLocaleString()}</p>
                    </div>
                  )}
                  {user.profile.workLocation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Work Location</label>
                      <p className="mt-1 text-gray-900">{user.profile.workLocation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage); 