'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import SpeakingAvatar from './SpeakingAvatar';

interface ProfileSummaryScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData: {
    shardAnswers: Record<string, string>;
    personalizedAnswers: Record<string, string>;
  };
}

interface ProfileSummary {
  summary: string;
  keyTraits: string[];
  compatibilityNotes: string;
  matchPreferences: string;
}

export default function ProfileSummaryScreen({ onNext, onBack, initialData }: ProfileSummaryScreenProps) {
  const { language } = useLanguage();
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarText, setAvatarText] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<any>(null);

  useEffect(() => {
    generateSummary();
  }, []);

  const generateSummary = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      console.log('Generating summary with data:', initialData);
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shardAnswers: initialData.shardAnswers,
          personalizedAnswers: initialData.personalizedAnswers,
          language
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      console.log('Generated summary:', data);
      setSummary(data);
      setAvatarText('I have generated a summary based on your answers. Please review it and make sure it represents you accurately.');
    } catch (error) {
      console.error('Error generating summary:', error);
      setError('Failed to generate summary. Please try again.');
      setAvatarText('I apologize, but I encountered an error while generating your summary. Would you like to try again?');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const verifyData = async () => {
    try {
      const verifyResponse = await fetch('/api/ai/verify-personalization', {
        credentials: 'include'
      });
      
      if (!verifyResponse.ok) {
        throw new Error('Failed to verify data');
      }

      const verifyResult = await verifyResponse.json();
      console.log('✅ Verification result:', verifyResult);
      setVerificationStatus(verifyResult.verification);

      if (!verifyResult.verification.exists || !verifyResult.verification.isComplete) {
        throw new Error('Data not saved completely');
      }

      return true;
    } catch (error) {
      console.error('❌ Verification failed:', error);
      return false;
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      console.log('📝 Saving personalization data:', {
        shardAnswers: initialData.shardAnswers,
        personalizedAnswers: initialData.personalizedAnswers,
        profileSummary: summary,
        isCompleted: true
      });

      // Save all data to database
      const saveResponse = await fetch('/api/ai/save-personalization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shardAnswers: initialData.shardAnswers,
          personalizedAnswers: initialData.personalizedAnswers,
          profileSummary: summary,
          isCompleted: true
        }),
        credentials: 'include'
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save personalization data');
      }

      const saveData = await saveResponse.json();
      console.log('✅ Save successful:', saveData);

      // Verify the saved data
      const isVerified = await verifyData();
      
      if (!isVerified) {
        throw new Error('Data verification failed');
      }

      setSaveSuccess(true);
      setAvatarText('Great! Your profile has been saved and verified successfully. You can now proceed to your profile page.');
      
      setTimeout(() => {
        onNext({ isCompleted: true });
      }, 1500);

    } catch (error) {
      console.error('❌ Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save your profile. Please try again.');
      setAvatarText('I apologize, but there was an error saving your profile. Would you like to try again?');
      setSaveSuccess(false);
    } finally {
      setSaving(false);
    }
  };

  const TEXT = {
    hi: {
      title: 'आपकी प्रोफ़ाइल सारांश',
      subtitle: 'आपकी पसंद और जवाबों के आधार पर तैयार किया गया',
      generating: 'आपकी प्रोफ़ाइल तैयार कर रहे हैं...',
      keyTraits: 'मुख्य विशेषताएं',
      compatibilityNotes: 'संगतता नोट्स',
      matchPreferences: 'मैच प्राथमिकताएं',
      complete: 'पूरा करें',
      back: 'वापस',
      error: 'प्रोफ़ाइल सारांश तैयार करने में समस्या हुई। कृपया फिर से कोशिश करें।'
    },
    en: {
      title: 'Your Profile Summary',
      subtitle: 'Generated based on your preferences and answers',
      generating: 'Preparing your profile...',
      keyTraits: 'Key Traits',
      compatibilityNotes: 'Compatibility Notes',
      matchPreferences: 'Match Preferences',
      complete: 'Complete',
      back: 'Back',
      error: 'Failed to generate profile summary. Please try again.'
    }
  };

  const t = TEXT[language];

  if (loading || generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-600">
          {generating ? 'Generating your profile summary...' : 'Loading...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <button
          onClick={() => {
            setError(null);
            generateSummary();
          }}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">
        {language === 'hi' ? 'आपका प्रोफ़ाइल सारांश' : 'Your Profile Summary'}
      </h2>

      {summary && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'hi' ? 'सारांश' : 'Summary'}
            </h3>
            <p className="text-gray-700">{summary.summary}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'hi' ? 'प्रमुख विशेषताएं' : 'Key Traits'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {summary.keyTraits.map((trait, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'hi' ? 'संगतता नोट्स' : 'Compatibility Notes'}
            </h3>
            <p className="text-gray-700">{summary.compatibilityNotes}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'hi' ? 'मैच प्राथमिकताएं' : 'Match Preferences'}
            </h3>
            <p className="text-gray-700">{summary.matchPreferences}</p>
          </div>
        </div>
      )}

      {verificationStatus && (
        <div className="bg-white/10 p-4 rounded-lg mt-4">
          <h3 className="text-lg font-semibold text-white mb-2">Verification Status</h3>
          <ul className="space-y-2">
            <li className="flex items-center text-sm">
              <span className={verificationStatus.exists ? "text-green-400" : "text-red-400"}>
                {verificationStatus.exists ? "✓" : "✗"} Data Exists
              </span>
            </li>
            <li className="flex items-center text-sm">
              <span className={verificationStatus.isComplete ? "text-green-400" : "text-red-400"}>
                {verificationStatus.isComplete ? "✓" : "✗"} Completion Status
              </span>
            </li>
            <li className="flex items-center text-sm">
              <span className={verificationStatus.hasShardAnswers ? "text-green-400" : "text-red-400"}>
                {verificationStatus.hasShardAnswers ? "✓" : "✗"} Shard Answers
              </span>
            </li>
            <li className="flex items-center text-sm">
              <span className={verificationStatus.hasPersonalizedAnswers ? "text-green-400" : "text-red-400"}>
                {verificationStatus.hasPersonalizedAnswers ? "✓" : "✗"} Personalized Answers
              </span>
            </li>
            <li className="flex items-center text-sm">
              <span className={verificationStatus.hasProfileSummary ? "text-green-400" : "text-red-400"}>
                {verificationStatus.hasProfileSummary ? "✓" : "✗"} Profile Summary
              </span>
            </li>
          </ul>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          disabled={saving}
        >
          {language === 'hi' ? 'पीछे' : 'Back'}
        </button>

        <button
          onClick={handleComplete}
          disabled={saving || !summary}
          className={`px-6 py-2 rounded transition-colors relative ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : saveSuccess
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-purple-500 hover:bg-purple-600'
          } text-white`}
        >
          {saving ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              {language === 'hi' ? 'सहेज रहा है...' : 'Saving...'}
            </span>
          ) : saveSuccess ? (
            <span className="flex items-center">
              <span className="mr-2">✓</span>
              {language === 'hi' ? 'सफलतापूर्वक सहेजा गया' : 'Saved Successfully'}
            </span>
          ) : (
            language === 'hi' ? 'पूर्ण करें' : 'Complete'
          )}
        </button>
      </div>
    </div>
  );
} 