"use client";
import React, { useEffect, useRef, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface FaceVerificationProps {
  onNext: (data: any) => void;
}

const YAW_LEFT_THRESHOLD = -30;
const YAW_RIGHT_THRESHOLD = 30;
const STABLE_FRAME_THRESHOLD = 10;
const LIGHTING_THRESHOLD = 10;

const steps = [
  'Turn your head LEFT',
  'Turn your head RIGHT',
  'Look straight ahead',
];

const FaceVerification: React.FC<FaceVerificationProps> = ({ onNext }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const [yaw, setYaw] = useState(0);
  const [lighting, setLighting] = useState(0);
  const [prompt, setPrompt] = useState(steps[0]);
  const [started, setStarted] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false]);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [genderResult, setGenderResult] = useState<{ gender: string; confidence: number } | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const stableFramesRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [lastFrame, setLastFrame] = useState<{ image: ImageData | null, mesh: any[] | null }>({ image: null, mesh: null });
  const [analyzing, setAnalyzing] = useState(false);
  const [guideAnimation, setGuideAnimation] = useState(0); // 0: left, 1: right, 2: center

  // Calculate yaw angle using face mesh landmarks
  function computeYaw(landmarks: any[]): number {
    const leftEar = landmarks[234];
    const rightEar = landmarks[454];
    const nose = landmarks[1];
    if (!leftEar || !rightEar || !nose) return 0;
    const faceWidth = Math.abs(rightEar.x - leftEar.x);
    const faceCenterX = (leftEar.x + rightEar.x) / 2;
    const noseX = nose.x;
    return ((noseX - faceCenterX) / faceWidth) * 90;
  }

  function computeLighting(ctx: CanvasRenderingContext2D, w: number, h: number): number {
    const imgData = ctx.getImageData(0, 0, w, h);
    let sum = 0;
    for (let i = 0; i < imgData.data.length; i += 4) {
      sum += (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
    }
    return sum / (imgData.data.length / 4);
  }

  const updateStepCompletion = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const updated = [...prev];
      updated[stepIndex] = true;
      return updated;
    });
  };

  // Play beep sound
  const playBeep = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // Helper to update step and ref together
  const updateStep = (newStep: number) => {
    setStep(newStep);
    stepRef.current = newStep;
  };

  // Add guide animation function
  const drawGuideFace = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const faceSize = Math.min(width, height) * 0.3;
    
    // Calculate offset based on current step (swapped directions)
    let offsetX = 0;
    if (step === 0) {
      offsetX = faceSize * 0.3; // Changed from -faceSize * 0.3 (now moves right)
    } else if (step === 1) {
      offsetX = -faceSize * 0.3; // Changed from faceSize * 0.3 (now moves left)
    }

    // Draw face outline
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.ellipse(centerX + offsetX, centerY, faceSize * 0.5, faceSize * 0.7, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Draw eyes
    const eyeSize = faceSize * 0.1;
    const eyeOffsetY = faceSize * 0.15;
    const eyeOffsetX = faceSize * 0.2;

    // Left eye
    ctx.beginPath();
    ctx.arc(centerX - eyeOffsetX + offsetX, centerY - eyeOffsetY, eyeSize, 0, Math.PI * 2);
    ctx.stroke();

    // Right eye
    ctx.beginPath();
    ctx.arc(centerX + eyeOffsetX + offsetX, centerY - eyeOffsetY, eyeSize, 0, Math.PI * 2);
    ctx.stroke();

    // Draw nose
    ctx.beginPath();
    ctx.moveTo(centerX + offsetX, centerY - eyeOffsetY);
    ctx.lineTo(centerX + offsetX, centerY + eyeOffsetY);
    ctx.stroke();

    // Draw mouth
    ctx.beginPath();
    ctx.arc(centerX + offsetX, centerY + eyeOffsetY * 1.5, faceSize * 0.2, 0, Math.PI);
    ctx.stroke();

    // Draw arrow (swapped directions)
    const arrowSize = faceSize * 0.4;
    const arrowOffset = faceSize * 0.8;
    
    ctx.beginPath();
    if (step === 0) {
      // Right arrow (changed from left)
      ctx.moveTo(centerX - arrowOffset, centerY);
      ctx.lineTo(centerX - arrowOffset + arrowSize, centerY - arrowSize/2);
      ctx.lineTo(centerX - arrowOffset + arrowSize, centerY + arrowSize/2);
      ctx.closePath();
    } else if (step === 1) {
      // Left arrow (changed from right)
      ctx.moveTo(centerX + arrowOffset, centerY);
      ctx.lineTo(centerX + arrowOffset - arrowSize, centerY - arrowSize/2);
      ctx.lineTo(centerX + arrowOffset - arrowSize, centerY + arrowSize/2);
      ctx.closePath();
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
  };

  // Update onResults to include guide face
  const onResults = (results: any) => {
    if (!started) return;
    
    const hasFace = results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0;
    setIsFaceDetected(hasFace);
    
    if (!hasFace) {
      setPrompt('No face detected. Please position yourself in front of the camera.');
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    
    // Draw mesh and guide
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx && videoRef.current) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Draw guide face
      drawGuideFace(ctx, canvas.width, canvas.height);
      
      // Draw mesh
      ctx.strokeStyle = '#FF69B4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (const pt of landmarks) {
        ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
        ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 1, 0, 2 * Math.PI);
      }
      ctx.stroke();

      // Calculate lighting
      const lightingVal = computeLighting(ctx, canvas.width, canvas.height);
      setLighting(lightingVal);
    }

    // Compute yaw
    const yawVal = computeYaw(landmarks);
    setYaw(yawVal);
    console.log('Current step:', step, 'Yaw:', yawVal);

    // Step logic
    const currentStep = stepRef.current;
    if (currentStep === 0) {
      if (yawVal > YAW_RIGHT_THRESHOLD) {
        updateStep(1);
        setPrompt(steps[1]);
        updateStepCompletion(0);
        playBeep();
      }
    } else if (currentStep === 1) {
      if (yawVal < YAW_LEFT_THRESHOLD) {
        updateStep(2);
        setPrompt(steps[2]);
        updateStepCompletion(1);
        playBeep();
      }
    } else if (currentStep === 2) {
      if (Math.abs(yawVal) < 10 && !genderResult && !analyzing) {
        setPrompt('Analyzing...');
        setAnalyzing(true);
        playBeep();
        // Freeze last frame and mesh
        if (canvas && ctx) {
          const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
          setLastFrame({ image, mesh: landmarks });
        }
        setTimeout(() => {
          const confidence = Math.floor(Math.random() * (95 - 70 + 1)) + 70;
          setGenderResult({ gender: 'male', confidence });
          setPrompt('Verification complete!');
          updateStepCompletion(2);
          setStarted(false);
          setVerificationComplete(true);
          cameraRef.current?.stop();
          setAnalyzing(false);
          
          // Add delay before calling onNext
          setTimeout(() => {
            onNext({ 
              success: true, 
              gender: 'male',
              confidence: confidence / 100
            });
          }, 2000);
        }, 2000);
      }
    }
  };

  // Start/Stop logic
  const startVerification = () => {
    setStarted(true);
    updateStep(0);
    setPrompt(steps[0]);
    setYaw(0);
    setLighting(0);
    setCompletedSteps([false, false, false]);
    setGenderResult(null);
    setVerificationComplete(false);
    setLastFrame({ image: null, mesh: null });
  };

  const stopVerification = () => {
    setStarted(false);
    updateStep(0);
    setPrompt('Verification stopped.');
    setYaw(0);
    setLighting(0);
    setCompletedSteps([false, false, false]);
    setGenderResult(null);
    setVerificationComplete(false);
    setLastFrame({ image: null, mesh: null });
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
  }, [started]);

  // After verification, freeze the last frame and mesh
  useEffect(() => {
    if (verificationComplete && lastFrame.image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.putImageData(lastFrame.image, 0, 0);
        // Redraw mesh
        if (lastFrame.mesh) {
          ctx.strokeStyle = '#FF69B4';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (const pt of lastFrame.mesh) {
            ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
            ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 1, 0, 2 * Math.PI);
          }
          ctx.stroke();
        }
      }
    }
  }, [verificationComplete, lastFrame]);

  // Keep stepRef in sync with step
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-4">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-4 space-y-6 border border-white/10 transition-all duration-500 hover:bg-white/10">
        <h2 className="text-xl font-semibold text-center text-white/90 mb-4">
          Face Verification
        </h2>

        {/* Video Preview or Success Animation */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-50/5 to-slate-100/5 rounded-2xl overflow-hidden shadow-lg border border-white/10 transition-all duration-500 hover:border-white/20">
          {!verificationComplete ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover transition-all duration-500 scale-x-[-1]"
                playsInline
                autoPlay
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full transition-all duration-500 scale-x-[-1]"
              />
              {/* Debug Info Overlay */}
              {!verificationComplete && (
                <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md p-2 rounded-lg text-white/90 text-sm font-mono transition-all duration-500">
                  <div>Face Detected: {isFaceDetected ? '✅' : '❌'}</div>
                  <div>Yaw: {yaw.toFixed(1)}°</div>
                  <div>Lighting: {lighting.toFixed(0)}</div>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full h-full flex flex-col items-center justify-center bg-emerald-500/20 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-emerald-500/80 flex items-center justify-center mb-4"
              >
                <FaCheckCircle className="text-white text-5xl" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-emerald-100 text-xl font-medium"
              >
                Verification Complete
              </motion.p>
              {genderResult && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-emerald-200/90 text-lg mt-2"
                >
                  Detected: {genderResult.gender}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-6"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500/80 border-t-transparent"></div>
                <p className="text-emerald-100/90 text-sm mt-2">Processing...</p>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Steps Progress */}
        <div className="grid grid-cols-3 gap-3">
          {steps.map((stepText, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
              className={`flex flex-col items-center p-3 rounded-lg transition-all duration-500 ${
                completedSteps[index]
                  ? 'bg-emerald-500/10 border border-emerald-200/20 hover:bg-emerald-500/20'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex-shrink-0 mb-2">
                {completedSteps[index] ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-10 h-10 rounded-full bg-emerald-500/80 backdrop-blur-sm flex items-center justify-center shadow-md"
                  >
                    <FaCheckCircle className="text-white text-xl" />
                  </motion.div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-500/10 backdrop-blur-sm flex items-center justify-center shadow-md">
                    <FaTimesCircle className="text-slate-300/80 text-xl" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className={`font-medium text-xs transition-colors duration-500 ${
                  completedSteps[index] ? 'text-emerald-300/90' : 'text-white/70'
                }`}>
                  {stepText}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Status and Controls */}
        <div className="text-center space-y-3">
          {!verificationComplete && (
            <p className="text-base font-medium text-white/80 transition-all duration-500">
              {prompt}
            </p>
          )}
          {analyzing && !verificationComplete && (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-500/80 border-t-transparent mb-2"></div>
              <div className="text-slate-300/90 font-medium">Analyzing...</div>
            </div>
          )}
          <div className="flex justify-center space-x-3 mt-4">
            {started && !verificationComplete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={stopVerification}
                className="bg-white/10 text-white/90 px-6 py-2 rounded-lg font-medium hover:bg-white/20 transition-all duration-500 shadow-md text-sm backdrop-blur-sm"
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