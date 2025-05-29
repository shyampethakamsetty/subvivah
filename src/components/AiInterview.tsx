'use client';

import React, { useState, useEffect, useRef } from 'react';

const AiInterview = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [reminderCount, setReminderCount] = useState(0);
  const [lastQuestion, setLastQuestion] = useState('');
  const [sessionId, setSessionId] = useState('');
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const responseTimeoutRef = useRef<NodeJS.Timeout>();
  const noSpeechTimeoutRef = useRef<NodeJS.Timeout>();

  // Add a ref to always have the latest isInterviewActive value
  const isInterviewActiveRef = useRef(isInterviewActive);
  useEffect(() => {
    isInterviewActiveRef.current = isInterviewActive;
  }, [isInterviewActive]);

  // For beep sound
  const beepAudioRef = useRef<HTMLAudioElement | null>(null);

  // For thinking animation
  const [isThinking, setIsThinking] = useState(false);

  // Only listen when not speaking
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Restore REMINDER_MESSAGES
  const REMINDER_MESSAGES = [
    "I didn't catch that. Could you please speak up?",
    "I'm having trouble hearing you. Could you speak a bit louder?",
    "I still can't hear you clearly. Let's take a short break. Click resume when you're ready to continue."
  ];

  // Add new constants for timing
  const SPEECH_TIMEOUT = 10000; // 10 seconds timeout for speech
  const PAUSE_BETWEEN_QA = 2000; // 2 seconds pause between Q&A
  const MIN_SPEECH_LENGTH = 3; // Minimum words for valid speech

  useEffect(() => {
    // Generate a unique session ID when component mounts
    setSessionId(Math.random().toString(36).substring(7));
  }, []);

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
      setIsListening(true);
    };

    recognition.onaudiostart = () => {
      console.log('🔊 Audio capturing started');
    };

    recognition.onspeechstart = () => {
      console.log('🗣️ Speech detected');
    };

    recognition.onspeechend = () => {
      console.log('🔇 Speech ended');
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[0][0].transcript;
      console.log('✅ Recognized:', speechResult);
      
      // Clear the no-speech timeout since we got a result
      if (noSpeechTimeoutRef.current) {
        clearTimeout(noSpeechTimeoutRef.current);
      }
      
      // Only process if we got actual speech and not while AI is speaking
      if (!isSpeaking && speechResult.trim().length > 0) {
        // Check if the speech is long enough to be valid
        const wordCount = speechResult.trim().split(/\s+/).length;
        if (wordCount >= MIN_SPEECH_LENGTH) {
          setTranscript(speechResult);
          addMessage('user', speechResult);
          setReminderCount(0); // Reset reminder count on successful speech
          sendMessageToAI(speechResult);
        } else {
          handleNoSpeech();
        }
      } else {
        handleNoSpeech();
      }
    };

    recognition.onerror = (event) => {
      console.error('❌ Speech error:', event.error);
      
      // Clear the no-speech timeout on error
      if (noSpeechTimeoutRef.current) {
        clearTimeout(noSpeechTimeoutRef.current);
      }
      
      if (event.error === 'no-speech' && isInterviewActive && !isPaused) {
        handleNoSpeech();
      } else if (event.error === 'audio-capture') {
        addMessage('ai', "I'm having trouble accessing your microphone. Please check your microphone settings.");
        speakText("I'm having trouble accessing your microphone. Please check your microphone settings.");
      } else if (event.error === 'network') {
        addMessage('ai', "Network error occurred. Please check your internet connection.");
        speakText("Network error occurred. Please check your internet connection.");
      }
      
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('🛑 Recognition ended');
      setIsListening(false);
      // Do NOT restart listening here
    };

    recognitionRef.current = recognition;
  }, [isInterviewActive, isPaused, isSpeaking]);

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

  const handleNoSpeech = () => {
    if (reminderCount < REMINDER_MESSAGES.length) {
      const reminderMessage = REMINDER_MESSAGES[reminderCount];
      addMessage('ai', reminderMessage);
      speakText(reminderMessage);
      setReminderCount(prev => prev + 1);
      
      // Add longer pause before retrying
      const pauseTime = reminderCount === 0 ? 3000 : 5000;
      setTimeout(() => {
        if (isInterviewActiveRef.current && !isPaused) {
          startListening();
        }
      }, pauseTime);
    } else {
      pauseInterview();
    }
  };

  const startInterview = () => {
    setIsInterviewActive(true);
    setIsPaused(false);
    setReminderCount(0);
    // Send empty message to get the first question
    sendMessageToAI('');
  };

  const pauseInterview = () => {
    setIsPaused(true);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    // Clear any pending timeouts
    if (noSpeechTimeoutRef.current) {
      clearTimeout(noSpeechTimeoutRef.current);
    }
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
    }
    addMessage('ai', "Interview paused. Click 'Resume Interview' when you're ready to continue.");
  };

  const resumeInterview = () => {
    if (lastQuestion) {
      setIsPaused(false);
      setReminderCount(0);
      const resumeMessage = `Let's continue. ${lastQuestion}`;
      addMessage('ai', resumeMessage);
      speakText(resumeMessage);
      setTimeout(startListening, 2000);
    }
  };

  const addMessage = (sender: string, text: string) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const playBeepAndVibrate = () => {
    if (beepAudioRef.current) {
      beepAudioRef.current.currentTime = 0;
      beepAudioRef.current.play();
    }
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isPaused && !isSpeaking) {
      console.log('Starting to listen...');
      playBeepAndVibrate();
      try {
        recognitionRef.current.start();
        
        // Add timeout for no speech
        noSpeechTimeoutRef.current = setTimeout(() => {
          if (isListening) {
            handleNoSpeech();
          }
        }, SPEECH_TIMEOUT);
        
      } catch (error) {
        console.error('Error starting recognition:', error);
        // Add exponential backoff for retry
        const retryDelay = Math.min(1000 * Math.pow(2, reminderCount), 8000);
        setTimeout(() => {
          if (isInterviewActive && !isPaused && !isSpeaking) {
            startListening();
          }
        }, retryDelay);
      }
    }
  };

  // Stop listening manually
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Repeat question
  const repeatQuestion = () => {
    if (lastQuestion) {
      speakText(lastQuestion);
    }
  };

  // Skip question (if allowed)
  const skipQuestion = () => {
    // Send a special skip message to the backend
    sendMessageToAI('[SKIP]');
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Add natural pauses between sentences
    utterance.rate = 0.9; // Slightly slower speech
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      // Add natural pause before starting to listen
      setTimeout(() => {
        if (isInterviewActive && !isPaused && !isListening) {
          startListening();
        }
      }, PAUSE_BETWEEN_QA);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const sendMessageToAI = async (message: string) => {
    setIsThinking(true);
    try {
      const res = await fetch('/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId }),
      });
      const data = await res.json();
      setIsThinking(false);
      
      if (data?.reply) {
        addMessage('ai', data.reply);
        setLastQuestion(data.reply);
        // If the backend says this is a clarification, don't reset reminderCount
        if (data.questionType === 'clarification') {
          setReminderCount((prev) => Math.min(prev + 1, REMINDER_MESSAGES.length - 1));
        } else {
          setReminderCount(0);
        }
        // Speak the response
        const utterance = new SpeechSynthesisUtterance(data.reply);
        utterance.lang = 'en-US';
        utterance.onend = () => {
          console.log('[utterance.onend] Speech synthesis ended');
          waitForSpeechSynthesisToFinish(() => {
            console.log('[waitForSpeechSynthesisToFinish callback] About to check interview state and call startListening');
            setTimeout(() => {
              if (isInterviewActiveRef.current && !isPaused) {
                console.log('Starting to listen...');
                startListening();
              } else {
                console.log('Not starting to listen: isInterviewActive:', isInterviewActiveRef.current, 'isPaused:', isPaused);
              }
            }, 200);
          });
        };
        window.speechSynthesis.speak(utterance);
      } else {
        addMessage('ai', "Sorry, I didn't understand.");
        const utterance = new SpeechSynthesisUtterance("Sorry, I didn't understand.");
        utterance.lang = 'en-US';
        utterance.onend = () => {
          setTimeout(() => {
            if (isInterviewActiveRef.current && !isPaused) {
              console.log('Starting to listen...');
              startListening();
            } else {
              console.log('Not starting to listen: isInterviewActive:', isInterviewActiveRef.current, 'isPaused:', isPaused);
            }
          }, 1000);
        };
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      addMessage('ai', 'Failed to get response.');
      const utterance = new SpeechSynthesisUtterance('Failed to get response.');
      utterance.lang = 'en-US';
      utterance.onend = () => {
        setTimeout(() => {
          if (isInterviewActiveRef.current && !isPaused) {
            console.log('Starting to listen...');
            startListening();
          } else {
            console.log('Not starting to listen: isInterviewActive:', isInterviewActiveRef.current, 'isPaused:', isPaused);
          }
        }, 1000);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  function waitForSpeechSynthesisToFinish(callback: () => void) {
    if (!window.speechSynthesis.speaking) {
      console.log('[waitForSpeechSynthesisToFinish] Speech synthesis is done, calling callback');
      callback();
    } else {
      console.log('[waitForSpeechSynthesisToFinish] Still speaking, waiting...');
      setTimeout(() => waitForSpeechSynthesisToFinish(callback), 100);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <audio ref={beepAudioRef} src="/beep.mp3" preload="auto" />
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">ब्रह्मांड AI Interview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Robot Interface */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 mb-4 relative">
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-300 flex items-center justify-center">
                      {/* Animated mic icon */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isPaused ? 'bg-yellow-500' :
                        isListening ? 'bg-red-500 animate-pulse' :
                        'bg-blue-400'
                      }`}>
                        {isListening ? (
                          <svg className="w-5 h-5 text-white animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v2m0 0h3m-3 0H9m6-6a3 3 0 11-6 0V7a3 3 0 016 0v5z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v2m0 0h3m-3 0H9m6-6a3 3 0 11-6 0V7a3 3 0 016 0v5z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {isListening && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="animate-ping w-16 h-16 rounded-full bg-red-400 opacity-75"></div>
                    <button
                      onClick={stopListening}
                      className="mt-2 px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm"
                      aria-label="Stop Listening"
                    >
                      Stop Listening
                    </button>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={repeatQuestion}
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm"
                  aria-label="Repeat Question"
                >
                  Repeat Question
                </button>
                <button
                  onClick={skipQuestion}
                  className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                  aria-label="Skip Question"
                >
                  Skip
                </button>
              </div>
              <div className="flex space-x-2 mb-2">
                <span className="text-xs text-gray-500">Reminders left: {REMINDER_MESSAGES.length - reminderCount}</span>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">AI Interviewer</h3>
                <p className="text-gray-500">
                  {isPaused ? 'Interview Paused' :
                   isInterviewActive 
                    ? (isListening ? 'Listening...' : 'Processing...')
                    : 'Ready to begin your interview'}
                </p>
              </div>

              <div className="flex space-x-4">
                {!isInterviewActive ? (
                  <button
                    onClick={startInterview}
                    className="px-6 py-3 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition duration-300 flex items-center space-x-2"
                  >
                    <i className="fas fa-play"></i>
                    <span>Start AI Interview</span>
                  </button>
                ) : (
                  <>
                    {isPaused ? (
                      <button
                        onClick={resumeInterview}
                        className="px-6 py-3 rounded-full text-white bg-green-500 hover:bg-green-600 transition duration-300 flex items-center space-x-2"
                      >
                        <i className="fas fa-play"></i>
                        <span>Resume Interview</span>
                      </button>
                    ) : (
                      <button
                        onClick={pauseInterview}
                        className="px-6 py-3 rounded-full text-white bg-yellow-500 hover:bg-yellow-600 transition duration-300 flex items-center space-x-2"
                      >
                        <i className="fas fa-pause"></i>
                        <span>Pause Interview</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Q&A Subtitles */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Interview Transcript</h3>
            <div className="h-[400px] overflow-y-auto space-y-4" aria-live="polite">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Click "Start AI Interview" to begin.</p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg fade-in-message ${
                      msg.sender === 'user'
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'bg-gray-50 border-l-4 border-gray-500'
                    }`}
                    tabIndex={-1}
                  >
                    <div className="font-semibold text-sm text-gray-600 mb-1">
                      {msg.sender === 'user' ? 'You' : 'AI Interviewer'}
                    </div>
                    <div className="text-gray-800">{msg.text}</div>
                  </div>
                ))
              )}
              {isThinking && (
                <div className="flex items-center space-x-2 mt-2">
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"></span>
                  <span className="text-blue-500 font-medium">Thinking...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .fade-in-message {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AiInterview;
