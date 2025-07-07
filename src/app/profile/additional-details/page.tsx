"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Home, 
  Users, 
  DollarSign,
  MapPin,
  Heart,
  Save,
  ArrowLeft
} from 'lucide-react';
import { ModernInput, ModernSelect } from '@/components/ui/modern-input';
import { useLanguage } from '@/context/LanguageContext';

interface AdditionalDetailsForm {
  // Personal Details
  height: string;
  weight: string;
  maritalStatus: string;
  religion: string;
  caste: string;
  subCaste: string;
  motherTongue: string;
  
  // Education & Career
  education: string;
  occupation: string;
  annualIncome: string;
  workLocation: string;
  
  // Family Details
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  familyType: string;
  familyStatus: string;
  
  // Additional Info
  aboutMe: string;
  hobbies: string;
}

const AdditionalDetailsPage = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const [formData, setFormData] = useState<AdditionalDetailsForm>({
    height: '',
    weight: '',
    maritalStatus: '',
    religion: '',
    caste: '',
    subCaste: '',
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
    hobbies: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const profileData = await response.json();
        setFormData(prev => ({
          ...prev,
          ...profileData
        }));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const maritalStatusOptions = [
    { value: 'never_married', label: { hi: 'कभी शादी नहीं हुई', en: 'Never Married' } },
    { value: 'divorced', label: { hi: 'तलाकशुदा', en: 'Divorced' } },
    { value: 'widowed', label: { hi: 'विधवा/विधुर', en: 'Widowed' } },
    { value: 'awaiting_divorce', label: { hi: 'तलाक की प्रक्रिया में', en: 'Awaiting Divorce' } }
  ];

  const educationOptions = [
    { value: 'high_school', label: { hi: 'हाई स्कूल', en: 'High School' } },
    { value: 'bachelors', label: { hi: 'स्नातक', en: 'Bachelor\'s' } },
    { value: 'masters', label: { hi: 'स्नातकोत्तर', en: 'Master\'s' } },
    { value: 'phd', label: { hi: 'पीएचडी', en: 'PhD' } },
    { value: 'diploma', label: { hi: 'डिप्लोमा', en: 'Diploma' } },
    { value: 'other', label: { hi: 'अन्य', en: 'Other' } }
  ];

  const familyTypeOptions = [
    { value: 'nuclear', label: { hi: 'एकल परिवार', en: 'Nuclear Family' } },
    { value: 'joint', label: { hi: 'संयुक्त परिवार', en: 'Joint Family' } },
    { value: 'extended', label: { hi: 'विस्तारित परिवार', en: 'Extended Family' } }
  ];

  const familyStatusOptions = [
    { value: 'middle_class', label: { hi: 'मध्यम वर्ग', en: 'Middle Class' } },
    { value: 'upper_middle_class', label: { hi: 'उच्च मध्यम वर्ग', en: 'Upper Middle Class' } },
    { value: 'upper_class', label: { hi: 'उच्च वर्ग', en: 'Upper Class' } },
    { value: 'lower_middle_class', label: { hi: 'निम्न मध्यम वर्ग', en: 'Lower Middle Class' } }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.height.trim()) {
      newErrors.height = language === 'hi' ? 'ऊंचाई आवश्यक है' : 'Height is required';
    }
    if (!formData.maritalStatus) {
      newErrors.maritalStatus = language === 'hi' ? 'वैवाहिक स्थिति आवश्यक है' : 'Marital status is required';
    }
    if (!formData.education) {
      newErrors.education = language === 'hi' ? 'शिक्षा आवश्यक है' : 'Education is required';
    }
    if (!formData.occupation.trim()) {
      newErrors.occupation = language === 'hi' ? 'व्यवसाय आवश्यक है' : 'Occupation is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show success message and redirect
        router.push('/profile?message=details_updated');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: language === 'hi' ? 'प्रोफ़ाइल अपडेट करने में त्रुटि' : 'Error updating profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const TEXT = {
    hi: {
      title: 'अतिरिक्त विवरण',
      subtitle: 'अपनी प्रोफ़ाइल को पूरा करें',
      personalDetails: 'व्यक्तिगत विवरण',
      educationCareer: 'शिक्षा और करियर',
      familyDetails: 'पारिवारिक विवरण',
      additionalInfo: 'अतिरिक्त जानकारी',
      save: 'सहेजें',
      back: 'वापस',
      errors: {
        height: 'ऊंचाई आवश्यक है',
        maritalStatus: 'वैवाहिक स्थिति आवश्यक है',
        education: 'शिक्षा आवश्यक है',
        occupation: 'व्यवसाय आवश्यक है'
      }
    },
    en: {
      title: 'Additional Details',
      subtitle: 'Complete your profile',
      personalDetails: 'Personal Details',
      educationCareer: 'Education & Career',
      familyDetails: 'Family Details',
      additionalInfo: 'Additional Information',
      save: 'Save',
      back: 'Back',
      errors: {
        height: 'Height is required',
        maritalStatus: 'Marital status is required',
        education: 'Education is required',
        occupation: 'Occupation is required'
      }
    }
  };

  const t = TEXT[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-white">{t.title}</h1>
              <p className="text-purple-200">{t.subtitle}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">{t.personalDetails}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModernInput
                  label={language === 'hi' ? 'ऊंचाई' : 'Height'}
                  value={formData.height}
                  onChange={(value) => setFormData(prev => ({ ...prev, height: value }))}
                  error={errors.height}
                  placeholder={language === 'hi' ? 'सेमी में' : 'in cm'}
                  variant="glass"
                />
                
                <ModernInput
                  label={language === 'hi' ? 'वजन' : 'Weight'}
                  value={formData.weight}
                  onChange={(value) => setFormData(prev => ({ ...prev, weight: value }))}
                  placeholder={language === 'hi' ? 'किलो में' : 'in kg'}
                  variant="glass"
                />
                
                <ModernSelect
                  label={language === 'hi' ? 'वैवाहिक स्थिति' : 'Marital Status'}
                  value={formData.maritalStatus}
                  onChange={(value) => setFormData(prev => ({ ...prev, maritalStatus: value }))}
                  options={maritalStatusOptions.map(option => ({
                    value: option.value,
                    label: option.label[language]
                  }))}
                  error={errors.maritalStatus}
                  variant="glass"
                />
                
                <ModernInput
                  label={language === 'hi' ? 'धर्म' : 'Religion'}
                  value={formData.religion}
                  onChange={(value) => setFormData(prev => ({ ...prev, religion: value }))}
                  variant="glass"
                />
                
                <ModernInput
                  label={language === 'hi' ? 'जाति' : 'Caste'}
                  value={formData.caste}
                  onChange={(value) => setFormData(prev => ({ ...prev, caste: value }))}
                  variant="glass"
                />
                
                <ModernInput
                  label={language === 'hi' ? 'उपजाति' : 'Sub Caste'}
                  value={formData.subCaste}
                  onChange={(value) => setFormData(prev => ({ ...prev, subCaste: value }))}
                  variant="glass"
                />
                
                <ModernInput
                  label={language === 'hi' ? 'मातृभाषा' : 'Mother Tongue'}
                  value={formData.motherTongue}
                  onChange={(value) => setFormData(prev => ({ ...prev, motherTongue: value }))}
                  variant="glass"
                />
              </div>
            </motion.div>

            {/* Education & Career Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">{t.educationCareer}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModernSelect
                  label={language === 'hi' ? 'शिक्षा' : 'Education'}
                  value={formData.education}
                  onChange={(value) => setFormData(prev => ({ ...prev, education: value }))}
                  options={educationOptions.map(option => ({
                    value: option.value,
                    label: option.label[language]
                  }))}
                  error={errors.education}
                  variant="glass"
                />
                
                <ModernInput
                  label={language === 'hi' ? 'व्यवसाय' : 'Occupation'}
                  value={formData.occupation}
                  onChange={(value) => setFormData(prev => ({ ...prev, occupation: value }))}
                  error={errors.occupation}
                  variant="glass"
                />
                
                <ModernInput
                  label={language === 'hi' ? 'वार्षिक आय' : 'Annual Income'}
                  value={formData.annualIncome}
                  onChange={(value) => setFormData(prev => ({ ...prev, annualIncome: value }))}
                  placeholder={language === 'hi' ? 'रुपये में' : 'in rupees'}
                  variant="glass"
                />
                
                <ModernInput
                  label={language === 'hi' ? 'कार्य स्थान' : 'Work Location'}
                  value={formData.workLocation}
                  onChange={(value) => setFormData(prev => ({ ...prev, workLocation: value }))}
                  variant="glass"
                />
              </div>
            </motion.div>

            {/* Family Details Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">{t.familyDetails}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModernInput
                  label={language === 'hi' ? 'पिता का नाम' : 'Father\'s Name'}
                  value={formData.fatherName}
                  onChange={(value) => setFormData(prev => ({ ...prev, fatherName: value }))}
                  variant="glass"
                />
                
                <ModernInput
                  label={language === 'hi' ? 'पिता का व्यवसाय' : 'Father\'s Occupation'}
                  value={formData.fatherOccupation}
                  onChange={(value) => setFormData(prev => ({ ...prev, fatherOccupation: value }))}
                  variant="glass"
                />
                
                <ModernInput
                  label={language === 'hi' ? 'माता का नाम' : 'Mother\'s Name'}
                  value={formData.motherName}
                  onChange={(value) => setFormData(prev => ({ ...prev, motherName: value }))}
                  variant="glass"
                />
                
                <ModernInput
                  label={language === 'hi' ? 'माता का व्यवसाय' : 'Mother\'s Occupation'}
                  value={formData.motherOccupation}
                  onChange={(value) => setFormData(prev => ({ ...prev, motherOccupation: value }))}
                  variant="glass"
                />
                
                <ModernInput
                  label={language === 'hi' ? 'भाई-बहन' : 'Siblings'}
                  value={formData.siblings}
                  onChange={(value) => setFormData(prev => ({ ...prev, siblings: value }))}
                  placeholder={language === 'hi' ? 'उदाहरण: 2 भाई, 1 बहन' : 'e.g., 2 brothers, 1 sister'}
                  variant="glass"
                />
                
                <ModernSelect
                  label={language === 'hi' ? 'परिवार का प्रकार' : 'Family Type'}
                  value={formData.familyType}
                  onChange={(value) => setFormData(prev => ({ ...prev, familyType: value }))}
                  options={familyTypeOptions.map(option => ({
                    value: option.value,
                    label: option.label[language]
                  }))}
                  variant="glass"
                />
                
                <ModernSelect
                  label={language === 'hi' ? 'परिवार की स्थिति' : 'Family Status'}
                  value={formData.familyStatus}
                  onChange={(value) => setFormData(prev => ({ ...prev, familyStatus: value }))}
                  options={familyStatusOptions.map(option => ({
                    value: option.value,
                    label: option.label[language]
                  }))}
                  variant="glass"
                />
              </div>
            </motion.div>

            {/* Additional Information Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">{t.additionalInfo}</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {language === 'hi' ? 'मेरे बारे में' : 'About Me'}
                  </label>
                  <textarea
                    value={formData.aboutMe}
                    onChange={(e) => setFormData(prev => ({ ...prev, aboutMe: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder={language === 'hi' ? 'अपने बारे में कुछ लिखें...' : 'Write something about yourself...'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {language === 'hi' ? 'शौक और रुचियां' : 'Hobbies & Interests'}
                  </label>
                  <textarea
                    value={formData.hobbies}
                    onChange={(e) => setFormData(prev => ({ ...prev, hobbies: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder={language === 'hi' ? 'अपने शौक और रुचियां लिखें...' : 'Write your hobbies and interests...'}
                  />
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                {t.back}
              </motion.button>
              
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {t.save}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdditionalDetailsPage; 