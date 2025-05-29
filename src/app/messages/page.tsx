'use client';

import { useState, useEffect, useRef } from 'react';
import UserSearch from '@/components/UserSearch';
import { format } from 'date-fns/format';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import withAuth from '@/components/withAuth';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  createdAt?: string;
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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  photo: string | null;
}

function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
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

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`);
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
          conversationId: selectedConversation,
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

  const handleUserSelect = (user: User) => {
    const conversation = conversations.find(c => c.id === user.id) || {
      id: user.id,
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photo || '/default-avatar.png',
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0
    };
    setSelectedConversation(conversation.id);
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newContent }),
      });

      if (!response.ok) throw new Error('Failed to edit message');
      
      const updatedMessage = await response.json();
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? updatedMessage : msg
      ));
      setEditingMessage(null);
      setEditContent('');
    } catch (error) {
      console.error('Error editing message:', error);
      alert('Failed to edit message. Please try again.');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete message');
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  const formatMessageTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-4 text-lg text-gray-600">
            Connect with your matches
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
            {/* Conversations List */}
            <div className="border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                <div className="mt-2">
                  <UserSearch onUserSelect={handleUserSelect} />
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(600px-8rem)]">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 ${
                        selectedConversation === conversation.id ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div className="relative h-12 w-12">
                        <Image
                          src={conversation.photo}
                          alt={`${conversation.firstName}'s profile`}
                          fill
                          className="rounded-full object-cover"
                        />
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
            <div className="md:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex flex-col ${message.senderId === selectedConversation ? 'items-start' : 'items-end'} group`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                            message.senderId === selectedConversation
                              ? 'bg-white text-black border border-gray-100'
                              : 'bg-purple-600 text-white'
                          }`}
                        >
                          {editingMessage === message.id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleEditMessage(message.id, editContent);
                              }}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="text"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="flex-1 px-2 py-1 border rounded"
                              />
                              <button
                                type="submit"
                                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMessage(null);
                                  setEditContent('');
                                }}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <>
                              <p>{message.content}</p>
                              <div className="flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    setEditingMessage(message.id);
                                    setEditContent(message.content);
                                  }}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(message.id)}
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {formatMessageTime(message.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendMessage} className="p-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="submit"
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
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