declare module 'face-api.js' {
  export interface TinyFaceDetectorOptions {
    inputSize?: number;
    scoreThreshold?: number;
  }

  export interface FaceDetection {
    box: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    score: number;
  }

  export interface FaceLandmarks {
    positions: Array<{ x: number; y: number }>;
  }

  export interface WithFaceDetection<T> {
    detection: FaceDetection;
  }

  export interface WithFaceLandmarks<T> {
    landmarks: FaceLandmarks;
  }

  export interface WithFaceExpressions<T> {
    expressions: {
      [key: string]: number;
    };
  }

  export interface WithAgeAndGender<T> {
    age: number;
    gender: string;
  }

  export class TinyFaceDetector {
    constructor(options?: TinyFaceDetectorOptions);
  }

  export class TinyFaceDetectorOptions {
    constructor(options?: TinyFaceDetectorOptions);
  }

  export class FaceLandmark68Net {
    static loadFromUri(uri: string): Promise<void>;
  }

  export class AgeGenderNet {
    static loadFromUri(uri: string): Promise<void>;
  }

  export class FaceExpressionNet {
    static loadFromUri(uri: string): Promise<void>;
  }

  export class TinyFaceDetectorNet {
    static loadFromUri(uri: string): Promise<void>;
  }

  export namespace nets {
    const tinyFaceDetector: {
      loadFromUri(uri: string): Promise<void>;
    };
    const ageGenderNet: {
      loadFromUri(uri: string): Promise<void>;
    };
    const faceLandmark68Net: {
      loadFromUri(uri: string): Promise<void>;
    };
    const faceExpressionNet: {
      loadFromUri(uri: string): Promise<void>;
    };
  }

  export namespace draw {
    function drawDetections(
      canvas: HTMLCanvasElement,
      detections: Array<WithFaceDetection<{}>>
    ): void;
    function drawFaceLandmarks(
      canvas: HTMLCanvasElement,
      detections: Array<WithFaceLandmarks<{}>>
    ): void;
  }

  export function detectAllFaces(
    input: HTMLVideoElement | HTMLImageElement,
    options?: TinyFaceDetectorOptions
  ): Promise<Array<WithFaceDetection<{}>>> & {
    withAgeAndGender(): Promise<Array<WithAgeAndGender<{}>>>;
    withFaceLandmarks(): Promise<Array<WithFaceLandmarks<{}>>>;
    withFaceExpressions(): Promise<Array<WithFaceExpressions<{}>>>;
  };

  export function resizeResults<T>(
    detections: T[],
    dimensions: { width: number; height: number }
  ): T[];

  export function matchDimensions(
    canvas: HTMLCanvasElement,
    dimensions: { width: number; height: number }
  ): void;
} 