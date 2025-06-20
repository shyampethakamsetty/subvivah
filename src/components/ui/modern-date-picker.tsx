'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

interface ModernDatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
  helpText?: string;
  variant?: 'default' | 'minimal' | 'glass';
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
  placeholder?: string;
}

export const ModernDatePicker: React.FC<ModernDatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  success,
  helpText,
  variant = 'glass',
  minDate,
  maxDate,
  required,
  placeholder = 'Select date'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  
  const containerRef = useRef<HTMLDivElement>(null);

  const hasValue = value.length > 0;
  const shouldFloat = isFocused || hasValue || isOpen;

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-white/25 border-b-2 border-white/50 rounded-none focus:border-pink-500 shadow-sm';
      case 'default':
        return 'bg-white/30 border border-white/50 rounded-lg focus:border-pink-500 shadow-md';
      case 'glass':
      default:
        return 'bg-white/35 border border-purple-500/60 rounded-xl focus:border-pink-500 shadow-lg shadow-purple-500/10';
    }
  };

  const formatDisplayValue = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  const handleDateSelect = (date: Date) => {
    console.log('Date selected:', date);
    const dateStr = format(date, 'yyyy-MM-dd');
    console.log('Formatted date string:', dateStr);
    setSelectedDate(date);
    onChange(dateStr);
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Container */}
      <div className="relative group">
        <div
          onClick={() => {
            setIsOpen(!isOpen);
            setIsFocused(true);
          }}
          tabIndex={0}
          className={`
            w-full px-4 py-4 pr-12 pl-12 text-white cursor-pointer
            transition-all duration-300 ease-in-out
            focus:ring-2 focus:ring-pink-500/50 focus:outline-none
            ${getVariantStyles()}
            ${error ? 'border-red-400 focus:border-red-400 bg-red-500/10' : ''}
            ${success ? 'border-green-400 focus:border-green-400 bg-green-500/10' : ''}
            hover:shadow-xl hover:shadow-purple-500/20 hover:bg-white/45
            ${isOpen ? 'ring-2 ring-pink-500/50' : ''}
          `}
        >
          <span className="block min-h-[1.5rem]">
            {formatDisplayValue(value) || placeholder}
          </span>
        </div>

        {/* Floating Label */}
        <motion.label
          initial={false}
          animate={{
            top: shouldFloat ? '0.5rem' : '1rem',
            fontSize: shouldFloat ? '0.75rem' : '1rem',
            color: isFocused || isOpen
              ? '#ec4899'  // pink-500
              : error 
                ? '#f87171'  // red-400
                : success 
                  ? '#4ade80'  // green-400
                  : '#d8b4fe'  // purple-300
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="absolute left-12 pointer-events-none font-medium"
          style={{ transformOrigin: 'left center' }}
        >
          {label}
        </motion.label>

        {/* Calendar Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300">
          <Calendar className="w-5 h-5" />
        </div>

        {/* Error Icon */}
        {error && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
        )}

        {/* Focus Ring Animation */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-pink-500 opacity-0 pointer-events-none"
          animate={{ opacity: isFocused || isOpen ? 0.5 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 bg-white/50 border border-purple-500/70 rounded-xl shadow-2xl shadow-black/30 p-4 w-full min-w-[300px]"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <h3 className="text-white font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs text-purple-300 font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map(day => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);
                const isDisabled = isDateDisabled(day);

                return (
                  <motion.button
                    key={day.toISOString()}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Day clicked:', day);
                      if (!isDisabled) {
                        handleDateSelect(day);
                      }
                    }}
                    disabled={isDisabled}
                    whileHover={!isDisabled ? { scale: 1.1 } : {}}
                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    className={`
                      p-2 text-sm rounded-lg transition-all relative
                      ${!isCurrentMonth ? 'text-purple-300/40' : 'text-white'}
                      ${isSelected 
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' 
                        : isTodayDate 
                          ? 'bg-purple-500/30 text-white' 
                          : 'hover:bg-white/10'
                      }
                      ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {format(day, 'd')}
                    {isTodayDate && !isSelected && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleDateSelect(new Date())}
                className="flex-1 px-3 py-2 text-sm bg-purple-600/30 text-purple-200 rounded-lg hover:bg-purple-600/50 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      {helpText && !error && (
        <p className="mt-1 text-sm text-purple-300/80">{helpText}</p>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1 text-sm text-red-400 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}; 