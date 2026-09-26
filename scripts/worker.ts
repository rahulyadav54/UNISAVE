import { createDownloadWorker } from "../server/queue/download-queue";
import { isRedisEnabled } from "../server/redis/client";

if (!isRedisEnabled()) {
  console.error(
    "UNISAVE worker requires REDIS_URL. Without Redis, downloads run inline in the web process.",
  );
  process.exit(1);
}

const worker = createDownloadWorker();
if (!worker) {
  console.error("Failed to start BullMQ worker.");
  process.exit(1);
}

const activeWorker = worker;
console.log("UNISAVE download worker started (BullMQ).");

async function shutdown() {
  console.log("Shutting down worker...");
  await activeWorker.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
