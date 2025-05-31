import KundliGenerator from '@/components/KundliGenerator';

export default function KundliPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg">Kundli Generator</h1>
        <KundliGenerator />
      </div>
    </div>
  );
} 