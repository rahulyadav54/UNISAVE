export type MediaJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "expired";

export type MediaFormatType = "video" | "audio" | "image";

export interface MediaFormat {
  id: string;
  type: MediaFormatType;
  format: string;
  quality?: string;
  resolution?: string;
  fileSize?: number;
  fps?: number;
  hasWatermark?: boolean;
  label?: string;
  available: boolean;
  ytdlpFormatId?: string;
}

export interface MediaInfo {
  title?: string;
  thumbnail?: string;
  platform: string;
  creator?: string;
  duration?: number;
  mediaType?: string;
  description?: string;
  isPublic?: boolean;
  watermarkNote?: string;
}

export interface AnalyzeResult {
  success: boolean;
  platform: string;
  media: MediaInfo;
  formats: MediaFormat[];
  error?: string;
  errorCode?: string;
}

export interface DownloadJob {
  id: string;
  status: MediaJobStatus;
  progress: number;
  platform: string;
  formatId: string;
  sourceUrlHash: string;
  downloadUrl?: string;
  fileName?: string;
  error?: string;
  createdAt: number;
  expiresAt: number;
}
