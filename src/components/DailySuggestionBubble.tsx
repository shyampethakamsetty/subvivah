'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

// Static data for demonstration
const sampleSuggestions = [
  {
    id: 1,
    name: "Priya Sharma",
    age: 28,
    location: "Mumbai",
    occupation: "Software Engineer",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    interests: ["Reading", "Travel", "Cooking", "Yoga"],
    compatibilityScore: 85
  },
  {
    id: 2,
    name: "Rahul Patel",
    age: 30,
    location: "Delhi",
    occupation: "Doctor",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    interests: ["Photography", "Music", "Sports", "Meditation"],
    compatibilityScore: 78
  }
];

const defaultSuggestion = {
  id: 0,
  name: "",
  age: 0,
  location: "",
  occupation: "",
  image: "",
  interests: [],
  compatibilityScore: 0
};

const getCompatibilityCaption = (score: number, interests: string[]) => {
  if (score >= 90) {
    return "Perfect match! You share many common interests and values.";
  } else if (score >= 80) {
    return "Great match! You both love " + interests.slice(0, 2).join(" and ") + "!";
  } else if (score >= 70) {
    return "Good match! You have similar interests in " + interests[0] + ".";
  } else {
    return "Potential match! Explore more to discover common interests.";
  }
};

const DailySuggestionBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(sampleSuggestions[0] || defaultSuggestion);

  useEffect(() => {
    // Show popup after 4 seconds every time
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const togglePopup = () => {
    if (isOpen) {
      // Show message when closing
      setShowMessage(true);
      // Hide message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
    setIsOpen(!isOpen);
  };

  // Ensure we have valid data before rendering
  const suggestion = currentSuggestion || defaultSuggestion;
  const interests = suggestion.interests || [];
  const caption = getCompatibilityCaption(suggestion.compatibilityScore, interests);

  return (
    <>
      {/* Floating Bubble */}
      <button
        onClick={togglePopup}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
      >
        <Sparkles className="h-6 w-6" fill="currentColor" />
      </button>

      {/* Message after closing */}
      {showMessage && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 -translate-y-20 z-50 bg-white rounded-lg shadow-lg p-3 animate-fade-in-out">
          <p className="text-sm text-gray-700 whitespace-nowrap flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-500" />
            Discover your perfect match for today! ✨
          </p>
        </div>
      )}

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-white to-pink-50 rounded-2xl shadow-xl p-4 w-[90%] max-w-sm relative">
            {/* Close button */}
            <button
              onClick={togglePopup}
              className="absolute -top-3 -right-3 bg-white rounded-full p-1.5 shadow-lg text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X size={20} />
            </button>

            <div className="space-y-3">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={suggestion.image}
                  alt={suggestion.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                />
              </div>

              {/* Profile Info */}
              <div className="text-center space-y-1">
                <h4 className="text-xl font-semibold text-gray-800">
                  {suggestion.name}, {suggestion.age}
                </h4>
                <p className="text-gray-600 text-sm">{suggestion.occupation}</p>
                <p className="text-gray-500 text-sm">{suggestion.location}</p>
              </div>

              {/* Compatibility Meter */}
              <div className="px-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Compatibility</span>
                  <span className="text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    {suggestion.compatibilityScore}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${suggestion.compatibilityScore}%` }}
                  />
                </div>
              </div>

              {/* Compatibility Caption */}
              <p className="text-center text-sm text-gray-600 px-4">
                {caption}
              </p>

              {/* Interests */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 px-2.5 py-0.5 rounded-full text-xs font-medium border border-pink-100"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <button className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors text-sm font-semibold shadow-md">
                  View Profile
                </button>
                <button className="flex-1 bg-white text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold border border-gray-200">
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DailySuggestionBubble; 