import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Height conversion utilities
export function convertHeightToStandardFormat(height: string): number {
  // If height is in feet and inches format (e.g., "5'7" or "5'7\"")
  if (height.includes("'")) {
    const parts = height.replace('"', '').split("'");
    const feet = parseInt(parts[0]);
    const inches = parts[1] ? parseInt(parts[1]) : 0;
    return Math.round((feet * 30.48) + (inches * 2.54)); // Convert to cm
  }
  
  // If height is already in cm (e.g., "170")
  if (!isNaN(parseInt(height))) {
    return parseInt(height);
  }
  
  return 0; // Return 0 for invalid formats
}

export function convertCmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export function heightToDisplayFormat(height: string | null): string {
  if (!height) return '';
  
  const cm = convertHeightToStandardFormat(height);
  return `${convertCmToFeetInches(cm)} (${cm} cm)`;
} 