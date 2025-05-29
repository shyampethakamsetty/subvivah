import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import translations from '@/translations/kundli';
import kundliContent from '@/translations/kundliContent';
import { Language } from '@/translations/types';

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
          line-height: 1.6;
          margin: 0;
          padding: 30px;
          color: #333;
          background-color: #fff;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(to right, #2c3e50, #3498db);
          color: white;
          border-radius: 8px;
        }
        .header h1 {
          margin: 0;
          padding: 0;
          font-size: 28px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 20px;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #2c3e50;
          padding-bottom: 8px;
          border-bottom: 2px solid #3498db;
        }
        .info-item {
          margin-bottom: 12px;
          display: flex;
          align-items: baseline;
          padding: 8px;
          border-radius: 4px;
          background-color: #f8f9fa;
        }
        .info-item:nth-child(even) {
          background-color: #fff;
        }
        .label {
          font-weight: bold;
          color: #34495e;
          min-width: 180px;
          display: inline-block;
          padding-right: 15px;
        }
        .value {
          color: #2c3e50;
          flex: 1;
        }
        .chart-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 15px 0;
          border: 1px solid #e9ecef;
        }
        .chart-section h3 {
          color: #2c3e50;
          margin: 0 0 15px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid #dee2e6;
        }
        .prediction-section {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          margin: 15px 0;
          border-left: 4px solid #3498db;
        }
        .prediction-section h3 {
          color: #2c3e50;
          margin: 0 0 15px 0;
        }
        .nakshatra-details {
          background: #f1f8ff;
          padding: 20px;
          border-radius: 8px;
          margin: 15px 0;
          border: 1px solid #bde0ff;
        }
        .nakshatra-details h4 {
          color: #2c3e50;
          margin: 0 0 15px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #bde0ff;
        }
        .coordinates {
          font-family: monospace;
          color: #666;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          font-size: 12px;
          color: #666;
        }
        .footer p {
          margin: 5px 0;
        }
        .page-break {
          page-break-before: always;
          height: 0;
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>{{t.title}}</h1>
      </div>

      <div class="section">
        <div class="section-title">{{t.sections.personalInfo}}</div>
        <div class="info-item">
          <span class="label">{{t.labels.name}}:</span>
          <span class="value">{{kundliData.personalInfo.fullName}}</span>
        </div>
        <div class="info-item">
          <span class="label">{{t.labels.dateOfBirth}}:</span>
          <span class="value">{{kundliData.personalInfo.dateOfBirth}}</span>
        </div>
        <div class="info-item">
          <span class="label">{{t.labels.timeOfBirth}}:</span>
          <span class="value">{{kundliData.personalInfo.timeOfBirth}}</span>
        </div>
        <div class="info-item">
          <span class="label">{{t.labels.placeOfBirth}}:</span>
          <span class="value">{{kundliData.personalInfo.placeOfBirth}}</span>
        </div>
        <div class="info-item">
          <span class="label">{{t.labels.gender}}:</span>
          <span class="value">{{kundliData.personalInfo.gender}}</span>
        </div>
        <div class="info-item">
          <span class="label">{{t.labels.coordinates}}:</span>
          <span class="value coordinates">Lat: {{kundliData.personalInfo.coordinates.lat}}, Long: {{kundliData.personalInfo.coordinates.lng}}</span>
        </div>
      </div>

      <div class="page-break"></div>

      <div class="section">
        <div class="section-title">{{t.sections.ascendant}}</div>
        <div class="chart-section">
          <div class="info-item">
            <span class="label">{{t.labels.sign}}:</span>
            <span class="value">{{translateSign kundliData.ascendant.sign language}}</span>
          </div>
          <div class="info-item">
            <span class="label">{{t.labels.degree}}:</span>
            <span class="value">{{kundliData.ascendant.degree}}°</span>
          </div>
          <div class="info-item">
            <span class="label">{{t.labels.longitude}}:</span>
            <span class="value">{{kundliData.ascendant.longitude}}°</span>
          </div>
        </div>

        <div class="prediction-section">
          <h3>{{t.sections.ascendant}}</h3>
          <div class="info-item">
            <span class="label">{{t.labels.health}}:</span>
            <span class="value">{{translatePrediction "ascendant" "health" kundliData.ascendant.sign language}}</span>
          </div>
          <div class="info-item">
            <span class="label">{{t.labels.temperament}}:</span>
            <span class="value">{{translatePrediction "ascendant" "temperament" kundliData.ascendant.sign language}}</span>
          </div>
          <div class="info-item">
            <span class="label">{{t.labels.physical}}:</span>
            <span class="value">{{translatePrediction "ascendant" "physical" kundliData.ascendant.sign language}}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">{{t.sections.sunPosition}}</div>
        <div class="chart-section">
          <h3>{{t.labels.tropical}}</h3>
          <div class="info-item">
            <span class="label">{{t.labels.sign}}:</span>
            <span class="value">{{translateSign kundliData.sunPosition.tropical.sign language}}</span>
          </div>
          <div class="info-item">
            <span class="label">{{t.labels.degree}}:</span>
            <span class="value">{{kundliData.sunPosition.tropical.degree}}°</span>
          </div>
          <div class="info-item">
            <span class="label">{{t.labels.longitude}}:</span>
            <span class="value">{{kundliData.sunPosition.tropical.longitude}}°</span>
          </div>
        </div>

        <div class="chart-section">
          <h3>{{t.labels.sidereal}}</h3>
          <div class="info-item">
            <span class="label">{{t.labels.sign}}:</span>
            <span class="value">{{translateSign kundliData.sunPosition.sidereal.sign language}}</span>
          </div>
          <div class="info-item">
            <span class="label">{{t.labels.degree}}:</span>
            <span class="value">{{kundliData.sunPosition.sidereal.degree}}°</span>
          </div>
          <div class="info-item">
            <span class="label">{{t.labels.longitude}}:</span>
            <span class="value">{{kundliData.sunPosition.sidereal.longitude}}°</span>
          </div>

          <div class="nakshatra-details">
            <h4>{{t.labels.nakshatra}}</h4>
            <div class="info-item">
              <span class="label">{{t.labels.nakshatra}}:</span>
              <span class="value">{{translateNakshatra kundliData.sunPosition.sidereal.nakshatra.name language}}</span>
            </div>
            <div class="info-item">
              <span class="label">{{t.labels.pada}}:</span>
              <span class="value">{{kundliData.sunPosition.sidereal.nakshatra.pada}}</span>
            </div>
            <div class="info-item">
              <span class="label">{{t.labels.ruler}}:</span>
              <span class="value">{{kundliData.sunPosition.sidereal.nakshatra.ruler}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="page-break"></div>

      <div class="section">
        <div class="section-title">{{t.sections.houses}}</div>
        <div class="chart-section">
          {{#each kundliData.houses}}
          <div class="info-item">
            <span class="label">{{translateHouse house language}}:</span>
            <span class="value">{{translateSign sign ../language}} - {{degree}}°</span>
          </div>
          {{/each}}
        </div>
      </div>

      {{#if kundliData.predictions.nakshatra}}
      {{#if (or kundliData.predictions.nakshatra.prediction kundliData.predictions.nakshatra.educationIncome kundliData.predictions.nakshatra.familyLife)}}
      <div class="section">
        <div class="section-title">{{t.sections.nakshatraPredictions}}</div>
        <div class="prediction-section">
          {{#if kundliData.predictions.nakshatra.prediction}}
          <div class="info-item">
            <span class="label">{{t.labels.generalPrediction}}:</span>
            <span class="value">{{translatePrediction "nakshatra" "general" kundliData.sunPosition.sidereal.nakshatra.name language}}</span>
          </div>
          {{/if}}
          {{#if kundliData.predictions.nakshatra.educationIncome}}
          <div class="info-item">
            <span class="label">{{t.labels.educationIncome}}:</span>
            <span class="value">{{translatePrediction "nakshatra" "educationIncome" kundliData.sunPosition.sidereal.nakshatra.name language}}</span>
          </div>
          {{/if}}
          {{#if kundliData.predictions.nakshatra.familyLife}}
          <div class="info-item">
            <span class="label">{{t.labels.familyLife}}:</span>
            <span class="value">{{translatePrediction "nakshatra" "familyLife" kundliData.sunPosition.sidereal.nakshatra.name language}}</span>
          </div>
          {{/if}}
        </div>
      </div>
      {{/if}}
      {{/if}}

      <div class="section">
        <div class="section-title">{{t.sections.additionalInfo}}</div>
        <div class="info-item">
          <span class="label">{{t.labels.ayanamsa}}:</span>
          <span class="value">{{kundliData.ayanamsa}}°</span>
        </div>
      </div>

      <div class="footer">
        <p>{{t.disclaimer}}</p>
        <p>{{t.generated}}: {{currentDate}}</p>
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
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  ascendant: {
    longitude: number;
    sign: string;
    degree: number;
  };
  sunPosition: {
    tropical: {
      longitude: number;
      sign: string;
      degree: number;
    };
    sidereal: {
      longitude: number;
      sign: string;
      degree: number;
      nakshatra: {
        name: string;
        ruler: string;
        pada: number;
      };
    };
  };
  houses: Array<{
    house: number;
    sign: string;
    degree: number;
    name: string;
  }>;
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
  ayanamsa: number;
  disclaimer: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let browser = null;
  try {
    // Register Handlebars helper for 'or' condition
    Handlebars.registerHelper('or', function() {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    });

    // Register helper for translating signs
    Handlebars.registerHelper('translateSign', function(sign: string, language: Language) {
      if (!sign) return '';
      const signKey = sign.toLowerCase() as keyof typeof kundliContent[Language]['signs'];
      const translation = kundliContent[language]?.signs[signKey];
      return translation || kundliContent.en.signs[signKey] || sign;
    });

    // Register helper for translating nakshatras
    Handlebars.registerHelper('translateNakshatra', function(nakshatra: string, language: Language) {
      if (!nakshatra) return '';
      const nakshatraKey = nakshatra.toLowerCase().replace(/\s+/g, '') as keyof typeof kundliContent[Language]['nakshatras'];
      const translation = kundliContent[language]?.nakshatras[nakshatraKey];
      return translation || kundliContent.en.nakshatras[nakshatraKey] || nakshatra;
    });

    // Register helper for translating houses
    Handlebars.registerHelper('translateHouse', function(houseNumber: number, language: Language) {
      if (!houseNumber) return '';
      const houseKey = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'][houseNumber - 1] as keyof typeof kundliContent[Language]['houses'];
      const translation = kundliContent[language]?.houses[houseKey];
      return translation || kundliContent.en.houses[houseKey] || `House ${houseNumber}`;
    });

    // Register helper for translating predictions
    Handlebars.registerHelper('translatePrediction', function(type: string, subtype: string, key: string, language: Language) {
      if (!type || !subtype || !key) return '';
      try {
        const predictionType = type as keyof typeof kundliContent[Language]['standardPredictions'];
        const predictionSubtype = subtype as keyof typeof kundliContent[Language]['standardPredictions'][typeof predictionType];
        const prediction = kundliContent[language]?.standardPredictions[predictionType]?.[predictionSubtype]?.[key.toLowerCase()];
        return prediction || kundliContent.en.standardPredictions[predictionType][predictionSubtype][key.toLowerCase()] || '';
      } catch (error) {
        return '';
      }
    });

    const { kundliData, language = 'en' } = await request.json();

    if (!kundliData) {
      return NextResponse.json(
        { error: 'Kundli data is required' },
        { status: 400 }
      );
    }

    // Get translations for the selected language with fallback to English
    const t = translations[language as Language] || translations.en;
    const content = kundliContent[language as Language] || kundliContent.en;

    // Format date in the selected language
    const dateFormatter = new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Translate personal info based on language
    const translatedPersonalInfo = {
      fullName: kundliData.personalInfo.fullName,
      dateOfBirth: new Date(kundliData.personalInfo.dateOfBirth).toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      timeOfBirth: new Date(`1970-01-01T${kundliData.personalInfo.timeOfBirth}`).toLocaleTimeString(language, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      placeOfBirth: kundliData.personalInfo.placeOfBirth,
      gender: t.labels.gender === undefined ? kundliData.personalInfo.gender : t.labels.gender,
      coordinates: kundliData.personalInfo.coordinates
    };

    // Translate predictions based on sign and nakshatra with proper fallbacks
    const translatedKundliData = {
      ...kundliData,
      personalInfo: translatedPersonalInfo,
      predictions: {
        ascendant: {
          health: content.standardPredictions.ascendant.health[kundliData.ascendant.sign.toLowerCase()] || 
                 kundliContent.en.standardPredictions.ascendant.health[kundliData.ascendant.sign.toLowerCase()] ||
                 kundliData.predictions.ascendant.health,
          temperament: content.standardPredictions.ascendant.temperament[kundliData.ascendant.sign.toLowerCase()] ||
                      kundliContent.en.standardPredictions.ascendant.temperament[kundliData.ascendant.sign.toLowerCase()] ||
                      kundliData.predictions.ascendant.temperament,
          physical: content.standardPredictions.ascendant.physical[kundliData.ascendant.sign.toLowerCase()] ||
                   kundliContent.en.standardPredictions.ascendant.physical[kundliData.ascendant.sign.toLowerCase()] ||
                   kundliData.predictions.ascendant.physical
        },
        nakshatra: {
          prediction: content.standardPredictions.nakshatra.general[kundliData.sunPosition.sidereal.nakshatra.name.toLowerCase()] ||
                     kundliContent.en.standardPredictions.nakshatra.general[kundliData.sunPosition.sidereal.nakshatra.name.toLowerCase()] ||
                     kundliData.predictions.nakshatra.prediction,
          educationIncome: content.standardPredictions.nakshatra.educationIncome[kundliData.sunPosition.sidereal.nakshatra.name.toLowerCase()] ||
                          kundliContent.en.standardPredictions.nakshatra.educationIncome[kundliData.sunPosition.sidereal.nakshatra.name.toLowerCase()] ||
                          kundliData.predictions.nakshatra.educationIncome,
          familyLife: content.standardPredictions.nakshatra.familyLife[kundliData.sunPosition.sidereal.nakshatra.name.toLowerCase()] ||
                     kundliContent.en.standardPredictions.nakshatra.familyLife[kundliData.sunPosition.sidereal.nakshatra.name.toLowerCase()] ||
                     kundliData.predictions.nakshatra.familyLife
        }
      }
    };

    // Add translations and current date to the template data
    const templateData = {
      kundliData: translatedKundliData,
      t,
      language,
      currentDate: dateFormatter.format(new Date())
    };

    // Generate HTML content
    const htmlContent = template(templateData);

    // Launch browser with more robust configuration
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
      timeout: 60000 // Increase timeout to 60 seconds
    });

    // Create new page with more robust configuration
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);
    
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    });

    // Set content with more robust error handling
    try {
      await page.setContent(htmlContent, {
        waitUntil: ['load', 'networkidle0'],
        timeout: 60000
      });
    } catch (contentError) {
      console.error('Error setting page content:', contentError);
      throw new Error('Failed to set page content: ' + (contentError instanceof Error ? contentError.message : 'Unknown error'));
    }

    // Generate PDF with more robust error handling
    let pdfBuffer;
    try {
      pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        printBackground: true,
        preferCSSPageSize: true,
        timeout: 60000
      });
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      throw new Error('Failed to generate PDF: ' + (pdfError instanceof Error ? pdfError.message : 'Unknown error'));
    }

    // Ensure browser cleanup
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
      browser = null;
    }

    // Set response headers and return
    const response = new NextResponse(pdfBuffer);
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set(
      'Content-Disposition',
      `attachment; filename=${encodeURIComponent(kundliData.personalInfo.fullName)}-kundli.pdf`
    );

    return response;

  } catch (error) {
    console.error('PDF generation error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    });
    
    // Ensure browser cleanup on error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser cleanup:', closeError);
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 