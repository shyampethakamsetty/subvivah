'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SpeakingAvatar from './SpeakingAvatar';
import CityAutocomplete from '../../../components/CityAutocomplete';
import { useLanguage } from '@/context/LanguageContext';

interface BasicInfoScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData: any;
}

const educationOptions = [
  '', 'High School', 'B.Tech', 'MBBS', 'B.Com', 'BBA', 'MBA', 'MCA', 'B.Sc', 'M.Sc', 'Ph.D', 'CA', 'LLB', 'B.Arch', 'BDS', 'B.Pharm', 'M.Tech', 'Any'
];
const professionOptions = [
  '', 'Engineer', 'Doctor', 'Teacher', 'Professor', 'Lawyer', 'Accountant', 'Architect', 'Pharmacist', 'Business Analyst', 'Software Developer', 'Civil Servant', 'Entrepreneur', 'Artist', 'Designer', 'Nurse', 'Scientist', 'Manager', 'Consultant', 'Banker', 'CA', 'Other'
];

const questions = [
  {
    key: 'name',
    label: { hi: 'आपका पूरा नाम क्या है?', en: 'What is your full name?' },
    placeholder: { hi: 'पूरा नाम', en: 'Full Name' },
    type: 'text',
    required: true,
  },
  {
    key: 'age',
    label: { hi: 'आपकी उम्र क्या है?', en: 'How old are you?' },
    placeholder: { hi: 'आयु', en: 'Age' },
    type: 'number',
    required: true,
    min: 18,
    max: 100,
  },
  {
    key: 'gender',
    label: { hi: 'आपका लिंग क्या है?', en: 'What is your gender?' },
    placeholder: { hi: 'लिंग चुनें', en: 'Select gender' },
    type: 'select',
    options: [
      { value: '', label: { hi: 'लिंग चुनें', en: 'Select gender' } },
      { value: 'male', label: { hi: 'पुरुष', en: 'Male' } },
      { value: 'female', label: { hi: 'महिला', en: 'Female' } },
      { value: 'other', label: { hi: 'अन्य', en: 'Other' } },
    ],
    required: true,
  },
  {
    key: 'location',
    label: { hi: 'आप कहाँ रहते हैं?', en: 'Where are you located?' },
    placeholder: { hi: 'शहर, देश', en: 'City, Country' },
    type: 'city-autocomplete',
    required: true,
  },
  {
    key: 'profession',
    label: { hi: 'आपका पेशा क्या है?', en: 'What is your profession?' },
    placeholder: { hi: 'पेशा', en: 'Profession' },
    type: 'select',
    options: professionOptions.map(p => ({ value: p, label: { hi: p === '' ? 'पेशा चुनें' : p, en: p === '' ? 'Select Profession' : p } })),
    required: true,
  },
  {
    key: 'education',
    label: { hi: 'आपकी शिक्षा क्या है?', en: 'What is your education?' },
    placeholder: { hi: 'शिक्षा', en: 'Education' },
    type: 'select',
    options: educationOptions.map(e => ({ value: e, label: { hi: e === '' ? 'शिक्षा चुनें' : e, en: e === '' ? 'Select Education' : e } })),
    required: true,
  },
];

export default function BasicInfoScreen({ onNext, onBack, initialData }: BasicInfoScreenProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<Record<string, any>>({
    name: initialData.name || '',
    age: initialData.age || '',
    gender: initialData.gender || '',
    location: initialData.location || '',
    profession: initialData.profession || '',
    education: initialData.education || '',
  });
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState(formData[questions[0].key] || '');
  const [avatarText, setAvatarText] = useState(questions[0].label[language]);

  useEffect(() => {
    setInputValue(formData[questions[step].key] || '');
    setAvatarText(questions[step].label[language]);
  }, [step]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = questions[step].key;
    setFormData(prev => ({ ...prev, [key]: inputValue }));
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onNext({ basics: { ...formData, [key]: inputValue } });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputValue(e.target.value);
  };

  const currentQ = questions[step];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-xl mx-auto flex flex-col items-center"
    >
      {/* Avatar always visible */}
      <div className="mb-8 mt-4">
        <SpeakingAvatar text={avatarText} size="md" />
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-8 flex flex-col items-center">
        <label className="block text-2xl font-semibold text-center mb-4 text-white">
          {currentQ.label[language]}
        </label>
        {currentQ.type === 'select' ? (
          <select
            name={currentQ.key}
            value={inputValue}
            onChange={handleChange}
            required={currentQ.required}
            className="w-full px-4 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg text-white placeholder-purple-300"
          >
            {currentQ.options?.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-indigo-950 text-white">{opt.label[language]}</option>
            ))}
          </select>
        ) : currentQ.type === 'city-autocomplete' ? (
          <CityAutocomplete value={inputValue} onChange={setInputValue} required={currentQ.required} />
        ) : (
          <input
            type={currentQ.type}
            name={currentQ.key}
            value={inputValue}
            onChange={handleChange}
            required={currentQ.required}
            min={currentQ.min}
            max={currentQ.max}
            placeholder={currentQ.placeholder[language]}
            className="w-full px-4 py-2 bg-white/10 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg text-white placeholder-purple-300"
          />
        )}
        <div className="flex justify-between w-full mt-8">
          <motion.button
            type="button"
            onClick={() => {
              if (step === 0) onBack();
              else setStep(prev => prev - 1);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white/10 text-purple-200 rounded-lg font-semibold hover:bg-white/20 transition-colors"
          >
            Back
          </motion.button>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-500 hover:to-purple-500 transition-colors"
            disabled={currentQ.required && !inputValue}
          >
            {step < questions.length - 1 ? 'Next' : 'Continue'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
} 