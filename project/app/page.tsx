'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

// Form schema
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  dob: z.date({
    required_error: 'Date of birth is required.',
  }),
  tob: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Please enter a valid time in 24-hour format (HH:MM).',
  }),
  pob: z.string().min(2, {
    message: 'Place of birth is required.',
  }),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender.',
  }),
});

const timeOptions = Array.from({ length: 24 }, (_, hour) => 
  Array.from({ length: 4 }, (_, quarterIdx) => {
    const minute = quarterIdx * 15;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  })
).flat();

export default function KundliForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      tob: '12:00',
      pob: '',
      gender: 'male',
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      // Format the date for the API
      const formattedValues = {
        ...values,
        dob: format(values.dob, 'yyyy-MM-dd'),
      };
      
      // Send POST request
      const response = await fetch('/api/kundli', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate kundli');
      }
      
      const data = await response.json();
      
      // Show success message
      toast.success('Kundli generated successfully!', {
        description: 'Your personalized kundli is ready to view.',
      });
      
    } catch (error) {
      // Show error message
      toast.error('Failed to generate kundli', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Animated background particles */}
      <ParticlesBackground />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-3">
              Celestial Kundli Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover your cosmic blueprint with our premium kundli generation tool
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="backdrop-blur-sm bg-white/70 p-8 md:p-10 rounded-2xl shadow-xl border border-white/20"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name Field */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="col-span-2"
                  >
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input 
                                placeholder="Enter your full name" 
                                className="pl-10 h-12 border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-xl transition-all duration-200 bg-white/80" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Date of Birth Field */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-gray-700 font-medium">Date of Birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="pl-10 h-12 border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-xl transition-all duration-200 bg-white/80 w-full flex items-center justify-between"
                                >
                                  <div className="flex items-center">
                                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 absolute left-3" />
                                    {field.value ? (
                                      format(field.value, 'PPP')
                                    ) : (
                                      <span className="text-gray-400">Pick a date</span>
                                    )}
                                  </div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="rounded-xl border-purple-100"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Time of Birth Field */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <FormField
                      control={form.control}
                      name="tob"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-gray-700 font-medium">Time of Birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="pl-10 h-12 border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-xl transition-all duration-200 bg-white/80 w-full flex items-center justify-between"
                                >
                                  <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4 text-gray-400 absolute left-3" />
                                    {field.value || "Select time"}
                                  </div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 max-h-[300px] overflow-y-auto" align="start">
                              <div className="grid grid-cols-4 gap-2 p-3">
                                {timeOptions.map((time) => (
                                  <Button
                                    key={time}
                                    variant="ghost"
                                    className={`text-sm ${field.value === time ? 'bg-purple-100 text-purple-700' : 'text-gray-700'}`}
                                    onClick={() => {
                                      field.onChange(time);
                                      document.querySelector('[data-state="open"]')?.dispatchEvent(
                                        new KeyboardEvent('keydown', { key: 'Escape' })
                                      );
                                    }}
                                  >
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Place of Birth Field */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="col-span-2"
                  >
                    <FormField
                      control={form.control}
                      name="pob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Place of Birth</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input 
                                placeholder="City, State, Country" 
                                className="pl-10 h-12 border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-xl transition-all duration-200 bg-white/80" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Gender Field */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    className="col-span-2"
                  >
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Gender</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              onValueChange={field.onChange} 
                              defaultValue={field.value} 
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" className="text-purple-600" />
                                <label htmlFor="male" className="text-gray-700 cursor-pointer">Male</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" className="text-purple-600" />
                                <label htmlFor="female" className="text-gray-700 cursor-pointer">Female</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="other" className="text-purple-600" />
                                <label htmlFor="other" className="text-gray-700 cursor-pointer">Other</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>
                
                {/* Submit Button */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="flex justify-center mt-8"
                >
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl w-full md:w-auto"
                  >
                    <div className="flex items-center justify-center">
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-3"></div>
                      ) : (
                        <Sparkles className="w-5 h-5 mr-3" />
                      )}
                      {isSubmitting ? "Generating Kundli..." : "Generate Kundli"}
                    </div>
                  </Button>
                </motion.div>
              </form>
            </Form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-center mt-8 text-sm text-gray-500"
          >
            <p>Your data is handled securely and with utmost confidentiality.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Animated background particles component
function ParticlesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white/30 backdrop-blur-sm"
          style={{
            width: Math.random() * 30 + 10,
            height: Math.random() * 30 + 10,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * -100 - 50],
            x: [0, Math.random() * 50 - 25],
            opacity: [0, 0.7, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  );
}