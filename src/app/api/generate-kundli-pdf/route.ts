import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';

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
          text-align: left;
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
        <h1>Kundli Report</h1>
      </div>

      <div class="section">
        <div class="section-title">Personal Information</div>
        <div class="info-item">
          <span class="label">Name:</span>
          <span class="value">{{kundliData.personalInfo.fullName}}</span>
        </div>
        <div class="info-item">
          <span class="label">Date of Birth:</span>
          <span class="value">{{kundliData.personalInfo.dateOfBirth}}</span>
        </div>
        <div class="info-item">
          <span class="label">Time of Birth:</span>
          <span class="value">{{kundliData.personalInfo.timeOfBirth}}</span>
        </div>
        <div class="info-item">
          <span class="label">Place of Birth:</span>
          <span class="value">{{kundliData.personalInfo.placeOfBirth}}</span>
        </div>
        <div class="info-item">
          <span class="label">Gender:</span>
          <span class="value">{{kundliData.personalInfo.gender}}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Ascendant (Lagna)</div>
        <div class="info-item">
          <span class="label">Sign:</span>
          <span class="value">{{kundliData.ascendant.sign}}</span>
        </div>
        <div class="info-item">
          <span class="label">Degree:</span>
          <span class="value">{{kundliData.ascendant.degree}}°</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Understanding Your Ascendant</div>
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
        <div class="section-title">Understanding Your Nakshatra</div>
        <p>Nakshatra is the term for lunar mansion in Hindu astrology. A nakshatra is one of 27 (sometimes also 28)
        sectors along the ecliptic. Each nakshatra is further subdivided into quarters (or padas). These play a role in
        popular Hindu astrology, where each pada is associated with a syllable, conventionally chosen as the first
        syllable of the given name of a child born when the moon was in the corresponding pada.</p>
        
        <div class="subsection">
          <h3>Your Nakshatra Details</h3>
          <div class="info-item">
            <span class="label">Nakshatra:</span>
            <span class="value">{{kundliData.sunPosition.sidereal.nakshatra.name}}</span>
          </div>
          <div class="info-item">
            <span class="label">Pada:</span>
            <span class="value">{{kundliData.sunPosition.sidereal.nakshatra.pada}}</span>
          </div>
          
          <h4>{{kundliData.sunPosition.sidereal.nakshatra.name}} Nakshatra Prediction</h4>
          <p>{{kundliData.predictions.nakshatra.prediction}}</p>
          
          <h4>Education & Income</h4>
          <p>{{kundliData.predictions.nakshatra.educationIncome}}</p>
          
          <h4>Family Life</h4>
          <p>{{kundliData.predictions.nakshatra.familyLife}}</p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Sun Position</div>
        <div class="info-item">
          <span class="label">Tropical Sign:</span>
          <span class="value">{{kundliData.sunPosition.tropical.sign}}</span>
        </div>
        <div class="info-item">
          <span class="label">Tropical Degree:</span>
          <span class="value">{{kundliData.sunPosition.tropical.degree}}°</span>
        </div>
        <div class="info-item">
          <span class="label">Sidereal Sign:</span>
          <span class="value">{{kundliData.sunPosition.sidereal.sign}}</span>
        </div>
        <div class="info-item">
          <span class="label">Sidereal Degree:</span>
          <span class="value">{{kundliData.sunPosition.sidereal.degree}}°</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Houses</div>
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
        <div class="section-title">Additional Information</div>
        <div class="info-item">
          <span class="label">Ayanamsa:</span>
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

    // Add current date to the template data
    const templateData = {
      kundliData,
      currentDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    // Generate HTML content
    const htmlContent = template(templateData);

    // Launch browser with optimized settings
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ],
      timeout: 30000 // Reduced timeout to 30 seconds
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
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for fonts to load with timeout
    try {
      await Promise.race([
        page.evaluateHandle('document.fonts.ready'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Font loading timeout')), 10000))
      ]);
    } catch (error) {
      console.warn('Font loading timeout, continuing with PDF generation');
    }

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
      } else if (errorDetails.includes('Target closed')) {
        errorMessage = 'PDF generation was interrupted. Please try again.';
      } else if (errorDetails.includes('Protocol error')) {
        errorMessage = 'Error during PDF generation. Please try again.';
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