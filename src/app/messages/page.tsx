'use client';

import { useState, useEffect, useRef } from 'react';
import UserSearch from '@/components/UserSearch';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import withAuth from '@/components/withAuth';
import StaticMessages from '@/components/StaticMessages';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  firstName: string;
  lastName: string;
  photo: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear input immediately

    // Create a temporary message object with current timestamp
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      createdAt: new Date().toISOString(),
      senderId: 'current-user',
      receiverId: selectedConversation.id,
      isRead: false
    };

    // Immediately update the UI with the new message
    setMessages(prev => [...prev, tempMessage]);

    // Update the conversation list immediately
    const updatedConversation = {
      ...selectedConversation,
      lastMessage: messageContent,
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0
    };
    setConversations(prev => 
      [updatedConversation, ...prev.filter(c => c.id !== selectedConversation.id)]
    );

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedConversation.id,
          content: messageContent,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const sentMessage = await response.json();
      
      // Update the message in place without removing it
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? {
          ...sentMessage,
          // Preserve the original timestamp to maintain order
          createdAt: tempMessage.createdAt
        } : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the temporary message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      // Restore the message in the input field
      setNewMessage(messageContent);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleUserSelect = (user: any) => {
    if (!user || !user.id || !user.firstName || !user.lastName) {
      console.error('Invalid user data:', user);
      return;
    }

    // Check if conversation already exists
    const existingConversation = conversations.find(c => c.id === user.id);
    if (existingConversation) {
      setSelectedConversation(existingConversation);
      return;
    }

    // Create new conversation
    const newConversation = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photo || null,
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0
    };

    setSelectedConversation(newConversation);
    setConversations(prev => [newConversation, ...prev]);
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
        return '';
      }
      return format(date, 'h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        
        if (!data.isAuthenticated) {
          // Show login popup after 4 seconds
          const timer = setTimeout(() => {
            if (typeof window !== 'undefined' && typeof (window as any).showLoginPopup === 'function') {
              (window as any).showLoginPopup();
            }
          }, 4000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 10000);
      return () => clearInterval(interval);
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (selectedConversation && isAuthenticated) {
      fetchMessages(selectedConversation.id);
      const interval = setInterval(() => fetchMessages(selectedConversation.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation, isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md z-0" />
        <div className="relative z-10 flex flex-col items-center">
          <svg className="animate-spin h-14 w-14 text-purple-300 mb-4" viewBox="0 0 50 50">
            <circle className="opacity-20" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" />
            <circle className="opacity-70" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="31.4 94.2" />
          </svg>
          <span className="text-purple-200 text-lg font-medium animate-pulse">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <StaticMessages />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 py-8 relative overflow-hidden">
      {/* Decorative floating chat bubble */}
      <div className="absolute top-4 left-8 animate-bounce text-blue-200 text-3xl z-10">💬</div>
      <div className="flex flex-col h-screen">
        <div className="p-4 bg-white/10 backdrop-blur-sm border-b border-white/20 shadow-sm">
          <UserSearch onUserSelect={handleUserSelect} />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 border-r border-white/20 bg-white/5 overflow-y-auto shadow-sm">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4 text-white">Conversations</h2>
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center p-3 cursor-pointer hover:bg-white/10 rounded-lg transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-purple-500/20' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-3 ring-2 ring-offset-2 ring-purple-400/50 flex-shrink-0">
                      {conversation.photo ? (
                        <img
                          src={conversation.photo}
                          alt={`${conversation.firstName} ${conversation.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-lg">
                          {conversation.firstName[0]}{conversation.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-white truncate">
                          {conversation.firstName} {conversation.lastName}
                        </h3>
                        <span className="text-sm text-gray-300 ml-2 flex-shrink-0">
                          {format(new Date(conversation.lastMessageTime), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="ml-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-indigo-950/50 backdrop-blur-sm">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-white/10 flex items-center bg-white/5 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-3 ring-2 ring-offset-2 ring-purple-400/50 flex-shrink-0">
                    {selectedConversation?.photo ? (
                      <img
                        src={selectedConversation.photo}
                        alt={`${selectedConversation.firstName} ${selectedConversation.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white">
                        {selectedConversation?.firstName?.[0] || ''}{selectedConversation?.lastName?.[0] || ''}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">
                      {selectedConversation?.firstName} {selectedConversation?.lastName}
                    </h3>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex flex-col ${message.senderId === selectedConversation.id ? 'items-start' : 'items-end'} group`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                            message.senderId === selectedConversation.id
                              ? 'bg-white/10 text-white border border-purple-400/20'
                              : 'bg-purple-600/90 text-white'
                          }`}
                        >
                          <p>{message.content}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 px-1">
                          <span className="text-xs text-purple-200">
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5 shadow-sm">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors flex-shrink-0"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-300 bg-white/5">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}