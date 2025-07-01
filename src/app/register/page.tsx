'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import formStyles from './register.module.css';
import pageStyles from './page.module.css';

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

    // Return only the missing requirements
    const missingRequirements = [];
    if (!requirements.length) {
      missingRequirements.push('At least 8 characters');
    }
    if (!requirements.letter) {
      missingRequirements.push('At least one letter');
    }
    if (!requirements.number) {
      missingRequirements.push('At least one number');
    }
    if (!requirements.special) {
      missingRequirements.push('At least one special character');
    }
    
    return missingRequirements.length > 0 ? missingRequirements.join(', ') : '';
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

  // Cleanup function to prevent removeChild error
  useEffect(() => {
    return () => {
      // Cleanup any potential event listeners or DOM elements
      const root = document.getElementById('__next');
      if (root) {
        while (root.firstChild) {
          root.removeChild(root.firstChild);
        }
      }
    };
  }, []);

  return (
    <div className={pageStyles.pageContainer}>
      <div className={pageStyles.formWrapper}>
        <div className={pageStyles.formCard}>
          <div className={pageStyles.formContent}>
            {/* Progress Steps */}
            <div className="mb-6 sm:mb-8">
              {/* Mobile Progress Indicator */}
              <div className="sm:hidden flex flex-col items-center mb-4">
                <div className={pageStyles.stepIndicator}>Step {step} of 5</div>
                <div className={pageStyles.progressBar}>
                  <div 
                    className={pageStyles.progressFill}
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
                <div className={pageStyles.stepText}>
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Personal'}
                  {step === 3 && 'Professional'}
                  {step === 4 && 'Family'}
                  {step === 5 && 'Horoscope'}
                </div>
              </div>

              {/* Desktop Progress Steps */}
              <div className="hidden sm:grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`text-center ${
                      step === stepNumber
                        ? 'text-white'
                        : step > stepNumber
                        ? 'text-pink-400'
                        : 'text-white/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm border-2 mb-2 ${
                        step === stepNumber
                          ? 'border-pink-500 bg-pink-500/20 text-white'
                          : step > stepNumber
                          ? 'border-pink-400 bg-pink-400/20 text-pink-400'
                          : 'border-white/30 bg-white/5 text-white/50'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    <div className={pageStyles.stepText}>
                      {stepNumber === 1 && 'Basic Info'}
                      {stepNumber === 2 && 'Personal'}
                      {stepNumber === 3 && 'Professional'}
                      {stepNumber === 4 && 'Family'}
                      {stepNumber === 5 && 'Horoscope'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className={pageStyles.sectionTitleCenter}>Basic Information</h2>
                  <div className={formStyles.formGrid}>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="firstName" className={formStyles.formLabel}>
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={formStyles.formInput}
                        required
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="lastName" className={formStyles.formLabel}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={formStyles.formInput}
                        required
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="email" className={formStyles.formLabel}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={formStyles.formInput}
                        required
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="password" className={formStyles.formLabel}>
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`${formStyles.formInput} ${
                          passwordError ? formStyles.errorInput : ''
                        }`}
                        required
                      />
                      
                      {/* Password Requirements Checklist */}
                      <div className="mt-3 space-y-2">
                        {(!passwordRequirements.length || !passwordRequirements.letter || 
                          !passwordRequirements.number || !passwordRequirements.special) && (
                          <>
                            <p className={formStyles.formLabel}>Password must contain:</p>
                            <div className="grid grid-cols-1 gap-2">
                              {!passwordRequirements.length && (
                                <div className={`flex items-center gap-2 text-sm ${formStyles.invalidText}`}>
                                  <span className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${formStyles.invalidBorder}`}>
                                  </span>
                                  At least 8 characters
                                </div>
                              )}
                              {!passwordRequirements.letter && (
                                <div className={`flex items-center gap-2 text-sm ${formStyles.invalidText}`}>
                                  <span className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${formStyles.invalidBorder}`}>
                                  </span>
                                  At least one letter
                                </div>
                              )}
                              {!passwordRequirements.number && (
                                <div className={`flex items-center gap-2 text-sm ${formStyles.invalidText}`}>
                                  <span className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${formStyles.invalidBorder}`}>
                                  </span>
                                  At least one number
                                </div>
                              )}
                              {!passwordRequirements.special && (
                                <div className={`flex items-center gap-2 text-sm ${formStyles.invalidText}`}>
                                  <span className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${formStyles.invalidBorder}`}>
                                  </span>
                                  At least one special character
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="confirmPassword" className={formStyles.formLabel}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={formStyles.formInput}
                        required
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="dateOfBirth" className={formStyles.formLabel}>
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={formStyles.formInput}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className={pageStyles.sectionTitle}>Personal Details</h2>
                  <div className={formStyles.formGrid}>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="height" className={formStyles.formLabel}>
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        id="height"
                        value={formData.height}
                        onChange={handleChange}
                        className={formStyles.formInput}
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="weight" className={formStyles.formLabel}>
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        id="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className={formStyles.formInput}
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="maritalStatus" className={formStyles.formLabel}>
                        Marital Status
                      </label>
                      <select
                        name="maritalStatus"
                        id="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className={formStyles.formSelect}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="never_married">Never Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="religion" className={formStyles.formLabel}>
                        Religion
                      </label>
                      <select
                        name="religion"
                        id="religion"
                        value={formData.religion}
                        onChange={handleChange}
                        className={formStyles.formSelect}
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
                    <div className={formStyles.formContainer}>
                      <label htmlFor="caste" className={formStyles.formLabel}>
                        Caste
                      </label>
                      <input
                        type="text"
                        name="caste"
                        id="caste"
                        value={formData.caste}
                        onChange={handleChange}
                        className={formStyles.formInput}
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="motherTongue" className={formStyles.formLabel}>
                        Mother Tongue
                      </label>
                      <input
                        type="text"
                        name="motherTongue"
                        id="motherTongue"
                        value={formData.motherTongue}
                        onChange={handleChange}
                        className={formStyles.formInput}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Professional Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className={pageStyles.sectionTitle}>Professional Details</h2>
                  <div className={formStyles.formGrid}>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="education" className={formStyles.formLabel}>
                        Education
                      </label>
                      <select
                        name="education"
                        id="education"
                        value={formData.education}
                        onChange={handleChange}
                        className={formStyles.formSelect}
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
                    <div className={formStyles.formContainer}>
                      <label htmlFor="occupation" className={formStyles.formLabel}>
                        Occupation
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        id="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className={formStyles.formInput}
                        required
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="annualIncome" className={formStyles.formLabel}>
                        Annual Income
                      </label>
                      <input
                        type="text"
                        name="annualIncome"
                        id="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleChange}
                        className={formStyles.formInput}
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="workLocation" className={formStyles.formLabel}>
                        Work Location
                      </label>
                      <input
                        type="text"
                        name="workLocation"
                        id="workLocation"
                        value={formData.workLocation}
                        onChange={handleChange}
                        className={formStyles.formInput}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Family Details */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className={pageStyles.sectionTitle}>Family Details</h2>
                  <div className={formStyles.formGrid}>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="fatherName" className={formStyles.formLabel}>
                        Father's Name
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        id="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className={formStyles.formInput}
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="fatherOccupation" className={formStyles.formLabel}>
                        Father's Occupation
                      </label>
                      <input
                        type="text"
                        name="fatherOccupation"
                        id="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleChange}
                        className={formStyles.formInput}
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="motherName" className={formStyles.formLabel}>
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        id="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        className={formStyles.formInput}
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="motherOccupation" className={formStyles.formLabel}>
                        Mother's Occupation
                      </label>
                      <input
                        type="text"
                        name="motherOccupation"
                        id="motherOccupation"
                        value={formData.motherOccupation}
                        onChange={handleChange}
                        className={formStyles.formInput}
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="siblings" className={formStyles.formLabel}>
                        Siblings
                      </label>
                      <input
                        type="text"
                        name="siblings"
                        id="siblings"
                        value={formData.siblings}
                        onChange={handleChange}
                        className={formStyles.formInput}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Horoscope Details */}
              {step === 5 && (
                <div className="space-y-6">
                  <h2 className={pageStyles.sectionTitle}>Horoscope & Kundli Details</h2>
                  <div className={formStyles.formGrid}>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="timeOfBirth" className={formStyles.formLabel}>
                        Time of Birth
                      </label>
                      <input
                        type="time"
                        name="timeOfBirth"
                        id="timeOfBirth"
                        value={formData.timeOfBirth}
                        onChange={handleChange}
                        className={formStyles.formInput}
                        required
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="placeOfBirth" className={formStyles.formLabel}>
                        Place of Birth
                      </label>
                      <input
                        type="text"
                        name="placeOfBirth"
                        id="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={handleChange}
                        className={formStyles.formInput}
                        required
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="rashi" className={formStyles.formLabel}>
                        Rashi (Moon Sign)
                      </label>
                      <select
                        name="rashi"
                        id="rashi"
                        value={formData.rashi}
                        onChange={handleChange}
                        className={formStyles.formSelect}
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
                    <div className={formStyles.formContainer}>
                      <label htmlFor="nakshatra" className={formStyles.formLabel}>
                        Nakshatra
                      </label>
                      <select
                        name="nakshatra"
                        id="nakshatra"
                        value={formData.nakshatra}
                        onChange={handleChange}
                        className={formStyles.formSelect}
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
                    <div className={formStyles.formContainer}>
                      <label htmlFor="gothra" className={formStyles.formLabel}>
                        Gothra
                      </label>
                      <input
                        type="text"
                        name="gothra"
                        id="gothra"
                        value={formData.gothra}
                        onChange={handleChange}
                        className={formStyles.formInput}
                        required
                      />
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="manglikStatus" className={formStyles.formLabel}>
                        Manglik Status
                      </label>
                      <select
                        name="manglikStatus"
                        id="manglikStatus"
                        value={formData.manglikStatus}
                        onChange={handleChange}
                        className={formStyles.formSelect}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="partial">Partial</option>
                      </select>
                    </div>
                    <div className={formStyles.formContainer}>
                      <label htmlFor="horoscopeFile" className={formStyles.formLabel}>
                        Upload Horoscope (PDF/JPG/PNG)
                      </label>
                      <input
                        type="file"
                        name="horoscopeFile"
                        id="horoscopeFile"
                        onChange={handleChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className={formStyles.formInput}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className={pageStyles.buttonContainer}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className={pageStyles.buttonSecondary}
                  >
                    Previous
                  </button>
                )}
                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={isNextButtonDisabled}
                    className={isNextButtonDisabled ? pageStyles.buttonPrimaryDisabled : pageStyles.buttonPrimary}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={loading ? pageStyles.buttonPrimaryDisabled : pageStyles.buttonPrimary}
                  >
                    {loading ? 'Registering...' : 'Register'}
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