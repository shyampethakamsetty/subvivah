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
      // Capture and run face-api gender detection
      if (canvas && ctx) {
        // Crop face region using landmarks
        const box = getFaceBoundingBox(landmarks, canvas.width, canvas.height);
        const faceImage = ctx.getImageData(box.x, box.y, box.w, box.h);
        // Create an offscreen canvas for the face
        const faceCanvas = document.createElement('canvas');
        faceCanvas.width = box.w;
        faceCanvas.height = box.h;
        faceCanvas.getContext('2d')?.putImageData(faceImage, 0, 0);
        console.log('[DEBUG] Cropped face bounding box:', box);
        // Pass the cropped faceCanvas to faceapi
        faceapi.detectSingleFace(faceCanvas, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender().then((result: faceapi.WithAge<faceapi.WithGender<{ detection: faceapi.FaceDetection }>> | undefined) => {
          console.log('[DEBUG] Gender detection result:', result);
          if (result && result.gender) {
            setGenderResult({
              gender: result.gender,
              confidence: result.genderProbability,
            });
            setPrompt('Verification complete!');
            setStarted(false); // Freeze UI and stop camera
            cameraRef.current?.stop();
          } else {
            setError('Server error occurred. Please try again.');
            setPrompt('Server error occurred. Please try again.');
            setStarted(false);
            cameraRef.current?.stop();
            console.log('[DEBUG] Server error: No face detected', result);
          }
          setLoading(false);
          return undefined;
        }).catch((e: any) => {
          setError('Server error occurred. Please try again.');
          setPrompt('Server error occurred. Please try again.');
          setStarted(false);
          cameraRef.current?.stop();
          setLoading(false);
          console.error('[DEBUG] Server error:', e);
          return undefined;
        });
      }
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
    <div className="flex flex-col items-center justify-center min-h-[100vh] bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 p-4 sm:p-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Face Verification
          </h1>
          <p className="text-sm text-purple-200">
            Please follow the instructions to complete your verification
          </p>
        </div>

        <div className="relative w-full aspect-[4/3] max-w-[320px] sm:max-w-[480px] mx-auto mb-4 sm:mb-6">
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-lg"
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="text-center">
            <p className="text-base sm:text-lg font-semibold text-white mb-2">
              {prompt}
            </p>
            {error && (
              <p className="text-red-400 text-sm mb-2">
                {error}
              </p>
            )}
            {genderResult && (
              <div className="text-purple-200 text-sm">
                <p>Gender: {genderResult.gender}</p>
                <p>Confidence: {(genderResult.confidence * 100).toFixed(1)}%</p>
              </div>
            )}
          </div>

          <div className="mt-3 sm:mt-4">
            <div className="flex justify-between items-center mb-1 sm:mb-2">
              <span className="text-sm text-purple-200">Lighting</span>
              <span className="text-sm text-purple-200">{lighting}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${lighting}%` }}
              />
            </div>
          </div>

          <div className="mt-3 sm:mt-4">
            <div className="flex justify-between items-center mb-1 sm:mb-2">
              <span className="text-sm text-purple-200">Head Position</span>
              <span className="text-sm text-purple-200">{yaw.toFixed(1)}°</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: '100%',
                  transform: `translateX(${((yaw + 45) / 90) * 100}%)`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {!started ? (
            <motion.button
              onClick={startVerification}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-500 hover:to-purple-500 transition-colors text-sm touch-manipulation"
            >
              Start Verification
            </motion.button>
          ) : (
            <motion.button
              onClick={stopVerification}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 text-purple-200 rounded-lg font-semibold hover:bg-white/20 transition-colors text-sm touch-manipulation"
            >
              Stop Verification
            </motion.button>
          )}
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <span className="text-sm text-purple-200">Progress</span>
            <span className="text-sm text-purple-200">{step + 1}/3</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceVerification; 