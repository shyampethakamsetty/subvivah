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

type KundliContent = Record<string, KundliContentTranslation>;

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

const englishTranslation: KundliContentTranslation = {
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

const kundliContent: KundliContent = {
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
      sagittarius: 'ಧನుಸ್ಸು',
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
      dhanishta: 'ಧನಿಷ్ಠಾ',
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
      eighth: 'ಅಷ್ಟಮ ಭಾವ (ಆಯುಷ్ಷు)',
      ninth: 'ನವಮ ಭಾವ (ಭಾಗ్ಯ)',
      tenth: 'ದಶಮ ಭಾವ (ಕರ్ಮ)',
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
      uttaraphalguni: 'উত্তর ফাল্গুনী',
      hasta: 'হস্ত',
      chitra: 'চিত্ৰা',
      swati: 'স্঵াতী',
      vishakha: 'বিশাখা',
      anuradha: 'অনুরাধা',
      jyeshtha: 'জ্যৈষ্ঠা',
      mula: 'মূল',
      purvashadha: 'পূৰ্বাষাঢ়া',
      uttarashadha: 'উত্তরাষাঢ়া',
      shravana: 'শ্ৰৱণ',
      dhanishta: 'ধনিষ্ঠা',
      shatabhisha: 'শতভিষা',
      purvabhadrapada: 'পূর্ব ভাদ্ৰপদ',
      uttarabhadrapada: 'উত্তর ভাদ্ৰপদ',
      revati: 'ৰেৱতী'
    },
    houses: {
      first: 'প্ৰথম ভাৱ (লগ్ন)',
      second: 'দ্বিতীয় ভাৱ (ধন)',
      third: 'তৃতীয় ভাৱ (ভ্রাতৃ)',
      fourth: 'চতুৰ্থ ভাৱ (গৃহ)',
      fifth: 'পংচম ভাৱ (সন্তান)',
      sixth: 'ষষ্ঠ ভাৱ (শত্ৰু)',
      seventh: 'সপ্তম ভাৱ (বিবাহ)',
      eighth: 'অষ্টম ভাৱ (আয়ু)',
      ninth: 'নবম ভাৱ (ভাগ্য)',
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
      swati: 'স্঵াতী',
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
  ml: {
    signs: {
      aries: 'മേടം',
      taurus: 'ഇടവം',
      gemini: 'മിഥുനം',
      cancer: 'കർക്കടകം',
      leo: 'ചിങ്ങം',
      virgo: 'കന്നി',
      libra: 'തുലാം',
      scorpio: 'വൃശ്ചികം',
      sagittarius: 'ധനു',
      capricorn: 'മകരം',
      aquarius: 'കുംഭം',
      pisces: 'മീനം'
    },
    nakshatras: {
      ashwini: 'അശ്വതി',
      bharani: 'ഭരണി',
      krittika: 'കാർത്തിക',
      rohini: 'രോഹിണി',
      mrigashira: 'മകയിരം',
      ardra: 'തിരുവാതിര',
      punarvasu: 'പുണർതം',
      pushya: 'പൂയം',
      ashlesha: 'ആയില്യം',
      magha: 'മകം',
      purvaphalguni: 'പൂരം',
      uttaraphalguni: 'ഉത്രം',
      hasta: 'അത്തം',
      chitra: 'ചിത്ര',
      swati: 'ചോതി',
      vishakha: 'വിശാഖം',
      anuradha: 'അനിഴം',
      jyeshtha: 'തൃക്കേട്ട',
      mula: 'മൂലം',
      purvashadha: 'പൂരാടം',
      uttarashadha: 'ഉത്രാടം',
      shravana: 'തിരുവോണം',
      dhanishta: 'അവിട്ടം',
      shatabhisha: 'ചതയം',
      purvabhadrapada: 'പൂരുരുട്ടാതി',
      uttarabhadrapada: 'ഉത്രട്ടാതി',
      revati: 'രേവതി'
    },
    houses: {
      first: 'ഒന്നാം ഭാവം (ലഗ്നം)',
      second: 'രണ്ടാം ഭാവം (ധനം)',
      third: 'മൂന്നാം ഭാവം (സഹോദരങ്ങൾ)',
      fourth: 'നാലാം ഭാവം (ഗൃഹം)',
      fifth: 'അഞ്ചാം ഭാവം (സന്താനം)',
      sixth: 'ആറാം ഭാവം (ശത്രുക്കൾ)',
      seventh: 'ഏഴാം ഭാവം (വിവാഹം)',
      eighth: 'എട്ടാം ഭാവം (ആയുസ്സ്)',
      ninth: 'ഒൻപതാം ഭാവം (ഭാഗ്യം)',
      tenth: 'പത്താം ഭാവം (കർമ്മം)',
      eleventh: 'പതിനൊന്നാം ഭാവം (ലാഭം)',
      twelfth: 'പന്ത്രണ്ടാം ഭാവം (വ്യയം)'
    },
    standardPredictions: {
      ascendant: {
        health: {
          aries: 'തലയുമായി ബന്ധപ്പെട്ട പ്രശ്നങ്ങൾ ശ്രദ്ധിക്കേണ്ടതാണ്. പൊതുവേ ആരോഗ്യവാനും ഊർജസ്വലനും.',
          taurus: 'കഴുത്തും തൊണ്ടയും ശ്രദ്ധിക്കണം. ശക്തമായ ശരീരഘടന.',
          gemini: 'ശ്വാസകോശ സംബന്ധമായ കാര്യങ്ങൾ ശ്രദ്ധിക്കണം. ഓക്സിജൻ ആവശ്യകത.',
          cancer: 'ദഹനവ്യവസ്ഥ സംരക്ഷിക്കണം, മാനസിക ആരോഗ്യം ശ്രദ്ധിക്കണം.',
          leo: 'ശക്തമായ ഹൃദയം, എല്ലുകളുടെ ആരോഗ്യം ശ്രദ്ധിക്കണം.',
          virgo: 'ദഹനവ്യവസ്ഥ പ്രധാനം, സമ്മർദ്ദം നിയന്ത്രിക്കണം.',
          libra: 'സന്തുലിതമായ ആരോഗ്യം, കഴുത്തും നെഞ്ചും ശ്രദ്ധിക്കണം.',
          scorpio: 'ശക്തമായ രോഗപ്രതിരോധ ശക്തി, പ്രത്യുൽപാദന ആരോഗ്യം ശ്രദ്ധിക്കണം.',
          sagittarius: 'കായികക്ഷമത, സന്ധികളുടെയും ചലനങ്ങളുടെയും ആരോഗ്യം ശ്രദ്ധിക്കണം.',
          capricorn: 'ശക്തമായ അസ്ഥികൾ, ത്വക്കിന്റെയും സന്ധികളുടെയും ആരോഗ്യം ശ്രദ്ധിക്കണം.',
          aquarius: 'ശ്വാസകോശ ആരോഗ്യം പ്രധാനം, രക്തചംക്രമണം ശ്രദ്ധിക്കണം.',
          pisces: 'സംവേദനാത്മക ശരീരം, പ്രത്യുൽപാദന വ്യവസ്ഥയുടെ ആരോഗ്യം ശ്രദ്ധിക്കണം.'
        },
        temperament: {
          aries: 'ഊർജസ്വലത, ആവേശം, സ്വാഭാവിക നേതൃത്വ ശേഷി.',
          taurus: 'ക്ഷമാശീലം, വിശ്വസ്തത, ദൃഢനിശ്ചയം.',
          gemini: 'ബഹുമുഖ പ്രതിഭ, ജിജ്ഞാസ, ആശയവിനിമയ ശേഷി.',
          cancer: 'വികാരപരം, ശ്രദ്ധാലു, സംരക്ഷണാത്മകം.',
          leo: 'ആത്മവിശ്വാസം, ഔദാര്യം, മഹത്വാകാംക്ഷ.',
          virgo: 'വിശകലനാത്മകം, സംഘടിതം, പൂർണത ആഗ്രഹിക്കുന്നു.',
          libra: 'നീതിബോധം, സാമൂഹികം, സൗഹൃദപരം.',
          scorpio: 'വേഗത, ആക്രമണാത്മകം, രഹസ്യാത്മകം.',
          sagittarius: 'സ്വതന്ത്രം, മഹത്വാകാംക്ഷ, സാഹസികം.',
          capricorn: 'വിശകലനാത്മകം, ഉത്തരവാദിത്വം, മഹത്വാകാംക്ഷ.',
          aquarius: 'പക്വത, മാനവികം, സ്വതന്ത്ര ചിന്തകൻ.',
          pisces: 'സൃഷ്ടിപരം, ആനന്ദം, ആത്മീയം.'
        },
        physical: {
          aries: 'കായികക്ഷമതയുള്ള ശരീരം, പ്രകടമായ നെറ്റി, വേഗതയുള്ള ചലനങ്ങൾ.',
          taurus: 'ശക്തമായ ശരീരഘടന, ബലമുള്ള കഴുത്ത്, സ്ഥിരമായ നടത്തം.',
          gemini: 'നീണ്ട, പേശീബലമുള്ള ശരീരം, ശക്തമായ കൈകൾ.',
          cancer: 'ഇടത്തരം ഉയരം, വൃത്താകൃതിയിലുള്ള മുഖം, ആകർഷകമായ കണ്ണുകൾ.',
          leo: 'വേഗതയേറിയ ചയാപചയം, കട്ടിയുള്ള മുടി, ആകർഷകമായ രൂപം.',
          virgo: 'മെലിഞ്ഞ ശരീരം, ശക്തമായ കഴുത്ത്, വൃത്തിയുള്ള ത്വക്ക്.',
          libra: 'സന്തുലിതമായ ശരീരം, ആകർഷകമായ മുഖം, മനോഹരമായ പുഞ്ചിരി.',
          scorpio: 'ശക്തമായ ശരീരം, മൂർച്ചയുള്ള കണ്ണുകൾ, ആകർഷകമായ വ്യക്തിത്വം.',
          sagittarius: 'നീണ്ട ശരീരം, കായികക്ഷമതയുള്ള ശരീരഘടന, ആകർഷകമായ പുഞ്ചിരി.',
          capricorn: 'ശക്തമായ അസ്ഥികൾ, വൃത്താകൃതിയിലുള്ള മുഖം, ആത്മവിശ്വാസമുള്ള നടത്തം.',
          aquarius: 'മെലിഞ്ഞ ശരീരം, ആകർഷകമായ കണ്ണുകൾ, വ്യത്യസ്തമായ ശൈലി.',
          pisces: 'മൃദുവായ ശരീരം, ആകർഷകമായ കണ്ണുകൾ, മൃദുവായ നടത്തം.'
        }
      },
      nakshatra: {
        general: {
          ashwini: 'വേഗം പഠിക്കാനുള്ള കഴിവ്, രോഗശമന ശേഷി, സാഹസിക സ്വഭാവം.',
          bharani: 'ദൃഢനിശ്ചയം, വിഭവസമ്പന്നത, പരിവർത്തന ശേഷി.',
          krittika: 'വേഗത, മഹത്വാകാംക്ഷ, നേതൃത്വ ശേഷി.',
          rohini: 'സമാധാനം, ഭൗതിക സുഖാലు, സ്ഥിരത.',
          mrigashira: 'പ്രകാശമാനം, മൃദുല, ജിജ്ഞാസ.',
          ardra: 'ഊർജസ്വലത, ജീവൽപ്രദം, ആഴമേറിയ വികാരങ്ങൾ.',
          punarvasu: 'വൈദികം, മതപരം, സാമൂഹികം.',
          pushya: 'പരിപോഷണം, ശ്രദ്ധാലു, മതപരം.',
          ashlesha: 'നാൽക്കാലി, രഹസ്യാത്മകം, ആഴമേറിയ ധാരണ.',
          magha: 'മഹത്വാകാംക്ഷ, നേതൃത്വം, പ്രമുഖം.',
          purvaphalguni: 'സൃഷ്ടിപരം, ആനന്ദം, സാമൂഹികം.',
          uttaraphalguni: 'സാമൂഹികം, ധാർമ്മികം, വിജയം.',
          hasta: 'കഴിവുറ്റ, പ്രായോഗികം, ബഹുമുഖ.',
          chitra: 'സമാധാനം, ആകർഷണീയം, അഭിമാനം.',
          swati: 'സ്വതന്ത്രം, ജീവൽപ്രദം, വളർച്ച.',
          vishakha: 'ലക്ഷ്യബോധം, മഹത്വാകാംക്ഷ, ശക്തി.',
          anuradha: 'പക്വത, വിജയം, സൗഹൃദം.',
          jyeshtha: 'ശക്തി, നേതൃത്വം, പ്രമുഖം.',
          mula: 'ആത്മീയം, അന്വേഷണം, മൂലകാരണം.',
          purvashadha: 'ഊർജസ്വലത, പ്രചോദനം, മാനവികം.',
          uttarashadha: 'വിജയം, ധാർമ്മികം, വിജയം.',
          shravana: 'വൈദികം, അധികാരപരം, മതപരം.',
          dhanishta: 'സമ്പന്നത, സംഗീതം, ഉదാരത്വമ్.',
          shatabhisha: 'വൈദ്യ, ജ്ഞാനവാതమైన, മര്മയുക്തമైన.',
          purvabhadrapada: 'ആത്മീയം, ആഴമേറിയ, മൂർച്ചയുള്ള ബുദ്ധി.',
          uttarabhadrapada: 'ഭാഗ്യം, ആത്മീയം, വിജയം.',
          revati: 'പ്രകാശമാനം, കരുണ, ഭാഗ്യം.'
        },
        educationIncome: {
          // Telugu translations for education and income predictions for each nakshatra
          // Following the same pattern as general predictions
        },
        familyLife: {
          // Telugu translations for family life predictions for each nakshatra
          // Following the same pattern as general predictions
        }
      }
    }
  },
  ks: { ...englishTranslation },
  gom: { ...englishTranslation },
  mai: { ...englishTranslation },
  te: {
    signs: {
      aries: 'మేషం',
      taurus: 'వృషభం',
      gemini: 'మిథునం',
      cancer: 'కర్కాటకం',
      leo: 'సింహం',
      virgo: 'కన్య',
      libra: 'తుల',
      scorpio: 'వృశ్చికం',
      sagittarius: 'ధనస్సు',
      capricorn: 'మకరం',
      aquarius: 'కుంభం',
      pisces: 'మీనం'
    },
    nakshatras: {
      ashwini: 'అశ్వినీ',
      bharani: 'భరణి',
      krittika: 'కృత్తిక',
      rohini: 'రోహిణి',
      mrigashira: 'మృగశిర',
      ardra: 'ఆర్ద్ర',
      punarvasu: 'పునర్వసు',
      pushya: 'పుష్య',
      ashlesha: 'ఆశ్లేష',
      magha: 'మఘ',
      purvaphalguni: 'పూర్వ ఫల్గుణి',
      uttaraphalguni: 'ఉత్తర ఫల్గుణి',
      hasta: 'హస్త',
      chitra: 'చిత్ర',
      swati: 'స్వాతి',
      vishakha: 'విశాఖ',
      anuradha: 'అనురాధ',
      jyeshtha: 'జ్యేష్ఠ',
      mula: 'మూల',
      purvashadha: 'పూర్వాషాఢ',
      uttarashadha: 'ఉత్తరాషాఢ',
      shravana: 'శ్రవణ',
      dhanishta: 'ధనిష్ఠ',
      shatabhisha: 'శతభిష',
      purvabhadrapada: 'పూర్వ భాద్ర',
      uttarabhadrapada: 'ఉత്తరభాద్ర',
      revati: 'రేవతి'
    },
    houses: {
      first: 'ప్రథమ భావం (లగ്నం)',
      second: 'ద್వితೀయ భావం (ధనం)',
      third: 'తೃతీయ భావం (సహోదరులు)',
      fourth: 'చతుర్థ భావం (గృహం)',
      fifth: 'పంచమ భావం (సంతానం)',
      sixth: 'షష్ఠ భావం (శత్రുవులు)',
      seventh: 'సప్తమ భావం (వివాహం)',
      eighth: 'అష్టమ భావం (ఆయുష్షు)',
      ninth: 'నవమ భావం (భాగ్యం)',
      tenth: 'దశమ భావం (కర్మ)',
      eleventh: 'ఏకాదశ భావం (లాభం)',
      twelfth: 'ద్వాదశ భావం (వ్యయం)'
    },
    standardPredictions: {
      ascendant: {
        health: {
          aries: 'శిరస్సు, ముఖం మరియు మెదడుకు సంబంధించిన సమస్యలు ఉండవచ్చు.',
          taurus: 'మెడ మరియు గొంతుకు సంబంధించిన సమస్యలు ఉండవచ్చు.',
          gemini: 'ఊపిరితిత్తులు మరియు నరాల వ్యవస్థకు సంబంధించిన సమస్యలు ఉండవచ్చు.',
          cancer: 'జీర్ణవ్యవస్థ మరియు పొట్టకు సంబంధించిన సమస్యలు ఉండవచ్చు.',
          leo: 'గుండె మరియు వీపుకు సంబంధించిన సమస్యలు ఉండవచ్చు.',
          virgo: 'జీర్ణకోశం మరియు పేగులకు సంబంధించిన సమస్యలు ఉండవచ్చు.',
          libra: 'మూత్రపిండాలు మరియు నడుముకు సంబంధించిన సమస్యలు ఉండవచ్చు.',
          scorpio: 'ప్రజనన వ్యవస్థకు సంబంధించిన సమస్యలు ఉండవచ్చు.',
          sagittarius: 'తొడలు మరియు నడుముకు సంబంధించిన సమస్యలు ఉండవచ్చు.',
          capricorn: 'మోకాళ్ళు మరియు ఎముకలకు సంబంధించిన సమస్యలు ఉండవచ్చు.',
          aquarius: 'చీలమండలు మరియు నరాల వ్యవస్థకు సంబంధించిన సమస్యలు ఉండవచ్చు.',
          pisces: 'పాదాలు మరియు రోగనిరోధక శక്తికి సంబంధించిన సమస్యలు ఉండవచ్చు.'
        },
        temperament: {
          aries: 'ధైర్యవంతులు, నాయకత్వ లక్షణాలు కలిగి ఉంటారు.',
          taurus: 'స్థిరమైన, నమ్మదగిన మరియు సహనశీలి.',
          gemini: 'తెలివైన, సంభాషణాపటిమ కలిగిన మరియు అనుకూలించుకునేవారు.',
          cancer: 'భావోద్వేగపూరితులు, సానుభూతిపరులు మరియు కుటుంబానికి ప్రాధాన్యత ఇచ్చేవారు.',
          leo: 'ఆత്మవిశ്వాస, ఉదారत్వం మరియు నాయకత్వ లక్షణాలు కలిగి ఉంటారు.',
          virgo: 'విశ్లేషణాత్మక, క్రమశిక్షణ కలిగిన మరియు పరిపూర్ణతను కోరుకునేవారు.',
          libra: 'న్యాయవంతులు, సామాజిక మరియు సంతുలనాత്మక స్వభావం కలిగి ఉంటారు.',
          scorpio: 'తీవ్రమైన, గూఢమైన మరియు శక്తివంతమైన వ్యక്తిత്వం.',
          sagittarius: 'స്వతంత്ర, సాహసిక మరియు ఆశావాద స్వభావం.',
          capricorn: 'క్రమశిక్షణ, బాధ్యతాయుతమైన మరియు లక్ష్యసాధన కలిగి ఉంటారు.',
          aquarius: 'స్వతంత്ర ఆలోచనా పరులు, మానవతావాదులు.',
          pisces: 'సృజనాత്మక, భావోద్వేగపూరితులు మరియు ఆధ్యాత്మిక ఆసక్తి కలిగి ఉంటారు.'
        },
        physical: {
          aries: 'బలమైన శరీరం, ప్రమുఖమైన నుదురు, వేగవంతమైన కదలికలు.',
          taurus: 'దృఢమైన శరీరం, బలమైన మెట్, స్థిరమైన నడక.',
          gemini: 'పొడవైన, సన్నని శరీరం, చురుకైన కదలికలు.',
          cancer: 'మధ్యస్థ ఎత్తు, కుట్రని ముకం, ఆకర్షణీయమైన కళ్ళు.',
          leo: 'రాజసపు వ్యక్తిత്వం, దట్టమైన జుట్టు, ఆకర్షణీయమైన రూపం.',
          virgo: 'సన్నని శరీరం, పరిశుభ్రమైన చర్మం.',
          libra: 'సమతుల్య శరీరం, ఆకర్షణీయమైన ముకం, మతురమైన చిరునవ్వు.',
          scorpio: 'బలమైన శరీరం, తీక్షణమైన చూపు, ఆకర్షణీయమైన వ്యక്తిత്వం.',
          sagittarius: 'పొడవైన శరీరం, క్రీడాకారుని వంటి నిర్మాణం.',
          capricorn: 'బలమైన ఎముకలు, కుట్రని ముకం, ఆత്మవిశ്వాసపు నడక.',
          aquarius: 'సన్నని శరీరం, ప్రత്యేకమైన శైలి.',
          pisces: 'మృదുవైన శరీరం, ఆకర్షణీయమైన కళ్ళు, సున్నితమైన నడక.'
        }
      },
      nakshatra: {
        general: {
          ashwini: 'త్వరగా నేర్చుకునే సామర్థ్యం, వൈద్య నైపుణ్యాలు, సాహస స్వపావమ్.',
          bharani: 'దృఢమైన, సమపన్నమైన మరియు మార్పు చేసే సామర్థ్యమ్.',
          krittika: 'వేగవాతమైన, ఆకాంక്షలు కొణ్ట, నాయకత్వ లక్షణాలు.',
          rohini: 'ప్రశాంతమైన, భౌతిక సుఖాలు, స్థిరమైన స్వపావమ్.',
          mrigashira: 'ప్రకాచవాతమైన, మృదുవైన, ఆసక్తి కొణ్ట స్వపావమ్.',
          ardra: 'శక്తివాయ్న్త, జీవమైన, లోతైన భావనలు.',
          punarvasu: 'వేద, మత, సమాజిక.',
          pushya: 'పెంచే, శ్రత్త కొణ్ట, మతపరమైన.',
          ashlesha: 'నాలుకు కాళ్ళు, మర్మయుక్తమైన, లోతైన అవగాహన.',
          magha: 'ఆకాంక്షలు, నాయకత്వమ్, ముక్యమైన.',
          purvaphalguni: 'సృజనాత്మక, ఆనందం, సమాజిక.',
          uttaraphalguni: 'సమాజిక, నైతిక, విజయవాతమైన.',
          hasta: 'నైపుణ్యమ్ కొణ్ట, ఆచరణాత్మక, బహുమുఖ.',
          chitra: 'ప్రశాంతమైన, ఆకర్షణీయమైన, గర్వపడే.',
          swati: 'స్వతిన్తరమైన, జీవమైన, వృద్ధి.',
          vishakha: 'లక്ష്య కేట్టైకృతమైన, ఆకాంక്షలు, వలిమైన.',
          anuradha: 'పరిపక్వత, విజయవాతమైన, స్నేహపూర్వక.',
          jyeshtha: 'శక്తివాయ్న్త, నాయకత్వమ్, ముక్యమైన.',
          mula: 'ఆధ్యాత్మిక, పరిశోధన, మూల కారణమ్.',
          purvashadha: 'శక്తివాయ్న్త, ప్రేరేపించే, మానవికം.',
          uttarashadha: 'విజయవాతమైన, నైతిక, విజయవాతమైన.',
          shravana: 'వేద, అధికారిక, మతపరమైన.',
          dhanishta: 'సమపన్నమైన, సంగീతం, ఉదారత്వమ్.',
          shatabhisha: 'వൈద്య, జ്ఞానవాతమైన, మర్మయుక്తమైన.',
          purvabhadrapada: 'ఆధ్యాత్మిక, లోతైన, తీక్షణమైన జ్ఞానమ్.',
          uttarabhadrapada: 'అదృష్టవాతమైన, ఆధ్యాత్మిక, విజయవాతమైన.',
          revati: 'ప్రకాచవాతమైన, కరുణ, అదృష్టవాతమైన.'
        },
        educationIncome: {
          ashwini: 'వैద्यकीय किंवा क्रीडा क्षेत्रात उत्कृष्टता. स्वतंत्र उद्योगातून चांगली कमाई.',
          bharani: 'संशोधन आणि अन्वेषण क्षेत्रात यश. परिवर्तनात्मक कार्यातून उत्पन्न.',
          krittika: 'तांत्रिक आणि व्यवस्थापन क्षेत्रात यश. नेतृत्व पदांमधून उत्पन्न.',
          rohini: 'कला, संगीत किंवा व्यापारात यश. स्थिर उत्पन्न स्रोत.',
          mrigashira: 'संशोधन आणि शैक्षणिक क्षेत्रात यश. बौद्धिक कार्यातून उत्पन्न.',
          ardra: 'तांत्रिक आणि नवकल्पना क्षेत्रात यश. नवीन तंत्रज्ञानातून उत्पन्न.',
          punarvasu: 'शिक्षण आणि धार्मिक क्षेत्रात यश. ज्ञान वाटपातून उत्पन्न.',
          pushya: 'सामाजिक सेवा आणि शिक्षण क्षेत्रात यश. मानवी सेवेतून उत्पन्न.',
          ashlesha: 'गुप्त विद्या आणि संशोधन क्षेत्रात यश. विशेष ज्ञानातून उत्पन्न.',
          magha: 'राजकीय आणि सार्वजनिक क्षेत्रात यश. नेतृत्व पदांमधून उत्पन्न.',
          purvaphalguni: 'कला आणि मनोरंजन क्षेत्रात यश. सर्जनशील कार्यातून उत्पन्न.',
          uttaraphalguni: 'शिक्षण आणि सामाजिक क्षेत्रात यश. सामाजिक कार्यातून उत्पन्न.',
          hasta: 'हस्तकला आणि तांत्रिक क्षेत्रात यश. कौशल्यपूर्ण कार्यातून उत्पन्न.',
          chitra: 'कलात्मक आणि सौंदर्यपूर्ण कौटुंबिक वातावरण.',
          swati: 'व्यापार आणि वाणिज्य क्षेत्रात यश. स्वतंत्र उद्योगातून उत्पन्न.',
          vishakha: 'न्याय आणि कायदा क्षेत्रात यश. विशेषज्ञ सेवांमधून उत्पन्न.',
          anuradha: 'सल्लागार आणि मार्गदर्शन क्षेत्रात यश. सामाजिक संबंधांमधून उत्पन्न.',
          jyeshtha: 'सुरक्षा आणि संरक्षण क्षेत्रात यश. नेतृत्व पदांमधून उत्पन्न.',
          mula: 'आध्यात्मिक आणि संशोधन क्षेत्रात यश. गूढ विद्येतून उत्पन्न.',
          purvashadha: 'शिक्षण आणि प्रशिक्षण क्षेत्रात यश. ज्ञान वाटपातून उत्पन्न.',
          uttarashadha: 'प्रशासन आणि व्यवस्थापन क्षेत्रात यश. नेतृत्व पदांमधून उत्पन्न.',
          shravana: 'संगीत आणि कला क्षेत्रात यश. कलात्मक कार्यातून उत्पन्न.',
          dhanishta: 'व्यवसाय आणि वित्त क्षेत्रात यश. आर्थिक व्यवहारातून उत्पन्न.',
          shatabhisha: 'वैद्यकीय आणि संशोधन क्षेत्रात यश. वैज्ञानिक कार्यातून उत्पन्न.',
          purvabhadrapada: 'आध्यात्मिक आणि मानसशास्त्र क्षेत्रात यश. मानसिक मार्गदर्शनातून उत्पन्न.',
          uttarabhadrapada: 'धार्मिक आणि परोपकारी क्षेत्रात यश. सामाजिक सेवेतून उत्पन्न.',
          revati: 'कलात्मक आणि साहित्य क्षेत्रात यश. सर्जनशील कार्यातून उत्पन्न.'
        },
        familyLife: {
          ashwini: 'क्रियाशील कौटुंबिक जीवन, आरोग्य आणि तंदुरुस्ती क्रियांना पाठिंबा.',
          bharani: 'मजबूत कौटुंबिक बंध, सुरुवातीला आव्हाने येऊ शकतात.',
          krittika: 'ऊर्जावान कौटुंबिक वातावरण, नेतृत्व भूमिका.',
          rohini: 'सुखी कौटुंबिक जीवन, भौतिक सुख.',
          mrigashira: 'शांत आणि सुसंवादी कौटुंबिक वातावरण.',
          ardra: 'तीव्र भावनिक बंध, कधीकधी तणावपूर्ण संबंध.',
          punarvasu: 'वैदिक, धार्मिक, सामाजिक.',
          pushya: 'पोषण करणारे, काळजी घेणारे, धार्मिक.',
          ashlesha: 'चतुष्पाद, गूढ, खोल समज.',
          magha: 'महत्त्वाकांक्षी, नेता, प्रमुख.',
          purvaphalguni: 'सर्जनशील, आनंदी, सामाजिक.',
          uttaraphalguni: 'सामाजिक, नैतिक, यशस्वी.',
          hasta: 'कौशल्यपूर्ण, व्यावहारिक, बहुआयामी.',
          chitra: 'शांत, आकर्षक, अभिमानी.',
          swati: 'स्वतंत्र, जीवंत, विकास.',
          vishakha: 'ध्येयवादी, महत्त्वाकांक्षी, बलवान.',
          anuradha: 'परिपक्व, यशस्वी, मैत्रीपूर्ण.',
          jyeshtha: 'शक्तिशाली, नेतृत्व, प्रमुख.',
          mula: 'आध्यात्मिक, संशोधक, मूळ कारण.',
          purvashadha: 'शक्तिशाली, प्रेरणादायी, मानवतावादी.',
          uttarashadha: 'विजयी, नैतिक, यशस्वी.',
          shravana: 'वैदिक, अधिकारी, धार्मिक.',
          dhanishta: 'संपन्न, संगീत, उदार.',
          shatabhisha: 'वैद्यकीय, ज्ञानी, गूढ.',
          purvabhadrapada: 'आध्यात्मिक, खोल, तीक्ष्ण बुद्धी.',
          uttarabhadrapada: 'भाग्यवान, आध्यात्मिक, यशस्वी.',
          revati: 'तेजस्वी, दयाळू, भाग्यवान.'
        }
      }
    }
  },
  ur: {
    signs: {
      aries: 'حمل',
      taurus: 'ثور',
      gemini: 'جوزا',
      cancer: 'سرطان',
      leo: 'اسد',
      virgo: 'سنبلہ',
      libra: 'میزان',
      scorpio: 'عقرب',
      sagittarius: 'قوس',
      capricorn: 'جدی',
      aquarius: 'دلو',
      pisces: 'حوت'
    },
    nakshatras: {
      ashwini: 'اشونی',
      bharani: 'بھرنی',
      krittika: 'کرتکا',
      rohini: 'روہنی',
      mrigashira: 'مرگشرا',
      ardra: 'آردرا',
      punarvasu: 'پنرواسو',
      pushya: 'پشیہ',
      ashlesha: 'آشلیشا',
      magha: 'مگھا',
      purvaphalguni: 'پورو پھالگنی',
      uttaraphalguni: 'اتر پھالگنی',
      hasta: 'ہست',
      chitra: 'چترا',
      swati: 'سواتی',
      vishakha: 'وشاکھا',
      anuradha: 'انورادھا',
      jyeshtha: 'جیشٹھا',
      mula: 'مول',
      purvashadha: 'پورواشاڈھا',
      uttarashadha: 'اتراشاڈھا',
      shravana: 'شرون',
      dhanishta: 'دھنشٹھا',
      shatabhisha: 'شتبھشا',
      purvabhadrapada: 'پورو بھادرپد',
      uttarabhadrapada: 'اتر بھادرپد',
      revati: 'ریوتی'
    },
    houses: {
      first: 'پہلا گھر (طالع)',
      second: 'دوسرا گھر (دولت)',
      third: 'تیسرا گھر (بہن بھائی)',
      fourth: 'چوتھا گھر (گھر)',
      fifth: 'پانچواں گھر (اولاد)',
      sixth: 'چھٹا گھر (دشمن)',
      seventh: 'ساتواں گھر (شادی)',
      eighth: 'آٹھواں گھر (عمر)',
      ninth: 'نواں گھر (قسمت)',
      tenth: 'دسواں گھر (کام)',
      eleventh: 'گیارہواں گھر (فائدہ)',
      twelfth: 'بارہواں گھر (خرچ)'
    },
    standardPredictions: {
      ascendant: {
        health: {
          aries: 'سر، چہرہ اور دماغ سے متعلق مسائل ہو سکتے ہیں۔',
          taurus: 'گردن اور گلے سے متعلق مسائل ہو سکتے ہیں۔',
          gemini: 'پھیپھڑوں اور اعصابی نظام سے متعلق مسائل ہو سکتے ہیں۔',
          cancer: 'معدے اور ہاضمے سے متعلق مسائل ہو سکتے ہیں۔',
          leo: 'دل اور کمر سے متعلق مسائل ہو سکتے ہیں۔',
          virgo: 'آنتوں اور پاچن نظام سے متعلق مسائل ہو سکتے ہیں۔',
          libra: 'گردوں اور کمر سے متعلق مسائل ہو سکتے ہیں۔',
          scorpio: 'تولیدی نظام سے متعلق مسائل ہو سکتے ہیں۔',
          sagittarius: 'رانوں اور کمر سے متعلق مسائل ہو سکتے ہیں۔',
          capricorn: 'گھٹنوں اور ہڈیوں سے متعلق مسائل ہو سکتے ہیں۔',
          aquarius: 'پنڈلیوں اور اعصابی نظام سے متعلق مسائل ہو سکتے ہیں۔',
          pisces: 'پاؤں اور مدافعتی نظام سے متعلق مسائل ہو سکتے ہیں۔'
        },
        temperament: {
          aries: 'بہادر، قیادت کی صلاحیت رکھنے والے۔',
          taurus: 'مستحکم، قابل اعتماد اور صبر کرنے والے۔',
          gemini: 'ذہین، گفتگو میں ماہر اور موافق۔',
          cancer: 'جذباتی، ہمدرد اور خاندان کو ترجیح دینے والے۔',
          leo: 'خود اعتمادی، سخاوت اور قیادت کی صلاحیت رکھنے والے۔',
          virgo: 'تجزیاتی، منظم اور کمال پسند۔',
          libra: 'منصف مزاج، معاشرتی اور متوازن طبیعت کے مالک۔',
          scorpio: 'شدید، پراسرار اور طاقتور شخصیت۔',
          sagittarius: 'آزاد خیال، مہم جو اور خوش بین۔',
          capricorn: 'منظم، ذمہ دار اور ہدف کے حصول کے لیے پرعزم۔',
          aquarius: 'آزاد خیال، انسان دوست۔',
          pisces: 'تخلیقی، جذباتی اور روحانی رجحان رکھنے والے۔'
        },
        physical: {
          aries: 'مضبوط جسم، نمایاں پیشانی، تیز رفتار حرکات۔',
          taurus: 'مضبوط جسم، مضبوط گردن، مستحکم چال۔',
          gemini: 'لمبا، پتلا جسم، چست و چالاک حرکات۔',
          cancer: 'درمیانہ قد، گول چہرہ، پرکشش آنکھیں۔',
          leo: 'شاہانہ شخصیت، گھنے بال، پرکشش ظاہری شکل۔',
          virgo: 'پتلا جسم، صاف جلد۔',
          libra: 'متوازن جسم، پرکشش چہرہ، شیریں مسکراہٹ۔',
          scorpio: 'مضبوط جسم، تیز نظر، پرکشش شخصیت۔',
          sagittarius: 'لمبا جسم، کھلاڑی جیسی ساخت۔',
          capricorn: 'مضبوط ہڈیاں، گول چہرہ، اعتماد سے بھری چال۔',
          aquarius: 'پتلا جسم، منفرد انداز۔',
          pisces: 'نرم جسم، پرکشش آنکھیں، نرم چال۔'
        }
      },
      nakshatra: {
        general: {
          ashwini: 'جلد سیکھنے کی صلاحیت، طبی مہارت، مہم جو طبیعت۔',
          bharani: 'مضبوط، وسائل سے مالامال اور تبدیلی کی صلاحیت۔',
          krittika: 'تیز رفتار، جذباتی، قیادت کی صلاحیت۔',
          rohini: 'پرسکون، مادی خوشیاں، مستحکم طبیعت۔',
          mrigashira: 'روشن، نرم، دلچسپی رکھنے والی طبیعت۔',
          ardra: 'طاقتور، متحرک، گہری جذبات۔',
          punarvasu: 'ویدک، مذہبی، معاشرتی۔',
          pushya: 'پرورش کرنے والے، دیکھ بھال کرنے والے، مذہبی۔',
          ashlesha: 'چار پائے، پراسرار، گہری سمجھ۔',
          magha: 'جذباتی، قائد، اہم۔',
          purvaphalguni: 'تخلیقی، خوشی، معاشرتی۔',
          uttaraphalguni: 'معاشرتی، اخلاقی، کامیاب۔',
          hasta: 'مہارت رکھنے والے، عملی، کثیر الجہتی۔',
          chitra: 'پرسکون، پرکشش، فخر کرنے والے۔',
          swati: 'آزاد، متحرک، ترقی۔',
          vishakha: 'ہدف مند، جذباتی، مضبوط۔',
          anuradha: 'پختہ، کامیاب، دوستانہ۔',
          jyeshtha: 'طاقتور، قیادت، اہم۔',
          mula: 'روحانی، تحقیقی، بنیادی وجہ۔',
          purvashadha: 'طاقتور، حوصلہ افزا، انسان دوست۔',
          uttarashadha: 'کامیاب، اخلاقی، کامیاب۔',
          shravana: 'ویدک، سرکاری، مذہبی۔',
          dhanishta: 'دولت مند، موسیقی، سخی۔',
          shatabhisha: 'طبی، دانشور، پراسرار۔',
          purvabhadrapada: 'روحانی، گہری، تیز فہم۔',
          uttarabhadrapada: 'خوش قسمت، روحانی، کامیاب۔',
          revati: 'روشن، رحم دل، خوش قسمت۔'
        },
        educationIncome: {
          // Urdu translations for education and income predictions for each nakshatra
          // Following the same pattern as general predictions
        },
        familyLife: {
          // Urdu translations for family life predictions for each nakshatra
          // Following the same pattern as general predictions
        }
      }
    }
  },
  mni: { ...englishTranslation },
  mr: {
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
      mrigashira: 'मृगशीर्ष',
      ardra: 'आर्द्रा',
      punarvasu: 'पुनर्वसु',
      pushya: 'पुष्य',
      ashlesha: 'आश्लेषा',
      magha: 'मघा',
      purvaphalguni: 'पूर्व फाल्गुनी',
      uttaraphalguni: 'उत्तर फाल्गुनी',
      hasta: 'हस्त',
      chitra: 'चित्रा',
      swati: 'स्वाती',
      vishakha: 'विशाखा',
      anuradha: 'अनुराधा',
      jyeshtha: 'ज्येष्ठा',
      mula: 'मूल',
      purvashadha: 'पूर्वाषाढा',
      uttarashadha: 'उत्तराषाढा',
      shravana: 'श्रवण',
      dhanishta: 'धनिष्ठा',
      shatabhisha: 'शतभिषा',
      purvabhadrapada: 'पूर्व भाद्रपदा',
      uttarabhadrapada: 'उत्तर भाद्रपदा',
      revati: 'रेवती'
    },
    houses: {
      first: 'प्रथम भाव (लग्न)',
      second: 'द्वितीय भाव (धन)',
      third: 'तृतीय भाव (भाऊ-बहीण)',
      fourth: 'चतुर्थ भाव (गृह)',
      fifth: 'पंचम भाव (संतती)',
      sixth: 'षष्ठ भाव (शत्रू)',
      seventh: 'सप्तम भाव (विवाह)',
      eighth: 'अष्टम भाव (आयुष्य)',
      ninth: 'नवम भाव (भाग्य)',
      tenth: 'दशम भाव (कर्म)',
      eleventh: 'एकादश भाव (लाभ)',
      twelfth: 'द्वादश भाव (व्यय)'
    },
    standardPredictions: {
      ascendant: {
        health: {
          aries: 'डोके, चेहरा आणि मेंदूशी संबंधित समस्या येऊ शकतात.',
          taurus: 'मान आणि घशाशी संबंधित समस्या येऊ शकतात.',
          gemini: 'फुफ्फुसे आणि नाडी संस्थेशी संबंधित समस्या येऊ शकतात.',
          cancer: 'पोट आणि पचन संस्थेशी संबंधित समस्या येऊ शकतात.',
          leo: 'हृदय आणि पाठीशी संबंधित समस्या येऊ शकतात.',
          virgo: 'आतडी आणि पचन संस्थेशी संबंधित समस्या येऊ शकतात.',
          libra: 'मूत्रपिंड आणि कंबरेशी संबंधित समस्या येऊ शकतात.',
          scorpio: 'प्रजनन संस्थेशी संबंधित समस्या येऊ शकतात.',
          sagittarius: 'मांड्या आणि कंबरेशी संबंधित समस्या येऊ शकतात.',
          capricorn: 'गुडघे आणि हाडांशी संबंधित समस्या येऊ शकतात.',
          aquarius: 'पिंडऱ्या आणि नाडी संस्थेशी संबंधित समस्या येऊ शकतात.',
          pisces: 'पाय आणि रोगप्रतिकारक शक्तीशी संबंधित समस्या येऊ शकतात.'
        },
        temperament: {
          aries: 'धैर्यवान, नेतृत्व गुण असलेले.',
          taurus: 'स्थिर, विश्वासू आणि धीर धरणारे.',
          gemini: 'बुद्धिमान, संभाषण कौशल्य असलेले आणि अनुकूल.',
          cancer: 'भावनिक, सहानुभूतिशील आणि कुटुंबाला प्राधान्य देणारे.',
          leo: 'आत्मविश्वास, उदारता आणि नेतृत्व गुण असलेले.',
          virgo: 'विश्लेषक, व्यवस्थित आणि परिपूर्णतावादी.',
          libra: 'न्यायप्रिय, सामाजिक आणि संतुलित स्वभाव.',
          scorpio: 'तीव्र, गूढ आणि शक्तिशाली व्यक्तिमत्व.',
          sagittarius: 'स्वतंत्र, साहसी आणि आशावादी.',
          capricorn: 'शिस्तबद्ध, जबाबदार आणि ध्येयवादी.',
          aquarius: 'स्वतंत्र विचारसरणी, मानवतावादी.',
          pisces: 'सर्जनशील, भावनिक आणि आध्यात्मिक प्रवृत्ती.'
        },
        physical: {
          aries: 'मजबूत शरीर, ठळक कपाळ, जलद हालचाली.',
          taurus: 'मजबूत शरीर, मजबूत मान, स्थिर चाल.',
          gemini: 'लांब, सडपातळ शरीर, चपळ हालचाली.',
          cancer: 'मध्यम उंची, गोल चेहरा, आकर्षक डोळे.',
          leo: 'राजेशाही व्यक्तिमत्व, दाट केस, आकर्षक रूप.',
          virgo: 'सडपातळ शरीर, स्वच्छ त्वचा.',
          libra: 'संतुलित शरीर, आकर्षक चेहरा, गोड हास्य.',
          scorpio: 'मजबूत शरीर, तीक्ष्ण नजर, आकर्षक व्यक्तिमत्व.',
          sagittarius: 'लांब शरीर, खेळाडू सारखी बांधणी.',
          capricorn: 'मजबूत हाडे, गोल चेहरा, आत्मविश्वासपूर्ण चाल.',
          aquarius: 'सडपातळ शरीर, वैशिष्ट्यपूर्ण शैली.',
          pisces: 'मऊ शरीर, आकर्षक डोळे, हलकी चाल.'
        }
      },
      nakshatra: {
        general: {
          ashwini: 'लवकर शिकण्याची क्षमता, वैद्यकीय कौशल्य, साहसी स्वभाव.',
          bharani: 'दृढ, संपन्न आणि परिवर्तन क्षमता.',
          krittika: 'जलद, महत्त्वाकांक्षी, नेतृत्व क्षमता.',
          rohini: 'शांत, भौतिक सुख, स्थिर स्वभाव.',
          mrigashira: 'तेजस्वी, मृदू, जिज्ञासू स्वभाव.',
          ardra: 'शक्तिशाली, जीवंत, खोल भावना.',
          punarvasu: 'वैदिक, धार्मिक, सामाजिक.',
          pushya: 'पोषण करणारे, काळजी घेणारे, धार्मिक.',
          ashlesha: 'चतुष्पाद, गूढ, खोल समज.',
          magha: 'महत्त्वाकांक्षी, नेता, प्रमुख.',
          purvaphalguni: 'सर्जनशील, आनंदी, सामाजिक.',
          uttaraphalguni: 'सामाजिक, नैतिक, यशस्वी.',
          hasta: 'कौशल्यपूर्ण, व्यावहारिक, बहुआयामी.',
          chitra: 'शांत, आकर्षक, अभिमानी.',
          swati: 'स्वतंत्र, जीवंत, विकास.',
          vishakha: 'ध्येयवादी, महत्त्वाकांक्षी, बलवान.',
          anuradha: 'परिपक्व, यशस्वी, मैत्रीपूर्ण.',
          jyeshtha: 'शक्तिशाली, नेतृत्व, प्रमुख.',
          mula: 'आध्यात्मिक, संशोधक, मूळ कारण.',
          purvashadha: 'शक्तिशाली, प्रेरणादायी, मानवतावादी.',
          uttarashadha: 'विजयी, नैतिक, यशस्वी.',
          shravana: 'वैदिक, अधिकारी, धार्मिक.',
          dhanishta: 'संपन्न, संगീत, उदार.',
          shatabhisha: 'वैद्यकीय, ज्ञानी, गूढ.',
          purvabhadrapada: 'आध्यात्मिक, खोल, तीक्ष्ण बुद्धी.',
          uttarabhadrapada: 'भाग्यवान, आध्यात्मिक, यशस्वी.',
          revati: 'तेजस्वी, दयाळू, भाग्यवान.'
        },
        educationIncome: {
          ashwini: 'वैद्यकीय किंवा क्रीडा क्षेत्रात उत्कृष्टता. स्वतंत्र उद्योगातून चांगली कमाई.',
          bharani: 'संशोधन आणि अन्वेषण क्षेत्रात यश. परिवर्तनात्मक कार्यातून उत्पन्न.',
          krittika: 'तांत्रिक आणि व्यवस्थापन क्षेत्रात यश. नेतृत्व पदांमधून उत्पन्न.',
          rohini: 'कला, संगीत किंवा व्यापारात यश. स्थिर उत्पन्न स्रोत.',
          mrigashira: 'संशोधन आणि शैक्षणिक क्षेत्रात यश. बौद्धिक कार्यातून उत्पन्न.',
          ardra: 'तांत्रिक आणि नवकल्पना क्षेत्रात यश. नवीन तंत्रज्ञानातून उत्पन्न.',
          punarvasu: 'शिक्षण आणि धार्मिक क्षेत्रात यश. ज्ञान वाटपातून उत्पन्न.',
          pushya: 'सामाजिक सेवा आणि शिक्षण क्षेत्रात यश. मानवी सेवेतून उत्पन्न.',
          ashlesha: 'गुप्त विद्या आणि संशोधन क्षेत्रात यश. विशेष ज्ञानातून उत्पन्न.',
          magha: 'राजकीय आणि सार्वजनिक क्षेत्रात यश. नेतृत्व पदांमधून उत्पन्न.',
          purvaphalguni: 'कला आणि मनोरंजन क्षेत्रात यश. सर्जनशील कार्यातून उत्पन्न.',
          uttaraphalguni: 'शिक्षण आणि सामाजिक क्षेत्रात यश. सामाजिक कार्यातून उत्पन्न.',
          hasta: 'हस्तकला आणि तांत्रिक क्षेत्रात यश. कौशल्यपूर्ण कार्यातून उत्पन्न.',
          chitra: 'कलात्मक आणि सौंदर्यपूर्ण कौटुंबिक वातावरण.',
          swati: 'व्यापार आणि वाणिज्य क्षेत्रात यश. स्वतंत्र उद्योगातून उत्पन्न.',
          vishakha: 'न्याय आणि कायदा क्षेत्रात यश. विशेषज्ञ सेवांमधून उत्पन्न.',
          anuradha: 'सल्लागार आणि मार्गदर्शन क्षेत्रात यश. सामाजिक संबंधांमधून उत्पन्न.',
          jyeshtha: 'सुरक्षा आणि संरक्षण क्षेत्रात यश. नेतृत्व पदांमधून उत्पन्न.',
          mula: 'आध्यात्मिक आणि संशोधन क्षेत्रात यश. गूढ विद्येतून उत्पन्न.',
          purvashadha: 'शिक्षण आणि प्रशिक्षण क्षेत्रात यश. ज्ञान वाटपातून उत्पन्न.',
          uttarashadha: 'प्रशासन आणि व्यवस्थापन क्षेत्रात यश. नेतृत्व पदांमधून उत्पन्न.',
          shravana: 'संगीत आणि कला क्षेत्रात यश. कलात्मक कार्यातून उत्पन्न.',
          dhanishta: 'व्यवसाय आणि वित्त क्षेत्रात यश. आर्थिक व्यवहारातून उत्पन्न.',
          shatabhisha: 'वैद्यकीय आणि संशोधन क्षेत्रात यश. वैज्ञानिक कार्यातून उत्पन्न.',
          purvabhadrapada: 'आध्यात्मिक आणि मानसशास्त्र क्षेत्रात यश. मानसिक मार्गदर्शनातून उत्पन्न.',
          uttarabhadrapada: 'धार्मिक आणि परोपकारी क्षेत्रात यश. सामाजिक सेवेतून उत्पन्न.',
          revati: 'कलात्मक आणि साहित्य क्षेत्रात यश. सर्जनशील कार्यातून उत्पन्न.'
        },
        familyLife: {
          ashwini: 'क्रियाशील कौटुंबिक जीवन, आरोग्य आणि तंदुरुस्ती क्रियांना पाठिंबा.',
          bharani: 'मजबूत कौटुंबिक बंध, सुरुवातीला आव्हाने येऊ शकतात.',
          krittika: 'ऊर्जावान कौटुंबिक वातावरण, नेतृत्व भूमिका.',
          rohini: 'सुखी कौटुंबिक जीवन, भौतिक सुख.',
          mrigashira: 'शांत आणि सुसंवादी कौटुंबिक वातावरण.',
          ardra: 'तीव्र भावनिक बंध, कधीकधी तणावपूर्ण संबंध.',
          punarvasu: 'वैदिक, धार्मिक, सामाजिक.',
          pushya: 'पोषण करणारे, काळजी घेणारे, धार्मिक.',
          ashlesha: 'चतुष्पाद, गूढ, खोल समज.',
          magha: 'महत्त्वाकांक्षी, नेता, प्रमुख.',
          purvaphalguni: 'सर्जनशील, आनंदी, सामाजिक.',
          uttaraphalguni: 'सामाजिक, नैतिक, यशस्वी.',
          hasta: 'कौशल्यपूर्ण, व्यावहारिक, बहुआयामी.',
          chitra: 'शांत, आकर्षक, अभिमानी.',
          swati: 'स्वतंत्र, जीवंत, विकास.',
          vishakha: 'ध्येयवादी, महत्त्वाकांक्षी, बलवान.',
          anuradha: 'परिपक्व, यशस्वी, मैत्रीपूर्ण.',
          jyeshtha: 'शक्तिशाली, नेतृत्व, प्रमुख.',
          mula: 'आध्यात्मिक, संशोधक, मूळ कारण.',
          purvashadha: 'शक्तिशाली, प्रेरणादायी, मानवतावादी.',
          uttarashadha: 'विजयी, नैतिक, यशस्वी.',
          shravana: 'वैदिक, अधिकारी, धार्मिक.',
          dhanishta: 'संपन्न, संगീत, उदार.',
          shatabhisha: 'वैद्यकीय, ज्ञानी, गूढ.',
          purvabhadrapada: 'आध्यात्मिक, खोल, तीक्ष्ण बुद्धी.',
          uttarabhadrapada: 'भाग्यवान, आध्यात्मिक, यशस्वी.',
          revati: 'तेजस्वी, दयाळू, भाग्यवान.'
        }
      }
    }
  },
  mr: englishTranslation,
  ne: englishTranslation,
  or: englishTranslation,
  pa: englishTranslation,
  sa: englishTranslation,
  sat: englishTranslation,
  sd: englishTranslation,
  ta: englishTranslation
};

export default kundliContent; 