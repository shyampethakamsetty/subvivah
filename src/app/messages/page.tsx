'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import withAuth from '@/components/withAuth';
import { useInView } from 'react-intersection-observer';
import { useSession } from 'next-auth/react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface MessageRequest {
  id: string;
  senderId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
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
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageRequests, setMessageRequests] = useState<MessageRequest[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showRequests, setShowRequests] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    fetchConversations();
    fetchMessageRequests();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      markMessagesAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (inView && hasMore && selectedConversation) {
      loadMoreMessages();
    }
  }, [inView]);

  const fetchMessageRequests = async () => {
    try {
      const response = await fetch('/api/message-requests');
      if (response.ok) {
        const data = await response.json();
        setMessageRequests(data);
      }
    } catch (error) {
      console.error('Error fetching message requests:', error);
    }
  };

  const handleMessageRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await fetch('/api/message-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, status }),
      });

      if (response.ok) {
        fetchMessageRequests();
        if (status === 'accepted') {
          fetchConversations();
        }
      }
    } catch (error) {
      console.error('Error handling message request:', error);
    }
  };

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

  const fetchMessages = async (conversationId: string, reset = true) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}?page=${reset ? 1 : page}`);
      if (response.ok) {
        const data = await response.json();
        if (reset) {
          setMessages(data.messages);
          setPage(1);
        } else {
          setMessages(prev => [...prev, ...data.messages]);
        }
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const loadMoreMessages = () => {
    if (selectedConversation && hasMore) {
      setPage(prev => prev + 1);
      fetchMessages(selectedConversation, false);
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      const unreadMessages = messages
        .filter(m => !m.isRead && m.receiverId === session?.user?.id)
        .map(m => m.id);

      if (unreadMessages.length > 0) {
        await fetch('/api/messages/read', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messageIds: unreadMessages }),
        });
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
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
        fetchConversations();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {showRequests ? 'Message Requests' : 'Conversations'}
                </h2>
                <button
                  onClick={() => setShowRequests(!showRequests)}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  {showRequests ? 'Show Conversations' : 'Show Requests'}
                </button>
              </div>
              <div className="overflow-y-auto h-[calc(600px-4rem)]">
                {showRequests ? (
                  messageRequests.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No message requests
                    </div>
                  ) : (
                    messageRequests.map((request) => (
                      <div key={request.id} className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="relative h-12 w-12">
                            <Image
                              src={request.sender.photos[0]?.url || '/default-avatar.png'}
                              alt={`${request.sender.firstName}'s profile`}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {request.sender.firstName} {request.sender.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{request.message}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleMessageRequest(request.id, 'accepted')}
                            className="flex-1 bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleMessageRequest(request.id, 'rejected')}
                            className="flex-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  conversations.length === 0 ? (
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
                  )
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="md:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div ref={loadMoreRef} className="h-4" />
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex mb-4 ${
                          message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.senderId === session?.user?.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p>{message.content}</p>
                          <div className="flex items-center justify-end space-x-1 mt-1 text-xs opacity-75">
                            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                            {message.senderId === session?.user?.id && (
                              <span>{message.isRead ? '✓✓' : '✓'}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                      <button
                        type="submit"
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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