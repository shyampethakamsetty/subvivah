'use client';

import React, { useState, useEffect, useRef } from 'react';

const AiInterview = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert('Speech recognition not supported. Use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      console.log('🎤 Listening started');
    };

    recognition.onaudiostart = () => console.log('🔊 Audio capturing started');
    recognition.onspeechstart = () => console.log('🗣️ Speech detected');
    recognition.onspeechend = () => console.log('🔇 Speech ended');

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript;
      console.log('✅ Recognized:', speechResult);
      setTranscript(speechResult);
      addMessage('user', speechResult);
      sendMessageToAI(speechResult);
    };

    recognition.onerror = (event) => {
      console.error('❌ Speech error:', event.error);
      if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('🛑 Recognition ended');
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/rasa-webchat@1.0.1/lib/index.js";
    script.async = true;
    script.onload = () => {
      console.log('Rasa WebChat script loaded');
      if (window.WebChat && window.WebChat.default && typeof window.WebChat.default.init === 'function') {
        console.log('Initializing WebChat');
        window.WebChat.default.init({
          selector: "#webchat",
          initPayload: "/get_started",
          customData: { "language": "en" },
          socketUrl: "http://localhost:5005",
          socketPath: "/socket.io/",
          title: "Brahamand AI Chat",
          subtitle: "Your AI Interview Assistant"
        });
      } else {
        console.error('WebChat is not defined or init is not a function');
      }
    };
    script.onerror = () => {
      console.error('Failed to load Rasa WebChat script');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket('wss://webliveroom1509143644-api.coolzcloud.com/ws?appId=1509143644');

    socket.addEventListener('open', (event) => {
      console.log('Connected to WebSocket server');
      socket.send(JSON.stringify({ type: 'greeting', message: 'Hello, server!' }));
    });

    socket.addEventListener('message', (event) => {
      console.log('Message from server:', event.data);
      const data = JSON.parse(event.data);
      // Handle the data as needed
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

  const addMessage = (sender: string, text: string) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const sendMessageToAI = async (message: string) => {
    addMessage('ai', 'Thinking...');
    try {
      const res = await fetch('/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data?.reply) {
        addMessage('ai', data.reply);
        speakText(data.reply);
      } else {
        addMessage('ai', "Sorry, I didn't understand.");
      }
    } catch (error) {
      console.error('Fetch error:', error);
      addMessage('ai', 'Failed to get response.');
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">ब्रह्मांड AI Interview</h2>

      <div className="mb-4 h-64 overflow-y-auto border border-gray-300 rounded p-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-800 text-center">Click the microphone to begin speaking.</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 p-2 rounded ${
                msg.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
              }`}
            >
              <strong>{msg.sender === 'user' ? 'You:' : 'AI:'}</strong> {msg.text}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={toggleListening}
          className={`px-4 py-2 rounded-full text-white transition duration-300 ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          <i className={`fas fa-microphone${isListening ? '-slash' : ''}`}></i>
        </button>
      </div>
    </div>
  );
};

export default AiInterview;
