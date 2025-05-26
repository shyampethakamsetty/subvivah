'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import withAuth from '@/components/withAuth';
import UserSearch from '@/components/UserSearch';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    firstName: string;
    lastName: string;
    photos: { url: string }[];
  };
}

interface Conversation {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  photo: string;
}

function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      // Set up polling for new messages
      const interval = setInterval(() => {
        fetchMessages(selectedConversation);
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedConversation,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(selectedConversation);
        fetchConversations(); // Update conversation list with new message
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedConversation(userId);
    // Add the user to conversations if not already present
    if (!conversations.find(c => c.userId === userId)) {
      fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
          const newConversation: Conversation = {
            id: userId,
            userId: userId,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            lastMessage: '',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            photo: data.user.photos[0]?.url || '/default-avatar.png'
          };
          setConversations(prev => [newConversation, ...prev]);
        })
        .catch(error => console.error('Error fetching user:', error));
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const selectedUser = conversations.find(c => c.userId === selectedConversation);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Messages</h1>
          <p className="mt-4 text-xl text-gray-600">
            Connect with your matches
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ height: '700px' }}>
            {/* Conversations List */}
            <div className={`border-r border-gray-200 ${selectedConversation ? 'hidden md:block' : 'block'}`}>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h2>
                <div className="mb-4">
                  <UserSearch onUserSelect={handleUserSelect} />
                </div>
              </div>
              
              <div className="overflow-y-auto" style={{ height: 'calc(700px - 8rem)' }}>
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.userId)}
                      className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 ${
                        selectedConversation === conversation.userId ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div className="relative h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(conversation.firstName, conversation.lastName)}
                        {conversation.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.firstName} {conversation.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(conversation.lastMessageTime).toLocaleTimeString()}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className={`md:col-span-2 flex flex-col ${selectedConversation ? 'block' : 'hidden md:block'}`}>
              {selectedConversation && selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center space-x-4 bg-white">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </button>
                    <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(selectedUser.firstName, selectedUser.lastName)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                  </div>

                  <div className="overflow-y-auto p-4 space-y-4 flex-1" style={{ height: 'calc(700px - 8rem)', paddingTop: '1rem' }}>
                    {messages.map((message) => {
                      const isCurrentUser = message.senderId === 'current';
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="flex flex-col max-w-[70%]">
                            {!isCurrentUser && (
                              <span className="text-xs text-gray-500 mb-1 whitespace-nowrap">
                                {message.sender.firstName} {message.sender.lastName}
                              </span>
                            )}
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                isCurrentUser
                                  ? 'bg-purple-600 text-white rounded-br-none'
                                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
                              }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={sendMessage} className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="submit"
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(MessagesPage);