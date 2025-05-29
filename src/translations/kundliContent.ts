import { Language } from './types';

interface KundliContentTranslation {
  signs: {
    aries: string;
    taurus: string;
    gemini: string;
    cancer: string;
    leo: string;
    virgo: string;
    libra: string;
    scorpio: string;
    sagittarius: string;
    capricorn: string;
    aquarius: string;
    pisces: string;
  };
  nakshatras: {
    ashwini: string;
    bharani: string;
    krittika: string;
    rohini: string;
    mrigashira: string;
    ardra: string;
    punarvasu: string;
    pushya: string;
    ashlesha: string;
    magha: string;
    purvaphalguni: string;
    uttaraphalguni: string;
    hasta: string;
    chitra: string;
    swati: string;
    vishakha: string;
    anuradha: string;
    jyeshtha: string;
    mula: string;
    purvashadha: string;
    uttarashadha: string;
    shravana: string;
    dhanishta: string;
    shatabhisha: string;
    purvabhadrapada: string;
    uttarabhadrapada: string;
    revati: string;
  };
  houses: {
    first: string;
    second: string;
    third: string;
    fourth: string;
    fifth: string;
    sixth: string;
    seventh: string;
    eighth: string;
    ninth: string;
    tenth: string;
    eleventh: string;
    twelfth: string;
  };
  standardPredictions: {
    ascendant: {
      health: Record<string, string>;
      temperament: Record<string, string>;
      physical: Record<string, string>;
    };
    nakshatra: {
      general: Record<string, string>;
      educationIncome: Record<string, string>;
      familyLife: Record<string, string>;
    };
  };
}

// Create a base English translation object
const englishPredictions = {
  ascendant: {
    health: {
      aries: 'Generally healthy and energetic. Pay attention to head-related issues.',
      taurus: 'Strong constitution but watch throat and neck area.',
      gemini: 'Anabolic health, respiratory system, and oxygen needs.',
      cancer: 'Sensitive digestive system, pay attention to emotional health.',
      leo: 'Strong heart, pay attention to the health of the bones.',
      virgo: 'Digestive health important, stress management needed.',
      libra: 'Balanced health, pay attention to the health of the neck and chest.',
      scorpio: 'Strong immune system, pay attention to reproductive health.',
      sagittarius: 'Etheletic, pay attention to the health of the joints and movements.',
      capricorn: 'Strong bones, pay attention to the health of the skin and joints.',
      aquarius: 'Respiratory health important, pay attention to blood circulation.',
      pisces: 'Sensitive body, pay attention to the health of the reproductive system.'
    },
    temperament: {
      aries: 'Dynamic, enthusiastic, and natural leader.',
      taurus: 'Patient, reliable, and determined.',
      gemini: 'Multi-faced, inquisitive, and communicative.',
      cancer: 'Emotional, attentive, and protective.',
      leo: 'Self-confident, generous, and ambitious.',
      virgo: 'Analytical, organized, and perfectionist.',
      libra: 'Fair-minded, sociable, and friendly.',
      scorpio: 'Quick, aggressive, and secretive.',
      sagittarius: 'Independent, ambitious, and adventurous.',
      capricorn: 'Analytical, responsible, and ambitious.',
      aquarius: 'Mature, humanistic, and independent thinker.',
      pisces: 'Creative, joyful, and spiritual.'
    },
    physical: {
      aries: 'Athletic build, prominent forehead, quick movements.',
      taurus: 'Well-built, strong neck, steady gait.',
      gemini: 'Long, muscular body, strong arms.',
      cancer: 'Medium height, round face, attractive eyes.',
      leo: 'Rapid metabolism, thick hair, attractive appearance.',
      virgo: 'Slim, strong neck, clean skin.',
      libra: 'Balanced body, attractive face, attractive smile.',
      scorpio: 'Strong body, sharp eyes, attractive appearance.',
      sagittarius: 'Long body, athletic build, attractive smile.',
      capricorn: 'Strong bones, round face, self-confident gait.',
      aquarius: 'Slim body, attractive eyes, unique style.',
      pisces: 'Soft body, attractive eyes, smooth gait.'
    }
  },
  nakshatra: {
    general: {
      ashwini: 'Quick learner, healing abilities, adventurous nature.',
      bharani: 'Determined, resourceful, and transformative.',
      krittika: 'Quick, ambitious, leadership capability.',
      rohini: 'Calm, physical pleasure, stable nature.',
      mrigashira: 'Bright, soft, inquisitive nature.',
      ardra: 'Energetic, lively, thick emotions.',
      punarvasu: 'Vedic, religious, social.',
      pushya: 'Nourishing, attentive, religious.',
      ashlesha: 'Quadruped, secretive, deep understanding.',
      magha: 'Ambitious, leader, prominent.',
      purvaphalguni: 'Creative, joyful, social.',
      uttaraphalguni: 'Social, moral, successful.',
      hasta: 'Skilled, practical, multi-faced.',
      chitra: 'Calm, attractive, proud.',
      swati: 'Independent, lively, anabolic.',
      vishakha: 'Target-oriented, ambitious, strong.',
      anuradha: 'Mature, successful, friendly.',
      jyeshtha: 'Powerful, leader, prominent.',
      mula: 'Spiritual, searching, root cause.',
      purvashadha: 'Energetic, motivating, humanistic.',
      uttarashadha: 'Victorious, moral, successful.',
      shravana: 'Vedic, authoritative, religious.',
      dhanishta: 'Rich, musical, generous.',
      shatabhisha: 'Medical, knowledgeable, secretive.',
      purvabhadrapada: 'Spiritual, thick, sharp intelligence.',
      uttarabhadrapada: 'Lucky, spiritual, successful.',
      revati: 'Bright, kind, lucky.'
    },
    educationIncome: {
      ashwini: 'Excellence in medical or sports-related fields. Good earning potential through independent ventures.',
      bharani: 'Success in research and investigation. Income through transformative work.',
      krittika: 'Success in technical and management fields. Income from leadership positions.',
      rohini: 'Success in art, music, or trade. Stable income source.',
      mrigashira: 'Bright, soft, inquisitive nature.',
      ardra: 'Energetic, lively, thick emotions.',
      punarvasu: 'Vedic, religious, social.',
      pushya: 'Nourishing, attentive, religious.',
      ashlesha: 'Quadruped, secretive, deep understanding.',
      magha: 'Ambitious, leader, prominent.',
      purvaphalguni: 'Creative, joyful, social.',
      uttaraphalguni: 'Social, moral, successful.',
      hasta: 'Skilled, practical, multi-faced.',
      chitra: 'Calm, attractive, proud.',
      swati: 'Independent, lively, anabolic.',
      vishakha: 'Target-oriented, ambitious, strong.',
      anuradha: 'Mature, successful, friendly.',
      jyeshtha: 'Powerful, leader, prominent.',
      mula: 'Spiritual, searching, root cause.',
      purvashadha: 'Energetic, motivating, humanistic.',
      uttarashadha: 'Victorious, moral, successful.',
      shravana: 'Vedic, authoritative, religious.',
      dhanishta: 'Rich, musical, generous.',
      shatabhisha: 'Medical, knowledgeable, secretive.',
      purvabhadrapada: 'Spiritual, thick, sharp intelligence.',
      uttarabhadrapada: 'Lucky, spiritual, successful.',
      revati: 'Bright, kind, lucky.'
    },
    familyLife: {
      ashwini: 'Active family life, supportive of health and wellness activities.',
      bharani: 'Strong family bonds, may face initial challenges.',
      krittika: 'Energetic family environment, leadership role.',
      rohini: 'Happy family life, physical pleasure.',
      mrigashira: 'Bright, soft, inquisitive nature.',
      ardra: 'Energetic, lively, thick emotions.',
      punarvasu: 'Vedic, religious, social.',
      pushya: 'Nourishing, attentive, religious.',
      ashlesha: 'Quadruped, secretive, deep understanding.',
      magha: 'Ambitious, leader, prominent.',
      purvaphalguni: 'Creative, joyful, social.',
      uttaraphalguni: 'Social, moral, successful.',
      hasta: 'Skilled, practical, multi-faced.',
      chitra: 'Calm, attractive, proud.',
      swati: 'Independent, lively, anabolic.',
      vishakha: 'Target-oriented, ambitious, strong.',
      anuradha: 'Mature, successful, friendly.',
      jyeshtha: 'Powerful, leader, prominent.',
      mula: 'Spiritual, searching, root cause.',
      purvashadha: 'Energetic, motivating, humanistic.',
      uttarashadha: 'Victorious, moral, successful.',
      shravana: 'Vedic, authoritative, religious.',
      dhanishta: 'Rich, musical, generous.',
      shatabhisha: 'Medical, knowledgeable, secretive.',
      purvabhadrapada: 'Spiritual, thick, sharp intelligence.',
      uttarabhadrapada: 'Lucky, spiritual, successful.',
      revati: 'Bright, kind, lucky.'
    }
  }
};

const englishTranslation = {
  signs: {
    aries: 'Aries',
    taurus: 'Taurus',
    gemini: 'Gemini',
    cancer: 'Cancer',
    leo: 'Leo',
    virgo: 'Virgo',
    libra: 'Libra',
    scorpio: 'Scorpio',
    sagittarius: 'Sagittarius',
    capricorn: 'Capricorn',
    aquarius: 'Aquarius',
    pisces: 'Pisces'
  },
  nakshatras: {
    ashwini: 'Ashwini',
    bharani: 'Bharani',
    krittika: 'Krittika',
    rohini: 'Rohini',
    mrigashira: 'Mrigashira',
    ardra: 'Ardra',
    punarvasu: 'Punarvasu',
    pushya: 'Pushya',
    ashlesha: 'Ashlesha',
    magha: 'Magha',
    purvaphalguni: 'Purva Phalguni',
    uttaraphalguni: 'Uttara Phalguni',
    hasta: 'Hasta',
    chitra: 'Chitra',
    swati: 'Swati',
    vishakha: 'Vishakha',
    anuradha: 'Anuradha',
    jyeshtha: 'Jyeshtha',
    mula: 'Mula',
    purvashadha: 'Purvashadha',
    uttarashadha: 'Uttarashadha',
    shravana: 'Shravana',
    dhanishta: 'Dhanishta',
    shatabhisha: 'Shatabhisha',
    purvabhadrapada: 'Purva Bhadrapada',
    uttarabhadrapada: 'Uttara Bhadrapada',
    revati: 'Revati'
  },
  houses: {
    first: 'First House (Ascendant)',
    second: 'Second House (Wealth)',
    third: 'Third House (Siblings)',
    fourth: 'Fourth House (Home)',
    fifth: 'Fifth House (Children)',
    sixth: 'Sixth House (Enemies)',
    seventh: 'Seventh House (Marriage)',
    eighth: 'Eighth House (Longevity)',
    ninth: 'Ninth House (Fortune)',
    tenth: 'Tenth House (Career)',
    eleventh: 'Eleventh House (Gains)',
    twelfth: 'Twelfth House (Loss)'
  },
  standardPredictions: {
    ascendant: {
      health: englishPredictions.ascendant.health,
      temperament: englishPredictions.ascendant.temperament,
      physical: englishPredictions.ascendant.physical
    },
    nakshatra: {
      general: englishPredictions.nakshatra.general,
      educationIncome: englishPredictions.nakshatra.educationIncome,
      familyLife: englishPredictions.nakshatra.familyLife
    }
  }
};

const kundliContent: Record<Language, KundliContentTranslation> = {
  en: englishTranslation,
  hi: {
    signs: {
      aries: 'मेष',
      taurus: 'वृषभ',
      gemini: 'मिथुन',
      cancer: 'कर्क',
      leo: 'सिंह',
      virgo: 'कन्या',
      libra: 'तुला',
      scorpio: 'वृश्चिक',
      sagittarius: 'धनु',
      capricorn: 'मकर',
      aquarius: 'कुंभ',
      pisces: 'मीन'
    },
    nakshatras: {
      ashwini: 'अश्विनी',
      bharani: 'भरणी',
      krittika: 'कृत्तिका',
      rohini: 'रोहिणी',
      mrigashira: 'मृगशिरा',
      ardra: 'आर्द्रा',
      punarvasu: 'पुनर्वसु',
      pushya: 'पुष्य',
      ashlesha: 'आश्लेषा',
      magha: 'मघा',
      purvaphalguni: 'पूर्व फाल्गुनी',
      uttaraphalguni: 'उत्तर फाल्गुनी',
      hasta: 'हस्त',
      chitra: 'चित्रा',
      swati: 'स्वाति',
      vishakha: 'विशाखा',
      anuradha: 'अनुराधा',
      jyeshtha: 'ज्येष्ठा',
      mula: 'मूल',
      purvashadha: 'पूर्वाषाढ़ा',
      uttarashadha: 'उत्तराषाढ़ा',
      shravana: 'श्रवण',
      dhanishta: 'धनिष्ठा',
      shatabhisha: 'शतभिषा',
      purvabhadrapada: 'पूर्व भाद्रपद',
      uttarabhadrapada: 'उत्तर भाद्रपद',
      revati: 'रेवती'
    },
    houses: {
      first: 'प्रथम भाव (लग्न)',
      second: 'द्वितीय भाव (धन)',
      third: 'तृतीय भाव (भाई-बहन)',
      fourth: 'चतुर्थ भाव (गृह)',
      fifth: 'पंचम भाव (संतान)',
      sixth: 'षष्ठ भाव (शत्रु)',
      seventh: 'सप्तम भाव (विवाह)',
      eighth: 'अष्टम भाव (आयु)',
      ninth: 'नवम भाव (भाग्य)',
      tenth: 'दशम भाव (कर्म)',
      eleventh: 'एकादश भाव (लाभ)',
      twelfth: 'द्वादश भाव (व्यय)'
    },
    standardPredictions: {
      ascendant: {
        health: { ...englishPredictions.ascendant.health },
        temperament: { ...englishPredictions.ascendant.temperament },
        physical: { ...englishPredictions.ascendant.physical }
      },
      nakshatra: {
        general: { ...englishPredictions.nakshatra.general },
        educationIncome: { ...englishPredictions.nakshatra.educationIncome },
        familyLife: { ...englishPredictions.nakshatra.familyLife }
      }
    }
  },
  kn: {
    signs: {
      aries: 'ಮೇಷ',
      taurus: 'ವೃಷಭ',
      gemini: 'ಮಿಥುನ',
      cancer: 'ಕರ್ಕಾಟಕ',
      leo: 'ಸಿಂಹ',
      virgo: 'ಕನ್ಯಾ',
      libra: 'ತುಲಾ',
      scorpio: 'ವೃಶ್ಚಿಕ',
      sagittarius: 'ಧನುಸ್ಸು',
      capricorn: 'ಮಕರ',
      aquarius: 'ಕುಂಭ',
      pisces: 'ಮೀನ'
    },
    nakshatras: {
      ashwini: 'ಅಶ್ವಿನಿ',
      bharani: 'ಭರಣಿ',
      krittika: 'ಕೃತ್ತಿಕಾ',
      rohini: 'ರೋಹಿಣಿ',
      mrigashira: 'ಮೃಗಶಿರಾ',
      ardra: 'ಆರ್ದ್ರಾ',
      punarvasu: 'ಪುನರ್ವಸು',
      pushya: 'ಪುಷ್ಯ',
      ashlesha: 'ಆಶ್ಲೇಷಾ',
      magha: 'ಮಘಾ',
      purvaphalguni: 'ಪೂರ್ವ ಫಲ್ಗುಣಿ',
      uttaraphalguni: 'ಉತ್ತರ ಫಲ್ಗುಣಿ',
      hasta: 'ಹಸ್ತ',
      chitra: 'ಚಿತ್ರಾ',
      swati: 'ಸ್ವಾತಿ',
      vishakha: 'ವಿಶಾಖಾ',
      anuradha: 'ಅನುರಾಧಾ',
      jyeshtha: 'ಜ್ಯೇಷ್ಠಾ',
      mula: 'ಮೂಲ',
      purvashadha: 'ಪೂರ್ವಾಷಾಢ',
      uttarashadha: 'ಉತ್ತರಾಷಾಢ',
      shravana: 'ಶ್ರವಣ',
      dhanishta: 'ಧನಿಷ್ಠಾ',
      shatabhisha: 'ಶತಭಿಷಾ',
      purvabhadrapada: 'ಪೂರ್ವ ಭಾದ್ರಪದ',
      uttarabhadrapada: 'ಉತ್ತರ ಭಾದ್ರಪದ',
      revati: 'ರೇವತಿ'
    },
    houses: {
      first: 'ಪ್ರಥಮ ಭಾವ (ಲಗ್ನ)',
      second: 'ದ್ವಿತೀಯ ಭಾವ (ಧನ)',
      third: 'ತೃತೀಯ ಭಾವ (ಸಹೋದರ)',
      fourth: 'ಚತುರ್ಥ ಭಾವ (ಗೃಹ)',
      fifth: 'ಪಂಚಮ ಭಾವ (ಸಂತಾನ)',
      sixth: 'ಷಷ್ಠ ಭಾವ (ಶತ್ರು)',
      seventh: 'ಸಪ್ತಮ ಭಾವ (ವಿವಾಹ)',
      eighth: 'ಅಷ್ಟಮ ಭಾವ (ಆಯುಷ್ಯ)',
      ninth: 'ನವಮ ಭಾವ (ಭಾಗ್ಯ)',
      tenth: 'ದಶಮ ಭಾವ (ಕರ್ಮ)',
      eleventh: 'ಏಕಾದಶ ಭಾವ (ಲಾಭ)',
      twelfth: 'ದ್ವಾದಶ ಭಾವ (ವ್ಯಯ)'
    },
    standardPredictions: {
      ascendant: {
        health: { ...englishPredictions.ascendant.health },
        temperament: { ...englishPredictions.ascendant.temperament },
        physical: { ...englishPredictions.ascendant.physical }
      },
      nakshatra: {
        general: { ...englishPredictions.nakshatra.general },
        educationIncome: { ...englishPredictions.nakshatra.educationIncome },
        familyLife: { ...englishPredictions.nakshatra.familyLife }
      }
    }
  },
  as: {
    signs: {
      aries: 'মেষ',
      taurus: 'বৃষ',
      gemini: 'মিথুন',
      cancer: 'কর্কট',
      leo: 'সিংহ',
      virgo: 'কন্যা',
      libra: 'তুলা',
      scorpio: 'বৃশ্চিক',
      sagittarius: 'ধনু',
      capricorn: 'মকর',
      aquarius: 'কুম্ভ',
      pisces: 'মীন'
    },
    nakshatras: {
      ashwini: 'অশ্বিনী',
      bharani: 'ভৰণী',
      krittika: 'কৃত্তিকা',
      rohini: 'ৰোহিণী',
      mrigashira: 'মৃগশিৰা',
      ardra: 'আৰ্দ্ৰা',
      punarvasu: 'পুনর্বসু',
      pushya: 'পুষ্য',
      ashlesha: 'আশ্লেষা',
      magha: 'মঘা',
      purvaphalguni: 'পূৰ্ব ফাল্গুনী',
      uttaraphalguni: 'উত্তৰ ফাল্গুনী',
      hasta: 'হস্ত',
      chitra: 'চিত্ৰা',
      swati: 'স্বাতী',
      vishakha: 'বিশাখা',
      anuradha: 'অনুৰাধা',
      jyeshtha: 'জ্যৈষ্ঠা',
      mula: 'মূলা',
      purvashadha: 'পূৰ্বাষাঢ়া',
      uttarashadha: 'উত্তৰাষাঢ়া',
      shravana: 'শ্ৰৱণ',
      dhanishta: 'ধনিষ্ঠা',
      shatabhisha: 'শতভিষা',
      purvabhadrapada: 'পূর্ব ভাদ্ৰপদ',
      uttarabhadrapada: 'উত্তৰ ভাদ্ৰপদ',
      revati: 'ৰেৱতী'
    },
    houses: {
      first: 'প্ৰথম ভাৱ (লগ্ন)',
      second: 'দ্বিতীয় ভাৱ (ধন)',
      third: 'তৃতীয় ভাৱ (ভ্রাতৃ)',
      fourth: 'চতুৰ্থ ভাৱ (গৃহ)',
      fifth: 'পঞ্চম ভাৱ (সন্তান)',
      sixth: 'ষষ্ঠ ভাৱ (শত্ৰু)',
      seventh: 'সপ্তম ভাৱ (বিবাহ)',
      eighth: 'অষ্টম ভাৱ (আয়ু)',
      ninth: 'নৱম ভাৱ (ভাগ্য)',
      tenth: 'দশম ভাৱ (কর্ম)',
      eleventh: 'একাদশ ভাৱ (লাভ)',
      twelfth: 'দ্বাদশ ভাৱ (ব্যয়)'
    },
    standardPredictions: {
      ascendant: {
        health: { ...englishPredictions.ascendant.health },
        temperament: { ...englishPredictions.ascendant.temperament },
        physical: { ...englishPredictions.ascendant.physical }
      },
      nakshatra: {
        general: { ...englishPredictions.nakshatra.general },
        educationIncome: { ...englishPredictions.nakshatra.educationIncome },
        familyLife: { ...englishPredictions.nakshatra.familyLife }
      }
    }
  },
  bn: {
    signs: {
      aries: 'মেষ',
      taurus: 'বৃষ',
      gemini: 'মিথুন',
      cancer: 'কর্কট',
      leo: 'সিংহ',
      virgo: 'কন্যা',
      libra: 'তুলা',
      scorpio: 'বৃশ্চিক',
      sagittarius: 'ধনু',
      capricorn: 'মকর',
      aquarius: 'কুম্ভ',
      pisces: 'মীন'
    },
    nakshatras: {
      ashwini: 'অশ্বিনী',
      bharani: 'ভরণী',
      krittika: 'কৃত্তিকা',
      rohini: 'রোহিণী',
      mrigashira: 'মৃগশিরা',
      ardra: 'আর্দ্রা',
      punarvasu: 'পুনর্বসু',
      pushya: 'পুষ্য',
      ashlesha: 'আশ্লেষা',
      magha: 'মঘা',
      purvaphalguni: 'পূর্ব ফাল্গুনী',
      uttaraphalguni: 'উত্তর ফাল্গুনী',
      hasta: 'হস্ত',
      chitra: 'চিত্রা',
      swati: 'স্বাতী',
      vishakha: 'বিশাখা',
      anuradha: 'অনুরাধা',
      jyeshtha: 'জ্যৈষ্ঠা',
      mula: 'মূলা',
      purvashadha: 'পূর্বাষাঢ়া',
      uttarashadha: 'উত্তরাষাঢ়া',
      shravana: 'শ্রবণ',
      dhanishta: 'ধনিষ্ঠা',
      shatabhisha: 'শতভিষা',
      purvabhadrapada: 'পূর্ব ভাদ্রপদ',
      uttarabhadrapada: 'উত্তর ভাদ্রপদ',
      revati: 'রেবতী'
    },
    houses: {
      first: 'প্রথম ভাব (লগ্ন)',
      second: 'দ্বিতীয় ভাব (ধন)',
      third: 'তৃতীয় ভাব (ভ্রাতৃ)',
      fourth: 'চতুৰ্থ ভাব (গৃহ)',
      fifth: 'পঞ্চম ভাব (সন্তান)',
      sixth: 'ষষ্ঠ ভাব (শত্ৰু)',
      seventh: 'সপ্তম ভাব (বিবাহ)',
      eighth: 'অষ্টম ভাব (আয়ু)',
      ninth: 'নবম ভাব (ভাগ্য)',
      tenth: 'দশম ভাব (কর্ম)',
      eleventh: 'একাদশ ভাব (লাভ)',
      twelfth: 'দ্বাদশ ভাব (ব্যয়)'
    },
    standardPredictions: {
      ascendant: {
        health: { ...englishPredictions.ascendant.health },
        temperament: { ...englishPredictions.ascendant.temperament },
        physical: { ...englishPredictions.ascendant.physical }
      },
      nakshatra: {
        general: { ...englishPredictions.nakshatra.general },
        educationIncome: { ...englishPredictions.nakshatra.educationIncome },
        familyLife: { ...englishPredictions.nakshatra.familyLife }
      }
    }
  },
  brx: { ...englishTranslation },
  doi: { ...englishTranslation },
  gu: { ...englishTranslation },
  ml: { ...englishTranslation },
  mni: { ...englishTranslation },
  mr: { ...englishTranslation },
  ne: { ...englishTranslation },
  or: { ...englishTranslation },
  pa: { ...englishTranslation },
  sa: { ...englishTranslation },
  sat: { ...englishTranslation },
  sd: { ...englishTranslation },
  ta: { ...englishTranslation },
  te: { ...englishTranslation },
  ur: { ...englishTranslation },
  ks: { ...englishTranslation },
  gom: { ...englishTranslation },
  mai: { ...englishTranslation }
};

export default kundliContent; 