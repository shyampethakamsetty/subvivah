'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    profile: {
      photo?: string;
    };
  };
  receiver: {
    id: string;
    firstName: string;
    lastName: string;
    profile: {
      photo?: string;
    };
  };
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch messages when component mounts
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages?userId=current-user-id'); // Replace with actual user ID
      const data = await response.json();
      
      // Ensure that messages is always an array
      if (Array.isArray(data)) {
      setMessages(data);
      } else {
        console.error('Expected array but received:', data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: 'current-user-id', // Replace with actual user ID
          receiverId: selectedUser,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Conversations</h2>
          <div className="space-y-4">
            {Array.isArray(messages) && messages.length > 0 ? (
              messages.map((message) => {
              const otherUser = message.senderId === 'current-user-id' ? message.receiver : message.sender;
              return (
                <div
                  key={message.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    selectedUser === otherUser.id ? 'bg-red-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedUser(otherUser.id)}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                    <Image
                      src={otherUser.profile?.photo || '/images/default-avatar.png'}
                      alt={`${otherUser.firstName} ${otherUser.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                      <h3 className="font-medium text-gray-900">{`${otherUser.firstName} ${otherUser.lastName}`}</h3>
                      <p className="text-sm text-gray-800 truncate">{message.content}</p>
                  </div>
                </div>
              );
              })
            ) : (
              <div className="text-center py-4 text-gray-800">No conversations yet</div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
          {selectedUser ? (
            <>
              <div className="h-[500px] overflow-y-auto mb-4">
                {Array.isArray(messages) && messages
                  .filter(
                    (m) =>
                      (m.senderId === 'current-user-id' && m.receiverId === selectedUser) ||
                      (m.senderId === selectedUser && m.receiverId === 'current-user-id')
                  )
                  .map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'
                      } mb-4`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.senderId === 'current-user-id'
                            ? 'bg-red-100 text-red-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p>{message.content}</p>
                        <span className="text-xs text-gray-700">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[500px] text-gray-800">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 