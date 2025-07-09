// utils/api.ts
export const API_BASE_URL = "http://13.235.85.242:8000";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object' && error !== null) {
    if ('detail' in error && typeof error.detail === 'string') {
      return error.detail;
    }
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
  }
  return "An unknown error occurred.";
};

export const createAudioFromBase64 = async (base64Data: string): Promise<string> => {
  try {
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Base64 decode failed:", error);
    throw new Error('Invalid audio data');
  }
};