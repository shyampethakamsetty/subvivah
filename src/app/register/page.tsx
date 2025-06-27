'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    letter: false,
    number: false,
    special: false
  });
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'unknown',
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
  });

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      letter: /[a-zA-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    setPasswordRequirements(requirements);

    if (!requirements.length) {
      return 'Password must be at least 8 characters long';
    }
    if (!requirements.letter) {
      return 'Password must contain at least one letter';
    }
    if (!requirements.number) {
      return 'Password must contain at least one number';
    }
    if (!requirements.special) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate password when it changes
    if (name === 'password') {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  const nextStep = () => {
    // For step 1, validate password before proceeding
    if (step === 1 && passwordError) {
      alert('Please fix the password issues before proceeding');
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      // Validate password requirements
      const passwordValidationError = validatePassword(formData.password);
      if (passwordValidationError) {
        alert(passwordValidationError);
        return;
      }

      // Register the user
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.error || 'Registration failed');
      }

      // After successful registration, automatically log in
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Auto-login failed');
      }

      // Registration and auto-login successful
      alert('Registration successful! Welcome to शुभ विवाह!');
      window.location.href = '/profile'; // Redirect to profile page
    } catch (error) {
      console.error('Registration/Login error:', error);
      alert(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isNextButtonDisabled = loading || (step === 1 && passwordError !== '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 py-6 sm:py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
          <div className="p-4 sm:p-6">
            {/* Progress Steps */}
            <div className="mb-6 sm:mb-8">
              {/* Mobile Progress Indicator */}
              <div className="sm:hidden flex flex-col items-center mb-4">
                <div className="text-white text-lg font-semibold mb-2">Step {step} of 5</div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-600 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
                <div className="text-purple-200 text-sm mt-2">
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Personal'}
                  {step === 3 && 'Professional'}
                  {step === 4 && 'Family'}
                  {step === 5 && 'Horoscope'}
                </div>
              </div>

              {/* Desktop Progress Steps */}
              <div className="hidden sm:flex items-center justify-between">
                {[1, 2, 3, 4, 5].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stepNumber <= step ? 'bg-pink-600 text-white' : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 5 && (
                      <div
                        className={`h-1 w-20 ${
                          stepNumber < step ? 'bg-pink-600' : 'bg-white/10'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="hidden sm:flex justify-between mt-2 text-sm text-purple-200">
                <span>Basic Info</span>
                <span>Personal</span>
                <span>Professional</span>
                <span>Family</span>
                <span>Horoscope</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white text-center sm:text-left">Basic Information</h2>
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 sm:p-4 hover:bg-white/10 transition-colors">
                      <label htmlFor="firstName" className="block text-sm font-medium text-purple-200 mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/10 border border-purple-300/20 text-white placeholder-purple-200/50 focus:border-pink-500 focus:ring-pink-500 shadow-sm text-base sm:text-sm"
                        required
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 sm:p-4 hover:bg-white/10 transition-colors">
                      <label htmlFor="lastName" className="block text-sm font-medium text-purple-200 mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/10 border border-purple-300/20 text-white placeholder-purple-200/50 focus:border-pink-500 focus:ring-pink-500 shadow-sm text-base sm:text-sm"
                        required
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 sm:p-4 hover:bg-white/10 transition-colors">
                      <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/10 border border-purple-300/20 text-white placeholder-purple-200/50 focus:border-pink-500 focus:ring-pink-500 shadow-sm text-base sm:text-sm"
                        required
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 sm:p-4 hover:bg-white/10 transition-colors">
                      <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-1.5">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md bg-white/10 border shadow-sm focus:ring-pink-500 ${
                          passwordError ? 'border-red-500 focus:border-red-500' : 'border-purple-300/20 focus:border-pink-500'
                        } text-white placeholder-purple-200/50 text-base sm:text-sm`}
                        required
                      />
                      
                      {/* Password Requirements Checklist */}
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-purple-200">Password must contain:</p>
                        <div className="grid grid-cols-1 gap-2">
                          <div className={`flex items-center gap-2 text-sm ${
                            passwordRequirements.length ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            <span className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${
                              passwordRequirements.length ? 'border-green-400 bg-green-400/20' : 'border-gray-500'
                            }`}>
                              {passwordRequirements.length && (
                                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            At least 8 characters
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${
                            passwordRequirements.letter ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            <span className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${
                              passwordRequirements.letter ? 'border-green-400 bg-green-400/20' : 'border-gray-500'
                            }`}>
                              {passwordRequirements.letter && (
                                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            At least one letter
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${
                            passwordRequirements.number ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            <span className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${
                              passwordRequirements.number ? 'border-green-400 bg-green-400/20' : 'border-gray-500'
                            }`}>
                              {passwordRequirements.number && (
                                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            At least one number
                          </div>
                          <div className={`flex items-center gap-2 text-sm ${
                            passwordRequirements.special ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            <span className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${
                              passwordRequirements.special ? 'border-green-400 bg-green-400/20' : 'border-gray-500'
                            }`}>
                              {passwordRequirements.special && (
                                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            At least one special character
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 sm:p-4 hover:bg-white/10 transition-colors">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-200 mb-1.5">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/10 border border-purple-300/20 text-white placeholder-purple-200/50 focus:border-pink-500 focus:ring-pink-500 shadow-sm text-base sm:text-sm"
                        required
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 sm:p-4 hover:bg-white/10 transition-colors">
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-purple-200 mb-1.5">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500 text-base sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Personal Details</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="height" className="block text-sm font-medium text-purple-200">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        id="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="weight" className="block text-sm font-medium text-purple-200">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        id="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="maritalStatus" className="block text-sm font-medium text-purple-200">
                        Marital Status
                      </label>
                      <select
                        name="maritalStatus"
                        id="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:ring-pink-500"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="never_married">Never Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="religion" className="block text-sm font-medium text-purple-200">
                        Religion
                      </label>
                      <select
                        name="religion"
                        id="religion"
                        value={formData.religion}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:ring-pink-500"
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
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="caste" className="block text-sm font-medium text-purple-200">
                        Caste
                      </label>
                      <input
                        type="text"
                        name="caste"
                        id="caste"
                        value={formData.caste}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="motherTongue" className="block text-sm font-medium text-purple-200">
                        Mother Tongue
                      </label>
                      <input
                        type="text"
                        name="motherTongue"
                        id="motherTongue"
                        value={formData.motherTongue}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Professional Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Professional Details</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="education" className="block text-sm font-medium text-purple-200">
                        Education
                      </label>
                      <select
                        name="education"
                        id="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:ring-pink-500"
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
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="occupation" className="block text-sm font-medium text-purple-200">
                        Occupation
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        id="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="annualIncome" className="block text-sm font-medium text-purple-200">
                        Annual Income
                      </label>
                      <input
                        type="text"
                        name="annualIncome"
                        id="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="workLocation" className="block text-sm font-medium text-purple-200">
                        Work Location
                      </label>
                      <input
                        type="text"
                        name="workLocation"
                        id="workLocation"
                        value={formData.workLocation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Family Details */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Family Details</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="fatherName" className="block text-sm font-medium text-purple-200">
                        Father's Name
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        id="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="fatherOccupation" className="block text-sm font-medium text-purple-200">
                        Father's Occupation
                      </label>
                      <input
                        type="text"
                        name="fatherOccupation"
                        id="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="motherName" className="block text-sm font-medium text-purple-200">
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        id="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="motherOccupation" className="block text-sm font-medium text-purple-200">
                        Mother's Occupation
                      </label>
                      <input
                        type="text"
                        name="motherOccupation"
                        id="motherOccupation"
                        value={formData.motherOccupation}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="siblings" className="block text-sm font-medium text-purple-200">
                        Siblings
                      </label>
                      <input
                        type="text"
                        name="siblings"
                        id="siblings"
                        value={formData.siblings}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Horoscope Details */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Horoscope & Kundli Details</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="timeOfBirth" className="block text-sm font-medium text-purple-200">
                        Time of Birth
                      </label>
                      <input
                        type="time"
                        name="timeOfBirth"
                        id="timeOfBirth"
                        value={formData.timeOfBirth}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="placeOfBirth" className="block text-sm font-medium text-purple-200">
                        Place of Birth
                      </label>
                      <input
                        type="text"
                        name="placeOfBirth"
                        id="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="rashi" className="block text-sm font-medium text-purple-200">
                        Rashi (Moon Sign)
                      </label>
                      <select
                        name="rashi"
                        id="rashi"
                        value={formData.rashi}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:ring-pink-500"
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
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="nakshatra" className="block text-sm font-medium text-purple-200">
                        Nakshatra
                      </label>
                      <select
                        name="nakshatra"
                        id="nakshatra"
                        value={formData.nakshatra}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:ring-pink-500"
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
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="gothra" className="block text-sm font-medium text-purple-200">
                        Gothra
                      </label>
                      <input
                        type="text"
                        name="gothra"
                        id="gothra"
                        value={formData.gothra}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="manglikStatus" className="block text-sm font-medium text-purple-200">
                        Manglik Status
                      </label>
                      <select
                        name="manglikStatus"
                        id="manglikStatus"
                        value={formData.manglikStatus}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 text-white focus:border-pink-500 focus:ring-pink-500"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="partial">Partial</option>
                      </select>
                    </div>
                    <div className="border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm shadow-sm p-3 hover:bg-white/10 transition-colors">
                      <label htmlFor="horoscopeFile" className="block text-sm font-medium text-purple-200">
                        Upload Horoscope (PDF/JPG/PNG)
                      </label>
                      <input
                        type="file"
                        name="horoscopeFile"
                        id="horoscopeFile"
                        onChange={handleChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="mt-1 block w-full text-sm text-purple-200
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

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-white/20 rounded-md text-sm font-medium text-purple-200 hover:bg-white/5 transition-colors"
                    disabled={loading}
                  >
                    Back
                  </button>
                )}
                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 transition-colors"
                    disabled={isNextButtonDisabled}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    disabled={loading || Boolean(passwordError)}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
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