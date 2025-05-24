'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import Image from 'next/image';

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
    photos?: { url: string }[];
  };
}

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    maritalStatus: '',
    religion: '',
    caste: '',
    motherTongue: '',
    education: '',
    occupation: '',
    annualIncome: '',
    workLocation: '',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    siblings: '',
    familyType: '',
    familyStatus: '',
    aboutMe: '',
    hobbies: '',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          // Parse hobbies from JSON string if it exists
          if (data.user.profile?.hobbies) {
            try {
              data.user.profile.hobbies = JSON.parse(data.user.profile.hobbies);
            } catch (e) {
              data.user.profile.hobbies = [];
            }
          }
          setUser(data.user);
          if (data.user.profile) {
            setFormData({
              height: data.user.profile.height || '',
              weight: data.user.profile.weight || '',
              maritalStatus: data.user.profile.maritalStatus || '',
              religion: data.user.profile.religion || '',
              caste: data.user.profile.caste || '',
              motherTongue: data.user.profile.motherTongue || '',
              education: data.user.profile.education || '',
              occupation: data.user.profile.occupation || '',
              annualIncome: data.user.profile.annualIncome || '',
              workLocation: data.user.profile.workLocation || '',
              fatherName: data.user.profile.fatherName || '',
              fatherOccupation: data.user.profile.fatherOccupation || '',
              motherName: data.user.profile.motherName || '',
              motherOccupation: data.user.profile.motherOccupation || '',
              siblings: data.user.profile.siblings || '',
              familyType: data.user.profile.familyType || '',
              familyStatus: data.user.profile.familyStatus || '',
              aboutMe: data.user.profile.aboutMe || '',
              hobbies: Array.isArray(data.user.profile.hobbies) ? data.user.profile.hobbies.join(', ') : '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert hobbies string to array and then to JSON string for database storage
      const formDataToSubmit = {
        ...formData,
        hobbies: formData.hobbies ? JSON.stringify(formData.hobbies.split(',').map(hobby => hobby.trim()).filter(Boolean)) : null,
      };

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          ...formDataToSubmit,
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        // Parse hobbies back to array for UI
        if (updatedProfile.hobbies) {
          updatedProfile.hobbies = JSON.parse(updatedProfile.hobbies);
        }
        setUser(prev => prev ? { ...prev, profile: updatedProfile } : null);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    }
  };

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
    <div className="min-h-screen bg-[#f7f8fa] py-10 flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col items-center pt-8">
        <div className="bg-white rounded-xl shadow p-6 w-56 flex flex-col gap-4">
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-purple-50 transition"
            onClick={() => setIsEditing(true)}
          >
            <span className="material-icons text-lg">edit</span>
            Edit Profile
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          {/* Profile Card */}
          <div className="relative flex flex-col items-center mb-8 mt-4">
            <div className="w-full bg-gradient-to-r from-pink-100 via-pink-50 to-purple-50 rounded-2xl shadow p-8 pt-16 flex flex-col items-center">
              {/* Profile Image Overlap */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {user.profile?.photos?.[0] ? (
                    <Image
                      src={user.profile.photos[0].url}
                      alt={`${user.firstName}'s profile`}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-400">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                <p className="text-gray-500 mb-2">{user.email}</p>
                <div className="flex flex-wrap gap-2 mb-2 justify-center">
                  {user.profile?.maritalStatus && (
                    <span className="bg-[#f3e8ff] text-[#7c3aed] px-3 py-1 rounded-full text-xs font-semibold">{user.profile.maritalStatus}</span>
                  )}
                  {user.profile?.religion && (
                    <span className="bg-[#ffe4ef] text-[#db2777] px-3 py-1 rounded-full text-xs font-semibold">{user.profile.religion}</span>
                  )}
                  {user.profile?.education && (
                    <span className="bg-[#e0f2fe] text-[#2563eb] px-3 py-1 rounded-full text-xs font-semibold">{user.profile.education}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* About Me */}
            <div className="bg-white rounded-xl shadow p-6 flex-1 mb-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons text-purple-500">person</span>
                <span className="font-semibold text-gray-800">About Me</span>
              </div>
              <p className="text-gray-700 text-sm">{user.profile?.aboutMe || 'No about me info yet.'}</p>
            </div>
            {/* Photo Gallery */}
            <div className="bg-white rounded-xl shadow p-6 flex-1 mb-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons text-purple-500">photo_camera</span>
                <span className="font-semibold text-gray-800">Photo Gallery</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="px-4 py-1 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 text-xs font-medium bg-white">View All Photos</button>
                <button className="px-4 py-1 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 text-xs font-medium bg-white">Upload Photos</button>
              </div>
            </div>
            {/* Interests & Hobbies */}
            <div className="bg-white rounded-xl shadow p-6 flex-1 mb-4 col-span-1 md:col-span-2 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons text-purple-500">favorite</span>
                <span className="font-semibold text-gray-800">Interests & Hobbies</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.profile?.hobbies && Array.isArray(user.profile.hobbies) && user.profile.hobbies.length > 0 ? (
                  user.profile.hobbies.map((hobby, idx) => (
                    <span key={idx} className={
                      `px-3 py-1 rounded-full text-xs font-medium border ` +
                      (idx % 4 === 0 ? 'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]' :
                       idx % 4 === 1 ? 'bg-[#fef9c3] text-[#ca8a04] border-[#fde68a]' :
                       idx % 4 === 2 ? 'bg-[#d1fae5] text-[#059669] border-[#6ee7b7]' :
                                       'bg-[#e0e7ff] text-[#4338ca] border-[#a5b4fc]')
                    }>{hobby}</span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">No hobbies added yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setIsEditing(false)}
              >
                <span className="material-icons">close</span>
              </button>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Information Form */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h2>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                          <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                          <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                          <select
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          >
                            <option value="">Select</option>
                            <option value="Never Married">Never Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Awaiting Divorce">Awaiting Divorce</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Religion</label>
                          <input
                            type="text"
                            name="religion"
                            value={formData.religion}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Caste</label>
                          <input
                            type="text"
                            name="caste"
                            value={formData.caste}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Family Information</h2>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                          <input
                            type="text"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Father's Occupation</label>
                          <input
                            type="text"
                            name="fatherOccupation"
                            value={formData.fatherOccupation}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                          <input
                            type="text"
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Mother's Occupation</label>
                          <input
                            type="text"
                            name="motherOccupation"
                            value={formData.motherOccupation}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Professional Information</h2>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Education</label>
                          <input
                            type="text"
                            name="education"
                            value={formData.education}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Occupation</label>
                          <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                          <input
                            type="number"
                            name="annualIncome"
                            value={formData.annualIncome}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Work Location</label>
                          <input
                            type="text"
                            name="workLocation"
                            value={formData.workLocation}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">About Me</h2>
                      <textarea
                        name="aboutMe"
                        value={formData.aboutMe}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Hobbies & Interests</h2>
                      <input
                        type="text"
                        name="hobbies"
                        value={formData.hobbies}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                        placeholder="Enter hobbies separated by commas"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(ProfilePage); 