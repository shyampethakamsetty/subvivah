import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get coordinates from place name using a geocoding API
async function getCoordinates(placeName: string) {
  try {
    console.log('Attempting to get coordinates for:', placeName);
    
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: placeName,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'Kundli-Generator/1.0 (https://subvivah.com)'
      }
    });

    console.log('Geocoding response:', JSON.stringify(response.data));

    if (response.data && response.data.length > 0) {
      const result = {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon)
      };
      console.log('Found coordinates:', result);
      return result;
    } else {
      console.error('No results found for place:', placeName);
      throw new Error(`Location not found: ${placeName}`);
    }
  } catch (error: any) {
    console.error('Error getting coordinates:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
    throw new Error(`Could not find coordinates for the given place: ${placeName}. Please try a more specific location name.`);
  }
}

// Calculate Julian Day
function calculateJulianDay(date: Date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  
  let y = year;
  let m = month;
  
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  
  const jd = Math.floor(365.25 * (y + 4716)) + 
            Math.floor(30.6001 * (m + 1)) + 
            day + b - 1524.5 +
            (hour + minute / 60 + second / 3600) / 24;
            
  return jd;
}

// Calculate Lahiri Ayanamsa
function calculateLahiriAyanamsa(jd: number) {
  const jd_reference = 2435553.5;
  const ayanamsa_reference = 23.15;
  const precession_rate = 50.288;  // arcseconds per year
  const years_since_reference = (jd - jd_reference) / 365.25;
  const ayanamsa = ayanamsa_reference + (precession_rate * years_since_reference) / 3600;
  
  return ayanamsa;
}

// Calculate Sun longitude
function calculateSunLongitude(jd: number) {
  const t = (jd - 2451545.0) / 36525;
  let L0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  const M = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  const M_rad = M * Math.PI / 180;
  const e = 0.016708634 - 0.000042037 * t - 0.0000000283 * t * t;
  
  const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(M_rad) +
            (0.019993 - 0.000101 * t) * Math.sin(2 * M_rad) +
            0.000289 * Math.sin(3 * M_rad);
  
  const L_true = L0 + C;
  const omega = 125.04 - 1934.136 * t;
  const L_apparent = L_true - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);
  
  const longitude = L_apparent % 360;
  return longitude < 0 ? longitude + 360 : longitude;
}

// Helper function to determine which sign a longitude falls in
function getSignFromLongitude(longitude: number) {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const signIndex = Math.floor(longitude / 30);
  return signs[signIndex];
}

// Calculate Greenwich Sidereal Time
function calculateGreenwichSiderealTime(jd: number) {
  const T = (jd - 2451545.0) / 36525.0;
  const theta = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 
                T * T * (0.000387933 - T / 38710000.0);
  return (theta % 360) / 15; // Convert to hours
}

// Calculate houses
function calculateHouses(ascendant: number) {
  const houses = [];
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  for (let i = 0; i < 12; i++) {
    const houseSignIndex = Math.floor((ascendant + (i * 30)) / 30) % 12;
    houses.push({
      house: i + 1,
      sign: signs[houseSignIndex],
      degree: (ascendant + (i * 30)) % 30,
      name: getHouseName(i + 1)
    });
  }
  
  return houses;
}

// Get house name in Sanskrit
function getHouseName(houseNumber: number) {
  const houseNames = {
    1: 'Lagna (Ascendant)',
    2: 'Dhana (Wealth)',
    3: 'Sahaja (Siblings)',
    4: 'Sukha (Happiness)',
    5: 'Putra (Children)',
    6: 'Ari (Enemies)',
    7: 'Yuvati (Spouse)',
    8: 'Randhra (Longevity)',
    9: 'Dharma (Religion)',
    10: 'Karma (Career)',
    11: 'Labha (Gains)',
    12: 'Vyaya (Losses)'
  };
  return houseNames[houseNumber as keyof typeof houseNames] || `House ${houseNumber}`;
}

// Ascendant predictions data
const ascendantPredictions: Record<string, { health: string; temperament: string; physical: string }> = {
  'Aries': {
    health: 'Aries ascendant people generally have strong vitality and quick recovery from illnesses. They may be prone to headaches, migraines, and injuries to the head or face. They should be careful of accidents due to their impulsive nature. Regular exercise is essential for maintaining their high energy levels.',
    temperament: 'Aries ascendant individuals are natural leaders with a bold, confident, and dynamic personality. They are straightforward, enthusiastic, and have a pioneering spirit. They can be impulsive and quick-tempered but are also courageous and willing to take initiative. They have a competitive nature and strong drive to succeed.',
    physical: 'Aries ascendant people typically have a strong, athletic build with a prominent forehead and sharp features. They often have a confident walk and commanding presence. Their complexion tends to be ruddy or reddish, and they may have a distinctive mark on their head or face. They usually appear younger than their age.'
  },
  'Taurus': {
    health: 'Taurus ascendant people have good stamina and endurance. They may be prone to throat problems, thyroid issues, and neck stiffness. They should watch their diet as they have a tendency to overindulge. Regular exercise is important to maintain their physical well-being and prevent weight gain.',
    temperament: 'Taurus ascendant individuals are stable, reliable, and patient. They have a strong sense of values and are practical in their approach to life. They can be stubborn but are also determined and persistent. They appreciate beauty and comfort, and have a strong connection to the material world.',
    physical: 'Taurus ascendant people often have a strong, well-built body with a rounded face and thick neck. They have attractive features with full lips and often possess a melodious voice. They tend to have a steady, graceful walk and carry themselves with dignity.'
  },
  'Gemini': {
    health: 'Gemini ascendant people may experience respiratory issues, nervous system sensitivity, and problems related to arms and shoulders. They need to manage stress and anxiety through relaxation techniques. Regular breathing exercises and meditation can be beneficial.',
    temperament: 'Gemini ascendant individuals are versatile, quick-witted, and excellent communicators. They are curious, adaptable, and enjoy learning new things. They can be restless and sometimes scattered, but their mental agility and charm make them excellent networkers and problem solvers.',
    physical: 'Gemini ascendant people typically have a tall, slender build with long arms and fingers. They often have an expressive face with bright, alert eyes and quick movements. They tend to have a youthful appearance and a swift, light walk.'
  },
  'Cancer': {
    health: 'Cancer ascendant people may be sensitive to digestive issues and emotional stress affecting their physical health. They should pay attention to stomach and breast health. Their health is closely tied to their emotional well-being, making stress management important.',
    temperament: 'Cancer ascendant individuals are nurturing, emotional, and intuitive. They are protective of loved ones and have strong family values. They can be moody but are also very caring and sympathetic. They have excellent memory and strong emotional intelligence.',
    physical: 'Cancer ascendant people often have a round or oval face with soft features. They typically have a pale complexion and a plump or rounded body structure. Their walk is usually gentle and they have expressive eyes that reflect their emotions.'
  },
  'Leo': {
    health: 'Leo ascendant people generally have strong vitality but may be prone to heart and spine issues. They should pay attention to cardiovascular health and maintain good posture. They recover quickly from illness due to their strong constitution.',
    temperament: 'Leo ascendant individuals are natural leaders with a dignified and dramatic personality. They are generous, warm-hearted, and creative. They can be proud and attention-seeking but are also loyal and protective. They have strong willpower and natural authority.',
    physical: 'Leo ascendant people typically have a strong, well-proportioned body with broad shoulders and a commanding presence. They often have thick hair, bright eyes, and a noble bearing. Their walk is usually confident and they carry themselves with pride.'
  },
  'Virgo': {
    health: 'Problems with intestines and constipation are common Virgo complaints. Mood swings and despondency from time to time can adversely affect others in the surrounding area. Virgo Ascendant people may have trouble with their sexual organs. Their stomachs require them to be careful about their diet, it is essential that they treat their fascination with exotic food with extreme care.',
    temperament: 'Virgo Ascendant people are relatively reserved and are polite and soft spoken. They find their friends among those who can help them move up the social stratum. When confronted with obstacles, they stay calm and rational and work on finding a solution. This calmness is sometimes seen as being cold and calculating. They have the ability to analyze and solve the most complex problems. They have wonderful eye for details and thus often neglect the overall issues. They are very intellectual and are tend to make few, if any, concessions to the often dirty and distracting nature of reality. Virgo Ascendant people are very friendly and knowledgeable almost about everything and are usually observant, sharp, critical and patient. They are very selective in friendship and prefer keeping relationships on apparent basis. Virgo Ascendant people are prone to worry and hypochondria. They make their selves useful to others that it often leaves them vulnerable to misuse and mistreatment. Virgo Ascendant people are nit-picker, stickler and critical of self and others.',
    physical: 'Virgo Ascendant people often project an image of easygoing bohemianism or general eccentricity. There is often something \'\'petite\'\' and spare about the physical appearance, especially the face, of Virgo. Their carefully measured walk, symmetrical bodies and typically youthful, innocent features are telling. They do possess a good forehead with straight nose and massive cheek.'
  },
  'Libra': {
    health: 'Libra ascendant people may experience issues with kidneys, lower back, and skin. They should maintain balance in their diet and lifestyle. Regular exercise and adequate rest are important for their well-being. They may be prone to indecision-related stress.',
    temperament: 'Libra ascendant individuals are diplomatic, charming, and peace-loving. They have a strong sense of justice and harmony. They can be indecisive but are excellent mediators. They appreciate beauty and have refined tastes. They seek balance in all aspects of life.',
    physical: 'Libra ascendant people typically have a well-proportioned body with graceful features. They often have a symmetrical face with dimples and an attractive smile. Their movements are usually graceful and they carry themselves with elegance.'
  },
  'Scorpio': {
    health: 'Scorpio ascendant people have strong regenerative powers but may be prone to reproductive system issues and allergies. They should be careful with their emotional health as it affects their physical well-being. They have good recovery abilities but should avoid excessive stress.',
    temperament: 'Scorpio ascendant individuals are intense, determined, and mysterious. They have strong willpower and are naturally investigative. They can be secretive but are also deeply loyal and passionate. They have excellent intuition and psychological insight.',
    physical: 'Scorpio ascendant people often have a magnetic presence with penetrating eyes. They typically have a strong, muscular build and a distinctive walk. Their facial features are usually sharp and well-defined, with a somewhat serious expression.'
  },
  'Sagittarius': {
    health: 'Sagittarius ascendant people may experience issues related to hips, thighs, and liver. They should maintain an active lifestyle but avoid overexertion. They benefit from outdoor activities and need to watch their diet to prevent excess.',
    temperament: 'Sagittarius ascendant individuals are optimistic, philosophical, and freedom-loving. They are honest, direct, and have a great sense of humor. They can be restless but are also inspiring and enthusiastic. They have a strong desire for knowledge and adventure.',
    physical: 'Sagittarius ascendant people typically have a tall, athletic build with a long face and high forehead. They often have a cheerful expression and an energetic walk. They tend to have good posture and carry themselves with confidence.'
  },
  'Capricorn': {
    health: 'Capricorn ascendant people may have sensitive joints, bones, and skin. They should pay attention to their skeletal system and teeth. They have good endurance but should avoid overwork. Regular exercise and proper nutrition are essential.',
    temperament: 'Capricorn ascendant individuals are ambitious, disciplined, and practical. They have strong organizational skills and are naturally responsible. They can be reserved but are also determined and patient. They have excellent business sense and leadership abilities.',
    physical: 'Capricorn ascendant people often have a dignified appearance with prominent bones and good height. They typically have a serious expression and may appear older when young but maintain their appearance well with age. Their walk is usually measured and purposeful.'
  },
  'Aquarius': {
    health: 'Aquarius ascendant people may experience circulation issues and ankle problems. They should maintain good blood flow through regular exercise. They may be prone to nervous system sensitivity and should practice stress management.',
    temperament: 'Aquarius ascendant individuals are innovative, independent, and humanitarian. They are forward-thinking and often unconventional. They can be detached but are also friendly and progressive. They have strong intellectual abilities and value freedom.',
    physical: 'Aquarius ascendant people typically have a distinctive appearance with unique features. They often have a good height with a slim build. Their walk is usually quick and they may have an unusual style or way of carrying themselves.'
  },
  'Pisces': {
    health: 'Pisces ascendant people may be sensitive to feet problems and immune system issues. They should pay attention to their lymphatic system and avoid damp environments. Regular exercise and proper rest are important for their well-being.',
    temperament: 'Pisces ascendant individuals are intuitive, compassionate, and artistic. They are sensitive and have strong empathy. They can be dreamy but are also adaptable and understanding. They have rich imagination and spiritual inclination.',
    physical: 'Pisces ascendant people often have a soft, dreamy appearance with large, expressive eyes. They typically have a medium height with a flexible body. Their walk is usually fluid and they have a gentle presence.'
  }
};

// Nakshatra predictions data
const nakshatraPredictions: Record<string, { prediction: string; educationIncome: string; familyLife: string }> = {
  'Ashwini': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Bharani': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Krittika': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Rohini': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Mrigashira': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Ardra': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Punarvasu': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Pushya': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Ashlesha': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Magha': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Purva Phalguni': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Uttara Phalguni': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Hasta': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Chitra': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Swati': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Vishakha': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Anuradha': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Jyeshtha': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Mula': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Purva Ashadha': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Uttara Ashadha': {
    prediction: 'You are culture, pure at heart, and soft-spoken. An innocence can be seen on your face. Your social condition is quite good and you don\'t like too much flashiness. When it comes on clothes, you like stay simple. You are religious and respect others. Your nature is mysterious. That is why it is difficult to judge you in one meeting. There is a shine in your eye and face may have a mole. You do everything with all your honesty and are clear about your thoughts. Neither you deceit anyone nor create any trouble. Being too nice at heart, you get stuck into serious problems at times. You don\'t trust anyone easily, but once you start trusting, you can do anything for the one. You love an easy life and don\'t take any decision hastily. When you trust someone, you take suggestions from them. If you get annoyed with someone, you don\'t use harsh words and don\'t show your displeasure to your rivals as well. You also have interest in spirituality. Japa, Tapa, Vrata, etc. can make you successful in life. Once you start walking on the spiritual path, you start finding all bonds and material life things monotonous. Being hard working, you believe in working continuously. Be it education or work, you like stay ahead of everyone. You will have to take the responsibilities of your family from your childhood. However, you will have good fun during that young age. You must stay alert in any issue. Before getting into any partnership, know the person very well; otherwise you may have to face some problems. After the age of 38, you will get success from everywhere. Your life partner will be responsible and loving; but his/her health might be a cause of concern for you. Health issues related to eyes and stomach may trouble you. So, stay alert in this direction. You will have attractive looks, but you will be stubborn in nature. Unimportant arguments should be avoided. You will be well-educated and will get exclusive success in teaching or banking.',
    educationIncome: 'Favorable professions for you are lecturer or preacher; priest; narrator; astrologer; lawyer; judge; public servant; psychology; military-related work; animal husbandry; wrestler; boxer; judo; karate; athlete; teacher; security department; bodyguard; spiritual healer; politician; business; banking; etc.',
    familyLife: 'Your familial life will be good, but tension related to life partner may trouble you continuously. Spouse will be of good nature and social. Your children will get good education, but some estrangement with them is possible.'
  },
  'Shravana': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Dhanishta': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Shatabhisha': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Purva Bhadrapada': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Uttara Bhadrapada': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
  'Revati': { prediction: '...', educationIncome: '...', familyLife: '...' }, // Add actual predictions
};

// Calculate ascendant
function calculateAscendant(date: Date, lat: number, lng: number) {
  // This is a simplified calculation
  // In a real implementation, you would use more accurate astronomical formulas
  const jd = calculateJulianDay(date);
  const gst = calculateGreenwichSiderealTime(jd);
  const lst = (gst + lng / 15) % 24;
  const ramc = lst * 15;
  
  // Simplified ascendant calculation
  const ascendant = (ramc + lat) % 360;
  return ascendant;
}

// Calculate nakshatra
function calculateNakshatra(longitude: number) {
  const nakshatras = [
    { name: 'Ashwini', ruler: 'Ketu', range: [0, 13.333333] },
    { name: 'Bharani', ruler: 'Venus', range: [13.333333, 26.666666] },
    { name: 'Krittika', ruler: 'Sun', range: [26.666666, 40] },
    { name: 'Rohini', ruler: 'Moon', range: [40, 53.333333] },
    { name: 'Mrigashira', ruler: 'Mars', range: [53.333333, 66.666666] },
    { name: 'Ardra', ruler: 'Rahu', range: [66.666666, 80] },
    { name: 'Punarvasu', ruler: 'Jupiter', range: [80, 93.333333] },
    { name: 'Pushya', ruler: 'Saturn', range: [93.333333, 106.666666] },
    { name: 'Ashlesha', ruler: 'Mercury', range: [106.666666, 120] },
    { name: 'Magha', ruler: 'Ketu', range: [120, 133.333333] },
    { name: 'Purva Phalguni', ruler: 'Venus', range: [133.333333, 146.666666] },
    { name: 'Uttara Phalguni', ruler: 'Sun', range: [146.666666, 160] },
    { name: 'Hasta', ruler: 'Moon', range: [160, 173.333333] },
    { name: 'Chitra', ruler: 'Mars', range: [173.333333, 186.666666] },
    { name: 'Swati', ruler: 'Rahu', range: [186.666666, 200] },
    { name: 'Vishakha', ruler: 'Jupiter', range: [200, 213.333333] },
    { name: 'Anuradha', ruler: 'Saturn', range: [213.333333, 226.666666] },
    { name: 'Jyeshtha', ruler: 'Mercury', range: [226.666666, 240] },
    { name: 'Mula', ruler: 'Ketu', range: [240, 253.333333] },
    { name: 'Purva Ashadha', ruler: 'Venus', range: [253.333333, 266.666666] },
    { name: 'Uttara Ashadha', ruler: 'Sun', range: [266.666666, 280] },
    { name: 'Shravana', ruler: 'Moon', range: [280, 293.333333] },
    { name: 'Dhanishta', ruler: 'Mars', range: [293.333333, 306.666666] },
    { name: 'Shatabhisha', ruler: 'Rahu', range: [306.666666, 320] },
    { name: 'Purva Bhadrapada', ruler: 'Jupiter', range: [320, 333.333333] },
    { name: 'Uttara Bhadrapada', ruler: 'Saturn', range: [333.333333, 346.666666] },
    { name: 'Revati', ruler: 'Mercury', range: [346.666666, 360] }
  ];

  for (const nakshatra of nakshatras) {
    if (longitude >= nakshatra.range[0] && longitude < nakshatra.range[1]) {
      return {
        name: nakshatra.name,
        ruler: nakshatra.ruler,
        pada: Math.floor((longitude - nakshatra.range[0]) / 3.333333) + 1
      };
    }
  }
  
  return null;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, day, month, year, hrs, min, sec, pob, gender } = body;

    // Validate required fields
    if (!fullName || !day || !month || !year || !hrs || !min || !sec || !pob || !gender) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        requiredFields: {
          fullName: 'Full name of the person',
          day: 'Day of birth is required',
          month: 'Month of birth is required',
          year: 'Year of birth is required',
          hrs: 'Hour of birth is required',
          min: 'Minute of birth is required',
          sec: 'Second of birth is required',
          pob: 'Place of birth is required',
          gender: 'Gender is required'
        }
      }, { status: 400 });
    }

    // Construct dob and tob
    const dob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const tob = `${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

    // Get coordinates for the place of birth
    const coordinates = await getCoordinates(pob);
    
    // Parse date and time
    const [dobYear, dobMonth, dobDay] = dob.split('-').map(Number);
    const [hour, minute] = tob.split(':').map(Number);
    
    // Create date object - ensure UTC
    const dateObj = new Date(Date.UTC(dobYear, dobMonth-1, dobDay, hour, minute, 0));
    
    // Calculate Julian Day
    const jd = calculateJulianDay(dateObj);
    
    // Calculate Sun's position
    const sunLongitude = calculateSunLongitude(jd);
    const sunSign = getSignFromLongitude(sunLongitude);
    
    // Calculate Ayanamsa
    const ayanamsa = calculateLahiriAyanamsa(jd);
    
    // Calculate sidereal Sun position
    const siderealSunLongitude = (sunLongitude - ayanamsa + 360) % 360;
    const siderealSunSign = getSignFromLongitude(siderealSunLongitude);
    
    // Calculate Ascendant
    const ascendant = calculateAscendant(dateObj, coordinates.lat, coordinates.lng);
    const ascendantSign = getSignFromLongitude(ascendant);
    
    // Calculate Houses
    const houses = calculateHouses(ascendant);
    
    // Calculate Nakshatra for Sun
    const sunNakshatra = calculateNakshatra(siderealSunLongitude);
    
    // Get dynamic predictions
    const ascendantPrediction = ascendantPredictions[ascendantSign] || { health: 'No prediction available.', temperament: 'No prediction available.', physical: 'No prediction available.' };
    const nakshatraPrediction = sunNakshatra ? (nakshatraPredictions[sunNakshatra.name] || { prediction: 'No prediction available.', educationIncome: 'No prediction available.', familyLife: 'No prediction available.' }) : { prediction: 'Nakshatra not determined.', educationIncome: 'Nakshatra not determined.', familyLife: 'Nakshatra not determined.' };

    // Assemble the kundli data
    const kundliData = {
      personalInfo: {
        fullName,
        dateOfBirth: dob,
        timeOfBirth: tob,
        placeOfBirth: pob,
        gender: gender || 'Not specified',
        coordinates: coordinates
      },
      ascendant: {
        longitude: ascendant,
        sign: ascendantSign,
        degree: ascendant % 30
      },
      sunPosition: {
        tropical: {
          longitude: sunLongitude,
          sign: sunSign,
          degree: sunLongitude % 30
        },
        sidereal: {
          longitude: siderealSunLongitude,
          sign: siderealSunSign,
          degree: siderealSunLongitude % 30,
          nakshatra: sunNakshatra
        }
      },
      houses: houses,
      ayanamsa: ayanamsa,
      disclaimer: "This is a basic kundli calculation. For detailed analysis, please consult with a professional astrologer.",
      predictions: {
        ascendant: ascendantPrediction,
        nakshatra: nakshatraPrediction
      }
    };
    
    const response = NextResponse.json(kundliData);
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
  } catch (error: any) {
    console.error('API error:', error);
    const errorResponse = NextResponse.json({ 
      error: 'Error generating kundli', 
      details: error.message
    }, { status: 500 });
    errorResponse.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return errorResponse;
  }
} 