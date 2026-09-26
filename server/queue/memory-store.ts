import { randomUUID } from "node:crypto";
import type { DownloadJob, MediaFormat } from "@/types/media";
import type { JobStore, JobStats, PendingDownload } from "./types";

const SIGNED_URL_TTL_MS = 10 * 60 * 1000;
const JOB_TTL_MS = 30 * 60 * 1000;

const jobs = new Map<string, DownloadJob>();
const pending = new Map<string, PendingDownload>();
const analyzeCache = new Map<
  string,
  { result: unknown; formats: MediaFormat[]; expiresAt: number }
>();

export const memoryJobStore: JobStore = {
  async cacheAnalyze(urlHash, result, formats, ttlMs = 15 * 60 * 1000) {
    analyzeCache.set(urlHash, {
      result,
      formats,
      expiresAt: Date.now() + ttlMs,
    });
  },

  async getCachedAnalyze(urlHash) {
    const entry = analyzeCache.get(urlHash);
    if (!entry || Date.now() > entry.expiresAt) {
      analyzeCache.delete(urlHash);
      return null;
    }
    return { result: entry.result, formats: entry.formats };
  },

  async createDownloadJob(url, platform, formatId, formats, sourceUrlHash) {
    const id = randomUUID();
    const job: DownloadJob = {
      id,
      status: "queued",
      progress: 0,
      platform,
      formatId,
      sourceUrlHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + JOB_TTL_MS,
    };
    jobs.set(id, job);
    pending.set(id, { url, platform, formatId, formats });
    return job;
  },

  async getJob(jobId) {
    const job = jobs.get(jobId);
    if (!job) return null;
    if (Date.now() > job.expiresAt) {
      job.status = "expired";
    }
    return job;
  },

  async getPendingDownload(jobId) {
    return pending.get(jobId) ?? null;
  },

  async updateJob(jobId, patch) {
    const job = jobs.get(jobId);
    if (!job) return null;
    Object.assign(job, patch);
    jobs.set(jobId, job);
    return job;
  },

  async completeJob(jobId, downloadToken, fileName) {
    const job = jobs.get(jobId);
    if (!job) return null;
    job.status = "completed";
    job.progress = 100;
    job.fileName = fileName;
    job.downloadUrl = `/api/media/serve/${downloadToken}`;
    job.expiresAt = Date.now() + SIGNED_URL_TTL_MS;
    jobs.set(jobId, job);
    pending.delete(jobId);
    return job;
  },

  async failJob(jobId, error) {
    const job = jobs.get(jobId);
    if (!job) return null;
    job.status = "failed";
    job.error = error;
    jobs.set(jobId, job);
    pending.delete(jobId);
    return job;
  },

  async getJobStats(): Promise<JobStats> {
    const all = [...jobs.values()];
    return {
      total: all.length,
      queued: all.filter((j) => j.status === "queued").length,
      processing: all.filter((j) => j.status === "processing").length,
      completed: all.filter((j) => j.status === "completed").length,
      failed: all.filter((j) => j.status === "failed").length,
    };
  },
};
