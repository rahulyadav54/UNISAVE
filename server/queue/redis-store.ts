import { randomUUID } from "node:crypto";
import type { DownloadJob, MediaFormat } from "@/types/media";
import { getRedisClient } from "@/server/redis/client";
import type { JobStore, JobStats, PendingDownload } from "./types";

const JOB_TTL_SEC = 30 * 60;
const ANALYZE_TTL_SEC = 15 * 60;

function jobKey(id: string) {
  return `unisave:job:${id}`;
}
function pendingKey(id: string) {
  return `unisave:pending:${id}`;
}
function analyzeKey(hash: string) {
  return `unisave:analyze:${hash}`;
}

async function redis() {
  const client = getRedisClient();
  if (!client) throw new Error("Redis is not configured.");
  if (client.status !== "ready") await client.connect();
  return client;
}

export const redisJobStore: JobStore = {
  async cacheAnalyze(urlHash, result, formats, ttlMs = ANALYZE_TTL_SEC * 1000) {
    const client = await redis();
    const ttlSec = Math.max(1, Math.ceil(ttlMs / 1000));
    await client.set(
      analyzeKey(urlHash),
      JSON.stringify({ result, formats }),
      "EX",
      ttlSec,
    );
  },

  async getCachedAnalyze(urlHash) {
    const client = await redis();
    const raw = await client.get(analyzeKey(urlHash));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { result: unknown; formats: MediaFormat[] };
    } catch {
      return null;
    }
  },

  async createDownloadJob(url, platform, formatId, formats, sourceUrlHash) {
    const client = await redis();
    const id = randomUUID();
    const job: DownloadJob = {
      id,
      status: "queued",
      progress: 0,
      platform,
      formatId,
      sourceUrlHash,
      createdAt: Date.now(),
      expiresAt: Date.now() + JOB_TTL_SEC * 1000,
    };
    const pending: PendingDownload = { url, platform, formatId, formats };
    await client
      .multi()
      .set(jobKey(id), JSON.stringify(job), "EX", JOB_TTL_SEC)
      .set(pendingKey(id), JSON.stringify(pending), "EX", JOB_TTL_SEC)
      .exec();
    return job;
  },

  async getJob(jobId) {
    const client = await redis();
    const raw = await client.get(jobKey(jobId));
    if (!raw) return null;
    const job = JSON.parse(raw) as DownloadJob;
    if (Date.now() > job.expiresAt) {
      job.status = "expired";
    }
    return job;
  },

  async getPendingDownload(jobId) {
    const client = await redis();
    const raw = await client.get(pendingKey(jobId));
    if (!raw) return null;
    return JSON.parse(raw) as PendingDownload;
  },

  async updateJob(jobId, patch) {
    const job = await this.getJob(jobId);
    if (!job) return null;
    Object.assign(job, patch);
    const client = await redis();
    const ttl = await client.ttl(jobKey(jobId));
    const ex = ttl > 0 ? ttl : JOB_TTL_SEC;
    await client.set(jobKey(jobId), JSON.stringify(job), "EX", ex);
    return job;
  },

  async completeJob(jobId, downloadToken, fileName) {
    const job = await this.getJob(jobId);
    if (!job) return null;
    job.status = "completed";
    job.progress = 100;
    job.fileName = fileName;
    job.downloadUrl = `/api/media/serve/${downloadToken}`;
    job.expiresAt = Date.now() + 10 * 60 * 1000;

    const client = await redis();
    await client
      .multi()
      .set(jobKey(jobId), JSON.stringify(job), "EX", 10 * 60)
      .del(pendingKey(jobId))
      .exec();
    return job;
  },

  async failJob(jobId, error) {
    const job = await this.getJob(jobId);
    if (!job) return null;
    job.status = "failed";
    job.error = error;

    const client = await redis();
    await client
      .multi()
      .set(jobKey(jobId), JSON.stringify(job), "EX", JOB_TTL_SEC)
      .del(pendingKey(jobId))
      .exec();
    return job;
  },

  async getJobStats(): Promise<JobStats> {
    const client = await redis();
    const keys = await client.keys("unisave:job:*");
    const stats: JobStats = {
      total: 0,
      queued: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    };

    if (!keys.length) return stats;

    const values = await client.mget(keys);
    for (const raw of values) {
      if (!raw) continue;
      const job = JSON.parse(raw) as DownloadJob;
      stats.total += 1;
      if (job.status === "queued") stats.queued += 1;
      if (job.status === "processing") stats.processing += 1;
      if (job.status === "completed") stats.completed += 1;
      if (job.status === "failed") stats.failed += 1;
    }
    return stats;
  },
};
