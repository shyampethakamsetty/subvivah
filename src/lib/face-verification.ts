import { Keypoint } from '@tensorflow-models/face-landmarks-detection';

interface FaceVerificationState {
  isLeftTurnComplete: boolean;
  isRightTurnComplete: boolean;
  isCentered: boolean;
  isCloseEnough: boolean;
}

export const calculateHeadPose = (keypoints: Keypoint[]) => {
  // Get relevant keypoints for head pose estimation
  const nose = keypoints[1]; // Nose tip
  const leftEye = keypoints[33]; // Left eye
  const rightEye = keypoints[263]; // Right eye
  const leftMouth = keypoints[61]; // Left mouth corner
  const rightMouth = keypoints[291]; // Right mouth corner

  // Calculate yaw (left/right rotation)
  const eyeDistance = Math.sqrt(
    Math.pow(leftEye.x - rightEye.x, 2) + 
    Math.pow(leftEye.y - rightEye.y, 2)
  );
  
  const yaw = Math.atan2(
    (leftEye.x - rightEye.x) / eyeDistance,
    (leftEye.y - rightEye.y) / eyeDistance
  ) * (180 / Math.PI);

  // Calculate pitch (up/down rotation)
  const mouthDistance = Math.sqrt(
    Math.pow(leftMouth.x - rightMouth.x, 2) + 
    Math.pow(leftMouth.y - rightMouth.y, 2)
  );
  
  const pitch = Math.atan2(
    (nose.y - (leftEye.y + rightEye.y) / 2) / eyeDistance,
    (nose.x - (leftEye.x + rightEye.x) / 2) / eyeDistance
  ) * (180 / Math.PI);

  return { yaw, pitch };
};

export const checkFaceProximity = (keypoints: Keypoint[], canvasWidth: number): boolean => {
  const leftEye = keypoints[33];
  const rightEye = keypoints[263];
  
  // Calculate distance between eyes
  const eyeDistance = Math.sqrt(
    Math.pow(leftEye.x - rightEye.x, 2) + 
    Math.pow(leftEye.y - rightEye.y, 2)
  );

  // If eye distance is more than 20% of canvas width, face is close enough
  return eyeDistance > (canvasWidth * 0.2);
};

export const checkFaceCentered = (keypoints: Keypoint[], canvasWidth: number, canvasHeight: number): boolean => {
  const nose = keypoints[1];
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Check if nose is within 20% of center
  const xOffset = Math.abs(nose.x - centerX) / canvasWidth;
  const yOffset = Math.abs(nose.y - centerY) / canvasHeight;

  return xOffset < 0.2 && yOffset < 0.2;
};

export const updateVerificationState = (
  keypoints: Keypoint[],
  canvasWidth: number,
  canvasHeight: number,
  currentState: FaceVerificationState
): FaceVerificationState => {
  const { yaw, pitch } = calculateHeadPose(keypoints);
  const isCloseEnough = checkFaceProximity(keypoints, canvasWidth);
  const isCentered = checkFaceCentered(keypoints, canvasWidth, canvasHeight);

  return {
    ...currentState,
    isLeftTurnComplete: currentState.isLeftTurnComplete || yaw < -30,
    isRightTurnComplete: currentState.isRightTurnComplete || yaw > 30,
    isCentered: isCentered,
    isCloseEnough: isCloseEnough
  };
};

export const getNextVerificationStep = (state: FaceVerificationState): 'idle' | 'left' | 'right' | 'center' | 'analyzing' | 'complete' => {
  if (!state.isLeftTurnComplete) return 'left';
  if (!state.isRightTurnComplete) return 'right';
  if (!state.isCentered || !state.isCloseEnough) return 'center';
  if (state.isLeftTurnComplete && state.isRightTurnComplete && state.isCentered && state.isCloseEnough) {
    return 'analyzing';
  }
  return 'idle';
}; 