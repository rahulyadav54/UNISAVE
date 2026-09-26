import { NextRequest, NextResponse } from "next/server";
import { getJobStats } from "@/server/queue/job-store";
import { cleanupExpiredFiles } from "@/server/storage/temp-storage";
import { getAllAdapters } from "@/server/platforms/registry";
import { getQueueMode, pingRedis } from "@/server/redis/client";
import { getDownloadQueue } from "@/server/queue/download-queue";

export async function GET(request: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (adminKey) {
    const provided = request.headers.get("x-admin-key");
    if (provided !== adminKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const removed = await cleanupExpiredFiles();
  const jobs = await getJobStats();
  const queue = getDownloadQueue();
  let waiting = 0;
  let active = 0;
  if (queue) {
    const counts = await queue.getJobCounts("waiting", "active", "completed", "failed");
    waiting = counts.waiting ?? 0;
    active = counts.active ?? 0;
  }

  return NextResponse.json({
    jobs,
    queue: {
      mode: getQueueMode(),
      redisConnected: await pingRedis(),
      bullmq: queue
        ? { waiting, active }
        : null,
    },
    storage: { expiredFilesRemoved: removed },
    platforms: getAllAdapters().map((a) => ({
      id: a.id,
      name: a.name,
      status: "active",
    })),
    timestamp: new Date().toISOString(),
  });
}
