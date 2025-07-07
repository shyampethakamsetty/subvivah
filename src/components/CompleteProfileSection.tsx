"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Brain, 
  CheckCircle, 
  Circle, 
  ArrowRight,
  Edit3,
  Camera,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface CompleteProfileSectionProps {
  userProfile: any;
  user: any;
  onProfileUpdate?: () => void;
}

interface SectionStatus {
  completed: boolean;
  progress: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  route: string;
}

const CompleteProfileSection: React.FC<CompleteProfileSectionProps> = ({
  userProfile,
  user,
  onProfileUpdate
}) => {
  const router = useRouter();
  const { language } = useLanguage();
  const [sections, setSections] = useState<SectionStatus[]>([]);

  useEffect(() => {
    calculateProgress();
  }, [userProfile]);

  const calculateProgress = () => {
    const basicInfoProgress = calculateBasicInfoProgress();
    const additionalDetailsProgress = calculateAdditionalDetailsProgress();
    const genderVerificationProgress = calculateGenderVerificationProgress();
    const aiPersonalizationProgress = calculateAIPersonalizationProgress();

    setSections([
      {
        completed: basicInfoProgress === 100,
        progress: basicInfoProgress,
        title: "Basic Information",
        description: "Name, DOB, Location, etc.",
        icon: <User className="w-5 h-5" />,
        action: basicInfoProgress === 100 ? "Edit Basic Info" : "Update Basic Info",
        route: "/profile/edit-basic"
      },
      {
        completed: additionalDetailsProgress === 100,
        progress: additionalDetailsProgress,
        title: "Fill Additional Details",
        description: "Income, Family, Education, etc.",
        icon: <Edit3 className="w-5 h-5" />,
        action: additionalDetailsProgress === 100 ? "Edit Details" : "Fill Details",
        route: "/profile/additional-details"
      },
      {
        completed: genderVerificationProgress === 100,
        progress: genderVerificationProgress,
        title: "Verify Gender",
        description: "Face verification for gender confirmation",
        icon: <Camera className="w-5 h-5" />,
        action: genderVerificationProgress === 100 ? "Re-verify" : "Verify Gender",
        route: "/profile/verify-gender"
      },
      {
        completed: aiPersonalizationProgress === 100,
        progress: aiPersonalizationProgress,
        title: "AI Personalization",
        description: "Personality, interests, preferences",
        icon: <Sparkles className="w-5 h-5" />,
        action: aiPersonalizationProgress === 100 ? "Update AI Profile" : "Start AI Personalization",
        route: "/ai-personalization"
      }
    ]);
  };

  const calculateBasicInfoProgress = (): number => {
    if (!user) return 0;
    
    // Basic info fields that should be collected during registration
    const basicFields = [
      'firstName', 'lastName', 'dob', 'gender', 'email'
    ];
    
    const completedFields = basicFields.filter(field => 
      user[field] && user[field].toString().trim() !== ''
    ).length;
    
    return Math.round((completedFields / basicFields.length) * 100);
  };

  const calculateAdditionalDetailsProgress = (): number => {
    if (!userProfile) return 0;
    
    const requiredFields = [
      'height', 'weight', 'maritalStatus', 'religion', 'caste',
      'education', 'occupation', 'annualIncome', 'workLocation',
      'fatherName', 'motherName', 'siblings', 'familyType'
    ];
    
    const completedFields = requiredFields.filter(field => 
      userProfile[field] && userProfile[field].toString().trim() !== ''
    ).length;
    
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const calculateGenderVerificationProgress = (): number => {
    // Check if user has completed face verification
    return userProfile?.isVerified ? 100 : 0;
  };

  const calculateAIPersonalizationProgress = (): number => {
    if (!userProfile) return 0;
    
    const aiFields = [
      'aboutMe', 'hobbies', 'personalityTraits'
    ];
    
    const completedFields = aiFields.filter(field => 
      userProfile[field] && userProfile[field].toString().trim() !== ''
    ).length;
    
    return Math.round((completedFields / aiFields.length) * 100);
  };

  const handleSectionClick = (route: string) => {
    router.push(route);
  };

  const getOverallProgress = (): number => {
    if (sections.length === 0) return 0;
    const totalProgress = sections.reduce((sum, section) => sum + section.progress, 0);
    return Math.round(totalProgress / sections.length);
  };

  const overallProgress = getOverallProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Complete Profile</h2>
          <p className="text-purple-200">
            Complete your profile to get better matches
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{overallProgress}%</div>
          <div className="text-sm text-purple-200">Overall Progress</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-white/20 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => handleSectionClick(section.route)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  section.completed 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {section.completed ? <CheckCircle className="w-5 h-5" /> : section.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-purple-200 mb-2">
                    {section.description}
                  </p>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${section.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-2 rounded-full ${
                        section.completed 
                          ? 'bg-green-500' 
                          : 'bg-gradient-to-r from-pink-500 to-purple-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-200">
                  {section.progress}%
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-600 transition-colors"
                >
                  {section.action}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl">
        <div className="text-center">
          <p className="text-purple-200 text-sm mb-2">
            {language === 'hi' 
              ? 'अपनी प्रोफ़ाइल को पूरा करने के लिए ऊपर दिए गए विकल्पों पर क्लिक करें'
              : 'Click on the options above to complete your profile'
            }
          </p>
          <p className="text-white/60 text-xs">
            {language === 'hi'
              ? 'हर सेक्शन को पूरा करने से आपकी प्रोफ़ाइल की गुणवत्ता बेहतर होगी'
              : 'Completing each section will improve your profile quality'
            }
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CompleteProfileSection; 