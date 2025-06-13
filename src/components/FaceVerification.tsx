"use client";
import React, { useEffect, useRef, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import * as faceapi from '@vladmandic/face-api';
import { FaCheckCircle, FaTimesCircle, FaHeart, FaCamera, FaUserCheck } from 'react-icons/fa';

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
      setPrompt('Hold still – Analyzing Gender…');
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
            setError('Gender detection failed. No face detected.');
            setPrompt('Gender detection failed. Please try again.');
            setStarted(false);
            cameraRef.current?.stop();
            console.log('[DEBUG] Gender detection failed: No face detected', result);
          }
          setLoading(false);
          return undefined;
        }).catch((e: any) => {
          setError('Gender detection failed.');
          setPrompt('Gender detection failed. Please try again.');
          setStarted(false);
          cameraRef.current?.stop();
          setLoading(false);
          console.error('[DEBUG] Gender detection error:', e);
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
    canvas.width = 480;
    canvas.height = 360;
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
      width: 640,
      height: 480,
      facingMode: 'user'
    });
    camera.start();
    cameraRef.current = camera;
    faceMeshRef.current = faceMesh;
    return () => {
      camera?.stop();
    };
    // eslint-disable-next-line
  }, [started, step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex flex-col items-center justify-center py-8 px-2">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-blue-200 mb-2 flex items-center gap-3 tracking-tight drop-shadow-lg">
          <FaHeart className="text-indigo-400 animate-pulse" />
          <span className="bg-gradient-to-r from-blue-300 via-indigo-400 to-blue-300 bg-clip-text text-transparent">3-Step Face Verification</span>
        </h1>
        <p className="text-xl text-blue-100 mb-8 text-center max-w-xl font-medium italic drop-shadow-sm">
          For your safety and trust, please complete the steps below to verify your profile.
        </p>
        <div className="bg-gradient-to-br from-gray-800 via-blue-950 to-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full flex flex-col items-center border border-blue-900">
          <div className="relative flex flex-col items-center justify-center">
            <video 
              ref={videoRef} 
              style={{ 
                position: 'absolute',
                width: '1px',
                height: '1px',
                opacity: 0,
                pointerEvents: 'none'
              }} 
              playsInline
              autoPlay
            />
            <canvas ref={canvasRef} width={480} height={360} className="border-2 border-indigo-700 rounded-xl shadow-md mx-auto bg-gray-900" />
            <div className="absolute top-4 left-4 bg-gray-900/80 px-4 py-2 rounded-lg shadow-sm border border-blue-900">
              <div className="text-sm text-blue-200">Yaw: {yaw.toFixed(1)}°</div>
              <div className="text-sm text-blue-200">Lighting: {lighting.toFixed(0)}</div>
        </div>
      </div>

          <div className="mt-8 space-y-6 w-full">
            <div className="flex justify-center space-x-6">
              {steps.map((_, index) => (
                <div key={index} className="flex items-center">
                  {completedSteps[index] ? (
                    <FaCheckCircle className="text-green-400 text-3xl animate-bounce transition-all duration-300" />
                  ) : (
                    <FaTimesCircle className={`text-3xl ${index === step ? 'text-indigo-400 animate-pulse' : 'text-gray-700'} transition-all duration-300`} />
                  )}
                  {index < steps.length - 1 && (
                    <div className={`w-20 h-1 ${completedSteps[index] ? 'bg-green-900' : 'bg-gray-700'}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-100 mb-6 bg-blue-950/60 p-4 rounded-lg shadow-inner tracking-tight border border-blue-900">
                {prompt}
              </div>
        {!started ? (
                <button 
                  onClick={startVerification} 
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-900 text-blue-100 font-semibold rounded-full shadow hover:shadow-lg transition-all duration-300 overflow-hidden border border-blue-900"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <FaCamera className="mr-2" />
                    Start Verification
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
        ) : (
                <button 
                  onClick={stopVerification} 
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-800 via-blue-900 to-indigo-900 text-indigo-100 font-semibold rounded-full shadow hover:shadow-lg transition-all duration-300 overflow-hidden border border-indigo-900"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <FaUserCheck className="mr-2" />
                    Stop Verification
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
        )}
      </div>

            {loading && (
              <div className="text-center">
                <div className="inline-block text-blue-200 animate-pulse bg-blue-950/60 px-6 py-3 rounded-full font-semibold border border-blue-900">
                  <FaHeart className="inline-block mr-2 text-indigo-400" />
                  Analyzing gender...
                </div>
              </div>
            )}

            {error && (
              <div className="text-center">
                <div className="inline-block text-rose-300 bg-rose-950/60 p-4 rounded-lg shadow-sm font-semibold border border-rose-900">
                  {error}
                </div>
              </div>
            )}

      {genderResult && (
              <div className="mt-8 p-8 bg-gradient-to-r from-green-900/80 to-blue-950/80 rounded-xl shadow-md border border-green-900">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300 mb-4 flex items-center justify-center">
                    <FaHeart className="text-indigo-400 mr-2" />
                    Verification Complete!
                  </div>
                  <div className="text-xl mb-2">
                    Detected Gender: <span className="font-bold text-green-200">{genderResult.gender}</span>
                  </div>
                  <div className="text-xl">
                    Confidence: <span className="font-bold text-green-200">{(genderResult.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <audio ref={audioRef} src="/beep.mp3" preload="auto" />
    </div>
  );
};

export default FaceVerification; 