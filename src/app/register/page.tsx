'use client';

import { useState } from 'react';
import Image from 'next/image';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    
    // Step 2: Personal Details
    height: '',
    weight: '',
    maritalStatus: '',
    religion: '',
    caste: '',
    motherTongue: '',
    
    // Step 3: Professional Details
    education: '',
    occupation: '',
    annualIncome: '',
    workLocation: '',
    
    // Step 4: Family Details
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    siblings: '',
    
    // Step 5: Horoscope Details
    timeOfBirth: '',
    placeOfBirth: '',
    rashi: '',
    nakshatra: '',
    gothra: '',
    manglikStatus: '',
    horoscopeFile: null,
    
    // Step 6: Partner Preferences
    preferredAge: '',
    preferredHeight: '',
    preferredEducation: '',
    preferredOccupation: '',
    preferredLocation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful
      alert('Registration successful! Please check your email to verify your account.');
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error('Registration error:', error);
      alert(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="hidden sm:flex items-center justify-between">
                {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stepNumber <= step ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 6 && (
                      <div
                        className={`h-1 w-16 ${
                          stepNumber < step ? 'bg-pink-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="hidden sm:flex justify-between mt-2 text-sm text-gray-500">
                <span>Basic Info</span>
                <span>Personal</span>
                <span>Professional</span>
                <span>Family</span>
                <span>Horoscope</span>
                <span>Preferences</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Google Sign-up Button */}
              <div className="mb-8">
                <GoogleLoginButton />
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with registration form</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        name="gender"
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        id="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        id="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
                        Marital Status
                      </label>
                      <select
                        name="maritalStatus"
                        id="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="never_married">Never Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="religion" className="block text-sm font-medium text-gray-700">
                        Religion
                      </label>
                      <select
                        name="religion"
                        id="religion"
                        value={formData.religion}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      >
                        <option value="">Select Religion</option>
                        <option value="hindu">Hindu</option>
                        <option value="muslim">Muslim</option>
                        <option value="christian">Christian</option>
                        <option value="sikh">Sikh</option>
                        <option value="jain">Jain</option>
                        <option value="buddhist">Buddhist</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="caste" className="block text-sm font-medium text-gray-700">
                        Caste
                      </label>
                      <input
                        type="text"
                        name="caste"
                        id="caste"
                        value={formData.caste}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="motherTongue" className="block text-sm font-medium text-gray-700">
                        Mother Tongue
                      </label>
                      <input
                        type="text"
                        name="motherTongue"
                        id="motherTongue"
                        value={formData.motherTongue}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Professional Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Professional Details</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                        Education
                      </label>
                      <select
                        name="education"
                        id="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      >
                        <option value="">Select Education</option>
                        <option value="high_school">High School</option>
                        <option value="bachelors">Bachelor's Degree</option>
                        <option value="masters">Master's Degree</option>
                        <option value="phd">PhD</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                        Occupation
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        id="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700">
                        Annual Income
                      </label>
                      <input
                        type="text"
                        name="annualIncome"
                        id="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="workLocation" className="block text-sm font-medium text-gray-700">
                        Work Location
                      </label>
                      <input
                        type="text"
                        name="workLocation"
                        id="workLocation"
                        value={formData.workLocation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Family Details */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Family Details</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">
                        Father's Name
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        id="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="fatherOccupation" className="block text-sm font-medium text-gray-700">
                        Father's Occupation
                      </label>
                      <input
                        type="text"
                        name="fatherOccupation"
                        id="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="motherName" className="block text-sm font-medium text-gray-700">
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        id="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="motherOccupation" className="block text-sm font-medium text-gray-700">
                        Mother's Occupation
                      </label>
                      <input
                        type="text"
                        name="motherOccupation"
                        id="motherOccupation"
                        value={formData.motherOccupation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="siblings" className="block text-sm font-medium text-gray-700">
                        Siblings
                      </label>
                      <input
                        type="text"
                        name="siblings"
                        id="siblings"
                        value={formData.siblings}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Horoscope Details */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Horoscope & Kundli Details</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="timeOfBirth" className="block text-sm font-medium text-gray-700">
                        Time of Birth
                      </label>
                      <input
                        type="time"
                        name="timeOfBirth"
                        id="timeOfBirth"
                        value={formData.timeOfBirth}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700">
                        Place of Birth
                      </label>
                      <input
                        type="text"
                        name="placeOfBirth"
                        id="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="rashi" className="block text-sm font-medium text-gray-700">
                        Rashi (Moon Sign)
                      </label>
                      <select
                        name="rashi"
                        id="rashi"
                        value={formData.rashi}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      >
                        <option value="">Select Rashi</option>
                        <option value="aries">Aries</option>
                        <option value="taurus">Taurus</option>
                        <option value="gemini">Gemini</option>
                        <option value="cancer">Cancer</option>
                        <option value="leo">Leo</option>
                        <option value="virgo">Virgo</option>
                        <option value="libra">Libra</option>
                        <option value="scorpio">Scorpio</option>
                        <option value="sagittarius">Sagittarius</option>
                        <option value="capricorn">Capricorn</option>
                        <option value="aquarius">Aquarius</option>
                        <option value="pisces">Pisces</option>
                      </select>
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="nakshatra" className="block text-sm font-medium text-gray-700">
                        Nakshatra
                      </label>
                      <select
                        name="nakshatra"
                        id="nakshatra"
                        value={formData.nakshatra}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      >
                        <option value="">Select Nakshatra</option>
                        <option value="ashwini">Ashwini</option>
                        <option value="bharani">Bharani</option>
                        <option value="krittika">Krittika</option>
                        <option value="rohini">Rohini</option>
                        <option value="mrigashira">Mrigashira</option>
                        <option value="ardra">Ardra</option>
                        <option value="punarvasu">Punarvasu</option>
                        <option value="pushya">Pushya</option>
                        <option value="ashlesha">Ashlesha</option>
                        <option value="magha">Magha</option>
                        <option value="purva-phalguni">Purva Phalguni</option>
                        <option value="uttara-phalguni">Uttara Phalguni</option>
                        <option value="hasta">Hasta</option>
                        <option value="chitra">Chitra</option>
                        <option value="swati">Swati</option>
                        <option value="vishakha">Vishakha</option>
                        <option value="anuradha">Anuradha</option>
                        <option value="jyestha">Jyestha</option>
                        <option value="mula">Mula</option>
                        <option value="purva-ashadha">Purva Ashadha</option>
                        <option value="uttara-ashadha">Uttara Ashadha</option>
                        <option value="shravana">Shravana</option>
                        <option value="dhanishta">Dhanishta</option>
                        <option value="shatabhisha">Shatabhisha</option>
                        <option value="purva-bhadrapada">Purva Bhadrapada</option>
                        <option value="uttara-bhadrapada">Uttara Bhadrapada</option>
                        <option value="revati">Revati</option>
                      </select>
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="gothra" className="block text-sm font-medium text-gray-700">
                        Gothra
                      </label>
                      <input
                        type="text"
                        name="gothra"
                        id="gothra"
                        value={formData.gothra}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="manglikStatus" className="block text-sm font-medium text-gray-700">
                        Manglik Status
                      </label>
                      <select
                        name="manglikStatus"
                        id="manglikStatus"
                        value={formData.manglikStatus}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="partial">Partial</option>
                      </select>
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="horoscopeFile" className="block text-sm font-medium text-gray-700">
                        Upload Horoscope (PDF/JPG/PNG)
                      </label>
                      <input
                        type="file"
                        name="horoscopeFile"
                        id="horoscopeFile"
                        onChange={handleChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="mt-1 block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-pink-50 file:text-pink-700
                          hover:file:bg-pink-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Partner Preferences */}
              {step === 6 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Partner Preferences</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="preferredAge" className="block text-sm font-medium text-gray-700">
                        Preferred Age Range
                      </label>
                      <input
                        type="text"
                        name="preferredAge"
                        id="preferredAge"
                        value={formData.preferredAge}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="preferredHeight" className="block text-sm font-medium text-gray-700">
                        Preferred Height
                      </label>
                      <input
                        type="text"
                        name="preferredHeight"
                        id="preferredHeight"
                        value={formData.preferredHeight}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="preferredEducation" className="block text-sm font-medium text-gray-700">
                        Preferred Education
                      </label>
                      <select
                        name="preferredEducation"
                        id="preferredEducation"
                        value={formData.preferredEducation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      >
                        <option value="">Select Education</option>
                        <option value="high_school">High School</option>
                        <option value="bachelors">Bachelor's Degree</option>
                        <option value="masters">Master's Degree</option>
                        <option value="phd">PhD</option>
                        <option value="any">Any</option>
                      </select>
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="preferredOccupation" className="block text-sm font-medium text-gray-700">
                        Preferred Occupation
                      </label>
                      <input
                        type="text"
                        name="preferredOccupation"
                        id="preferredOccupation"
                        value={formData.preferredOccupation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border rounded-lg bg-white shadow-sm p-3 sm:hover:shadow-md sm:hover:border-pink-500">
                      <label htmlFor="preferredLocation" className="block text-sm font-medium text-gray-700">
                        Preferred Location
                      </label>
                      <input
                        type="text"
                        name="preferredLocation"
                        id="preferredLocation"
                        value={formData.preferredLocation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                {step < 6 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
                  >
                    Complete Registration
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 