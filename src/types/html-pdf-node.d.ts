declare module 'html-pdf-node' {
  interface PdfOptions {
    format?: 'A3' | 'A4' | 'A5' | 'Legal' | 'Letter' | 'Tabloid';
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    printBackground?: boolean;
    preferCSSPageSize?: boolean;
  }

  interface PdfContent {
    content: string;
  }

  interface PdfResult {
    content: Buffer;
  }

  export function generatePdf(
    content: PdfContent,
    options?: PdfOptions
  ): Promise<Buffer>;
} 