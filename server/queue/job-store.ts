import { isRedisEnabled } from "@/server/redis/client";
import { memoryJobStore } from "./memory-store";
import { redisJobStore } from "./redis-store";
import type { JobStore } from "./types";

function getStore(): JobStore {
  return isRedisEnabled() ? redisJobStore : memoryJobStore;
}

export const cacheAnalyze = (...args: Parameters<JobStore["cacheAnalyze"]>) =>
  getStore().cacheAnalyze(...args);

export const getCachedAnalyze = (...args: Parameters<JobStore["getCachedAnalyze"]>) =>
  getStore().getCachedAnalyze(...args);

export const createDownloadJob = (...args: Parameters<JobStore["createDownloadJob"]>) =>
  getStore().createDownloadJob(...args);

export const getJob = (...args: Parameters<JobStore["getJob"]>) =>
  getStore().getJob(...args);

export const getPendingDownload = (...args: Parameters<JobStore["getPendingDownload"]>) =>
  getStore().getPendingDownload(...args);

export const updateJob = (...args: Parameters<JobStore["updateJob"]>) =>
  getStore().updateJob(...args);

export const completeJob = (...args: Parameters<JobStore["completeJob"]>) =>
  getStore().completeJob(...args);

export const failJob = (...args: Parameters<JobStore["failJob"]>) =>
  getStore().failJob(...args);

export const getJobStats = (...args: Parameters<JobStore["getJobStats"]>) =>
  getStore().getJobStats(...args);
