/ types/index.ts
export interface DocumentStatus {
  document_loaded: boolean;
  filename?: string;
  processed_at?: string;
  summary_preview?: string;
  document_length?: number;
  message?: string;
}

export interface AskResponse {
  audio_response_base64: string;
  original_query: string;
  response_language: string;
  document_filename: string | null;
}

export interface BackendError {
  detail?: string;
  error?: string;
  status_code?: number;
}

export interface UploadResponse {
  message: string;
  filename: string;
  processed_at: string;
}