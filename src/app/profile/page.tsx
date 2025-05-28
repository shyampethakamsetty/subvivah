'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';
import Image from 'next/image';
import PhotoUpload from '@/components/PhotoUpload';
import { Camera, X } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  isProfile: boolean;
  isVerified: boolean;
  caption?: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  photos?: Photo[];
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
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

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

  const handlePhotoUpload = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      
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
      } else {
        console.error('Failed to refresh user data');
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadStatus('uploading');
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('caption', caption);
      formData.append('isProfile', 'true');
      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setUploadStatus('success');
        // Refresh user data to get the new photo
        const userResponse = await fetch('/api/auth/me');
        if (userResponse.ok) {
          const data = await userResponse.json();
          setUser(data.user);
        }
        setIsUploadModalOpen(false);
        setUploadFile(null);
        setCaption('');
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      setUploadStatus('error');
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
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

  const profilePhoto = user.photos?.find(photo => photo.isProfile) || user.photos?.[0];

  return (
    <div className="min-h-screen bg-[#f7f8fa] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Image Section */}
            <div className="flex-shrink-0 relative">
              <div className="relative group">
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => {
                    if (user.photos && user.photos.length > 0) {
                      setIsPhotoModalOpen(true);
                    }
                  }}
                >
                  {profilePhoto ? (
                    <Image
                      src={profilePhoto.url}
                      alt={`${user.firstName}'s profile`}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                      priority
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <span className="text-4xl md:text-5xl font-bold text-gray-400">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>
                {/* Camera Icon */}
                <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Camera className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  </label>
                  <input
                    type="file"
                    id="photo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('isProfile', 'true');
                        handlePhotoUpload();
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-fit"
                  >
                    Edit Profile
                  </button>
                </div>
                <p className="text-gray-500">{user.email}</p>
                <div className="flex flex-wrap gap-2">
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
          </div>

          {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* About Me */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-icons text-purple-500">person</span>
                <span className="font-semibold text-gray-800">About Me</span>
              </div>
            <p className="text-gray-700 text-sm leading-relaxed">{user.profile?.aboutMe || 'No about me info yet.'}</p>
            </div>

            {/* Photo Gallery */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-icons text-purple-500">photo_camera</span>
                <span className="font-semibold text-gray-800">Photo Gallery</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  Add Photo
                </button>
                <button 
                  onClick={() => router.push('/profile/photos')}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {user.photos?.slice(0, 3).map((photo, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden relative group">
                  <Image
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-xs truncate">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
              {(!user.photos || user.photos.length < 3) && (
                <div 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <Camera className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-gray-500 text-sm">Add Photo</span>
                </div>
              )}
            </div>
          </div>

            {/* Interests & Hobbies */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-icons text-purple-500">favorite</span>
                <span className="font-semibold text-gray-800">Interests & Hobbies</span>
              </div>
            <div className="flex flex-wrap gap-2">
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
                <span className="text-gray-400 text-sm">No hobbies added yet.</span>
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

      {/* Profile Photo Modal */}
      {isPhotoModalOpen && user.photos && user.photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 z-10"
              onClick={() => setIsPhotoModalOpen(false)}
            >
              <span className="material-icons">close</span>
            </button>
            <Image
              src={profilePhoto.url}
              alt="Full Profile Photo"
              width={600}
              height={600}
              className="rounded-2xl object-contain max-h-[80vh] max-w-full"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upload Photo</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {uploadFile ? (
                  <div className="space-y-2">
                    <div className="relative w-[200px] h-[200px] mx-auto">
                      <Image
                        src={URL.createObjectURL(uploadFile)}
                        alt="Preview"
                        fill
                        className="rounded-lg object-cover"
                        sizes="200px"
                      />
                    </div>
                    <p className="text-sm text-gray-600">{uploadFile.name}</p>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to select a photo</p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  rows={3}
                  placeholder="Add a caption to your photo..."
                />
              </div>

              {uploadStatus === 'uploading' && (
                <div className="text-center text-purple-600 my-2">Uploading...</div>
              )}
              {uploadStatus === 'success' && (
                <div className="text-center text-green-600 my-2">Upload successful!</div>
              )}
              {uploadStatus === 'error' && (
                <div className="text-center text-red-600 my-2">Upload failed. Please try again.</div>
              )}

              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploading}
                className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(ProfilePage); 