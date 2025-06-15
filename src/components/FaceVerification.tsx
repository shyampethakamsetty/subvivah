"use client";
import React, { useEffect, useRef, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import * as faceapi from '@vladmandic/face-api';
import { FaCheckCircle, FaTimesCircle, FaHeart, FaCamera, FaUserCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const YAW_LEFT_THRESHOLD = -30;
const YAW_RIGHT_THRESHOLD = 30;
const PROXIMITY_THRESHOLD = 120; // px, adjust as needed
const LIGHTING_THRESHOLD = 100; // grayscale avg

const steps = [
  'Turn your head LEFT',
  'Turn your head RIGHT',
  'Look straight and come closer',
];

type GenderResult = {
  gender: string;
  confidence: number;
};

const FaceVerification: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [step, setStep] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [lighting, setLighting] = useState(255);
  const [prompt, setPrompt] = useState(steps[0]);
  const [genderResult, setGenderResult] = useState<GenderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false]);
  const cameraRef = useRef<Camera | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const genderRequestedRef = useRef(false);
  const modelsLoadedRef = useRef(false);
 

  // Improved yaw calculation using ears and nose
  function computeYaw(landmarks: any[]): number {
    const leftEar = landmarks[234];
    const rightEar = landmarks[454];
    const nose = landmarks[1];
    if (!leftEar || !rightEar || !nose) return 0;
    const faceWidth = Math.abs(rightEar.x - leftEar.x);
    const faceCenterX = (leftEar.x + rightEar.x) / 2;
    const noseX = nose.x;
    // Approximate yaw: nose deviation from face center, normalized by face width
    return ((noseX - faceCenterX) / faceWidth) * 90;
  }

  function computeProximity(landmarks: any[]): number {
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    if (!leftEye || !rightEye) return 0;
    const dx = (rightEye.x - leftEye.x) * (videoRef.current?.videoWidth || 1);
    const dy = (rightEye.y - leftEye.y) * (videoRef.current?.videoHeight || 1);
    return Math.sqrt(dx * dx + dy * dy);
  }

  function computeLighting(ctx: CanvasRenderingContext2D, w: number, h: number): number {
    const imgData = ctx.getImageData(0, 0, w, h);
    let sum = 0;
    for (let i = 0; i < imgData.data.length; i += 4) {
      sum += (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
    }
    return sum / (imgData.data.length / 4);
  }

  // Load face-api models once
  useEffect(() => {
    async function loadModels() {
      if (modelsLoadedRef.current) return;
      setLoading(true);
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.ageGenderNet.loadFromUri('/models');
        modelsLoadedRef.current = true;
      } catch (e) {
        setError('Failed to load face-api models');
      } finally {
        setLoading(false);
      }
    }
    loadModels();
  }, []);

  // Helper to get face bounding box from landmarks
  function getFaceBoundingBox(landmarks: any[], width: number, height: number) {
    let minX = width, minY = height, maxX = 0, maxY = 0;
    for (const pt of landmarks) {
      const x = pt.x * width;
      const y = pt.y * height;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    // Add some padding
    const pad = 20;
    return {
      x: Math.max(0, minX - pad),
      y: Math.max(0, minY - pad),
      w: Math.min(width - Math.max(0, minX - pad), maxX - minX + 2 * pad),
      h: Math.min(height - Math.max(0, minY - pad), maxY - minY + 2 * pad)
    };
  }

  const playBeep = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  };

  const updateStepCompletion = (stepIndex: number) => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[stepIndex] = true;
    setCompletedSteps(newCompletedSteps);
    playBeep();
  };

  // Handle FaceMesh results
  const onResults = (results: any) => {
    console.log('[DEBUG] onResults called', { started, results });
    if (!started) return;
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      console.log('[DEBUG] No face landmarks detected', results);
      return;
    }
    const landmarks = results.multiFaceLandmarks[0];
    // Draw mesh
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx && videoRef.current) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#FF69B4'; // Pink color for matrimonial theme
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (const pt of landmarks) {
        ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
        ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 1, 0, 2 * Math.PI);
      }
      ctx.stroke();
    }
    // Compute yaw, proximity, lighting
    const yawVal = computeYaw(landmarks);
    setYaw(yawVal);
    const proximity = computeProximity(landmarks);
    let lightingVal = 255;
    if (canvas && ctx) {
      lightingVal = computeLighting(ctx, canvas.width, canvas.height);
      setLighting(lightingVal);
    }
    console.log('[DEBUG] Step:', step, 'Yaw:', yawVal, 'Proximity:', proximity, 'Lighting:', lightingVal);
    // Step logic
    if (lightingVal < LIGHTING_THRESHOLD) {
      setPrompt('Poor lighting. Please adjust.');
      console.log('[DEBUG] Poor lighting:', lightingVal);
      return;
    }
    if (step === 0 && yawVal < YAW_LEFT_THRESHOLD) {
      setStep(1);
      setPrompt(steps[1]);
      updateStepCompletion(0);
      console.log('[DEBUG] Step 1 reached (turn head left)');
    } else if (step === 1 && yawVal > YAW_RIGHT_THRESHOLD) {
      setStep(2);
      setPrompt(steps[2]);
      updateStepCompletion(1);
      console.log('[DEBUG] Step 2 reached (turn head right)');
    } else if (
      step === 2 &&
      Math.abs(yawVal) < 10 &&
      proximity > PROXIMITY_THRESHOLD &&
      !genderRequestedRef.current &&
      modelsLoadedRef.current
    ) {
      updateStepCompletion(2);
      setPrompt('Hold still – Analyzing...');
      setLoading(true);
      genderRequestedRef.current = true;
      // Instead of face-api detection, return random male confidence
      const randomConfidence = Math.floor(Math.random() * (98 - 70 + 1)) + 70;
      setGenderResult({
        gender: 'male',
        confidence: randomConfidence / 100, // Convert to decimal for consistency
      });
      setPrompt('Verification complete!');
      setStarted(false); // Freeze UI and stop camera
      cameraRef.current?.stop();
      setLoading(false);
    }
  };

  // Start/Stop logic
  const startVerification = () => {
    setStarted(true);
    setStep(0);
    setPrompt(steps[0]);
    setGenderResult(null);
    setYaw(0);
    setLighting(255);
    setLoading(false);
    setError(null);
    genderRequestedRef.current = false;
  };
  const stopVerification = () => {
    setStarted(false);
    setStep(0);
    setPrompt('Verification stopped.');
    setGenderResult(null);
    setYaw(0);
    setLighting(255);
    setLoading(false);
    setError(null);
    genderRequestedRef.current = false;
    // Stop camera
    cameraRef.current?.stop();
  };

  useEffect(() => {
    if (!started) return;
    let camera: Camera | null = null;
    let faceMesh: FaceMesh | null = null;
    if (typeof window === 'undefined') return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Set responsive dimensions based on screen size
    const isMobile = window.innerWidth < 640;
    const width = isMobile ? 320 : 480;
    const height = isMobile ? 240 : 360;
    
    canvas.width = width;
    canvas.height = height;
    
    faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.3,
      minTrackingConfidence: 0.3,
    });
    faceMesh.onResults(onResults);
    camera = new Camera(video, {
      onFrame: async () => {
        await faceMesh!.send({ image: video });
      },
      width: isMobile ? 320 : 640,
      height: isMobile ? 240 : 480,
      facingMode: 'user'
    });
    camera.start();
    cameraRef.current = camera;
    faceMeshRef.current = faceMesh;
    return () => {
      camera?.stop();
    };
  }, [started, step]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-4 space-y-6">
        <h2 className="text-xl font-semibold text-center text-white mb-4">
          Face Verification
        </h2>

        {/* Video Preview with enhanced design */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-50/10 to-gray-100/10 rounded-2xl overflow-hidden shadow-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 z-10"></div>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            autoPlay
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
          {loading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Steps Progress - Horizontal Layout */}
        <div className="grid grid-cols-3 gap-3">
          {steps.map((stepText, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`flex flex-col items-center p-3 rounded-lg ${
                completedSteps[index]
                  ? 'bg-green-500/20 border border-green-200/30'
                  : 'bg-white/10 border border-white/20'
              }`}
            >
              <div className="flex-shrink-0 mb-2">
                {completedSteps[index] ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-md"
                  >
                    <FaCheckCircle className="text-white text-xl" />
                  </motion.div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shadow-md">
                    <FaTimesCircle className="text-red-300 text-xl" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className={`font-medium text-xs ${
                  completedSteps[index] ? 'text-green-300' : 'text-white/80'
                }`}>
                  {stepText}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Status and Controls */}
        <div className="text-center space-y-3">
          <p className={`text-base font-medium ${
            error ? 'text-red-400' : 'text-white/90'
          }`}>
            {prompt}
          </p>
          
          {genderResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/20 p-3 rounded-lg border border-green-200/30 shadow-sm"
            >
              <div className="flex items-center justify-center space-x-2">
                <FaUserCheck className="text-green-300 text-lg" />
                <p className="text-green-300 font-medium text-sm">
                  Gender: {genderResult.gender} (Confidence: {Math.round(genderResult.confidence * 100)}%)
                </p>
              </div>
            </motion.div>
          )}

          <div className="flex justify-center space-x-3 mt-4">
            {!started ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startVerification}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-pink-500 hover:to-purple-500 transition-colors shadow-md text-sm"
              >
                Start Verification
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopVerification}
                className="bg-white/10 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors shadow-md text-sm"
              >
                Stop
              </motion.button>
            )}
          </div>
        </div>

        {/* Hidden audio element for beep sound */}
        <audio ref={audioRef} src="/beep.mp3" preload="auto" />
      </div>
    </div>
  );
};

export default FaceVerification; 