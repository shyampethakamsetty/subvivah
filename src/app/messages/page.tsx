'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import UserSearch from '@/components/UserSearch';
import { format } from 'date-fns';
import { Pencil, Trash2, ArrowLeft, Send } from 'lucide-react';
import withAuth from '@/components/withAuth';
import StaticMessages from '@/components/StaticMessages';
import { useSearchParams } from 'next/navigation';

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

function MessagesContent() {
  const searchParams = useSearchParams();
  const userId = searchParams?.get('userId');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showConversationList, setShowConversationList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        
        if (data.isAuthenticated && data.user) {
          setCurrentUserId(data.user.id);
          fetchConversations();
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

  // Handle userId from URL parameter
  useEffect(() => {
    if (userId) {
      // Fetch user details and start conversation
      fetchUserAndStartConversation(userId);
    }
  }, [userId]);

  const fetchUserAndStartConversation = async (userId: string) => {
    try {
      // First check if conversation already exists
      const existingConversation = conversations.find(c => c.id === userId);
      if (existingConversation) {
        setSelectedConversation(existingConversation);
        fetchMessages(userId);
        return;
      }

      // If not, fetch user details
      const response = await fetch(`/api/profiles/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      const userData = await response.json();

      // Create new conversation
      const newConversation = {
        id: userData.userId,
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
        photo: userData.user.photos?.find((p: any) => p.isProfile)?.url || null,
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0
      };

      setSelectedConversation(newConversation);
      setConversations(prev => [newConversation, ...prev]);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

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

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowConversationList(false); // Hide conversation list on mobile when a chat is selected
  };

  const handleBackToList = () => {
    setShowConversationList(true);
    // Don't clear selected conversation to preserve state
  };

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
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 relative overflow-hidden flex flex-col">
      {/* Decorative floating chat bubble */}
      <div className="absolute top-4 left-8 animate-bounce text-blue-200 text-3xl z-10">💬</div>
      
      <div className="flex-1 flex flex-col h-[calc(100vh-2rem)] max-h-[calc(100vh-2rem)] overflow-hidden">
        <div className="p-4 bg-white/10 backdrop-blur-sm border-b border-white/20 shadow-sm">
          <UserSearch onUserSelect={handleUserSelect} />
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Conversation List - Hidden on mobile when chat is selected */}
          <div className={`${showConversationList ? 'flex' : 'hidden'} md:flex w-full md:w-1/3 border-r border-white/20 bg-white/5 overflow-y-auto shadow-sm flex-col`}>
            <div className="p-4 flex-1">
              <h2 className="text-lg font-semibold mb-4 text-white">Conversations</h2>
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center p-3 cursor-pointer hover:bg-white/10 rounded-lg transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-purple-500/20' : ''
                    }`}
                    onClick={() => handleConversationSelect(conversation)}
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

          {/* Chat Section - Shown on mobile when chat is selected */}
          <div className={`${!showConversationList ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-indigo-950/50 backdrop-blur-sm`}>
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-white/10 flex items-center bg-white/5 shadow-sm">
                  {/* Back button - Only visible on mobile */}
                  <button
                    onClick={handleBackToList}
                    className="md:hidden mr-2 text-white hover:text-purple-300 transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
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
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex flex-col mb-4 ${
                          message.senderId === currentUserId ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] md:max-w-[70%] rounded-lg p-3 ${
                            message.senderId === currentUserId
                              ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white ml-auto'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          {editingMessage?.id === message.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="flex-1 bg-white/10 rounded px-2 py-1 text-white"
                                autoFocus
                              />
                              <button
                                onClick={() => handleEditMessage(message.id, editContent)}
                                className="text-xs text-white/80 hover:text-white"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className="break-words">{message.content}</p>
                              <div className="flex items-center justify-end gap-2 mt-1">
                                <span className="text-xs text-white/60">
                                  {formatMessageTime(message.createdAt)}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5">
                  <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                      className="flex-1 bg-purple-800 text-white placeholder-purple-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                      <Send className="w-5 h-5" />
                      </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/60">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}