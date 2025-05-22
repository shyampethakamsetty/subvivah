'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

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
    };
  };
  ayanamsa: number;
  disclaimer: string;
}

export default function KundliForm() {
  const [loading, setLoading] = useState(false);
  const [kundliData, setKundliData] = useState<KundliData | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    tob: '',
    pob: '',
    gender: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/kundli', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          dob: formData.dob,
          tob: formData.tob,
          pob: formData.pob,
          gender: formData.gender
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate kundli');
      }

      setKundliData(data);
      toast.success('Kundli generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate kundli');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto bg-white border border-gray-200 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-gray-900">Generate Your Kundli</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your birth details to generate your kundli
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-800">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="text-gray-800">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tob" className="text-gray-800">Time of Birth</Label>
              <Input
                id="tob"
                name="tob"
                type="time"
                value={formData.tob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pob" className="text-gray-800">Place of Birth</Label>
              <Input
                id="pob"
                name="pob"
                value={formData.pob}
                onChange={handleChange}
                required
                placeholder="Enter your place of birth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-800">Gender (Optional)</Label>
              <Input
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Enter your gender"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Kundli'}
            </Button>
          </form>

          {kundliData && (
            <div className="mt-12 space-y-4 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900">Your Kundli Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-800">
                  <h4 className="font-medium text-gray-900">Personal Information</h4>
                  <p>Name: {kundliData.personalInfo.fullName}</p>
                  <p>Date of Birth: {kundliData.personalInfo.dateOfBirth}</p>
                  <p>Time of Birth: {kundliData.personalInfo.timeOfBirth}</p>
                  <p>Place of Birth: {kundliData.personalInfo.placeOfBirth}</p>
                  {kundliData.personalInfo.gender && (
                    <p>Gender: {kundliData.personalInfo.gender}</p>
                  )}
                </div>

                <div className="text-gray-800">
                  <h4 className="font-medium text-gray-900">Astrological Information</h4>
                  <p>Tropical Sun Sign: {kundliData.sunPosition.tropical.sign}</p>
                  <p>Sidereal Sun Sign: {kundliData.sunPosition.sidereal.sign}</p>
                  <p>Ayanamsa: {kundliData.ayanamsa.toFixed(2)}°</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                {kundliData.disclaimer}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 