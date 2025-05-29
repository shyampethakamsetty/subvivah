'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as faceapi from 'face-api.js';
import withAuth from '@/components/withAuth';

interface FaceData {
  age?: number;
  gender?: string;
  expressions?: {
    [key: string]: number;
  };
}

interface DetectionWithAll extends faceapi.WithFaceDetection<{}> {
  landmarks: faceapi.FaceLandmarks;
  age: number;
  gender: string;
  expressions: {
    [key: string]: number;
  };
}

const FaceVerificationPage = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [faceData, setFaceData] = useState<FaceData>({});
  const [error, setError] = useState<string>('');

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsModelLoading(true);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.ageGenderNet.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        setIsModelLoading(false);
      } catch (error) {
        console.error('Error loading models:', error);
        setError('Failed to load face detection models');
        setIsModelLoading(false);
      }
    };

    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Failed to access camera');
    }
  };

  const handleVideoPlay = () => {
    if (videoRef.current && canvasRef.current) {
      // Set video dimensions
      videoRef.current.width = videoRef.current.videoWidth;
      videoRef.current.height = videoRef.current.videoHeight;
      
      // Set canvas dimensions to match video
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      
      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      };
      faceapi.matchDimensions(canvasRef.current, displaySize);
    }
  };

  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

    try {
      // Ensure video has valid dimensions
      if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        console.log('Video dimensions not ready:', {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight
        });
        return;
      }

      console.log('Video dimensions:', {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      });

      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.5
      });

      console.log('Detection options:', options);

      // First detect faces
      const faceDetections = await faceapi.detectAllFaces(
        videoRef.current,
        options
      );

      console.log('Initial face detections:', JSON.stringify(faceDetections, null, 2));

      if (faceDetections.length === 0) {
        console.log('No faces detected');
        setError('No face detected');
        return;
      }

      if (faceDetections.length > 1) {
        console.log('Multiple faces detected:', faceDetections.length);
        setError('Multiple faces detected');
        return;
      }

      // Then get age and gender
      const ageGenderDetections = await faceapi.detectAllFaces(videoRef.current, options)
        .withAgeAndGender();

      console.log('Age and gender detections:', JSON.stringify(ageGenderDetections, null, 2));

      // Get landmarks
      const landmarkDetections = await faceapi.detectAllFaces(videoRef.current, options)
        .withFaceLandmarks();

      console.log('Landmark detections:', JSON.stringify(landmarkDetections, null, 2));

      // Get expressions
      const expressionDetections = await faceapi.detectAllFaces(videoRef.current, options)
        .withFaceExpressions();

      console.log('Expression detections:', JSON.stringify(expressionDetections, null, 2));

      // Create a proper detection object with all required properties
      const combinedDetection: DetectionWithAll = {
        detection: faceDetections[0].detection,
        landmarks: landmarkDetections[0].landmarks,
        age: ageGenderDetections[0].age,
        gender: ageGenderDetections[0].gender,
        expressions: expressionDetections[0].expressions
      };

      console.log('Combined detection object:', JSON.stringify(combinedDetection, null, 2));

      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      };

      console.log('Display size for resizing:', displaySize);

      // Resize the detection results
      const resizedDetections = faceapi.resizeResults(
        [combinedDetection],
        displaySize
      );

      console.log('Resized detections:', JSON.stringify(resizedDetections, null, 2));

      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Draw detections
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        const detection = resizedDetections[0];
        const faceData = {
          age: Math.round(detection.age),
          gender: detection.gender,
          expressions: detection.expressions
        };
        console.log('Setting face data:', faceData);
        setFaceData(faceData);
      }
    } catch (error: any) {
      console.error('Error detecting faces:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setError('Error detecting faces');
    }
  };

  useEffect(() => {
    if (isCameraActive && !isVerifying) {
      const interval = setInterval(detectFaces, 100);
      return () => clearInterval(interval);
    }
  }, [isCameraActive, isVerifying]);

  const startVerification = () => {
    setIsVerifying(true);
    // Play verification sound
    const audio = new Audio('/verification-start.mp3');
    audio.play().catch(console.error);
  };

  const proceedToInterview = () => {
    router.push('/brahmand-chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center text-purple-600 mb-6">Face Verification</h1>
      
      {isModelLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading face detection models...</p>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onPlay={handleVideoPlay}
              className="w-full"
              style={{ display: isCameraActive ? 'block' : 'none' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0"
              style={{ display: isCameraActive ? 'block' : 'none' }}
            />
            {!isCameraActive && (
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <p className="text-white">Camera inactive</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Camera
              </button>
            ) : !isVerifying ? (
              <button
                onClick={startVerification}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Verification
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Verification Results</h3>
                  <div className="space-y-2">
                    <p>Age: {faceData.age} years</p>
                    <p>Gender: {faceData.gender}</p>
                    {faceData.expressions && (
                      <p>Expression: {Object.entries(faceData.expressions)
                        .sort(([,a], [,b]) => (b as number) - (a as number))[0][0]}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={proceedToInterview}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Proceed to AI Interview
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(FaceVerificationPage); 