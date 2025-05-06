'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Interest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    profile: {
      photo?: string;
      age?: number;
      location?: string;
      occupation?: string;
    };
  };
  receiver: {
    id: string;
    firstName: string;
    lastName: string;
    profile: {
      photo?: string;
      age?: number;
      location?: string;
      occupation?: string;
    };
  };
}

export default function Matches() {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterests();
  }, [activeTab]);

  const fetchInterests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/interests?userId=current-user-id&type=${activeTab}`); // Replace with actual user ID
      const data = await response.json();
      setInterests(data);
    } catch (error) {
      console.error('Error fetching interests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInterestAction = async (interestId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch('/api/interests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interestId,
          status: action === 'accept' ? 'accepted' : 'rejected',
        }),
      });

      if (response.ok) {
        fetchInterests();
      }
    } catch (error) {
      console.error('Error updating interest:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Matches</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'received'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('received')}
        >
          Received Interests
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'sent'
              ? 'border-b-2 border-red-600 text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('sent')}
        >
          Sent Interests
        </button>
      </div>

      {/* Interests List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interests.map((interest) => {
            const otherUser = activeTab === 'received' ? interest.sender : interest.receiver;
            return (
              <div key={interest.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={otherUser.profile?.photo || '/images/default-avatar.png'}
                    alt={`${otherUser.firstName} ${otherUser.lastName}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{`${otherUser.firstName} ${otherUser.lastName}`}</h3>
                  <div className="text-gray-600 space-y-1 mt-2">
                    <p>{otherUser.profile?.age} years</p>
                    <p>{otherUser.profile?.location}</p>
                    <p>{otherUser.profile?.occupation}</p>
                  </div>
                  {activeTab === 'received' && interest.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleInterestAction(interest.id, 'accept')}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleInterestAction(interest.id, 'reject')}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                  {interest.status !== 'pending' && (
                    <div className="mt-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          interest.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {interest.status.charAt(0).toUpperCase() + interest.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && interests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No {activeTab === 'received' ? 'received' : 'sent'} interests yet.
          </p>
        </div>
      )}
    </div>
  );
} 