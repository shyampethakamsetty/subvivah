'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  images: string[];
  videos: string[];
  cuisine: string;
  rating: number;
  priceRange: string;
  location: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 w-full">
        <Image
          src={restaurant.images[0]}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
          {restaurant.priceRange}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-medium text-gray-600">{restaurant.rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">{restaurant.cuisine}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{restaurant.description}</p>
      </div>
    </motion.div>
  );
};

interface RestaurantModalProps {
  restaurant: Restaurant;
  onClose: () => void;
}

const RestaurantModal = ({ restaurant, onClose }: RestaurantModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideos, setShowVideos] = useState(false);
  const imageCount = restaurant.images.length;
  const videoCount = restaurant.videos.length;

  const paginate = (newDirection: number) => {
    setCurrentImageIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) return imageCount - 1;
      if (next >= imageCount) return 0;
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 md:h-96 flex items-center justify-center overflow-hidden">
          {/* Media Toggle Buttons */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button
              onClick={() => setShowVideos(false)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !showVideos ? 'bg-white text-gray-900' : 'bg-white/50 text-gray-600'
              }`}
            >
              Photos
            </button>
            {videoCount > 0 && (
              <button
                onClick={() => setShowVideos(true)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  showVideos ? 'bg-white text-gray-900' : 'bg-white/50 text-gray-600'
                }`}
              >
                Videos
              </button>
            )}
          </div>

          {!showVideos ? (
            <>
              {/* Left Button */}
              {imageCount > 1 && (
                <button
                  onClick={() => paginate(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow transition z-10"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Image carousel row */}
              <motion.div
                className="flex w-full h-full"
                animate={{ x: `-${currentImageIndex * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ width: `${imageCount * 100}%` }}
              >
                {restaurant.images.map((img, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 relative">
                    <Image
                      src={img}
                      alt={restaurant.name}
                      fill
                      className="object-cover rounded-2xl"
                    />
                  </div>
                ))}
              </motion.div>

              {/* Right Button */}
              {imageCount > 1 && (
                <button
                  onClick={() => paginate(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow transition z-10"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Dots */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 z-10">
                {restaurant.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Left Button for Videos */}
              {videoCount > 1 && (
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + videoCount) % videoCount)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow transition z-10"
                  aria-label="Previous video"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Video carousel row */}
              <motion.div
                className="flex w-full h-full"
                animate={{ x: `-${currentImageIndex * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ width: `${videoCount * 100}%` }}
              >
                {restaurant.videos.map((video, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 relative flex items-center justify-center aspect-video bg-black rounded-2xl overflow-hidden">
                    <video
                      src={video}
                      controls
                      preload="metadata"
                      className="w-full h-full object-contain bg-black"
                      playsInline
                      controlsList="nodownload"
                      onError={e => {
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerHTML = '<div style=\'color:white;text-align:center;padding:2rem;\'>Video failed to load</div>';
                        }
                      }}
                    >
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </motion.div>

              {/* Right Button for Videos */}
              {videoCount > 1 && (
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % videoCount)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow transition z-10"
                  aria-label="Next video"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Dots for Videos */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 z-10">
                {restaurant.videos.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white z-10"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{restaurant.name}</h2>
              <p className="text-gray-500">{restaurant.cuisine}</p>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-lg font-medium text-gray-600">{restaurant.rating}</span>
            </div>
          </div>
          <p className="text-gray-600 mb-6">{restaurant.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
              <p className="text-gray-900">{restaurant.location}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Price Range</h3>
              <p className="text-gray-900">{restaurant.priceRange}</p>
            </div>
          </div>
          <button
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            onClick={() => {
              // Handle booking logic
              onClose();
            }}
          >
            Book a Table
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function RestaurantDiscovery() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [restaurants] = useState<Restaurant[]>([
    {
        id: '1',
        name: 'Symposium PDR (Private Dining Room)',
        description: 'Private dining experience at City Centre Mall, perfect for intimate gatherings and celebrations.',
        images: [
          '/images/restaurants/symposium-pdr-1.jpg',
          '/images/restaurants/symposium-pdr-2.jpg',
          '/images/restaurants/symposium-pdr-interior.jpg'
        ],
        videos: [
          '/videos/restaurants/symposium-pdr-1.mp4',
          '/videos/restaurants/symposium-pdr-2.mp4'
        ],
        cuisine: 'International',
        rating: 4.5,
        priceRange: '₹₹₹',
        location: '212, 2nd Floor, City Centre Mall, Dwarka Sector-12, New Delhi-110075'
    },
    {
      id: '2',
      name: 'Cafe After Hours',
      description: 'A cozy cafe perfect for intimate conversations, serving specialty coffee and delicious desserts.',
      images: [
        '/images/restaurants/cafe-after-hours-1.jpg',
        '/images/restaurants/cafe-after-hours-2.jpg',
        '/images/restaurants/cafe-after-hours-3.jpg',
        '/images/restaurants/cafe-after-hours-4.jpg',
        '/images/restaurants/cafe-after-hours-5.jpg'
      ],
      videos: [
        '/videos/restaurants/cafe-after-hours-1.mp4',
        '/videos/restaurants/cafe-after-hours-2.mp4'
      ],
      cuisine: 'Cafe',
      rating: 4.3,
      priceRange: '₹₹',
      location: 'City Centre Mall, B-35, Pocket 8, Block B, Sector 12 Dwarka, Dwarka, Delhi, 110075'
    },
    {
      id: '3',
      name: 'Panache',
      description: 'Elegant dining with a modern twist, offering contemporary Indian cuisine in a sophisticated setting.',
      images: [
        '/images/restaurants/panache-1.jpg',
        '/images/restaurants/panache-2.jpg',
        '/images/restaurants/panache-3.jpg',
        '/images/restaurants/panache-4.jpg',
        '/images/restaurants/panache-5.jpg'
      ],
      videos: [
        '/videos/restaurants/panache-1.mp4',
        '/videos/restaurants/panache-2.mp4'
      ],
      cuisine: 'Contemporary Indian',
      rating: 4.7,
      priceRange: '₹₹₹₹',
      location: '17, Pocket A St, Pocket A, Sector 17 Dwarka, Kakrola, New Delhi, Delhi, 110078'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Discover Perfect Dining Spots</h1>
          <p className="mt-4 text-lg text-gray-600">
            Find the ideal restaurant for your special moments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onClick={() => setSelectedRestaurant(restaurant)}
            />
          ))}
        </div>

        <AnimatePresence>
          {selectedRestaurant && (
            <RestaurantModal
              restaurant={selectedRestaurant}
              onClose={() => setSelectedRestaurant(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 