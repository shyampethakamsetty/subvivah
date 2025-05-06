'use client';

import KundliGenerator from '@/components/KundliGenerator';

const KundliPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kundli Generator</h1>
          <p className="mt-4 text-lg text-gray-600">
            Generate your detailed Kundli based on your birth details
          </p>
        </div>
        <KundliGenerator />
      </div>
    </div>
  );
};

export default KundliPage; 