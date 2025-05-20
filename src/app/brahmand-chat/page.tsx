'use client';

import React, { useEffect } from 'react';
import AiInterview from '@/components/AiInterview';
import withAuth from '@/components/withAuth';

const BrahamandChatPage = () => {
  // Add useEffect for webchat
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/rasa-webchat@1.0.1/lib/index.js";
    script.async = true;
    script.onload = () => {
      // Add a small delay to ensure WebChat is fully loaded
      setTimeout(() => {
        if (window.WebChat && typeof window.WebChat.default === 'object') {
          try {
            window.WebChat.default.init({
              selector: "#webchat",
              initPayload: "/get_started",
              customData: { "language": "en" },
              socketUrl: "http://localhost:5005",
              socketPath: "/socket.io/",
              title: "Brahamand AI Chat",
              subtitle: "Your AI Interview Assistant"
            });
          } catch (error) {
            console.error('Error initializing WebChat:', error);
          }
        } else {
          console.error('WebChat not properly loaded');
        }
      }, 1000);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Add useEffect for websocket
  useEffect(() => {
    const socket = new WebSocket(`wss://webliveroom1509143644-api-bak.coolzcloud.com/ws?appId=1509143644`);

    socket.addEventListener('open', (event) => {
      console.log('Connected to WebSocket server');
      socket.send(JSON.stringify({ type: 'greeting', message: 'Hello, server!' }));
    });

    socket.addEventListener('message', (event) => {
      console.log('Message from server:', event.data);
      const data = JSON.parse(event.data);
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });

    socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center text-purple-600 mb-6">ब्रह्मांड AI</h1>
      <AiInterview />
      <div id="webchat"></div>
    </div>
  );
};

export default withAuth(BrahamandChatPage); 