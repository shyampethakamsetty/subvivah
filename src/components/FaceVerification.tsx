import React, { useEffect, useRef, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import * as faceapi from '@vladmandic/face-api';

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
  const [step, setStep] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [lighting, setLighting] = useState(255);
  const [prompt, setPrompt] = useState(steps[0]);
  const [genderResult, setGenderResult] = useState<GenderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 1;
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
      console.log('[DEBUG] Step 1 reached (turn head left)');
    } else if (step === 1 && yawVal > YAW_RIGHT_THRESHOLD) {
      setStep(2);
      setPrompt(steps[2]);
      console.log('[DEBUG] Step 2 reached (turn head right)');
    } else if (
      step === 2 &&
      Math.abs(yawVal) < 10 &&
      proximity > PROXIMITY_THRESHOLD &&
      !genderRequestedRef.current &&
      modelsLoadedRef.current
    ) {
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
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults(onResults);
    camera = new Camera(video, {
      onFrame: async () => {
        await faceMesh!.send({ image: video });
      },
      width: 480,
      height: 360,
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">3-Step Face Verification</h1>
      <div className="relative">
        <video ref={videoRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} width={480} height={360} className="border rounded" />
        <div className="absolute top-2 left-2 bg-white bg-opacity-80 px-2 py-1 rounded shadow">
          <div>Yaw: {yaw.toFixed(1)}°</div>
          <div>Lighting: {lighting.toFixed(0)}</div>
        </div>
      </div>
      <div className="mt-4 text-lg font-semibold text-blue-700">{prompt}</div>
      <div className="mt-4">
        {!started ? (
          <button onClick={startVerification} className="px-4 py-2 bg-green-600 text-white rounded">Start Verification</button>
        ) : (
          <button onClick={stopVerification} className="px-4 py-2 bg-red-600 text-white rounded">Stop Verification</button>
        )}
      </div>
      {loading && <div className="mt-2 text-yellow-600">Analyzing gender...</div>}
      {error && <div className="mt-2 text-red-600">{error}</div>}
      {genderResult && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <div>Detected Gender: <b>{genderResult.gender}</b></div>
          <div>Confidence: <b>{(genderResult.confidence * 100).toFixed(1)}%</b></div>
        </div>
      )}
    </div>
  );
};

export default FaceVerification; 