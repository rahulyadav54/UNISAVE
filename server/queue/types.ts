import type { DownloadJob, MediaFormat } from "@/types/media";

export interface PendingDownload {
  url: string;
  platform: string;
  formatId: string;
  formats: MediaFormat[];
}

export interface JobStats {
  total: number;
  queued: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface JobStore {
  cacheAnalyze(
    urlHash: string,
    result: unknown,
    formats: MediaFormat[],
    ttlMs?: number,
  ): Promise<void>;
  getCachedAnalyze(urlHash: string): Promise<{
    result: unknown;
    formats: MediaFormat[];
  } | null>;
  createDownloadJob(
    url: string,
    platform: string,
    formatId: string,
    formats: MediaFormat[],
    sourceUrlHash: string,
  ): Promise<DownloadJob>;
  getJob(jobId: string): Promise<DownloadJob | null>;
  getPendingDownload(jobId: string): Promise<PendingDownload | null>;
  updateJob(
    jobId: string,
    patch: Partial<DownloadJob>,
  ): Promise<DownloadJob | null>;
  completeJob(
    jobId: string,
    downloadToken: string,
    fileName: string,
  ): Promise<DownloadJob | null>;
  failJob(jobId: string, error: string): Promise<DownloadJob | null>;
  getJobStats(): Promise<JobStats>;
}
