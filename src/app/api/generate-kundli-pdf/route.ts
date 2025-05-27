import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';

// Translations for different languages
const translations = {
  en: {
    title: 'Kundli Report',
    personalInfo: 'Personal Information',
    name: 'Name',
    dateOfBirth: 'Date of Birth',
    timeOfBirth: 'Time of Birth',
    placeOfBirth: 'Place of Birth',
    gender: 'Gender',
    ascendant: 'Ascendant (Lagna)',
    sign: 'Sign',
    degree: 'Degree',
    understanding: 'Understanding Your Ascendant',
    health: 'Health',
    temperament: 'Temperament & Personality',
    physical: 'Physical Appearance',
    nakshatra: 'Understanding Your Nakshatra',
    nakshatraDetails: 'Your Nakshatra Details',
    pada: 'Pada',
    prediction: 'Prediction',
    educationIncome: 'Education & Income',
    familyLife: 'Family Life',
    sunPosition: 'Sun Position',
    tropicalSign: 'Tropical Sign',
    tropicalDegree: 'Tropical Degree',
    siderealSign: 'Sidereal Sign',
    siderealDegree: 'Sidereal Degree',
    houses: 'Houses',
    additionalInfo: 'Additional Information',
    ayanamsa: 'Ayanamsa',
    disclaimer: 'Disclaimer'
  },
  hi: {
    title: 'कुंडली रिपोर्ट',
    personalInfo: 'व्यक्तिगत जानकारी',
    name: 'नाम',
    dateOfBirth: 'जन्म तिथि',
    timeOfBirth: 'जन्म समय',
    placeOfBirth: 'जन्म स्थान',
    gender: 'लिंग',
    ascendant: 'लग्न',
    sign: 'राशि',
    degree: 'अंश',
    understanding: 'आपके लग्न को समझना',
    health: 'स्वास्थ्य',
    temperament: 'स्वभाव और व्यक्तित्व',
    physical: 'शारीरिक दिखावट',
    nakshatra: 'आपके नक्षत्र को समझना',
    nakshatraDetails: 'आपके नक्षत्र का विवरण',
    pada: 'पद',
    prediction: 'भविष्यवाणी',
    educationIncome: 'शिक्षा और आय',
    familyLife: 'पारिवारिक जीवन',
    sunPosition: 'सूर्य की स्थिति',
    tropicalSign: 'ट्रॉपिकल राशि',
    tropicalDegree: 'ट्रॉपिकल अंश',
    siderealSign: 'सिडेरियल राशि',
    siderealDegree: 'सिडेरियल अंश',
    houses: 'भाव',
    additionalInfo: 'अतिरिक्त जानकारी',
    ayanamsa: 'अयनांश',
    disclaimer: 'अस्वीकरण'
  }
  // Add more languages here
};

// Function to get translations
function getTranslations(language: string) {
  return translations[language as keyof typeof translations] || translations.en;
}

// Template for the PDF
const template = Handlebars.compile(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.5;
          margin: 0;
          padding: 40px;
          color: #333;
          background-color: #fff;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #2c3e50;
        }
        .header h1 {
          color: #2c3e50;
          font-size: 28px;
          margin: 0;
          padding: 0;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #2c3e50;
          padding-bottom: 8px;
        }
         .section-title::after {
          content: '';
          display: block;
          width: 50px;
          height: 3px;
          background: #2c3e50;
          margin-top: 8px;
        }
        .info-item {
          margin-bottom: 10px;
          display: flex;
          align-items: baseline;
        }
        .label {
          font-weight: bold;
          color: #34495e;
          min-width: 150px;
          display: inline-block;
        }
        .value {
          color: #2c3e50;
        }
        .house-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 20px;
        }
        .house-item {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 6px;
          background-color: #f8f9fa;
        }
        .subsection {
          margin-top: 20px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #eee;
        }
        .subsection h3 {
          color: #2c3e50;
          margin-bottom: 15px;
          font-size: 20px;
          font-weight: bold;
          padding-bottom: 8px;
          border-bottom: 2px solid #34495e;
        }
        .subsection h4 {
          color: #34495e;
          margin: 20px 0 10px 0;
          font-size: 16px;
          font-weight: bold;
          padding-bottom: 5px;
        }
        .subsection h4::after {
           content: '';
           display: block;
           width: 30px;
           height: 2px;
           background: #34495e;
           margin-top: 5px;
        }
        .subsection p {
          margin-bottom: 15px;
          line-height: 1.6;
          color: #2c3e50;
          text-align: left; /* Align left as seen in image */
        }
        .page-break {
          page-break-before: always;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>{{translations.title}}</h1>
      </div>

      <div class="section">
        <div class="section-title">{{translations.personalInfo}}</div>
        <div class="info-item">
          <span class="label">{{translations.name}}:</span>
          <span class="value">{{kundliData.personalInfo.fullName}}</span>
        </div>
        <div class="info-item">
          <span class="label">{{translations.dateOfBirth}}:</span>
          <span class="value">{{kundliData.personalInfo.dateOfBirth}}</span>
        </div>
        <div class="info-item">
          <span class="label">{{translations.timeOfBirth}}:</span>
          <span class="value">{{kundliData.personalInfo.timeOfBirth}}</span>
        </div>
        <div class="info-item">
          <span class="label">{{translations.placeOfBirth}}:</span>
          <span class="value">{{kundliData.personalInfo.placeOfBirth}}</span>
        </div>
        <div class="info-item">
          <span class="label">{{translations.gender}}:</span>
          <span class="value">{{kundliData.personalInfo.gender}}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">{{translations.ascendant}}</div>
        <div class="info-item">
          <span class="label">{{translations.sign}}:</span>
          <span class="value">{{kundliData.ascendant.sign}}</span>
        </div>
        <div class="info-item">
          <span class="label">{{translations.degree}}:</span>
          <span class="value">{{kundliData.ascendant.degree}}°</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">{{translations.understanding}}</div>
        <p>The ascendant house is considered very important in Vedic astrology. During the birth of a person, the sign
        which rises in the sky is called the persons ascendant. And, the sign which comes in this house is called the
        ascendant sign. The ascendant helps in calculating minutest event in a person's life through astrology. Whereas,
        the daily, weekly, monthly and yearly predictions are made on the basis of moon sign and sun sign.</p>
        
        <div class="subsection">
          <h3>Your Ascendant is: {{kundliData.ascendant.sign}}</h3>
          
          <h4>Health for {{kundliData.ascendant.sign}} Ascendant</h4>
          <p>{{kundliData.predictions.ascendant.health}}</p>
          
          <h4>Temperament & Personality For {{kundliData.ascendant.sign}} Ascendant</h4>
          <p>{{kundliData.predictions.ascendant.temperament}}</p>
          
          <h4>Physical Appearance For {{kundliData.ascendant.sign}} Ascendant</h4>
          <p>{{kundliData.predictions.ascendant.physical}}</p>
        </div>
      </div>

      <div class="page-break"></div>

      <div class="section">
        <div class="section-title">{{translations.nakshatra}}</div>
        <p>Nakshatra is the term for lunar mansion in Hindu astrology. A nakshatra is one of 27 (sometimes also 28)
        sectors along the ecliptic. Each nakshatra is further subdivided into quarters (or padas). These play a role in
        popular Hindu astrology, where each pada is associated with a syllable, conventionally chosen as the first
        syllable of the given name of a child born when the moon was in the corresponding pada.</p>
        
        <div class="subsection">
          <h3>{{translations.nakshatraDetails}}</h3>
          <div class="info-item">
            <span class="label">{{translations.nakshatra}}:</span>
            <span class="value">{{kundliData.sunPosition.sidereal.nakshatra.name}}</span>
          </div>
          <div class="info-item">
            <span class="label">{{translations.pada}}:</span>
            <span class="value">{{kundliData.sunPosition.sidereal.nakshatra.pada}}</span>
          </div>
          
          <h4>{{kundliData.sunPosition.sidereal.nakshatra.name}} Nakshatra Prediction</h4>
          <p>{{kundliData.predictions.nakshatra.prediction}}</p>
          
          <h4>{{translations.educationIncome}}</h4>
          <p>{{kundliData.predictions.nakshatra.educationIncome}}</p>
          
          <h4>Family Life</h4>
          <p>{{kundliData.predictions.nakshatra.familyLife}}</p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">{{translations.sunPosition}}</div>
        <div class="info-item">
          <span class="label">{{translations.tropicalSign}}:</span>
          <span class="value">{{kundliData.sunPosition.tropical.sign}}</span>
        </div>
        <div class="info-item">
          <span class="label">{{translations.tropicalDegree}}:</span>
          <span class="value">{{kundliData.sunPosition.tropical.degree}}°</span>
        </div>
        <div class="info-item">
          <span class="label">{{translations.siderealSign}}:</span>
          <span class="value">{{kundliData.sunPosition.sidereal.sign}}</span>
        </div>
        <div class="info-item">
          <span class="label">{{translations.siderealDegree}}:</span>
          <span class="value">{{kundliData.sunPosition.sidereal.degree}}°</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">{{translations.houses}}</div>
        <div class="house-grid">
          {{#each kundliData.houses}}
          <div class="house-item">
            <div><strong>House {{this.house}}:</strong> {{this.name}}</div>
            <div>Sign: {{this.sign}}</div>
            <div>Degree: {{this.degree}}°</div>
          </div>
          {{/each}}
        </div>
      </div>

      <div class="section">
        <div class="section-title">{{translations.additionalInfo}}</div>
        <div class="info-item">
          <span class="label">{{translations.ayanamsa}}:</span>
          <span class="value">{{kundliData.ayanamsa}}°</span>
        </div>
      </div>

      <div class="footer">
        <p>{{kundliData.disclaimer}}</p>
        <p>Generated on: {{currentDate}}</p>
      </div>
    </body>
    </html>
`);

interface KundliData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    gender: string;
  };
  ascendant: {
    sign: string;
    degree: number;
  };
  sunPosition: {
    tropical: {
      sign: string;
      degree: number;
    };
    sidereal: {
      sign: string;
      degree: number;
      nakshatra: {
        name: string;
        pada: number;
      };
    };
  };
  houses: Array<{
    house: number;
    name: string;
    sign: string;
    degree: number;
  }>;
  ayanamsa: number;
  disclaimer: string;
  predictions: {
    ascendant: {
      health: string;
      temperament: string;
      physical: string;
    };
    nakshatra: {
      prediction: string;
      educationIncome: string;
      familyLife: string;
    };
  };
  language?: string;
}

export async function POST(request: Request) {
  let browser = null;
  try {
    const { kundliData } = await request.json() as { kundliData: KundliData };

    if (!kundliData) {
      return NextResponse.json(
        { error: 'Kundli data is required' },
        { status: 400 }
      );
    }

    // Add translations based on language
    const translations = getTranslations(kundliData.language || 'en');

    // Add current date and translations to the template data
    const templateData = {
      kundliData,
      currentDate: new Date().toLocaleDateString(kundliData.language || 'en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      translations
    };

    // Generate HTML content
    const htmlContent = template(templateData);

    // Launch browser with optimized settings
    browser = await puppeteer.launch({
      headless: true as const,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ],
      timeout: 60000 // Increase timeout to 60 seconds
    });

    // Create new page with optimized settings
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    });

    // Set content with optimized settings
    await page.setContent(htmlContent, {
      waitUntil: 'domcontentloaded', // Changed from networkidle0 for faster loading
      timeout: 30000
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Generate PDF with optimized settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      printBackground: true,
      preferCSSPageSize: true,
      timeout: 30000
    });

    // Set response headers
    const response = new NextResponse(pdfBuffer);
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Disposition', 'attachment; filename=kundli.pdf');

    return response;
  } catch (error) {
    console.error('PDF generation error:', error);
    
    // More detailed error handling
    let errorMessage = 'Failed to generate PDF';
    let errorDetails = 'Unknown error';
    
    if (error instanceof Error) {
      errorDetails = error.message;
      if (errorDetails.includes('timeout')) {
        errorMessage = 'PDF generation timed out. Please try again.';
      } else if (errorDetails.includes('browser')) {
        errorMessage = 'Failed to initialize PDF generation. Please try again.';
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  } finally {
    // Close browser with timeout
    if (browser) {
      try {
        await Promise.race([
          browser.close(),
          new Promise(resolve => setTimeout(resolve, 5000)) // 5 second timeout for closing
        ]);
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }
} 