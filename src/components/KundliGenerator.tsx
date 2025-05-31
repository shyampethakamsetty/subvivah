'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimePickerInput } from '@/components/ui/time-picker-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface KundliResponse {
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
  ayanamsa: number;
  disclaimer: string;
}

export default function KundliGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KundliResponse | null>(null);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('12:00');
  const [formData, setFormData] = useState({
    fullName: '',
    placeOfBirth: '',
    gender: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setLoading(true);
    try {
      const response = await fetch('/api/kundli', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          dob: format(date, 'yyyy-MM-dd'),
          tob: time,
          pob: formData.placeOfBirth,
          gender: formData.gender
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
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
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate Kundli</CardTitle>
          <CardDescription>
            Enter your birth details to generate your astrological chart
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
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
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Time of Birth</Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <TimePickerInput
                    value={time}
                    onChange={setTime}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">Place of Birth</Label>
                <Input
                  id="placeOfBirth"
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleChange}
                  required
                  placeholder="Enter place of birth"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Kundli'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Kundli Details</CardTitle>
            <CardDescription>Your astrological chart details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Personal Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {result.personalInfo.fullName}</p>
                    <p><span className="font-medium">Date of Birth:</span> {result.personalInfo.dateOfBirth}</p>
                    <p><span className="font-medium">Time of Birth:</span> {result.personalInfo.timeOfBirth}</p>
                    <p><span className="font-medium">Place of Birth:</span> {result.personalInfo.placeOfBirth}</p>
                    <p><span className="font-medium">Gender:</span> {result.personalInfo.gender}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Ascendant (Lagna)</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Sign:</span> {result.ascendant.sign}</p>
                    <p><span className="font-medium">Degree:</span> {result.ascendant.degree.toFixed(2)}°</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Sun Position (Tropical)</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Sign:</span> {result.sunPosition.tropical.sign}</p>
                    <p><span className="font-medium">Degree:</span> {result.sunPosition.tropical.degree.toFixed(2)}°</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Sun Position (Sidereal)</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Sign:</span> {result.sunPosition.sidereal.sign}</p>
                    <p><span className="font-medium">Degree:</span> {result.sunPosition.sidereal.degree.toFixed(2)}°</p>
                    <p><span className="font-medium">Nakshatra:</span> {result.sunPosition.sidereal.nakshatra.name}</p>
                    <p><span className="font-medium">Pada:</span> {result.sunPosition.sidereal.nakshatra.pada}</p>
                    <p><span className="font-medium">Ruler:</span> {result.sunPosition.sidereal.nakshatra.ruler}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Houses</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {result.houses.map((house) => (
                    <div key={house.house} className="p-3 border rounded-lg">
                      <p className="font-medium">House {house.house}</p>
                      <p className="text-sm">{house.name}</p>
                      <p className="text-sm">{house.sign} {house.degree.toFixed(2)}°</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><span className="font-medium">Ayanamsa:</span> {result.ayanamsa.toFixed(2)}°</p>
                <p className="mt-2 italic">{result.disclaimer}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 