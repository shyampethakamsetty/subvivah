interface Translation {
  title: string;
  sections: {
    personalInfo: string;
    ascendant: string;
    sunPosition: string;
    houses: string;
    nakshatraPredictions: string;
    additionalInfo: string;
  };
  labels: {
    name: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    gender: string;
    coordinates: string;
    sign: string;
    degree: string;
    longitude: string;
    health: string;
    temperament: string;
    physical: string;
    tropical: string;
    sidereal: string;
    nakshatra: string;
    pada: string;
    ruler: string;
    generalPrediction: string;
    educationIncome: string;
    familyLife: string;
    ayanamsa: string;
  };
  generated: string;
  disclaimer: string;
}

const translations: Record<string, Translation> = {
  en: {
    title: 'Detailed Kundli Report',
    sections: {
      personalInfo: 'Personal Information',
      ascendant: 'Ascendant (Lagna)',
      sunPosition: 'Sun Position',
      houses: 'Houses',
      nakshatraPredictions: 'Nakshatra Predictions',
      additionalInfo: 'Additional Information'
    },
    labels: {
      name: 'Name',
      dateOfBirth: 'Date of Birth',
      timeOfBirth: 'Time of Birth',
      placeOfBirth: 'Place of Birth',
      gender: 'Gender',
      coordinates: 'Coordinates',
      sign: 'Sign',
      degree: 'Degree',
      longitude: 'Longitude',
      health: 'Health',
      temperament: 'Temperament',
      physical: 'Physical Characteristics',
      tropical: 'Tropical (Western)',
      sidereal: 'Sidereal (Vedic)',
      nakshatra: 'Nakshatra',
      pada: 'Pada',
      ruler: 'Ruler',
      generalPrediction: 'General Prediction',
      educationIncome: 'Education & Income',
      familyLife: 'Family Life',
      ayanamsa: 'Ayanamsa'
    },
    generated: 'Generated on',
    disclaimer: 'This is a basic kundli calculation. For detailed analysis, please consult with a professional astrologer.'
  },
  as: {
    title: 'বিস্তৃত কুণ্ডলী প্ৰতিবেদন',
    sections: {
      personalInfo: 'ব্যক্তিগত তথ্য',
      ascendant: 'লগ্ন',
      sunPosition: 'সূৰ্যৰ অৱস্থান',
      houses: 'ভাৱসমূহ',
      nakshatraPredictions: 'নক্ষত্ৰ ভৱিষ্যবাণী',
      additionalInfo: 'অতিৰিক্ত তথ্য'
    },
    labels: {
      name: 'নাম',
      dateOfBirth: 'জন্মৰ তাৰিখ',
      timeOfBirth: 'জন্মৰ সময়',
      placeOfBirth: 'জন্মস্থান',
      gender: 'লিংগ',
      coordinates: 'স্থানাংক',
      sign: 'ৰাশি',
      degree: 'অংশ',
      longitude: 'দ্ৰাঘিমা',
      health: 'স্বাস্থ্য',
      temperament: 'স্বভাৱ',
      physical: 'শাৰীৰিক বৈশিষ্ট্য',
      tropical: 'ট্ৰপিকেল (পাশ্চাত্য)',
      sidereal: 'সাইডেৰিয়েল (বৈদিক)',
      nakshatra: 'নক্ষত্ৰ',
      pada: 'পদ',
      ruler: 'অধিপতি',
      generalPrediction: 'সাধাৰণ ভৱিষ্যবাণী',
      educationIncome: 'শিক্ষা আৰু আয়',
      familyLife: 'পাৰিবাৰিক জীৱন',
      ayanamsa: 'অয়নাংশ'
    },
    generated: 'উৎপন্ন কৰা হ\'ল',
    disclaimer: 'এইটো এটা মৌলিক কুণ্ডলী গণনা। বিস্তৃত বিশ্লেষণৰ বাবে, অনুগ্ৰহ কৰি পেছাদাৰী জ্যোতিষীৰ পৰামৰ্শ লওক।'
  },
  bn: {
    title: 'বিস্তারিত কুন্ডলী রিপোর্ট',
    sections: {
      personalInfo: 'ব্যক্তিগত তথ্য',
      ascendant: 'লগ্ন',
      sunPosition: 'সূর্যের অবস্থান',
      houses: 'ভাব',
      nakshatraPredictions: 'নক্ষত্র ভবিষ্যদ্বাণী',
      additionalInfo: 'অতিরিক্ত তথ্য'
    },
    labels: {
      name: 'নাম',
      dateOfBirth: 'জন্ম তারিখ',
      timeOfBirth: 'জন্ম সময়',
      placeOfBirth: 'জন্মস্থান',
      gender: 'লিঙ্গ',
      coordinates: 'স্থানাঙ্ক',
      sign: 'রাশি',
      degree: 'অংশ',
      longitude: 'দ্রাঘিমা',
      health: 'স্বাস্থ্য',
      temperament: 'স্বভাব',
      physical: 'শারীরিক বৈশিষ্ট্য',
      tropical: 'ট্রপিক্যাল (পাশ্চাত্য)',
      sidereal: 'সাইডেরিয়াল (বৈদিক)',
      nakshatra: 'নক্ষত্র',
      pada: 'পদ',
      ruler: 'অধিপতি',
      generalPrediction: 'সাধারণ ভবিষ্যদ্বাণী',
      educationIncome: 'শিক্ষা ও আয়',
      familyLife: 'পারিবারিক জીবন',
      ayanamsa: 'অয়নাংশ'
    },
    generated: 'তৈরি করা হয়েছে',
    disclaimer: 'এটি একটি মৌলিক কুন্ডলী গণনা। বিস্তারিত বিশ্লেষণের জন্য, অনুগ্রহ করে একজন পেশাদার জ্যোতিষীর পরামর্শ নিন।'
  },
  hi: {
    title: 'कुंडली विवरण',
    sections: {
      personalInfo: 'व्यक्तिगत जानकारी',
      ascendant: 'लग्न',
      sunPosition: 'सूर्य स्थिति',
      houses: 'भाव',
      nakshatraPredictions: 'नक्षत्र फल',
      additionalInfo: 'अतिरिक्त जानकारी'
    },
    labels: {
      name: 'नाम',
      dateOfBirth: 'जन्म तिथि',
      timeOfBirth: 'जन्म समय',
      placeOfBirth: 'जन्म स्थान',
      gender: 'लिंग',
      coordinates: 'भौगोलिक निर्देशांक',
      sign: 'राशि',
      degree: 'अंश',
      longitude: 'रेखांश',
      tropical: 'सायन (पाश्चात्य)',
      sidereal: 'निरयन (वैदिक)',
      nakshatra: 'नक्षत्र',
      pada: 'पाद',
      ruler: 'स्वामी',
      health: 'स्वास्थ्य',
      temperament: 'स्वभाव',
      physical: 'शारीरिक लक्षण',
      generalPrediction: 'सामान्य फल',
      educationIncome: 'शिक्षा और आय',
      familyLife: 'पारिवारिक जीवन',
      ayanamsa: 'अयनांश'
    },
    disclaimer: 'यह एक बुनियादी कुंडली विश्लेषण है। विस्तृत विश्लेषण के लिए, कृपया पेशेवर ज्योतिषी से परामर्श करें।',
    generated: 'तैयार किया गया'
  },
  brx: {
    title: 'गहनथार कुण्डली रिपोर्ट',
    sections: {
      personalInfo: 'गावनि सोंथि',
      ascendant: 'लग्न',
      sunPosition: 'सानजा बिथा',
      houses: 'नोगोर',
      nakshatraPredictions: 'हांसो बिथांखि',
      additionalInfo: 'बांसिन सोंथि'
    },
    labels: {
      name: 'मुं',
      dateOfBirth: 'जोनोम अक्त',
      timeOfBirth: 'जोनोम समाव',
      placeOfBirth: 'जोनोम जायगा',
      gender: 'हिंथाइ',
      coordinates: 'थावनि',
      sign: 'राशि',
      degree: 'डिग्री',
      longitude: 'लंगिट्युड',
      health: 'मोजां थाहै',
      temperament: 'सोभाव',
      physical: 'देहायारि बिथांखि',
      tropical: 'ट्रपिकेल (पश्चिमी)',
      sidereal: 'साइडेरियल (बेदिक)',
      nakshatra: 'हांसो',
      pada: 'पद',
      ruler: 'बिगोमा',
      generalPrediction: 'गासै बिथांखि',
      educationIncome: 'सोलोंथाइ आरो रां',
      familyLife: 'नखर जिउ',
      ayanamsa: 'अयनांश'
    },
    generated: 'सोरजिनाय जाबाय',
    disclaimer: 'बे मोनसे साधारण कुण्डली हिसाब। गोजौसिन बिसलाइनि थाखाय, अनजिमा जोतिसिनि सलहा ला।'
  },
  doi: {
    title: 'विस्तृत कुंडली रिपोर्ट',
    sections: {
      personalInfo: 'निजी जानकारी',
      ascendant: 'लग्न',
      sunPosition: 'सूर्य दी स्थिति',
      houses: 'घर',
      nakshatraPredictions: 'नक्षत्र भविष्यवाणी',
      additionalInfo: 'होर जानकारी'
    },
    labels: {
      name: 'नां',
      dateOfBirth: 'जनम दी तिथि',
      timeOfBirth: 'जनम दा बेला',
      placeOfBirth: 'जनम दी थाह्',
      gender: 'लिंग',
      coordinates: 'कोआर्डिनेट्स',
      sign: 'राशि',
      degree: 'डिग्री',
      longitude: 'लांगीट्यूड',
      health: 'सेहत',
      temperament: 'स्वभाव',
      physical: 'शारीरिक विशेषतां',
      tropical: 'ट्रॉपिकल (पश्चिमी)',
      sidereal: 'साइडरल (वैदिक)',
      nakshatra: 'नक्षत्र',
      pada: 'पद',
      ruler: 'स्वामी',
      generalPrediction: 'सामान्य भविष्यवाणी',
      educationIncome: 'शिक्षा ते आमदनी',
      familyLife: 'परवारक जीवन',
      ayanamsa: 'अयनांश'
    },
    generated: 'तैयार कीता गेआ',
    disclaimer: 'एह् इक बुनियादी कुंडली गणना ऐ। विस्तृत विश्लेषण लेई, किरपा करी किसे पेशेवर ज्योतिषी नाल सलाह करो।'
  },
  gu: {
    title: 'વિસ્તૃત કુંડળી રિપોર્ટ',
    sections: {
      personalInfo: 'વ્યક્તિગત માહિતી',
      ascendant: 'લગ્ન',
      sunPosition: 'સૂર્યની સ્થિતિ',
      houses: 'ભાવો',
      nakshatraPredictions: 'નક્ષત્ર ભવિષ્યવાણી',
      additionalInfo: 'વધારાની માહિતી'
    },
    labels: {
      name: 'નામ',
      dateOfBirth: 'જન્મ તારીખ',
      timeOfBirth: 'જન્મ સમય',
      placeOfBirth: 'જન્મ સ્થળ',
      gender: 'લિંગ',
      coordinates: 'કોઓર્ડિનેટ્સ',
      sign: 'રાશિ',
      degree: 'અંશ',
      longitude: 'રેખાંશ',
      health: 'સ્વાસ્થ્ય',
      temperament: 'સ્વભાવ',
      physical: 'શારીરિક લક્ષણો',
      tropical: 'ટ્રોપિકલ (પાશ્ચાત્ય)',
      sidereal: 'સાયન (વૈદિક)',
      nakshatra: 'નક્ષત્ર',
      pada: 'પદ',
      ruler: 'સ્વામી',
      generalPrediction: 'સામાન્ય ભવિષ્યવાણી',
      educationIncome: 'શિક્ષણ અને આવક',
      familyLife: 'પારિવારિક જીવન',
      ayanamsa: 'અયનાંશ'
    },
    generated: 'તૈયાર કરવામાં આવ્યું',
    disclaimer: 'આ એક મૂળભૂત કુંડળી ગણતરી છે. વિસ્તૃત વિશ્લેષણ માટે, કૃપા કરીને વ્યાવસાયિક જ્યોતિષીનો સંપર્ક કરો.'
  },
  kn: {
    title: 'ವಿವರವಾದ ಕುಂಡಲಿ ವರದಿ',
    sections: {
      personalInfo: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ',
      ascendant: 'ಲಗ್ನ',
      sunPosition: 'ಸೂರ್ಯನ ಸ್ಥಾನ',
      houses: 'ಭಾವಗಳು',
      nakshatraPredictions: 'ನಕ್ಷತ್ರ ಭವಿಷ್ಯ',
      additionalInfo: 'ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ'
    },
    labels: {
      name: 'ಹೆಸರು',
      dateOfBirth: 'ಜನ್ಮ ದಿನಾಂಕ',
      timeOfBirth: 'ಜನ್ಮ ಸಮಯ',
      placeOfBirth: 'ಜನ್ಮ ಸ್ಥಳ',
      gender: 'ಲಿಂಗ',
      coordinates: 'ನಿರ್ದೇಶಾಂಕಗಳು',
      sign: 'ರಾಶಿ',
      degree: 'ಅಂಶ',
      longitude: 'ರೇಖಾಂಶ',
      health: 'ಆರೋಗ್ಯ',
      temperament: 'ಸ್ವಭಾವ',
      physical: 'ದೈಹಿಕ ಲಕ್ಷಣಗಳು',
      tropical: 'ಟ್ರಾಪಿಕಲ್ (ಪಾಶ್ಚಾತ್ಯ)',
      sidereal: 'ಸೈಡೇರಿಯಲ್ (ವೈದಿಕ)',
      nakshatra: 'ನಕ್ಷತ್ರ',
      pada: 'ಪಾದ',
      ruler: 'ಅಧಿಪತಿ',
      generalPrediction: 'ಸಾಮಾನ್ಯ ಭವಿಷ್ಯ',
      educationIncome: 'ಶಿಕ್ಷಣ ಮತ್ತು ಆದಾಯ',
      familyLife: 'ಕುಟುಂಬ ಜೀವನ',
      ayanamsa: 'ಅಯನಾಂಶ'
    },
    generated: 'ರಚಿಸಲಾಗಿದೆ',
    disclaimer: 'ಇದು ಮೂಲ ಕುಂಡಲಿ ಲೆಕ್ಕಾಚಾರ. ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆಗಾಗಿ, ದಯವಿಟ್ಟು ವೃತ್ತಿಪರ ಜ್ಯೋತಿಷೀಯೊ ಸಂಪರ್ಕಿಸಿ.'
  },
  ks: {
    title: 'تفصیلی کنڈلی رپورٹ',
    sections: {
      personalInfo: 'ذاتی معلومات',
      ascendant: 'لگن',
      sunPosition: 'سورج کی پوزیشن',
      houses: 'گھر',
      nakshatraPredictions: 'نکشتر پیش گوئی',
      additionalInfo: 'اضافی معلومات'
    },
    labels: {
      name: 'ناو',
      dateOfBirth: 'تاریخ پیدائش',
      timeOfBirth: 'وقت پیدائش',
      placeOfBirth: 'مقام پیدائش',
      gender: 'جنس',
      coordinates: 'کوآرڈینیٹس',
      sign: 'راشی',
      degree: 'ڈگری',
      longitude: 'طول البلد',
      health: 'صحت',
      temperament: 'مزاج',
      physical: 'جسمانی خصوصیات',
      tropical: 'ٹراپیکل (مغربی)',
      sidereal: 'سائیڈیریل (ویدک)',
      nakshatra: 'نکشتر',
      pada: 'پد',
      ruler: 'حکمران',
      generalPrediction: 'عام پیش گوئی',
      educationIncome: 'تعلیم اور آمدنی',
      familyLife: 'خاندانی زندگی',
      ayanamsa: 'اینامشا'
    },
    generated: 'تیار کردہ',
    disclaimer: 'یہ ایک بنیادی کنڈلی حساب ہے۔ تفصیلی تجزیہ کے لئے، براہ کرم کسی پیشہ ور جیوتشی سے مشورہ کریں۔'
  },
  gom: {
    title: 'सविस्तर कुंडली अहवाल',
    sections: {
      personalInfo: 'वैयक्तिक माहिती',
      ascendant: 'लग्न',
      sunPosition: 'सूर्याची स्थिती',
      houses: 'घरां',
      nakshatraPredictions: 'नक्षत्र भविष्य',
      additionalInfo: 'अतिरिक्त माहिती'
    },
    labels: {
      name: 'नांव',
      dateOfBirth: 'जल्म तारीख',
      timeOfBirth: 'जल्म वेळ',
      placeOfBirth: 'जल्म थळ',
      gender: 'लिंग',
      coordinates: 'कोऑर्डिनेट्स',
      sign: 'राशी',
      degree: 'अंश',
      longitude: 'रेखांश',
      health: 'भलायकी',
      temperament: 'स्वभाव',
      physical: 'शारीरिक वैशिश्ट्यां',
      tropical: 'ट्रॉपिकल (पाश्चात्य)',
      sidereal: 'सायन (वैदिक)',
      nakshatra: 'नक्षत्र',
      pada: 'पाद',
      ruler: 'स्वामी',
      generalPrediction: 'सामान्य भविष्य',
      educationIncome: 'शिक्षण आनी उत्पन्न',
      familyLife: 'कौटुंबिक जीवन',
      ayanamsa: 'अयनांश'
    },
    generated: 'तयार केल्लें',
    disclaimer: 'ही एक मूल कुंडली गणना आसा. सविस्तर विश्लेशणाखातीर, उपकार करून व्यावसायिक ज्योतिष्याचो सल्लो घेवचो.'
  },
  mai: {
    title: 'विस्तृत कुण्डली रिपोर्ट',
    sections: {
      personalInfo: 'व्यक्तिगत जानकारी',
      ascendant: 'लग्न',
      sunPosition: 'सूर्यक स्थिति',
      houses: 'भाव',
      nakshatraPredictions: 'नक्षत्र भविष्यवाणी',
      additionalInfo: 'अतिरिक्त जानकारी'
    },
    labels: {
      name: 'नाम',
      dateOfBirth: 'जन्म तिथि',
      timeOfBirth: 'जन्म समय',
      placeOfBirth: 'जन्म स्थान',
      gender: 'लिंग',
      coordinates: 'निर्देशांक',
      sign: 'राशि',
      degree: 'अंश',
      longitude: 'देशांतर',
      health: 'स्वास्थ्य',
      temperament: 'स्वभाव',
      physical: 'शारीरिक विशेषता',
      tropical: 'ट्रॉपिकल (पाश्चात्य)',
      sidereal: 'सायन (वैदिक)',
      nakshatra: 'नक्षत्र',
      pada: 'पद',
      ruler: 'स्वामी',
      generalPrediction: 'सामान्य भविष्यवाणी',
      educationIncome: 'शिक्षा आ आय',
      familyLife: 'पारिवारिक जीवन',
      ayanamsa: 'अयनांश'
    },
    generated: 'तैयार कएल गेल',
    disclaimer: 'ई एकटा मौलिक कुण्डली गणना अछि। विस्तृत विश्लेषणक लेल, कृपया कोनो पेशेवर ज्योतिषीसँ सलाह लेल जाए।'
  },
  ml: {
    title: 'വിശദമായ ജാതകം റിപ്പോർട്ട്',
    sections: {
      personalInfo: 'വ്യക്തിഗത വിവരങ്ങൾ',
      ascendant: 'ലഗ്നം',
      sunPosition: 'സൂര്യന്റെ സ്ഥാനം',
      houses: 'ഭാവങ്ങൾ',
      nakshatraPredictions: 'നക്ഷത്ര പ്രവചനങ്ങൾ',
      additionalInfo: 'അധിക വിവരങ്ങൾ'
    },
    labels: {
      name: 'പേര്',
      dateOfBirth: 'ജനന തീയതി',
      timeOfBirth: 'ജനന സമയം',
      placeOfBirth: 'ജനന സ്ഥലം',
      gender: 'ലിംഗം',
      coordinates: 'കോഓർഡിനേറ്റ്സ്',
      sign: 'രാശി',
      degree: 'അംശം',
      longitude: 'രേഖാംശം',
      health: 'ആരോഗ്യം',
      temperament: 'സ്വഭാവം',
      physical: 'ശാരീരിക സവിശേഷതകൾ',
      tropical: 'ട്രോപ്പിക്കൽ (പാശ്ചാത്യം)',
      sidereal: 'സൈഡറിയൽ (വൈദികം)',
      nakshatra: 'നക്ഷത്രം',
      pada: 'പാദം',
      ruler: 'അധിപൻ',
      generalPrediction: 'പൊതു പ്രവചനം',
      educationIncome: 'വിദ്യാഭ്യാസവും വരുമാനവും',
      familyLife: 'കുടുംബ ജീവിതം',
      ayanamsa: 'അയനാംശം'
    },
    generated: 'സൃഷ്ടിച്ചത്',
    disclaimer: 'ഇത് ഒരു അടിസ്ഥാന ജാതക കണക്കുകൂട്ടലാണ്. വിശദമായ വിശകലനത്തിന്, ദയവായി ഒരു പ്രൊഫഷണൽ ജ്യോതിഷിയെ സമീപിക്കുക.'
  },
  mni: {
    title: 'ꯃꯤꯇꯦꯜꯂꯤꯡ ꯀꯨꯟꯗꯜꯂꯤ ꯔꯤꯄꯣꯔꯠ',
    sections: {
      personalInfo: 'ꯃꯈꯥ ꯇꯥꯡꯕ ꯋꯥꯔꯣꯜ',
      ascendant: 'ꯂꯒ꯭ꯅ',
      sunPosition: 'ꯅꯨꯃꯤꯠꯀꯤ ꯐꯤꯚꯝ',
      houses: 'ꯌꯨꯝꯊꯪꯁꯤꯡ',
      nakshatraPredictions: 'ꯊꯋꯥꯏꯒꯤ ꯋꯥꯈꯜꯂꯣꯟ',
      additionalInfo: 'ꯑꯍꯦꯟꯕ ꯋꯥꯔꯣꯜ'
    },
    labels: {
      name: 'ꯃꯤꯡ',
      dateOfBirth: 'ꯄꯣꯀꯄꯒꯤ ꯅꯨꯃꯤꯠ',
      timeOfBirth: 'ꯄꯣꯀꯄꯒꯤ ꯃꯇꯝ',
      placeOfBirth: 'ꯄꯣꯀꯄꯒꯤ ꯃꯐꯝ',
      gender: 'ꯅꯨꯄꯥ/ꯅꯨꯄꯤ',
      coordinates: 'ꯀꯣꯑꯣꯔꯗꯤꯅꯦꯠꯁ',
      sign: 'ꯔꯥꯁꯤ',
      degree: 'ꯗꯤꯒ꯭ꯔꯤ',
      longitude: 'ꯂꯣꯡꯒꯤꯇ꯭ꯌꯨꯗ',
      health: 'ꯍꯀꯆꯥꯡꯒꯤ ꯐꯤꯚꯝ',
      temperament: 'ꯋꯥꯈꯜꯂꯣꯟ',
      physical: 'ꯍꯀꯆꯥꯡꯒꯤ ꯃꯇꯣꯡ',
      tropical: 'ꯇ꯭ꯔꯣꯄꯤꯀꯦꯜ (ꯅꯣꯡꯆꯨꯞ)',
      sidereal: 'ꯁꯥꯏꯗꯦꯔꯤꯌꯦꯜ (ꯚꯦꯗꯤꯀ)',
      nakshatra: 'ꯊꯋꯥꯏ',
      pada: 'ꯄꯥꯗ',
      ruler: 'ꯂꯤꯡꯕ',
      generalPrediction: 'ꯑꯄꯨꯟꯕ ꯋꯥꯈꯜꯂꯣꯟ',
      educationIncome: 'ꯂꯥꯏꯔꯤꯛ ꯑꯃꯁꯨꯡ ꯁꯦꯜ',
      familyLife: 'ꯏꯃꯨꯡ ꯃꯅꯨꯡꯒꯤ ꯄꯨꯟꯁꯤ',
      ayanamsa: 'ꯑꯌꯅꯥꯝꯁ'
    },
    generated: 'ꯁꯦꯝꯒꯠꯄ',
    disclaimer: 'ꯃꯁꯤ ꯑꯍꯥꯟꯕ ꯀꯨꯟꯗꯜꯂꯤ ꯄꯥꯡꯊꯣꯀꯄꯅꯤ꯫ ꯃꯔꯤ ꯂꯩꯅꯕ ꯋꯥꯔꯣꯜꯒꯤ ꯊꯥꯀꯇ, ꯑꯃꯨꯀ ꯍꯟꯅ ꯖ꯭ꯌꯣꯇꯤꯁꯤ ꯑꯃꯒ ꯇꯥꯟꯅꯕꯤꯌꯨ꯫'
  },
  mr: {
    title: 'सविस्तर कुंडली अहवाल',
    sections: {
      personalInfo: 'वैयक्तिक माहिती',
      ascendant: 'लग्न',
      sunPosition: 'सूर्याची स्थिती',
      houses: 'भाव',
      nakshatraPredictions: 'नक्षत्र भविष्य',
      additionalInfo: 'अतिरिक्त माहिती'
    },
    labels: {
      name: 'नाव',
      dateOfBirth: 'जन्म तारीख',
      timeOfBirth: 'जन्म वेळ',
      placeOfBirth: 'जन्म स्थळ',
      gender: 'लिंग',
      coordinates: 'कोऑर्डिनेट्स',
      sign: 'राशी',
      degree: 'अंश',
      longitude: 'रेखांश',
      health: 'आरोग्य',
      temperament: 'स्वभाव',
      physical: 'शारीरिक वैशिष्ट्ये',
      tropical: 'ट्रॉपिकल (पाश्चात्य)',
      sidereal: 'सायन (वैदिक)',
      nakshatra: 'नक्षत्र',
      pada: 'पाद',
      ruler: 'स्वामी',
      generalPrediction: 'सामान्य भविष्य',
      educationIncome: 'शिक्षण आणि उत्पन्न',
      familyLife: 'कौटुंबिक जीवन',
      ayanamsa: 'अयनांश'
    },
    generated: 'तयार केले',
    disclaimer: 'ही एक मूलभूत कुंडली गणना आहे. सविस्तर विश्लेषणासाठी, कृपया व्यावसायिक ज्योतिषाचा सल्ला घ्या.'
  },
  ne: {
    title: 'विस्तृत कुण्डली रिपोर्ट',
    sections: {
      personalInfo: 'व्यक्तिगत जानकारी',
      ascendant: 'लग्न',
      sunPosition: 'सूर्यको स्थिति',
      houses: 'भाव',
      nakshatraPredictions: 'नक्षत्र भविष्यवाणी',
      additionalInfo: 'अतिरिक्त जानकारी'
    },
    labels: {
      name: 'नाम',
      dateOfBirth: 'जन्म मिति',
      timeOfBirth: 'जन्म समय',
      placeOfBirth: 'जन्म स्थान',
      gender: 'लिङ्ग',
      coordinates: 'निर्देशांक',
      sign: 'राशि',
      degree: 'अंश',
      longitude: 'देशान्तर',
      health: 'स्वास्थ्य',
      temperament: 'स्वभाव',
      physical: 'शारीरिक विशेषताहरू',
      tropical: 'ट्रपिकल (पश्चिमी)',
      sidereal: 'सायन (वैदिक)',
      nakshatra: 'नक्षत्र',
      pada: 'पाद',
      ruler: 'स्वामी',
      generalPrediction: 'सामान्य भविष्यवाणी',
      educationIncome: 'शिक्षा र आय',
      familyLife: 'पारिवारिक जीवन',
      ayanamsa: 'अयनांश'
    },
    generated: 'तयार गरिएको',
    disclaimer: 'यो एक आधारभूत कुण्डली गणना हो। विस्तृत विश्लेषणको लागि, कृपया पेशेवर ज्योतिषीसँग परामर्श गर्नुहोस्।'
  },
  or: {
    title: 'ବିସ୍ତୃତ କୁଣ୍ଡଳୀ ରିପୋର୍ଟ',
    sections: {
      personalInfo: 'ବ୍ୟକ୍ତିଗତ ସୂଚନା',
      ascendant: 'ଲଗ୍ନ',
      sunPosition: 'ସୂର୍ଯ୍ୟଙ୍କ ସ୍ଥିତି',
      houses: 'ଭାବ',
      nakshatraPredictions: 'ନକ୍ଷତ୍ର ଭବିଷ୍ୟବାଣୀ',
      additionalInfo: 'ଅତିରିକ୍ତ ସୂଚନା'
    },
    labels: {
      name: 'ନାମ',
      dateOfBirth: 'ଜନ୍ମ ତାରିଖ',
      timeOfBirth: 'ଜନ୍ମ ସମୟ',
      placeOfBirth: 'ଜନ୍ମ ସ୍ଥାନ',
      gender: 'ଲିଙ୍ଗ',
      coordinates: 'ନିର୍ଦ୍ଦେଶାଙ୍କ',
      sign: 'ରାଶି',
      degree: 'ଅଂଶ',
      longitude: 'ଦ୍ରାଘିମା',
      health: 'ସ୍ୱାସ୍ଥ୍ୟ',
      temperament: 'ସ୍ୱଭାବ',
      physical: 'ଶାରୀରିକ ବୈଶିଷ୍ଟ୍ୟ',
      tropical: 'ଟ୍ରପିକାଲ (ପାଶ୍ଚାତ୍ୟ)',
      sidereal: 'ସାୟନ (ବୈଦିକ)',
      nakshatra: 'ନକ୍ଷତ୍ର',
      pada: 'ପାଦ',
      ruler: 'ସ୍ୱାମୀ',
      generalPrediction: 'ସାଧାରଣ ଭବିଷ୍ୟବାଣୀ',
      educationIncome: 'ଶିକ୍ଷା ଏବଂ ଆୟ',
      familyLife: 'ପାରିବାରିକ ଜୀବନ',
      ayanamsa: 'ଅୟନାଂଶ'
    },
    generated: 'ପ୍ରସ୍ତୁତ ହୋଇଛି',
    disclaimer: 'ଏହା ଏକ ମୌଳିକ କୁଣ୍ଡଳୀ ଗଣନା। ବିସ୍ତୃତ ବିଶ୍ଳେଷଣ ପାଇଁ, ଦୟାକରି ଜଣେ ବୃତ୍ତିପରମୈନ ଜ୍ୟୋତିଷୀଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।'
  },
  te: {
    title: 'వివరణాత్మక కుండలి నివేదిక',
    sections: {
      personalInfo: 'వ్యక్తిగత సమాచారం',
      ascendant: 'లగ్నం',
      sunPosition: 'సూర్య స్థానం',
      houses: 'భావాలు',
      nakshatraPredictions: 'నక్షత్ర ఫలితాలు',
      additionalInfo: 'అదనపు సమాచారం'
    },
    labels: {
      name: 'పేరు',
      dateOfBirth: 'పుట్టిన తేదీ',
      timeOfBirth: 'పుట్టిన సమయం',
      placeOfBirth: 'పుట్టిన స్థలం',
      gender: 'లింగం',
      coordinates: 'అక్షాంశ రేఖాంశాలు',
      sign: 'రాశి',
      degree: 'అంశం',
      longitude: 'రేఖాంశం',
      health: 'ఆరోగ్యం',
      temperament: 'స్వభావం',
      physical: 'శారీరక లక్షణాలు',
      tropical: 'ట్రాపికల్ (పాశ్చాత్య)',
      sidereal: 'సైడేరియల్ (వైదిక)',
      nakshatra: 'నక్షత్రం',
      pada: 'పాదం',
      ruler: 'అధిపతి',
      generalPrediction: 'సాధారణ ఫలితం',
      educationIncome: 'విద్య మరియు ఆదాయం',
      familyLife: 'కుటుంబ జీవితం',
      ayanamsa: 'అయనాంశం'
    },
    generated: 'రూపొందించబడింది',
    disclaimer: 'ఇది ప్రాథమిక కుండలి లెక్కింపు. వివరణాత్మక విశ్లేషణ కోసం, దయచేసి వృత్తిపరమైన జ్యోతిష్యుడిని సంప్రదించండి.'
  },
  ur: {
    title: 'تفصیلی کنڈلی رپورٹ',
    sections: {
      personalInfo: 'ذاتی معلومات',
      ascendant: 'طالع',
      sunPosition: 'سورج کی پوزیشن',
      houses: 'گھر',
      nakshatraPredictions: 'نکشتر کی پیشن گوئیاں',
      additionalInfo: 'اضافی معلومات'
    },
    labels: {
      name: 'نام',
      dateOfBirth: 'تاریخ پیدائش',
      timeOfBirth: 'وقت پیدائش',
      placeOfBirth: 'مقام پیدائش',
      gender: 'جنس',
      coordinates: 'جغرافیائی محل وقوع',
      sign: 'راشی',
      degree: 'درجہ',
      longitude: 'طول البلد',
      health: 'صحت',
      temperament: 'مزاج',
      physical: 'جسمانی خصوصیات',
      tropical: 'ٹراپیکل (مغربی)',
      sidereal: 'سائیڈیریل (ویدک)',
      nakshatra: 'نکشتر',
      pada: 'پاد',
      ruler: 'حکمران',
      generalPrediction: 'عام پیشن گوئی',
      educationIncome: 'تعلیم اور آمدنی',
      familyLife: 'خاندانی زندگی',
      ayanamsa: 'ایانامسہ'
    },
    generated: 'تیار کردہ',
    disclaimer: 'یہ ایک بنیادی کنڈلی حساب ہے۔ تفصیلی تجزیہ کے لیے، براہ کرم کسی پیشہ ور جیوتشی سے رجوع کریں۔'
  },
  // Add more languages as needed
};

export default translations; 