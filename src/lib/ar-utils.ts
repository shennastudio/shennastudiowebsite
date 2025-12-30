// AR utilities for mobile device detection and capabilities

/**
 * Check if the current device is a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent || navigator.vendor || (window as Window & { opera?: string }).opera || '';

  // Check for mobile user agents
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;

  // Also check for touch capability and screen size
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 1024;

  return mobileRegex.test(userAgent.toLowerCase()) || (isTouchDevice && isSmallScreen);
}

/**
 * Check if the device supports AR
 */
export function supportsAR(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for iOS AR Quick Look support
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Check for Android Scene Viewer support (WebXR)
  const isAndroid = /Android/i.test(navigator.userAgent);

  // Check for WebXR support
  const hasWebXR = 'xr' in navigator;

  return isIOS || (isAndroid && hasWebXR);
}

/**
 * Check if the device is iOS
 */
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Check if the device is Android
 */
export function isAndroidDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

/**
 * Get the appropriate AR model format for the device
 */
export function getARModelFormat(): 'usdz' | 'gltf' | 'glb' {
  if (isIOSDevice()) {
    return 'usdz';
  }
  return 'glb';
}

/**
 * AR model URLs type
 */
export interface ARModelUrls {
  gltf?: string;
  glb?: string;
  usdz?: string;
}

/**
 * Get the best AR model URL for the current device
 */
export function getBestARModelUrl(models: ARModelUrls): string | null {
  if (isIOSDevice() && models.usdz) {
    return models.usdz;
  }
  if (models.glb) {
    return models.glb;
  }
  if (models.gltf) {
    return models.gltf;
  }
  return null;
}

/**
 * AR placement types
 */
export type ARPlacement = 'floor' | 'wall';

/**
 * Default AR settings for bracelets
 */
export const BRACELET_AR_SETTINGS = {
  cameraOrbit: '0deg 75deg 2m',
  minCameraOrbit: 'auto auto 0.5m',
  maxCameraOrbit: 'auto auto 5m',
  fieldOfView: '30deg',
  exposure: 1,
  shadowIntensity: 1,
  shadowSoftness: 1,
  arPlacement: 'floor' as ARPlacement,
  arScale: 'auto' as const,
};

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
