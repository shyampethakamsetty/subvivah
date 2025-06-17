'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateOfBirthInputProps {
  value: any;
  onNext: (value: { dateOfBirth: string }) => void;
  onBack: () => void;
}

const DateOfBirthInput: React.FC<DateOfBirthInputProps> = ({ value, onNext, onBack }) => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value.dateOfBirth ? new Date(value.dateOfBirth) : null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    value.dateOfBirth ? new Date(value.dateOfBirth).getFullYear() : new Date().getFullYear()
  );

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 18;

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  const months = [
    { hi: 'जनवरी', en: 'January' },
    { hi: 'फरवरी', en: 'February' },
    { hi: 'मार्च', en: 'March' },
    { hi: 'अप्रैल', en: 'April' },
    { hi: 'मई', en: 'May' },
    { hi: 'जून', en: 'June' },
    { hi: 'जुलाई', en: 'July' },
    { hi: 'अगस्त', en: 'August' },
    { hi: 'सितंबर', en: 'September' },
    { hi: 'अक्टूबर', en: 'October' },
    { hi: 'नवंबर', en: 'November' },
    { hi: 'दिसंबर', en: 'December' }
  ];

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleMonthChange = (increment: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      onNext({ dateOfBirth: selectedDate.toISOString() });
    }
  };

  const getAge = (date: Date) => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => handleMonthChange(-1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white/70" />
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowYearPicker(!showYearPicker)}
              className="px-3 py-1 rounded-lg hover:bg-white/10 transition-colors text-white/90"
            >
              {months[currentMonth.getMonth()][language]}
            </button>
            <button
              type="button"
              onClick={() => setShowYearPicker(!showYearPicker)}
              className="px-3 py-1 rounded-lg hover:bg-white/10 transition-colors text-white/90"
            >
              {currentMonth.getFullYear()}
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleMonthChange(1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <AnimatePresence>
          {showYearPicker ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 bg-indigo-900/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-white/10"
            >
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      year === selectedYear
                        ? 'bg-pink-500 text-white'
                        : 'hover:bg-white/10 text-white/70'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-7 gap-1"
            >
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm text-white/50 py-2"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                const isToday = new Date().toDateString() === date.toDateString();
                const isFuture = date > new Date();
                const isTooOld = getAge(date) > 100;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => !isFuture && !isTooOld && handleDateSelect(day)}
                    disabled={isFuture || isTooOld}
                    className={`relative p-2 rounded-lg text-sm transition-all ${
                      isSelected
                        ? 'bg-pink-500 text-white'
                        : isToday
                        ? 'bg-white/10 text-white'
                        : isFuture || isTooOld
                        ? 'text-white/30 cursor-not-allowed'
                        : 'hover:bg-white/10 text-white/70'
                    }`}
                  >
                    {day}
                    {isToday && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white/70"
        >
          {language === 'hi' 
            ? `आपकी उम्र: ${getAge(selectedDate)} वर्ष`
            : `Your age: ${getAge(selectedDate)} years`
          }
        </motion.div>
      )}
      
      <div className="flex justify-between">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          {language === 'hi' ? 'वापस' : 'Back'}
        </motion.button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors"
          disabled={!selectedDate}
        >
          {language === 'hi' ? 'अगला' : 'Next'}
        </motion.button>
      </div>
    </form>
  );
};

export default DateOfBirthInput; 