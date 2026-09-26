import { Queue, Worker, type ConnectionOptions } from "bullmq";
import { isRedisEnabled } from "@/server/redis/client";
import { processDownloadJob } from "@/server/workers/process-download";

export const DOWNLOAD_QUEUE_NAME = "unisave-downloads";

function getConnection(): ConnectionOptions | null {
  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;
  return { url, maxRetriesPerRequest: null };
}

let downloadQueue: Queue | null = null;

export function getDownloadQueue(): Queue | null {
  if (!isRedisEnabled()) return null;
  const connection = getConnection();
  if (!connection) return null;

  if (!downloadQueue) {
    downloadQueue = new Queue(DOWNLOAD_QUEUE_NAME, { connection });
  }
  return downloadQueue;
}

export async function enqueueDownloadJob(jobId: string): Promise<boolean> {
  const queue = getDownloadQueue();
  if (!queue) return false;

  await queue.add(
    "process",
    { jobId },
    {
      jobId: `download-${jobId}`,
      removeOnComplete: 100,
      removeOnFail: 200,
      attempts: 2,
      backoff: { type: "exponential", delay: 2000 },
    },
  );
  return true;
}

export function createDownloadWorker(): Worker | null {
  const connection = getConnection();
  if (!connection) return null;

  const worker = new Worker(
    DOWNLOAD_QUEUE_NAME,
    async (job) => {
      const jobId = job.data.jobId as string;
      await processDownloadJob(jobId);
    },
    {
      connection,
      concurrency: Number(process.env.WORKER_CONCURRENCY || "2"),
    },
  );

  worker.on("failed", (job, err) => {
    console.error(`[worker] job ${job?.id} failed:`, err.message);
  });

  return worker;
}
